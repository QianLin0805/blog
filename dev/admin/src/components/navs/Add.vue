<template>
    <div>
        <h1 class="head"><i class="icon icon-plus"></i>添加导航<a href="javascript:history.back();"><span class="icon-undo2"></span>返回</a></h1>
        <ul class="form">
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
                    <input type="text" name="path_name" v-model="path_name" v-validate="'required|max:50|regex:^[a-zA-Z_]+$'" maxlength="50" />
                    <b class="errors" v-show="errors.has('path_name')">{{errors.first('path_name')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left"></p>
                <div class="right">
                    <button id="add" @click="add">添 加</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {addList} from '@/resource/js/common.js'

export default {
    data () {
        return {
            name_en : '',
            name_cn : '',
            path_name : '',
            flag : false
        }
    },
    methods : {
        add(){
            if(!this.name_en || !this.name_cn || !this.path_name) return;
            if(this.errors.items.length > 0) return;
            
            if(this.flag) return;
            this.flag = true;
            let url = '/api/navs/store';
            let params = {
                'name_en' : this.name_en,
                'name_cn' : this.name_cn,
                'path_name' : this.path_name
            }
            addList(this, url, params);
        }
    }
}
</script>

<style lang="scss">

</style>
