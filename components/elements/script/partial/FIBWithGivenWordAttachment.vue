<template>
  <div>
    <b-form-group label="Loại tập tin">
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
      <b-single-image-upload-with-validation
        v-if="type === 'image'"
        :required="true"
        v-model="imageValue"
        rules="required"
        label="Ảnh minh họa"
        placeholder="Ảnh minh họa"
      />
      <b-single-video-upload-with-validation
        v-else-if="type === 'video'"
        :required="true"
        v-model="videoValue"
        rules="required"
        label="Video minh họa"
      />
      <base-audio-background
        v-else-if="type === 'audio_background'"
        v-model="audioValue"
      />
    </b-form-group>
  </div>
</template>

<script>
import BaseAudioBackground from '~/components/elements/script/base/BaseAudioBackground'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BSingleVideoUploadWithValidation from '~/components/base/input/BSingleVideoUploadWithValidation'
export default {
  name: 'FIBWithGivenWordAttachment',
  components: {
    BaseAudioBackground,
    BSingleImageUploadWithValidation,
    BSingleVideoUploadWithValidation
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
      type: 'none',
      options: [
        { type: 'none', name: 'None' },
        { type: 'image', name: 'Hình ảnh' },
        { type: 'video', name: 'Video' },
        { type: 'audio_background', name: 'Audio' }
      ]
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
        this.$emit('input', { type: 'audio_background', item: newVal })
      } else {
        this.$emit('input', null)
      }
    },
    videoValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'video', path: newVal })
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
        case 'audio_background':
          this.audioValue
            ? this.$emit('input', {
                type: 'audio_background',
                item: this.audioValue
              })
            : this.$emit('input', null)
          break
        case 'video':
          this.videoValue
            ? this.$emit('input', { type: 'video', path: this.videoValue })
            : this.$emit('input', null)
          break
        case 'none':
          this.$emit('input', { type: 'none' })
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
            this.imageValue = this.value.path
            break
          case 'audio_background':
            this.audioValue = this.value.item
            break
          case 'video':
            this.videoValue = this.value.path
            break
        }
      }
    }
  }
}
</script>
