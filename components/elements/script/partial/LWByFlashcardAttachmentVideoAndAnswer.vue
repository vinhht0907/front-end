<template>
  <div class="row">
    <div class="col-md-12">
      <b-single-video-upload-with-validation
        :required="true"
        v-model="innerValue.video"
        rules="required"
        label="Video minh họa"
      />
    </div>
    <div class="col-md-12">
      <base-single-answer v-model="innerValue.answers" />
    </div>
  </div>
</template>

<script>
import BaseSingleAnswer from '~/components/elements/script/base/BaseSingleAnswer'
import BSingleVideoUploadWithValidation from '~/components/base/input/BSingleVideoUploadWithValidation'
export default {
  name: 'LWByFlashcardAttachmentVideoAndAnswer',
  components: {
    BSingleVideoUploadWithValidation,
    BaseSingleAnswer
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
