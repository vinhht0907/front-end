<template>
  <div>
    <b-text-input-with-validation
      v-model="innerValue.text"
      required
      rules="required"
      label="Từ"
      placeholder="Từ"
    />
    <div class="row">
      <div class="col-md-6">
        <b-text-input-with-validation
          v-model="innerValue.fromRow"
          required
          rules="required"
          label="Hàng bắt đầu"
          placeholder="Hàng bắt đầu"
          type="number"
        />
      </div>

      <div class="col-md-6">
        <b-text-input-with-validation
          v-model="innerValue.fromCol"
          required
          rules="required"
          label="Cột bắt đầu"
          placeholder="Cột bắt đầu"
          type="number"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <b-text-input-with-validation
          v-model="innerValue.toRow"
          required
          rules="required"
          label="Hàng kết thúc"
          placeholder="Hàng kết thúc"
          type="number"
        />
      </div>

      <div class="col-md-6">
        <b-text-input-with-validation
          v-model="innerValue.toCol"
          required
          rules="required"
          label="Cột kết thúc"
          placeholder="Cột kết thúc"
          type="number"
        />
      </div>
    </div>
    <base-input-score v-model="innerValue.score" />
  </div>
</template>

<script>
import BaseInputScore from '~/components/elements/script/base/BaseInputScore'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
export default {
  name: 'FindTheWordsItem',
  components: {
    BTextInputWithValidation,
    BaseInputScore
  },
  props: {
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      innerValue: null
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value(val) {
      if (val) {
        this.innerValue = val
      } else {
        this.innerValue = {}
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = {}
    }
  },
  methods: {
    getDuration(duration) {
      this.innerValue.duration = duration
    }
  }
}
</script>
