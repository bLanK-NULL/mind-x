<template>
    <a-layout :style="{ marginLeft: '200px', height: '100vh' }">
        <a-layout-header
            :style="{ background: '#fff', padding: 0, display: 'flex', alignItems: 'center', paddingLeft: '20px' }">
            <a-typography-title :level="2"> </a-typography-title>
        </a-layout-header>
        <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'auto', background: '#fff' }">
            <EmptyPage></EmptyPage>
        </a-layout-content>
    </a-layout>
</template>
<script setup>
import EmptyPage from '@/components/EmptyPage'

</script>