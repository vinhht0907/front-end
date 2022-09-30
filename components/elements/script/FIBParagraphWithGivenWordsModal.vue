<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Fill in blank paragraph with given words"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
          <script-attachment
            v-model="form.attachment"
            :list-display="['none', 'image', 'audio', 'video']"
            label="Tập tin đính kèm"
          />
          <b-text-area-with-validation
            v-model="form.question"
            :required="true"
            label="Câu hỏi - Câu trả lời sẽ có dạng [câu trả lời]{điểm số}"
            placeholder="My name [is]{2} Hang. What [is] your name?"
            rules="required"
            name="question"
            rows="6"
          />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <answer-question-writing-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import AnswerQuestionWritingPreview from '~/components/elements/script/preview/AnswerQuestionWritingPreview'

const defaultForm = {
  attachment: null
}
export default {
  name: 'FIBParagraphWithGivenWordsModal',
  components: {
    BTextAreaWithValidation,
    AnswerQuestionWritingPreview,
    ScriptAttachment,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm)
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      if (!this.form.attachment) {
        this.form.attachment = {
          type: 'none'
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
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$emit('updateScript', this.form)
        this.$refs.modal.hide()
      }
    }
  }
}
</script>
