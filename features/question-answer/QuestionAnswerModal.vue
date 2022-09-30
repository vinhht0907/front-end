<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    :title="isEdit ? 'Sửa câu hỏi' : 'Thêm câu hỏi'"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-editor-with-validation
        :required="true"
        v-model="form.title"
        :editorToolbar="editorToolbar"
        :single-row="true"
        label="Nội dung câu hỏi"
        placeholder="Nội dung câu hỏi"
        name="question"
        rules="required"
      />
      <script-attachment
        v-model="form.attachment"
        :list-display="['none', 'image', 'audio', 'video']"
        :image-reading="false"
        label="Tập tin đính kèm"
      />
      <b-editor-with-validation
        :required="true"
        v-model="form.answer"
        :editorToolbar="editorToolbar"
        :single-row="true"
        label="Đáp án"
        placeholder="Đáp án"
        name="answer"
        rules="required"
      />
      <b-single-audio-upload-with-validation
        v-model="form.audio"
        label="Audio đi kèm đáp án"
        placeholder="File Audio"
        class="col-3"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'

const defaultForm = {
  title: '',
  attachment: '',
  answer: '',
  audio: ''
}
export default {
  name: 'QuestionAnswerModal',
  components: {
    BEditorWithValidation,
    BSingleAudioUploadWithValidation,
    ScriptAttachment,
    ValidationObserver
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      editorToolbar: [['bold', 'italic', 'underline']],
      question: null
    }
  },
  methods: {
    ...mapMutations({
      setCurrentQuestion: 'question/setCurrentQuestion',
      setCurrentIndexQuestion: 'indexQuestion/setCurrentIndexQuestion'
    }),
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
      }
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
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
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.vForm = new Form()
      this.isEdit = false
      this.setCurrentIndexQuestion(null)
    },
    addItem() {
      try {
        notifyAddSuccess('Câu hỏi')
        this.$refs.modal.hide()
        this.question = Object.freeze(this.form)
        this.setCurrentQuestion(this.question)
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
    updateItem() {
      try {
        notifyUpdateSuccess('Câu hỏi')
        this.$refs.modal.hide()
        this.question = Object.freeze(this.form)
        this.setCurrentQuestion(this.question)
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
