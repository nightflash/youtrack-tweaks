export default {
  send (data) {
    return new Promise((resolve, reject) => {
      if (window.chrome && window.chrome.runtime && window.chrome.runtime.id) {
        window.chrome.runtime.sendMessage(data, () => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  }
}
