<template>
  <div>
    <div class="form-group mb-2">
      <label>Danh sách đáp án</label>
    </div>
    <el-upload
      ref="uploadImage"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-success="onSuccessFile"
      :headers="this.$axios.defaults.headers.common"
      :action="this.$axios.defaults.baseURL + '/media/upload-single-image'"
      name="image"
      multiple
      list-type="picture"
      class="multi-upload"
    >
      <b-button variant="primary">
        <i class="la la-cloud-upload"></i>
        Upload ảnh</b-button
      >
      <div slot="file" slot-scope="{ file }">
        <img
          :src="file.url"
          :alt="file.url"
          class="el-upload-list__item-thumbnail"
        />
        <div class="ml-2">
          <div class="kt-radio-inline">
            <label class="kt-radio">
              <input v-model="answer" :value="file.url" type="radio" />
              Đáp án đúng
              <span></span>
            </label>
          </div>
          <a
            @click="removeFile(file)"
            href="javascript:;"
            class="btn-sm btn btn-label-danger btn-bold"
          >
            <i class="la la-trash-o"></i>
            Xóa
          </a>
          <el-progress
            v-if="file.status === 'uploading'"
            :type="'line'"
            :stroke-width="2"
            :percentage="parseInt(file.percentage, 10)"
            class="mt-2"
          >
          </el-progress>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import randomstring from 'randomstring'
import { notify } from '~/utils/bootstrap-notify'

export default {
  name: 'BaseSingleImageAnswer',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: [],
      answer: null,
      options: []
    }
  },
  watch: {
    options(newVal) {
      this.$emit('input', newVal)
    },
    answer(newVal) {
      if (newVal) {
        this.options.forEach((item) => {
          if (item.url === newVal) {
            item.isAnswer = true
          } else {
            item.isAnswer = false
          }
        })

        this.$emit('input', this.options)
      }
    }
  },
  created() {
    this.init(this.value)
  },
  methods: {
    init(fileList) {
      this.fileList = fileList.map((item) => ({ ...item }))
      this.options = fileList.map((item) => ({ ...item }))
      const answer = fileList.find((item) => item.isAnswer === true)

      if (answer) {
        this.answer = answer.url
      }
    },
    removeFile(file) {
      this.$refs.uploadImage.handleRemove(file)
      const index = this.options.findIndex((item) => item.url === file.url)

      if (index !== -1) {
        this.options.splice(index, 1)
      }
    },
    beforeUpload(file) {
      const isIMG = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isIMG) {
        notify('Thông báo', 'Ảnh phải có định dạng jpeg,png,jpg!')
      }
      if (!isLt5M) {
        notify('Thông báo', 'Ảnh phải có kích thước nhỏ hơn 5MB!')
      }

      if (isIMG && isLt5M) {
        return true
      }

      return false
    },
    onSuccessFile(res, file, fileList) {
      file.url = res.filePath
      this.options.unshift({
        url: res.filePath,
        isAnswer: false,
        key: randomstring.generate()
      })
    }
  }
}
</script>
