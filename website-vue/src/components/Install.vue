<template>
  <div class="wrapper">
    <div class="container">
      <div class="install-block" @click="install()">
        <div class="logo-text" v-show="!installed">Click to install YouTrack Tweaks</div>
        <div class="logo-text" v-show="installed">Already installed</div>
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

  @Component({
    props: {
      propMessage: String
    }
  })
  export default class App extends Vue {
    installed = false

    mounted () {
      setInterval(() => {
        chrome.runtime.sendMessage(this.extensionId, {ping: true}, response => {
          this.installed = response && response.pong
        })
      }, 250)
    }

    install () {
      if (!this.installed) {
        chrome.webstore.install(
          this.extensionUrl, () => {}, error => console.error(error)
        )
      }
    }

    get extensionUrl () {
      return document.head.querySelector('link[rel="chrome-webstore-item"]').href
    }

    get extensionId () {
      return this.extensionUrl.split('detail/')[1]
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper {
    height: 100%;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
  }

  .install-block {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    font-size: 40px;
    color: white;
    text-align: center;
    cursor: pointer;

    flex: none;
  }

  .install-block.installed { cursor: default; opacity: 0.7 }

  .install-block .logo-text.not-installed { display: block; }
  .install-block .logo-text.installed { display: none; }

  .install-block.installed .logo-text.not-installed { display: none; }
  .install-block.installed .logo-text.installed { display: block; }

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
  }

  .feedback-item img {
    width: 32px;
    height: 32px;
  }
</style>
