<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('user.edit') : $t('user.add')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.full_name"
        :required="true"
        :label="$t('user.display_name')"
        :placeholder="$t('user.display_name')"
        :error="vForm.errors.get('user.display_name')"
        rules="required|max:255"
        name="full_name"
      />

      <b-text-input-with-validation
        v-model="form.email"
        :required="true"
        :label="$t('user.email')"
        :placeholder="$t('user.email')"
        :error="vForm.errors.get('email')"
        rules="required|max:255|email"
        name="email"
      />

      <b-text-input-with-validation
        v-show="!isEdit"
        v-model="form.password"
        :label="$t('user.password')"
        :placeholder="$t('user.password')"
        :data-vv-as="$t('user.password')"
        :error="vForm.errors.get('password')"
        :required="true"
        :rules="!isEdit ? 'required|max:128|isPassword' : ''"
        :vid="$t('user.password')"
        type="password"
        name="password"
      />

      <b-text-input-with-validation
        v-show="!isEdit"
        v-model="form.repassword"
        :label="$t('user.repassword')"
        :data-vv-as="$t('user.repassword')"
        :placeholder="$t('user.repassword')"
        :error="vForm.errors.get('repassword')"
        :required="true"
        :rules="
          !isEdit
            ? `required|max:128|confirmedTarget:${$t('user.password')}`
            : ''
        "
        type="password"
        name="repassword"
      />

      <select2-with-validation
        :required="true"
        v-model="form.school"
        :error="vForm.errors.get('school')"
        :allow-clear="true"
        placeholder="Chọn trường học..."
        label="Phòng trường học"
        data-vv-as="Phòng trường học"
        id-field="_id"
        text-field="name"
        ajax="/school/suggest"
        name="school"
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

const defaultForm = {
  full_name: '',
  email: '',
  password: '',
  repassword: '',
  school: null,
  status: true
}

export default {
  name: 'UserManagesForSchoolModal',
  components: {
    ValidationObserver,
    CheckboxesWithValidation,
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
  mounted() {},
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
      this.vForm = new Form(this.form)
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
        this.vForm = new Form(formData)

        let url = this.$axios.defaults.baseURL

        url += '/user-manage-for-school/add'

        await this.vForm.post(url)

        notifyAddSuccess(this.$t('user.user'))
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
        this.vForm = new Form(formData)

        let url = this.$axios.defaults.baseURL

        url += '/user-manage-for-school/update'

        await this.vForm.post(url)

        notifyUpdateSuccess(this.$t('user.user'))
        this.$refs.modal.hide()
        this.onActionSuccess()
        await this.$auth.fetchUser()
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
