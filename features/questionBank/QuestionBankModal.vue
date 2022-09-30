<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa câu hỏi' : 'Thêm câu hỏi'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <select2-with-validation
        :required="true"
        v-model="form.type"
        :error="vForm.errors.get('type')"
        :options="typeOptions"
        placeholder="Chọn loại câu hỏi..."
        label="Loại câu hỏi"
        data-vv-as="Loại câu hỏi"
        id-field="id"
        text-field="text"
        name="type"
        rules="required"
      />
      <b-editor-with-validation
        v-if="[QT_SINGLE_CHOICE_INLINE].includes(form.type.id)"
        v-model="form.title"
        :error="vForm.errors.get('title')"
        :editorToolbar="editorToolbar"
        :single-row="true"
        label="Câu hỏi"
        placeholder="Câu hỏi"
        name="title"
      />
      <base-single-answer
        v-if="[QT_SINGLE_CHOICE_INLINE].includes(form.type.id)"
        v-model="form.answers"
        :error="vForm.errors.get('answers')"
        :required="true"
        :answerEditor="true"
        :editorToolbar="editorToolbar"
        :single-row="true"
        rules="required"
        class="mb-3"
      />
      <b-editor-with-validation
        v-model="form.explanation"
        :error="vForm.errors.get('explanation')"
        label="Giải thích đáp án"
        placeholder="Giải thích đáp án"
        name="explanation"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BaseSingleAnswer from '~/components/elements/script/base/BaseSingleAnswer'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import {
  QUESTION_TYPE_OPTIONS_SINGLE_CHOICE,
  QT_SINGLE_CHOICE_INLINE
} from '~/constants/test'

const defaultForm = {
  type: { id: QT_SINGLE_CHOICE_INLINE },
  title: '',
  explanation: ''
}

export default {
  name: 'QuestionBankModal',
  components: {
    ValidationObserver,
    Select2WithValidation,
    BEditorWithValidation,
    BaseSingleAnswer
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      typeOptions: QUESTION_TYPE_OPTIONS_SINGLE_CHOICE,
      currentCourseId: null,
      editorToolbar: [['bold', 'italic', 'underline']],
      QT_SINGLE_CHOICE_INLINE,
      question: null
    }
  },
  methods: {
    ...mapMutations({
      setCurrentQuestion: 'question/setCurrentQuestion',
      setCurrentIndexQuestion: 'indexQuestion/setCurrentIndexQuestion'
    }),
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        if (this.form.type) {
          this.form.type = {
            id: this.form.type,
            text: ''
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.vForm = new Form()
      this.isEdit = false
      this.setCurrentIndexQuestion(null)
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        if (this.isEdit) {
          await this.updateItem()
        } else {
          await this.addItem()
        }
      }
    },
    addItem() {
      try {
        notifyAddSuccess('Câu hỏi')
        this.$refs.modal.hide()
        const formData = cloneDeep(this.form)
        formData.type = formData.type.id
        this.setCurrentQuestion(formData)
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    updateItem() {
      try {
        notifyUpdateSuccess('Câu hỏi')
        this.$refs.modal.hide()
        const formData = cloneDeep(this.form)
        formData.type = formData.type.id
        this.setCurrentQuestion(formData)
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    }
  }
}
</script>
