import { http } from "@/utils/http";
import { ResponseType } from "./types";

// 创建金价记录
export const getGoldCreate = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/gold/create", { data });
};
export const getGoldUpdate = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/gold/update", { data });
};
// 获取金价列表
export const getGoldList = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/gold/list", { data });
};

/** 删除记录 */
export const deleteGoldAnalysis = async <R = ResponseType>(id: string) => {
  return await http.request<R>("delete", `/api/gold/delete/${id}`);
};

/** 金价分析 */
export const postGoldAnalysis = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/gold/analysis", { data });
};

/** 金价同步 */
export const postGoldSync = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/gold/sync", { data });
};