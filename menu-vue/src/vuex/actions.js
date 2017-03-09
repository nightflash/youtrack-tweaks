import storage from '@/utils/storage'

import {SET_TWEAKS_MUT, ADD_TWEAK_MUT, UPDATE_TWEAK_MUT, REMOVE_TWEAK_MUT, REMOVE_ALL_TWEAKS_MUT} from './mutations'

export const RELOAD_TWEAKS = 'reloadTweaks'
export const ADD_TWEAK = 'addTweak'
export const UPDATE_TWEAK = 'updateTweak'
export const REMOVE_TWEAK = 'removeTweak'
export const REMOVE_ALL_TWEAKS = 'removeAllTweaks'

export default {
  [RELOAD_TWEAKS] ({commit}) {
    return storage.get('tweaks').then((tweaks = []) => {
      commit(SET_TWEAKS_MUT, {tweaks, doNotSync: true})
    })
  },

  [ADD_TWEAK] ({commit}, {type, url = '', config = {}}) {
    commit(ADD_TWEAK_MUT, {
      tweak: {
        id: +new Date(),
        type,
        url,
        config
      }
    })
  },

  [UPDATE_TWEAK] ({commit}, {index, tweak}) {
    commit(UPDATE_TWEAK_MUT, {index, tweak})
  },

  [REMOVE_TWEAK] ({commit}, {index}) {
    commit(REMOVE_TWEAK_MUT, {index})
  },

  [REMOVE_ALL_TWEAKS] ({commit}) {
    commit(REMOVE_ALL_TWEAKS_MUT)
  }
}
