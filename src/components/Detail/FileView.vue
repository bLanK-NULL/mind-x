<template>
    <a-layout :style="{ marginLeft: '200px', height: '100vh' }">
        <a-layout-header
            :style="{ background: '#fff', padding: 0, display: 'flex', alignItems: 'center', paddingLeft: '20px' }">
            <a-typography-title :level="2">文件</a-typography-title>
        </a-layout-header>
        <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'auto', background: '#fff' }">
            <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
                <a-typography-title :level="4" style="text-align: left">我的项目</a-typography-title>
                <a-divider />
                <Project-card :allProject :clickCallback="openProject"></Project-card>
                <a-typography-title :level="4" style="text-align: left">模板</a-typography-title>
                <a-divider />
                <Project-card :allProject="allTemplate" :clickCallback="createWithTemplate"></Project-card>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import ProjectCard from '@/components/Detail/ProjectCard'
import { getAllProject } from '@/http';
import { useRouter } from 'vue-router';
const router = useRouter();

const allProject = ref([])
const allTemplate = ref([{
    pname: 'default',
    stamp: Infinity,
    img: 'template_default.png'
}])
onBeforeMount(() => {
    getAllProject().then(val => {
        allProject.value = val.data.sort((a, b) => b.stamp - a.stamp)
    });
})

function openProject(pname) {
    // router.push({ name: 'DesignContainer', query: { pname } })
    window.open(router.resolve({
        name: 'DesignContainer',
        query: { pname }
    }).href, '_blank')
}

function createWithTemplate(pname) {
    switch (pname) {
        case 'default':
            window.open(router.resolve({
                name: 'DesignContainer',
                query: { pname: pname + "_" + Date.now() },
                params: { template: pname }
            }).href, '_blank')
            break;
    }

}
</script>

<style scoped>
.site-layout .site-layout-background {
    background: #fff;
}
</style>