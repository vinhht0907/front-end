<template>
  <div>
    <b-single-image-upload-with-validation
      :required="true"
      v-model="innerValue.path"
      rules="required"
      label="Ảnh"
      name="path"
    />
    <b-single-audio-upload-with-validation
      @getDuration="getDuration"
      :required="true"
      v-model="innerValue.audio"
      rules="required"
      label="Audio phát âm"
      name="audio"
    />
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.text"
      label="Text"
      placeholder="Text"
      name="text"
      rules="required"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
export default {
  name: 'LetsTalkItem',
  components: {
    BSingleImageUploadWithValidation,
    BSingleAudioUploadWithValidation,
    BaseInputScore,
    BTextInputWithValidation
  },
  props: {
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      innerValue: null
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value(val) {
      if (val) {
        this.innerValue = val
      } else {
        this.innerValue = {}
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = {}
    }
  },
  methods: {
    getDuration(duration) {
      this.innerValue.duration = duration
    }
  }
}
</script>
