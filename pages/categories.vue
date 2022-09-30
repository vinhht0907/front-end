<template>
  <the-portlet :title="$t('categories.list')">
    <template v-slot:tool>
      <button @click="showModal" type="button" class="btn btn-primary">
        <i class="la la-plus"></i> {{ $t('button.add') }}
      </button>
    </template>

    <data-table
      ref="table"
      :columns="columns"
      :order-column-index="1"
      :server-side="true"
      :actions="actions"
      url="/permission/listing"
      order-type="desc"
    />

    <categories-modal ref="modal" :on-action-success="updateItemSuccess" />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import CategoriesModal from '~/features/categoriesFeature/CategoriesModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
// import { PERMISSION_VIEW } from '~/constants/permissions'

export default {
  name: 'Permission',
  // permission: PERMISSION_VIEW,
  auth: false,
  components: { CategoriesModal, DataTable, ThePortlet },
  head() {
    return {
      title: this.$t('menu.categories_management')
    }
  },
  meta: {
    pageTitle: 'menu.categories_management'
    // categories: categories_MANAGEMENT
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: this.$t('categories.name')
        },
        {
          data: 'display_name',
          title: this.$t('categories.display_name')
        },
        {
          data: 'description',
          title: this.$t('categories.description')
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
          this.$t('categories.delete_confirm', [
            htmlEscapeEntities(rowData.name)
          ]),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.delete('/permission/' + rowData._id)
            notifyDeleteSuccess(this.$t('categories.permission'))
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
