<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Câu hỏi với đáp án viết"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
          <b-text-input-with-validation
            v-model="form.title"
            label="Tiêu đề"
            placeholder="Tiêu đề"
            name="title"
          />
          <b-text-area-with-validation
            v-model="form.content"
            :required="true"
            label="Nội dung"
            placeholder="Nội dung"
            rules="required"
            name="content"
          />
          <base-input-score v-model="form.score" />
          <b-text-area-with-validation
            v-model="form.answer"
            :required="true"
            label="Câu trả lời - Các câu trả lời cách nhau bởi dấu /"
            placeholder="Câu trả lời 1/câu trả lời 2"
            rules="required"
            name="answer"
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
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import AnswerQuestionWritingPreview from '~/components/elements/script/preview/AnswerQuestionWritingPreview'

const defaultForm = {
  title: '',
  content: '',
  options: []
}
export default {
  name: 'AnswerQuestionWritingModal',
  components: {
    BTextAreaWithValidation,
    BTextInputWithValidation,
    BaseInputScore,
    AnswerQuestionWritingPreview,
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
