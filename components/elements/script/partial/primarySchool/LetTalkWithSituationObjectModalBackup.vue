<template>
  <b-modal
    ref="modalListenAndChantObject"
    :no-enforce-focus="true"
    cancel-title="Đóng"
    title="Thông tin object"
    size="xl"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-single-audio-upload-with-validation
        @getDuration="getDuration"
        :required="true"
        v-model="form.audio"
        rules="required"
        label="Audio"
        name="audio"
      />
      <primary-conversation-audio
        ref="primaryConversationAudio"
        v-model="form.conversations"
        :audio="form.audio"
      ></primary-conversation-audio>
    </validation-observer>
    <template #modal-footer>
      <div class="w-100">
        <div class="float-right">
          <b-button @click="hideButton">
            Đóng
          </b-button>
          <b-button @click="handleModalOk" variant="primary">
            Đồng ý
          </b-button>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import PrimaryConversationAudio from '~/components/elements/script/base/PrimaryConversationAudio'

const defaultForm = {
  audio: '',
  conversations: [],
  duration: null
}
export default {
  name: 'LetTalkWithSituationObjectModal',
  components: {
    PrimaryConversationAudio,
    BSingleAudioUploadWithValidation,
    ValidationObserver
  },
  props: {
    backgroundHeight: {
      type: Number,
      defaultForm: 0
    }
  },
  data() {
    return {
      form: cloneDeep(defaultForm)
    }
  },
  methods: {
    show(item, itemClick) {
      if (item) {
        this.form = cloneDeep(item)
      }

      this.$nextTick(() => {
        this.$refs.modalListenAndChantObject.show()
        if (itemClick) {
          this.setFocus(itemClick)
        }
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.form.conversations.forEach((conversation, index) => {
          if (!conversation.x) {
            conversation.x = 0
          }
          if (!conversation.y) {
            conversation.y =
              (index * this.form.default_text_size) / this.backgroundHeight
          }
        })
        this.$refs.modalListenAndChantObject.hide()
        this.$emit('submit', this.form)
      }
    },
    hideButton() {
      this.$refs.modalListenAndChantObject.hide()
    },
    getDuration(duration) {
      this.form.duration = duration
    },
    setFocus(conversation) {
      setTimeout(() => {
        this.$refs.primaryConversationAudio.setFocus(conversation)
      }, 500)
    }
  }
}
</script>
