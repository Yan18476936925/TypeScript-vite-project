<template>
	<view class="home-bar" style="" v-if="iconlist.length > 2">
		<view class="title-tab">
			<view class="tab-item" v-for="(item, index) in iconlist.slice(0,5)" :key="index" @tap="tabJump(item.link)">
				<image class="tab-icon" :src="item.img" mode=""></image>
				<view class="tab-text">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { pageJump } from "@/utils/index.js"
	export default {
		data() {
			return {
				pageJump,
			}
		},
		props: [
			"iconlist",    // icon列表
		],
		methods: {
			tabJump(link) {
				// console.log(this.$store.getters.openid,'this.$store.getters.openid')
				if(!this.$store.getters.openid && (link.indexOf('app://applyForMembership') != -1 || link.indexOf('otherPackage/pages/applyMember/userInfo') != -1)){
					uni.$emit("OPEN_SIGHTSEER_POPUP")
					return
				}
				if(link.indexOf('app://applyForMembership') != -1 || link.indexOf('otherPackage/pages/applyMember/userInfo') != -1) {
					if(this.$store.state.user.status == -1) {
						this.public.pageJump("/otherPackage/pages/applyMember/userInfo")
					} else {
						this.public.pageJump("/pages/me/joinData")
					}
				} else {
					pageJump(link)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
.home-bar{
	width: 100%;
	.title-tab{
		display: flex;
		justify-content: space-between;
		overflow-x: scroll;	
		padding: 0 8rpx;
		padding-bottom: 32rpx;
		box-sizing: border-box;
		.tab-item{
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			min-width: 146rpx;
			.tab-icon{
				width: 96rpx;
				height: 96rpx;
				margin-bottom: 16rpx;
			}
			.tab-text{
				font-family: PingFangSC-Medium;
				font-size: 20rpx;
				color: #0E0F12;
				line-height: 20rpx;
				font-weight: 500;
			}
		}
	}
}
</style>