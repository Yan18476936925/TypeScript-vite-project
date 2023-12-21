import Vue from "vue"
import Vuex from "vuex"
import {
	formatImg,
	formatHTML,
	base64_decode
} from "./../utils/index.js"
import apply from "./modules/apply"
import { compareVersion } from "./../utils/index.js";
import { appId, version }  from "./../utils/base.js";
import { apiGetUserInfo } from "@/api/login.js"
import { apiGetPosition, apiGetInviteBadge } from "@/api/personal.js"
import QQMapWx from '@/common/qqmap-wx-jssdk.js';

Vue.use(Vuex);

var qqMapSdk;

function clearData(state, commit) {
	state.user = {
		birthday: '',
		birthday_type: '',
		business_address: '',
		business_detailed: '',
		business_name: '',
		business_position: '',
		college: '',
		college_id: '',
		education: '',
		email: '',
		hide_field: [],
		hobbies: '',
		home_address: '',
		home_area: "0",
		home_city: "0",
		home_detailed: "",
		home_province: "0",
		home_street: "0",
		industry: "未选择",
		industry_id: "0",
		introduction: "",
		major: "",
		name: "",
		national: "",
		native_place: "",
		phone: "",
		photo: "",
		school_year: "",
		sex: "",
		social_position: "",
		status: 0,
		update_field: "",
		user_id: "",
		wechat_id: "",
	};
	state.loginTimeRecord = 0;      // 重置登录次数
	state.isSightseer = "1";  		// 进入游客模式
	global.errRefreshPageNum = 0;	// 退出登录时，重置请求限制
	global.ISREFRESHPOPUP = 0; 		// 弹窗重置
	// 2020-11-20 退出登录时，会将所有的缓存清除，导致系统消息不见了，做下优化处理
	// uni.clearStorageSync()
	uni.removeStorageSync("logData")
	uni.removeStorageSync("logDataCache")
	uni.removeStorageSync("userInfo")
	uni.setStorageSync("isSightseerStorage", state.isSightseer) 
}

