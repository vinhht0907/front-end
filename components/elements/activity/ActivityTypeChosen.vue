<template>
  <b-form-group label="Script type">
    <the-select2
      v-model="innerValue"
      :options="activityList"
      :has-all-option="true"
      id-field="type"
      text-field="name"
    />
  </b-form-group>
</template>

<script>
import TheSelect2 from '~/components/base/TheSelect2'
export default {
  name: 'ActivityTypeChosen',
  components: { TheSelect2 },
  props: {
    value: {
      type: [Object, Array],
      default: null
    }
  },
  data() {
    return {
      innerValue: null,
      activityList: []
    }
  },
  watch: {
    innerValue(val) {
      this.$emit('input', val)
    },
    value(newVal) {
      this.innerValue = newVal
    }
  },
  created() {
    this.loadActivityTypeData()
    if (this.value) {
      this.innerValue = this.value
    }
  },
  methods: {
    async loadActivityTypeData() {
      try {
        const { data } = await this.$axios.post('/activity-type/list')

        this.activityList = [{ type: -1, name: 'Tất cả' }, ...data]
      } catch (e) {}
    }
  }
}
</script>
