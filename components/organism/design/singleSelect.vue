<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <el-input :placeholder="placeholder"></el-input>
        </el-form-item>
    </template>
    <!-- 編輯用 -->
    <template v-else-if="customDesign.mutable" :loading="isLoading">
        <MoleculeCustomToolbar @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')">
            <div class="design__item">
                <label class="item__label">
                    <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
                </label>
                <el-select v-model="customDesign.mutable.value" :placeholder="placeholder" :clearable="true"
                    :allow-create="true">
                    <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </div>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember } from '~/types/organization'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const repoOrganization = useRepoOrganization()
const isLoading = ref(false)
const repoUI = useRepoUI()
const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'singleSelect',
                mutable: {
                    label: ''
                }
            }
        }
    },
    isDesigning: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '請輸入'
    },
    options: {
        type: Array,
        default: () => []
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})


const organizationList = ref<IOrganization[]>([])

// Hooks
onMounted(() => {
    getSelectOptions()
})

const customDesign = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

// 附加預設值
watch(() => customDesign.value, (newValue) => {
    if (newValue.mutable) {
        return
    }
    const defaultValue = {
        type: 'singleSelect',
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

// Methods
async function getSelectOptions() {
    // const result = await repoOrganization.getOrganizationList()
    // organizationList.value = result
}
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
