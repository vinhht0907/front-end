<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Nghe và trả lời nhiều câu hỏi"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
          <!--          <b-single-audio-upload-with-validation-->
          <!--            v-model="form.audio"-->
          <!--            :required="true"-->
          <!--            rules="required"-->
          <!--            label="File Audio"-->
          <!--            placeholder="File Audio"-->
          <!--          />-->
          <script-attachment
            v-model="form.attachment"
            :list-display="['none', 'image', 'audio', 'video']"
            label="Tập tin đính kèm"
            is-transcript
          />
          <l-a-q-with-order-list v-model="form.items" />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview h-100 w-100">
          <l-a-q-with-order-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import LAQWithOrderList from '~/components/elements/script/partial/LAQWithOrderList'
// import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import LAQWithOrderPreview from '~/components/elements/script/preview/LAQWithOrderPreview'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'

const defaultForm = {
  items: null,
  attachment: null
}
export default {
  name: 'LAQWithOrderModal',
  components: {
    ScriptAttachment,
    LAQWithOrderPreview,
    LAQWithOrderList,
    // BSingleAudioUploadWithValidation,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm)
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)

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
