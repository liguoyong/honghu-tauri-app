import { http } from "@/utils/http";

import { ResponseType } from './types'
/** 创建待办事项 */
export const createTodo = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/todo/create", { data });
};

/** 编辑待办事项 */
export const updateTodo = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/todo/update", { data });
};

/** 查看待办事项详情 */
export const getTodoDetail = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/todo/detail", { data });
};

// 删除待办事项
export const getDeleteTodo = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/todo/delete", { data });
};


// 获取待办事项列表
export const getTodoList = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/todo/list", { data });
}

// 获取所有待办
export const getTodoAll = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/todo/all", { data });
}