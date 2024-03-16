import { defineStore } from 'pinia'
import { useItemsStore } from './index.js'
import { storeToRefs } from 'pinia'


export const useWithDraw = defineStore('withDraw', () => {
    const itemsStore = useItemsStore();
    const { topItems } = storeToRefs(itemsStore)
    

    return {

    }
})