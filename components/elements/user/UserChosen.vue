<template>
  <select2-with-validation
    :required="required"
    v-model="user"
    :error="error"
    :multiple="multiple"
    :has-all-option="hasAllOption"
    :placeholder="$t('user.select2.placeholder')"
    :label="showLabel ? $t('user.select2.label') : ''"
    :data-vv-as="$t('user.select2.label')"
    :post-data="postData"
    id-field="id"
    text-field="username"
    ajax="/user/listing-all"
    name="user"
  />
</template>

<script>
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'UserChosen',
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
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      default: null
    },
    hasAllOption: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      user: null,
      postData: {
        role: this.role
      }
    }
  },
  watch: {
    user(val) {
      this.$emit('input', val)
    },
    role(val) {
      console.log(val)
      this.postData.role = val
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal.id !== oldVal.id)) {
          this.user = newVal
        }
      } else {
        this.user = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.user = this.value))
    }
  }
}
</script>
