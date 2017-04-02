<template>
  <span>
    <input class="input" type="text"
           v-model="value.name" :placeholder="i18n.placeholder"
           @keydown.enter="add()" @keydown.esc.prevent="clear()">

    <select v-model="value.conversion">
      <option :value="option" v-for="(label, option) in conversionOptions" :key="option">{{label}}</option>
    </select>

    <select v-model="value.color.mode">
      <option :value="option" v-for="(label, option) in colorOptions" :key="option">{{label}}</option>
    </select>

    <input :title="i18n.color.opacity" type="number" v-model="value.color.opacity" step="0.1" min="0.1" max="1" size="2"/>

    <input :title="i18n.color.generator" type="number" v-show="value.color.mode === 'auto'" v-model="value.color.generator" min="10" max="32" size="2">
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

    colorOptions = {
      inherit: this.i18n.color.inherit,
      ignore: this.i18n.color.ignore,
      auto: this.i18n.color.auto
    }
  }
</script>
