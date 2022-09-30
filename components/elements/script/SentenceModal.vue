<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Câu hội thoại đơn"
    size="xl"
  >
    <div class="row">
      <div class="col-md-7">
        <validation-observer ref="observer" class="kt-form">
          <b-text-input-with-validation
            v-model="form.title"
            label="Tiêu đề"
            placeholder="Tiêu đề"
            name="title"
          />
          <b-text-area-with-validation
            v-model="form.content"
            :required="true"
            label="Nội dung"
            placeholder="Nội dung"
            rules="required"
            name="content"
          />
          <script-attachment
            v-model="form.attachment"
            :list-display="[
              'none',
              'image',
              'audio',
              'video',
              'reading',
              'flashcard'
            ]"
            label="Tập tin đính kèm"
          />
          <script-action v-model="form.action" label="Hành động" />
        </validation-observer>
      </div>
      <div class="col-md-5">
        <div
          class="action-preview p-5 h-100 w-100"
          style="background-color: #F3F5F9;"
        >
          <sentence-preview :form="form" />
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'
import ScriptAction from '~/components/elements/script/ScriptAction'
import SentencePreview from '~/components/elements/script/preview/SentencePreview'

const defaultForm = {
  title: '',
  content: '',
  action: null,
  attachment: null
}
export default {
  name: 'SentenceModal',
  components: {
    SentencePreview,
    ScriptAction,
    ScriptAttachment,
    BTextAreaWithValidation,
    BTextInputWithValidation,
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
