<template>
    <div class="pages">
        <select ref="limit" @change="changeLimit">
            <option value="10">每页显示10条</option>
            <option value="20">每页显示20条</option>
            <option value="50">每页显示50条</option>
        </select>
        <span class="direct" :class="{'disable':page==1}" @click="prev">上一页</span>
        <input :value="page" @keyup="skip" />
        <span class="direct" :class="{'disable':page==pageCount}" @click="next">下一页</span>
        <span class="pageCount">共 <span>{{pageCount}}</span> 页</span> 
    </div>
</template>

<script>
export default {
    name : 'pages',
    props : {
        limit : Number,
        page : Number,
        count : Number
    },
    computed : {
        pageCount(){
            return Math.ceil(this.count/this.limit);
        }
    },
    methods : {
        changeLimit(e){
            this.$emit('changeLimit', parseInt(e.target.value));
        },
        prev(){
            if(this.page <= 1) return;
            let page = this.page;
            page --;
            this.$emit('skip', page);
        },
        skip(e){
            let page = parseInt(e.target.value);
            if( e.keyCode != 13 || !(/^\d$/g.test(page)) ) return;
            if(page < 1 || page > this.pageCount) return;
            this.$emit('skip', page);
        },
        next(){
            if(this.page >= this.pageCount) return;
            let page = this.page;
            page ++;
            this.$emit('skip', page);
        }
    }
}
</script>

<style lang="scss">
.pages{
    overflow: hidden; text-align: right; height: 24px; line-height: 24px; margin-top: 2rem;
    select{
        font-size: 12px; height: 22px; margin: 1px 10px 0 0; border-color: #ccc; vertical-align: top;
        option{font-size: 13px;}
    }
    .direct{
        font-size: 12px; color: #47a4e9; padding: 0 3px; cursor: pointer;
        &.disable{color: #ccc; cursor: not-allowed;}
    }
    .pageCount{
        font-size: 13px; margin: 0 20px 0 10px;
        span{color: #ed5a5a;}
    }
    input{font-size: 12px; text-align: center; width: 36px; height: 22px; margin: 0 5px; border: 1px solid #ccc; vertical-align: top; border-radius: 2px;}
}
</style>
