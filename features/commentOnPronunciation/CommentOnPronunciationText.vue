<template>
  <div class="list-collapse">
    <b-form-group
      label="Danh sách câu nhận xét"
      class="mb-0"
      label-class="required"
    >
      <el-collapse v-model="activeNames">
        <draggable
          :list="innerValue"
          handle=".btn-collapse-draggable"
          animation="250"
        >
          <transition-group type="transition" name="list-answer">
            <el-collapse-item
              v-for="(item, index) in innerValue"
              :key="item.key"
              :name="item.key"
            >
              <template slot="title">
                <span>
                  {{
                    `Câu nhận xét ${index + 1} / ${innerValue.length} - ${
                      item.text
                    }` | truncate
                  }}</span
                >
                <span v-show="showAction" class="collapse-action">
                  <a
                    href="javascript:;"
                    class="btn-sm btn text-primary btn-bold btn-outline-hover-primary btn-collapse-draggable"
                    ><i class="fa fa-arrows"></i
                  ></a>
                  <a
                    href="javascript:;"
                    class="btn-sm btn text-danger btn-bold btn-outline-hover-danger"
                    ><i @click.self="removeItem(item)" class="la la-trash-o"></i
                  ></a>
                </span>
              </template>
              <comment-on-pronunciation-text-item
                v-if="activeNames.includes(item.key)"
                v-bind="$attrs"
                :emojis="emojis"
                v-model="innerValue[index]"
                class="list-item-script__item px-3"
              />
            </el-collapse-item>
          </transition-group>
        </draggable>
      </el-collapse>
    </b-form-group>

    <b-button @click="addItem" block variant="success" size="sm"
      ><i class="la la-plus"></i> Thêm câu nhận xét</b-button
    >
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import randomstring from 'randomstring'
import truncate from 'lodash/truncate'
import CommentOnPronunciationTextItem from './CommentOnPronunciationTextItem'

export default {
  name: 'CommentOnPronunciationList',
  components: {
    CommentOnPronunciationTextItem,
    draggable
  },
  filters: {
    truncate(value) {
      return truncate(value, {
        length: 120,
        separator: ' '
      })
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    emojis: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerValue: null,
      activeNames: []
    }
  },
  computed: {
    showAction() {
      return this.innerValue && this.innerValue.length > 1
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value(val) {
      this.init(val)
    }
  },
  created() {
    this.init(this.value)
  },
  methods: {
    init(val) {
      if (val && val.length > 0) {
        this.innerValue = val
      } else {
        this.innerValue = [this.generateDefault()]
      }
    },
    addItem() {
      const item = this.generateDefault()
      this.innerValue.push(item)
      this.activeNames.push(item.key)
    },
    removeItem(question) {
      const index = this.innerValue.findIndex(
        (item) => item.key === question.key
      )

      if (index !== -1) {
        this.innerValue.splice(index, 1)
      }
    },
    generateDefault() {
      return {
        key: randomstring.generate(),
        text: ''
      }
    }
  }
}
</script>
