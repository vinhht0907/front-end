<template>
  <div>
    <select2-with-validation
      :required="true"
      v-model="innerValue.question"
      :options="questionOptions"
      text-field="text"
      id-field="id"
      placeholder="Chọn câu hỏi..."
      label="Câu hỏi"
      data-vv-as="Câu hỏi"
      rules="required"
      name="question"
    />

    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.text"
      label="Câu trả lời | Câu trả lời có nhiều chỗ trống cách nhau bằng dấu |"
      placeholder="can|do"
      name="text"
      rules="required"
    />
    <b-single-audio-upload-with-validation
      :required="true"
      @getDuration="getDuration"
      v-model="innerValue.audio"
      label="Audio"
      name="audio"
      rules="required"
    />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'PointAndSayBubbleItem',
  components: {
    Select2WithValidation,
    BSingleAudioUploadWithValidation,
    BTextInputWithValidation
  },
  props: {
    value: {
      type: Object,
      default: () => null
    },
    questions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      innerValue: null
    }
  },
  computed: {
    questionOptions() {
      const options = []
      this.questions.forEach((v) => {
        if (v.type === 'question') {
          options.push({
            id: v.id,
            text: v.text
          })
        }
      })
      return options
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
