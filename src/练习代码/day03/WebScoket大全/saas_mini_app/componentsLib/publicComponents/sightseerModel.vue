<template>
	<view class="sightseerModel-box" v-if="show">
		<view class="youke-box">
			<view class="youke-txt">
				请先登录再进行操作<br>是否前往登录?
			</view>
			<view class="bottom-box">
				<view class="bottom-btn cancel"  @tap="cancel" v-if="!isFineLotteryDetail">取消</view>
				<navigator open-type="exit" target="miniProgram" class="bottom-btn cancel" v-else>取消</navigator>
				<!-- <button class="bottom-btn confirm" @tap="gotoMiniLogin">去登录</button> -->
				<button class="bottom-btn confirm" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号快捷登录</button>
			</view>
		</view>
	</view>
</template>

<script>
import defaultLogin from "@/utils/allLoginType/defaultLogin.js"
export default {
	name: "sightseerModel",				// 登录弹窗
	data () {
		return {
		}
	},
	props: [
		"show",    // 显示隐藏
	],
	computed: {
		// 精品抽选页面不存在游客模式，未登录用户点击取消全部关闭小程序
		isFineLotteryDetail() {
			// #ifdef MP-WEIXIN
				let pagesInfo = getCurrentPages();
				let routeName = pagesInfo[0].route; 
				let lastRouteName = pagesInfo[1] ? pagesInfo[0].route : '';
				const outPageArr = [
					'schoolFellowPackage/pages/schoolFellowDetails/main', 
					'personalInfoPackage/pages/message/main', 
					'pages/me/joinData', 
				]
				return (outPageArr.indexOf(routeName) > -1 || outPageArr.indexOf(lastRouteName) > -1);
			// #endif
			// #ifndef MP-WEIXIN
				return false
			// #endif
		},
	},
	methods: {
		cancel () {
			this.Request.isLogin = 0;
			this.$store.commit("setWxLogin302", false)
			this.$store.commit("setRequestIntercept302", false);
			this.$emit("update:show", false)
		},
		async getPhoneNumber(e) {
			console.log('getPhoneNumber', e)
			this.$emit("update:show", false)
			if (e.target.errMsg === 'getPhoneNumber:ok') {
				this.$store.commit("setPhoneCode", !!e.detail.code ? e.detail.code : "")
				defaultLogin(true, true)
			}
		},
		async gotoMiniLogin(e) {  
			// 登录弹窗，通过存储的注册用户字段，判断点击是跳转注册页还是触发登录
			//（原有默认触发登录，但是未注册用户还需要绑定手机号，跳转到注册页绑定手机号才能登录成功）
			this.$emit("update:show", false)
			await defaultLogin(true, true);
		}
	}
}
</script>

<style lang="less" scoped>
.sightseerModel-box {
	position: fixed;
	z-index: 999;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	margin: auto;
	background-color: rgba(0, 0, 0, 0.6);
	.youke-box {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		margin: auto;
		transform: translate(0, -50%);
		-webkit-transform: translate(0, -50%); /* Safari and Chrome */
		width: 606rpx;
		background-color: #FFFFFF;
		border-radius: 40rpx;
		text-align: center;
		overflow: hidden;
		font-weight: bold;
		.youke-txt {
			font-size: 36rpx;
			color: #0E0F12;
			line-height: 50rpx;
			margin-top: 100rpx;
		}
		.bottom-box {
			font-size: 0;
			margin: 100rpx 0 80rpx 0;
			>button {
				position: relative;
					display: block;
					margin-left: auto;
					margin-right: auto;
					padding-left: 0px;
					padding-right: 0px;
					box-sizing: border-box;
			}
			.bottom-btn{
				width: 244rpx;
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 13rpx;
				font-size: 28rpx;
				display: inline-block;
				vertical-align: top;
				margin: 0 18rpx;
				&.cancel {
					border: 4rpx solid #0E0F12;
					color: #0E0F12;
				}
				&.confirm {
					background-color: #0E0F12;
					color: #fff;
				}
			}
		}
	}
}
</style>
