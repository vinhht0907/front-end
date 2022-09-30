<template>
  <the-portlet title="Keywords">
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
      url="/keyword/listing"
      order-type="desc"
    />

    <keywords-modal ref="modal" :on-action-success="updateItemSuccess" />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import KeywordsModal from '~/features/keyword/KeywordsModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { RESOURCE_VIEW } from '~/constants/permissions'

export default {
  name: 'Permission',
  permission: RESOURCE_VIEW,
  components: { KeywordsModal, DataTable, ThePortlet },
  head() {
    return {
      title: 'Keywords Management'
    }
  },
  meta: {
    pageTitle: 'Keywords Management'
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: 'Name'
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
          this.$t('permission.delete_confirm', [
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
            await this.$axios.delete('/keyword/' + rowData._id)
            notifyDeleteSuccess('keyword')
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
