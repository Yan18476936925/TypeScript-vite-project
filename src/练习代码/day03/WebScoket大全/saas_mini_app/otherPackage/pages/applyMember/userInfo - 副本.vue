<template>
	<view class="user-info apply-page">
		<step-bar step="0"></step-bar>
		<view class="info-table">
			<view class="info-content">
				<view class="info-img" @tap="selectImage">
					<image :src="photo + '?imageMogr2/thumbnail/!95'" v-if="photo" mode="aspectFit">
					<view class="up-img background-box" v-else></view>
				</view>
				
				<view class="info-input right-padding">
					<view class="info-text">姓名</view>
					<input class="item-input" type="text" placeholder="请输入你的真实姓名" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx"  v-model="name" maxlength="13"/>
				</view>
				
				<view class="info-radio right-padding">
					<view class="info-text">性别</view>
					<view class="radio-btn">
						<view class="radio-item" :class="[sex == item.value ? 'choose-btn' : '']" v-for="(item,index) in sexList" :key="index" @tap="sex = item.value">{{item.text}}</view>
					</view>
				</view>
				
				<view class="info-radio">
					<view class="info-text">生日庆祝</view>
					<view class="radio-btn">
						<view class="radio-item" :class="[birthday_type == item.value ? 'choose-btn' : '']" v-for="(item,index) in birthList" :key="index" @tap="birthday_type = item.value">{{item.text}}</view>
					</view>
				</view>
				
				<!-- <view class="info-picker">
					<view class="info-text">生日</view>
					<uni-datetime-picker
						type="date"
						:vlaue="birthday"
						:start="1900-1-1"
						:end="`${new Date().getFullYear() +'-'+`${new Date().getMonth() + 1}`+'-'+`${new Date().getDate()}`}`"
						@change="changeData($event,'birthday')"
					>
						<view class="info-picker-text" :class="[birthday ? 'hava-value' : '']">{{birthday ? birthday : '请选择'}}</view>
					</uni-datetime-picker>
				</view> -->
				<view class="info-picker">
					<view class="info-text">生日</view>
					<view class="info-picker-text" :class="[birthday ? 'hava-value' : '']">
						<picker mode="date" :value="birthday" start="1900-1-1" :end="`${new Date().getFullYear() +'-'+`${new Date().getMonth() + 1}`+'-'+`${new Date().getDate()}`}`" @change="changeData($event,'birthday')">{{birthday ? birthday : '请选择'}}
						</picker>
					</view>
				</view>
				
				<view class="info-picker">
					<view class="info-text">籍贯</view>
					<view class="info-picker-text" :class="[native_place ? 'hava-value' : '']" @tap="chooseSiteType=0;chooseCity();">{{native_place ? native_place : '请选择'}}</view>
				</view>
				
				<view class="info-input">
					<view class="info-text">民族</view>
					<input class="item-input" type="text" placeholder="请输入" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx" v-model="national" maxlength="10"/>
				</view>
			</view>
			
			<view class="info-content">
				<view class="info-input">
					<view class="info-text">手机号</view>
					<input class="item-input" type="number" placeholder="请输入你的手机号" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx" v-model="phone" maxlength="11"/>
				</view>
				
				<view class="info-input">
					<view class="info-text">邮箱</view>
					<input class="item-input" type="text" placeholder="请输入你的邮箱（选填）" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx" v-model="email" maxlength="25"/>
				</view>
				
				<view class="info-input">
					<view class="info-text">所在地区</view>
					<view class="info-picker-text" :class="[home_address ? 'hava-value' : '']" @tap="chooseSiteType=1;chooseCity();">{{home_address ? home_address : '请选择当前居住的所在地区'}}</view>
				</view>
				
				<view class="info-input">
					<view class="info-text">详细地址</view>
					<input class="item-input" type="text" placeholder="请输入当前居住的详情地址（选填）" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx" v-model="home_detailed" maxlength="30"/>
				</view>
			</view>
			
			<view class="info-content">
				<view class="info-input">
					<view class="info-text">社会职务</view>
					<input class="item-input" type="text" placeholder="如人大代表、商会等社会职务（选填）" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx" v-model="social_position" maxlength="20"/>
				</view>
			</view>
			
			<view class="info-content">
				<view class="info-textarea">
					<view class="info-text">兴趣爱好</view>
					<textarea class="item-textarea" cursor-spacing="90" type="text" v-model="hobbies" maxlength="50" placeholder="例如高尔夫、户外运动、摄影等" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx"  cols="30" rows="10"></textarea>
				</view>
			</view>
			
			<view class="next-btn" @tap="nextStep">下一步</view>
		</view>
 <ksp-cropper mode="fixed" :width="200" :height="200" :url="kspUrl" @cancel="oncancel" @ok="onok"></ksp-cropper>
		<!-- picker地区选择 -->
		<single-picker :show.sync="isSelectTown" :list="townList" title="选择乡镇" @chooseItem="chooseTown"></single-picker>
		<mpvue-city-picker ref="mpvueCityPicker" :showArea="chooseSiteType" :siteList="siteList" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import stepBar from "@/otherPackage/components/stepBar.vue"
	import singlePicker from "@/componentsLib/publicComponents/singlePicker.vue"
	import mpvueCityPicker from "@/componentsLib/publicComponents/mpvueCityPicker.vue"
	import { getUserInfo } from "@/utils/wxApi.js"
	import { apiGetDivision } from "@/api/apply.js"
	import { getNetworkType } from "@/utils/wxApi.js"
	import { getQiniuToken } from "@/api/index/index.js"
	import qiniuUploader from '@/utils/qiniuUploader.js' 
	export default{
		components:{
			stepBar,
			singlePicker,
			mpvueCityPicker
		},
		data(){
			return {				
				photo: "",								// 头像
				name: "",								// 姓名
				sex: -1,								// 性别 1男2女
				sexList: [
					{text:"女",value:2},
					{text:"男",value:1},
				],
				birthday_type: -1,						// 生日庆祝 1阴历 2阳历
				birthList: [
					{text:"农历",value:1},
					{text:"阳历",value:2},
				],
				birthday: "",							// 生日 （格式 1996-01-01）
				native_place: "",						// 籍贯 (例如 广东 深圳)
				national: "",							// 民族
				phone: "",								// 手机号
				email: "",								// 邮箱
				home_province: 0,						// 居住省份id
				home_city: 0,							// 居住城市id
				home_area: 0,							// 居住县区id
				home_street: 0,							// 居住街道id
				home_address: "",						// 居住地址（展示用）
				home_detailed: "",						// 居住地址详情
				social_position:"",						// 社会职务
				hobbies:"",								// 兴趣爱好
				
				kspUrl:"",								// 裁剪图片临时Url
				siteList: [],							// 三级地址列表
				chooseSiteType: 0,						// 地址弹窗类型 0籍贯 1住址
				regionId: "", 							// 省市区选择结果id集合
				customItem: "请选择",					// 省市区placeholder
				isSelectTown: false, 					// 是否打开乡镇选择弹窗
				townList: [], 							// 乡镇数据列表
				selectId: -1, 							// 区id
				id: "", 								// 修改地址id 没有代表为新增
				edit_act: 0, 							// 判断是否是组件中进入，1--是 0--不是
				isGet: 0, 								// 防止二次点击
				cityPickerValueDefault: [0, 0, 1],
				isDoing: false,                 		// 是否在选择城镇
				addrs: [],
				region: [], 							// 省市区选择结果
				selectTown: "", 						// 选择的乡镇
				switchVal: false, 						// 是否默认
			}
		},
		async mounted() {
			uni.showLoading({
				title: '加载中',
				mask: true,
			})
			this.$store.dispatch("getUserDetails")
			console.log("this.$store.state.user.status",this.$store.state.user.status)
			if(this.$store.state.user.status != -1 && this.$store.state.user.status != 2){
				uni.showLoading({
					title: '加载中',
					mask: true,
				})
				this.public.pageJump("/pages/me/joinData","redirectTo")
				uni.hideLoading()
			}else{
				uni.hideLoading()
			}
			await this.$store.dispatch("rejectedDetail")
			console.log("this.store",this.$store.state.apply)
			for(let key in this.$store.state.apply){
				this.$data[key] = this.$store.state.apply[key] || this.$data[key]
			}
		},
		methods:{
			selectImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						console.log('res__:', res)
						this.kspUrl = res.tempFilePaths[0]
						// const networkType = await getNetworkType()
						// if (networkType === 0) {
						// 	uni.showToast({
						// 		title: '当前网络异常，请检查网络',
						// 		icon: 'none'
						// 	})
						// 	return
						// }
						// uni.showLoading({
						// 	title: "图片上传中..."
						// })
						// try {
						// 	let upload = {}
						// 	upload = await this.uploadFunc(res.tempFilePaths[0])
						// 	this.photo = upload.imageURL
						// 	console.log("this.photo",this.photo)
						// 	uni.hideLoading();
						// } catch(e) {
						// 	uni.hideLoading();
						// 	uni.showToast({
						// 		title: '添加失败,请重试',
						// 		icon: 'none'
						// 	})
						// }
					}
				})
			},
			async uploadFunc(file) {
				let fileInfo = await this.public.getImageInfo(file)
				return new Promise(async (resolve, reject) => {
					const fileName = `photo${this.public.uuid()}`
					let data
					try {
						data = await getQiniuToken({
							bucket: "imeach",
							type: "PhotoServlet",
							ext: fileInfo.type,
						})
					} catch(e) {
						console.log("e___", e)
						return
					}
					
					qiniuUploader.upload(file, (res) => {
						// 上传成功
						resolve(res)
					}, (error) => {
						// 失败
						reject(error)
					}, {
						region: 'ECN',
						domain: 'https://duimianimg.loovee.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
						key: 'MediaServerMblove/servlet/Proxy/PhotoServlet/' + fileName, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
						uptoken: data.token,
					})
				})
			},
			async onok(ev) {
			    this.kspUrl = "";
			    const networkType = await getNetworkType()
			    if (networkType === 0) {
			    	uni.showToast({
			    		title: '当前网络异常，请检查网络',
			    		icon: 'none'
			    	})
			    	return
			    }
			    uni.showLoading({
			    	title: "图片上传中..."
			    })
			    try {
			    	let upload = {}
			    	upload = await this.uploadFunc(ev.path)
			    	this.photo = upload.imageURL
			    	console.log("this.photo",this.photo)
			    	uni.hideLoading();
			    } catch(e) {
			    	uni.hideLoading();
			    	uni.showToast({
			    		title: '添加失败,请重试',
			    		icon: 'none'
			    	})
			    }
			},
			 oncancel() {
			    this.kspUrl = "";
			},
			changeData(info,type){
				this[type] = info.detail.value
			},
			// 获取乡镇信息
			async getTownList() {
				try {
					let data = await apiGetDivision({parent_id: this.regionId})
					this.selectTown = "";
					this.selectId = -1;
					this.townList = data;
					this.townList.length && (this.isSelectTown = true)
					this.isDoing = false;
				} catch(err) {
					console.log("err",err)
					this.isDoing = false;
				}
			},
			// 乡镇选择
			chooseTown(item) {
				console.log("chooseTown",item)
				this.selectTown = item;
				this.selectId = item.value;
				this.home_street = this.selectTown.value
				console.log("this.selectTown.value",this.selectTown.value)
				this.home_address = this.home_address + " " + this.selectTown.label
			},
			// 省市区选择
			async chooseCity() {
				console.log("chooseCity")
				if(this.isDoing) {
					uni.showToast({
						title: "操作过快，请稍等~",
						icon: "none",
						duration: 1500
					})
				} else {
					// console.log("this.chooseSiteType",this.chooseSiteType)
					// if (this.chooseSiteType == 1) {
					// 	this.siteList = await apiGetDivision({parent_id: this.regionId})
					// }
					this.$refs.mpvueCityPicker.show();
				}
			},
			onConfirm(e) {
				// 确认省市区选择
				// let pickerText = JSON.stringify(e); // 填写的城市 得出的是一串字符串，传给服务器的需要是数组
				let pickerText = e; // 填写的城市 得出的是一串字符串，传给服务器的需要是数组
				this.regionId = e.areaCode;
				this.region = e.label.split("-");
				console.log("this.region",this.region,e)
				this.isDoing = true;
				if (this.chooseSiteType == 1) {
					this.home_province = e.provinceCode
					this.home_city =  e.cityCode
					this.home_area =  e.areaCode
					this.home_address = this.region.join(" ")
					console.log("this.regionId",this.regionId)
					if(!!this.regionId){
						this.getTownList();
					}else{
						this.home_street = 0
					}
				}else{
					this.native_place = this.region[0] + " " + this.region[1]
					this.isDoing = false;
				}
			},
			onCancel(e) {
				this.isDoing = false;
			},
			// 下一步
			nextStep(){
				if(!this.photo) return this.public.toast("请上传照片")
				if(!this.name) return this.public.toast("请输入姓名")
				if(this.sex < 0) return this.public.toast("请选择性别")
				if(this.birthday_type < 0) return this.public.toast("请选择生日庆祝，方便协会为你庆祝")
				if(!this.birthday) return this.public.toast("请选择生日")
				if(!this.native_place) return this.public.toast("请选择籍贯")
				if(!this.national) return this.public.toast("请输入民族")
				if(!this.phone) return this.public.toast("请输入手机号")
				if(!/^[1][0-9]{10}$/.test(this.phone)) return this.public.toast("请输入正确的手机号")
				if(!this.home_address) return this.public.toast("请选择所在地区")
				if(!this.hobbies) return this.public.toast("请输入兴趣爱好")
				this.$store.commit("setData", this.$data);
				this.public.pageJump("/otherPackage/pages/applyMember/stuInfo")
			}
		}
	}
</script>

<style lang="less" scoped>
	@import url("apply.less");
</style>