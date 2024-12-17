import { http } from "@/utils/http";

import { ResponseType } from './types'
/** 创建待办事项 */
export const addMenu = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/menu/create", { data });
};

export const updateMenu = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/menu/update", { data });
};

/** 查看待办事项详情 */
export const getMenu = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/menu/detail", { data });
};

// 删除待办事项
export const delMenu = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/menu/delete", { data });
};

// 获取待办事项列表
export const listMenu = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/menu/list", { data });
}