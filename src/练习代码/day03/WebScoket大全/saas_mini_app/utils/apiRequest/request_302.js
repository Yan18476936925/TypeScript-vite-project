import Request from "../newRequest.js"
import store from "../../store/index"
import loginInit from "@/utils/loginInit.js"
const requert302 = async (name, webViewUrl) => {
	if(name === "login") {
		Request.isLogin = 0;
	}
	if (Request.isLogin == 0) {
		Request.isLogin = 1;
		setTimeout(() =>{
			const pagesInfo = getCurrentPages();
			const visitPages = ["pages/home/main", "pages/funPlay/main", "pages/boxArk/main", "pages/me/main", "pages/buyBlindBox/main", "pages/mallDetail/main"];
			// #ifdef MP-WEIXIN
				let pagesInfoRoute = !!pagesInfo[0] ? pagesInfo[pagesInfo.length-1].route : ""; 
			// #endif
			// #ifdef MP-TOUTIAO
				let pagesInfoRoute = !!pagesInfo[0] ? pagesInfo[pagesInfo.length - 1].is.slice(1) : ""; 
			// #endif
			// 延时60s初始化302拦截
			setTimeout(() => {
				store.commit("setRequestIntercept302", false);
			}, 60000)
			if(!!pagesInfo[0] && visitPages.indexOf(pagesInfoRoute) == -1) {
				// store.commit("setWxLogin302", false)
				setTimeout(() => {
					store.commit("setWxLogin302", true)
				}, 10)
			} else {
				console.log('触发302______loginInit')
				// 用户处于登录异常状态时，存在游客页面恢复游客展示。不存在游客强制登录。一次启动最多执行一次异常。避免恶意请求，启动时状态重置
				if(global.errRefreshPageNum < 1) {
					global._logger.writeLogs(`用户处于登录异常状态时302,302页面下刷新数据`);
					++global.errRefreshPageNum;
					store.commit("setIsSightseer", 1);
					uni.setStorageSync("isSightseerStorage", "1")
					loginInit(0, 1);
					Request.isLogin = 0;
				}
			}
		}, 200)
	}
}

export default requert302




