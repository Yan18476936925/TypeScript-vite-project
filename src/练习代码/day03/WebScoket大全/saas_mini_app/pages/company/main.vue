<template>
	<view class="company_main">
		<view class="search-box">
			<view class="search-bg">				
				<image class="search-icon" src="https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FjLbzP-7oaej_wxiUx0cilQkKlhe.png" mode=""></image>
				<input type="text"
					class="search-input"
					value=""
					v-model="name"
					confirm-type="search"
					:focus="isFocus"
					placeholder="输入企业名称搜一搜" 
					placeholder-style="font-size: 24rpx;color: #B9BDC3;letter-spacing: 0;"
					@confirm="confirmSearch"
				/>
			</view>
			<view class="search-btn" @tap="getEnterpriseList('init')">搜索</view>
		</view>
		<view class="company_List">
			<view class="company_item" v-for="(item, index) in enterpriseList" :key="item.id" @tap="companyJump(item)">
				<view class="company_image">
					<image :src="item.cover_img" mode=""></image>
				</view>
				<view class="company_title">
					{{ item.name }}
				</view>
				<view class="company_fri">
					校友：{{ item.member_name }}
				</view>
			</view>
			<view class="enterprise-blank" v-if="enterpriseList.length == 0">
				<view class="icon background-box"></view>
				<view class="text">暂无企业，换个条件搜索吧</view>
			</view>
		</view>
		<!-- 游客授权弹窗 -->
		<sightseer-model :show.sync="userLoginIn"></sightseer-model>
	</view>
</template>

<script>
	import { apiGetEnterpriseList, apiGetEnterpriseDetail } from '@/api/home.js'
	export default {
		data() {
			return {
				name: "",
				enterpriseList: [],
				page: 1,
				limit: 20,
				isMore: false,
				userLoginIn: false,		// 游客弹窗
			}
		},
		onLoad() {
			this.getEnterpriseList()
		},
		methods: {
			getEnterpriseList(type) {
				if(type == 'init') {
					this.init()
				}
				apiGetEnterpriseList({
					name: this.name,
					page: this.page,
					limit: this.limit
				}).then(res => {
					console.log('res___', res)
					let _DATA = res.list
					if(type == 'loadMore') {
						this.enterpriseList = [...this.enterpriseList, ..._DATA]
					} else {
						this.enterpriseList = _DATA
					}
					if(res.total > this.enterpriseList.length) {
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
			// 初始化
			init() {
				this.page = 1;
				this.isMore = false;
				this.fellowList = [];
			},
			companyJump(item) {
				if(!this.$store.getters.openid){
					// uni.$emit("OPEN_SIGHTSEER_POPUP")
					this.userLoginIn = true;
					return
				}
				if(!!this.public.checkUserStatus()) {
					this.public.pageJump(`/otherPackage/pages/company/companyDetails?enterprise_id=${item.id}`)
				}
			},
		},
		onReachBottom() {
			console.log('触底')
			if (this.isMore) {
				++this.page;
				this.getEnterpriseList('loadMore');
			}
		}
	}
</script>

<style lang="less" scoped>
	.company_main{
		.search-box {
			width: 750rpx;
			height: 88rpx;
			background: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 0 24rpx;
			box-sizing: border-box;
			.search-bg {
				height: 56rpx;
				width: 658rpx;
				background: #F7F9FB;
				border-radius: 28rpx;
				margin-right: 28rpx;
				display: flex;
				align-items: center;
				padding: 0 24rpx;
				box-sizing: border-box;
			}
			.search-icon {
				width: 22rpx;
				height: 22rpx;
				margin-right: 18rpx;
			}
			.search-input {
				height: 56rpx;
				width: 432rpx;
				color: #0E0F12;
				// padding-left: 30rpx;
				// box-sizing: border-box;
				font-size: 28rpx;
				letter-spacing: 0;
			}
			.search-btn {
				width: 100rpx;
				height: 56rpx;
				line-height: 56rpx;
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #FFFFFF;
				font-weight: 500;
				text-align: center;
				background: #2D241A;
				border-radius: 28rpx;
				position: absolute;
				right: 28rpx;
				top: 16rpx;
			}
		}
		
		.company_List{
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 24rpx;
			.company_item{
				margin-bottom: 24rpx;
				box-sizing: border-box;
				padding: 20rpx 20rpx 28rpx 20rpx;
				width: 702rpx;
				min-height: 518rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
					
				.company_image{
					width: 662rpx;
					height: 352rpx;
					border-radius: 20rpx;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.company_title{
					padding: 22rpx 0rpx 16rpx 26rpx;
					box-sizing: border-box;
					font-family:  PingFangSC-Regular;
					font-size: 32rpx;
					color: #0E0F12;
					font-weight: 500;
				}
				.company_fri{
					padding-left:26rpx;
					box-sizing: border-box;
					font-family:  PingFangSC-Regular;
					font-size: 26rpx;
					color: #0E0F12;
					font-weight: 400;
				}
			}
			.enterprise-blank{
				width: 100%;
				height: 50vh;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.icon{
					width: 106rpx;
					height: 114rpx;
					background-image: url("@/static/newImage/blank/check.png");
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
	}
</style>
