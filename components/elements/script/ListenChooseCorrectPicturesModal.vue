<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Listen choose correct pictures"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
          <b-single-audio-upload-with-validation
            :required="true"
            v-model="form.audio"
            rules="required"
            label="Audio mô tả"
          />
          <base-input-score v-model="form.score" />
          <base-single-image-answer v-model="form.answers" />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <answer-question-picture-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BaseSingleImageAnswer from '~/components/elements/script/base/BaseSingleImageAnswer'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import AnswerQuestionPicturePreview from '~/components/elements/script/preview/AnswerQuestionPicturePreview'

const defaultForm = {
  audio: '',
  answers: []
}
export default {
  name: 'ListenChooseCorrectPicturesModal',
  components: {
    BaseInputScore,
    AnswerQuestionPicturePreview,
    BaseSingleImageAnswer,
    BSingleAudioUploadWithValidation,
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
