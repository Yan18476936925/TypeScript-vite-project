import { qiniuUrl, appTitle, version, sharePic } from "./base.js"    			// 基本信息文件
import { appLink, switchTabs, switchTabsAll } from "./mappingTable.js"    // 映射表总表信息
import store from "@/store/index"
// 格式化图片地址
export function formatImg (fileid, isOpenImageslim, getPicWidthSize, getPicHeightSize) {
	if(!fileid) {
		return ""
	} else {
		// 旧默认地址更改
		if(fileid.indexOf("Fn5pyxn851CoFrGDRaeu5mQ-ZacR.jpg") > -1 || fileid.indexOf("Fmqiu_QogsB5XGWYjIIG9Q2vIhJI.jpg") > -1) {
			return "https://duimianimg.loovee.com/style/blindbox/bbox/defalutUserAva.png"
		}
		// 微信的图片存在http协议强制改为https, 预防带参含有http截取前部分更改就好,其他的路径保留
		if(fileid.indexOf("http") > -1) {
			fileid = fileid.indexOf("http://wx.qlogo.cn") > -1 ? "https://" + fileid.slice(7) : fileid
		} else {
			fileid = qiniuUrl + fileid;
		}
		// 非gif图
		if(fileid.indexOf(".gif") === -1) {
			// 七牛图片处理的方法，前提是七牛上的资源，且没有经过处理
			if((fileid.indexOf("duimianimg.loovee.com") > -1 || fileid.indexOf("img1.duimian.cn") > -1) && fileid.indexOf("?") === -1) {
				// 安卓手机使用webp格式转换
				if(!!store.state.system.platform && !store.getters.isIos) {
					fileid += "?imageView2/0/format/webp";
				// 是否打开图片瘦身
				} else if(isOpenImageslim && (fileid.indexOf(".jpg") > -1 || fileid.indexOf(".png") > -1)) {
					fileid += "?imageslim"
				} 
				// 是否打开压缩
				// else if(!!getPicWidthSize || !!getPicHeightSize) {
				// 	fileid += `?imageMogr2/thumbnail/${getPicWidthSize}x${getPicHeightSize}`
				// }
			}
		}
		return fileid
	}
}

// 获取小程序链接携带的参数（兼容二维码打开）
export function getOptions (options) {
	let info = {}
	if (!!options.scene) {
		// 通过二维码打开
		const scene = decodeURIComponent(options.scene)
		scene.replace(/([\da-zA-Z]+)=([\da-zA-Z]+)/g, (res, $1, $2) => {
			info[$1] = $2
		})
	} else info = options
	return info
}

// 获取小程序二维码打开携带的参数
export function getQRCodeOptions (options, splitCode="#") {
	if (!!options.scene) {
		return decodeURIComponent(option.scene).split(splitCode);
	}
	return []
}

// 获取链接携带的参数
export function getLinkParam (option) {
	var _str = "";
	for(var i in option){ 
		if(option[i]){ 
			_str += i + "=" + option[i] + "&"; 
		} 
	} 
	var _str = _str.substring(0, _str.length-1);
	return _str; 
}
/**
 * 获取图片信息
 */
