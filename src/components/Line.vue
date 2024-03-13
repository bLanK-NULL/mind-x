<template>
    <canvas ref="myCanvas" :width="canv.width" :height="canv.height" :style="{
        left: canv.left, top: canv.top
    }">
    </canvas>
</template>

<script setup>
import { computed, ref, watchEffect, onMounted, toRaw } from 'vue';
const props = defineProps({
    parentRect: {
        type: Object,
        default: () => {
            return {
                width: ref(0),
                height: ref(0),
            }
        }
    },
    childPos: {
        type: Object,
        default: () => {
            return {
                left: ref(0),
                top: ref(0),
            }
        }
    },
    childRect: {
        type: Object,
        default: () => {
            return {
                width: ref(0),
                height: ref(0),
            }
        }
    }
})
const canv = computed(() => {
    return {
        left: Math.min(props.childPos.left, 0) + 'px',
        top: Math.min(props.childPos.top, 0) + 'px',
        width: Math.max(props.parentRect.width, props.childPos.left + props.childRect.width) - Math.min(props.childPos.left, 0) + 'px',
        height: Math.max(props.parentRect.height, props.childPos.top + props.childRect.height) - Math.min(props.childPos.top, 0) + 'px'
    }
})
const linePos = computed(() => {
    return {
        x1: props.parentRect.width / 2 - Math.min(props.childPos.left, 0),
        y1: props.parentRect.height / 2 - Math.min(props.childPos.top, 0),
        x2: props.childPos.left + props.childRect.width / 2 - Math.min(props.childPos.left, 0),
        y2: props.childPos.top + props.childRect.height / 2 - Math.min(props.childPos.top, 0)
    }
})


const myCanvas = ref(null)
onMounted(() => {
    const ctx = myCanvas.value.getContext('2d')
    watchEffect(() => {
        // ctx.clearRect(0, 0, myCanvas.value.width, myCanvas.value.height);
        ctx.beginPath();
        ctx.moveTo(linePos.value.x1, linePos.value.y1);
        ctx.lineTo(linePos.value.x2, linePos.value.y2);
        ctx.strokeStyle = 'crimson';
        ctx.lineWidth = 2;
        ctx.stroke();

    }, {
        flush: 'post'
    })
})

</script>

<style lang="css" scoped>
canvas {
    position: absolute;
    z-index: -9;
}
</style>