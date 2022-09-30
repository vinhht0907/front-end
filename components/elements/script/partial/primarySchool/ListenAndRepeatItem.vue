<template>
  <div>
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.text"
      label="Text"
      placeholder="Text"
      name="text"
      rules="required"
    />
    <b-single-audio-upload-with-validation
      @getDuration="getDuration"
      :required="true"
      v-model="innerValue.audio"
      rules="required"
      label="Audio"
      name="audio"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
export default {
  name: 'ListenAndRepeatItem',
  components: {
    BaseInputScore,
    BTextInputWithValidation,
    BSingleAudioUploadWithValidation
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
