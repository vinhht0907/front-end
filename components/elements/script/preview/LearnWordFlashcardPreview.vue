<template>
  <learn-word-flashcard-detail :form="form"></learn-word-flashcard-detail>
</template>

<script>
import LearnWordFlashcardDetail from '~/components/elements/script/preview/LearnWordFlashcardDetail'
export default {
  name: 'LearnWordFlashcardPreview',
  components: { LearnWordFlashcardDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
