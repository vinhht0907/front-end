<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    :title="isEdit ? 'Sửa học liệu' : 'Thêm học liệu'"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <select2-with-validation
        :required="true"
        v-model="form.word"
        :error="vForm.errors.get('word')"
        placeholder="Chọn từ ..."
        label="Từ"
        data-vv-as="Từ"
        id-field="_id"
        text-field="name"
        ajax="/word/suggest"
        name="word"
        rules="required"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'

const defaultForm = {
  word: null,
  offsetX: 0,
  offsetY: 0
}

export default {
  name: 'ImagePointModal',
  components: {
    ValidationObserver,
    Select2WithValidation
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      isEdit: false,
      point: null
    }
  },
  methods: {
    ...mapMutations({
      setCurrentPoint: 'point/setCurrentPoint',
      setCurrentIndexPoint: 'indexPoint/setCurrentIndexPoint'
    }),
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
      }
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
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
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.vForm = new Form()
      this.isEdit = false
      this.setCurrentIndexPoint(null)
      this.setCurrentPoint(null)
    },
    addItem() {
      try {
        notifyAddSuccess('Điểm ảnh')
        this.$refs.modal.hide()
        this.point = Object.freeze(this.form)
        this.setCurrentPoint(this.point)
        this.setCurrentIndexPoint(null)
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
    updateItem() {
      try {
        notifyUpdateSuccess('Điểm ảnh')
        this.$refs.modal.hide()
        this.point = Object.freeze(this.form)
        this.setCurrentPoint(this.point)
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
