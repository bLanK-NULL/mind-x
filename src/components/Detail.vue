<template>
    <a-layout has-sider>
        <a-layout-sider
            :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, backgroundColor: '#2CABEC' }">
            <div class="logo" />
            <a-menu v-model:selectedKeys="selectedKeys" mode="inline" :style="{ backgroundColor: '#2CABEC' }">
                <a-menu-item v-for="(item, index) of navList" :key="item[1]" @click="router.push({ name: item[1] })">
                    <span class="nav-text">{{ item[0] }}</span>
                </a-menu-item>
                <a-menu-item key="createNewProject" @click="createNewProject()">
                    <span class="nav-text">新建空项目</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <!-- <component :is="FileView"></component> -->
        <router-view></router-view>
    </a-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const selectedKeys = ref(['0']);
const navList = [
    ['文件', 'fileView'],
    ['社区', 'communityView']
]

function createNewProject() {
    router.replace({ path: '/' })
    window.open(router.resolve({
        name: 'DesignContainer',
        query: {
            pname: +new Date,
            newProj: true
        }
    }).href, '_blank')
}
</script>

<style scoped>
#components-layout-demo-fixed-sider .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}
</style>