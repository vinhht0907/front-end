<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Flashcard"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <word-group-chosen
            :required="true"
            v-model="form.word_group"
            rules="required"
          />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview p-5 h-100 w-100">
          <flashcard-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import FlashcardPreview from '~/components/elements/script/preview/FlashcardPreview'
import WordGroupChosen from '~/components/elements/wordGroup/WordGroupChosen'

const defaultForm = {
  word_group: null
}
export default {
  name: 'FlashcardNewModal',
  components: {
    WordGroupChosen,
    FlashcardPreview,
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
