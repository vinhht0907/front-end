<template>
  <select2-with-validation
    :required="required"
    v-model="grade"
    :error="error"
    :multiple="multiple"
    v-bind="$attrs"
    placeholder="Chọn lớp học..."
    label="Lớp học"
    data-vv-as="Lớp học"
    id-field="_id"
    text-field="name"
    ajax="/grade/suggest"
    name="grade"
  />
</template>

<script>
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'GradeChosen',
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
      grade: null
    }
  },
  watch: {
    grade(val) {
      this.$emit('input', val)
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal.id !== oldVal.id)) {
          this.grade = newVal
        }
      } else {
        this.grade = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.grade = this.value))
    }
  }
}
</script>
