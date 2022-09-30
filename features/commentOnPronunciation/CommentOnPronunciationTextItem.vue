<template>
  <div>
    <b-text-input-with-validation
      v-bind="$attrs"
      :vid="innerValue.key"
      :required="true"
      v-model="innerValue.text"
      label="Câu nhận xét"
      name="text"
      rules="required"
      lazy
    />
    <comment-on-pronunciation-emoji
      v-if="emojis.length > 0"
      :emojis="emojis"
      v-model="innerValue.emojis"
    />
  </div>
</template>

<script>
import CommentOnPronunciationEmoji from './CommentOnPronunciationEmoji'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
export default {
  name: 'CommentOnPronunciationText',
  components: {
    CommentOnPronunciationEmoji,
    BTextInputWithValidation
  },
  props: {
    value: {
      type: Object,
      default: () => []
    },
    emojis: {
      type: Array,
      default: () => []
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
      this.init(val)
    }
  },
  created() {
    this.init(this.value)
  },
  methods: {
    init(val) {
      this.innerValue = val
    }
  }
}
</script>
