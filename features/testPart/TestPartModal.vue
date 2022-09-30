<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa part' : 'Thêm part'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <!-- <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :error="vForm.errors.get('name')"
        label="Tên"
        placeholder="Tên"
        rules="required|max:100"
        name="name"
      /> -->
      <b-text-input-with-validation
        v-model="form.name_display"
        :error="vForm.errors.get('name_display')"
        label="Tên hiển thị"
        placeholder="Tên hiển thị"
        rules="max:100"
        name="name_display"
      />
      <b-text-area-with-validation
        v-model="form.description"
        :error="vForm.errors.get('description')"
        label="Mô tả"
        placeholder="Mô tả"
        rules="max:1024"
        name="description"
      />
      <script-attachment
        v-model="form.attachment"
        :list-display="['audio', 'reading', 'none', 'image', 'video']"
        label="Tập tin đính kèm"
        type-value="none"
      />
      <select2-with-validation
        v-if="!sectionId"
        v-model="form.test_questions"
        :error="vForm.errors.get('test_questions')"
        placeholder="Chọn câu hỏi ..."
        label="Danh sách câu hỏi"
        data-vv-as="Danh sách câu hỏi"
        id-field="_id"
        text-field="name"
        ajax="/test-question/suggest"
        name="test_questions"
        multiple
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
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'

const defaultForm = {
  name: '',
  name_display: '',
  description: '',
  attachment: {
    type: 'none'
  }
}

export default {
  name: 'TestPartModal',
  components: {
    ScriptAttachment,
    ValidationObserver,
    BTextInputWithValidation,
    BTextAreaWithValidation,
    Select2WithValidation
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    },
    sectionId: {
      type: String,
      default: ''
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
        if (this.sectionId) {
          this.form.section_id = this.sectionId
        }
        this.vForm = new Form(this.form)
        const { data } = await this.vForm.post(
          this.$axios.defaults.baseURL + '/test-part/add'
        )

        notifyAddSuccess('Part')
        this.$refs.modal.hide()
        this.onActionSuccess(data)
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/test-part/edit')

        notifyUpdateSuccess('Part')
        this.$refs.modal.hide()
        this.onActionSuccess(this.form)
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
