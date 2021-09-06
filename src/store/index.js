import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfo } from '@/api/user.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapse: false,
    userInfo: {}
  },
  mutations: {
    // 是否折叠
    isCollapseFn (state) {
      state.isCollapse = !state.isCollapse
    },
    // 用户数据
    userInfo (state, value) {
      state.userInfo = value
    }
  },
  actions: {
    async getUserInfoFn (context) {
      const data = await getUserInfo().catch(err => err)
      if (data.status !== 200) {
        return this.$message.error('用户信息获取失败')
      }
      context.commit('userInfo', data.data.data)
    }
  },
  modules: {}
})
