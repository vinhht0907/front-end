<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :title="'Thông tin chi tiết tác phẩm'"
    :no-enforce-focus="true"
    @hidden="handleModalHide"
    ok-only
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.title"
        :required="true"
        :label="'Tên tác phẩm'"
        :placeholder="'Nhâp tên tác phẩm'"
        :error="vForm.errors.get('title')"
        :disabled="true"
        rules="required"
        name="title"
      />

      <e-text-area-with-validation
        v-model="form.description"
        :required="false"
        :show-word-limit="true"
        :error="vForm.errors.get('description')"
        :label="'Mô tả'"
        :rows="5"
        :disabled="true"
        placeholder="Nhập mô tả"
        rules=""
        name="description"
      >
      </e-text-area-with-validation>

      <select2-with-validation
        :required="true"
        v-model="form.category_type_object"
        :options="parentTypeOptions"
        :disabled="true"
        text-field="text"
        id-field="id"
        placeholder="Chọn danh mục cha..."
        label="Danh mục cha"
        data-vv-as="Danh mục cha"
        rules="required"
        name="question"
      />

      <category-chosen
        v-model="form.categories"
        :error="vForm.errors.get('categories')"
        :multiple="true"
        :disabled="true"
        rules="required"
        name="categories"
      />

      <b-text-input-with-validation
        v-model="form.author_name"
        :required="true"
        :label="'Tên tác giả'"
        :error="vForm.errors.get('author_name')"
        :disabled="true"
        rules="required"
        name="author_name"
      />

      <b-editor-with-validation
        v-model="form.content"
        :required="true"
        :error="vForm.errors.get('content')"
        :disabled="true"
        label="Nội dung"
        rules="required"
        name="content"
      />

      <e-text-area-with-validation
        v-model="form.note"
        :required="false"
        :show-word-limit="true"
        :error="vForm.errors.get('note')"
        :label="'Chú thích'"
        :rows="5"
        :disabled="true"
        rules=""
        name="note"
      >
      </e-text-area-with-validation>
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ETextAreaWithValidation from '~/components/base/input/ETextAreaWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import CategoryChosen from '~/components/elements/category/CategoryChosen'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'

const defaultForm = {
  title: '',
  categories: '',
  category_type_object: null,
  category_type: null,
  author_name: ''
}

export default {
  name: 'PostModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    ETextAreaWithValidation,
    Select2WithValidation,
    CategoryChosen,
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
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        this.form.category_type_object =
          this.form.category_type === 'literature'
            ? {
                id: 'literature',
                text: 'văn'
              }
            : {
                id: 'poem',
                text: 'thơ'
              }
        this.form.author_name =
          this.form.author && this.form.author.full_name
            ? this.form.author.full_name
            : ''
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
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
      }
    }
  }
}
</script>
