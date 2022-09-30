<template>
  <the-portlet title="Resources">
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
      url="/resource/listing"
      order-type="desc"
    />

    <resource-modal ref="modal" :on-action-success="updateItemSuccess" />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import ResourceModal from '~/features/resource/ResourceModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { RESOURCE_VIEW } from '~/constants/permissions'

export default {
  name: 'Permission',
  permission: RESOURCE_VIEW,
  components: { ResourceModal, DataTable, ThePortlet },
  head() {
    return {
      title: 'Resource Management'
    }
  },
  meta: {
    pageTitle: 'Resource Management'
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: 'Name'
        },
        {
          data: 'link',
          title: 'Link',
          render(data) {
            return `<a href=${data} target="_blank">${data}</a>`
          }
        },
        {
          data: 'username',
          title: 'Username'
        },
        {
          data: 'password',
          title: 'Password'
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
          this.$t('resource.delete_confirm', [
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
            await this.$axios.delete('/resource/' + rowData._id)
            notifyDeleteSuccess('resource')
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
