// 受游客模式影响,登陆后不一定打开首页,所以根据游客模式的页面独立个刷新页面的方法
import store from "../store/index"
import { pageJump } from "@/utils/index"
import { initPageHandle, initPageNoHandle, initPageDiyHandle, initSpecialPageHandle } from "@/utils/base"
/*
* isNewcomer------是否新用户，新用户一般跳转到首页，领取新手礼包，例外页面红包页面，应该红包页面就有领取的功能
* noNextPage------用来区分是否要返回上一页，例如授权页面，登录成功后应该刷新授权页面前的一层次页面
* isAccountConflict--是否抢登，抢登会触发退出登录，状态会重置，但是此时并不需要isAgreeOrder唤起首页触发发货协议弹窗，用来跳过这层判断
*/ 
// noNextPage 有参代表不用进入手机号码绑定页面
const loginInit = async (isNewcomer, noNextPage, isAccountConflict) => {
	let pagesLength = noNextPage ? noNextPage : 2;
	 // 获取页面栈信息
	let pagesInfo = getCurrentPages();
	store.commit("setWxLogin302", false);
	// 页面异常跳转首页
	if(!pagesInfo || (pagesInfo.length < pagesLength) || (!pagesInfo[pagesInfo.length-pagesLength])) {
		isHomePage();
	}else{
		// 当前页面的路由名称
		// #ifdef MP-TOUTIAO
			let routeName = !!pagesInfo[0] ? pagesInfo[pagesInfo.length-pagesLength].is.slice(1) : ""; // 当前页面的路由名称
		// #endif
		// #ifdef MP-WEIXIN
			let routeName = pagesInfo[pagesInfo.length-pagesLength].route; 
		// #endif
		let isSpecialPage = 1;
		// 正常初始化页面处理(只需要刷新当前数据)
		if(initPageHandle.indexOf(routeName) > -1) {
			let _startIndex = routeName.indexOf("pages/");
			let _endIndex = routeName.indexOf("/main");
			let _pageNameRes = routeName.slice(_startIndex + 6, _endIndex);
			uni.$emit("PAGE_" + _pageNameRes +  "_REFRESH", true);
		} else if(!!initSpecialPageHandle[routeName]) {
			let _pageNameRes = initSpecialPageHandle[routeName];
			uni.$emit("PAGE_" + _pageNameRes +  "_REFRESH", true);
		} else if(initPageNoHandle.indexOf(routeName) > -1){ // 初始化页面不用处理
			// console.log("初始化页面不用处理");
		} else if(initPageDiyHandle.indexOf(routeName) > -1) { // 初始化页面特别处理
			
		// 其他页面
		} else {
			isSpecialPage = 0;
			isHomePage();
		}
		if(pagesLength >= 2) {
			uni.navigateBack({
				delta: pagesLength - 1
			});
		}
	}
	// 立即刷新数据
	console.log("立即刷新数据");
}
async function isHomePage() {
	uni.switchTab({
	    url: "/pages/home/main"
	})
}

export default loginInit
