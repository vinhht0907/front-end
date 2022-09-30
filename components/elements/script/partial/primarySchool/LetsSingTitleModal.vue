<template>
  <b-modal
    ref="letsSingTitleModal"
    :no-enforce-focus="true"
    cancel-title="Đóng"
    title="Thông tin object"
    size="xl"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-summernote-with-validation
        v-model="form.title"
        :required="true"
        :toolbar="toolbar"
        :default-font-size="false"
        label="Tiêu đề"
        placeholder="Tiêu đề"
        rules="required"
        name="summary"
        class="summary-editor"
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
import BSummernoteWithValidation from '~/components/base/input/BSummernoteWithValidation'

const defaultForm = {
  title: '',
  x: 0,
  y: 0
}
export default {
  name: 'LetsSingTitleModal',
  components: {
    ValidationObserver,
    BSummernoteWithValidation
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      toolbar: [
        // [groupName, [list of button]]
        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
        ['color', ['color']]
      ]
    }
  },
  methods: {
    show(item) {
      if (item) {
        this.form = cloneDeep(item)
      }

      this.$nextTick(() => {
        this.$refs.letsSingTitleModal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$refs.letsSingTitleModal.hide()
        this.$emit('submit', this.form)
      }
    },
    hideButton() {
      this.$refs.letsSingTitleModal.hide()
    },
    setFocus() {
      setTimeout(() => {
        this.$refs.titleEditor.focus()
      }, 500)
    }
  }
}
</script>
