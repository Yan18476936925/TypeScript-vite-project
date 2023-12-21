<template>
	<cover-view class="custom-tabbar">
		<cover-view class="tabbar-placeholder"></cover-view>
		<cover-view class="tabbar-content">
			<cover-view class="tabbar-item" v-for="(item, index) in tabBarList" :key="index">
				<image class="item-img" :src="item.selectedIconPath2" mode="" v-if="iconIndex == index"></image>
				<image class="item-img" :src="item.iconPath2" mode="" v-else></image>
				<cover-view class="item-text">{{}}</cover-view>
			</cover-view>			
		</cover-view>
	</cover-view>
</template>

<script>
	import pagesJson from "@/pages.json"
	export default{
		data(){
			return {
				tabBar: pagesJson.tabBar || {},
				tabBarList: [],
			}
		},
		props:["iconIndex"],
		mounted() {
			this.$nextTick(() => {
				this.tabBarList = pagesJson.tabBar.list
				this.tabBarList.forEach(i => {
					i.iconPath2 = "../../"+i.iconPath
					i.selectedIconPath2 = "../../"+i.selectedIconPath
				})
			})
		},
	}
</script>

<style lang="less" scoped>
.custom-tabbar{
	.tabbar-placeholder{
		width: 100vw;
		height: 180rpx;
	}
	.tabbar-content{
		width: 100vw;
		height: 180rpx;
		position: fixed;
		bottom: 0;
		background: rgba(255,255,255,0.85);
		box-shadow: 0 0 32rpx 0 rgba(223,185,193,0.23);
		border-radius: 40rpx 40rpx 0 0;
	}
}
</style>