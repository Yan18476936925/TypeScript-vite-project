<template>
	<view class="school-fellow-List">
		<view class="search-box">
			<view class="search-base">				
				<view class="screen-btn" @tap="showScreen = true;screenType = 'all'">
					<image class="screen-icon" src="../../static/screen_icon.png" mode=""></image>
					筛选
				</view>
				<view class="search-bg">				
					<image class="search-icon" src="../../static/search_icon.png" mode=""></image>
					<input type="text"
						class="search-input"
						value=""
						v-model="name"
						confirm-type="search"
						:focus="isFocus"
						placeholder="输入ta名字搜一搜" 
						placeholder-style="font-size: 24rpx;color: #B9BDC3;letter-spacing: 0;"
						@confirm="confirmSearch"
					/>
				</view>
				<view class="search-btn" @tap="getFellowList">搜索</view>
			</view>
			<view class="search-other">
				<view :class="['search-other-item', `search-other-item-${quickFilterIndex == index ? 'active' : 'default'}`]" v-for="(item, index) in quickFilterList" :key="index" @tap="quickFilter(item, index)">{{ item.title }}</view>
			</view>
		</view>
		<view class="fellow-List">
			<view class="fellow-box" v-for="(item, index) in fellowList" :key="index">
				<schoolFellowItem :info="item"></schoolFellowItem>
			</view>
			<view class="fellow-blank" v-if="fellowList.length == 0">
				<view class="icon background-box"></view>
				<view class="text">该校友还未入会，换个条件搜索吧</view>
			</view>
		</view>
		
		<view class="share-btn school-fellow-share">
			<button data-name="shareBtn1" open-type="share"></button>
			<image src="../../static/sdh_icon_bqyq.png" mode=""></image>
		</view>
		<view class="share-btn class-share">
			<button data-name="shareBtn2" open-type="share"></button>
			<image src="../../static/sdh_icon_xyyq.png" mode=""></image>
		</view>
		
		<!-- customHeader="1" otherHeight="1" -->
		<actionSheet
			:height="sheetHeight"
			otherHeight="1"
			:show.sync="showScreen"
			@closeActionSheet="closeActionSheet">
			<template slot="content">
				<view class="screen-sheet">					
					<view class="screen-header">
						<view class="header-title">全部筛选</view>
					</view>
					<view class="screen-content">
						<view class="screen-content-item">
							<tabSelect title="入学时间" :list="yearList" :isReset="isReset" :closeMore="closeMore" @tabSelect="yearSelect"></tabSelect>
						</view>
						<view class="screen-content-item">
							<tabSelect title="当前城市" :list="cityList" :isReset="isReset" :closeMore="closeMore" @tabSelect="citySelect"></tabSelect>
						</view>
						<view class="screen-content-item">
							<tabSelect title="学院" :list="collegeList" :isReset="isReset" :closeMore="closeMore" @tabSelect="collegeSelect"></tabSelect>
						</view>
						<view class="screen-content-item">
							<tabSelect title="所属行业" :list="industryList" :isReset="isReset" :closeMore="closeMore" @tabSelect="industrySelect"></tabSelect>
						</view>
					</view>
					<view class="screen-footer">
						<view class="screen-footer-btn screen-footer-border" @tap="resetScreenInfo">重置</view>
						<view class="screen-footer-btn screen-footer-bg" @tap="saveScreenInfo">保存</view>
					</view>
				</view>
			</template>
		</actionSheet>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { pageJump } from "@/utils/index.js"
	import { sharePic } from "@/utils/base.js"
	import { apiSchoolFellowList, apiGetCity, apiGetCollege, apiGetIndustry } from "@/api/schoolFellow.js"
	import schoolFellowItem from "@/schoolFellowPackage/components/schoolFellowItem.vue"
	import tabSelect from "@/schoolFellowPackage/components/tabSelect.vue"

	export default {
		name: "home",
		data() {
			return {
				page: 1,
				limit: 20,
				name: "",
				school_year: "",
				college_id: "",
				city_id: "",
				major_id:"",
				industry_id: "",
				newcomer: 0,
				fellowList: [], 					// 校友列表
				pageJump,
				sharePic,
				isMore: false,
				quickFilterIndex: 0,
				quickFilterList: [
					{
						title: '按协会职位',
						type: 1
					},{
						title: '距离从近到远',
						type: 2
					},{
						title: '距离从远到近',
						type: 3
					}
					
				],
				showScreen: false,
				screenType: '',
				screenIndex: -1,
				screenList: [
					{
						value: '',
						title: '学院',
						type: 'college',
						isShow: false,
					},{
						value: '',
						title: '城市',
						type: 'city',
						isShow: false,
					},{
						value: '',
						title: '行业',
						type: 'industry',
						isShow: false,
					},{
						value: '',
						title: '年份',
						type: 'year',
						isShow: false,
					}
				],
				yearList: [],
				cityList: [],
				collegeList: [],
				industryList: [],
				positionList:[],
				inviteBadge:{},
				isReset: false,
				closeMore: false,
				schoolShareData: {
					pic: "",
					title: "",
					linkUrl: ""
				},
				classShareData: {
					pic: "",
					title: "",
					linkUrl: ""
				}
			}
		},
		components: {
			schoolFellowItem,
			tabSelect
		},
		computed: {
			...mapGetters([
				'userId',
				'userPermissions',
				'userLocationInfo',
				'bboxSystemType', 		//  1--正常手机（宽高正常） 2--大屏幕手机（高度过大） 3--平板（高度过小）
			]),
			sheetHeight() {
				if(this.screenType == 'all') {
					return this.bboxSystemType ===3 ? 800 : this.bboxSystemType ===2 ? 1180 : 1000
				} else {
					return this.bboxSystemType ===3 ? 400 : this.bboxSystemType ===2 ? 590 : 500
				}
			}
		},
		async onLoad(option) {
			console.log('进入校友列表', option)
			this.positionList = await this.$store.dispatch("getPosition")
			console.log(this.positionList,'this.$store.dispatch("getPosition")')
			this.name = !!option.name ? option.name : ''
			this.city_id = !!option.city ? option.city : ''
			this.college_id = !!option.college ? option.college : ''
			this.industry_id = !!option.industry ? option.industry : ''
			this.major_id = !!option.major ? option.major : ''
			this.school_year = !!option.year ? option.year : ''
			this.newcomer = !!option.newcomer ? option.newcomer : 0
			this.inviteBadge = await this.$store.dispatch("getInviteBadge")
			console.log(this.userPermissions,'userPermissions')
			console.log(this.userLocationInfo,'userLocationInfo')
			await this.getFellowList()
			this.setShareInfo()
			this.setYearList()
			this.getCity()
			this.getCollege()
			this.getIndustry()
		},
		async onShow() {},
		onHide() {},
		methods: {
			async getFellowList(type){
				await apiSchoolFellowList({
					page: this.page,
					limit: this.limit,
					name: this.name,
					school_year: this.school_year,
					college_id: this.college_id,
					city_id: this.city_id,
					industry_id: this.industry_id,
					major_id:this.major_id,
					newcomer: this.newcomer,
					lng: this.userLocationInfo.longitude,
					lat: this.userLocationInfo.latitude,
					order_field: this.quickFilterIndex == 0 ? 'position' : 'distance',
					order_sort: this.quickFilterIndex == 1 ? 'asc' : 'desc',
				}).then(async res => {
					let membershipLevel = await this.$store.dispatch("getPosition")
					let _DATA = res.list.map(i => {
						// let linkConnect = i.photo.indexOf("?") === -1 ? "?" : "&";
						// i.photo = i.photo + linkConnect + "imageMogr2/thumbnail/164x164"
						i.college = i.college == "未知" ? "" : i.college
						i.cardImg = ''
						for (let key of Object.keys(this.positionList)) {
							if(this.positionList[key].id === i.position){
								i.cardImg = this.positionList[key].card_img
							}
						}
						i.badgeImg = !!this.inviteBadge[i.badge]?this.inviteBadge[i.badge].image:null
						i.positionInfo = membershipLevel[i.position]
						i.distanceTxt = ""
						if(i.juli >= 1000) {
							let num = i.juli / 1000
							console.log('num___', num)
							i.distanceTxt = ((num + '').indexOf('.') != -1) ? num.toFixed(1) + 'km' : num + 'km'
						} else if(i.juli == -1) {
							i.distanceTxt = ""
						} else if(i.juli == 0) {
							i.distanceTxt = "附近"
						} else {
							i.distanceTxt = i.juli + 'm'
						}
						return i
					})
					if(type == 'loadMore') {
						this.fellowList = [...this.fellowList, ..._DATA]
					} else {
						this.fellowList = [];
						this.fellowList = _DATA
					}
					if(res.total > this.fellowList.length) {
						this.isMore = true
					} else {
						this.isMore = false
					}
				})
			},
			async confirmSearch(event) {
				await this.init();
				this.name = event.target.value
				this.getFellowList()
			},
			async quickFilter(data, index) {
				this.quickFilterIndex = index
				await this.init();
				this.getFellowList()
			},
			setShareInfo() {
				const userInfo = uni.getStorageSync("userInfo") 
				this.schoolShareData = {
					pic: this.sharePic,
					title: `${!!userInfo.college && userInfo.college != '未知' ? userInfo.college + '的' : ''}同学们，还没加入深大会的，赶紧点击加入哦～`,
					linkUrl: `/pages/sharePage/main?type=1&inviteId=${this.userId}`
				}
				this.classShareData = {
					pic: this.sharePic,
					title: `${!!userInfo.name ? userInfo.name : '深圳大学校友'}邀请你加入深大会，点击填写你的个人信息`,
					linkUrl: `/pages/sharePage/main?type=2&inviteId=${this.userId}`
				}
				console.log('shareData', this.schoolShareData, this.classShareData)
			},
			getYear(val) {
				let timList = [];
				let smallYears = val;
			   
				let date = new Date();  //获取当前时间
				let NowYears = date.getFullYear();
				var Years = NowYears - smallYears;
				let arrTim = [];
				for (let index = 0; index <= Years; index++) {
				  arrTim.push(NowYears--);
				}
				arrTim.forEach((tim) => {
				  timList .push(tim);
				});
				return timList
			},
			setYearList() {
				let arr = this.getYear(1983).reverse();
				let Yearoption = []
				for (let i = 0; i < arr.length; i++) {
					Yearoption.push({
						id: arr[i],
						name: arr[i] + '年'
					})
				}
				this.yearList = Yearoption.map(i => {
					i.isSelect = 0
					return i
				})
			},
			async getCity(){
				await apiGetCity().then(res => {
					this.cityList = res.map(i => {
						i.isSelect = 0
						return i
					})
				})
			},
			async getCollege(){
				await apiGetCollege().then(res => {
					this.collegeList = res.map(i => {
						i.isSelect = 0
						return i
					})
				})
			},
			async getIndustry(){
				await apiGetIndustry().then(res => {
					this.industryList = res.map(i => {
						i.isSelect = 0
						return i
					})
				})
			},
			yearSelect(list) {
				this.school_year = list.join(",")
			},
			citySelect(list) {
				this.city_id = list.join(",")
			},
			collegeSelect(list) {
				this.college_id = list.join(",")
			},
			industrySelect(list) {
				this.industry_id = list.join(",")
			},
			resetScreenInfo() {
				this.isReset = true
				setTimeout(() => {
					this.isReset = false
				}, 500)
			},
			saveScreenInfo() {
				this.getFellowList()
				this.showScreen = false
				this.initAllSelect()
			},
			initAllSelect() {
				this.screenList.forEach((i) => {
					i.value  = ""
				})
			},
			// 初始化
			init() {
				this.page = 1;
				this.isMore = false;
				// this.fellowList = [];
			},
			selectType(item, index) {
				this.screenList[index].isShow = true
				this.screenType = item.type
				this.screenIndex = index
				
				this.showScreen = true
			},
			closeActionSheet() {
				if(!!this.screenList[this.screenIndex]) {
					this.screenList[this.screenIndex].isShow = false
				}
				this.screenType = ''
				this.screenIndex = -1
				
				this.showScreen = false
				this.closeMore = true
			}
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			this.init();
			this.getFellowList();
			uni.stopPullDownRefresh();
		},
		// 上拉加载更多
		onReachBottom() {
			if (this.isMore) {
				++this.page;
				this.getFellowList('loadMore');
			}
		},
		// 分享数据
		onShareAppMessage(event) {
			if(event.target.dataset.name == "shareBtn1") {
				return this.public.baseShareData(
					this.schoolShareData.title,
					this.public.shareLinkAddBrandId(this.schoolShareData.linkUrl),
					this.schoolShareData.pic
				);
			} else if(event.target.dataset.name == "shareBtn2") {
				return this.public.baseShareData(
					this.classShareData.title,
					this.public.shareLinkAddBrandId(this.classShareData.linkUrl),
					this.classShareData.pic
				);
			} else {
				return this.public.baseShareData();
			}
		},
		onUnload() {}
	}
</script>

<style lang="less" scoped>
	@import "./main.less";
</style>
