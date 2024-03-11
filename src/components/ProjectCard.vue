<template>
    <div class="my-projects">
        <a-card hoverable v-for="(proj, idx) of allProjectName" :key="idx" class="pitems"
            @click="openProject(proj.pname)">
            <template #cover>
                <div style="min-width: 210px; height: 210px; 
            display: flex; justify-content: center; align-items: center;
            ">
                    <img alt="example" src="@/assets/plus.png" style="width: 50%;" />
                </div>
            </template>
            <a-card-meta :title="proj.pname">
            </a-card-meta>
        </a-card>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
    allProjectName: {
        type: Array,
        default: () => []
    }
})

function openProject(pname) {
    // router.push({ name: 'DesignContainer', query: { pname } })
    window.open(router.resolve({
        name: 'DesignContainer',
        query: { pname }
    }).href, '_blank')
}
</script>

<style scoped>
.my-projects {
    display: flex;
    flex-wrap: wrap;
}

.pitems {
    margin: 20px;
}
</style>