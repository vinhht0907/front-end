<template>
  <validation-observer ref="observer" class="kt-form config-form">
    <b-form @submit.prevent="validateAppVersionForm">
      <b-row>
        <b-col cols="10">
          <b-radio-with-validation
            :options="options"
            v-model="form.value"
            :error="vForm.errors.get('service')"
            :required="true"
            :label="label"
            :data-vv-as="label"
            name="value"
            size="lg"
            rules="required"
            label-cols-sm="4"
            label-cols-lg="4"
            class="theme-custom-radio"
          >
          </b-radio-with-validation>
        </b-col>

        <b-col
          ><b-button :disabled="loading" type="submit" variant="primary"
            ><b-spinner v-show="loading" small class="mr-2"></b-spinner>Cập
            nhật</b-button
          ></b-col
        >
      </b-row>
    </b-form>
  </validation-observer>
</template>

<script>
import Form from 'vform'
import { ValidationObserver } from 'vee-validate'
import { cloneDeep } from 'lodash'
import { notifyTryAgain, notifyUpdateSuccess } from '~/utils/bootstrap-notify'
import BRadioWithValidation from '~/components/base/input/BRadioWithValidation'

export default {
  name: 'ConfigMode',
  components: {
    BRadioWithValidation,
    ValidationObserver
  },
  props: {
    label: {
      type: String,
      default: 'Speaking stress word mode'
    },
    setUrl: {
      type: String,
      default: 'set-speaking-stress-word-mode'
    },
    getUrl: {
      type: String,
      default: 'get-speaking-stress-word-mode'
    }
  },
  data() {
    return {
      loading: false,
      form: {
        value: ''
      },
      vForm: new Form(),
      options: [
        {
          value: 'ai',
          text: 'AI'
        },
        {
          value: 'non-ai',
          text: 'Non AI'
        }
      ]
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const { data } = await this.$axios.post('config/' + this.getUrl)
        this.form.value = data
      } catch (e) {}
    },
    async validateAppVersionForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.updateConfig()
      }
    },
    async updateConfig() {
      try {
        this.loading = true
        const formData = cloneDeep(this.form)
        this.vForm = new Form(formData)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/config/' + this.setUrl
        )

        notifyUpdateSuccess(this.label)
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
      this.loading = false
    }
  }
}
</script>
