<template>
  <div class="log-reg register">
    <slot></slot>
    <div class="wrap">
      <h1>
        <b>注册</b>
        <span class="fr">已有帐号，前往 <router-link to="login">登录</router-link></span>
      </h1>
      <p class="errorinfo">
        <b class="errors" v-show="errors.has('username')">{{errors.first('username')}}</b>
        <b class="errors" v-show="!errors.has('username') && errors.has('password')">{{errors.first('password')}}</b>
        <b class="errors" v-show="!errors.has('username') && !errors.has('password') && errors.has('confirm')">{{errors.first('confirm')}}</b>
      </p>
      <div class="form-item">
        <span class="icon icon-user"></span>
        <input type="text" name="username" @keyup="onEnter" placeholder="请输入用户名" autocomplete="off" v-validate="regParam.username" v-model="username" maxlength="30">
        <span class="icon-check-alt" v-show="nameEnable"></span>
      </div>
      <div class="form-item">
        <span class="icon icon-lock"></span>
        <input type="password" name="password" @keyup="onEnter" placeholder="请输入密码" autocomplete="off" v-validate="regParam.password" v-model="password" maxlength="30">
      </div>
      <div class="form-item">
        <span class="icon icon-lock"></span>
        <input type="password" name="confirm" @keyup="onEnter" placeholder="请确认密码" autocomplete="off" v-model="confirm" @blur="testConfirm">
      </div>
      <button type="submit" @click="register">Register</button>
    </div>
  </div>
</template>

<script>
import { getCookie } from "@/public/utils.js";

export default {
  name: "register",
  data() {
    return {
      regParam: {
        username: {
          required: true,
          min: 2,
          max: 30,
          regex: /\w/g
          // regex: /^(?![0-9]+$)(?![a-z]+$)[0-9a-z]+_?[0-9a-z]+$/i
        },
        password: {
          required: true,
          min: 6,
          max: 30,
          // regex: /^(?![0-9]+$)(?![a-z]+$)[0-9a-z]+$/i
        }
      },
      username: "",
      password: "",
      confirm: "",
      nameEnable: false,
      checkState: false,
      timer: "",
      flag: false
    };
  },
  created() {
    //let ptn = /^[a-zA-Z]+[\w-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[\w-]+[a-zA-Z0-9]+(\.[a-zA-Z]+){1,2}$/i; 邮箱格式验证正则
    if (getCookie("token") && getCookie("userid")) this.$router.replace({name: 'index'});
  },
  mounted() {
    window.onkeyup = e => {
      if (this.$route.name != "register") return;
      if (e.keyCode == 13) this.register();
    };
  },
  watch: {
    // 验证用户名是否可用
    username(val, oldval) {
      if (!/^\w{2}/i.test(val)) {
        this.nameEnable = false;
        return;
      }
      if (this.timer) clearTimeout(this.timer);

      this.timer = setTimeout(() => {
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
          if (res.data.length <= 0) {
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
    testConfirm() {
      if (!this.password) return;
      if (this.confirm != this.password) {
        let rule = {
          field: "confirm",
          msg: "密码不一致",
          rule: "match",
          scope: null
        };
        this.errors.items.push(rule);
      }
    },
    onEnter: function (e) {
      if (e.keyCode == 13) {
        this.$validator.validate().then(valid => {
          if (valid) this.register();
        });
      }
    },
    register() {
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
          msg: "用户名已存在",
          rule: "match",
          scope: null
        };
        this.errors.items.push(rule);
      }
      this.testConfirm();
      if (this.errors.items.length > 0) return;
      if (this.flag) return;
      this.flag = true;

      this.$ajax({
        method: "post",
        url: "/register",
        data: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        let _this = this;
        this.$layer({
          content: '注册成功',
          callback: function () {
            _this.$router.push({name: 'login'});
          }
        });
      }).always(() => {
        this.flag = false;
      });
    }
  }
};
</script>

<style lang="scss">
@import "../source/css/log_reg.scss";

.register {
  .wrap {
    h1 {
      font-size: 40px;
      line-height: 70px;
      margin-bottom: 10px;
      padding: 0 2px;

      span {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.75);
        line-height: 14px;
        margin-top: 40px;

        a {
          color: #fff;
        }
      }
    }
    @include common();
  }
}
</style>