<template>
  <div>
    <card-preview :form="form"> </card-preview>

    <div class="answer-text">
      <h5 class="answer-text__title">Câu trả lời</h5>
      <hr />
      <hr />
      <hr />
      <hr />
    </div>
    <div class="answer-group">
      <b-button
        v-for="option in form.options"
        :key="option.key"
        v-if="option.text"
        >{{ option.text }}</b-button
      >
    </div>
  </div>
</template>

<script>
import CardPreview from './CardPreview'
export default {
  name: 'AQWithGivenWordsPreview',
  components: { CardPreview },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
