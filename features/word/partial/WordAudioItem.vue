<template>
  <div>
    <b-single-audio-upload-with-validation
      :required="true"
      v-model="innerValue.audio"
      rules="required"
      label="Audio"
    />
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.transcript"
      label="Câu đọc"
      placeholder="Câu đọc"
      name="transcript"
      rules="required"
    />
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.translation"
      label="Nghĩa tiếng việt"
      placeholder="Nghĩa tiếng việt"
      name="translation"
      rules="required"
    />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
export default {
  name: 'WordAudioItem',
  components: {
    BSingleAudioUploadWithValidation,
    BTextInputWithValidation
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
