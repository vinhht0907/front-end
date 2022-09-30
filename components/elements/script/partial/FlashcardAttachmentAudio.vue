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
      <b-single-audio-upload-with-validation
        :required="true"
        v-model="innerValue.audio"
        rules="required"
        label="Audio mô tả"
      />
    </div>
    <div class="col-md-12">
      <b-text-input-with-validation
        :required="true"
        v-model="innerValue.sentence"
        label="Câu mô tả"
        placeholder="Câu mô tả"
        rules="required"
        name="sentence"
      />
    </div>
    <div class="col-md-12">
      <b-text-input-with-validation
        :required="true"
        v-model="innerValue.translation"
        label="Câu dịch"
        placeholder="Câu dịch"
        rules="required"
        name="translation"
      />
    </div>
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
export default {
  name: 'FlashcardAttachmentAudio',
  components: {
    BSingleImageUploadWithValidation,
    BSingleAudioUploadWithValidation,
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
