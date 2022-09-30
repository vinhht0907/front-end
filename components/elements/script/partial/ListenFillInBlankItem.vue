<template>
  <div>
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.question"
      label="Câu hỏi - Câu trả lời được đặt trong dấu [ ]"
      placeholder="Câu hỏi [câu trả lời 1] và [câu trả lời 2] ..."
      name="question"
      rules="required"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
export default {
  name: 'ListenFillInBlankItem',
  components: {
    BTextInputWithValidation,
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
