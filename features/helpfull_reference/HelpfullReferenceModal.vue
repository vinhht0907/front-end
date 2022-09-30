<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="
      isEdit ? 'Sửa nguồn tham khảo hữu ích' : 'Thêm nguồn tham khảo hữu ích'
    "
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
        label="Tên nguồn tham khảo hữu ích"
        placeholder="Tên nguồn tham khảo hữu ích"
        rules="required|max:100"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.link"
        :required="true"
        :error="vForm.errors.get('link')"
        label="Đường dẫn"
        placeholder="Đường dẫn"
        rules="required"
        name="name"
      />

      <b-single-image-upload-with-validation
        v-model="form.featured_image"
        :error="vForm.errors.get('featured_image')"
        :required="true"
        rules="required"
        label="Ảnh đại diện"
        placeholder="Ảnh đại diện"
      />

      <select2-with-validation
        :required="true"
        v-model="form.helpfull_reference_category"
        :error="vForm.errors.get('helpfull_reference_category')"
        placeholder="Chọn danh mục..."
        label="danh mục"
        data-vv-as="danh mục"
        id-field="_id"
        text-field="name"
        ajax="/helpfull-reference-category/suggest"
        name="helpfull_reference_category"
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

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import CheckboxesWithValidation from '~/components/base/input/CheckboxesWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'

const defaultForm = {
  name: '',
  featured_image: '',
  status: true,
  link: '',
  helpfull_reference_category: null
}

export default {
  name: 'HelpfullReferenceCategoryModal',
  components: {
    BSingleImageUploadWithValidation,
    Select2WithValidation,
    ValidationObserver,
    BTextInputWithValidation,
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
          this.$axios.defaults.baseURL + '/helpfull-reference/add'
        )

        notifyAddSuccess('nguồn tham khảo hữu ích')
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
          this.$axios.defaults.baseURL + '/helpfull-reference/edit'
        )

        notifyUpdateSuccess('nguồn tham khảo hữu ích')
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
