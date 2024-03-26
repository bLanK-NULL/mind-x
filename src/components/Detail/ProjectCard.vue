<template>
    <div class="my-projects">
        <a-card hoverable v-for="(proj, idx) of allProject" :key="idx" class="pitems" @click="clickCallback(proj.pname)">
            <template #cover>
                <div style="display: flex; justify-content: center; align-items: center; ">
                    <img class="img" alt="example"
                        :src="proj.img ? imagePath('./' + proj.img) : 'https://picsum.photos/210/210?' + idx" />
                </div>
            </template>
            <a-card-meta :title="proj.pname">
            </a-card-meta>
        </a-card>
    </div>
</template>

<script setup>
const imagePath = require.context('@/assets', true, /\.png$/);
const props = defineProps({
    allProject: {
        type: Array,
        default: () => []
    },
    clickCallback: {
        type: Function,
        default: ()=>{}
    }
})

</script>

<style scoped>
.my-projects {
    display: flex;
    flex-wrap: wrap;
}

.pitems {
    margin: 20px;
}

.img {
    width: 210px;
    height: 210px;
}
 
 
</style>