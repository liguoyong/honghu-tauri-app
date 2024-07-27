import { http } from "@/utils/http";
import { ResponseType } from "./types";

// 获取余额列表
export const getBalanceCreate = async <R = ResponseType>(data?: object) => {
    return await http.request<R>("post", "/api/balance/create", { data });
};
export const getBalanceUpdate = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/balance/update", { data });
};
// 获取余额列表
export const getBalanceList = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/balance/list", { data });
};

/** 余额账单分析 */
export const postBalanceAnalysis = async <R = ResponseType>(data?: object) => {
  return await http.request<R>("post", "/api/balance/analysis", { data });
};