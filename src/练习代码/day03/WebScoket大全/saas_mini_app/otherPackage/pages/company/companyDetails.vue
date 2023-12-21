<template>
	<view class="club-detail">
		<!-- <swiper class="detail-banner" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000"
			:circular="true">
			<swiper-item class="detail-banner-item" v-for="(item, index) in enterpriseDetail.firm_images" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper> -->
		<view class="detail-banner">
			<image :src="enterpriseDetail.cover_img" mode=""></image>
		</view>
		<view class="detail-info">
			<view class="detail-title overflow-wrap"><text class="detail-title-text">{{ enterpriseDetail.name }}</text><view class="industry_tag">{{ enterpriseDetail.industry }}</view></view>
			<view class="line_x"></view>
			<view class="detail_item_o detail_item_addr" @tap="jumpAddress()">
				<view class="detail_item_text">
					{{ enterpriseDetail.address }}
				</view>
			</view>
			<view class="line_x"></view>
			<view class="detail_item detail_item_per" @tap="public.pageJump(`/schoolFellowPackage/pages/schoolFellowDetails/main?studentId=${enterpriseDetail.member.m_id}`)">
				<view class="detail_item_text" v-if="!!enterpriseDetail.member">
					<image class="avatar_img"
						:src="enterpriseDetail.member.photo"
						mode=""></image>
					<view class="creator_text">
						{{ enterpriseDetail.position }}：{{ enterpriseDetail.member.name }}
						<text v-if="!!enterpriseDetail.member.college && enterpriseDetail.member.college != '未知'">（{{ enterpriseDetail.member.school_year }}·{{ enterpriseDetail.member.major }})</text>
						<text v-else>（{{ enterpriseDetail.member.school_year }}·{{ enterpriseDetail.member.college }}·{{ enterpriseDetail.member.major }})</text>
					</view>
				</view>
			</view>
			<view class="line_x"></view>
		</view>

		<view class="detail-content">
			<view class="detail-content-title">企业介绍</view>
			<!-- <view class="detail-html" v-if="!!enterpriseDetail.detail">{{enterpriseDetail.detail}}</view> -->
			<!-- <view class="detail-html" v-if="!!enterpriseDetail.detail" v-html="enterpriseDetail.detail"></view> -->
			<view class="detail-html" v-if="!!enterpriseDetail.detail">
				<rich-text :nodes="enterpriseDetail.detail"></rich-text>
			</view>
			<view class="detail-pic" v-if="!!enterpriseDetail.firm_images && enterpriseDetail.firm_images.length > 0">
				<image 
					v-for="(item, index) in enterpriseDetail.firm_images" 
					:key="index" 
					:src="item" 
					mode="widthFix"
				></image>
			</view>
			<view class="detail-blank" v-if="!enterpriseDetail.detail && enterpriseDetail.firm_images.length <= 0">
				<view class="icon background-box"></view>
				<view class="text">暂无介绍</view>
			</view>
		</view>
		<!-- <view :class="['detail-footer-btn']" v-if="!!enterpriseDetail.link" @tap="public.pageJump(enterpriseDetail.link)">前往企业官网</view> -->
	</view>
</template>

