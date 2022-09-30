<template>
  <the-portlet title="Danh sách cấu hình chung">
    <validation-observer ref="observer" class="kt-form">
      <b-form @submit.prevent="validateAppVersionForm">
        <b-row>
          <b-col cols="5"
            ><b-text-input-with-validation
              v-model="formAppVersion.ios"
              :required="true"
              :error="vForm.errors.get('ios')"
              label-align="right"
              label-cols-sm="5"
              label-cols-lg="5"
              label="Phiên bản IOS"
              placeholder="Phiên bản IOS"
              rules="required"
              name="ios"
          /></b-col>
          <b-col cols="5"
            ><b-text-input-with-validation
              v-model="formAppVersion.android"
              :required="true"
              :error="vForm.errors.get('android')"
              label-align="right"
              label-cols-sm="5"
              label-cols-lg="5"
              label="Phiên bản Android"
              placeholder="Phiên bản Android"
              rules="required"
              name="android"
          /></b-col>
          <b-col
            ><b-button
              :disabled="loadingAppVersion"
              type="submit"
              variant="primary"
              ><b-spinner
                v-show="loadingAppVersion"
                small
                class="mr-2"
              ></b-spinner
              >Cập nhật</b-button
            ></b-col
          >
        </b-row>
      </b-form>
    </validation-observer>
    <config-asr-service />
    <config-mode />
    <config-mode
      label="Speaking stress sentence mode"
      set-url="set-speaking-stress-sentence-mode"
      get-url="get-speaking-stress-sentence-mode"
    />
    <config-mode
      label="Speaking intonation mode"
      set-url="set-speaking-intonation-mode"
      get-url="get-speaking-intonation-mode"
    />
  </the-portlet>
</template>

<script>
import Form from 'vform'
import { ValidationObserver } from 'vee-validate'
import ThePortlet from '~/components/base/ThePortlet'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import { notifyTryAgain, notifyUpdateSuccess } from '~/utils/bootstrap-notify'
import { CONFIG_COMMON_VIEW } from '~/constants/permissions'
import ConfigAsrService from '~/features/config/ConfigAsrService'
import ConfigMode from '~/features/config/ConfigMode'

export default {
  name: 'ConfigCommon',
  permission: CONFIG_COMMON_VIEW,
  components: {
    ConfigMode,
    ConfigAsrService,
    ThePortlet,
    BTextInputWithValidation,
    ValidationObserver
  },
  head() {
    return {
      title: 'Cấu hình chung'
    }
  },
  meta: {
    pageTitle: 'Cấu hình chung'
  },
  data() {
    return {
      loadingAppVersion: false,
      vForm: new Form(),
      formAppVersion: {}
    }
  },
  created() {
    this.loadAppVersion()
  },
  methods: {
    async loadAppVersion() {
      try {
        const { data } = await this.$axios.post('config/get-app-version')
        this.formAppVersion = data
      } catch (e) {}
    },
    async validateAppVersionForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.updateAppVerion()
      }
    },
    async updateAppVerion() {
      try {
        this.loadingAppVersion = true
        this.vForm = new Form(this.formAppVersion)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/config/set-app-version'
        )

        notifyUpdateSuccess('Cập nhật app version thành công')
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
      this.loadingAppVersion = false
    }
  }
}
</script>
