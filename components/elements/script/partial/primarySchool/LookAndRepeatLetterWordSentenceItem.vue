<template>
  <div>
    <base-input-score v-model="innerValue.score" />
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
    <look-and-repeat-letter-word-sentence-conversation-management
      ref="larlwsConversationManagement"
      v-model="innerValue.conversations"
      @setCurrentAudio="setCurrentAudio"
    />
  </div>
</template>

<script>
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import LookAndRepeatLetterWordSentenceConversationManagement from '~/components/elements/script/partial/primarySchool/LookAndRepeatLetterWordSentenceConversationManagement'
export default {
  name: 'LookAndRepeatLetterWordSentenceItem',
  components: {
    BaseInputScore,
    BSingleAudioUploadWithValidation,
    LookAndRepeatLetterWordSentenceConversationManagement
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
    'innerValue.conversations': {
      deep: true,
      handler(val) {
        if (this.innerValue.conversations) {
          this.innerValue.letter = this.innerValue.conversations[0]
            ? this.innerValue.conversations[0]
            : null
          if (this.innerValue.letter) {
            this.innerValue.letter.text = this.innerValue.letter.letter
          }
          this.innerValue.word = this.innerValue.conversations[1]
            ? this.innerValue.conversations[1]
            : null
          if (this.innerValue.word) {
            this.innerValue.word.text = this.innerValue.word.word
          }
          this.innerValue.sentence = this.innerValue.conversations[2]
            ? this.innerValue.conversations[2]
            : null
          if (this.innerValue.sentence) {
            this.innerValue.sentence.text = this.innerValue.sentence.sentence
          }
        }
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
      this.$refs.larlwsConversationManagement.setTimeStart(
        this.$refs.audio.currentTime
      )
    },
    endProcess() {
      this.isStop = true
      this.$refs.audio.pause()
      this.$refs.larlwsConversationManagement.setTimeEnd(
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
