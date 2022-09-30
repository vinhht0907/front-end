<template>
  <listen-fill-in-blank-writing-detail
    :form="form"
  ></listen-fill-in-blank-writing-detail>
</template>

<script>
import ListenFillInBlankWritingDetail from './ListenFillInBlankWritingDetail'
export default {
  name: 'LWByFlashcardPreview',
  components: { ListenFillInBlankWritingDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
