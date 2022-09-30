<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Đoạn hội thoại"
    size="xl"
  >
    <div class="row">
      <div class="col-md-7">
        <validation-observer ref="observer" class="kt-form">
          <b-text-input-with-validation
            v-model="form.score"
            label="Điểm thưởng"
            placeholder="Điểm thưởng"
            rules="numeric|max_value:9999"
            name="score"
          />
          <speaker-management v-model="form.speakers" />
          <b-single-audio-upload-with-validation
            v-model="form.audio"
            :required="true"
            rules="required"
            label="File Audio"
            placeholder="File Audio"
          />

          <div
            v-if="form.audio"
            class="d-flex justify-content-between align-items-center"
          >
            <audio ref="audio" controls class="audio-control">
              <source :src="form.audio" />
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

          <conversation-management
            ref="conversationManagement"
            v-model="form.conversations"
            :speakers="form.speakers"
            @setCurrentAudio="setCurrentAudio"
          />
        </validation-observer>
      </div>
      <div class="col-md-5">
        <div
          class="action-preview p-5 h-100 w-100"
          style="background-color: #F3F5F9;"
        >
          <b-img
            :src="
              require('~/assets/media/activity/preview/Conversation-listen-and-read-step-2-Pause.png')
            "
            style="max-height: 400px;max-width: 380px;"
          ></b-img>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import SpeakerManagement from '~/components/elements/script/SpeakerManagement'
import ConversationManagement from '~/components/elements/script/ConversationManagement'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultForm = {
  audio: null,
  conversations: [],
  speakers: []
}
export default {
  name: 'ConversationModal',
  components: {
    ConversationManagement,
    SpeakerManagement,
    BSingleAudioUploadWithValidation,
    BTextInputWithValidation,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      isStop: true
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      this.isStop = true

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$emit('updateScript', this.form)
        this.$refs.modal.hide()
      }
    },
    startProcess() {
      this.isStop = false
      this.$refs.audio.play()
      this.$refs.conversationManagement.setTimeStart(
        this.$refs.audio.currentTime
      )
    },
    endProcess() {
      this.isStop = true
      this.$refs.audio.pause()
      this.$refs.conversationManagement.setTimeEnd(this.$refs.audio.currentTime)
    },
    setCurrentAudio(start) {
      if (start !== null) {
        this.$refs.audio.currentTime = start
      }
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
