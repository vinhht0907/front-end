<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Fill in blank sentence with given words"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <b-single-image-upload-with-validation
            v-model="form.image"
            label="Ảnh minh họa"
            placeholder="Ảnh minh họa"
          />
          <b-text-area-with-validation
            v-model="form.question"
            :required="true"
            label="Câu hỏi - Câu trả lời sẽ có dạng [(câu trả lời đúng)/câu trả lời 1]{điểm số}"
            placeholder="My name [(is)/are/am]{2} Hang"
            rules="required"
            name="question"
            rows="6"
          />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview h-100 w-100">
          <f-i-b-sentence-with-given-word-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import FIBSentenceWithGivenWordPreview from '~/components/elements/script/preview/FIBSentenceWithGivenWordPreview'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'

const defaultForm = {
  question: ''
}
export default {
  name: 'FIBSentenceWithGivenWordModal',
  components: {
    BTextAreaWithValidation,
    FIBSentenceWithGivenWordPreview,
    BSingleImageUploadWithValidation,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm)
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$emit('updateScript', this.form)
        this.$refs.modal.hide()
      }
    }
  }
}
</script>
