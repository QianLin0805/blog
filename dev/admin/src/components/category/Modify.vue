<template>
    <div>
        <h1 class="head"><i class="icon icon-quill"></i>修改分类<a href="javascript:history.back()"><span class="icon-undo2"></span>返回</a></h1>
        <ul class="form" v-if="info">
            <li class="item">
                <p class="left"><strong>*</strong> 分类名称：</p>
                <div class="right">
                    <input type="text" name="name" v-model="name" v-validate="'required|max:20'" maxlength="20" />
                    <b class="errors" v-show="errors.has('name')">{{errors.first('name')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 英文名：</p>
                <div class="right">
                    <input type="text" name="alias" v-model="alias" v-validate="'required|max:30|regex:^[a-zA-Z_]+$'" maxlength="20" />
                    <b class="errors" v-show="errors.has('alias')">{{errors.first('alias')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 分类标题：</p>
                <div class="right">
                    <input type="text" class="middle" name="title" v-model="title" v-validate="'required|max:50'" maxlength="50" />
                    <b class="errors" v-show="errors.has('title')">{{errors.first('title')}}</b>
                </div>
            </li>
            <li class="item">
                <p class="left">标签：</p>
                <div class="right tags" v-if="rerender">
                    <p v-if="tag" v-for="(tag, index) in tags">
                        <input type="text" :name="'tags'+index" v-model="tags[index].val" v-validate="'max:30|regex:^[a-zA-Z0-9一-龥_]+$'" maxlength="30" />
                        <span v-if="tags.length > 1" class="delete" @click="removetag(index)">删除</span>
                        <b class="errors" v-show="errors.has('tags'+index)">格式错误</b>
                    </p>
                    <span class="multi" @click="addtag">新增标签</span>
                </div>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 海报图：</p>
                <v-upload class="banner" :url="banner" size="2M" field="banner" @uploadFile="uploadFile" @cancelUpload="cancelUpload"></v-upload>
                <b class="errors" v-show="errors.has('banner')">{{errors.first('banner')}}</b>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 展示图：</p>
                <v-upload class="poster" :url="poster" size="2M" field="poster" @uploadFile="uploadFile" @cancelUpload="cancelUpload"></v-upload>
                <b class="errors" v-show="errors.has('poster')">{{errors.first('poster')}}</b>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 默认缩略图：</p>
                <v-upload class="def_thumb" :url="def_thumb" size="300kb" field="def_thumb" @uploadFile="uploadFile" @cancelUpload="cancelUpload"></v-upload>
                <b class="errors" v-show="errors.has('def_thumb')">{{errors.first('def_thumb')}}</b>
            </li>
            <li class="item">
                <p class="left"><strong>*</strong> 描述：</p>
                <div class="right">
                    <textarea name="desc" v-model="desc" v-validate="'required|min:10|max:500'" maxlength="500" resize="none"></textarea>
                    <b class="errors" v-show="errors.has('desc')">{{errors.first('desc')}}</b>
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
                    <button id="add" @click="modify">修 改</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import upload from '../tool/Upload'
import {toBase64, isModified, modifyList} from '@/resource/js/common.js'

export default {
    props : {
        info : [String, Object]
    },
    data () {
        return {
            name : this.info.name,
            alias : this.info.alias,
            title : this.info.title,
            banner : this.info.banner,
            poster : this.info.poster,
            def_thumb : this.info.def_thumb,
            desc : this.info.desc,
            order : this.info.order,
            changed : false,
            changeData : {},
            rerender : true,
            flag : false
        }
    },
    created () {
        if(!this.info) this.$router.replace({name : 'category'});
    },
    computed : {
        tags(){
            if(this.info && this.info.tags.length > 0){
                let  tags = [];
                this.info.tags.forEach((el) => {
                    if(el) tags.push({val:el});
                });
                return tags;
            }else{
                return [{val:''}];
            }
        }
    },
    components : {
        'v-upload' : upload
    },
    methods : {
        uploadFile(img, field){
            toBase64(this, img, field);
        },
        cancelUpload(field){
            this[field] = '';
        },
        noneUpload(field){
            let rule = {
                field : field,
                msg : "请上传 " + field,
                rule : "required",
                scope : null
            }
            this.errors.items.push(rule);
        },
        addtag(){
            this.tags.push({val:''})
            this.rerender = false;
            this.rerender = true;
        },
        removetag(index){
            let i = 0;
            this.tags.forEach((tag) => {
                if(tag) i++;
            });
            if(i > 1){
                if(this.errors.has('tags'+index)) this.errors.remove('tags'+index);
                delete this.tags[index];
                this.rerender = false;
                this.rerender = true;
            }
        },
        modify(){
            this.changeData = {};
            let arr = ['id', 'parentName'];
            isModified(this, arr, 'info');
            if(!this.changed){
                this.$layer.msg('未做任何修改', () => {
                    this.$layer.closeAll();
                });
                return;
            }
            if(!this.banner){
                this.noneUpload('banner');
                return;
            }
            if(!this.poster){
                this.noneUpload('poster');
                return;
            }
            if(!this.def_thumb){
                this.noneUpload('def_thumb');
                return;
            }
            if(this.errors.items.length > 0) return;
            if(this.changeData.tags){
                let tags = [];
                this.tags.forEach((el) => {
                    if(el && el.val) tags.push(el.val);
                });
                this.changeData.tags = tags.join(',');
            }

            if(this.flag) return;
            this.flag = true;
            let url = '/api/category/modify/' + this.info.id;
            modifyList(this, url, this.changeData)
        }
    }
}
</script>

<style lang="scss">

</style>
