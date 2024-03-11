<template>
    <a-layout has-sider>
        <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }">
            <div class="logo" />
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <a-menu-item v-for="(nav, index) of navList" :key="String(index)" @click="createNewProject(nav)">
                    <span class="nav-text">{{ nav }}</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>

        <a-layout :style="{ marginLeft: '200px', height: '100vh' }">
            <a-layout-header
                :style="{ background: '#fff', padding: 0, display: 'flex', alignItems: 'center', paddingLeft: '20px' }">
                <a-typography-title :level="2">{{ navList[selectedKeys[0]] }}</a-typography-title>
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'auto', background: '#fff' }">
                <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
                    <a-typography-title :level="4" style="text-align: left">我的项目</a-typography-title>
                    <a-divider />
                    <Project-card :allProjectName="allProjectName.data"></Project-card>
                    <a-typography-title :level="4" style="text-align: left">模板</a-typography-title>
                    <a-divider />
                    <Project-card></Project-card>

                </div>
            </a-layout-content>
            <a-layout-footer :style="{ textAlign: 'center' }">
                Mind-X ©2024 Created by bLanK
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import ProjectCard from '@/components/ProjectCard'
import { getAllProjectName } from '@/http';
import { useRouter } from 'vue-router';
const router = useRouter();
const selectedKeys = ref(['0']);
const navList = [
    '文件',
    '社区',
    '导入/导出',
    '新建项目'
]
const allProjectName = ref([])
onBeforeMount(async () => {
    allProjectName.value = await getAllProjectName();
})
function createNewProject(nav) {
    if (nav === '新建项目')
        window.open(router.resolve({ name: 'DesignContainer', query: { pname: +new Date } }).href, '_blank')
}
</script>

<style scoped>
#components-layout-demo-fixed-sider .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>