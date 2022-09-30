<template>
  <div>
    <div class="d-flex flex-row">
      <div class="width-140 height-3788">
        <image-upload-btn
          @uploadSuccess="updateBackground"
          :require-dimension="false"
          @getDimension="getDimensionBackground"
          class="width-140"
        />
      </div>
      <div class="width-140 height-3788">
        <b-button
          @click="showObjectModal"
          variant="primary"
          class="ml-2 width-140"
          ><i class="la la-plus"></i> Thêm object</b-button
        >
      </div>
    </div>
    <p class="mt-3">Double click vào object để sửa</p>
    <b-slider-with-validation
      v-model="innerValue.object.default_text_size"
      :required="true"
      :min="0"
      :max="80"
      style="width:100%;"
      name="font"
      label="Kích thước font object"
    />
    <div
      :style="{
        width: `${parentWidth}px`,
        height: `${innerValue.backgroundHeightRender}px`,
        backgroundImage: `url('${innerValue.backgroundUrl}')`,
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
          height: `${innerValue.backgroundHeightRender}px`
        }"
      ></div>
      <vue-draggable-resizable
        v-for="object in innerValue.object.conversations"
        :key="object.id"
        :parent="true"
        :x="object.x * parentWidth"
        :y="object.y * innerValue.backgroundHeightRender"
        :w="
          object.width
            ? object.width * parentWidth
            : object.content.length * innerValue.object.default_text_size
        "
        @resizestop="(left, top, width) => dragstop(object, left, top, width)"
        @dragstop="(left, top) => dragstop(object, left, top)"
        @dblclick.native="showObjectModal(object)"
        h="auto"
      >
        <div
          :style="{
            fontSize: `${innerValue.object.default_text_size /
              innerValue.backgroundRatio}px`,
            fontWeight: 500
          }"
          v-html="highlight(object.content)"
          style="font-family: 'Circular Std'"
          class="cursor-pointer"
        ></div>
      </vue-draggable-resizable>
    </div>
    <let-talk-with-situation-object-modal
      ref="letTalkWithSituationObjectModal"
      @submit="submitForm"
      :backgroundHeight="innerValue.backgroundHeight"
    />
  </div>
</template>

<script>
import ImageUploadBtn from '~/components/base/input/ImageUploadBtn'
import LetTalkWithSituationObjectModal from '~/components/elements/script/partial/primarySchool/LetTalkWithSituationObjectModal'
import { notify } from '~/utils/bootstrap-notify'
import BSliderWithValidation from '~/components/base/input/BSliderWithValidation'

export default {
  name: 'LetTalkWithSituationItem',
  components: {
    LetTalkWithSituationObjectModal,
    ImageUploadBtn,
    BSliderWithValidation
  },
  props: {
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      innerValue: null,
      parentWidth: 1080,
      parentHeight: 810
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value(val) {
      if (val) {
        this.innerValue = val
      } else {
        this.innerValue = {}
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    } else {
      this.innerValue = {}
    }
  },
  methods: {
    highlight(value) {
      if (!value) {
        return value
      }
      return value.replace(
        /<(.*?)>/g,
        '<span class="--chant-highlight">$1</span>'
      )
    },
    showObjectModal(item = null) {
      if (this.innerValue.backgroundUrl !== '') {
        this.$refs.letTalkWithSituationObjectModal.show(
          this.innerValue.object,
          item
        )
      } else {
        notify('Thông báo', 'Thêm ảnh nền trước khi thêm các object', 'warning')
      }
    },
    updateBackground(url) {
      this.$set(this.innerValue, 'backgroundUrl', url)
    },
    dragstop(object, left, top, width = null) {
      object.x = left / this.parentWidth
      object.y = top / this.innerValue.backgroundHeightRender
      if (width) {
        object.width = width / this.parentWidth
      }
    },
    submitForm(object) {
      this.innerValue.object = object
    },
    getDimensionBackground(dimension) {
      this.$set(this.innerValue, 'backgroundWidth', dimension.width)
      this.$set(this.innerValue, 'backgroundHeight', dimension.height)
      this.$set(
        this.innerValue,
        'backgroundRatio',
        dimension.width / this.parentWidth
      )
      setTimeout(() => {
        this.$set(
          this.innerValue,
          'backgroundHeightRender',
          dimension.height / this.innerValue.backgroundRatio
        )
      }, 100)
    }
  }
}
</script>
