<template>
	<view class="banner-compont" v-if="banner.length > 0">
		<swiper class="home-banner" :autoplay="true" :interval="4000" :duration="1000" :circular="true">
			<swiper-item class="home-swiper-item" v-for="(item, index) in banner" :key="index" @tap="pageJump(item.link)">
				<image class="home-item-image" :src="item.img" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
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
			"banner",    // banner列表
		],
	}
</script>

<style lang="less" scoped>
	.home-banner{
		margin: 20rpx 24rpx 36rpx;
		margin-top: 0rpx;
		height: 300rpx;
		.home-swiper-item{
			height: 300rpx;
		}
		.home-item-image{
			width: 702rpx;
			height: 300rpx;
			border-radius: 24rpx;
		}
	}
</style>