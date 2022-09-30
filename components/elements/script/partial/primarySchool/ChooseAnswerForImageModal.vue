<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Choose answer for image"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <checkboxes-with-validation
            v-model="form.is_long_answer"
            label="Đáp án loại dài"
            placeholder="Đáp án loại dài"
            name="is_long_answer"
            switch
            size="lg"
          />
          <choose-answer-for-image-list v-model="form.items" />
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
import ChooseAnswerForImageList from '~/components/elements/script/partial/primarySchool/ChooseAnswerForImageList'
import CheckboxesWithValidation from '~/components/base/input/CheckboxesWithValidation'

const defaultForm = {
  items: null,
  is_long_answer: true
}
export default {
  name: 'ChooseAnswerForImageModal',
  components: {
    ChooseAnswerForImageList,
    FIBMultipartPreview,
    ValidationObserver,
    CheckboxesWithValidation
  },
  data() {
    return {
      form: cloneDeep(defaultForm)
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      if (
        this.form.is_long_answer === undefined ||
        this.form.is_long_answer === null
      ) {
        this.$set(this.form, 'is_long_answer', true)
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
