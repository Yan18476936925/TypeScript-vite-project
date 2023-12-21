<template>
	<view class="step-bar">
		<view class="step-item" v-for="(item, index) in barList" :key="index">
			<view class="red-doll" v-if="index == step"></view>
			<view class="num-doll" :class="[index < step ? 'fill' : '']" v-else>{{index + 1}}</view>
			<view class="step-text">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				barList: [
					{text: "个人信息"},
					{text: "学籍信息"},
					{text: "工作信息"},
					{text: "签名确认"},
				]
			}
		},
		props:["step"],
		methods:{
			
		}
	}
</script>

<style lang="less" scoped>
	.step-bar{
		width: 100vw;
		height: 192rpx;
		background-image: linear-gradient(180deg, #FFDBDB 17%, rgba(255,230,230,0.00) 69%);
		background-size: 100vw 722rpx;
		background-position: 136rpx center;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 50rpx 32rpx 56rpx;
		box-sizing: border-box;
		.step-item{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			height: 100%;
			position: relative;
			&:not(:last-child)::after{
				content: "";
				background: rgba(255,255,255,0.7);
				border-radius: 4rpx;
				width: 88rpx;
				height: 2rpx;
				position: absolute;
				top: 20rpx;
				right: -100rpx;
			}
			.red-doll{
				background-color: rgba(244,0,18,0.3);
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				position: relative;
				&::after{
					content: "";
					background: #F40012;
					width: 20rpx;
					height: 20rpx;
					border-radius: 50%;
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%,-50%);
				}
			}
			.num-doll{
				margin-top: 4rpx;
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				background: #5A5A5A;
				font-size: 20rpx;
				color: #FEFAFA;
				line-height: 32rpx;
				text-align: center;
				font-weight: 700;
				&.fill{
					background: #000000;
				}
			}
			.step-text{
				font-size: 22rpx;
				color: #242524;
				text-align: center;
				font-weight: 600;
			}
		}
	}
</style>