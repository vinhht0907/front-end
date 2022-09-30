<template>
  <div style="width: 380px;">
    <the-portlet>
      <h5 class="kt-font-primary text-uppercase font-weight-bold">
        Mike
      </h5>
      <reading-preview
        v-if="form.attachment && form.attachment.type === 'reading'"
        :item="form.attachment.item"
      />
      <img
        v-if="form.attachment && form.attachment.type === 'image'"
        :src="form.attachment.path"
        class="img-fluid mb-2"
      />
      <video
        v-if="form.attachment && form.attachment.type === 'video'"
        controls
        class="mb-2"
        height="200"
      >
        <source :src="form.attachment.path" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <p class="lead font-weight-bold">
        {{ form.title ? form.title : 'Tiêu đề ở đây...' }}
      </p>
      <p class="lead">
        {{ form.content ? form.content : 'Nội dung ở đây...' }}
      </p>
      <audio
        v-if="form.attachment && form.attachment.type === 'audio'"
        controls
        class="w-100 mb-2"
      >
        <source :src="form.attachment.path" type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
    </the-portlet>

    <button
      v-if="form.action && form.action.type === 'simple'"
      class="btn btn-outline-brand btn-pill pull-right"
    >
      {{ form.action.text }}
    </button>

    <button
      v-if="form.action && form.action.type === 'full_width'"
      class="btn btn-primary btn-pill btn-block"
    >
      {{ form.action.text }}
    </button>
  </div>
</template>
ăn
<script>
import ThePortlet from '~/components/base/ThePortlet'
import ReadingPreview from '~/components/elements/script/preview/ReadingPreview'
export default {
  name: 'SentencePreview',
  components: { ReadingPreview, ThePortlet },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
