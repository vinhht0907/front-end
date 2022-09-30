<template>
  <f-i-b-with-given-word-detail :form="form"></f-i-b-with-given-word-detail>
</template>

<script>
import FIBWithGivenWordDetail from '~/components/elements/script/preview/FIBWithGivenWordDetail'
export default {
  name: 'FIBWithGivenWordPreview',
  components: { FIBWithGivenWordDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
