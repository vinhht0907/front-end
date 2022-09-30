<template>
  <div>
    <b-modal
      ref="modal"
      :no-enforce-focus="true"
      @ok="handleModalOk"
      cancel-title="Đóng"
      ok-title="Đồng ý"
      title="Look listen and number"
      size="xl"
    >
      <div class="d-flex flex-row">
        <div class="width-140 height-3788">
          <image-upload-btn
            @uploadSuccess="updateBackground"
            :require-dimension="false"
            @getDimension="getDimensionBackground"
            class="width-140"
          />
        </div>
        <div class="height-3788">
          <b-button @click="addNumber" variant="primary" class="ml-2"
            ><i class="la la-plus"></i> Thêm số</b-button
          >
          <b-button @click="showObjectModal" variant="primary" class="ml-2"
            ><i class="la la-plus"></i> Audio</b-button
          >
        </div>
      </div>
      <p class="mt-3">Double click vào object để xóa số</p>
      <b-slider-with-validation
        v-model="form.default_text_size"
        :required="true"
        :min="0"
        :max="80"
        style="width:100%;"
        rules="required"
        name="font"
        label="Kích thước font số"
      />
      <div
        :style="{
          width: `${parentWidth}px`,
          height: `${form.backgroundHeightRender}px`,
          backgroundImage: `url('${form.backgroundUrl}')`,
          'background-size': 'cover',
          border: '1px solid rgb(224, 224, 224)',
          position: 'relative',
          margin: '0px auto'
        }"
        class="mt-5"
      >
        <div
          :style="{
            position: 'absolute',
            backgroundColor: '#808080',
            background:
              'linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px)',
            backgroundSize: '20px 20px, 20px 20px',
            width: `${parentWidth}px`,
            height: `${form.backgroundHeightRender}px`
          }"
        ></div>
        <vue-draggable-resizable
          v-for="(object, key) in form.numbers"
          :key="key"
          :parent="true"
          :resizable="false"
          :x="object.x * parentWidth"
          :y="object.y * form.backgroundHeightRender"
          :w="33"
          :h="33"
          @dragstop="(left, top) => dragstop(object, left, top)"
          @dblclick.native="deleteObjectModal(key)"
        >
          <div
            :style="{
              fontSize: `${form.default_text_size * form.backgroundRatio}px`,
              lineHeight: `${form.default_text_size * form.backgroundRatio +
                10}px`,
              width: `${form.default_text_size * form.backgroundRatio + 10}px`,
              height: `${form.default_text_size * form.backgroundRatio + 10}px`
            }"
            style="border: 1px solid;text-align: center"
            class="number-item"
          >
            {{ key + 1 }}
          </div>
        </vue-draggable-resizable>
      </div>
    </b-modal>
    <look-listen-and-number-object-modal
      ref="lookListenAndNumberObjectModal"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import ImageUploadBtn from '~/components/base/input/ImageUploadBtn'
import { notify } from '~/utils/bootstrap-notify'
import BSliderWithValidation from '~/components/base/input/BSliderWithValidation'
import LookListenAndNumberObjectModal from '~/components/elements/script/partial/primarySchool/LookListenAndNumberObjectModal'

const defaultForm = {
  backgroundUrl: '',
  backgroundWidth: 0,
  backgroundHeight: 0,
  default_text_size: 40,
  numbers: []
}
export default {
  name: 'LookListenAndNumberModal',
  components: {
    LookListenAndNumberObjectModal,
    BSliderWithValidation,
    ImageUploadBtn
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      parentWidth: 1080
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      if (!this.form.numbers) {
        this.$set(this.form, 'numbers', [])
      }
      if (!this.form.backgroundUrl) {
        this.$set(this.form, 'backgroundUrl', '')
      }

      if (!this.form.default_text_size) {
        this.$set(this.form, 'default_text_size', 40)
      }

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    handleModalOk(bvModalEvt) {
      this.$emit('updateScript', this.form)
      this.$refs.modal.hide()
    },
    addNumber() {
      if (this.form.backgroundUrl !== '') {
        const y =
          (this.form.numbers.length * 33 + 10) /
          this.form.backgroundHeightRender
        this.form.numbers.push({
          x: 0,
          y
        })
      } else {
        notify('Thông báo', 'Thêm ảnh nền trước khi thêm số', 'warning')
      }
    },
    deleteObjectModal(index) {
      this.form.numbers.splice(index, 1)
    },
    updateBackground(url) {
      this.$set(this.form, 'backgroundUrl', url)
    },
    dragstop(object, left, top) {
      object.x = left / this.parentWidth
      object.y = top / this.form.backgroundHeightRender
    },
    getDimensionBackground(dimension) {
      this.$set(this.form, 'backgroundWidth', dimension.width)
      this.$set(this.form, 'backgroundHeight', dimension.height)
      this.$set(
        this.form,
        'backgroundRatio',
        dimension.width / this.parentWidth
      )
      this.form.backgroundHeightRender =
        dimension.height / this.form.backgroundRatio
    },
    submitForm(object) {
      this.$set(this.form, 'object', object)
    },
    showObjectModal() {
      this.$refs.lookListenAndNumberObjectModal.show(this.form.object)
    }
  }
}
</script>
