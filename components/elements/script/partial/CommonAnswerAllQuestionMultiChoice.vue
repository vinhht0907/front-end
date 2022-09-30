<template>
  <div>
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.question"
      label="Câu hỏi"
      placeholder="Câu hỏi"
      name="question"
      rules="required"
    />
    <base-input-score v-model="innerValue.score" />
    <base-multi-answer
      v-model="innerValue.answers"
      placeholder="Nhập đáp án..."
      btn-label="Thêm đáp án"
      label="Trường này"
    />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BaseMultiAnswer from '~/components/elements/script/base/BaseMultiAnswer'
export default {
  name: 'CommonAnswerAllQuestionMultiChoice',
  components: {
    BaseMultiAnswer,
    BaseInputScore,
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
