<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Cập nhật câu hỏi trợ giúp' : 'Thêm mới'"
    size="xl"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.title"
        :required="true"
        :error="vForm.errors.get('title')"
        label="Tiêu đề"
        placeholder="Tiêu đề"
        rules="required|max:100"
        name="title"
        data-vv-as="Tiêu đề"
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
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import {
  notifyTryAgain,
  notify,
  notifyAddSuccess
} from '~/utils/bootstrap-notify'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import { i18n } from '~/plugins/i18n'

const defaultForm = {
  content: '',
  title: null
}

export default {
  name: 'HelpModal',
  components: {
    BEditorWithValidation,
    ValidationObserver,
    BTextInputWithValidation
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      isEdit: false,
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
      this.vForm = new Form()
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
    async updateItem() {
      try {
        const formData = cloneDeep(this.form)
        this.vForm = new Form(formData)
        await this.vForm.post(this.$axios.defaults.baseURL + '/help/edit')

        notify(
          i18n.t('alert.notice'),
          'Cập nhật câu hỏi trợ giúp thành công',
          'success'
        )
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    async addItem() {
      try {
        const formData = cloneDeep(this.form)
        this.vForm = new Form(formData)
        await this.vForm.post(this.$axios.defaults.baseURL + '/help/add')

        notifyAddSuccess('câu hỏi trợ giúp')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
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
