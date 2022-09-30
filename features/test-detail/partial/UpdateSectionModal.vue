<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="$t('button.update')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    title="Chọn section"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <select2-with-validation
        :required="true"
        v-model="form.test_sections"
        :error="vForm.errors.get('test_sections')"
        placeholder="Chọn section ..."
        label="Danh sách section"
        data-vv-as="Danh sách section"
        id-field="_id"
        text-field="name"
        ajax="/test-section/suggest"
        name="test_sections"
        rules="required"
        multiple
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'

import { notifyTryAgain, notifyUpdateSuccess } from '~/utils/bootstrap-notify'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

const defaultForm = {
  test_sections: []
}

export default {
  name: 'UpdateSectionModal',
  components: {
    ValidationObserver,
    Select2WithValidation
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
      this.vForm = new Form()
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.updateItem()
      }
    },
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        const { data } = await this.vForm.post(
          this.$axios.defaults.baseURL + '/test/update-sections'
        )

        notifyUpdateSuccess('Chọn section')
        this.$refs.modal.hide()
        this.onActionSuccess(data)
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
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
