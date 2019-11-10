<template>
  <div>
    <h1 class="head">
      <i class="icon icon-quill"></i>修改文章
      <a href="javascript:history.back()">
        <span class="icon-undo2"></span>返回
      </a>
    </h1>
    <ul class="form" v-if="info">
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
          <button id="modify" @click="modify">修 改</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import upload from "../tool/Upload";
import editor from "../tool/Editor";
import {
  formatHtml,
  toBase64,
  isModified,
  modifyList
} from "@/resource/js/common.js";

export default {
  props: {
    category: [String, Array],
    info: [String, Object]
  },
  data() {
    return {
      cate_id: this.info.cate_id,
      tag: this.info.tag,
      title: this.info.title,
      desc: this.info.desc,
      thumb: this.info.thumb,
      content: this.info.content,
      leng: this.info ? formatHtml(this.info.content).length : 0,
      original: this.info.original,
      changed: false,
      changeData: {},
      flag: false
    };
  },
  created() {
    if (!this.info) {
      this.$router.replace({ name: "article" });
      return;
    }
    let index;
    this.category.forEach((cate, i) => {
      if (cate.id == this.cate_id) index = i;
    });
    this.$nextTick(function() {
      this.$refs.category.selectedIndex = index;
    });
  },
  computed: {
    tags() {
      if (!this.category) return "";
      let tags, index;
      this.category.forEach(cate => {
        if (cate.id == this.cate_id) tags = cate.tags.split(",");
      });
      tags.forEach((t, i) => {
        if (t == this.tag) index = i;
      });
      this.$nextTick(function() {
        this.$refs.tags.selectedIndex = index + 1;
      });
      return tags;
    }
  },
  components: {
    "v-upload": upload,
    "vue-editor": editor
  },
  watch: {
    content(val, oldval) {
      let text = formatHtml(val);
      this.leng = text.length;
      if (text.length < 10) {
        let rule = {
          field: "content",
          msg: "content 不能少于10个字符",
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
    modify() {
      this.changeData = {};
      let arr = ["id", "category", "datetime", "views", "reply"];
      isModified(this, arr, "info");
      if (!this.changed) {
        this.$layer.msg("未做任何修改", () => {
          this.$layer.closeAll();
        });
        return;
      }
      if (this.errors.items.length > 0) return;

      if (this.flag) return;
      this.flag = true;
      let url = "/api/article/modify/" + this.info.id;
      modifyList(this, url, this.changeData);
    }
  }
};
</script>

<style lang="scss">
</style>
