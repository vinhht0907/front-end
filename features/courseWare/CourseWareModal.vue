<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    :title="isEdit ? 'Sửa học liệu' : 'Thêm học liệu'"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <select2-with-validation
        :required="true"
        v-model="form.type"
        :error="vForm.errors.get('type')"
        :options="typeOptions"
        placeholder="Chọn loại học liệu..."
        label="Loại học liệu"
        data-vv-as="Loại học liệu"
        id-field="id"
        text-field="text"
        name="type"
        rules="required"
      />
      <b-text-input-with-validation
        v-model="form.name"
        :error="vForm.errors.get('name')"
        :required="true"
        label="Tên học liệu"
        placeholder="Tên học liệu"
        name="name"
        rules="required"
      />
      <b-text-input-with-validation
        :required="true"
        v-model="form.order"
        :error="vForm.errors.get('order')"
        label="Thứ tự"
        placeholder="Thứ tự"
        rules="required|numeric|max_value:9999"
        name="order"
      />
      <b-muti-image-thumb-upload-with-validation
        v-if="[QW_LIST_IMAGES].includes(form.type.id)"
        :required="true"
        v-model="form.images"
        label="Danh sách image"
        rules="required"
      />

      <b-single-power-point-upload-with-validation
        v-if="[QW_SLIDE].includes(form.type.id)"
        :required="true"
        v-model="form.path"
        label="Tập tin slide"
        rules="required"
      />

      <iframe
        v-if="[QW_SLIDE].includes(form.type.id) && form.path !== null"
        :src="
          'https://docs.google.com/gview?url=' + form.path + '&embedded=true'
        "
        height="250"
        width="400"
        frameborder="0"
      ></iframe>

      <div v-if="[QW_IMAGE_POINT].includes(form.type.id)">
        <list-image-point
          :listImagePoint="listImagePoint"
          @showModalImagePoint="showModalImagePoint"
        />
      </div>

      <div v-if="[QW_QUESTION_ANSWER].includes(form.type.id)">
        Danh sách câu hỏi
        <list-questions
          :listQuestions="listQuestions"
          @showModalQuestion="showModalQuestion"
        />
      </div>
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ListImagePoint from '~/components/elements/courseWare/ListImagePoint'
import ListQuestions from '~/components/elements/listQuestions/ListQuestions'
import BMutiImageThumbUploadWithValidation from '~/components/base/input/BMutiImageThumbUploadWithValidation'
import BSinglePowerPointUploadWithValidation from '~/components/base/input/BSinglePowerPointUploadWithValidation'
import {
  COURSE_WARE_TYPE_OPTIONS,
  QW_LIST_IMAGES,
  QW_SLIDE,
  QW_IMAGE_POINT,
  QW_QUESTION_ANSWER
} from '~/constants/courseWare'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'

const defaultForm = {
  type: {
    id: null
  },
  name: '',
  order: null
}
export default {
  name: 'CourseWareModal',
  components: {
    ValidationObserver,
    Select2WithValidation,
    BTextInputWithValidation,
    BMutiImageThumbUploadWithValidation,
    BSinglePowerPointUploadWithValidation,
    ListImagePoint,
    ListQuestions
  },
  props: {
    onlineSession: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      isEdit: false,
      typeOptions: COURSE_WARE_TYPE_OPTIONS,
      QW_LIST_IMAGES,
      QW_SLIDE,
      QW_IMAGE_POINT,
      QW_QUESTION_ANSWER,
      courseWare: null,
      onlineSessionPart: null,
      listImagePoint: [],
      listQuestions: []
    }
  },
  methods: {
    ...mapMutations({
      setCurrentReloadTable: 'reloadTable/setCurrentReloadTable'
    }),
    showModalImagePoint(data) {
      this.$emit('showModalImagePoint', data)
    },
    showModalQuestion(data) {
      this.$emit('showModalQuestion', data)
    },
    show(item = null) {
      if (item) {
        if (typeof item === 'string') {
          this.onlineSessionPart = item
          this.listImagePoint = []
          this.listQuestions = []
        } else {
          this.isEdit = true
          this.form = cloneDeep(item)
          this.onlineSessionPart = this.form.online_session_part._id
          if (item.images) {
            this.listImagePoint = cloneDeep(item.images)
          }
          if (item.questions) {
            this.listQuestions = cloneDeep(item.questions)
          }
          if (item.type) {
            this.typeOptions.forEach((e) => {
              if (e.id === item.type) {
                this.form.type = {
                  id: item.type
                }
              }
            })
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        if (this.isEdit) {
          await this.updateItem()
        } else {
          await this.addItem()
        }
      }
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.vForm = new Form()
      this.isEdit = false
    },
    async addItem() {
      try {
        this.$refs.modal.hide()
        // thêm list question nếu dạng list câu hỏi
        if (this.form.type.id === QW_QUESTION_ANSWER) {
          this.form.questions = this.listQuestions
        }
        // thêm list ảnh nếu dạng học qua ảnh
        if (this.form.type.id === QW_IMAGE_POINT) {
          this.form.images = this.listImagePoint
          // check xem màu dạng hex
          if (this.form.images) {
            this.form.images.forEach((element) => {
              if (element.point_color.hex) {
                element.point_color = cloneDeep(element.point_color.hex)
              }
            })
          }
        }
        this.courseWare = cloneDeep(Object.freeze(this.form))
        // chuyển type từ object sang string
        const type = cloneDeep(this.form.type.id)
        this.courseWare.type = type
        this.courseWare.online_session = this.onlineSession
        this.courseWare.online_session_part = this.onlineSessionPart
        await this.$axios.post('/courseware/add', this.courseWare)
        notifyAddSuccess('Học liệu')
        this.setCurrentReloadTable('table-courseware')
        // this.setCurrentCourseWare(this.courseWare)
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    async updateItem() {
      try {
        this.$refs.modal.hide()
        // thêm list question nếu dạng list câu hỏi
        if (this.form.type.id === QW_QUESTION_ANSWER) {
          this.form.questions = this.listQuestions
        }
        // thêm list ảnh nếu dạng học qua ảnh
        if (this.form.type.id === QW_IMAGE_POINT) {
          this.form.images = this.listImagePoint
          // check xem màu dạng hex
          if (this.form.images) {
            this.form.images.forEach((element) => {
              if (element.point_color.hex) {
                element.point_color = cloneDeep(element.point_color.hex)
              }
            })
          }
        }
        // chuyển type từ object sang string
        this.courseWare = cloneDeep(Object.freeze(this.form))
        const type = cloneDeep(this.form.type.id)
        this.courseWare.type = type
        console.log(this.courseWare)
        await this.$axios.post('/courseware/edit', this.courseWare)
        notifyUpdateSuccess('Học liệu')
        this.setCurrentReloadTable('table-courseware')
      } catch (e) {
        console.log(e)
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    }
  }
}
</script>
