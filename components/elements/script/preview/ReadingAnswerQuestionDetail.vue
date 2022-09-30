<template>
  <div style="width: 380px;">
    <the-portlet>
      <b-card no-body class="card-choice">
        <b-card-body>
          <b-card-img
            v-if="showImage"
            :src="getImage"
            top
            class="img-fluid"
            style="margin-bottom: 0px"
          ></b-card-img>

          <div class="reading-answer-question-wrap">
            <b-card-title
              class="card-title lead font-weight-bold text-left text-primary"
            >
              <h3>{{ form.title ? form.title : 'Tiêu đề...' }}</h3>
            </b-card-title>
            <div v-html="form.content"></div>
            <button class="btn btn-primary btn-pill btn-block kt-margin-t-20">
              Tiếp tục
            </button>
          </div>
        </b-card-body>
        <slot :options="form.options" name="action"> </slot>
      </b-card>
    </the-portlet>
  </div>
</template>

<style scoped>
.reading-answer-question-wrap {
  background-color: white;
  z-index: 1000;
  padding: 10px 10px;
}
</style>

<script>
import ThePortlet from '~/components/base/ThePortlet'

export default {
  name: 'ReadingAnswerQuestionDetail',
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
      if (this.form.image) {
        return true
      } else {
        return false
      }
    },
    getImage() {
      if (this.form.image) {
        return this.form.image
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
    },
    htmlToElement(html) {
      const template = document.createElement('div')
      // html = html.trim()
      template.innerHTML = html
      console.log('template', template)
      return template.firstElementChild
    }
  }
}
</script>
