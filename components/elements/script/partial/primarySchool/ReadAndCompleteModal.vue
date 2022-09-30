<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Read and complete"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <b-text-area-with-validation
            :required="true"
            v-model="form.content"
            label="Text - ký tự [] sẽ được thay bằng _____"
            placeholder="My school started in []."
            rules="required"
            name="content"
          />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview h-100 w-100">
          <f-i-b-multipart-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import FIBMultipartPreview from '~/components/elements/script/preview/FIBMultipartPreview'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

const defaultForm = {
  content: ''
}
export default {
  name: 'ReadAndCompleteModal',
  components: {
    FIBMultipartPreview,
    ValidationObserver,
    BTextAreaWithValidation
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
