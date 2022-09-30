<template>
  <b-modal
    id="media-modal"
    ref="modal"
    :no-enforce-focus="true"
    title="Lựa chọn tập tin"
    size="xl"
  >
    <b-tabs v-model="activeTab" content-class="mt-3">
      <b-tab title="Upload">
        <el-upload
          ref="upload"
          :on-remove="handleRemove"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :headers="this.$axios.defaults.headers.common"
          :action="this.$axios.defaults.baseURL + '/media/upload-multi-size'"
          :accept="accept"
          :limit="1"
          list-type="picture"
          class="media-chosen-upload"
          drag
          name="upload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            Kéo thả tập tin vào đây hoặc <em>nhấn để tải lên</em>
          </div>
        </el-upload>
      </b-tab>
      <b-tab title="Thư viện">
        <div class="mb-4">
          <b-form-input
            v-model="searchText"
            placeholder="Tìm kiếm tập tin"
            debounce="500"
          ></b-form-input>
        </div>

        <div class="d-flex">
          <perfect-scrollbar
            ref="mediaScroll"
            @ps-y-reach-end="loadMedia"
            class="media-list"
            style="height: 500px; width: 100%;"
          >
            <el-radio-group v-model="selectedMedia">
              <el-radio
                v-for="item in mediaItems"
                :key="item._id"
                :label="item"
                class="media-chosen-item"
              >
                <img :alt="item.name" :src="item.url" />
              </el-radio>
            </el-radio-group>
          </perfect-scrollbar>

          <div v-if="selectedMedia" class="media-item-detail">
            <p class="text-uppercase font-weight-bold">Chi tiết tập tin</p>

            <div class="row mb-2">
              <div class="col-md-6">
                <img
                  :alt="selectedMedia.name"
                  :src="selectedMedia.url"
                  class="w-100"
                />
              </div>
              <div class="d-flex flex-column col-md-6">
                <p class="font-weight-bold" style="word-break: break-all">
                  {{ selectedMedia.name }}
                </p>
                <p>{{ formatDate(selectedMedia.created_at) }}</p>
                <p v-if="selectedMedia.width">
                  {{ selectedMedia.width }}x{{ selectedMedia.height }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>

    <template v-slot:modal-footer>
      <b-button @click="$bvModal.hide('media-modal')">Hủy bỏ</b-button>

      <b-button
        @click="cancelChooseFile"
        :disabled="!selectedMedia"
        variant="warning"
      >
        Hủy chọn
      </b-button>

      <b-button
        @click="emitSelectedMedia"
        :disabled="!selectedMedia"
        variant="primary"
      >
        Chọn tập tin
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { notify } from '~/utils/bootstrap-notify'

export default {
  name: 'MediaChosenModal',
  data() {
    return {
      fileList: [],
      accept: 'image/jpeg,image/png,image/jpg',
      length: 30,
      page: 0,
      mediaItems: [],
      selectedMedia: null,
      loadMore: true,
      activeTab: 1,
      searchText: ''
    }
  },
  watch: {
    searchText(val) {
      this.page = 0
      this.mediaItems = []
      this.selectedMedia = null
      this.loadMore = true
      this.loadMedia()
    }
  },
  mounted() {
    this.loadMedia()

    this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
      if (modalId === 'media-modal') {
        this.selectedMedia = null
      }
    })
  },
  methods: {
    emitSelectedMedia() {
      this.$emit('selected-media', this.selectedMedia)
      this.$refs.modal.hide()
    },
    formatDate(time) {
      return moment(time).format('HH:mm DD-MM-YYYY')
    },
    show() {
      this.$refs.modal.show()
    },
    handleRemove(file, fileList) {
      this.selectedMedia = null
    },
    handleUploadSuccess(res, file) {
      this.mediaItems.unshift(res)
      this.selectedMedia = res
      this.$refs.upload.clearFiles()

      this.activeTab = 1
    },
    beforeUpload(file) {
      const acceptArr = this.accept.split(',')
      const isIMG = acceptArr.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isIMG) {
        notify('Thông báo', `Ảnh phải có định dạng ${this.accept}!`)
      }
      if (!isLt5M) {
        notify('Thông báo', 'Ảnh phải có kích thước nhỏ hơn 5MB!')
      }

      const img = new Image()

      img.src = window.URL.createObjectURL(file)

      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight

        this.width = width
        this.height = height
      }

      return isIMG && isLt5M
    },
    cancelChooseFile() {
      this.selectedMedia = null
      this.$refs.upload.clearFiles()
    },
    async loadMedia() {
      await this.$nextTick()

      if (this.loadMore) {
        try {
          const { data } = await this.$axios.post('/media/listing', {
            page: this.page,
            length: this.length,
            keyword: this.searchText
          })

          this.mediaItems = this.mediaItems.concat(data.data)

          if (this.mediaItems.length < data.count) {
            this.page++
          } else {
            this.loadMore = false
          }
        } catch (e) {}
      }
    }
  }
}
</script>

<style lang="scss">
.media-chosen-upload {
  .el-upload,
  .el-upload-dragger {
    width: 100%;
    height: 400px;

    .el-icon-upload {
      margin-top: 110px;
    }
  }
}
.media-item-detail {
  width: 500px;
  border-left: 1px solid #ccc;
  background-color: #eee;
  padding: 10px;
}

.media-chosen-item {
  display: inline-flex;
  flex-direction: column;
  margin-right: 15px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid transparent;

  &.is-checked {
    border: 1px solid #409eff;
  }

  .el-radio__inner {
    width: 20px;
    height: 20px;

    &::after {
      width: 6px;
      height: 6px;
    }
  }

  .el-radio__input {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .el-radio__label {
    width: 155px;
    height: 155px;
    display: block;
    overflow: hidden;
    padding-left: 0;

    img {
      object-fit: cover;
      display: block;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
