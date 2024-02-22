<template>
<Teleport to="body">
    <div class="contextmenu" v-if="props.isVisible.value">
        <div class="contextMask" @click="(e) => {
            e.stopPropagation();
            $updateVisible(false)
        }"></div>
        <div class="box">
            <ul>
                <li v-for="(item, index) of props.list"
                    @click="($event) => { item.fn && item.fn($event); $updateVisible(false) }" :key="index">
                    {{ item.title }}</li>
            </ul>
        </div>
    </div>
</Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, onUnmounted, toRaw } from 'vue';
const props = defineProps({
    pos: {
        type: Object,
        default: () => {
            return {
                left: 0,
                top: 0
            }
        }
    },
    list: {
        type: Array,
        default: () => {
            return []
        }
    },
    isVisible: {
        type: Object,
        default: ref(false)
    }
})

</script>

<style lang="css" scoped>
/* 清除ul 和 li的默认样式 */
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

ul li {
    margin: 0;
    padding: 0;
}

.contextMask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999999999999 !important;
    opacity: 0.3;
}

.box {
    position: fixed;
    left: v-bind("props.pos.left + 5 + 'px'");
    top: v-bind("props.pos.top + 5 + 'px'");
    z-index: 99999999999999 !important;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9fb;
    padding: 5px 0;
}

.box li {
    box-sizing: border-box;
    min-width: 130px;
    font-size: 14px;
    padding: 8px 16px;
    font-weight: 400;
    /* 字体 微软lighter*/
    font-family: "Microsoft YaHei", "微软雅黑", "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #333;
}

.box li:hover {
    background-color: #c7c7cc;
    cursor: pointer;
}
</style>