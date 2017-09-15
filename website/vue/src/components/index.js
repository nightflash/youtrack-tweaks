/* global chrome */
import Vue from 'vue'
import Component from 'vue-class-component'
import browser from 'detect-browser'

const storeLinks = {
  chrome: 'https://chrome.google.com/webstore/detail/youtrack-tweaks/ialcocpchgkbmpmoipmoheklimalbcia',
  firefox: 'https://addons.mozilla.org/en-US/firefox/addon/youtrack-tweaks',
  opera: 'https://addons.opera.com/en-gb/extensions/details/download-chrome-extension-9/'
}

@Component({
  props: {
    propMessage: String
  }
})
export default class AppComponent extends Vue {
  supported = true
  installed = false
  installActon = () => {}

  mounted () {
    console.log('browser:', browser.name)
    console.log('run install detector')

    let attempts = 0

    window.pong = () => {
      attempts = 0
      this.installed = true
    }

    setInterval(() => {
      if (attempts > 5) {
        this.installed = false
      }

      window.postMessage({ping: true, ytTweaks: true}, window.location.origin)
      attempts++
    }, 250)

    switch (browser.name) {
      case 'chrome':
        this.installActon = () => chrome.webstore.install(
            this.extensionUrl, () => {}, error => console.error(error)
        )
        break
      case 'yandexbrowser':
        this.installActon = () => (document.location.href = storeLinks.chrome)
        break
      case 'firefox':
        this.installActon = () => (document.location.href = storeLinks.firefox)
        break
      case 'opera':
        this.installActon = () => (document.location.href = storeLinks.chrome)
        break
      default:
        this.supported = false
    }
  }

  install () {
    if (this.installed || !this.supported) return

    this.installActon()
  }

  get extensionUrl () {
    return document.head.querySelector('link[rel="chrome-webstore-item"]').href
  }

  get extensionId () {
    return this.extensionUrl.split('detail/')[1]
  }

  get isOpera () {
    return browser.name === 'opera'
  }
}
