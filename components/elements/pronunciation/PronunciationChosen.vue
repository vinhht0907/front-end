<template>
  <select2-with-validation
    :required="required"
    v-model="innerValue"
    :error="error"
    :multiple="multiple"
    v-bind="$attrs"
    placeholder="Chọn tên âm ..."
    label="Tên âm"
    data-vv-as="Tên âm"
    id-field="_id"
    text-field="name"
    ajax="/pronunciation/suggest"
    name="pronunciation"
  />
</template>

<script>
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'PronunciationChosen',
  components: { Select2WithValidation },
  props: {
    error: {
      type: String,
      default: ''
    },
    value: {
      type: [Object, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
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
        this.$emit('input', { _id: val._id, name: val.name })
      } else {
        this.$emit('input', null)
      }
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal._id !== oldVal._id)) {
          this.innerValue = newVal
        }
      } else {
        this.innerValue = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.innerValue = this.value))
    }
  }
}
</script>
