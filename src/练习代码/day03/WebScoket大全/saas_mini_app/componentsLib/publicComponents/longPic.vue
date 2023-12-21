<template>
	<view class="long-pic">
		<view class="imgs-container">
			<view v-for="(item, index) in imgList" :key="index">
				<image class="bg-img" mode="widthFix" :src="item ? item : ''" :style="{'border-radius': index == 0 && index == imgList.length - 1 ? `${borderRadius}rpx ${borderRadius}rpx ${borderRadius}rpx ${borderRadius}rpx` : (index == 0 ? `${borderRadius}rpx ${borderRadius}rpx 0 0` : (index == imgList.length - 1 ? `0 0 ${borderRadius}rpx ${borderRadius}rpx` : '0 0 0 0'))}"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'longPic',		// 纵向长图列表
		data() {
			return {}
		},
		props: [
			'imgList', 			// 图片链接列表
			'borderRadius', 	// 圆角
		]
	}
</script>

<style lang="less" scoped>
	.long-pic {
		position: relative;
		margin: 0 auto;
		.imgs-container {
			box-sizing: border-box;
			width: 100%;
			.bg-img {
				display: block;
				margin: 0 auto;
				margin-top: -1px;
				width: 100%;
				max-width: 750rpx;
			}
		}
	}
</style>
