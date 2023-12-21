// 公共配置信息
import Request from "@/utils/newRequest"

// 获取会员列表
export const apiSchoolFellowList = obj => Request.request({
	url: "student_list",
	port: "guild",
	method: "POST",
	data: obj,
})
// 获取搜索城市
export const apiGetCity = obj => Request.request({
	url: "get_city",
	port: "guild",
	method: "GET",
	data: obj,
})
// 获取学院列表
export const apiGetCollege = obj => Request.request({
	url: "get_college",
	port: "guild",
	method: "GET",
	data: obj,
})
// 获取行业列表
export const apiGetIndustry = obj => Request.request({
	url: "get_industry",
	port: "guild",
	method: "GET",
	data: obj,
})
// 获取会员详情
export const apiSchoolFellowDetails = obj => Request.request({
	url: "student_detail",
	port: "guild",
	method: "POST",
	data: obj,
})
// 获取优秀会员列表
export const apiExcellentList = obj => Request.request({
	url: "excellent_list",
	port: "guild",
	method: "GET",
	data: obj,
})
// 发送消息
export const apiGetStudentCount = obj => Request.request({
	url: "student_count",
	port: "guild",
	method: "POST",
	data: obj,
})
// 发送消息
export const apiGetWxMessage = obj => Request.request({
	url: "get_wx_message",
	port: "guild",
	method: "POST",
	data: obj,
})