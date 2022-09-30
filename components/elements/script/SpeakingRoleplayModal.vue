<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    :title="title"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    size="xl"
  >
    <div class="row">
      <div class="col-md-7">
        <validation-observer ref="observer" class="kt-form">
          <speaker-management v-model="form.speakers" />

          <script-attachment
            v-model="form.attachment"
            :list-display="['none', 'video']"
          />

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
            has-score
          />
        </validation-observer>
      </div>
      <div class="col-md-5">
        <div class="action-preview h-100 w-100">
          <speaking-roleplay-preview :form="form" />
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
import SpeakingRoleplayPreview from '~/components/elements/script/preview/SpeakingRoleplayPreview'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'

const defaultForm = {
  audio: null,
  conversations: [],
  speakers: [],
  attachment: null
}
export default {
  name: 'SpeakingRoleplayModal',
  components: {
    ScriptAttachment,
    ConversationManagement,
    SpeakerManagement,
    BSingleAudioUploadWithValidation,
    SpeakingRoleplayPreview,
    ValidationObserver
  },
  props: {
    title: {
      type: String,
      default: 'Speaking roleplay'
    }
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
