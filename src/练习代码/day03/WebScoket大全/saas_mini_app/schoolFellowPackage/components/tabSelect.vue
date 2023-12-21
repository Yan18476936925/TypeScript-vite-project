<template>
	<view class="tab-select">
		<view class="tab-select-title">
			<!-- <view class="tab-select-title-icon"></view> -->
			{{ title }}
		</view>
		<view class="tab-select-list" v-if="tabList.length <= 8">
			<view 
				class="tab-select-item overflow-hidden" 
				:class="[!!item.isSelect ? 'is-select' : '']" 
				v-for="(item, index) in tabList" 
				:key="index"
				@tap="selectTab(item, index)"
			>
				{{ item.name }}
			</view>
		</view>
		<view class="tab-select-list" v-else>
			<view 
				class="tab-select-item overflow-hidden" 
				:class="[!!item.isSelect ? 'is-select' : '']" 
				v-for="(item, index) in tabList.slice(0, 7)" 
				:key="index"
				@tap="selectTab(item, index)"
			>
				{{ item.name }}
			</view>
			<template v-if="!!openMore">
				<view
					class="tab-select-item overflow-hidden" 
					:class="[!!item.isSelect ? 'is-select' : '']" 
					v-for="(item, index) in tabList.slice(7, tabList.length)" 
					:key="index + 7"
					@tap="selectTab(item, index + 7)"
				>
					{{ item.name }}
				</view>
			</template>
			<view class="tab-select-item tab-select-item-icon overflow-hidden" @tap="openMore = !openMore">
				{{ !!openMore ? '收起' : '更多' }}
				<image class="tab-select-down" v-show="!openMore" src="../../static/newImage/icon/arrow_icon.png" mode=""></image>
				<image class="tab-select-up" v-show="!!openMore" src="../../static/newImage/icon/arrow_icon.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectList: [],
				openMore: false
			}
		},
		props: [
			"title",
			"list",
			"isReset"
		],
		props: {
			title: {
			  type: String,
			  default: () => ''
			},
			list: {
			  type: Array,
			  default: () => []
			},
			isReset: {
			  type: Boolean,
			  default: () => false
			},
			closeMore: {
			  type: Boolean,
			  default: () => false
			},
		},
		computed: {
			tabList() {
				if(!!this.list && this.list.length > 0) {
					// let formatList = this.list.map(i => {
					// 	i.isSelect = 0
					// 	return i
					// })
					// console.log('formatList', formatList)
					return this.list
				} else {
					return []
				}
			}
		},
		watch: {
			isReset: {				
				handler(newVal, oldVal) {
					// console.log('isReset', newVal, oldVal)
					if(!!newVal) {
						this.initList()
					}
				},
				deep: true,
				immediate: true,
			},
			closeMore: {
				handler(newVal, oldVal) {
					// console.log('closeMore', newVal, oldVal)
					if(!!newVal) {
						this.openMore = false
					}
				},
				deep: true,
				immediate: true,
			}
		},
		methods: {
			selectTab(item, index) {
				let _index = this.selectList.indexOf(item.id)
				if(_index != -1) {
					this.selectList.splice(_index, 1)
					this.tabList[index].isSelect = 0
				} else {
					this.selectList.push(item.id)
					this.tabList[index].isSelect = 1
				}
				this.$emit('tabSelect', this.selectList)
			},
			initList() {
				this.tabList.map(i => {
					i.isSelect = 0
					return i
				})
				this.selectList = []
				this.$emit('tabSelect', this.selectList)
				this.$emit('updateReset', false)
			}
		}
	}
</script>

<style lang="less" scoped>
.tab-select {
	width: 750rpx;
	background: #FFFFFF;
	font-family:  PingFangSC-Regular;
	position: relative;
	padding: 0 36rpx;
	box-sizing: border-box;
	.tab-select-title {
		width: 750rpx;
		height: 32rpx;
		font-size: 24rpx;
		color: #0E0F12;
		line-height: 24rpx;
		font-weight: 600;
		position: relative;
		vertical-align: middle;
		margin-bottom: 24rpx;
		&::before {
			content: "";
			margin-right: 16rpx;
			display: inline-block;
			vertical-align: middle;
			width: 4rpx;
			height: 16rpx;
			background: #D40000;
		}
	}
	.tab-select-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: flex-start;
		.tab-select-item {
			width: 148rpx;
			height: 50rpx;
			background: #F7F9FB;
			border-radius: 25rpx;
			font-size: 24rpx;
			text-align: center;
			color: #2D241A;
			line-height: 50rpx;
			font-weight: 600;
			margin-bottom: 20rpx;
			margin-right: 20rpx;
			padding: 0 13rpx;
			box-sizing: border-box;
		}
		.tab-select-item-icon {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.tab-select-down {
			width: 14rpx;
			height: 20rpx;
			transform: rotateZ(90deg);
			margin-left: 16rpx;
		}
		.tab-select-up {
			width: 14rpx;
			height: 20rpx;
			transform: rotateZ(-90deg);
			margin-left: 16rpx;
		}
		.is-select {
			color: #F8172A;
			line-height: 46rpx;
			background: #FFEBEC;
			border: 2rpx solid #F8172A;
		}
	}
}
</style>