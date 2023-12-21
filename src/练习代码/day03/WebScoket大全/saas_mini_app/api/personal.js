import Request from "@/utils/newRequest"

// 获取个人中心界面数据
export const apiGetUserInfo = obj => Request.request({
	url: "get_info",
	method: "POST",
	data: obj,
})

// 获取消息
export const apiGetMessage = obj => Request.request({
	url: "message_list",
	method: "POST",
	data: obj,
})
// 消息处理
export const apiMessageUpdate = obj => Request.request({
	url: "message_update",
	method: "POST",
	data: obj,
})
// 消息推送开关
export const apiGetWxMessage = obj => Request.request({
	url: "get_wx_message",
	method: "POST",
	data: obj,
})
// 我的邀请
export const apiGetInviteList = obj => Request.request({
	url: "invite_list",
	method: "POST",
	data: obj,
})
// 获取职位列表
export const apiGetPosition = obj => Request.request({
	url: "get_position",
	port: "home",
	method: "GET",
	data: obj,
})
// 获取邀请徽章列表
export const apiGetInviteBadge = obj => Request.request({
	url: "get_invite_badge",
	port: "home",
	method: "GET",
	data: obj,
})

// 徽章佩戴开关
export const apiBadgeSwitch = obj => Request.request({
	url: "badge_switch",
	port: "guild",
	method: "POST",
	data: obj,
})