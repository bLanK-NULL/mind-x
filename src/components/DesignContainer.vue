<template>
    <div class="container">
      <TopTools v-if="false"></TopTools>
      <Designer :pname="route.query.pname"></Designer>
      <a-float-button @click="switchTheme" :class="{ 'dark': isDarkMode }">
        <template #icon>
          <MyIconComp></MyIconComp>
        </template>
      </a-float-button>
      <a-tour :open="openSteps" :steps="steps" :scrollIntoViewOptions="true" @close="openSteps = false"></a-tour>
    </div>
  </template>
  
  <script setup>
  import { ref, h, computed, onMounted, toRaw } from 'vue';
  import Designer from '@/components/Designer.vue';
  import TopTools from '@/components/TopTools.vue';
  import { useItemsStore } from '@/store/index'
  import { useRouter, useRoute } from 'vue-router';
  import { createFromIconfontCN } from '@ant-design/icons-vue';
  import { defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';
  const itemstore = useItemsStore()
  const { themeconf, topItems } = storeToRefs(itemstore)
  const { setTheme, createDragItem,initProject } = itemstore
  const route = useRoute();
  // console.log(route.query.pname)
  //初始化 导入本地||生成3个初始节点
  initProject(route.query.pname, {
    template : route.params.template
  })
  
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
    // console.log(themeconf.value);
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value)
      setTheme('dark')
    else setTheme('default')
  }

  // 引导漫游,
  const openSteps = ref(false)
  onMounted(()=>{
    // console.log(route.params)
    if(route.params.template && !sessionStorage.getItem('tour-designer')) {
      setTimeout(()=> openSteps.value = true, 0)
      sessionStorage.setItem('tour-designer', true)
    }
  })
  const steps = [{
      title: '自由拖动',
      description: '按住节点自由拖动',
      target: ()=> topItems.value.length && topItems.value[0].node,
    },  {
      title: '右键菜单',
      description: '在节点上右键和在画布上打开不同菜单',
      target: ()=> topItems.value.length && topItems.value[0].node,
    }, {
      title: '键盘快捷键',
      description: h('ul',[
        h('li', 'Space + mousemove 移动画布'),
        h('li', 'Ctrl + wheel 缩放'),
        h('li','Ctrl + S 保存项目'),
        h('li','Ctrl + Z 撤回'),
        h('li','Ctrl + Y 反撤回'),
        h('li', 'Tab 添加子节点')
      ])
    }, {
      title: '框选',
      description: '批量的选中、取消选中、拖动', 
    },
  ]
  </script>
   
  <style scoped>
  .dark :deep(.ant-float-btn-body) {
    background-color: #282C34;
  }
  </style>