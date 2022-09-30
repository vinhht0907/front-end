<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa loại hoạt động' : 'Thêm loại hoạt động'"
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
        label="Tên loại bài tập"
        placeholder="Tên loại bài tập"
        rules="required|max:100"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.desc"
        :required="true"
        :error="vForm.errors.get('desc')"
        label="Mô tả"
        placeholder="Mô tả"
        rules="required|max:100"
        name="desc"
      />

      <b-text-input-with-validation
        v-model="form.type"
        :required="true"
        :error="vForm.errors.get('type')"
        label="Loại"
        placeholder="Loại"
        rules="required|max:100"
        name="type"
      />

      <b-text-input-with-validation
        v-model="form.display"
        :required="true"
        :error="vForm.errors.get('display')"
        label="Loại hiển thị"
        placeholder="Loại hiển thị"
        rules="required|max:30"
        name="type"
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

      <b-text-input-with-validation
        v-model="form.tutorial"
        :error="vForm.errors.get('tutorial')"
        label="Video hướng dẫn làm bài"
        placeholder="Video hướng dẫn làm bài"
        rules=""
        name="tutorial"
      />
      <div class="row">
        <b-single-image-upload-with-validation
          v-model="form.icon"
          :error="vForm.errors.get('icon')"
          :required="true"
          class="col-6"
          rules="required"
          label="Ảnh đại diện"
          placeholder="Ảnh đại diện"
        />

        <b-single-image-upload-with-validation
          v-model="form.preview"
          :error="vForm.errors.get('preview')"
          :required="true"
          class="col-6"
          rules="required"
          label="Ảnh ví dụ"
          placeholder="Ảnh ví dụ"
        />
      </div>
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
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'

const defaultForm = {
  name: '',
  type: '',
  display: '',
  desc: '',
  icon: null,
  preview: null,
  tutorial: ''
}

export default {
  name: 'ActivityTypeModal',
  components: {
    BSingleImageUploadWithValidation,
    ValidationObserver,
    BTextInputWithValidation
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
          this.$axios.defaults.baseURL + '/activity-type/add'
        )

        notifyAddSuccess('loại bài tập')
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
          this.$axios.defaults.baseURL + '/activity-type/edit'
        )

        notifyUpdateSuccess('loại bài tập')
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
