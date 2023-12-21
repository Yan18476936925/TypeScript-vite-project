<template>
	<view class="home-lead" v-if="leadList.length > 0">
		<home-item topLeft="校友风采" lineColor="#C063CF">
			<template #bottomContent>
				<view class="lead-list">
					<scroll-view @scrolltolower="nextLeadList" scroll-x="true" :lower-threshold="100">
					<!-- <scroll-view scroll-x="true"> -->
						<view class="lead-list-content">
							<view class="list-item" v-for="(item, index) in leadList" :key="item.id" @tap="leadJump(item)">
								<image class="item-img" :src="item.photo" mode="aspectFill"></image>
								<image class="item-lv" :src="positionList[item.position].card_img" mode="heightFix" v-if="positionList[item.position]"></image>
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
	// import { apiGetLeaderDetail } from '@/api/home.js';
	import { apiExcellentList } from '@/api/schoolFellow.js';
	export default {
		components: {
			homeItem
		},
		data() {
			return {
				leadList: [],		// 领导列表
				positionList: [],				// 领导等级
				page: 1,
				limit: 20,
				isMore: true,
				leadLoading: false // 场地列表加载中
			}
		},
		async mounted() {
			this.positionList = await this.$store.dispatch("getPosition")
			// console.log("this.positionList",this.positionList)
			this.getLeadList()
		},
		methods: {
			getLeadList() {
				if (this.leadLoading) {
					return;
				}
				this.leadLoading = true;
				apiExcellentList({
					page: this.page,
					limit: this.limit
				})
					.then(res => {
						this.leadList = this.leadList.concat(res.list);
						if (this.leadList.length == res.total) {
							this.isMore = false;
						}
						// console.log(res);
					})
					.finally(() => {
						this.leadLoading = false;
					});
			},
			leadJump(item) {
				if(!this.$store.getters.openid){
					uni.$emit("OPEN_SIGHTSEER_POPUP")
					return
				}
				if(!!this.public.checkUserStatus()) {
					this.public.pageJump(`/schoolFellowPackage/pages/schoolFellowDetails/main?studentId=${item.id}`)
				}
			},
			nextLeadList(){
				if (!this.isMore) {
					return;
				}
				this.page++;
				this.getLeadList();
			}
		}
	}
</script>

<style lang="less" scoped>
.lead-list{
	width: 100%;
	display: flex;
	overflow-x: scroll;
	margin-top: 26rpx;
	.lead-list-content{
		display: flex;	
		padding-left: 14rpx;
		&::after{
			content: "校友风采";
			font-size: 20rpx;
			opacity: 0;
		}	
	}
	.list-item{
		flex-shrink: 0;
		width: 200rpx;
		height: 266rpx;
		background: #FFFFFF;
		border-radius: 18rpx;
		margin-left: 20rpx;
		position: relative;
		
		display: flex;
		flex-direction: column;
		align-items: center;
		.item-img{
			width: 192rpx;
			height: 212rpx;
			border-radius: 16rpx;
			margin-top:4rpx;
			background-color: #F2F2F2;
		}
		.item-lv{
			height: 24rpx;
			position: absolute;
			top: 180rpx;
			right: 10rpx;
		}
		.item-name{
			font-family:  PingFangSC-Regular;
			font-size: 24rpx;
			color: #0E0F12;
			font-weight: 400;
			margin-top:12rpx;
		}
	}
}
</style>
