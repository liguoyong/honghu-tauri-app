import { http } from "@/utils/http";
import { ResponseType } from "./types";

// 获取账单列表
export const getBillsList = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/bills/list", { data });
};

/** 编辑笔记 */
export const importNote = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/bills/import", { data });
};
