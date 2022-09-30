<template>
  <b-text-input-with-validation
    v-model="innerValue"
    :rules="rules"
    :required="required"
    v-bind="$attrs"
    label="Điểm thưởng"
    placeholder="Điểm thưởng"
    name="score"
  />
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
export default {
  name: 'BaseInputScore',
  components: { BTextInputWithValidation },
  props: {
    value: {
      type: null,
      default: null
    },
    required: {
      type: Boolean,
      default: true
    },
    rules: {
      type: [Object, String],
      default: 'required|numeric|max_value:9999'
    }
  },
  data() {
    return {
      innerValue: null
    }
  },
  watch: {
    innerValue(val) {
      if (val) {
        this.$emit('input', val)
      } else {
        this.$emit('input', null)
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = 1
    }
  }
}
</script>
