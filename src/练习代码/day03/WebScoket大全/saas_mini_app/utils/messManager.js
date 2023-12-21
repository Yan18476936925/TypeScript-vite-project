/*
*	消息管理，原文件形式存储改为本地缓存
*	初始定义超出100条数据清除旧数据
*/ 
class MessManager {
    constructor () {
        this.messNumber = 50;			// 初始定义临界值
		this.holdMessNumber = 40;    	// 达到临界值保留的消息数目，保留低于初定义临界值，避免每次新增执行代码过多
    }

    // 初始化，消息管理空间不存在=》创建
    async init () {
        if(uni.getStorageSync("messManager")=="undefined"||uni.getStorageSync("messManager")==="") {
            uni.setStorageSync("messManager", [])
        }
    }

    // 新增消息
    addMess ({ time, title, content, buttonText, picture, url, touchId }) {
		let lastMessManager = uni.getStorageSync("messManager");
		if(!lastMessManager) lastMessManager = [];
        lastMessManager.unshift({
            time,
            title,
            content,
            buttonText,
			picture,
            url,
			touchId,
        })
		uni.setStorageSync("messManager", lastMessManager)
    }
	
	// 清除旧消息
	removeOldMess () {
		let lastMessManager = uni.getStorageSync("messManager");
		if( lastMessManager.length > this.messNumber ) {
			lastMessManager.length = this.holdMessNumber
			uni.setStorageSync("messManager", lastMessManager)
		}
	}
	
	// 清除全部消息（暂不需要） 
	delOldMess () {
		uni.removeStorage({
		    key: "messManager",
		    success: function (res) {
		        global._logger.writeLogs("消息管理全部清空完成, 清空时间", Date.now());
		    }
		});
	}
}

export default MessManager;