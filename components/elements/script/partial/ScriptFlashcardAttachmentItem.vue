<template>
  <div>
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.mainWord"
      rules="required"
      label="Từ mới"
      placeholder="Từ mới"
      name="mainWord"
    />
    <b-single-audio-upload-with-validation
      :required="true"
      v-model="innerValue.audio"
      rules="required"
      label="Audio phát âm"
      name="audio"
    />
    <b-text-input-with-validation
      v-model="innerValue.pronunciation"
      label="Phát âm"
      placeholder="Phát âm"
      name="pronunciation"
    />
    <flashcard-attachment v-model="innerValue.attachment" />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import FlashcardAttachment from '~/components/elements/script/partial/FlashcardAttachment'
export default {
  name: 'ScriptFlashcardAttachmentItem',
  components: {
    BTextInputWithValidation,
    BSingleAudioUploadWithValidation,
    FlashcardAttachment
  },
  props: {
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      innerValue: null
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value(val) {
      if (val) {
        this.innerValue = val
      } else {
        this.innerValue = {}
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = {}
    }
  }
}
</script>
