<template>
	<view class="share-sheet-box" v-show="show">
		<view class="mask" v-show="show" @tap.stop="closeWindow()"></view>
		<view class="shareSheet" id="shareSheet" :style="{ 'height': otherHeight ? '' : isIpx ? (height - 0 + 90) + 'rpx' : height + 'rpx', 'bottom': show ? 0 : -height * 2 + 'rpx'}">
			<view class="header" @tap.stop="closeWindow()">
				<view class="header-icon"></view>
			</view>
			<view class="header-box">
				<slot name="header"></slot>
			</view>
			<view class="sheet-content">
				<slot name="content"></slot>
			</view>
			<view class="sheet-footer" :style="{
					bottom: bboxSystemType ===3 ? '50rpx' : bboxSystemType ===2 ? '100rpx' : '50rpx'
				}">
				<view class="logo"></view>
				<view>
					<slot name="button"></slot>
				</view>
			</view>
			<image class="share-bg" src="https://duimianimg.loovee.com/style/blindbox/bbox/pic_share_tishika.png" mode=""></image>
		</view>
	</view>
</template>

<script>
export default {
	name: 'shareSheet',    // 底部弹窗/下拉式弹窗
	data () {
		return {
			showShadow: false
		}
	},
	props: ['show', 'height'],
	computed: {
		isIpx() {
			return this.$store.getters.isIpx
		},
		bboxSystemType() {
			return this.$store.getters.bboxSystemType
		}
	},
	methods: {
		// 关闭
		closeWindow() {
			this.$emit('update:show', false)
			this.$emit('closeShareSheet', true)
		}
	}
}
</script>

<style lang="less" scoped>
.share-sheet-box {
	.mask {
		position: fixed;
		z-index: 100;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		background: rgba(0, 0, 0, .7);
	}
	.shareSheet {
		position: fixed;
		width: 750rpx;
		// height: 1440rpx;
		z-index: 101;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		// border-top-left-radius: 20rpx;
		// border-top-right-radius: 20rpx;
		-webkit-transition: bottom 0.3s;
		transition: bottom 0.3s;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		overflow: hidden;
		// box-shadow: 0 0 24rpx 0 rgba(0,0,0,0.06);
		// background-image: url(../../static/newImage/public/pic_share_tishika.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		.share-bg {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 0;
		}
		.header {
			width: 36rpx;
			height: 36rpx;
			position: absolute;
			right: 32rpx;
			top: 32rpx;
			z-index: 10;
			background-image: url(../../static/newImage/public/icon_tongyong_guanbi_bai.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
		.header-box {
			position: relative;
			z-index: 10;
		}
		.sheet-content {
			position: relative;
			z-index: 10;
		}
		.sheet-footer {
			width: 750rpx;

			position: absolute;
			// bottom: 50rpx;
			left: 0;
			z-index: 10;
			padding: 0 72rpx;
			box-sizing: border-box;
			display: flex;
			.logo {
				// width: 176rpx;
				// height: 114rpx;
				width: 160rpx;
				height: 114rpx;
				background-image: url(../../static/newImage/public/icon_logo.png);
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
		}
	}
}
</style>
