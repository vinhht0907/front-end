<template>
  <div class="row">
    <div class="col-md-12">
      <b-single-image-upload-with-validation
        :required="true"
        v-model="innerValue.image"
        rules="required"
        label="Ảnh minh họa"
        placeholder="Ảnh minh họa"
      />
    </div>
    <div class="col-md-12">
      <b-text-input-with-validation
        v-model="innerValue.sentence"
        :required="true"
        label="Câu đọc"
        placeholder="Câu đọc"
        name="sentence"
        rules="required"
      />
    </div>
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
export default {
  name: 'LWByFlashcardAttachmentSpeakSentence',
  components: {
    BSingleImageUploadWithValidation,
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
  }
}
</script>
