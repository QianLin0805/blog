<template>
  <div>
    <div class="loading" v-show="loaded"><img src="../source/images/loading.gif" /></div>
    <div class="section summary">
      <h1 class="title"><i class="icon icon-newspaper"></i>数据总览</h1>
      <ul>
        <li class="users">
          <span class="icon-users"></span><strong>{{userCount}}</strong>
          <p>用户 / users</p>
        </li>
        <li class="views">
          <span class="icon-eye" style="font-size: 5.2rem;"></span><strong>{{viewsCount}}</strong>
          <p>访问量 / views</p>
        </li>
        <li class="articles">
          <span class="icon-books"></span><strong>{{articleCount}}</strong>
          <p>文章数 / articles</p>
        </li>
        <li class="replies">
          <span class="icon-bubble" style="color: rgba(255,255,255,.4)"></span><strong>{{replyCount}}</strong>
          <p>评论数 / replies</p>
        </li>
      </ul>
      <h2><i class="icon icon-file-text2" style="font-size: 1.2rem; color: #666;"></i>系统基本信息</h2>
      <div class="info">
        <p><b>系统版本</b><span>{{version}}</span></p>
        <p><b>上传大小限制</b><span>{{uploadLimit}}</span></p>
        <p><b>北京时间</b><span>{{date}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie, formatDate } from '@/public/utils.js'

export default {
  name: 'home',
  data() {
    return {
      token: getCookie('token'),
      userid: getCookie('userid'),
      userCount: 0,
      viewsCount: 0,
      articleCount: 0,
      replyCount: 0,
      version: '',
      date: formatDate(),
      loaded: false
    }
  },
  created() {
    this.getDatas();
  },
  watch: {
    $route(to, from) {
      if (to.name == 'index') this.getDatas();
    }
  },
  computed: {
    uploadLimit() {
      // return this.$store.state.common.uploadLimit;
    }
  },
  methods: {
    getDatas() {
      // this.$ajax({
      //   type: 'get',
      //   url: '/api/pandect',
      //   headers: {
      //     token: this.token
      //   }
      // }).then((res) => {
      //   let datas = res.data;
      //   this.userCount = datas.userCount;
      //   this.viewsCount = eval(datas.viewsCount.map(el => { return el.views }).join('+'));
      //   this.articleCount = datas.articleCount;
      //   this.replyCount = datas.replyCount;
      //   this.version = datas.version;
      //   this.loaded = true;
      // });
    }
  }
}
</script>

<style lang="scss">
.summary {
  ul {
    overflow: hidden;
    min-height: calc(100% - 218px);
    margin-top: 15px;
    li {
      position: relative;
      float: left;
      color: #fff;
      text-align: right;
      width: 280px;
      height: 80px;
      background: #fff;
      padding: 42px 24px 32px 0;
      margin: 0 30px 30px 0;
      border: 1px solid #eee;
      border-top-color: #ccc;
      border-radius: 3px;
      transition: all 0.15s ease;
      &.users {
        background: #ed5a5a;
      }
      &.views {
        background: #47a4e9;
      }
      &.articles {
        background: #00b17d;
      }
      &.replies {
        background: #ffb94a;
      }
      &:hover {
        box-shadow: 0px 2px 5px #ddd;
      }
      span {
        position: absolute;
        left: 35px;
        top: 50%;
        font-size: 70px;
        color: rgba(255, 255, 255, 0.35);
        margin-top: -35px;
      }
      strong {
        display: inline-block;
        font-size: 40px;
        height: 40px;
        line-height: 40px;
      }
      p {
        font-size: 16px;
        line-height: 30px;
      }
    }
  }
  h2 {
    font-size: 16px;
    color: #333;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    .icon {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      color: #7a7a7a;
      vertical-align: top;
      margin-right: 6px;
    }
  }
  .info {
    overflow: hidden;
    p {
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      b {
        display: inline-block;
        text-align: right;
        width: 130px;
        padding-right: 12px;
        border-right: 1px solid #e5e5e5;
      }
      span {
        margin-left: 12px;
      }
      &:last-child {
        border-bottom: 1px solid #e5e5e5;
      }
      &:nth-child(even) {
        color: #555;
        background: #eee;
        b {
          border-color: #fff;
        }
      }
    }
  }
}
</style>
