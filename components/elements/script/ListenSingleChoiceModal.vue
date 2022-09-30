<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Nghe và chọn một câu trả lời"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <b-form-group label="Loại tập tin">
            <b-form-radio-group
              :options="options"
              v-model="form.answer_type"
              class="pt-2 theme-custom-radio"
              value-field="type"
              text-field="name"
              size="lg"
            ></b-form-radio-group>
          </b-form-group>
          <b-text-area-with-validation
            v-model="form.question"
            :required="true"
            label="Câu hỏi"
            placeholder="Câu hỏi"
            rules="required"
            name="question"
          />
          <b-text-area-with-validation
            v-model="form.question_vn"
            label="Câu hỏi tiếng việt"
            placeholder="Câu hỏi tiếng việt"
            name="question_vn"
          />
          <base-input-score v-model="form.score" />
          <listen-choice-attachment v-model="form.attachment" />

          <base-single-answer v-model="form.answers" />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview p-5 h-100 w-100">
          <listen-single-choice-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BaseSingleAnswer from '~/components/elements/script/base/BaseSingleAnswer'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import ListenChoiceAttachment from '~/components/elements/script/partial/ListenChoiceAttachment'
import ListenSingleChoicePreview from '~/components/elements/script/preview/ListenSingleChoicePreview'

const defaultForm = {
  answers: []
}
export default {
  name: 'ListenSingleChoiceModal',
  components: {
    ListenChoiceAttachment,
    BaseSingleAnswer,
    BaseInputScore,
    BTextAreaWithValidation,
    ListenSingleChoicePreview,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      options: [
        { type: 'short', name: 'Câu trả lời ngắn' },
        { type: 'long', name: 'Câu trả lời dài' }
      ]
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      if (!this.form.answer_type) {
        this.form.answer_type = 'short'
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
