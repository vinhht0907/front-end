<template>
  <flash-card-preview-detail :form="form"></flash-card-preview-detail>
</template>

<script>
import FlashCardPreviewDetail from '~/components/elements/script/preview/FlashCardPreviewDetail'

export default {
  name: 'FlashcardPreview',
  components: { FlashCardPreviewDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
