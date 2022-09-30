<template>
  <the-portlet title="Xóa cache">
    <cache-key />
    <cache-tag />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import CacheKey from '~/features/cache/CacheKey'
import CacheTag from '~/features/cache/CacheTag'
import { CACHE_VIEW } from '~/constants/permissions'

export default {
  name: 'Cache',
  permission: CACHE_VIEW,
  components: {
    ThePortlet,
    CacheKey,
    CacheTag
  },
  head() {
    return {
      title: 'Xóa cache'
    }
  },
  meta: {
    pageTitle: 'Xóa cache'
  }
}
</script>
