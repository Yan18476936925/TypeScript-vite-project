<template>
	<!-- 首页icon -->
	<view :class="['icon', `${type}-icon`]">
		<view class="icon-container">
			<view :class="['icon-wrapper', `${type}-icon-wrapper`]" v-for="(item, index) in iconList" :key="index" @tap.stop="pageJump(item, index)">
				<view class="icon-pic">
					<image :class="['icon-img', `icon-img-${currentIndex == index ? 'select' : ''}`]" :src="item ? item.iconPic : ''" mode="aspectFit"></image>
				</view>
				<text :class="['icon-txt overflow-hidden', `icon-txt-${currentIndex == index ? 'select' : ''}`]">{{ item.iconName }}</text>
			</view>
		</view>
	</view>
</template>
<script> 

export default {
	name: 'icons',     // 首页icons广告位列表
	data () {
		return {
			currentIndex: -1,
		}
    },
    props: ['iconList', 'type'],
	methods: {
		pageJump(item, index) {
			if(this.type === "home") {
				this.currentIndex = index
				this.$emit('scrollToPage', index);
			} else {
				this.$emit('openOtherPage', {url: item.url, type: "iconClick", id: item.id});
			}
		},
    }
}
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
	display: none;
	width: 0!important;
	height: 0!important;
	color: transparent!important;
}
.icon {
	box-sizing: border-box;
	width: 750rpx;
	height: 180rpx;
	padding: 0 18rpx;
	// overflow-x: auto;
	
	display: flex;
	align-items: center;
	
	font-weight: bold;
	.icon-container {
		overflow-x: auto;
		display: flex;
		
		.icon-wrapper {
			width: 104rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.icon-pic {
				width: 104rpx;
				height: 104rpx;
				
				display: flex;
				align-items: center;
				justify-content: center;
				
				.icon-img {
					width: 104rpx;
					height: 104rpx;
					border-radius: 50%;
					&-select {
						transform: scale(1.1);
					}
				}
			}
			.icon-txt {
				width: 100%;
				margin-top: 4rpx;
				font-size: 24rpx;
				color: #0E0F12;
				text-align: center;
				line-height: 24rpx;
				&-select {
					color: #FF6198;
				}
			}
		}
	}
}
// 首页
.home-icon {
	padding: 0 0 0 18rpx;
	.icon-container {
		.home-icon-wrapper + .home-icon-wrapper {
			margin-left: 30rpx;
		}
	}
}
// 首页
.homeNew-icon {
	padding: 0 0 0 18rpx;
	.icon-container {
		.homeNew-icon-wrapper + .homeNew-icon-wrapper {
			margin-left: 30rpx;
		}
	}
}
// 商城
.mall-icon {
	height: 188rpx;
	.icon-container {
		.mall-icon-wrapper + .mall-icon-wrapper {
			margin-left: 36.5rpx;
		}
	}
}
// 好玩
.play-icon {
	height: 188rpx;
	padding: 0 36rpx;
	.icon-container {
		.play-icon-wrapper {
			width: 120rpx;
			height: 188rpx;
			background: #FFFFFF;
			border-radius: 60rpx;
			.icon-pic {
				width: 120rpx;
				height: 120rpx;
				.icon-img {
					width: 104rpx;
					height: 104rpx;
				}
			}
			.icon-txt {
				margin-top: 8rpx;
				font-size: 18rpx;
				line-height: 28rpx;
			}
		}
		.play-icon-wrapper + .play-icon-wrapper {
			margin-left: 19.5rpx;
		}
	}
}
</style>