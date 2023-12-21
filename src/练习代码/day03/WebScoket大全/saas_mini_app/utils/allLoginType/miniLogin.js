import Request from "../newRequest.js"
import store from "../../store/index"
import loginSucc from "@/utils/allLoginType/loginSucc.js"
import { apiUserLogin } from "@/api/login.js"
const loging = async (loginData, goRegistered) => {
	if(store.getters.loginTimeRecord >= 2) {
		// 退出登录
		uni.clearStorageSync();
		store.dispatch("logout");
		uni.showToast({
			icon: "none",
			title: "出错,请重试~",
			duration: 2000
		})
		global._logger.writeLogs(`登录缓存出错,请重试~`);
		return
	}
	// 登录都是获取新的session
	// store.commit("setLoginTimeRecord", store.getters.loginTimeRecord - 0 + 1);
	// 获取微信用户信息
	let loginDataObj = {};
	try {
		uni.showLoading({
			title: "正在登录中...",
		})
		// #ifdef MP-WEIXIN
			loginDataObj = await apiUserLogin(loginData);
		// #endif
		if(!!loginDataObj) {
			// console.log("loginDataObj",loginDataObj)
			// store.commit("setLoginTimeRecord", 0);
			global._logger.writeLogs(`登录成功`);
		}
	} catch(err) {
		console.log('err', err)
		// 根据状态码判断交互
		Request.isLogin = 0;
		uni.hideLoading();
		if(!!err.code) {
			uni.showToast({
				icon: "none",
				title: err.msg,
				duration: 2000
			})
		}
		return;
	}
	// let type = !!loginData.phoneIv ? "wxAuthLogin" : "wxLogin";
	loginSucc(loginDataObj)
}

export default loging
