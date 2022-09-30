<template>
  <div>
    <b-single-image-upload-with-validation
      :required="true"
      v-model="innerValue.image"
      rules="required"
      label="Ảnh"
      name="image"
    />
    <b-text-area-with-validation
      :required="true"
      v-model="innerValue.text"
      label="Text - ký tự [] sẽ được thay bằng _____. Nội dung đặt giữa <> sẽ được in đậm."
      placeholder="My school started in []."
      name="content"
      rules="required"
    />
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
export default {
  name: 'LookAndWriteItem',
  components: {
    BTextAreaWithValidation,
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
