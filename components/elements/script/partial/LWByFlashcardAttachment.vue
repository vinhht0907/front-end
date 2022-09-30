<template>
  <div>
    <b-form-group label="Loại flashcard">
      <b-form-radio-group
        :options="options"
        v-model="type"
        class="pt-2 theme-custom-radio"
        value-field="type"
        text-field="name"
        size="lg"
      ></b-form-radio-group>
    </b-form-group>

    <b-form-group v-bind="$attrs">
      <l-w-by-flashcard-attachment-word-character-image
        v-if="type === 'word_character_image'"
        v-model="wordCharacterImageValue"
        v-bind="$attrs"
      />
      <l-w-by-flashcard-attachment-word-character-video
        v-else-if="type === 'word_character_video'"
        v-model="wordCharacterVideoValue"
        v-bind="$attrs"
      />
      <l-w-by-flashcard-attachment-listen-and-answer
        v-else-if="type === 'listen_and_answer'"
        v-model="listenAndAnswerValue"
        v-bind="$attrs"
      />
      <l-w-by-flashcard-attachment-video-and-answer
        v-else-if="type === 'video_and_answer'"
        v-model="videoAndAnswerValue"
        v-bind="$attrs"
      />
      <l-w-by-flashcard-attachment-quiz-and-answer
        v-else-if="type === 'quiz_and_answer'"
        v-model="quizAndAnswerValue"
        v-bind="$attrs"
      />

      <l-w-by-flashcard-attachment-select-picture
        v-else-if="type === 'select_picture'"
        v-model="selectPictureValue"
        v-bind="$attrs"
      />

      <l-w-by-flashcard-attachment-select-picture-listening
        v-else-if="type === 'select_picture_listening'"
        v-model="selectPictureListeningValue"
        v-bind="$attrs"
      />

      <l-w-by-flashcard-attachment-speak-word
        v-else-if="type === 'speak_word'"
        v-model="speakWordValue"
        v-bind="$attrs"
      />

      <l-w-by-flashcard-attachment-speak-sentence
        v-else-if="type === 'speak_sentence'"
        v-model="speakSentenceValue"
        v-bind="$attrs"
      />

      <l-w-by-flashcard-attachment-picture-and-answer
        v-else-if="type === 'picture_and_answer'"
        v-model="pictureAndAnswerValue"
        v-bind="$attrs"
      />
    </b-form-group>
  </div>
</template>

