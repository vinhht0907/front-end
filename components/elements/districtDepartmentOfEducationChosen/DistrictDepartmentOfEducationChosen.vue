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
    placeholder="Chọn phòng giáo dục..."
    id-field="_id"
    text-field="name"
    ajax="/district-department-of-educations/suggest"
    name="district_department_of_education"
  />
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'DistrictDepartmentOfEducationChosen',
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
      default: 'Phòng giáo dục'
    },
    provincialDepartmentOfEducation: {
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
        provincial: this.provincialDepartmentOfEducation
      }
    }
  },
  watch: {
    school(val) {
      this.$emit('input', val)
    },
    provincialDepartmentOfEducation(val) {
      this.school = this.multiple ? [] : null
      this.postData.provincial = val
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
