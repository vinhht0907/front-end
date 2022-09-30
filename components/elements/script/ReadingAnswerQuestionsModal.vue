<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Reading answer questions"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
          <b-form-group label="Loại bài đọc">
            <b-form-radio-group
              :options="readingTypeOptions"
              v-model="form.reading_type"
              class="pt-2 theme-custom-radio"
              value-field="type"
              text-field="name"
              size="lg"
            ></b-form-radio-group>
          </b-form-group>
          <reading-content-chosen
            v-if="form.reading_type === 'available'"
            v-model="form.reading_content"
          >
          </reading-content-chosen>
          <template v-else>
            <b-single-image-upload-with-validation
              :required="true"
              v-model="form.image"
              rules="required"
              label="Ảnh"
            />
            <b-text-input-with-validation
              v-model="form.title"
              :required="true"
              label="Tiêu đề"
              placeholder="Tiêu đề"
              rules="required"
              name="title"
            />
            <b-editor-with-validation
              v-model="form.content"
              :required="true"
              label="Nội dung"
              placeholder="Nội dung"
              rules="required"
              name="content"
            />
          </template>
          <reading-answer-questions-list v-model="form.items" />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <reading-answer-question-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import ReadingAnswerQuestionsList from '~/components/elements/script/partial/ReadingAnswerQuestionsList'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import ReadingAnswerQuestionPreview from '~/components/elements/script/preview/ReadingAnswerQuestionPreview'
import ReadingContentChosen from '~/components/elements/activity/ReadingContentChosen'

const defaultForm = {
  items: null,
  reading_type: ''
}
export default {
  name: 'ReadingAnswerQuestionsModal',
  components: {
    ReadingContentChosen,
    BEditorWithValidation,
    ReadingAnswerQuestionsList,
    BTextInputWithValidation,
    BSingleImageUploadWithValidation,
    ReadingAnswerQuestionPreview,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      readingTypeOptions: [
        { type: 'available', name: 'Có sẵn' },
        { type: 'new', name: 'Tạo mới' }
      ]
    }
  },
  methods: {
    show(item) {
      if (!item.reading_type) {
        if (item.title) {
          item.reading_type = 'new'
        } else {
          item.reading_type = 'available'
        }
      }
      this.form = cloneDeep(item)

      console.log(this.form)
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
