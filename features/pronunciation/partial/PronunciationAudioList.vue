<template>
  <draggable-list
    v-model="innerValue"
    v-slot="{ index }"
    form-title="Danh sách audio hướng dẫn đọc"
    label="audio"
    properties="text"
  >
    <pronunciation-audio-item v-model="value[index]" />
  </draggable-list>
</template>

<script>
import PronunciationAudioItem from './PronunciationAudioItem'
import DraggableList from '~/components/base/DraggableList'

export default {
  name: 'PronunciationAudioList',
  components: {
    PronunciationAudioItem,
    DraggableList
  },
  props: {
    value: {
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
    }
  },
  created() {
    this.innerValue = this.value
  }
}
</script>
