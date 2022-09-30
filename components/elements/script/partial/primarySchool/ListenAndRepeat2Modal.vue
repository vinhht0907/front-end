<template>
  <div>
    <b-modal
      ref="modal"
      :no-enforce-focus="true"
      @ok="handleModalOk"
      cancel-title="Đóng"
      ok-title="Đồng ý"
      title="Listen and repeat"
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
          <b-button
            @click="showObjectModal(null, 0)"
            variant="primary"
            class="ml-2"
            ><i class="la la-plus"></i> Thêm object</b-button
          >
        </div>
        <div
          v-if="form.texts.length > 0"
          class="ml-5 d-flex flex-row kt-font-lg"
        >
          <div class="m-t-7">Objects:</div>
          <draggable v-model="form.texts" ghost-class="ghost">
            <transition-group>
              <b-form-checkbox
                v-for="(object, index) in form.texts"
                :key="object.id"
                :value="object.id"
                v-model="objectSelected"
                @dblclick.native="showObjectModal(object, index)"
                button
                button-variant="outline-primary"
                inline
                class="ml-4 mb-2"
                >{{ object.text }}</b-form-checkbox
              >
            </transition-group>
          </draggable>
        </div>
      </div>
      <p class="mt-3">Double click vào object để sửa</p>
      <b-slider-with-validation
        v-model="form.default_text_size"
        :required="true"
        :min="0"
        :max="80"
        style="width:100%;"
        rules="required"
        name="font"
        label="Kích thước font object"
      />
      <div
        :style="{
          width: `${parentWidth}px`,
          height: `${form.backgroundHeightRender}px`,
          backgroundImage: `url('${form.image}')`,
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
          v-for="(object, index) in form.texts"
          :key="object.id"
          :parent="true"
          :x="object.x * parentWidth"
          :y="object.y * form.backgroundHeightRender"
          :w="
            object.width
              ? object.width * parentWidth
              : object.text.length * form.default_text_size
          "
          @resizestop="(left, top, width) => dragstop(object, left, top, width)"
          @dragstop="(left, top) => dragstop(object, left, top)"
          @dblclick.native="showObjectModal(object, index)"
          h="auto"
        >
          <div
            :style="{
              fontSize: `${form.default_text_size / form.backgroundRatio}px`,
              fontWeight: 500
            }"
            v-html="highlight(object.text)"
            style="font-family: 'Circular Std'"
            class="cursor-pointer"
          ></div>
        </vue-draggable-resizable>
      </div>
    </b-modal>
    <listen-and-repeat2-object-modal
      ref="listenAndRepeatObjectModal"
      @submit="submitForm"
      :backgroundHeight="form.backgroundHeight"
      :defaultTextSize="form.default_text_size"
      @deleteObject="deleteObject"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import draggable from 'vuedraggable'
import ImageUploadBtn from '~/components/base/input/ImageUploadBtn'
import ListenAndRepeat2ObjectModal from '~/components/elements/script/partial/primarySchool/ListenAndRepeat2ObjectModal'
import BSliderWithValidation from '~/components/base/input/BSliderWithValidation'
import { notify } from '~/utils/bootstrap-notify'

const defaultForm = {
  image: '',
  backgroundWidth: 0,
  backgroundHeight: 0,
  texts: [],
  default_text_size: 16
}
export default {
  name: 'ListenAndRepeat2Modal',
  components: {
    ListenAndRepeat2ObjectModal,
    ImageUploadBtn,
    draggable,
    BSliderWithValidation
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      parentWidth: 1080,
      parentHeight: 810,
      objectSelected: []
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      if (!this.form.texts) {
        this.$set(this.form, 'texts', [])
      }
      if (!this.form.default_text_size) {
        this.$set(this.form, 'default_text_size', 16)
      }
      if (!this.form.image) {
        this.$set(this.form, 'image', '')
      }

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    highlight(value) {
      if (!value) {
        return value
      }
      return value.replace(
        /<(.*?)>/g,
        '<span class="--chant-highlight">$1</span>'
      )
    },
    handleModalOk(bvModalEvt) {
      this.$emit('updateScript', this.form)
      this.$refs.modal.hide()
    },
    showObjectModal(item = null, index = 0) {
      if (this.form.image !== '') {
        if (item === null) {
          this.$refs.listenAndRepeatObjectModal.show(
            item,
            this.form.texts.length
          )
        } else {
          this.$refs.listenAndRepeatObjectModal.show(item, index)
        }
      } else {
        notify('Thông báo', 'Thêm ảnh nền trước khi thêm các object', 'warning')
      }
    },
    updateBackground(url) {
      this.$set(this.form, 'image', url)
    },
    dragstop(object, left, top, width = null) {
      object.x = left / this.parentWidth
      object.y = top / this.form.backgroundHeightRender
      if (width) {
        object.width = width / this.parentWidth
      }
    },
    submitForm(object) {
      if (this.form.texts.length === 0) {
        this.form.texts = [object]
      } else {
        const index = this.form.texts.findIndex((e) => {
          return e.id === object.id
        })
        if (index >= 0) {
          this.form.texts[index] = object
        } else {
          this.form.texts.push(object)
        }
      }
    },
    getDimensionBackground(dimension) {
      this.$set(this.form, 'backgroundWidth', dimension.width)
      this.$set(this.form, 'backgroundHeight', dimension.height)
      this.$set(
        this.form,
        'backgroundRatio',
        dimension.width / this.parentWidth
      )
      setTimeout(() => {
        this.$set(
          this.form,
          'backgroundHeightRender',
          dimension.height / this.form.backgroundRatio
        )
      }, 100)
    },
    deleteObject(object) {
      const index = this.form.texts.findIndex((item) => object.id === item.id)
      this.form.texts.splice(index, 1)
    }
  }
}
</script>
