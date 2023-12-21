<template>
	<view class="goodsLists-box">
		<view class="blind-box" v-for="(data, key) in boxList" :key="key" @tap="openOther(data)">
			<box-item 
				:boxData="data" :showType="showType" :pageType="pageType == 'all' ? data.type : pageType" :goodsWidth="goodsWidth" :showDefaultParam="showDefaultParam">
			</box-item>
		</view>
		<!-- 列表加载到末尾，旧的效果，先屏蔽 -->
		<view v-if="arriveBottom && boxList.length > 6">
			<noMore width="686"></noMore>
		</view>
	</view>
</template>

<script>
	import boxItem from '@/componentsLib/publicComponents/boxItem.vue';
	import noMore from '@/componentsLib/publicComponents/noMore.vue'
	import { mapGetters } from "vuex"
	export default {
		name: 'goodsListsBox',  // 盲盒/商品列表
		data() {
			return {
			}
		},
		/*
		* boxList 	列表数据
		* pageType  数据类型 all--搜索页包含抽盒和商品 home--抽盒 mall--商城商品
		* goodsWidth 默认332rpx布局，需要改动动态传入
		* showType	是否显示类型 抽盒/商品
		* showDefaultParam 是否展示基础信息
		*/
		props: ['boxList', 'pageType', 'arriveBottom', 'goodsWidth', 'showType', 'showDefaultParam'],
		components: { boxItem, noMore },
		computed: {
			...mapGetters([
				"isSightseer",
			]),
		},
		methods: {
			// 打开其他页面
			openOther(data) {
				// 2021-05-14 wf V3.2.1需求
				if(+data.isSoldOut === 1 && (this.pageType === 'mall' || (this.pageType == 'all' && data.type == 'mall'))) {
					uni.showToast({
						icon: 'none',
						title: '已售罄,敬请期待下次售卖',
						duration: 2000
					})
					// this.$emit('openOther', 'isSoldOut')
					return;
				}
				if(this.pageType === 'mall' || (this.pageType == 'all' && data.type == 'mall')) {
					this.$emit('openOther', `/pages/mallDetail/main?goodsId=${data.goodsId}&isBack=1`)
				} else {
					// 游客模式下，已售罄未下架的抽盒不能进入
					if(+data.isSoldOut === 1 && this.isSightseer == 1) {
						uni.showToast({
							icon: 'none',
							title: '已售罄,敬请期待下次售卖',
							duration: 2000
						})
						return;
					}
					// 砍价
					if(data.bargainPrice > 0) {
						this.$emit('openOther', `/pages/buyBlindBox/main?seriesId=${data.seriesId}&type=homeBargainList`)
					} else {
						this.$emit('openOther', `/pages/buyBlindBox/main?seriesId=${data.seriesId}`)
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.goodsLists-box{
		width: 100%;
		font-size: 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap; 
		.blind-box{
			display: inline-block;
			vertical-align: top;
		}
	}
</style>
