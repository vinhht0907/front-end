<template>
  <div class="primary-management">
    <div class="d-flex justify-content-between align-items-center">
      <label>Danh sách object</label>
    </div>
    <perfect-scrollbar
      ref="conversationWrap"
      :options="scrollOptions"
      class="conversation-wrap"
    >
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
          <b-row align-v="center">
            <b-col cols="2"
              ><b-single-image-upload-with-validation
                :required="true"
                v-model="conversation.url"
                accept="image/png"
                rules="required"
                label="Ảnh(png)"
                name="url"
            /></b-col>
            <b-col cols="5"
              ><b-text-input-with-validation
                :ref="conversation.id"
                v-model="conversation.text"
                :required="true"
                label="Text"
                placeholder="Text"
                rules="required"
                name="text"
              />
              <base-input-score v-if="hasScore" v-model="conversation.score" />
            </b-col>
            <b-col cols="5"
              ><b-text-input-with-validation
                v-model="conversation.pronunciation"
                label="Phát âm"
                placeholder="Phát âm"
                name="text"
            /></b-col>
          </b-row>
        </div>

        <b-text-input-with-validation
          v-model="conversation.start"
          :required="true"
          label="Start"
          placeholder="start..."
          rules="required"
          name="start"
          form-class="timeline mt-0"
        />
        <b-text-input-with-validation
          v-model="conversation.end"
          :required="true"
          label="End"
          placeholder="end..."
          rules="required"
          name="end"
          form-class="timeline mt-0"
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
          >
        </div>
      </div>
    </perfect-scrollbar>
    <div class="form-group form-group-last row">
      <div class="col-lg-4">
        <a
          @click="addOption"
          href="javascript:;"
          class="btn btn-bold btn-sm btn-label-brand"
        >
          <i class="la la-plus"></i> Thêm object
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import randomstring from 'randomstring'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'

const defaultConversation = {
  id: null,
  text: '',
  url: '',
  pronunciation: '',
  start: null,
  end: null
}
export default {
  name: 'PointConversation',
  components: {
    BaseInputScore,
    BTextInputWithValidation,
    BSingleImageUploadWithValidation
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
      conversations: [],
      currentIndex: 0,
      showTranslation: true,
      scrollOptions: {
        suppressScrollX: true
      }
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
      if (this.$refs[`index_${val}`] && this.$refs[`index_${val}`][0]) {
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
    deleteItem(index) {
      this.conversations.splice(index, 1)
      if (index === 0) {
        this.currentIndex = 0
      } else {
        this.currentIndex = index - 1
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
    addOption() {
      const clone = cloneDeep(defaultConversation)
      clone.id = randomstring.generate()
      this.conversations.push(clone)
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
      width: 70px;
      margin-left: 10px;
      margin-top: -20px;
    }
    .message {
      width: calc(100% - 340px);
    }
    .delete {
      margin-left: 10px;
    }
    .answer-radio {
      margin-top: -40px;
    }
    .action {
      margin-top: -20px;
    }
  }
}
</style>
