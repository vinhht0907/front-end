<template>
  <div class="larlws-conversation-management">
    <div class="d-flex justify-content-start align-items-center">
      <label>Nội dung</label>
    </div>
    <div
      v-for="(conversation, index) in conversations"
      :key="conversation.id"
      class="conversation-item d-flex align-items-center"
    >
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
        <label v-if="conversation.letter != null">Nhập Âm</label>
        <label v-if="conversation.word != null">Nhập Từ</label>
        <label v-if="conversation.sentence != null">Nhập Câu</label>
        <b-form-textarea
          v-if="conversation.letter != null"
          v-model="conversation.letter"
          placeholder="Nhập âm ..."
          max-rows="5"
          rows="1"
          class="mb-2"
        ></b-form-textarea>
        <b-form-textarea
          v-if="conversation.word != null"
          v-model="conversation.word"
          placeholder="Nhập từ ..."
          max-rows="5"
          rows="1"
          class="mb-2"
        ></b-form-textarea>
        <b-form-textarea
          v-if="conversation.sentence != null"
          v-model="conversation.sentence"
          placeholder="Nhập câu nói ..."
          max-rows="5"
          rows="1"
          class="mb-2"
        ></b-form-textarea>
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
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import randomstring from 'randomstring'

const defaultConversationLetter = {
  id: null,
  letter: '',
  start: null,
  end: null
}
const defaultConversationWord = {
  id: null,
  word: '',
  start: null,
  end: null
}
const defaultConversationSentence = {
  id: null,
  sentence: '',
  start: null,
  end: null
}
export default {
  name: 'LookAndRepeatLetterWordSentenceConversationManagement',
  components: {},
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
      const letter = cloneDeep(defaultConversationLetter)
      letter.id = randomstring.generate()
      const word = cloneDeep(defaultConversationWord)
      word.id = randomstring.generate()
      const sentence = cloneDeep(defaultConversationSentence)
      sentence.id = randomstring.generate()

      if (val && val.length > 0) {
        this.conversations = val
      } else {
        this.conversations = [letter, word, sentence]
      }
    },
    setSpeaker(speaker, index) {
      this.conversations[index].speaker = speaker
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
.larlws-conversation-management {
  margin-top: 20px;
  .conversation-item {
    margin-top: 20px;

    .timeline {
      width: 70px;
      margin-left: 10px;
      margin-top: 20px;
    }
    .message {
      width: calc(100% - 340px);
    }
    .delete {
      margin-left: 10px;
      margin-top: 20px;
    }
    .kt-radio-inline-style {
      margin-top: -20px;
    }
  }
}
</style>
