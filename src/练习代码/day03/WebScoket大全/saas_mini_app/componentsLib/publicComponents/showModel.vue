<template>
	<view :class="['showModel',  bboxSystemType === 3 ? 'showModel-small': '']" v-if="show" @tap.stop="clickModel()">
		<view :class="['box', isDiyWindow ? 'diy-box' : '']">
			<view v-if="!notUseDefalutTitle && !!title" class="title-box" :style="{'margin-top': titleTop}">
				<image v-if="colorTitle" class="title-pic" src="../../static/newImage/public/bj_tc.png" mode="aspectFit"></image>
				<view 
					class="title-text" 
					:style="{
						'color':color,
						'text-align': txtAlign,
						'margin-top': top
					}">{{ title }}</view>
			</view>
			<slot name="titleBox"></slot>
			<slot name="content"></slot>
			<view class="bottom" v-if="!!cancelTitle || !!confirmTitle">
				<view v-if="!!cancelTitle" class="bottom-btn cancel" :class="{'no-confirm': !confirmTitle}" @tap="cancel">{{ cancelTitle }}</view>
				<view v-if="!!confirmTitle" class="bottom-btn confirm" :class="{'no-cancel': !cancelTitle}" @tap="confirm">{{ confirmTitle }}</view>
			</view>
			<image v-if="type" class="close-btn" @tap="closeFunc()" src="../../static/newImage/icon/icon_home_xuanfu_1.png"></image>
			<image v-if="bottomCloseBtn" class="bottom-close-btn" @tap="closeFunc()" src="../../static/newImage/icon/icon_home_xuanfu_1.png"></image>
		</view>
	</view>
</template>

<script>
import { mapGetters } from "vuex"
export default {
	name: "showModel",   // 通用弹窗
	data () {
		return {}
	},
	props: [
		"top", 							// 文字的上边距
		"txtAlign",             		// 文字位置 left center right
		"color", 						// 文字颜色
		"show",    						// 显示隐藏
		"title",   						// 标题
		"titleTop", 					// 标题的 margin-top
		"cancelTitle",  				// 如果没有传值则没有这个按钮
		"confirmTitle",  				// 如果没有传值则没有这个按钮
		"type",         				// 弹窗类型，存在证明有关闭按钮 
		"isDiyWindow",  				// 是否自定义弹窗，场景用于单个图片不限制宽高，外部控制自适应展示，实际居中并且取消背景色
		"colorTitle",       			// 彩色头部底色
		"notUseDefalutTitle",  			// 是否使用默认头部
		"bottomCloseBtn",				// 底部关闭弹窗按钮
	],
	computed: {
		...mapGetters([
			"bboxSystemType", //  1--正常手机（宽高正常） 2--大屏幕手机（高度过大） 3--平板（高度过小）
        ])
	},
	methods: {
		// 点击返回按钮
		cancel () {
			this.$emit("cancel")
			this.$emit("update:show", false)
		},
		// 点击确认按钮
		confirm () {
			this.$emit("confirm")
		},
		// 点击关闭按钮
		closeFunc () {
			this.$emit("update:show", false)
			this.$emit("closeModelWindow", true)
		},
		// 点击蒙层
		clickModel() {
			this.$emit("closeModelWindow", true)
		}
	}
}
</script>

<style lang="less" scoped>
.showModel {
	position: fixed;
	z-index: 999;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	margin: auto;
	background-color: rgba(0, 0, 0, 0.6);
	font-weight: bold;
	&.showModel-small{
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
		width: 606rpx;
		background-color: #FFFFFF;
		border-radius: 40rpx;
		&.diy-box{
			width: 750rpx;
			background-color: transparent;
		}
		.title-box {
			position: relative;
			width: 606rpx;
			height: 158rpx;
			.title-pic{
				display: block;
				width: 606rpx;
				height: 158rpx;
			}
			.title-text {
				text-align: left;
				float: left;
				padding-left: 60rpx;
				font-size: 36rpx;
				color: #FFFFFF;
				line-height: 158rpx;
				font-weight: bold;
				margin-top: -158rpx;
			}
		}
		.bottom {
			width: 606rpx;
			display: flex;
			justify-content: center;
			box-sizing: border-box;
			margin-bottom: 69rpx;
			text-align: center;
			font-weight: bold;
			.bottom-btn{
				width: 210rpx;
				height: 82rpx;
				line-height: 82rpx;
				border-radius: 12rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				margin: 0 27rpx;
				&.cancel {
					box-sizing: border-box;
					border: 4rpx solid #0E0F12;
					background-color: #FFFFFF;
					color: #0E0F12;
					line-height: 74rpx;
				}
				&.confirm {
					background-color: #0E0F12;
					color: #FFFFFF;
				}
				&.no-confirm {
					width: 400rpx;
					height: 82rpx;
					line-height: 82rpx;
					// margin-right: 0;
				}
				&.no-cancel {
					width: 400rpx;
					// margin-right: 0;
				}
			}
		}
		.close-btn{
			width: 62rpx;
			height: 62rpx;
			position:absolute;
			top: -20rpx;
			right: -20rpx;
		}
		.bottom-close-btn{
			width: 62rpx;
			height: 62rpx;
			position:absolute;
			left: 0;
			right: 0;
			// bottom: -38rpx;
			bottom: -100rpx;
			margin: auto;
		}
	}
}
</style>
