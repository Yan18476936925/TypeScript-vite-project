<template>
	<view class="home-act">
		<home-item topLeft="活动推荐" lineColor="#FFB500" topRight="更多 >">
			<template #bottomContent>
				<view class="act-content">
					<view class="act-item" v-for="(item, index) in actList" :key="index" @tap="pageJump('')">
						<image class="act-image" src="https://duimianimg.loovee.com/style/sdh/img/home_title_bg.png" mode=""></image>
						<view class="act-title overflow-hidden">90周年校庆活动之校友运动会</view>
						<view class="act-bottom">
							<view class="bottom-left">开始时间：2023.01.11</view>
							<view class="bottom-right"><text>100</text>人报名</view>
						</view>
					</view>
				</view>
			</template>
		</home-item>
	</view>
</template>

<script>
	import { pageJump } from "@/utils/index.js"
	import homeItem from "@/componentsLib/home/homeItem.vue"
	export default {
		components: {
			homeItem
		},
		data() {
			return {
				pageJump,
			}
		},
		props: [
			"actList",    // topic列表
		],
	}
</script>

<style lang="less" scoped>
	.act-content{
		width: 100%;
		display: flex;
		justify-content: space-between;
		overflow-x: scroll;
		overflow-y: hidden;
		margin-top: 22rpx;
		padding: 0 26rpx;
		&::after{
			content: "活动推荐";
			opacity: 0;
		}
		.act-item{
			background: #FFFFFF;
			border-radius: 24rpx;
			width: 372rpx;
			height: 324rpx;
			margin: 0 10rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			&:last-child{
				margin-right: 36rpx;
			}
			.act-image{
				width: 360rpx;
				height: 192rpx;
				// background-color: #B5BAC0;
				border-radius: 24rpx;
				margin-bottom: 22rpx;
			}
			.act-title{
				font-size: 24rpx;
				color: #0E0F12;
				font-weight: 600;
				margin-bottom: 18rpx;
				width: 100%;
				padding: 0 18rpx;
				box-sizing: border-box;
				text-align: left;
			}
			.act-bottom{
				width: 100%;
				padding: 0 18rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 0 18rpx;
				margin-bottom: 24rpx;
				.bottom-left{
					font-size: 20rpx;
					color: #999999;
					font-weight: 600;
				}
				.bottom-right{
					font-size: 18rpx;
					color: #0E0F12;
					font-weight: 400;
					text{
						font-size: 20rpx;
						color: #BF1A19;
						font-weight: 600;
					}
				}
			}
		}
	}
</style>