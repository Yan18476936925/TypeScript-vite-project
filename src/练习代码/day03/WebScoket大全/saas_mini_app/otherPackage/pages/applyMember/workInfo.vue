<template>
	<view class="work-info apply-page">
		<step-bar step="2"></step-bar>
		<view class="info-table">
			<view class="info-content">
				<view class="info-picker">
					<view class="info-text">所属行业</view>
					<view class="info-picker-text" :class="[industryName ? 'hava-value' : '']" @tap="chooseIndustry">{{industryName ? industryName : '请选择你从事的行业'}}</view>	
				</view>
						
				<view class="info-input">
					<view class="info-text">企业名称</view>
					<input class="item-input" type="text" placeholder="请输入你当前入职的企业名称" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx"  v-model="business_name" maxlength="30"/>
				</view>
						
				<view class="info-input">
					<view class="info-text">职务</view>
					<input class="item-input" type="text" placeholder="请输入你当前的职务" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx"  v-model="business_position" maxlength="10"/>
				</view>
				
				<view class="info-input">
					<view class="info-text">所在地区</view>
					<view class="info-picker-text" :class="[business_address ? 'hava-value' : '']" @tap="chooseCity">{{business_address ? business_address : '请选择企业的所在地区'}}</view>
				</view>
				
				<view class="info-input">
					<view class="info-text">详细地址</view>
					<input class="item-input" type="text" placeholder="请输入企业的详情地址（选填）" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx" v-model="business_detailed" maxlength="30"/>
				</view>
				
			</view>
			
		</view>
		<view class="next-btn" @tap="nextStep">下一步</view>
		
		<single-picker :show.sync="showPicker" :list="pickList" :title="pickTitle" @chooseItem="chooseItem"></single-picker>
		<mpvue-city-picker ref="mpvueCityPicker" :siteList="siteList" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		
	</view>
</template>

<script>
	import stepBar from "@/otherPackage/components/stepBar.vue"
	import singlePicker from "@/componentsLib/publicComponents/singlePicker.vue"
	import mpvueCityPicker from "@/componentsLib/publicComponents/mpvueCityPicker.vue"
	import { apiGetDivision, apiGetIndustry } from "@/api/apply.js"
	export default{
		components:{
			stepBar,
			singlePicker,
			mpvueCityPicker
		},
		data(){
			return {
				industry_id: -1,					// 工作行业id
				industryName: "",
				industryList: [],
				business_name: "",					// 企业名称
				business_position: "",				// 企业职务
				business_address: "",				// 企业地址
				business_detailed: "",				// 企业地址详情
				
				pickerType: 0,						// 选择器类型 1工作行业 2企业地址
				showPicker: false,					// 选择器弹窗
				pickList: [],						// 选择器列表
				pickTitle: "",						// 选择器标题
				
				siteList: [],							// 三级地址列表
				chooseSiteType: 0,						// 地址弹窗类型 0籍贯 1住址
				regionId: "", 							// 省市区选择结果id集合
				customItem: "请选择",					// 省市区placeholder
				isSelectTown: false, 					// 是否打开乡镇选择弹窗
				townList: [], 							// 乡镇数据列表
				selectId: -1, 							// 区id
				id: "", 								// 修改地址id 没有代表为新增
				edit_act: 0, 							// 判断是否是组件中进入，1--是 0--不是
				isGet: 0, 								// 防止二次点击
				cityPickerValueDefault: [0, 0, 1],
				isDoing: false,                 		// 是否在选择城镇
				addrs: [],
				region: [], 							// 省市区选择结果
				selectTown: "", 						// 选择的乡镇
				switchVal: false, 						// 是否默认
			}
		},
		async mounted() {
			console.log("this.store",this.$store.state.apply)
			for(let key in this.$store.state.apply){
				this.$data[key] = this.$store.state.apply[key] || this.$data[key]
			}
			await this.chooseIndustry(0)
		},
		methods:{
			// 获取行业列表
			async chooseIndustry(show){
				await apiGetIndustry()
					.then(res => {
						this.industryList = res.map(i => {
							i.label = i.name
							return i
						})
						this.pickList = this.industryList
						this.pickerType = 1
						this.pickTitle = "所属行业"
						console.log("this.industryList",this.industryList.length,res)
						if(!show){
							this.industryName = this.industryList.find(i => i.id == this.industry_id) ? this.industryList.find(i => i.id == this.industry_id).name : this.industryName
						}
						if(this.industryList.length > 0){
							this.showPicker = show
						}else{
							this.public.toast("未获取到行业信息")
						}
					})
					.catch(() => {
						this.public.toast("未获取到行业信息")
					})
			},
			// 获取乡镇信息
			async getTownList() {
				try {
					let data = await apiGetDivision({parent_id: this.regionId})
					this.selectTown = "";
					this.selectId = -1;
					if(data.length > 0){
						this.pickList = data;
						this.pickerType = 2
						this.showPicker = true
						this.pickTitle = "所在地区"
					}
					this.isDoing = false;
				} catch(err) {
					console.log("err",err)
					this.isDoing = false;
				}
			},
			// picker选择
			chooseItem(item){
				console.log(item)
				switch (this.pickerType){
					case 1:
						this.industry_id = item.id
						this.industryName = item.label
						// this.$store.commit("setData", this.$data);
						console.log('this.industry_id',this.industry_id )
						break;
					case 2:
						this.selectTown = item;
						this.selectId = item.value;
						this.home_street = this.selectTown.value
						console.log("this.selectTown.value",this.selectTown.value)
						this.business_address = this.business_address + " " + this.selectTown.label
						break;
					default:
						break;
				}				
			},
			// 省市区选择
			async chooseCity() {
				this.pickerType = 2
				console.log("chooseCity")
				if(this.isDoing) {
					uni.showToast({
						title: "操作过快，请稍等~",
						icon: "none",
						duration: 1500
					})
				} else {
					// console.log("this.chooseSiteType",this.chooseSiteType)
					// if (this.chooseSiteType == 1) {
					// 	this.siteList = await apiGetDivision({parent_id: this.regionId})
					// }
					this.$refs.mpvueCityPicker.show();
				}
			},
			onConfirm(e) {
				// 确认省市区选择
				// let pickerText = JSON.stringify(e); // 填写的城市 得出的是一串字符串，传给服务器的需要是数组
				let pickerText = e; // 填写的城市 得出的是一串字符串，传给服务器的需要是数组
				this.regionId = e.areaCode;
				this.region = e.label.split("-");
				console.log("this.region",this.region,e)
				this.isDoing = true;
				this.home_province = e.provinceCode
				this.home_city =  e.cityCode
				this.home_area =  e.areaCode
				this.business_address = this.region.join(" ")
				if(this.regionId){
					this.getTownList();
				}else{
					this.home_street = 0
				}
			},
			onCancel(e) {
				this.isDoing = false;
			},
			// 下一步
			nextStep(){
				if(!this.industryName) return this.public.toast("请选择你的行业")
				if(!this.business_name) return this.public.toast("请输入就职的企业名称")
				if(!this.business_position) return this.public.toast("请输入你在企业的职务")
				if(!this.business_address) return this.public.toast("请选择所在地区")
				this.$store.commit("setData", this.$data);
				this.public.pageJump("/otherPackage/pages/applyMember/signConfirm")
			}			
		}
	}
</script>

<style lang="less" scoped>
	@import url("apply.less");
</style>