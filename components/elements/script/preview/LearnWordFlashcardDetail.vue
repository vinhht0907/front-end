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
            v-if="
              isListenAndAnswer ||
                isPictureAndAnswer ||
                isQuizAndAnswer ||
                isPictureListenAndAnswer
            "
            :src="getImage"
            top
            class="img-fluid"
            style="margin-bottom: 0px; opacity: 0.2"
          >
          </b-card-img>

          <div
            v-if="
              (isListenAndAnswer || isPictureListenAndAnswer) &&
                form.attachment &&
                form.attachment.item &&
                form.attachment.item.background
            "
            class="learn-word-flash-card-start-audio"
          >
            <div
              @click="toggleAudio"
              class="text-center"
              style="cursor: pointer"
            >
              <i
                class="flaticon-sound text-light flaticon-sound-flash-card"
              ></i>
            </div>
          </div>

          <!--          <div class="learn-word-flash-card-start-audio">-->
          <!--            {{-->
          <!--              form.attachment &&-->
          <!--              form.attachment.item &&-->
          <!--              form.attachment.item.definition-->
          <!--                ? form.attachment.item.definition-->
          <!--                : ''-->
          <!--            }}-->
          <!--          </div>-->

          <div
            v-if="
              (isPictureAndAnswer || isQuizAndAnswer) &&
                form.attachment &&
                form.attachment.item &&
                form.attachment.item.background
            "
            class="learn-word-flash-card-quiz"
          >
            <div class="text-center">
              <h5>
                {{
                  form.attachment.item.content
                    ? form.attachment.item.content
                    : ''
                }}
              </h5>
              <h5>
                {{ form.attachment.item.quiz ? form.attachment.item.quiz : '' }}
              </h5>
            </div>
          </div>

          <div class="learn-word-flash-card-detail">
            <video
              v-if="
                form.attachment &&
                  form.attachment.type === 'video_and_answer' &&
                  form.attachment.item &&
                  form.attachment.item.video
              "
              controls
              class="mb-2"
              style="width: 100%"
            >
              <source :src="form.attachment.item.video" type="video/mp4" />
            </video>

            <b-card-title
              v-if="isWordCharacter"
              class="card-title lead font-weight-bold text-center text-primary"
            >
              <h3>Điền chữ cái phù hợp</h3>
            </b-card-title>
            <b-card-text v-if="isWordCharacter" class="lead text-center">
              {{ countAnswer }}
            </b-card-text>
            <audio
              ref="audio"
              v-if="
                form.attachment &&
                  (form.attachment.type === 'listen_and_answer' ||
                    form.attachment.type === 'picture_listening_and_answer') &&
                  form.attachment.item &&
                  form.attachment.item.audio
              "
              @timeupdate="onAudioTimeUpdate"
              controls
              class="d-none"
            >
              <source :src="form.attachment.item.audio" type="audio/ogg" />
              <source :src="form.attachment.item.audio" type="audio/mpeg" />
            </audio>

            <div
              v-if="
                form.attachment &&
                  form.attachment.item &&
                  form.attachment.item.characters &&
                  form.attachment.type === 'word_character'
              "
              class="learn-word-flash-card-detail-type-word-character-wrap"
            >
              <div
                v-if="answer.text"
                v-for="answer in form.attachment.item.characters"
                :key="answer.key"
                class="learn-word-flash-card-detail-type-word-character"
              >
                {{ answer.text }}
              </div>
              <button class="btn btn-primary btn-pill btn-block mt-4">
                Kiểm tra
              </button>
            </div>
            <div
              v-if="
                form.attachment &&
                  form.attachment.item &&
                  form.attachment.item.answers &&
                  (form.attachment.type === 'listen_and_answer' ||
                    form.attachment.type === 'video_and_answer' ||
                    form.attachment.type === 'quiz_and_answer')
              "
              class="learn-word-flash-card-detail-type-word-character-wrap"
            >
              <b-card-title
                v-if="
                  form.attachment.item.answers.length > 0 &&
                    form.attachment.item.answers[0].text
                "
                class="card-title lead font-weight-bold text-center text-primary mt-3 mb-3"
              >
                <h3>Đáp án đúng là gì?</h3>
              </b-card-title>
              <button
                v-if="answer.text"
                v-for="answer in form.attachment.item.answers"
                :key="answer.key"
                class="btn btn-primary btn-pill btn-block"
              >
                {{ answer.text }}
              </button>
            </div>
            <div
              v-if="
                form.attachment &&
                  form.attachment.item &&
                  form.attachment.item.answers &&
                  (form.attachment.type === 'picture_and_answer' ||
                    form.attachment.type === 'picture_listening_and_answer')
              "
              class="learn-word-flash-card-detail-type-word-character-wrap"
            >
              <b-card-title
                v-if="form.attachment.item.answers.length > 0"
                class="card-title lead font-weight-bold text-center text-primary mt-3 mb-3"
              >
                <h3>Bức tranh đúng là gì?</h3>
              </b-card-title>
              <div class="row">
                <div v-for="item in form.attachment.item.answers" class="col-6">
                  <img
                    :src="item.url"
                    style="padding:5px;background-color: white;max-width: 200px;cursor: pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </the-portlet>
  </div>
