<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Audio speaking answer"
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
          <base-input-score v-model="form.score" />
          <b-single-audio-upload-with-validation
            :required="true"
            v-model="form.audio"
            rules="required"
            label="Audio phát âm"
            name="audio"
          />
          <base-single-answer v-model="form.answers" />
        </validation-observer>
      </b-col>
      <b-col cols="6">
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
import BaseSingleAnswer from '~/components/elements/script/base/BaseSingleAnswer'
import SingleChoiceInlinePreview from '~/components/elements/script/preview/SingleChoiceInlinePreview'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'

const defaultForm = {
  answers: []
}
export default {
  name: 'AudioSpeakingAnswerModal',
  components: {
    BSingleAudioUploadWithValidation,
    BaseSingleAnswer,
    BaseInputScore,
    SingleChoiceInlinePreview,
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
