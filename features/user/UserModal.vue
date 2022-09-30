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

      <role-chosen
        v-model="form.role"
        :error="vForm.errors.get('role')"
        rules="required"
        name="role"
      />

      <select2-with-validation
        :required="true"
        v-model="form.statusObject"
        :options="statusOptions"
        text-field="text"
        id-field="id"
        placeholder="Select status..."
        label="Status"
        data-vv-as="Status"
        rules="required"
        name="question"
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
import RoleChosen from '~/components/elements/role/RoleChosen'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultForm = {
  full_name: '',
  email: '',
  password: '',
  repassword: '',
  status: 'active',
  statusObject: {
    id: 'active',
    text: 'Active'
  }
}

export default {
  name: 'UserModal',
  components: {
    ValidationObserver,
    Select2WithValidation,
    RoleChosen,
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
      vForm: new Form(),
      statusOptions: [
        {
          id: 'active',
          text: 'Active'
        },
        {
          id: 'block',
          text: 'Deactivated'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        item.statusObject = {
          id: item.status,
          text: item.statusObject === 'block' ? 'Deactivated' : 'Active'
        }
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
        this.form.status = this.form.statusObject.id
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/user/add')

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
        this.form.status = this.form.statusObject.id
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/user/' + this.form._id
        )

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
