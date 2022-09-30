<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Learn Word flashcard"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <base-input-score v-model="form.score" />
          <l-w-by-flashcard-attachment v-model="form.attachment" />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview h-100 w-100">
          <learn-word-flashcard-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import LWByFlashcardAttachment from '~/components/elements/script/partial/LWByFlashcardAttachment'
import LearnWordFlashcardPreview from '~/components/elements/script/preview/LearnWordFlashcardPreview'

const defaultForm = {
  attachment: null
}
export default {
  name: 'LearnWordFlashcardModal',
  components: {
    LearnWordFlashcardPreview,
    LWByFlashcardAttachment,
    BaseInputScore,
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
