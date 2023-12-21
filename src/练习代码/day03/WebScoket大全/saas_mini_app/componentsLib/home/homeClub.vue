<template>
	<view class="home-club" v-if="clubList.length > 0">
		<home-item topLeft="俱乐部" lineColor="#FFB500" topRight="更多 >" @topTap="clubMoreJump">
			<template #bottomContent>
				<view class="club-list">
					<scroll-view @scrolltolower="nextclubList" scroll-x="true" :lower-threshold="100">
						<view class="club-list-content">
							<view class="list-item" v-for="(item, index) in clubList" :key="item.id" @tap="clubJump(item)">
								<image class="item-img" :src="item.cover_img" mode="aspectFill"></image>
								<view class="item-name overflow-hidden">{{item.title}}</view>
							</view>							
						</view>
					</scroll-view>
				</view>
			</template>
		</home-item>
	</view>
</template>

<script>
	import { pageJump } from "@/utils/index.js"
	import homeItem from "@/componentsLib/home/homeItem.vue"
	import { apiGetClubList } from '@/api/home.js';
	export default {
		components: {
			homeItem
		},
		data() {
			return {
				pageJump,
				clubList: [],		// 俱乐部列表
			}
		},
		async mounted() {
			this.getClubList()
		},
		methods: {
			getClubList() {
				apiGetClubList({ page: 1 })
					.then(res => {
						this.clubList = res.list.slice(0,5)
						console.log("this.clubList",this.clubList)
					})
			},
			clubMoreJump() {
				if(!this.$store.getters.openid){
					uni.$emit("OPEN_SIGHTSEER_POPUP")
					return
				}
				if(!!this.public.checkUserStatus()) {
					pageJump('/otherPackage/pages/club/club')
				}
			},
			clubJump(item) {
				if(!this.$store.getters.openid){
					uni.$emit("OPEN_SIGHTSEER_POPUP")
					return
				}
				if(!!this.public.checkUserStatus()) {
					pageJump(`/otherPackage/pages/club/clubDetails?club_id=${item.id}`)
				}
			},
			nextclubList(){
				
			}
		}
	}
</script>

<style lang="less" scoped>
.club-list{
	width: 100%;
	display: flex;
	// overflow-x: scroll;
	margin-top: 26rpx;
	.club-list-content{
		display: flex;	
		padding-left: 14rpx;
		&::after{
			content: "俱乐部";
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
