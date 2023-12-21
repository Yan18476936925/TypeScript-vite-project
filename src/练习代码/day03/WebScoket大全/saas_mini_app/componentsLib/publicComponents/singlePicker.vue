<template>
	<view class="single-picker" @tap.stop="closePopup" v-if="show">
		<view class="picker-popup" @tap.stop>
			<view class="title-box">{{title}}</view>
			<scroll-view scroll-y class="town-item-box">
				<view class="town-item" v-for="(item, index) in list" :key="index" @tap="chooseItem(item)">
					<p :class="['select-option']">{{item.label||item.name}}</p>
				</view>
			</scroll-view>				
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				
			}
		},
		props: ["list", "title", "show"],
		// watch:{
		// 	list(val){
		// 		console.log(val,'list')
		// 	}
		// },
		methods: {
			chooseItem(item){
				this.$emit("chooseItem", item)
				this.$emit("update:show",false)
			},
			closePopup(){
				this.$emit("update:show",false)
			}
		}
	}
</script>

<style lang="less" scoped>
	.single-picker{
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.75);
		z-index: 3000;
	}
	.picker-popup{
		width: 526rpx;
		max-height: 556rpx;
		background-color: #FFFFFF;
		border-radius: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: Gilroy-Medium;
		font-size: 28rpx;
		color: #000000;
		text-align: center;
		line-height: 34rpx;
		font-weight: 600;
		padding: 40rpx;
		box-sizing: border-box;
		.title-box{
			margin: 0 auto 40rpx;
		}
		.town-item-box{
			width: 100%;
			height: 100%;
			overflow-y: scroll;
			overflow-x: hidden;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.town-item{
			padding: 20rpx;
		}
	}
</style>