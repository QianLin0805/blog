<template>
  <div>
    <h2 class="title">
      <i class="icon icon-plus"></i>添加分类
      <a class="back" href="javascript:history.back();"><span class="icon-undo2"></span>返回</a>
    </h2>
    <div class="form-ctn">
      <ul class="form">
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
            <p v-for="(tag, index) in tags" v-if="tag">
              <input type="text" :name="'tags'+index" v-model="tags[index].val" v-validate="'max:30|regex:^[a-zA-Z0-9一-龥_]+$'" maxlength="30" />
              <span v-if="tags.length > 1" class="delete" @click="removetag(index)">删除</span>
              <b class="errors" v-show="errors.has('tags'+index)">格式错误</b>
            </p>
            <span class="multi" @click="tags.push({val:''})">新增标签</span>
          </div>
        </li>
        <li class="item">
          <p class="left"><strong>*</strong> 海报图：</p>
          <v-upload class="banner" size="2M" width="384" height="80" field="banner" :url="banner" @uploadFile="uploadFile" @cancelUpload="cancelUpload"></v-upload>
          <!-- <b class="errors" v-show="errors.has('banner')">{{errors.first('banner')}}</b> -->
        </li>
        <li class="item">
          <p class="left"><strong>*</strong> 展示图：</p>
          <v-upload class="poster" size="2M" width="240" height="120" field="poster" :url="poster" @uploadFile="uploadFile" @cancelUpload="cancelUpload"></v-upload>
          <!-- <b class="errors" v-show="errors.has('poster')">{{errors.first('poster')}}</b> -->
        </li>
        <li class="item">
          <p class="left"><strong>*</strong> 默认缩略图：</p>
          <v-upload class="def_thumb" size="300kb" width="100" height="80" field="def_thumb" :url="def_thumb" @uploadFile="uploadFile" @cancelUpload="cancelUpload"></v-upload>
          <!-- <b class="errors" v-show="errors.has('def_thumb')">{{errors.first('def_thumb')}}</b> -->
        </li>
        <li class="item">
          <p class="left"><strong>*</strong> 描述：</p>
          <div class="right">
            <textarea name="desc" v-model="desc" v-validate="'required|min:10|max:500'" maxlength="500" resize="none"></textarea>
            <b class="errors" v-show="errors.has('desc')">{{errors.first('desc')}}</b>
          </div>
        </li>
      </ul>
    </div>
    <p class="save"><button id="save" @click="add">添 加</button></p>
  </div>
</template>

<script>
import upload from '../components/Upload'
import { toBase64, addList } from '@/public/utils.js'

export default {
  data() {
    return {
      name: '',
      alias: '',
      title: '',
      tags: [{ val: '' }],
      banner: '',
      poster: '',
      def_thumb: '',
      desc: '',
      rerender: true,
      flag: false
    }
  },
  components: {
    'v-upload': upload
  },
  methods: {
    uploadFile(img, field) {
      toBase64(this, img, field);
    },
    cancelUpload(field) {
      this[field] = '';
    },
    noneUpload(field) {
      let rule = {
        field: field,
        msg: "请上传 " + field,
        rule: "required",
        scope: null
      }
      this.errors.items.push(rule);
    },
    removetag(index) {
      let i = 0;
      this.tags.forEach((tag) => {
        if (tag) i++;
      });
      if (i > 1) {
        if (this.errors.has('tags' + index)) this.errors.remove('tags' + index);
        delete this.tags[index];
        this.rerender = false;
        this.rerender = true;
      }
    },
    add() {
      if (!this.name || !this.alias || !this.title || !this.desc) return;
      if (!this.banner) {
        this.noneUpload('banner');
        return;
      }
      if (!this.poster) {
        this.noneUpload('poster');
        return;
      }
      if (!this.def_thumb) {
        this.noneUpload('def_thumb');
        return;
      }
      if (this.errors.items.length > 0) return;

      if (this.flag) return;
      this.flag = true;
      let tags = [];
      this.tags.forEach((el) => {
        if (el && el.val) tags.push(el.val);
      });
      let url = '/api/category/store';
      let params = {
        'name': this.name,
        'alias': this.alias,
        'title': this.title,
        'tags': tags.join(','),
        'desc': this.desc,
        'banner': this.banner,
        'poster': this.poster,
        'def_thumb': this.def_thumb
      }
      addList(this, url, params);
    }
  }
}
</script>

<style lang="scss">
@import "../source/css/edit.scss";
@include edit();

</style>
