import loging from "@/utils/allLoginType/miniLogin.js" // 登录文件
import store from "@/store/index"

const tokenLogin = async () => {
	return new Promise(async (resolve, reject) => {
		// store.commit("setTokenLogging", true)
		const userInfo = uni.getStorageSync("userInfo")
		// 判断缓存是否有token和unionId
		if(!!userInfo && !!userInfo.token && !!userInfo.unionId) {
			console.log('有缓存参数')
			// 2021-03-30 gxx说通过微信获取的参数都不需要传
			let _data = { 
				invitorType: !!store.getters.wxInvitorType && store.getters.wxInvitorType != -1 ? store.getters.wxInvitorType : '',
				invitor: !!store.getters.invitor ? store.getters.invitor : '',
				freeActivityId: !!store.getters.freeActivityId ? store.getters.freeActivityId : '',
				fineActivityId: !!store.getters.fineActivityId ? store.getters.fineActivityId : '',
				token: userInfo.token,
				unionId: userInfo.unionId,
				model: !!store.getters.systemInfo.model ? store.getters.systemInfo.model : '',
				onVersion: !!store.getters.systemInfo.system ? store.getters.systemInfo.system : '',
			}
			let data = {}
			try {
				global._logger.writeLogs("token登录");
				data = await loging(_data, false);
				resolve();
			} catch(e) {
				//TODO handle the exception
				// store.commit("setTokenLogging", false)
				global._logger.writeLogs("token登录异常");
				reject(e)
				return
			}
			// store.commit("setTokenLogging", false)
		} else {
			console.log('缺少缓存参数')
			global._logger.writeLogs(`缺少token或unionId，登录无效`);
			// store.commit("setTokenLogging", false)
			// store.dispatch("logout");
			reject("缺少token或unionId")
		}
	})
}

export default tokenLogin