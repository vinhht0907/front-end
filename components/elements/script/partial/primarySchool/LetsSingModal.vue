<template>
  <div>
    <b-modal
      ref="modal"
      :no-enforce-focus="true"
      @ok="handleModalOk"
      cancel-title="Đóng"
      ok-title="Đồng ý"
      title="Lets sing"
      size="xl"
    >
      <div class="d-flex flex-row">
        <div class="width-140 height-3788">
          <image-upload-btn
            @uploadSuccess="updateBackground"
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
        <div class="width-150 height-3788 m-l-7">
          <b-button
            @click="showTitleModal"
            variant="primary"
            class="ml-2 width-150"
            ><i class="la la-plus"></i> Thêm tiêu đề</b-button
          >
        </div>
      </div>
      <p class="mt-3">Double click vào object hoặc title để sửa</p>
      <b-slider-with-validation
        v-model="form.object.default_text_size"
        :required="true"
        :min="0"
        :max="80"
        style="width:100%;"
        rules="required"
        name="font"
        label="Kích thước font object"
      />
      <b-slider-with-validation
        v-model="form.title.default_text_size"
        :required="true"
        :min="0"
        :max="80"
        style="width:100%;"
        rules="required"
        name="font"
        label="Kích thước font tiêu đề"
      />
      <div
        :style="{
          width: `${parentWidth}px`,
          height: `${parentHeight}px`,
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
            height: `${parentHeight}px`
          }"
        ></div>
        <vue-draggable-resizable
          v-for="object in form.object.conversations"
          :key="object.id"
          :parent="true"
          :x="object.x * parentWidth"
          :y="object.y * parentHeight"
          :w="
            object.width
              ? object.width * parentWidth
              : ((object.content.length * form.object.default_text_size) / 4) *
                3
          "
          @resizestop="(left, top, width) => dragstop(object, left, top, width)"
          @dragstop="(left, top) => dragstop(object, left, top)"
          @dblclick.native="showObjectModal(object)"
          h="auto"
        >
          <div
            :style="{
              fontSize: `${(form.object.default_text_size / 4) * 3}px`,
              fontWeight: 500
            }"
            v-html="highlight(object.content)"
            style="font-family: 'Circular Std'"
            class="cursor-pointer"
          ></div>
        </vue-draggable-resizable>
        <vue-draggable-resizable
          v-if="form.title"
          :parent="true"
          :x="form.title.x * parentWidth"
          :y="form.title.y * parentHeight"
          :w="
            form.title.width
              ? form.title.width * parentWidth
              : 0.3 * parentWidth
          "
          @resizestop="
            (left, top, width) => dragstop(form.title, left, top, width)
          "
          @dragstop="(left, top) => dragstop(form.title, left, top)"
          @dblclick.native="showTitleModal(form.title)"
          h="auto"
        >
          <div
            v-html="form.title.title"
            :style="{
              fontSize: `${(form.title.default_text_size / 4) * 3}px`,
              fontWeight: 500
            }"
            style="font-family: 'Circular Std'"
            class="cursor-pointer"
          ></div>
        </vue-draggable-resizable>
      </div>
    </b-modal>
    <lets-sing-object-modal ref="objectModal" @submit="submitForm" />
    <lets-sing-title-modal ref="titleModal" @submit="submitTitle" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import ImageUploadBtn from '~/components/base/input/ImageUploadBtn'
import LetsSingObjectModal from '~/components/elements/script/partial/primarySchool/LetsSingObjectModal'
import LetsSingTitleModal from '~/components/elements/script/partial/primarySchool/LetsSingTitleModal'
import BSliderWithValidation from '~/components/base/input/BSliderWithValidation'

const defaultForm = {
  backgroundUrl: '',
  object: {
    conversations: [],
    default_text_size: 16
  },
  title: {
    title: '',
    x: 0,
    y: 0,
    default_text_size: 16
  }
}
export default {
  name: 'LetsSingModal',
  components: {
    LetsSingObjectModal,
    ImageUploadBtn,
    LetsSingTitleModal,
    BSliderWithValidation
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      parentWidth: 1080,
      parentHeight: 810
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
    show(item) {
      this.form = cloneDeep(item)
      if (!this.form.object) {
        this.$set(this.form, 'object', {
          conversations: [],
          default_text_size: 16
        })
      }
      if (!this.form.title) {
        this.$set(this.form, 'title', {
          title: '',
          x: 0,
          y: 0,
          default_text_size: 16
        })
      }
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    handleModalOk(bvModalEvt) {
      this.$emit('updateScript', this.form)
      this.$refs.modal.hide()
    },
    showObjectModal(item = null) {
      this.$refs.objectModal.show(this.form.object, item)
    },
    showTitleModal(item = null) {
      this.$refs.titleModal.show(this.form.title)
    },
    updateBackground(url) {
      this.$set(this.form, 'backgroundUrl', url)
    },
    dragstop(object, left, top, width = null) {
      object.x = left / this.parentWidth
      object.y = top / this.parentHeight
      if (width) {
        object.width = width / this.parentWidth
      }
    },
    submitForm(object) {
      this.form.object = object
    },
    submitTitle(title) {
      this.$set(this.form, 'title', title)
      // this.form.title = cloneDeep(title)
    }
  }
}
</script>
