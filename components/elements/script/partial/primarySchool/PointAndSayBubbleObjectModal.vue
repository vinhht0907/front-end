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

      <base-input-score v-model="form.score" />
      <point-and-say-bubble-list
        v-model="form.answers"
        :questions="questions"
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
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import PointAndSayBubbleList from '~/components/elements/script/partial/primarySchool/PointAndSayBubbleList'

const defaultForm = {
  url: '',
  audio: '',
  answers: [],
  duration: null
}
export default {
  name: 'PointAndSayBubbleObjectModal',
  components: {
    PointAndSayBubbleList,
    BaseInputScore,
    BSingleImageUploadWithValidation,
    ValidationObserver
  },
  props: {
    questions: {
      type: Array,
      required: true
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
        if (!this.form.answers) {
          this.$set(this.form, 'answers', [])
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
