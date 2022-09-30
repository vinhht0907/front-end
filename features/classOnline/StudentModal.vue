<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    ok-title="Cập nhật"
    title="Danh sách học sinh"
    size="lg"
  >
    <div class="table-student">
      <data-table
        ref="tableStudent"
        :columns="columns"
        :selectable="true"
        :post-data="postDataStudent"
        :rows-selected-data-prop="rowsSelectedData"
        :rows-selected-prop="rowsSelectedProp"
        :orderColumnIndex="2"
        url="/user/list-for-datatable"
        order-type="asc"
      />
    </div>
    <div class="div_student_selected">
      <div class="row title_search">
        <div class="col-md-12 col-lg-6">
          <p class="title">Danh sách học sinh của lớp</p>
        </div>
        <div class="col-md-12 col-lg-6">
          <input
            v-model="search"
            type="text"
            class="search"
            placeholder="Search ..."
          />
        </div>
      </div>
      <div class="row">
        <div
          v-for="(student, i) in filteredList"
          :key="i"
          class="col-md-6 col-lg-4 item"
        >
          {{ i + 1 + ', ' }}{{ student | showInfo }}
          <div class="action">
            <i
              @click="removeStudent(i)"
              class="fa fa-trash-o"
              style="color:#F14138"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import Form from 'vform'
import DataTable from '~/components/base/DataTable'
import { formatNoAccent } from '~/utils/formatString'
import {
  notifyTryAgain,
  notifyUpdateSuccess,
  notifyDeleteSuccess
} from '~/utils/bootstrap-notify'

export default {
  name: 'StudentModal',
  components: {
    DataTable
  },
  filters: {
    showInfo(value) {
      if (!value) return ''
      if (value.full_name) {
        return value.full_name
      } else {
        return value.email
      }
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
      isEdit: false,
      vForm: new Form(),
      schoolId: '',
      rowsSelectedData: [],
      rowsSelectedProp: [],
      studentIds: [],
      classId: null,
      isShowStudents: false,
      search: '',
      columns: [
        {
          data: 'full_name',
          title: 'Tên',
          render(data, type, row) {
            if (data) {
              return data
            } else {
              return row.email
            }
          }
        },
        {
          data: 'email',
          title: 'Email'
        }
      ]
    }
  },
  computed: {
    postDataStudent() {
      return { role_name: 'student', school_id: this.schoolId }
    },
    filteredList() {
      if (this.rowsSelectedData) {
        return this.rowsSelectedData.filter((item) => {
          if (item.full_name) {
            return formatNoAccent(item.full_name)
              .toLowerCase()
              .includes(formatNoAccent(this.search).toLowerCase())
          } else {
            return item.email.toLowerCase().includes(this.search.toLowerCase())
          }
        })
      } else {
        return []
      }
    }
  },
  watch: {
    rowsSelectedData(val) {
      if (val) {
        const tmp = []
        val.forEach((element) => {
          tmp.push(element._id)
        })
        this.rowsSelectedProp = tmp
      }
    }
  },
  methods: {
    async show(item = null) {
      if (item) {
        this.schoolId = item.school._id
        this.classId = item._id
        this.rowsSelectedData = item.students
      }
      await this.$nextTick(async () => {
        await this.$refs.modal.show()
      })
    },
    showStudents() {
      this.isShowStudents = !this.isShowStudents
    },
    removeStudent(index) {
      this.$bvModal
        .msgBoxConfirm('Bạn chắc chắn muốn xoá học sinh này?', {
          title: this.$t('alert.notice'),
          okVariant: 'danger',
          okTitle: this.$t('button.ok'),
          cancelTitle: this.$t('button.cancel')
        })
        .then((value) => {
          if (value) {
            this.rowsSelectedData.splice(index, 1)
            notifyDeleteSuccess('học sinh')
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    },
    reloadTable() {
      this.$refs.tableStudent.reload()
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      await this.updateItem()
    },
    handleModalHide(bvModalEvt) {
      this.isEdit = false
      this.onActionSuccess()
    },
    async updateItem() {
      try {
        const studentIds = this.$refs.tableStudent.getSelectedRowsIds()
        const requestData = {
          _id: this.classId,
          studentIds
        }
        this.vForm = new Form(requestData)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/online-class/update-student'
        )
        this.rowsSelectedData = null
        notifyUpdateSuccess('Lớp học')
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
