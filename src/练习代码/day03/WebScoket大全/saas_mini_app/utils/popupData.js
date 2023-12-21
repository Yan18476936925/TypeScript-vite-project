import { flat } from "./index"
class PopupCenter {
    constructor () {
        /*
			* 弹窗顺序 配置项
        	* newcomerReward 		新人礼包
        	* recoverTrial 			一分试玩弹窗
        	* newbornZone 			新人专区
			* signInPopup			签到弹窗
        	* firstOrder 			首单弹窗
        	* fuliOver 				专属福利弹窗
        	* activity 				活动弹窗
        	* coupon 				快到期的优惠券弹窗
        	* homeTip 				首页提示(加入我的小程序)弹窗
        */
		// this.config = ["signInGuide", "newcomerReward", "fuliOver", "activity", "coupon", "homeTip", "recoverTrial"], // 弹窗展示顺序
		this.config = ["newcomerReward", "recoverTrial", "newbornZone", "signInPopup", "firstOrder", "fuliOver", "activity", "coupon", "homeTip"], // 弹窗展示顺序

        // 根据配置项合成展示数组
        // 格式如右 [[], [], [], [], []]
        // 按照 弹窗顺序 生成
        this.popupData =  this.config.map(name => {
            return []
        })
    }

    // 更新弹窗的数据
    openPopup (name, info, onlyOne) {
        const index = this.config.findIndex(i => {
            return i === name
        });
		if (!!name && index > -1 && !!this.popupData[index]) {
			if (!onlyOne) {
				this.popupData[index].push({
				    type: name,
				    data: info
				});
			} else {
				this.popupData[index] = [{
					type: name,
					data: info
				}]
			}
		}
		uni.$emit("POPUP_POPUPDATA", flat(this.popupData));
    }

    // 关闭弹窗
    closePopup (name) {
        const index = this.config.findIndex(i => {
            return i === name
        })
		// 弹窗关闭逻辑，异常情况添加统一方便排查问题
		if(!!name && index > -1) {
			this.popupData[index].shift()
			uni.$emit("POPUP_POPUPDATA", flat(this.popupData));
		} else {
			global._logger.writeLogs("首页弹窗异常name:", name)
		}
    }
}

const popupCenter = new PopupCenter()

export default popupCenter