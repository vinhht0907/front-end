<template>
  <div class="conversation-management">
    <div class="d-flex justify-content-between align-items-center">
      <label>Nội dung hội thoại</label>
      <el-switch
        v-model="showTranslation"
        active-text="Hiển thị bản dịch"
        inactive-text="Ẩn bản dịch"
      >
      </el-switch>
    </div>
    <div
      v-for="(conversation, index) in conversations"
      :key="conversation.id"
      class="conversation-item d-flex align-items-center"
    >
      <div class="kt-radio-inline">
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
      <el-popover>
        <div class="speaker-management">
          <div class="speaker-list">
            <div
              v-for="speaker in speakers"
              @click="setSpeaker(speaker, index)"
              class="speaker-item align-items-center pr-3 cursor-pointer"
            >
              <div class="speaker-avatar">
                <img :src="speaker.avatar" />
              </div>
              <span>{{ speaker.name }}</span>
            </div>
          </div>
        </div>

        <a
          slot="reference"
          href="javascript:;"
          class="speaker d-flex justify-content-center align-items-center"
        >
          <img v-if="conversation.speaker" :src="conversation.speaker.avatar" />
          <i v-else class="la la-plus"></i>
        </a>
      </el-popover>
      <div class="message">
        <b-form-textarea
          v-model="conversation.content"
          @change="(val) => changeContent(val, index)"
          placeholder="Nhập nội dung..."
          max-rows="5"
          rows="1"
          class="mb-2"
        ></b-form-textarea>
        <b-form-textarea
          v-model="conversation.translation"
          v-show="showTranslation"
          placeholder="Nhập bản dịch..."
          max-rows="5"
          rows="1"
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
        <a
          @click="deleteItem(index)"
          href="javascript:;"
          class="text-danger delete"
          >Xóa</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import randomstring from 'randomstring'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultConversation = {
  id: null,
  speaker: null,
  content: '',
  translation: '',
  start: null,
  end: null
}
export default {
  name: 'ConversationManagement',
  components: {
    BTextInputWithValidation
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    speakers: {
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
      conversations: [],
      currentIndex: 0,
      showTranslation: true
    }
  },
  watch: {
    conversations: {
      deep: true,
      handler(val) {
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
    changeContent(value, index) {
      const arr = value.split('\n')

      if (arr.length > 1) {
        this.conversations[index].content = arr[0]

        for (let i = 1; i < arr.length; i++) {
          const clone = cloneDeep(defaultConversation)
          clone.id = randomstring.generate()
          clone.content = arr[i]

          this.conversations.splice(index + i, 0, clone)
        }
      }
    },
    setSpeaker(speaker, index) {
      this.conversations[index].speaker = speaker
    },
    deleteItem(index) {
      this.conversations.splice(index, 1)
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
    }
  }
}
</script>

<style lang="scss">
.conversation-management {
  margin-top: 20px;
  .conversation-item {
    margin-top: 20px;

    .speaker {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: 1px dashed #ccc;
      margin-right: 10px;
      img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
      }
    }
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
  }
}
</style>
