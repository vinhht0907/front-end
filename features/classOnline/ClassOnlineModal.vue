<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('title.edit') : $t('title.add')"
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
        label="Tên lớp học"
        placeholder="Tên lớp học"
        rules="required|max:100"
        name="name"
      />
      <div class="row">
        <div class="col-md-6">
          <select2-with-validation
            v-model="form.school"
            :required="true"
            :error="vForm.errors.get('school')"
            placeholder="Chọn trường ..."
            label="Thuộc trường nào"
            data-vv-as="Thuộc trường nào"
            id-field="_id"
            text-field="name"
            ajax="/school/suggest"
            name="school"
            rules="required"
          />
        </div>
        <div class="col-md-6">
          <select2-with-validation
            v-model="form.teacher"
            :post-data="postDataTeacher"
            :required="true"
            :error="vForm.errors.get('teacher')"
            placeholder="Chọn giáo viên ..."
            label="Chọn giáo viên"
            data-vv-as="Chọn giáo viên"
            id-field="_id"
            text-field="full_name"
            ajax="/user/suggest"
            name="teacher"
            rules="required"
          />
        </div>
      </div>
      <div v-if="isEdit" class="col-md-12">
        <b-form-radio-group
          :options="statusOptions"
          v-model="form.status"
          class="pt-2 theme-custom-radio"
          value-field="id"
          text-field="text"
          label="Trạng thái"
          size="lg"
        ></b-form-radio-group>
      </div>
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'

const defaultForm = {
  name: '',
  school: '',
  teacher: ''
}
export default {
  name: 'LessonOnlineModal',
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
      vForm: new Form(),
      postDataTeacher: { role_name: 'teacher_online' },
      statusOptions: [
        { id: 'ongoing', text: 'Đang diễn ra' },
        { id: 'done', text: 'Đã hoàn thành' },
        { id: 'blocked', text: 'Đã khóa' }
      ]
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
        const requestData = {
          name: this.form.name,
          school: this.form.school._id,
          teacher: this.form.teacher._id,
          is_deleted: false,
          status: 'ongoing'
        }
        this.vForm = new Form(requestData)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/online-class/add'
        )
        notifyAddSuccess('Lớp học')
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
          this.$axios.defaults.baseURL + '/online-class/edit'
        )
        notifyUpdateSuccess('Lớp học')
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
