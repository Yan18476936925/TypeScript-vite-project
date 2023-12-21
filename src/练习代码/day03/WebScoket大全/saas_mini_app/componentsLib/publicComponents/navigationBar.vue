<template>
	<view class="navigationBar-box" :style="{'backgroundColor': navBackgroundColor}">
		<view class="navbar" :style="{'height': navTitleHeight + 'rpx', 'margin-top': navTitleTop + 'rpx', 'line-height':  navTitleHeight + 'rpx'}">
			<view class="default-box" :style="{
				'height': navTitleHeight + 'rpx'
			}"></view>
			<view class="nav-titlebar" :style="{
				'position': !!isScroll ? 'absolute' : 'fixed',
				'height': navTitleHeight + 'rpx',
				'line-height': navTitleHeight + 'rpx',
				'margin-top': navTitleTop + 'rpx', 
				'backgroundColor': navBackgroundColor}">
				<view class="btn-box" v-if="!!type" @touchstart="goFunc()">
					<image class="bar-image back-page" v-if="type === 'back'" mode="aspectFit" src="../../static/newImage/icon/icon_tongyong_jiantou.png"></image>
					<image class="bar-image back-page" v-if="type === 'whiteBack'" mode="aspectFit" src="../../static/newImage/icon/icon_tongyong_jiantou_bai.png"></image>
					<image class="bar-image home-page" v-if="type === 'home'" mode="aspectFit" src="../../static/newImage/icon/icon_zhuye.png"></image>
					<image class="bar-image home-page" v-if="type === 'whiteHome'" mode="aspectFit" src="../../static/newImage/icon/icon_zhuye_bai.png"></image>
					<image class="bar-image login-page" v-if="type === 'loginPage'" mode="aspectFit" src="../../static/newImage/icon/icon_denglu_guanbi.png"></image>
				</view>
				<view class="btn-box-diy" v-if="!type">
					<slot name="icon"></slot>
				</view>
				<view class="title-txt overflow-hidden" :style="{
					'width': !!titleWidth ? `${titleWidth}rpx` : '380rpx',
					'color': !!titleColor ? '#FFFFFF' : '#0E0F12',
					'line-height': `${navTitleHeight}rpx`,
					'text-align': !!textAlign ? textAlign : 'center'
				}">
					<view v-if="!!title">
						{{ title }}
					</view>
					<view v-if="!title">
						<slot name="title"></slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		/*
		* navBackgroundColor	导航栏背景色
		* titleColor			标题颜色
		* title					标题文字
		* type					back => 后退 ， home => 主页  loginPage => 登录
		* */ 
		name: 'navigationBar',				// 自定义导航条
		props: ['navBackgroundColor', 'titleColor', 'titleWidth', 'title', 'type', 'isEmit', 'isScroll', 'textAlign'],
		data() {
			return {
				navAllHeight: 120,
				navTitleHeight: 80,
				navTitleTop: 40,
			};
		},
		created() {
			this.$nextTick(() => {
				this.navAllHeight = global.navAllHeightRpx || 120;
				this.navTitleHeight = global.navTitleHeightRpx || 80;
				this.navTitleTop = global.navTitleTopRpx || 40;
			})
		},
		computed: {
			isIos() {
				return this.$store.getters.isIos
			}
		},
		methods: {
			goFunc() {
				switch(this.type){
					case 'back':
						if (!!this.isEmit) {
							this.$emit('backIntercept')
						} else {
							uni.navigateBack({
								delta: 1
							})
						}
						break;
					case 'whiteBack':
						if (!!this.isEmit) {
							this.$emit('backIntercept')
						} else {
							uni.navigateBack({
								delta: 1
							})
						}
						break;
					case 'whiteHome':
						uni.switchTab({
							url: '/pages/home/main'
						})
						break;
					case 'home':
						uni.switchTab({
							url: '/pages/home/main'
						})
						break;
					case 'loginPage':
						uni.navigateBack({
							delta: 1
						})
						break;
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	.navigationBar-box{
		width: 750rpx;
		margin: 0 auto;
		overflow: hidden;
		position: fixed;
		top: 0;
		z-index: 50;
		.default-box {
			width: 750rpx;
			background-color: rgba(255, 255, 255, 0);
		}
		.navbar{
			.nav-titlebar {
				// position: fixed;
				top: 0;
				left: 0;
				right: 0;
				z-index: 10;
			}
			.btn-box{
				position: absolute;
				width: 50rpx;
				height: 50rpx;
				left: 20rpx;
				top: 0;
				bottom: 0;
				margin: auto;
				.bar-image{
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;
					margin: auto;
					&.back-page{
						width: 36rpx;
						height: 36rpx;
					}
					&.home-page{
						width: 46rpx;
						height: 40rpx;
					}
					&.message-page{
						width: 52rpx;
						height: 52rpx;
					}
					&.login-page{
						width: 34rpx;
						height: 34rpx;
					}
				}
			}
			.btn-box-diy{
				height: 52rpx;
				position: absolute;
				left: 20rpx;
				top: 0;
				bottom: 0;
				margin: auto;
			}
			.title-txt {
				// font-size: 24rpx;
				font-size: 18px;
				text-align: center;
				width: 380rpx;
				margin: 0 auto;
				font-weight: bold;
				// line-height: 40rpx;
			}
		}
	}
</style>
