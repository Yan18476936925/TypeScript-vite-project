<template>
	<view class="personalData_page">
		<view class="t_content">
			<view :class="[`info_item`,`${item.ifImg?'info_img_item':''}`]" v-for="(item,index) in perInfoShowList"
				:key="index" @tap="toEdit(item)">
				<view :class="[`label`,`${item.stay?'label_w':''}`]">
					{{item.label}}
				</view>
				<view class="value_img" v-if="item.ifImg">
					<image :src="item.value" mode="aspectFill"></image>
				</view>
				<view :class="[`value`,`${item.ifUpdate?'update_value':''}`]" v-else>
					{{item.showValue}}
				</view>
			</view>
		</view>
		<ksp-cropper mode="fixed" :width="200" :height="200" :url="kspUrl" @cancel="oncancel" @ok="onok"></ksp-cropper>
	</view>
</template>

<script>
	import {
		personalInfoList
	} from './personalData.js'
	import infoFil from '@/utils/infoFil.js'
	import { getQiniuToken } from "@/api/index/index.js"
	import qiniuUploader from '@/utils/qiniuUploader.js' 
	import {
		detailUpdate,
	} from '@/api/guiId.js'
	import {
		getNetworkType
	} from "@/utils/wxApi.js"
	import {
		getUserDetail
	} from '@/api/guiId.js'
	export default {
		data() {
			return {
				// 个人信息
				perInfoShowList: [],
				kspUrl: "", // 裁剪图片临时Url
			};
		},
		onShow() {
			this.getUserDetail()
		},
		methods: {
			getUserDetail() {
				getUserDetail({
				}).then(res => {
					this.perInfoShowList = personalInfoList.filter(e => {
						let tempObj = Object.assign(e, {
							value: res[e.fields]
						})
						if (e.fieldsList) {
							e.fieldsList.forEach(f => {
								tempObj[f] = res[f]
							})
						}
						tempObj.value = res[e.fields]
						tempObj.showValue = infoFil(tempObj)
						if (res.update_field.includes(tempObj.fields) || (tempObj.updateField && res
								.update_field.includes(tempObj.updateField))) {
							tempObj.ifUpdate = true
						}
						if (res.hide_field.includes(tempObj.fields) || res.hide_field.includes(tempObj
								.updateField)) {
							tempObj.ifHide = true
						}
						return tempObj
					})
					console.log("this.perInfoShowList", this.perInfoShowList)
				})
			},
			toEdit(e) {
				if (e.ifUpdate) {
					if (e.fields === 'photo') {
						this.selectImage()
						return
					}
					let pageTitle;
					let placeholder = '';
					let maxLength = 100;
					switch (e.fields) {
						case 'sex':
							pageTitle = '性别'
							break;
						case 'home_address':
							pageTitle = '所在地'
							break;
						case 'wechat_id':
							pageTitle = '微信号'
							placeholder = '请输入你的微信号，仅在你同意发送微信号给校友时才会发送'
							maxLength = 50
							break;
						case 'home_detailed':
							pageTitle = '详细地址'
							placeholder = '填写详细地址'
							maxLength = 100
							break;
						case 'introduction':
							pageTitle = '个人简介'
							placeholder = '填写个人简介'
							maxLength = 100
							break;
						case 'hobbies':
							pageTitle = '兴趣爱好'
							placeholder = '填写兴趣爱好，例如：高尔夫、户外摄影等'
							maxLength = 100
							break;
						case 'business_name':
							pageTitle = '企业名称'
							placeholder = '请输入你当前入职的企业名称'
							maxLength = 100
							break;
						case 'industry':
							pageTitle = '所属行业'
							break;
						case 'business_position':
							pageTitle = '职位'
							placeholder = '填写工作职位'
							maxLength = 100
							break;
						case 'business_address':
							pageTitle = '工作地区'
							break;
						case 'business_detailed':
							pageTitle = '工作地址'
							placeholder = '填写详细地址'
							maxLength = 100
							break;
					}
					let InfoData = Object.assign(e, {
						title: pageTitle,
						name: e.label,
						placeholder,
						maxLength
					})
					uni.navigateTo({
						url: `/pages/me/editInfo?infoData=${encodeURIComponent(JSON.stringify(InfoData))}`
					});
				}
			},
			selectImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						console.log('res__:', res)
						this.kspUrl = res.tempFilePaths[0]
					}
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
				let data = {
					field: 'photo',
					value: ''
				}
				try {
					let upload = {}
					upload = await this.uploadFunc(ev.path)
					data.value = upload.imageURL
					detailUpdate(data).then(res => {
						this.$store.dispatch("getUserDetails")
						uni.hideLoading();
						this.getUserDetail()
					})
				} catch (e) {
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
					} catch (e) {
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
						key: 'MediaServerMblove/servlet/Proxy/PhotoServlet/' +
						fileName, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
						uptoken: data.token,
					})
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.personalData_page {
		width: 100%;
		box-sizing: border-box;
		background-color: #f7f9fb;
		padding: 20rpx 0 126rpx;
	}

	.t_content {
		// width: 100%;
		width: 702rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin: 0 auto;

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
				font-family:  PingFangSC-Regular;
				font-size: 24rpx;
				color: #0E0F12;
				font-weight: 500;
				// display: -webkit-box;
				// -webkit-box-orient: vertical;
				// -webkit-line-clamp: 2; 
				// overflow: hidden; 
				max-width: 360rpx;
				word-wrap: break-word;
				word-break: break-all;
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

		.update_value {
			position: relative;
			padding-right: 28rpx;
		}

		.update_value::before {
			width: 8rpx;
			height: 16rpx;
			background: url('@/static/newImage/icon/arrow_gray.png') no-repeat;
			background-size: 100% 100%;
			content: '';
			position: absolute;
			right: 10rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>
