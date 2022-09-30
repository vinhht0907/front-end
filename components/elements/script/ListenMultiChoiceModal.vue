<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Nghe và chọn nhiều câu trả lời"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
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

          <base-multi-answer v-model="form.answers" />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <single-choice-inline-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BaseMultiAnswer from '~/components/elements/script/base/BaseMultiAnswer'
import SingleChoiceInlinePreview from '~/components/elements/script/preview/SingleChoiceInlinePreview'
import ListenChoiceAttachment from '~/components/elements/script/partial/ListenChoiceAttachment'

const defaultForm = {
  answers: []
}
export default {
  name: 'ListenMultiChoiceModal',
  components: {
    BaseMultiAnswer,
    ListenChoiceAttachment,
    BTextAreaWithValidation,
    BaseInputScore,
    SingleChoiceInlinePreview,
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
