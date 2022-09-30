<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa bộ câu hỏi' : 'Thêm bộ câu hỏi mới'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-editor-with-validation
        v-model="form.title"
        :error="vForm.errors.get('title')"
        :required="true"
        :answerEditor="true"
        :editorToolbar="editorToolbar"
        :single-row="true"
        label="Yêu cầu"
        placeholder="Ví dụ: Hãy chọn những từ khác loại trong câu hỏi sau"
        rules="required"
        name="title"
      />
      <b-text-input-with-validation
        v-model="form.description"
        :error="vForm.errors.get('description')"
        label="Mô tả thêm (tuỳ chọn)"
        placeholder="Mô tả thêm yêu cầu"
        name="description"
      />
      <div class="row">
        <div class="col-md-6">
          <select2-with-validation
            :error="vForm.errors.get('course')"
            v-model="form.course"
            :required="true"
            placeholder="Chọn danh mục lớp ..."
            label="Thuộc lớp mấy"
            data-vv-as="Thuộc lớp mấy"
            id-field="_id"
            text-field="name"
            ajax="/course/suggest"
            name="course"
            rules="required"
          />
        </div>
        <div class="col-md-6">
          <select2-with-validation
            v-model="form.lesson"
            :post-data="postDataLesson"
            :required="true"
            :error="vForm.errors.get('lesson')"
            placeholder="Chọn danh mục bài ..."
            label="Thuộc bài mấy"
            data-vv-as="Thuộc bài mấy"
            id-field="_id"
            text-field="name"
            ajax="/lesson/suggest"
            name="lesson"
            rules="required"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <select2-with-validation
            v-model="form.level"
            :options="levelOptions"
            placeholder="Chọn độ khó ..."
            label="Độ khó"
            data-vv-as="Độ khó"
            id-field="key"
            text-field="value"
            name="level"
          />
        </div>
        <div class="col-md-6">
          <select2-with-validation
            v-model="form.skill"
            :required="true"
            :error="vForm.errors.get('skill')"
            :options="skillOptions"
            placeholder="Chọn loại câu hỏi ..."
            label="Loại câu hỏi"
            data-vv-as="Loại câu hỏi"
            id-field="key"
            text-field="value"
            name="skill"
            rules="required"
          />
        </div>
      </div>
      <script-attachment
        v-model="form.attachment"
        :list-display="['none', 'image', 'reading']"
        :image-reading="false"
        label="Tập tin đính kèm"
      />
      <tag-chosen
        v-model="form.tags"
        :error="vForm.errors.get('tags')"
        :multiple="true"
        :required="false"
        name="tags"
      />
      <div>
        Danh sách câu hỏi
        <list-questions
          :listQuestions="listQuestions"
          @showModalQuestion="showModalQuestion"
        />
      </div>
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'

import { QUESTION_LEVEL } from '~/constants/level'
import { SKILL } from '~/constants/skill'
import TagChosen from '~/components/elements/tag/TagChosen'
// import ListQuestions from '~/components/elements/listQuestions/ListQuestions'
import ListQuestions from '~/components/elements/listQuestions/ListQuestions'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'

const defaultForm = {
  title: '',
  description: '',
  course: null,
  lesson: null,
  skill: '',
  level: {
    key: 0
  },
  tags: [],
  attachment: null
}

export default {
  name: 'QuestionBankGroupModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    Select2WithValidation,
    TagChosen,
    ListQuestions,
    BEditorWithValidation,
    ScriptAttachment
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    },
    questionNewAdd: {
      type: Object,
      default: null
    },
    questionNewEdit: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      listQuestions: [],
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      levelOptions: QUESTION_LEVEL,
      skillOptions: SKILL,
      editorToolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' }
        ],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['blockquote', 'code-block']
      ]
    }
  },
  computed: {
    postDataLesson() {
      return { course_id: this.form.course ? this.form.course.id : null }
    },
    arrayIdTags() {
      const array = []
      this.form.tags.forEach((tag) => {
        array.push(tag.id)
      })
      return array
    }
  },
  methods: {
    showModalQuestion(data) {
      this.$emit('showModalQuestion', data)
    },
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        if (this.form.skill) {
          this.form.skill = {
            key: this.form.skill
          }
        }
        if (this.form.level === 0) {
          this.form.level = {
            key: 0
          }
        } else {
          this.form.level = {
            key: this.form.level
          }
        }
        if (this.form.questions) {
          this.listQuestions = this.form.questions
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
      this.listQuestions = []
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
        const requestData = {
          title: this.form.title,
          course: this.form.course._id ? this.form.course._id : null,
          lesson: this.form.lesson._id ? this.form.lesson._id : null,
          skill: this.form.skill.key ? this.form.skill.key : null,
          level: this.form.level.key,
          tags: this.arrayIdTags,
          description: this.form.description,
          questions: this.listQuestions,
          attachment: this.form.attachment
        }
        this.vForm = new Form(requestData)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/question-bank-group/add'
        )
        notifyAddSuccess('Bộ câu hỏi')
        this.$refs.modal.hide()
        this.onActionSuccess()
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
        const requestData = {
          _id: this.form._id,
          title: this.form.title,
          course: this.form.course._id ? this.form.course._id : null,
          lesson: this.form.lesson._id ? this.form.lesson._id : null,
          skill: this.form.skill.key ? this.form.skill.key : null,
          level: this.form.level.key,
          tags: this.arrayIdTags,
          description: this.form.description,
          questions: this.listQuestions,
          attachment: this.form.attachment
        }
        this.vForm = new Form(requestData)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/question-bank-group/edit'
        )
        notifyUpdateSuccess('Bộ câu hỏi')
        this.$refs.modal.hide()
        this.onActionSuccess()
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
