<template>
  <div>
    <div class="row">
      <div class="col-sm-6">
        <h2 v-if="listImagePoint.length !== 0">Danh sách</h2>
      </div>
      <div class="col-sm-6">
        <button
          @click="showModalAddImagePoint"
          type="button"
          class="btn btn-primary float-right"
        >
          <i class="la la-plus"></i> Thêm ảnh mới
        </button>
      </div>
    </div>
    <div class="row list-image-point">
      <div v-for="(item, i) in listImagePoint" :key="i" class="col-sm-6">
        <div
          :style="{ backgroundImage: 'url(' + item.image + ')' }"
          class="image-point"
        >
          <!-- <img :src="item.image" /> -->
        </div>
        <div class="action">
          <i
            @click="showModalEditImagePoint(item, i)"
            class="fa fa-edit"
            style="color:#4A50F1"
          />
          <i
            @click="removeImagePoint(i)"
            class="fa fa-trash-o"
            style="color:#F14138"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'

export default {
  name: 'ListQuestions',
  props: {
    listImagePoint: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapState({
      currentImage: (state) => state.image.currentImage,
      currentIndexImage: (state) => state.indexImage.currentIndexImage
    })
  },
  watch: {
    currentImage(val) {
      if (this.currentIndexImage === null) {
        this.listImagePoint.push(val)
      } else {
        this.listImagePoint[this.currentIndexImage] = val
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentImage: 'image/setCurrentImage',
      setCurrentIndexImage: 'indexImage/setCurrentIndexImage'
    }),
    showModalEditImagePoint(image, index) {
      this.setCurrentIndexImage(index)
      this.$emit('showModalImagePoint', this.listImagePoint[index])
    },
    showModalAddImagePoint() {
      this.$emit('showModalImagePoint')
    },
    removeImagePoint(index) {
      this.$bvModal
        .msgBoxConfirm('Bạn chắc chắn muốn xóa ảnh này?', {
          title: this.$t('alert.notice'),
          okVariant: 'danger',
          okTitle: this.$t('button.ok'),
          cancelTitle: this.$t('button.cancel')
        })
        .then((value) => {
          if (value) {
            this.listImagePoint.splice(index, 1)
            notifyDeleteSuccess('ảnh')
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    }
  }
}
</script>
