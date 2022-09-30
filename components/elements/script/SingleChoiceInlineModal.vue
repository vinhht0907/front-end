<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Có nhiều đáp án và chỉ có duy nhất một đáp án đúng"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
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
          <base-input-score v-model="form.score" />
          <script-attachment
            :list-display="[
              'none',
              'image',
              'audio',
              'video',
              'reading',
              'flashcard'
            ]"
            v-model="form.attachment"
          />

          <base-single-answer v-model="form.options" />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <single-choice-inline-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'
import BaseSingleAnswer from '~/components/elements/script/base/BaseSingleAnswer'
import SingleChoiceInlinePreview from '~/components/elements/script/preview/SingleChoiceInlinePreview'

const defaultForm = {
  title: '',
  content: '',
  attachment: null,
  options: []
}
export default {
  name: 'SingleChoiceInlineModal',
  components: {
    BaseSingleAnswer,
    ScriptAttachment,
    BTextAreaWithValidation,
    BaseInputScore,
    BTextInputWithValidation,
    SingleChoiceInlinePreview,
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
