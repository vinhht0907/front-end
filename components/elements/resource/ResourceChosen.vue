<template>
  <select2-with-validation
    :required="required"
    v-model="resource"
    :error="error"
    :multiple="multiple"
    v-bind="$attrs"
    placeholder="Select Resource"
    label="Resource"
    data-vv-as="Resource"
    id-field="_id"
    text-field="name"
    ajax="/resource/select-list"
    name="resource"
  />
</template>

<script>
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'ResourceChosen',
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
      resource: null
    }
  },
  watch: {
    resource(val) {
      this.$emit('input', val)
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal.id !== oldVal.id)) {
          this.resource = newVal
        }
      } else {
        this.resource = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.resource = this.value))
    }
  }
}
</script>
