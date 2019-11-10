export default {
    setUserCount : ({commit}, userCount) => {
        commit('userCount');
    },
    setViewsCount : ({commit}, viewsCount) => {
        commit('viewsCount');
    },
    setArtCount : ({commit}, articleCount) => {
        commit('articleCount');
    },
    setReplyCount : ({commit}, replyCount) => {
        commit('replyCount');
    },

    deleteArticle : ({commit}) => {
        commit('deleteArticle');
    }
}