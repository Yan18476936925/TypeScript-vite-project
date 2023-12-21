<template>
	<view :class="['showModel',  bboxSystemType === 3 ? 'showModel-small': '']" v-if="show">
		<view class="youke-box">
			<view class="youke-txt">
				<view>网络异常，</view>
				<view>请尝试切换网络重新登录</view>
			</view>
			<view class="bottom">
				<!-- #ifdef MP-WEIXIN -->
					<!-- <button class="bottom-btn" open-type="getUserInfo" @getuserinfo="gotoMiniLogin">去登录</button> -->
					<button class="bottom-btn" @tap="gotoMiniLogin">去登录</button>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
					<view class="bottom-btn" @tap="gotoMiniLogin()">去登录</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from "vuex"
import defaultLogin from "@/utils/allLoginType/defaultLogin.js" // 登录文件	
export default {
	name: "netWorkErrModel",   // 网络错误弹窗
	data () {
		return {
			isFirstClick: true,    // 是否第一次点击
		}
	},
	props: [
		"show",    // 显示隐藏
	],
	computed: {
		...mapGetters([
			"bboxSystemType", //  1--正常手机（宽高正常） 2--大屏幕手机（高度过大） 3--平板（高度过小）
        ])
	},
	methods: {
		async gotoMiniLogin(e) {  
			console.log("断网重新登录");
			// 微信小程序点击就触发了，判断网络并不能拦截，判断只有第一次点击触发下面的逻辑
			if(!this.isFirstClick) {
				return
			}
			this.isFirstClick = false
			try{
				this.$emit("update:show", false)
				await defaultLogin(true, true);
			} catch(err) {}
		}
	}
}
</script>

<style lang="less" scoped>
.showModel {
	position: fixed;
	z-index: 999;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	margin: auto;
	background-color: rgba(0, 0, 0, 0.6);
	&.showModel-small{
		position: absolute;
	}
	.youke-box {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		margin: auto;
		transform: translate(0, -50%);
		-ms-transform: translate(0, -50%); /* IE 9 */
		-webkit-transform: translate(0, -50%); /* Safari and Chrome */
		width: 610rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		text-align: center;
		.youke-txt {
			font-size: 40rpx;
			color: #0E0F12;
			letter-spacing: 0.73rpx;
			margin-top: 88rpx;
			margin-bottom: 20rpx;
		}
		.bottom {
			width: 610rpx;
			font-size: 0;
			margin-top: 50rpx;
			margin-bottom: 60rpx;
			.bottom-btn{
				// width: 240rpx;
				// height: 80rpx;
				// line-height: 80rpx;
				// border-radius: 40rpx;
				// font-size: 30rpx;
				// color: #000000;
				// letter-spacing: 0.68rpx;
				// display: inline-block;
				// vertical-align: top;
				// margin: 0 15rpx;
				// background-color: #FFE66B;
				
				width: 240rpx;
				height: 98rpx;
				line-height: 98rpx;
				border-radius: 10rpx;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: top;
				letter-spacing: 0.68rpx;
				margin: 0 15rpx;
				background-color: #0E0F12;
				color: #FFFFFF;
			}
		}
	}
}
</style>