<script>
import LWByFlashcardAttachmentWordCharacterImage from './LWByFlashcardAttachmentWordCharacterImage'
import LWByFlashcardAttachmentListenAndAnswer from './LWByFlashcardAttachmentListenAndAnswer'
import LWByFlashcardAttachmentVideoAndAnswer from './LWByFlashcardAttachmentVideoAndAnswer'
import LWByFlashcardAttachmentQuizAndAnswer from './LWByFlashcardAttachmentQuizAndAnswer'
import LWByFlashcardAttachmentSelectPicture from './LWByFlashcardAttachmentSelectPicture'
import LWByFlashcardAttachmentSelectPictureListening from './LWByFlashcardAttachmentSelectPictureListening'
import LWByFlashcardAttachmentSpeakWord from './LWByFlashcardAttachmentSpeakWord'
import LWByFlashcardAttachmentSpeakSentence from './LWByFlashcardAttachmentSpeakSentence'
import LWByFlashcardAttachmentWordCharacterVideo from './LWByFlashcardAttachmentWordCharacterVideo'
import LWByFlashcardAttachmentPictureAndAnswer from './LWByFlashcardAttachmentPictureAndAnswer'
export default {
  name: 'FlashcardAttachment',
  components: {
    LWByFlashcardAttachmentWordCharacterImage,
    LWByFlashcardAttachmentListenAndAnswer,
    LWByFlashcardAttachmentVideoAndAnswer,
    LWByFlashcardAttachmentQuizAndAnswer,
    LWByFlashcardAttachmentSelectPicture,
    LWByFlashcardAttachmentSpeakWord,
    LWByFlashcardAttachmentSpeakSentence,
    LWByFlashcardAttachmentWordCharacterVideo,
    LWByFlashcardAttachmentPictureAndAnswer,
    LWByFlashcardAttachmentSelectPictureListening
  },
  props: {
    value: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      wordCharacterImageValue: null,
      wordCharacterVideoValue: null,
      listenAndAnswerValue: null,
      videoAndAnswerValue: null,
      quizAndAnswerValue: null,
      selectPictureValue: null,
      selectPictureListeningValue: null,
      speakWordValue: null,
      speakSentenceValue: null,
      pictureAndAnswerValue: null,
      type: 'word_character_image',
      options: [
        { type: 'word_character_image', name: 'Word character image' },
        { type: 'word_character_video', name: 'Word character video' },
        { type: 'listen_and_answer', name: 'Listen and answer' },
        { type: 'video_and_answer', name: 'Video and answer' },
        { type: 'quiz_and_answer', name: 'Quiz and answer' },
        { type: 'picture_and_answer', name: 'Picture and answer' },
        { type: 'select_picture', name: 'Select picture' },
        {
          type: 'select_picture_listening',
          name: 'Select picture listening'
        },
        {
          type: 'speak_word',
          name: 'Speak word'
        },
        {
          type: 'speak_sentence',
          name: 'Speak sentence'
        }
      ]
    }
  },
  watch: {
    wordCharacterImageValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'word_character_image', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    wordCharacterVideoValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'word_character_video', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    listenAndAnswerValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'listen_and_answer', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    videoAndAnswerValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'video_and_answer', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    quizAndAnswerValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'quiz_and_answer', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    pictureAndAnswerValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'picture_and_answer', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    selectPictureValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'select_picture', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    selectPictureListeningValue(newVal) {
      if (newVal) {
        this.$emit('input', {
          type: 'select_picture_listening',
          item: newVal
        })
      } else {
        this.$emit('input', null)
      }
    },
    speakWordValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'speak_word', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    speakSentenceValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'speak_sentence', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    type(newVal) {
      switch (newVal) {
        case 'word_character_image':
          this.wordCharacterImageValue
            ? this.$emit('input', {
                type: 'word_character_image',
                item: this.wordCharacterImageValue
              })
            : this.$emit('input', null)
          break
        case 'word_character_video':
          this.wordCharacterVideoValue
            ? this.$emit('input', {
                type: 'word_character_video',
                item: this.wordCharacterVideoValue
              })
            : this.$emit('input', null)
          break
        case 'listen_and_answer':
          this.listenAndAnswerValue
            ? this.$emit('input', {
                type: 'listen_and_answer',
                item: this.listenAndAnswerValue
              })
            : this.$emit('input', null)
          break
        case 'video_and_answer':
          this.videoAndAnswerValue
            ? this.$emit('input', {
                type: 'video_and_answer',
                item: this.videoAndAnswerValue
              })
            : this.$emit('input', null)
          break
        case 'quiz_and_answer':
          this.quizAndAnswerValue
            ? this.$emit('input', {
                type: 'quiz_and_answer',
                item: this.quizAndAnswerValue
              })
            : this.$emit('input', null)
          break
        case 'picture_and_answer':
          this.pictureAndAnswerValue
            ? this.$emit('input', {
                type: 'picture_and_answer',
                item: this.pictureAndAnswerValue
              })
            : this.$emit('input', null)
          break
        case 'select_picture':
          this.selectPictureValue
            ? this.$emit('input', {
                type: 'select_picture',
                item: this.selectPictureValue
              })
            : this.$emit('input', null)
          break
        case 'select_picture_listening':
          this.selectPictureListeningValue
            ? this.$emit('input', {
                type: 'select_picture_listening',
                item: this.selectPictureListeningValue
              })
            : this.$emit('input', null)
          break
        case 'speak_word':
          this.speakWordValue
            ? this.$emit('input', {
                type: 'speak_word',
                item: this.speakWordValue
              })
            : this.$emit('input', null)
          break
        case 'speak_sentence':
          this.speakSentenceValue
            ? this.$emit('input', {
                type: 'speak_sentence',
                item: this.speakSentenceValue
              })
            : this.$emit('input', null)
          break
      }
    },
    value() {
      this.initValue()
    }
  },
  created() {
    this.initValue()
  },
  methods: {
    initValue() {
      if (this.value) {
        this.type = this.value.type

        switch (this.value.type) {
          case 'word_character_image':
            this.wordCharacterImageValue = this.value.item
            break
          case 'word_character_video':
            this.wordCharacterVideoValue = this.value.item
            break
          case 'listen_and_answer':
            this.listenAndAnswerValue = this.value.item
            break
          case 'video_and_answer':
            this.videoAndAnswerValue = this.value.item
            break
          case 'quiz_and_answer':
            this.quizAndAnswerValue = this.value.item
            break
          case 'picture_and_answer':
            this.pictureAndAnswerValue = this.value.item
            break
          case 'select_picture':
            this.selectPictureValue = this.value.item
            break
          case 'select_picture_listening':
            this.selectPictureListeningValue = this.value.item
            break
          case 'speak_word':
            this.speakWordValue = this.value.item
            break
          case 'speak_sentence':
            this.speakSentenceValue = this.value.item
            break
        }
      }
    }
  }
}
</script>
