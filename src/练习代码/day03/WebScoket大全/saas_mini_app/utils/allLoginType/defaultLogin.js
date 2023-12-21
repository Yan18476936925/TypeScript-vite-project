import { getUserProfile, getLoginCode } from "@/utils/wxApi.js"
import loging from "@/utils/allLoginType/miniLogin.js" // 登录文件
import store from "@/store/index"
import { compareVersion } from "@/utils/index.js";
const defaultLogin = async (isShow, goRegistered) => {
	return new Promise(async (resolve, reject) => {
		// let user = {};
		// if(compareVersion(store.getters.systemInfo.SDKVersion, "2.10.4") >= 0) {
		// 	try {
		// 		user = await getUserProfile();
		// 	} catch (err) {
		// 		if(!!isShow) {
		// 			uni.showToast({
		// 				icon: "none",
		// 				title: "获取用户信息失败",
		// 				duration: 2000
		// 			});
		// 		}
		// 		reject("获取用户信息失败")
		// 		return;
		// 	}
		// }
		let loginCode = "";
		try {
			loginCode = await getLoginCode();
		} catch (err) {
			if(!!isShow) {
				uni.showToast({
					icon: "none",
					title: "获取用户信息失败,请重试~",
					duration: 2000
				});
			}
			reject("获取用户信息失败,请重试~")
			return;
		}
		if (!!loginCode) {
			store.commit("setLoginCode", loginCode);
			// 设置手机号encryptedData & iv
			// !!user.encryptedData ? store.commit("setEncryptedData", user.encryptedData) : "";
			// !!user.iv ? store.commit("setIv", user.iv) : "";
			global._logger.writeLogs(`非游客静默登录`);
			const loginData = {
				code: loginCode,
				phoneCode: store.getters.phoneCode || '',
				// iv: store.getters.iv || '',
				// encryptedData: store.getters.encryptedData || '',
			}
			!!goRegistered ? loging(loginData, goRegistered) : loging(loginData);
			resolve('success');
		} else {
			global._logger.writeLogs(`非游客强制登录`);
			store.dispatch("logout");
			reject()
		}
	})
}

export default defaultLogin

