import { apiMinilog } from "@/api/globalSettingInfo.js"
import store from "@/store/index.js";
import { formatTime } from "./index.js"
class _logger {
	constructor() {
		this.logData = [] 			// 日志
		this.logDataCache = [] 		// 缓冲区日志
		this.isSaveLogs = false 	// 是否在上传日志中
		this.maxSaveLength = 150 	// 最大保存数目（部分接口返回数据过多，导致单个缓存值超载，缩小每篇日志数量）
		this.maxTemporaryLength = 200 // 最大临时保存数目
	}

	// 初始化，日志文件夹不存在=》创建
	async init() {
		if (uni.getStorageSync("logData") == "undefined" || uni.getStorageSync("logData") === "") {
			uni.setStorageSync("logData", [])
		}
		if (uni.getStorageSync("logDataCache") == "undefined" || uni.getStorageSync("logDataCache") === "") {
			uni.setStorageSync("logDataCache", []);
		}
		this.logData = uni.getStorageSync("logData");
		this.logDataCache = uni.getStorageSync("logDataCache");
	}

	// 写入日志，写入成功上传到本地缓存
	async writeLogs(log, logMoll) {
		if (!this.isSaveLogs) {
			this.writeLogsToSave("logData", log, logMoll);
			// 日志数目达到上限并且用户已经登录，自动上传日志
			if (((this.logData.length > this.maxSaveLength) || (this.logDataCache.length > this.maxSaveLength)) && !!store.getters.userId) {
				this.saveLogs(this.logData);
			}
		} else {
			this.writeLogsToSave("logDataCache", log, logMoll);
		}
	}
	
	// 实际写入内容
	writeLogsToSave(dataName, log, logMoll) {
		// 日志格式整理
		let _logDataTmp = {
			time: formatTime(Date.now()),
		};
		if(this[dataName].length === 0) {
			_logDataTmp.phoneModel = store.state.system.model;
			_logDataTmp.userId = store.getters.userId;
		}
		if(this[dataName].length >= this.maxTemporaryLength) {
			if(!this[dataName][this.maxTemporaryLength-1].isLast) {
				this[dataName] = this[dataName].slice(0, this.maxTemporaryLength - 1);
				let lastObj = typeof log === "string" ? log : JSON.stringify(log);
				_logDataTmp.result = "缓存保存失败，达到临时最大值" + lastObj;
				_logDataTmp.isLast = 1;
				this[dataName].push(_logDataTmp)
				this.saveInStorage(dataName)
			} else {
				return
			}
		// 没有达到临界值，继续保存 
		} else {
			if (typeof log === "string") {
				_logDataTmp.info = log;
				_logDataTmp.result = logMoll;
				this[dataName].push(_logDataTmp);
			} else if (typeof log === "object") {
				this[dataName].push(log);
			}
			this.saveInStorage(dataName)
		}
	}
	
	// 保存写进缓存
	saveInStorage(dataName) {
		// 不影响逻辑，缓存超出的情况下自动清理缓存
		try {
		    uni.setStorageSync(dataName, this[dataName]);
		} catch (e) {
			// 用户已登录并且处于日志区直接保存日志，否者清除缓存，以免逻辑进行不下去
			if(!!store.getters.userId && dataName === "logData") {
				this.saveLogs(this.logData);
			} else {
				uni.setStorageSync(dataName, []);
				this[dataName] = [];
				this.writeLogs("不影响逻辑强制清除" + (dataName === "logData" ? "" : "临时区") + "缓存")
			}
		}
	}
	
	// 保存日志，上传到服务器，并清空缓存
	async saveLogs(_tmpLogs) {
		this.isSaveLogs = true;
		// let options = {
		// 	tmpLogs: _tmpLogs,
		// }
		// apiMinilog(options).then(res => {
		// 	this.logData = this.logDataCache;
		// 	this.isSaveLogs = false;
		// 	uni.setStorageSync("logData", this.logDataCache)
		// 	// // 清空缓冲区
		// 	this.logDataCache = [];
		// 	uni.setStorageSync("logDataCache", []);
		// }).catch(err => {
		// 	// 上传接口失败时，状态没有重置，logDataCache临时缓存一直增加，但是释放不了，此时应该重置状态，触发重新上传，清除logDataCache
		// 	this.isSaveLogs = false
		// })
	}
}

export default _logger;
