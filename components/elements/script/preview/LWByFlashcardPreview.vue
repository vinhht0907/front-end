<template>
  <card-preview :form="form"></card-preview>
</template>

<script>
import CardPreview from './CardPreview'
export default {
  name: 'LWByFlashcardPreview',
  components: { CardPreview },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
