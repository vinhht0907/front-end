<template>
  <div class="row">
    <div class="col-md-12">
      <b-single-image-upload-with-validation
        v-if="imageReading"
        v-model="innerValue.image"
        label="Ảnh bài đọc"
        placeholder="Ảnh bài đọc"
      />
    </div>
    <div class="col-md-12">
      <b-text-input-with-validation
        v-model="innerValue.title"
        label="Tiêu đề bài đọc"
        placeholder="Tiêu đề bài đọc"
        name="title"
      />
    </div>
    <div class="col-md-12">
      <b-editor-with-validation
        :required="true"
        v-model="innerValue.content"
        label="Nội dung bài đọc"
        placeholder="Nội dung bài đọc"
        rules="required"
        name="content"
      />
    </div>
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
export default {
  name: 'ReadingAttachment',
  components: {
    BEditorWithValidation,
    BSingleImageUploadWithValidation,
    BTextInputWithValidation
  },
  props: {
    value: {
      type: Object,
      default: () => null
    },
    imageReading: {
      type: Boolean,
      default: true
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
        this.innerValue = {
          title: '',
          content: '',
          image: ''
        }
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = {
        title: '',
        content: '',
        image: ''
      }
    }
  }
}
</script>
