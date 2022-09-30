<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    hide-footer
    title="Danh sách các tham số"
    size="lg"
  >
    <b-table :items="items" striped hover fixed>
      <b-tr>
        <b-th width="200px">Descriptor</b-th>
        <b-th>Mô tả</b-th>
      </b-tr>
    </b-table>
  </b-modal>
</template>

<script>
export default {
  name: 'CommentOnPronunciationModal',
  props: {
    items: {
      type: Array,
      default: () => [
        {
          Descriptor: '[[training_phone]]',
          'Mô tả': 'Âm cần luyện, ví dụ /tr/'
        },
        {
          Descriptor: '[[training_phone.top1_word]]',
          'Mô tả': 'Từ nói tốt nhất trong âm cần luyện'
        },
        {
          Descriptor: '[[training_phone.top2_word]]',
          'Mô tả': 'Từ nói tốt thứ 2 trong âm cần luyện'
        },
        {
          Descriptor: '[[training_phone.top3_word]]',
          'Mô tả': 'Từ nói tốt thứ 3 trong âm cần luyện'
        },
        {
          Descriptor: '[[training_phone.last1_word]]',
          'Mô tả': 'Từ nói tệ nhất trong âm cần luyện'
        },
        {
          Descriptor: '[[training_phone.last2_word]]',
          'Mô tả': 'Từ nói tệ thứ 2 trong âm cần luyện'
        },
        {
          Descriptor: '[[training_phone.last3_word]]',
          'Mô tả': 'Từ nói tệ thứ 3 trong âm cần luyện'
        },
        {
          Descriptor: '[[best_phone]]',
          'Mô tả':
            'Âm nói tốt nhất khác âm cần luyện và có điểm số >= 70 (tốt trở lên)'
        },
        {
          Descriptor: '[[second_best_phone]]',
          'Mô tả':
            'Âm nói tốt thứ 2 khác âm cần luyện và có điểm số >= 70 (tốt trở lên)'
        },
        {
          Descriptor: '[[third_best_phone]]',
          'Mô tả':
            'Âm nói tốt thứ 3  khác âm cần luyện và có điểm số >= 70 (tốt trở lên)'
        },
        {
          Descriptor:
            '[[best_phone.top1_word]], [[best_phone.top2_word]], ' +
            '[[best_phone.top3_word]],' +
            '[[second_best_phone.top1_word]],\n' +
            '[[second_best_phone.top2_word]],\n' +
            '[[second_best_phone.top3_word]],\n' +
            '[[third_best_phone.top1_word]],\n' +
            '[[third_best_phone.top2_word]],\n' +
            '[[third_best_phone.top3_word]],\n',
          'Mô tả':
            'Từ nói tốt nhất , nhì, ba trong các âm nói tốt nhất, nhì, ba tương ứng'
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
        },
        {
          Descriptor:
            '[[worst_phone.last1_word]], [[worst_phone.last2_word]], ' +
            '[[worst_phone.last3_word]],\n' +
            '[[second_worst_phone.last1_word]],\n' +
            '[[second_worst_phone.last2_word]],\n' +
            '[[second_worst_phone.last3_word]],\n' +
            '[[third_worst_phone.last1_word]],\n' +
            '[[third_worst_phone.last2_word]],\n' +
            '[[third_worst_phone.last3_word]],\n',
          'Mô tả':
            'Từ nói tệ nhất, nhì, ba trong các âm nói tệ nhất, nhì, ba tương ứng'
        }
      ]
    }
  },
  data() {
    return {}
  },
  methods: {
    show(items = null) {
      this.$refs.modal.show()
    }
  }
}
</script>
