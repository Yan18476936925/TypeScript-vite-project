import Request from "@/utils/newRequest"

// 微信小程序登录接口
export const apiUserLogin = obj => Request.request({
	url: "get_openid",
	method: "POST",
	data: obj,
})
// 微信小程序获取登录信息
export const apiGetUserInfo = obj => Request.request({
	url: "get_user_detail",
	port: "guild",
	method: "POST",
	data: obj,
})