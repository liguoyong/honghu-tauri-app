import { http } from "@/utils/http";

import { ResponseType } from './types'
/** 创建文档 */
export const createDoc = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/doc/create", { data });
};

/** 编辑文档 */
export const updateDoc = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/doc/update", { data });
};

/** 查看文档详情 */
export const getDocDetail = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/doc/detail", { data });
};

// 删除文档
export const getDeleteDoc = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/doc/delete", { data });
};


// 获取文档列表
export const getDocList = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/doc/list", { data });
}

// 获取所有待办
export const getDocAll = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/doc/all", { data });
}