export function getImageInfo(url) {
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src: url,
			success: (image) => {
				resolve(image)
			},
			fail: (errMsg) => {
				reject(errMsg)
			}
		})
	})
}
// 页面跳转
export function pageJump (url, type = "navigateTo") {
	if(!url) {
		uni.showToast({
			icon: "none",
			title: "即将上线，敬请期待~",
			duration: 2000,
		})
		return
	}
	// #ifndef MP-WEIXIN
		if(url.indexOf("app://liveRoom") > -1) {
			uni.showToast({
				icon: "none",
				title: "仅在微信小程序打开",
				duration: 2000,
			})
			return
		}
	// #endif
	// #ifdef MP-TOUTIAO
		uni.showLoading({
			title:"加载中..."
		})
	// #endif
	let pageJumpUrl = "";     // 最终跳转链接
	// 盲盒小程序页面
	if (url.indexOf("app://") > -1) {
		if(store.state.isSightseer == 1){
			uni.$emit("OPEN_SIGHTSEER_POPUP")
			return
		}
		// 客户端跳转小程序
		if(url.indexOf("app://miniApp") > -1) {
			let miniAppArr1 = url.split("app://miniApp?path=");
			let miniAppArr2 = miniAppArr1[1].split("?");
			type = switchTabsAll.indexOf(miniAppArr2[0]) !== -1 ? "switchTab": type;
			pageJumpUrl = miniAppArr1[1];
		// app的配置形式跳转
		} else {
			let miniAppArr1 = url.split("?");
			type = switchTabsAll.indexOf(appLink[miniAppArr1[0]]) !== -1 ? "switchTab": type;
			if(!!appLink[miniAppArr1[0]]) {
				// 客户端没有与小程序沟通，导致这里要专门去判断一番赏的跳转，为了兼容，这里代码可读性变差，没以前优雅了撒[哭]（客户端已经发包了，处理不了了[微笑]） 2021-07-20 ZJD
				// 判断是否是一番赏相关的跳转
				pageJumpUrl = !!miniAppArr1[1] ? appLink[miniAppArr1[0]] + "?" + miniAppArr1[1] : appLink[miniAppArr1[0]];
			} else {
				pageJumpUrl = "/pages/home/main";
				type = "switchTab";
			}
		}
		// // 判断为跳转首页分类
		// if(type === "switchTab" && pageJumpUrl.indexOf("pages/home/main") > -1 && pageJumpUrl.indexOf("groupId") > -1) {
		// 	let _startPlace = pageJumpUrl.indexOf("groupId");
		// 	let _endPlace = pageJumpUrl.indexOf("&");
		// 	let _runIndex = _endPlace > -1 ? pageJumpUrl.slice(_startPlace + 8, _endPlace) : pageJumpUrl.slice(_startPlace + 8);
		// 	pageJumpUrl = "/pages/home/main";
		// 	uni.$emit("HOME_HOMECLASSIFY", +_runIndex)
		// }
		uni[type]({
			url: pageJumpUrl
		})
	// 潮町小程序页面
	} else if (url.indexOf("http") > -1) {
		// 外联的打开环境 isH5:h5页面   isSmartprogram:百度小程序	 miniprogram:微信小程序
		let uniappEnv = "miniprogram";
		// 链接带参
		// #ifdef MP-BAIDU
			uniappEnv = "isSmartprogram";
		// #endif
		// #ifdef MP-WEIXIN
			uniappEnv = "miniprogram";
		// #endif
		// #ifdef MP-TOUTIAO
			uniappEnv = "zjtdprogram";
		// #endif
		if(url.indexOf("?") !== -1) {
			let dataRes = url.split("?")
			if(url.indexOf('mp.weixin.qq.com') != -1) {
				store.commit('setWeixinUrl', url)
				pageJumpUrl = `/pages/webView/main?url=${dataRes[0]}&${dataRes[1]}&isH5=${uniappEnv}&downfrom=${store.getters.downfrom}`
			} else {
				pageJumpUrl = `/pages/webView/main?url=${dataRes[0]}&${dataRes[1]}&isH5=${uniappEnv}&downfrom=${store.getters.downfrom}`
			}
		// 不带参
		} else {
			if(url.indexOf('mp.weixin.qq.com') != -1) {
				store.commit('setWeixinUrl', url)
				pageJumpUrl = `/pages/webView/main?url=${url}&isH5=${uniappEnv}&downfrom=${store.getters.downfrom}`
			} else {
				pageJumpUrl = `/pages/webView/main?url=${url}&isH5=${uniappEnv}&downfrom=${store.getters.downfrom}`
			}
		}
		pageJumpUrl = shareLinkAddBrandId(pageJumpUrl);
		uni[type]({
			url: pageJumpUrl
		})
	} else {
		let miniAppArr1 = url.split("?");
		type = switchTabsAll.indexOf(miniAppArr1[0]) !== -1 ? "switchTab": type;
		console.log("url",url,type)
		uni[type]({
			url: url
		})
	}
}
export function checkUserStatus() {
	console.log('store.state.user.status', store.state.user.status)
	if(store.state.user.status == 0) {
		uni.showToast({
			title: "入会信息审核中，需等审核通过后查看",
			icon: "none"
		})
		return false
	} else if(store.state.user.status != 1) {
		uni.showToast({
			title: "还未入会,请先加入深大会哦",
			icon: "none"
		})
		return false
	} else {
		return true
	}
}
// 根据经纬度判断距离
export function calculateDistanceFunc(lat1, lng1, lat2, lng2) {
	var radLat1 = Rad(lat1);
	var radLat2 = Rad(lat2);
	var a = radLat1 - radLat2;
	var b = Rad(lng1) - Rad(lng2);
	var r = 6378.137;
	var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	distance = distance * r;
	distance = Math.round(distance * 10000) / 10000;
	console.log('distance', typeof distance, distance)
	
	if(distance < 1 && distance > 0) {
		// distance = (distance * 1000).toFixed(1) + 'm'
		// if(((distance * 1000 + '').indexOf('.') != -1)) {
		// 	console.log('111')
		// 	distance = (distance * 1000).toFixed(1) + 'm'
		// } else {
		// 	console.log('222')
		// 	distance = (distance * 1000) + 'm'
		// }
		distance = ((distance * 1000 + '').indexOf('.') != -1) ? (distance * 1000).toFixed(1) + 'm' : (distance * 1000) + 'm'
	} else if(distance <= 0) {
		distance = '您已在这里'
	} else {
		// distance = distance.toFixed(1) + 'km'
		distance = ((distance + '').indexOf('.') != -1) ? distance.toFixed(1) + 'km' : distance + 'km'
	}
	return distance
}

