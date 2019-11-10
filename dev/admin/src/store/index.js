import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import common from './common'
import user from './user'
import category from './category'
import article from './article'

export default new Vuex.Store({
    modules : {
        common,
        user,
        category,
        article
    }
})