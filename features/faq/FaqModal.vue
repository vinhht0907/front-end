<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Cập nhật FAQ' : 'Thêm mới'"
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

      <select2-with-validation
        :required="true"
        v-model="form.type_object"
        :options="typeOptions"
        text-field="text"
        id-field="id"
        placeholder="Chọn đối tượng..."
        label="Đối tượng"
        data-vv-as="Đối tượng"
        rules="required"
        name="type"
      />

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

      <b-text-input-with-validation
        v-if="isEdit"
        v-model="form.order"
        :required="true"
        :label="'Thứ tự sắp xếp'"
        :placeholder="'Nhập thứ tự sắp xếp'"
        :error="vForm.errors.get('order')"
        rules="required|numeric"
        name="order"
      />
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
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

const defaultForm = {
  title: '',
  type: '',
  order: 1,
  content: '',
  type_object: null
}

export default {
  name: 'FaqModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    BEditorWithValidation,
    Select2WithValidation
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
      ],
      typeOptions: [
        {
          id: 'for_author',
          text: 'Tác giả'
        },
        {
          id: 'for_reader',
          text: 'Đọc giả'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        this.form.type_object =
          this.form.type === 'for_author'
            ? {
                id: 'for_author',
                text: 'Tác giả'
              }
            : {
                id: 'for_reader',
                text: 'Đọc giả'
              }
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
        this.form.type = this.form.type_object.id
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/faq/add')

        notifyAddSuccess('FAQ')
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
        this.form.type = this.form.type_object.id
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/faq/' + this.form._id
        )
        notifyUpdateSuccess('FAQ')
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
