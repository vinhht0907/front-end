<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Nghe và trả lời"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
          <b-single-audio-upload-with-validation
            :required="true"
            v-model="form.audio"
            rules="required"
            label="File ghi âm đoạn văn"
          />
          <b-text-input-with-validation
            v-model="form.transcript.title"
            :required="true"
            label="Tiêu đề đoạn văn"
            placeholder="Tiêu đề đoạn văn"
            rules="required"
            name="title"
          />
          <b-text-area-with-validation
            v-model="form.transcript.content"
            :required="true"
            label="Nội dung đoạn văn"
            placeholder="Nội dung đoạn văn"
            rules="required"
            name="content"
          />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <listen-and-answer-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import ListenAndAnswerPreview from '~/components/elements/script/preview/ListenAndAnswerPreview'

const defaultForm = {
  title: '',
  transcript: {
    title: '',
    content: ''
  }
}
export default {
  name: 'ListenAndAnswerModal',
  components: {
    BTextAreaWithValidation,
    BTextInputWithValidation,
    ListenAndAnswerPreview,
    BSingleAudioUploadWithValidation,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm)
    }
  },
  methods: {
    show(item) {
      if (!item.transcript) {
        item.transcript = {}
      }
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
