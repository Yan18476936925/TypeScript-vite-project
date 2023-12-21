<template>
	<view class="stepItem">
		<view class="stepItem_title">{{ userInfoList[stepIndex].tabTitle }}</view>
		<view class="stepItem_sub_title" v-if="!!userInfoList[stepIndex].subTitle">{{ userInfoList[stepIndex].subTitle }}</view>
		<view class="stepItem_InfoList">
			<view class="stepItem_Info_item" v-for="item in userInfoList[stepIndex].infoList" :key="item.fields">
				<view v-if="item.type != 'upload'&&!!item.label" :class="[`item_label`, `${item.stay ? 'item_label_w' : ''}`]">{{ item.label }}</view>

				<!-- 输入框类型 -->
				<view class="item_input_content" v-if="item.type == 'text'">
					<input
						class="item_input"
						type="text"
						:placeholder="item.placeholder"
						placeholder-style="font-weight: 500; color: #DBDBDB;font-size: 24rpx"
						v-model="infoData[item.fields]"
						:maxlength="item.maxLength"
					/>
				</view>
				<!-- 无label输入框类型 -->
				<view class="item_input_on_label" v-if="item.type == 'no_label_text'">
					<input
						class="item_input"
						type="text"
						:placeholder="item.placeholder"
						placeholder-style="font-weight: 500; color: #DBDBDB;font-size: 24rpx"
						v-model="infoData[item.fields]"
						:maxlength="item.maxLength"
					/>
				</view>
				<!-- 选择类型 -->
				<view class="item_select" v-else-if="item.type == 'select'">
					<!-- 时间类型 -->
					<picker
						mode="date"
						v-if="item.select_type == 'time'"
						:class="[`select_value`, `${!!infoData[item.fields] ? 'select_ed' : 'not_select'}`]"
						start="1900-1-1"
						:fields="item.timeType != 'YYYY' ?'day':'year'"
						:end="`${new Date().getFullYear() + '-' + `${new Date().getMonth() + 1}` + '-' + `${new Date().getDate()}`}`"
						@change="changeData($event, item.fields)"
					>
						{{ infoData[item.fields] ? infoData[item.fields] : item.placeholder }}
					</picker>
					<!-- 选择项类型 -->
					<view v-else :class="[`select_value`, `${!!infoData[item.fields] &&infoData[item.fields]!= -1? 'select_ed' : 'not_select'}`]" @tap="toSelect(item)">
						<span v-if="item.showFields">{{ infoData[item.showFields] ? infoData[item.showFields] : item.placeholder }}</span>
						<span v-else>{{ infoData[item.fields] ? infoData[item.fields] : item.placeholder }}</span>
					</view>
					<view class="select_icon"></view>
				</view>
				<!-- 单选类型 -->
				<view class="item_switch" v-else-if="item.type == 'switch'">
					<view
						class="switch"
						:class="[`switch`, `${infoData[item.fields] == index + 1 ? 'switch_cur' : ''}`]"
						v-for="(itemC, index) in item.switchData"
						:key="index"
						@tap="changeSwitch(item, index)"
					>
						{{ itemC }}
					</view>
				</view>
				<!-- 上传头像 -->
				<view class="item_upload" v-else-if="item.type == 'upload'">
					<view class="item_img" v-if="!!infoData[item.fields]" @tap="uploadImg(item)"><image :src="infoData[item.fields]"></image></view>
					<view class="item_upload_content" v-else @tap="uploadImg(item)"></view>
				</view>
			</view>
		</view>
		<view :class="[`stepItem_bottom`, `${userInfoList[stepIndex].infoList.length >= 5 && screenHeight < 700 ? 'stepItem_bottom_not_fixed' : 'stepItem_bottom_fixed'}`]">
			<view class="stepItem_btns">
				<view class="stepItem_back_btn" v-if="stepIndex != 0" @tap="pre"></view>
				<view class="stepItem_next_btn" @tap="next">{{ stepIndex + 1 < userInfoList.length ? '下一步' : '提交档案' }}</view>
				<view class="stepItem_skip_btn" v-if="!!userInfoList[stepIndex].skip" @tap="next"></view>
			</view>

			<view class="stepItem_bottom_msg" v-if="stepIndex == 0">审核通过后，以上资料不可更改</view>
			<view class="stepItem_bottom_bg"><image :src="userInfoList[stepIndex].bottom_img" alt="" class="stepItem_bottom_img"></image></view>
		</view>
		<!-- 组件 -->
		<single-picker :show.sync="showPicker" :list="pickList" :title="pickTitle" @chooseItem="chooseItem"></single-picker>

		<mpvue-city-picker ref="mpvueCityPicker" :siteList="siteList" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<ksp-cropper mode="fixed" :width="200" :height="200" :url="kspUrl" @cancel="cropperCancel" @ok="onok"></ksp-cropper>
	</view>
