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
      <!-- <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :error="vForm.errors.get('name')"
        label="Tên"
        placeholder="Tên"
        rules="required|max:100"
        name="name"
      /> -->

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

      <b-text-input-with-validation
        v-if="
          [
            QT_SINGLE_CHOICE_INLINE,
            QT_MULTI_CHOICE_INLINE,
            QT_SINGLE_CHOICE_PICTURE,
            QT_QUESTION_WITH_ORDER
          ].includes(form.type.id)
        "
        v-model="form.question"
        :required="true"
        :error="vForm.errors.get('question')"
        label="Câu hỏi - Từ nhấn mạnh được đặt trong dấu < >"
        placeholder="Câu hỏi"
        rules="required|max:256"
        name="question"
      />

      <select2-with-validation
        v-if="
          [QT_SELECT_ANSWER_SENTENCE, QT_SELECT_ANSWER_PARAGRAPH].includes(
            form.type.id
          )
        "
        :required="true"
        v-model="form.display_type"
        :error="vForm.errors.get('display_type')"
        :options="displayTypeOptions"
        placeholder="Chọn dạng hiển thị..."
        label="Dạng hiển thị"
        data-vv-as="Dạng hiển thị"
        id-field="id"
        text-field="text"
        name="type"
        rules="required"
      />

      <b-text-input-with-validation
        v-if="[QT_FILL_IN_BLANK_SENTENCE].includes(form.type.id)"
        v-model="form.question"
        :required="true"
        :error="vForm.errors.get('question')"
        label="Câu hỏi - ký tự [] sẽ được thay bằng _____ - Từ nhấn mạnh được đặt trong dấu < >"
        placeholder="My name [] Hang"
        rules="required|max:256"
        name="question"
      />

      <b-text-input-with-validation
        v-if="form.type.id === QT_FILL_IN_BLANK_SENTENCE"
        v-model="form.answer"
        :required="true"
        :error="vForm.errors.get('answer')"
        label="Câu trả lời - Các câu trả lời cách nhau bởi dấu /"
        placeholder="Câu trả lời 1/ Câu trả lời 2"
        rules="required"
        name="answer"
        rows="6"
      />

      <b-text-area-with-validation
        v-if="
          [QT_SELECT_ANSWER_SENTENCE, QT_SELECT_ANSWER_PARAGRAPH].includes(
            form.type.id
          )
        "
        v-model="form.question"
        :required="true"
        :error="vForm.errors.get('question')"
        label="Câu hỏi - Câu trả lời sẽ có dạng [(câu trả lời đúng)/câu trả lời 1] - Từ nhấn mạnh được đặt trong dấu < >"
        placeholder="My name [(is)/are/am] Hang"
        rules="required"
        name="question"
        rows="6"
      />

      <base-single-answer
        v-if="[QT_SINGLE_CHOICE_INLINE].includes(form.type.id)"
        v-model="form.answers"
        class="mb-3"
      />
      <base-multi-answer
        v-if="form.type.id === QT_MULTI_CHOICE_INLINE"
        v-model="form.answers"
        class="mb-3"
      />
      <base-single-image-answer
        v-if="form.type.id === QT_SINGLE_CHOICE_PICTURE"
        v-model="form.answers"
        class="mb-3 hidden"
      />
      <base-multi-sort-answer
        v-if="form.type.id === QT_QUESTION_WITH_ORDER"
        v-model="form.answers"
        label="Trường này"
        placeholder="Nhập đáp án..."
        rules="required"
        btn-label="Thêm đáp án"
        class="mb-3"
      />

      <b-text-area-with-validation
        v-if="form.type.id === QT_FILL_IN_BLANK"
        v-model="form.question"
        :required="true"
        :error="vForm.errors.get('question')"
        label="Câu hỏi - Câu trả lời sẽ có dạng [câu trả lời 1/câu trả lời 2] - Từ nhấn mạnh được đặt trong dấu < >"
        placeholder="My name [is] Hang. What [is] your name?"
        rules="required"
        name="question"
        rows="6"
      />
      <template v-if="form.type.id === QT_REWRITE_BASE_SUGGESTED">
        <b-text-area-with-validation
          v-model="form.question"
          :required="true"
          :error="vForm.errors.get('question')"
          label="Câu hỏi - Từ nhấn mạnh được đặt trong dấu < >"
          placeholder="Câu hỏi"
          rules="required"
          name="question"
          rows="6"
        />
        <b-text-area-with-validation
          v-model="form.answer"
          :required="true"
          :error="vForm.errors.get('answer')"
          label="Câu trả lời - Các câu trả lời cách nhau bởi dấu - Từ nhấn mạnh được đặt trong dấu < >"
          placeholder="Câu trả lời 1/ Câu trả lời 2"
          rules="required"
          name="answer"
          rows="6"
        />
      </template>

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
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import {
  QUESTION_TYPE_OPTIONS,
  QT_SINGLE_CHOICE_INLINE,
  QT_MULTI_CHOICE_INLINE,
  QT_SINGLE_CHOICE_PICTURE,
  QT_QUESTION_WITH_ORDER,
  QT_SELECT_ANSWER_SENTENCE,
  QT_FILL_IN_BLANK_SENTENCE,
  QT_SELECT_ANSWER_PARAGRAPH,
  QT_FILL_IN_BLANK,
  QT_REWRITE_BASE_SUGGESTED
} from '~/constants/test'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BaseSingleAnswer from '~/components/elements/script/base/BaseSingleAnswer'
import BaseMultiAnswer from '~/components/elements/script/base/BaseMultiAnswer'
import BaseSingleImageAnswer from '~/components/elements/script/base/BaseSingleImageAnswer'
import BaseMultiSortAnswer from '~/components/elements/script/base/BaseMultiSortAnswer'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'