</template>

<style scoped>
.learn-word-flash-card-detail {
  background-color: white;
  z-index: 1000;
  padding-bottom: 24px;
  margin-bottom: 20px;
  padding-top: 5px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-top: -7px;
  display: inline-block;
  background-color: white;
  width: 100%;
}
.audio-custom {
  height: 30px;
  width: 90%;
  margin: 0px 12px;
}
.learn-word-flash-card-start-audio {
  position: absolute;
  top: 80px;
  left: 20px;
  margin: 20px;
  width: 250px;
  height: 100px;
  overflow: hidden;
  z-index: 1000000;
}
.learn-word-flash-card-quiz {
  position: absolute;
  top: 40px;
  left: 20px;
  margin: 20px;
  width: 250px;
  height: 120px;
  overflow: hidden;
  z-index: 1000000;
}
.learn-word-flash-card-detail-type-word-character-wrap {
  background-color: #dde2ed;
  padding: 10px;
  text-align: center;
}
.learn-word-flash-card-detail-type-word-character {
  background-color: white;
  border-radius: 10px;
  padding: 10px 15px;
  display: inline-block;
  margin: 5px;
}
</style>

<script>
import ThePortlet from '~/components/base/ThePortlet'

export default {
  name: 'LearnWordFlashcardDetail',
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
          this.form.attachment.type === 'word_character') ||
        (this.form.attachment &&
          this.form.attachment.item &&
          this.form.attachment.item.background &&
          this.form.attachment.type === 'word_character')
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
    },
    countAnswer() {
      if (
        this.form.attachment &&
        this.form.attachment.item &&
        this.form.attachment.item.characters &&
        this.form.attachment.type === 'word_character'
      ) {
        let underlineAnswer = ''
        for (let i = 0; i < this.form.attachment.item.characters.length; i++) {
          underlineAnswer += '_ '
        }
        return underlineAnswer
      } else {
        return ''
      }
    },
    isWordCharacter() {
      if (
        this.form.attachment &&
        this.form.attachment.type === 'word_character'
      ) {
        return true
      } else {
        return false
      }
    },
    isListenAndAnswer() {
      if (
        this.form.attachment &&
        this.form.attachment.type === 'listen_and_answer'
      ) {
        return true
      } else {
        return false
      }
    },
    isPictureAndAnswer() {
      if (
        this.form.attachment &&
        this.form.attachment.type === 'picture_and_answer'
      ) {
        return true
      } else {
        return false
      }
    },
    isQuizAndAnswer() {
      if (
        this.form.attachment &&
        this.form.attachment.type === 'quiz_and_answer'
      ) {
        return true
      } else {
        return false
      }
    },
    isPictureListenAndAnswer() {
      if (
        this.form.attachment &&
        this.form.attachment.type === 'picture_listening_and_answer'
      ) {
        return true
      } else {
        return false
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
      console.log('audio-start')
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
