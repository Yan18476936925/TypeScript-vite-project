<template>
	<!-- 无数据 -->
	<view class="no-data">
		<image class="no-data-img" :src="icon" /> 
		<view class="no-data-desc" v-if="desc">{{desc}}</view>
		<button class="no-data-btn" v-if="isShowBtn" @tap="handleNavigateTo">{{btnDesc}}</button>
		<view class="no-data-desc2" v-if="desc2">{{desc2}}</view>
	</view>
</template>

<script>
export default {
	props: {
		desc: {
			type: String,														// 描述字段1
			default: ''
		},
		desc2: {
			type: String,
			default: ''															// 描述字段2
		},
		icon: {
			type: String,														// icon图
			default: ''
		},
		isShowBtn: {
			type: Boolean,													// 按钮显示
			default: false
		},
		btnDesc: {
			type: String,													// 按钮文案
			default: ''
		},
	},
	methods: {
		handleNavigateTo() {
			this.$emit('onNav') // 外部点击跳转链接
		}
	}
}
</script>

<style scoped lang="less">
.no-data {
	font-size: 0;
	text-align: center;
	font-weight: bold;
	.no-data-img {
		// margin-top: 290rpx;
		margin-bottom: 44rpx;
		width: 280rpx;
		height:	216rpx;
	}
	.no-data-btn {
		width: 188rpx;
		height: 80rpx;
		background: #FF6198;
		border-radius: 12rpx;
		text-align: center;
		line-height: 80rpx;
		margin-top: 80rpx;
		margin-bottom: 140rpx;
		color: #fff;
		font-size: 24rpx;
	}
	.no-data-desc {
		font-size: 28rpx;
		color: #B9BDC3;
		letter-spacing: 0;
		line-height: 28rpx;
		padding-bottom: 24rpx;
	}
	.no-data-desc2 {
		font-size: 21.74rpx;
		color: #B9BDC3;
		// margin-bottom: 140rpx;
	}
}
</style>