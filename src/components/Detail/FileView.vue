<template>
    <a-layout :style="{ marginLeft: '200px', height: '100vh' }">
        <a-layout-header
            :style="{ background: '#fff', padding: 0, display: 'flex', alignItems: 'center', paddingLeft: '20px' }">
            <h2>文件</h2>
        </a-layout-header>
        <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'auto', background: '#fff' }">
            <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
                <h3 style="text-align: left;">我的项目</h3>
                <a-divider />
                <Project-card :allProject :clickCallback="openProject" ref="step1Ref"
                    @updateAllProjectInfo="updateAllProjectInfo"></Project-card>
                <h3 style="text-align: left;">模板</h3>
                <a-divider />
                <Project-card :allProject="allTemplate" :clickCallback="createWithTemplate" :isTemplate='true'
                    ref="step2Ref"></Project-card>
            </div>
        </a-layout-content>
    </a-layout>
    <a-tour v-model:current="current" :open="openTour" :steps="steps" @close="openTour = false"
        @finish="handleFinish" />
</template>

<script setup>
import { ref, onBeforeMount, onMounted, toRaw, onBeforeUnmount } from 'vue';
import ProjectCard from '@/components/Detail/ProjectCard'
import { getAllProject } from '@/http';
import { useRouter } from 'vue-router';
import { listenMsg } from '@/utils/crossTab';
const router = useRouter();

const allProject = ref([])
const allTemplate = ref([{
    pname: 'default',
    stamp: Infinity,
    img: 'template_default.png'
}])
let stopListen;
onBeforeMount(() => {
    reFetchProject();
    stopListen = listenMsg('reFetch', reFetchProject)
})
onBeforeUnmount(() => stopListen());
function reFetchProject() {
    getAllProject().then(resp => {
        // console.log(resp)
        const val = resp.data;
        if (val.data) {
            allProject.value = val.data.sort((a, b) => b.stamp - a.stamp)
        }
    }).then(() => {
        if (!sessionStorage.getItem('tour-file-view')) {
            openTour.value = true;
            sessionStorage.setItem('tour-file-view', true)
        }
    })
}

function updateAllProjectInfo(pname) {
    const idx = allProject.value.findIndex(item => item.pname == pname);
    allProject.value.splice(idx, 1);
}

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
                query: { pname: pname + "_" + Date.now(), newProj: true },
                params: { template: pname }
            }).href, '_blank')
            break;
    }

}

const current = ref(0);
const openTour = ref(false)
const step1Ref = ref(null)
const step2Ref = ref(null)
onMounted(() => {
})
const steps = [
    {
        target: () => step1Ref && step1Ref.value.$el,
        title: '右键',
        description: '右键菜单包括重命名和删除项目',
    }, {
        target: () => step2Ref && step2Ref.value.$el,
        title: '点击以模板新建项目'
    }
]
function handleFinish() {
    createWithTemplate('default')
}

</script>

<style scoped>
.site-layout .site-layout-background {
    background: #fff;
}
</style>