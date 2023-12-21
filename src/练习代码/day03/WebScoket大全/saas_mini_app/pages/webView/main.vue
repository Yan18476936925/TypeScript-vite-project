<template>
	<view class="web-view">
		<web-view :src="url" @message="getMessage"></web-view>
	</view>
</template>

<script>
	/*
	*	关于webview页面分享：
	* 	①、邀请好友，进入首页，?invitorType=9&invitor=##&freeActivityId=##&downfrom=##&isActShare=1。参数说明
	* 	invitorType：邀请方式 invitor：邀请者  freeActivityId：邀请活动id downfrom:渠道 isActShare：是否活动分享
	* 	②、分享指定活动页  ?downfrom=##&share_key=##
	* 	downfrom：渠道 share_key：活动秘钥，根据打开相应页面
	* */ 
	export default {
		name: "webView",
		data() {
			return {
				url: "",
				canRefresh: 0,		// 是否可以刷新
			}
		},
		onShow() {
			// 显示转发按钮
			uni.showShareMenu({
				withShareTicket: true
			})
			if(this.canRefresh === 1) {
				this.public.pageJump(this.url, "redirectTo")
				this.canRefresh = 0;
			}
		},
		// onHide() {
		// 	if(this.url.indexOf("vip_task_act") != -1) {
		// 		uni.$emit("PAGES_WEBVIEW_REFRESH");
		// 	}
		// },
		onLoad(option) {
			// 页面刷新，是否需要强制刷新页面
			uni.$off("PAGES_WEBVIEW_REFRESH");
			uni.$on("PAGES_WEBVIEW_REFRESH", page => {
				this.canRefresh = 1;
			})
			// 只传一个参数
			// 小程序带参minAppOpenId处理登录问题
			if (Object.keys(option).length === 1) {
				// this.url = `${option.url}?minAppOpenId=${this.$store.getters.openid}`
				this.url = `${option.url}`
			} else {
				// 带参的字段
				let urlArr = []
				for (let k in option) {
					if (k !== "url") {
						urlArr.push(k + "=" + option[k])
					}
				}
				let optionList = urlArr.join("&");
				if(option.url.indexOf('mp.weixin.qq.com') != -1) {
					// this.url =`${option.url}?${urlArr}`
					this.url = !!this.$store.getters.weixinUrl ? this.$store.getters.weixinUrl : `${option.url}?${optionList}&minAppOpenId=${this.$store.getters.openid}`
				} else {
					// this.url =`${option.url}?${optionList}&minAppOpenId=${this.$store.getters.openid}`;
					this.url =`${option.url}?${optionList}`;
				}
				console.log('this.url', this.url)
			}
			// this.$store.commit("setActivityUrl", this.url)
			// 先处理链接，避免时序问题
			let downFromVal = option.downFrom || option.downfrom;
			if(!!downFromVal && this.$store.getters.downfrom !== downFromVal) {
				this.$store.commit("setDownfrom", downFromVal);
			}
			!!option.webviewTitle ? this.public.setTitle(option.webviewTitle) : "";
		},
		methods: {
			// h5传参
			getMessage(e) {
				let shareInfo = e.detail.data[e.detail.data.length-1];
				this.shareInfo = JSON.parse(shareInfo);
			}
		},
		// 分享数据
		onShareAppMessage() {
			let that = this;
			if(!!that.shareInfo && !!that.shareInfo.title) {
				return this.public.baseShareData(that.shareInfo.title, that.public.shareLinkAddBrandId(that.shareInfo.url), that.shareInfo.image)
			} else {
				return this.public.baseShareData();
			}
		},
		onUnload() {
			uni.$off("PAGES_WEBVIEW_REFRESH");
			this.canRefresh = 0;
			console.log('卸载webview')
			this.$store.commit('setWeixinUrl', '')
		},
	}
</script>

<style lang="less" scoped>
	.web-view {
		width: 750rpx;
		min-height: 100vh;
		margin: 0 auto;
		position: relative;
	}
</style>
