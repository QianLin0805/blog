<template>
    <div>
        <h1 class="head"><i class="icon icon-plus"></i>添加友情链接<a href="javascript:history.back();"><span class="icon-undo2"></span>返回</a></h1>
        <ul class="form">
            <li class="item">
                <p class="left"><strong>*</strong> 链接名称：</p>
                <div class="right">
                    <input type="text" name="name" v-model="name" v-validate="'required|max:20|regex:^[a-zA-Z0-9一-龥_]+$'" maxlength="20" />
                    <b class="errors" v-show="errors.has('name')">{{errors.first('name')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 链接地址：</p>
                <div class="right">
                    <input type="text" class="large" name="url" v-model="url" v-validate="'required|url|max:500'" maxlength="500" />
                    <b class="errors" v-show="errors.has('url')">{{errors.first('url')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left">图标：</p>
                <v-upload class="logo" :url="logo" size="100kb" @uploadFile="uploadFile" @cancelUpload="cancelUpload"></v-upload>
            </li>
            <li class="item">
                <p class="left">描述：</p>
                <div class="right">
                    <textarea name="desc" v-model="desc" v-validate="'max:255'" maxlength="255" resize="none"></textarea>
                    <b class="errors" v-show="errors.has('desc')">{{errors.first('desc')}}</b>
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
import upload from '../tool/Upload'
import {toBase64, addList} from '@/resource/js/common.js'

export default {
    data () {
        return {
            name : '',
            url : '',
            logo : '',
            desc : '',
            flag : false
        }
    },
    components : {
        'v-upload' : upload
    },
    methods : {
        uploadFile(img){
            toBase64(this, img, 'logo');
        },
        cancelUpload(){
            this.logo = '';
        },
        add(){
            if(!this.name || !this.url) return;
            if(this.errors.items.length > 0) return;
            
            if(this.flag) return;
            this.flag = true;
            let url = '/api/links/store';
            let params = {
                'name' : this.name,
                'url' : this.url,
                'logo' : this.logo,
                'desc' : this.desc
            }
            addList(this, url, params);
        }
    }
}
</script>

<style lang="scss">

</style>
