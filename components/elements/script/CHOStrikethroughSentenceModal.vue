<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Common highlight or strikethrough sentence"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <b-text-input-with-validation
            v-model="form.title"
            :required="true"
            label="Tiêu đề"
            placeholder="Tiêu đề"
            name="title"
            rules="required"
          />
          <b-text-input-with-validation
            v-model="form.title_vn"
            label="Tiêu đề tiếng việt"
            placeholder="Tiêu đề tiếng việt"
            name="title_vn"
          />
          <script-attachment
            v-model="form.attachment"
            :list-display="['none', 'image', 'audio', 'video']"
            label="Tập tin đính kèm"
          />
          <b-form-group label="Loại câu hỏi">
            <b-form-radio-group
              :options="options"
              v-model="form.question_type"
              class="pt-2 theme-custom-radio"
              value-field="type"
              text-field="name"
              size="lg"
            ></b-form-radio-group>
          </b-form-group>
          <c-h-o-strikethrough-sentence-list v-model="form.items" />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview h-100 w-100">
          <f-i-b-multipart-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import CHOStrikethroughSentenceList from '~/components/elements/script/partial/CHOStrikethroughSentenceList'
import FIBMultipartPreview from '~/components/elements/script/preview/FIBMultipartPreview'

const defaultForm = {
  items: null
}
export default {
  name: 'CHOStrikethroughSentenceModal',
  components: {
    CHOStrikethroughSentenceList,
    BTextInputWithValidation,
    ScriptAttachment,
    FIBMultipartPreview,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      options: [
        { type: 'highlight', name: 'Highlight' },
        { type: 'strikethrought', name: 'Strikethrought' }
      ]
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      if (!this.form.question_type) {
        this.form.question_type = 'highlight'
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
        this.$emit('updateScript', this.form)
        this.$refs.modal.hide()
      }
    }
  }
}
</script>
