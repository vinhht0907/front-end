<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Điền vào chỗ trống với từ có sẵn"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <f-i-b-with-given-word-attachment v-model="form.attachment" />
          <f-i-b-with-given-word-list v-model="form.items" />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview h-100 w-100">
          <f-i-b-with-given-word-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import FIBWithGivenWordAttachment from '~/components/elements/script/partial/FIBWithGivenWordAttachment'
import FIBWithGivenWordList from '~/components/elements/script/partial/FIBWithGivenWordList'
import FIBWithGivenWordPreview from '~/components/elements/script/preview/FIBWithGivenWordPreview'

const defaultForm = {
  items: null
}
export default {
  name: 'FIBWithGivenWordModal',
  components: {
    FIBWithGivenWordPreview,
    FIBWithGivenWordList,
    FIBWithGivenWordAttachment,
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
      if (!this.form.attachment) {
        this.form.attachment = { type: 'none' }
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
        this.$emit('updateScript', this.form)
        this.$refs.modal.hide()
      }
    }
  }
}
</script>
