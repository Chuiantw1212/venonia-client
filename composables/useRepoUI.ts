import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
/**
 * https://pinia.vuejs.org/cookbook/composables.html#Setup-Stores
 */
export default defineStore('ui', () => {
    const isResizing = ref<boolean>(false)
    const isSmall = ref<boolean>(false) // 576px, 60%+
    const isMedium = ref<boolean>(false) // 768px, 1%+
    const isLarge = ref<boolean>(false) // 992px 
    const isXLarge = ref<boolean>(false) // 1200px 
    const isXXLarge = ref<boolean>(false) // 1400px 
    const isMenuCollapse = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const loadingInstance = ref<any>(null)
    const debounceTimeout = ref<{ [key: string]: NodeJS.Timeout }>({})

    function setWidth() {
        /**
         * https://getbootstrap.com/docs/5.0/layout/containers/
         */
        const innerWidth = window.innerWidth
        isSmall.value = false
        isMedium.value = false
        isLarge.value = false
        isXLarge.value = false
        isXXLarge.value = false
        isMenuCollapse.value = true
        if (innerWidth >= 576) {
            isSmall.value = true
        }
        if (innerWidth >= 768) {
            isMedium.value = true
        }
        if (innerWidth >= 992) {
            isLarge.value = true
        }
        if (innerWidth >= 1200) {
            isXLarge.value = true
            isMenuCollapse.value = false
        }
        if (innerWidth >= 1400) {
            isXXLarge.value = true
            isMenuCollapse.value = false
        }
        isResizing.value = false
    }

    onMounted(() => {
        if (import.meta.client) {
            setWidth()
            window.addEventListener('resize', () => {
                isResizing.value = true
                debounce('resize', () => {
                    setWidth()
                })
            })
        }
    })


    // Methods
    /**
     * https://www.freecodecamp.org/news/javascript-debounce-example/
     * @param isLoading
     */
    function debounce(id: string, func: Function, timeout = 300) {
        const existedTimer = debounceTimeout.value[id]
        if (existedTimer) {
            clearTimeout(existedTimer);
        }
        const newTimer = setTimeout(() => {
            delete debounceTimeout.value[id]
            func();
        }, timeout);
        debounceTimeout.value[id] = newTimer
    }
    function setLoading(isLoading: boolean) {
        if (isLoading) {
            loadingInstance.value = ElLoading.service({
                lock: true,
                fullscreen: true,
            })
        } else {
            loadingInstance.value.close()
        }
    }
    function toggleMenu() {
        isMenuCollapse.value = !isMenuCollapse.value
    }
    function setMenuCollapse(collapse: boolean) {
        isMenuCollapse.value = collapse
    }

    return {
        isResizing,
        isSmall,
        isMedium,
        isLarge,
        isXLarge,
        isXXLarge,
        isLoading,
        isMenuCollapse,
        // Functions
        debounce,
        setLoading,
        toggleMenu,
        setMenuCollapse,
    }
})