<template>
  <div class="row">
    <div class="col-md-12">
      <b-single-image-upload-with-validation
        :required="true"
        v-model="innerValue.image"
        rules="required"
        label="Ảnh minh họa"
      />
    </div>
    <div class="col-md-12">
      <base-single-answer v-model="innerValue.answers" />
    </div>
  </div>
</template>

<script>
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BaseSingleAnswer from '~/components/elements/script/base/BaseSingleAnswer'
export default {
  name: 'LWByFlashcardAttachmentPictureAndAnswer',
  components: {
    BaseSingleAnswer,
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
