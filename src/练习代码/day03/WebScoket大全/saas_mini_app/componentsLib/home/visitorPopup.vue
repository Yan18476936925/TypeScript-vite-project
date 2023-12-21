<template>
	<view class="visitor-popup">
		<view :class="['visitor-popup-content',bboxSystemType===3 ? 'visitor-popup-content-small' : '']">
			<image class="big-img-window" :src="!!sightseerNewComerImg ? sightseerNewComerImg : ''" @tap="sightseerClickLogin()"></image>
			<image class="close-window-btn" src="../../static/newImage/icon/icon_home_xuanfu_1.png" @tap="closePopup()"></image>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'visitorPopup',			// 游客弹窗
		data() {
			return {
			}
		},
		props: ["sightseerNewComerImg"],
		computed: {
			...mapGetters([
				'bboxSystemType', 		//  1--正常手机（宽高正常） 2--大屏幕手机（高度过大） 3--平板（高度过小）
			]),
		},
		methods: {
			// 游客模式下弹窗点击触发登录逻辑
			sightseerClickLogin() {
				this.$emit('linkToLogin', true);
				global._logger.writeLogs('游客弹窗调起登录弹窗');
			},
			// 关闭弹窗
			closePopup(closeName, needDoOther) {
				this.$emit('closePopup', '');
				global._logger.writeLogs(`关闭游客弹窗`);
			}
		}
	}
</script>

<style lang="less" scoped>
	// 自定义导航的层级为10, 这边改为112
	.visitor-popup {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		z-index: 112;
		background-color: rgba(0, 0, 0, 0.5);
		.visitor-popup-content {
			position: fixed;
			left: 0;
			right: 0;
			top: 50%;
			margin: 0 auto;
			z-index: 110;
			transform: translateY(-50%);
			width: 664rpx;
			// 原UI尺寸为850rpx，由于底部导航栏非自定义，占据空间，会遮挡关闭按钮，统一上移50rpx
			height: 900rpx;
			&.visitor-popup-content-small {
				position: absolute;
			}
			// 单图片弹窗
			.big-img-window{
				width: 664rpx;
				height: 850rpx;
				display: block;
				margin: 0 auto;
			}	
			// 关闭弹窗
			.close-window-btn{
				width: 62rpx;
				height: 62rpx;
				position: absolute;
				bottom: -74rpx;
				right: 0;
				left: 0;
				margin: 0 auto;
			}
		}
	}
</style>
