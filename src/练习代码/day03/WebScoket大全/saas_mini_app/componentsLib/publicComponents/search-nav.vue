<template>
	<view class="search-box" @tap="goSearch">
		<view class="swiper-item-box" v-if="!list.length">
			<view class="swiper-item overflow-hidden" :style="{left: paddingLeftOrRight + 'rpx', right: paddingLeftOrRight + 'rpx'}">
				{{ defaultText }}
			</view>
		</view>
		<block v-else>
			<swiper class="swiper-box" :autoplay="true" :interval="intervalTime" :duration="1000" :vertical="true" :circular="true" :disable-touch="true">
				<swiper-item v-for="(item, index) in list" :key="index">
					<view class="swiper-item-box">
						<view class="swiper-item overflow-hidden"  :style="{left: paddingLeftOrRight + 'rpx', right: paddingLeftOrRight + 'rpx'}">
							{{ item }}
						</view>
					</view>
				</swiper-item>
			</swiper>
		</block>
		<view class="search-mask"></view>
	</view>
</template>

<script>
	export default {
		name: 'search-nav',
		data() {
			return {}
		},
		props: ['list', 'defaultText', 'intervalTime', 'isAutoPlay', "paddingLeftOrRight"],
		methods: {
			goSearch(){
				this.$emit('goSearch')
			},
		}
	}
</script>

<style lang="less" scoped>
	.search-box {
		font-weight: bold;
		width: 100%;
		height: 100%;
		position: relative;
		background-color: #F4F7FB;
		border-radius: 38rpx;
		.swiper-box {
			width: 100%;
			height: 100%;
		}
		.swiper-item-box{
			font-size: 24rpx;
			color: #B9BDC3;
			height: 100%;
			position: relative;
			.swiper-item {
				position: absolute;
				top: 50%;
				margin: auto;
				transform: translateY(-50%);
			}
		}
		.search-mask {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			border-radius: 33rpx;
			background-color: rgba(255, 255, 255, 0);
		}
	}
</style>
