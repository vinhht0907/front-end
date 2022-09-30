<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Look and repeat letter word sentence"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <look-and-repeat-letter-word-sentence-list v-model="form.objects" />
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
import LookAndRepeatLetterWordSentenceList from '~/components/elements/script/partial/primarySchool/LookAndRepeatLetterWordSentenceList'

const defaultForm = {
  objects: null
}
export default {
  name: 'LookAndRepeatLetterWordSentence',
  components: {
    FIBMultipartPreview,
    ValidationObserver,
    LookAndRepeatLetterWordSentenceList
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
