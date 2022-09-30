<template>
  <div>
    <b-single-audio-upload-with-validation
      v-model="innerValue.audio"
      :required="true"
      rules="required"
      label="File Audio"
      placeholder="File Audio"
    />

    <div
      v-if="innerValue.audio"
      class="d-flex justify-content-between align-items-center"
    >
      <audio ref="audio" controls class="audio-control">
        <source :src="innerValue.audio" />
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
    <listen-and-number-conversation-management
      ref="lanConversationManagement"
      v-model="innerValue.conversations"
      @setCurrentAudio="setCurrentAudio"
      :has-score="true"
    />
  </div>
</template>

<script>
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import ListenAndNumberConversationManagement from '~/components/elements/script/partial/primarySchool/ListenAndNumberConversationManagement'
export default {
  name: 'ListenAndNumberItem',
  components: {
    BSingleAudioUploadWithValidation,
    ListenAndNumberConversationManagement
  },
  props: {
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      innerValue: null,
      isStop: true
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
        this.innerValue = {
          audio: null,
          conversations: []
        }
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = {
        audio: null,
        conversations: []
      }
    }
  },
  methods: {
    startProcess() {
      this.isStop = false
      this.$refs.audio.play()
      this.$refs.lanConversationManagement.setTimeStart(
        this.$refs.audio.currentTime
      )
    },
    endProcess() {
      this.isStop = true
      this.$refs.audio.pause()
      this.$refs.lanConversationManagement.setTimeEnd(
        this.$refs.audio.currentTime
      )
    },
    setCurrentAudio(start) {
      if (start !== null) {
        this.$refs.audio.currentTime = start
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.audio-control {
  width: calc(100% - 150px);
}
</style>
