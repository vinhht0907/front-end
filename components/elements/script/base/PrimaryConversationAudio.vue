<template>
  <div>
    <div v-if="audio" class="d-flex justify-content-between align-items-center">
      <audio ref="audio" controls class="audio-control">
        <source :src="audio" />
      </audio>

      <button
        v-if="isStop"
        @click="startProcess"
        class="btn btn-success"
        style="width: 135px;"
      >
        Tách timeline
      </button>
      <button
        v-else
        @click="endProcess"
        class="btn btn-danger"
        style="width: 135px;"
      >
        Ngắt
      </button>
    </div>

    <primary-conversation
      ref="primaryConversation"
      v-model="conversations"
      @setCurrentAudio="setCurrentAudio"
    />
  </div>
</template>

<script>
import PrimaryConversation from '~/components/elements/script/base/PrimaryConversation'

export default {
  name: 'PrimaryConversationAudio',
  components: {
    PrimaryConversation
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    audio: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isStop: true,
      conversations: []
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
    this.conversations = this.value
  },
  methods: {
    startProcess() {
      this.isStop = false
      this.$refs.audio.play()
      this.$refs.primaryConversation.setTimeStart(this.$refs.audio.currentTime)
    },
    endProcess() {
      this.isStop = true
      this.$refs.audio.pause()
      this.$refs.primaryConversation.setTimeEnd(this.$refs.audio.currentTime)
    },
    setCurrentAudio(start) {
      if (start !== null) {
        this.$refs.audio.currentTime = start
      }
    },
    setFocus(conversation) {
      this.$refs.primaryConversation.setFocus(conversation)
    }
  }
}
</script>

<style lang="scss">
.audio-control {
  width: calc(100% - 150px);
}
.conversation-form-list {
  margin-top: 15px;
}
.conversation-form-item {
  margin-top: 15px;
}
</style>
