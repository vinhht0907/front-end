<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Sửa từ' : 'Thêm từ'"
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
        label="Từ"
        placeholder="Từ"
        rules="required|max:50"
        name="name"
      />

      <select2-with-validation
        :required="true"
        v-model="form.type"
        :error="vForm.errors.get('type')"
        :options="wordOptions"
        placeholder="Chọn loại từ..."
        label="Loại từ"
        data-vv-as="Loại từ"
        id-field="id"
        text-field="text"
        name="type"
        rules="required"
      />

      <b-text-input-with-validation
        v-model="form.pronunciation"
        :required="true"
        :error="vForm.errors.get('pronunciation')"
        label="Phát âm của từ"
        placeholder="Phát âm của từ"
        rules="required|max:50"
        name="pronunciation"
      />

      <b-text-input-with-validation
        v-model="form.meaning"
        :required="true"
        :error="vForm.errors.get('meaning')"
        label="Nghĩa của từ"
        placeholder="Nghĩa của từ"
        rules="required|max:50"
        name="meaning"
      />

      <b-text-input-with-validation
        v-model="form.definition"
        :required="true"
        :error="vForm.errors.get('definition')"
        label="Định nghĩa"
        placeholder="Định nghĩa"
        rules="required|max:1024"
        name="definition"
      />

      <b-text-input-with-validation
        v-model="form.example"
        :required="true"
        label="Ví dụ"
        placeholder="Ví dụ"
        name="example"
        rules="required|max:1024"
      />

      <b-single-audio-upload-with-validation
        :required="true"
        v-model="form.audio_pronunciation"
        label="Audio phát âm"
        rules="required"
      />
      <b-muti-image-thumb-upload-with-validation
        v-model="form.list_images"
        label="Danh sách image"
      />
      <word-audio-list v-model="form.audios" />
      <div v-if="showAudioRequire" class="text-danger">
        Audio là bắt buộc
      </div>
      <word-video-list v-model="form.videos" />
      <div v-if="showVideoRequire" class="text-danger">
        Video là bắt buộc
      </div>
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import WordVideoList from './partial/WordVideoList'
import WordAudioList from './partial/WordAudioList'
import { WORD_OPTIONS } from '~/constants/word'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
import BMutiImageThumbUploadWithValidation from '~/components/base/input/BMutiImageThumbUploadWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

const defaultForm = {
  name: '',
  type: '',
  pronunciation: '',
  meaning: '',
  example: '',
  audio_pronunciation: '',
  audios: [],
  videos: [],
  list_images: []
}

export default {
  name: 'WordModal',
  components: {
    WordAudioList,
    WordVideoList,
    BMutiImageThumbUploadWithValidation,
    BSingleAudioUploadWithValidation,
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
      showVideoRequire: false,
      showAudioRequire: false,
      wordOptions: WORD_OPTIONS
    }
  },
  watch: {
    'form.videos': {
      handler(val) {
        if (val && val.length > 0) {
          this.showVideoRequire = false
        }
      },
      deep: true
    },
    'form.audios': {
      handler(val) {
        if (val && val.length > 0) {
          this.showAudioRequire = false
        }
      },
      deep: true
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
      this.showAudioRequire = false
      this.showVideoRequire = false
      this.isEdit = false
    },
    async validateForm() {
      if (
        (this.form.audios && this.form.audios.length === 0) ||
        (this.form.videos && this.form.videos.length === 0)
      ) {
        if (this.form.audios && this.form.audios.length === 0) {
          this.showAudioRequire = true
        }
        if (this.form.videos && this.form.videos.length === 0) {
          this.showVideoRequire = true
        }
      } else {
        const isValid = await this.$refs.observer.validate()
        if (isValid) {
          if (this.isEdit) {
            await this.updateItem()
          } else {
            await this.addItem()
          }
        }
      }
    },
    async addItem() {
      try {
        const formData = cloneDeep(this.form)
        formData.type = formData.type.id
        this.vForm = new Form(formData)
        await this.vForm.post(this.$axios.defaults.baseURL + '/word/add')

        notifyAddSuccess('Từ')
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
        this.vForm = new Form(formData)
        await this.vForm.post(this.$axios.defaults.baseURL + '/word/edit')

        notifyUpdateSuccess('Từ')
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
