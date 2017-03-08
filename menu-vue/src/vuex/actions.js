import storage from '@/utils/storage'
import bus from '@/utils/bus'

import {SET_TWEAKS_MUT, ADD_TWEAK_MUT, UPDATE_TWEAK_MUT} from './mutations'

export const RELOAD_TWEAKS = 'reloadTweaks'
export const ADD_TWEAK = 'addTweak'
export const UPDATE_TWEAK = 'updateTweak'

function syncToBackground (state) {
  return storage.set('tweaks', state.tweaks).then(() => bus.send({
    tweaks: state.tweaks
  }))
}

export default {
  [RELOAD_TWEAKS] ({commit}) {
    return storage.get('tweaks').then((tweaks = []) => {
      commit(SET_TWEAKS_MUT, tweaks)
    })
  },

  [ADD_TWEAK] ({commit, state}, tweak) {
    commit(ADD_TWEAK_MUT, tweak)
    return syncToBackground(state)
  },

  [UPDATE_TWEAK] ({commit, state}, tweakId, updatedTweak) {
    commit(UPDATE_TWEAK_MUT, tweakId, updatedTweak)
    return syncToBackground(state)
  }
}
