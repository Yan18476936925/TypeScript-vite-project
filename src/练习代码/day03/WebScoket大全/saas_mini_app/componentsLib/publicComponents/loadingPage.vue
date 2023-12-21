<template>
	<!-- 无数据 -->
	<view class="no-data" :style="{
		'background-color': !!bgColor ? bgColor : '#FFFFFF'
	}">
		<view class="loading-img"></view>
	</view>
</template>

<script>
export default {
	name: 'loadingPage',
	// props: {
	// 	bgColor:{
	// 	  type: String,
	// 	  default: 'rgba(0,0,0,0.3)'
	// 	},
	// },
	props: ['bgColor'],
	data () {
		return {}
	},
}
</script>

<style scoped lang="less">
.no-data {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	// background-color: #fff;
	z-index: 999;
	.loading-img {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		margin: auto;
		width: 200rpx;
		height: 200rpx;
		margin: 0 auto;
		// background-image: url(../../static/newImage/loading_1.gif);
		background-size: 100% 100%;
	}
}
</style>