const defaultForm = {
  name: '',
  type: '',
  question: '',
  explanation: ''
}

export default {
  name: 'TestQuestionModal',
  components: {
    BEditorWithValidation,
    BTextAreaWithValidation,
    BaseMultiSortAnswer,
    BaseSingleImageAnswer,
    BaseMultiAnswer,
    BaseSingleAnswer,
    Select2WithValidation,
    ValidationObserver,
    BTextInputWithValidation
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    },
    partId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      typeOptions: QUESTION_TYPE_OPTIONS,
      displayTypeOptions: [
        {
          id: 'inline',
          text: 'Inline'
        },
        {
          id: 'popup',
          text: 'Popup'
        }
      ],
      QT_SINGLE_CHOICE_INLINE,
      QT_MULTI_CHOICE_INLINE,
      QT_SINGLE_CHOICE_PICTURE,
      QT_QUESTION_WITH_ORDER,
      QT_SELECT_ANSWER_SENTENCE,
      QT_SELECT_ANSWER_PARAGRAPH,
      QT_FILL_IN_BLANK,
      QT_REWRITE_BASE_SUGGESTED,
      QT_FILL_IN_BLANK_SENTENCE
    }
  },
  watch: {
    'form.type'(value, oldVal) {
      if (oldVal) {
        if (value.id === QT_SINGLE_CHOICE_PICTURE) {
          this.form.answers = []
        }
      }
    }
  },
  methods: {
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
        if (this.form.display_type) {
          this.form.display_type = {
            id: this.form.display_type,
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
    async addItem() {
      try {
        if (this.partId) {
          this.form.part_id = this.partId
        }
        const formData = cloneDeep(this.form)
        formData.type = formData.type.id
        if (formData.display_type) {
          formData.display_type = formData.display_type.id
        }
        this.vForm = new Form(formData)
        const { data } = await this.vForm.post(
          this.$axios.defaults.baseURL + '/test-question/add'
        )

        notifyAddSuccess('Câu hỏi')
        this.$refs.modal.hide()
        this.onActionSuccess(data)
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
    async updateItem() {
      try {
        const formData = cloneDeep(this.form)
        formData.type = formData.type.id
        if (formData.display_type) {
          formData.display_type = formData.display_type.id
        }
        this.vForm = new Form(formData)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/test-question/edit'
        )

        notifyUpdateSuccess('Câu hỏi')
        this.$refs.modal.hide()
        this.onActionSuccess(formData)
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
