<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    cancel-title="Đóng"
    title="Câu hỏi"
    size="xl"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-single-audio-upload-with-validation
        v-model="form.audio"
        :required="true"
        label="Audio"
        name="audio"
      />
    </validation-observer>
    <template #modal-footer>
      <div class="w-100">
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
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'

const defaultForm = {
  audio: ''
}
export default {
  name: 'LookListenAndNumberObjectModal',
  components: {
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
      if (item) {
        this.form = cloneDeep(item)
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
    }
  }
}
</script>
