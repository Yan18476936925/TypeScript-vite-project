<template>
	<view class="mpvue-picker">
		<view :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></view>
		<view class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
			<view class="mpvue-picker__hd" catchtouchmove="true">
				<view class="mpvue-picker__action" @click="pickerCancel">取消</view>
				<view class="mpvue-picker__action" @click="pickerConfirm">确定</view>
			</view>
			<picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange" @pickstart="pickstart" @pickend="pickend">
				<block>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.label}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.label}}</view>
					</picker-view-column>
					<picker-view-column v-if="showArea">
						<view class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.label}}</view>
					</picker-view-column>
				</block>
			</picker-view>
		</view>
	</view>
</template>

<script>
	import provinceData from '@/common/city-data/province.js';
	import cityData from '@/common/city-data/city.js';
	import areaData from '@/common/city-data/areaNew.js';
	export default {
		data() {
			return {
				pickerValue: [0, 0, 0],
				provinceDataList: [],
				cityDataList: [],
				areaDataList: [],
				/* 是否显示控件 */
				showPicker: false,
				changePickerValue: [],
				isScroll: false,
			};
		},
		created() {
			this.init()
		},
		props: {
			/* 默认值 */
			pickerValueDefault: {
				type: Array,
				default () {
					return [0, 0, 0]
				}
			},
			provinceDataLine: {
				type: Array
			},
			cityDataLine: {
				type: Array
			},
			areaDataLine: {
				type: Array
			},
			showArea: {
				type: Number,
				default: 1
			},
		},
		watch: {
			pickerValueDefault() {
				this.init();
			}
		},
		methods: {
			init() {
				console.log("this.provinceDataLine",this.provinceDataLine,this.cityDataLine,this.areaDataLine)
				this.handPickValueDefault(); // 对 pickerValueDefault 做兼容处理
				this.provinceDataList = this.provinceDataLine.length > 0 ? this.provinceDataLine : provinceData;
				this.cityDataList = this.cityDataLine.length > 0 ? this.cityDataLine[this.pickerValueDefault[0]] : cityData[this.pickerValueDefault[0]];
				this.areaDataList = this.areaDataLine.length > 0 ? this.areaDataLine[this.pickerValueDefault[0]][this.pickerValueDefault[1]] : areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]];
				this.pickerValue = this.pickerValueDefault;
			},
			show() {
				setTimeout(() => {
					this.init()
					this.showPicker = true;
				}, 0);
			},
			maskClick() {
				this.pickerCancel();
			},
			pickerCancel() {		
				if (!!this.isScroll) {
					return
				}
				this.showPicker = false;
				this._$emit('onCancel');
			},
			pickerConfirm(e) {			
				if (!!this.isScroll) {
					return
				}
				this.showPicker = false;
				this._$emit('onConfirm');
			},
			showPickerView() {
				this.showPicker = true;
			},
			handPickValueDefault() {
				if (this.pickerValueDefault !== [0, 0, 0]) {
					if (this.pickerValueDefault[0] > provinceData.length - 1) {
						this.pickerValueDefault[0] = provinceData.length - 1;
					}
					if (this.pickerValueDefault[1] > cityData[this.pickerValueDefault[0]].length - 1) {
						this.pickerValueDefault[1] = cityData[this.pickerValueDefault[0]].length - 1;
					}
					if (this.pickerValueDefault[2] > areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1) {
						this.pickerValueDefault[2] = areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1;
					}
				}
			},
			pickerChange(e) {
				this.changePickerValue = e.mp.detail.value;
				if (this.pickerValue[0] !== this.changePickerValue[0]) {
					// 第一级发生滚动
					this.cityDataList = cityData[this.changePickerValue[0]];
					this.areaDataList = areaData[this.changePickerValue[0]][0];
					this.changePickerValue[1] = 0;
					this.changePickerValue[2] = 0;
				} else if (this.pickerValue[1] !== this.changePickerValue[1]) {
					// 第二级滚动
					this.areaDataList =
						areaData[this.changePickerValue[0]][this.changePickerValue[1]];
					this.changePickerValue[2] = 0;
				}
				// setTimeout(() => {					
					this.pickerValue = this.changePickerValue;
					this._$emit('onChange');
				// }, 100)
			},
			pickstart(e) {
				this.isScroll = true
			},
			pickend(e) {
				this.isScroll = false
			},
			_$emit(emitName) {
				let pickObj = {
					label: this._getLabel(),
					value: this.pickerValue,
					provinceCode: this._getProvinceCode(),
					cityCode: this._getCityCode(),
					areaCode: this._getAreaCode(),
				};
				console.log("pickObj",pickObj)
				this.$emit(emitName, pickObj);
			},
			_getLabel() {
				let areaLabel = this.areaDataList[this.pickerValue[2]] ? this.areaDataList[this.pickerValue[2]].label : ""
				let pcikerLabel =
					this.provinceDataList[this.pickerValue[0]].label +
					'-' +
					this.cityDataList[this.pickerValue[1]].label +
					'-' +
					areaLabel;
				return pcikerLabel;
			},
			_getProvinceCode() {
				return this.provinceDataList[this.pickerValue[0]].value;
			},
			_getCityCode() {
				return this.cityDataList[this.pickerValue[1]].value;
			},
			_getAreaCode() {
				return this.areaDataList[this.pickerValue[2]] ? this.areaDataList[this.pickerValue[2]].value : "";
			},
		}
	};
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.mpvue-picker-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}

	.mpvue-picker-view-show {
		transform: translateY(0);
	}

	.mpvue-picker__hd {
		display: flex;
		padding: 9px 15px;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 17px;
	}

	.mpvue-picker__hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.mpvue-picker__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.mpvue-picker__action:first-child {
		text-align: left;
		color: #888;
	}

	.mpvue-picker__action:last-child {
		text-align: right;
	}

	.picker-item {
		text-align: center;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 16px;
	}

	.mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
</style>
