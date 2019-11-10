export default {
    setUserCount(state, userCount){
        state.userCount = userCount;
    },
    setViewsCount(state, viewsCount){
        state.viewsCount = viewsCount;
    },
    setArtCount(state, articleCount){
        state.articleCount = articleCount;
    },
    setReplyCount(state, replyCount){
        state.replyCount = replyCount;
    },

    deleteArticle(state){
        if(state.articleCount > 0) state.articleCount--;
    }
}