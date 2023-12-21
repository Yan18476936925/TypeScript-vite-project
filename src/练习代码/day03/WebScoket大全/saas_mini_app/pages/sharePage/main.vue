<template>
	<view class="share-page">
		<web-view v-if="showWebView" :src="url" @message="getMessage"></web-view>
		<!-- 未登录 -->
		<view class="no-login" v-if="!openid">
			<view class="logo-icon bg-image"></view>
			<view class="no-login-text">会员登录后，可查看详细信息</view>
			<!-- <view class="login-btn" @tap="getUserInfo">微信授权登录</view> -->
			<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号快捷登录</button>
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
	import { sharePic } from "@/utils/base.js"
	import defaultLogin from "@/utils/allLoginType/defaultLogin.js"
	export default {
		name: "sharePage",
		data() {
			return {
				type: 0,
				url: "",
				sharePic,
				shareData: {
					pic: "",
					title: "",
					linkUrl: ""
				},	
			}
		},
		computed: {
			...mapGetters([
				'openid',
				'userId',
			]),
			showWebView() {
				let isShow = false
				if(!this.openid) {
					isShow = false
				} else {
					isShow = true
				}
				console.log('isShow', isShow)
				return isShow
			}
		},
		async onShow() {},
		onHide() {},
		async onLoad(option) {
			console.log('邀请动画页option', option)
			this.type = !!option.type ? option.type : 0
			!!option.inviteId ? this.$store.commit("setInvitor", option.inviteId) : this.$store.commit("setInvitor", "");
			uni.$off("PAGE_sharePage_REFRESH");
			uni.$on("PAGE_sharePage_REFRESH", () => {
				if(!!this.$store.getters.openid) {
					this.getUrl()
					this.setShareInfo(this.type)
				}
			})
			if(!!this.openid) {
				this.getUrl()
				this.setShareInfo(this.type)
			} else {
				// 未登录时，隐藏分享功能，避免分享后无法正常绑定邀请关系
				uni.hideShareMenu()
			}
		},
		methods: {
			async getUserInfo() {
				await defaultLogin(true, true)
			},
			async getPhoneNumber(e) {
				console.log('getPhoneNumber', e)
				if (e.target.errMsg === 'getPhoneNumber:ok') {
					this.$store.commit("setPhoneCode", !!e.detail.code ? e.detail.code : "")
					defaultLogin(true, true)
				}
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
			},
			setShareInfo(type) {
				let title = ''
				const userInfo = uni.getStorageSync("userInfo") 
				if(type == 1) {
					title = `${!!userInfo.college && userInfo.college != '未知' ? userInfo.college + '的' : ''}同学们，还没加入深大会的，赶紧点击加入哦～`
				} else {
					title = `${!!userInfo.name ? userInfo.name : '深圳大学校友'}邀请你加入深大会，点击填写你的个人信息`
				}
				this.shareData = {
					pic: this.sharePic,
					title,
					linkUrl: `/pages/sharePage/main?inviteId=${this.userId || 0}&type=${type}`
				}
				console.log('shareData', this.shareData)
			}
		},
		// 分享数据
		onShareAppMessage() {
			return this.public.baseShareData(
				this.shareData.title,
				this.public.shareLinkAddBrandId(this.shareData.linkUrl),
				this.shareData.pic
			);
		},
		onUnload() {}
	}
</script>

<style lang="less" scoped>
	.share-page{
		width: 750rpx;
		min-height: 100vh;
		margin: 0 auto;
		position: relative;
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
	}
</style>
