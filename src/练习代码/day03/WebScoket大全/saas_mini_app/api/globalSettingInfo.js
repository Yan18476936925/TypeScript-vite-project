// 公共配置信息
import { logsUrl, webViewUrl } from "@/utils/base.js"
import Request from "@/utils/newRequest"
// 抖音内容安全检测
export const apiDetectContent = obj => Request.request({
	url: "wx/detectContent",
	data: obj,
	port: "bboxrefund"
})

// 直购包邮配置
export const apiGetPostageConf = () => Request.request({
	url: "order/getPostageConf",
	port: "blindbox",
})

// 盲盒小程序通用分享文案
export const apiMiniCommonShareConf = obj => Request.request({
	url: "activity/miniCommonShareConf",
	data: obj,
	port: "blindbox",
})

// 购买协议
export const apiBuyProtocol = obj => Request.request({
	url: "activity/miniCommonShareConf",
	data: obj,
	port: "blindbox",
})

// 上传日志
export const apiMinilog = obj => Request.request({
	url: "log/h5",
	method: "POST",
	data: obj,
	miniBaseUrl: logsUrl,
})

// 最近20条飘窗记录
export const apiGetLatelyWindow = () => Request.request({
	url: "userController/tenRecentOrders",
})

// webview分享页面h5参数获取
export const apiGetActUrl= obj => Request.request({
	url: "api/getActUrl",
	data: obj,
	port: "",
	miniBaseUrl: webViewUrl,
})