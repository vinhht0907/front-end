<template>
  <div>
    <div
      v-for="(question, i) in listQuestions"
      :key="i"
      class="col-md-12 div-question"
    >
      {{ question.title | questionShow }}
      <div class="index-question">{{ i + 1 }}</div>
      <div class="action-question">
        <i
          @click="showModalEditQuestion(question, i)"
          class="fa fa-edit"
          style="color:#4A50F1"
        />
        <i
          @click="upOrderQuestion(i)"
          class="fa fa-arrow-circle-up"
          style="color:#000000"
        />
        <i
          @click="downOrderQuestion(i)"
          class="fa fa-arrow-circle-down"
          style="color:#000000"
        />
        <i
          @click="removeQuestion(i)"
          class="fa fa-trash-o"
          style="color:#F14138"
        ></i>
      </div>
    </div>
    <button @click="showModaAddQuestion" type="button" class="btn btn-primary">
      <i class="la la-plus"></i> Thêm câu hỏi mới
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { moveItem } from '~/utils/arrayList'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'

export default {
  name: 'ListQuestions',
  filters: {
    questionShow(value) {
      if (!value) return 'Câu hỏi không có tiêu đề'
      value = value.toString()
      const valueText = value.replace(/<[^>]+>/g, '')
      if (valueText.length > 100) {
        return valueText.slice(0, 100) + '...'
      } else {
        return valueText
      }
    }
  },
  props: {
    listQuestions: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapState({
      currentQuestion: (state) => state.question.currentQuestion,
      currentIndexQuestion: (state) => state.indexQuestion.currentIndexQuestion
    })
  },
  watch: {
    currentQuestion(val) {
      if (this.currentIndexQuestion === null) {
        this.listQuestions.push(val)
      } else {
        this.$set(this.listQuestions, this.currentIndexQuestion, val)
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentQuestion: 'question/setCurrentQuestion',
      setCurrentIndexQuestion: 'indexQuestion/setCurrentIndexQuestion'
    }),
    showModalEditQuestion(question, index) {
      this.setCurrentIndexQuestion(index)
      this.$emit('showModalQuestion', question)
    },
    showModaAddQuestion() {
      this.$emit('showModalQuestion')
    },
    downOrderQuestion(index) {
      this.listQuestions = moveItem(this.listQuestions, index, 'down')
    },
    upOrderQuestion(index) {
      this.listQuestions = moveItem(this.listQuestions, index, 'up')
    },
    removeQuestion(index) {
      this.$bvModal
        .msgBoxConfirm('Bạn chắc chắn muốn xóa câu hỏi này?', {
          title: this.$t('alert.notice'),
          okVariant: 'danger',
          okTitle: this.$t('button.ok'),
          cancelTitle: this.$t('button.cancel')
        })
        .then((value) => {
          if (value) {
            this.listQuestions.splice(index, 1)
            notifyDeleteSuccess('câu hỏi')
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    }
  }
}
</script>
