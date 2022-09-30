<template>
  <select2-with-validation
    :required="required"
    v-model="tags"
    :error="error"
    :multiple="multiple"
    v-bind="$attrs"
    placeholder="Chọn tags nội dung..."
    label="Tags nội dung"
    data-vv-as="Tags nội dung"
    id-field="_id"
    text-field="name"
    ajax="/english-tag/suggest"
    name="tags"
  />
</template>

<script>
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'TagChosen',
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
      tags: null
    }
  },
  watch: {
    tags(val) {
      this.$emit('input', val)
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal.id !== oldVal.id)) {
          this.tags = newVal
        }
      } else {
        this.tags = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.tags = this.value))
    }
  }
}
</script>
