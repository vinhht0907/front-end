<template>
  <div>
    <b-modal
      ref="modal"
      :no-enforce-focus="true"
      @ok="handleModalOk"
      cancel-title="Đóng"
      ok-title="Đồng ý"
      title="Point and say bubble"
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
          <b-button @click="showQuestionModal" variant="primary" class="ml-2"
            ><i class="la la-plus"></i> Thêm question</b-button
          >
          <b-button @click="showObjectModal" variant="primary" class="ml-2"
            ><i class="la la-plus"></i> Thêm object</b-button
          >
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
        label="Kích thước font question"
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
          v-for="question in form.questions"
          :key="question.id"
          :parent="true"
          :x="question.x * parentWidth"
          :y="question.y * form.backgroundHeightRender"
          :w="
            question.width
              ? question.width * parentWidth
              : ((question.text.length * form.default_text_size) / 4) * 3
          "
          @resizestop="
            (left, top, width) => dragstop(question, left, top, width)
          "
          @dragstop="(left, top) => dragstop(question, left, top)"
          @dblclick.native="showQuestionModal(question)"
          h="auto"
        >
          <div
            :style="{
              fontSize: `${form.default_text_size * form.backgroundRatio}px`
            }"
            v-html="highlight(question.text)"
            style="font-family: 'Circular Std'"
            class="cursor-pointer"
          ></div>
        </vue-draggable-resizable>
        <vue-draggable-resizable
          v-for="object in form.objects"
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
    <point-and-say-bubble-object-modal
      ref="objectModal"
      :questions="form.questions"
      @submit="submitForm"
      @delete="deleteObject"
    />
    <point-and-say-bubble-text-modal
      ref="questionModal"
      @submit="submitQuestionForm"
      @delete="deleteQuestion"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import randomstring from 'randomstring'
import ImageUploadBtn from '~/components/base/input/ImageUploadBtn'
import { notify } from '~/utils/bootstrap-notify'
import PointAndSayBubbleObjectModal from '~/components/elements/script/partial/primarySchool/PointAndSayBubbleObjectModal'
import PointAndSayBubbleTextModal from '~/components/elements/script/partial/primarySchool/PointAndSayBubbleTextModal'
import BSliderWithValidation from '~/components/base/input/BSliderWithValidation'

const defaultForm = {
  backgroundUrl: '',
  questions: [],
  backgroundWidth: 0,
  backgroundHeight: 0,
  objects: []
}
export default {
  name: 'PointAndSayBubbleModal',
  components: {
    BSliderWithValidation,
    PointAndSayBubbleTextModal,
    PointAndSayBubbleObjectModal,
    ImageUploadBtn
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      parentWidth: 1080,
      objectSelected: []
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      if (!this.form.objects) {
        this.$set(this.form, 'objects', [])
      }
      if (!this.form.questions) {
        this.$set(this.form, 'questions', [])
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
    showObjectModal(item = null) {
      if (this.form.backgroundUrl !== '') {
        this.$refs.objectModal.show(item)
      } else {
        notify('Thông báo', 'Thêm ảnh nền trước khi thêm các object', 'warning')
      }
    },
    updateBackground(url) {
      this.$set(this.form, 'backgroundUrl', url)
    },
    dragstop(object, left, top, width = null) {
      object.x = left / this.parentWidth
      object.y = top / this.form.backgroundHeightRender
      if (width) {
        object.width = width / this.parentWidth
      }
    },
    submitForm(object) {
      const index = this.form.objects.findIndex((item) => item.id === object.id)

      if (index !== -1) {
        this.$set(this.form.objects, index, object)
      } else {
        object.id = randomstring.generate()
        object.x = 0
        object.y = 0
        this.form.objects.push(object)
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
        if (this.form.objects && this.form.objects.length > 0) {
          const conversations = this.form.objects
          conversations.forEach((e, index) => {
            e.width = e.widthOrigin / this.form.backgroundWidth
            e.height = e.heightOrigin / this.form.backgroundHeight
          })
        }
      }, 100)
    },
    deleteObject(object) {
      const index = this.form.objects.findIndex((item) => item.id === object.id)
      if (index !== -1) {
        this.form.objects.splice(index, 1)
      }
    },
    showQuestionModal(item = null) {
      if (this.form.backgroundUrl !== '') {
        this.$refs.questionModal.show(item, this.form.questions)
      } else {
        notify('Thông báo', 'Thêm ảnh nền trước khi thêm question', 'warning')
      }
    },
    submitQuestionForm(question) {
      const index = this.form.questions.findIndex(
        (item) => item.id === question.id
      )

      if (index !== -1) {
        this.$set(this.form.questions, index, question)
      } else {
        question.id = randomstring.generate()
        question.x = 0
        question.y =
          (this.form.questions.length * this.form.default_text_size) /
          this.form.backgroundHeightRender
        this.form.questions.push(question)
      }
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
    deleteQuestion(object) {
      const index = this.form.questions.findIndex(
        (item) => item.id === object.id
      )
      if (index !== -1) {
        this.form.questions.splice(index, 1)

        this.form.objects.forEach((o) => {
          const questionIndex = o.answers.findIndex(
            (item) => item.question.id === object.id
          )
          if (questionIndex !== -1) {
            o.answers.splice(questionIndex, 1)
          }
        })
      }
    }
  }
}
</script>
