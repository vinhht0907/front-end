<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Điền vào chỗ trống"
    size="xl"
  >
    <b-row>
      <b-col cols="6"
        ><validation-observer ref="observer" class="kt-form">
          <script-attachment
            v-model="form.attachment"
            :list-display="['none', 'image', 'audio', 'video']"
            label="Tập tin đính kèm"
          />
          <listen-fill-in-blank-list v-model="form.items" />
        </validation-observer>
      </b-col>
      <b-col cols="6">
        <div class="action-preview p-5 h-100 w-100">
          <listen-fill-in-blank-writing-preview :form="form" />
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import ListenFillInBlankList from '~/components/elements/script/partial/ListenFillInBlankList'
import ListenFillInBlankWritingPreview from '~/components/elements/script/preview/ListenFillInBlankWritingPreview'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'

const defaultForm = {
  items: null
}
export default {
  name: 'ListenFillInBlankWritingModal',
  components: {
    ScriptAttachment,
    ListenFillInBlankWritingPreview,
    ListenFillInBlankList,
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
