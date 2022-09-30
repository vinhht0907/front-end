<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa khóa học' : 'Thêm khóa học'"
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
        label="Tên khóa học"
        placeholder="Tên khóa học"
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

      <b-text-area-with-validation
        v-model="form.description_web"
        :required="true"
        :error="vForm.errors.get('description_web')"
        label="Mô tả trên web"
        placeholder="Mô tả trên web"
        rules="required|max:255"
        name="description_web"
      />

      <grade-chosen
        v-model="form.grade"
        :error="vForm.errors.get('grade')"
        rules="required"
        name="grade"
      />

      <b-single-image-upload-with-validation
        v-model="form.featured_image"
        :error="vForm.errors.get('featured_image')"
        :required="true"
        rules="required"
        label="Ảnh đại diện"
        placeholder="Ảnh đại diện"
      />

      <b-single-image-upload-with-validation
        v-model="form.banner_image"
        :error="vForm.errors.get('banner_image')"
        label="Ảnh banner"
        placeholder="Ảnh banner"
      />

      <b-single-image-upload-with-validation
        v-model="form.featured_image_web"
        :error="vForm.errors.get('featured_image_web')"
        :required="true"
        rules="required"
        label="Ảnh đại diện trên web"
      />

      <select2-with-validation
        :required="true"
        v-model="form.layout"
        :error="vForm.errors.get('layout')"
        :options="layoutOptions"
        placeholder="Layout"
        label="Layout"
        data-vv-as="Layout"
        id-field="id"
        text-field="text"
        name="layout"
        rules="required"
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
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import CheckboxesWithValidation from '~/components/base/input/CheckboxesWithValidation'
import GradeChosen from '~/components/elements/grade/GradeChosen'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

const defaultForm = {
  name: '',
  display_name: '',
  description: '',
  featured_image: '',
  grade: null
}

export default {
  name: 'CourseModal',
  components: {
    Select2WithValidation,
    CheckboxesWithValidation,
    BSingleImageUploadWithValidation,
    ValidationObserver,
    BTextInputWithValidation,
    BTextAreaWithValidation,
    GradeChosen
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
      vForm: new Form(),
      layoutOptions: [
        {
          id: 'primary_school',
          text: 'Tiểu học'
        },
        {
          id: 'high_school',
          text: 'Trung học phổ thông'
        }
      ]
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        if (this.form.layout) {
          this.form.layout = {
            id: this.form.layout,
            text: ''
          }
        }
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
        const formData = cloneDeep(this.form)
        formData.layout = formData.layout.id
        this.vForm = new Form(formData)
        await this.vForm.post(this.$axios.defaults.baseURL + '/course/add')

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
        const formData = cloneDeep(this.form)
        formData.layout = formData.layout.id
        this.vForm = new Form(formData)
        await this.vForm.post(this.$axios.defaults.baseURL + '/course/edit')

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
