<template>
	<!-- 主题列表 -->
	<view class="special-item">
		<view class="special-header" @tap="openMore" v-if="!!moreText">
			<view class="special-header-title overflow-hidden">
				<slot name="icon"></slot>
				{{ !!title ? title : '' }}
				<slot name="title"></slot>
			</view>
			<view class="special-header-more" :style="{'right': moreTextRightVal ? moreTextRightVal + 'rpx' : ''}">
				{{moreText + ' ' + '>'}}
			</view>
		</view>
		<view class="special-header" v-else>
			<view class="special-header-title overflow-hidden">
				<slot name="icon"></slot>
				{{ !!title ? title : '' }}
				<slot name="title"></slot>
			</view>
		</view>
		<slot name="content"></slot>
	</view>
</template>
<script> 

export default {
	name: 'specialItem',
	data () {
		return {}
    },
    props: ['title', 'moreText', 'moreTextRightVal', 'url', 'showStyle'],
	computed: {},
	methods: {
		openMore() {
			this.$emit('openMore', {
				url: this.url,
				type: this.showStyle
			});
		}
	}
}
</script>

<style lang="less" scoped>
.special-item{
	// width: 750rpx;
	font-weight: bold;
	.special-header{
		// height: 48rpx;
		overflow: hidden;
		margin-bottom: 36rpx;
		position: relative;
		.special-header-title{
			font-size: 32rpx;
			color: #0E0F12;
			letter-spacing: 0;
			line-height: 36rpx;
			display: flex;
			max-width: 520rpx;
		}
		.special-header-more{
			font-size: 22rpx;
			line-height: 36rpx;
			color: #787D84;
			letter-spacing: 0;
			position: absolute;
			bottom: 0;
			// right: 30rpx;
			right: 0;
			.special-header-more-icon{
				width: 24rpx;
				height: 24rpx;
				display: inline-block;
				vertical-align: -3rpx;
			}
		}
	}
}
</style>