<template>
	<view class="web-view">
		<web-view v-if="showWebView" :src="url" @message="getMessage"></web-view>
		<!-- 未登录 -->
		<view class="no-login" v-if="!openid">
			<view class="logo-icon bg-image"></view>
			<view class="no-login-text">会员登录后，可查看详细信息</view>
			<view class="login-btn" @tap="getUserInfo">微信授权登录</view>
		</view>
		<!-- 加载动画 -->
		<!-- <view v-show="isLoading">
			<loadingPage></loadingPage>
		</view> -->
		<!-- 全局组件 -->
		<global-component></global-component>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { apiUserLogin } from "@/api/login.js"
	import defaultLogin from "@/utils/allLoginType/defaultLogin.js"
	export default {
		name: "star",
		data() {
			return {
				url: "",
				openType: "",
				isLoading: true,  	// 加载动画
				shareInfo: {},
				isShareStatus: false,
				isLeave: false
			}
		},
		computed: {
			...mapGetters([
				'openid',
			]),
			showWebView() {
				let isShow = false
				if(!this.openid) {
					isShow = false
				} else {
					if(!!this.isLeave) {
						isShow = true
					} else {
						isShow = true
					}
				}
				console.log('isShow', isShow)
				return isShow
			}
		},
		async onShow() {
			// 显示转发按钮
			// #ifdef MP-WEIXIN
				uni.showShareMenu({
					withShareTicket: true
				})
			// #endif
			if(!!this.$store.getters.openid) {
				this.isLeave = false
				this.getUrl();
			}
			if(this.$store.getters.applyStatus != 1 && !!this.$store.getters.openid) {
				this.$store.dispatch("getUserDetails")
			}
		},
		onHide() {
			this.isLeave = true
		},
		async onLoad(option) {
			console.log('落地页option', option, this.$store.getters.invitor)
			// 处理参数
			if(!!option.inviteId) {
				this.$store.commit("setInvitor", option.inviteId)
			}
			uni.$off("PAGE_invitationPage_REFRESH");
			uni.$on("PAGE_invitationPage_REFRESH", () => {
				if(!!this.$store.getters.openid) {
					this.getUrl();
				}
			})
			// if(!!this.$store.getters.openid) {
				this.getUrl();
			// }
		},
		methods: {
			async getUserInfo() {
				await defaultLogin(true, true)
			},
			// 处理链接
			async getUrl() {
				this.url = ''				
				// let _parameter1 = `version=${this.base.version}&isH5=miniprogram&dataTime=${Date.now()}`
				// 链接选择（打开调试模式）
				// this.url = this.base.webViewUrl +  `/client/turntable_act/index?${_parameter1}&debug=true`
				// 链接选择（关闭调试模式）
				this.url = this.base.webViewUrl + `/h5/index?name=invitationPage.html&minAppOpenId=${this.$store.getters.openid}`
				// this.url = this.base.webViewUrl + `/h5/index?name=schoolFellow.html&minAppOpenId=os7pK44Rtacab42gnKCO68KOerhQ`
				// 灰度 turntable_act
				// this.url = this.base.webViewUrl +  `/client/turntable_act/index_test?${_parameter1}&debug=true`
				global._logger.writeLogs("邀请落地页跳转链接", this.url);
				console.log("this.url", this.url);
				this.isLeave = false
			},
			// 分享数据
			getMessage(e) {
				let _messData = e.detail.data[e.detail.data.length-1];
				let _messDataObj = JSON.parse(_messData);
				// 确定数据类型，默认分享、freshPageWebview:刷新主包的主webview页面
				if(!!_messDataObj) {
					// 刷新主包的主webview页面
					if(!!_messDataObj.type && _messDataObj.type === "freshPageWebview") {
						
						uni.$emit("PAGES_WEBVIEW_REFRESH", "tuenPlay");
					// 分享
					} else {
						this.shareInfo = _messDataObj;
					}
				}
				
			},
		},
		// 分享数据
		onShareAppMessage() {
			this.isShareStatus = true;
			let that = this;
			if(!!that.shareInfo && !!that.shareInfo.title) {
				return this.public.baseShareData(that.shareInfo.title, that.public.shareLinkAddBrandId(that.shareInfo.url), that.shareInfo.image)
			} else {
				return this.public.baseShareData();
			}
		},
		onUnload() {}
	}
</script>

<style lang="less" scoped>
	.web-view {
		width: 750rpx;
		min-height: 100vh;
		margin: 0 auto;
		position: relative;
	}
	.no-login {
		width: 750rpx;
		min-height: 100vh;
		margin: 174rpx auto 0;
		position: relative;
		.logo-icon{
			margin: 0 auto;
			width: 144rpx;
			height: 186rpx;
			background-image: url("@/static/newImage/public/sdhLogo.png");
			background-repeat: no-repeat;
			background-size: 100% 100%;
			background-color: transparent;
		}
		.no-login-text {
			font-size: 24rpx;
			text-align: center;
			color: #0E0F12;
			font-weight: 500;
			margin-top: 24rpx;
		}
		.login-btn {
			margin: 60rpx auto 0;
			width: 290rpx;
			height: 64rpx;
			background: #0E0F12;
			border-radius: 42rpx;
			font-size: 24rpx;
			color: #FDFEFE;
			font-weight: 500;
			text-align: center;
			line-height: 64rpx;
		}
	}
</style>
