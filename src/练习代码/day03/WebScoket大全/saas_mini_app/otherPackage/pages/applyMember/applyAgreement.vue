<template>
	<view class="page_applyAgreement">
		<view class="agreement_content" v-html="agreementText"></view>
		<view class="bottom_fixed"><view class="comfirm_btn" @tap="apply">以上内容，已阅读并知晓</view></view>
	</view>
</template>

<script>
import { apiGetProtocols } from '@/api/home.js';
import { apiApply } from "@/api/apply.js"
export default {
	data() {
		return {
			agreementText: '',
			infoData:{}
		};
	},
	onLoad(options){
		console.log('applyAgreement_options', options)
		console.log('this.$store.getters.invitor', this.$store.getters.invitor)
		this.infoData = JSON.parse(decodeURIComponent(options.infoData))
		console.log(this.infoData,'------------')
		this.getProtocols();
	},
	methods: {
		getProtocols() {
			apiGetProtocols().then(res => {
				this.agreementText = res;
			});
		},
		apply() {
			console.log('apply', this.$store.getters.invitor)
			 apiApply({
				 ...this.infoData,
				openid: this.$store.state.openid,
				invite_id: this.$store.getters.invitor ? this.$store.getters.invitor : "",
			}).then(res => {
				console.log(res)
				this.public.toast("提交成功")
				this.$store.dispatch("getUserDetails")
				setTimeout(() => {
					this.public.pageJump("/pages/me/joinData","reLaunch")
				},500)
			})
			.catch(res => {
				this.public.toast(res.msg)
			})
		}
	}
};
</script>

<style scoped lang="less">
.page_applyAgreement {
	min-height: 100vh;
	background: #ffffff;
}
.agreement_content {
	padding: 0 32rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	color: #0e0f12;
	line-height: 42rpx;
	font-weight: 400;
	padding-bottom: 300rpx;
}
.bottom_fixed {
	height: 172rpx;
	width: 100%;
	padding-top: 40rpx;
	position: fixed;
	box-sizing: border-box;
	bottom: 0;
	left: 0;
	background: #ffffff;
	.comfirm_btn {
		margin: 0 auto;
		width: 458rpx;
		height: 92rpx;
		line-height: 92rpx;
		background: #0e0f12;
		border-radius: 46rpx;
		font-family:  PingFangSC-Regular;
		font-size: 28rpx;
		color: #ffffff;
		text-align: center;
		font-weight: 500;
	}
}
</style>
