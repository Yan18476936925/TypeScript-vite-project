<template>
	<view 
		class="box-item" 
		:style="{width: goodsWidth ? goodsWidth : '332rpx'}"
	>
		<!-- 系列图片展示 isShow用于测试专题详情图片懒加载，不影响其他页面使用 -->
		<view class="pic-box" 
			:style="{ 
				backgroundImage: (!boxData.isShow || boxData.isShow === 'show') ? 
					'url(' + boxData.pic + ')' : 'url(https://duimianimg.loovee.com/style/blindbox/bbox/blankPic/pic_splb.png)', 
				height: goodsWidth ? goodsWidth : '332rpx'
			}">
			<!-- 2021-11-11 新增序号标签 -->
			<view :class="['number-label', `number-label-${index}`]" v-if="!!isShowNumber && index <= 3"></view>
			<!-- 营销图标 -->
			<image class="yinxiao-icon" v-if="!!boxData.icon" :src="boxData.icon"></image>
			<!-- 已售罄 -->
			<view class="soldout-box" 
				:style="{
					lineHeight: goodsWidth ? goodsWidth : '332rpx',
					fontSize: !!boxFontScale ? `${boxFontScale*36}rpx` : '36rpx'
				}" v-if="boxData.isSoldOut == 1">
				已售罄
			</view>
			<!-- 已售罄情况下一些展示没必要 -->
			<view v-show="boxData.isSoldOut == 0" v-if="!showOtherInfo && !(!!isShowNumber && index <= 3)">
				<view class="tag-contianer">
					<!-- 类型 抽盒/商品 -->
					<view class="tag-box" v-if="showType">
						<view class="tag-txt">{{boxData.type == 'home' ? '抽盒' : '直购'}}</view>
					</view>
					<!-- 定金功能 -->
					<view class="tag-box deposit-box" v-if="boxData.isDeposit == 1">
						<view class="tag-txt">定金</view>
					</view>
					<!-- 预售功能 -->
					<view class="tag-box" v-else-if="boxData.preSale == 1">
						<view class="tag-txt">预售</view>
					</view>
				</view>
				<!-- 即将开售功能 -->
				<view class="soon-begin gilroy-bold-txt" v-if="boxData.isSale == 0">
					<view class="title" :style="{
						'font-size': !!boxFontScale ? `${boxFontScale*23}rpx` : '23rpx'
					}">-即将开售-</view>
					<view class="txt" :style="{
						'font-size': !!boxFontScale ? `${boxFontScale*32}rpx` : '32rpx'
					}">{{ boxData.saleTimeFormat }} 开售</view>
				</view>
				<!-- 秒杀相关 -->
				<view class="isSpecialOffer-box-outside" v-show="boxData.isSale == 1 && boxData.isSpecialOffer == 1">
					<!-- 秒杀功能（其实也是特价的功能） -->
					<!-- 2022-01-22 接入薯泥ip做的调整 -->
					<view :class="['isSpecialOffer-box', pageType === 'mall' ? 'isSpecialOffer-box-mall' : '']" v-if="!boxData.isEnd" :style="{
							'height': !!boxFontScale ? `${boxFontScale*66}rpx` : '66rpx'
						}">
						<view class="new-bottom-title new-bottom-txt" v-if="pageType !== 'mall'" :style="{
							'font-size': !!boxFontScale ? `${boxFontScale*25}rpx` : '25rpx',
							'height': !!boxFontScale ? `${boxFontScale*68}rpx` : '68rpx',
							'line-height': !!boxFontScale ? `${boxFontScale*68}rpx` : '68rpx',
						}">
							{{ boxData.isStart ? '抢购中' : '即将秒杀' }}
						</view>
						<view class="mall-bottom-title new-bottom-txt" v-if="pageType === 'mall'" :style="{
							'font-size': !!boxFontScale ? `${boxFontScale*25}rpx` : '25rpx',
							'height': !!boxFontScale ? `${boxFontScale*68}rpx` : '68rpx',
							'line-height': !!boxFontScale ? `${boxFontScale*68}rpx` : '68rpx',
						}">
							{{ boxData.isStart ? '抢购中' : '即将秒杀' }}
						</view>
						<view class="new-bottom-time new-bottom-txt gilroy-bold-txt" v-if="pageType !== 'mall'" :style="{
							'font-size': !!boxFontScale ? `${boxFontScale*25}rpx` : '25rpx',
							'height': !!boxFontScale ? `${boxFontScale*58}rpx` : '58rpx',
							'line-height': !!boxFontScale ? `${boxFontScale*58}rpx` : '58rpx',
						}">
							<text class="time-txt" :style="{
								'font-size': !!boxFontScale ? `${boxFontScale*25}rpx` : '25rpx'
							}">{{ boxData.isStart ? boxData.specialEndTimeFormat : boxData.specialStartTimeFormat}}</text>
							<text>{{ boxData.isStart ? '结束' : '开始' }}</text>
						</view>
					</view>
					<view class="soldout-box" v-if="boxData.isEnd && themeType == 2" :style="{lineHeight: goodsWidth ? goodsWidth : '332rpx',}">
						已结束
					</view>
				</view>
				
			</view>
		</view>
		<!-- 系列名 -->
		<view class="name-box" v-if="!showOtherInfo">
			{{ pageType === 'mall' ? boxData.goodsName : boxData.seriesName }}
		</view>
		<view class="name-box name-box-other" v-else>
			{{ pageType === 'mall' ? boxData.goodsName : boxData.seriesName }}
		</view>
		<!-- 价格信息 -->
		<view class="price-box" v-if="!showOtherInfo && !showDefaultParam">
			<text class="after-price-box" v-if="boxData.isSpecialOffer !== 0 && !boxData.isEnd">
				<text class="price-unit" :style="{
					'font-size': !!boxFontScale ? `${boxFontScale*25}rpx` : '25rpx'
				}">￥</text>
				<text class="price-txt gilroy-bold-txt" :style="{
					'font-size': !!boxFontScale ? `${boxFontScale*36}rpx` : '36rpx'
				}">{{ boxData.specialPriceFormat }}</text>
			</text>
			<text class="after-price-box" v-if="boxData.isSpecialOffer === 0 || (boxData.isSpecialOffer !== 0 && boxData.isEnd)">
				<text class="price-unit" :style="{
					'font-size': !!boxFontScale ? `${boxFontScale*25}rpx` : '25rpx'
				}">￥</text>
				<text class="price-txt gilroy-bold-txt" :style="{
					'font-size': !!boxFontScale ? `${boxFontScale*36}rpx` : '36rpx'
				}">{{ boxData.priceFormat }}</text>
			</text>
			
			<!-- 秒杀价格 -->
			<text class="before-price-box gilroy-bold-txt" v-if="!showBean && boxData.isSpecialOffer !== 0 && !boxData.isEnd">
				<text class="price-unit" :style="{
					'font-size': !!boxFontScale ? `${boxFontScale*21}rpx` : '21rpx'
				}">￥</text>
				<text class="price-txt gilroy-bold-txt" :style="{
					'font-size': !!boxFontScale ? `${boxFontScale*21}rpx` : '21rpx'
				}">{{ boxData.priceFormat }}</text>
			</text>
			
			<!-- 3.3.5重新调整 优先级：金豆抵扣、首单立减、砍价、端盒立减 -->
			<!-- 金豆抵扣优先级最高 -->
			<view class="firstDiscount-box price-right-box" v-if="!!showBean && boxData.ableUseBeans > 0 && themeType != 1">
				{{ `金豆抵${boxData.ableUseBeans/100}元`}}
			</view>
			<!-- 首单立减，如果是砍价专题，优先展示砍价 -->
			<view class="firstDiscount-box price-right-box" v-else-if="boxData.firstDiscount > 0 && themeType != 1">
				{{!goodsWidth || parseInt(goodsWidth) >= 300 ? `首单减${boxData.firstDiscount>> 0}元` : '首单减'}}
			</view>
			<!-- 砍价(已售罄不展示) -->
			<view v-else-if="boxData.isSale == 1 && boxData.bargainPrice > 0 && !boxData.isSoldOut" class="bargain-box price-right-box">
				{{!goodsWidth || parseInt(goodsWidth) >= 300 ? `砍 -${boxData.bargainPrice}元` : '砍价'}}
			</view>
			<!-- 端盒立减 -->
			<view class="firstDiscount-box price-right-box" v-else-if="boxData.cutRmb > 0">
				{{!goodsWidth || parseInt(goodsWidth) >= 300 ? `端盒减${boxData.cutRmb>> 0}元` : '端盒减'}}
			</view>
		</view>
		<view class="price-box" v-else-if="!showOtherInfo && showDefaultParam">
			<text class="after-price-box">
				<text class="price-unit" :style="{
					'font-size': !!boxFontScale ? `${boxFontScale*25}rpx` : '25rpx'
				}">￥</text>
				<text class="price-txt gilroy-bold-txt" :style="{
					'font-size': !!boxFontScale ? `${boxFontScale*36}rpx` : '36rpx'
				}">{{ boxData.priceFormat }}</text>
			</text>
		</view>
		<view class="price-box-other" v-else>
			<text class="after-price-box">
				<text class="price-unit">￥</text>
				<text class="price-txt gilroy-bold-txt">{{ boxData.isSpecialOffer !== 0 && !boxData.isEnd ? boxData.specialPriceFormat : boxData.priceFormat }}</text>
			</text>
		</view>
    </view>
