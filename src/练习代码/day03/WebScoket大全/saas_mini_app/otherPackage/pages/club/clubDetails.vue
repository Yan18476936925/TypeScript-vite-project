<template>
	<view class="club-detail">
		<swiper class="detail-banner" indicator-dots :autoplay="true" :interval="3000" :duration="1000"
			:circular="true">
			<swiper-item class="detail-banner-item" v-for="(item, index) in clubDetail.banner_list" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="detail-info">
			<view class="detail-title overflow-wrap">{{ clubDetail.title || '' }}</view>
			<view class="detail-desc">
				{{ clubDetail.desc || '' }}
			</view>
			<view class="line_x"></view>
			<view class="detail_item detail_item_per" @tap="public.pageJump(`/schoolFellowPackage/pages/schoolFellowDetails/main?studentId=${clubDetail.member.m_id}`)">
				<view class="detail_item_text">
					<image class="avatar_img"
						:src="clubDetail.member.photo || ''"
						mode="aspectFill"></image>
					<view class="creator_text" v-if="!!clubDetail.member">
						负责人：{{ clubDetail.member.name || '' }}
						<text v-if="!!clubDetail.member.college && clubDetail.member.college != '未知'">（{{ clubDetail.member.school_year }}·{{ clubDetail.member.college }}·{{ clubDetail.member.major }})</text>
						<text v-else>（{{ clubDetail.member.school_year }}·{{ clubDetail.member.major }})</text>
					</view>
				</view>
			</view>
			<view class="line_x"></view>
		</view>

		<view class="detail-content">
			<view class="detail-content-title">详情介绍</view>
			<view class="detail-html" v-html="clubDetail.detail"></view>
			<view class="detail-blank" v-if="!clubDetail.detail">
				<view class="icon background-box"></view>
				<view class="text">暂无介绍</view>
			</view>
		</view>
		<view v-if="!!clubDetail.m_qrcode" :class="['detail-footer-btn']" @tap="showAddWX = true">添加负责人微信</view>
		
		<!-- 微信二维码弹窗 -->
		<view class="addWx" v-if="showAddWX">
			<view class="addWx_close" @tap="showAddWX = false">
				
			</view>
			<view class="addWx_title">
				欢迎加入我们俱乐部
			</view>
			<view class="codeImg">
				<image :src="clubDetail.m_qrcode" :show-menu-by-longpress="true" mode=""></image>
			</view>
			<view class="addWx_name">
				{{ clubDetail.creator }}
			</view>
			<view class="addWx_msg">
				长按识别加我微信
			</view>
		</view>
		<view class="addWx_mask" v-if="showAddWX">
			
		</view>
	</view>
</template>

<script>
	import {
		apiGetClubDetail
	} from '@/api/home.js';
	export default {
		data() {
			return {
				club_id: null, // 场地id
				clubDetail: {
					banner_list: []
				}, // 场地详情
				showAddWX: false,
				shareData: {
					pic: "",
					title: "",
					linkUrl: ""
				},
			};
		},
		onLoad(options) {
			this.club_id = options.club_id;
			this.getSiteDetail();
		},
		methods: {
			// 获取场地详情
			getSiteDetail() {
				apiGetClubDetail({
					club_id: this.club_id
				}).then(res => {
					this.clubDetail = res;
					this.clubDetail.detail = this.clubDetail.detail.replace(/<img/g,
						"<img style='width:100%;height:auto;'");
						this.clubDetail.detail = this.clubDetail.detail.replace(/<span/g,
							'<span class="span_detail"')
					this.clubDetail.banner_list = this.clubDetail.banner_list.slice(0, 5)
					this.setShareData()
				});
			},
			setShareData() {
				this.shareData = {
					pic: '',
					title: this.clubDetail.title,
					linkUrl: `/otherPackage/pages/club/clubDetails?club_id=${this.club_id}`,
				};
			},
			// 打开地图(int)
			jumpAddress() {
				wx.openLocation({
					latitude: Number(this.clubDetail.lat),
					longitude: Number(this.clubDetail.lng),
					scale: 18
				});
			},
			openComment() {
				this.public.pageJump(this.clubDetail.dzdp_link || '');
			},
			// 拨打电话（string)
			phoneCall() {
				uni.makePhoneCall({
					phoneNumber: String(this.clubDetail.contact)
				});
			}
		},
		// 分享数据
		onShareAppMessage() {
			return this.public.baseShareData(
				this.shareData.title,
				this.public.shareLinkAddBrandId(this.shareData.linkUrl),
				this.shareData.pic
			);
		},
	};
</script>

