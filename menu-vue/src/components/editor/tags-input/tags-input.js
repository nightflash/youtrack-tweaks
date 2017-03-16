import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    value: Array,
    placeholder: {
      type: String,
      default: ''
    }
  }
})
export default class extends Vue {
  tags = []
  position = null
  inputValue = ''

  mounted () {
    this.tags = this.value.slice()
    this.setInitialPosition()
  }

  updated () {
    this.tags = this.value.slice()
    this.setInitialPosition()
  }

  setInitialPosition () {
    if (this.position === null && this.tags.length || this.position > this.tags.length) {
      this.position = this.tags.length
    }
  }

  emitUpdate () {
    this.$emit('input', this.tags.slice())
  }

  getTagRef (index) {
    return `tag${index}`
  }

  get actualValue () {
    return this.inputValue.trim()
  }

  get cursorMode () {
    return !this.actualValue && this.position < this.tags.length
  }

  add () {
    const tag = this.actualValue
    this.clear()

    if (tag) {
      if (this.position === this.tags.length) {
        this.tags.push(tag)
        this.position++
        this.updateInputPosition()
      } else {
        this.tags.splice(this.position, 0, tag)
      }

      this.emitUpdate()
    }
  }

  remove (index) {
    this.tags.splice(index, 1)

    if (index < this.position) {
      this.position--
      this.updateInputPosition()
    }

    this.emitUpdate()
  }

  removeAtCursor (event) {
    if (this.actualValue === '') {
      if (event.key === 'Backspace' && this.position > 0) {
        this.remove(this.position - 1)
      } else if (event.key === 'Delete' && this.position < this.tags.length) {
        this.remove(this.position)
      }
    }
  }

  clear () {
    this.inputValue = ''
  }

  move (right) {
    if (this.actualValue === '') {
      if (right) {
        if (this.position < this.tags.length) {
          this.position++
        }
      } else {
        if (this.position > 0) {
          this.position--
        }
      }

      this.updateInputPosition()
    }
  }

  jump (end) {
    if (this.actualValue === '') {
      if (end) {
        this.position = this.tags.length
      } else {
        this.position = 0
      }

      this.updateInputPosition()
    }
  }

  updateInputPosition () {
    const before = this.position < this.tags.length ? this.$refs[this.getTagRef(this.position)][0] : null

    this.$el.insertBefore(this.$refs.inputControl, before)
    this.$refs.input.focus()
  }
}
