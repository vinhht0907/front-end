<template>
  <div>
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.text"
      rules="required"
      placeholder="Text"
      label="Text"
      name="text"
    />
    <base-input-score v-model="innerValue.score" />
    <base-single-image-answer v-model="innerValue.answers" />
  </div>
</template>

<script>
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BaseSingleImageAnswer from '~/components/elements/script/base/BaseSingleImageAnswer'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
export default {
  name: 'ReadAndCheckItem',
  components: {
    BTextInputWithValidation,
    BaseSingleImageAnswer,
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
