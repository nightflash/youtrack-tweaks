function getStorage () {
  return window.browser ? window.chrome.storage.local : window.chrome.storage.sync
}

export default {
  get (key, nullValue) {
    return new Promise(resolve => {
      if (window.chrome.storage && window.chrome.storage.sync) {
        getStorage().get(key, data => {
          resolve(data[key] || nullValue)
        })
      } else {
        resolve(JSON.parse(window.localStorage.getItem(key)) || nullValue)
      }
    })
  },

  set (key, value) {
    return new Promise(resolve => {
      if (window.chrome.storage && window.chrome.storage.sync) {
        getStorage().set({
          [key]: value
        }, () => resolve())
      } else {
        resolve(window.localStorage.setItem(key, JSON.stringify(value)))
      }
    })
  }
}
