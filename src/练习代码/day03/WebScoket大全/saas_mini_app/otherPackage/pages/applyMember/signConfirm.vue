<template>
	<view class="sign-info apply-page">
		<step-bar step="3"></step-bar>
		<view class="info-table">
			<view class="info-content">
				<view class="apply-letter">
					<view class="letter-name">深大会</view>
					<view class="letter-info">本人自愿加入深大会，履行会员义务，维护本会的声誉，特此申请</view>
					<view class="letter-time">{{public.formatTime(new Date(),"YYYY-MM-dd")}}</view>
				</view>
			</view>
			<view class="info-content">
				<view class="info-input">
					<view class="info-text">申请人</view>
					<input class="item-input" type="text" placeholder="请输入你的姓名" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx"  v-model="apply_user" maxlength="13"/>
				</view>
			</view>
			<view class="agree-protocol" @tap="isAgree = !isAgree"><view class="agree-icon background-box" :class="[isAgree ? 'agree' : '']"></view>我已阅读并同意<text @tap.stop="public.pageJump(`${baseUrl}/h5/index?name=protocols.html&type=protocols`)">《深大会入会协议》</text></view>
		</view>
		<view class="next-btn" @tap="nextStep">完成</view>
		
	</view>
</template>

<script>
	import { baseUrl } from "@/utils/base.js"
	import stepBar from "@/otherPackage/components/stepBar.vue"
	import { apiApply } from "@/api/apply.js"
	export default{
		components:{
			stepBar
		},
		mounted() {
			console.log("this.store",this.$store.state)
			for(let key in this.$store.state.apply){
				this.$data[key] = this.$store.state.apply[key] || this.$data[key]
			}
		},
		data(){
			return {
				apply_user: "",
				isAgree: false,
				baseUrl,
			}
		},
		methods:{
			// 完成
			nextStep(){
				if(!this.apply_user) return this.public.toast("请输入你的姓名")
				if(!this.isAgree) return this.public.toast("请认真阅读入会协议并选中同意")
				this.$store.commit("setData", this.$data);
				// apiApply({
				// 	...this.$store.state.apply,
				// 	openid: this.$store.state.openid,
				// 	wechat_id: "",
				// 	invite_id: this.$store.getters.invitor ? this.$store.getters.invitor : "",
				// }).then(res => {
				// 	console.log(res)
				// 	this.public.toast("提交成功")
				// 	this.$store.dispatch("getUserDetails")
				// 	setTimeout(() => {
				// 		this.public.pageJump("/pages/me/joinData","reLaunch")
				// 	},500)
				// })
				// .catch(res => {
				// 	this.public.toast(res.msg)
				// 	setTimeout(() => {
				// 		this.public.pageJump("/pages/home/main")
				// 	},500)
				// })
				
				let _this = this;
				if(this.public.compareVersion(this.$store.getters.systemInfo.SDKVersion, "2.8.4") > 0) {
					let tmplIds = ["gNWwCCcJC6auoUPFHvE2LlSBsYIfxiunvJRX_kRqnRY"];
					wx.requestSubscribeMessage({
						tmplIds: tmplIds,
						success (res) {
							tmplIds.forEach(e => {
								if (res[e] === "accept") {
									uni.showToast({
										title: "订阅成功",
										icon: "none",
										duration: 2000
									});
								} else {
									uni.showToast({
										title: "取消订阅",
										icon: "none",
										duration: 2000
									});
								}
							})
							_this.confirmApply()
						},
						fail (err) {  
							uni.showToast({
								icon: 'none',
								title: '订阅失败',
								duration: 2000
							})
							_this.confirmApply()
						}
					})
				} else {
					// 提示版本过低，无法订阅消息
					uni.showToast({
						icon: 'none',
						title: '当前版本过低，无法使用该功能，请升级到最新版本后重试。',
						duration: 2000
					})
					_this.confirmApply()
				}
			},
			async confirmApply() {
				console.log("confirmApply" , this.$store.state.apply)
				await apiApply({
					...this.$store.state.apply,
					openid: this.$store.state.openid,
					wechat_id: "",
					invite_id: this.$store.getters.invitor ? this.$store.getters.invitor : "",
				}).then(res => {
					console.log(res)
					this.public.toast("提交成功")
					this.$store.dispatch("getUserDetails")
					setTimeout(() => {
						this.public.pageJump("/pages/me/joinData","reLaunch")
					},500)
				})
				.catch(res => {
					this.public.toast(res.msg)
					// setTimeout(() => {
					// 	this.public.pageJump("/pages/home/main")
					// },500)
				})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	@import url("apply.less");
	.apply-letter{
		width: 100%;
		padding: 12rpx 20rpx 18rpx 34rpx;
		box-sizing: border-box;
		.letter-name{
			font-size: 32rpx;
			color: #0E0F12;
			font-weight: 600;
		}
		.letter-info,.letter-time{
			font-size: 28rpx;
			color: #0E0F12;
			line-height: 44rpx;
			font-weight: 600;
			margin-top: 26rpx;
		}
		.letter-time{
			text-align: right;
			margin-top: 94rpx;
		}
	}
	.agree-protocol{
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #0E0F12;
		line-height: 28rpx;
		font-weight: 600;
		margin-top: 6rpx;
		margin-left: 44rpx;
		.agree-icon{
			width: 36rpx;
			height: 36rpx;
			background-image: url("@/static/newImage/public/select_no.png");
			margin-right: 14rpx;
			&.agree{background-image: url("@/static/newImage/public/select_black.png");}
		}
		text{
			color: #F40012;
		}
	}
</style>