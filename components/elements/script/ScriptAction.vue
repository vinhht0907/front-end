<template>
  <div>
    <b-form-group label="Loại hành động">
      <b-form-radio-group
        :options="options"
        v-model="type"
        class="pt-2 theme-custom-radio"
        value-field="type"
        text-field="name"
        size="lg"
      ></b-form-radio-group>
    </b-form-group>

    <b-form-group v-bind="$attrs">
      <b-form-input
        v-model="text"
        v-bind="$attrs"
        :autocomplete="'disabled'"
        placeholder="Nội dung hành động..."
      ></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
export default {
  name: 'ScriptAction',
  props: {
    value: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      text: '',
      type: 'simple',
      options: [
        { type: 'simple', name: 'Đơn giản' },
        { type: 'full_width', name: 'Toàn bộ chiều rộng' }
      ]
    }
  },
  watch: {
    text(newVal) {
      if (newVal && newVal.trim() !== '') {
        this.$emit('input', { type: this.type, text: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    type(newVal) {
      if (this.text && this.text.trim() !== '') {
        this.$emit('input', { type: newVal, text: this.text })
      } else {
        this.$emit('input', null)
      }
    },
    value(newVal) {
      if (newVal) {
        this.text = newVal.text
      }
    }
  },
  created() {
    if (this.value) {
      this.text = this.value.text
    }
  }
}
</script>
