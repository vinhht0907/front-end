<template>
  <div>
    <b-text-area-with-validation
      :required="true"
      v-model="innerValue.question"
      label="Text - ký tự trong [] sẽ được tách thành câu trả lời."
      placeholder="Open [your book please!]."
      name="question"
      rules="required"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
export default {
  name: 'ReadAndMatchTextItem',
  components: {
    BTextAreaWithValidation,
    BaseInputScore
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
