<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa trường học' : 'Thêm trường học'"
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
        label="Tên trường học"
        placeholder="Tên trường học"
        rules="required|max:100"
        name="name"
      />

      <select2-with-validation
        :required="true"
        v-model="form.provincial"
        :error="vForm.errors.get('provincial')"
        placeholder="Chọn sở giáo dục..."
        label="Sở giáo dục"
        data-vv-as="Sở giáo dục"
        id-field="_id"
        text-field="name"
        ajax="/provincial-department-of-educations/suggest"
        name="provincial"
        rules="required"
      />

      <select2-with-validation
        :required="false"
        v-model="form.district"
        :error="vForm.errors.get('district')"
        :post-data="{ provincial: form.provincial }"
        :allow-clear="true"
        placeholder="Chọn phòng giáo dục..."
        label="Phòng giáo dục"
        data-vv-as="Phòng giáo dục"
        id-field="_id"
        text-field="name"
        ajax="/district-department-of-educations/suggest"
        name="district"
        rules=""
      />

      <select2-with-validation
        :required="true"
        v-model="form.school_level"
        :error="vForm.errors.get('school_level')"
        :allow-clear="true"
        :rules="'required'"
        :multiple="true"
        placeholder="Chọn cấp học..."
        label="Cấp học"
        data-vv-as="Cấp học"
        id-field="_id"
        text-field="name"
        ajax="/school-level/suggest"
        name="school_level"
      />

      <select2-with-validation
        :required="true"
        v-model="form.current_year"
        :error="vForm.errors.get('current_year')"
        placeholder="Chọn năm học..."
        label="Năm học"
        data-vv-as="Năm học"
        id-field="_id"
        text-field="name"
        ajax="/school-year/suggest"
        name="current_year"
        rules="required"
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
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultForm = {
  name: '',
  short_name: '',
  provincial: null,
  district: null,
  current_year: null,
  school_level: []
}

export default {
  name: 'SchoolModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
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
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form()
    }
  },
  watch: {
    'form.provincial': {
      handler(val, oldVal) {
        if (oldVal != null) {
          this.form.district = null
        }
      },
      deep: true
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/school/add')

        notifyAddSuccess('trường học')
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/school/edit')

        notifyUpdateSuccess('trường học')
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
