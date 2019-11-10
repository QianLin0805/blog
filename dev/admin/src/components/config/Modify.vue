<template>
    <div>
        <h1 class="head"><i class="icon icon-quill"></i>修改网站配置<a href="javascript:history.back();"><span class="icon-undo2"></span>返回</a></h1>
        <ul class="form" v-if="info">
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
            name : this.info.name,
            type : this.info.type,
            val : this.info.val,
            order : this.info.order,
            changed : false,
            changeData : {},
            flag : false
        }
    },
    created () {
        if(!this.info) this.$router.replace({name : 'config'});
    },
    watch : {
        type(val, oldval){
            if(val == 2){
                if(!/^\d+$/gi.test(this.val) && !this.errors.has('val')){
                    let rule = {
                        field : "val",
                        msg : "val 只能包含数字",
                        rule : "numeric",
                        scope : null
                    }
                    this.errors.items.push(rule);
                }
            }else if(val == 1){
                if(this.val && this.val.length <= 50 && this.errors.has('val')) this.errors.remove('val');
            }
        }
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
            this.changeData.type = this.type;
            this.changeData.val = this.val;
            if(this.errors.items.length > 0) return;
            
            if(this.flag) return;
            this.flag = true;
            let url = '/api/config/modify/' + this.info.id;
            modifyList(this, url, this.changeData);
        }
    }
}
</script>

<style lang="scss">

</style>
