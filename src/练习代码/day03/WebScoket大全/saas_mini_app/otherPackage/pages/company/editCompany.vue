<template>
	<view class="editCompany_page" v-if="initLoadSucc">
		<view class="check_msg">
			<text v-if="businessData.business_status == 0">审核中，审核通过之后即可展示</text>
			<text v-else-if="businessData.business_status == 2">驳回原因：{{ businessData.reason || '审核失败' }}</text>
			<text v-else>本周还可编辑{{ businessData.limit_update }}次，审核通过后展示</text>
		</view>
		<view class="company_info">
			<view :class="[`info_item`,`info_item_${item.type}`]" v-for="(item,index) in companyList" :key="index">
				<view class="item_label">
					{{item.label}}:
				</view>
				<view class="" v-if="item.type == 'text'">
					<view class="item_input_content" v-if="item.type == 'text'">
						<input class="item_input" type="text" placeholder="未编辑"
							placeholder-style="font-weight: 500; color: #BF1A19 ;font-size: 24rpx"
							v-model="businessData[item.fields]" :maxlength="item.maxLength || 20" />
					</view>
				</view>
				<view class="" v-else-if="item.type == 'select'">
					<text @tap="toSelect(item)" :class="[`select_value`, `${!!businessData[item.fields] && businessData[item.fields]!= -1? 'select_ed' : 'not_select'}`]">
						<text v-if="item.showFields">{{ !!businessData[item.showFields] ? businessData[item.showFields] : '未编辑' }}</text>
						<text v-else>{{ !!businessData[item.fields] ? businessData[item.fields]: '未编辑' }}</text>
					</text>
				</view>
				<view class="item_imageUpload_content" v-else-if="item.type == 'imageUpload'" @tap="uploadCover(item)">
					<image v-if="!!businessData.business_cover" :src="businessData.business_cover" mode=""></image>
					<image
						v-else
						src="https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/Fvc04L9dh2lL57We9pTisQFdRbuT.png"
						mode=""></image>
				</view>
				<view class="imagesUpload" v-else-if="item.type == 'imagesUpload'">
					<view class="image_item" v-if="businessData.business_images.length < 8" @tap="addImage(item)">
						<image
							src="https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FnbeWbzFAQF5EHZE2T5Y_nKelqCs.png"
							mode=""></image>
					</view>
					<view class="image_item" v-for="(_item, _index) in businessData.business_images" :key="_index">
						<image
							:src="_item"
							mode="" ></image>
						<image class="del" src="../../../static/newImage/public/closeBtn1.png" mode="" @tap="delImage(item, _index)"></image>
					</view>

				</view>

				<view class="line_x" v-if="index+1 != companyList.length">
				</view>
				
				<template v-if="businessData.business_status != 0">
					<view class="image_select_icon" v-if="item.type == 'imageUpload'"></view>
					<view class="select_icon" v-else-if="item.type == 'select' || item.label == '企业简介'"></view>
				</template>
			</view>
			<!-- <view class="disabled-mask" v-if="businessData.business_status == 0 || businessData.limit_update <= 0"></view> -->
			<view class="disabled-mask" v-if="noSubmit"></view>
		</view>

		<view class="footer_edit">
			<view :class="['btn', noSubmit ? 'btn-disabled' : 'btn-submit']" @tap="submitForm">
				{{ businessData.business_status == 0 ? '审核中' : '提交审核' }}
			</view>
		</view>
		
		<single-picker :show.sync="showPicker" :list="pickList" :title="pickTitle" @chooseItem="chooseItem"></single-picker>
		<mpvue-city-picker ref="mpvueCityPicker" :siteList="siteList" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import { getNetworkType } from "@/utils/wxApi.js"
	import companyInfoList from './editCompany.js'
	import { getQiniuToken } from '@/api/index/index.js';
	import qiniuUploader from '@/utils/qiniuUploader.js';
	import { apiGetBusinessDetail, apiUserBusinessUpdate, getIndustry } from '@/api/guiId.js'
	import singlePicker from '@/componentsLib/publicComponents/singlePicker.vue';
	import mpvueCityPicker from '@/componentsLib/publicComponents/mpvueCityPicker.vue';
	export default {
		data() {
			return {
				initLoadSucc: false,
				companyList: [],
				businessData: {
					advanced: -1, // 是否是高级会员 1是 0不是 -1默认值
					all_address: "",
					business_address: "",
					business_area: 0,
					business_city: 0,
					business_cover: "",
					business_detail: "",
					business_images: [],
					business_link: "",
					business_name: "",
					business_position: "",
					business_province: 0,
					business_status: -1, // 审核状态 -1 待完善没数据 0审核中 1审核通过 2已驳回
					industry_id: 0,
					industry:"",
					limit_update: 3,
					reason: "",
				},
				industryList: [], //行业列表
				siteList: [], // 三级地址列表
				isDoing: false, // 是否在选择城镇
				regionId: '', //乡镇id
				// region: null,
				cityPickerValueDefault: [0, 0, 1],
				showPicker: false, // 选择器弹窗
				pickList: [], // 选择器列表
				pickTitle: '', // 选择器标题
				tempFields: {}, //临时存储选择项数据
			}
		},
		components: {
			singlePicker,
			mpvueCityPicker
		},
		computed: {
			noSubmit() {
				let status = false;
				if(this.businessData.business_status == 0) { // 审核中
					status = true
				} else if(this.businessData.limit_update <= 0) {
					status = true
				}
				return status
			}
		},
		onLoad() {
			this.companyList = Array.from(companyInfoList)
			console.log('this.companyList', this.companyList)
			
			uni.showLoading({
				title: '加载中',
				mask: true,
			})
			this.getUserBusinessDetail('init')
			this.getIndustry()
		},
		methods: {
			getUserBusinessDetail(type) {
				apiGetBusinessDetail().then(res => {
					console.log('res___', res)
					this.businessData = res
					uni.hideLoading()
					// this.businessData.business_status = 0
					// this.businessData.advanced = 0
					if(!!type && type == 'init') {
						this.initLoadSucc = true
					}
					if(this.businessData.advanced == 0 && !!type && type == 'init') {
						this.companyList.splice(this.companyList.length - 1, 1)
					}
				})
			},
			// 获取行业列表
			getIndustry() {
				getIndustry().then(res => {
					this.industryList = res;
				});
			},
			uploadCover(e) {
				if (e.fields === 'business_cover') {
					this.tempFields = e;
					this.selectCover();
				}
			},
			selectCover() {
				uni.chooseImage({
					count: 1,
					sourceType: ["album"],
					success: async (res) => {
						// return
						const networkType = await getNetworkType()
						if (networkType === 0) {
							uni.showToast({
								title: '当前网络异常，请检查网络',
								icon: 'none'
							})
							return
						}
						uni.showLoading({
							title: '图片上传中...'
						});
						let data = {
							field: 'photo',
							value: ''
						};
						try {
							let upload = {};
							upload = await this.uploadFunc(res.tempFilePaths[0]);
							data.value = upload.imageURL;
							uni.hideLoading();
							console.log(data.value, 'data.value');
						
							this.businessData[this.tempFields.fields] = data.value;
						} catch (e) {
							console.log('e_________', e)
							uni.hideLoading();
							uni.showToast({
								title: '添加失败,请重试',
								icon: 'none'
							});
						}
					}
				})
			},
			onCancel(){
				
			},
			addImage(e) {
				if (e.fields === 'business_images') {
					this.tempFields = e;
				}
				let num = 8 - this.businessData[this.tempFields.fields].length
				console.log('num', num)
				uni.chooseImage({
					count: num,
					sourceType: ["album"],
					success: async (res) => {
						// return
						const networkType = await getNetworkType()
						if (networkType === 0) {
							uni.showToast({
								title: '当前网络异常，请检查网络',
								icon: 'none'
							})
							return
						}
						uni.showLoading({
							title: '图片上传中...'
						});
						try {
							let upload = {}
							res.tempFilePaths.forEach(async (i, index) => {
								upload = await this.uploadFunc(i)
								uni.hideLoading();
								this.businessData[this.tempFields.fields].push(upload.imageURL)
							})
						} catch(e) {
							uni.showToast({
								title: '添加失败,请重试',
								icon: 'none'
							})
						}
					}
				})
			},
			delImage(e, index) {
				// console.log('e, index', e, index)
				if (e.fields === 'business_images') {
					this.tempFields = e;
					this.businessData[this.tempFields.fields].splice(index, 1)
				}
			},
			async uploadFunc(file) {
				let fileInfo = await this.public.getImageInfo(file);
				return new Promise(async (resolve, reject) => {
					const fileName = `photo${this.public.uuid()}`;
					let data;
					try {
						data = await getQiniuToken({
							bucket: 'imeach',
							type: 'PhotoServlet',
							ext: fileInfo.type
						});
					} catch (e) {
						console.log('e___', e);
						return;
					}
			
					qiniuUploader.upload(
						file,
						res => {
							// 上传成功
							resolve(res);
						},
						error => {
							// 失败
							reject(error);
						},
						{
							region: 'ECN',
							domain: 'https://duimianimg.loovee.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
							key: 'MediaServerMblove/servlet/Proxy/PhotoServlet/' + fileName, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
							uptoken: data.token
						}
					);
				});
			},
			toSelect(e) {
				this.tempFields = e;
				if (e.fields == 'industry_id') {
					this.pickList = this.industryList;
					this.pickTitle = '行业';
					this.showPicker = true;
				} else if (e.fields == 'all_address') {
					this.chooseCity();
				}
			},
			// 省市区选择
			async chooseCity() {
				if (this.isDoing) {
					uni.showToast({
						title: '操作过快，请稍等~',
						icon: 'none',
						duration: 1500
					});
					return;
				}
				this.$refs.mpvueCityPicker.show();
				this.isDoing = false;
			},
			chooseItem(item) {
				console.log('chooseItem', item)
				if (this.tempFields.fields == 'business_address_code') {
					this.businessData[this.tempFields.fields] = `${this.region.join('-')}-${item.label}`;
					// this.businessData.business_province = 0
					// this.businessData.business_city = 0
					// this.businessData.business_area = 0
				} else {
					this.businessData[this.tempFields.fields] = item.id ? item.id : item.value;
					this.businessData[this.tempFields.showFields] = item.label ? item.label : item.name;
					console.log(this.businessData,'-------------this.businessData')
				}
				console.log(item, 'item');
			},
			onConfirm(e) {
				if (this.tempFields.fields == 'all_address') {
					this.businessData.business_area = '';
					this.businessData.business_city = '';
					this.businessData.business_province = '';
					this.businessData.business_area = e.areaCode;
					this.businessData.business_city = e.cityCode;
					this.businessData.business_province = e.provinceCode;
				}
				this.regionId = e.areaCode;
				this.region = e.label.split('-');
				this.isDoing = true;
				this.businessData[this.tempFields.fields] = `${this.region.join('')}`;
				console.log(this.businessData[this.tempFields.fields], '---------------', this.region);
			},
			checkCanSubmit() {
				if(this.businessData.business_status == 0) { // 审核中
					return false
				} else if(this.businessData.limit_update <= 0) {
					uni.showToast({
						icon: 'none',
						title: '本周编辑次数已用完，请下周再编辑提交',
						duration: 2000
					})
					return false
				} else {
					return true
				}
			},
			checkNull() {
				let flag = false
				let ifNotWirte = false;
				let notWriteField = {};
				for (let i = 0; i < this.companyList.length; i++) {
					let item = this.companyList[i];
					if (!this.businessData[item.fields] && !item.ifSkip) {
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
			submitForm() {
				console.log('submitForm')
				if(!this.checkCanSubmit()) return
				if(!!this.checkNull()) return
				console.log('businessData', this.businessData)
				this.update()
			},
			update(){
				apiUserBusinessUpdate(this.businessData).then(res => {
					console.log(res,'---------')
					this.getUserBusinessDetail()
					uni.showToast({
						icon: 'none',
						title: '已提交审核，审核通过之后，即可展示',
						duration: 2000
					})
				});
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.editCompany_page {
		padding: 0 24rpx;
		box-sizing: border-box;

		.check_msg {
			font-family: PingFangSC-Regular;
			font-size: 24rpx;
			color: #010101;
			letter-spacing: 0;
			padding: 16rpx 0;
		}

		.company_info {
			max-width: 702rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			position: relative;
			.disabled-mask {
				position: absolute;
				z-index: 100;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				margin: auto;
				background: rgba(0, 0, 0, 0);
				z-index: 9999;
			}

			.line_x {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 642rpx;
				height: 1rpx;
				background-color: rgba(241, 241, 241, 0.4);
			}


			.info_item {
				position: relative;
				width: 702rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 60rpx 0 40rpx;
				box-sizing: border-box;

				.item_label {
					font-family:  PingFangSC-Regular;
					font-size: 24rpx;
					color: #0E0F12;
					font-weight: 500;
				}
				.image_select_icon {
					width: 12rpx;
					height: 24rpx;
					background: url('@/static/newImage/icon/arrow_gray.png') no-repeat;
					background-size: 100% 100%;
					position: absolute;
					// top: 52rpx;
					right: 32rpx;
					top: 50%;
					transform: translateY(-50%);
				}
				.select_icon {
					width: 12rpx;
					height: 24rpx;
					background: url('@/static/newImage/icon/arrow_gray.png') no-repeat;
					background-size: 100% 100%;
					position: absolute;
					// top: 50rpx;
					right: 32rpx;
					top: 50%;
					transform: translateY(-50%);
				}
				// 输入框
				.item_input_content {
					flex: 1;
					max-width: calc(100vw - 360rpx);

					.item_input {
						max-width: calc(100vw - 360rpx);
						height: 120rpx;
						font-family:  PingFangSC-Regular;
						font-size: 28rpx;
						color: #0e0f12;
						font-weight: 400;
						text-align: right;
					}
				}

				// 单图
				.item_imageUpload_content {
					width: 240.73rpx;
					height: 128rpx;
					border-radius: 8rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.info_item_select,
			.info_item_text {
				height: 114rpx;
			}
			.select_ed{
				font-size: 28rpx;
				color: #0e0f12;
				font-weight: 500;
			}
			.not_select{
				color: #BF1A19;
				font-size: 24rpx;
			}
			.info_item_imageUpload {
				height: 208rpx;
			}

			.info_item_imagesUpload {
				display: block;
				padding-top: 40rpx;
				padding-right: 28rpx;
				padding-left: 26rpx;
				box-sizing: border-box;
				max-height: 440rpx;
				
				.item_label {
					padding-left: 14rpx;
					box-sizing: border-box;
				}
				.imagesUpload {
					display: flex;
					flex-wrap: wrap;
					box-sizing: border-box;
					padding-top: 13rpx;

					.image_item {
						width: 134rpx;
						height: 134rpx;
						position: relative;
						margin: 15rpx 14rpx;
						image {
							width: 100%;
							height: 100%;
							border-radius: 8rpx;
						}

						.del {
							width: 38rpx;
							height: 38rpx;
							position: absolute;
							top: 0;
							right: 0;
							transform: translate(50%, -50%);
						}
					}


					// image:nth-child(3n) {
					// 	margin-right: 0rpx;
					// }

				}
			}
		}

		.footer_edit {
			height: 226rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			padding-top: 64rpx;

			.btn {
				width: 522rpx;
				height: 84rpx;
				line-height: 84rpx;
				border-radius: 46rpx;
				font-family:  PingFangSC-Regular;
				font-size: 28rpx;
				color: #FFFFFF;
				text-align: center;
				font-weight: 500;
			}
			.btn-submit {
				background: #0E0F12;
			}
			.btn-disabled {
				background: #D8D8D8;
			}
		}
	}
</style>