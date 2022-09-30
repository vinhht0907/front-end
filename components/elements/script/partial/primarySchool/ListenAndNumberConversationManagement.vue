<template>
  <div class="larlws-conversation-management">
    <b-form-group label="Nội dung hội thoại" class="mb-2">
      <el-collapse v-model="activeIds">
        <draggable
          :list="conversations"
          handle=".btn-collapse-draggable"
          animation="250"
        >
          <transition-group type="transition" name="list-answer">
            <el-collapse-item
              v-for="(conversation, index) in conversations"
              :key="conversation.id"
              :name="conversation.id"
            >
              <template slot="title">
                <span
                  >Câu hỏi {{ index + 1 }} / {{ conversations.length }}</span
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
                      @click.self="removeQuestion(conversation)"
                      class="la la-trash-o"
                    ></i
                  ></a>
                </span>
              </template>
              <div>
                <b-single-image-upload-with-validation
                  :required="true"
                  v-model="conversation.image"
                  rules="required"
                  label="Ảnh"
                  placeholder="Ảnh"
                />
              </div>
              <div class="conversation-item d-flex align-items-center">
                <div class="kt-radio-inline kt-radio-inline-style">
                  <label class="kt-radio kt-radio--brand">
                    <input
                      v-model="currentIndex"
                      :value="index"
                      type="radio"
                      name="answerRadio"
                    />
                    <span></span>
                  </label>
                </div>
                <div class="message">
                  <b-form-textarea
                    v-model="conversation.transcript"
                    placeholder="Nhập transcript ..."
                    max-rows="5"
                    rows="1"
                    class="mb-2"
                  ></b-form-textarea>
                  <b-text-input-with-validation
                    v-if="hasScore"
                    v-model="conversation.score"
                    placeholder="Điểm thưởng"
                    rules="numeric|max_value:9999"
                    name="score"
                    label-name="Trường này"
                    class="mt-2 d-block"
                  />
                </div>

                <b-form-input
                  v-model="conversation.start"
                  class="timeline"
                  placeholder="start..."
                />
                <b-form-input
                  v-model="conversation.end"
                  class="timeline"
                  placeholder="end..."
                />
                <div class="d-flex flex-column">
                  <a
                    @click="setCurrentAudio(index)"
                    href="javascript:;"
                    class="text-primary delete"
                    >Nghe từ đây</a
                  >
                </div>
              </div>
            </el-collapse-item>
          </transition-group>
        </draggable>
      </el-collapse>
    </b-form-group>
    <b-button @click="addAnswer" block variant="primary"
      ><i class="la la-plus"></i> Thêm đáp án</b-button
    >
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import randomstring from 'randomstring'
import draggable from 'vuedraggable'
import truncate from 'lodash/truncate'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultConversation = {
  id: null,
  transcript: '',
  image: '',
  start: null,
  end: null
}

export default {
  name: 'ListenAndNumberConversationManagement',
  components: {
    BSingleImageUploadWithValidation,
    draggable,
    BTextInputWithValidation
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
    },
    hasScore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      conversations: null,
      currentIndex: 0,
      showTranslation: true,
      activeIds: []
    }
  },
  watch: {
    conversations: {
      deep: true,
      handler(val) {
        if (this.activeIds.length === 0 && this.conversations !== null) {
          this.activeIds = this.conversations.map((e) => {
            return e.id
          })
        }

        this.$emit('input', val)
      }
    }
  },
  created() {
    this.initVal(this.value)
  },
  methods: {
    initVal(val) {
      const clone = cloneDeep(defaultConversation)
      clone.id = randomstring.generate()

      if (val && val.length > 0) {
        this.conversations = val
      } else {
        this.conversations = [clone]
      }
    },
    setTimeStart(start) {
      if (this.currentIndex < this.conversations.length) {
        this.conversations[this.currentIndex].start = start
      }
    },
    setTimeEnd(end) {
      if (this.currentIndex < this.conversations.length) {
        this.conversations[this.currentIndex].end = end
      }
      this.currentIndex = this.currentIndex + 1
    },
    setCurrentAudio(index) {
      this.currentIndex = index
      this.$emit('setCurrentAudio', this.conversations[index].start)
    },
    addAnswer() {
      const clone = cloneDeep(defaultConversation)
      clone.id = randomstring.generate()
      this.activeIds.push(clone.id)
      this.conversations.push(clone)
    },
    removeQuestion(answer) {
      const index = this.conversations.findIndex((item) => {
        return item.id === answer.id
      })
      if (index !== -1) {
        this.currentIndex = 0
        this.conversations.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss">
.larlws-conversation-management {
  margin-top: 20px;
  .conversation-item {
    margin-top: 20px;

    .timeline {
      width: 70px;
      margin-left: 10px;
    }
    .message {
      width: calc(100% - 340px);
    }
    .delete {
      margin-left: 10px;
    }
    .kt-radio-inline-style {
      margin-top: -20px;
    }
  }
}
</style>
