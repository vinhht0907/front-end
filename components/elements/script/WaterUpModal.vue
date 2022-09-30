<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Water up"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
          <b-text-input-with-validation
            v-model="form.number_lives"
            label="Số mạng"
            placeholder="Số mạng"
            rules="numeric|max_value:99"
            name="number_lives"
          />
          <b-time-input-with-validation
            v-model="form.time"
            label="Thời gian"
            placeholder="mm:ss"
          />
          <water-up-list v-model="form.items" />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <l-w-by-flashcard-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import WaterUpList from '~/components/elements/script/partial/WaterUpList'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTimeInputWithValidation from '~/components/base/input/BTimeInputWithValidation'
import LWByFlashcardPreview from '~/components/elements/script/preview/LWByFlashcardPreview'

const defaultForm = {
  items: null
}
export default {
  name: 'WaterUpModal',
  components: {
    WaterUpList,
    BTextInputWithValidation,
    BTimeInputWithValidation,
    LWByFlashcardPreview,
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
