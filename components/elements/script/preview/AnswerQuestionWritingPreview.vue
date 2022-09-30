<template>
  <div>
    <card-preview :form="form"> </card-preview>
  </div>
</template>

<script>
import CardPreview from './CardPreview'
export default {
  name: 'AnswerQuestionWritingPreview',
  components: { CardPreview },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
