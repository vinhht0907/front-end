<template>
  <l-a-q-with-order-detail :form="form"></l-a-q-with-order-detail>
</template>

<script>
import LAQWithOrderDetail from '~/components/elements/script/preview/LAQWithOrderDetail'
export default {
  name: 'LAQWithOrderPreview',
  components: { LAQWithOrderDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