export function Rad(d) {
	//根据经纬度判断距离
	return d * Math.PI / 180.0;
}

// toast
export function toast(message) {
	if(typeof message === 'string') {
		uni.showToast({
			title: message,
			icon: "none"
		})
	} else {
		uni.showToast(message);
	}
}

// 格式化数字
export function formatNumber (n) {
    const str = n.toString()
	return str[1] ? str : `0${str}`
}

// 获取格式化的时间
// type = YYYY-MM-dd HH:mm:ss (间隔随意写)
export function formatTime (date, type = "YYYY-MM-dd HH:mm:ss") {
	let timeDate = date
	// 补全时间戳
	if (date.toString().length < 13) {
		timeDate += "000"
	}

    const time = new Date(+timeDate)
	
	let format = type
	
	const year = time.getFullYear()
	const month = time.getMonth() + 1
	const day = time.getDate()

	const hour = time.getHours()
	const minute = time.getMinutes()
	const second = time.getSeconds()
	
	format = format.replace("YYYY", formatNumber(year))
	format = format.replace("MM", formatNumber(month))
	format = format.replace("dd", formatNumber(day))
	format = format.replace("HH", formatNumber(hour))
	format = format.replace("mm", formatNumber(minute))
	format = format.replace("ss", formatNumber(second))

	return format
}

// 另一种时间格式化
export function msgFormatDate (time) {
	// 时间格式转换
	if (!time) return ""
	let timeDate = time
	// 补全时间戳
	if (time.toString().length < 13) {
		timeDate += "000"
	}
	var dateTime = new Date(+timeDate).getTime()
	var nowData = Date.now() - dateTime; // 现在的时间 减去 最新一条消息的时间, (这条消息过了多久了)
	// 1分钟内
	if(nowData < 60 * 1000) {
		return "刚刚"
		// 1min--2min
	} else if(nowData < 120 * 1000) {
		return "1分钟前"
	} else if(nowData < 3600 * 1000){
		return (nowData / 60 / 1000 >> 0)+"分钟前"
	} else if(nowData < 3600 * 24 * 1000) {
		return ( nowData / 3600 / 1000 >> 0)+"小时前"
	} else if(nowData < 3600 * 24 * 7 * 1000) {
		return (nowData / (3600 * 24 * 1000) >> 0)+"天前"
	}else {
		return formatTime(dateTime, "YYYY年MM月dd日");
	}
}

// 发布时间格式化（社区）
export function forumFormatDate (time) {
	// 时间格式转换--time单位秒
	if (!time) return ""
	let nowData = Date.now()/1000 - time;
	let afterTime = new Date(parseInt(time*1000));
	let isNowYear = formatTime(new Date(), "YYYY") - formatTime(afterTime, "YYYY");
	// 1分钟内
	if(nowData < 60) {
		return "刚刚"
	// 1min--2min
	} else if(nowData < 120) {
		return "1分钟前"
	} else if(nowData < 3600){
		return (nowData/60>>0)+"分钟前"
	} else if(nowData < 3600*24) {
		return (nowData/3600>>0)+"小时前"
	} else if(nowData < 3600*48) {
		return "昨天"
	} else if(nowData < 3600*72) {
		return "前天"
	}else if(isNowYear === 0){
		return formatTime(afterTime, "MM月dd日");
	} else {
		return formatTime(afterTime, "YYYY年MM月dd日");
	}
}

