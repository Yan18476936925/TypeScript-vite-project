<template>
	<view class="recommend-box">
		<slot name="header"></slot>
		<mall-goods-lists-box :goodsWidth="goodsWidth" :boxList="listData" :pageType="!!pageType ? pageType : 'mall'" @openOther="gotoRoom"></mall-goods-lists-box>
	</view>
</template>

<script>
	import mallGoodsListsBox from '@/componentsLib/publicComponents/goodsListsBox.vue';
	export default {
		name: 'goodsListsBox',  // 盲盒/商品列表
		data() {
			return {
			}
		},
		/*
		* boxList 	列表数据
		* pageType  数据类型 home--抽盒 mall--商城商品
		* goodsWidth 默认332rpx布局，需要改动动态传入
		*/
		props: ['listData', 'pageType', 'goodsWidth'],
		components: { mallGoodsListsBox },
		methods: {
			gotoRoom(url) {
				this.$emit('linkTo', url)
			},
		}
	}
</script>

