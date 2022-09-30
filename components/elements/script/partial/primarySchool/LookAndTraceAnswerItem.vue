<template>
  <div>
    <b-single-image-upload-with-validation
      :required="true"
      v-model="innerValue.path"
      rules="required"
      label="Ảnh"
      name="path"
    />
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.text"
      label="Câu trả lời(ví dụ [L]ucy)"
      placeholder="Câu trả lời"
      rules="required"
      name="text"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
export default {
  name: 'LookAndTraceAnswerItem',
  components: {
    BTextInputWithValidation,
    BaseInputScore,
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
