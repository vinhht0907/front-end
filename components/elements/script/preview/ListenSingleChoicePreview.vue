<template>
  <listen-single-choice-detail :form="form">
    <template v-slot:action="{ options }">
      <b-button-group vertical>
        <b-button
          v-for="answer in options"
          :key="answer.key"
          v-if="answer.text"
          >{{ answer.text }}</b-button
        >
      </b-button-group>
    </template>
  </listen-single-choice-detail>
</template>

<script>
import ListenSingleChoiceDetail from '~/components/elements/script/preview/ListenSingleChoiceDetail'
export default {
  name: 'ListenSingleChoicePreview',
  components: { ListenSingleChoiceDetail },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  }
}
</script>
