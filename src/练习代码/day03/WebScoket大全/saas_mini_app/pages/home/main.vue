<template>
	<view class="home-box">
		<view class="title-text" :class="[titleColor ? 'white' : '']" :style="{'padding-top':navTitleTop + 17 + 'rpx'}">深大会</view>
		
		<view class="home-scroll" :style="{'margin-top':navTitleTop + 44 + 17 + 34 + 'rpx'}">
			<!-- icon -->
			<home-bar :iconlist="icon"></home-bar>
			
			<!-- banner -->
			<home-banner :banner="banner"></home-banner>
			
			<!-- 校友风采 -->
			<home-lead></home-lead>
			
			<!-- 校友企业 -->
			<home-company></home-company>
			
			<!-- 专题 -->
			<home-topic :topic="topic"></home-topic>
			
			<!-- 活动(2.7先注释等xyy对接完再调) -->
			<!-- <home-act :actList="5"></home-act> -->
			
			<!-- 校友场地 -->
			<home-site :site_class="site_class"></home-site>
			
			<!-- 俱乐部 -->
			<home-club></home-club>
			
			<!-- 资讯内容 -->
			<home-news @seeMore="openOfficialPopup"></home-news>
		</view>
		
		<!-- 会员入口 -->
		<member-banner></member-banner>
		
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
		
		<!-- 游客授权弹窗 -->
		<sightseer-model :show.sync="userLoginIn"></sightseer-model>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import { apiHomeGetIndex } from "@/api/home.js"
	import { sharePic } from '@/utils/base.js'
	import homeBar from "@/componentsLib/home/homeBar.vue"
	import homeBanner from "@/componentsLib/home/homeBanner.vue"
	import homeLead from "@/componentsLib/home/homeLead.vue"
	import homeCompany from "@/componentsLib/home/homeCompany.vue"
	import homeTopic from "@/componentsLib/home/homeTopic.vue"
	// import homeAct from "@/componentsLib/home/homeAct.vue"
	import homeSite from "@/componentsLib/home/homeSite.vue"
	import homeClub from "@/componentsLib/home/homeClub.vue"
	import homeNews from "@/componentsLib/home/homeNews.vue"
	import memberBanner from "@/componentsLib/home/memberBanner.vue"
	
	export default {
		name: "home",
		components: {
			homeBar,
			homeBanner,
			homeLead,
			homeCompany,
			homeTopic,
			// homeAct,
			homeSite,
			homeClub,
			homeNews,
			memberBanner,
		},
		data() {
			return {
				icon: [], 					// icon列表
				banner: [], 				// banner列表
				topic: [], 					// 专题列表
				site_class: [], 			// 场地分类
				navTitleTop: global.navTitleTopRpx || 0,
				isPullDownRefresh: false,	// 下拉刷新
				canRefresher: true,	// 是否可以下拉刷新
				titleColor: 0, // 标题颜色 1黑0白
				sharePic,
				userLoginIn: false,		// 游客弹窗
			}
		},
		computed: {
			...mapGetters([ "isSightseer"]),
		},
		async onLoad(option) {
			uni.$off("OPEN_SIGHTSEER_POPUP")
			uni.$on("OPEN_SIGHTSEER_POPUP",() => {
				if(this.isSightseer == 1) {
					this.userLoginIn = true;
				}
			})
			uni.$off("PAGE_home_REFRESH")
			uni.$on("PAGE_home_REFRESH",() => {
				this.getHomeIndex()
			})
			console.log('进入首页')
			await this.getHomeIndex()
		},
		async onShow() {
			console.log('首页显示')
			if(this.$store.getters.applyStatus != 1 && !!this.$store.getters.openid) {
				this.$store.dispatch("getUserDetails")
			}
		},
		onHide() {},
		methods: {
			// 获取首页数据
			async getHomeIndex(){
				await apiHomeGetIndex()
					.then(res => {
						console.log("获取首页数据",res)
						this.icon = res.icon
						// this.icon = [...res.icon, ...res.icon]
						this.banner = res.banner
						this.topic = res.topic
						this.site_class = res.site_class
						this.$nextTick(()=>{
							console.log("SEND_SITE_ID______________")
							uni.$emit("SEND_SITE_ID",this.site_class[0] ? this.site_class[0].id : -1)
						})
						
						this.$store.state.userNum = res.total_member
					})
			},
			onRefresh(){
				if(!this.isPullDownRefresh) {
					this.isPullDownRefresh = true;
					this.getHomeIndex()
					this.isPullDownRefresh = false;
				}
			},
			getMoreNews(){
				console.log("加载更多资讯")
				uni.$emit("NEXT_NEWS")
			},
			openOfficialPopup() {
				this.$refs.officialPopup.open()
			},
			closeOfficialPopup() {
				this.$refs.officialPopup.close()
			}
		},
		// 分享数据
		onShareAppMessage(event) {
		  // 设置菜单中的转发按钮触发转发事件时的转发内容
		  var shareObj = {
			title: `校友们，点开加入我们的深大会吧～成员陆续加入中，当前已有${this.$store.state.userNum}人`,    // 默认是小程序的名称(可以写slogan等)
			path: '/pages/home/main',    // 默认是当前页面，必须是以‘/'开头的完整路径
			imageUrl: this.sharePic,   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
		  };
		  // 返回shareObj
		  return shareObj;
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			this.onRefresh()
			uni.stopPullDownRefresh();
		},
		// 上拉加载更多
		onReachBottom() {
			console.log("onReachBottom")
			this.getMoreNews()
		},
		// 分享朋友圈
		onShareTimeline() {
			return this.public.baseShareWechatMomentsData({})
		},
		onPageScroll(e) {
			this.titleColor = e.scrollTop >= 35 ? 1 : 0
		},
		onUnload() {}
	}
</script>

<style lang="less" scoped>
	@import "./main.less";
</style>
