<template>
    <div class="my-projects">
        <a-card hoverable v-for="(proj, idx) of projList" class="pitems">
            <template #cover>
                <div style="min-width: 210px; height: 210px; 
            display: flex; justify-content: center; align-items: center;
            ">
                    <img alt="example" src="@/assets/plus.png" style="width: 50%;" />
                </div>
            </template>
            <a-card-meta :title="proj.name">
            </a-card-meta>
        </a-card>
    </div>
</template>

<script setup>
const props = defineProps({
    projList: {
        type: Array,
        default: () => [{
            name: 'empty'
        }]
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
</style>