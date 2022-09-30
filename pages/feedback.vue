<template>
  <div>
    <the-portlet title="Quản lý Góp ý">
      <div class="tab-content">
        <data-table
          ref="table"
          :columns="columns"
          :fixed-columns-left="2"
          :order-column-index="5"
          :server-side="true"
          :actions="actions"
          class=""
          url="/feedback/listing"
          order-type="desc"
        />
      </div>

      <feedback-modal ref="modal" :on-action-success="updateItemSuccess" />
    </the-portlet>
  </div>
</template>

<script>
import truncate from 'lodash/truncate'
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction } from '~/utils/tableHelper'
import { FEEDBACK_VIEW } from '~/constants/permissions'
import FeedbackModal from '~/features/feedback/FeedbackModal'
import { formatDateTime } from '~/utils/formatTime'

export default {
  name: 'Feedback',
  permission: FEEDBACK_VIEW,
  components: { FeedbackModal, DataTable, ThePortlet },
  head() {
    return {
      title: 'Quản lý góp ý'
    }
  },
  meta: {
    pageTitle: 'Quản lý góp ý'
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: 'Người đóng góp'
        },
        {
          data: 'email',
          title: 'Email'
        },
        {
          data: 'content',
          title: 'Nội dung',
          render(data) {
            if (data) {
              return truncate(data, {
                length: 60,
                separator: ' '
              })
            }
            return ''
          }
        },
        {
          data: 'status',
          title: 'Trạng thái',
          render(data) {
            if (data === 'read') {
              return `<div class="text-success">Đã đọc</div>`
            } else {
              return `<div class="text-warning">Chưa đọc</div>`
            }
          }
        },
        {
          data: 'created_at',
          title: 'Thời gian gửi',
          render(data) {
            return formatDateTime(data)
          }
        },
        {
          data: null,
          title: this.$t('datatable.action_col'),
          responsivePriority: 1,
          orderable: false,
          className: 'text-center tb-actions',
          render() {
            return generateTableAction(
              'edit',
              'showDetail',
              'primary',
              'la-edit',
              'Xem chi tiết'
            )
          }
        }
      ]
    }
  },
  computed: {
    actions() {
      return [
        {
          type: 'click',
          name: 'showDetail',
          action: this.showDetail
        }
      ]
    }
  },
  methods: {
    showDetail(table, rowData) {
      this.$refs.modal.show(rowData)
    },
    showModal() {
      this.$refs.modal.show()
    },
    updateItemSuccess() {
      this.$refs.table.reload()
    }
  }
}
</script>
