<template>
  <div>
    <div class="loading" v-show="!loaded"><img src="../source/images/loading.gif" /></div>
    <div class="section category">
      <h1 class="title">
        <i class="icon icon-pie-chart"></i>分类列表
        <span class="add" @click="add"><i class="icon-plus"></i>添加分类</span>
      </h1>
      <table class="list">
        <tr class="title">
          <th width="90px">名称</th>
          <th width="160px">标题</th>
          <th>描述</th>
          <th width="100px">标签</th>
          <th width="140px">操作</th>
        </tr>
        <tr class="empty" v-if="lists.length <= 0"><td colspan="5">{{tips}}</td></tr>
        <tr v-if="lists.length > 0" v-for="(list, index) in lists">
          <td v-text="list.name"></td>
          <td v-text="list.title"></td>
          <td class="desc" v-html="list.desc"></td>
          <td class="tags"><p v-if="list.tags"><span v-for="(tag, i) in list.tags"><br v-if="i!=0" />{{tag}}</span></p></td>
          <td class="btns"><span class="modify" @click="modify(list)">修改</span><span class="delete" @click="deleteList(list.id)">删除</span></td>
        </tr>
      </table>
    </div>
    <transition name="slide"><router-view class="edit" :info="info" @update="getList"></router-view></transition>
  </div>
</template>

<script>
import { getSign, deleteList } from '@/public/utils.js'

export default {
  name: 'category',
  data() {
    return {
      lists: '',
      info: '',
      tips: '一个分类也没有，快去新建一个吧！',
      deleteFlag: false,
      loaded: false
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$ajax({
        method: 'get',
        url: '/category/list',
        data: getSign({})
      }).then(res => {
        res.data.forEach(list => {
          if (list.tags) list.tags = list.tags.split(',');
        });
        this.lists = res.data;
        this.loaded = true;
      });
    },
    add() {
      if (!this.loaded) return;
      this.$router.push('category/add');
    },
    modify(list) {
      this.info = list;
      this.$router.push('category/modify/' + list.id);
    },
    deleteList(id) {
      let url = '/api/category/delete/' + id, str = '分类';
      deleteList(this, url, str);
    }
  }
}
</script>

<style lang="scss">
@import "../source/css/section.scss";

.category {
  @include section();
  .list {
    .desc {
      padding: 10px !important;
    }
  }
}
</style>
