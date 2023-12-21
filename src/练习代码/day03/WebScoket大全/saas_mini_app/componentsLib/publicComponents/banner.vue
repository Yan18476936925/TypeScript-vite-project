<template>
	<view :class="['banner-swiper', type + '-banner']" v-if="!!banner.length">
		<!-- banner后续可以再优化 -->
		<!-- 商城 -->
		<swiper class="banner-box" autoplay="true" circular="true" v-if="type == 'mall'" previous-margin="13" next-margin="13"
			@animationfinish="changeSwiper" @change="changeDot" :current="currentSwiper">
			<swiper-item class="swiper-item" v-for="(item, index) in banner" :index="index" :key="index">
				<image :src="item.fileid" class="banner-img" @tap="pageJump({url: item.url, position: 8, id: item.id})" mode="aspectFill" />
			</swiper-item>
		</swiper>
		<!-- 首页top -->
		<swiper class="banner-box" :autoplay="isAutoplay" circular="true" v-if="type == 'home-top'" previous-margin="150rpx" next-margin="150rpx"
			@animationfinish="changeSwiper" @change="changeDot" :current="currentSwiper">
			<swiper-item class="swiper-item" v-for="(item, index) in banner" :index="index" :key="index">
				<image :src="item.fileid ? item.fileid : '../../static/newImage/blank/pic_chouhe_banner.png'" class="banner-img" @tap="pageJump({url: item.url, position: 1, id: item.id, type: 'home_recommend'})" mode="aspectFill" />
			</swiper-item>
		</swiper>
		<!-- 首页 -->
		<swiper class="banner-box" autoplay="true" circular="true" v-else
			@animationfinish="changeSwiper" @change="changeDot" :current="currentSwiper">
			<swiper-item class="swiper-item" v-for="(item, index) in banner" :index="index" :key="index">
				<image :src="item.fileid ? item.fileid : '../../static/newImage/blank/pic_guangggao_banner.png'" class="banner-img" @tap="pageJump({url: item.url, position: type === 'home' ? 2 : type === 'me' ? 7 : 0, id: item.id})" mode="aspectFill" />
			</swiper-item>
		</swiper>
		<view v-if="banner.length > 1 && !!showDot">
			<view class="dots">
				<view class="dots-center">
					<view v-for="(item, index) in banner" @tap="currentIndex = index" :index="index" :key="index" class="dots-swiper"
					 :class="[currentIndex == index ? `dots-items-active` : `dots-items`]">
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { apiGetBanner } from '@/api/index/index'
	export default {
		name: 'banner',
		data() {
			return {
				canClick: true, // 是否允许点击 （防止重复点击问题）
			}
		},
		/**
		 * @param {String} type banner类型 home-top: 首页顶部banner, home: 首页基础banner, mall: 商城banner,
		 * @param {Array} banner 轮播图数据
		 * @param {Boolean} showDot 是否显示dot，showDot为true时，使用组件必须传入currentSwiper参数，并使用changeDot方法，否则dot滑动不生效
		 * @param {Number} currentIndex 轮播下标
		 * @param {Number} currentSwiper 指示点下标
		 * @param {Boolean} isAutoplay 是否自动播放
		 * @param {Boolean} isNotMoveTrack 是否跟踪滑动
		 * isAutoplay
		 */
		props: ['type', 'banner', 'showDot', 'currentIndex', 'currentSwiper', 'isAutoplay', 'isNotMoveTrack'],
		methods: {
			// 轮播事件
			changeSwiper(e) {
				if(this.isNotMoveTrack) {
					this.$emit('changeSwiper', e.detail.current)
				}
			},
			// 指示点事件
			changeDot(e) {
				if(this.isNotMoveTrack) {
					this.$emit('changeDot', e.detail.current)
				}
			},
			pageJump(url) {
				if (this.canClick && url) {
					this.canClick = false;
					this.$emit('openOtherPage', url);
					let bannerTimer = setTimeout(() => {
						this.canClick = true;
						clearTimeout(bannerTimer);
						bannerTimer = null;
					}, 100);
					(this.base.env === 'prod' && this.type === 'home') && uni.report('home_banner', '首页_banner');
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.banner-swiper {
		position: relative;
		text-align: center;
		width: 750rpx;
		margin: 0 auto;
		// border-radius: 16rpx;
		overflow: hidden;
		transform: translateY(0);
		.banner-img {
			border-radius: 16rpx;
			width: 684rpx;
			margin: auto;
			display: block;
		}
		&.home-top-banner {
			height: 500rpx;
			.banner-box, .banner-img{
				height: 500rpx;
			}
			.banner-img{
				width: 416rpx;
				height: 500rpx;
			}
		}
		&.home-banner {
			width: 694rpx;
			height: 224rpx;
			.banner-box, .banner-img {
				width: 100%;
				height: 100%;
			}
		}
		&.niudan-banner,
		&.mall-banner {
			height: 218rpx;
			.banner-box, .banner-img{
				height: 218rpx;
			}
		}
		&.me-banner {
			width: 680rpx;
			height: 156rpx;
			.banner-box, .banner-img {
				width: 100%;
				height: 100%;
			}
		}
		&.sign-banner{
			width: 618rpx;
			height: 124rpx;
			.banner-box, .banner-img {
				width: 100%;
				height: 100%;
			}
		}
		&.sign-banner{
			margin-top: 30rpx;
		}
	}
	.dots {
		position: absolute;
		bottom: 18rpx;
		right: 25rpx;
		height: 6rpx;
		.dots-center {
			margin: 0 auto;
			width: auto;
		}
		.dots-swiper {
			float: left;
			margin-left: 6rpx;
		}
		.dots-items {
			width: 6rpx;
			height: 4rpx;
			background: #D6EDFD;
			border-radius: 50%;
		}
		.dots-items::before {
			content: '';
			background: #D6EDFD;
			border-radius: 40%;
		}
		.dots-items-active {
			width: 58rpx;
			height: 4rpx;
			border-radius: 18rpx;
			background: #FFFFFF;
		}
		.dots-items-active::before {
			content: '';
			background: #D6EDFD;
			border-radius: 40%;
		}
	}
</style>
