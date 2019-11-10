import router from '@/router';
import axios from 'axios';
import Validate, { Validator } from 'vee-validate';
import { Message, MessageBox } from 'element-ui';
import { setCookie, getCookie, getSign } from './utils';
require('es6-promise-always');  // 扩展 axios.always
// import zh_CN from 'vee-validate/dist/locale/zh_CN';

function layer(options) {
  if (options.type == 'danger') {
    MessageBox({
      dangerouslyUseHTMLString: true,
      type: 'error',
      title: '提示',
      showClose: true,
      message: options.content,
      callback: function () {
        if (typeof options.callback == 'function') {
          options.callback();
        }
      }
    });
  } else if (options.type == 'warning') {
    Message({
      dangerouslyUseHTMLString: true,
      type: 'warning',
      customClass: 'warning',
      center: true,
      duration: (typeof options.time == 'number') ? options.time : 2000,
      message: options.content,
      onClose: function () {
        if (typeof options.callback == 'function') {
          options.callback();
        }
      }
    });
  } else {
    Message({
      dangerouslyUseHTMLString: true,
      type: 'success',
      customClass: 'success',
      center: true,
      duration: (typeof options.time == 'number') ? options.time : 2000,
      message: options.content,
      onClose: function () {
        if (typeof options.callback == 'function') {
          options.callback();
        }
      }
    });
  }
}

// 创建ajax实例
const http = axios.create({
  baseURL: window.location.origin + '/api',
  timeout: 10000,
});
// 统一处理请求
http.interceptors.request.use(function (req) {
  // console.log(req);
  // 统一添加请求头信息
  let userid = getCookie('userid'),
    username = getCookie('username'),
    token = getCookie('token');
  if (userid) {
    req.headers.userid = userid;
  }
  if (username) {
    req.headers.username = username;
  }
  if (token) {
    req.headers.token = token;
  }

  // 统一处理签名
  if (req.method === 'post') {
    req.data = getSign(req.data);
  } else if (req.method === 'get') {
    let data = req.data === 'object' ? req.data : {};
    data = getSign(data);

    for (let key in data) {
      if (req.url.indexOf('?') < 0) {
        req.url += `?${key}=${data[key]}`;
      } else {
        req.url += `&${key}=${data[key]}`;
      }
    }
  }

  return req
}, function (err) {
  debugger
  layer({
    type: 'danger',
    content: "请求超时！",
  });
  Promise.reject(err);
});
// 统一处理返回
http.interceptors.response.use(function (res) {
  return res;
}, function (err) {
  // console.log(err);
  if (err.message.indexOf('timeout') >= 0) {
    layer({
      type: 'danger',
      content: "请求超时！",
    });
    return Promise.reject(err);
  }

  let res = err.response,
    status = res ? res.status : '';
  if (res && res.config && res.config.headers.catch === true) {
    return Promise.reject(err);
  }

  // 请求头catch为false的请求，不处理错误
  let content = res.data.message ? res.data.message : res.data;
  switch (status) {
    case 504:
      layer({
        type: 'danger',
        content: "请求失败：" + content,
      });
      break;
    case 404:
      layer({
        type: 'danger',
        content: "请求失败：" + content,
      });
      break;
    case 403:
      layer({
        type: 'warning',
        content: "权限不足，请联系管理员！",
      });
      break;
    case 402:
      layer({
        type: 'warning',
        content: "签名不正确！",
      });
      break;
    case 304:
      layer({
        type: 'warning',
        content: "token 已过期，请重新登录！",
        callback: function () {
          setCookie('token', '', -1);
          router.replace("/admin/login");
        }
      });
      break;
    case 300:
      // 请求头catch为300的请求，自行处理300错误代码
      if (res && res.config && res.headers.config.catch === 300) {
        return Promise.reject(err);
      }
      layer({
        type: 'warning',
        content: res.data.msg,
      });
      break;
    default:
      layer({
        type: 'warning',
        content: "未知错误！",
      });
      break;
  }
  return Promise.reject(err);
});

// 自定义错误提示
const dictionary = {
  zh_CN: {
    messages: {
      required: (field) => field + '不可为空',
      min: (field, leng) => field + '不得少于' + leng + '位字符',
      max: (field, leng) => field + '不得多于' + leng + '位字符',
      regex: function (field) {
        switch (field) {
          default:
            return field + '不合法';
        }
      },
      phone: () => '无效的手机号码',
      email: () => '邮箱格式不正确',
      url: () => '无效的链接地址'
    },
    attributes: {
      username: '用户名',
      password: '密码',
      email: '邮箱',
      phone: '手机号',
      name: '名称',
      alias: '英文名',
      title: '标题',
      desc: '描述',
    }
  }
};
// 自定义验证规则
Validator.extend('phone', {
  getMessage: (field, params, data) => data.message,
  validate: value => /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(value)
});
Validator.localize(dictionary);

export {
  layer,
  http,
  Validate
}