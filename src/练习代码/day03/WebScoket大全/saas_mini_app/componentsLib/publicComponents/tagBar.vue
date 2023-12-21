<template>
	<view class="tag" @tap="handleClick" :style="{
      'width': !isDiySize ? width + 'rpx' : '100%',
      'height': !isDiySize ? height + 'rpx' : '100%',
	  'padding': paddingVal,
      'backgroundColor': background}">
		<view class="tag-content" :style="{
			'color': color,
			'line-height': !isDiySize ? height + 'rpx' : size + 'rpx',
			'font-size': size + 'rpx'}">
			{{content}}
		</view>
	</view>
</template>

<script>
	// 
	export default {
		name: 'tagBar',					// 倾斜图标文案，默认写死宽高，动态变化的话传入isDiySize,修改padding控制大小
		props: {
			isDiySize: {
				type: Boolean,
				default: false
			},
			paddingVal: {
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: '',
			},
			width: {
				type: Number,
				default: 130
			},
			height: {
				type: Number,
				default: 41
			},
			color: {
				type: String,
				default: '#fff'
			},
			size: {
				type: Number,
				default: 22
			},
			background: {
				type: String,
				default: '#000'
			}
		},
		methods: {
			handleClick() {
				this.$emit('onClickTag')
			}
		}
	}
</script>

<style lang="less" scoped>
	.tag {
		transform: skew(-13deg);
		border-radius: 10rpx;
		box-sizing: border-box;
		font-weight: bold;
		.tag-content {
			transform: skew(13deg);
			text-align: center;
		}
	}
</style>
