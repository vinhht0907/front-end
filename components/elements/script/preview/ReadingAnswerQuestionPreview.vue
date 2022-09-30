<template>
  <reading-answer-question-detail :form="form">
  </reading-answer-question-detail>
</template>

<script>
import ReadingAnswerQuestionDetail from '~/components/elements/script/preview/ReadingAnswerQuestionDetail'

export default {
  name: 'ReadingAnswerQuestionPreview',
  components: { ReadingAnswerQuestionDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
