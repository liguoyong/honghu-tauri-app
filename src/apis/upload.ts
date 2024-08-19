import { http } from "@/utils/http";

/** 上传文件 */
export const uploadFile = async (data?: object) => {
  return await http.request("post", "/api/upload", { data });
};

/** 上传文件 */
export const uploadFileToObs = async (data?: object, config) => {
  return await http.request("post", "/api/uploadFile", { data }, config);
};
