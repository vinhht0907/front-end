<template>
  <div class="list-collapse test-part-collapse">
    <el-collapse v-model="activeNames">
      <draggable
        :list="innerValue"
        @update="oneUpdate"
        handle=".btn-collapse-draggable"
        animation="250"
      >
        <transition-group type="transition" name="list-answer">
          <el-collapse-item
            v-for="(item, index) in innerValue"
            :key="item._id"
            :name="item._id"
          >
            <template slot="title">
              <span>
                {{
                  `Part ${index + 1} / ${innerValue.length} : ${
                    item.name_display
                  }` | truncate
                }}</span
              >
              <span class="collapse-action">
                <a
                  href="javascript:;"
                  class="btn-sm btn text-primary btn-bold btn-outline-hover-primary btn-collapse-draggable"
                  ><i class="fa fa-arrows"></i
                ></a>
                <a
                  href="javascript:;"
                  class="btn-sm btn text-warning btn-bold btn-outline-hover-warning"
                  ><i @click.stop="showModal(item)" class="la la-edit"></i
                ></a>
                <a
                  href="javascript:;"
                  class="btn-sm btn text-danger btn-bold btn-outline-hover-danger"
                  ><i @click.stop="removeItem(item)" class="la la-trash-o"></i
                ></a>
              </span>
            </template>
            <test-question-list
              :value="innerValue[index].test_questions"
              :id="innerValue[index]._id"
              class="list-item-script__item px-3"
            />
          </el-collapse-item>
        </transition-group>
      </draggable>
    </el-collapse>
    <div class="collapse-add-action mt-2">
      <!-- <a
        href="javascript:;"
        class="btn btn-bold btn-sm btn-label-success mr-3"
        @click="showUpdateModal"
      >
        <i class="la la-plus"></i> Chọn part có sẵn
      </a> -->
      <a
        @click="showModal()"
        href="javascript:;"
        class="btn btn-bold btn-sm btn-label-brand"
      >
        <i class="la la-plus"></i> Thêm part mới
      </a>
    </div>

    <test-part-modal
      ref="modal"
      :section-id="id"
      :on-action-success="addItem"
    />
    <update-part-modal ref="updateModal" :on-action-success="updateModal" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import truncate from 'lodash/truncate'
import {
  notifyDeleteSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import TestPartModal from '~/features/testPart/TestPartModal'
import TestQuestionList from '~/features/test-detail/TestQuestionList'
import UpdatePartModal from '~/features/test-detail/partial/UpdatePartModal'

export default {
  name: 'TestPartList',
  components: {
    UpdatePartModal,
    TestQuestionList,
    TestPartModal,
    draggable
  },
  filters: {
    truncate(value) {
      return truncate(value, {
        length: 120,
        separator: ' '
      })
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerValue: null,
      activeNames: []
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
      this.init(val)
    }
  },
  created() {
    this.init(this.value)
  },
  methods: {
    init(val) {
      this.innerValue = val
    },
    addItem(value) {
      const index = this.innerValue.findIndex((item) => item._id === value._id)

      if (index !== -1) {
        this.$set(this.innerValue, index, value)
      } else {
        this.innerValue.push(value)
        this.activeNames.push(value._id)
      }
    },
    showModal(data = null) {
      this.$refs.modal.show(data)
    },
    showUpdateModal() {
      this.$refs.updateModal.show({
        _id: this.id,
        test_parts: this.innerValue
      })
    },
    updateModal(value) {
      this.innerValue = value.test_parts
    },
    removeItem(question) {
      this.$bvModal
        .msgBoxConfirm('Bạn chắc chắn muốn xóa part này khỏi section?', {
          title: this.$t('alert.notice'),
          okVariant: 'danger',
          okTitle: this.$t('button.ok'),
          cancelTitle: this.$t('button.cancel')
        })
        .then(async (value) => {
          if (value) {
            await this.$axios.post('/test-section/pull-part', {
              _id: this.id,
              part_id: question._id
            })
            const index = this.innerValue.findIndex(
              (item) => item._id === question._id
            )

            if (index !== -1) {
              this.innerValue.splice(index, 1)
            }
            notifyDeleteSuccess('Part')
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    },
    async oneUpdate() {
      try {
        await this.$axios.post('/test-section/update-parts', {
          _id: this.id,
          test_parts: this.innerValue.map((v) => v._id)
        })

        notifyUpdateSuccess('Thứ tự part')
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
