<template>
	<view class="school-fellow-details">
		<view class="info-box">
			<view class="info-content">				
				<view class="user-avatar">
					<image :src="userAvatar" mode="aspectFill" @error="imageError"></image>
				</view>
				<view class="user-info">
					<view class="user-info-name">
						{{ studentInfo.name }}
					</view>
					<view class="user-info-medal">
						<view v-if="!!studentInfo.positionInfo && !!studentInfo.positionInfo.card_img" :class="[`user-info-label`]">
							<image :src="studentInfo.positionInfo.card_img" mode="heightFix"></image>
						</view>
						<!-- <view v-if="!!studentBadgeList && studentBadgeList.length > 0" :class="[`user-info-badge`]">
							<image v-for="(item, index) in studentBadgeList" :key="index" :src="item" mode="heightFix"></image>
						</view> -->
					</view>
					<view class="user-info-other">
						<view class="school-major">
							{{ !!studentInfo.school_year ? studentInfo.school_year + '级' : '' }}<text v-if=" !!studentInfo.school_year">·</text>
							<template v-if="!!studentInfo.college && studentInfo.college != '未知'">{{ studentInfo.college }}<text>·</text></template>
							{{ studentInfo.major }}
						</view>
						<view class="company-position" v-if="!!studentInfo.business_name && !!studentInfo.business_position">
							{{ studentInfo.business_name }}{{studentInfo.business_position}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="job-description-box" v-if="!!studentInfo.business">
			<view class="job-description-title">
				<view class="job-description-text">公司信息</view>
			</view>
			<view class="job-description-content" @tap="pageJump(`/otherPackage/pages/company/companyDetails?enterprise_id=${studentInfo.business.enterprise_id}`)">
				<view class="job-description-info">
					<view class="company-photo">
						<image v-if="!!studentInfo.business.cover_img" :src="studentInfo.business.cover_img" mode="aspectFill"></image>
						<image v-else src="../../static/sdh_mp_icon_gsxx.png" mode="aspectFill" @error="imageError"></image>
					</view>
					<view class="company-info">
						<view class="company-info-name" v-if="!!studentInfo.business.name">
							{{ studentInfo.business.name }}
						</view>
						<view class="company-info-address" v-if="!!studentInfo.business.address">
							<image class="address-icon" src="../../static/address_icon.png" mode=""></image>
							{{ studentInfo.business.address }}
						</view>
					</view>
				</view>
				<view class="job-description-more">
					<view class="more-title">公司介绍</view>
					<view class="more-icon"></view>
				</view>
			</view>
		</view>
		<view class="my-site-box" v-if="!!studentInfo.site && studentInfo.site.length > 0">
			<view class="my-site-title">
				<view class="my-site-text">我的场地</view>
			</view>
			<view class="my-site-content" v-for="(item, index) in studentInfo.site" :key="item.id" @tap="pageJump(`/otherPackage/pages/siteInfo/detail?site_id=${item.id}`)">
				<view class="my-site-info">
					<view class="site-photo">
						<!-- <image src="../../static/sdh_mp_icon_wdcd.png" mode="aspectFill" @error="imageError"></image> -->
						<image :src="item.cover_img" mode="aspectFill" @error="imageError"></image>
					</view>
					<view class="site-info">
						<view class="site-info-name" v-if="!!item.title">
							{{ item.title }}
						</view>
						<view class="site-info-discount" v-if="!!item.discount && Number(item.discount) > 0">
							校友 {{ item.discount }}折
						</view>
					</view>
				</view>
				<view class="my-site-address" v-if="!!item.address">
					<image class="my-site-icon" src="../../static/address_icon.png" mode=""></image>
					{{ item.address }}
				</view>
				<view class="my-site-more-icon"></view>
			</view>
		</view>
		<view class="my-club-box" v-if="!!studentInfo.club && studentInfo.club.length > 0">
			<view class="my-club-title">
				<view class="my-club-text">我的俱乐部</view>
			</view>
			<view class="my-club-content" v-for="(item, index) in studentInfo.club" :key="item.id" @tap="pageJump(`/otherPackage/pages/club/clubDetails?club_id=${item.id}`)">
				<view class="my-club-info">
					<view class="club-photo">
						<!-- <image src="../../static/sdh_mp_icon_wdjlb.png" mode="aspectFill" @error="imageError"></image> -->
						<image :src="item.cover_img" mode="aspectFill" @error="imageError"></image>
					</view>
					<view class="club-info">
						<view class="club-info-name" v-if="!!item.title">
							{{ item.title }}
						</view>
						<view class="club-info-message">
							欢迎大家加入
						</view>
					</view>
				</view>
				<view class="my-club-more-icon"></view>
			</view>
		</view>
		<view class="contact-box">
			<view class="contact-title">
				<view class="contact-text">联系信息</view>
			</view>
			<view class="contact-content">
				<view class="contact-other">
					<view class="contact-phone">
						<image class="contact-icon" src="../../static/round_phone_icon.png" mode=""></image>
						******
					</view>
					<view class="contact-wechat">
						<image class="contact-icon" src="../../static/round_weixin_icon.png" mode=""></image>
						******
					</view>
				</view>
				<view class="contact-address" v-if="!!studentInfo.home_address">
					<image class="contact-icon" src="../../static/round_address_icon.png" mode=""></image>
					{{ studentInfo.home_address }}
				</view>
			</view>
		</view>
		<view class="profile-box">
			<view class="profile-title">
				<view class="profile-text">个人简介</view>
			</view>
			<view class="profile-content">
				{{ studentInfo.introduction ? studentInfo.introduction : '这个校友很懒，还没有填写个人简介~' }}
			</view>
		</view>
		<view class="hobby-box">
			<view class="hobby-title">
				<view class="hobby-text">兴趣爱好</view>
			</view>
			<view class="hobby-content">
				{{ studentInfo.hobbies ? studentInfo.hobbies : '这个校友很懒，还没有填写兴趣爱好~' }}
			</view>
		</view>
		<view class="footer-box" v-if="userId == studentInfo.id">
			<view class="footer-box-btn footer-box-black footer-box-long">
				<button open-type="share" class="footer-box-share"></button>
				分享名片
			</view>
		</view>
		<view class="footer-box" v-else>
			<view class="footer-box-btn footer-box-gray">
				<button open-type="share" class="footer-box-share"></button>
				分享名片
			</view>
			<view class="footer-box-btn footer-box-black" @tap="getContactInfo">获取联系方式</view>
		</view>
		<uni-popup ref="popupShare" type="center" :mask-click="false">
			<view class="popup-box">
				<view class="popup-title">这位同学，你找我做什么呢？</view>
				<view class="popup-content">
					<textarea 
						v-if="showText"
						class="popup-content-textarea"
						v-model="contactInfo"
						type="text" 
						maxlength="50"
						placeholder="请输入50个字以内的理由，这样可以更快的获取得到对方的联系方式。" 
						placeholder-style="font-size: 24rpx;color: #CACACA;font-weight: 500;"
						>
					</textarea>
				</view>
				<view class="popup-footer">
					<view class="popup-footer-btn popup-footer-border" @tap="cancelSend">取消</view>
					<view class="popup-footer-btn popup-footer-bg" @tap="confirmSend">发送</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 游客授权弹窗 -->
		<sightseer-model :show.sync="userLoginIn"></sightseer-model>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import { pageJump } from "@/utils/index.js"
	import { apiSchoolFellowDetails, apiGetWxMessage } from "@/api/schoolFellow.js"
	
	export default {
		name: "home",
		data() {
			return {
				studentId: "",
				defaultAvatar: "",
				studentInfo: {
					audit_time: "",
					business_address: "",
					business_detailed: "",
					business_name: "",
					business_position: "",
					college: "",
					hobbies: "",
					badge:"",
					home_address: "",
					id: "",
					industry: "",
					major: "",
					name: "",
					photo: "",
					position: "",
					position_name: "",
					school_year: "",
					social_position: "",
				},
				studentBadgeList: [],
				contactInfo: "",
				inviteBadge:{},
				showText: false,
				shareData: {
					pic: "",
					title: "",
					linkUrl: ""
				},
				pageJump,
				userLoginIn: false,		// 游客弹窗
			}
		},
		computed: {
			...mapGetters([ "isSightseer", "userId"]),
			userAvatar() {
				if(!!this.defaultAvatar) {
					return this.defaultAvatar
				} else {
					return this.studentInfo.photo
				}
			},
		},
		async onLoad(option) {
			console.log('进入校友详情', option)
			if(!!option.studentId) {
				this.studentId = option.studentId
			}
			!!option.inviteId ? this.$store.commit("setInvitor", option.inviteId) : this.$store.commit("setInvitor", "");
			uni.$off("PAGE_schoolFellowDetails_REFRESH");
			uni.$on("PAGE_schoolFellowDetails_REFRESH", () => {
				this.getStudentDetails();
			})
			this.inviteBadge = await this.$store.dispatch("getInviteBadge")
			await this.getStudentDetails()
		},
		async onShow() {
		},
		onHide() {},
		methods: {
			async getStudentDetails(type){
				this.studentBadgeList = []
				await apiSchoolFellowDetails({
					student_id: this.studentId,
				}).then(async res => {
					console.log("获取校友详情数据",res)
					let membershipLevel = await this.$store.dispatch("getPosition")
					console.log('membershipLevel', membershipLevel)
					res.positionInfo = membershipLevel[res.position]
					console.log('res.positionInfo', res.positionInfo)
					this.studentInfo = res
					this.shareData = {
						pic: "",
						title: this.studentInfo.name + '的名片',
						linkUrl: `/schoolFellowPackage/pages/schoolFellowDetails/main?studentId=${this.studentInfo.id}&inviteId=${this.userId}`
					}
					// this.studentInfo.badge_list = ["1", "2", "3", "4", "5", "6"]
					if(!!this.studentInfo.badge_list && this.studentInfo.badge_list.length > 0) {
						this.studentInfo.badge_list.map(i => {
							if(!!this.inviteBadge[i] && !!this.inviteBadge[i].image) {
								this.studentBadgeList.push(this.inviteBadge[i].image)
							}
						})
					} else {
						this.studentBadgeList = []
					}
					this.public.setTitle(this.studentInfo.name + '的名片');
					console.log('shareData', this.shareData)
				})
			},
			imageError(e) {
				this.defaultAvatar = "../../../static/newImage/blank/default_avatar.png"
			},
			getContactInfo() {
				if(this.isSightseer == 1) {
					this.userLoginIn = true;
					return;
				}
				this.$refs.popupShare.open();
				setTimeout(() => {
					this.showText = true
				}, 50)
			},
			cancelSend() {
				this.$refs.popupShare.close();
				this.showText = false
				this.contactInfo = ""
			},
			async confirmSend() {
				if(this.contactInfo.length <= 0) {
					uni.showToast({
						title: "请填写联系理由",
						icon: "none",
						duration: 2000
					})
					return
				}
				let _this = this;
				if(this.public.compareVersion(this.$store.getters.systemInfo.SDKVersion, "2.8.4") > 0) {
					let tmplIds = ["kcb0gVm4m64HRib9X_l3QqHVEf6MPVyJXQYKOCAmWj8"];
					wx.requestSubscribeMessage({
						tmplIds: tmplIds,
						success (res) {
							tmplIds.forEach(e => {
								if (res[e] === "accept") {
									uni.showToast({
										title: "订阅成功",
										icon: "none",
										duration: 2000
									});
								} else {
									uni.showToast({
										title: "取消订阅",
										icon: "none",
										duration: 2000
									});
								}
							})
							_this.sendMessage()
						},
						fail (err) {  
							uni.showToast({
								icon: 'none',
								title: '订阅失败',
								duration: 2000
							})
							_this.sendMessage()
						}
					})
				} else {
					// 提示版本过低，无法订阅消息
					uni.showToast({
						icon: 'none',
						title: '当前版本过低，无法使用该功能，请升级到最新版本后重试。',
						duration: 2000
					})
					_this.sendMessage()
				}
			},
			async sendMessage() {
				await apiGetWxMessage({
					member_id: this.studentInfo.id,
					content: this.contactInfo,
				}).then(res => {
					uni.showToast({
						title: "发送成功，等待对方回复",
						icon: "none",
						duration: 2000
					})
					this.$refs.popupShare.close();
					this.showText = false
					this.contactInfo = ""
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: "none",
						duration: 2000
					})
				})
			}
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
	@import "./main.less";
</style>
