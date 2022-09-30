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
          <b-text-input-with-validation
            v-model="form.title_vn"
            label="Tiêu đề tiếng việt"
            placeholder="Tiêu đề tiếng việt"
            name="title_vn"
          />
          <script-attachment
            v-model="form.attachment"
            :list-display="['none', 'image', 'audio', 'video']"
            is-transcript
          />

          <common-answer-all-question-list v-model="form.items" />
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
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'
import CommonAnswerAllQuestionList from '~/components/elements/script/partial/CommonAnswerAllQuestionList'
import SingleChoiceInlinePreview from '~/components/elements/script/preview/SingleChoiceInlinePreview'

const defaultForm = {
  title: '',
  attachment: null,
  items: []
}
export default {
  name: 'CommonAnswerAllQuestionsModal',
  components: {
    CommonAnswerAllQuestionList,
    ScriptAttachment,
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
