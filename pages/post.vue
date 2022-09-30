<template>
  <div>
    <the-portlet title="" class="portlet-filter">
      <b-row>
        <b-col>
          <b-text-input-with-validation
            v-model="title"
            :required="false"
            :label="'Tên tác phẩm'"
            :placeholder="'Nhâp tên tác phẩm'"
            rules=""
            name="title"
        /></b-col>
        <b-col>
          <select2-with-validation
            :required="false"
            v-model="category_type"
            :options="parentTypeOptions"
            :allow-clear="true"
            text-field="text"
            id-field="id"
            placeholder="Chọn danh mục cha..."
            label="Danh mục cha"
            data-vv-as="Danh mục cha"
            rules=""
            name="parentTypeOptions"
          />
        </b-col>
        <b-col>
          <category-chosen
            key="filter-category"
            v-model="categories"
            :multiple="true"
            :parentType="category_type ? category_type.id : null"
            rules=""
            name="categories"
        /></b-col>
      </b-row>
      <b-row class="text-center portlet-filter__action">
        <b-col>
          <b-button @click="filterTable" variant="primary"
            ><i class="la la-search"></i> Tìm kiếm</b-button
          >
        </b-col>
      </b-row>
    </the-portlet>
    <the-portlet title="Quản lý tác phẩm">
      <div class="tab-content">
        <data-table
          ref="table"
          :searching="false"
          :columns="columns"
          :fixed-columns-left="2"
          :order-column-index="1"
          :post-data="postData"
          :server-side="true"
          :actions="actions"
          class=""
          url="/post/listing"
          order-type="desc"
        />
      </div>

      <post-modal ref="modal" :on-action-success="updateItemSuccess" />
      <note-modal ref="noteModal" :on-action-success="updateItemSuccess" />
    </the-portlet>
  </div>
</template>

<script>
import $ from 'jquery'
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import { notify, notifyTryAgain } from '~/utils/bootstrap-notify'
import { POST_VIEW } from '~/constants/permissions'
import PostModal from '~/features/post/PostModal'
import NoteModal from '~/features/post/NoteModal'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import CategoryChosen from '~/components/elements/category/CategoryChosen'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

export default {
  name: 'Post',
  permission: POST_VIEW,
  components: {
    PostModal,
    DataTable,
    ThePortlet,
    NoteModal,
    BTextInputWithValidation,
    CategoryChosen,
    Select2WithValidation
  },
  head() {
    return {
      title: 'Quản lý tác phẩm'
    }
  },
  meta: {
    pageTitle: 'Quản lý tác phẩm'
  },
  data() {
    return {
      title: null,
      description: null,
      category_type: null,
      categories: null,
      parentTypeOptions: [
        {
          id: 'literature',
          text: 'Văn'
        },
        {
          id: 'poem',
          text: 'Thơ'
        }
      ],
      postData: {
        title: null,
        description: null,
        category_type: null,
        categories: null
      }
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
          name: 'activeItem',
          action: this.activeItem
        },
        {
          type: 'click',
          name: 'inActiveItem',
          action: this.inActiveItem
        }
      ]
    },
    columns() {
      return [
        {
          data: 'title',
          title: 'Tên tác phẩm'
        },
        {
          data: 'category_type',
          title: 'Danh mục cha',
          render(data) {
            if (data === 'literature') {
              return 'Văn'
            } else {
              return 'Thơ'
            }
          }
        },
        {
          data: 'categories',
          orderable: false,
          title: 'Danh mục tác phẩm',
          render(data) {
            let text = ''
            if (data) {
              data.forEach((e, index) => {
                if (index === 0) {
                  text += htmlEscapeEntities(e.name)
                } else {
                  text += ', ' + htmlEscapeEntities(e.name)
                }
              })
            }
            return text
          }
        },
        {
          data: 'active_chapter_count',
          title: 'Số chương active'
        },
        {
          data: 'publish_status',
          title: 'Xuất bản',
          render(data, type, row) {
            const checked = data === 'published' ? 'checked' : ''

            return `<div class="custom-control custom-switch b-custom-control-lg">
                      <input type="checkbox" name="status" class="custom-control-input post-publish" ${checked} value="true" data-status="${data}" data-id="${row.id}" id="publish_${row._id}">
                      <label class="custom-control-label" for="publish_${row._id}"></label>
                    </div>`
          }
        },
        {
          data: 'status',
          title: 'Duyệt',
          render(data) {
            if (data) {
              return `<div class="text-success">Duyệt</div>`
            } else {
              return `<div class="text-danger">Không duyệt</div>`
            }
          }
        },
        {
          data: 'author',
          title: 'Tác giả',
          render(data) {
            if (data) {
              return data.full_name
            } else {
              return ''
            }
          }
        },
        {
          data: null,
          title: this.$t('datatable.action_col'),
          responsivePriority: 1,
          orderable: false,
          className: 'text-center tb-actions',
          render(data, type, row) {
            let html = generateTableAction('edit', 'showDetail')
            if (!row.status) {
              html += generateTableAction(
                'activeItem',
                'activeItem',
                'primary',
                'la-check',
                'Phê duyệt'
              )
            } else {
              html += generateTableAction(
                'inActiveItem',
                'inActiveItem',
                'danger',
                'la-close',
                'Không duyệt'
              )
            }
            return html
          }
        }
      ]
    }
  },
  mounted() {
    const $this = this

    $('body').off('change', '.post-publish')
    $('body').on('change', '.post-publish', function() {
      const id = $(this).data('id')
      const publishStatus =
        $(this).data('status') === 'published' ? 'unpublished' : 'published'

      $this.changePublishStatus(id, publishStatus)
    })
  },
  methods: {
    showDetail(table, rowData) {
      this.$refs.modal.show(rowData)
    },
    updateItemSuccess() {
      this.$refs.table.reload()
    },
    changePublishStatus(id, status) {
      this.$bvModal
        .msgBoxConfirm('Bạn có chắc chắn muốn đổi trạng thái xuất bản?', {
          title: this.$t('alert.notice'),
          okVariant: 'danger',
          okTitle: this.$t('button.ok'),
          cancelTitle: this.$t('button.cancel')
        })
        .then(async (value) => {
          if (value) {
            await this.$axios.post('/post/change-publish-status', {
              _id: id,
              publish_status: status
            })
            notify(
              'Thông báo',
              'Cập nhật thành công',
              'success',
              'icon la la-check'
            )

            this.$refs.table.reload()
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    },
    activeItem(table, rowData) {
      this.$bvModal
        .msgBoxConfirm(
          'Bạn có chắc chắn muốn phê duyệt tác phẩm "' +
            htmlEscapeEntities(rowData.title) +
            '"',
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.post('/post/change-status', {
              _id: rowData._id,
              status: true,
              note: ''
            })
            notify(
              'Thông báo',
              'Phê duyệt thành công',
              'success',
              'icon la la-check'
            )
            this.$refs.table.reload()
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    },
    inActiveItem(table, rowData) {
      this.$refs.noteModal.show(rowData)
    },
    filterTable() {
      this.$refs.table.setPage(0)
      this.postData = {
        title: this.title,
        description: this.description,
        category_type: this.category_type ? this.category_type.id : null,
        categories: this.categories
          ? this.categories.map((e) => {
              return e.id
            })
          : null
      }

      this.$nextTick(() => {
        this.reloadTable()
      })
    },
    reloadTable() {
      this.$refs.table.reload()
    }
  }
}
</script>
