<template>
  <div>
    <div class="form-group mb-2">
      <label>Câu trả lời</label>
    </div>
    <draggable :list="options" handle=".btn-draggable">
      <transition-group type="transition" name="list-answer">
        <div
          v-for="(option, index) in options"
          :key="option.key"
          class="form-group row align-items-baseline mb-3"
        >
          <div class="col-md-6">
            <validation-provider
              :vid="option.key"
              :name="$attrs.label"
              :rules="rules"
              v-slot="{ errors }"
            >
              <b-form-group class="mb-0">
                <b-input-group :prepend="`${index + 1}`">
                  <b-form-input
                    v-model="option.text"
                    v-bind="$attrs"
                    :state="errors[0] || error !== null ? false : null"
                    class="form-control"
                  ></b-form-input>
                  <b-form-invalid-feedback>{{
                    errors[0] || error
                  }}</b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>
            </validation-provider>
          </div>
          <div class="col-md-2">
            <b-form-checkbox
              v-model="answer"
              :value="option.key"
              name="answerRadio[]"
              size="lg"
              tabindex="-1"
            >
              Đáp án đúng
            </b-form-checkbox>
          </div>
          <div class="col-md-4">
            <a
              href="javascript:;"
              class="btn-draggable btn-sm btn btn-label btn-bold"
              tabindex="-1"
            >
              <i class="fa fa-arrows"></i>
              Thay đổi thứ tự
            </a>
            <a
              @click="removeOption(option)"
              href="javascript:;"
              class="btn-sm btn btn-label-danger btn-bold"
              tabindex="-1"
            >
              <i class="la la-trash-o"></i>
              Xóa
            </a>
          </div>
        </div>
      </transition-group>
    </draggable>

    <div class="form-group form-group-last row">
      <div class="col-lg-4">
        <a
          @click="addOption"
          href="javascript:;"
          class="btn btn-bold btn-sm btn-label-brand"
        >
          <i class="la la-plus"></i> {{ btnLabel }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import randomstring from 'randomstring'
import draggable from 'vuedraggable'
export default {
  name: 'BaseMultiSortAnswer',
  components: { ValidationProvider, draggable },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    rules: {
      type: [Object, String],
      default: 'required'
    },
    error: {
      type: String,
      default: null
    },
    btnLabel: {
      type: String,
      default: ''
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
        isAnswer: true,
        key: randomstring.generate()
      }
    }
  }
}
</script>
