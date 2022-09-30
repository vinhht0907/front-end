<template>
  <div>
    <b-single-audio-upload-with-validation
      :required="true"
      v-model="innerValue.audio"
      rules="required"
      label="Audio"
    />
    <b-text-area-with-validation
      :required="true"
      v-model="innerValue.text"
      label="Hướng dẫn đọc"
      placeholder="Hướng dẫn đọc"
      name="text"
      rules="required"
    />
  </div>
</template>

<script>
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
export default {
  name: 'PronunciationAudioItem',
  components: {
    BSingleAudioUploadWithValidation,
    BTextAreaWithValidation
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
