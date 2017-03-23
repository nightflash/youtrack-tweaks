<template>
  <span>
    <span>{{item.fieldName}}</span> =
    <span>{{item.fieldValue}}</span>
  </span>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component({
    props: {
      item: Object,
      i18n: Object
    }
  })
  export default class extends Vue {
  }
</script>
