<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? 'Cập nhật danh mục tác phẩm' : 'Thêm mới'"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :label="'Tên danh mục'"
        :placeholder="'Nhâp tên danh mục'"
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
        name="slug"
      />

      <e-text-area-with-validation
        v-model="form.description"
        :required="false"
        :show-word-limit="true"
        :error="vForm.errors.get('description')"
        :label="'Mô tả'"
        placeholder="Nhập mô tả"
        maxlength="255"
        rules="max:200"
        name="description"
      >
      </e-text-area-with-validation>

      <select2-with-validation
        :required="true"
        v-model="form.parent_type_object"
        :options="parentTypeOptions"
        text-field="text"
        id-field="id"
        placeholder="Chọn danh mục cha..."
        label="Danh mục cha"
        data-vv-as="Danh mục cha"
        rules="required"
        name="question"
      />

      <e-text-area-with-validation
        v-model="form.seo_keywords"
        :required="false"
        :show-word-limit="true"
        :error="vForm.errors.get('seo_keywords')"
        :label="'SEO - từ khóa'"
        placeholder="Nhập từ khóa"
        maxlength="255"
        rules="max:200"
        name="seo_keywords"
      >
      </e-text-area-with-validation>

      <e-text-area-with-validation
        v-model="form.seo_description"
        :required="false"
        :show-word-limit="false"
        :error="vForm.errors.get('seo_description')"
        :label="'SEO - mô tả'"
        placeholder="Nhập mô tả"
        maxlength="255"
        rules="max:255"
        name="seo_description"
      >
      </e-text-area-with-validation>

      <b-text-input-with-validation
        v-if="isEdit"
        v-model="form.order"
        :required="true"
        :label="'Thứ tự sắp xếp'"
        :placeholder="'Nhập thứ tự sắp xếp'"
        :error="vForm.errors.get('order')"
        rules="required|numeric"
        name="order"
      />

      <b-single-image-upload-with-validation
        v-model="form.featured_image"
        :error="vForm.errors.get('featured_image')"
        :required="true"
        rules="required"
        label="Ảnh đại diện"
        placeholder="Ảnh đại diện"
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
import { convertVietnameseToEnglish } from '~/utils/handleVietnameseToEnglish'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'

const defaultForm = {
  name: '',
  seo_keywords: '',
  seo_description: '',
  parent_type_object: null,
  parent_type: null,
  depth: null,
  slug: null,
  featured_image: null,
  order: 0
}

export default {
  name: 'CategoryModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    ETextAreaWithValidation,
    Select2WithValidation,
    BSingleImageUploadWithValidation
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
      currentCategoryId: null,
      parentTypeOptions: [
        {
          id: 'literature',
          text: 'Văn'
        },
        {
          id: 'poem',
          text: 'Thơ'
        }
      ]
    }
  },
  watch: {
    'form.id': {
      handler(val) {
        if (val) {
          this.currentCategoryId = val
        } else {
          this.currentCategoryId = null
        }
      },
      deep: true
    },
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
        this.form.parent_type_object =
          this.form.parent_type === 'literature'
            ? {
                id: 'literature',
                text: 'văn'
              }
            : {
                id: 'poem',
                text: 'thơ'
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
      this.currentCategoryId = null
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
        this.form.parent_type = this.form.parent_type_object.id
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/category/add')

        notifyAddSuccess('danh mục tác phẩm')
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
    },
    async updateItem() {
      try {
        this.form.parent_type = this.form.parent_type_object.id
        this.form.order = parseInt(this.form.order)
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/category/' + this.form._id
        )
        notifyUpdateSuccess('danh mục tác phẩm')
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
