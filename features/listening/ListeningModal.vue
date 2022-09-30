<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa bài nghe' : 'Thêm bài nghe'"
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
        v-model="form.video_id"
        :required="true"
        :error="vForm.errors.get('video_id')"
        label="Video id"
        placeholder="Video id"
        rules="required|max:20"
        name="video_id"
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

      <select2-with-validation
        :required="true"
        v-model="form.listening_category"
        :error="vForm.errors.get('listening_category')"
        placeholder="Chọn danh mục bài nghe ..."
        label="Danh mục bài nghe"
        data-vv-as="Danh mục bài nghe"
        id-field="_id"
        text-field="name"
        ajax="/listening-category/suggest"
        name="listening_category"
        rules="required"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'

const defaultForm = {
  name: '',
  video_id: '',
  degree: null,
  listening_category: null
}

export default {
  name: 'ListeningModal',
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/listening/add')

        notifyAddSuccess('Bài nghe')
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/listening/edit')

        notifyUpdateSuccess('Bài nghe')
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
