<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    ok-title="Cập nhật"
    title="Học liệu"
    size="lg"
    ok-only
  >
    <the-portlet title="Danh sách học liệu">
      <template v-slot:tool>
        <button @click="showModal" type="button" class="btn btn-primary">
          <i class="la la-plus"></i> {{ $t('button.add') }}
        </button>
      </template>
      <div>
        <data-table
          ref="table"
          :columns="columns"
          :post-data="postData"
          :orderColumnIndex="2"
          :actions="actions"
          url="/courseware/list-for-datatable"
          order-type="asc"
        />
      </div>
    </the-portlet>
  </b-modal>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ThePortlet from '~/components/base/ThePortlet'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import DataTable from '~/components/base/DataTable'
import { generateTableAction } from '~/utils/tableHelper'

export default {
  name: 'ModalDetailCourseWare',
  components: { DataTable, ThePortlet },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: 'Tên học liệu'
        },
        {
          data: 'order',
          title: 'Thứ tự'
        },
        {
          data: null,
          title: this.$t('datatable.action_col'),
          responsivePriority: 1,
          orderable: false,
          className: 'text-center tb-actions',
          render() {
            return (
              generateTableAction('edit', 'showDetail') +
              generateTableAction('delete', 'deleteItem')
            )
          }
        }
      ],
      onlineSessionPart: null
    }
  },
  computed: {
    actions() {
      return [
        {
          type: 'click',
          name: 'showDetail',
          action: this.showDetail
        },
        {
          type: 'click',
          name: 'deleteItem',
          action: this.deleteItem
        }
      ]
    },
    postData() {
      return { online_session_part: this.onlineSessionPart }
    },
    ...mapState({
      currentReloadTable: (state) => state.reloadTable.currentReloadTable
    })
  },
  watch: {
    currentReloadTable(val) {
      if (val === 'table-courseware') {
        this.reloadTable()
        this.setCurrentReloadTable('')
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentReloadTable: 'reloadTable/setCurrentReloadTable'
    }),
    async show(item = null) {
      if (item) {
        this.onlineSessionPart = item._id
      }
      await this.$nextTick(async () => {
        await this.$refs.modal.show()
      })
    },
    showDetail(table, rowData) {
      this.$emit('showModalCourseWare', rowData)
    },
    showModal() {
      this.$emit('showModalCourseWare', this.onlineSessionPart)
    },
    reloadTable() {
      this.$refs.table.reload()
    },
    handleModalOk() {
      this.$refs.modal.hide()
      this.onActionSuccess()
    },
    deleteItem(table, rowData) {
      this.$bvModal
        .msgBoxConfirm('Bạn chắc chắn muốn xóa học liệu này?', {
          title: this.$t('alert.notice'),
          okVariant: 'danger',
          okTitle: this.$t('button.ok'),
          cancelTitle: this.$t('button.cancel')
        })
        .then(async (value) => {
          if (value) {
            await this.$axios.post('/courseware/delete', {
              _id: rowData._id
            })
            notifyDeleteSuccess('học liệu')

            this.$refs.table.reload()
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    }
  }
}
</script>
