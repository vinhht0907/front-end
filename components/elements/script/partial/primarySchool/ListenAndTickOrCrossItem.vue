<template>
  <div>
    <b-single-audio-upload-with-validation
      @getDuration="getDuration"
      :required="true"
      v-model="innerValue.audio"
      rules="required"
      label="Audio phát âm"
      name="audio"
    />
    <b-single-image-upload-with-validation
      v-model="innerValue.image"
      required
      rules="required"
      label="Ảnh"
      name="image"
    />
    <checkbox-with-validate
      v-model="innerValue.isCorrect"
      required
      rules="required"
      label="Đúng hay sai"
      name="isCorrect"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import CheckboxWithValidate from '~/components/base/input/CheckboxWithValidate'
export default {
  name: 'ListenAndTickOrCrossItem',
  components: {
    CheckboxWithValidate,
    BSingleAudioUploadWithValidation,
    BSingleImageUploadWithValidation,
    BaseInputScore
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
