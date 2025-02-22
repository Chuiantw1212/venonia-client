<template>
    <div ref="bannerRef">
        <!-- {{customDesign  }} -->
        <!-- 檢視與編輯用 -->
        <el-form-item v-if="!props.isDesigning" :label="customDesign.label" @dragstart="emit('dragstart')">
            <AtomBannerUploader v-if="customDesign" v-model="customDesign.value" :disabled="disabled"
                :height="bannerHeight">
            </AtomBannerUploader>
        </el-form-item>
        <!-- 樣板編輯專用 -->
        <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required"
            @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')">
            <template v-slot:default>
                <AtomBannerUploader v-model="customDesign.value" :disabled="disabled" :height="bannerHeight">
                </AtomBannerUploader>
            </template>
        </MoleculeDesignToolbar>
    </div>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const isLoading = ref(false)
const repoUI = useRepoUI()
const bannerRef = ref()
const bannerHeight = ref<string>('100px') // 配合拖曳用模板高度

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: () => {
        return {
            type: 'banner',
            label: '',
            value: {
                type: '',
                buffer: [],
            },
        }
    }
})

const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
    },
    isDesigning: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '請輸入'
    },
    onchange: {
        type: Function,
        default: async () => { }
    },
    formField: {
        type: String,
        default: '',
    },
})

// 附加預設值
onMounted(() => {
    setDefaultValue()
    handleResize()
    window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

// methods
function setDefaultValue() {
    if (customDesign.value.hasOwnProperty('value')) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'banner',
        label: '',
        value: {
            type: '',
            buffer: [],
        },
    }
    if (props.formField) {
        defaultValue.formField = props.formField
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
}

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}
function handleResize() {
    repoUI.debounce('bannerResize', () => {
        const width = bannerRef.value?.clientWidth
        const minHeight = Math.min(390, width / 2)
        bannerHeight.value = `${minHeight}px`
    })
}
</script>
