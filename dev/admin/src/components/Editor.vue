<template>
    <vue-html-editor @change="updateEditor" :height="height" :content="content"></vue-html-editor>
</template>

<script>
import VueEditor from 'vue-html5-editor'
let editor = new VueEditor({
    language: "zh-cn",
    showModuleName: true,
    image: {
        sizeLimit: 2 * 1024 * 1024, //2M
        compress: {
            width : 1200,
            quality : 80
        },
    },
    hiddenModules: ["info"],
});

export default {
    props : {
        height : [String, Number],
        content : String
    },
    components : {
        'vue-html-editor' : editor
    },
    methods : {
        updateEditor(val){
            this.$emit('updateContent', val);
        }
    }
}
</script>

<style lang="scss">
.vue-html5-editor{
    h1, h2, h3, h4, h5, h6, strong, b{font-weight: bold;}
    i{font-style: italic;}
    label{margin-right: 15px;}
    img{max-width: 85%; margin-top: 5px;}
    input[type="radio"]{margin: 5px 0 0; -webkit-appearance: radio; -moz-appearance: radio; -o-appearance: radio;}
    .content{max-height: 680px;}
}
</style>