// 处理倒计时
export function formatCount(date, serverTime, type = "YYYY-MM-dd HH:mm:ss") {
	let timeDate = date
	// 补全时间戳
	if (date.toString().length < 13) {
		timeDate += "000"
	}
	// -1, -2跳过当前时间传递，直接在外面处理，用于多数据遍历
	// -1为正常展示  -2倒计时不会出现天数，小时数叠加
	if(serverTime > -1) {
		var nowTime = serverTime * 1000
		var endTime = new Date( Math.floor(timeDate)).getTime()
		var t = endTime - nowTime
	} else {
		var t = timeDate;
	}
	// var y = Math.floor(t / 1000 / 60 / 60 / 24)
	// var m = Math.floor(t / 1000 / 60 / 60 / 24)
	if(serverTime === -2) {
		var day = ""
		var hour = Math.floor(t / 1000 / 60 / 60 )
	} else {
		var day = Math.floor(t / 1000 / 60 / 60 / 24)
		var hour = Math.floor(t / 1000 / 60 / 60 % 24)
	}
	var minute = Math.floor(t / 1000 / 60 % 60)
	var second = Math.floor(t / 1000 % 60)
	
	let format = type
	// format = format.replace("YYYY", formatNumber(year))
	// format = format.replace("MM", formatNumber(month))
	format = format.replace("dd", formatNumber(day))
	format = format.replace("HH", formatNumber(hour))
	format = format.replace("mm", formatNumber(minute))
	format = format.replace("ss", formatNumber(second))
	return format
}

// 动态设置导航颜色
export function setBarColor (color = "#FFFFFF", frontColor="#000000") {
    uni.setNavigationBarColor({
		frontColor: frontColor,
		backgroundColor: color
	})
}

// 动态设置标题（抖音存在首次赋值显示成功但是并没有更改，二次赋值）
export function setTitle (title) {
	// #ifdef MP-TOUTIAO
		tt.setNavigationBarTitle({
			title: title,
			fail(res) {
				tt.setNavigationBarTitle({
					title: title,
				})
			}
		});
	// #endif
	// #ifndef MP-TOUTIAO
		uni.setNavigationBarTitle({
			title
		})
	// #endif
}

// 获取UUID
export function uuid () {
	let s = [];
	let hexDigits = "0123456789abcdef";
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = "-";

	let uuid = s.join("");
	return `${uuid}.png`;
}

// 对比版本号
export function compareVersion (v1, v2) {
	// 去除版本符号（V）
	if(!!v1) {
		v1.toUpperCase().indexOf("V") > -1 ? v1 = v1.slice(1) : "";
	}
	if(!!v2) {
		v2.toUpperCase().indexOf("V") > -1 ? v2 = v2.slice(1) : "";
	}
	// 相同位数版本号判断
	v1 = v1 ? v1.split(".") : "";
	v2 = v2 ? v2.split(".") : "";
	const len = Math.max(v1.length, v2.length)
	while (v1.length < len) {
		  v1.push("0")
	}
	while (v2.length < len) {
		  v2.push("0")
	}
	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i])
		const num2 = parseInt(v2[i])
		if (num1 > num2) {
			return 1
		} else if (num1 < num2) {
			return -1
		}
	}
	return 0
}

// 一键复制
export function copy (data) {
	uni.setClipboardData({
		data: data.toString(),
		success: function (res) {
			uni.showToast({
				title: "复制成功",
				icon: "success",
				duration: 2000
			})
		},
		fail: function(err){
			uni.showToast({
				title: err,
				icon: "none",
				duration: 2000
			})
		}
	});
}

// 生成随机的6位数 例如36进制0.64elzbsoefo 统一过滤0.64前四位 
export function requestNum () {
	return Math.random().toString(36).slice(4, 10)
}

// 从数组随机获取 
export function getRandomId (arr) {
	let len = arr.length;
	let randomIdx = Math.floor(Math.random() * len)
	return arr[randomIdx];
}

