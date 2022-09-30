<template>
  <div>
    <b-text-input-with-validation
      :required="true"
      v-model="innerValue.text"
      label="Từ - Âm luyện tập được đặt trong dấu < >"
      placeholder="<t>rain"
      name="text"
      rules="required"
    />
    <b-text-input-with-validation
      v-model="innerValue.pronunciation"
      label="Phiên âm"
      placeholder="Phiên âm"
      name="text"
    />
    <script-attachment
      v-model="innerValue.attachment"
      :list-display="['audio', 'video']"
      type-value="audio"
      label="Tập tin đính kèm"
    />
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ScriptAttachment from '~/components/elements/script/ScriptAttachment'
export default {
  name: 'PronunciationExampleItem',
  components: {
    ScriptAttachment,
    BTextInputWithValidation
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
  }
}
</script>
