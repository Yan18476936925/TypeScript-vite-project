import Request from "../newRequest.js"
import store from "../../store/index"
import loginInit from "@/utils/loginInit.js"
import { formatImg } from "@/utils/index.js"
const loginSucc = async (loginDataObj, loginType) => {
	// // 保存用户信息
	store.commit("setOpenId", loginDataObj.openid);
	store.commit("setUserPhone", loginDataObj.phone);
	store.dispatch("getUserDetails")
	// 延时60s初始化302拦截
	setTimeout(() => {
		store.commit("setRequestIntercept302", false);
	}, 60000)
	// uni.setStorage({
	// 	key: "userInfo",
	// 	data: userInfo
	// })
	uni.hideLoading()
	Request.isLogin = 0;
	// 获取全局基础信息配置(异步获取，不影响线程)
	// getGlobalSettingInfo();
	// 获取企业微信信息
	uni.setStorageSync("isSightseerStorage", "0");
	store.commit("setIsSightseer", "0")
	store.commit("setWxLogin302", false);
	uni.showToast({
		icon: "none",
		title: "登录成功~",
		duration: 2000
	})
	uni.$emit("APP_GET_LOCALTION", true);
	// 手机号码登录代表进入了授权页再到手机登录，要返回2个页面
	if(loginType === "telLogin") {
		loginInit(0 , 3);
	} else {
		loginInit(0 , loginType === "wxAuthLogin" ? 2 : 1);
	}
}

// // 获取全局基础信息配置(一般只在登录时候获取，没什么事不会触发刷新，用于变化极少的场景，注意使用异步获取，着急使用的数据使用其他地方引用)
// function getGlobalSettingInfo() {
// 	getShareBase();
// }

export default loginSucc
