<template>
  <div class="home row">
    <div class="col-12 text-center">IB Business Management Portal</div>
    <div class="col-4"></div>
    <div class="col-4">
      <b-text-input-with-validation
        v-model="form.keyword"
        @keydown.native="getTopicByKeyword"
        label=""
        placeholder="Enter the keyword"
        rules="max:255"
        rows="5"
        name="username"
      />
    </div>
    <div class="col-4"></div>
    <div v-show="keywords.length == 0" class="col-12 m-b-10">
      <div
        v-for="(item, index) in bookmarkSet"
        :key="index"
        class="d-flex flex-row w-75 bookmark-wrap m-auto"
      >
        <a
          :href="bookmark.link"
          v-for="bookmark in item"
          :key="bookmark.url"
          target="_blank"
        >
          <el-avatar
            :size="100"
            :src="bookmark.logo"
            shape="square"
          ></el-avatar>
        </a>
      </div>
    </div>
    <div class="col-12">
      <div v-show="keywords.length > 0" class="title-search">
        We have found
        {{ totalResult }}
        results for '{{ form.keyword }}'
      </div>
    </div>

    <div v-for="(keyword, index) in keywords" :key="index" class="keywords">
      <div v-for="topic in keyword.topics" :key="topic.name" class="topics">
        <div class="topics-link-resource">
          <a :href="topic.resources.link" target="_blank">
            {{ topic.resources.link }}
          </a>
        </div>
        <div class="topics-title">
          <a :href="topic.link" target="_blank">
            {{ topic.link }}
          </a>
        </div>
        <div class="topics-description">{{ topic.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import chunks from 'lodash/chunk'
import Form from 'vform'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultForm = {
  keyword: ''
}

export default {
  name: 'Index',
  components: {
    BTextInputWithValidation
  },
  head() {
    return {
      title: this.$t('menu.dashboard')
    }
  },
  meta: {
    pageTitle: 'menu.dashboard'
  },
  data() {
    return {
      image: null,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      bookmarkList: [],
      keywords: []
    }
  },
  computed: {
    bookmarkSet() {
      return chunks(this.bookmarkList, 4)
    },
    totalResult() {
      let total = 0
      this.keywords.forEach((e) => {
        if (e && e.topics) {
          total += e.topics.length
        }
      })
      return total
    }
  },
  mounted() {
    this.getAllResource()
    // this.getTopicByKeyword()
  },
  methods: {
    async getTopicByKeyword(event) {
      if (event && event.keyCode === 13) {
        const response = await this.$axios.post('/keyword/find-by-keyword', {
          search: this.form.keyword,
          page: 0
        })
        console.log('response.data.data.topics', response.data.data)
        if (response && response.data && response.data.data) {
          this.keywords = response.data.data
        }
      }
    },
    async getAllResource() {
      const response = await this.$axios.post('/resource/select-list', {
        search: '',
        page: 0
      })
      this.bookmarkList = response.data.data
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  .bookmark-wrap {
    justify-content: space-evenly;
  }
  .title-search {
    width: 60%;
    margin: 10px auto 10px;
  }
  .keywords {
    .topics {
      color: #202124;
      width: 60%;
      margin: 10px auto 10px;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.3;

      .topics-link-resource {
        a {
          color: #202124;
        }
        font-style: normal;
        font-size: 14px;
        line-height: 1.3;
        cursor: pointer;
      }
      .topics-title {
        a {
          color: #681da8;
        }
        display: inline-block;
        line-height: 1.3;
        margin-bottom: 3px;
        font-family: arial, sans-serif;
        font-size: 20px;
        font-weight: 400;
      }
      .topics-description {
      }
    }
  }
}
</style>
