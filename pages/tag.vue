<template>
  <div>
    <the-portlet title="Quản lý Tag">
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
          url="/tag/listing"
          order-type="desc"
        />
      </div>

      <tag-modal ref="modal" :on-action-success="updateItemSuccess" />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import TagModal from '~/features/Tag/TagModal'
import { TAG_VIEW } from '~/constants/permissions'

export default {
  name: 'Tag',
  components: { TagModal, DataTable, ThePortlet },
  permission: TAG_VIEW,
  head() {
    return {
      title: 'Quản lý Tag'
    }
  },
  meta: {
    pageTitle: 'Quản lý Tag'
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: 'Tên tag'
        },
        {
          data: 'slug',
          title: 'Đường dẫn'
        },
        {
          data: 'status',
          title: 'Trạng thái',
          render(data) {
            if (data) {
              return `<div class="text-success">Kích hoạt</div>`
            } else {
              return `<div class="text-danger"> Vô hiệu</div>`
            }
          }
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
          'Bạn có chắc chắn muốn xóa tag ' + htmlEscapeEntities(rowData.name),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.delete('/tag/' + rowData._id)
            notifyDeleteSuccess('tag')
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
