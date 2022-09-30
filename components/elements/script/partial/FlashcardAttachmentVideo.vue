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
      <b-text-input-with-validation
        :required="true"
        v-model="innerValue.wordMeaning"
        label="Nghĩa của từ"
        placeholder="Nghĩa của từ"
        rules="required"
        name="wordMeaning"
      />
    </div>
    <div class="col-md-12">
      <b-text-input-with-validation
        :required="true"
        v-model="innerValue.example"
        label="Ví dụ"
        placeholder="Ví dụ"
        rules="required"
        name="example"
      />
    </div>
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleVideoUploadWithValidation from '~/components/base/input/BSingleVideoUploadWithValidation'
export default {
  name: 'FlashcardAttachmentVideo',
  components: {
    BTextInputWithValidation,
    BSingleVideoUploadWithValidation
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
