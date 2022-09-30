<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @hidden="handleModalHide"
    cancel-title="Đóng"
    title="Thông tin các object"
    size="xl"
  >
    <validation-observer ref="observer" class="kt-form">
      <listen-and-repeat-item
        v-model="form"
        class="list-item-script__item mb-2 px-3 py-2"
      />
    </validation-observer>
    <template #modal-footer>
      <div class="w-100">
        <div class="float-left">
          <b-button @click="deleteObject" variant="danger">
            Xóa
          </b-button>
        </div>
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
import randomstring from 'randomstring'
import ListenAndRepeatItem from '~/components/elements/script/partial/primarySchool/ListenAndRepeatItem'

const defaultForm = {
  audio: '',
  text: '',
  score: '',
  x: 0,
  y: 0,
  id: ''
}
export default {
  name: 'ListenAndRepeat2ObjectsModal',
  components: {
    ListenAndRepeatItem,
    ValidationObserver
  },
  props: {
    backgroundHeight: {
      type: Number,
      default: 0
    },
    defaultTextSize: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      position: 0
    }
  },
  methods: {
    show(item, index) {
      this.position = index
      if (item) {
        this.form = cloneDeep(item)
      } else {
        this.form = cloneDeep(defaultForm)
        this.form.id = randomstring.generate()
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
        this.form.y =
          (this.position * this.defaultTextSize) / this.backgroundHeight
        this.$emit('submit', this.form)
        this.$refs.modal.hide()
      }
    },
    handleModalHide() {
      this.form = cloneDeep(defaultForm)
    },
    hideButton() {
      this.$refs.modal.hide()
    },
    getDuration(duration) {
      this.form.duration = duration
    },
    deleteObject() {
      this.$emit('deleteObject', this.form)
      this.$refs.modal.hide()
    }
  }
}
</script>
