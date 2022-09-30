<template>
  <div>
    <pronunciation-score-chosen
      v-if="type === 'vip'"
      v-model="innerValue.pronunciation_score"
      rules="required"
      name="pronunciation_score"
    />
    <pronunciation-normal-score-chosen
      v-else-if="type === 'normal'"
      v-model="innerValue.pronunciation_score"
      rules="required"
      name="pronunciation_score"
    />
    <pronunciation-stress-score-chosen
      v-else
      v-model="innerValue.pronunciation_score"
      rules="required"
      name="pronunciation_score"
    />
    <comment-on-pronunciation-text
      v-bind="$attrs"
      v-model="innerValue.texts"
      :emojis="emojis"
    />
  </div>
</template>

<script>
import CommentOnPronunciationText from './CommentOnPronunciationText'
import PronunciationScoreChosen from '~/components/elements/pronunciationScore/PronunciationScoreChosen'
import PronunciationNormalScoreChosen from '~/components/elements/pronunciationNormalScore/PronunciationNormalScoreChosen'
import PronunciationStressScoreChosen from '~/components/elements/pronunciationStressScore/PronunciationStressScoreChosen'
export default {
  name: 'CommentOnPronunciationItem',
  components: {
    PronunciationStressScoreChosen,
    PronunciationScoreChosen,
    PronunciationNormalScoreChosen,
    CommentOnPronunciationText
  },
  props: {
    value: {
      type: Object,
      default: () => null
    },
    emojis: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'vip'
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
