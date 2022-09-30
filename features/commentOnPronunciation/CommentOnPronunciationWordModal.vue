<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    hide-footer
    title="Danh sách các tham số"
    size="lg"
  >
    <b-table :items="items" striped hover fixed> </b-table>
  </b-modal>
</template>

<script>
export default {
  name: 'CommentOnPronunciationModal',
  data() {
    return {
      items: [
        {
          Descriptor: '[[training_phone]]',
          'Mô tả': 'Âm cần luyện, ví dụ /tr/'
        },
        {
          Descriptor: '[[best_phone]]',
          'Mô tả':
            'Âm nói tốt nhất khác âm cần luyện và có điểm số >= 70 (rất tốt trở lên)'
        },
        {
          Descriptor: '[[second_best_phone]]',
          'Mô tả':
            'Âm nói tốt thứ 2 khác âm cần luyện và có điểm số >= 70 (rất tốt trở lên)'
        },
        {
          Descriptor: '[[third_best_phone]]',
          'Mô tả':
            'Âm nói tốt thứ 3  khác âm cần luyện và có điểm số >= 70 (rất tốt trở lên)'
        },
        {
          Descriptor: '[[worst_phone]]',
          'Mô tả':
            'Âm nói tệ nhất khác âm cần luyện và có điểm số < 40 (từ tệ đến rất tệ)'
        },
        {
          Descriptor: '[[second_worst_phone]]',
          'Mô tả':
            'Âm nói tệ thứ 2 khác âm cần luyện và có điểm số < 40 (từ tệ đến rất tệ)'
        },
        {
          Descriptor: '[[third_worst_phone]]',
          'Mô tả':
            'Âm nói tệ thứ 3  khác âm cần luyện và có điểm số < 40 (từ tệ đến rất tệ)'
        }
      ]
    }
  },
  methods: {
    show() {
      this.$refs.modal.show()
    }
  }
}
</script>
