<template>
  <div class="conversation-management">
    <div>
      <label>Nội dung tách câu</label>
    </div>
    <div
      v-for="(splitText, index) in splitTexts"
      :key="splitText.id"
      v-if="!splitText.isDescriptor"
      class="conversation-item d-flex align-items-center"
    >
      <div class="kt-radio-inline">
        <label class="kt-radio kt-radio--brand">
          <input
            v-model="currentIndex"
            :value="index"
            type="radio"
            name="answerRadio"
          />
          <span></span>
        </label>
      </div>
      <div class="message">
        <b-form-textarea
          v-model="splitText.text"
          placeholder="Nhập nội dung..."
          max-rows="5"
          rows="1"
          class="mb-2"
          disabled
        ></b-form-textarea>
      </div>

      <b-text-input-with-validation
        v-model="splitText.start"
        rules="numeric|max_value:9999"
        class="timeline"
        placeholder="start..."
        label-name="Trường này"
      />
      <b-text-input-with-validation
        v-model="splitText.end"
        rules="numeric|max_value:9999"
        class="timeline"
        placeholder="end..."
        label-name="Trường này"
      />
      <div v-if="!splitText.isDescriptor" class="d-flex flex-column">
        <a
          @click="setCurrentAudio(index)"
          href="javascript:;"
          class="text-primary delete"
          >Nghe từ đây</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

export default {
  name: 'CommentOnPronunciationAudioSplit',
  components: {
    BTextInputWithValidation
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      splitTexts: [],
      currentIndex: 0
    }
  },
  watch: {
    splitTexts: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    this.initVal(this.value)
  },
  methods: {
    initVal(val) {
      this.splitTexts = val
    },
    setTimeStart(start) {
      if (this.currentIndex < this.splitTexts.length) {
        this.splitTexts[this.currentIndex].start = start
      }
    },
    setTimeEnd(end) {
      if (this.currentIndex < this.splitTexts.length) {
        this.splitTexts[this.currentIndex].end = end
      }
      this.currentIndex = this.currentIndex + 1
    },
    setCurrentAudio(index) {
      this.currentIndex = index
      this.$emit('setCurrentAudio', this.splitTexts[index].start)
    }
  }
}
</script>
