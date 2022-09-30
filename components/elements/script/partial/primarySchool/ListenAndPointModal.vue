<template>
  <div>
    <b-modal
      ref="modal"
      :no-enforce-focus="true"
      @ok="handleModalOk"
      cancel-title="Đóng"
      ok-title="Đồng ý"
      title="Look and point"
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
          <b-button @click="showObjectModal" variant="primary" class="ml-2"
            ><i class="la la-plus"></i> Danh sách object</b-button
          >
        </div>
        <div
          v-if="form.object.conversations.length > 0"
          class="ml-5 d-flex flex-row kt-font-lg"
        >
          <div class="m-t-7">Objects:</div>
          <draggable v-model="form.object.conversations" ghost-class="ghost">
            <transition-group>
              <b-form-checkbox
                v-for="object in form.object.conversations"
                :key="object.id"
                :value="object.id"
                v-model="objectSelected"
                @dblclick.native="showObjectModal(object)"
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
          v-for="object in form.object.conversations"
          :key="object.id"
          :parent="true"
          :resizable="false"
          :x="object.x * parentWidth"
          :y="object.y * form.backgroundHeightRender"
          :w="object.width * parentWidth"
          :h="object.height * form.backgroundHeightRender"
          @dragstop="(left, top) => dragstop(object, left, top)"
          @dblclick.native="showObjectModal(object)"
        >
          <img
            :width="object.width * parentWidth"
            :height="object.height * form.backgroundHeightRender"
            :src="object.url"
            :alt="object.text"
            :class="{
              'image-draggable--active': objectSelected.includes(object.id)
            }"
            class="image-draggable"
          />
        </vue-draggable-resizable>
      </div>
    </b-modal>
    <listen-and-point-objects-modal
      ref="listenAndPointObjectModal"
      @submit="submitForm"
      :backgroundHeight="form.backgroundHeight"
      :backgroundWidth="form.backgroundWidth"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import draggable from 'vuedraggable'
import ImageUploadBtn from '~/components/base/input/ImageUploadBtn'
import ListenAndPointObjectsModal from '~/components/elements/script/partial/primarySchool/ListenAndPointObjectsModal'
import { notify } from '~/utils/bootstrap-notify'

const defaultForm = {
  backgroundUrl: '',
  oldBackgroundWidth: 0,
  oldBackgroundHeight: 0,
  backgroundWidth: 0,
  backgroundHeight: 0,
  object: {
    conversations: []
  }
}
export default {
  name: 'ListenAndPointModal',
  components: { ListenAndPointObjectsModal, ImageUploadBtn, draggable },
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
      if (!this.form.object) {
        this.$set(this.form, 'object', {
          conversations: []
        })
      }
      if (!this.form.backgroundUrl) {
        this.$set(this.form, 'backgroundUrl', '')
      }
      if (!this.form.oldBackgroundHeight) {
        this.$set(this.form, 'oldBackgroundHeight', 0)
      }
      if (!this.form.oldBackgroundWidth) {
        this.$set(this.form, 'oldBackgroundWidth', 0)
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
      if (this.form.backgroundUrl !== '') {
        this.$refs.listenAndPointObjectModal.show(this.form.object, item)
      } else {
        notify('Thông báo', 'Thêm ảnh nền trước khi thêm các object', 'warning')
      }
    },
    updateBackground(url) {
      this.$set(this.form, 'backgroundUrl', url)
    },
    dragstop(object, left, top) {
      object.x = left / this.parentWidth
      object.y = top / this.form.backgroundHeightRender
      console.log()
    },
    submitForm(object) {
      this.form.object = object
    },
    deleteObject(object) {
      const index = this.form.objects.findIndex((item) => object.id === item.id)
      this.form.objects.splice(index, 1)
    },
    getDimensionBackground(dimension) {
      this.$set(this.form, 'oldBackgroundWidth', this.form.backgroundWidth)
      this.$set(this.form, 'oldBackgroundHeight', this.form.backgroundHeight)
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
        if (
          this.form.object.conversations &&
          this.form.object.conversations.length > 0 &&
          this.form.oldBackgroundWidth !== 0 &&
          this.form.oldBackgroundHeight !== 0
        ) {
          const conversations = this.form.object.conversations
          conversations.forEach((e, index) => {
            this.form.object.conversations[index].width =
              e.widthOrigin / this.form.backgroundWidth
            this.form.object.conversations[index].height =
              e.heightOrigin / this.form.backgroundHeight
          })
          console.log(
            'this.form.object.conversations',
            this.form.object.conversations
          )
        }
      }, 100)
    }
  }
}
</script>
