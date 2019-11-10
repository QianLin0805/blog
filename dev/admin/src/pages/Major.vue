<template>
  <div class="index">
    <div class="nav">
      <p class="brand"><a href="/web" title="首页"><span class="icon-home"></span></a>博客管理系统</p>
      <div class="right">
        <a title="登出" @click="loginOut"><span class="icon icon-switch"></span></a>
      </div>
    </div>
    <div class="main-ctn">
      <div class="menu">
        <p><router-link :to="{name:'index'}"><i class="icon-newspaper"></i>总览</router-link></p>
        <p><router-link :to="{name:'category'}"><i class="icon-pie-chart"></i>分类管理</router-link></p>
        <!-- <p><router-link :to="{name:'article'}"><i class="icon-books"></i>文章管理</router-link></p>
        <p><router-link :to="{name:'comment'}"><i class="icon-bubble" style="font-size: 1.25rem;"></i>评论管理</router-link></p>
        <p><router-link :to="{name:'users'}"><i class="icon-user" style="font-size: 1.4rem;"></i>用户列表</router-link></p>
        <p><router-link :to="{name:'links'}"><i class="icon-link"></i>友情链接</router-link></p>
        <p><router-link :to="{name:'config'}"><i class="icon-cog"></i>网站配置</router-link></p> -->
      </div>
      <keep-alive><router-view class="main"></router-view></keep-alive>
    </div>
    <footer>Copyright 2019 Designed by xm</footer>
  </div>
</template>

<script>
import { getCookie, setCookie, getSign } from "@/public/utils.js";

export default {
  name: 'major',
  mounted() {
    // 每5分钟自动刷新token
    let timer = setInterval(() => {
      this.tokenFresh();
    }, 5 * 60 * 1000);

    // 30分钟不操作登录失效
    let timerClear;
    function tokenClear() {
      timerClear = setTimeout(() => {
        setCookie('token', '', -1);
        clearInterval(timer);
      }, 30 * 60 * 1000);
    }
    tokenClear();
    document.onmousemove = document.onmousedown = document.onkeydown = function () {
      clearTimeout(timerClear);
      tokenClear();
    };
  },
  methods: {
    loginOut() {
      setCookie('token', '', -1);
      window.location.reload();
    },
    tokenFresh() {
      this.$ajax({
        method: 'get',
        url: '/user/token/freshToken',
        data: getSign({
          token: getCookie('token')
        })
      }).then(res => {
        let token = res.data.token;
        if (token) {
          setCookie('token', token);
        }
      });
    }
  }
}
</script>

<style lang="scss">
.index {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  .nav {
    display: flex;
    position: relative;
    z-index: 1;
    flex-direction: row;
    color: #fff;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #333;
    a {
      display: inline-block;
      font-size: 16px;
      color: #fff;
      text-align: center;
      width: 48px;
      height: 100%;
      vertical-align: top;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.25);
      }
      span {
        vertical-align: top;
      }
    }
    .brand {
      flex: 0 0 250px;
      font-size: 18px;
    }
    .right {
      flex: auto;
      text-align: right;
    }
  }
  .main-ctn {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 90px);
    background: #f8f8f8;
    .menu {
      flex: 0 0 250px;
      overflow-x: hidden;
      overflow-y: visible;
      background: #ed5a5a;
      p {
        font-size: 15px;
        height: 45px;
        line-height: 45px;
        a {
          position: relative;
          display: block;
          color: #fff;
          padding-left: 48px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          i {
            display: inline-block;
            width: 20px;
            font-size: 15px;
            margin-right: 5px;
          }
          &.active {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    .main {
      flex: auto;
      position: relative;
      overflow: hidden;
      .loading {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 888;
        width: 100%;
        height: 100%;
        background: #fff;
        img {
          position: absolute;
          left: 50%;
          top: 45%;
          transform: translate3d(-50%, -50%, 0);
        }
      }
      .section {
        overflow-x: hidden;
        overflow-y: visible;
        height: calc(100% - 30px);
        padding: 10px 20px 20px;
        h1.title {
          position: relative;
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
          .add {
            float: right;
            font-size: 13px;
            color: #47a4e9;
            margin-right: 10px;
            cursor: pointer;
            i {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  footer {
    font-size: 12px;
    color: white;
    text-align: center;
    height: 40px;
    line-height: 40px;
    background: #393535;
  }
}
</style>
