<template>
	<view class="site-info">
		<view class="location-open" v-if="userPermissions.locationInfo == -1">
			<view class="location-open-tips">开启定位，获取精确位置信息</view>
			<view class="location-open-btn" @tap="getAddress()">开启</view>
		</view>
		<view class="site-class">
			<view class="class-item":class="[item.id == siteId ? 'choose-class' : '']" v-for="(item, index) in site_class" :key="item.id" @tap="chooseSiteClass(item)">{{item.title}}</view>
		</view>
		<view class="site-list-content">
			<view class="list-tab">
				<view class="tab-item" :class="[is_nearby == index ? 'choose-tab' : '']" v-for="(item, index) in siteTab" :key="index" @tap="is_nearby = siteLoading ? is_nearby : index">
					{{item.name}}
				</view>				
			</view>
			<scroll-view class="list-content-scroll" @scrolltolower="nextSiteList" scroll-y="true" :lower-threshold="500">
				<view class="list-content">
					<view class="list-line" v-for="(list, indexs) in 2" :key="indexs">
						<view class="list-item" v-for="item in siteList.filter((e,i) => i%2 == indexs)" :key="item.id" @tap="pageJump(`/otherPackage/pages/siteInfo/detail?site_id=${item.id}`)">
							<image class="item-img" :src="item.cover_img" mode=""></image>
							<view class="item-title overflow-wrap">{{item.title}}</view>
							<view class="item-bottom">
								<view class="discount-info" v-if="!!item.discount">{{item.discount}}折</view>
								<view class="item-creator" v-else>
									<image class="item-photo" :src="item.creator_photo" mode=""></image>
									<view class="item-name">{{item.creator_name}}</view>
								</view>
								<view class="item-addr" v-if="!!item.distance && userPermissions.locationInfo == 1">{{item.distance}}</view>
								<view class="item-addr" v-else-if="item.province || item.city">{{item.province}}<text v-if="item.province != item.city">{{item.city}}</text></view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex"
	import { pageJump } from "@/utils/index.js"
	import { apiHomeSiteList, apiHomeSiteClassList } from "@/api/home.js"
	export default {
		data() {
			return {
				pageJump,
				site_class: [],				// 场地分类列表
				siteList: [],				// 场地列表
				siteId: -1,					// 选中的场地id
				sitePage: 1,				// 场地页码
				siteLoading: false,			// 场地列表加载中
				siteMore: true,				// 场地列表是否还有更多
				
				siteTab:[
					{name: "全部", show:1},
					{name: "附近", show:1},
				],							// tab
				is_nearby: 0,				// 是否选择附近 1是 0不是
			}
		},
		computed: {
			...mapGetters([
				"userPermissions",
				"userLocationInfo",
		    ])
		},
		async onLoad() {
			await this.getHomeClassSiteList()
			this.getHomeSiteList()
		},
		watch:{
			is_nearby(val){
				this.getHomeSiteList()
			}
		},
		methods: {
			// 获取场地分类列表
			async getHomeClassSiteList(){
				await apiHomeSiteClassList()
					.then(res => {
						this.site_class = res
						this.siteId = this.site_class[0] ? this.site_class[0].id : -1
					})
			},
			// 获取场地列表
			getHomeSiteList(init = 1){
				if(this.siteLoading){
					return
				}
				if(init){
					this.siteList = []
					this.sitePage = 1
				}
				this.siteLoading = true
				apiHomeSiteList({
					page: this.sitePage,
					site_class: this.siteId,
					is_nearby: this.is_nearby,
				})
					.then(res => {
						this.siteList = this.siteList.concat(res.list)
						this.siteList.forEach(l => l.discount = +l.discount)
						this.siteMore = this.siteList.length < res.total
						if(this.userPermissions.locationInfo != -1) {
							// this.getAddress(1)
							this.formatList()
						}
					})
					.finally(() => {
						this.siteLoading = false
					})
			},
			// 选择场地分类
			chooseSiteClass(item){
				if(this.siteLoading){
					return
				}
				this.siteId = item.id
				this.getHomeSiteList()
			},
			// 场地列表加载更多
			nextSiteList(){
				console.log("场地列表加载更多")
				if(this.siteLoading || !this.siteMore){
					console.log("没有更多了")
					return
				}
				this.sitePage ++
				this.getHomeSiteList(0)
			},
			// async getLocation() {
			// 	const that = this;
			// 	try {
			// 	    await that.getWxLocation()
			// 	} catch (error) {
			// 	    // Model({
			// 	    //     title: '温馨提示',
			// 	    //     tip: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
			// 	    //     showCancel: true,
			// 	    //     confirmText: '前往设置',
			// 	    //     cancelText: '取消',
			// 	    //     sureCall() {
			// 	    //       that.toSetting()
			// 	    //     },
			// 	    //     cancelCall() {}
			// 	    // })
			// 		uni.showModal({
			// 			title: '温馨提示',
			// 			// content: '当前定位未开启，请点击确定手动开启定位',
			// 			content: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
			// 			duration: 3000,
			// 			success: (res) => {
			// 				if (res.confirm) {
			// 				   this.openSetting()//点击确定引导客户开启定位
			// 				} else if (res.cancel) {
			// 					uni.showToast({
			// 						title: '你拒绝了授权，无法获取当前定位信息',
			// 						duration: 2000,
			// 						icon: "none"
			// 					});
			// 				}
			// 			}
			// 		});
			// 	    return
			// 	}
			// },
			// // 获取位置信息
			// getWxLocation() {
			// 	wx.showLoading({
			// 		title: '定位中...',
			// 		mask: true,
			// 	})
			// 	return new Promise((resolve, reject) => {
			// 		const _locationChangeFn = (res) => {
			// 		console.log('location change', res)
			// 			wx.hideLoading()
			// 			wx.offLocationChange(_locationChangeFn)
			// 		}
			// 		wx.startLocationUpdate({
			// 			success: (res) => {
			// 				wx.onLocationChange(_locationChangeFn)
			// 				resolve()
			// 			},
			// 			fail: (err) => {
			// 				reject()
			// 			}
			// 		})
			// 	})
			// },
			// // 调起客户端小程序设置界面
			// toSetting() {
			// 	wx.openSetting({
			// 		success(res) {
			// 			if (res.authSetting["scope.userLocation"]) {
			// 				this.authorization()
			// 			}
			// 		}
			// 	})
			// },
			getAddress(type) {
				let that = this
				wx.getLocation({
					type: 'gcj02', //返回可以用于 wx.openLocation 的经纬度
					success (res) {
						if(!type) {							
							uni.showToast({
								icon: "none",
								title: "授权成功",
								duration: 2000
							})
						}
						that.$store.commit("setUserLocationInfo", {
							latitude: res.latitude,
							longitude: res.longitude
						});
						that.$store.commit("setUserPermissionsKey", {
							key: 'locationInfo',
							val: 1
						});
						uni.$emit("APP_LOCALTION_REFRESH", {
							latitude: res.latitude,
							longitude: res.longitude
						});
						that.formatList()
					},
					fail (err) {
						if(err.errMsg.indexOf('system permission denied') != -1) {
							uni.showToast({
								icon: "none",
								// title: "系统授权未开启",
								title: "微信位置授权未开启\r\n请前往手机设置开启",
								duration: 2000
							})
						} else if(err.errMsg == 'getLocation:fail auth deny') {
							// uni.showToast({
							// 	icon: "none",
							// 	title: "取消授权",
							// 	duration: 2000
							// })
							that.getSetting()
						} else {							
							uni.showToast({
								icon: "none",
								title: "授权失败",
								duration: 2000
							})
						}
						that.$store.commit("setUserPermissionsKey", {
							key: 'locationInfo',
							val: -1
						});
					},
				})
			},
			formatList() {
				if(!this.siteList || this.siteList.length <= 0) return
				this.siteList.map(i => {
					i.distance = this.calculateDistanceFunc(this.userLocationInfo.latitude, this.userLocationInfo.longitude, i.lat, i.lng) || ''
					// i.distance = this.public.calculateDistanceFunc(this.userLocationInfo.latitude, this.userLocationInfo.longitude, i.lat, i.lng) || ''
					return i
				})
			},
			Rad(d) {
				//根据经纬度判断距离
				return d * Math.PI / 180.0;
			},
			calculateDistanceFunc(lat1, lng1, lat2, lng2) {
				var radLat1 = this.Rad(lat1);
				var radLat2 = this.Rad(lat2);
				var a = radLat1 - radLat2;
				var b = this.Rad(lng1) - this.Rad(lng2);
				var r = 6378.137;
				var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				distance = distance * r;
				distance = Math.round(distance * 10000) / 10000;
				console.log('distance', typeof distance, distance)
				
				if(distance < 1 && distance > 0) {
					// distance = (distance * 1000).toFixed(1) + 'm'
					// if(((distance * 1000 + '').indexOf('.') != -1)) {
					// 	console.log('111')
					// 	distance = (distance * 1000).toFixed(1) + 'm'
					// } else {
					// 	console.log('222')
					// 	distance = (distance * 1000) + 'm'
					// }
					distance = ((distance * 1000 + '').indexOf('.') != -1) ? (distance * 1000).toFixed(1) + 'm' : (distance * 1000) + 'm'
				} else if(distance <= 0) {
					distance = '您已在这里'
				} else {
					// distance = distance.toFixed(1) + 'km'
					distance = ((distance + '').indexOf('.') != -1) ? distance.toFixed(1) + 'km' : distance + 'km'
				}
				return distance
			},
			getSetting(item) {
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.userLocation']) {
							// 选择位置信息
							this.getAddress()// 重新调取uni.getLocation
						} else {
							//2.用户第一次进来发起授权
							uni.showModal({
								title: '提示',
								// content: '当前定位未开启，请点击确定手动开启定位',
								content: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
								duration: 3000,
								success: (res) => {
									if (res.confirm) {
									   this.openSetting()//点击确定引导客户开启定位
									} else if (res.cancel) {
										// uni.showToast({
										// 	title: '你拒绝了授权，无法获取当前定位信息',
										// 	duration: 2000,
										// 	icon: "none"
										// });
									}
								}
							});
						}
					}
				})
			},
			openSetting() {
				uni.openSetting({
					success: (res) => {
						if (res.authSetting['scope.userLocation']) {
							// 5.用户在设置中点击了允许，调用选择位置信息函数
							 this.getAddress()// 重新调取uni.getLocation
						} else {
							// 5.用户在设置中点击了不允许，展示拒绝授权信息
							// uni.showToast({
							// 	title: '你拒绝了授权，无法操作内容',
							// 	icon: "none",
							// 	duration: 3000,
							// })
						}
					},
					fail: (err) => {
						console.log("打开设置失败", err)
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.site-info{
	width: 100vw;
	min-height: 100vh;
	background: #FCE5E5;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.location-open {
		// position: fixed;
		// top: 0;
		width: 100%;
		height: 120rpx;
		background: #FFFFFF;
		box-shadow: 0 0 32rpx 0 rgba(223,185,193,0.23);
		display: flex;
		align-items: center;
		justify-content: space-between;
		.location-open-tips {
			font-size: 26rpx;
			color: #0E0F12;
			font-weight: 600;
			padding-left: 36rpx;
		}
		.location-open-btn {
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
	.site-class{
		display: flex;
		align-items: center;
		padding: 0 28rpx;
		overflow-y: hidden;
		overflow-x: scroll;
		height: 112rpx;
		margin-bottom: 24rpx;
		.class-item{
			background: #FFFFFF;
			border-radius: 20rpx;
			font-size: 26rpx;
			color: #242524;
			font-weight: 600;
			min-width: 128rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			margin-right: 28rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
			white-space: nowrap;
			&:last-child{
				margin-right: 0;
			}
			&.choose-class{
				background: #F40012;
				border-radius: 22rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				height: 44rpx;
				line-height: 44rpx;
			}
		}
	}
	.site-list-content{
		width: 100vw;
		height: calc(100vh - 112rpx - 24rpx);
		background: #FFFFFF;
		position: relative;
		padding: 6rpx 28rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		&::before{
			content: "";
			position: absolute;
			top: -24rpx;
			left: 50%;
			transform: translate(-50%);
			border-radius: 24rpx 24rpx 0 0;
			width: 100vw;
			height: 24rpx;
			background: #FFFFFF;
		}
		.list-tab{
			display: flex;
			align-items: center;
			.tab-item{
				font-size: 32rpx;
				color: #999999;
				font-weight: 600;
				position: relative;
				margin: 0 22rpx;
				&.choose-tab{
					color: #0E0F12;
					&::after{
						content: "";
						background: #F40012;
						border-radius: 3px;
						width: 24rpx;
						height: 4rpx;
						position: absolute;
						bottom: -8rpx;
						left: 50%;
						transform: translate(-50%);
					}
				}
			}
		}
		.list-content-scroll{
			background: #FFFFFF;
			flex: 1;
			margin-top: 36rpx;
			overflow-y: scroll;
			overflow-x: hidden;
		}
		.list-content{
			display: flex;
			align-items: start;
			justify-content: space-between;
			.list-line{
				display: flex;
				flex-direction: column;
				align-items: center;
				.list-item{
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 0 5rpx;
					.item-img{
						width: 332rpx;
						height: 242rpx;
						border-radius: 16rpx;
						margin-bottom: 10rpx;
					}
					.item-title{
						width: 100%;
						font-size: 28rpx;
						color: #0E0F12;
						font-weight: 600;
						margin-bottom: 18rpx;
					}
					.item-bottom{
						width: 100%;
						display: flex;
						justify-content: space-between;
						font-size: 20rpx;
						color: #999999;
						line-height: 20rpx;
						font-weight: 600;
						margin-bottom: 58rpx;
						.discount-info{
							background: #F40012;
							border-radius: 12rpx 2rpx 12rpx 2rpx;
							font-size: 22rpx;
							color: #FFFFFF;
							font-weight: 600;
							padding: 0 12rpx;
							height: 26rpx;
							line-height: 26rpx;
						}
						.item-creator{
							display: flex;
							align-items: center;
							.item-photo{
								width: 24rpx;
								height: 24rpx;
								border-radius: 50%;
								margin-right: 8rpx;
							}
						}
						.item-addr{
							display: flex;
							align-items: center;
							&::before{
								content: "";
								width: 12rpx;
								height: 14rpx;
								background: url("@/static/newImage/public/site-red.png");
								background-position: center;
								background-size: 100% 100%;
								background-repeat: no-repeat;
								margin-right: 10rpx;
							}
						}
					}
				}
			}
		}
	}
}
</style>
