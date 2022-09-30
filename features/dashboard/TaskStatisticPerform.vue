<template>
  <div class="col-md-12">
    <the-portlet title="Bảng thống kê xử lý dữ liệu">
      <el-table
        v-loading="loading"
        :data="tableData"
        max-height="280px"
        style="width: 100%"
      >
        <el-table-column prop="date" label="Thời gian" width="180" />
        <el-table-column
          prop="count"
          label="Số task"
          width="180"
          align="right"
        />
        <el-table-column
          prop="label_unique_quantity"
          label="Số từ duy nhất"
          align="right"
        />
        <el-table-column
          prop="label_quantity"
          label="Tổng số từ"
          align="right"
        />
        <el-table-column
          prop="time_to_complete"
          label="Thời gian thực hiện"
          align="right"
        />
      </el-table>
    </the-portlet>
  </div>
</template>

<script>
import moment from 'moment'
import numeral from 'numeral'
import ThePortlet from '~/components/base/ThePortlet'
import { HTTP_CODE_200 } from '~/constants/code'
export default {
  name: 'TaskStatisticPerform',
  components: { ThePortlet },
  props: {
    filterParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  watch: {
    filterParams: {
      handler(val) {
        this.loadData()
      },
      deep: true
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const response = await this.$axios.post(
          'statistic/statistic-task-perform',
          this.filterParams
        )

        if (response.status === HTTP_CODE_200) {
          const data = response.data.data
          this.tableData = data.map((e) => {
            e.time_to_complete = moment
              .utc(e.time_to_complete * 1000)
              .format('HH:mm:ss')
            e.count = numeral(e.count).format('0,0.[00000]')
            e.label_quantity = numeral(e.label_quantity).format('0,0.[00000]')
            e.label_unique_quantity = numeral(e.label_unique_quantity).format(
              '0,0.[00000]'
            )
            return e
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    }
  }
}
</script>