// 根据对象的属性给数组排序
export function attrSort (arr, attr) {
	return arr.sort(((attr,rev) => {
        // 第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        
        return function(a,b){
            a = +a[attr];
            b = +b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    })(attr, false)) // (这里我默认传了倒序)
}

// 简单过滤特殊符号
export function filterSpecial (str) {
	if(typeof str!=="string"){
		return "";
	}
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#%_——￥……&*（）&;—|{}【】‘；：”“'。，、？]")
	var rs = "";
	for (var i = 0; i < str.length; i++) {
		rs = rs + str.substr(i, 1).replace(pattern, "")
	}
	return rs;
}

// 编码，配合encodeURIComponent使用
export function base64_encode (str) {
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0, len = str.length, strin = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
			strin += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
			strin += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return strin
}

// 解码，配合decodeURIComponent使用
export function base64_decode (input) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = base64EncodeChars.indexOf(input.charAt(i++));
        enc2 = base64EncodeChars.indexOf(input.charAt(i++));
        enc3 = base64EncodeChars.indexOf(input.charAt(i++));
        enc4 = base64EncodeChars.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
        }
	}
    return utf8_decode(output);
}

// utf-8解码
export function utf8_decode (utftext) {
    var string = "";
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c1 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else {
            c1 = utftext.charCodeAt(i + 1);
            c2 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }
    return string;
}

// 定义分享信息 title：分享标题  path:分享落地页路径  imageUrl:分享图片
// https://duimianimg.loovee.com/style/img/h5/blindbox/mini_img/xiaochengxufenxiangtu_2.png
export function baseShareData(title=`校友们，点开加入我们的深大会吧～`, path="/pages/home/main", imageUrl= sharePic){
	// 如果配置通用分享,而且没有另外修改分享文案，使用通用的配置
	if(!!store.getters.wxSharePic && imageUrl=== sharePic) {
		// imageUrl = global.wxSharePic
		imageUrl = store.getters.wxSharePic
	}
	if(!!store.getters.wxShareTitle && title === `校友们，点开加入我们的深大会吧～`) {
		// title = global.wxShareTitle
		title = store.getters.wxShareTitle
	}
	// 20200617分销更改方案，所有分享用户本身就是商户的带上商户id
	path = shareLinkAddBrandId(path);
	return {
		title,
		path,
		imageUrl,
	}
}

// 定义分享朋友圈信息 title：分享标题  query:分享落地页路径  imageUrl:分享图片
export function baseShareWechatMomentsData({title, query = "", imageUrl}){
	let registerVal = store.getters.registerDownfrom;
	if(!registerVal) {
		// #ifdef MP-WEIXIN
			registerVal = "miniapp";
		// #endif
		// #ifdef MP-BAIDU
			registerVal = "baiduMiniApp";
		// #endif
		// #ifdef MP-TOUTIAO
			registerVal = "bytedance";
		// #endif
	}
	let concatIcon = !!query ? "&" : "";
	query += `${concatIcon}downfrom=${registerVal}`;
	return {
		title,
		query,
		imageUrl,
	}
}

// 链接拼接商户id 20200617分销更改方案，所有分享用户本身就是商户的带上商户id
export function shareLinkAddBrandId(pathUrl) {
	let registerVal = store.getters.registerDownfrom;
	if(!pathUrl) {
		return "/pages/home/main"
	}
	if(!registerVal) {
		// #ifdef MP-WEIXIN
			registerVal = "miniapp";
		// #endif
		// #ifdef MP-BAIDU
			registerVal = "baiduMiniApp";
		// #endif
		// #ifdef MP-TOUTIAO
			registerVal = "bytedance";
		// #endif
	}
	// 链接带参并且带downfrom属性，更新属性，否则正常拼接
	
	if(pathUrl.indexOf("downfrom") > -1 && pathUrl.indexOf("?") > -1) {
		var beforePathArr = pathUrl.split('?');
		var pathArr = beforePathArr[1].split('&');
		pathArr.forEach((v, k) => {
			if(v.indexOf('downfrom')> -1) {
				pathArr[k]=`downfrom=${registerVal}`
			}
		})
		pathUrl = beforePathArr[0] + '?' + pathArr.join('&');
	} else {
		pathUrl += pathUrl.indexOf("?") > -1 ? `&downfrom=${registerVal}` : `?downfrom=${registerVal}`;
	}
	return pathUrl
}

