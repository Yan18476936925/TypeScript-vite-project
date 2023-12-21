<template>
	<view :class="['showSetting',  bboxSystemType === 3 ? 'showSetting-small': '']" v-if="show">
		<view class="box">
			<view class="title" v-if="!!title">
				<view class="title-text">{{ title }}</view>
			</view>
			<view class="content">{{contentText}}</view>
			<view class="bottom">
				<view class="bottom-btn cancel" @tap="cancel">取消</view>
				<button open-type="openSetting" class="bottom-btn confirm" @tap="confirm">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'showSetting',
	data () {
		return {}
	},
	props: [
		'show',    // 显示隐藏
		'title',   // 标题
		'contentText',	// 文本
	],
	computed: {
		...mapGetters([
			'bboxSystemType', //  1--正常手机（宽高正常） 2--大屏幕手机（高度过大） 3--平板（高度过小）
        ])
	},
	methods: {
		cancel () {
			this.$emit('cancel')
			this.$emit('update:show', false)
		},
		confirm () {
			this.$emit('confirm')
			this.$emit('update:show', false)
		},
	}
}
</script>

<style lang="less" scoped>
.showSetting {
	position: fixed;
	z-index: 999;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	margin: auto;
	background-color: rgba(0, 0, 0, 0.6);
	&.showSetting-small{
		position: absolute;
	}
	.box {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		margin: auto;
		transform: translate(0, -50%);
		-ms-transform: translate(0, -50%); /* IE 9 */
		-webkit-transform: translate(0, -50%); /* Safari and Chrome */
		width: 656rpx;
		background-color: #FFFFFF;
		border-radius: 40rpx;
		text-align: center;
		.title {
			margin-top: 60rpx;
			margin-bottom: 20rpx;
			font-weight: bold;
			width: 656rpx;
			height: 100rpx;
			.title-text {
				font-size: 44rpx;
				color: #0E0F12;
				line-height: 44rpx;
				font-weight: bold;
			}
		}
		.content {
			width: 656rpx;
			margin: 0 auto;
			font-size: 36rpx;
			line-height: 36rpx;
			text-align: center;
			padding: 20rpx 0;
			box-sizing: border-box;
		}
		.bottom {
			width: 656rpx;
			display: flex;
			justify-content: center;
			box-sizing: border-box;
			margin-top: 50rpx;
			margin-bottom: 60rpx;
			.bottom-btn{
				width: 240rpx;
				height: 98rpx;
				line-height: 98rpx;
				border-radius: 10rpx;
				font-size: 30rpx;
				letter-spacing: 0.68rpx;
				margin: 0 15rpx;
				&.cancel {
					border: 2rpx solid #0E0F12;
					background-color: #FFFFFF;
					color: #0E0F12;
					height: 94rpx;
					line-height: 94rpx;
				}
				&.confirm {
					background-color: #0E0F12;
					color: #FFFFFF;
				}
			}
		}
	}
}
</style>
