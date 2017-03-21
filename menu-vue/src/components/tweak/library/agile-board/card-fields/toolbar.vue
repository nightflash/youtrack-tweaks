<template>
  <span>
    <input class="input" type="text"
           v-model="value.fieldName" :placeholder="i18n.placeholder"
           @keydown.enter="add()" @keydown.esc="clear()">

    <select v-model="value.conversion">
      <option :value="option" v-for="option in conversionOptions" :key="option">{{option}}</option>
    </select>
    Ignore color<input type="checkbox" v-model="value.ignoreColors">
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
    conversionOptions = ['no', 'letter']
  }
</script>
