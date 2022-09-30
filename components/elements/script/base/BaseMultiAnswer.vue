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
          <div class="kt-form__control">
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
        <b-form-checkbox
          v-model="answer"
          :value="option.key"
          name="answerRadio[]"
          size="lg"
        >
          Đáp án đúng
        </b-form-checkbox>
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
export default {
  name: 'BaseMultiAnswer',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: [],
      answer: []
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
          if (newVal && newVal.includes(item.key)) {
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
        const answer = options
          .filter((item) => item.isAnswer === true)
          .map((item) => item.key)

        if (answer) {
          this.answer = answer
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