<style lang="less" scoped>
	.club-detail {
		width: 100vw;
		min-height: 100vh;
		background-color: #ffffff;
		padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;

		/deep/ .wx-swiper-dots {
			bottom: 44rpx !important;
		}

		/deep/ wx-swiper .wx-swiper-dot {
			width: 8rpx;
			height: 8rpx;
			opacity: 0.5;
			background: #000000;
			border-radius: 4rpx;
		}

		/deep/ wx-swiper .wx-swiper-dot-active {
			opacity: 1;
			width: 20rpx;
			height: 8rpx;
			background: #FFFFFF;
			border-radius: 4rpx;
		}

		.detail-banner {
			width: 750rpx;
			height: 422rpx;

			.detail-banner-item,
			image {
				width: 750rpx;
				height: 422rpx;
			}
		}

		.line_x {
			margin: 0 auto;
			width: 638rpx;
			height: 2rpx;
			background: rgba(241, 241, 241, 1);
		}

		.detail-info {

			position: relative;
			padding-top: 8rpx;
			padding-left: 48rpx;
			padding-right: 48rpx;
			box-sizing: border-box;

			&::before {
				content: '';
				position: absolute;
				top: -22rpx;
				left: 50%;
				transform: translate(-50%);
				width: 750rpx;
				height: 24rpx;
				border-radius: 24rpx 24rpx 0 0;
				background-color: #ffffff;
			}

			.detail-title {
				font-size: 36rpx;
				color: #0e0f12;
				font-weight: 600;
				// margin-bottom: 20rpx;
			}

			.detail-desc {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 10rpx 0 28rpx 0;
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				color: #0E0F12;
				line-height: 40rpx;
				font-weight: 400;
			}

			.detail_item {
				max-width: 702rpx;
				position: relative;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				height: 92rpx;

				.detail_item_text {
					white-space: nowrap;
					display: flex;
					align-items: center;

					.avatar_img {
						width: 32rpx;
						height: 32rpx;
						border-radius: 50%;
					}

					.creator_text {
						max-width: 530rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						padding-left: 16rpx;
						padding-right: 14rpx;
						font-family:  PingFangSC-Regular;
						font-size: 26rpx;
						color: #0E0F12;
						line-height: 28rpx;
						font-weight: 500;
					}
				}
			}

			// .detail_item_per::before {
			// 	position: absolute;
			// 	left: 4rpx;
			// 	top: 50%;
			// 	transform: translateY(-50%);
			// 	content: '';
			// 	width: 24rpx;
			// 	height: 24rpx;
			// 	background: url('@/static/newImage/icon/sdh_xyjlb_icon_xingming.png');
			// 	background-position: center;
			// 	background-size: 100% 100%;
			// 	background-repeat: no-repeat;
			// }


			.detail_item_per::after {
				position: absolute;
				right: 24rpx;
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

		}

		.detail-content {
			padding: 54rpx 24rpx;
			box-sizing: border-box;

			.detail-content-title {
				position: relative;
				font-size: 30rpx;
				color: #0E0F12;
				font-weight: 600;
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;
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
			.detail-blank{
				width: 100%;
				height: 40vh;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.icon{
					width: 106rpx;
					height: 114rpx;
					background-image: url("@/static/newImage/blank/edit.png");
				}
				.text{
					margin-top: 20rpx;
					font-size: 28rpx;
					text-align: center;
					color: #000000;
					letter-spacing: 0;
					font-weight: 400;
				}
			}
		}


		.detail-footer-btn {
			position: fixed;
			left: 50%;
			transform: translateX(-50%);
			bottom: 48rpx;
			width: 522rpx;
			height: 84rpx;
			line-height: 84rpx;
			background: #0E0F12;
			border-radius: 46rpx;
			font-family:  PingFangSC-Regular;
			font-size: 28rpx;
			color: #FFFFFF;
			text-align: center;
			font-weight: 500;
		}
		.addWx{
			z-index: 1000;
			position: fixed;
			top: 268rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 512rpx;
			height: 520rpx;
			background: #FFFFFF;
			border-radius: 20px;
			display: flex;
			flex-direction: column;
			align-items: center;
			.addWx_close{
				position: absolute;
				top: 0;
				right: 0;
				transform: translate(50%,-50%);
				width: 62rpx;
				height: 62rpx;
				background: url('@/static/newImage/public/closeBtn1.png');
				background-position: center;
				background-size: 100% 100%;
				background-repeat: no-repeat;
			}
			.addWx_title{
				padding: 52rpx 0 34rpx;
				font-family:  PingFangSC-Regular;
				font-size: 28rpx;
				color: #0E0F12;
				font-weight: 500;
			}
			.codeImg{
				width: 248rpx;
				height: 248rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.addWx_name{
				padding-top: 42rpx;
				font-family:  PingFangSC-Regular;
				font-size: 36rpx;
				color: #0E0F12;
				font-weight: 500;
				box-sizing: border-box;
			}
			.addWx_msg{
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #0E0F12;
			}
		}
		.addWx_mask{
			z-index: 999;
			position: fixed;
			left: 0;
			top: 0;
			width: 100vw;
			height: 100vh;
			opacity: 0.6;
			background: #000000;
		}
	}
</style>