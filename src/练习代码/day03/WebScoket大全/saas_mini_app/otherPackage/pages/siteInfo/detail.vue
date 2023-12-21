<template>
	<view class="site-detail">
		<swiper class="detail-banner" :autoplay="true" :interval="4000" :duration="1000" :circular="true">
			<swiper-item class="detail-banner-item" v-for="(item, index) in siteDetail.banner_list" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="detail-info">
			<view class="detail-title">{{siteDetail.title || ''}}</view>
			<view class="detail-avatar" v-if="!!siteDetail.member" @tap="goMemberDetails()">
				<view class="avatar_image">
					<image :src="siteDetail.member.photo" mode="aspectFill"></image>
				</view>
			</view>
			<view class="check_card" v-if="!!siteDetail.member" @tap="goMemberDetails()">
				查看名片>
			</view>
			<!-- <view class="detail-discount-content" v-if="siteDetail.discount || siteDetail.discount_str">
				<view class="detail-discount-str" v-if="siteDetail.discount_str">
					校友：{{siteDetail.discount_str}}</view>
				<view class="detail-discount" v-if="!!siteDetail.discount">校友{{siteDetail.discount}}折</view>
			</view> -->
			<view class="detail-discount-content">
				<view class="detail-discount-str" v-if="!!siteDetail.member">
					校友代表：{{siteDetail.member.name}}{{!!siteDetail.member.school_year ? ` ${siteDetail.member.school_year}级` : ''}}</view>
				<view class="detail-discount" v-if="!!siteDetail.discount">校友{{siteDetail.discount}}折</view>
			</view>
			 <view class="line_x"></view>
			<view class="detail_item detail_item_time">
				<view class="detail_item_text">
					{{ siteDetail.open_desc || '' }}
				</view>
			</view>
			<view class="line_x"></view>
			<view class="detail_item detail_item_addr"  @tap="jumpAddress">
				<view class="detail_item_text">
					{{ siteDetail.address || '' }}
				</view>
			</view>
			<view class="line_x"></view>
			<view class="detail_item detail_item_phone" @tap="phoneCall">
				<view class="detail_item_text">
					{{ siteDetail.contact || '' }}
				</view>
			</view>
			<view class="line_x"></view>
		</view>
		<view class="detail-content">
			<view class="detail-content-title">详情介绍</view>
			<view class="detail-html" v-html="siteDetail.detail">
				<!-- <rich-text :nodes="siteDetail.detail" class="detail-html-text"></rich-text> -->
			</view>
		</view>

		<view class="detail-footer">
			<!-- <view class="detail-footer-btn detail-footer-border" v-if="!!siteDetail.dzdp_link" @tap="openComment">查看评价
			</view> -->
			<view class="detail-footer-btn detail-footer-border" @tap="phoneCall">电话预约
			</view>
			<view :class="['detail-footer-btn detail-footer-black']"
				@tap="jumpAddress">导航前往</view>
			<!-- <view :class="['detail-footer-btn detail-footer-black', !siteDetail.dzdp_link ? 'detail-footer-long' : '']"
				@tap="jumpAddress">导航前往</view> -->
		</view>
	</view>
</template>

