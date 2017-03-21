<template>
  <span>
    <input class="input" type="text"
           v-model="value.name" :placeholder="i18n.placeholder"
           @keydown.enter="add()" @keydown.esc="clear()">

    <select v-model="value.conversion">
      <option :value="option" v-for="(label, option) in conversionOptions" :key="option">{{label}}</option>
    </select>
    {{i18n.ignoreColors}}<input type="checkbox" v-model="value.ignoreColors">
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
    conversionOptions = {
      no: this.i18n.conversions.no,
      letter: this.i18n.conversions.letter
    }
  }
</script>
