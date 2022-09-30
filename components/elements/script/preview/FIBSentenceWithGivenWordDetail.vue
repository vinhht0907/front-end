<template>
  <div style="width: 380px;">
    <the-portlet>
      <b-card no-body class="card-choice">
        <b-card-body>
          <h5
            class="kt-font-primary text-uppercase font-weight-bold teacher-name kt--"
          >
            Mike
          </h5>
          <b-card-img
            :src="getImage"
            top
            class="img-fluid"
            style="margin-bottom: 0px"
          ></b-card-img>

          <div class="f-i-b-sentence-with-given-word-wrap-content">
            <b-card-text
              class="card-title lead font-weight-bold text-left ml-2"
            >
              <h4>{{ form.mainWord ? form.mainWord : 'Điền từ thích hợp' }}</h4>
            </b-card-text>
            <b-card-text class="lead text-left ml-2">
              {{ form.question ? form.question : 'Câu hỏi...' }}
            </b-card-text>
          </div>
        </b-card-body>
        <slot :options="form.options" name="action"> </slot>
      </b-card>
    </the-portlet>
  </div>
</template>

<style scoped>
.f-i-b-sentence-with-given-word-wrap-content {
  background-color: white;
  z-index: 1000;
  padding-bottom: 24px;
  margin-bottom: 20px;
  padding-top: 5px;
}
</style>

<script>
import ThePortlet from '~/components/base/ThePortlet'

export default {
  name: 'FIBSentenceWithGiveWordDetail',
  components: { ThePortlet },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {}
  },
  computed: {
    getImage() {
      if (this.form.image) {
        return this.form.image
      } else {
        return ''
      }
    }
  }
}
</script>
