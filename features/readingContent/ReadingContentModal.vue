<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa nội dung bài đọc' : 'Thêm bài đọc'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.title"
        :required="true"
        :error="vForm.errors.get('title')"
        label="Tiêu đề"
        placeholder="Tiêu đề"
        rules="required|max:500"
        name="name"
      />

      <b-editor-with-validation
        :required="true"
        v-model="form.content"
        :error="vForm.errors.get('content')"
        @blur="handleBlur"
        label="Nội dung"
        placeholder="Nội dung"
        rules="required"
        name="content"
      />

      <b-editor-with-validation
        :disabled="true"
        v-model="displayHTML"
        :error="vForm.errors.get('display')"
        label="Nội dung hiển thị"
        name="display"
      />

      <b-single-image-upload-with-validation
        v-model="form.image"
        :error="vForm.errors.get('image')"
        :required="true"
        class="col-6"
        rules="required"
        label="Ảnh bài đọc"
        placeholder="Ảnh bài đọc"
      />

      <reading-content-management
        ref="conversationManagement"
        v-model="form.sentences"
        :content="form.content"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import ReadingContentManagement from '~/components/elements/readingContent/ReadingContentManagement'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'

const defaultForm = {
  title: '',
  content: '',
  image: '',
  sentences: []
}

export default {
  name: 'ReadingContentModal',
  components: {
    BEditorWithValidation,
    BSingleImageUploadWithValidation,
    ValidationObserver,
    ReadingContentManagement,
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
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      displayHTML: ''
    }
  },
  watch: {
    'form.sentences': {
      handler() {
        this.displayHTML = this.concatHtml()
      },
      deep: true
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        this.displayHTML = this.concatHtml()
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
      this.displayHTML = ''
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
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/reading-content/add'
        )

        notifyAddSuccess('bài đọc')
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
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/reading-content/edit'
        )

        notifyUpdateSuccess('bài đọc')
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
    handleBlur() {
      this.$refs.conversationManagement.changeContent()
    },
    concatHtml() {
      let html = ''
      let htmlinner = '<p>'
      this.form.sentences.forEach((e) => {
        let content = e.content
        content = content.replace(/^<p>/i, '')
        content = content.replace(/<\/p>$/i, '')
        content = content.replaceAll(/\n/gi, '<br>')
        if (e.isEndParagraph) {
          htmlinner += content + '</p>'
          html += htmlinner
          htmlinner = '<p>'
        } else {
          htmlinner += content
        }
      })
      return html
    }
  }
}
</script>
