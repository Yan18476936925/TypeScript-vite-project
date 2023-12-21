<template>
	<view class="school-fellow-List">
		<view class="fellow-List">
			<view class="fellow-box" v-for="(item, index) in fellowList" :key="index">
				<inviteItem :info="item"></inviteItem>
			</view>
		</view>
		<view class="blank" v-if="fellowList.length == 0">
			<view class="blank-icon background-box"></view>
			<view class="blank-text">邀请的校友成功入会时展示</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { pageJump } from "@/utils/index.js"
	import { sharePic } from "@/utils/base.js"
	import { apiGetInviteList } from "@/api/personal.js"
	import inviteItem from "@/personalInfoPackage/components/inviteItem.vue"

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
				industry_id: "",
				newcomer: "",
				fellowList: [], 					// 校友列表
				pageJump,
				sharePic,
				isMore: false,
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
				isReset: false,
				closeMore: false,
			}
		},
		components: {
			inviteItem,
		},
		computed: {
			...mapGetters([
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
			this.name = !!option.name ? option.name : ''
			this.city_id = !!option.city ? option.city : ''
			this.college_id = !!option.college ? option.college : ''
			this.industry_id = !!option.industry ? option.industry : ''
			this.school_year = !!option.year ? option.year : ''
			await this.getFellowList()
		},
		async onShow() {},
		onHide() {},
		methods: {
			async getFellowList(type){
				await apiGetInviteList({
					page: this.page,
					limit: this.limit,
					name: this.name,
					school_year: this.school_year,
					college_id: this.college_id,
					city_id: this.city_id,
					industry_id: this.industry_id,
					newcomer: this.newcomer,
				}).then(async res => {
					let membershipLevel = await this.$store.dispatch("getPosition")
					let _DATA = res.list.map(i => {
						// let linkConnect = i.photo.indexOf("?") === -1 ? "?" : "&";
						// i.photo = i.photo + linkConnect + "imageMogr2/thumbnail/164x164"
						i.cardImg = ''
						for (let key of Object.keys(membershipLevel)) {
							if(membershipLevel[key].id === i.position){
								i.cardImg = membershipLevel[key].card_img
							}
						}
						return i
					})
					uni.setNavigationBarTitle({
						title: `我的邀请(${res.total})`
					});
					if(type == 'loadMore') {
						this.fellowList = [...this.fellowList, ..._DATA]
					} else {
						this.fellowList = _DATA
					}
					if(res.total > this.fellowList.length) {
						this.isMore = true
					} else {
						this.isMore = false
					}
				})
			},
			// 初始化
			init() {
				this.page = 1;
				this.isMore = false;
				this.fellowList = [];
			},
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
					'软件编程的同学们，还没加入深大会的，赶紧点击加入哦～',
					"/pages/sharePage/main?type=1", 
					this.sharePic
				);
			} else if(event.target.dataset.name == "shareBtn2") {
				return this.public.baseShareData(
					'喜羊羊邀请你加入深大会，点击填写你的个人信息',
					"/pages/sharePage/main?type=2", 
					this.sharePic
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
