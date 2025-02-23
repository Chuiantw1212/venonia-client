import type { IOffer } from "./offer"

export interface IEventTemplate {
    uid?: string,
    id?: string,
    eventId?: string, // 已創建的event才會有, 編輯中或是樣板不會有
    designs: ITemplateDesign[],
    designIds?: string[],
    name?: string,
    lastmod?: any,
    isPublic?: boolean, // 可被搜索到的活動事件
}

export interface ITemplateDesign {
    id?: string,
    eventId?: string, // 已公開的event才會有, 編輯中或是樣板不會有
    templateId?: string,
    type?: string,
    required?: boolean,
    mutable?: {
        label?: string,
        // 未定義欄位使用
        value?: any,
        // organization
        organizationId?: string,
        organizationName?: string,
        // organization members
        memberIds?: string[],
        memberNames?: string[],
        // 時間
        startDate?: string,
        endDate?: string,
        // 線下地點
        placeId?: string, // entities
        placeName?: string,
        placeAddressRegion?: string, // 第一級行政區
        placeAddress?: string,
        placePublicAccess: boolean,
        // 線上地點
        urlName?: string,
        urlValue?: string,
        // 票券
        offers?: IOffer[]
    },
    formField?: string,
    lastmod?: any,
    [key: string]: any
}



export interface ITemplateDragSouce {
    index: number,
    item: ITemplateDesign
}