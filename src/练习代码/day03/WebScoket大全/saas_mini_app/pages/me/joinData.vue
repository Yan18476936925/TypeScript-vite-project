<template>
	<view class="joinData_page" v-if="initLoadSucc">
		<view class="content" v-if="status === 1">
			<!-- 已入会 -->
			<view class="tabs">
				<view :class="[`tab_item`,`${tabIndex === i?'tab_item_cur':''}`]" @click="tabIndex = i"
					v-for="(e,i) in tabs" :key="i">
					{{e}}
				</view>
			</view>
			<view class="line_x">
			</view>
			<view class="t_content">
				<view class="" v-show="tabIndex == 0">
					<view :class="[`info_item`,`${item.ifImg?'info_img_item':''}`]"
						v-for="(item,index) in perInfoShowList" :key="index">
						<view :class="[`label`,`${item.stay?'label_w':''}`]">
							{{item.label}}
						</view>
						<view class="value_img" v-if="item.ifImg">
							<image :src="item.value" mode="aspectFill"></image>
						</view>
						<view class="value" v-else>
							{{item.value}}
						</view>
					</view>
				</view>
				<view class="" v-show="tabIndex == 1">
					<view :class="[`info_item`]"
						v-for="(item,index) in studentShowInfo" :key="index">
						<view :class="[`label`,`${item.stay?'label_w':''}`]">
							{{item.label}}
						</view>
						<view class="value">
							{{item.value}}
						</view>
					</view>
				</view>
				<view class="" v-show="tabIndex == 2">
					<view :class="[`info_item`]" v-for="(item,index) in workShowInfo"
						:key="index">
						<view :class="[`label`,`${item.stay?'label_w':''}`]">
							{{item.label}}
						</view>
						<view class="value">
							{{item.value}}
						</view>
					</view>
				</view>
		</view>
		</view>
		<!-- 未申请 -->
		<view v-if="status === -1">
			<view class="no_join">
				<view class="not_apply_icon"></view>
				<view class="no_join_msg">
					填写入会资料，加入深大会大家庭～
				</view>
				<view class="no_join_btn" @tap="public.pageJump('/otherPackage/pages/applyMember/userInfo')">
					立即加入
				</view>
			</view>
		</view>
		<!-- 审核中 -->
		<view v-if="status === 0">
			<view class="no_join">
				<view class="not_check_icon"></view>
				<view class="no_check_msg">
					入会信息审核中
				</view>
				<view class="no_check_msg_1">
					管理员将会在1～3个工作日内完成审核<br/>请耐心等待审核结果
				</view>
			</view>
		</view>
		<!-- 审核失败 -->
		<view v-if="status == 2">
			<view class="no_join">
				<view class="not_checkError_icon"></view>
				<view class="no_check_msg_1">
					审核失败
				</view>
				<view class="no_join_msg">
					{{rejected}}
				</view>
				<view class="no_join_btn" @tap="public.pageJump('/otherPackage/pages/applyMember/userInfo?ifEdit=true','redirectTo')">
					修改信息
				</view>
			</view>
		</view>
		
		<!-- 游客授权弹窗 -->
		<sightseer-model :show.sync="userLoginIn"></sightseer-model>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import {
		getUserDetail
	} from '@/api/guiId.js'
	import infoFil from '@/utils/infoFil.js'
	import {
		studentInfoList,
		perInfoList,
		workInfoList
	} from './joinDataList.js'
	export default {
		data() {
			return {
				status:'',
				rejected:'',
				tabs: ['个人信息', '学籍信息', '工作信息'],
				initLoadSucc: false,
				// 工作信息
				workShowInfo: [],
				// 学籍信息
				studentShowInfo: [],
				// 个人信息
				perInfoShowList: [],
				tabIndex: 0,
				userLoginIn: false,		// 游客弹窗
			};
		},
		computed: {
			...mapGetters([ 
				"openid",
				"isSightseer"
			])
		},
		onLoad() {
			uni.$off("PAGE_joinData_REFRESH");
			uni.$on("PAGE_joinData_REFRESH", () => {
				this.getUserDetail('init');
			})
			if(this.isSightseer == 1 || !this.openid) {
				this.userLoginIn = true;
				return;
			}
		},
		created() {
			this.getUserDetail('init')
		},
		methods: {
			getUserDetail(type) {
				uni.showLoading({
					title: '加载中',
					mask: true,
				})
				getUserDetail({
					// openid: 'os7pK4_YYxUo8SZ6mt6YsP7UlgKc'
				}).then(res => {
					this.status = res.status
					this.rejected = res.rejected
					
					uni.hideLoading()
					if(!!type && type == 'init') {
						this.initLoadSucc = true
					}
					if(this.status !== 1){
						return
					}
					this.perInfoShowList = perInfoList.filter(e => {
						let tempObj = Object.assign(e, {
							value: res[e.fields]
						})
						tempObj.value = infoFil(tempObj)
						return tempObj
					})
					this.studentShowInfo = studentInfoList.filter(e => {
						let tempObj = Object.assign(e, {
							value: res[e.fields]
						})
						tempObj.value = infoFil(tempObj)
						return tempObj
					})
					this.workShowInfo = workInfoList.filter(e => {
						return Object.assign(e, {
							value: res[e.fields]
						})
					})
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.joinData_page {
		width: 100%;
		box-sizing: border-box;
		background-color: #f7f9fb;
		padding: 20rpx 24rpx 126rpx;

		.content {
			width: 100%;
			background: #FFFFFF;
			border-radius: 24rpx;

			.tabs {
				height: 96rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.tab_item {
					padding: 20rpx 40rpx;
					position: relative;
					font-family:  PingFangSC-Regular;
					// font-size: 24rpx;
					font-size: 26rpx;
					color: #0E0F12;
					font-weight: 600;
				}

				.tab_item_cur::before {
					position: absolute;
					bottom: 10rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 24rpx;
					height: 4rpx;
					content: '';
					background: #F40012;
					border-radius: 1.5rpx;
				}
			}

			.t_content {}
		}

		.info_item {
			margin: 0 auto;
			width: 642rpx;
			padding: 40rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 0.5rpx dashed #F1F1F1;

			.label,
			.value {
				max-width: 360rpx;
				font-family:  PingFangSC-Regular;
				font-size: 26rpx;
				color: #0E0F12;
				font-weight: 500;
				word-wrap: break-word;
				word-break: break-all;
				// display: -webkit-box;
				// -webkit-box-orient: vertical;
				// -webkit-line-clamp: 2; 
				// overflow: hidden; 
			}

			.label_w {
				position: relative;
				min-width: 80rpx;
				letter-spacing: 32rpx;
			}

			.value_img {
				width: 128rpx;
				height: 128rpx;
				border-radius: 12rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.info_item:last-child {
			border-bottom: 0rpx solid #F1F1F1;
		}

		.info_img_item {
			padding: 24rpx 0 40rpx;
		}
		.info_update_item{
			padding-right: 28rpx ;
		}
		.line_x {
			margin: 0 auto;
			width: 642rpx;
			height: 0.5rpx;
			background-color: #F1F1F1;
			// border-bottom: 0.5rpx dashed #F1F1F1;
		}
		.no_join{
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 214rpx;
			width: 552rpx;
			margin: 0 auto;
			.not_apply_icon{
				width: 106rpx;
				height: 114rpx;
				background: url('@/static/newImage/blank/edit.png') no-repeat;
				background-size: 100% 100%;
			}
			.not_check_icon{
				width: 106rpx;
				height: 114rpx;
				background: url('@/static/newImage/blank/check.png') no-repeat;
				background-size: 100% 100%;
			}
			.not_checkError_icon{
				width: 106rpx;
				height: 114rpx;
				background: url('@/static/newImage/blank/checkError.png') no-repeat;
				background-size: 100% 100%;
			}
			.no_join_msg,.no_check_msg,.no_check_msg_1{
				padding: 32rpx 0 100rpx;
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #0E0F12;
				font-weight: 500;
				text-align: center;
			}
			.no_check_msg{
				padding: 32rpx 0 22rpx;
			}
			.no_check_msg_1{
				text-align: center;
				padding: 0 ;
			}
			.no_join_btn{
				width: 290rpx;
				height: 64rpx;
				background: #0E0F12;
				border-radius: 21px;
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #FDFEFE;
				line-height: 64rpx;
				font-weight: 500;
				text-align: center;
			}
		}
	}
</style>
