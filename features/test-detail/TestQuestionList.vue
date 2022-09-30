<template>
  <div class="list-collapse test-question-collapse">
    <el-collapse v-model="activeNames">
      <draggable
        :list="innerValue"
        @update="oneUpdate"
        handle=".btn-collapse-draggable"
        animation="250"
      >
        <transition-group type="transition" name="list-answer">
          <el-collapse-item
            v-for="(item, index) in innerValue"
            :key="item._id"
            :name="item._id"
          >
            <template slot="title">
              <span>
                {{ `Question ${index + 1} / ${innerValue.length} : `
                }}{{ item.type | getTypeLabel }}</span
              >
              <span class="collapse-action">
                <a
                  href="javascript:;"
                  class="btn-sm btn text-primary btn-bold btn-outline-hover-primary btn-collapse-draggable"
                  ><i class="fa fa-arrows"></i
                ></a>
                <a
                  href="javascript:;"
                  class="btn-sm btn text-warning btn-bold btn-outline-hover-warning"
                  ><i @click.stop="showModal(item)" class="la la-edit"></i
                ></a>
                <a
                  href="javascript:;"
                  class="btn-sm btn text-danger btn-bold btn-outline-hover-danger"
                  ><i @click.stop="removeItem(item)" class="la la-trash-o"></i
                ></a>
              </span>
            </template>
            <div>
              <div>{{ item.question }}</div>
              <div
                v-if="
                  [
                    QT_SELECT_ANSWER_SENTENCE,
                    QT_SELECT_ANSWER_PARAGRAPH,
                    QT_FILL_IN_BLANK
                  ].includes(item.type)
                "
              ></div>
              <p
                v-else-if="
                  [
                    QT_SINGLE_CHOICE_INLINE,
                    QT_SELECT_ANSWER_SENTENCE,
                    QT_FILL_IN_BLANK_SENTENCE
                  ].includes(item.type)
                "
              >
                <b-form-radio-group
                  :checked="item.answers | trueAnswer"
                  :options="item.answers"
                  stacked
                  name="answer"
                  value-field="key"
                >
                </b-form-radio-group>
              </p>
              <p v-else-if="item.type === QT_MULTI_CHOICE_INLINE">
                <b-form-checkbox-group
                  :checked="item.answers | trueMultiAnswer"
                  :options="item.answers"
                  stacked
                  name="answer"
                  value-field="key"
                >
                </b-form-checkbox-group>
              </p>
              <div
                v-else-if="item.type === QT_SINGLE_CHOICE_PICTURE"
                class="el-upload-list el-upload-list--picture multi-upload mb-3"
              >
                <div
                  v-for="answer in item.answers"
                  :value="answer.key"
                  class="el-upload-list__item"
                >
                  <img
                    :src="answer.url"
                    :alt="answer.url"
                    class="el-upload-list__item-thumbnail"
                  />
                  <div class="ml-2">
                    <div class="kt-radio-inline">
                      <label class="kt-radio">
                        <input :checked="answer.isAnswer" type="radio" />
                        Đáp án đúng
                        <span></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else-if="item.type === QT_QUESTION_WITH_ORDER">
                <b-form-checkbox-group
                  :checked="item.answers | trueMultiAnswer"
                  :name="`answer-${item.id}-${index}`"
                  stacked
                  value-field="key"
                >
                  <b-form-checkbox
                    v-for="(answer, answerIndex) in item.answers"
                    :key="answer.key"
                    :value="answer.key"
                    >{{ answerIndex + 1 }}. {{ answer.text }}</b-form-checkbox
                  >
                </b-form-checkbox-group>
              </p>
              <p v-else-if="item.type === QT_REWRITE_BASE_SUGGESTED">
                {{ item.answer }}
              </p>
            </div>
          </el-collapse-item>
        </transition-group>
      </draggable>
    </el-collapse>
    <div class="collapse-add-action mt-2">
      <!-- <a
        href="javascript:;"
        class="btn btn-bold btn-sm btn-label-success mr-3"
        @click="showUpdateModal"
      >
        <i class="la la-plus"></i> Chọn question có sẵn
      </a> -->
      <a
        @click="showModal()"
        href="javascript:;"
        class="btn btn-bold btn-sm btn-label-brand"
      >
        <i class="la la-plus"></i> Thêm question mới
      </a>
    </div>
    <test-question-modal
      ref="modal"
      :part-id="id"
      :on-action-success="addItem"
    />
    <update-question-modal ref="updateModal" :on-action-success="updateModal" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import truncate from 'lodash/truncate'
