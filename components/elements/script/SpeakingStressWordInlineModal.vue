<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Speaking stress word inline"
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
          <b-text-input-with-validation
            v-model="form.title_vn"
            label="Tiêu đề tiếng việt"
            placeholder="Tiêu đề tiếng việt"
            name="title_vn"
          />
          <base-input-score v-model="form.score" />
          <b-single-audio-upload-with-validation
            v-model="form.audio"
            :required="true"
            rules="required"
            label="File ghi âm của từ"
          />
          <b-text-input-with-validation
            v-model="form.word"
            :required="true"
            label="Từ - Từ được nhấn mạnh được đặt trong <s></s>"
            placeholder="<s>Pic</s>ture"
            rules="required"
            name="word"
          />
          <b-text-input-with-validation
            v-model="form.pronunciation"
            label="Phiên âm của từ"
            placeholder="Phiên âm của từ"
            name="pronunciation"
          />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <listen-and-speak-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import ListenAndSpeakPreview from '~/components/elements/script/preview/ListenAndSpeakPreview'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'

const defaultForm = {
  title: '',
  content: '',
  pronunciation: ''
}
export default {
  name: 'SpeakingStressWordInlineModal',
  components: {
    BTextInputWithValidation,
    BaseInputScore,
    ListenAndSpeakPreview,
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
