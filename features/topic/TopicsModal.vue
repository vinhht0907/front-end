<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? 'Update' : 'Add'"
    :title="isEdit ? 'Update Topic' : 'Add new Topic'"
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
        placeholder="Name"
        rules="required|max:100|isPermissionName"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.link"
        :required="true"
        :error="vForm.errors.get('link')"
        label="Link"
        placeholder="Link"
        rules="required"
        name="link"
      />

      <b-text-area-with-validation
        v-model="form.description"
        :label="$t('permission.description')"
        :placeholder="$t('permission.description')"
        :error="vForm.errors.get('description')"
        rules="max:255"
        rows="5"
        name="description"
      />

      <resource-chosen
        v-model="form.resources"
        :error="vForm.errors.get('resources')"
        :multiple="false"
        :required="false"
        rules=""
        name="resources"
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
import ResourceChosen from '~/components/elements/resource/ResourceChosen'

const defaultForm = {
  name: '',
  link: '',
  resources: null,
  description: ''
}

export default {
  name: 'TopicsModal',
  components: {
    BTextAreaWithValidation,
    BTextInputWithValidation,
    ValidationObserver,
    ResourceChosen
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/topic/add')

        notifyAddSuccess('Topic')
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
          this.$axios.defaults.baseURL + '/topic/' + this.form._id
        )

        notifyUpdateSuccess('Topic')
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