const store = new Vuex.Store({
	modules: {
		apply
	},
	state: {
		loginCode: "", 			// 登录code
		phoneCode: "", 			// 手机号code
		encryptedData: "",		
		iv: "",					// 登录加密算法参数
		isLoadOrderList: 0, 	// 订单列表是否刷新
		isSightseer: "0",      // 是否游客模式  1--是 0--不是
		invitor: "", // 邀请人ID
		downfrom: "miniapp", // 渠道
		openid: "",
		user: {
			birthday: '',
			birthday_type: '',
			business_address: '',
			business_detailed: '',
			business_name: '',
			business_position: '',
			college: '',
			college_id: '',
			education: '',
			email: '',
			hide_field: [],
			hobbies: '',
			home_address: '',
			home_area: "0",
			home_city: "0",
			home_detailed: "",
			home_province: "0",
			home_street: "0",
			industry: "未选择",
			industry_id: "0",
			introduction: "",
			major: "",
			name: "",
			national: "",
			native_place: "",
			phone: "",
			photo: "",
			school_year: "",
			sex: "",
			social_position: "",
			status: -1,
			update_field: "",
			user_id: "",
			wechat_id: "",
		},
		system: {
			screenWidth: null, 	// 屏幕宽度，单位px
			screenHeight: null, // 屏幕高度，单位px
			windowWidth: null, 	// 可使用窗口宽度，单位px
			windowHeight: null, // 可使用窗口高度，单位px	
			platform: null, 	// 客户端平台
			model: null,		// 设备名称
			canPayVersion: true,// 默认可以调起支付
			SDKVersion: null, 	// 客户端基础库版本
			system: null,		// 操作系统版本
			version: null,		// 宿主 App 版本号（宿主指今日头条、抖音等）
			isIosX: false,      // 不是ipx
		},
		loginTimeRecord: 0, // 用户调用登录次数记录
		wxLogin302: false,		 // 接口302，用于微信小程序更改后重新调起授权弹窗
		netWorkErr: false,       // ws网络情况获取， true--代表ws已关闭，提示重新登录
		wxSharePic: "",
		wxShareTitle: "",
		openStatus: false, // 是否已开启消息订阅
		userNum: 1000,		// 目前用户数量
		messageSubscribe: false,	// 个人中心订阅状态
		// 用户权限
		userPermissions: {
			locationInfo: 0,		// 位置信息,0 默认值 1 已同意 -1 拒绝
		},
		userLocationInfo: {
			latitude: 0,
			longitude: 0,
		}, // 用户经纬度信息
		userLocationType: -1,	// -1 默认值即未开启定位（获取失败也取这个） 0 深圳市外 440300 行政区划代码（只有深圳市内才会有精确的行政区划代码）
		weixinUrl: '',
	},
	getters: {
		// 获取登录code
		loginCode: state => {
			return state.loginCode
		},
		// 获取手机号code
		phoneCode: state => {
			return state.phoneCode
		},
		// 获取登录加密算法参数
		iv: state => {
			return state.iv
		},
		// 获取登录加密算法参数
		encryptedData: state => {
			return state.encryptedData
		},
		openid: state => {
			let userOpenid = uni.getStorageSync("openid");
			return !!userOpenid ? userOpenid || state.openid : state.openid
		},
		applyStatus: state => {
			return state.user.status || -1
		},
		// userInfo: state => {
		// 	let userInfo = uni.getStorageSync("userInfo");
		// 	return !!userInfo && userInfo.user_id ? userInfo : state.user
		// },
		invitor: state => {
			return state.invitor
		},
		// 是否ios
		isIos: state => {
			return !!state.system.platform ? state.system.platform.indexOf("ios") !== -1 : false
		},
		// 是否iosX
		isIpx: state => {
			return state.system.isIosX
		},
		// 是否长屏手机
		isBigScreen: state => {
			return state.system.isBigScreen
		},
		// 1--正常手机（宽高正常） 2--大屏幕手机（高度过大） 3--平板（高度过小）
		bboxSystemType: state => {
			if(!!state.system && !!state.system.screenHeight && state.system.screenWidth) {
				return state.system.screenHeight / state.system.screenWidth > 2 ? 2 : state.system.screenHeight / state.system.screenWidth >
					1.5 ? 1 : 3
			} else {
				return 1
			}
		},
		// 获取用户头像
		userAvatar: state => {
			if(!!state.user.photo && state.user.photo.indexOf("http://thirdwx.qlogo.cn") > -1) {
				state.user.photo = state.user.photo.replace("http://thirdwx.qlogo.cn", "https://wx.qlogo.cn")
			}
			return state.user.photo ? formatImg(state.user.photo) : null
		},
		// 获取用户ID
		userId: state => {
			return state.user.user_id
		},
		// 获取用户昵称
		userNick: state => {
			state.user.name = decodeURIComponent(state.user.name);
			return state.user.name
		},
		// 获取服务器保存的用户手机号码
		userPhone: state => {
			return state.user.phone
		},
		// 获取全部的系统信息
		systemInfo: state => {
			return state.system
		},
		// 获取用户权限开关
		userPermissions: state => {
			return state.userPermissions
		},
		// 是否游客模式
		isSightseer: state => {
			return state.isSightseer
		},
		registerDownfrom: state => {
			return !!state.user.registerDownfrom ? state.user.registerDownfrom : null
		},
		downfrom: state => {
			return state.downfrom || state.downFrom
		},
		// 获取用户调用登录次数记录
		loginTimeRecord: state => {
			return state.loginTimeRecord
		},
		// 接口302，用于微信小程序更改后重新调起授权弹窗
		wxLogin302: state => {
			return state.wxLogin302
		},
		// ws网络情况获取
		netWorkErr: state => {
			return state.netWorkErr
		},
		// 获取小程序来源统计码
		wxInvitorType: state => {
			return state.wxInvitorType
		},
		requestIntercept302: state => {
			return state.requestIntercept302
		},
		// 分享图片
		wxSharePic: state => {
			return state.wxSharePic
		},
		// 分享图片
		wxShareTitle: state => {
			return state.wxShareTitle
		},
		// 消息订阅
		openStatus: state => {
			return state.openStatus
		},
		messageSubscribe: state => {
			return state.messageSubscribe
		},
		userLocationInfo: state => {
			return state.userLocationInfo
		},
		userLocationType: state => {
			return state.userLocationType
		},
		weixinUrl: state => {
			return state.weixinUrl
		},
	},
	actions: {
		// 清除缓存，用于加载小程序前登录过期清除信息，避免异常bug
		logoutOnlyClear({
			state,
			commit
		}){
			global._logger.writeLogs(`登录过期，自动清除登录信息`);
			console.log("登录过期，自动清除登录信息");
			clearData(state, commit);
		},
		// 退出登录,比清除缓存多个强制的302弹窗，用于页面内的登录异常
		logout({
			state,
			commit
		}, dataObj) {
			console.log("主动退出登录成功");
			global._logger.writeLogs(`主动退出登录成功`);
			clearData(state, commit);
			// 主动退出登录
			if(!!dataObj && dataObj.type == 1) {
				uni.showToast({
					title: "退出登录成功，自动返回",
					icon: "none",
					duration: 2000
				})
				setTimeout(() => {
					uni.navigateBack({
					    delta: 1
					});
					// store.commit("setWxLogin302", false)
					// setTimeout(() => {
					// 	store.commit("setWxLogin302", true)
					// }, 10)
				}, 2000)
				return
			}
			// store.commit("setWxLogin302", false)
			setTimeout(() => {
				store.commit("setWxLogin302", true)
			}, 10)
		},
		async getUserDetails({
			state,
			getters,
			commit
		}){
			// console.log('openid_______', getters.openid)
			// return
			await apiGetUserInfo({
				openid: getters.openid
			}).then(res => {
				// console.log('apiGetUserInfo_res', res)
				commit("setUserInfo", res);
				uni.setStorage({
					key: "userInfo",
					data: res
				})
			})
		},
		// 获取职位列表
		async getPosition() {
			return new Promise((resolve, reject) => {
				apiGetPosition().then(res => {
					resolve(res)
				})
			})
			
		},
		// 获取职位列表
		async getInviteBadge() {
			return new Promise((resolve, reject) => {
				apiGetInviteBadge().then(res => {
					resolve(res)
				})
			})
			
		},
		// 初始化地图插件
		initMapSdk() {
			console.log('初始化地图插件')
			qqMapSdk = new QQMapWx({
				key: 'L5ABZ-AEW37-YLYXN-PFC5D-O3DL5-ALBEK'
			})
		},
		MapReverseGeocoder({ store }, data) {
			if(!!qqMapSdk && !!data) {
				return new Promise((resolve, reject) => {
					qqMapSdk.reverseGeocoder({
						location: {
							latitude: data.latitude,
							longitude: data.longitude
						},
						success(res){
							// uni.showToast({
							// 	icon: "none",
							// 	title: "解析success",
							// 	duration: 2000
							// })
							// console.log('store逆地址解析success', res)
							resolve(res)
						},
						fail(err) {
							uni.showToast({
								icon: "none",
								title: err.message,
								duration: 2000
							})
							// console.log('store逆地址解析fail', err)
							reject(false)
						}
					})
				})
			} else {
				uni.showToast({
					icon: "none",
					title: "逆地址解析缺少参数",
					duration: 2000
				})
			}
		},
		MapGeocoder({ store }, data) {
			if(!!qqMapSdk && !!data) {
				return new Promise((resolve, reject) => {
					qqMapSdk.geocoder({
						address: data.address,
						success(res){
							// console.log('store地址解析success', res)
							resolve(res)
						},
						fail(err) {
							uni.showToast({
								icon: "none",
								title: err.message,
								duration: 2000
							})
							// console.log('store地址解析fail', err)
							reject(false)
						}
					})
				})
			}
		}
	},
	mutations: {
		// 设置登录code
		setLoginCode(state,option) {
			state.loginCode = option
		},
		// 设置手机号code
		setPhoneCode(state,option) {
			state.phoneCode = option
		},
		// 设置Iv
		setIv(state,option) {
			state.iv = option
		},
		// 设置encryptedData
		setEncryptedData(state,option) {
			state.encryptedData = option
		},
		// 设置openid
		setOpenId(state,option) {
			state.openid = option
			uni.setStorage({
				key: "openid",
				data: state.openid
			})
		},
		// 更新渠道信息
		setDownfrom(state, option) {
			state.downfrom = option
			state.downFrom = option
		},
		// 更新用户信息
		setUserInfo(state, option) {
			// if(!!option.photo && option.photo.indexOf("http://thirdwx.qlogo.cn") > -1 ) {
			// 	option.photo = option.photo.replace("http://thirdwx.qlogo.cn", "https://wx.qlogo.cn")
			// }
			option.photo = option.photo ? formatImg(option.photo) : null;
			state.user = option
		},
		// 修改微信
		setWechatId(state, option){
			state.user.wechat_id = option
		},
		// 更新系统信息
		setSystemInfo(state, option) {
			state.system = option
		},
		// 更新用户权限开关信息
		setUserPermissionsKey(state, option) {
			state.userPermissions[option.key] = option.val
			uni.setStorage({
				key: "userPermissions",
				data: state.userPermissions
			})
		},
		// 更新用户权限开关信息
		setUserPermissions(state, option) {
			state.userPermissions = option
		},
		// 更新头像
		setUserAvatar(state, option) {
			state.user.photo = option
			// 在本地缓存更新 user 信息
			uni.setStorage({
				key: "userInfo",
				data: state.user
			})
		},
		// 更新手机号码
		setUserPhone(state, option) {
			state.user.phone = option
			// 在本地缓存更新 user 信息
			uni.setStorage({
				key: "userInfo",
				data: state.user
			})
		},
		// 更新昵称
		setUserNick(state, option) {
			// 如果昵称存在enjoy表情，则先编码再解码保存，避免图片打开乱码
			state.user.name = decodeURIComponent(encodeURIComponent(option))
			// 在本地缓存更新 user 信息
			uni.setStorage({
				key: "userInfo",
				data: state.user
			})
		},
		// 是否游客模式
		setIsSightseer(state, option) {
			state.isSightseer = option
		},
		// 设置自定义tab高度
		setNavBarHeight(state, h) {
			state.navBarHeight = h
		},
		setInvitor(state, id) {
			return state.invitor = id
		},
		// 接口302，用于微信小程序更改后重新调起授权弹窗
		setWxLogin302(state, option) {
			state.wxLogin302 = option
		},
		// 设置网络情况
		setNetWorkErr(state, option) {
			state.netWorkErr = option
		},
		// 设置302请求拦截
		setRequestIntercept302(state, option) {
			state.requestIntercept302 = option
		},
		// 设置分享图片
		setWxSharePic(state, option) {
			state.wxSharePic = option
		},
		// 设置分享标题
		setWxShareTitle(state, option) {
			state.wxShareTitle = option
		},
		// 设置是否已消息订阅
		setOpenStatus(state,option) {
			state.openStatus = option
		},
		// 设置消息订阅状态
		setMessageSubscribe(state, option) {
			state.messageSubscribe = option
		},
		// 设置用户经纬度信息
		setUserLocationInfo(state, option) {
			state.userLocationInfo = option
		},
		// 设置用户定位类型
		setUserLocationType(state, option) {
			state.userLocationType = option
		},
		// 设置微信跳转链接
		setWeixinUrl(state, option) {
			state.weixinUrl = option
		},
	}
})

export default store