// 拉平数组，只能拉一层
// 如 [1, [2, 3, 4]] = [1, 2, 3, 4]
export function flat (arr) {
    let newArr = []
    arr.forEach(item => {
        if (Array.isArray(item)) {
            item.forEach(data => {
                newArr.push(data)
            })
        } else {
            newArr.push(item)
        }
    })
    return newArr
}

// 等奖等级 阿拉伯数字转汉字
export function lvChinese (num, type = "") {
	const baseChinese = ["零","一","二","三","四","五","六","七","八","九"];
	return baseChinese[num>>0] + type
}

// 等奖等级 阿拉伯数字转汉字(用于超过个位数的转换)
export function numberFromatChinese (num) {
	let changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	let unit = ["", "十", "百", "千", "万"];
	num = parseInt(num);
	let getWan = (temp) => {
		let strArr = temp.toString().split("").reverse();
		let newNum = "";
		for (var i = 0; i < strArr.length; i++) {
			newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
		}
		return newNum;
	}
	let overWan = Math.floor(num / 10000);
	let noWan = num % 10000;
	if (noWan.toString().length < 4) noWan = "0" + noWan;
	return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

// #ifdef MP-BAIDU
// 配置页面基础信息 
/*
*title	页面标题
*keywords	页面关键词，多个关键词之间使用英文逗号“,”隔开
*description	页面描述信息
*releaseDate	入宿主APP信息流为必填
*articleTitle	文章(内容)标题(适用于当前页面是图文、视频类的展示形式，文章标题需要准确标识当前文章的主要信息点；至少6个字，不可以全英文。)
*image	图片线上地址，用于信息流/搜索等流量场景分发、用户收藏后的页面封面显示，展现时有图片可提升用户点击率。开发者可针对一个页面设置最多3张，图片必须为页面内图片。单图片最大2M；封面图尺寸：宽>=375px，高>=250px，图片宽高比例3：2为佳。多张图时，用数组表示。
*video	视频信息，多个视频时，用数组表示
*/
export function baseBaiduPageInfo(
	title="盲盒大玩家-潮玩盲盒在线拆，新用户领99元红包! 立即拆盒>>", 
	keywords="盲盒,盲盒大玩家,拆盒,抽盒,惊喜魔盒,幸运盒子,潮玩,动漫,玩具,模型,模玩,手办,二次元,盒蛋,隐藏款,潮流玩具,公仔", 
	description= "盲盒大玩家专注于线上拆盲盒，潮玩盲盒涵盖长草颜团子、阿狸、罗小黑、泡泡二次元手办抽盒机，猜盒选盒乐趣多!",
	articleTitle= "盲盒大玩家-潮玩盲盒在线拆，新用户领99元拆盒红包！立即拆盒>>",
	releaseDate= "2019-01-02 12:01:30",
	image= "",
	video= {},
	visit= {
		pv: "1000",
		uv: "100",
		sessionDuration: "130"
	},
	likes= "75",
	comments= "13",
	collects= "23",
	shares= "8",
	followers= "35",
){
	swan.setPageInfo({
		title,
		keywords,
		description,
		articleTitle,
		releaseDate,
	})
}
// #endif

// 读取后台配置的文案替换v-html方法， 操作p和span标签添加class
export function formatHTML (htmlTxt) {
	if(!!htmlTxt && typeof htmlTxt === "string") {
		return htmlTxt
		.replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, "<p")
		.replace(/<p/ig, '<p class="p_class"')
		.replace(/<img([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, "<img")
		.replace(/<img/ig, '<img class="img_class"')
		.replace(/<span([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, "<span")
		.replace(/<span/ig, '<span class="span_class"')
		.replace(/xss=removed/ig, "")
	} else {
		return ""
	}
}

// 场景websocket使用xml格式，或者消息后转换成数组格式，数组里是对象，用于获取指定数据
export function arrayGetValue (arr, attrname, getAttrName, getAttrVal) {
	if(typeof arr !== "object") {
		return ""
	}
	for(let item in arr){
		if(arr[item][attrname] === getAttrName) {
			return arr[item][getAttrVal]
		}
	}
}

// 数据特别金额计算后小数太多问题处理
export function upDataNum (num) {
	if(typeof num !== "number") {
		return 0.00
	}
	return Number(Math.round(num * 100) / 100).toFixed(2) - 0;
}

// 价格格式化
/*
* isShowTwo  true -- 都展示两位小数且末尾四舍五入 
* 			 false -- 有小数展示两位小数，没有取整数
* isFenRmb   是否人民币为分单位
*/ 
export function priceFormat (num, isShowTwo=true) {
	if(isShowTwo) {
		return Number(Math.round(num * 100) / 100).toFixed(2);
	} else {
		return !(num - 0) ? 0 : (num - 0) % 1 > 0 ? Number(Math.round(num * 100) / 100).toFixed(2) : num - 0;
	}
}

// 替换文本中的&符号
export function replaceSymbol(text) {
	let newText = text.replace("&", "@#$%")
	return newText
}

// h5客服
export function h5CustomerServiceData() {
	let _sessionFromData = {
		"trueName": store.getters.userId || "000000",
		"userNickname": store.getters.userNick || "noUserName",
		"description": "系统:微信小程序\n渠道" + store.getters.downfrom+ "\n版本:" + version,
	}
	return "https://bbm.loovee.com/view/kf?name=kf_mini&webviewTitle=客服&appName=微信小程序&visitor=" + JSON.stringify(_sessionFromData)
}

/**
 * @description 简易的canvas画布辅助线 如果当前的画图有使用fillRect，这个方法要在之后调用
 * @param ctx 画笔
 * @param lineColor 线条颜色
 * @param cW 画布宽度
 * @param cH 画布高度
 * @param stepSize 网格尺寸
 */
export function canvasDrawGrid(ctx, lineColor = '#FFFFFF', cW, cH, stepSize) {
	if (!ctx) return;
	
	ctx.save()
	ctx.setFillStyle('rgba(0, 0, 0, 0)')  // 透明底
	ctx.fillRect(0, 0, cW, cH)
	ctx.setLineWidth(0.5)
	ctx.setStrokeStyle(lineColor)
	
	for (var i = stepSize; i < cW; i += stepSize) {
	    ctx.beginPath();
	    ctx.moveTo(i, 0);
	    ctx.lineTo(i, cH);
	    ctx.closePath();
	    ctx.stroke();
	}
	for (var j = stepSize; j < cH; j += stepSize) {
	    ctx.beginPath();
	    ctx.moveTo(0, j);
	    ctx.lineTo(cW, j);
	    ctx.closePath();
	    ctx.stroke();
	}
	ctx.restore();
}
/**
 * @param {Number} sx 固定盒子的x坐标,sy 固定盒子的y左标
 * @param {Number} box_w 固定盒子的宽, box_h 固定盒子的高
 * @param {Number} source_w 原图片的宽, source_h 原图片的高
 * @return {Object} {drawImage的参数，缩放后图片的x坐标，y坐标，宽和高},对应drawImage(imageResource, dx, dy, dWidth, dHeight)
 */
export function containImg(sx, sy , box_w, box_h, source_w, source_h){
	var dx = sx,
		dy = sy,
		dWidth = box_w,
		dHeight = box_h;
	if(source_w > source_h || (source_w == source_h && box_w < box_h)){
		dHeight = source_h*dWidth/source_w;
	dy =  sy + (box_h-dHeight)/2;

	}else if(source_w < source_h || (source_w == source_h && box_w > box_h)){
		dWidth = source_w*dHeight/source_h;
		dx = sx + (box_w-dWidth)/2;
	}
	return{
		dx,
		dy,
		dWidth,
		dHeight
	}
}
/**
 * @param {Number} box_w 固定盒子的宽, box_h 固定盒子的高
 * @param {Number} source_w 原图片的宽, source_h 原图片的高
 * @return {Object} {截取的图片信息}，对应drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)参数
*/
export function coverImg(box_w, box_h, source_w, source_h){
	var sx = 0,
		sy = 0,
		sWidth = source_w,
		sHeight = source_h;
	if(source_w > source_h || (source_w == source_h && box_w < box_h)){
		sWidth = box_w*sHeight/box_h;
		sx = (source_w-sWidth)/2;
	}else if(source_w < source_h || (source_w == source_h && box_w > box_h)){
		sHeight = box_h*sWidth/box_w;
		sy = (source_h-sHeight)/2;
	}
	return{
		sx,
		sy,
		sWidth,
		sHeight
	}
}