<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa bài thi' : 'Thêm bài thi'"
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

      <b-text-area-with-validation
        v-model="form.description"
        :required="true"
        :error="vForm.errors.get('description')"
        label="Mô tả"
        placeholder="Mô tả"
        rules="required|max:1024"
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

      <b-editor-with-validation
        v-model="form.instructions"
        :required="true"
        :error="vForm.errors.get('instructions')"
        label="Hướng dẫn"
        placeholder="Hướng dẫn"
        rules="required"
        name="instructions"
      />

      <b-date-range-with-validation
        v-model="timeRange"
        :error="vForm.errors.get('affected_start')"
        label="Thời gian hiệu lực"
      />

      <select2-with-validation
        :required="true"
        v-model="form.type"
        :error="vForm.errors.get('type')"
        :options="typeOptions"
        placeholder="Chọn loại bài thi..."
        label="Loại bài thi"
        data-vv-as="Loại bài thi"
        id-field="id"
        text-field="text"
        name="type"
        rules="required"
      />

      <select2-with-validation
        :required="true"
        v-model="form.time_type"
        :error="vForm.errors.get('time_type')"
        :options="timeTypeOptions"
        placeholder="Chọn loại thời gian..."
        label="Loại thời gian"
        data-vv-as="Loại thời gian"
        id-field="id"
        text-field="text"
        name="time_type"
        rules="required"
      />

      <b-text-input-with-validation
        v-if="form.time_type.id === TT_TEST_TIME"
        v-model="form.time"
        :error="vForm.errors.get('time')"
        label="Thời lượng (phút)"
        placeholder="Thời lượng (phút)"
        rules="numeric"
        name="time"
      />

      <b-tags-input-with-validation
        v-model="form.tags"
        :error="vForm.errors.get('tags')"
        label="Tags"
        placeholder="Tags"
        name="tags"
      />

      <select2-with-validation
        :required="true"
        v-model="form.test_category"
        :error="vForm.errors.get('test_category')"
        placeholder="Chọn danh mục thi ..."
        label="Danh mục thi"
        data-vv-as="Danh mục thi"
        id-field="_id"
        text-field="name"
        ajax="/test-category/suggest"
        name="test_category"
        rules="required"
      />

      <checkboxes-with-validation
        :required="true"
        v-model="form.is_entrance_exam"
        :error="vForm.errors.get('is_entrance_exam')"
        label="Bài thi đầu vào"
        placeholder="Bài thi đầu vào"
        rules="required"
        name="is_entrance_exam"
        switch
        size="lg"
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
import { TYPE_OPTIONS, TIME_TYPE_OPTIONS, TT_TEST_TIME } from '~/constants/test'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'
import CheckboxesWithValidation from '~/components/base/input/CheckboxesWithValidation'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import BDateRangeWithValidation from '~/components/base/input/BDateRangeWithValidation'
import BTagsInputWithValidation from '~/components/base/input/BTagsInputWithValidation'

const defaultForm = {
  name: '',
  description: '',
  featured_image: '',
  instructions: '',
  type: {},
  time_type: {},
  is_featured: false,
  status: true,
  is_entrance_exam: false,
  affected_start: '',
  affected_end: '',
  test_category: null,
  order: 0
}

export default {
  name: 'TestModal',
  components: {
    BTagsInputWithValidation,
    BDateRangeWithValidation,
    ValidationObserver,
    BTextInputWithValidation,
    Select2WithValidation,
    BTextAreaWithValidation,
    BSingleImageUploadWithValidation,
    CheckboxesWithValidation,
    BEditorWithValidation
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
      typeOptions: TYPE_OPTIONS,
      timeTypeOptions: TIME_TYPE_OPTIONS,
      TT_TEST_TIME
    }
  },
  computed: {
    timeRange: {
      get() {
        return [this.form.affected_start, this.form.affected_end]
      },
      set(newValue) {
        this.form.affected_start = newValue[0]
        this.form.affected_end = newValue[1]
      }
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        if (this.form.type) {
          this.form.type = {
            id: this.form.type,
            text: ''
          }
        }
        if (this.form.time_type) {
          this.form.time_type = {
            id: this.form.time_type,
            text: ''
          }
        }
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
        const formData = cloneDeep(this.form)
        formData.type = formData.type.id
        formData.time_type = formData.time_type.id
        this.vForm = new Form(formData)
        await this.vForm.post(this.$axios.defaults.baseURL + '/test/add')

        notifyAddSuccess('Bài thi')
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
        formData.type = formData.type.id
        formData.time_type = formData.time_type.id
        this.vForm = new Form(formData)
        await this.vForm.post(this.$axios.defaults.baseURL + '/test/edit')

        notifyUpdateSuccess('Bài thi')
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
