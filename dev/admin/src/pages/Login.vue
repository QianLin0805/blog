<template>
  <div class="log-reg login">
    <slot></slot>
    <div class="wrap">
      <h1>Welcome</h1>
      <p class="errorinfo">
        <b class="errors" v-show="errors.has('username')">{{errors.first('username')}}</b>
        <b class="errors" v-show="!errors.has('username') && errors.has('password')">{{errors.first('password')}}</b>
      </p>
      <div class="form-item">
        <i class="icon icon-user"></i>
        <input type="text" name="username" @keyup="onEnter" placeholder="请输入用户名" autocomplete="off" v-model="username" v-validate="regParam.username" maxlength="30" style="padding-right: 20px;">
        <span class="icon-check-alt" v-show="nameEnable"></span>
      </div>
      <div class="form-item">
        <i class="icon icon-lock"></i>
        <input type="password" name="password" @keyup="onEnter" placeholder="请输入密码" autocomplete="off" v-model="password" v-validate="regParam.password" maxlength="30">
      </div>
      <button type="login" @click="login">Login</button>
      <div class="links">
        <a href="/web" class="fl">前往首页</a>
        <router-link to="register">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie } from "@/public/utils.js";

export default {
  name: "login",
  data() {
    return {
      regParam: {
        username: {
          required: true,
          min: 2,
          max: 30,
          regex: /\w/g
          // regex: /^(?![0-9]+$)(?![a-z]+$)[0-9a-z]+_?[0-9a-z]+$/i   字母和数字组合，可包含_
        },
        password: {
          required: true,
          min: 6,
          max: 30,
          // regex: /^(?![0-9]+$)(?![a-z]+$)[0-9a-z]+$/i   字母和数字组合
        }
      },
      username: "",
      password: "",
      nameEnable: false,
      checkState: false,
      timer: "",
      flag: false
    };
  },
  created() {
    if (getCookie("token") && getCookie("userid")) this.$router.replace({name: 'index'});
  },
  mounted() {
    window.onkeyup = e => {
      if (this.$route.name != "login") return;
      if (e.keyCode == 13) this.login();
    };
  },
  watch: {
    username(val, oldval) {
      if (!/^\w{2}/i.test(val)) {
        this.nameEnable = false;
        return;
      }
      if (this.timer) clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        if (!val) return;
        if (this.checkState) return;
        this.checkState = true;
        if (this.errors.has("username")) this.errors.remove("username");

        this.$ajax({
          method: "get",
          url: "/user/username/" + val,
          headers: {
            catch: true
          }
        }).then(res => {
          if (res.data.length > 0) {
            this.nameEnable = true;
          } else {
            this.nameEnable = false;
          }
        }).always(() => {
          this.checkState = false;
        });
      }, 800);
    }
  },
  methods: {
    onEnter: function (e) {
      if (e.keyCode == 13) {
        this.$validator.validate().then(valid => {
          if (valid) this.login();
        });
      }
    },
    login() {
      if (!this.username || !this.password) return;
      if (this.checkState) {
        this.$layer({
          type: 'warning',
          content: '请检查用户名是否可用！',
        });
        return;
      }
      if (!this.nameEnable) {
        let rule = {
          field: "username",
          msg: "用户名不存在",
          rule: "match",
          scope: null
        };
        this.errors.items.push(rule);
      }
      if (this.errors.items.length > 0) return;
      if (this.flag) return;
      this.flag = true;

      this.$ajax({
        method: "post",
        url: "/login",
        data: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        setCookie("token", res.data.token);
        setCookie("userid", res.data.userid);
        setCookie("username", res.data.username);
        setCookie("level", res.data.level);
        this.$emit("freshCookie");
        if (res.data.level == 1) {
          this.$router.push({name: 'index'});
        } else {
          this.$router.push("/web");
        }
      }).always(() => {
        this.flag = false;
      });
    }
  }
};
</script>

<style lang="scss">
@import "../source/css/log_reg.scss";

.login {
  .wrap {
    h1 {
      font-size: 40px;
      text-align: center;
      line-height: 70px;
    }
    @include common();

    .links {
      text-align: right;
      margin-top: 14px;

      a {
        color: #fff;
        padding: 0 5px;
      }
    }
  }
}
</style>