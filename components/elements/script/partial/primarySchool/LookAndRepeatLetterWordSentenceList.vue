<template>
  <div class="list-item-script">
    <b-form-group label="Danh sách câu hỏi" class="mb-2">
      <el-collapse v-model="activeNames">
        <draggable
          :list="innerValue"
          handle=".btn-collapse-draggable"
          animation="250"
        >
          <transition-group type="transition" name="list-answer">
            <el-collapse-item
              v-for="(answer, index) in innerValue"
              :key="answer.key"
              :name="answer.key"
            >
              <template slot="title">
                <span
                  >Câu hỏi {{ index + 1 }} / {{ innerValue.length }} -
                  {{ answer.text | truncate }}</span
                >
                <span class="collapse-action">
                  <a
                    href="javascript:;"
                    class="btn-sm btn text-primary btn-bold btn-outline-hover-primary btn-collapse-draggable"
                    ><i class="fa fa-arrows"></i
                  ></a>
                  <a
                    href="javascript:;"
                    class="btn-sm btn text-danger btn-bold btn-outline-hover-danger"
                    ><i
                      @click.self="removeQuestion(answer)"
                      class="la la-trash-o"
                    ></i
                  ></a>
                </span>
              </template>
              <look-and-repeat-letter-word-sentence-item
                v-model="innerValue[index]"
                class="list-item-script__item mb-2 px-3 py-2"
              />
            </el-collapse-item>
          </transition-group>
        </draggable>
      </el-collapse>
    </b-form-group>

    <b-button @click="addQuestion" block variant="primary"
      ><i class="la la-plus"></i> Thêm câu hỏi</b-button
    >
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import randomstring from 'randomstring'
import truncate from 'lodash/truncate'
import LookAndRepeatLetterWordSentenceItem from '~/components/elements/script/partial/primarySchool/LookAndRepeatLetterWordSentenceItem'

export default {
  name: 'LookAndRepeatLetterWordSentenceList',
  components: {
    LookAndRepeatLetterWordSentenceItem,
    draggable
  },
  filters: {
    truncate(value) {
      return truncate(value, {
        length: 60,
        separator: ' '
      })
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      innerValue: null,
      activeNames: []
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
      if (val) {
        this.innerValue = val
      } else {
        this.innerValue = this.generateDefault()
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = this.generateDefault()
    }
  },
  methods: {
    addQuestion() {
      const item = this.generateDefault()
      this.innerValue.push(item)
      this.activeNames.push(item.key)
    },
    removeQuestion(question) {
      const index = this.innerValue.findIndex(
        (item) => item.key === question.key
      )

      if (index !== -1) {
        this.innerValue.splice(index, 1)
      }
    },
    generateDefault() {
      return {
        key: randomstring.generate()
      }
    }
  }
}
</script>
