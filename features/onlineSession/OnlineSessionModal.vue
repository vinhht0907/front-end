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
        label="Tên bài học"
        placeholder="Tên bài học"
        rules="required|max:100"
        name="name"
      />
      <b-text-input-with-validation
        v-model="form.order"
        :required="true"
        :error="vForm.errors.get('order')"
        label="Thứ tự ưu tiên"
        placeholder="Thứ tự ưu tiên"
        rules="required"
        name="order"
      />
      <vue-mask
        v-model="form.duration"
        :required="true"
        :error="vForm.errors.get('duration')"
        label="Thời lượng"
        placeholder="hh:mm"
        rules="required"
        mask="##:##"
        name="duration"
      />
      <b-editor-with-validation
        v-model="form.introduction"
        :required="true"
        :error="vForm.errors.get('introduction')"
        label="Giới thiệu"
        placeholder="Giới thiệu"
        rules="required"
        name="introduction"
      />
      <b-text-area-with-validation
        v-model="form.pre_exercises_desc"
        :required="true"
        :error="vForm.errors.get('pre_exercises_desc')"
        label="Pre-class exercises"
        placeholder="Pre-class exercises"
        rules="required"
        name="pre_exercises_desc"
      />
      <b-text-area-with-validation
        v-model="form.online_live_desc"
        :required="true"
        :error="vForm.errors.get('online_live_desc')"
        label="Online live class"
        placeholder="Online live class"
        rules="required"
        name="online_live_desc"
      />
      <b-text-area-with-validation
        v-model="form.homework_desc"
        :required="true"
        :error="vForm.errors.get('homework_desc')"
        label="Bài tập về nhà"
        placeholder="Bài tập về nhà"
        rules="required"
        name="homework_desc"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import VueMask from '~/components/base/input/VueMask'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import { formatDuration } from '~/utils/formatDuration'

const defaultForm = {
  name: '',
  introduction: '',
  pre_exercises_desc: '',
  online_live_desc: '',
  homework_desc: null,
  order: '',
  duration: ''
}
export default {
  name: 'OnlineSessionModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    BEditorWithValidation,
    BTextAreaWithValidation,
    VueMask
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
      editorToolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' }
        ],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['blockquote', 'code-block']
      ]
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        const tmp = item.duration
        item.duration = formatDuration(item.duration)
        this.isEdit = true
        this.form = cloneDeep(item)
        if (this.form.order === 0) {
          this.form.order = '0'
        }
        item.duration = tmp
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
        const durationString = this.form.duration.replace(':', '').toString()
        this.form.duration =
          durationString.charAt(0) !== 0
            ? parseInt(durationString.slice(0, 2)) * 3600 +
              parseInt(durationString.slice(2, 4)) * 60
            : parseInt(durationString.charAt(1)) * 3600 +
              parseInt(durationString.slice(2, 4)) * 60
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/online-session/add'
        )

        notifyAddSuccess('Bài học')
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
        const durationString = this.form.duration.replace(':', '').toString()
        this.form.duration =
          durationString.charAt(0) !== 0
            ? parseInt(durationString.slice(0, 2)) * 3600 +
              parseInt(durationString.slice(2, 4)) * 60
            : parseInt(durationString.charAt(1)) * 3600 +
              parseInt(durationString.slice(2, 4)) * 60
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/online-session/edit'
        )
        notifyUpdateSuccess('Bài học')
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