</template>

<script> 
import { mapGetters } from 'vuex'
export default {
	name: 'boxItem',		// 抽盒单例
	data () {
		return {
		}
    },
	/*
	* boxData 	列表数据
	* pageType  数据类型 home--抽盒 mall--商城商品
	* themeType	0:售卖专题,1:砍价专题,2:秒杀专题, 秒杀系列展示已结束，其他情况不展示
	* goodsWidth 默认332rpx布局，需要改动动态传入
	* showType	是否显示类型 抽盒/商品
	* showDefaultParam 是否展示基础信息
	* showBean 是否展示金豆抵扣
	*/
    props: ['boxData', 'pageType', 'themeType', 'goodsWidth', 'showType', 'boxFontScale', 'showOtherInfo', 'showDefaultParam', 'showBean', 'isShowNumber', 'index']
}
</script>

<style lang="less" scoped>
.box-item {
	width: 332rpx;
	margin-bottom: 48rpx;
	text-align: center;
	font-weight: bold;
	// 系列图
	.pic-box {
		width: 100%;
		height: 332rpx;
		border-radius: 15rpx;
		position: relative;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		overflow: hidden;
		transition: all .17s ease-in-out;
		
		.number-label {
			width: 68rpx;
			height: 52rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 10;
			&-0 {
				background-image: url(../../static/newImage/icon/home_icon1.png);
				background-size: 100% 100%;
			}
			&-1 {
				background-image: url(../../static/newImage/icon/home_icon2.png);
				background-size: 100% 100%;
			}
			&-2 {
				background-image: url(../../static/newImage/icon/home_icon3.png);
				background-size: 100% 100%;
			}
			&-3 {
				background-image: url(../../static/newImage/icon/home_icon4.png);
				background-size: 100% 100%;
			}
		}
		
		.yinxiao-icon {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			width: 100%;
			height: 100%;
		}
	}
	// 即将开售功能
	.soon-begin{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: #FFFFFF;
		background-color: rgba(14, 15, 18, .35);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.title{
			font-size: 20rpx;
			line-height: 23rpx;
		}
		.txt{
			font-size: 32rpx;
			line-height: 36rpx;
			margin-top: 10rpx;
		}
	}
	.tag-contianer {
		position: absolute;
		top: 16rpx;
		left: 12rpx;
		
		display: flex;
		.tag-box + .tag-box {
			margin-left: 8rpx;
		}
	}
	// 预售功能
	.tag-box {
		background-color: #fff;
		transform: skew(-13deg);
		border-radius: 10rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		height: 40rpx;
		color: #0E0F12;
		text-align: center;
		max-width: 250rpx;
		&.deposit-box {
			background-color: #0E0F12;
			color: #FFFFFF;
		}
		
		.tag-txt {
			display: inline-block;
			transform: skew(13deg);
			padding: 0 8rpx;
			box-sizing: border-box;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis; 
			max-width: 234rpx;
		}
	}
	// 秒杀功能
	.isSpecialOffer-box{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-image: url(../../static/newImage/icon/title_home_qianggou_new.png);
		background-size: 100% 100%;
		font-size: 0;
		height: 66rpx;
		text-align: left;
		.new-bottom-txt{
			display: inline-block;
			vertical-align: bottom;
			color: #FFFFFF;
			font-size: 23rpx;
			text-align: center;
			&.new-bottom-title {
				width: 33%;
				height: 68rpx;
				line-height: 68rpx;
				font-size: 25rpx;
			}
			&.new-bottom-time{
				// box-sizing: border-box;
				height: 58rpx;
				line-height: 58rpx;
				width: 66%;
				// padding: 0 16rpx;
				display: inline-flex;
				// justify-content: space-between;
				justify-content: center;
			}
			.time-txt{
				font-size: 25rpx;
				margin-right: 8rpx;
			}
		}
	}
	.isSpecialOffer-box-mall {
		width: 33%;
		height: 66rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-image: url(../../static/newImage/icon/title_home_qianggou_box.png);
		background-size: 100% 100%;
		font-size: 0;
		height: 66rpx;
		text-align: center;
		&.mall-bottom-title  {
			width: 100%;
			height: 66rpx;
			line-height: 66rpx;
			font-size: 25rpx;
		}
	}
	// 已售罄
	.soldout-box{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: #FFFFFF;
		background-color: rgba(14, 15, 18, .35);
		font-size: 36rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 332rpx;
		z-index: 5;
	}
	// 系列名
	.name-box {
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
		color: #0E0F12;
		height: 80rpx;
		line-height: 40rpx;
		margin: 16rpx 0;
		white-space: normal;
		&-other {
			height: 48rpx;
			font-size: 22rpx;
			line-height: 24rpx;
			margin: 28rpx 0;
		}
	}
	// 价格
	.price-box{
		position: relative;
		text-align: left;
		.after-price-box{
			color: #0E0F12;
			margin-right: 11rpx;
			.price-unit{
				font-size: 25rpx;
			}
			.price-txt{
				font-size: 36rpx;
				line-height: 34rpx;
			}
		}
		.before-price-box{
			font-size: 21rpx;
			color: #B9BDC3;
			text-decoration: line-through;
			line-height: 22rpx;
		}
		.price-right-box{
			position: absolute;
			right: 0;
			border-radius: 20rpx;
			top: 0;
			bottom: 0;
			margin: auto;
			box-sizing: border-box;
			font-size: 16rpx;
			display: flex;
			align-items: center;
			&.firstDiscount-box{
				height: 30rpx;
				padding: 0 12rpx;
				background: #F7F9FB;
				border-radius: 16rpx;
				
				font-size: 18rpx;
				font-family:  PingFangSC-Regular, PingFang SC;
				font-weight: 500;
				color: #FF6198;
				line-height: 30rpx;
			}
			&.bargain-box{
				height: 30rpx;
				padding: 0 12rpx;
				background: #FF6198;
				border-radius: 16rpx;
				
				font-size: 18rpx;
				font-family:  PingFangSC-Regular, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 30rpx;
			}
		}
	}
	.price-box-other {
		position: relative;
		text-align: left;
		.after-price-box{
			color: #AD86EC;
			margin-right: 11rpx;
			.price-unit{
				font-size: 25rpx;
			}
			.price-txt{
				font-size: 28rpx;
				line-height: 28rpx;
			}
		}
	}
}
</style>
