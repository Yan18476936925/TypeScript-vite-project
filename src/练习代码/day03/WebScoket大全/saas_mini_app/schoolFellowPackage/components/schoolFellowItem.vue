<template>
	<view class="fellow-item" @tap="openFellowDetails">
		<view class="fellow-item-avatar">
			<image :src="userAvatar" mode="aspectFill" @error="imageError"></image>
		</view>
		<view class="fellow-item-info">
			<view class="fellow-item_info_1">
				<view class="fellow-item-name">
					{{ info.name }}
				</view>
				<view :class="[`fellow-item-card`]">
					<image :src="info.cardImg" mode="heightFix"></image>
				</view>
				<!-- <view :class="[`fellow-item-badge`]" v-if="!!info.badgeImg">
					<image :src="info.badgeImg" mode="heightFix"></image>
				</view> -->
			</view>
			<view class="fellow-item-position">
				{{ info.business_position }} 
				<text v-if="!!info.industry">({{ info.industry }})</text>
			</view>
			<view class="fellow-item-education">{{ info.school_year }}级{{ !!info.college ? " · " + info.college : ""}} · {{ info.major }}</view>
		</view>
		<view class="fellow-item-city" v-if="!!info.distanceTxt">
			<image src="../../static/newImage/icon/address_gray.png" mode=""></image>
			{{ info.distanceTxt }}
		</view>
		<view class="fellow-item-city" v-else-if="!!info.home_city">
			<image src="../../static/newImage/icon/address_gray.png" mode=""></image>
			{{ info.home_city }}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultAvatar: ""
			}
		},
		props: [
			"info",
		],
		computed: {
			userAvatar() {
				if(!!this.defaultAvatar) {
					return this.defaultAvatar
				} else {
					return this.info.photo
				}
			},
		},
		methods: {
			imageError(e) {
				this.defaultAvatar = "../../static/newImage/blank/default_avatar.png"
			},
			openFellowDetails() {
				this.public.pageJump(`/schoolFellowPackage/pages/schoolFellowDetails/main?studentId=${this.info.student_id}`)
				// this.public.pageJump('https://m.dianping.com/ugcdetail/133552095?bizType=29&utm_source=shouyefeed&queryid=351f0645-5e2c-4c11-8d2c-fa9537e30069&feedcontext=%7B%7D&abflags=%7B%7D&bussiid=5&moduleid=0')
			}
		}
	}
</script>

<style lang="less" scoped>
.fellow-item {
	width: 702rpx;
	// height: 220rpx;
	padding: 28rpx;
	box-sizing: border-box;
	display: flex;
	align-items: flex-start;
	background: #FFFFFF;
	border-radius: 24rpx;
	margin-bottom: 20rpx;
	font-family:  PingFangSC-Regular;
	position: relative;
	&-avatar {
		width: 164rpx;
		height: 164rpx;
		border-radius: 16rpx;
		overflow: hidden;
		margin-right: 24rpx;
		> image {
			width: 100%;
			height: 100%;
		}
	}
	&-info {
		width: 486rpx;
		min-height: 164rpx;
		.fellow-item_info_1{
			display: flex;
			margin-bottom: 24rpx;
			align-items: center;
		}
		.fellow-item-name {
			overflow: hidden; 
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 160rpx;
			font-size: 36rpx;
			color: #000000;
			line-height: 36rpx;
			font-weight: 600;
		}
		.fellow-item-label {
			width: fit-content;
			height: 22rpx;
			line-height: 22rpx;
			font-size: 18rpx;
			color: #FFFFFF;
			font-weight: 500;
			padding: 0rpx 6rpx;
			box-sizing: border-box;
			background: #F40012;
			border-radius: 11rpx 11rpx 11rpx 0rpx;
			margin-left: 14rpx;
		}
		.fellow-item-card{
			margin-left: 10rpx;
			display: flex;
			align-items: center;
			// display: inline-block;
			// min-width: calc(~"186rpx * 0.6");
			// height: calc(~"36rpx * 0.6");
			height: 21.5rpx;
			image{
				height: 100%;
			}
		}
		.fellow-item-badge{
			margin-left: 5rpx;
			display: flex;
			align-items: center;
			height: 36rpx;
			image{
				height: 100%;
			}
		}
		.fellow-item-position {
			font-size: 24rpx;
			color: #0E0F12;
			font-weight: 400;
			margin-bottom: 12rpx;
		}
		.fellow-item-education {
			font-size: 20rpx;
			color: #999999;
			font-weight: 400;
		}
	}
	.fellow-item-city {
		font-size: 18rpx;
		color: #999999;
		font-weight: 400;
		display: flex;
		align-items: center;
		position: absolute;
		top: 28rpx;
		right: 24rpx;
		> image {
			width: 12rpx;
			height: 14rpx;
			margin-right: 6rpx;
		}
	}
}
</style>