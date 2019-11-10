<template>
    <div>
        <div class="loading" v-show="!loaded"><img src="../../resource/images/loading.gif" /></div>
        <div class="section links">
            <h1><i class="icon icon-link"></i>友情链接列表<span class="add-icon" @click="add"><i class="icon-plus"></i>添加友情链接</span></h1>
            <table class="list">
                <tr class="title">
                    <th width="12%">链接名称</th>
                    <th width="10%">图标</th>
                    <th width="40%">链接地址</th>
                    <th>链接描述</th>
                    <th width="18%">操作</th>
                </tr>
                <tr class="empty" v-if="lists.length <= 0"><td colspan="5">{{tips}}</td></tr>
                <tr v-if="lists.length > 0" v-for="list in lists">
                    <td v-text="list.name"></td>
                    <td class="icon" style=""><img :src="list.logo" v-if="list.logo" /></td>
                    <td class="url" v-text="list.url"></td>
                    <td class="desc" v-html="list.desc" style=""></td>
                    <td><span class="modify" @click="modify(list)">修改</span><span class="delete" @click="deleteList(list.id)">删除</span></td>
                </tr>
            </table>
        </div>
        <transition name="slide"><router-view class="handle" :info="info" @update="getList"></router-view></transition>
    </div>
</template>

<script>
import {deleteList} from '@/resource/js/common.js'

export default {
    name : 'links',
    data () {
        return {
            lists : '',
            info : '',
            tips : '还没有添加友情链接，快去添加一个吧！',
            deleteFlag : false,
            loaded : false
        }
    },
    created () {
        this.getList();
    },
    methods : {
        getList(){
            this.$ajax({
                method : 'get',
                url : '/api/links',
            }).then((res) => {
                this.lists = res.data;
                this.loaded = true;
            }).catch((err) => {
                this.loaded = true;
                this.tips = '数据获取失败，请刷新后再试！';
            });
        },
        add(){
            if(!this.loaded) return;
            this.$router.push('links/add');
        },
        modify(list){
            this.info = list;
            this.$router.push('links/modify/' + list.id);
        },
        deleteList(id){
            let url = '/api/links/delete/' + id, str = '友情链接';
            deleteList(this, url, str);
        }
    }
}
</script>

<style lang="scss">
.links{
    tr{
        .icon{
            line-height: 3rem!important; padding: 0 5px!important; background: #e5e5e5; border-left: 1px solid #f8f8f8!important;
            img{width: 2.4rem; height: 2.4rem; vertical-align: middle;}
        }
        .url{border-left-color: #f8f8f8!important;}
        .desc{text-align: left!important;}
    }
}
.logo{
    p{
        width: 50px; height: 50px; line-height: 50px;;
        img{max-width: 50px; max-height: 50px;}
        i{font-size: 1.8rem;}
        input{width: 52px; height: 52px;}
        &.grey{background: #b5b5b5!important;}
    }
    .cancel, .tips{left: 62px;}
}
</style>
