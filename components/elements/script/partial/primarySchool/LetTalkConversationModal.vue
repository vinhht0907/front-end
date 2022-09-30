<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Let talk conversation"
    size="xl"
  >
    <div class="row">
      <div class="col-md-7">
        <validation-observer ref="observer" class="kt-form">
          <speaker-management v-model="form.speakers" />

          <let-talk-conversation-list
            v-model="form.conversations"
            :speakers="form.speakers"
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
import SpeakerManagement from '~/components/elements/script/SpeakerManagement'
import LetTalkConversationList from '~/components/elements/script/partial/primarySchool/LetTalkConversationList'

const defaultForm = {
  conversations: [],
  speakers: []
}
export default {
  name: 'LetTalkConversationModal',
  components: {
    SpeakerManagement,
    ValidationObserver,
    LetTalkConversationList
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
    }
  }
}
</script>
