<template>
  <div class="col-md-12">
    <the-portlet title="Biểu đồ quá trình xử lý dữ liệu">
      <client-only>
        <highcharts
          v-loading="loading"
          :options="chartOptions"
          style="height: 250px"
        ></highcharts>
      </client-only>
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import { HTTP_CODE_200 } from '~/constants/code'
export default {
  name: 'TaskStatisticChart',
  components: { ThePortlet },
  props: {
    filterParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chartOptions: {
        title: {
          text: ''
        },
        tooltip: {
          formatter() {
            return 'Số lượng là:' + '<b>' + this.y + '</b>'
          }
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: 'Số lượng'
          }
        },
        series: []
      },
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
          'statistic/statistic-task-process',
          this.filterParams
        )

        if (response.status === HTTP_CODE_200) {
          this.chartOptions.series = {
            color: '#5867dd',
            data: response.data.data.map((e) => {
              return e.count
            })
          }
          this.chartOptions.xAxis.categories = response.data.data.map((e) => {
            return e.date
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
