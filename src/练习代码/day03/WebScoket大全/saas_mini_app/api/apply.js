// 公共配置信息
import Request from "@/utils/newRequest"

// 获取行政区
export const apiGetDivision = obj => Request.request({
	url: "get_division",
	method: "GET",
	data: obj,
})

// 获取学院列表
export const apiGetCollege = obj => Request.request({
	url: "get_college",
	method: "GET",
	data: obj,
})

// 获取行业列表
export const apiGetIndustry = obj => Request.request({
	url: "get_industry",
	method: "GET",
	data: obj,
})

// 提交审核信息
export const apiApply = obj => Request.request({
	url: "apply",
	method: "POST",
	data: obj,
})

// 获取被驳回用户填写的信息
export const apiGetRejectedDetail = obj => Request.request({
	url: "get_rejected_detail",
	method: "POST",
	data: obj,
})