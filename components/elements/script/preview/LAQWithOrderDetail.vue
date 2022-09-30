<template>
  <div style="width: 100%;">
    <the-portlet>
      <b-card no-body class="card-choice">
        <b-card-body>
          <h5
            class="kt-font-primary text-uppercase font-weight-bold teacher-name kt--"
          >
            Mike
          </h5>

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

            <el-carousel
              :autoplay="false"
              :loop="false"
              indicator-position="outside"
              class="laq-el-carousel"
              height="400px"
            >
              <el-carousel-item
                v-for="(item, index) in form.items"
                :key="item.key"
              >
                <div class="laq-with-order-question-wrap">
                  <b-card-title class="card-title lead font-weight-bold">
                    CÂU HỎI {{ index + 1 }}/{{ form.items.length }}:
                  </b-card-title>
                  <b-card-text class="lead fib-multipart-detail-question">
                    {{ item.question ? item.question : 'Nội dung ở đây...' }}
                  </b-card-text>
                  <b-card-title class="card-title lead font-weight-bold">
                    CÂU TRẢ LỜI
                  </b-card-title>
                  <br />
                  <div class="laq-with-order-detail-answer-underline"></div>
                  <br />
                  <div class="laq-with-order-detail-answer-underline"></div>
                  <br />
                  <div class="laq-with-order-detail-answer-underline"></div>
                  <br />
                  <div class="laq-with-order-detail-answer-underline"></div>
                  <br />
                </div>
                <div class="laq-with-order-detail-answer-wrap text-center">
                  <div
                    v-if="answer.text"
                    v-for="answer in item.answers"
                    :key="answer.key"
                    class="laq-with-order-detail-answer"
                  >
                    {{ answer.text }}
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
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
.laq-with-order-question-wrap {
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.laq-el-carousel .el-carousel__item {
  background-color: white;
  color: black;
}
.laq-with-order-detail-answer-underline {
  border-bottom-style: dashed;
  width: 100%;
  border-color: #d1d6de;
}
.laq-with-order-detail-answer-wrap {
  background-color: #dde2ed;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 200px;
}
.laq-with-order-detail-answer {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  display: inline-block;
  margin-left: 5px;
}
</style>

<script>
import ThePortlet from '~/components/base/ThePortlet'

export default {
  name: 'LAQWithOrderDetail',
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
