<template>
    <div>
        <h1 class="head"><i class="icon icon-plus"></i>添加配置<a href="javascript:history.back();"><span class="icon-undo2"></span>返回</a></h1>
        <ul class="form">
            <li class="item">
                <p class="left"><strong>*</strong> 配置名称：</p>
                <div class="right">
                    <input type="text" name="name" v-model="name" v-validate="'required|max:30|regex:^[a-zA-Z0-9一-龥_]+$'" maxlength="30" />
                    <b class="errors" v-show="errors.has('name')">{{errors.first('name')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left">配置类型：</p>
                <div class="right">
                    <input type="radio" id="string" name="type" value="1" v-model="type"><label for="string">字符型</label>
                    <input type="radio" id="number" name="type" value="2" v-model="type"><label for="number">数值型</label>
                </div>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 值：</p>
                <div class="right">
                    <input v-if="type==1" type="text" class="middle" name="val" v-model="val" v-validate="'required|max:50'" maxlength="50" />
                    <input v-if="type==2" type="text" class="middle" name="val" v-model="val" v-validate="'required|numeric|max:50'" maxlength="50" />
                    <b class="errors" v-show="errors.has('val')">{{errors.first('val')}}</b>
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
            name : '',
            type : 1,
            val : '',
            flag : false
        }
    },
    methods : {
        add(){
            if(!this.name || !this.val) return;
            if(this.errors.items.length > 0) return;
            
            if(this.flag) return;
            this.flag = true;
            let url = '/api/config/store';
            let params = {
                'name' : this.name,
                'type' : this.type,
                'val' : this.val
            }
            addList(this, url, params);
        }
    }
}
</script>

<style lang="scss">

</style>
