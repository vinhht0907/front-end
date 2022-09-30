<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    ok-title="Chấm điểm"
    title="Chấm bài tự luận"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-form-group
        label="Người dùng"
        label-cols-lg="3"
        label-class="pt-0 pb-0"
      >
        <div>{{ form.user_id.full_name }}</div>
      </b-form-group>
      <b-form-group
        label="Tên bài luận"
        label-cols-lg="3"
        label-class="pt-0 pb-0"
      >
        <div>{{ form.writing_test.name }}</div>
      </b-form-group>
      <b-form-group label="Đề bài" label-cols-lg="3" label-class="pt-0 pb-0">
        <div v-html="form.writing_test.question"></div>
      </b-form-group>
      <b-form-group
        label="Bài làm người dùng"
        label-cols-lg="3"
        label-class="pt-0 pb-0"
      >
        <div v-html="form.user_answer"></div>
      </b-form-group>

      <b-editor-with-validation
        v-model="form.correct_answer"
        :required="true"
        :error="vForm.errors.get('correct_answer')"
        label="Câu trả lời đúng"
        placeholder="Câu trả lời đúng"
        rules="required"
        name="correct_answer"
      />

      <b-editor-with-validation
        v-model="form.review"
        :required="true"
        :error="vForm.errors.get('review')"
        label="Nhận xét"
        placeholder="Nhận xét"
        rules="required"
        name="review"
      />

      <b-slider-with-validation
        v-model="form.correct_requirement_score"
        :required="true"
        :error="vForm.errors.get('correct_requirement_score')"
        label="Viết đúng yêu cầu"
        rules="required"
        name="correct_requirement_score"
      />

      <b-slider-with-validation
        v-model="form.consistency_score"
        :required="true"
        :error="vForm.errors.get('consistency_score')"
        label="Tính nhất quán và gắn kết"
        rules="required"
        name="consistency_score"
      />

      <b-slider-with-validation
        v-model="form.vocabulary_score"
        :required="true"
        :error="vForm.errors.get('vocabulary_score')"
        label="Từ vựng và chính tả"
        rules="required"
        name="vocabulary_score"
      />

      <b-slider-with-validation
        v-model="form.grammar_score"
        :required="true"
        :error="vForm.errors.get('grammar_score')"
        label="Sử dụng ngữ pháp"
        rules="required"
        name="grammar_score"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import { cloneDeep, pick } from 'lodash'
import { ValidationObserver } from 'vee-validate'

import { notifyTryAgain, notify } from '~/utils/bootstrap-notify'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import BSliderWithValidation from '~/components/base/input/BSliderWithValidation'
import { i18n } from '~/plugins/i18n'

const defaultForm = {
  user_id: {},
  writing_test: {},
  correct_requirement_score: 0,
  consistency_score: 0,
  vocabulary_score: 0,
  grammar_score: 0,
  review: '',
  correct_answer: ''
}

export default {
  name: 'WritingTestUserModal',
  components: {
    BSliderWithValidation,
    BEditorWithValidation,
    ValidationObserver
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      vForm: new Form()
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        this.form = cloneDeep(item)
        if (this.form.state === 'pending') {
          this.form.correct_answer = this.form.user_answer
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
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.updateItem()
      }
    },
    async updateItem() {
      try {
        const params = pick(this.form, [
          '_id',
          'correct_requirement_score',
          'consistency_score',
          'vocabulary_score',
          'grammar_score',
          'correct_answer',
          'review'
        ])
        this.vForm = new Form(params)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/writing-test-user/edit'
        )

        notify(i18n.t('alert.notice'), 'Chấm bài thành công', 'success')
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
