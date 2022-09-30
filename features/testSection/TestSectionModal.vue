<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa section' : 'Thêm section'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <!-- <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :error="vForm.errors.get('name')"
        label="Tên"
        placeholder="Tên"
        rules="required|max:100"
        name="name"
      /> -->
      <b-text-input-with-validation
        v-model="form.name_display"
        :error="vForm.errors.get('name_display')"
        label="Tên hiển thị"
        placeholder="Tên hiển thị"
        rules="max:100"
        name="name_display"
      />
      <b-text-area-with-validation
        v-model="form.description"
        :error="vForm.errors.get('description')"
        label="Mô tả"
        placeholder="Mô tả"
        rules="max:1024"
        name="description"
      />

      <b-text-input-with-validation
        v-model="form.time"
        :error="vForm.errors.get('time')"
        label="Thời lượng (phút)"
        placeholder="Thời lượng (phút)"
        rules="numeric"
        name="time"
      />
      <select2-with-validation
        v-if="!testId"
        v-model="form.test_parts"
        :error="vForm.errors.get('test_parts')"
        placeholder="Chọn part ..."
        label="Danh sách part"
        data-vv-as="Danh sách part"
        id-field="_id"
        text-field="name"
        ajax="/test-part/suggest"
        name="test_parts"
        multiple
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

const defaultForm = {
  name: '',
  name_display: '',
  description: '',
  time: null
}

export default {
  name: 'TestSectionModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    BTextAreaWithValidation,
    Select2WithValidation
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    },
    testId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form()
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        if (this.form.order === 0) {
          this.form.order = '0'
        }
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
      this.isEdit = false
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        if (this.isEdit) {
          await this.updateItem()
        } else {
          await this.addItem()
        }
      }
    },
    async addItem() {
      try {
        if (this.testId) {
          this.form.test_id = this.testId
        }
        this.vForm = new Form(this.form)
        const { data } = await this.vForm.post(
          this.$axios.defaults.baseURL + '/test-section/add'
        )

        notifyAddSuccess('Section')
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
    },
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/test-section/edit'
        )

        notifyUpdateSuccess('Section')
        this.$refs.modal.hide()
        this.onActionSuccess(this.form)
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
