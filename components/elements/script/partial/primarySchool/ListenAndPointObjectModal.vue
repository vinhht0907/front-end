<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    cancel-title="Đóng"
    title="Thông tin object"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-single-image-upload-with-validation
        :required="true"
        v-model="form.url"
        accept="image/png"
        rules="required"
        label="Ảnh(png)"
        name="url"
      />
      <b-single-audio-upload-with-validation
        @getDuration="getDuration"
        :required="true"
        v-model="form.audio"
        rules="required"
        label="Audio phát âm"
        name="audio"
      />
      <b-text-input-with-validation
        v-model="form.text"
        :required="true"
        label="Text"
        placeholder="Text"
        rules="required"
        name="text"
      />
      <b-text-input-with-validation
        v-model="form.pronunciation"
        label="Phát âm"
        placeholder="Phát âm"
        name="text"
      />
      <base-input-score v-if="hasScore" v-model="form.score" />
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
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'

const defaultForm = {
  url: '',
  audio: '',
  text: '',
  duration: null
}
export default {
  name: 'ListenAndPointObjectModal',
  components: {
    BaseInputScore,
    BTextInputWithValidation,
    BSingleAudioUploadWithValidation,
    BSingleImageUploadWithValidation,
    ValidationObserver
  },
  props: {
    hasScore: {
      type: Boolean,
      default: false
    }
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
        const img = new Image()

        img.src = this.form.url

        img.onload = () => {
          this.form.width = (img.naturalWidth * 0.75) / 1080
          this.form.height = (img.naturalHeight * 0.75) / 810
          this.$emit('submit', this.form)
        }

        this.$refs.modal.hide()
      }
    },
    hideButton() {
      this.$refs.modal.hide()
    },
    handleDelete() {
      this.$refs.modal.hide()
      this.$emit('delete', this.form)
    },
    getDuration(duration) {
      this.form.duration = duration
    }
  }
}
</script>
