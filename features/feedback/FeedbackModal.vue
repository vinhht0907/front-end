<template>
  <b-modal
    ref="modal"
    :title="'Chi tiết góp ý'"
    :no-enforce-focus="true"
    @hidden="handleModalHide"
    ok-only
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :label="'Người đóng góp'"
        :placeholder="'Người đóng góp'"
        :error="vForm.errors.get('name')"
        :disabled="true"
        rules="required"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.email"
        :required="true"
        :label="'Email'"
        :placeholder="'email'"
        :error="vForm.errors.get('email')"
        :disabled="true"
        rules="required"
        name="name"
      />

      <b-text-area-with-validation
        :disabled="true"
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
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

const defaultForm = {
  name: '',
  email: '',
  content: ''
}

export default {
  name: 'FeedModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    BTextAreaWithValidation
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
        ['image', 'video']
      ]
    }
  },
  methods: {
    show(item = null) {
      if (item) {
        this.form = cloneDeep(item)
        if (item.status === 'unread') {
          this.updateItem()
        }
      }

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.onActionSuccess()
    },
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/feedback/' + this.form._id
        )
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
