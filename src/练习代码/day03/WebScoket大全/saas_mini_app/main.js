import Vue from "vue"
import App from "./App"
import Request from "./utils/newRequest.js"    						// 请求方法封装
import { apiJsErrSendMsg } from "./api/index/index"
import store from "./store/index.js"								// vuex
import * as publicFn from "./utils";								// 公共方法
import * as base from "./utils/base.js";							// 公共数据
import showModel from "@/componentsLib/publicComponents/showModel.vue";					// 普通中部弹窗
import showSetting from "@/componentsLib/publicComponents/showSetting.vue";				// 普通中部弹窗
import actionSheet from "@/componentsLib/publicComponents/actionSheet.vue"				// 下拉式弹窗
import sightseerModel from "@/componentsLib/publicComponents/sightseerModel.vue";		// 游客模式弹窗
import globalComponent from "@/componentsLib/global/index";			// 公共组件


import netWorkErrModel from "@/componentsLib/globalWindow/netWorkErrModel.vue";		// 网络异常弹窗
import loadingPage from "@/componentsLib/publicComponents/loadingPage.vue";		// 空白页（loading页）
import priceTxt from "@/componentsLib/publicComponents/priceTxt.vue";		// 价格格式化组件
import file from "./utils/FileManager"								// 文件管理

Vue.config.productionTip = false
App.mpType = "app"
Vue.prototype.Request = Request
Vue.prototype.$store = store
Vue.prototype.public = publicFn
Vue.prototype.base = base
Vue.prototype.file = file

Vue.component("show-model", showModel)
Vue.component("show-setting", showSetting)
Vue.component("sightseer-model", sightseerModel)
Vue.component("netWorkErr-model", netWorkErrModel)
Vue.component("actionSheet", actionSheet)
Vue.component("globalComponent", globalComponent)
Vue.component("loadingPage", loadingPage)
Vue.component("price-txt", priceTxt)
let errorLimit = false
//系统错误捕获  
const errorHandler = (err, vm, info) => {  
	if(base.env !== "prod") {
		return
	}
	// 代码执行报错
	if (!errorLimit) {
		let _errObjReport = {
			occurrenceTime: publicFn.formatTime(Date.now()),
			occurrenceUser: store.getters.userId || "noUserId",
			operatingEnv: "miniApp",
			info: err.message,
			type: "main"
		};
		errorLimit = true
		try{
			_errObjReport.info = err.toString().split("\\n")[0];
		} catch(err) {
			console.log("catcherr", err)
		}
		console.log('errorHandler', err)
		// apiJsErrSendMsg({
		// 	chatid: "jsError",
		// 	content: _errObjReport
		// }).then(res => {
		// 	global._logger.writeLogs("上报错误成功");
		// 	setTimeout(() => {
		// 		errorLimit = false
		// 	}, 500)
		// }).catch( err => {
		// 	global._logger.writeLogs("上报错误失败", err);
		// 	setTimeout(() => {
		// 		errorLimit = false
		// 	}, 500)
		// })
	}
}
Vue.config.errorHandler = errorHandler;  
Vue.prototype.$throw = (error) => errorHandler(error, this);

const app = new Vue(App)
app.$mount()
