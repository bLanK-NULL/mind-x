<template>
    <div class="container">
      <TopTools v-if="false"></TopTools>
      <Designer></Designer>
      <a-float-button @click="switchTheme" :class="{ 'dark': isDarkMode }">
        <template #icon>
          <MyIconComp></MyIconComp>
        </template>
      </a-float-button>
    </div>
  </template>
  
  <script setup>
  import { ref, h, computed, onMounted, toRaw } from 'vue';
  import Designer from '@/components/Designer.vue';
  import TopTools from '@/components/TopTools.vue';
  import { useItemsStore } from '@/store/index'
  
  import { createFromIconfontCN } from '@ant-design/icons-vue';
  import { defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';
  const itemstore = useItemsStore()
  const { themeconf, topItems } = storeToRefs(itemstore)
  const { setTheme, createDragItem,initProject } = itemstore
  
  //初始化 导入本地||生成3个初始节点
  initProject()
  
  //白天模式和黑夜模式的图标
  const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4433784_r2d8hs1o3ul.js', // 在 iconfont.cn 上生成
  });
  const MyIconComp = defineComponent({
    render() {
      return h(MyIcon, { type: modeName.value });
    }
  
  });
  //切换主题
  
  const isDarkMode = ref(false)
  const modeName = computed(() => {
    return isDarkMode.value ? 'icon-anyemoshi' : 'icon-baitianmoshi';
  })
  const switchTheme = (e) => {
    console.log(themeconf.value);
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value)
      setTheme('dark')
    else setTheme('default')
  }
  </script>
   
  <style scoped>
  .dark :deep(.ant-float-btn-body) {
    background-color: #282C34;
  }
  </style>