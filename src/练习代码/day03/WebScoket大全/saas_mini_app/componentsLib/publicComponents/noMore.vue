<template>
	<!-- 页面底部显示的状态 -->
	<view class="no-more" :style="{
		width: !!width ? `${width}rpx` : '750rpx',
		paddingTop: !!paddingTop ? `${paddingTop}rpx` : '36rpx',
		paddingBottom: !!paddingBottom ? `${paddingBottom}rpx` : '36rpx',
		color: !!color ? color : '#B9BDC3'
	}">
		<text v-if="!title || title == '已经到底啦'">——</text>
		<text class="no-more-text">{{!!title ? title : '已经到底啦'}}</text>
		<text v-if="!title || title == '已经到底啦'">——</text>
	</view>
</template>
<script> 

export default {
	name: 'no-more',
	data () {
		return {
		}
	},
	/**
	 * title	底部文案
	 * width	宽度
	 * paddingTop	上内边距
	 * paddingBottom	下内边距
	 * color	字体颜色
	 */
	props: ['title', 'width', 'paddingTop', 'paddingBottom', 'color'],
}
</script>

<style lang="less" scoped>
.no-more{
	font-size: 16rpx;
	color: #B9BDC3;
	text-align: center;
	// padding: 72rpx 0;
	line-height: 16rpx;
	font-weight: bold;
	box-sizing: border-box;
	.no-more-text {
		margin: 0 14rpx;
	}
}
</style>