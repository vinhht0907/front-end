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

          <div class="flash-card-word-wrap">
            <audio
              ref="audio"
              v-if="form.audio"
              controls
              class="mb-2 audio-custom"
            >
              <source :src="form.audio" type="audio/ogg" />
              <source :src="form.audio" type="audio/mpeg" />
            </audio>

            <b-card-text
              class="card-title lead font-weight-bold text-left ml-2"
            >
              <h4>{{ form.mainWord ? form.mainWord : 'Điền từ thích hợp' }}</h4>
            </b-card-text>
            <b-card-text
              v-for="(item, index) in form.items"
              :key="item.key"
              class="text-left ml-2"
            >
              {{ index + 1 }}.
              {{ item.question ? question(item.question) : 'Câu hỏi ...' }}
            </b-card-text>
          </div>
        </b-card-body>
        <slot :options="form.options" name="action"> </slot>
      </b-card>
    </the-portlet>
  </div>
</template>

<style>
.flash-card-word-wrap {
  background-color: white;
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
</style>

<script>
import ThePortlet from '~/components/base/ThePortlet'

export default {
  name: 'ListenFillInBlankWritingDetail',
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
          this.form.attachment.type !== 'definition') ||
        (this.form.attachment &&
          this.form.attachment.path &&
          this.form.attachment.type === 'image')
      ) {
        return true
      } else {
        return false
      }
    },
    getImage() {
      if (
        this.form.attachment &&
        this.form.attachment.path &&
        this.form.attachment.type === 'image'
      ) {
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
    },
    question(question) {
      const question1 = question.replace(/\[\]/g, '.....')
      return question1
    }
  }
}
</script>
