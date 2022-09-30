<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa chủ đề' : 'Thêm chủ đề'"
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
        label="Tên chủ đề"
        placeholder="Tên chủ đề"
        rules="required|max:100"
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

      <checkboxes-with-validation
        :required="true"
        v-model="form.is_featured"
        :error="vForm.errors.get('is_featured')"
        label="Nổi bật"
        placeholder="Nổi bật"
        rules="required"
        name="is_featured"
        switch
        size="lg"
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
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'

const defaultForm = {
  name: '',
  featured_image: '',
  status: true,
  is_featured: false
}

export default {
  name: 'WordCategoryModal',
  components: {
    BSingleImageUploadWithValidation,
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
          this.$axios.defaults.baseURL + '/word-category/add'
        )

        notifyAddSuccess('Khóa học')
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
          this.$axios.defaults.baseURL + '/word-category/edit'
        )

        notifyUpdateSuccess('Khóa học')
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
