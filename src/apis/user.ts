import { http } from "@/utils/http";

export type CommonResult = {
  success: boolean;
  code: number;
  data: any;
};

export type UserResult = {
  success: boolean;
  code: number;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = async (data?: object) => {
  return await http.request<CommonResult>("post", "/api/user/login", { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};

/** 获取user信息 */
export const getUserInfo = async (data?: object) => {
  return await http.request<UserResult>("post", "/api/user/info", { data });
};

// 更新用户信息
export const updateUserInfo = async (data?: object) => {
  return await http.request<UserResult>("post", "/api/user/update", { data });
};
