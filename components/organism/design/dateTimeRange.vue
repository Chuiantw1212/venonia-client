<template>
    <!-- 檢視用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label" :required="!allowDelete">
        <el-date-picker v-model="customDesign.mutable.value" :placeholder="placeholder" type="datetimerange"
            :disabled="disabled"></el-date-picker>
    </el-form-item>
    <!-- 編輯用 -->
    <MoleculeCustomToolbar v-else-if="customDesign.mutable" :loading="isLoading" @dragstart="emit('dragstart')"
        @remove="emit('remove')" @moveUp="emit('moveUp')" :allowDelete="allowDelete" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
        </template>
        <template v-slot:default>
            <el-date-picker :placeholder="placeholder" v-model="customDesign.mutable.value" type="datetimerange"
                :disabled="true"></el-date-picker>
        </template>
    </MoleculeCustomToolbar>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const isLoading = ref(false)
const repoUI = useRepoUI()
interface IModel {
    type: 'dateTimeRange',
    mutable: {
        label: string,
        value: string[],
    }
}

const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'dateTimeRange',
        mutable: {
            label: '時間日期',
            value: [new Date(), new Date()]
        }
    }
},)

const props = defineProps({
    isDesigning: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    allowDelete: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: '請輸入'
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})

// 附加預設值
watch(() => customDesign.value, (newValue) => {
    if (newValue?.mutable) {
        return
    }
    const defaultValue = {
        type: 'dateTimeRange',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
})

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    handleChange(newValue)
}, { deep: true })

// methods
async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    const id = templateDesign.id ?? crypto.randomUUID()
    debouncePatchEventTemplateDesign(id, templateDesign)
}

const debouncePatchEventTemplateDesign = repoUI.debounce(async (templateDesign: any) => {
    await props.onchange(templateDesign)
    isLoading.value = false
})
</script>
<style lang="scss" scoped>
.design {
    .design__item {
        display: flex;

        .item__label {
            display: flex;
            padding-right: 12px;

            .label__input {
                outline: none;
            }
        }
    }
}
</style>