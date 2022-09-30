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
    <base-input-score v-model="innerValue.score" />
    <base-single-image-answer v-model="innerValue.answers" />
  </div>
</template>

<script>
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BaseSingleImageAnswer from '~/components/elements/script/base/BaseSingleImageAnswer'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
export default {
  name: 'ListenAndCheckItem',
  components: {
    BSingleAudioUploadWithValidation,
    BaseSingleImageAnswer,
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
