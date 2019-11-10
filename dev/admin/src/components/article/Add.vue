<template>
  <div>
    <h1 class="head">
      <i class="icon icon-plus"></i>新建文章
      <a href="javascript:history.back();">
        <span class="icon-undo2"></span>返回
      </a>
    </h1>
    <ul class="form">
      <li class="item">
        <p class="left">所属分类：</p>
        <div class="right">
          <select ref="category" @change="selectCate">
            <option :value="cate.id" v-for="cate in category" v-text="cate.name"></option>
          </select>
        </div>
      </li>
      <li class="item">
        <p class="left">标签：</p>
        <div class="right">
          <select ref="tags" @change="selectTag">
            <option value>无</option>
            <option :value="tag" v-for="tag in tags">{{tag}}</option>
          </select>
        </div>
      </li>
      <li class="item">
        <p class="left">
          <strong>*</strong> 文章标题：
        </p>
        <div class="right">
          <input
            type="text"
            class="large"
            name="title"
            v-model="title"
            v-validate="'required|max:50'"
            maxlength="50"
          >
          <b class="errors" v-show="errors.has('title')">{{errors.first('title')}}</b>
        </div>
      </li>
      <li class="item">
        <p class="left">文章描述：</p>
        <div class="right">
          <input
            type="text"
            class="large"
            name="desc"
            v-model="desc"
            v-validate="'max:200'"
            maxlength="200"
          >
          <b class="errors" v-show="errors.has('desc')">{{errors.first('desc')}}</b>
        </div>
      </li>
      <li class="item">
        <p class="left">缩略图：</p>
        <v-upload
          class="thumb"
          :url="thumb"
          size="300kb"
          @uploadFile="uploadFile"
          @cancelUpload="cancelUpload"
        ></v-upload>
      </li>
      <li class="item">
        <p class="left">
          <strong>*</strong> 内容：
        </p>
        <div class="editor">
          <vue-editor :content="content" @updateContent="updateContent"></vue-editor>
          <b class="errors" v-show="leng < 10">还差 {{10 - leng}} 个字</b>
        </div>
      </li>
      <li class="item">
        <p class="left">原创：</p>
        <div class="right" ref="original">
          <label>
            <input name="original" type="radio" value="1" v-model="original"> 是
          </label>
          <label>
            <input name="original" type="radio" value="0" v-model="original"> 否
          </label>
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
import upload from "../tool/Upload";
import editor from "../tool/Editor";
import { formatHtml, toBase64, addList } from "@/resource/js/common.js";

export default {
  props: {
    category: [String, Array]
  },
  data() {
    return {
      cate_id: 1,
      tag: "",
      title: "",
      desc: "",
      thumb: "",
      content: "",
      leng: 0,
      original: 0,
      flag: false
    };
  },
  components: {
    "v-upload": upload,
    "vue-editor": editor
  },
  computed: {
    tags() {
      if (!this.category) return "";
      let tags;
      this.category.forEach(cate => {
        if (cate.id == this.cate_id) tags = cate.tags.split(",");
      });
      return tags;
    }
  },
  watch: {
    content(val, oldval) {
      let text = formatHtml(val);
      this.leng = text.length;
      if (text.length < 10) {
        let rule = {
          field: "content",
          msg: "content 不能少于10个字",
          rule: "min",
          scope: null
        };
        this.errors.items.push(rule);
      } else {
        if (this.errors.has("content")) this.errors.remove("content");
      }
    }
  },
  methods: {
    selectCate(e) {
      this.cate_id = parseInt(e.target.value);
      this.tag = "";
    },
    selectTag(e) {
      this.tag = e.target.value;
    },
    updateContent(val) {
      this.content = val;
    },
    uploadFile(img) {
      toBase64(this, img, "thumb");
    },
    cancelUpload() {
      this.thumb = "";
    },
    add() {
      if (!this.title && !this.content) return;
      if (this.errors.items.length > 0) return;

      if (this.flag) return;
      this.flag = true;
      let url = "/api/article/store";
      let params = {
        cate_id: this.cate_id,
        tag: this.tag,
        title: this.title,
        desc: this.desc,
        thumb: this.thumb,
        content: this.content,
        original: this.original
      };
      addList(this, url, params, "article");
    }
  }
};
</script>

<style lang="scss">
</style>
