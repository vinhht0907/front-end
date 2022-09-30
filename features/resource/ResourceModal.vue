<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Update resource' : 'Add new resource'"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
    no-enforce-focus
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :error="vForm.errors.get('name')"
        label="Name"
        placeholder="Enter resource name"
        rules="required|max:100"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.link"
        :required="true"
        :error="vForm.errors.get('link')"
        label="Link"
        placeholder="Enter resource link"
        rules="required|max:255"
        name="link"
      />

      <b-text-input-with-validation
        v-model="form.logo"
        :required="true"
        :error="vForm.errors.get('logo')"
        label="Logo"
        placeholder="Enter resource logo URL"
        rules="required"
        name="logo"
      />

      <b-text-input-with-validation
        v-model="form.username"
        :error="vForm.errors.get('username')"
        label="Username"
        placeholder="Enter the username"
        rules="max:255"
        rows="5"
        name="username"
      />

      <b-text-input-with-validation
        v-model="form.password"
        :error="vForm.errors.get('password')"
        label="Password"
        placeholder="Enter the password"
        rules="max:255"
        rows="5"
        name="password"
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

const defaultForm = {
  name: '',
  link: '',
  logo: '',
  username: '',
  password: ''
}

export default {
  name: 'ResourceModal',
  components: {
    BTextInputWithValidation,
    ValidationObserver
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
      selected: null
    }
  },
  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        console.log('item ', item)
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/resource/add')

        notifyAddSuccess('resource')
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
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/resource/' + this.form._id
        )

        notifyUpdateSuccess('resource')
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
