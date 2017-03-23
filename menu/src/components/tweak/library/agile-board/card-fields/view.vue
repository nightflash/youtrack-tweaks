<template>
  <span>
    <span>{{item.name}}</span>
    <span>{{i18n.conversions[item.conversion]}}</span>
    <span v-show="item.ignoreColors">{{i18n.ignoreColors}}</span>
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
