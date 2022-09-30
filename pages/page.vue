<template>
  <div>
    <the-portlet title="Quản lý page">
      <template v-slot:tool>
        <button @click="showModal" type="button" class="btn btn-primary">
          <i class="la la-plus"></i> {{ $t('button.add') }}
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
          class=""
          url="/page/listing"
          order-type="desc"
        />
      </div>

      <page-modal ref="modal" :on-action-success="updateItemSuccess" />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import PageModal from '~/features/page/PageModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { PAGE_VIEW } from '~/constants/permissions'

export default {
  name: 'Page',
  permission: PAGE_VIEW,
  components: { PageModal, DataTable, ThePortlet },
  head() {
    return {
      title: 'Quản lý page'
    }
  },
  meta: {
    pageTitle: 'Quản lý page'
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
          data: 'seo',
          title: 'SEO - từ khóa'
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
          'Bạn có chắc chắn muốn xóa page ' + htmlEscapeEntities(rowData.slug),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.delete('/page/' + rowData._id)
            notifyDeleteSuccess('page')
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
