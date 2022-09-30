<template>
  <div class="let-talk-conversation-management-content">
    <div class="conversation-item d-flex align-items-center">
      <el-popover>
        <div class="speaker-management">
          <div class="speaker-list">
            <div
              v-for="speaker in speakers"
              @click="setSpeaker(speaker)"
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
          <img
            v-if="innerValue.speakerObject"
            :src="innerValue.speakerObject.avatar"
          />
          <i v-else class="la la-plus"></i>
        </a>
      </el-popover>
      <div class="message">
        <b-form-textarea
          v-model="innerValue.content"
          placeholder="Nhập nội dung..."
          max-rows="5"
          rows="1"
          class="mb-2"
        ></b-form-textarea>
        <b-text-input-with-validation
          v-if="hasScore"
          v-model="innerValue.score"
          placeholder="Điểm thưởng"
          rules="numeric|max_value:9999"
          name="score"
          label-name="Trường này"
          class="mt-2 d-block"
        />
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
export default {
  name: 'LetTalkConversationContent',
  components: {
    BTextInputWithValidation
  },
  props: {
    value: {
      type: Object,
      default: () => null
    },
    hasScore: {
      type: Boolean,
      default: false
    },
    speakers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      innerValue: null
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
        this.innerValue = {}
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = {}
    }
  },
  methods: {
    setSpeaker(speaker) {
      this.innerValue.speakerObject = cloneDeep(speaker)
      this.innerValue.speaker = speaker.name
      this.innerValue.avatar = speaker.avatar
    }
  }
}
</script>

<style lang="scss" scoped>
.let-talk-conversation-management-content {
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
      width: 100%;
    }
    .delete {
      margin-left: 10px;
    }
  }
}
</style>
