<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    ok-title="Chọn ảnh"
    title="Danh sách ảnh"
    size="lg"
  >
    <div v-loading="loading">
      <image-upload-selection
        :data-images="dataImages"
        :post-data="postData"
        v-model="selectedImages"
      />
    </div>
  </b-modal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { notifyTryAgain } from '~/utils/bootstrap-notify'
import ImageUploadSelection from '~/components/base/ImageUploadSelection'

export default {
  name: 'ReviewActivityMediaModal',
  components: {
    ImageUploadSelection
  },
  data() {
    return {
      dataImages: [],
      selectedImages: [],
      postData: {},
      loading: false
    }
  },
  methods: {
    show(images, activityId, activityType = 'common') {
      this.selectedImages = cloneDeep(images)
      this.postData = {
        activity_id: activityId,
        activity_type: activityType
      }
      this.$nextTick(() => {
        this.$refs.modal.show()
        this.loadImages()
      })
    },
    handleModalOk(bvModalEvt) {
      this.$emit('ok', this.selectedImages)
    },
    handleModalHide() {
      this.dataImages = []
    },
    async loadImages() {
      try {
        this.loading = true
        const data = await this.$axios.$post(
          '/review-activity-media/list',
          this.postData
        )
        this.dataImages = data
      } catch (e) {
        notifyTryAgain()
      }
      this.loading = false
    }
  }
}
</script>
