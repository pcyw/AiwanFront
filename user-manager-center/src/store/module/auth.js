import {
  token
} from '@/api/auth'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    token: getToken()
  },
  actions: {
    // 登录
    handleToken ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        token({
          userName,
          password
        }).then(res => {
          const data = res.data
          commit('setToken', data.access_token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },

  }
}
