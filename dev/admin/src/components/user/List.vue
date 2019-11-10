<template>
    <div class="list">
        <table>
            <tr class="title">
                <th width="18%">用户名</th>
                <th width="10%">用户等级</th>
                <th width="5%">性别</th>
                <th width="15%">手机号</th>
                <th width="25%">邮箱</th>
                <th width="12%">出生日期</th>
                <th width="15%">注册时间</th>
            </tr>
            <tr class="empty" v-if="tips"><td colspan="7" v-html="tips"></td></tr>
            <tr v-for="list in lists" v-if="lists.length > 0">
                <td v-text="list.username"></td>
                <td>{{list.level|level}}</td>
                <td>{{list.sex|sex}}</td>
                <td v-text="list.mobile"></td>
                <td v-text="list.email"></td>
                <td v-text="list.birthday"></td>
                <td v-parseDate="list.register_time" class="datetime"></td>
            </tr>
        </table>
        <v-pages v-if="count/limit > 1" :limit="limit" :page="page" :count="count" @changeLimit="changeLimit" @skip="skip"></v-pages>
    </div>
</template>

<script>
import Pages from '../tool/Pages'
import {formatDate} from '@/resource/js/common.js'

export default {
    name : 'userList',
    props : {
        type : String,
        cateId : [String, Number],
        username : String,
        action : Boolean
    },
    data () {
        return {
            lists : '',
            count : 0,
            tips : '',
            limit : 2,
            page : 1,
            flag : false
        }
    },
    created () {
        this.getList();
    },
    components : {
        'v-pages' : Pages
    },
    directives : {
        parseDate : {
            bind : function(el, binding){
                el.innerText = formatDate(binding.value);
            }
        }
    },
    filters : {
        level : function(val){
            if(val == 1) return '管理员';
            if(val == 2) return '普通会员';
            return '游客';
        },
        sex : function(val){
            if(val == 1) return '男';
            if(val == 2) return '女';
        }
    },
    watch : {
        limit(val, oldval){
            this.page = 1;
            this.getList();
        },
        page(val, oldval){
            this.getList();
        },
        action(val, oldval){
            if(val) this.getList();
        }
    },
    methods : {
        getList(){
            if(this.flag){
                this.$layer.msg('请稍后再试！', () => {
                    vue.$layer.closeAll();
                });
                return;
            }
            this.flag = true;
            this.tips = this.type=='search' ? '正在加载，请稍后！' : '正在查找，请稍后！';
            this.lists = [];

            let params = '?page=' + this.page + '&limit=' + this.limit
            let url = this.type=='search' ? '/api/users/search/' + this.username + params : '/api/users' + params;
            this.$ajax({
                method : 'get',
                url : url
            }).then((res) => {
                this.lists = res.data.list;
                this.count = res.data.count;
                if(res.data.count <= 0){
                    if(this.type == 'search'){
                        this.tips = '没有找到标题包含 <span>'+ this.title +'</span> 的文章！';
                    }else{
                        this.tips = '一个用户也没有，快去注册一个吧！';
                    }
                }else{
                    this.tips = '';
                }
                if(!this.type){
                    this.$emit('getCount', res.data.count);
                    this.$emit('init');
                }
                this.flag = false;
                this.$emit('resetAction');
            }).catch((err) => {
                this.flag = false;
                this.$emit('resetAction');
                if(this.type == 'search'){
                    this.tips = '数据获取失败，请刷新后再试！'
                }else{
                    this.$emit('init');
                    this.tips = '搜索出错！'
                }
            });
        },
        changeLimit(num){
            this.limit = num;
        },
        skip(page){
            if(this.flag) return;
            this.page = page;
        }
    }
}
</script>

<style lang="scss">

</style>
