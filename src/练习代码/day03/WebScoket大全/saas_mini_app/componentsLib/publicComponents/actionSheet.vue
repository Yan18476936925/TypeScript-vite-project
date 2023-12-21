<template>
	<!--  catchtouchmove="preventTouchMove" -->
	<view class="actionSheet-box">
		<view class="mask" v-show="show" @tap.stop="closeWindow()">
			<slot name="mask-content"></slot>
		</view>
		<view class="actionSheet" id="actionSheet" :style="{ 
			'height': otherHeight ? '' : isIpx ? (height - 0 + 90) + 'rpx' : height + 'rpx', 
			'bottom': 
				show ? 0: isIpx ? -(height - 0 + 30) * 2 + 'rpx' : -height * 2 + 'rpx',
			'background-color': !!bgColor ? bgColor : '#FFFFFF',
			paddingBottom: isIpx ? '30px' : ''
		}">
			<view class="header-box" :style="{'background': headerBg}" v-if="!customHeader" @tap.stop="closeWindow()">
				<view class="header-icon"></view>
			</view>
			<view>
				<slot name="customHeader"></slot>
			</view>
			<view class="content-box">
				<slot name="content"></slot>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'actionSheet',    // 底部弹窗/下拉式弹窗
	data () {
		return {
			showShadow: false
		}
	},
	// height 弹窗高度,必传参数,自适应高度也需要此值隐藏弹窗
	// otherHeight --true 打开自适应高度，内容区域没有otherHeight，则根据height设置高度，否则自定义高度
	// customHeader 是否自定义标题
	// bgColor	设置背景颜色，不传默认#FFFFFF
	// notChangeDirect 不直接修改弹窗显示隐藏状态
	props: ['height', 'show', 'otherHeight', 'headerBg', 'customHeader', 'bgColor', 'notChangeDirect'],
	computed: {
		isIpx() {
			return this.$store.getters.isIpx
		}
	},
	methods: {
		// 关闭
		closeWindow() {
			if(!this.notChangeDirect) {
				this.$emit('update:show', false)
			}
			this.$emit('closeActionSheet', true)
		},
		preventTouchMove() {
			
		}
	}
}
</script>

<style lang="less" scoped>
.actionSheet-box {
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
	.actionSheet {
		position: fixed;
		z-index: 101;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;
		-webkit-transition: bottom 0.3s;
		transition: bottom 0.3s;
		// background-color: #fff;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		overflow: hidden;
		box-shadow: 0 0 24rpx 0 rgba(0,0,0,0.06);
		.header-box {
			width: 750rpx;
			height: 30rpx;
			.header-icon{
				width: 108rpx;
				height: 9rpx;
				border-radius: 5rpx;
				background-color: rgba(185, 189, 195, 0.50);
				margin: 20rpx auto 0;
			}
		}
	}
}
</style>
