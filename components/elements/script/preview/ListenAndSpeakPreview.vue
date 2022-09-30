<template>
  <div style="width: 380px;">
    <b-card no-body class="card-choice">
      <b-card-body>
        <h5
          class="kt-font-primary text-uppercase font-weight-bold teacher-name"
        >
          Mike
        </h5>

        <audio v-if="form.audio" controls>
          <source :src="form.audio" type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>

        <b-card-title class="card-title lead font-weight-bold">
          {{ form.title ? form.title : 'Tiêu đề ở đây...' }}
        </b-card-title>
        <b-card-text class="lead">
          Hãy nghe và nói: {{ form.word ? form.word : '...' }}
        </b-card-text>
      </b-card-body>
      <b-button-group vertical>
        <b-button><i class="la la-microphone"></i> Bắt đầu nói</b-button>
      </b-button-group>
    </b-card>
    <div class="bottom-preview micro-wrap">
      <div class="bottom-preview__inner">
        <h5 class="bottom-preview__title">Bấm vào micro để dừng</h5>
        <h4 class="micro-wrap__word">{{ form.word ? form.word : '...' }}</h4>
        <b-button class="micro-wrap__btn" block variant="primary"
          ><i class="la la-microphone"></i
        ></b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListenAndSpeakPreview',
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
