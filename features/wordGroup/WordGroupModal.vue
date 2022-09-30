<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa bộ từ' : 'Thêm bộ từ'"
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
        label="Bộ từ"
        placeholder="Bộ từ"
        rules="required|max:50"
        name="name"
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

      <select2-with-validation
        :required="true"
        v-model="form.words"
        :error="vForm.errors.get('words')"
        placeholder="Chọn từ ..."
        label="Danh sách từ"
        data-vv-as="Danh sách từ"
        id-field="_id"
        text-field="name"
        ajax="/word/suggest"
        name="words"
        rules="required"
        multiple
      />

      <select2-with-validation
        :required="true"
        v-model="form.word_category"
        :error="vForm.errors.get('word_category')"
        placeholder="Chọn chủ đề..."
        label="Chủ đề"
        data-vv-as="Chủ đề"
        id-field="_id"
        text-field="name"
        ajax="/word-category/suggest"
        name="word_category"
        rules="required"
      />

      <select2-with-validation
        :required="true"
        v-model="form.degree"
        :error="vForm.errors.get('degree')"
        placeholder="Chọn trình độ..."
        label="Trình độ"
        data-vv-as="Trình độ"
        id-field="_id"
        text-field="name"
        ajax="/degree/suggest"
        name="degree"
        rules="required"
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
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import CheckboxesWithValidation from '~/components/base/input/CheckboxesWithValidation'

const defaultForm = {
  name: '',
  featured_image: '',
  words: []
}

export default {
  name: 'WordGroupModal',
  components: {
    CheckboxesWithValidation,
    BTextAreaWithValidation,
    BSingleImageUploadWithValidation,
    Select2WithValidation,
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/word-group/add')

        notifyAddSuccess('Bộ từ')
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/word-group/edit')

        notifyUpdateSuccess('Bộ từ')
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
