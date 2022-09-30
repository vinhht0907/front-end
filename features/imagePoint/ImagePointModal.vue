<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    :title="isEdit ? 'Sửa ảnh' : 'Thêm ảnh'"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <div class="image-point">
        <b-single-image-upload-with-validation
          :required="true"
          v-model="form.image"
          label="Ảnh đi kèm"
          placeholder="Ảnh đi kèm"
          rules="required"
        />
        <button @click="addPoint" type="button" class="btn btn-primary">
          <i class="la la-plus"></i> Thêm điểm mới
        </button>
        <div class="row">
          <div class="col-md-6">
            <div class="img_preview">
              <img
                ref="image"
                :src="form.image"
                @click="hanldeClickPoint"
                class="image"
              />
              <div
                v-for="(item, i) in listPoint"
                :key="i"
                :style="{
                  left: item.offsetX + '%',
                  top: item.offsetY + '%',
                  backgroundColor:
                    i === currentIndexPoint ? '#2df38e' : colorPoint
                }"
                :title="item.word.name"
                class="point"
              ></div>
            </div>
            <button @click="pickColor" type="button" class="btn_color">
              Chọn màu
            </button>
            <chrome-picker v-if="isPickColor" v-model="form.point_color" />
          </div>
          <div class="col-md-6">
            <div
              v-for="(item, i) in listPoint"
              :key="i"
              :class="i === currentIndexPoint ? 'active' : ''"
              @click="selectPoint(item, i, $event)"
              class="col-md-12 div-list"
            >
              {{ item | detailPoint }}
              <div class="action-item-list action">
                <i
                  @click="editPosition(item, i, $event)"
                  class="fa fa-map-marker action"
                  style="color:#F14138"
                />
                <i
                  @click="editPoint(item, i)"
                  class="fa fa-edit action"
                  style="color:#4A50F1"
                />
                <i
                  @click="removePoint(i)"
                  class="fa fa-trash-o action"
                  style="color:#F14138"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </validation-observer>
  </b-modal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import Form from 'vform'
import { ValidationObserver } from 'vee-validate'
import { mapState, mapMutations } from 'vuex'
import { Chrome } from 'vue-color'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'

import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess,
  notifyDeleteSuccess
} from '~/utils/bootstrap-notify'

const defaultForm = {
  image: '',
  point_color: '#4A50F1',
  points: []
}

export default {
  name: 'ImagePoints',
  components: {
    BSingleImageUploadWithValidation,
    'chrome-picker': Chrome,
    ValidationObserver
  },
  filters: {
    detailPoint(value) {
      if (!value) return ''
      return (
        value.word.name +
        ' (' +
        Math.round(value.offsetX) +
        ' , ' +
        Math.round(value.offsetY) +
        ')'
      )
    }
  },
  props: {
    typeId: {
      type: String,
      default: ''
    }
    // listPoint: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      innerValue: null,
      isEditPosition: false,
      isPickColor: false,
      isAdd: false,
      isEdit: false,
      listPoint: []
    }
  },
  computed: {
    ...mapState({
      currentPoint: (state) => state.point.currentPoint,
      currentIndexPoint: (state) => state.indexPoint.currentIndexPoint
    }),
    colorPoint() {
      if (this.form.point_color.hex) {
        return this.form.point_color.hex
      } else {
        return this.form.point_color
      }
    }
  },
  watch: {
    currentPoint(val) {
      if (this.isAdd === true) {
        this.listPoint.push(val)
        this.isAdd = false
      }
      if (this.currentIndexPoint !== null && this.isEditPosition) {
        this.listPoint[this.currentIndexPoint] = val
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentPoint: 'point/setCurrentPoint',
      setCurrentIndexPoint: 'indexPoint/setCurrentIndexPoint',
      setPositionPoint: 'point/setPositionPoint',
      setCurrentImage: 'image/setCurrentImage',
      setCurrentIndexImage: 'indexImage/setCurrentIndexImage'
    }),
    show(item = null) {
      this.listPoint = []
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        if (this.form.points) {
          this.listPoint = this.form.points
        }
      }
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    pickColor() {
      this.isPickColor = !this.isPickColor
    },
    selectPoint(item, i, event) {
      if (!event.target.className.includes('action')) {
        if (this.currentIndexPoint !== i) {
          this.isEditPosition = true
          this.setCurrentIndexPoint(i)
          this.setCurrentPoint(item)
        } else {
          this.setCurrentIndexPoint(null)
          this.setCurrentPoint({})
          this.isEditPosition = false
        }
      }
    },
    editPosition(item, i, event) {
      this.isEditPosition = true
      this.setCurrentIndexPoint(i)
      this.setCurrentPoint(item)
    },
    editPoint(item, i) {
      this.setCurrentIndexPoint(i)
      this.$emit('showModalPoint', item)
    },
    addPoint() {
      this.isAdd = true
      this.setCurrentIndexPoint(null)
      this.$emit('showModalPoint')
    },
    removePoint(index) {
      this.setCurrentIndexPoint(index)
      this.$bvModal
        .msgBoxConfirm('Bạn chắc chắn muốn xóa điểm này này?', {
          title: this.$t('alert.notice'),
          okVariant: 'danger',
          okTitle: this.$t('button.ok'),
          cancelTitle: this.$t('button.cancel')
        })
        .then((value) => {
          if (value) {
            this.listPoint.splice(index, 1)
            notifyDeleteSuccess('điểm')
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    },
    hanldeClickPoint(event) {
      const x = (event.offsetX / this.$refs.image.offsetWidth) * 100
      const y = (event.offsetY / this.$refs.image.offsetHeight) * 100
      if (this.isEditPosition) {
        this.setPositionPoint({ x, y })
      }
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
    addItem() {
      try {
        notifyAddSuccess('Câu hỏi')
        this.$refs.modal.hide()
        this.form.points = this.listPoint
        const image = Object.freeze(this.form)
        this.setCurrentImage(image)
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
    updateItem() {
      try {
        notifyUpdateSuccess('Câu hỏi')
        this.$refs.modal.hide()
        this.form.points = this.listPoint
        const image = Object.freeze(this.form)
        this.setCurrentImage(image)
      } catch (e) {
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
