<template>
    <div>
        <div class="loading" v-show="!loaded"><img src="../../resource/images/loading.gif" /></div>
        <div class="section user">
            <h1><i class="icon icon-user"></i>会员列表</h1>
            <div class="count">
                总用户：<span>{{count}}</span>
                <div class="search">
                    <p>
                        <input type="text" v-model="username" placeholder="请输入用户名查找" maxlength="30" ref="search" />
                        <i class="icon-search" @click="searchUser"></i>
                    </p>
                    <span class="cancel" @click="cancel"><i class="icon-cross"></i>取消</span>
                </div>
            </div>
            <transition name="init">
                <v-list class="init" type="" :action="initAction" @init="loaded=true" @getCount="getCount" @resetAction="initAction=false" v-show="listFlag"></v-list>
            </transition>
            <transition name="result">
                <v-list class="result" type="search" :username="username" :action="searchAction" @resetAction="searchAction=false" v-if="searchFlag"></v-list>
            </transition>
        </div>
    </div>
</template>

<script>
import List from './List'
import Pages from '../tool/Pages'

export default {
    name : 'user',
    data () {
        return {
            username : '',
            count : 0,
            loaded : false,
            listFlag : true,
            initAction : false,
            searchFlag : false,
            searchAction : false
        }
    },
    components : {
        'v-list' : List,
        'v-pages' : Pages
    },
    methods : {
        getCount(count){
            this.count = count;
        },
        searchUser(){
            if( !/^[一-龥\w]{1,30}$/.test(this.username) ) return;
            if(!this.searchFlag){
                this.listFlag = false;
                setTimeout(() => {
                    this.searchFlag = true;
                }, 300);
            }else{
                this.searchAction = true;
            }
        },
        changeLimit(num){
            if(this.flag || this.flag2){
                this.$layer.msg('请稍后再试！', () => {
                    vue.$layer.closeAll();
                });
                return;
            }
            this.limit = num;
            this.page = 1;
        },
        cancel(){
            if(!this.searchFlag) return;
            this.searchFlag = false;
            setTimeout(() => {
                this.listFlag = true;
            }, 320);
        }
    }
}
</script>

<style lang="scss">
.user{
    .count{
        font-size: 13px; color: #666; height: 30px; line-height: 30px; margin: 1.5rem 0 1rem 0;
        span{font-size: 1rem; color: #47a4e9;}
    }
    .search{width: 190px;}
    .list{margin-top: 0!important;}
    .loadMore{
        font-size: 12px; color: #47a4e9; text-align: right; height: 2rem; line-height: 2rem; margin-top: .5rem;
        span{display: inline-block; height: 2rem; margin-right: 1rem; cursor: pointer;}
    }
}
</style>
