<template>
	<view class="mine-message">
		<view class="message-open" v-if="!openStatusShow">
			<view class="message-open-tips">开启消息推送，不错过校友消息</view>
			<view class="message-open-btn" @tap="openApi()">开启</view>
		</view>
		<view class="message-open-zanwei" v-if="!openStatusShow"></view>
		<view v-if="messageList.length > 0">
			<view class="message-item" v-for="(item,index) in messageList" :key="index">
				<view class="time">{{ item.times }}</view>
				<view class="message-content">
					<image class="photo" :src="item.photo" mode=""></image>
					<view class="content">
						<view class="title" v-if="item.status != 3 && item.status != 1 && item.status != 4">{{ item.name }}请求获取你的微信号</view>
						<view class="detail">
							{{ item.content }}
						</view>
						<view class="btn-box">
							<view class="refuse" v-if="item.status == 0" @tap="messageUpdate(item,2)">拒绝</view>
							<view class="agree" v-if="item.status == 0" @tap="sendMessagge = item;$refs.confirmPopup.open()">同意并发送</view>
							<view class="sended" v-if="item.status == 1">已发送</view>
							<view class="refused" v-if="item.status == 2">已拒绝</view>
							<view class="copy-wx" v-if="item.status == 3" @tap="copyWx(item)">复制微信号</view>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		<view class="no-message" v-else>
			<view class="no-message-icon bg-image"></view>
			<view class="no-message-content">暂无消息</view>
		</view>
		
		<uni-popup ref="confirmPopup" type="center">
			<view class="confirm-message">
				<view class="confirm-title">是否确定将微信号发送给该校友？</view>
				<input class="confirm-input" placeholder="请输入你的微信号" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx;"  type="text" v-model="wechat_id">
				<view class="confirm-bottom">
					<view class="confirm-close" @tap="$refs.confirmPopup.close()">取消</view>
					<view class="confirm-send" @tap="messageUpdate(sendMessagge,1)">发送</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 设置弹窗 -->
		<show-setting
			title="去设置"
			contentText="请到设置页，开启订阅消息状态"
			:show.sync="showSetting">
		</show-setting>
		
		<!-- 游客授权弹窗 -->
		<sightseer-model :show.sync="userLoginIn"></sightseer-model>
	</view>
</template>

