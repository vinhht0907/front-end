<template>
  <div>
    <b-text-area-with-validation
      :required="true"
      v-model="innerValue.question"
      label="Câu hỏi - Câu trả lời được đặt trong dấu [ ]"
      placeholder="I [am] from Iran. Where [are] you from?"
      name="question"
      rules="required"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
export default {
  name: 'FIBMultiQuestionsItem',
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
