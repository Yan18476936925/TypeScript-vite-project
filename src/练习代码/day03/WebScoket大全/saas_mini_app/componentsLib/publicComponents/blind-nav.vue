<template>
	<view class="b-nav">
		<scroll-view :class="{'fixedNav2': type !== 'home', 'fixedNav': type === 'home', 'list-class': true}"
			v-if="boxGroup.length > 1"
			scroll-with-animation="true"
			:scroll-x="true"
			:scroll-into-view="runIndexName">
			<view class="class-item" v-for="(item, index) in boxGroup"
			:class="{ active: tabIndex === index }"
			:key="item.groupId"
			@tap="clickTab(item, index)">
				<span :id="`type_item_${index}`" :class="{ 'frist-item': index == 0 }">{{ item.groupName }}</span>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'nav',   // 分类导航列表
		data() {
			return {
				fixedNav: false,
				fixedNav2: false
			}
		},
		props: ['boxGroup', 'type', 'tabIndex', "runNav"],
		computed: {
			runIndexName() {
				if(this.runNav) {
					this.$emit('endRunNav');
					return "type_item_" + this.tabIndex;
				}
				return ""
			}
		},
		methods: {
			clickTab(item, index){
				this.$emit('clickTab', {
					type: item.goodsType,
					index
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.b-nav {
		width: 750rpx;
		font-weight: bold;
		height: 88rpx;
		overflow: hidden;
		.list-class {
		    width: 750rpx;
		    background-color: #FFFFFF;
		    white-space: nowrap;
		    padding-left: 36rpx;
		    padding-right: 36rpx;
		    box-sizing: border-box;
		    text-align: left;
			height: 96rpx;
			font-size: 26rpx;
			position: relative;
		    .class-item {
		        display: inline-block;
				vertical-align: top;
				height: 92rpx;
		        span {
		            position: relative;
		            display: block;
		            text-align: center;
		            font-size: 26rpx;
		            padding-left: 64rpx;
		            color: #B9BDC3;
		            letter-spacing: 0;
					height: 48rpx;
					line-height: 60rpx;
		        }
		        .frist-item {
		            padding-left: 0;
		        }
		        &.active {
		            span {
		                font-size: 32rpx;
		                color: #0E0F12;
		            }
		            span::before {
		                position: absolute;
		                content: " ";
		                left: 50rpx;
		                right: 0;
						bottom: -20rpx;
		                margin: auto;
		                width: 54rpx;
		                height: 14rpx;
		                border-radius: 8rpx;
		                // background-color: #FFE66B;
						background-image: url(../../static/newImage/icon_xuanzhong.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
		            }
		            .frist-item::before {
		                left: 0;
		            }
		        }
		    }
		    &.fixedNav {
		        position: relative;
		        z-index: 100;
		        left: 0;
		        right: 0;
		        top: 0px !important;
		        margin: 0 auto;
				padding-top: 14rpx;
				height: 92rpx;
		    }
			&.fixedNav2 {
				position: relative;
				z-index: 100;
				top: 0px !important;
				left: 0;
				right: 0;
				margin: 0 auto;
				padding-top: 14rpx;
				height: 92rpx;
			}
		}
	}
</style>