<template>
  <select2-with-validation
    :required="required"
    v-model="category"
    :error="error"
    :multiple="multiple"
    v-bind="$attrs"
    :label="label"
    :data-vv-as="label"
    :post-data="postData"
    :allow-clear="true"
    placeholder="Chọn một danh mục..."
    id-field="_id"
    text-field="name"
    ajax="/category/select-list"
    name="category"
  />
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'CategoryChosen',
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
      default: false
    },
    label: {
      type: String,
      default: 'Danh mục'
    },
    parentType: {
      type: String,
      default: null
    },
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      category: null,
      postData: {
        parentType: this.parentType
      }
    }
  },
  watch: {
    category(val) {
      this.$emit('input', val)
    },
    parentType(val) {
      this.category = this.multiple ? [] : null
      this.postData.parentType = val
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal.id !== oldVal.id)) {
          this.category = newVal
        }
      } else {
        this.category = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.category = cloneDeep(this.value)))
    }
  }
}
</script>
