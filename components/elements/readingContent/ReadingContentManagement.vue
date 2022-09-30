<template>
  <div class="sentence-management">
    <div class="d-flex justify-content-between align-items-center">
      <label>Nội dung hội thoại</label>
      <el-switch
        v-model="showTranslation"
        active-text="Hiển thị bản dịch"
        inactive-text="Ẩn bản dịch"
      >
      </el-switch>
    </div>
    <div
      v-for="(sentence, index) in sentences"
      :key="sentence.id"
      class="sentence-item d-flex align-items-center"
    >
      <div class="message">
        <vue-editor
          v-model="sentence.content"
          :editor-toolbar="editorToolbar"
          placeholder="Nhập nội dung..."
          max-rows="5"
          rows="1"
          class="mb-2"
        ></vue-editor>
        <vue-editor
          v-model="sentence.translation"
          :editor-toolbar="editorToolbar"
          v-show="showTranslation"
          placeholder="Nhập bản dịch..."
          max-rows="5"
          rows="1"
        ></vue-editor>
        <b-text-input-with-validation
          v-if="hasScore"
          v-model="sentence.score"
          placeholder="Điểm thưởng"
          rules="numeric|max_value:9999"
          name="score"
          label-name="Trường này"
          class="mt-2 d-block"
        />
        <div class="row audio-sentence">
          <b-single-audio-upload-with-validation
            v-model="sentence.audio"
            label="File Audio"
            placeholder="File Audio"
            class="col-3"
          />
          <audio
            ref="audio"
            v-if="sentence.audio && sentence.audio != ''"
            controls
            class="audio-control audio-player col-9"
          >
            <source :src="sentence.audio" />
          </audio>
        </div>
      </div>
      <div class="d-flex flex-column">
        <a @click="addItem(index)" href="javascript:;" class="text-success add"
          >Thêm câu</a
        >
        <a
          @click="deleteItem(index)"
          href="javascript:;"
          class="text-danger delete"
          >Xóa</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import randomstring from 'randomstring'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BSingleAudioUploadWithValidation from '~/components/base/input/BSingleAudioUploadWithValidation'
const tokenizer = require('sbd')

const defaultSentence = {
  id: null,
  content: '',
  translation: '',
  score: 0,
  audio: null,
  isEndParagraph: false
}
export default {
  name: 'ReadingContentManagement',
  components: {
    BTextInputWithValidation,
    BSingleAudioUploadWithValidation
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    content: {
      type: String,
      default: null
    },
    hasScore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sentences: [],
      currentIndex: 0,
      showTranslation: true,
      editorToolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' }
        ],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }]
        /* ['link'] */
      ]
    }
  },
  watch: {
    sentences: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    this.initVal(this.value)
    if (!this.value) {
      if (this.content && this.content !== '') {
        this.changeContent()
      }
    }
  },
  methods: {
    initVal(val) {
      const clone = cloneDeep(defaultSentence)
      clone.id = randomstring.generate()

      if (val && val.length > 0) {
        this.sentences = val
      } else {
        this.sentences = [clone]
      }
    },
    changeContent() {
      let value = this.content
      value = value.replaceAll(/<br>/gi, '\n')

      const paragraphs = value.split('</p>')

      paragraphs.forEach((e, index) => {
        paragraphs[index] = e + '</p>'
      })
      paragraphs.pop()

      const arr = []
      paragraphs.forEach((item) => {
        const arr1 = tokenizer.sentences(item, {
          newline_boundaries: false,
          html_boundaries: true,
          sanitize: false,
          allowed_tags: false,
          preserve_whitespace: false,
          abbreviations: null
        })
        if (arr1) {
          arr1.forEach((e1, index) => {
            if (index === arr1.length - 1) {
              arr.push({
                content: e1,
                isEndParagraph: true
              })
            } else {
              arr.push({
                content: e1,
                isEndParagraph: false
              })
            }
          })
        }

        if (arr.length > 1) {
          arr.forEach((v, i) => {
            if (typeof this.sentences[i] !== 'undefined') {
              this.sentences[i].content = arr[i].content
              this.sentences[i].isEndParagraph = arr[i].isEndParagraph
            } else {
              const clone = cloneDeep(defaultSentence)
              clone.id = randomstring.generate()
              clone.content = arr[i].content
              clone.isEndParagraph = arr[i].isEndParagraph
              this.sentences.splice(i, 0, clone)
            }
          })
        }
      })
    },
    deleteItem(index) {
      this.sentences.splice(index, 1)
    },
    addItem(index) {
      const clone = cloneDeep(defaultSentence)
      clone.id = randomstring.generate()
      this.sentences.splice(index + 1, 0, clone)
    }
  }
}
</script>

<style lang="scss">
.sentence-management {
  margin-top: 20px;
  .sentence-item {
    margin-top: 20px;
    .timeline {
      width: 70px;
      margin-left: 10px;
    }
    .message {
      width: calc(100% - 80px);
      .audio-sentence {
        margin-top: 15px;
        .audio-player {
          margin-top: 55px;
        }
      }
    }
    .delete {
      margin-left: 20px;
    }
    .add {
      margin-left: 20px;
      margin-bottom: 30px;
    }
  }
}
</style>
