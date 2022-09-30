<template>
  <div style="width: 100%;">
    <b-card no-body class="card-choice">
      <b-card-body>
        <h5
          class="kt-font-primary text-uppercase font-weight-bold teacher-name"
        >
          Mike
        </h5>
        <el-carousel :autoplay="false" :loop="false" type="card" height="200px">
          <el-carousel-item v-for="(item, index) in form.items" :key="item.key">
            <div class="fib-multipart-detail-question-wrap">
              <b-card-title class="card-title lead font-weight-bold">
                Câu hỏi {{ index + 1 }}:
              </b-card-title>
              <b-card-text class="lead fib-multipart-detail-question">
                {{
                  item.question ? question(item.question) : 'Nội dung ở đây...'
                }}
              </b-card-text>

              <b-form-group
                v-if="item && item.answers && item.answers.length > 0"
              >
                <b-form-radio
                  v-if="answer.text != ''"
                  v-for="(answer, i) in item.answers"
                  :key="i"
                  v-model="item.answerSelect"
                  name="some-radios"
                  value="A"
                  >{{ answer.text }}</b-form-radio
                >
              </b-form-group>
            </div>
          </el-carousel-item>
        </el-carousel>
      </b-card-body>

      <slot :options="form.options" name="action"> </slot>
    </b-card>
  </div>
</template>

<style scoped>
.fib-multipart-detail-question-wrap {
  padding-top: 10px;
  padding-left: 5px;
  padding-bottom: 10px;
  overflow: hidden;
  height: 160px;
}
.fib-multipart-detail-question {
  margin-top: 20px;
}
</style>

<script>
import truncate from 'lodash/truncate'
export default {
  name: 'FIBMultipartDetail',
  props: {
    form: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      audioPercent: 0
    }
  },
  methods: {
    question(question) {
      const q = truncate(question, {
        length: 120,
        separator: ' '
      })
      const q1 = q.replace(/\[\]/g, '.....')
      return q1
    }
  }
}
</script>
