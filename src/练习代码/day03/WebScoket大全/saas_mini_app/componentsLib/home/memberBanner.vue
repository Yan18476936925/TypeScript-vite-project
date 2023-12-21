<template>
	<view class="member-banner background-box" @tap="applyMember" v-if="canShowBanner">
		<view class="apply-icon">{{ applyStatus == 2 ? '修改信息' : '申请入会' }}</view>
		<view class="member-text">{{ applyStatus == 2 ? '您提交的资料审核不通过，请修改后提交>>' : '完善您的校友信息，获得专属校友卡>>' }}</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex"
	export default{
		data(){
			return {
				
			}
		},
		computed: {
			...mapGetters([
				"applyStatus",
				"isSightseer",
			]),
			canShowBanner(){
				// console.log("canShowBanner",this.$store.state.user.status,this.isSightseer)
				let flag = this.$store.state.user.status != 1 && this.$store.state.user.status != 0 && this.isSightseer == 0
				return flag
			}
		},
		mounted(){},
		methods:{
			async applyMember(){
				await this.$store.dispatch("getUserDetails")
				// console.log("this.applyStatus",this.applyStatus)
				if(this.$store.state.user.status == -1){
					this.public.pageJump("/otherPackage/pages/applyMember/userInfo")
				} else if(this.$store.state.user.status == 2){
					this.public.pageJump("/pages/me/joinData")
				} else if(this.$store.state.user.status != 1){
					this.public.pageJump("/pages/me/joinData")
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.member-banner{
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		bottom: 20rpx;
		left: 50%;
		transform: translate(-50%);
		background: #FFE3E5;
		box-shadow: 0 0 16rpx 0 rgba(223,185,193,0.45);
		border-radius: 16rpx;
		box-sizing: border-box;
		height: 64rpx;
		.apply-icon{
			background: #0E0F12;
			border-radius: 32rpx 32rpx 32rpx 8rpx;
			font-size: 24rpx;
			color: #FFFFFF;
			text-align: center;
			font-weight: 400;
			margin-left: -20rpx;
			width: 150rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			box-sizing: border-box;
			margin-right: 22rpx;
		}
		.member-text{
			font-size: 24rpx;
			color: #0E0F12;
			line-height: 24rpx;
			font-weight: 400;
			line-height: 64rpx;
			text-align: center;
			white-space: nowrap;
			margin-right: 22rpx;
		}
	}
</style>