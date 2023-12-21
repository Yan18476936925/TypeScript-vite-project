import Request from "@/utils/newRequest"
import { errUrl, webViewUrl } from "@/utils/base"
// 首页模块
// 首页BANNER position 广告位置,首页顶部(homeTop)/首页中部(homeMid)/个人中心(selfCenter)/签到界面(sign)/商品界面(goods)/ 扭蛋 capsule
export const apiGetBanner = obj => Request.request({url: "userController/userbanner",data: obj})

// 弹窗请求
export const apiPopupRequest = () => Request.request({url: "userController/window_list"})

// 领取新人奖励
export const apiGetNewUserReward = obj => Request.request({url: "userController/receiveNewcomerReward",data: obj})

// 福利弹框
export const apiWelfareModal = () => Request.request({url: "userController/window_welfare"})

// 一番赏活动列表id
export const apiFirstDrawIdList = obj => Request.request({url: "first/draw/listIds",port: "bboxact"})

// 砌墙活动列表id
export const apiWallIdList = obj => Request.request({url: "wall/listIds",port: "bboxmall"})

// 大转盘活动列表id
export const apiWheelIdList = obj => Request.request({url: "turntable/lottery/listIds",port: "bboxmall"})

// 一分试玩现场恢复
export const apiTryProductOrder = obj => Request.request({url: "amountController/tryProductOrder", port: "bboxcharge"})

// js错误报警接口
export const apiJsErrSendMsg = obj => Request.request({
	url: "api/sendMsg",
	data: obj,
	miniBaseUrl: errUrl,
	port: "",
	needDefaultToast:false
})

// 获取七牛上传token
export const getQiniuToken = obj => Request.request({
	url: "upload_key",
	data: obj,
	miniBaseUrl: "https://qiniu.loovee.com", // 七牛上传
	port: "",
})