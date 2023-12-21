<template>
	<view class="home-news">
		<home-item topLeft="热门资讯" lineColor="#3A74FD" topRight="更多 >" @topTap="seeMore()">
			<template #bottomContent>
				<view class="new-list">
					<view class="list-item" v-for="(item, index) in newsList" :key="item.id" @tap="public.pageJump(item.link)">
						<image class="item-img" :src="item.img" mode="aspectFill"></image>
						<view class="item-right">
							<view class="item-title">{{item.title}}</view>
							<view class="item-time">{{item.start_time}}</view>
						</view>
					</view>
				</view>
			</template>
		</home-item>		
	</view>
</template>

<script>
	import { pageJump } from "@/utils/index.js"
	import homeItem from "@/componentsLib/home/homeItem.vue"
	import { apiHomeGetNews } from "@/api/home.js"
	export default {
		components: {
			homeItem
		},
		data() {
			return {
				pageJump,
				newsList: [],				// 资讯列表
				newsPage: 1,				// 资讯列表页码
				newsMore: true,				// 资讯列表是否还有更多
				// officialAccountLink: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5ODkwNzAwMg==#wechat_redirect',
				// officialAccountLink: 'http://weixin.qq.com/r/rHW2ribEYHsfrWLN9yC_',
			}
		},
		mounted() {
			this.getHomeNews()
			uni.$off("NEXT_NEWS")
			uni.$on("NEXT_NEWS", () => {
				if(!this.newsMore){
					console.log("没有更多了")
					return
				}
				this.newsPage ++
				this.getHomeNews(0)
			})
		},
		methods:{
			// 获取资讯列表
			getHomeNews(init = 1){
				if(init){
					this.newsList = []
					this.newsPage = 1
				}
				apiHomeGetNews({
					page: this.newsPage
				})
					.then(res => {
						// console.log("获取资讯列表",res)
						this.newsList = this.newsList.concat(res.list)
						this.newsMore = this.newsList.length < res.total
						// console.log("资讯列表",this.newsList,this.newsMore)
					})
			},
			seeMore() {
				this.$emit('seeMore')
				// pageJump(this.officialAccountLink)
			}
		}
	}
</script>

<style lang="less" scoped>
	.new-list{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 18rpx;
		.list-item{
			background: #FFFFFF;
			border-radius: 24rpx;
			width: 684rpx;
			height: 204rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 34rpx 0 12rpx;
			box-sizing: border-box;
			margin-bottom: 28rpx;
			.item-img{
				width: 240rpx;
				height: 180rpx;
				margin-right: 24rpx;
				border-radius: 16rpx;
			}
			.item-right{
				flex: 1;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 24rpx 0;
				box-sizing: border-box;
				.item-title{
					font-size: 28rpx;
					color: #0E0F12;
					font-weight: 400;
					line-height: 40rpx;
				}
				.item-time{
					font-size: 20rpx;
					color: #999999;
					font-weight: 500;
				}
			}
		}
	}
</style>