<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Pronounciation syllable highlight"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <b-single-audio-upload-with-validation
            :required="true"
            v-model="form.audio"
            rules="required"
            label="Audio phát âm"
            name="audio"
          />
          <base-input-score v-model="form.score" />
          <b-text-input-with-validation
            v-model="form.syllable"
            :required="true"
            label="Âm tiết của từ - Có dạng [âm tiết 1|(trọng âm)|âm tiết 2]"
            placeholder="to|(ma)|to"
            rules="required"
            name="syllable"
            rows="6"
          />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview h-100 w-100">
          <f-i-b-sentence-with-given-word-preview :form="form" />
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
import FIBSentenceWithGivenWordPreview from '~/components/elements/script/preview/FIBSentenceWithGivenWordPreview'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'

const defaultForm = {
  syllable: ''
}
export default {
  name: 'PronounciationSyllableHighlightModal',
  components: {
    BTextInputWithValidation,
    BaseInputScore,
    FIBSentenceWithGivenWordPreview,
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
