<template>
    <el-row class="user" :gutter="20">
        <el-col :span="repoUI.isMedium ? 16 : 24">
            <div class="user__btnGroup">
                <el-button class="btnGroup__btn" :disabled="true">密碼變更</el-button>
                <el-button v-if="repoUser.userType === 'attendee'" class="btnGroup__btn"
                    @click="repoUser.setUserType('host')">切換為主辦方</el-button>
                <el-button v-if="repoUser.userType === 'host'" class="btnGroup__btn"
                    @click="repoUser.setUserType('attendee')">切換為一般用戶</el-button>
                <el-button class="btnGroup__btn">登出</el-button>
            </div>
            <el-card class="user__card">
                <el-form label-width="auto">
                    <el-row justify="center">
                        <el-col :span="6">
                            <el-form-item>
                                <img class="card__avatar" src="@/assets/mock/user.jpg">
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="Email">
                                <el-input v-model="userForm.email" placeholder="請輸入講者Email" :disabled="true" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="網址">
                                <el-input v-model="userForm.seoName" :maxlength="30" placeholder="例：en-chu"
                                    :show-word-limit="true">
                                    <template #prefix>
                                        https://venonia.com/
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="標題">
                                <el-input v-model="userForm.name" :maxlength="30" placeholder="例：EN Chu，一個善於理財的工程師"
                                    :show-word-limit="true" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="描述">
                                <el-input v-model="userForm.description" type="textarea" :rows="3" :maxlength="150"
                                    placeholder="請輸入講者介紹" :show-word-limit="true" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-divider>
                    近期主辦(2場)與評價
                </el-divider>
                <!-- <el-card class="user__card"> -->
                <el-row :gutter="20" class="index__eventList">
                    <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                        <MoleculeVenoniaCard class="index__card">
                            <template #default>
                                <NuxtLink to="/event/123">
                                    <img src="https://storage.googleapis.com/public.venonia.com/eventTemplateDesign%2FimKB1tyxFBlthb4fBbaG%2Fbanner.png"
                                        style="width: 100%" />
                                </NuxtLink>
                            </template>
                            <template #footer>
                                <span>
                                    2024/11/01
                                </span>
                                <span>
                                    7.8
                                    <el-icon>
                                        <StarFilled />
                                    </el-icon>
                                </span>
                            </template>
                        </MoleculeVenoniaCard>
                    </el-col>
                </el-row>
            </el-card>
            <el-divider>
                許願與抱怨
            </el-divider>
            <p>VeKoZ為EN Chu獨立開發。</p>
            <p>打開掃Line即可聯絡作者本人。</p>
            <p>開發進度歡迎到Github查看。</p>
            <el-divider>
                系統功能
            </el-divider>
            <div class="user__delete">
                <el-button :style="{ 'width': '100%' }" type="danger">帳號註銷</el-button>
            </div>
        </el-col>
        <el-col v-if="repoUI.isMedium" :span="8">
            <el-card>
                模板設計系統
            </el-card>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
import { StarFilled } from '@element-plus/icons-vue';
import type { IEvent } from '~/types/event';
import type { IUser } from '~/types/user';
const repoUser = useRepoUser()
const eventList = ref<IEvent[]>([])
const id = ref<string>(crypto.randomUUID())
const userForm = ref<IUser>({
    name: '',
    email: 'chuiantw1212@gmail.com',
    description: '',
    seoName: 'en-chu',
})
const eventForm = ref<IEvent>({
    startDate: new Date(),
})
const repoUI = useRepoUI()
const columnSpan = ref<number>(8)
const repoEvent = useRepoEvent()
onMounted(() => {
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)
    eventForm.value.startDate = startOfTheMonth
    getEventList()
    window.addEventListener('resize', setColumnSpan)
    setColumnSpan()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setColumnSpan)
})
function setColumnSpan() {
    repoUI.debounce(id.value, () => {
        columnSpan.value = 24
        // if (repoUI.isSmall) {
        //     columnSpan.value = 12
        // }
        if (repoUI.isMedium) {
            columnSpan.value = 12
        }
        // if (repoUI.isXLarge) {
        //     columnSpan.value = 8
        // }
        // if (repoUI.isXXLarge) {
        //     columnSpan.value = 6
        // }
    })
}
async function getEventList() {
    const result = await repoEvent.getEventList({
        ...eventForm.value,
        isPublic: true,
    })
    eventList.value = result
}
</script>
<style lang="scss" scoped>
.user {
    padding-bottom: 60px; // footer menu height

    .user__card {
        margin-top: 20px;

        .card__avatar {
            display: block;
            width: 118px;
            height: 118px;
            border-radius: 50%;
            margin: auto;
        }

        .card__editor {
            margin-top: 20px;
        }
    }

    .user__btnGroup {
        display: flex;
        gap: 8px;

        .btnGroup__btn {
            width: 100%;
        }
    }

    .user__delete {
        margin-top: 12px;
    }
}

.index__row {
    margin-bottom: 20px;
}
</style>