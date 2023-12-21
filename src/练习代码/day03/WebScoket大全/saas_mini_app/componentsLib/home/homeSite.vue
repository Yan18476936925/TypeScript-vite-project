<template>
	<view class="home-site">
		<home-item topLeft="校友场地" lineColor="#9E77FF" topRight="更多 >" @topTap="siteMoreJump()">
			<template #bottomContent>
				<view class="site-content">
					<view class="site-class">
						<view class="class-item" :class="[item.id == siteId ? 'choose-class' : '']" v-for="(item, index) in site_class" :key="item.id" @tap="chooseSiteClass(item)">{{item.title}}</view>
					</view>
					<view class="site-list" >
						<scroll-view @scrolltolower="nextSiteList" scroll-x="true" :lower-threshold="100">
							<view class="site-list-content">
								<view class="list-item" v-for="(item, index) in siteList" :key="item.id" @tap="siteJump(item)">
									<view class="discount-text" v-if="!!item.discount">校友 {{item.discount}}折</view>
									<image class="site-image" :src="item.home_img" mode=""></image>
									<view class="site-title overflow-hidden">{{item.title}}</view>
								</view>								
							</view>
						</scroll-view>
					</view>
				</view>
			</template>
		</home-item>
	</view>
</template>

<script>
	import { pageJump } from "@/utils/index.js"
	import { apiHomeSiteList } from "@/api/home.js"
	import homeItem from "@/componentsLib/home/homeItem.vue"
	export default {
		components: {
			homeItem
		},
		data() {
			return {
				pageJump,
				siteList: [],				// 场地列表
				siteId: -1,					// 选中的场地id
				sitePage: 1,				// 场地页码
				siteLoading: false,			// 场地列表加载中
				siteMore: true,				// 场地列表是否还有更多
			}
		},
		props: [
			"site_class",    // site_class列表
		],
		mounted() {
			uni.$off("SEND_SITE_ID");
			uni.$on("SEND_SITE_ID", id => {
				this.siteId = id
				this.getHomeSiteList()
			});
		},
		methods:{
			// 获取场地列表
			getHomeSiteList(init = 1){
				if(this.siteLoading){
					return
				}
				if(init){
					this.siteList = []
					this.sitePage = 1
				}
				this.siteLoading = true
				apiHomeSiteList({
					page: this.sitePage,
					site_class: this.siteId,
				})
					.then(res => {
						console.log("获取场地列表",res)
						res.list.map(i => {
							i.discount = +i.discount
							return i
						})
						this.siteList = this.siteList.concat(res.list)
						this.siteMore = this.siteList.length < res.total
						console.log("this.siteList",this.siteList,this.siteMore)
					})
					.finally(() => {
						this.siteLoading = false
					})
			},
			siteMoreJump() {
				if(!this.$store.getters.openid){
					uni.$emit("OPEN_SIGHTSEER_POPUP")
					return
				}
				if(!!this.public.checkUserStatus()) {
					pageJump('/otherPackage/pages/siteInfo/main')
				}
			},
			siteJump(item) {
				if(!this.$store.getters.openid){
					uni.$emit("OPEN_SIGHTSEER_POPUP")
					return
				}
				if(!!this.public.checkUserStatus()) {
					pageJump(`/otherPackage/pages/siteInfo/detail?site_id=${item.id}`)
				}
			},
			// 选择场地分类
			chooseSiteClass(item){
				if(this.siteLoading){
					return
				}
				this.siteId = item.id
				this.getHomeSiteList()
			},
			// 场地列表加载更多
			nextSiteList(){
				console.log("场地列表加载更多")
				if(this.siteLoading || !this.siteMore){
					console.log("没有更多了")
					return
				}
				this.sitePage ++
				this.getHomeSiteList(0)
			}
		}
	}
</script>

<style lang="less" scoped>
	.site-content{
		margin-top: 30rpx;
		display: flex;
		flex-direction: column;
		.site-class{
			display: flex;
			align-items: center;
			padding: 0 36rpx;
			height: 44rpx;
			overflow-y: hidden;
			overflow-x: scroll;
			&::-webkit-scrollbar{
				display: none;
			}
			.class-item{
				background: #FFFFFF;
				border-radius: 20rpx;
				min-width: 128rpx;
				height: 40rpx;
				padding: 0 16rpx;
				font-size: 24rpx;
				color: #242524;
				font-weight: 400;
				text-align: center;
				line-height: 40rpx;
				margin-right: 20rpx;
				&.choose-class{
					background: #0E0F12;
					border-radius: 22rpx;
					height: 44rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					line-height: 44rpx;
					font-weight: 600;
				}
			}
		}
		.site-list{
			box-sizing: border-box;
			margin-top: 30rpx;
			height: 216rpx;
			.site-list-content{
				display: flex;
				box-sizing: border-box;
				margin: 0 36rpx;
				&::after{
					content: "活动推荐";
					opacity: 0;
				}
			}
			.list-item{
				background: #FFFFFF;
				border-radius: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 238rpx;
				height: 216rpx;
				margin-right: 16rpx;
				position: relative;
				.discount-text {
					background: #F40012;
					border-radius: 20rpx 0rpx 16rpx 0rpx;
					font-size: 20rpx;
					color: #FFFFFF;
					font-weight: 600;
					padding: 0 12rpx;
					height: 32rpx;
					line-height: 32rpx;
					position: absolute;
					top: 0;
					left: 0;
				}
				.site-image{
					width: 237rpx;
					height: 144rpx;
					border-radius: 20rpx 20rpx 0 0;
				}
				.site-title{
					font-size: 24rpx;
					color: #0E0F12;
					font-weight: 400;
					padding: 19rpx 20rpx ;
					box-sizing: border-box;
					width: 100%;
					text-align: left;
				}
			}
		}
	}
</style>