<script>
	import {
		apiHomeSiteDetail
	} from "@/api/home.js"
	export default {
		data() {
			return {
				site_id: null, // 场地id
				siteDetail: {
					banner_list: []
				}, // 场地详情
				shareData: {
					pic: "",
					title: "",
					linkUrl: ""
				},
			}
		},
		onLoad(options) {
			this.site_id = options.site_id
			this.getSiteDetail()
		},
		methods: {
			// 获取场地详情
			getSiteDetail() {
				apiHomeSiteDetail({
						site_id: this.site_id
					})
					.then(res => {
						this.siteDetail = res
						this.siteDetail.discount = +this.siteDetail.discount
						this.siteDetail.detail = this.siteDetail.detail.replace(/<img/g,
							"<img style='width:100%;height:auto;border-radius: 12px;'")
							this.siteDetail.detail = this.siteDetail.detail.replace(/<span/g,
								'<span class="span_detail"')
						this.setShareData()
					})
			},
			setShareData() {
				this.shareData = {
					pic: '',
					title: this.siteDetail.title,
					linkUrl: `/otherPackage/pages/siteInfo/detail?site_id=${this.site_id}`,
				};
			},
			goMemberDetails() {
				this.public.pageJump(`/schoolFellowPackage/pages/schoolFellowDetails/main?studentId=${this.siteDetail.member.m_id}`)
			},
			// 打开地图(int)
			jumpAddress() {
				wx.openLocation({
					latitude: Number(this.siteDetail.lat),
					longitude: Number(this.siteDetail.lng),
					scale: 18,
					name: this.siteDetail.title,
					address: this.siteDetail.address
				})
				// wx.navigateToMiniProgram({
				// 	shortLink: '#小程序://大众点评美食电影运动旅游门票/3C8bAk4ufnReJkv',
				// 	success(res) {
				// 	  // 打开成功
				// 	},
				// 	fail(res) {
				// 	  // 打开失败
				// 	  console.log(res)
				// 	},
				// })
			},
			openComment() {
				this.public.pageJump(this.siteDetail.dzdp_link || '')
			},
			// 拨打电话（string)
			phoneCall() {
				uni.makePhoneCall({
					phoneNumber: String(this.siteDetail.contact)
				});
			},
		},
		// 分享数据
		onShareAppMessage() {
			return this.public.baseShareData(
				this.shareData.title,
				this.public.shareLinkAddBrandId(this.shareData.linkUrl),
				this.shareData.pic
			);
		},
	}
</script>

