<template>
  <card-preview :form="form">
    <template v-slot:action="{ options }">
      <b-form-group class="card-checkbox-group">
        <b-form-checkbox
          v-for="option in options"
          :key="option.key"
          v-if="option.text"
        >
          {{ option.text }}
        </b-form-checkbox>
      </b-form-group>
    </template>
  </card-preview>
</template>

<script>
import CardPreview from './CardPreview'
export default {
  name: 'MultiChoiceInlinePreview',
  components: { CardPreview },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
