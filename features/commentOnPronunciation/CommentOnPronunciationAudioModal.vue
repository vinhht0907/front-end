<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    ok-title="Đồng ý"
    title="Audio của câu nhận xét"
    size="lg"
  >
    <validation-observer
      ref="observer"
      class="kt-form comment-pronunciation-form"
    >
      <b-single-audio-upload-with-validation
        v-model="form.audio_path"
        :required="true"
        rules="required"
        label="File Audio"
        placeholder="File Audio"
      />

      <div v-if="form.audio_path">
        <div class="d-flex justify-content-between align-items-center">
          <audio ref="audio" controls class="audio-control">
            <source :src="form.audio_path" />
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

        <comment-on-pronunciation-audio-split
          ref="audioSplit"
          v-model="form.split_texts"
          @setCurrentAudio="setCurrentAudio"
        />
      </div>
    </validation-observer>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import CommentOnPronunciationAudioSplit from '~/features/commentOnPronunciation/CommentOnPronunciationAudioSplit'

const defaultForm = {
  text: null,
  key: [],
  audio_path: '',
  split_texts: []
}

export default {
  name: 'CommentOnPronunciationAudioModal',
  components: {
    ValidationObserver,
    BSingleAudioUploadWithValidation,
    CommentOnPronunciationAudioSplit
  },
  data() {
    return { form: cloneDeep(defaultForm), isStop: true }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      if (!this.form.split_texts) {
        const textArr = this.form.text.split(/(\[\[.*?\]\])/)
        const splitTexts = textArr.map((v, k) => {
          if (k % 2 === 0) {
            return {
              id: k,
              text: v,
              isDescriptor: false,
              start: null,
              end: null
            }
          } else {
            return {
              id: k,
              text: v,
              isDescriptor: true
            }
          }
        })
        this.form.split_texts = splitTexts
      }

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
        this.$emit('updateTexts', this.form)
        this.$refs.modal.hide()
      }
    },
    startProcess() {
      this.isStop = false
      this.$refs.audio.play()
      this.$refs.audioSplit.setTimeStart(this.$refs.audio.currentTime)
    },
    endProcess() {
      this.isStop = true
      this.$refs.audio.pause()
      this.$refs.audioSplit.setTimeEnd(this.$refs.audio.currentTime)
    },
    setCurrentAudio(start) {
      if (start !== null) {
        this.$refs.audio.currentTime = start
      }
    }
  }
}
</script>
