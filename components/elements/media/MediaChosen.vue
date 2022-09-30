<template>
  <div>
    <div
      v-if="innerValue"
      class="position-relative d-inline-flex media-chosen-remove-wrap"
    >
      <img
        :src="innerValue.url"
        alt="img"
        style="height: 200px; width: auto; min-width: 200px;"
      />

      <div @click="innerValue = null" class="media-chosen-remove d-flex">
        <i class="el-icon-close"></i>
        <p>Xóa ảnh đại diện</p>
      </div>
    </div>

    <div v-else>
      <div @click="showModal" class="el-upload el-upload--picture-card">
        <i class="el-icon-plus"></i>
      </div>
    </div>

    <media-chosen-modal ref="mediaModal" @selected-media="selectMedia" />
  </div>
</template>

<script>
import MediaChosenModal from '~/components/elements/media/MediaChosenModal'
export default {
  name: 'MediaChosen',
  components: { MediaChosenModal },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      innerValue: null
    }
  },
  watch: {
    innerValue(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      this.innerValue = newVal
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  },
  methods: {
    showModal() {
      this.$refs.mediaModal.show()
    },
    selectMedia(obj) {
      this.innerValue = obj
    }
  }
}
</script>

<style lang="scss">
.media-chosen-remove-wrap {
  position: relative;
  &:hover {
    .media-chosen-remove {
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1;

      .el-icon-close {
        display: block;
        font-size: 30px;
        color: #fff;
      }
    }
  }

  .media-chosen-remove {
    cursor: pointer;
    flex-direction: column;
    background-color: transparent;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    color: #fff;
    z-index: -1;

    .el-icon-close {
      font-size: 30px;
    }
  }
}
</style>
