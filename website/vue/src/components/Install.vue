<template>
  <div class="wrapper">
    <div class="container">
      <div v-show="isOpera && !installed" class="before-install">
        Before you will be able to install YouTrack Tweaks you have to install
        <a target="_blank" href="https://addons.opera.com/en-gb/extensions/details/download-chrome-extension-9/">Download Chrome Extension</a>
      </div>

      <div class="install-block" @click="install()" :class="{'inactive': installed || !supported}">
        <div class="logo-text" v-show="supported && !installed">Click to install YouTrack Tweaks</div>
        <div class="logo-text" v-show="supported && installed">Already installed</div>
        <div class="logo-text" v-show="!supported">Your browser is not supported</div>
        <img src="../assets/logo.png">
      </div>
    </div>

    <div class="footer">
      <a href="https://t.me/youtrack" class="feedback-item"
         target="_blank"
         title="Telegram group - feedback, bugs and feature requests">
        <img src="../assets/telegram-logo.png">
      </a>

      <a href="https://tweaks.myjetbrains.com" class="feedback-item"
         target="_blank"
         title="Extension Issue Tracker - feedback, bugs and feature requests">
        <img src="../assets/youtrack.svg">
      </a>

      <a href="https://twitter.com/YouTrackTweaks" class="feedback-item"
         target="_blank"
         title="New tweaks every day in our twitter">
        <img src="../assets/twitter.png">
      </a>
    </div>
  </div>
</template>

<script>
  /* global chrome */
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import browser from 'detect-browser'

  const storeLinks = {
    chrome: 'https://chrome.google.com/webstore/detail/youtrack-tweaks/ialcocpchgkbmpmoipmoheklimalbcia',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/youtrack',
    opera: 'https://addons.opera.com/en-gb/extensions/details/download-chrome-extension-9/'
  }

  @Component({
    props: {
      propMessage: String
    }
  })
  export default class App extends Vue {
    supported = true
    installed = false
    installActon = () => {}

    mounted () {
      console.log('browser:', browser.name)

      if (chrome.runtime && chrome.runtime.sendMessage) {
        console.log('run install detector')

        setInterval(() => {
          chrome.runtime.sendMessage(this.extensionId, {ping: true}, response => {
            this.installed = response && response.pong
          })
        }, 250)
      }

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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .wrapper {
    height: 100%;
  }

  .container {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    color: white;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
  }

  .before-install {
    margin-bottom: 16px;

    & a {
        color: #3f92b0;
      }
  }

  .install-block {
    font-size: 40px;
    text-align: center;
    cursor: pointer;

    flex: none;

    &.inactive {
      cursor: default;
      opacity: 0.7
    }
  }

  .logo-text {
    margin-bottom: 16px;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: 20px;
  }

  .feedback-item {
    cursor: pointer;
    display: inline-block;
    padding: 0 16px;

    & img {
      width: 32px;
      height: 32px;
    }
  }
</style>
