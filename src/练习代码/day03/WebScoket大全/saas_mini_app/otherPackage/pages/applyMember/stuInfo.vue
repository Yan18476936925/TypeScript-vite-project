<template>
	<view class="stu-info apply-page">
		<step-bar step="1"></step-bar>
		<view class="info-table">
			<view class="info-content">
				<view class="info-picker">
					<view class="info-text">学历</view>
					<view class="info-picker-text" :class="[educationName ? 'hava-value' : '']" @tap="chooseEducation">{{educationName ? educationName : '请选择你的学历'}}</view>
				</view>
						
				<view class="info-picker">
					<view class="info-text">入学年份</view>
					<view class="info-picker-text" :class="[school_year ? 'hava-value' : '']" @tap="chooseYear">{{school_year ? school_year : '请选择'}}</view>	
				</view>
				
				<view class="info-picker">
					<view class="info-text">所属院系</view>
					<view class="info-picker-text" :class="[collegeName ? 'hava-value' : '']" @tap="chooseCollege">{{collegeName ? collegeName : '请选择'}}</view>	
				</view>
						
				<view class="info-input">
					<view class="info-text">专业</view>
					<input class="item-input" type="text" placeholder="请输入专业名称" placeholder-style="font-weight: 600; color: #DBDBDB;font-size: 28rpx"  v-model="major" maxlength="30"/>
				</view>
			</view>
			
		</view>
		<view class="next-btn" @tap="nextStep">下一步</view>
		
		<single-picker :show.sync="showPicker" :list="pickList" :title="pickTitle" @chooseItem="chooseItem"></single-picker>
	</view>
</template>

<script>
	import stepBar from "@/otherPackage/components/stepBar.vue"
	import singlePicker from "@/componentsLib/publicComponents/singlePicker.vue"
	import { apiGetCollege } from "@/api/apply.js"
	export default{
		components:{
			stepBar,
			singlePicker,
		},
		data(){
			return {
				education: -1,								// 学历 （1大专 2 本科 3硕士 4博士）	
				educationName: "",
				educationList: [
					{label: "大专", value: 1},
					{label: "本科", value: 2},
					{label: "硕士", value: 3},
					{label: "博士", value: 4},
				],
				school_year: "",							// 入学年份
				college_id: -1,								// 学院id
				collegeName: "",
				collegeList: [],
				major: "",									// 专业
				
				pickerType: 0,								// 选择器类型 1学历 2入学 3学院
				showPicker: false,							// 选择器弹窗
				pickList: [],								// 选择器列表
				pickTitle: "",								// 选择器标题
			}
		},
		async mounted() {
			console.log("this.store",this.$store.state.apply)
			for(let key in this.$store.state.apply){
				this.$data[key] = this.$store.state.apply[key] || this.$data[key]
			}
			this.educationName = this.educationList.find(i => i.value == this.education) ? this.educationList.find(i => i.value == this.education).label : this.educationName
			await this.chooseCollege(0)
			console.log(this.education)
		},
		methods:{
			// 学历列表
			chooseEducation(){
				this.pickList = this.educationList
				console.log(this.pickList)
				this.pickerType = 1
				this.pickTitle = "学历"
				this.showPicker = true
			},
			// 入学年份列表
			chooseYear(){
				this.pickList = Array(100).fill({}).map((e, i) => e = {label: i + new Date().getFullYear() - 99, value: i + new Date().getFullYear() - 99}).reverse();
				this.pickerType = 2
				this.pickTitle = "入学年份"
				this.showPicker = true
			},
			// 获取学院列表
			async chooseCollege(show = 1){
				await apiGetCollege()
					.then(res => {
						this.collegeList = res.map(i => {
							i.label = i.name
							return i
						})
						this.pickList = this.collegeList
						this.pickerType = 3
						this.pickTitle = "所属院系"
						console.log("this.collegeList",this.collegeList.length,res)
						if(!show){
							this.collegeName = this.collegeList.find(i => i.id == this.college_id) ? this.collegeList.find(i => i.id == this.college_id).name : this.collegeName
						}
						if(this.collegeList.length > 0){
							this.showPicker = show
						}else{
							this.public.toast("未获取到学院信息")
						}
					})
					.catch(() => {
						this.public.toast("未获取到学院信息")
					})
			},
			chooseItem(item){
				console.log(item)
				switch (this.pickerType){
					case 1:
						this.education = item.value
						this.educationName = item.label
						break;
					case 2:
						this.school_year = item.value
						break;
					case 3:
						this.college_id = item.id
						this.collegeName = item.label
						break;
					default:
						break;
				}				
			},
			// 下一步
			nextStep(){
				if(!this.educationName) return this.public.toast("请选择学历")
				if(!this.school_year) return this.public.toast("请选择入学年份")
				if(!this.collegeName) return this.public.toast("请选择你的院系")
				if(!this.major) return this.public.toast("请输入你的专业")
				this.$store.commit("setData", this.$data);
				this.public.pageJump("/otherPackage/pages/applyMember/workInfo")
			}
		}
	}
</script>

<style lang="less" scoped>
	@import url("apply.less");
</style>