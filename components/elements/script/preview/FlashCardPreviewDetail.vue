<template>
  <div style="width: 380px;">
    <the-portlet>
      <b-card no-body class="card-choice">
        <b-card-body>
          <h5
            class="kt-font-primary text-uppercase font-weight-bold teacher-name kt--"
          >
            Mike
          </h5>
          <b-card-img
            v-if="showImage"
            :src="getImage"
            top
            class="img-fluid"
            style="margin-bottom: 0px"
          ></b-card-img>

          <b-card-img
            v-if="!showImage"
            :src="getImage"
            top
            class="img-fluid"
            style="margin-bottom: 0px; opacity: 0.2"
          >
          </b-card-img>

          <div class="flash-card-definition-text">
            {{
              form.attachment &&
              form.attachment.item &&
              form.attachment.item.definition
                ? form.attachment.item.definition
                : ''
            }}
          </div>

          <div class="flash-card-word-wrap">
            <video
              v-if="
                form.attachment &&
                  form.attachment.type === 'video' &&
                  form.attachment.item &&
                  form.attachment.item.video
              "
              controls
              class="mb-2"
              style="width: 100%"
            >
              <source :src="form.attachment.item.video" type="video/mp4" />
            </video>

            <!--            <div class="text-center">-->
            <!--              <i-->
            <!--                class="flaticon-sound text-light flaticon-sound-flash-card"-->
            <!--                style=""-->
            <!--              ></i>-->
            <!--            </div>-->

            <b-card-title
              class="card-title lead font-weight-bold text-center text-primary"
            >
              <h1>{{ form.mainWord ? form.mainWord : 'Từ mới...' }}</h1>
            </b-card-title>
            <b-card-text class="lead text-center">
              {{ form.pronunciation ? form.pronunciation : 'Phát âm...' }}
            </b-card-text>
            <b-card-text
              v-if="
                form.attachment &&
                  form.attachment.item &&
                  form.attachment.item.wordMeaning
              "
              class="lead text-center text-black-50"
            >
              {{
                form.attachment.item.wordMeaning
                  ? form.attachment.item.wordMeaning
                  : ''
              }}
            </b-card-text>
            <b-card-text
              v-if="
                form.attachment &&
                  form.attachment.item &&
                  form.attachment.item.example
              "
              class="lead text-center font-weight-bold"
            >
              {{
                form.attachment.item.example ? form.attachment.item.example : ''
              }}
            </b-card-text>
            <div
              v-if="form.attachment && form.attachment.type === 'audio'"
              :style="{ width: `${audioPercent}%` }"
              class="progress-bg"
            ></div>
            <audio
              ref="audio"
              v-if="
                form.attachment &&
                  form.attachment.type === 'audio' &&
                  form.attachment.item &&
                  form.attachment.item.audio
              "
              controls
              class="mb-2 audio-custom"
            >
              <source :src="form.attachment.item.audio" type="audio/ogg" />
              <source :src="form.attachment.item.audio" type="audio/mpeg" />
            </audio>

            <b-card-text
              v-if="
                form.attachment &&
                  form.attachment.item &&
                  form.attachment.item.sentence
              "
              class="lead text-center font-weight-bold"
            >
              {{
                form.attachment.item.sentence
                  ? form.attachment.item.sentence
                  : ''
              }}
            </b-card-text>
            <b-card-text
              v-if="
                form.attachment &&
                  form.attachment.item &&
                  form.attachment.item.translation
              "
              class="lead text-center text-black-50"
            >
              {{
                form.attachment.item.translation
                  ? form.attachment.item.translation
                  : ''
              }}
            </b-card-text>
          </div>
        </b-card-body>
        <slot :options="form.options" name="action"> </slot>
      </b-card>
    </the-portlet>
  </div>
</template>

<style scoped>
.flaticon-sound-flash-card {
  font-size: 27px;
  background-color: rgb(255, 184, 34);
  border-radius: 100%;
  padding: 3px 6px;
}
.flash-card-word-wrap {
  /*border-style: solid;*/
  /*border-width: 1px;*/
  /*border-color: rgb(100, 108, 154);*/
  /*border-top-left-radius: 20px;*/
  /*border-top-right-radius: 20px;*/
  background-color: white;
  /*margin-top: -45px;*/
  z-index: 1000;
  padding-bottom: 24px;
  margin-bottom: 20px;
  padding-top: 5px;
}
.audio-custom {
  height: 30px;
  width: 90%;
  margin: 0px 12px;
}
.flash-card-definition-text {
  position: absolute;
  top: 40px;
  margin-top: 10px;
  margin-left: -20px;
  width: 250px;
  height: 100px;
  overflow: hidden;
  text-align: center;
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
  computed: {
    showImage() {
      if (
        (this.form.attachment &&
          this.form.attachment.item &&
          this.form.attachment.item.image &&
          this.form.attachment.type !== 'definition') ||
        (this.form.attachment &&
          this.form.attachment.item &&
          this.form.attachment.item.background &&
          this.form.attachment.type !== 'definition')
      ) {
        return true
      } else {
        return false
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
      } else if (
        this.form.attachment &&
        this.form.attachment.item &&
        this.form.attachment.item.background
      ) {
        return this.form.attachment.item.background
      } else {
        return ''
      }
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
