<template>
	<view class="medalHall_page">
		<view class="custom-nav-bar" :style="{
			'height': backButtonInfo.height + 'rpx',
			'top': backButtonInfo.top + 'rpx',
		}">
			<view class="back" :style="{
				'left': `${backButtonInfo.left + 12}rpx`
			}" @tap="back"></view>
			<view class="title-text" v-show="!titleColor" :style="{
				'width': `${titleWidth}rpx`,
			}">勋章馆</view>
		</view>
		<view class="perDetail" @tap="public.pageJump('/personalInfoPackage/pages/myInvite/main')">
			<image :src="userAvatar" class="per_image" mode=""></image>
			<view class="per_msg">
				<view class="per_msg_1">
					{{ userNick }}已获得{{ memberBadgeInfo.badge_count || 0 }}枚勋章
				</view>
				<view class="per_msg_2">
					已成功邀请{{ memberBadgeInfo.invite_count || 0 }}名校友入会
				</view>
			</view>
		</view>

		<view class="medalList">
			<view class="medal_item" @tap="curMedalId = index;showMedal = true;" v-for="(item,index) in inviteBadge"
				:key="index">
				<image :src="item.image" :class="[`medal_img`,`medal_img_${item.status <= 0 ? 'gray':''}`]" mode="">
				</image>
				<view class="medal_name">
					{{ item.name }}
				</view>
				<view class="medal_get" v-if="item.create_time && item.create_time != 0">
					{{ item.create_time }}获得
				</view>
				<view class="wear" v-if="item.status == 2">
				</view>
			</view>
		</view>

		<!-- 微信二维码弹窗 -->
		<view class="showMedal" v-if="showMedal">
			<view class="showMedal_close" @tap="showMedal = false">

			</view>
			<view class="medalImg">
				<image :src="inviteBadge[curMedalId].image" mode=""></image>
			</view>
			<view class="showMedal_name">
				{{inviteBadge[curMedalId].name}}
			</view>
			<view class="showMedal_date" v-if="!!inviteBadge[curMedalId].create_time">
				{{inviteBadge[curMedalId].create_time}}获得
			</view>
			<view class="showMedal_condition">
				{{inviteBadge[curMedalId].desc}}
			</view>
			<view class="showMedal_msg">
				（勋章可选择展示在校友卡和名片中展示）
			</view>
			<view class="showMedal_btn" @tap="badgeSwitch(curMedalId,0)" v-if="inviteBadge[curMedalId].status == 2">
				取消佩戴
			</view>
			<view class="showMedal_btn" @tap="badgeSwitch(curMedalId,1)" v-else-if="inviteBadge[curMedalId].status == 1">
				佩戴
			</view>
			<button open-type="share" v-else class="showMedal_btn">邀请校友</button>
		</view>
		<view class="showMedal_mask" v-if="showMedal"></view>
	</view>
</template>

