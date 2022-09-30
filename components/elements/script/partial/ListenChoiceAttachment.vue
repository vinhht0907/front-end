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

    <b-form-group v-bind="$attrs" class="mb-0">
      <b-single-audio-upload-with-validation
        v-if="type === 'audio'"
        :required="true"
        v-model="audioValue"
        rules="required"
        label="Audio"
      />
      <b-single-video-upload-with-validation
        v-else-if="type === 'video'"
        :required="true"
        v-model="videoValue"
        rules="required"
        label="Video"
      />
    </b-form-group>
  </div>
</template>

<script>
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import BSingleVideoUploadWithValidation from '~/components/base/input/BSingleVideoUploadWithValidation'
export default {
  name: 'ListenChoiceAttachment',
  components: {
    BSingleAudioUploadWithValidation,
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
      audioValue: null,
      videoValue: null,
      type: 'audio',
      options: [
        { type: 'audio', name: 'Audio' },
        { type: 'video', name: 'Video' }
      ]
    }
  },
  watch: {
    audioValue(newVal) {
      if (newVal) {
        this.$emit('input', { type: 'audio', path: newVal })
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
    type(newVal) {
      switch (newVal) {
        case 'audio':
          this.audioValue
            ? this.$emit('input', { type: 'audio', path: this.audioValue })
            : this.$emit('input', null)
          break
        case 'video':
          this.videoValue
            ? this.$emit('input', { type: 'video', item: this.videoValue })
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
          case 'audio':
            this.audioValue = this.value.path
            break
          case 'video':
            this.videoValue = this.value.item
            break
        }
      }
    }
  }
}
</script>
