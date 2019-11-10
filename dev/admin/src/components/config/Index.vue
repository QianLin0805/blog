<template>
    <div>
        <div class="loading" v-show="!loaded"><img src="../../resource/images/loading.gif" /></div>
        <div class="section config">
            <h1><i class="icon icon-cog"></i>网站配置列表<span class="add-icon" @click="add"><i class="icon-plus"></i>添加配置</span></h1>
            <table class="list">
                <tr class="title">
                    <th width="22%">配置名称</th>
                    <th>值</th>
                    <th width="20%">配置类型</th>
                    <th width="18%">操作</th>
                </tr>
                <tr class="empty" v-if="lists.length <= 0"><td colspan="4">{{tips}}</td></tr>
                <tr v-if="lists.length > 0" v-for="list in lists">
                    <td v-text="list.name"></td>
                    <td v-text="list.val"></td>
                    <td>{{list.type|getType}}</td>
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
    name : 'config',
    data () {
        return {
            lists : '',
            info : '',
            tips : '网站还没有添加配置，快去添加一个吧！',
            deleteFlag : false,
            loaded : false
        }
    },
    created () {
        this.getList();
    },
    filters : {
        getType : function(type){
            if(type == 1) return '字符型';
            if(type == 2) return '数值型';
        }
    },
    methods : {
        getList(){
            this.$ajax({
                method : 'get',
                url : '/api/config',
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
            this.$router.push('config/add');
        },
        modify(list){
            this.info = list;
            this.$router.push('config/modify/' + list.id);
        },
        deleteList(id){
            let url = '/api/config/delete/' + id, str = '配置';
            deleteList(this, url, str);
        }
    }
}
</script>

<style lang="scss">

</style>
