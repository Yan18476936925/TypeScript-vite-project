<template>
	<view class="me-page-box">
		<view class="me-title" :style="{'padding-top':navTitleTop + 17 + 'rpx'}">我的</view>
		
		<view v-if="!!openid">
			<!-- 未入会 -->
			<view class="no-join" v-if="meInfo.status != 1" @tap="applyMember">
				<view class="no-join-card bg-image">
					<view class="card_name">
						深大会校友卡
					</view>
					<view class="join-btn">
						<view class="join-btn-tips">立即领取></view><view class="join-btn-bg"></view>
					</view>
				</view>
			</view>
			<!-- 已入会 -->
			<!-- :style="{'background-image': minePosition.card_img}" -->
			<view class="card-box bg-image" :class="[`card-box-${minePosition.level}`]" v-else @tap="showPop = true">
				<view class="name-box">
					<view class="name" :class="[`name-${minePosition.level}`]" >{{ meInfo.name }}</view>
					<view class="level-icon" :class="[`level-icon-${meInfo.position}`]" ><image :src="minePosition.card_img" style="height: 36rpx;" mode="heightFix"></image></view>
				</view>
				<view class="school-info" :class="[`school-info-${minePosition.level}`]">
					{{ meInfo.school_year }}级
					<template v-if="!!meInfo.college && meInfo.college != '未知'"><text>·</text>{{ meInfo.college }}</template>
					<text>·</text>
					{{ meInfo.major }}
				</view>
				<view class="join-btn">
					<view class="join-btn-tips" :class="[`join-btn-tips-${minePosition.level}`]" >查看></view><view class="join-btn-bg" :class="[`join-btn-bg-${minePosition.level}`]"></view>
				</view>
				<view class="level-badge" v-if="userBadgeList.length > 0">
					<image v-for="(item, index) in userBadgeList" :key="index" :src="item"></image>
				</view>
			</view>
			<!-- 徽章 -->
			<view class="new-invite-box" v-if="meInfo.status == 1">
				<view class="new-invite-title">
					<view class="new-invite-title-left">深大会贡献荣誉徽章</view>
					<view class="new-invite-title-right" v-if="openRank > 0" @tap="jumpPage({link: '/personalInfoPackage/pages/contributionList/main'})">查看完整贡献榜></view>
				</view>
				<view class="rank-info-box">
					<view class="my-rank-info" @tap="jumpPage({link: '/otherPackage/pages/medalHall/main'})">
						<view class="my-rank-num" v-if="myRankInfo.rank > 0">我的排名：{{ myRankInfo.rank > 20 ? '20+' : `NO·${myRankInfo.rank}` }}</view>
						<view class="my-rank-num" v-else>我的排名：暂未上榜</view>
						<view class="my-rank-num">勋章：{{ meInfo.badge_count || 0 }}个</view>
						<image class="my-rank-badge" v-if="meInfo.badge_count > 0" :src="meInfo.highestLevelBadge" mode=""></image>
					</view>
					<view class="first-rank-info" @tap="jumpPage({link: '/personalInfoPackage/pages/contributionList/main'})">
						<image class="first-rank-info-photo" :src="firstRankInfo.photo" mode=""></image>
						<view class="first-rank-info-border"></view>
					</view>
				</view>
				<view class="new-invite-bottom">
					<!-- <view class="new-invite-tips" v-if="openRank <= 0">邀请更多校友加入吧~</view> -->
					<!-- <view class="new-invite-tips" v-if="inviteInfo.type == 1">邀请<text>{{ inviteInfo.num }}</text>名校友加入，即可超过{{ inviteInfo.name || '其他校友' }}</view> -->
					<view class="new-invite-tips" v-if="inviteInfo.type == 1">邀请<text>{{ inviteInfo.num }}</text>名校友加入，即可超过{{ `第${inviteInfo.rank}名` || '其他校友' }}</view>
					<view class="new-invite-tips" v-else-if="inviteInfo.type == 2">邀请<text>{{ inviteInfo.num }}</text>名校友加入，解锁专属的荣誉徽章</view>
					<view class="new-invite-tips" v-else>再接再厉，邀请更多校友加入吧~</view>
					<view class="new-invite-btn">
						<view class="new-invite-btn-text">马上邀请</view>
						<image class="new-invite-arrow" src="../../static/newImage/icon/arrow_gray.png" mode=""></image>
						<button open-type="share"></button>
					</view>
				</view>
			</view>
			<!-- 社交模块 -->
			<view class="me-social-box">
				<view class="social-item" v-for="(item,index) in socialList" :key="index" @tap="socialTap(item.type)">
					<view class="social-item-left">						
						<image class="social-item-icon" :src="item.icon" mode=""></image>
						<view class="social-item-name">{{ item.title }}</view>
						<!-- <view class="social-item-tip" v-if="!!item.tip">{{ item.tip }}</view> -->
					</view>
					<!-- <view class="social-item-btn" @tap="socialTap(item.type)">{{ item.btnText }}</view> -->
					<view class="social-item-right">
						<view class="social-item-right-text">{{ item.btnText }}</view>
						<image class="social-item-right-arrow" src="../../static/newImage/icon/arrow_gray.png" mode=""></image>
					</view>
				</view>
			</view>
			<!-- 底部跳转 -->
			<view class="me-link-box">
				<view class="me-item" v-for="(item,index) in boxItemShow" :key="index" @tap="jumpPage(item)">
					<view class="me-item-name">{{ item.name }}</view>
					<view class="me-item-icon">
						<view class="icon bg-image"></view>
					</view>
					<view class="unread_num" v-if="item.name == '我的消息'&& meInfo.message_num != '0' && !!meInfo.message_num"></view>
					<view class="improved-text" v-if="item.showImproved != 0">待完善</view>
				</view>
			</view>
		</view>
		<view class="no-login" v-else>
			<view class="logo-icon bg-image"></view>
			<view class="login-tips">会员登录后，可查看详细信息</view>
			<!-- <view class="login-btn" @tap="getUserInfo">微信授权登录</view> -->
			<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号快捷登录</button>
		</view>
		<!-- 信息卡弹窗 -->
		<view class="me-card-pop" v-if="showPop">
			<view class="me-card-box">
				<view class="me-card-content bg-image" :class="[`me-card-content-${minePosition.level}`]">
					<!-- <image :src="isDrawPicing" mode="aspectFit"></image> -->
					<image class="user-avatar" :src="meInfo.photo ? (meInfo.photo + '?imageMogr2/thumbnail/!360') : '../../static/newImage/blank/default_avatar.png'" mode="aspectFill"></image>
					<view class="title-text">Name</view>
					<view class="user-name">{{meInfo.name}}<image :src="levelPath" mode="heightFix"></image></view>
					<view class="title-text">Major</view>
					<view class="user-school" v-if="!!meInfo.college && meInfo.college != '未知'">{{meInfo.school_year + '级' + meInfo.college + '-' + meInfo.major}}</view>
					<view class="user-school" v-else>{{meInfo.school_year + '级' + '-' + meInfo.major}}</view>
					<!-- <view class="user-level-badge" v-if="userBadgeList.length > 0">
						<image v-for="(item, index) in userBadgeList" :key="index" :src="item"></image>
					</view> -->
					<view class="title-text">Signature</view>
					<view class="user-introduction">{{ !!meInfo.introductionText ? meInfo.introductionText : '厚德载物，海纳百川' }}</view>
					<view class="time-text">入会时间：{{meInfo.audit_time_format}}</view>
					<image class="qrcode-image" :src="meInfo.qrcode" mode="aspectFit"></image>
					<view class="me-card-close bg-image" @tap="showPop = false"></view>
				</view>
				<view class="card-operate">
					<view class="card-operate-btn card-operate-save" @tap="saveBtn">
						保存到相册
					</view>
					<view class="card-operate-btn card-operate-share">
						<button open-type="share"></button>
						发送给微信好友
					</view>
				</view>
			</view>
		</view>
		<view class="me-card-pop test_demo" v-if="showDemo">
			<image :src="isDrawPicing" mode="aspectFit"></image>
		</view>
		<!-- 申请加入校友群 -->
		<uni-popup ref="joinGroupPopup" type="center" :mask-click="false">
			<view class="join-group-box">
				<image class="join-group-close" src="../../static/newImage/public/closeBtn1.png" mode="" @tap="closeJoinGroupPopup"></image>
				<view class="group-title">{{ groupInfo.name }}校友群</view>
				<view class="group-desc">校友群介绍：{{ groupInfo.desc }}</view>
				<image class="admin-qrcode" :src="groupInfo.qrcode" :show-menu-by-longpress="true" mode="aspectFit"></image>
				<view class="increase-tip">长按识别加管理员微信</view>
			</view>
		</uni-popup>
		
		<!-- 公众号二维码 -->
		<uni-popup ref="officialPopup" type="center" :mask-click="false">
			<view class="join-group-box">
				<image class="join-group-close" src="../../static/newImage/public/closeBtn1.png" mode="" @tap="closeOfficialPopup"></image>
				<view class="group-title">深大会公众号</view>
				<view class="group-tip">脚踏实地，共创美好</view>
				<image class="admin-qrcode" src="https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FmV8QnDnSzTuEPoT47KdzylUYmKM.jpg" :show-menu-by-longpress="true" mode="aspectFit"></image>
				<view class="increase-tip">长按识别关注公众号</view>
			</view>
		</uni-popup>
		
		<canvas style="width:313px;height:428px;position:fixed;left:9999rpx" canvas-id="drawCard" id="drawCard"></canvas>
	</view>
