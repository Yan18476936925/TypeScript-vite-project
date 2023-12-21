<template>
	<view class="home-item">
		<view class="item-top" @tap="topTap">
			<view class="top-left">
				<view class="top-line" :style="{'background-color': lineColor}"></view>
				{{topLeft}}
			</view>
			<view class="top-right">{{topRight || ""}}</view>
		</view>
		<slot name="bottomContent"></slot>
	</view>
</template>

<script>
	export default {
		data() {
			return{}
		},
		props: ["topLeft","lineColor","topRight"],
		methods: {
			topTap() {
				this.$emit("topTap",'/otherPackage/pages/siteInfo/main')
			}
		},
	}
</script>

<style lang="less" scoped>
.home-item{
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: 36rpx;
	.item-top{
		padding: 0 32rpx;
		height: 36rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		vertical-align: middle;
		.top-left{
			font-size: 32rpx;
			line-height: 36rpx;
			color: #0E0F12;
			font-weight: 500;
			display: flex;
			align-items: center;
			vertical-align: middle;
			font-family:  PingFangSC-Medium;
			.top-line{
				width: 4rpx;
				height: 22rpx;
				margin-right: 14rpx;
				line-height: 36rpx;
				vertical-align: middle;
			}
		}
		.top-right{
			font-size: 20rpx;
			color: #0E0F12;
			line-height: 36rpx;
			font-weight: 400;
		}
	}
}
</style>