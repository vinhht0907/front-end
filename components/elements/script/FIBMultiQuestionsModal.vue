<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Fill in blank multi questions"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <script-attachment
            v-model="form.attachment"
            :list-display="['none', 'image', 'audio', 'video']"
            label="Tập tin đính kèm"
          />
          <f-i-b-multi-questions-list v-model="form.items" />
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
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'
import FIBMultiQuestionsList from '~/components/elements/script/partial/FIBMultiQuestionsList'
import FIBMultipartPreview from '~/components/elements/script/preview/FIBMultipartPreview'

const defaultForm = {
  items: null
}
export default {
  name: 'FIBMultiQuestionsModal',
  components: {
    FIBMultiQuestionsList,
    ScriptAttachment,
    FIBMultipartPreview,
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
