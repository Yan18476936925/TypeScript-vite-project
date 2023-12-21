<template>
	<view class="home-topic">
		<template v-for="(item, index) in topic">
			<home-item :topLeft="item.title" lineColor="#D40000" :topRight="item.sub_title" @topTap="topicJump(item.link)">
				<template #bottomContent>
					<image class="topic-image" :src="item.img" mode="aspectFill" @tap="topicJump(item.link)"></image>
				</template>
			</home-item>
		</template>
	</view>
</template>

<script>
	import { pageJump } from "@/utils/index.js"
	import homeItem from "@/componentsLib/home/homeItem.vue"
	export default {
		components: {
			homeItem
		},
		data() {
			return {
				pageJump,
			}
		},
		props: [
			"topic",    // topic列表
		],
		methods: {
			topicJump(link) {
				if(!this.$store.getters.openid){
					uni.$emit("OPEN_SIGHTSEER_POPUP")
					return
				}
				if(!!this.public.checkUserStatus()) {
					pageJump(link)
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.topic-image{
		width: 702rpx;
		height: 256rpx;
		margin: 16rpx auto 0;
		border-radius: 24rpx;
	}
</style>