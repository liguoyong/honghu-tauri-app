import { http } from "@/utils/http";

/** 上传文件 */
export const uploadFile = async (data?: object) => {
  return await http.request("post", "/api/upload", { data });
};