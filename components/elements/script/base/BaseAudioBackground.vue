<template>
  <div>
    <b-single-image-upload-with-validation
      :required="true"
      v-model="innerValue.background"
      rules="required"
      label="Ảnh nền"
      placeholder="Ảnh nền"
    />
    <b-single-audio-upload-with-validation
      :required="true"
      v-model="innerValue.audio"
      rules="required"
      label="Audio mô tả"
    />
  </div>
</template>

<script>
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
export default {
  name: 'BaseAudioBackground',
  components: {
    BSingleAudioUploadWithValidation,
    BSingleImageUploadWithValidation
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
