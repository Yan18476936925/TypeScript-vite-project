<template>
	<view class="s-tabs" :style="{top:curTop+'rpx'}">
		<view class="s-tabs-nav-wrap" v-if="list.length > 0">
			<scroll-view class="scroll-wrap" :show-scrollbar="false" scroll-with-animation scroll-x >
				<!-- <view class="scroll-view"> -->
					<view class="s-tab-nav-view">
						<view v-for="(item,index) of filterList" :class="['s-tab-nav']" :style="{
							width: navWidth,
							color: (curTab==index?activeColor:color ),
							fontSize: (curTab==index?activeSize + 'rpx': fontSize + 'rpx' )
							}"
							:key="index" @tap="handleChangeTab(index)">
							{{item.name}}
							<text v-if="isShowCount">{{item.count}}</text>
						</view>
					</view>
				<!-- </view> -->
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'tabBar',
		props: {
			curTop: {
				type: Number,
				default: 0
			},
			list: {
				type: Array,
				default: () => []
			},
			// 供外部提供数量key
			countName: {
				type: String,
				default: ''
			},
			// 供外部提供标题key
			titleName: {
				type: String,
				default: ''
			},
			// 文字的颜色
			color: {
				type: String,
				default: '#666'
			},
			// 文字选中颜色
			activeColor: {
				type: String,
				default: '#000'
			},
			fontSize: {
				type: Number,
				default: 25
			},
			// 文字选中大小
			activeSize: {
				type: Number,
				default: 28
			},
			isShowCount: {
				type: Boolean,
				default: false
			},
			// 底部线条长度
			lineWidth: {
				type: Number,
				default: 40
			},
			// 当前选中tab
			curTab: {
				type: Number,
				default: 0
			},
			// 底部线条比例
			lineScale: {
				type: Number,
				default: 0.4
			},
			// 导航栏宽度。默认自适应
			navPerView: {
				type: [Number, String],
				default: 'auto'
			},
		},
		data() {
			return {
			}
		},
		methods: {
			handleChangeTab(index) {
				this.$emit('onChangeTab', index)
			},
		},
		computed: {
			navWidth() {
				const perView = parseInt(this.navPerView);
				return isNaN(perView) ? '' : ('width:' + 100 / perView + '%;');
			},
			filterList() {
				let list = this.list;
				if (this.titleName) {
					list.map((v, k) => {
						v.name = list[k][this.titleName]
					})
				}
				if (this.countName) {
					list.map((v, k) => {
						v.count = list[k][this.countName]
					})
				}
				return list;
			},
		}
	}
</script>

<style lang="less">
	.s-tabs {
		width: 100%;
		// position: relative;
		position: fixed;
		top: 0;
		overflow-x: hidden;
		background: #fff;
		z-index: 90;
		font-weight: bold;

		&-nav-wrap {
			width: 100%;
			height: 100%;
			// display: flex;
			// white-space: nowrap;

			.scroll-wrap {
				height: 100%;
				// 新增的样式
				width: 100%;
			}

			// .scroll-view {
			// 	height: 100%;
			// 	padding: 20rpx 0;
			// 	position: relative;
			// 	display: flex;
			// 	// 新增的样式
			// 	width: 100%;
			// }

			.s-tab-nav-view {
				height: 100%;
				min-width: 100%;
				// 新增的样式
				display: flex;
				align-items: center;
			}
		}

		.s-tab-nav {
			flex: 1;
			// flex-shrink: 0;
			box-sizing: border-box;
			height: 100%;
			padding: 20rpx 30rpx;
			
			white-space: nowrap;
			text-overflow: ellipsis;
			// 
			text-align: center;
		}
		.s-tab-line {
			position: absolute;
			bottom: 0;
			border-radius: 6rpx;
			transition: all 0.3s;
		}

		&-content-wrap {
			display: flex;
			white-space: nowrap;
		}
	}
</style>
