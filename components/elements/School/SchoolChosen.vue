<template>
  <select2-with-validation
    :required="required"
    v-model="school"
    :error="error"
    :multiple="multiple"
    v-bind="$attrs"
    :label="label"
    :data-vv-as="label"
    :post-data="postData"
    :allow-clear="true"
    placeholder="Chọn trường..."
    id-field="_id"
    text-field="name"
    ajax="/school/suggest"
    name="school"
  />
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

export default {
  name: 'SchoolChosen',
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
      default: 'Nhà trường'
    },
    districtDepartmentOfEducation: {
      type: [Number, String, Object],
      default: null
    },
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      school: null,
      postData: {
        district: this.districtDepartmentOfEducation
      }
    }
  },
  watch: {
    school(val) {
      this.$emit('input', val)
    },
    districtDepartmentOfEducation(val, oldVal) {
      if (!(val && oldVal && val._id === oldVal._id)) {
        this.school = this.multiple ? [] : null
        this.postData.district = val
      }
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal._id !== oldVal._id)) {
          this.school = newVal
        }
      } else {
        this.school = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.school = cloneDeep(this.value)))
    }
  }
}
</script>
