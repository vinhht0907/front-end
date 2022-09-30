<template>
  <div style="width: 380px;">
    <the-portlet>
      <b-card no-body class="card-choice">
        <b-card-body>
          <h5
            class="kt-font-primary text-uppercase font-weight-bold teacher-name kt-- text-center"
          >
            Role play
          </h5>

          <div class="flash-card-word-wrap">
            <b-card-title
              class="card-title lead font-weight-bold text-center text-primary"
            >
              <h5>Chọn vai</h5>
            </b-card-title>
            <b-card-text class=" text-center">
              <h6>Hãy lựa chọn một vai để bắt đầu</h6>
            </b-card-text>
            <div class="row">
              <div
                v-for="speaker in form.speakers"
                class="col-6 text-center kt-margin-t-10"
              >
                <b-card-img
                  :src="speaker.avatar"
                  top
                  class="img-fluid avatar-role-play"
                ></b-card-img>
                <b-card-text class="text-center name-role-play">
                  {{ speaker.name ? speaker.name.toUpperCase() : '' }}
                </b-card-text>
              </div>
            </div>

            <button class="btn btn-primary btn-pill btn-block kt-margin-t-20">
              Tiếp tục
            </button>
          </div>
        </b-card-body>
      </b-card>
    </the-portlet>
  </div>
</template>

<style scoped>
.flash-card-word-wrap {
  background-color: white;
  z-index: 1000;
  padding-bottom: 24px;
  margin-bottom: 20px;
  padding-top: 5px;
}
.avatar-role-play {
  width: 60%;
  margin-bottom: 10px !important;
}
.name-role-play {
  font-weight: bold;
}
</style>

<script>
import ThePortlet from '~/components/base/ThePortlet'

export default {
  name: 'FlashCardPreviewDetail',
  components: { ThePortlet },
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
      console.log('audio', this.$refs.audio)
      if (!this.$refs.audio) {
        return
      }
      const audioElm = this.$refs.audio
      if (audioElm.paused) {
        audioElm.play()
      } else {
        audioElm.pause()
      }
    }
  }
}
</script>
