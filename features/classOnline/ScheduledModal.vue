<template>
  <b-modal
    id="modal-scheduled"
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    ok-title="Cập nhật"
    title="Lịch học"
    size="lg"
  >
    <div class="scheduled">
      <table>
        <tr>
          <th>#</th>
          <th>Bài học</th>
          <th>Thứ tự</th>
          <th>Lịch học</th>
          <th>Tình trạng</th>
        </tr>
        <tr v-for="(item, i) in listScheduled" :key="item._id">
          <td>{{ i + 1 }}</td>
          <td>{{ item.session.name }}</td>
          <td>{{ item.session.order }}</td>
          <td>
            <div
              v-if="!checkExistById(listEditDateTime, item._id)"
              @click="selectChangeDateTime(item)"
            >
              <a href="#">{{ item.start_time | formatDateTime }} </a>
              <a href="#"><i class="fa fa-pencil-square-o"/></a>
            </div>
            <div v-else class="edit-date-time">
              <el-date-picker
                v-model="item.start_time"
                :picker-options="pickerOptions"
                type="datetime"
                placeholder="Nhập lịch học"
                format="dd/MM/yyyy HH:mm"
              >
              </el-date-picker>
              <a @click="changeDateTime(item._id)" href="#">
                <i class="fa fa-check"></i>
              </a>
              <a @click="closeChangeDateTime(item._id)" href="#">
                <i class="fa fa-times"></i>
              </a>
            </div>
            <span class="invalid-scheduled">
              {{ item.error }}
            </span>
          </td>
          <td>{{ item.status }}</td>
        </tr>
      </table>
    </div>
  </b-modal>
</template>

<script>
import Form from 'vform'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'
import {
  notifyDanger,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import { getIndexInArrayById } from '~/utils/arrayList'
import { valideChangeDateTime } from '~/utils/scheduled'
// import BDateTimeWithValidation from '~/components/base/input/BDateTimeWithValidation'
export default {
  name: 'ScheduledModal',
  components: {},
  filters: {
    formatDateTime(value) {
      if (!value) return ''
      value = value.toString()
      return moment(value).format('DD/MM/YYYY HH:mm')
    }
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return (
            moment(time).valueOf() <
            moment()
              .subtract(1, 'days')
              .valueOf()
          )
        }
      },
      listEditDateTime: [],
      isEdit: false,
      isOpen: false,
      vForm: new Form(),
      listScheduled: [],
      classId: ''
    }
  },
  computed: {
    actions() {
      return [
        {
          type: 'click',
          name: 'openPickerDateTime',
          action: this.openPickerDateTime
        }
      ]
    },
    postData() {
      return { class_id: this.classId }
    }
  },
  methods: {
    async loadScheduled() {
      try {
        const { data } = await this.$axios.post(
          '/online-class-scheduled/list-for-datatable',
          this.postData
        )
        if (!data.data) {
          notifyDanger('scheduled not found')
        }
        this.listScheduled = data.data.sort(function(a, b) {
          return a.session.order - b.session.order
        })
      } catch (e) {
        notifyDanger('scheduled error')
      }
    },
    async show(item = null) {
      if (item) {
        this.classId = item._id
        this.isEdit = true
        this.loadScheduled()
      }
      await this.$nextTick(async () => {
        await this.$refs.modal.show()
      })
    },
    async handleModalOk() {
      if (this.isEdit) {
        await this.updateItem()
      }
    },
    checkExistById(array, _id) {
      return array.some(function(el) {
        return el._id === _id
      })
    },
    selectChangeDateTime(item) {
      if (!this.listEditDateTime.includes(item)) {
        this.listEditDateTime.push(item)
      }
      this.listEditDateTime = cloneDeep(this.listEditDateTime)
    },
    closeChangeDateTime(_id) {
      const indexScheduled = getIndexInArrayById(this.listScheduled, _id)
      const indexEditDateTime = getIndexInArrayById(this.listEditDateTime, _id)
      // eslint-disable-next-line standard/computed-property-even-spacing
      this.listScheduled[indexScheduled] = this.listEditDateTime[
        indexEditDateTime
      ]
      this.listEditDateTime.splice(indexEditDateTime, 1)
      this.listScheduled[indexScheduled].error = ''
    },
    async changeDateTime(_id) {
      const indexScheduled = getIndexInArrayById(this.listScheduled, _id)
      const indexEditDateTime = getIndexInArrayById(this.listEditDateTime, _id)
      const mess = await valideChangeDateTime(
        this.listScheduled,
        indexScheduled
      )
      if (mess !== '') {
        // eslint-disable-next-line standard/computed-property-even-spacing
        this.listScheduled[indexScheduled] = this.listEditDateTime[
          indexEditDateTime
        ]
        this.listScheduled[indexScheduled].error = mess
        this.listScheduled = [...this.listScheduled]
      } else {
        this.listEditDateTime.splice(indexEditDateTime, 1)
        this.listScheduled[indexScheduled].error = ''
      }
    },
    handleModalHide() {
      this.isEdit = false
      this.listEditDateTime = []
    },
    reloadTable() {
      this.$refs.table.reload()
    },
    async updateItem() {
      try {
        const arrayScheduled = []
        this.listScheduled.forEach((element) => {
          if (element.start_time) {
            const data = {
              _id: element._id,
              start_time: moment(element.start_time).valueOf()
            }
            arrayScheduled.push(data)
          }
        })
        const requestData = {
          schedules: arrayScheduled
        }
        await this.$axios.post(
          '/online-class-scheduled/update-start-times',
          requestData
        )
        notifyUpdateSuccess('Lịch học')
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
    }
  }
}
</script>
