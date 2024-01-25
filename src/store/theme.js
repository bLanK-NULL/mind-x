import { defineStore } from 'pinia' 
import {ref} from 'vue'

export const useThemeStore = defineStore('theme',()=> {
    const themeConf = ref(null)
    function setThemeConf(themename='default') {
        themeConf.value = require(`@/theme/${themename}.js`)
    }
    return {
        setThemeConf,
        themeConf
    }
}) 