<script>
	import {
		apiGetEnterpriseDetail
	} from '@/api/home.js';
	export default {
		data() {
			return {
				enterprise_id: null, // 场地id
				enterpriseDetail: {
					address: "",
					cover_img: "",
					detail: "",
					firm_images: [],
					id: "",
					industry: "",
					link: "",
					m_id: "",
					member: null,
					name: "",
					position: "",
				}, // 场地详情
				enterpriseLocation: {
					latitude: 0,
					longitude: 0
				},
				shareData: {
					pic: "",
					title: "",
					linkUrl: ""
				},
			};
		},
		onLoad(options) {
			this.enterprise_id = options.enterprise_id;
			this.getEnterpriseDetail();
		},
		methods: {
			// 获取场地详情
			getEnterpriseDetail() {
				apiGetEnterpriseDetail({
					enterprise_id: this.enterprise_id
				}).then(res => {
					console.log('res', res)
					this.enterpriseDetail = res;
					// 广东省 深圳市 罗湖区 深圳市罗湖区红岭北路2088号中国人保金融大厦A座45层04-07招商证券
					// this.enterpriseDetail.address = '广东省 深圳市 罗湖区 深圳市罗湖区红岭北路2088号中国人保金融大厦A座45层04-07招商证券',
					// this.enterpriseDetail.detail = this.enterpriseDetail.detail.replace(/<img/g,
					// 	"<img style='width:100%;height:auto;'");
					// this.enterpriseDetail.detail = this.public.formatHTML(this.enterpriseDetail.detail)
					console.log('this.enterpriseDetail.detail', this.enterpriseDetail.detail)
					this.enterpriseDetail.detail = this.enterpriseDetail.detail.replace(/(\n)/g, '<br/>')
					this.setShareData()
					this.getEnterpriseLocation(this.enterpriseDetail.address)
				});
			},
			setShareData() {
				this.shareData = {
					pic: '',
					title: this.enterpriseDetail.name,
					linkUrl: `/otherPackage/pages/company/companyDetails?enterprise_id=${this.enterprise_id}`,
				};
			},
			async getEnterpriseLocation(address) {
				let data = await this.$store.dispatch("MapGeocoder", {
					address
				})
				console.log('企业地址解析结果', data)
				if(!!data) {
					this.enterpriseLocation = {
						latitude: data.result.location.lat,
						longitude: data.result.location.lng
					}
					// this.jumpAddress()
				}
			},
			// 打开地图(int)
			jumpAddress() {
				wx.openLocation({
					latitude: Number(this.enterpriseLocation.latitude),
					longitude: Number(this.enterpriseLocation.longitude),
					scale: 18,
					name: this.enterpriseDetail.name,
					address: this.enterpriseDetail.address
				});
			},
			openComment() {
				this.public.pageJump(this.enterpriseDetail.dzdp_link || '');
			},
			// 拨打电话（string)
			phoneCall() {
				uni.makePhoneCall({
					phoneNumber: String(this.enterpriseDetail.contact)
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

		// .detail-banner {
		// 	width: 750rpx;
		// 	height: 422rpx;

		// 	.detail-banner-item,
		// 	image {
		// 		width: 750rpx;
		// 		height: 422rpx;
		// 	}
		// }
		.detail-banner {
			width: 750rpx;
			height: 422rpx;
			image {
				width: 750rpx;
				height: 422rpx;
			}
		}

		.line_x {
			margin: 0 auto;
			width: 638rpx;
			height: 2rpx;
			background: rgba(241, 241, 241, 0.5);
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
				font-size: 38rpx;
				color: #0e0f12;
				font-weight: 600;
				padding-bottom: 32rpx;
				// margin-bottom: 20rpx;
				// .detail-title-name{
				// 	width: fit-content;
				// 	max-width: 530rpx;
				// 	position: relative;
				// 	.industry_tag{
				// 		position: absolute;
				// 		bottom: 6rpx;
				// 		right: -20rpx;
				// 		transform: translateX(100%);
				// 		display: inline-block;
				// 		font-family:  PingFangSC-Regular;
				// 		font-size: 20rpx;
				// 		color: #FFFFFF;
				// 		text-align: center;
				// 		font-weight: 600;
				// 		padding: 3rpx 5rpx;
				// 		background: #0E0F12;
				// 		border-radius: 4rpx;
				// 	}
				// }
				.detail-title-text{
					margin-right: 20rpx;
				}
					.industry_tag{
						
						transform: translateY(-6rpx);
						display: inline-block;
						font-family:  PingFangSC-Regular;
						font-size: 20rpx;
						color: #FFFFFF;
						text-align: center;
						font-weight: 600;
						padding: 3rpx 5rpx;
						background: #0E0F12;
						border-radius: 4rpx;
					}
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
			.detail_item_o{
				position: relative;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				height: 92rpx;
				padding-left: 48rpx;
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
			.detail_item_addr::after {
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
			.detail_item_addr::before {
				position: absolute;
				left: 0rpx;
				top: 50%;
				transform: translateY(-50%);
				content: '';
				width: 32rpx;
				height: 32rpx;
				background: url('@/static/newImage/icon/sdh_xyjlb_icon_dizhi_new.png');
				background-position: center;
				background-size: 100% 100%;
				background-repeat: no-repeat;
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
			padding: 44rpx 24rpx;
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
					transform:translateY(-50%);
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
				font-family: PingFangSC-Regular !important;
				font-size: 24rpx !important;
				color: #0E0F12 !important;
				line-height: 40rpx !important;
				font-weight: 400 !important;
			}
			.detail-pic {
				width: 674rpx;
				margin: 30rpx auto 0;
				border-radius: 20rpx;
				overflow: hidden;
				image {
					display: block;
					margin: 0 auto;
					margin-top: -1px;
					width: 100%;
					max-width: 674rpx;
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
	}
</style>