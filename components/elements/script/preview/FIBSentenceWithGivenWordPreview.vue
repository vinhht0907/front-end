<template>
  <div>
    <f-i-b-sentence-with-given-word-detail :form="form">
    </f-i-b-sentence-with-given-word-detail>
  </div>
</template>

<script>
import FIBSentenceWithGivenWordDetail from '~/components/elements/script/preview/FIBSentenceWithGivenWordDetail'
export default {
  name: 'FIBSentenceWithGivenWordPreview',
  components: { FIBSentenceWithGivenWordDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
