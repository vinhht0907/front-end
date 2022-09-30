<template>
  <b-single-video-upload-with-validation
    :required="true"
    v-model="innerValue.video"
    rules="required"
    label="Video"
  />
</template>

<script>
import BSingleVideoUploadWithValidation from '~/components/base/input/BSingleVideoUploadWithValidation'
export default {
  name: 'PronunciationVideoItem',
  components: {
    BSingleVideoUploadWithValidation
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
