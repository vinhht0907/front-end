<template>
  <div style="width: 380px;">
    <h5 class="preview-script__title">
      {{
        form.transcript.title ? form.transcript.title : 'Tiêu đề đoạn văn ...'
      }}
    </h5>
    <div class="preview-script__content">
      <!--
      -->{{
        form.transcript.content
          ? form.transcript.content
          : 'Nội dung đoạn văn ...'
      }}<!--
    --></div>
  </div>
</template>

<script>
export default {
  name: 'ListenAndAnswerPreview',
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
