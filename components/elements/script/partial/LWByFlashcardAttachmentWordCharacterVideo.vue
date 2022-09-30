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
      <base-multi-sort-answer
        v-model="innerValue.characters"
        label="Trường này"
        placeholder="Nhập ký tự..."
        rules="required|max:1"
        btn-label="Thêm ký tự"
      />
    </div>
  </div>
</template>

<script>
import BaseMultiSortAnswer from '~/components/elements/script/base/BaseMultiSortAnswer'
import BSingleVideoUploadWithValidation from '~/components/base/input/BSingleVideoUploadWithValidation'
export default {
  name: 'LWByFlashcardAttachmentWordCharacterVideo',
  components: {
    BSingleVideoUploadWithValidation,
    BaseMultiSortAnswer
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
