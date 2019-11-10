<template>
    <div id="app">
        123
    </div>
</template>

<script>
export default {
    name: 'app',
    created() {
        this.$ajax({
            type : 'get',
            url : '/1.0/fourmmain'
        }).then((res) => {
            console.log(res)
        });
    }
}
</script>

<style lang="scss">
#app{
    
}
</style>
