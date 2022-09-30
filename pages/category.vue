<template>
  <div>
    <the-portlet title="Quản lý danh mục tác phẩm">
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
          url="/category/listing"
          order-type="desc"
        />
      </div>

      <category-modal ref="modal" :on-action-success="updateItemSuccess" />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import CategoryModal from '~/features/Categories/CategoryModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { CATEGORY_VIEW } from '~/constants/permissions'

export default {
  name: 'Category',
  auth: false,
  permission: CATEGORY_VIEW,
  components: { CategoryModal, DataTable, ThePortlet },
  head() {
    return {
      title: 'Quản lý danh mục'
    }
  },
  meta: {
    pageTitle: 'Quản lý danh mục tác phẩm'
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: 'Tên danh mục'
        },
        {
          data: 'slug',
          title: 'Đường dẫn'
        },
        {
          data: 'parent_type',
          title: 'Danh mục',
          render(data) {
            if (data === 'literature') {
              return 'Văn'
            } else {
              return 'Thơ'
            }
          }
        },
        {
          data: 'seo_keywords',
          title: 'SEO - từ khóa'
        },
        {
          data: 'order',
          title: 'Thứ tự sắp xếp'
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
          'Bạn có chắc chắn muốn xóa danh mục tác phẩm ' +
            htmlEscapeEntities(rowData.name),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.delete('/category/' + rowData._id)
            notifyDeleteSuccess('danh mục tác phẩm')
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
