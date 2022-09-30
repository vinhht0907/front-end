<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Speaking coach sentence"
    size="xl"
  >
    <b-row>
      <b-col cols="7"
        ><validation-observer ref="observer" class="kt-form">
          <script-attachment
            v-model="form.attachment"
            :list-display="['audio']"
            type-value="audio"
            type="audio"
            label="Tập tin đính kèm"
          />
          <b-text-input-with-validation
            :required="true"
            v-model="form.sentence"
            label="Câu - Âm luyện tập được đặt trong dấu < >"
            placeholder="He has <br>ead and ice"
            name="name"
            rules="required"
          />
          <base-input-score v-model="form.score" />
        </validation-observer>
      </b-col>
      <b-col cols="5">
        <div class="action-preview p-5 h-100 w-100">
          <single-choice-inline-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import SingleChoiceInlinePreview from '~/components/elements/script/preview/SingleChoiceInlinePreview'

const defaultForm = {
  items: []
}
export default {
  name: 'SpeakingCoachSentenceModal',
  components: {
    BTextInputWithValidation,
    ScriptAttachment,
    BaseInputScore,
    SingleChoiceInlinePreview,
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
