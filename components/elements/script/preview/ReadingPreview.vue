<template>
  <div class="d-flex reading-preview">
    <img :src="item.image" @click="show = true" class="reading-preview-img" />
    <div @click="show = true" class="d-flex flex-column p-3">
      <span class="font-weight-normal" style="font-size: 18px">{{
        item.title
      }}</span>
      <span class="text-black-50">Reading</span>
    </div>

    <b-modal v-model="show" size="sm" title="Reading">
      <img
        :src="item.image"
        style="width: 100%; height: 150px; margin-bottom: 10px;"
      />
      <div class="d-flex flex-column">
        <span class="font-weight-bold" style="font-size: 18px">{{
          item.title
        }}</span>
        <span class="text-black-50">{{ item.content }}</span>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ReadingPreview',
  props: {
    item: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

<style lang="scss">
.reading-preview {
  border: 1px solid #e2e6ef;
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 5px;
  cursor: pointer;
}
.reading-preview-img {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 120px;
  height: 130px;
}
</style>
