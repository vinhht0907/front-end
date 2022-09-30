<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Cập nhật page' : 'Thêm mới'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.title"
        :required="true"
        :label="'Tiêu đề'"
        :placeholder="'Tiêu đề'"
        :error="vForm.errors.get('title')"
        rules="required|max:200"
        name="title"
      />

      <b-text-input-with-validation
        v-model="form.slug"
        :required="true"
        :label="'Đường dẫn'"
        :placeholder="'Nhập đường dẫn'"
        :error="vForm.errors.get('slug')"
        :disabled="true"
        rules="required"
        name="slug"
      />

      <e-text-area-with-validation
        v-model="form.description"
        :required="false"
        :show-word-limit="true"
        :error="vForm.errors.get('description')"
        :label="'Mô tả'"
        placeholder="Nhập mô tả"
        maxlength="255"
        rules="max:255"
        name="description"
      >
      </e-text-area-with-validation>

      <b-editor-with-validation
        v-model="form.content"
        :required="true"
        :error="vForm.errors.get('content')"
        :editorToolbar="editorToolbar"
        label="Nội dung"
        placeholder="Nội dung"
        rules="required"
        name="content"
      />

      <e-text-area-with-validation
        v-model="form.seo"
        :required="false"
        :show-word-limit="true"
        :error="vForm.errors.get('seo')"
        :label="'SEO - từ khóa'"
        placeholder="Nhập từ khóa"
        maxlength="255"
        rules="max:255"
        name="seo"
      >
      </e-text-area-with-validation>
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import { HTTP_CODE_422 } from '~/constants/httpCode'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ETextAreaWithValidation from '~/components/base/input/ETextAreaWithValidation'
import { convertVietnameseToEnglish } from '~/utils/handleVietnameseToEnglish'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'

const defaultForm = {
  title: '',
  seo: '',
  slug: null,
  description: '',
  content: ''
}

export default {
  name: 'PageModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    ETextAreaWithValidation,
    BEditorWithValidation
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      editorToolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' }
        ],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['image', 'video']
      ]
    }
  },
  watch: {
    'form.title'(val) {
      if (val) {
        this.form.slug = convertVietnameseToEnglish(cloneDeep(val))
          .replace(/[^a-zA-Z [0-9]]/g, '')
          .replace(/ /g, '-')
          .toLowerCase()
      }
    }
  },
  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
      }

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.isEdit = false
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        if (this.isEdit) {
          await this.updateItem()
        } else {
          await this.addItem()
        }
      }
    },
    async addItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/page/add')

        notifyAddSuccess('page')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (status !== HTTP_CODE_422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/page/' + this.form._id
        )
        notifyUpdateSuccess('page')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (status !== HTTP_CODE_422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    }
  }
}
</script>
