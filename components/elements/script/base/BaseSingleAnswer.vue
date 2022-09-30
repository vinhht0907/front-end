<template>
  <div>
    <div class="form-group mb-2">
      <label>Danh sách đáp án</label>
    </div>
    <div
      v-for="option in options"
      :key="option.key"
      class="form-group row align-items-center mb-3"
    >
      <div class="col-md-7">
        <div class="kt-form__group--inline">
          <div
            v-if="answerEditor"
            :class="[{ 'single-row': singleRow }, 'kt-form__control']"
          >
            <b-editor-with-validation
              v-model="option.text"
              :editor-toolbar="editorToolbar"
              :required="required"
              :rules="rules"
              placeholder="Nhập đáp án..."
              label="Đáp án"
            />
          </div>
          <div v-else class="kt-form__control">
            <input
              v-model="option.text"
              type="text"
              class="form-control"
              placeholder="Nhập đáp án..."
            />
          </div>
        </div>
        <div class="d-md-none kt-margin-b-10"></div>
      </div>
      <div class="col-md-3">
        <div class="kt-radio-inline">
          <label class="kt-radio">
            <input v-model="answer" :value="option.key" type="radio" />
            Đáp án đúng
            <span></span>
          </label>
        </div>
      </div>
      <div class="col-md-2">
        <a
          @click="removeOption(option)"
          href="javascript:;"
          class="btn-sm btn btn-label-danger btn-bold"
        >
          <i class="la la-trash-o"></i>
          Xóa
        </a>
      </div>
    </div>

    <div class="form-group form-group-last row">
      <div class="col-lg-4">
        <a
          @click="addOption"
          href="javascript:;"
          class="btn btn-bold btn-sm btn-label-brand"
        >
          <i class="la la-plus"></i> Thêm đáp án
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import randomstring from 'randomstring'
import BEditorWithValidation from '~/components/base/input/BEditorWithValidation'

export default {
  name: 'BaseSingleAnswer',
  components: {
    BEditorWithValidation
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    answerEditor: {
      type: Boolean,
      default: false
    },
    singleRow: {
      type: Boolean,
      defautl: true
    },
    editorToolbar: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: [Object, String],
      default: ''
    }
  },
  data() {
    return {
      options: [],
      answer: null
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.init(newVal)
      }
    },
    options(newVal) {
      this.$emit('input', newVal)
    },
    answer(newVal) {
      if (newVal) {
        this.options.forEach((item) => {
          if (item.key === newVal) {
            item.isAnswer = true
          } else {
            item.isAnswer = false
          }
        })

        this.$emit('input', this.options)
      }
    }
  },
  created() {
    this.init(this.value)
  },
  methods: {
    init(options) {
      if (options && options.length > 0) {
        this.options = options
        const answer = options.find((item) => item.isAnswer === true)

        if (answer) {
          this.answer = answer.key
        }
      } else {
        this.options = [this.generateDefault()]
      }
    },
    addOption() {
      this.options.push(this.generateDefault())
    },
    removeOption(option) {
      const index = this.options.findIndex((item) => item.key === option.key)

      if (index !== -1) {
        this.options.splice(index, 1)
      }
    },
    generateDefault() {
      return {
        text: '',
        isAnswer: false,
        key: randomstring.generate()
      }
    }
  }
}
</script>
