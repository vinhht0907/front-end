<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Flashcard"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <b-text-input-with-validation
            :required="true"
            v-model="form.mainWord"
            rules="required"
            label="Từ mới"
            placeholder="Từ mới"
            name="mainWord"
          />
          <b-single-audio-upload-with-validation
            :required="true"
            v-model="form.audio"
            rules="required"
            label="Audio phát âm"
            name="audio"
          />
          <b-text-input-with-validation
            v-model="form.pronunciation"
            label="Phát âm"
            placeholder="Phát âm"
            name="pronunciation"
          />
          <base-input-score v-model="form.score" />
          <flashcard-attachment v-model="form.attachment" />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview p-5 h-100 w-100">
          <flashcard-preview :form="form" />
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
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import FlashcardAttachment from '~/components/elements/script/partial/FlashcardAttachment'
import FlashcardPreview from '~/components/elements/script/preview/FlashcardPreview'

const defaultForm = {
  mainWord: '',
  audio: '',
  pronunciation: '',
  attachment: {}
}
export default {
  name: 'FlashcardModal',
  components: {
    FlashcardAttachment,
    BTextInputWithValidation,
    BSingleAudioUploadWithValidation,
    BaseInputScore,
    FlashcardPreview,
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
