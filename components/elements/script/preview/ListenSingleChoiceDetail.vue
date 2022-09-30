<template>
  <div style="width: 380px;">
    <b-card no-body class="card-choice">
      <b-card-body @click="toggleAudio">
        <h5
          class="kt-font-primary text-uppercase font-weight-bold teacher-name"
        >
          Mike
        </h5>
        <b-card-img
          v-if="form.attachment && form.attachment.type === 'image'"
          :src="form.attachment.path"
          top
          class="img-fluid"
        ></b-card-img>

        <b-card-title class="card-title lead font-weight-bold">
          {{ form.question ? form.question : 'Câu hỏi...' }}
        </b-card-title>
        <div
          v-if="form.attachment && form.attachment.type === 'audio'"
          :style="{ width: `${audioPercent}%` }"
          class="progress-bg"
        ></div>
        <audio
          ref="audio"
          v-if="form.attachment && form.attachment.type === 'audio'"
          @timeupdate="onAudioTimeUpdate"
          controls
          autoplay
          class="d-none"
        >
          <source :src="form.attachment.path" type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      </b-card-body>

      <slot :options="form.answers" name="action"> </slot>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'ListenSingleChoiceDetail',
  props: {
    form: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      audioPercent: 0
    }
  },
  methods: {
    onAudioTimeUpdate(evt) {
      const target = evt.target
      this.audioPercent = target.duration
        ? (target.currentTime / target.duration) * 100
        : 0
    },
    toggleAudio() {
      if (!this.$refs.audio) {
        return
      }
      const audioElm = this.$refs.audio
      if (audioElm.paused) {
        audioElm.play()
      } else {
        audioElm.pause()
      }
    },
    getImage() {
      if (this.form.attachment && this.form.attachment.path) {
        return this.form.attachment.path
      } else if (
        this.form.attachment &&
        this.form.attachment.item &&
        this.form.attachment.item.image
      ) {
        return this.form.attachment.item.image
      } else {
        return ''
      }
    }
  }
}
</script>