</template>

<script>
import userInfoList from './userInfo.js';
import singlePicker from '@/componentsLib/publicComponents/singlePicker.vue';
import mpvueCityPicker from '@/componentsLib/publicComponents/mpvueCityPicker.vue';
import { apiGetCollege, apiGetDivision,apiGetRejectedDetail } from '@/api/apply.js';
import { getDetailShow, detailUpdate, getIndustry,getMajorList } from '@/api/guiId.js';
import { getNetworkType } from '@/utils/wxApi.js';
import { getQiniuToken } from '@/api/index/index.js';
import qiniuUploader from '@/utils/qiniuUploader.js';
export default {
	data() {
		return {
			userInfoList,
			infoData: {
				photo: '',
				education: '',
				school_year: '',
				college_id: '',
				major_id:'',
				sex: '',
				birthday_type:'',
				birthday: '',
				national: '',
				industry_id: '',
				business_name: '',
				business_position: '',
				all_address:"",
				business_address: '',
				business_province:'',
				business_city:'',
				business_area:'',
				phone: '',
				wechat_id: '',
				email: '',
				home_address: '',
				native_place: '',
				business_position: '',
				hobbies: '',
				photo: '',
				home_province: '',
				home_city: '',
				home_area: '',
				home_street: '',
				home_detailed:'',
				// 展示用的字段
				college: '',
				education_name: '',
				industry: '',
				major: ''
			},
			tempFields: {}, //临时存储选择项数据
			// 学籍相关
			educationList: [
				{
					label: '大专',
					id: 1
				},
				{
					label: '本科',
					id: 2
				},
				{
					label: '硕士',
					id: 3
				},
				{
					label: '博士',
					id: 4
				}
			],
			industryList: [], //行业列表
			majorList:[],// 专业列表
			siteList: [], // 三级地址列表
			isDoing: false, // 是否在选择城镇
			regionId: '', //乡镇id
			cityPickerValueDefault: [0, 0, 1],
			showPicker: false, // 选择器弹窗
			pickList: [], // 选择器列表
			pickTitle: '', // 选择器标题
			kspUrl: '' ,// 裁剪图片临时Url
			screenHeight:700
		};
	},
	props: ['stepIndex'],
	components: {
		singlePicker,
		mpvueCityPicker
	},
	async mounted() {
		this.screenHeight = uni.getSystemInfoSync().windowHeight
		console.log(this.screenHeight,'---------')
		this.getIndustry();
		this.$store.dispatch("getUserDetails")
		let rejDetails =  await this.getRejDetails()
		if(!!rejDetails.name){
			this.infoData = rejDetails
			console.log(this.infoData.education,'this.infoData.education')
			if(!!this.infoData.education){
				this.infoData.education_name = this.educationList[this.infoData.education - 1].label
			}
		}
		// console.log(JSON.stringify(this.infoData.college),this.infoData.college,'------this.infoData')
		// console.log(JSON.stringify(this.infoData.college_id),'------this.infoData')
	},
	watch: {
		"infoData.home_detailed": {
			handler(val) {
				console.log(val);
			},
			deep: true
		}
	},
	methods: {
		changeSwitch(e, i) {
			this.infoData[e.fields] = i + 1;
			console.log(this.infoData[e.fields]);
		},
		changeData(info, fields) {
			console.log(info.detail.value);
			console.log(this.infoData[fields], 'this.infoData[fields]', fields);
			this.infoData[fields] = info.detail.value;
		},
		next() {
			if (this.stepIndex + 1 < this.userInfoList.length) {
				this.$emit('next', this.infoData);
			} else {
				console.log('sub----------------------')
				this.$emit('submit', this.infoData);
			}
		},
		pre() {
			this.$emit('pre');
		},
		getRejDetails(){
			return new Promise ((resolve)=>{
				apiGetRejectedDetail()
				.then(res => {
					resolve(res)
				})
			})
		},
		toSelect(e) {
			this.tempFields = e;
			if (e.fields == 'college_id') {
				this.chooseCollege();
			}  else if (e.fields == 'major_id') {
				if(!this.infoData.college_id){
					uni.showToast({
						title: '请先选择院系',
						icon: 'none',
						duration: 1500
					});
					return
				}
				this.getMajorList(this.infoData.college_id);
			} else if (e.fields == 'education') {
				this.chooseEducation();
			} else if (e.fields == 'industry_id') {
				this.pickList = this.industryList;
				this.pickTitle = '行业';
				this.showPicker = true;
			} else if (e.fields == 'all_address' || e.fields == 'native_place' || e.fields == 'home_address') {
				this.chooseCity();
			}
		},
		// 学历列表
		chooseEducation() {
			this.pickList = this.educationList;
			this.pickTitle = '学历';
			this.showPicker = true;
		},
		getMajorList(id){
			getMajorList({c_id:id}).then(res => {
				this.majorList = res;
				this.pickList = this.majorList;
				this.pickTitle = '专业';
				this.showPicker = true;
			});
		},
		// 获取行业列表
		getIndustry() {
			getIndustry().then(res => {
				this.industryList = res;
			});
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
		},
		// 获取乡镇信息
		async getTownList() {
			try {
				let data = await apiGetDivision({
					parent_id: this.regionId
				});
				this.isDoing = false;
				if (!!data.length) {
					this.pickList = data;
					this.pickTitle = '选择乡镇';
					this.showPicker = true;
				} else {
					this.infoData[this.tempFields.fields] = `${this.region.join('-')}`;
				}
			} catch (err) {
				console.log('err', err);
				this.isDoing = false;
			}
		},
		onCancel(){
			
		},
		// 获取学院列表
		async chooseCollege(show = 1) {
			await apiGetCollege()
				.then(res => {
					this.collegeList = res.map(i => {
						i.label = i.name;
						return i;
					});
					this.pickList = this.collegeList;
					this.pickTitle = '所属院系';
					if (this.collegeList.length > 0) {
						this.showPicker = show;
					} else {
						this.public.toast('未获取到学院信息');
					}
				})
				.catch(() => {
					this.public.toast('未获取到学院信息');
				});
		},
		chooseItem(item) {
			if (this.tempFields.fields == 'all_address' || this.tempFields.fields == 'native_place' || this.tempFields.fields == 'home_address') {
				this.infoData[this.tempFields.fields] = `${this.region.join('-')}-${item.label}`;
				if (this.tempFields.fields == 'home_address') {
					this.infoData.home_street = item.value;
				}
			} else {
				// console.log(this.tempFields.fields)
				this.infoData[this.tempFields.fields] = item.id ? item.id : item.value;
				this.infoData[this.tempFields.showFields] = item.label ? item.label : item.name;
				if(this.tempFields.fields == "college_id"){
					this.infoData.major = ''
					this.infoData.major_id = ''
				}
			}
			console.log(item, 'item');
		},
		onConfirm(e) {
			if (this.tempFields.fields == 'home_address') {
				this.infoData.home_province = '';
				this.infoData.home_city = '';
				this.infoData.home_area = '';
				this.infoData.home_street = '';
				this.infoData.home_area = e.areaCode;
				this.infoData.home_city = e.cityCode;
				this.infoData.home_province = e.provinceCode;
			}else if(this.tempFields.fields == 'all_address'){
				this.infoData.business_province = '';
				this.infoData.business_city = '';
				this.infoData.business_area = '';
				this.infoData.business_area = e.areaCode;
				this.infoData.business_city = e.cityCode;
				this.infoData.business_province = e.provinceCode;
				this.isDoing = true;
			}
			this.regionId = e.areaCode;
			this.region = e.label.split('-');
			
			this.getTownList();
			console.log(e, '---------------', this.region);
		},
		uploadImg(e) {
			if (e.fields === 'photo') {
				this.tempFields = e;
				this.selectImage();
			}
		},
		selectImage() {
			uni.chooseImage({
				count: 1,
				success: res => {
					console.log('res__:', res);
					this.kspUrl = res.tempFilePaths[0];
				}
			});
		},
		cropperCancel(){
			this.kspUrl = '';
		},
		async onok(ev) {
			this.kspUrl = '';
			const networkType = await getNetworkType();
			if (networkType === 0) {
				uni.showToast({
					title: '当前网络异常，请检查网络',
					icon: 'none'
				});
				return;
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
				upload = await this.uploadFunc(ev.path);
				data.value = upload.imageURL;
				uni.hideLoading();
				console.log(data.value, 'data.value');

				this.infoData[this.tempFields.fields] = data.value;
				// detailUpdate(data).then(res => {
				// 	this.$store.dispatch("getUserDetails")
				// 	uni.hideLoading();
				// 	this.getUserDetail()
				// })
			} catch (e) {
				uni.hideLoading();
				uni.showToast({
					title: '添加失败,请重试',
					icon: 'none'
				});
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
		}
	}
};
</script>

<style scoped lang="less">
.stepItem {
	position: fixed;
	top: 226rpx;
	left: 0;
	width: 750rpx;
	box-sizing: border-box;
	height: calc(100vh - 226rpx);
	background: #ffffff;
	border-radius: 24rpx 24rpx 0 0;
	padding-top: 36rpx;
	overflow-y: scroll;

	.stepItem_title {
		padding-left: 34rpx;
		font-family:  PingFangSC-Regular;
		font-size: 40rpx;
		color: #0e0f12;
		font-weight: 500;
	}

	.stepItem_sub_title {
		padding: 12rpx 0 36rpx 0;
		font-family: PingFangSC-Regular;
		font-size: 24rpx;
		padding-left: 34rpx;
		color: #999999;
	}

	.stepItem_InfoList {
		box-sizing: border-box;
		// padding-bottom: 690rpx;
		// overflow-y: scroll;

		.stepItem_Info_item {
			width: 750rpx;
			// min-height: 120rpx;
			min-height: 90rpx;
			line-height: 120rpx;
			display: flex;

			.item_label {
				box-sizing: border-box;
				padding-left: 34rpx;
				// text-align: center;
				min-width: 202rpx;
				// max-width: 202rpx;
				word-wrap: break-word;
				word-break: break-all;
				font-family:  PingFangSC-Regular;
				font-size: 28rpx;
				color: #0e0f12;
				letter-spacing: 2.8rpx;
				font-weight: 600;
			}

			.item_label_w {
				letter-spacing: 28rpx;
			}

			// 输入框
			.item_input_content {
				flex: 1;
				max-width: calc(100vw - 240rpx);

				.item_input {
					height: 120rpx;
					font-family:  PingFangSC-Regular;
					font-size: 28rpx;
					color: #0e0f12;
					font-weight: 500;
				}
			}
			// .无label输入框
			.item_input_on_label{
				flex: 1;
				width: 100%;
				padding: 0 34rpx;
				box-sizing: border-box;
				.item_input {
					height: 60rpx;
					font-family:  PingFangSC-Regular;
					font-size: 28rpx;
					color: #0e0f12;
					font-weight: 500;
				}
			}
			// 选择框
			.item_select {
				flex: 1;
				font-family:  PingFangSC-Regular;
				font-weight: 500;
				display: flex;
				align-items: center;

				.select_value {
					width: 502rpx;
					white-space: nowrap;
				}

				.select_ed {
					font-size: 28rpx;
					color: #0e0f12;
				}

				.not_select {
					font-size: 24rpx;
					color: #dbdbdb;
				}

				.select_icon {
					width: 8rpx;
					height: 16rpx;
					background: url('@/static/newImage/icon/arrow_gray.png') no-repeat;
					background-size: 100% 100%;
				}
			}

			// switch类型
			.item_switch {
				display: flex;
				align-items: center;

				.switch {
					margin-right: 20rpx;
					width: 121rpx;
					height: 64rpx;
					line-height: 64rpx;
					background: #f7f9fb;
					border-radius: 32rpx;
					font-family:  PingFangSC-Regular;
					font-size: 24rpx;
					color: #999999;
					font-weight: 500;
					text-align: center;
				}

				.switch_cur {
					background: #f40012;
					color: #ffffff;
				}
			}

			// 上传头像
			.item_upload {
				width: 100%;
				padding-top: 26rpx;
				display: flex;
				justify-content: center;

				.item_upload_content {
					width: 312rpx;
					height: 348rpx;
					background: url('https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FkhkFrH8q10Bwfk_paabPB6Cka3n.png') no-repeat;
					background-size: 100% 100%;
				}
				.item_img {
					width: 312rpx;
					height: 312rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}

	.stepItem_bottom {
		width: 750rpx;
		height: 390rpx;

		.stepItem_bottom_msg {
			font-family: PingFangSC-Regular;
			font-size: 22rpx;
			color: #e23837;
			position: absolute;
			top: 104rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.stepItem_btns {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			display: flex;

			.stepItem_back_btn {
				width: 84rpx;
				height: 84rpx;
				background: url('https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FkAJpF2TTW_4a2kzvGsuQvtvb3Jl.png') no-repeat;
				background-size: 100% 100%;

				margin-right: 24rpx;
			}

			.stepItem_next_btn {
				width: 458rpx;
				height: 84rpx;
				background: #0e0f12;
				border-radius: 47rpx;
				font-family:  PingFangSC-Regular;
				font-size: 28rpx;
				color: #ffffff;
				text-align: center;
				line-height: 84rpx;
				font-weight: 500;
			}

			.stepItem_skip_btn {
				width: 84rpx;
				height: 84rpx;
				background: url('https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/Frtdrg3uGgnbTuLv7cI3rIwMRwdB.png') no-repeat;
				background-size: 100% 100%;
				margin-left: 20rpx;
			}
		}

		.stepItem_bottom_bg {
			width: 750rpx;
			height: 390rpx;

			.stepItem_bottom_img {
				width: 100%;
				height: 100%;
			}
		}
	}

	.stepItem_bottom_not_fixed {
		position: relative;
	}

	.stepItem_bottom_fixed {
		position: fixed;
		bottom: 0;
		left: 0;
	}
}
</style>