<style lang="less" scoped>
	.site-detail {
		width: 100vw;
		min-height: 100vh;
		background-color: #FFFFFF;
		padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;
		.line_x{
			margin: 0 auto;
			width: 638rpx;
			height: 2rpx;
			background: rgba(241,241,241,0.5);
		}
		.detail-banner {
			width: 100vw;
			height: 420rpx;

			.detail-banner-item,
			image {
				width: 100vw;
				height: 420rpx;
			}
		}

		.detail-info {
			width: 100vw;
			position: relative;
			padding: 0rpx 34rpx 0;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;

			&::before {
				content: "";
				position: absolute;
				top: -22rpx;
				left: 50%;
				transform: translate(-50%);
				width: 100vw;
				height: 24rpx;
				border-radius: 24rpx 24rpx 0 0;
				background-color: #FFFFFF;
			}

			.detail-title {
				width: 488rpx;
				font-size: 38rpx;
				color: #0E0F12;
				font-weight: 600;
				word-wrap: break-word;
				word-break: break-all;
			}
			.detail-avatar{
				position: absolute;
				top: -78rpx;
				right: 38rpx;
				width: 160rpx;
				height: 160rpx;
				border: 6rpx solid rgba(255,255,255,1);
				border-radius: 24rpx;
				overflow: hidden;
				.avatar_image{
					width: 100%;
					height: 100%;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.check_card{
				width: 160rpx;
				text-align: center;
				font-family: PingFangSC-Regular;
				font-size: 20rpx;
				color: #0E0F12;
				position: absolute;
				top: 88rpx;
				right: 38rpx;
			}
			.detail-discount-content {
				border-radius: 4rpx;
				display: flex;
				flex-direction: column;
				padding-bottom: 32rpx;

				.detail-discount {
					margin-top: 14rpx;
					width: fit-content;
					text-align: center;
					background: #E23837;
					border-radius: 4rpx;
					font-size: 20rpx;
					color: #FFFFFF;
					font-weight: 600;
					padding: 4rpx 4rpx 2rpx;
					// height: 32rpx;
					line-height: 28rpx;
				}

				.detail-discount-str {
					padding-top: 10rpx;
					width: 488rpx;
					word-wrap: break-word;
					word-break: break-all;
					font-size: 24rpx;
					color: #0E0F12;
					font-weight: 600;
				}
			}

			.detail_item {

				position: relative;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				height: 92rpx;
				padding-left: 42rpx;
				padding-right: 14rpx;
				font-family:  PingFangSC-Regular;
				font-size: 26rpx;
				color: #0E0F12;
				line-height: 28rpx;
				font-weight: 500;

				.detail_item_text {
					max-width: 530rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.detail_item_time::before {
				position: absolute;
				left: 4rpx;
				top: 50%;
				transform: translateY(-50%);
				content: '';
				width: 24rpx;
				height: 24rpx;
				background: url('@/static/newImage/icon/sdh_xyjlb_icon_shijian.png');
				background-position: center;
				background-size: 100% 100%;
				background-repeat: no-repeat;
			}

			.detail_item_addr::after,
			.detail_item_phone::after {
				position: absolute;
				right: 4rpx;
				top: 50%;
				transform: translateY(-50%);
				content: '';
				width: 8rpx;
				height: 16rpx;
				background: url('@/static/newImage/icon/arrow_gray.png');
				background-position: center;
				background-size: 100% 100%;
				background-repeat: no-repeat;
			}

			.detail_item_addr::before {
				position: absolute;
				left: 4rpx;
				top: 50%;
				transform: translateY(-50%);
				content: '';
				width: 24rpx;
				height: 24rpx;
				background: url('@/static/newImage/icon/sdh_xyjlb_icon_dizhi.png');
				background-position: center;
				background-size: 100% 100%;
				background-repeat: no-repeat;
			}

			.detail_item_phone::before {
				position: absolute;
				left: 4rpx;
				top: 50%;
				transform: translateY(-50%);
				content: '';
				width: 24rpx;
				height: 24rpx;
				background: url('@/static/newImage/icon/sdh_xyjlb_icon_dianhua.png');
				background-position: center;
				background-size: 100% 100%;
				background-repeat: no-repeat;
			}

		}

		.detail-content {
			flex: 1;
			width: 100vw;
			display: flex;
			flex-direction: column;
			padding: 54rpx 24rpx;
			box-sizing: border-box;

			.detail-content-title {
				position: relative;
				font-size: 30rpx;
				color: #0E0F12;
				font-weight: 600;
				display: flex;
				align-items: center;
				margin-bottom: 12rpx;
				padding-left: 16rpx;
				&::before {
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					content: "";
					background: #FF0000;
					width: 4rpx;
					height: 14rpx;
					
				}
			}

			.detail-html {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 0 16rpx;
				box-sizing: border-box;
				/deep/ .MsoNormal{
					font-family: PingFangSC-Regular !important;
					font-size: 24rpx !important;
					color: #0E0F12 !important;
					line-height: 40rpx !important;
					font-weight: 400 !important;
				}
				/deep/	.span_detail{
						font-family: PingFangSC-Regular !important;
						font-size: 24rpx !important;
						color: #0E0F12 !important;
						line-height: 40rpx !important;
						font-weight: 400 !important;
				}
			}
		}

		.detail-footer {
			width: 750rpx;
			height: 180rpx;
			background: rgba(255,255,255,0.85);
			box-shadow: 0px 0px 32rpx 0px rgba(223,185,193,0.24);
			border-radius: 40rpx 40rpx 0px 0px;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			padding-top: 32rpx;
			box-sizing: border-box;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;

			&-btn {
				width: 322rpx;
				height: 84rpx;
				font-size: 24rpx;
				font-weight: 600;
				padding-top: 30rpx;
				border-radius: 12rpx;
				text-align: center;
				margin: 0 26rpx;
				position: relative;
				box-sizing: border-box;
			}

			&-border {
				width: 284rpx;
				background: #F7F9FB;
				color: #0E0F12;
				border-radius: 12rpx;
			}

			&-black {
				background: #0E0F12;
				color: #FDFEFE;
				border-radius: 12rpx;
			}

			&-long {
				width: 578rpx;
			}
		}
	}
</style>