<template>
  <b-modal
    ref="modal"
    :ok-title="isEdit ? 'Cập nhật' : 'Thêm mới'"
    :title="isEdit ? 'Cập nhật tin tức' : 'Thêm mới tin tức'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    cancel-title="Hủy bỏ"
    size="xl"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.title"
        :required="true"
        :label="'Tiêu đề'"
        :placeholder="'Tiêu đề'"
        :error="vForm.errors.get('title')"
        rules="required|max:200"
        name="title"
      />

      <b-text-input-with-validation
        v-model="form.tags"
        :required="true"
        :label="'Tags'"
        :placeholder="'Nhập tags'"
        :error="vForm.errors.get('tags')"
        rules="required"
        name="tags"
      />

      <e-text-area-with-validation
        v-model="form.description"
        :required="true"
        :show-word-limit="true"
        :error="vForm.errors.get('description')"
        :label="'Mô tả'"
        :max-length="255"
        placeholder="Nhập mô tả"
        rules="required|max:255"
        name="description"
      >
      </e-text-area-with-validation>

      <select2-with-validation
        :required="true"
        v-model="form.category_type"
        :options="categories"
        text-field="text"
        id-field="id"
        placeholder="Chọn danh mục"
        label="Danh mục"
        data-vv-as="Danh mục"
        rules="required"
        name="category_type"
      />

      <e-text-area-with-validation
        v-model="form.seo_keyword"
        :required="true"
        :show-word-limit="true"
        :error="vForm.errors.get('seo_keyword')"
        :label="'SEO - từ khóa'"
        :max-length="255"
        placeholder="Nhập từ khóa"
        rules="max:255|required"
        name="seo_keyword"
      >
      </e-text-area-with-validation>

      <b-single-media-upload-with-validation
        v-model="form.featured_image"
        :required="true"
        label="Ảnh đại diện"
        rules="required"
      />

      <b-editor-with-validation
        v-model="form.content"
        :required="true"
        :error="vForm.errors.get('content')"
        label="Nội dung"
        placeholder="Nội dung"
        rules="required"
        name="content"
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
import ETextAreaWithValidation from '~/components/base/input/ETextAreaWithValidation'
import BSingleMediaUploadWithValidation from '~/components/base/input/BSingleMediaUploadWithValidation'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

const defaultForm = {
  title: '',
  seo_keyword: '',
  description: '',
  featured_image: null,
  tags: '',
  category_type: null
}

export default {
  name: 'NewsModal',
  components: {
    Select2WithValidation,
    BEditorWithValidation,
    BSingleMediaUploadWithValidation,
    ValidationObserver,
    BTextInputWithValidation,
    ETextAreaWithValidation
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
      categories: [
        {
          id: 'Bài viết thông thường',
          text: 'Bài viết thông thường'
        },
        {
          id: 'Đừng bỏ lỡ',
          text: 'Đừng bỏ lỡ'
        },
        {
          id: 'Bài viết nối bật',
          text: 'Bài viết nổi bật'
        },
        {
          id: 'Được yêu thích',
          text: 'Được yêu thích'
        },
        {
          id: 'Có thể bạn quan tâm',
          text: 'Có thể bạn quan tâm'
        }
      ]
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        this.form.category_type = {
          id: item.category_type,
          text: item.category_type
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
        const obj = cloneDeep(this.form)
        obj.featured_image = obj.featured_image._id
        obj.category_type = obj.category_type ? obj.category_type.id : null

        this.vForm = new Form(obj)
        await this.vForm.post(this.$axios.defaults.baseURL + '/news/add')

        notifyAddSuccess('page')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        console.log(e)
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
        const obj = cloneDeep(this.form)
        obj.featured_image = obj.featured_image._id
        obj.category_type = obj.category_type ? obj.category_type.id : null

        this.vForm = new Form(obj)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/news/' + this.form._id
        )
        notifyUpdateSuccess('tin tức')
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
