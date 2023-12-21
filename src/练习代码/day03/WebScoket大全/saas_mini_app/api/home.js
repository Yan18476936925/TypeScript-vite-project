// 公共配置信息
import Request from "@/utils/newRequest"

// 获取首页数据
export const apiHomeGetIndex = obj => Request.request({
	url: "get_index",
	port: "home",
	method: "GET",
	data: obj,
})

// 获取资讯列表
export const apiHomeGetNews = obj => Request.request({
	url: "get_news",
	port: "home",
	method: "GET",
	data: obj,
})

// 获取场地列表
export const apiHomeSiteList = obj => Request.request({
	url: "site_list",
	port: "home",
	method: "GET",
	data: obj,
})

// 获取场地列表分类
export const apiHomeSiteClassList = obj => Request.request({
	url: "site_class_list",
	port: "home",
	method: "GET",
	data: obj,
})

// 获取场地详情
export const apiHomeSiteDetail = obj => Request.request({
	url: "site_detail",
	port: "home",
	method: "GET",
	data: obj,
})
// 获取场地详情
export const apiHomeIviteContent = obj => Request.request({
	url: "invite_content",
	port: "home",
	method: "GET",
	data: obj,
})
// 获取入会协议
export const apiGetProtocols = obj => Request.request({
	url: "get_protocols",
	port: "home",
	method: "GET",
})
// 俱乐部列表
export const apiGetClubList = obj => Request.request({
	url: "club_list",
	port: "home",
	method: "GET",
	data: obj,
})
// 获取俱乐部详情
export const apiGetClubDetail = obj => Request.request({
	url: "club_detail",
	port: "home",
	method: "GET",
	data: obj,
})

// 获取领导班子
export const apiGetLeaderDetail = obj => Request.request({
	url: "get_leader",
	port: "home",
	method: "GET",
	data: obj,
})

// 获取首页校友企业
export const apiGetEnterprise = obj => Request.request({
	url: "get_enterprise",
	port: "home",
	method: "GET",
	data: obj,
})
// 企业列表export const apiGetEnterpriseList = obj => Request.request({	url: "get_enterprise_list",	port: "home",	method: "GET",	data: obj,})// 获取企业详情export const apiGetEnterpriseDetail = obj => Request.request({	url: "enterprise_detail",	port: "home",	method: "GET",	data: obj,})