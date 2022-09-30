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

    <b-form-group v-bind="$attrs" class="mb-0">
      <flashcard-attachment-image
        v-if="type === 'image'"
        v-model="imageValue"
        v-bind="$attrs"
      />
      <flashcard-attachment-audio
        v-else-if="type === 'audio'"
        v-model="audioValue"
        v-bind="$attrs"
      />
      <flashcard-attachment-video
        v-else-if="type === 'video'"
        v-model="videoValue"
        v-bind="$attrs"
      />
      <flashcard-attachment-definition
        v-else-if="type === 'definition'"
        v-model="definitionValue"
        v-bind="$attrs"
      />
    </b-form-group>
  </div>
</template>

<script>
import FlashcardAttachmentAudio from './FlashcardAttachmentAudio'
import FlashcardAttachmentDefinition from './FlashcardAttachmentDefinition'
import FlashcardAttachmentImage from './FlashcardAttachmentImage'
import FlashcardAttachmentVideo from './FlashcardAttachmentVideo'
export default {
  name: 'FlashcardAttachment',
  components: {
    FlashcardAttachmentAudio,
    FlashcardAttachmentDefinition,
    FlashcardAttachmentImage,
    FlashcardAttachmentVideo
  },
  props: {
    value: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      imageValue: null,
      audioValue: null,
      videoValue: null,
      definitionValue: null,
      type: 'image',
      options: [
        { type: 'image', name: 'Hình ảnh' },
        { type: 'audio', name: 'Audio' },
        { type: 'video', name: 'Video' },
        { type: 'definition', name: 'Definition' }
      ]
    }
  },
  watch: {
    imageValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'image', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    audioValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'audio', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    videoValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'video', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    definitionValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'definition', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    type(newVal) {
      switch (newVal) {
        case 'image':
          this.imageValue
            ? this.$emit('input', { type: 'image', item: this.imageValue })
            : this.$emit('input', null)
          break
        case 'audio':
          this.audioValue
            ? this.$emit('input', { type: 'audio', item: this.audioValue })
            : this.$emit('input', null)
          break
        case 'video':
          this.videoValue
            ? this.$emit('input', { type: 'video', item: this.videoValue })
            : this.$emit('input', null)
          break
        case 'definition':
          this.definitionValue
            ? this.$emit('input', {
                type: 'definition',
                item: this.definitionValue
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
          case 'image':
            this.imageValue = this.value.item
            break
          case 'audio':
            this.audioValue = this.value.item
            break
          case 'video':
            this.videoValue = this.value.item
            break
          case 'definition':
            this.definitionValue = this.value.item
            break
        }
      }
    }
  }
}
</script>
