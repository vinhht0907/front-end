<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa bài tập thành ngữ' : 'Thêm bài tập thành ngữ'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :error="vForm.errors.get('name')"
        label="Tên"
        placeholder="Tên"
        rules="required|max:100"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.display_name"
        :required="true"
        :error="vForm.errors.get('display_name')"
        label="Tên hiển thị"
        placeholder="Tên hiển thị"
        rules="required|max:255"
        name="display_name"
      />

      <b-text-area-with-validation
        v-model="form.description"
        :required="true"
        :error="vForm.errors.get('description')"
        label="Mô tả"
        placeholder="Mô tả"
        rules="required|max:255"
        name="description"
      />

      <b-single-image-upload-with-validation
        v-model="form.featured_image"
        :error="vForm.errors.get('featured_image')"
        :required="true"
        rules="required"
        label="Ảnh đại diện"
        placeholder="Ảnh đại diện"
      />

      <b-text-input-with-validation
        v-if="isEdit"
        :required="true"
        v-model="form.order"
        :error="vForm.errors.get('order')"
        label="Thứ tự"
        placeholder="Thứ tự"
        rules="required|numeric|max_value:9999"
        name="order"
      />

      <select2-with-validation
        :required="true"
        v-model="form.idioms"
        :error="vForm.errors.get('idioms')"
        placeholder="Chọn thành ngữ..."
        label="Thành ngữ"
        data-vv-as="Thành ngữ"
        id-field="_id"
        text-field="name"
        ajax="/idioms/suggest"
        name="idioms"
        rules="required"
      />

      <checkboxes-with-validation
        :required="true"
        v-model="form.status"
        :error="vForm.errors.get('status')"
        label="Trạng thái"
        placeholder="Trạng thái"
        rules="required"
        name="status"
        switch
        size="lg"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import CheckboxesWithValidation from '~/components/base/input/CheckboxesWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'

const defaultForm = {
  name: '',
  display_name: '',
  description: '',
  featured_image: '',
  idioms: null,
  status: true
}

export default {
  name: 'IdiomsActivityModal',
  components: {
    BSingleImageUploadWithValidation,
    ValidationObserver,
    BTextInputWithValidation,
    BTextAreaWithValidation,
    Select2WithValidation,
    CheckboxesWithValidation
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
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
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/idioms-activity/add'
        )

        notifyAddSuccess('Bài tập thành ngữ')
        this.$refs.modal.hide()
        this.onActionSuccess()
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
          this.$axios.defaults.baseURL + '/idioms-activity/edit'
        )

        notifyUpdateSuccess('Bài tập thành ngữ')
        this.$refs.modal.hide()
        this.onActionSuccess()
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
