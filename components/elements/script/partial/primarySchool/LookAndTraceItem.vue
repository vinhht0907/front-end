<template>
  <div>
    <b-single-image-upload-with-validation
      :required="true"
      v-model="innerValue.image"
      rules="required"
      label="Ảnh preview"
      name="image"
    />
    <b-single-json-upload-with-validation
      :required="true"
      v-model="innerValue.file"
      rules="required"
      label="LottieFiles"
      name="file"
    />
    <look-and-trace-answer-list v-model="innerValue.answers" />
  </div>
</template>

<script>
import BSingleJsonUploadWithValidation from '~/components/base/input/BSingleJsonUploadWithValidation'
import LookAndTraceAnswerList from '~/components/elements/script/partial/primarySchool/LookAndTraceAnswerList'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
export default {
  name: 'LookAndTraceItem',
  components: {
    BSingleImageUploadWithValidation,
    LookAndTraceAnswerList,
    BSingleJsonUploadWithValidation
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
