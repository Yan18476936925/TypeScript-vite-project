// 公共配置信息
import Request from "@/utils/newRequest"

// 获取用户全部信息
export const getUserDetail = obj => Request.request({
	url: "get_user_detail",
	port: "guild",
	method: "POST",
	data: obj,
})

// 获取字段是否显示
export const getDetailShow = obj => Request.request({
	url: "detail_show",
	port: "guild",
	method: "POST",
	data: obj,
})

// 修改字段
export const detailUpdate = obj => Request.request({
	url: "detail_update",
	port: "guild",
	method: "POST",
	data: obj,
})
// 获取行业列表
export const getIndustry = obj => Request.request({
	url: "get_industry",
	port: "guild",
	method: "GET",
	data: obj,
})
// 获取榜单列表
export const apiGetRankList = obj => Request.request({
	url: "rank_list",
	port: "guild",
	method: "POST",
	data: obj,
})
// 获取榜单列表
export const getMajorList = obj => Request.request({
	url: "get_major",
	port: "guild",
	method: "GET",
	data: obj,
})
// 获取勋章列表
export const apiGetGroupQrcode = obj => Request.request({
	url: "get_group_qrcode",
	port: "guild",
	method: "POST",
	data: obj,
})
// 获取勋章列表
export const apiGetMemberBadge = obj => Request.request({
	url: "get_member_badge",
	port: "guild",
	method: "POST",
	data: obj,
})
// 刷新当前用户经纬度
export const apiRefreshLocation = obj => Request.request({
	url: "refresh_location",
	port: "guild",
	method: "POST",
	data: obj,
})
// 获取用户企业信息
export const apiGetBusinessDetail = obj => Request.request({
	url: "get_business_detail",
	port: "guild",
	method: "POST",
	data: obj,
})
// 修改用户企业信息
export const apiUserBusinessUpdate = obj => Request.request({
	url: "business_update",
	port: "guild",
	method: "POST",
	data: obj,
})