<template>
    <div>
        <div class="loading" v-show="!loaded"><img src="../../resource/images/loading.gif" /></div>
        <div class="section navs">
            <h1>导航列表<span class="add-icon" @click="add"><i class="icon-plus"></i>添加导航</span></h1>
            <table class="list">
                <tr class="title">
                    <th width="24%">导航英文名称</th>
                    <th width="24%">导航中文名称</th>
                    <th>导航路径名称</th>
                    <th width="18%">操作</th>
                </tr>
                <tr class="empty" v-if="lists.length <= 0"><td colspan="4">{{tips}}</td></tr>
                <tr v-if="lists.length > 0" v-for="list in lists">
                    <td v-text="list.name_en"></td>
                    <td v-text="list.name_cn"></td>
                    <td v-text="list.path_name"></td>
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
    name : 'navs',
    data () {
        return {
            lists : '',
            info : '',
            tips : '还没有添加网站导航，快去添加一个吧！',
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
                url : '/api/navs',
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
            this.$router.push('navs/add');
        },
        modify(list){
            this.info = list;
            this.$router.push('navs/modify/' + list.id);
        },
        deleteList(id){
            let url = '/api/navs/delete/' + id, str = '导航';
            deleteList(this, url, str);
        }
    }
}
</script>

<style lang="scss">

</style>
