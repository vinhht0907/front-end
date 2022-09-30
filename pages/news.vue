<template>
  <div>
    <the-portlet title="Quản lý tin tức">
      <template v-slot:tool>
        <button @click="showModal" type="button" class="btn btn-primary">
          <i class="la la-plus"></i> Thêm mới
        </button>
      </template>
      <div class="tab-content">
        <data-table
          ref="table"
          :columns="columns"
          :fixed-columns-left="2"
          :order-column-index="1"
          :server-side="true"
          :actions="actions"
          url="/news/listing"
          order-type="desc"
        />
      </div>

      <news-modal ref="modal" :on-action-success="updateItemSuccess" />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { NEWS_VIEW } from '~/constants/permissions'
import NewsModal from '~/features/news/NewsModal'

export default {
  name: 'News',
  permission: NEWS_VIEW,
  components: {
    NewsModal,
    DataTable,
    ThePortlet
  },
  head() {
    return {
      title: 'Quản lý tin tức'
    }
  },
  meta: {
    pageTitle: 'Quản lý tin tức'
  },
  data() {
    return {
      columns: [
        {
          data: 'title',
          title: 'Tiêu đề'
        },
        {
          data: 'slug',
          title: 'Đường dẫn'
        },
        {
          data: null,
          title: 'Hành động',
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
        },
        {
          type: 'click',
          name: 'deleteItem',
          action: this.deleteItem
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
    },
    deleteItem(table, rowData) {
      this.$bvModal
        .msgBoxConfirm(
          'Bạn có chắc chắn muốn xóa tin tức ' +
            htmlEscapeEntities(rowData.title),
          {
            title: 'Thông báo',
            okVariant: 'danger',
            okTitle: 'Đồng ý',
            cancelTitle: 'Hủy bỏ'
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.delete('/news/' + rowData._id)
            notifyDeleteSuccess('tin tức')
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
