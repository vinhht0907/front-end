<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Listen and repeat sentence"
    size="xl"
  >
    <b-row>
      <b-col cols="12"
        ><validation-observer ref="observer" class="kt-form">
          <look-listen-repeat-sentence-list v-model="form.data" />
        </validation-observer>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import LookListenRepeatSentenceList from '~/components/elements/script/partial/primarySchool/LookListenRepeatSentenceList'

const defaultForm = {
  data: null
}
export default {
  name: 'LookListenRepeatSentenceModal',
  components: {
    LookListenRepeatSentenceList,
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
