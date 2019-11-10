<template>
  <div class="upload" v-if="render">
    <div class="upload-ctn" :style="{width: width +'px', height: height +'px'}">
      <p class="upload-thumb">
        <img :src="url" v-if="url" />
        <i class="icon-image" v-if="!url"></i>
        <input type="file" @change="upload()" ref="file" />
      </p>
      <span class="cancel" v-if="url" @click="cancel('def_thumb')">取消</span>
    </div>
    <p class="tips" v-if="!url && formateSize">请上传 {{formateSize}} 以内的 jpg, jpeg, png, gif 格式的图片</p>
  </div>
</template>

<script>
export default {
  props: {
    width: String,
    height: String,
    url: String,
    size: String,
    field: String
  },
  data() {
    return {
      limit: ''
    }
  },
  computed: {
    formateSize() {
      if (!/^\d+([k|m]b?)?$/gi.test(this.size)) {
        return '';
      }
      let num = this.size.replace(/[a-z]/gi, '');
      if (/m/gi.test(this.size)) {
        this.limit = parseInt(num) * 1024;
        return num + 'Mb';
      } else {
        this.limit = parseInt(num);
        return num + 'kb';
      }
    }
  },
  methods: {
    upload() {
      let file = this.$refs.file,
        img = file.files[0],
        type = ['jpg', 'jpeg', 'png', 'gif'];

      if (!img) {
        return;
      }
      if (type.indexOf(img.type.split('/')[1]) < 0) {
        file.value = '';
        this.$layer({
          content: '只支持上传图片！'
        });
        return;
      }
      if (this.limit && img.size / 1024 > this.limit) {
        file.value = '';
        this.$layer({
          content: `请上传${this.formateSize}以内大小的图片！`,
          time: 2000
        });
        return;
      }

      this.$emit('uploadFile', img, this.field);
    },
    cancel() {
      this.$refs.file.value = '';
      if (this.field) {
        this.$emit('cancelUpload', this.field);
      } else {
        this.$emit('cancelUpload');
      }
    }
  }
}
</script>

<style lang="scss">
.upload {
  overflow: hidden;
  font-size: 0;
  .upload-ctn {
    position: relative;
    overflow: hidden;
    padding-right: 40px;
    .upload-thumb {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      height: calc(100% - 2px);
      text-align: center;
      background: #fff;
      border: 1px solid #e1e1e1;
      border-radius: 3px;
      &.error {
        border-color: #f00;
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
      i {
        font-size: 36px;
        color: #6ff;
      }
      input {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
    .cancel {
      position: absolute;
      right: 0;
      bottom: 0;
      line-height: 24px;
      font-size: 13px;
      color: #3498db;
      padding: 0 8px;
      cursor: pointer;
    }
  }
  .tips {
    font-size: 12px;
    color: #aaa;
    line-height: 24px;
  }
}
</style>
