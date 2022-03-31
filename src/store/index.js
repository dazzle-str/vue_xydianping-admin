import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// eslint-disable-next-line no-undef
const c1 = new cloud.Cloud({
  identityless: true,
  resourceAppid: 'wx1269f7c17c19caa9',
  resourceEnv: 'cloud1-8gd2c61l7547c872'
})
c1.init()

export default new Vuex.Store({
  state: {
    cloud: c1
  }
})
