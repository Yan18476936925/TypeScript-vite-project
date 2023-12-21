<template>
	<view class="edit_page">
		<view class="select_item" v-if="editData.fields == 'sex'">
			<view class="select_sex_item" @click="sexId = 1">
				<text>男</text>
				<view :class="[`select_icon`,`${sexId == 1?'select_c':''}`]">
				</view>
			</view>
			<view class="line-x"></view>
			<view class="select_sex_item" @click="sexId = 2">
				<text>女</text>
				<view :class="[`select_icon`,`${sexId == 2?'select_c':''}`]">
				</view>
			</view>
		</view>
		<view class="" v-else-if="editData.fields == 'home_address'||editData.fields == 'business_address'">
			<view class="info_item" @click="chooseCity();">
				<view class="label">
					地区
				</view>
				<view class="value">
					{{editData.showValue}}
				</view>
			</view>
		</view>
		<view class="" v-else-if="editData.fields == 'industry'">
			<view class="info_item" @click="setIndustry">
				<view class="label">
					行业
				</view>
				<view class="value">
					{{editData.showValue}}
				</view>
			</view>
		</view>
		<view class="textarea_item"
			v-else-if="editData.fields == 'home_detailed'||editData.fields == 'hobbies'||editData.fields == 'business_name'||editData.fields == 'business_position'||editData.fields == 'business_detailed'||editData.fields == 'wechat_id' ||editData.fields =='introduction'">
			<textarea class="textarea_style" :maxlength="editData.maxLength" :placeholder="editData.placeholder"
				v-model="editData.showValue"></textarea>
				<view class="length_show">
					{{editData.showValue.length}}/{{editData.maxLength}}
				</view>
		</view>
		<view class="hide_edit" v-if="editData.ifHide">
			<view class="hide_title">
				是否公开展示
			</view>
			<view class="hide_li">
				<text>展示{{editData.title}}</text>
				<switch color="#0E0F12 " :checked="showStatus" @change="onSwitchChange"
					style="transform:scaleX(0.82) scaleY(0.75)" />
			</view>
		</view>

		<view class="save_btn" @click="save">
			保存
		</view>
		<single-picker :show.sync="isSelectTown" :list="townList" :title="singleTitle" @chooseItem="chooseTown"></single-picker>
		<mpvue-city-picker ref="mpvueCityPicker" :siteList="siteList" :pickerValueDefault="cityPickerValueDefault"
			@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import {
		getDetailShow,
		detailUpdate,
		getIndustry
	} from '@/api/guiId.js'
	import {
		apiGetDivision
	} from "@/api/apply.js"
	import singlePicker from "@/componentsLib/publicComponents/singlePicker.vue"
	import mpvueCityPicker from "@/componentsLib/publicComponents/mpvueCityPicker.vue"
	export default {
		data() {
			return {
				sexId: '',
				showStatus: false, //是否展示状态
				oldShowValue:'',
				editData: {
					fields: '',
					ifHide: false,
					title: '',
					showValue: '',
					placeholder:'',
					maxLength:100
				},
				home_province: 0, // 居住省份id
				home_city: 0, // 居住城市id
				home_area: 0, // 居住县区id
				home_street: 0, // 居住街道id
				siteList: [], // 三级地址列表
				isDoing: false, // 是否在选择城镇
				chooseSiteType: 0, // 地址弹窗类型 0企业地区 1个人所在地区
				cityPickerValueDefault: [0, 0, 1],
				region: [], // 省市区选择结果
				isSelectTown: false, // 是否打开单选列弹框
				selectTown: '',
				townList: [],
				singleTitle:'',
			}
		},
		components: {
			singlePicker,
			mpvueCityPicker
		},
		onLoad(options) {
			// console.log(options,'----------')
			// console.log(JSON.parse(decodeURIComponent(options.infoData)),'------------1')
			this.editData = JSON.parse(decodeURIComponent(options.infoData))
			for(let key in this.editData){
				this.$data[key] = this.editData[key] || this.$data[key]
			}
			this.oldShowValue = this.editData.showValue
			// console.log(JSON.parse(decodeURIComponent(options.infoData)),'------------2')
			if (this.editData.title) uni.setNavigationBarTitle({
				title: '编辑' + this.editData.title
			})
			if (this.editData.ifHide) this.getDetailShow()
			if (this.editData.fields == 'industry') this.getIndustry()
			if (this.editData.fields == 'sex') {
				this.sexId = this.editData.value
			}
		},
		methods: {
			save() {
				// console.log(this.oldShowValue,'this.oldShowValue')
				// console.log(this.editData.showValue,'this.editData.showValue')
				if(this.oldShowValue === this.editData.showValue && this.oldshowStatus == this.showStatus){
					uni.navigateBack({
							delta:1,
					})
					return
				}
				let data = {
					// openid: 'os7pK4_YYxUo8SZ6mt6YsP7UlgKc',
					field: this.editData.fields,
					show:this.showStatus?1:0
				}
				if (this.editData.fields == 'sex') {
					data.value = this.sexId
				} else if (this.editData.fields == 'industry') {
					if(this.oldShowValue === this.editData.showValue){
						data.value = this.editData.industry_id
					}else{
						data.value = this.editData.value
					}
					data.field = this.editData.updateField
				}else if (this.editData.fields == 'home_address') {
					data.home_province = this.home_province
					data.home_city = this.home_city
					data.home_area = this.home_area
					data.home_street = this.home_street
				}else{
					data.value = this.editData.showValue
				}
				detailUpdate(data).then(res => {
						this.$store.dispatch("getUserDetails")
						uni.navigateBack({
								delta:1,
						})
				}).catch(err=>{
					uni.showToast({
						icon:'error',
							title: err.msg,
							duration: 2000,
					});
				})
			},
			getDetailShow() {
				getDetailShow({
					// openid: 'os7pK4_YYxUo8SZ6mt6YsP7UlgKc',
					field: this.editData.updateField?this.editData.updateField:this.editData.fields
				}).then(res => {
					this.showStatus = res.show == 1 ? true : false
					this.oldshowStatus = this.showStatus
				})
			},
			onSwitchChange(e) {
				this.showStatus = e.detail.value
			},
			// 获取乡镇信息
			async getTownList() {
				try {
					let data = await apiGetDivision({
						parent_id: this.regionId
					})
					this.selectTown = "";
					this.selectId = -1;
					this.townList = data;
					// this.townList.length && (this.isSelectTown = true)
					if(this.townList.length) {
						this.isSelectTown = true
					} else {
						this.selectTown = "";
						this.selectId = -1;
						this.home_street = ''
						this.isSelectTown = false
					}
					this.singleTitle = '选择乡镇'
					this.isDoing = false;
				} catch (err) {
					console.log("err", err)
					this.isDoing = false;
				}
			},
			// 乡镇选择
			chooseTown(item) {
				if(this.editData.fields == 'home_address'){
					this.selectTown = item;
					this.selectId = item.value;
					this.home_street = this.selectTown.value
					this.editData.showValue = this.editData.showValue + " " + this.selectTown.label
				}else if (this.editData.fields == 'business_address'){
					this.editData.showValue = this.editData.showValue + " " + item.label
				}else if(this.editData.fields == 'industry'){
					this.editData.showValue = item.name
					this.editData.value = item.id
				}
			},
			// 省市区选择
			async chooseCity() {
				if (this.isDoing) {
					uni.showToast({
						title: "操作过快，请稍等~",
						icon: "none",
						duration: 1500
					})
				} else {
					if (this.editData.fields == 'home_address') {
						this.chooseSiteType = 1
					} else {
						this.chooseSiteType = 0
					}
					this.$refs.mpvueCityPicker.show();
				}
			},
			onConfirm(e) {
				this.regionId = e.areaCode;
				this.region = e.label.split("-");
				this.isDoing = true;
				if (this.chooseSiteType == 1) {
					this.home_province = e.provinceCode
					this.home_city = e.cityCode
					this.home_area = e.areaCode
					this.editData.showValue = this.region.join(" ")
				} else {
					this.editData.showValue = this.region.join(" ")
				}
				this.getTownList();
			},
			onCancel(e) {
				this.isDoing = false;
			},
			setIndustry() {
				console.log(this.townList.length)
				console.log(this.townList)
				this.townList.length && (this.isSelectTown = true)
				this.singleTitle = '选择行业'
			},
			// 获取行业列表
			getIndustry() {
				getIndustry().then(res => {
					this.townList = res
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.edit_page {
		padding: 24rpx;
		box-sizing: border-box;

		.select_item {
			background: #FFFFFF;
			border-radius: 24rpx;

			.select_sex_item {
				padding: 40rpx 36rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					font-family:  PingFangSC-Regular;
					font-size: 28rpx;
					color: #0E0F12;
					font-weight: 500;
				}
			}
		}

		.info_item {
			padding: 40rpx 60rpx 40rpx 36rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.label,
			.value {
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #0E0F12;
				font-weight: 500;
				max-width: 360rpx;
			}

			.value {
				position: relative;
			}

			.value::before {
				width: 8rpx;
				height: 16rpx;
				background: url('@/static/newImage/icon/arrow_gray.png') no-repeat;
				background-size: 100% 100%;
				content: '';
				position: absolute;
				right: -32rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.textarea_item {
			position: relative;
			// width: 100%;
			height: 264rpx;
			overflow: hidden;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 40rpx 42rpx;

			.textarea_style {
				 width: 100%;
				font-size: 24rpx;
				// color: #CACACA;
				line-height: 24rpx;
				font-weight: 500;
			}
			
			.length_show{
				position: absolute;
				font-size: 24rpx;
				color: #CACACA;
				right: 30rpx;
				bottom: 30rpx;
			}
		}

		.hide_edit {
			.hide_title {
				padding: 48rpx 0 22rpx 18rpx;
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #0E0F12;
				font-weight: 500;
			}

			.hide_li {
				text {
					font-family:  PingFangSC-Regular;
					font-size: 28rpx;
					color: #0E0F12;
					font-weight: 500;
				}

				padding: 0 30rpx 0 36rpx;
				height: 102rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: #FFFFFF;
				border-radius: 24rpx;
			}
		}

		.line-x {
			width: 642rpx;
			height: 1rpx;
			background: #F1F1F1;
			margin: 0 auto;
		}

		.select_icon {
			width: 28rpx;
			height: 28rpx;
			background: url('@/static/newImage/public/no_select.png') no-repeat;
			background-size: 100% 100%;
		}

		.select_c {
			background: url('@/static/newImage/public/select.png') no-repeat;
			background-size: 100% 100%;
		}

		.save_btn {
			width: 436rpx;
			height: 84rpx;
			line-height: 84rpx;
			margin: 140rpx auto 0;
			background: #0E0F12;
			border-radius: 42rpx;
			font-family:  PingFangSC-Regular;
			font-size: 28rpx;
			color: #FDFEFE;
			font-weight: 500;
			text-align: center;
		}
	}
</style>
