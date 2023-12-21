<template>
	<view class="home-company" v-if="companyList.length > 0">
		<home-item topLeft="校友企业" lineColor="#3FB7EC">
			<template #bottomContent>
				<view class="company-list">
					<scroll-view @scrolltolower="nextCompanyList" scroll-x="true" :lower-threshold="100">
						<view class="company-list-content">
							<view class="list-item" v-for="(item, index) in companyList" :key="item.id" @tap="companyJump(item)">
								<image class="item-img" :src="item.home_img" mode="aspectFill"></image>
								<view class="item-name overflow-hidden">{{item.name}}</view>
							</view>							
						</view>
					</scroll-view>
				</view>
			</template>
		</home-item>
	</view>
</template>

<script>
	import homeItem from "@/componentsLib/home/homeItem.vue"
	import { apiGetEnterprise } from '@/api/home.js';
	export default {
		components: {
			homeItem
		},
		data() {
			return {
				companyList: [],		// 企业列表
				page: 1,
				isMore: true,
				companyLoading: false // 场地列表加载中
			}
		},
		async mounted() {
			this.getCompanyList()
		},
		methods: {
			getCompanyList() {
				if (this.companyLoading) {
					return;
				}
				this.companyLoading = true;
				apiGetEnterprise({ page: this.page })
					.then(res => {
						this.companyList = this.companyList.concat(res.list);
						if (this.companyList.length == res.total) {
							this.isMore = false;
						}
						console.log(res);
					})
					.finally(() => {
						this.companyLoading = false;
					});
			},
			companyJump(item) {
				if(!this.$store.getters.openid){
					uni.$emit("OPEN_SIGHTSEER_POPUP")
					return
				}
				if(!!this.public.checkUserStatus()) {
					this.public.pageJump(`/otherPackage/pages/company/companyDetails?enterprise_id=${item.id}`)
				}
			},
			nextCompanyList(){
				if (!this.isMore) {
					return;
				}
				this.page++;
				this.getCompanyList();				
			}
		}
	}
</script>

<style lang="less" scoped>
.company-list{
	width: 100%;
	display: flex;
	// overflow-x: scroll;
	margin-top: 26rpx;
	.company-list-content{
		display: flex;	
		padding-left: 14rpx;
		&::after{
			content: "校友企业";
			font-size: 20rpx;
			opacity: 0;
		}	
	}
	.list-item{
		flex-shrink: 0;
		width: 312rpx;
		height: 272rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin-left: 22rpx;
		position: relative;
		
		display: flex;
		flex-direction: column;
		align-items: center;
		.item-img{
			width: 300rpx;
			height: 192rpx;
			border-radius: 24rpx;
			margin-top: 6rpx;
			background-color: #F2F2F2;
		}
		.item-name{
			font-family:  PingFangSC-Regular;
			font-size: 24rpx;
			color: #0E0F12;
			font-weight: 400;
			margin-top: 22rpx;
			width: 100%;
			text-align: left;
			padding: 0 18rpx;
			box-sizing: border-box;
		}
	}
}
</style>
