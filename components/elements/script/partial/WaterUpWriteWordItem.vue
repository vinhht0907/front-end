<template>
  <div>
    <b-single-image-upload-with-validation
      :required="true"
      v-model="innerValue.image"
      rules="required"
      label="Ảnh minh họa"
    />
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.answer"
      label="Câu trả lời"
      placeholder="Câu trả lời"
      name="answer"
      rules="required"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
export default {
  name: 'WaterUpItemSingleChoiceItem',
  components: {
    BTextInputWithValidation,
    BaseInputScore,
    BSingleImageUploadWithValidation
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
  }
}
</script>