<script>
	import { sharePic } from '@/utils/base.js'
	import { apiGetUserInfo, apiBadgeSwitch } from "@/api/personal.js"
	import { apiGetMemberBadge } from "@/api/guiId.js"
	import { mapGetters } from "vuex"
	export default {
		data() {
			return {
				navTitleTop: global.navTitleTopRpx || 0,
				backButtonInfo: {
					height: 62,
					top: 48,
					left: 14,
				},
				titleWidth: 380,
				titleColor: 0, // 标题颜色 1黑0白
				inviteBadge: {},
				memberBadgeInfo: {},
				showMedal: false,
				curMedalId: '',
				sharePic,
				shareData:{}
			}
		},
		async onLoad() {
			this.setBackInfo()
			this.getMemberBadgeInfo()
		},
		computed: {
			...mapGetters([
				"userId",
				"userNick",
				"userAvatar",
			]),
		},
		methods: {
			setBackInfo() {
				let menuButtonObj = uni.getMenuButtonBoundingClientRect();
				let systemInfo = this.$store.getters.systemInfo
				let radio = 750 / systemInfo.screenWidth
				this.backButtonInfo.height = menuButtonObj.height * radio
				this.backButtonInfo.top = menuButtonObj.top * radio
				this.backButtonInfo.left = (systemInfo.screenWidth - menuButtonObj.right) * radio
				// this.navigationBarHeight = global.navAllHeightRpx
				this.titleWidth = (systemInfo.screenWidth - menuButtonObj.width - (systemInfo.screenWidth - menuButtonObj.right) - (70 / radio) ) * radio
			},
			getMemberBadgeInfo() {
				apiGetMemberBadge().then(res => {
					this.memberBadgeInfo = res.member
					this.inviteBadge = res.list
					this.shareData = {
						pic: this.sharePic,
						title: `${!!this.userNick ? this.userNick : '深圳大学校友'}邀请你加入深大会，点击填写你的个人信息`,
						linkUrl: `/pages/sharePage/main?type=2&inviteId=${this.userId}`,
					};
				})
			},
			badgeSwitch(id, status) {
				uni.showLoading({
					title: "loading...",
				})
				apiBadgeSwitch({
					level: id,
					status
				}).then(res => {
					uni.hideLoading()
					// this.getInfo()
					this.inviteBadge[this.curMedalId].status = status == 0 ? 1 : 2
				})
			},
			back() {
				// uni.navigateBack({
				// 	delta: 1,
				// })
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
			}
		},
		onPageScroll(e) {
			this.titleColor = e.scrollTop >= 35 ? 1 : 0
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

<style scoped lang="less">
	.medalHall_page {
		background-color: #F4F7FB;
		background-image: url("https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/Fl8Z6yqr0k9FgERfJLahuyOeNbeo.png");
		background-position: top left;
		background-size: 100% auto;
		background-repeat: no-repeat;

		.custom-nav-bar {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			width: 100%;
			// padding: 17rpx 42rpx;
			// padding-top: calc(var(--status-bar-height) + var(--window-top));
			// box-sizing: border-box;
			font-family:  PingFangSC-Regular;
			font-size: 36rpx;
			color: #000000;
			text-align: center;
			line-height: 36rpx;
			font-weight: 600;
			z-index: 20;
			display: flex;
			align-items: center;

			&.white {
				background-image: url("https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/Fl8Z6yqr0k9FgERfJLahuyOeNbeo.png");
				background-position: top left;
				background-size: 100% auto;
				background-repeat: no-repeat;
			}
			.title-text {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
			}
			.back {
				position: absolute;
				// left: 34rpx;
				// top: calc(var(--status-bar-height) + var(--window-top) + 14rpx);
				width: 30rpx;
				height: 30rpx;
				background: url('@/static/newImage/icon/icon_tongyong_jiantou.png');
				background-position: center;
				background-size: 100% 100%;
				background-repeat: no-repeat;
			}

		}

		.perDetail {
			padding-top: 246rpx;
			display: flex;
			padding-left: 44rpx;
			padding-bottom: 34rpx;
			box-sizing: border-box;
			position: relative;

			.per_image {
				border-radius: 50%;
				width: 112rpx;
				height: 112rpx;
			}

			.per_msg {
				padding-top: 10rpx;
				padding-left: 20rpx;
				box-sizing: border-box;

				.per_msg_1 {
					font-family:  PingFangSC-Regular;
					font-size: 30rpx;
					color: #010101;
					letter-spacing: 0;
					font-weight: 600;
				}

				.per_msg_2 {
					padding-top: 14rpx;
					box-sizing: border-box;
					font-family: PingFangSC-Regular;
					font-size: 24rpx;
					color: #010101;
					letter-spacing: 0;
					font-weight: 400;
				}
			}
			&::before {
				width: 8rpx;
				height: 16rpx;
				background: url('@/static/newImage/icon/arrow_gray.png') no-repeat;
				background-size: 100% 100%;
				content: '';
				position: absolute;
				right: 36rpx;
				bottom: 86rpx;
			}
		}

		.medalList {
			box-sizing: border-box;
			padding: 24rpx 24rpx 96rpx 24rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.medal_item {
				position: relative;
				padding-top: 50rpx;
				box-sizing: border-box;
				margin-bottom: 24rpx;
				width: 340rpx;
				height: 348rpx;
				background: #FFFFFF;
				box-shadow: 0px 0px 32rpx 0px rgba(223, 185, 193, 0.24);
				border-radius: 36rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.medal_img {
					width: 186rpx;
					height: 186rpx;
				}

				.medal_img_gray {
					filter: grayscale(100%);
				}

				.wear {
					position: absolute;
					top: 44rpx;
					right: -6rpx;
					background: url('https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/Ft1Zmmts8wEI84mwSxQhkTLWNNlB.png');
					background-position: center;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					width: 76rpx;
					height: 38rpx;
				}

				.medal_name {
					padding-top: 8rpx;
					box-sizing: border-box;
					font-family:  PingFangSC-Regular;
					font-size: 30rpx;
					color: #010101;
					letter-spacing: 0;
					font-weight: 600;
				}

				.medal_get {
					font-family: PingFangSC-Regular;
					font-size: 24rpx;
					color: #010101;
					letter-spacing: 0;
					font-weight: 400;
				}
			}
		}
	}

	.showMedal {
		padding-top: 220rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		padding-bottom: 182rpx;
		box-sizing: border-box;
		z-index: 1000;
		position: fixed;
		top: 268rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 578rpx;
		min-height: 572rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.showMedal_close {
			position: absolute;
			top: -82rpx;
			right: 0;
			transform: translatex(50%);
			width: 62rpx;
			height: 62rpx;
			background: url('@/static/newImage/public/closeBtn1.png');
			background-position: center;
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}

		.medalImg {
			position: absolute;
			top: -56rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 248rpx;
			height: 248rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.showMedal_name {
			font-family:  PingFangSC-Regular;
			font-size: 32rpx;
			color: #0E0F12;
			font-weight: 500;
		}

		.showMedal_date {
			width: 100%;
			text-align: center;
			line-height: 24rpx;
			font-family: PingFangSC-Regular;
			font-size: 24rpx;
			color: #010101;
			letter-spacing: 0;
			font-weight: 400;
			margin-top: 4rpx;
		}

		.showMedal_condition {
			width: 498rpx;
			margin: 18rpx auto 0;
			font-family: PingFangSC-Regular;
			font-size: 26rpx;
			color: #0E0F12;
			letter-spacing: 0;
			line-height: 44rpx;
			padding-bottom: 12rpx;
			box-sizing: border-box;
			font-weight: 400;
			overflow-y: scroll;
			overflow-x: hidden;
		}

		.showMedal_msg {
			font-family:  PingFangSC-Regular;
			font-size: 24rpx;
			color: #999999;
			font-weight: 500;
		}

		.showMedal_btn {
			position: absolute;
			bottom: 36rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 322rpx;
			height: 72rpx;
			background: #0E0F12;
			border-radius: 36rpx;
			font-family:  PingFangSC-Regular;
			font-size: 28rpx;
			color: #FDFEFE;
			text-align: center;
			line-height: 72rpx;
			font-weight: 500;
			text-align: center;
		}
	}

	.showMedal_mask {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		opacity: 0.6;
		background: #000000;
	}
</style>