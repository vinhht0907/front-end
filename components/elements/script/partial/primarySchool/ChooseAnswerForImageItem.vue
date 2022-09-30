<template>
  <div>
    <b-single-image-upload-with-validation
      :required="true"
      v-model="innerValue.path"
      rules="required"
      label="Ảnh"
      name="path"
    />
    <b-editor-with-validation
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
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
export default {
  name: 'ChooseAnswerForImageItem',
  components: {
    BEditorWithValidation,
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
  }
}
</script>
