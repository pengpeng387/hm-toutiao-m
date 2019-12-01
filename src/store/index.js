import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 获取用户信息
    user: auth.getUser(),
    // 头像
    photo: ''
  },
  mutations: {
    // 头像
    setPhoto (state, photo) {
      state.photo = photo
    },
    // 修改用户信息
    setUser (state, user) {
      // 修改state
      state.user = user
      // 更新本地
      auth.setUser(user)
    },
    // 清除用户信息
    delUser (state) {
      state.user = {}
      auth.delUser()
    }
  },
  actions: {
  }
})
