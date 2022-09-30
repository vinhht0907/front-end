<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    ok-title="Đổi trạng thái"
    title="Chú thích"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <e-text-area-with-validation
        v-model="form.note"
        :required="true"
        :show-word-limit="true"
        :error="vForm.errors.get('note')"
        :label="'Chú thích'"
        :rows="5"
        maxlength="255"
        rules="required"
        name="note"
      >
      </e-text-area-with-validation>
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import { HTTP_CODE_422 } from '~/constants/httpCode'
import { notifyTryAgain, notify } from '~/utils/bootstrap-notify'
import ETextAreaWithValidation from '~/components/base/input/ETextAreaWithValidation'

const defaultForm = {
  note: ''
}

export default {
  name: 'NoteModal',
  components: {
    ValidationObserver,
    ETextAreaWithValidation
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      vForm: new Form()
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        this.form = cloneDeep(item)
      }

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.inActivePost()
      }
    },
    async inActivePost() {
      try {
        this.form.status = false
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/post/change-status'
        )
        notify(
          'Thông báo',
          'Đổi trạng thái thành công',
          'success',
          'icon la la-check'
        )
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (status !== HTTP_CODE_422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    }
  }
}
</script>
