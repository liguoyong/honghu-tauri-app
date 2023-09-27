import { http } from "@/utils/http";

/** 创建笔记 */
export const createNote = async (data?: object) => {
    return await http.request("post", "/api/note/create", { data });
};

/** 编辑笔记 */
export const updateNote = async (data?: object) => {
    return await http.request("post", "/api/note/update", { data });
};

/** 查看笔记详情 */
export const getNoteDetail = async (data?: object) => {
    return await http.request("post", "/api/note/detail", { data });
};

// 删除笔记
export const getDeleteNote = async (data?: object) => {
    return await http.request("post", "/api/note/delete", { data });
};


// 获取笔记列表
export const getNotesList = async (data?: object) => {
    return await http.request("post", "/api/note/list", { data });
}
