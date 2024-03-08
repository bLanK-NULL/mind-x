<template>
  <router-view></router-view>
</template>

<script setup>

</script>

<style>
#app {/* 注释了就可以 撑开 app，但是body撑不开 还滚动不了 ; 会影响login.vue*/
  width: 100%;
  height: 100%;
}
/*给固定高度都不行！ */
body { 
  height: 2000px;
}
</style>