/*
 * @Author: ZhangST 
 * @Date: 2019-03-12 09:31:47 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-14 18:26:27
 */

// 微信获取loginCode
export function getLoginCode() {
	return new Promise((resolve, reject) => {
		uni.login({
			success(res) {
				if (res.code) {
					resolve(res.code)
				}
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

// 检查登录 session 状态
export function checkSession() {
	return new Promise((resolve, reject) => {
		uni.checkSession({
			success(res) {
				resolve()
			},
			fail(err) {
				global._logger.writeLogs(`检查登录session状态`, JSON.stringify(err));
				reject()
			}
		})
	})
}

// 获取用户信息
export function getUserInfo() {
	return new Promise((resolve, reject) => {
		uni.getUserInfo({
			withCredentials: true,
			success(res) {
				resolve(res)
			},
			fail(err) {
				reject(err)
				console.log(err.errMsg)
			}
		})
	})
}

export function getUserProfile() {
	return new Promise((resolve, reject) => {
		wx.getUserProfile({
			lang: 'zh_CN',
			desc: '用户信息',
			success(res) {
				console.log('getUserProfile___res:', res)
				resolve(res)
			},
			fail(err) {
				global._logger.writeLogs(`调用getUserProfile接口异常`, err);
				console.log('getUserProfile___err:', err)
				reject(err)
			}
		})
	})
}

// 获取用户授权情况
export function getSetting() {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success(res) {
				resolve(res)
			},
			fail(err) {
				reject(err)
				console.log(err.errMsg)
			}
		})
	})
}

// 进行微信授权
export function authorize(scope) {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success(res) {
				if (!res.authSetting[scope]) {
					uni.authorize({
						scope,
						success(res) {
							resolve(res)
						},
						fail(err) {
							reject(err)
							console.log(err.errMsg)
						}
					})
				}
			}
		})
	})
}

// 检查网络状态
export function getNetworkType() {
	return new Promise((resolve, reject) => {
		uni.getNetworkType({
			success(res) {
				var networkType = res.networkType;
				if (networkType == "none" || networkType == "unknown") {
					resolve(0)
				} else {
					resolve(1)
				}
			},
			fail(err) {
				reject(2)
				console.log('检查网络状态err', err)
			}
		})
	})
}

// 调用微信支付
export function pay(options) {
	global._logger.writeLogs(`调起支付获取数据`, JSON.stringify(options));
	// #ifdef MP-WEIXIN
	const {
		timeStamp,
		nonceStr,
		signType,
		paySign
	} = options
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			timeStamp,
			nonceStr,
			package: options.package,
			signType,
			paySign,
			success(res) {
				resolve(res)
			},
			fail(err) {
				console.log('err', err)
				if (err.errMsg === 'requestPayment:fail cancel') {
					uni.showToast({
						title: '已取消支付',
						icon: 'none',
						duration: 2000
					})
				} else {
					uni.showToast({
						title: '支付失败',
						icon: 'none',
						duration: 2000
					})
				}
			}
		})
	})
	// #endif
	// #ifdef MP-BAIDU
	const {
		appKey,
		bizInfo,
		dealId,
		dealTitle,
		rsaSign,
		signFieldsRange,
		totalAmount,
		tpOrderId
	} = options
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: 'baidu',
			orderInfo: {
				dealId,
				appKey,
				totalAmount,
				tpOrderId,
				dealTitle,
				rsaSign,
				bizInfo,
				signFieldsRange
			}, //订单数据
			success: function(res) {
				resolve(res)
				// console.log('success:' + JSON.stringify(res));
			},
			fail: function(err) {
				// console.log('fail:' + JSON.stringify(err));
				uni.showToast({
					title: err.errMsg,
					icon: 'none',
					duration: 2000
				})
				global._logger.writeLogs(`支付失败`, JSON.stringify(err));
			}
		});
	})
	// #endif
}

// 是否有新版本
export function getMiniUpdateManager() {
	const updateManager = uni.getUpdateManager();
	updateManager.onCheckForUpdate(function(res) {
		// 请求完新版本信息的回调
		if(res.hasUpdate) {
			uni.showToast({
				title: '版本更新...',
				icon: 'none',
				duration: 2000
			})
		}
	});
	updateManager.onUpdateReady(function(res) {
		uni.showModal({
			title: '更新提示',
			content: '新版本已经准备好，是否重启应用？',
			success(res) {
				if (res.confirm) {
					uni.clearStorageSync(); 
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				}
			}
		});
	});
	updateManager.onUpdateFailed(function(res) {
		// 新的版本下载失败
		uni.showModal({
			title: '提示',
			content: '检查到有新版本，但下载失败，请检查网络设置',
			showCancel: false,
		})
	});
}
