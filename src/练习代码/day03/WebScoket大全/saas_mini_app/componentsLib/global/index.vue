<template>
	<view class="global">
		<sightseer-model :show.sync="isWxLogin302"></sightseer-model>
		<netWorkErr-model :show="isNetWorkErr"></netWorkErr-model>
	</view>
</template>

<script>

export default {
	name: "global",					// 公共组件（小程序并没有公共组件概念，所以每个页面都会引入此组件）
	data () {
		return {
			isWxLogin302: false,	// 登录异常
		}
	},
	computed: {
		wxLogin302() {
			return this.$store.getters.wxLogin302
		},
		// 网络异常
		isNetWorkErr() {
			return this.$store.getters.netWorkErr
		},
	},
	components: {},
	watch: {
		wxLogin302: {
			handler(val) {
				this.isWxLogin302 = val
			},
			immediate: true,
		}
	}
}
</script>
