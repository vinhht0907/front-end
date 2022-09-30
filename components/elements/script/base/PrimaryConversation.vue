<template>
  <perfect-scrollbar ref="conversationWrap" class="conversation-wrap">
    <div class="primary-management">
      <div class="d-flex justify-content-between align-items-center">
        <label>Nội dung hội thoại(Từ in đậm được đặt trong &lt;&gt;)</label>
      </div>
      <div
        v-for="(conversation, index) in conversations"
        :key="conversation.id"
        class="conversation-item d-flex align-items-center"
      >
        <div :ref="`index_${index}`" class="kt-radio-inline answer-radio">
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
          <b-text-area-with-validation
            :ref="conversation.id"
            v-model="conversation.content"
            @change="(val) => changeContent(val, index)"
            placeholder="<D>, <d>, <d>uck."
            max-rows="5"
            rows="1"
            class="mb-2"
            name="content"
            rules="required"
            label-name="Trường này"
          ></b-text-area-with-validation>
        </div>

        <b-text-input-with-validation
          v-model="conversation.start"
          :ref="'start' + conversation.id"
          :vid="'start' + conversation.id"
          class="timeline"
          placeholder="start..."
          rules="required"
          label-name="Trường này"
        />
        <b-text-input-with-validation
          v-model="conversation.end"
          :ref="'end' + conversation.id"
          :vid="'end' + conversation.id"
          class="timeline"
          placeholder="end..."
          rules="required"
          label-name="Trường này"
        />
        <div class="d-flex flex-column action">
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
          ><a
            @click="createItem(index)"
            href="javascript:;"
            class="text-success delete"
            >Thêm</a
          >
        </div>
      </div>
    </div>
  </perfect-scrollbar>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import randomstring from 'randomstring'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultConversation = {
  id: null,
  content: '',
  start: null,
  end: null
}
export default {
  name: 'PrimaryConversation',
  components: {
    BTextAreaWithValidation,
    BTextInputWithValidation
  },
  props: {
    value: {
      type: Array,
      default: () => []
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
    },
    currentIndex(val) {
      if (this.$refs[`index_${val}`]) {
        const top = this.$refs[`index_${val}`][0].offsetTop

        this.$refs.conversationWrap.$el.scrollTop = top - 100
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
    deleteItem(index) {
      this.conversations.splice(index, 1)
    },
    createItem(index) {
      const clone = cloneDeep(defaultConversation)
      clone.id = randomstring.generate()
      this.conversations.splice(index + 1, 0, clone)
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
    setFocus(conversation) {
      const index = this.conversations.findIndex(
        (item) => item.id === conversation.id
      )
      if (index >= 0) {
        this.currentIndex = index
      }
      if (this.$refs[conversation.id]) {
        this.$refs[conversation.id][0].focus()
      }
    }
  }
}
</script>

<style lang="scss">
.primary-management {
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
      width: 100px;
      margin-left: 10px;
      margin-top: 0px;
    }
    .message {
      width: calc(100% - 370px);
    }
    .delete {
      margin-left: 10px;
    }
    .answer-radio {
      margin-top: -30px;
    }
    .action {
      margin-top: -10px;
    }
  }
}
</style>