</template>

<script>
	import { mapGetters } from "vuex"
	import { getNetworkType } from "@/utils/wxApi.js"
	import { getQiniuToken } from "@/api/index/index.js"
	import qiniuUploader from '@/utils/qiniuUploader.js' 
	import { sharePic } from "@/utils/base.js"
	import defaultLogin from "@/utils/allLoginType/defaultLogin.js"
	import { apiGetUserInfo, apiGetPosition, apiGetInviteList,apiBadgeSwitch } from "@/api/personal.js"
	import { apiGetRankList, apiGetGroupQrcode } from "@/api/guiId.js"
	// import { pageJump } from "@/utils/index.js"
	export default {
		name: "me",
		components: {},		
		data() {
			return {
				// pageJump,
				userInfo: {},		// 授权获取到的用户信息
				loginParam: {
					code: "",
					encryptedData: "",
					iv: "",
				},					// 登录参数
				userAvatar: '',
				navTitleTop: global.navTitleTopRpx || 0,
				meInfo: {}, // 校友卡信息
				socialList: [
					{
						icon: '../../static/newImage/icon/sdh_wd_icon_weixinqun.png',
						title: '校友群',
						tip: '',
						btnText: '申请加入',
						type: 'alumniGroup'
					},{
						icon: '../../static/newImage/icon/sdh_wd_icon_gongzhonghao.png',
						title: '深大会公众号',
						tip: '凝聚校友，携手共赢',
						btnText: '打开公众号',
						type: 'officialAccount'
					}
				],
				boxItem: [
					{
						link: '/personalInfoPackage/pages/message/main',
						name: '我的消息',
						show: 1,
						showImproved: 0
					},{
						link: '/pages/me/joinData',
						name: '入会资料',
						show: 1,
						showImproved: 0
					},{
						link: '/otherPackage/pages/company/editCompany',
						name: '企业资料',
						show: 1,
						showImproved: 0
					},{
						link: '/pages/me/personalData',
						name: '个人资料',
						show: 1,
						showImproved: 0
					}
				],
				boxItemShow: [],
				groupInfo: {
					desc: "",
					name: "",
					postal_code: "0",
					qrcode: "",
				},
				isDrawPicing: '', // 绘制完成的图片
				showPop: false,
				showDemo: false,
				positionList: [], // 职位列表
				minePosition: {}, // 我的职位信息
				levelWidth: 36, // 职位徽章长度
				levelHeight: 18, // 职位徽章长度
				levelPath: '', // 职位徽章本地地址
				inviteBadge: {}, // 邀请徽章数据
				inviteBadgeList: [], // 邀请徽章列表
				openRank: 0, // 0 未开启 1开启 2开启且上榜 3开启但未上榜
				inviteInfo: {
					type: 1,
					num: 0,
					name: '',
					rank: 0
				},
				userBadgeList: [],
				rankList: [],
				myRankInfo: {
					invite_id: "",
					name: "",
					num: 0,
					photo: "",
					rank: 0,
				},
				firstRankInfo: {
					invite_id: "",
					name: "",
					num: 0,
					photo: "",
					rank: 0,
				},
				lastRankInfo: {
					invite_id: "",
					name: "",
					num: 0,
					photo: "",
					rank: 0,
				},
				inviteList: [],
				invitePage: 1,
				isMore: false,
				officialAccountLink: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5ODkwNzAwMg==#wechat_redirect',
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
				"openid",
				"userId",
				"messageSubscribe",
				"userLocationType"
			]),
		},
		watch: {
			
		},
		onTabItemTap (o) {
			// if(uni.hideTabBarRedDot) {
			// 	uni.hideTabBarRedDot({
			// 		index: 4
			// 	})	
			// }
		},
		async onLoad() {
			uni.$off("PAGE_me_REFRESH");
			uni.$on("PAGE_me_REFRESH", async () => {
				console.log('个人中心刷新')
				this.positionList = await this.$store.dispatch("getPosition")
				this.inviteBadge = await this.$store.dispatch("getInviteBadge")
				await this.getInviteBadgeInfo()
				this.getInfo()
				this.getRankInfo()
				this.getInviteList()
				this.setShareInfo()
			})
			uni.$off("PAGE_QRCODE_REFRESH");
			uni.$on("PAGE_QRCODE_REFRESH", async () => {
				console.log('刷新二维码')
				this.getGroupQrcode()
			})
			console.log('进入个人中心')
			// this.getInfo()
			// this.getAddress()
			
		},
		async onShow() {
			this.positionList = await this.$store.dispatch("getPosition")
			await this.getInviteBadgeInfo()
			if(!!this.openid) {				
				this.getInfo()
				this.getRankInfo()
				this.getInviteList()
				this.getGroupQrcode()
			}
			this.setShareInfo()
			console.log('userLocationType',this.userLocationType)
			console.log('------------')
			if(this.$store.getters.applyStatus != 1 && !!this.$store.getters.openid) {
				this.$store.dispatch("getUserDetails")
			}
		},
		methods: {
			getGroupQrcode() {
				apiGetGroupQrcode().then(res => {
					console.log('res___', res)
					let localMap = res
					if(this.userLocationType >= 0) {
						if(!!localMap[this.userLocationType]) {					
							// uni.showToast({
							// 	icon: 'none',
							// 	title: `当前处于${localMap[this.userLocationType]}`,
							// 	duration: 2000
							// })
							this.socialList[0].title = `${localMap[this.userLocationType].name}校友群`
							this.groupInfo = localMap[this.userLocationType]
						} else if(this.userLocationType == 0) {
							// uni.showToast({
							// 	icon: 'none',
							// 	title: `当前不在深圳市内`,
							// 	duration: 2000
							// })
							this.groupInfo = localMap[0]
						}
					} else {
						console.log('this.$store.state.user.home_area', this.$store.state.user.home_area)
						if(!!localMap[this.$store.state.user.home_area]) {
							this.socialList[0].title = `${localMap[this.$store.state.user.home_area].name}校友群`
							this.groupInfo = localMap[this.$store.state.user.home_area]
						} else {
							// uni.showToast({
							// 	icon: 'none',
							// 	title: `当前不在深圳市内`,
							// 	duration: 2000
							// })
							this.groupInfo = localMap[0]
						}
					}
				})
			},
			async getUserInfo() {
				console.log('获取用户授权信息')
				defaultLogin(true, true)
			},
			async getPhoneNumber(e) {
				console.log('getPhoneNumber', e)
				if (e.target.errMsg === 'getPhoneNumber:ok') {
					this.$store.commit("setPhoneCode", !!e.detail.code ? e.detail.code : "")
					defaultLogin(true, true)
				}
			},
			async getInviteBadgeInfo() {
				this.inviteBadgeList = []
				this.inviteBadge = await this.$store.dispatch("getInviteBadge")
				for(let key in this.inviteBadge) {
					this.inviteBadge[key].id = key
					this.inviteBadgeList.push(this.inviteBadge[key])
				}
			},
			getRankInfo() {
				apiGetRankList().then(res => {
					let canOpenNum = 0
					// 大于等于10人上榜
					if(!!res.my) {
						this.myRankInfo = res.my
					}
					this.firstRankInfo = res.first || null
					this.lastRankInfo = res.last || null
					
					// TODO:
					// this.firstRankInfo.num = 16
					// this.lastRankInfo.num = 5
					// this.myRankInfo.num = 1
					// this.myRankInfo.rank = 1
					// res.rank_list = []
					// res.rank_list[0].num = 20
					// res.rank_list[1].num = 6
					this.rankList = res.rank_list
					if(!!res.rank_list && res.rank_list.length >= 10) {
						res.rank_list.map(i => {
							if(i.num >= this.inviteBadgeList[0].num) {
								canOpenNum += 1
							}
						})
						if(canOpenNum >= 5) {
							this.openRank = 1
							this.handleInviteText()
						} else {
							this.openRank = 0
							this.handleInviteText()
						}
					} else {
						this.handleInviteText()
						this.openRank = 0
					}
				})
			},
			handleInviteText() {
				let nextLevelInfo = this.inviteBadgeList.find(i => {
					return i.num > this.myRankInfo.num
				})
				let list = this.rankList.filter(item => {
					return item.num > this.myRankInfo.num
				})
				
				if(list.length > 0) {
					let result = list.reduce((x, y) => x.num < y.num ? x : y)
					if(!!result) {
						this.inviteInfo.type = 1
						this.inviteInfo.num = result.num - this.myRankInfo.num + 1
						this.inviteInfo.name = result.name
						this.inviteInfo.rank = result.rank
					}
				} else { // 没有人邀请人数比他多
					if(!!nextLevelInfo) {
						this.inviteInfo.type = 2
						this.inviteInfo.num = nextLevelInfo.num - this.myRankInfo.num
						this.inviteInfo.rank = nextLevelInfo.rank
					} else {
						this.inviteInfo.type = 3
						this.inviteInfo.num = 0
						this.inviteInfo.rank = 1
					}
				}
				console.log('this.inviteInfo', this.inviteInfo)
				
			},
			closeJoinGroupPopup() {
				this.$refs.joinGroupPopup.close();
			},
			closeOfficialPopup() {
				this.$refs.officialPopup.close();
			},
			nextInviteList() {
				console.log('触底加载更多')
				if(!this.isMore){
					console.log("没有更多了")
					return
				}
				this.invitePage ++
				this.getInviteList('loadMore')
			},
			async getInviteList(type){
				await apiGetInviteList({
					page: this.invitePage,
					limit: 20,
				}).then(async res => {
					let _DATA = res.list.map(i => {
						let linkConnect = i.photo.indexOf("?") === -1 ? "?" : "&";
						i.photo = i.photo + linkConnect + "imageMogr2/thumbnail/128x128"
						return i
					})
					if(type == 'loadMore') {
						this.inviteList = [...this.inviteList, ..._DATA]
					} else {
						this.inviteList = _DATA
					}
					if(res.total > this.inviteList.length) {
						this.isMore = true
					} else {
						this.isMore = false
					}
				})
			},
			/* 获取手机号码 */
			changeBindPhone(e) {
				console.log('changeBindPhone', e)
				// if (e.target.errMsg === 'getPhoneNumber:ok') {
					
				// }
			},
			// 获取校友卡信息
			getInfo() {
				apiGetUserInfo().then(res => {
					this.boxItemShow = [];
					this.userBadgeList = [];
					this.meInfo = res;
					let _time = new Date(this.meInfo.audit_time).getTime()
					this.meInfo.audit_time_format = this.public.formatTime(_time, 'YYYY.MM');
					// console.log('audit_time', this.meInfo.audit_time, this.meInfo.audit_time_format)
					if(this.meInfo.status != 1) {
						this.boxItemShow = JSON.parse(JSON.stringify(this.boxItem));
						this.boxItemShow.splice(1,1)
					}else {
						this.boxItemShow = JSON.parse(JSON.stringify(this.boxItem));
					}
					if(!!this.positionList && !!this.positionList[this.meInfo.position]) {
						this.minePosition = this.positionList[this.meInfo.position]
						let _this = this;
						uni.getImageInfo({
							src: _this.minePosition.card_img,
							success (res) {
								console.log('res____', res)
								_this.levelWidth = res.width;
								_this.levelHeight = res.height;
								_this.levelPath = res.path;
							}
						})
					}
					if(this.meInfo.business_status == -1) {
						this.boxItem[2].showImproved = 1
						this.boxItemShow = JSON.parse(JSON.stringify(this.boxItem));
					}
					if(this.meInfo.material_status == -1) {
						this.boxItem[3].showImproved = 1
						this.boxItemShow = JSON.parse(JSON.stringify(this.boxItem));
					}
					// this.meInfo.badge_list = ["1", "2", "3", "4", "5", "6"]
					console.log('this.inviteBadge', this.inviteBadge)
					if(!!this.meInfo.badge_list && this.meInfo.badge_list.length > 0) {
						this.meInfo.badge_list.map(i => {
							if(!!this.inviteBadge[i] && !!this.inviteBadge[i].image) {
								this.userBadgeList.push(this.inviteBadge[i].image)
							}
						})
						this.meInfo.highestLevelBadge = this.userBadgeList[this.userBadgeList.length - 1]
					} else {
						this.userBadgeList = []
					}
					console.log('this.userBadgeList', this.userBadgeList)
					// this.meInfo.introduction = 'aa厚德载物aaaaa11aa，海纳aaaaaaaaaa'
					this.meInfo.introductionText = ''
					if(!!this.meInfo.introduction) {
						this.meInfo.introductionText = this.meInfo.introduction.length > 20 ? this.meInfo.introduction.slice(0, 20) + '...' : this.meInfo.introduction
					} else {
						this.meInfo.introductionText = '厚德载物，海纳百川'
					}
					this.$nextTick(() => {
						console.log('this.meInfo.status-------------',this.meInfo.status)
						if(this.meInfo.status == 1) {
							this.drawPic()
						}
					})
				})
			},
			setShareInfo() {
				if(!!this.openid) {
					const userInfo = uni.getStorageSync("userInfo")
					this.shareData = {
						pic: this.sharePic,
						title: `${!!userInfo.name ? userInfo.name : '深圳大学校友'}邀请你加入深大会，点击填写你的个人信息`,
						linkUrl: `/pages/sharePage/main?type=2&inviteId=${this.userId}`,
					};
				} else {
					this.shareData = {
						pic: this.sharePic,
						title: `校友们，点开加入我们的深大会吧～成员陆续加入中，当前已有${this.$store.state.userNum}人`,
						linkUrl: '/pages/home/main',
					}
				}
				console.log('shareData', this.shareData)
			},
			socialTap(type) {
				if(type == 'alumniGroup') {
					this.$refs.joinGroupPopup.open()
				} else {
					this.$refs.officialPopup.open()
					// this.public.pageJump(this.officialAccountLink)
				}
			},
			jumpPage(item) {
				if(item.link.indexOf('message') != -1) {
					if(!this.messageSubscribe) {
						console.log('跳转我的消息')
						this.$store.commit("setMessageSubscribe", true);
						this.messageRemind(item.link)
						return
					}
				}
				this.public.pageJump(item.link)
			},
			messageRemind(link) {
				// 无感知订阅，不提示
				let _this = this;
				if(this.public.compareVersion(this.$store.getters.systemInfo.SDKVersion, "2.8.4") > 0) {
					let tmplIds = ["AhOFDO_Ik7bMch2mDnxBpix1-s6wceUNLPhJzUMSKt4", "3cEVA-rw4KOD9MkqPo4sMx0chT7j7hDMRA5M1ZfxxlI"];
					wx.requestSubscribeMessage({
						tmplIds: tmplIds,
						success (res) {
							console.log('订阅成功')
							_this.public.pageJump(link)
						},
						fail (err) {  
							// uni.showToast({
							// 	icon: 'none',
							// 	title: '订阅失败',
							// 	duration: 2000
							// })
							console.log('订阅失败1', err)
							_this.public.pageJump(link)
						}
					})
				} else {
					// 提示版本过低，无法订阅消息
					// uni.showToast({
					// 	icon: 'none',
					// 	title: '当前版本过低，无法使用该功能，请升级到最新版本后重试。',
					// 	duration: 2000
					// })
					console.log('订阅失败2')
					_this.public.pageJump(link)
				}
			},
			async applyMember(){
				await this.$store.dispatch("getUserDetails")
				if(this.$store.state.user.status == -1) {
					this.public.pageJump("/otherPackage/pages/applyMember/userInfo")
				}else if(this.$store.state.user.status != 1) {
					this.public.pageJump("/pages/me/joinData")
				}
			},
			// 下载文件(临时放到本地)
			downloadFile (url) {
				return new Promise ((resolve, reject) => {
					uni.downloadFile({
						url,
						success (res) {
							// console.log(res,'res.tempFilePath')
							// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
							if (res.statusCode === 200) {
								
								resolve(res.tempFilePath)
							}else {
								// reject()
								resolve()
							}
						},
						fail (err) {
							reject(err)
						}
					})
				})
			},
			// 绘制文字自动换行方法
			wrapText(ctx,text, x, y, maxWidth, lineHeight, interrupt) {
				if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
					return;
				}
				// 字符分隔为数组
				var arrText = text.split('');
				var line = '';
				console.log('arrText.length',arrText.length);
				for (var n = 0; n < arrText.length; n++) {
					var testLine = line + arrText[n];
					var metrics = ctx.measureText(testLine);
					var testWidth = metrics.width;
					if (testWidth > maxWidth && n > 0) {
						if(!!interrupt) {
							ctx.fillText(line + '...', x, y);
						}else {
							ctx.fillText(line, x, y);
						}
						line = arrText[n];
						y += lineHeight;
						if(!!interrupt) {
							return
						}
					} else {
						line = testLine;
					}
				}
				ctx.fillText(line, x, y);
			},
			async drawPic() {
				let promiseArr = [
					await this.downloadFile(this.meInfo.photo ? this.meInfo.photo + "?imageMogr2/thumbnail/!360" : ''),
					await this.downloadFile(this.meInfo.qrcode || ''),
				]
				let [photo,qrcode] = promiseArr
				// let badgeImg = []
				// if(this.userBadgeList.length > 0) {
				// 	for(let i = 0; i < this.userBadgeList.length; i++) {
				// 		badgeImg.push(await this.downloadFile(this.userBadgeList[i]))
				// 	}
				// }
				let that = this;
				const ctx = uni.createCanvasContext('drawCard')
				let widths = ctx.width;
				let heights  = ctx.height;
				if(this.minePosition.level == 2) {
					ctx.drawImage('../../static/newImage/me/sd_sy_fenxiang_kp2.png', 0, 0, 313, 430);
				}else if (this.minePosition.level == 3) {
					ctx.drawImage('../../static/newImage/me/sd_sy_fenxiang_kp1.png', 0, 0, 313, 430);
				}else {
					ctx.drawImage('../../static/newImage/me/sd_sy_fenxiang_kp3.png', 0, 0, 313, 430);
				}
				ctx.font = "normal 10px PingFangSC-Regular";
				ctx.fillStyle = "#010101"
				ctx.fillText('Name', 34, 223);
				ctx.font = "bold 14px  PingFangSC-Regular";
				this.wrapText(ctx,this.meInfo.name, 34, 243, 200, 17,true);
				let nameWidth = ctx.measureText(this.meInfo.name+'').width
				if(nameWidth >= 145) {
					nameWidth = 153
				}
				let levelWidth = [36,68,93,56,82,82,103]
				let levelScale = 18 / this.levelHeight 
				ctx.drawImage(this.levelPath, nameWidth + 43, 229, this.levelWidth * levelScale, 18);
				// 专业
				ctx.font = "normal 10px PingFangSC-Regular";
				ctx.fillText('Major', 34, 275);
				ctx.font = "normal 14px PingFangSC-Regular";
				if(!!this.meInfo.college && this.meInfo.college != '未知') {
					this.wrapText(ctx,this.meInfo.school_year + '级' + this.meInfo.college + '-' + this.meInfo.major, 34, 296,257, 16, false);
				} else {
					this.wrapText(ctx,this.meInfo.school_year + '级' + '-' + this.meInfo.major, 34, 296,257, 16, false);
				}
				// 个人简介
				ctx.font = "normal 10px PingFangSC-Regular";
				ctx.fillText('Signature', 34, 325);
				ctx.font = "normal 14px PingFangSC-Regular";
				// let introductionText = !!this.meInfo.introduction ? this.meInfo.introduction.slice(0, 20) + '...' : '厚德载物，海纳百川'
				this.wrapText(ctx, this.meInfo.introductionText, 34, 346, 160, 16, false);
				// this.wrapText(ctx,this.meInfo.school_year + this.meInfo.college + '-' + this.meInfo.major, 34, 299,257, 16, false);
				ctx.font = "normal 10px PingFangSC-Regular";
				ctx.fillText('入会时间：' + this.meInfo.audit_time_format, 38, 413);
				if(!!photo) {
					let photoInfo = await this.public.getImageInfo(photo)
					let imgRect = this.public.coverImg(96,96,photoInfo.width,photoInfo.height);
					// ctx.drawImage(photo, imgRect.sx, imgRect.sy, imgRect.sWidth, imgRect.sHeight, 33, 86, 86, 86);
					this.circleImgTwo(ctx,photo,imgRect.sx, imgRect.sy, imgRect.sWidth, imgRect.sHeight, 34, 96, 96, 96, 5)
					// let imgRect = this.public.containImg(33, 86, 86, 86,photoInfo.width,photoInfo.height);
					// ctx.drawImage(photo, imgRect.dx, imgRect.dy, imgRect.dWidth, imgRect.dHeight);
					// ctx.drawImage(photo, 33, 86, 86, 86);
				}else {
					this.circleImgTwo(ctx,'../../static/newImage/blank/default_avatar.png', null, null, null, null, 34, 96, 96, 96, 5)
					// ctx.drawImage('../../static/newImage/blank/default_avatar.png', 33, 86, 86, 86);
				}
				// if(!!badgeImg && badgeImg.length > 0){
				// 	for(let i = 0; i < badgeImg.length; i++) {
				// 		if(i <= 3) {
				// 			ctx.drawImage(badgeImg[i], 34 + 40 * i, 306, 31, 31);
				// 		} else {
				// 			ctx.drawImage(badgeImg[i], 34 + 40 * (i - 4), 306 + 41, 31, 31);
				// 		}
				// 	}
				// }
				if(!!qrcode) {
					this.circleImgTwo(ctx, qrcode,null, null, null, null, 204, 326, 76 ,76, 5)
				}
				ctx.draw(true,res => {
					uni.canvasToTempFilePath({
						canvasId: 'drawCard',
						quality: 1,
						x: 0,
						y: 0,// width: 626,
						// height: 856,
						// destWidth: 626,
						// destHeight: 856,
						
						// fileType: "png",
						  
						success: function(res) {
							// 在H5平台下，tempFilePath 为 base64
							that.isDrawPicing = res.tempFilePath;
							// that.showDemo = true
							console.log('isDrawPicing+++++++++',that.isDrawPicing)
						} ,
						fail: function(res) {
							console.log('fail',res)
						},
					})
				});
			},
			circleImgTwo(ctx, img, sx, sy, sw, sh, x, y, w, h, r) {
				ctx.save()
			    // 画一个图形
			    if (w < 2 * r) r = w / 2;
			    if (h < 2 * r) r = h / 2;
			    ctx.beginPath();
			    ctx.moveTo(x + r, y);
			    ctx.arcTo(x + w, y, x + w, y + h, r);
			    ctx.arcTo(x + w, y + h, x, y + h, r);
			    ctx.arcTo(x, y + h, x, y, r);
			    ctx.arcTo(x, y, x + w, y, r);
			    ctx.closePath();
			    ctx.strokeStyle = '#FFFFFF'; // 设置绘制圆形边框的颜色
			    ctx.stroke();
			    ctx.clip();
				if(!!sx && !!sy && !!sw && !!sh){
					ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
				}else{
					ctx.drawImage(img, x, y, w, h);
				}
				ctx.restore()
			},
			saveBtn() {
				if (!this.isDrawPicing) {
					uni.showToast({
						title: "图片合成中",
						icon: "none",
						duration: 2000
					})
					return
				}
				let that = this
				uni.showLoading({
					title: "保存中...",
				})
				uni.saveImageToPhotosAlbum({
					filePath: that.isDrawPicing,
					success(res) {
						uni.hideLoading()
						uni.showToast({
							title: "保存成功",
							icon: "success",
							duration: 2000
						})
					},
					fail(err) {
						uni.hideLoading()
						if(/auth/.test(err.errMsg)) {
							// 前往授权
							uni.showToast({
								title: "请前往授权",
								icon: "none",
								duration: 2000
							});
						} else {
							uni.showToast({
								title: "保存失败",
								icon: "none",
								duration: 2000
							});
						}
					}
				});
			},
			badgeSwitch(id,status){
				apiBadgeSwitch({openid:this.openid,level:id,status}).then(res=>{
					if(status == 1){
						uni.showToast({
							title: "已启用",
							icon: "none"
						});
					}else{
						uni.showToast({
							title: "已禁用",
							icon: "none"
						});
					}
					this.getInfo()
				})
			},
			getAddress() {
				console.log('获取位置信息')
				let that = this
				wx.getLocation({
					type: 'gcj02', //返回可以用于 wx.openLocation 的经纬度
					success (res) {
						console.log('res', res)
						const latitude = res.latitude
						const longitude = res.longitude
						uni.showToast({
							icon: "none",
							title: "授权成功",
							duration: 2000
						})
					},
					fail (err) {
						console.log('授权失败', err)
						if(err.errMsg == 'getLocation:fail:system permission denied') {
							uni.showToast({
								icon: "none",
								title: "系统授权未开启",
								duration: 2000
							})
						} else if(err.errMsg == 'getLocation:fail auth deny') {
							// uni.showToast({
							// 	icon: "none",
							// 	title: "取消授权",
							// 	duration: 2000
							// })
							that.getSetting()
						} else {							
							uni.showToast({
								icon: "none",
								title: "授权失败",
								duration: 2000
							})
						}
					},
				})
			},
			getSetting(item) {
				uni.getSetting({
					success: res => {
						console.log('用户权限列表:', res.authSetting)
						if (res.authSetting['scope.userLocation']) {
							console.log('已授权userLocation')
							// 选择位置信息
							this.getAddress()// 重新调取uni.getLocation
						} else {
							console.log('用户未授权userLocation')
							//2.用户第一次进来发起授权
							uni.showModal({
								title: '提示',
								content: '当前定位未开启，请点击确定手动开启定位',
								duration: 3000,
								success: (res) => {
									if (res.confirm) {
									   this.openSetting()//点击确定引导客户开启定位
									} else if (res.cancel) {
										uni.showToast({
											title: '你拒绝了授权，无法获取当前定位信息',
											duration: 2000,
											icon: "none"
										});
									}
								}
							});
						}
					}
				})
			},
			openSetting() {
				uni.openSetting({
					success: (res) => {
						if (res.authSetting['scope.userLocation']) {
							// 5.用户在设置中点击了允许，调用选择位置信息函数
							 this.getAddress()// 重新调取uni.getLocation
						} else {
							// 5.用户在设置中点击了不允许，展示拒绝授权信息
							uni.showToast({
								title: '你拒绝了授权，无法操作内容',
								icon: "none",
								duration: 3000,
							})
						}
					},
					fail: (err) => {
						console.log("打开设置失败", err)
					}
				})
			},
			jumpAddress() {
				wx.openLocation({
					 latitude: 23.08845,
					 longitude: 113.29797,
					 scale: 18
				})
			},
			phoneCall() {
				uni.makePhoneCall({
					phoneNumber: '13162159154' //仅为示例
				});
			},
			selectImage() {
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						console.log('res__:', res)
						// return
						const networkType = await getNetworkType()
						if (networkType === 0) {
							uni.showToast({
								title: '当前网络异常，请检查网络',
								icon: 'none'
							})
							return
						}
						uni.showLoading({
							title: "图片上传中..."
						})
						try {
							let upload = {}
							upload = await this.uploadFunc(res.tempFilePaths[0])
							this.userAvatar = upload.imageURL
							uni.hideLoading();
						} catch(e) {
							uni.hideLoading();
							uni.showToast({
								title: '添加失败,请重试',
								icon: 'none'
							})
						}
					}
				})
			},
			async uploadFunc(file) {
				let fileInfo = await this.public.getImageInfo(file)
				return new Promise(async (resolve, reject) => {
					const fileName = `photo${this.public.uuid()}`
					let data
					try {
						data = await getQiniuToken({
							bucket: "imeach",
							type: "PhotoServlet",
							ext: fileInfo.type,
						})
					} catch(e) {
						console.log("e___", e)
						return
					}
					
					qiniuUploader.upload(file, (res) => {
						// 上传成功
						resolve(res)
					}, (error) => {
						// 失败
						reject(error)
					}, {
						region: 'ECN',
						domain: 'https://duimianimg.loovee.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
						key: 'MediaServerMblove/servlet/Proxy/PhotoServlet/' + fileName, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
						uptoken: data.token,
					})
				})
			},
			
		},
		
		// 分享数据
		onShareAppMessage() {
			// var shareObj = {
			// 	title: `校友们，点开加入我们的深大会吧～成员陆续加入中，当前已有${this.$store.state.userNum}人`,    // 默认是小程序的名称(可以写slogan等)
			// 	path: '/pages/home/main',    // 默认是当前页面，必须是以‘/'开头的完整路径
			// 	imageUrl: '',   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
			// };
			return this.public.baseShareData(
				this.shareData.title,
				this.public.shareLinkAddBrandId(this.shareData.linkUrl),
				this.shareData.pic
			);
		},
		onHide() {},
		onPullDownRefresh() {},
		onUnload() {}
	}
</script>

<style lang="less" scoped>
	@import "./main.less";
	.test-btn {
		width: 200rpx;
		height: 76rpx;
		line-height: 76rpx;
		text-align: center;
		border-radius: 16rpx;
		margin: 0 16rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		background-color: #0E0F12;
		
		margin-bottom: 12rpx;
		&-login {
			position: fixed;
			top: 0;
		}
	}
	.user-avatar {
		// width: 100rpx;
		// height: 100rpx;
	}
	.box {
		width: 300rpx;
		height: 300rpx;
		background-color: #6f71ff;
		.pic {
			width: 300rpx;
			height: 200rpx;
			background-color: pink;
		}
		.child {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			width: fit-content;
			margin: 26rpx auto 0;
			font-size: 24rpx;
			color: #0E0F12;
			background: #FFFFFF;
			min-width: 208rpx;
			// width: 208rpx;
			border-radius: 24px;
			height: 48rpx;
			padding: 0 10rpx;
			.icon {
				width: 30rpx;
				height: 30rpx;
				
				flex-shrink: 0;
			}
			.text {
				// width: 30rpx;
				// height: 30rpx;
				
			}
		}
	}
</style>
