<template>
  <f-i-b-multipart-detail :form="form"></f-i-b-multipart-detail>
</template>

<script>
import FIBMultipartDetail from './FIBMultipartDetail'
export default {
  name: 'LWByFlashcardPreview',
  components: { FIBMultipartDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
