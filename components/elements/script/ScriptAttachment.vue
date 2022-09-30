<template>
  <div>
    <b-form-group label="Loại tập tin">
      <b-form-radio-group
        :options="displayOptions"
        v-model="type"
        class="pt-2 theme-custom-radio"
        value-field="type"
        text-field="name"
        size="lg"
      ></b-form-radio-group>
    </b-form-group>

    <b-single-image-upload-with-validation
      v-if="type === 'image'"
      v-model="imageValue"
      :required="true"
      rules="required"
      label="Tập tin đính kèm"
    />
    <div v-if="type === 'audio'">
      <b-single-audio-upload-with-validation
        v-model="audioValue"
        :required="true"
        rules="required"
        label="Tập tin đính kèm"
      />
      <b-text-area-with-validation
        v-if="isTranscript"
        v-model="transcript"
        label="Bản dịch"
        placeholder="Bản dịch"
        name="transcript"
      />
    </div>

    <b-single-video-upload-with-validation
      v-if="type === 'video'"
      v-model="videoValue"
      :required="true"
      rules="required"
    />
    <reading-attachment
      v-if="type === 'reading'"
      v-model="readingValue"
      :image-reading="imageReading"
    />
    <b-form-group v-if="type === 'flashcard'">
      <script-flashcard-attachment-list v-model="flashcardValue" />
    </b-form-group>
  </div>
</template>

<script>
import BSingleVideoUploadWithValidation from '~/components/base/input/BSingleVideoUploadWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import ReadingAttachment from '~/components/elements/script/ReadingAttachment'
import ScriptFlashcardAttachmentList from '~/components/elements/script/partial/ScriptFlashcardAttachmentList'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
export default {
  name: 'ScriptAttachment',
  components: {
    BTextAreaWithValidation,
    ScriptFlashcardAttachmentList,
    ReadingAttachment,
    BSingleVideoUploadWithValidation,
    BSingleImageUploadWithValidation,
    BSingleAudioUploadWithValidation
  },
  props: {
    value: {
      type: null,
      default: null
    },
    typeValue: {
      type: String,
      default: 'none'
    },
    imageReading: {
      type: Boolean,
      default: true
    },
    listDisplay: {
      type: Array,
      default: () => ['image', 'audio', 'video', 'reading', 'flashcard']
    },
    isTranscript: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageValue: null,
      audioValue: null,
      videoValue: null,
      readingValue: null,
      flashcardValue: [],
      transcript: '',
      type: 'none',
      options: [
        { type: 'none', name: 'None' },
        { type: 'image', name: 'Hình ảnh' },
        { type: 'audio', name: 'Audio' },
        { type: 'video', name: 'Video' },
        { type: 'reading', name: 'Reading' },
        { type: 'flashcard', name: 'Flashcard' }
      ]
    }
  },
  computed: {
    displayOptions() {
      const options = this.options.filter((item) => {
        return this.listDisplay.includes(item.type)
      })
      return options
    }
  },
  watch: {
    imageValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'image', path: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    audioValue(newVal) {
      if (newVal) {
        this.$emit('input', {
          type: 'audio',
          path: newVal,
          transcript: this.transcript
        })
      } else {
        this.$emit('input', null)
      }
    },
    transcript(newVal) {
      this.$emit('input', {
        type: 'audio',
        path: this.audioValue,
        transcript: this.transcript
      })
    },
    videoValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'video', path: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    readingValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'reading', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    flashcardValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'flashcard', items: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    type(newVal) {
      switch (newVal) {
        case 'image':
          this.imageValue
            ? this.$emit('input', { type: 'image', path: this.imageValue })
            : this.$emit('input', null)
          break
        case 'audio':
          this.audioValue
            ? this.$emit('input', {
                type: 'audio',
                path: this.audioValue,
                transcript: this.transcript
              })
            : this.$emit('input', null)
          break
        case 'video':
          this.videoValue
            ? this.$emit('input', { type: 'video', path: this.videoValue })
            : this.$emit('input', null)
          break
        case 'reading':
          this.readingValue
            ? this.$emit('input', { type: 'reading', item: this.readingValue })
            : this.$emit('input', null)
          break
        case 'flashcard':
          this.flashcardValue
            ? this.$emit('input', {
                type: 'flashcard',
                items: this.flashcardValue
              })
            : this.$emit('input', null)
          break
        case 'none':
          this.$emit('input', { type: 'none' })
          break
      }
    }
  },
  created() {
    this.initValue()
  },
  methods: {
    initValue() {
      this.type = this.typeValue
      if (this.value) {
        this.type = this.value.type

        switch (this.value.type) {
          case 'image':
            this.imageValue = this.value.path
            break
          case 'audio':
            this.audioValue = this.value.path
            this.transcript = this.value.transcript
            break
          case 'video':
            this.videoValue = this.value.path
            break
          case 'reading':
            this.readingValue = this.value.item
            break
          case 'flashcard':
            this.flashcardValue = this.value.items
            break
        }
      }
    }
  }
}
</script>
