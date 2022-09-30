<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa trình độ' : 'Thêm trình độ'"
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
        v-model="form.name_en"
        :required="true"
        :error="vForm.errors.get('name_en')"
        label="Tên tiếng anh"
        placeholder="Tên tiếng anh"
        rules="required|max:100"
        name="name_en"
      />

      <b-text-area-with-validation
        v-model="form.listen_description"
        :required="true"
        :error="vForm.errors.get('listen_description')"
        label="Mô tả bài nghe"
        placeholder="Mô tả bài nghe"
        rules="required|max:255"
        name="listen_description"
      />

      <b-single-image-upload-with-validation
        v-model="form.listen_image"
        :error="vForm.errors.get('listen_image')"
        :required="true"
        rules="required"
        label="Ảnh bài nghe"
        placeholder="Ảnh bài nghe"
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
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

const defaultForm = {
  name: '',
  name_en: '',
  listen_image: '',
  listen_description: ''
}

export default {
  name: 'DegreeModal',
  components: {
    BSingleImageUploadWithValidation,
    ValidationObserver,
    BTextInputWithValidation,
    BTextAreaWithValidation
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/degree/add')

        notifyAddSuccess('Trình độ')
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/degree/edit')

        notifyUpdateSuccess('Trình độ')
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
