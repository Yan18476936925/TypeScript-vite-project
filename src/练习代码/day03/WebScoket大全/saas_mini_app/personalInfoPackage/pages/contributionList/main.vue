<template>
	<view class="contribution-page">
		<view class="custom-back" :style="{
			'height': backButtonInfo.height + 'rpx',
			'top': backButtonInfo.top + 'rpx',
			'left': backButtonInfo.left + 'rpx'
		}" @tap="checkBack">
			<image class="custom-back-icon" v-if="backBtnType == 1" src="@/static/newImage/icon/icon_tongyong_jiantou_bai.png" mode=""></image>
			<image class="custom-back-icon" v-else src="@/static/newImage/icon/icon_tongyong_jiantou.png" mode=""></image>
		</view>
		<view class="contribution-content">
			<view class="contribution-top-three">
				<view class="contribution-top-other" :style="{
					'padding-top': navigationBarHeight + 'rpx'
				}">
					<view class="contribution-top-title">深大会贡献榜</view>
					<view class="contribution-top-tips">链接校友｜服务校友｜赋能校友</view>
				</view>
				<view class="contribution-top-three-list" v-if="contributionList.length > 0">
					<view :class="['contribution-top-item', `contribution-top-item-${item.rank}`]" v-for="(item, index) in contributionList.slice(0, 3)" :key="item.rank">
						<view class="contribution-top-item-header">
							<image class="contribution-top-item-photo" :src="item.photo" mode=""></image>
							<!-- <image class="contribution-top-item-photo" src="https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/photo979f4dbf-c6e5-4307-8f66-b88273506638.png" mode=""></image> -->
							
							<view class="contribution-top-item-border"></view>
						</view>
						<view class="contribution-top-item-info">
							<view class="top-item-info-name">{{ item.name }}</view>
							<view class="top-item-info-num">{{ item.num }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="contribution-other">
				<view class="contribution-other-item" v-for="(item, index) in contributionList.slice(3, 20)" :key="index">
					<view class="other-item-rank">{{ item.rank }}</view>
					<image class="other-item-photo" :src="item.photo" mode=""></image>
					<view class="other-item-name overflow-hidden">{{ item.name }}</view>
					<view class="other-item-num">{{ item.num }}</view>
				</view>
			</view>
		</view>
		<view class="blank" v-if="contributionList.length == 0">
			<view class="blank-icon background-box"></view>
			<view class="blank-text">暂时无人上榜</view>
		</view>
		<view class="contribution-bottom">
			<image class="contribution-bottom-photo" :src="myContributionInfo.photo" mode=""></image>
			<view class="contribution-bottom-info">				
				<view class="contribution-bottom-name overflow-hidden">{{ myContributionInfo.name }}</view>
				<view class="contribution-bottom-text overflow-hidden" v-if="myContributionInfo.rank > 0 && myContributionInfo.rank != 1">距离第一名，还需邀请<span>{{ myContributionInfo.inviteNum }}</span>名校友</view>
				<view class="contribution-bottom-text overflow-hidden" v-else-if="myContributionInfo.rank > 0 && myContributionInfo.rank == 1">再接再厉，邀请更多校友加入吧~</view>
				<view class="contribution-bottom-text overflow-hidden" v-else>距离{{ lastInfo.name }}，还需邀请<span>{{ myContributionInfo.inviteNum }}</span>名校友</view>
			</view>
			<view class="contribution-bottom-button">
				马上邀请
				<button open-type="share"></button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { sharePic } from "@/utils/base.js"
	import { apiGetRankList } from "@/api/guiId.js"

	export default {
		name: "home",
		data() {
			return {
				backButtonInfo: {
					height: 62,
					top: 48,
					left: 14,
				},
				backBtnType: 1,
				navigationBarHeight: 90,
				contributionList: [],
				myContributionInfo: {
					invite_id: "",
					name: "",
					num: 0,
					photo: "",
					rank: 0,
					inviteNum: 0
				},
				lastInfo: {
					invite_id: "",
					name: "",
					num: 0,
					photo: "",
					rank: 0,
				},
				sharePic,
				shareData: {
					pic: "",
					title: "",
					linkUrl: ""
				},
			}
		},
		computed: {
			...mapGetters([
				'userId',
				'bboxSystemType', 		//  1--正常手机（宽高正常） 2--大屏幕手机（高度过大） 3--平板（高度过小）
			]),
		},
		async onLoad() {
			this.setBackInfo()
			this.init();
			await this.getContributionList()
			this.setShareInfo()
		},
		async onShow() {},
		onHide() {},
		// 监听滚动条
		onPageScroll(e) {
			if(e.scrollTop > 200) {
				this.backBtnType = 2
			} else {
				this.backBtnType = 1
			}
		},
		methods: {
			setBackInfo() {
				let menuButtonObj = uni.getMenuButtonBoundingClientRect();
				let systemInfo = this.$store.getters.systemInfo
				let radio = 750 / systemInfo.screenWidth
				this.backButtonInfo.height = menuButtonObj.height * radio
				this.backButtonInfo.top = menuButtonObj.top * radio
				this.backButtonInfo.left = (systemInfo.screenWidth - menuButtonObj.right) * radio
				this.navigationBarHeight = global.navAllHeightRpx
			},
			checkBack() {
				let _allPages = getCurrentPages();
				if(!!_allPages && _allPages.length <= 1) { // 当前页面栈只有一个，点击时要返回首页
					uni.switchTab({
						url: '/pages/home/main'
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			setShareInfo() {
				const userInfo = uni.getStorageSync("userInfo")
				this.shareData = {
					pic: this.sharePic,
					title: `${!!userInfo.name ? userInfo.name : '深圳大学校友'}邀请你加入深大会，点击填写你的个人信息`,
					linkUrl: `/pages/sharePage/main?type=2&inviteId=${this.userId}`
				}
				console.log('shareData', this.shareData)
			},
			async getContributionList() {
				apiGetRankList().then(res => {
					this.contributionList = res.rank_list
					this.myContributionInfo = res.my
					if(this.myContributionInfo.rank > 0) {
						let firstInfo = this.contributionList[0]
						this.myContributionInfo.inviteNum = firstInfo.num - this.myContributionInfo.num
					} else {
						this.lastInfo = this.contributionList[this.contributionList.length - 1]
						this.myContributionInfo.inviteNum = this.lastInfo.num - this.myContributionInfo.num
					}
				})
			},
			// 初始化
			init() {
				this.contributionList = [];
				this.myContributionInfo = {
					invite_id: "",
					name: "",
					num: 0,
					photo: "",
					rank: 0,
					inviteNum: 0
				}
			},
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			this.init();
			this.getContributionList();
			uni.stopPullDownRefresh();
		},
		// 分享数据
		onShareAppMessage(event) {
			return this.public.baseShareData(
				this.shareData.title,
				this.public.shareLinkAddBrandId(this.shareData.linkUrl),
				this.shareData.pic
			);
		},
		onUnload() {}
	}
</script>

<style lang="less" scoped>
	.contribution-page {
		background-color: #F7F9FB;
		.custom-back {
			display: flex;
			align-items: center;
			position: fixed;
			padding: 0 12rpx;
			box-sizing: border-box;
			z-index: 99;
			.custom-back-icon {
				width: 36rpx;
				height: 36rpx;
			}
		}
		.contribution-content {
			.contribution-top-three {
				width: 750rpx;
				height: 638rpx;
				background-image: url("https://duimianimg.loovee.com/style/sdh/img/sdh_bd_bg.png");
				background-repeat: no-repeat;
				background-size: 100% 100%;
				position: relative;
				.contribution-top-other {
					width: 100%;
					padding-left: 38rpx;
					box-sizing: border-box;
					.contribution-top-title {
						font-family: SourceHanSansCN-Heavy;
						font-size: 52rpx;
						line-height: 52rpx;
						color: #FFFFFF;
						font-weight: 800;
						margin-bottom: 16rpx;
					}
					.contribution-top-tips {
						font-family:  PingFangSC-Regular;
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 24rpx;
						font-weight: 600;
						opacity: 0.6;
					}
				}
				.contribution-top-three-list {
					width: 100%;
					height: 386rpx;
					position: absolute;
					bottom: 32rpx;
					left: 0;
				}
				.contribution-top-item {
					position: absolute;
					text-align: center;
					&-1 {
						width: 218rpx;
						left: 50%;
						transform: translateX(-50%);
						bottom: 0;
						.contribution-top-item-header {
							width: 242rpx;
							height: 242rpx;
							position: absolute;
							top: -114rpx;
							left: 50%;
							transform: translateX(-50%);
							.contribution-top-item-photo {
								width: 152rpx;
								height: 152rpx;
								border-radius: 50%;
								margin: 48rpx auto 0;
							}
							.contribution-top-item-border {
								width: 242rpx;
								height: 242rpx;
								background-image: url("@/personalInfoPackage/static/sdh_bd_icon_1.png");
								background-repeat: no-repeat;
								background-size: 100% 100%;
								position: absolute;
								top: 0;
								left: 50%;
								transform: translateX(-50%);
								z-index: 99;
							}
						}
						.contribution-top-item-info {
							width: 218rpx;
							height: 232rpx;
							text-align: center;
							background-image: linear-gradient(180deg, #FFFFEC 0%, #FFFCAC 100%);
							box-shadow: 0 0 12rpx 0 rgba(255,87,46,0.40);
							border-radius: 16rpx;
							padding-top: 104rpx;
							box-sizing: border-box;
							.top-item-info-name {
								font-family:  PingFangSC-Regular;
								font-size: 28rpx;
								color: #2D2D2D;
								letter-spacing: 0.03px;
								text-align: center;
								font-weight: 600;
								margin-top: 8rpx;
							}
							.top-item-info-num {
								font-family:  PingFangSC-Regular;
								font-size: 36rpx;
								color: #2D2D2D;
								letter-spacing: 0.04px;
								font-weight: 600;
								margin-top: 14rpx;
							}
						}
					}
					&-2 {
						width: 178rpx;
						left: 48rpx;
						bottom: 0;
						.contribution-top-item-header {
							width: 186rpx;
							height: 186rpx;
							position: absolute;
							top: -88rpx;
							left: 50%;
							transform: translateX(-50%);
							.contribution-top-item-photo {
								width: 122rpx;
								height: 118rpx;
								border-radius: 50%;
								margin: 38rpx auto 0;
							}
							.contribution-top-item-border {
								width: 186rpx;
								height: 186rpx;
								background-image: url("@/personalInfoPackage/static/sdh_bd_icon_2.png");
								background-repeat: no-repeat;
								background-size: 100% 100%;
								position: absolute;
								top: 0;
								left: 50%;
								transform: translateX(-50%);
								z-index: 99;
							}
						}
						.contribution-top-item-info {
							width: 178rpx;
							height: 198rpx;
							background-image: linear-gradient(180deg, #FFFFFF 0%, #FFBEBD 100%);
							border-radius: 16rpx;
							padding-top: 84rpx;
							box-sizing: border-box;
							.top-item-info-name {
								font-family:  PingFangSC-Regular;
								font-size: 28rpx;
								color: #2D2D2D;
								letter-spacing: 0.03px;
								text-align: center;
								font-weight: 600;
							}
							.top-item-info-num {
								font-family:  PingFangSC-Regular;
								font-size: 36rpx;
								color: #2D2D2D;
								letter-spacing: 0.04px;
								font-weight: 600;
							}
						}
					}
					&-3 {
						width: 178rpx;
						right: 48rpx;
						bottom: 0;
						.contribution-top-item-header {
							width: 186rpx;
							height: 186rpx;
							position: absolute;
							top: -88rpx;
							left: 50%;
							transform: translateX(-50%);
							.contribution-top-item-photo {
								width: 122rpx;
								    height: 118rpx;
								border-radius: 50%;
								margin: 38rpx auto 0;
							}
							.contribution-top-item-border {
								width: 186rpx;
								height: 186rpx;
								background-image: url("@/personalInfoPackage/static/sdh_bd_icon_3.png");
								background-repeat: no-repeat;
								background-size: 100% 100%;
								position: absolute;
								top: 0;
								left: 50%;
								transform: translateX(-50%);
								z-index: 99;
							}
						}
						.contribution-top-item-info {
							width: 178rpx;
							height: 198rpx;
							background-image: linear-gradient(180deg, #FFFBF7 0%, #FFD7AF 100%);
							box-shadow: 0 0 12rpx 0 rgba(255,87,46,0.40);
							border-radius: 16rpx;
							padding-top: 84rpx;
							box-sizing: border-box;
							.top-item-info-name {
								font-family:  PingFangSC-Regular;
								font-size: 28rpx;
								color: #2D2D2D;
								letter-spacing: 0.03px;
								text-align: center;
								font-weight: 600;
							}
							.top-item-info-num {
								font-family:  PingFangSC-Regular;
								font-size: 36rpx;
								color: #2D2D2D;
								letter-spacing: 0.04px;
								font-weight: 600;
							}
						}
					}
				}
			}
			.contribution-other {
				width: 750rpx;
				margin-top: 38rpx;
				padding-bottom: 208rpx;
				box-sizing: border-box;
				.contribution-other-item {
					display: flex;
					align-items: center;
					margin-bottom: 64rpx;
					padding-right: 44rpx;
					box-sizing: border-box;
					&:last-child {
						margin-bottom: 0;
					}
					.other-item-rank {
						width: 116rpx;
						text-align: center;
						// font-family: .AppleSystemUIFont;
						font-family:  PingFangSC-Regular;
						font-size: 36rpx;
						color: #6B6B6B;
						font-weight: 400;
					}
					.other-item-photo {
						width: 84rpx;
						height: 84rpx;
						border-radius: 50%;
						margin-right: 22rpx;
					}
					.other-item-name {
						width: 360rpx;
						font-family:  PingFangSC-Regular;
						font-size: 32rpx;
						color: #2D2D2D;
						letter-spacing: 0.04px;
						text-align: left;
						font-weight: 600;
					}
					.other-item-num {
						width: 124rpx;
						font-family:  PingFangSC-Regular;
						font-size: 36rpx;
						color: #2D2D2D;
						letter-spacing: 0.04px;
						text-align: center;
						font-weight: 600;
					}
				}
			}
		}
		.blank{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.blank-icon{
				width: 108rpx;
				height: 104rpx;
				background-image: url("@/static/newImage/blank/invite.png");
			}
			.blank-text{
				padding: 32rpx 0 100rpx;
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #0E0F12;
				font-weight: 500;
				text-align: center;
			}
		}
		.contribution-bottom {
			width: 716rpx;
			height: 128rpx;
			display: flex;
			align-items: center;
			padding: 0 28rpx 0 18rpx;
			box-sizing: border-box;
			background: rgba(255,255,255,0.85);
			box-shadow: 0rpx 0rpx 32rpx 0rpx rgba(223,185,193,0.24);
			border-radius: 64rpx;
			position: fixed;
			bottom: 24rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
			&-photo {
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				margin-right: 12rpx;
			}
			&-info {
				text-align: left;
			}
			&-name {
				font-family:  PingFangSC-Regular;
				font-size: 32rpx;
				color: #2D2D2D;
				letter-spacing: 0.04px;
				font-weight: 600;
				margin-bottom: 12rpx;
			}
			&-text {
				font-family:  PingFangSC-Regular;
				font-size: 28rpx;
				color: #606060;
				letter-spacing: 0;
				line-height: 28rpx;
				font-weight: 600;
				> span {
					color: #E23837;
				}
			}
			&-button {
				width: 120rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				background: #0E0F12;
				border-radius: 28rpx;
				font-family:  PingFangSC-Regular;
				font-size: 20rpx;
				color: #FFFFFF;
				font-weight: 500;
				position: absolute;
				top: 36rpx;
				right: 28rpx;
				>button {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
					width: 100%;
					height: 100%;
					z-index: 100;
					background-color: rgba(0, 0, 0, 0);
					border: none;
					outline: none;
				}
			}
		}
	}
</style>
