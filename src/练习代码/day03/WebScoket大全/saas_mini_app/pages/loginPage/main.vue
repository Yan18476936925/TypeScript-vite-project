<template>
	<view class="login-page">
		<view class="no-login">
			<view class="logo-icon bg-image"></view>
			<view class="no-login-text">会员登录后，可查看详细信息</view>
			<view class="login-btn" @tap="getUserInfo">微信授权登录</view>
			<!-- <button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信手机号码授权登录</button> -->
		</view>
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
				
			}
		},
		computed: {
			...mapGetters([
				'openid',
			]),
		},
		async onShow() {},
		onHide() {
			this.isLeave = true
		},
		async onLoad(option) {},
		methods: {
			async getUserInfo() {
				await defaultLogin(true, true)
			},
			async getPhoneNumber(e) {
				console.log('getPhoneNumber', e)
				if (e.target.errMsg === 'getPhoneNumber:ok') {
					// 绑定手机号后重新获取登录数据
				}
			},
		},
		onUnload() {}
	}
</script>

<style lang="less" scoped>
	.login-page {
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
