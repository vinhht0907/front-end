<template>
  <b-modal
    ref="modal"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    cancel-title="Đóng"
    ok-title="Đồng ý"
    title="Find The Words"
    size="xl"
  >
    <b-row>
      <b-col cols="12"
        ><validation-observer ref="observer" class="kt-form">
          <div class="row">
            <div class="col-md-6">
              <b-text-input-with-validation
                v-model="form.rows"
                required
                name="rows"
                rules="required"
                type="number"
                label="Số hàng"
                placeholder="Số hàng"
              />
            </div>
            <div class="col-md-6">
              <b-text-input-with-validation
                v-model="form.cols"
                required
                name="cols"
                rules="required"
                type="number"
                label="Số cột"
                placeholder="Số cột"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <find-the-words-list v-model="form.items" />
            </div>
            <div class="col-md-6">
              <table
                v-if="form.rows && form.cols && form.table"
                class="table table-bordered table-find-the-word"
              >
                <tr>
                  <td class="bg-secondary"></td>
                  <td
                    v-for="col in parseInt(form.cols)"
                    class="text-danger font-weight-bold bg-secondary"
                  >
                    {{ col }}
                  </td>
                </tr>
                <tr v-for="row in parseInt(form.rows)">
                  <td class="text-danger font-weight-bold bg-secondary">
                    {{ row }}
                  </td>
                  <td
                    v-for="col in parseInt(form.cols)"
                    @blur="(e) => updateTable(row, col, e.target.innerText)"
                    v-html="form.table[row - 1][col - 1]"
                    contenteditable
                  ></td>
                </tr>
              </table>
            </div>
          </div>
        </validation-observer>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import FindTheWordsList from '~/components/elements/script/partial/primarySchool/FindTheWordsList'

const defaultForm = {
  items: null,
  cols: 5,
  rows: 5
}
export default {
  name: 'FindTheWordsModal',
  components: {
    FindTheWordsList,
    BTextInputWithValidation,
    ValidationObserver
  },
  data() {
    return {
      form: cloneDeep(defaultForm)
    }
  },
  watch: {
    'form.rows'(val) {
      if (val && this.form.cols) {
        if (this.form.table) {
          if (val > this.form.table.length) {
            this.form.table.push(
              [...Array(parseInt(this.form.cols)).keys()].map((item) => '')
            )
          } else {
            this.form.table.splice(-1, this.form.table.length - val)
          }
        } else {
          this.form.table = []
          for (let i = 0; i < parseInt(val); i++) {
            this.form.table.push(
              [...Array(parseInt(this.form.cols)).keys()].map((item) => '')
            )
          }
        }
      }
    },
    'form.cols'(val) {
      if (val && this.form.rows) {
        if (this.form.table) {
          if (val > this.form.table[0].length) {
            for (let i = 0; i < this.form.rows; i++) {
              this.form.table[i] = this.form.table[i].concat(
                [
                  ...Array(parseInt(val - this.form.table[0].length)).keys()
                ].map((item) => '')
              )
            }
          } else {
            for (let i = 0; i < this.form.rows; i++) {
              this.form.table[i].splice(-1, this.form.table[i].length - val)
            }
          }
        } else {
          this.form.table = []
          for (let i = 0; i < parseInt(this.form.rows); i++) {
            this.form.table.push(
              [...Array(parseInt(val)).keys()].map((item) => '')
            )
          }
        }
      }
    }
  },
  methods: {
    show(item) {
      this.form = cloneDeep(item)
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$emit('updateScript', this.form)
        this.$refs.modal.hide()
      }
    },
    updateTable(row, col, text) {
      if (this.form.table) {
        this.form.table[row - 1][col - 1] = text
      }
    }
  }
}
</script>

<style lang="scss">
.table-find-the-word {
  width: auto;
  td {
    border: 1px solid #8c8e94;
    width: 60px;
    height: 60px;
    font-size: 20px;
    text-align: center;
    vertical-align: middle;
  }
}
</style>
