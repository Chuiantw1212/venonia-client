import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('organization', () => {
    const defaultApi = useVenoniaApi()
    async function getOrganizationList() {
        const response = await defaultApi.request(`/organization/list`, {
            method: 'get',
        })
        return response.json()
    }
    async function postOrganization(body: any) {
        const response = await defaultApi.request(`/organization`, {
            method: 'post',
            body,
        })
        return response
    }
    async function putOrganizationLogo(body: any) {
        const response = await defaultApi.request(`/organization/logo`, {
            method: 'put',
            body,
        })
        return response
    }
    return {
        getOrganizationList,
        putOrganizationLogo,
        postOrganization,
    }
})