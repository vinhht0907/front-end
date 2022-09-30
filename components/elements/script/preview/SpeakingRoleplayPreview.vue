<template>
  <speaking-roleplay-detail :form="form"> </speaking-roleplay-detail>
</template>

<script>
import SpeakingRoleplayDetail from '~/components/elements/script/preview/SpeakingRoleplayDetail'

export default {
  name: 'SpeakingRoleplayPreview',
  components: { SpeakingRoleplayDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
