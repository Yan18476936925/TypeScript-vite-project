import request302 from "./apiRequest/request_302.js"
import tokenLogin from "./allLoginType/tokenLogin.js"
import {
	requestNum
} from "./index";
import store from "@/store/index"
import {
	getNetworkType
} from "./wxApi.js"
import {
	version,
	os,
	platform,
	httpKey,
	baseUrl,
	webViewUrl,
	logsUrl,
	modules,
	hasSightseerPage
} from "@/utils/base.js"


class Request {
	constructor() {
		// 是否在执行login操作
		this.isLogin = 0 // 0 表示没有执行过登录 ， 1 表示正在执行登录
		// requestId 自增数字
		this.httpNum = 0
	}
	async request(opt = {}) {
		global._logger.writeLogs("开始调用接口", !!opt && opt.url ? opt.url : "" )
		let netWorkStatus = await getNetworkType();
		!opt.data && (opt.data = {})
		let config = Object.assign({
			url: "",
			method: "GET",
			data: {},
			port: "guild",
			miniBaseUrl: baseUrl,
			header: {
				"content-type": "application/x-www-form-urlencoded" // 默认值
			},
			needSaveLog: true,           // 是否需要保存日志,默认要保存，过滤没有必要保存的接口
			needDefaultToast: true,		 // 是否需要默认的toast提示，不需要的话在api里面配置
			// needDefaultParam: false,		 // 是否需要添加默认的参数，默认未无
		}, opt);
		return new Promise((resolve, reject) => {
			// 网络异常直接抛出
			if(netWorkStatus != 1) {
				uni.showToast({
					title: "当前网络异常，请检查网络",
					icon: "none",
					duration: 2000
				})
				reject("当前网络异常，请检查网络");
				global._logger.writeLogs("当前网络异常，请检查网络");
				return;
			}
			let url = `${config.miniBaseUrl}${modules[config.port]}/${config.url}`; // 默认url
			// 不存在端口时候的url拼接
			config.port == "" && (url = `${config.miniBaseUrl}/${config.url}`)
			// if (config.method == "GET") {
				if (!!store.getters.openid) {
					config.data.openid = store.getters.openid
					// config.data.openid = 'os7pK4yl8uUoi9Gu1ZmFZ_2CmDxs'
					// config.data.openid = 'os7pK4xgmg1H4MRT0Rm9ahJCB-20'
					// config.data.openid = 'os7pK47INFXv37mvb-jSIRBia830'
				}
				// 设置必传参数(默认值)
				config.data.requestId = `${requestNum()}-${this.httpNum}`
				config.data.timeline = +new Date();
				// config.data.os = os
				// config.data.platform = platform
				// config.data.downfrom = store.state.downfrom
				// config.data.downFrom = store.state.downFrom
				// config.data.appname = "bbox"
				config.data.version = version;
				let isSightseerStorage = uni.getStorageSync("isSightseerStorage")
				if (!!isSightseerStorage) {
					store.commit("setIsSightseer", isSightseerStorage);
				}
				// 游客模式
				if (store.getters.isSightseer == 1) {
					let PagesInfo = getCurrentPages(); // 获取页面栈信息，最后一条，就是当前显示的页面
					// #ifdef MP-TOUTIAO
						let routeName = PagesInfo.length ? PagesInfo[PagesInfo.length-1].is.slice(1) : ""; // 当前页面的路由名称
					// #endif
					// #ifdef MP-WEIXIN
						let routeName = PagesInfo.length ? PagesInfo[PagesInfo.length-1].route : ""; // 当前页面的路由名称
					// #endif
					config.data.guest = hasSightseerPage.indexOf(routeName) > -1 ? true : ""
				}
				config = Object.assign(config, opt);
				// // 去掉空的字段
				// removeVoidKey(config.data);
				// // sign
				// let signData = Object.keys(config.data)
				// signData.sort()
				// let initSign = "" // 签名字段

				// signData.forEach((item, index) => {
				// 	if (index + 1 === signData.length) {
				// 		initSign += item + "=" + config.data[item]
				// 	} else {
				// 		initSign += item + "=" + config.data[item] + "&"
				// 	}
				// })
				// initSign += `${httpKey}`
				// config.header.sign = sha256(initSign)
			// } else if (config.method == "POST") {
			// 	config = Object.assign(config, opt);
			// 	url = `${config.miniBaseUrl}${modules[config.port]}/${config.url}`
			// 	// 去掉空的字段
			// 	removeVoidKey(config.data);
			// };
			this.httpNum++;
			
			uni.request({
				url,
				data: config.data,
				header: config.header,
				method: config.method,
				success: async (res) => {
					// 获取一个随机Key
					let stationId = requestNum()
					let lastUrl = config.url.split("/")[config.url.split("/").length - 1]; // 获取最后一个url名称
					const Logins = ["wxMPLogin", "bdMPLogin", "login"]; // 登录名称列表
					let name = Logins.includes(lastUrl) ? "login" : "";
					switch (res.data.code) {
						case 1:
							// PHP后台有些接口取得正确时返回是 1
							resolve(res.data.data)
							break;
						default:
							reject(res.data)
							break;
					}
					// 需要保存日志的接口调用保存
					// if(config.needSaveLog) {
					// 	global._logger.writeLogs(res.data.code == 1 ? {
					// 		apiName: config.url + "响应",
					// 		options: config.data,
					// 		result: res.data.data
					// 	} : `调用接口 ${url} 成功`);
					// }
				},
				fail: (error) => {
					console.log('异常响应', error)
					this.isLoading = false;
					// if(config.needSaveLog) {
					// 	global._logger.writeLogs({
					// 		apiName: config.url + "异常响应",
					// 		options: config.data,
					// 		result: error
					// 	});
					// }
					uni.showToast({
						title: "手速太快，请再试一次",
						icon: "none",
						duration: 2000
					})
					reject(error)
				}
			})
		})		
	}
}

// 清除为空的参数
const removeVoidKey = obj => {
	Object.keys(obj).forEach(key => {
		if (obj[key] === "" || obj[key] === undefined || obj[key] === null) {
			delete obj[key]
		}
	})
}

let request = new Request();

export default request;
