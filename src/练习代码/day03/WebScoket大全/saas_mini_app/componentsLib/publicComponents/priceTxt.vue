<template>
  <view 
    class="pricetxt" 
    :style="{
      'color': color,
	  'line-height': !!lineHeight ? `${lineHeight}rpx` : 'inherit'
    }">
    <text class="pricetxt-symbol" :style="{'font-size': `${symbolSize}rpx`}">{{ addOrsubtract ? addOrsubtract : '' }}&yen;</text> 
	<text class="pricetxt-before gilroy-bold-txt" :style="{
		'font-size': !!isDiy && !!diyBeforeSize ? `${diyBeforeSize}rpx` : 
		fontType == 'large' ? '47rpx' : 
		fontType == 'middleLarge' ? '40rpx' : 
		fontType == 'medium' ? '40rpx' : 
		fontType == 'middleSmall' ? '40rpx' : 
		fontType == 'small' ? '32rpx' :  '47rpx'
		}">
		{{formatPrice.priceBeforeDot}}
	</text> 
	<text class="pricetxt-before gilroy-bold-txt" :style="{
		'font-size': !!isDiy && !!diyBeforeSize ? `${diyBeforeSize}rpx` : 
		fontType == 'large' ? '47rpx' : 
		fontType == 'middleLarge' ? '40rpx' : 
		fontType == 'medium' ? '40rpx' : 
		fontType == 'middleSmall' ? '40rpx' : 
		fontType == 'small' ? '32rpx' :  '47rpx'
		}" v-if="!!formatPrice.priceAfterDot">.</text>
	<text class="pricetxt-after gilroy-bold-txt" :style="{
		'font-size': !!isDiy && !!diyAfterSize ? `${diyAfterSize}rpx` : 
		fontType == 'large' ? '29rpx' : 
		fontType == 'middleLarge' ? '32rpx' : 
		fontType == 'medium' ? '29rpx' : 
		fontType == 'middleSmall' ? '25rpx' : 
		fontType == 'small' ? '22rpx' : '29rpx'
		}"
	>{{formatPrice.priceAfterDot}}</text>
  </view>
</template>

<script>
export default {
  props: {
		addOrsubtract: {
			type: String,
			default: ''
		},					// 加或减符号，也可以其他
		symbol: {
			type: String,
			default: ''
		},
		symbolSize: {
			type: Number,
			default: 25
		},
		price: {
			type: Number,
			default: 0
		},
		fontType: {
			type: String,
			default: 'middle' // large 大字体，middleLarge 中大字体，medium 中等字体，middleSmall 中小字体，small 小字体
		},
		color: {
			type: String,
			default: '#0E0F12'
		},
		// 是否自定义
		isDiy: {
			type: Boolean,
			default: false
		},
		diyBeforeSize: {
			type: Number,
			default: 0
		},
		diyAfterSize: {
			type: Number,
			default: 0
		},
		needPoint: {
			type: Boolean,
			default: true
		},
		lineHeight: {
			type: Number,
			default: 0
		},
  },
  data() {
    return {
      
    }
  },
  computed: {
		formatPrice() {
			let price = "";
			let priceIndex = -1;
			let priceBeforeDot = "";
			let priceAfterDot = "";
			if ((typeof this.price == 'number' && this.price.constructor == Number) || (typeof this.price == 'string' && this.price.constructor == String)) { // 为数字
				// 需要小数点
				if(this.needPoint) {
					price = Number(this.price).toFixed(2) // 转换保留两位小数
				} else {
					price = !(this.price - 0) ? 0 : (this.price - 0) % 1 > 0 ? Number(Math.round(this.price * 100) / 100).toFixed(2) :this. price - 0;
				}
				priceIndex = (price + "").indexOf(".");
				if(priceIndex > -1) {
					priceBeforeDot = price.substring(0, priceIndex)
					priceAfterDot = price.slice(priceIndex + 1, price.length)
				} else {
					priceBeforeDot = price
					priceAfterDot = ""
				}
				return {
					price,
					priceBeforeDot,
					priceAfterDot
				}
			}
		}
  }
}
</script>

<style lang="less" scoped>
.pricetxt {
	max-width: 200rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
  .pricetxt-symbol {
	  margin-right: 2rpx;
  }
}
</style>