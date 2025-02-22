<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" :required="required"
        :prop="customDesign.formField" @dragstart="emit('dragstart')">
        <el-select v-if="customDesign" v-model="customDesign.organizationId" placeholder="請選擇現有組織" :clearable="true"
            :disabled="disabled" @change="setOrganizationName()">
            <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.label" :maxlength="8" :show-word-limit="true" placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <el-select v-model="customDesign.organizationId" placeholder="請選擇現有組織" :clearable="true"
                :disabled="disabled" @change="setOrganizationName()">
                <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { IOrganization } from '~/types/organization'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const repoOrganization = useRepoOrganization()
const isLoading = ref(false)
const repoUI = useRepoUI()

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'organization',
        label: '組織', // 純瀏覽時使用
        organizationName: '',
        organizationId: '',
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
        default: '請選擇現有組織'
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
const organizationList = ref<IOrganization[]>([])

// Hooks
onMounted(() => {
    setDefaultValue()
    getOrganizationList()
})

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

// methods
function setDefaultValue() {
    if (customDesign.value.hasOwnProperty('organizationId')) {
        return
    }

    // 新增時添加預設值
    const defaultValue: ITemplateDesign = {
        type: 'organization',
        label: '組織',
        organizationName: '',
        organizationId: '',
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

function setOrganizationName() {
    const selectedItem = organizationList.value.find(item => {
        return item.id === customDesign.value.organizationId
    })
    if (customDesign.value) {
        customDesign.value.organizationName = selectedItem?.name
    }
}

async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}
</script>
