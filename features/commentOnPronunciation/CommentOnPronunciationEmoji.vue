<template>
  <b-form-group label="Biểu tượng cảm xúc">
    <div class="emoji-list">
      <div v-for="(item, index) in innerValue" :key="index" class="emoji-item">
        <img :src="item.path" :alt="item.name" />
        <div @click="deleteEmoji(index)" class="item-action">Xóa</div>
      </div>

      <el-popover width="446">
        <div class="emoji-popover-list">
          <img
            v-for="emoji in emojis"
            :src="emoji.path"
            @click="addEmoji(emoji)"
          />
        </div>
        <div slot="reference" class="image-uploader image-uploader-sm">
          <div class="el-upload el-upload--picture-card">
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </el-popover>
    </div>
  </b-form-group>
</template>

<script>
export default {
  name: 'CommentOnPronunciationEmoji',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    emojis: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      innerValue: []
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
  },
  methods: {
    addEmoji(item) {
      this.innerValue.push({
        name: item.name,
        path: item.path
      })
    },
    deleteEmoji(index) {
      this.innerValue.splice(index, 1)
    }
  }
}
</script>