<script>
	import { apiGetMessage,apiMessageUpdate,apiGetWxMessage } from "@/api/personal.js"
	import store from "@/store/index.js"
	import { mapGetters } from "vuex"
	export default {
		name: "message",
		components: {},		
		data() {
			return {
				userInfo: {},		// 授权获取到的用户信息
				page: 1,
				messageList: [],
				openStatusShow: false,
				testList: [],
				wechat_id: this.$store.state.user.wechat_id,
				sendMessagge: {},
				showSetting: false,		// 授权弹窗
				userLoginIn: false,		// 游客弹窗
			}
		},
		computed: {
			...mapGetters([
				"openStatus",
				"messageSubscribe",
				"openid",
				"isSightseer"
			]),
		},
		watch: {
			'openStatus': {
				handler(val) {
					console.log('openStatus++++++',val);
					if(!!val) {
						if(!this.messageSubscribe) {
							this.openStatusShow = false
						} else {
							this.openStatusShow = true
						}
					} else {
						if(!!this.messageSubscribe) {
							this.openStatusShow = true
						}
					}
				},
				immediate: true
			}
		},
		onTabItemTap (o) {
			
		},
		onLoad() {
			uni.$off("PAGE_message_REFRESH");
			uni.$on("PAGE_message_REFRESH", () => {
				this.getMessage()
				this.getSettingInfo(0)
			})
			if(this.isSightseer == 1 || !this.openid) {
				this.userLoginIn = true;
				return;
			}
			this.getMessage()
			this.getSettingInfo(0)
		},
		onShow() {
			
		},
		methods: {
			// 获取消息列表
			getMessage() {
				apiGetMessage({
					page: this.page,
				}).then(res => {
					this.messageList = res;
				})
			},
			// 处理消息
			messageUpdate(item,status) {
				if(status == 1 && !this.wechat_id){
					this.public.toast("请输入微信号")
					return
				}
				apiMessageUpdate({
					message_id: item.message_id,
					status,
					wechat_id: status == 1 ? this.wechat_id : null
				}).then(res => {
					uni.showToast({
						title: status == 1 ? "发送成功":"已拒绝",
						icon: 'none',
						duration: 2000
					})
					if(status == 1){
						store.commit("setWechatId", this.wechat_id);
						this.$refs.confirmPopup.close()
						this.sendMessagge = {}
					}
					this.getMessage()
				})
			},
			// 复制微信号
			copyWx(item) {
				uni.setClipboardData({
					data: item.reply,
					success() {
						uni.showToast({
							title: '微信号复制成功',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			// 查询是否开启了消息推送
			getSettingInfo(type) {
				let _this = this;
				if(this.public.compareVersion(this.$store.getters.systemInfo.SDKVersion, "2.6.3") > 0) {
					wx.getSetting({
						withSubscriptions: true,
						success (res) {
							console.log('是否开启消息推送',res.subscriptionsSetting);
							let tmplIds =  ["AhOFDO_Ik7bMch2mDnxBpix1-s6wceUNLPhJzUMSKt4", "3cEVA-rw4KOD9MkqPo4sMx0chT7j7hDMRA5M1ZfxxlI"];
							if(res.subscriptionsSetting.mainSwitch) {
								if(res.subscriptionsSetting.itemSettings) {
									console.log('是否开启消息推送',res.subscriptionsSetting.itemSettings);
									tmplIds.forEach(e => {
										if (res.subscriptionsSetting.itemSettings[e] === "accept") {
											_this.openStatusShow = true
											console.log('111',e,_this.openStatusShow);
										} else if(res.subscriptionsSetting.itemSettings[e] === "reject") {
											if(!!type) {
												_this.showSetting = true
											} else {
												_this.openStatusShow = false
											}
											console.log('2222',e,_this.openStatusShow);
										}
									})
								}
							}
						},
						fail (err) {  
							
						}
					})
				} else {
					// 提示版本过低，无法订阅消息
					// uni.showToast({
					// 	icon: 'none',
					// 	title: '当前版本过低，无法使用该功能，请升级到最新版本后重试。',
					// 	duration: 2000
					// })
				}
			},
			// 打开消息推送
			openApi() {
				let _this = this;
				if(this.public.compareVersion(this.$store.getters.systemInfo.SDKVersion, "2.8.4") > 0) {
					let tmplIds = ["AhOFDO_Ik7bMch2mDnxBpix1-s6wceUNLPhJzUMSKt4", "3cEVA-rw4KOD9MkqPo4sMx0chT7j7hDMRA5M1ZfxxlI"];
					wx.requestSubscribeMessage({
						tmplIds: tmplIds,
						success (res) {
							uni.showToast({
								icon: 'none',
								title: '开启成功',
								duration: 2000
							})
							_this.openStatusShow = true
							_this.$store.commit("setMessageSubscribe", true);
							_this.$store.commit("setOpenStatus", true)
							_this.getSettingInfo(1)
						},
						fail (err) {  
							uni.showToast({
								icon: 'none',
								title: '订阅失败',
								duration: 2000
							})
						}
					})
				} else {
					// 提示版本过低，无法订阅消息
					uni.showToast({
							icon: 'none',
							title: '当前版本过低，无法使用该功能，请升级到最新版本后重试。',
							duration: 2000
					})
				}
			}
			
		},
		// 分享数据
		onShareAppMessage() {
			return this.public.baseShareData();
		},
		onHide() {},
		onPullDownRefresh() {},
		onUnload() {}
	}
</script>

<style lang="less" scoped>
.mine-message {
	padding-top: 22rpx;
	.message-open {
		position: fixed;
		top: 0;
		width: 100%;
		height: 120rpx;
		background: #FFFFFF;
		box-shadow: 0 0 32rpx 0 rgba(223,185,193,0.23);
		display: flex;
		align-items: center;
		justify-content: space-between;
		.message-open-tips {
			font-size: 26rpx;
			color: #0E0F12;
			font-weight: 600;
			padding-left: 36rpx;
		}
		.message-open-btn {
			width: 160rpx;
			height: 58rpx;
			background: #0E0F12;
			border-radius: 16rpx;
			margin-right: 40rpx;
			line-height: 58rpx;
			text-align: center;
			font-size: 25rpx;
			color: #FFFFFF;
			font-weight: 500;
		}
	}
	.message-open-zanwei {
		width: 100vw;
		height: 120rpx;
	}
	.message-item {
		width: 702rpx;
		margin: 0 auto 40rpx;
		.time {
			font-size: 18rpx;
			color: #DBDBDB;
			text-align: center;
			font-weight: 600;
		}
		.message-content {
			width: 702rpx;
			// min-height: 298rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 40rpx 36rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			display: flex;
			.photo {
				width: 136rpx;
				height: 136rpx;
				border-radius: 12rpx;
				margin-right: 26rpx;
			}
			.content {
				.title {
					max-width: 460rpx;
					word-wrap: break-word;
					word-break: break-all;
					font-size: 30rpx;
					color: #0E0F12;
					font-weight: 500;
				}
				.detail {
					max-width: 460rpx;
					word-wrap: break-word;
					word-break: break-all;
					margin-top: 18rpx;
					font-size: 28rpx;
					color: #999999;
					font-weight: 500;
				}
				.btn-box {
					display: flex;
					font-size: 28rpx;
					margin-top: 30rpx;
					.refuse {
						padding: 16rpx  24rpx;
						width: 176rpx;
						background: #F7F9FB;
						border-radius: 8rpx;
						color: #0E0F12;
						font-weight: 500;
						text-align: center;
						margin-right: 24rpx;
					}
					.refused {
						padding: 16rpx 24rpx;
						width: 176rpx;
						background: #F7F9FB;
						border-radius: 8rpx;
						color: #0E0F12;
						font-weight: 500;
						text-align: center;
						margin-right: 24rpx;
					}
					.agree {
						padding: 16rpx 24rpx;
						width: 176rpx;
						background: #0E0F12;
						border-radius: 8rpx;
						color: #FFFFFF;
						font-weight: 500;
						text-align: center;
					}
					.sended {
						padding: 16rpx 24rpx;
						width: 176rpx;
						background: #F7F9FB;
						border-radius: 8rpx;
						color: #0E0F12;
						// line-height: 58rpx;
						font-weight: 500;
						text-align: center;
					}
					.copy-wx {
						padding: 16rpx  24rpx;
						width: 176rpx;
						background: #0E0F12;
						border-radius: 8rpx;
						color: #FFFFFF;
						font-weight: 500;
						text-align: center;
					}
					
				}
			}
		}
	}
	.no-message {
		.no-message-icon{
			margin: 100rpx auto 0;
			width: 86rpx;
			height: 102rpx;
			background-image: url("@/static/newImage/blank/noMessage.png");
		}
		.no-message-content {
			margin-top: 20rpx;
			font-size: 28rpx;
			text-align: center;
			color: #000000;
			letter-spacing: 0;
			font-weight: 400;
		}
		
	}
}
.bg-image {
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-color: transparent;
}
.confirm-message{
	background: #FFFFFF;
	border-radius: 8px;
	width: 578rpx;
	height: 420rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 78rpx 50rpx 62rpx 50rpx;
	box-sizing: border-box;
	.confirm-title{
		font-size: 28rpx;
		color: #0E0F12;
		line-height: 28rpx;
		font-weight: 600;
		width: 100%;
		text-align: left;
	}
	.confirm-input{
		background: #F7F9FB;
		border-radius: 12rpx;
		width: 100%;
		height:54rpx;
		line-height: ;
		padding: 15rpx;
		font-size: 28rpx;
		font-weight: 600;
	}
	.confirm-bottom{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.confirm-close{
			background: #FFFFFF;
			border: 2rpx solid #0E0F12;
			border-radius: 36rpx;
			font-size: 24rpx;
			color: #0E0F12;
			line-height: 24rpx;
			font-weight: 600;
			width: 226rpx;
			height: 72rpx;
			text-align: center;
			line-height: 72rpx;
			box-sizing: border-box;
		}
		.confirm-send{
			background: #0E0F12;
			border-radius: 36rpx;
			font-size: 24rpx;
			color: #FDFEFE;
			line-height: 24rpx;
			font-weight: 600;
			width: 226rpx;
			height: 72rpx;
			text-align: center;
			line-height: 72rpx;
			box-sizing: border-box;
		}
	}
}
</style>
