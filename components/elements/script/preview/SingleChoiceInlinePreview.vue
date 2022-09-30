<template>
  <card-preview :form="form">
    <template v-slot:action="{ options }">
      <b-button-group vertical>
        <b-button
          v-for="option in options"
          :key="option.key"
          v-if="option.text"
          >{{ option.text }}</b-button
        >
      </b-button-group>
    </template>
  </card-preview>
</template>

<script>
import CardPreview from './CardPreview'
export default {
  name: 'SingleChoiceInlinePreview',
  components: { CardPreview },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
