<template>
  <div>
    <b-modal
      ref="modal"
      :cancel-title="$t('button.cancel')"
      :no-enforce-focus="true"
      @ok="handleModalOk"
      @hidden="handleModalHide"
      :title-html="
        `Đánh giá Activity <span class='text-danger'>${innerItem.name}</span>`
      "
      ok-title="Đánh giá"
      size="xl"
    >
      <validation-observer ref="observer" class="kt-form">
        <b-form-group
          v-for="criterionGroup in innerCriterionGroups"
          :key="criterionGroup._id"
          :label="criterionGroup.name"
          label-class="font-weight-bold label-title"
          class="mb-0"
        >
          <div
            v-for="(criterion, criterionKey) in criterionGroup.criterions"
            :key="criterion._id"
          >
            <b-radio-with-validation
              :options="options"
              v-model="criterion.score"
              @input="refreshData"
              :error="vForm.errors.get(`score.${criterion._id}`)"
              :required="!criterion.fixed"
              :name="`score.${criterion._id}`"
              :disabled="criterion.fixed"
              class="theme-custom-radio"
              value-field="type"
              text-field="name"
              size="lg"
              rules="required"
              label-cols-sm="8"
              label-cols-lg="10"
              label-class="pt-0"
              form-class="mb-3"
            >
              <template v-slot:label>
                <span>
                  {{ criterionKey + 1 + '. ' + criterion.name }}
                </span>
                <b-badge v-if="criterion.fixed" variant="success">
                  <i class="la la-check"></i> Đã fix
                </b-badge>
              </template>
            </b-radio-with-validation>
            <b-row v-if="criterion.score === 0">
              <b-col>
                <b-text-area-with-validation
                  v-model="criterion.text"
                  :disabled="criterion.fixed"
                  label="Mô tả issue"
                  placeholder="Mô tả issue"
                  name="text"
                />
              </b-col>
              <b-col>
                <b-form-group label="Ảnh mô tả" class="list-image-group">
                  <div
                    v-if="!criterion.fixed"
                    class="image-uploader image-uploader-sm"
                  >
                    <div
                      @click="showMedia(criterion)"
                      class="el-upload el-upload--picture-card"
                    >
                      <i class="el-icon-plus"></i>
                    </div>
                  </div>
                  <ul class="el-upload-list el-upload-list--picture-card">
                    <li
                      v-for="image in criterion.images"
                      class="el-upload-list__item"
                    >
                      <div class="item-el-upload">
                        <img
                          :src="image"
                          class="el-upload-list__item-thumbnail"
                        />
                        <span class="el-upload-list__item-actions">
                          <span
                            @click="previewMedia(image)"
                            class="el-upload-list__item-preview"
                            ><i class="el-icon-zoom-in"></i
                          ></span>
                          <span
                            v-if="!criterion.fixed"
                            @click="removeMedia(image, criterion)"
                            class="el-upload-list__item-delete"
                            ><i class="el-icon-delete"></i></span
                        ></span>
                      </div>
                    </li>
                  </ul>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
        </b-form-group>
      </validation-observer>
    </b-modal>
    <review-activity-media-modal ref="mediaModal" @ok="setSelectedImages">
    </review-activity-media-modal>
    <b-modal v-model="previewModal" hide-header hide-footer size="lg"
      ><img :src="previewImageUrl" :alt="previewImageUrl" width="100%"
    /></b-modal>
  </div>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import ReviewActivityMediaModal from './partial/ReviewActivityMediaModal'

import { notifyAddSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import BRadioWithValidation from '~/components/base/input/BRadioWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

export default {
  name: 'ReviewActivityModal',
  components: {
    ValidationObserver,
    BRadioWithValidation,
    BTextAreaWithValidation,
    ReviewActivityMediaModal
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    },
    criterionGroups: {
      type: Array,
      required: true
    },
    activityType: {
      type: String,
      default: 'common'
    }
  },
  data() {
    return {
      innerCriterionGroups: [],
      innerItem: {},
      vForm: new Form(),
      options: [
        { type: 1, name: 'Đúng' },
        { type: 0, name: 'Sai' }
      ],
      currentCriterion: {},
      previewModal: false,
      previewImageUrl: ''
    }
  },
  created() {
    this.innerCriterionGroups = this.criterionGroups.map((v) => cloneDeep(v))
  },
  methods: {
    show(item = null) {
      this.innerItem = cloneDeep(item)
      if (this.innerItem.criterions) {
        const criterionItems = this.innerItem.criterions
        this.innerCriterionGroups.forEach((innerCriterionGroup) => {
          innerCriterionGroup.criterions.forEach((innerCriterion) => {
            const criterionItem = criterionItems.find(
              (val) => val._id === innerCriterion._id
            )
            if (criterionItem) {
              innerCriterion = Object.assign(innerCriterion, criterionItem)
            }
          })
        })
        this.refreshData()
      }

      console.log(this.innerItem)

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },

    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.reviewActivity()
      }
    },
    handleModalHide(bvModalEvt) {
      this.innerCriterionGroups = this.criterionGroups.map((v) => cloneDeep(v))
      this.innerItem = {}
      this.vForm = new Form()
    },
    async reviewActivity() {
      try {
        const criterions = []
        this.innerCriterionGroups.forEach((innerCriterionGroup) => {
          innerCriterionGroup.criterions.forEach((innerCriterion) => {
            criterions.push(innerCriterion)
          })
        })

        const form = { criterions }
        let urlPath = ''
        if (this.innerItem.reviewer_activity_criterion_id) {
          form._id = this.innerItem.reviewer_activity_criterion_id
          urlPath = '/review-activity/edit'
        } else {
          form.activity_id = this.innerItem._id
          urlPath = '/review-activity/add'
        }
        form.activity_type = this.activityType
        this.vForm = new Form(form)
        await this.vForm.post(this.$axios.defaults.baseURL + urlPath)

        notifyAddSuccess('Đánh giá Activity')
        this.$refs.modal.hide()
        this.onActionSuccess()
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
    setSelectedImages(images) {
      this.currentCriterion.images = images
      this.refreshData()
    },
    showMedia(item) {
      this.currentCriterion = item
      this.$refs.mediaModal.show(
        item.images,
        this.innerItem._id,
        this.activityType
      )
    },
    removeMedia(image, criterion) {
      criterion.images = criterion.images.filter((item) => item !== image)
      this.refreshData()
    },
    previewMedia(image) {
      this.previewImageUrl = image
      this.previewModal = true
    },
    refreshData() {
      this.innerCriterionGroups = [...this.innerCriterionGroups]
    }
  }
}
</script>
