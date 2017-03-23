<template>
  <span>
    <input class="input" type="text"
           v-model="value.fieldName" :placeholder="i18n.fieldName"
           @keydown.enter="add()">

    <input class="input" type="text"
           v-model="value.fieldValue" :placeholder="i18n.fieldValue"
           @keydown.enter="add()">
  </span>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component({
    props: {
      value: Object,
      i18n: Object,
      add: Function,
      clear: Function
    }
  })
  export default class extends Vue {
  }
</script>
