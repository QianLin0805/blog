let crypto = require("crypto-js");   // 加密组件

// cookie
export function setCookie(key, value, time) {
  if (!time) time = 60 * 60 * 1000;
  let timestamp = Date.parse(new Date());
  let date = new Date(timestamp + time);
  document.cookie = key + "=" + escape(value) + ";path=/;expires=" + date.toGMTString();
}
export function getCookie(key) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(key + "=");
    if (start != -1) {
      start = start + key.length + 1;
      let end = document.cookie.indexOf(";", start);
      if (end == -1) end = document.cookie.length;
      return unescape(document.cookie.substring(start, end));
    }
  }
  return "";
}

/* 加密解密功能 */
// 将字符串转为16进制
export function uniCode16(str) {
  if (typeof str !== 'string') return '';
  let res = '';
  for (let i = 0; i < str.length; i++) {
    res += str.charCodeAt(i).toString(16);
  }
  return res;
}
// 加密解密所使用的key，必须为字符串转为16进制字符，并且转后长度为16位
let key = uniCode16('blog_key');
// 加密解密所使用的iv，必须为字符串转为16进制字符，并且转后长度为16位
let iv = uniCode16('qjl_blog');
let cryptoConfig = {
  iv: iv,
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7
}
// 加密
export function encrypt(str) {
  if (typeof str === 'string') {
    let chiper = crypto.AES.encrypt(str, key, cryptoConfig);
    let res = chiper.toString();
    return res;
  }
  return false;
}
// 解密
export function decrypt(str) {
  if (typeof str === 'string') {
    let chiper = crypto.AES.decrypt(str, key, cryptoConfig);
    let res = chiper.toString(crypto.enc.Utf8);
    return res;
  }
  return false;
}
/* 加密解密功能 */

// ascii排序
export function asciiSort(a, b, key, flag) {
  if (typeof a === 'object') a = a[key], b = b[key];
  if (typeof a === 'string') flag = key;

  if (a < b) {
    if (flag === false) return 1;
    return -1;
  }
  if (a > b) {
    if (flag === false) return -1;
    return 1;
  }
  return 0;
}
// 接口入参获取签名
export function getSign(params) {
  if (typeof params !== 'object' || Array.isArray(params)) {
    return;
  }

  let sign_params = [], secret = "xm_blog";
  params.timestamp = Date.parse(new Date());
  for (let key in params) {
    if (key === 'token') {
      continue;
    }
    let val = params[key];
    if (typeof val === "undefined" || val === null || val === '') {
      delete params[key];
      continue;
    }
    if (/\W/g.test(key)) {
      delete params[key];
      console.warn('接口请求参数名key请不要使用特殊字符，但可使用字母数字_');
      continue;
    }
    let p = { key: key };
    if (typeof val === 'object') {
      p.val = JSON.stringify(val);
    } else {
      p.val = String(val);
    }
    sign_params.push(p);
  }

  let str = '';
  let arr = sign_params.sort(function (a, b) {
    return asciiSort(a, b, 'key');
  });
  arr.forEach(a => {
    str += a.key + a.val;
  });
  let sign = crypto.MD5(secret + str + secret).toString().toUpperCase();
  params.sign = sign;
  return params;
}

// 格式化日期
export function formatDate(timestamp, flag) {
  let date = timestamp ? new Date(timestamp * 1000) : new Date();
  let year = date.getFullYear(), month = date.getMonth(), days = date.getDay();
  month = month < 10 ? '0' + month : month;
  days = days < 10 ? '0' + days : days;
  let d = year + '-' + month + '-' + days;
  if (flag === false) return d;

  let t = date.toLocaleTimeString(), section = t.substr(0, 2);
  t = t.substr(2);
  let arr = t.split(':');
  let h = arr[0], m = arr[1], s = arr[2];
  if (section == '上午') {
    if (h.length < 2) h = '0' + h;
  } else if (section == '下午') {
    h = String(parseInt(h) + 12);
  }
  t = timestamp ? h + ':' + m : h + ':' + m + ':' + s;

  return d + ' ' + t;
}
export function formatHtml(str) {
  let ptn = /<[^<>]+>/g;
  let text = str.replace(ptn, '');
  return text.replace(/&nbsp;/g, ' ');
}
export function toBase64(vue, img, field) {   //图片转为base64
  let reader = new FileReader();
  reader.readAsDataURL(img);
  let timer = setInterval(() => {
    if (reader.readyState == 2) {
      clearInterval(timer);
      vue[field] = reader.result;
    }
  }, 300);
}
export function isModified(vue, arr, field) {    //表单验证是否经过修改
  let i = 0;
  for (let param in vue[field]) {
    if (arr.indexOf(param) >= 0) continue;
    if (vue[field][param] != vue[param]) {
      vue.changeData[param] = vue[param];
      i++;
    }
  }
  if (i <= 0) {
    vue.changed = false;
    vue.changeData = {};
    return false;
  }
  vue.changed = true;
  return true;
}

export function addList(vue, url, params) {  //添加
  vue.$ajax({
    method: 'post',
    url: url,
    headers: {
      token: getCookie('token')
    },
    data: params
  }).then((res) => {
    if (res.data.resultCode == 200) {
      vue.$layer.msg(res.data.resultMsg, () => {
        vue.$layer.closeAll();
        vue.flag = false;
        vue.$emit('update');
        window.history.back();
      });
    } else {
      let msg = (typeof res.data.resultMsg == 'object') ? res.data.resultMsg[0] : res.data.resultMsg;
      vue.$layer.msg(msg, () => {
        vue.$layer.closeAll();
        vue.flag = false;
      });
    }
  }).catch((err) => {
    vue.$layer.msg('数据访问失败', () => {
      vue.$layer.closeAll();
      vue.flag = false;
    });
  });

}
export function modifyList(vue, url, params) {  //修改
  vue.$ajax({
    method: 'put',
    url: url,
    headers: {
      token: getCookie('token')
    },
    data: params
  }).then((res) => {
    if (res.data.resultCode == 200) {
      vue.$layer.msg(res.data.resultMsg, () => {
        vue.$layer.closeAll();
        window.location.reload();
      });
    } else {
      let msg = (typeof res.data.resultMsg == 'object') ? res.data.resultMsg[0] : res.data.resultMsg;
      vue.$layer.msg(msg, () => {
        vue.$layer.closeAll();
        vue.flag = false;
      });
    }
  }).catch((err) => {
    vue.$layer.msg('数据访问失败', () => {
      vue.$layer.closeAll();
      vue.flag = false;
    });
  });
}
export function deleteList(vue, url, str) {  //删除
  if (vue.deleteFlag) return;
  vue.deleteFlag = true;
  vue.$layer.confirm('确定要删除这个' + str + '吗?', {
    type: 0,
    title: '提示'
  }, () => {
    vue.$layer.closeAll();

    vue.$ajax({
      method: 'delete',
      url: url,
      headers: {
        token: getCookie('token')
      }
    }).then((res) => {
      if (res.data.resultCode == 200) {
        vue.getList();
      }
      vue.$layer.msg(res.data.resultMsg, () => {
        vue.$layer.closeAll();
        vue.deleteFlag = false;
      });
    }).catch((err) => {
      vue.$layer.msg('删除失败', () => {
        vue.$layer.closeAll();
        vue.deleteFlag = false;
      });
    });
  }, () => {
    vue.deleteFlag = false;
    vue.$layer.closeAll();
  });
}