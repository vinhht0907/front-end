<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Cập nhật tag' : 'Thêm mới'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :label="'Tên tag'"
        :placeholder="'Nhâp tên tag'"
        :error="vForm.errors.get('name')"
        rules="required|max:200"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.slug"
        :required="true"
        :label="'Đường dẫn'"
        :placeholder="'Nhập đường dẫn'"
        :error="vForm.errors.get('slug')"
        :disabled="true"
        rules="required"
        name="name"
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
import { HTTP_CODE_422 } from '~/constants/httpCode'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import { convertVietnameseToEnglish } from '~/utils/handleVietnameseToEnglish'
import CheckboxesWithValidation from '~/components/base/input/CheckboxesWithValidation'

const defaultForm = {
  name: '',
  slug: null,
  status: true
}

export default {
  name: 'TagModal',
  components: {
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
  watch: {
    'form.name'(val) {
      this.form.slug = convertVietnameseToEnglish(cloneDeep(val))
        .replace(/[^a-zA-Z [0-9]]/g, '')
        .replace(/ /g, '-')
        .toLowerCase()
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
      console.log('isValid', isValid)
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
        console.log('additem')
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/tag/add')

        notifyAddSuccess('tag')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        console.log('e', e)
        if (e.response) {
          if (status !== HTTP_CODE_422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    async updateItem() {
      try {
        console.log('update')
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/tag/' + this.form._id
        )
        notifyUpdateSuccess('tag')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (status !== HTTP_CODE_422) {
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
