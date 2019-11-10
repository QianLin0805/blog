<template>
    <div>
        <h1 class="head"><i class="icon icon-quill"></i>修改导航<a href="javascript:history.back();"><span class="icon-undo2"></span>返回</a></h1>
        <ul class="form" v-if="info">
            <li class="item">
                <p class="left"><strong>*</strong> 英文名称：</p>
                <div class="right">
                    <input type="text" name="name_en" v-model="name_en" v-validate="'required|max:30|regex:^[a-zA-Z_]+$'" maxlength="30" />
                    <b class="errors" v-show="errors.has('name_en')">{{errors.first('name_en')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 中文名称：</p>
                <div class="right">
                    <input type="text" name="name_cn" v-model="name_cn" v-validate="'required|max:30|regex:^[一-龥]+$'" maxlength="30" />
                    <b class="errors" v-show="errors.has('name_cn')">{{errors.first('name_cn')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 路径名称：</p>
                <div class="right">
                    <input type="text" class="middle" name="path_name" v-model="path_name" v-validate="'required|max:50|regex:^[a-zA-Z_]+$'" maxlength="50" />
                    <b class="errors" v-show="errors.has('path_name')">{{errors.first('path_name')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 排序：</p>
                <div class="right">
                    <input type="text" class="small" name="order" v-model="order" v-validate="'required|numeric|max:3'" maxlength="3" />
                    <b class="errors" v-show="errors.has('order')">{{errors.first('order')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left"></p>
                <div class="right">
                    <button id="modify" @click="modify">修 改</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {isModified, modifyList} from '@/resource/js/common.js'

export default {
    props : {
        info : [String, Object]
    },
    data () {
        return {
            name_en : this.info.name_en,
            name_cn : this.info.name_cn,
            path_name : this.info.path_name,
            order : this.info.order,
            changed : false,
            changeData : {},
            flag : false
        }
    },
    created () {
        if(!this.info) this.$router.replace({name : 'navs'});
    },
    methods : {
        modify(){
            this.changeData = {};
            let arr = ['id'];
            isModified(this, arr, 'info');
            if(!this.changed){
                this.$layer.msg('未做任何修改', () => {
                    this.$layer.closeAll();
                });
                return;
            }
            if(this.errors.items.length > 0) return;
            
            if(this.flag) return;
            this.flag = true;
            let url = '/api/navs/modify/' + this.info.id;
            modifyList(this, url, this.changeData);
        }
    }
}
</script>

<style lang="scss">

</style>
