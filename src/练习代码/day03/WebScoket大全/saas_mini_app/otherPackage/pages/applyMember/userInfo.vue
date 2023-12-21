<template>
	<view class="userInfo_page">
		<view class="userInfo_header">
			<view
				:class="[`per`, `${aniRun && stepAniIndex != 7 ? `per_move` : ''}`, `${stepAniIndex == 7 ? `per_move_end` : ''}`]"
				:style="{ left: `${positionIndex * 89.5}rpx` }"></view>
			<view class="stepList">
				<view class="step_item" v-for="item in 8" :key="item">
					<view :class="[`${stepAniIndex >= item ? 'progress' : ''}`]"></view>
				</view>
			</view>
		</view>
		<view class="">
			<stepItem :stepIndex="stepIndex" @next="next" @pre="pre" @submit="submit" />
		</view>
	</view>
</template>

<script>
	let aniRunTimer = null;
	import userInfoList from './stepItem/userInfo.js';
	import stepItem from './stepItem/stepItem';
	export default {
		data() {
			return {
				stepIndex: 0,
				stepAniIndex: 0,
				aniRun: false,
				positionIndex: 0,
				submitTab: false,
				userInfoList,
				// ifEdit:false
			};
		},
		components: {
			stepItem
		},
		onLoad(options) {

			console.log(options,'options.ifEdit')
			// if(!!options.ifEdit){
			// 	this.ifEdit = options.ifEdit
			// }
		},
		async mounted() {
			uni.showLoading({
				title: '加载中',
				mask: true,
			})
			this.$store.dispatch("getUserDetails")
			console.log("this.$store.state.user.status", this.$store.state.user.status)
			// if (this.$store.state.user.status != -1 && !this.ifEdit) {
			// 	this.public.pageJump("/pages/me/joinData", "redirectTo")
			// }
			uni.hideLoading()
		},
		methods: {
			next(infoData) {
			console.log(this.aniRun,'this.aniRun')
				if (this.aniRun) {
					return;
				}
				console.log(this.stepIndex,'-------------',this.stepAniIndex)
				// 检查是否有未填写的信息
				if (!!this.checkNull(infoData)) {
					return
				}
				this.stepIndex += 1;
				if (this.stepAniIndex < this.stepIndex) {
					this.aniRun = true;
					this.stepAniIndex += 1;
				}
				let time = this.stepIndex != 7 ? 1500 : 2000;

				clearTimeout(aniRunTimer);
				aniRunTimer = setTimeout(() => {
					this.aniRun = false;
					this.positionIndex = this.stepIndex < 7 ? this.stepAniIndex : 6;
				}, time);
				console.log(this.stepIndex);
			},
			checkNull(data) {
				let flag = false
				let ifNotWirte = false;
				let notWriteField = {};
				for (let i = 0; i < this.userInfoList[this.stepIndex].infoList.length; i++) {
					let item = this.userInfoList[this.stepIndex].infoList[i];
					if (!data[item.fields] && !item.ifSkip) {
						ifNotWirte = true;
						notWriteField = item;
						break;
					}
				}
				if (ifNotWirte) {
					uni.showToast({
						title: `${notWriteField.message}`,
						icon: 'none'
					});
					flag = true
				}
				return flag
			},
			pre() {
				this.stepIndex -= 1;
			},
			submit(infoData) {
				console.log(infoData, '--------------------')
				if (!!this.checkNull(infoData)) {
					return
				}
				console.log(encodeURIComponent(JSON.stringify(infoData)),'--------------encodeURIComponent(JSON.stringify(infoData))')
				uni.navigateTo({
					url: `/otherPackage/pages/applyMember/applyAgreement?infoData=${encodeURIComponent(JSON.stringify(infoData))}`
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	.userInfo_page {
		.userInfo_header {
			position: relative;
			width: 750rpx;
			height: 250rpx;
			background-image: url('https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/Fhj2eKRibvYYs-4gIq-p_34VI1uw.png');
			background-size: 100% 100%;

			.per {
				position: absolute;
				left: 0;
				bottom: 74rpx;
				width: 109rpx;
				height: 130rpx;
				// background-image: url('https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FlknXck34P4L_DuSsshEl67esF82.png');
				background-image: url('https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FjxttuyVvs8IBbGX0YoxWLFs3rFW.png');
				// background-size:4578rpx 130rpx;
				background-size: 3488rpx 130rpx;
				// animation-name: run;
				// animation-duration:2s;
				// animation-timing-function:steps(42);
				animation: run 2s steps(32) infinite;
			}

			@keyframes run {
				from {
					background-position: 0;
				}

				to {
					background-position: -3488rpx;
				}
			}

			.stepList {
				position: absolute;
				left: 0;
				bottom: 50rpx;
				width: 750rpx;
				overflow-x: hidden;
				display: flex;
				justify-content: center;

				.step_item {
					margin: 0 20rpx;
					width: 54rpx;
					height: 8rpx;
					background: rgba(255, 255, 255, 0.4);
					border-radius: 1px;

					.progress {
						height: 100%;
						background-color: #fff;
						animation: progress-bar 1.5s ease-in-out forwards;
					}
				}

				@keyframes progress-bar {
					0% {
						width: 0%;
					}

					100% {
						width: 100%;
					}
				}
			}

			.per_move {
				animation-name: move;
				animation-duration: 1.5s;
			}

			@keyframes move {
				from {
					transform: translateX(0rpx);
					background-position: 0;
				}

				to {
					transform: translateX(93.5rpx);
					background-position: -3488rpx;
				}
			}

			.per_move_end {
				background-image: url('https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FlknXck34P4L_DuSsshEl67esF82.png');
				background-size: 4578rpx 130rpx;
				animation: move_end 2s steps(41);
				animation-fill-mode: forwards;
			}

			@keyframes move_end {
				from {
					transform: translateX(0rpx);
					background-position: 0;
				}

				to {
					transform: translateX(93.5rpx);
					// background-position: -4578rpx;
					background-position: -4469rpx;
				}
			}
		}
	}
</style>