<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    cancel-title="Đóng"
    title="Câu hỏi"
    size="xl"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-radio-with-validation
        v-model="form.type"
        :options="options"
        :required="true"
        label="Loại"
        rules="required"
        name="text"
        class="pt-2 theme-custom-radio"
        value-field="type"
        text-field="name"
        size="lg"
      />
      <b-text-input-with-validation
        v-model="form.text"
        :required="true"
        :label="
          form.type === 'text'
            ? 'Text'
            : 'Câu hỏi - ký tự [] sẽ được thay bằng _____'
        "
        placeholder="I like []."
        rules="required"
        name="text"
      />
      <b-single-audio-upload-with-validation
        v-if="form.type === 'text'"
        v-model="form.audio"
        :required="true"
        rules="required"
        label="Audio"
      />
    </validation-observer>
    <template #modal-footer>
      <div class="w-100">
        <b-button
          v-if="form.id"
          @click="handleDelete"
          variant="danger"
          class="float-left"
        >
          Xóa
        </b-button>
        <div class="float-right">
          <b-button @click="hideButton">
            Đóng
          </b-button>
          <b-button @click="handleModalOk" variant="primary">
            Đồng ý
          </b-button>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BRadioWithValidation from '~/components/base/input/BRadioWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'

const defaultForm = {
  text: '',
  x: 0,
  y: 0
}
export default {
  name: 'PointAndSayBubbleTextModal',
  components: {
    BSingleAudioUploadWithValidation,
    BRadioWithValidation,
    BTextInputWithValidation,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      options: [
        { type: 'text', name: 'Text' },
        { type: 'question', name: 'Question' }
      ]
    }
  },
  methods: {
    show(item) {
      if (item) {
        this.form = cloneDeep(item)
        if (!this.form.type) {
          this.$set(this.form, 'type', 'question')
        }
      }

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
        this.$refs.modal.hide()
        this.$emit('submit', this.form)
      }
    },
    hideButton() {
      this.$refs.modal.hide()
    },
    handleDelete() {
      this.$refs.modal.hide()
      this.$emit('delete', this.form)
    }
  }
}
</script>
