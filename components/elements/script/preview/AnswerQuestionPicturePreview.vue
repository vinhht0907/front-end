<template>
  <div>
    <card-preview :form="form"> </card-preview>
    <div class="bottom-preview picture-wrap">
      <div class="bottom-preview__inner">
        <h5 class="bottom-preview__title">Bức ảnh đúng là gì?</h5>
        <div class="picture-wrap__images">
          <div
            v-for="answer in form.answers"
            :key="answer.key"
            class="image-item"
          >
            <b-img :src="answer.url" rounded />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardPreview from './CardPreview'
export default {
  name: 'AnswerQuestionPicturePreview',
  components: { CardPreview },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