import {
  notifyDeleteSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import TestQuestionModal from '~/features/testQuestion/TestQuestionModal'
import {
  QUESTION_TYPE_OPTIONS,
  QT_SINGLE_CHOICE_INLINE,
  QT_MULTI_CHOICE_INLINE,
  QT_SINGLE_CHOICE_PICTURE,
  QT_QUESTION_WITH_ORDER,
  QT_SELECT_ANSWER_SENTENCE,
  QT_SELECT_ANSWER_PARAGRAPH,
  QT_FILL_IN_BLANK,
  QT_REWRITE_BASE_SUGGESTED,
  QT_FILL_IN_BLANK_SENTENCE
} from '~/constants/test'
import UpdateQuestionModal from '~/features/test-detail/partial/UpdateQuestionModal'

export default {
  name: 'TestQuestionList',
  components: {
    UpdateQuestionModal,
    TestQuestionModal,
    draggable
  },
  filters: {
    truncate(value) {
      return truncate(value, {
        length: 100,
        separator: ' '
      })
    },
    getTypeLabel(value) {
      const option = QUESTION_TYPE_OPTIONS.find((o) => o.id === value)
      if (option) {
        return option.text
      } else {
        return ''
      }
    },
    trueAnswer(value) {
      const answer = value.find((item) => item.isAnswer === true)

      if (answer) {
        return answer.key
      } else {
        return ''
      }
    },
    trueMultiAnswer(value) {
      const answer = value
        .filter((item) => item.isAnswer === true)
        .map((item) => item.key)

      if (answer) {
        return answer
      } else {
        return []
      }
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerValue: null,
      activeNames: [],
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
    innerValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value(val) {
      this.init(val)
    }
  },
  created() {
    this.init(this.value)
  },
  methods: {
    init(val) {
      this.innerValue = val
    },
    addItem(value) {
      const index = this.innerValue.findIndex((item) => item._id === value._id)

      if (index !== -1) {
        this.$set(this.innerValue, index, value)
      } else {
        this.innerValue.push(value)
        this.activeNames.push(value._id)
      }
    },
    showModal(data = null) {
      this.$refs.modal.show(data)
    },
    showUpdateModal() {
      this.$refs.updateModal.show({
        _id: this.id,
        test_questions: this.innerValue
      })
    },
    updateModal(value) {
      this.innerValue = value.test_questions
    },
    removeItem(question) {
      this.$bvModal
        .msgBoxConfirm('Bạn chắc chắn muốn xóa question này khỏi part?', {
          title: this.$t('alert.notice'),
          okVariant: 'danger',
          okTitle: this.$t('button.ok'),
          cancelTitle: this.$t('button.cancel')
        })
        .then(async (value) => {
          if (value) {
            await this.$axios.post('/test-part/pull-question', {
              _id: this.id,
              question_id: question._id
            })
            const index = this.innerValue.findIndex(
              (item) => item._id === question._id
            )

            if (index !== -1) {
              this.innerValue.splice(index, 1)
            }
            notifyDeleteSuccess('Question')
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    },
    async oneUpdate() {
      try {
        await this.$axios.post('/test-part/update-questions', {
          _id: this.id,
          test_questions: this.innerValue.map((v) => v._id)
        })

        notifyUpdateSuccess('Thứ tự question')
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
