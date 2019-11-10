<template>
  <div class="list">
    <table>
      <tr class="title">
        <th>文章标题</th>
        <th width="100px">分类</th>
        <th width="120px">发布时间</th>
        <th width="90px">点击量</th>
        <th width="80px">评论数</th>
        <th width="140px">操作</th>
      </tr>
      <tr class="empty" v-if="tips">
        <td colspan="6" v-html="tips"></td>
      </tr>
      <tr v-if="lists.length > 0" v-for="list in lists">
        <td v-text="list.title" style="text-align: left; padding: 0.8rem 10px;"></td>
        <td v-text="list.category"></td>
        <td v-parseDate="list.datetime" class="datetime"></td>
        <td v-text="list.views"></td>
        <td></td>
        <td>
          <span class="modify" @click="modify(list)">修改</span>
          <span class="delete" @click="deleteList(list.id)">删除</span>
        </td>
      </tr>
    </table>
    <v-pages
      v-if="count/limit > 1"
      :limit="limit"
      :page="page"
      :count="count"
      @changeLimit="changeLimit"
      @skip="skip"
    ></v-pages>
  </div>
</template>

<script>
import Pages from "../tool/Pages";
import { formatDate } from "@/resource/js/common.js";

export default {
  name: "articleList",
  props: {
    type: String,
    cateId: [String, Number],
    title: String,
    action: Boolean
  },
  data() {
    return {
      lists: "",
      count: 0,
      tips: "",
      limit: 10,
      page: 1,
      flag: false
    };
  },
  created() {
    this.getList();
  },
  components: {
    "v-pages": Pages
  },
  directives: {
    parseDate: {
      bind: function(el, binding) {
        el.innerText = formatDate(binding.value, false);
      }
    }
  },
  watch: {
    cateId(val, oldval) {
      this.page = 1;
      this.getList();
    },
    limit(val, oldval) {
      this.page = 1;
      this.getList();
    },
    page(val, oldval) {
      this.getList();
    },
    action(val, oldval) {
      if (val) this.getList();
    }
  },
  methods: {
    getList() {
      if (this.flag) {
        this.$layer.msg("请稍后再试！", () => {
          vue.$layer.closeAll();
        });
        return;
      }
      this.flag = true;
      this.tips =
        this.type == "search" ? "正在加载，请稍后！" : "正在查找，请稍后！";
      this.lists = [];

      let cateId = this.cateId ? "&cateid=" + this.cateId : "";
      let params = "?page=" + this.page + "&limit=" + this.limit + cateId;
      let url =
        this.type == "search"
          ? "/api/article/search/" + this.title + params
          : "/api/article" + params;
      this.$ajax({
        method: "get",
        url: url
      })
        .then(res => {
          this.lists = res.data.list;
          this.count = res.data.count;
          if (this.count <= 0) {
            if (this.type == "search") {
              this.tips =
                "没有找到标题包含 <span>" + this.title + "</span> 的文章！";
            } else {
              this.tips = "一篇文章也没有，快去发布一个吧！";
            }
          } else {
            this.tips = "";
          }
          this.flag = false;
          this.$emit("resetAction");
          if (!this.type) this.$emit("init");
        })
        .catch(err => {
          this.flag = false;
          this.$emit("resetAction");
          if (this.type == "search") {
            this.tips = "数据获取失败，请刷新后再试！";
          } else {
            this.$emit("init");
            this.tips = "搜索出错！";
          }
        });
    },
    modify(list) {
      this.$emit("modify", list);
    },
    deleteList(id) {
      this.$emit("deleteList", id);
    },
    changeLimit(num) {
      this.limit = num;
    },
    skip(page) {
      if (this.flag) return;
      this.page = page;
    }
  }
};
</script>

<style>
</style>
