<template>
  <div>
    <div class="loading" v-show="!loaded">
      <img src="../../resource/images/loading.gif">
    </div>
    <div class="section article">
      <h1>
        <i class="icon icon-books"></i>文章列表
        <span class="add-icon" @click="add">
          <i class="icon-plus"></i>新增文章
        </span>
      </h1>
      <div class="listTop">
        <div class="category">
          选择分类：
          <select ref="limit" @change="changeCate">
            <option value>全部</option>
            <option v-for="cate in category" :value="cate.id">{{cate.name}}</option>
          </select>
        </div>
        <div class="search">
          <p>
            <input type="text" v-model="title" placeholder="请输入标题查找" maxlength="50" ref="search">
            <i class="icon-search" @click="searchArticle"></i>
          </p>
          <span class="cancel" @click="cancel">
            <i class="icon-cross"></i>取消
          </span>
        </div>
      </div>
      <transition name="init">
        <v-list
          class="init"
          type
          :cateId="cateId"
          :action="initAction"
          @init="loaded=true"
          @resetAction="initAction=false"
          @modify="modify"
          @deleteList="deleteList"
          v-show="listFlag"
        ></v-list>
      </transition>
      <transition name="result">
        <v-list
          class="result"
          type="search"
          :cateId="cateId"
          :title="title"
          :action="searchAction"
          @resetAction="searchAction=false"
          @modify="modify"
          @deleteList="deleteList"
          v-if="searchFlag"
        ></v-list>
      </transition>
    </div>
    <transition name="slide">
      <router-view class="handle" :category="category" :info="info" @update="getList"></router-view>
    </transition>
  </div>
</template>

<script>
import List from "./List";
import { deleteList } from "@/resource/js/common.js";

export default {
  name: "articles",
  data() {
    return {
      category: "",
      cateId: "",
      title: "",
      info: "",
      loaded: false,
      listFlag: true,
      initAction: false,
      searchFlag: false,
      searchAction: false,
      deleteFlag: false
    };
  },
  created() {
    this.$ajax({
      method: "get",
      url: "/api/category"
    })
      .then(res => {
        this.category = res.data;
      })
      .catch(err => {
        console.log("分类列表获取失败！");
      });
  },
  components: {
    "v-list": List
  },
  methods: {
    getList() {
      this.init = true;
    },
    add() {
      this.$router.push("/admin/article/add");
    },
    modify(list) {
      this.info = list;
      this.$router.push("/admin/article/modify/" + list.id);
    },
    deleteList(id) {
      let url = "/api/article/delete/" + id,
        str = "文章";
      deleteList(this, url, str);
    },
    changeCate(e) {
      this.cateId = e.target.value ? parseInt(e.target.value) : "";
    },
    searchArticle() {
      if (!this.title) return;
      if (!this.searchFlag) {
        this.listFlag = false;
        setTimeout(() => {
          this.searchFlag = true;
        }, 300);
      } else {
        this.searchAction = true;
      }
    },
    cancel() {
      if (!this.searchFlag) return;
      this.searchFlag = false;
      setTimeout(() => {
        this.listFlag = true;
      }, 320);
    }
  }
};
</script>

<style lang="scss">
.article {
  .listTop {
    font-size: 13px;
    color: #666;
    height: 30px;
    line-height: 30px;
    margin: 1.5rem 0 1rem 0;
    .category {
      float: left;
      select {
        font-size: 12px;
        width: 100px;
        height: 26px;
        margin: -2px 10px 0 0;
        border-color: #ccc;
        vertical-align: middle;
        option {
          font-size: 13px;
        }
      }
    }
  }
  .search {
    width: 40%;
  }
  .list {
    margin-top: 0 !important;
  }
}
.thumb {
  p {
    width: 100px;
    height: 80px;
    line-height: 80px;
    img {
      max-width: 100px;
      max-height: 80px;
    }
    i {
      font-size: 2.4rem !important;
    }
    input {
      width: 102px;
      height: 82px;
    }
  }
  .cancel,
  .tips {
    left: 112px;
  }
}
.editor {
  position: relative;
  .errors {
    position: absolute;
    right: 10px;
    bottom: 5px;
    color: red;
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
