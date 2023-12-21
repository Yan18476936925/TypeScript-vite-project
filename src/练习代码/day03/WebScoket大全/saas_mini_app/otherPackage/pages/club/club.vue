<template>
	<view class="club_page">
		<scroll-view style="height: 100vh;" scroll-y="true" class="scroll_view" @scrolltolower="nextClubList">
			<view class="club_item" @tap="clubJump(item)" v-for="item in clubList" :key="item.id">
				<view class="club_item_l"><image :src="item.cover_img" mode=""></image></view>
				<view class="club_item_r">
					<view class="club_item_r_1">{{ item.title }}</view>
					<!-- <view class="club_item_r_2">营业时间：{{item.open_desc}}</view> -->
					<!-- <view class="club_item_r_3">
						<view class="addr_icon"></view>
						{{ item.province }}{{ item.city }}
					</view> -->
					<view class="club_item_r_3">
						负责人：{{ item.creator_name }}
					</view>
				</view>
			</view>
			<view class="no_more" v-if="!isMore">
				没有更多了~
			</view>
		</scroll-view>
	
	</view>
</template>

<script>
import { apiGetClubList } from '@/api/home.js';
import { pageJump } from '@/utils/index.js';
export default {
	data() {
		return {
			pageJump,
			page: 1,
			clubList: [],
			isMore: true,
			clubLoading: false // 场地列表加载中
		};
	},
	created() {
		this.getClubList();
		console.log('-----------123')
	},
	methods: {
		getClubList() {
			if (this.clubLoading) {
				return;
			}
			this.clubLoading = true;
			apiGetClubList({ page: this.page })
				.then(res => {
					this.clubList = this.clubList.concat(res.list);
					if (this.clubList.length == res.total) {
						this.isMore = false;
					}
					console.log(res);
				})
				.finally(() => {
					this.clubLoading = false;
				});
		},
		nextClubList() {
			console.log('-----------')
			if (!this.isMore) {
				// uni.showToast({
				// 	title: '没有更多了',
				// 	icon: 'none'
				// })
				return;
			}
			this.page++;
			this.getClubList();
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
	}
};
</script>

<style scoped lang="less">
	.club_page{
		padding-bottom: 50rpx;
	}
.scroll_view {
	.club_item {
		box-sizing: border-box;
		margin: 20rpx auto 0;
		width: 702rpx;
		height: 220rpx;
		padding: 28rpx;
		background: #ffffff;
		border-radius: 24rpx;
		display: flex;
		.club_item_l {
			width: 164rpx;
			height: 164rpx;
			border-radius: 12rpx;
			image {
				border-radius: 12rpx;
				width: 100%;
				height: 100%;
			}
		}
		.club_item_r {
			padding-left: 24rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.club_item_r_1 {
				max-width: 450rpx;
				font-family:  PingFangSC-Regular;
				font-size: 36rpx;
				color: #000000;
				line-height: 48rpx;
				font-weight: 600;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.club_item_r_2 {
				max-width: 450rpx;
				box-sizing: border-box;
				padding-top: 12rpx;
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #0e0f12;
				font-weight: 500;
				overflow: hidden; 
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.club_item_r_3 {
				box-sizing: border-box;
				padding-top: 12rpx;
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #999999;
				font-weight: 500;
				display: flex;
				align-items: center;
				.addr_icon {
					display: inline-block;
					width: 24rpx;
					height: 24rpx;
					background: url('@/static/newImage/icon/sdh_xyjlb_icon_dizhi2.png');
					background-position: center;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					margin-right: 4rpx;
				}
			}
		}
	}
}
.no_more{
	text-align: center;
	    font-size: 26rpx;
	    color: #b5b5b5;
	    padding-top: 20rpx;
	    box-sizing: border-box;
}
</style>
