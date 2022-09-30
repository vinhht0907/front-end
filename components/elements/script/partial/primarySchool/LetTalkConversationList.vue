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
                  {{ answer.type | typeLabel }}</span
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
              <let-talk-conversation-content
                v-if="answer.type === 'content'"
                v-model="innerValue[index]"
                :speakers="speakers"
                class="list-item-script__item mb-2 px-3 py-2"
              />
              <let-talk-conversation-answer
                v-if="answer.type === 'answer'"
                :has-score="true"
                v-model="innerValue[index]"
                :speakers="speakers"
                class="list-item-script__item mb-2 px-3 py-2"
              />
            </el-collapse-item>
          </transition-group>
        </draggable>
      </el-collapse>
    </b-form-group>

    <b-dropdown block variant="primary" menu-class="w-100">
      <template v-slot:button-content>
        <i class="la la-plus"></i> Thêm câu hỏi
      </template>

      <b-dropdown-item
        v-for="option in options"
        :key="option.type"
        @click="addQuestion(option.type)"
        href="javascript:;"
        >{{ option.label }}</b-dropdown-item
      >
    </b-dropdown>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import randomstring from 'randomstring'
import LetTalkConversationContent from '~/components/elements/script/partial/primarySchool/LetTalkConversationContent'
import LetTalkConversationAnswer from '~/components/elements/script/partial/primarySchool/LetTalkConversationAnswer'

const options = [
  {
    type: 'answer',
    label: 'Câu trả lời'
  },
  {
    type: 'content',
    label: 'Nội dung'
  }
]

export default {
  name: 'LetTalkConversationList',
  components: {
    draggable,
    LetTalkConversationContent,
    LetTalkConversationAnswer
  },
  filters: {
    typeLabel(value) {
      return options.find((o) => o.type === value).label
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    speakers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      innerValue: null,
      activeNames: [],
      options
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler(val) {
        if (this.activeNames.length === 0 && this.innerValue !== null) {
          this.activeNames = this.innerValue.map((e) => {
            return e.key
          })
        }
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
    addQuestion(type) {
      const item = this.generateDefault()
      item.type = type
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
        key: randomstring.generate(),
        type: null,
        speaker: null,
        avatar: null,
        speakerObject: null,
        content: null,
        answers: []
      }
    }
  }
}
</script>
