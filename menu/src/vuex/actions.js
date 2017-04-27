import storage from '@/utils/storage'

import {SET_TWEAKS_MUT, ADD_TWEAK_MUT, UPDATE_TWEAK_MUT, REMOVE_TWEAK_MUT, TOGGLE_TWEAK_MUT, REMOVE_ALL_TWEAKS_MUT} from './mutations'

export const RELOAD_TWEAKS = 'reloadTweaks'
export const ADD_TWEAK = 'addTweak'
export const UPDATE_TWEAK = 'updateTweak'
export const REMOVE_TWEAK = 'removeTweak'
export const TOGGLE_TWEAK = 'toggleEnabled'
export const REMOVE_ALL_TWEAKS = 'removeAllTweaks'
export const SET_TWEAKS = 'setTweaks'

export default {
  [RELOAD_TWEAKS] ({commit}) {
    return storage.get('tweaks').then((tweaks = []) => {
      commit(SET_TWEAKS_MUT, {tweaks, doNotSync: true})
    })
  },

  [SET_TWEAKS] ({commit}, {tweaks}) {
    commit(SET_TWEAKS_MUT, {tweaks})
  },

  [ADD_TWEAK] ({commit}, {type, config = {}}) {
    commit(ADD_TWEAK_MUT, {
      tweak: {
        id: +new Date(),
        type,
        config
      }
    })
  },

  [UPDATE_TWEAK] ({commit, state}, {index, config = {}}) {
    const tweak = state.tweaks[index]

    commit(UPDATE_TWEAK_MUT, {index,
      tweak: {
        id: tweak.id,
        type: tweak.type,
        config
      }
    })
  },

  [REMOVE_TWEAK] ({commit}, {index}) {
    commit(REMOVE_TWEAK_MUT, {index})
  },

  [TOGGLE_TWEAK] ({commit}, {index}) {
    commit(TOGGLE_TWEAK_MUT, {index})
  },

  [REMOVE_ALL_TWEAKS] ({commit}) {
    commit(REMOVE_ALL_TWEAKS_MUT)
  }
}
