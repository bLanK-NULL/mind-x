<template>
    <div class="my-projects">
        <a-card hoverable v-for="(proj, idx) of allProject" :key="idx" class="pitems" @click="clickCallback(proj.pname)"
            @contextmenu="() => { curProj = proj; }" v-ctxmenu:[contextMenuInCard]>
            <template #cover>
                <div style="display: flex; justify-content: center; align-items: center; width: 210px;height: 210px;">
                    <img class="img" alt="example"
                        :data-flag="(proj.img && proj.img.startsWith('template')) ? 'template' : 'myProj'"
                        :src="proj.img ? imagePath('./' + proj.img) : imagePath('./cover.png')" />
                </div>
            </template>
            <a-card-meta :title="proj.pname">
            </a-card-meta>
        </a-card>
        <a-modal v-model:open="open" :title="title" :confirm-loading="confirmLoading" @ok="handler"
            :destroyOnClose="true" :okType="okType">
            <a-input v-model:value="newPname" autofocus :placeholder="curProj.pname" v-if="showInput" />
        </a-modal>
    </div>
</template>

<script setup>
import { renameProject, deleteProject } from '@/http/index'
import { ref } from 'vue';
import { errorMsg, successMsg } from '@/hooks/Message/globalMessage';
const imagePath = require.context('@/assets', true, /\.png$/);
const props = defineProps({
    allProject: {
        type: Array,
        default: () => []
    },
    clickCallback: {
        type: Function,
        default: () => { }
    },
    isTemplate: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['updateAllProjectInfo'])
const curProj = ref(null)
const open = ref(false)
const newPname = ref('')
const confirmLoading = ref(false)
const title = ref('Title')
const okType = ref('primary')
const showInput = ref(true)
let handler = () => { };

const contextMenuInCard = !props.isTemplate ? [{
    title: '重命名项目',
    fn: () => {
        handler = handleRename;
        title.value = '重命名'
        okType.value = 'primary'
        showInput.value = true;
        open.value = true;
    }
}, {
    title: '删除项目',
    fn: () => {
        handler = handleDelete;
        title.value = '删除项目'
        okType.value = 'danger'
        showInput.value = false;
        open.value = true;
    }
}] : [];

function handleRename() {
    if (newPname.value == '') return;
    confirmLoading.value = true;
    renameProject(curProj.value.pname, newPname.value).then(res => {
        confirmLoading.value = false;
        if (res.data.success) {
            curProj.value.pname = res.data.newPname
            open.value = false;
            successMsg(res.data.message)
        } else {
            errorMsg(res.data.message);
        }
    })
}
function handleDelete() {
    confirmLoading.value = true;
    deleteProject(curProj.value.pname).then(res => {
        confirmLoading.value = false;
        if (res.data.success) {
            emits('updateAllProjectInfo', curProj.value.pname)
            open.value = false;
            successMsg(res.data.message);

        } else {
            errorMsg(res.data.message);
        }
    })
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

.img {
    width: 210px;
    height: 210px;
}

.img[data-flag="myProj"] {
    width: 128px;
    height: 128px;
}
</style>