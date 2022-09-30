<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    cancel-title="Đóng"
    title="Thông tin các object"
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
      <point-conversation-audio
        ref="primaryConversationAudio"
        v-model="form.conversations"
        :audio="form.audio"
        :has-score="hasScore"
      ></point-conversation-audio>
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
import PointConversationAudio from '~/components/elements/script/partial/primarySchool/PointConversationAudio'

const defaultForm = {
  audio: '',
  conversations: [],
  duration: null
}
export default {
  name: 'ListenAndPointObjectsModal',
  components: {
    PointConversationAudio,
    BSingleAudioUploadWithValidation,
    ValidationObserver
  },
  props: {
    hasScore: {
      type: Boolean,
      default: false
    },
    backgroundHeight: {
      type: Number,
      default: 0
    },
    backgroundWidth: {
      type: Number,
      default: 0
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
        this.$refs.modal.show()
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
        let height = 0
        let nunFinished = 0
        const length = this.form.conversations.length
        this.form.conversations.forEach((conversation) => {
          if (!conversation.x) {
            conversation.x = 0
          }
          const img = new Image()

          img.src = conversation.url

          img.onload = () => {
            nunFinished++
            conversation.widthOrigin = img.naturalWidth
            conversation.heightOrigin = img.naturalHeight
            conversation.width = img.naturalWidth / this.backgroundWidth
            conversation.height = img.naturalHeight / this.backgroundHeight
            if (!conversation.y) {
              conversation.y = height
              height += conversation.height
            }
            if (nunFinished === length) {
              this.$emit('submit', this.form)
              this.$refs.modal.hide()
            }
          }
        })
      }
    },
    hideButton() {
      this.$refs.modal.hide()
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
