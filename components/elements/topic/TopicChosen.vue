<template>
  <select2-with-validation
    :required="required"
    v-model="topic"
    :error="error"
    :multiple="multiple"
    v-bind="$attrs"
    placeholder="Select Topic"
    label="Topic"
    data-vv-as="Topic"
    id-field="_id"
    text-field="name"
    ajax="/topic/select-list"
    name="topic"
  />
</template>

<script>
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'TopicChosen',
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
      topic: null
    }
  },
  watch: {
    topic(val) {
      this.$emit('input', val)
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal.id !== oldVal.id)) {
          this.topic = newVal
        }
      } else {
        this.topic = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.topic = this.value))
    }
  }
}
</script>
