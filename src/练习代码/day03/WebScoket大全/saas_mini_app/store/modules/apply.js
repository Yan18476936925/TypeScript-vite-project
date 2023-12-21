// 这里是专门给提交审核接口用的，如无必要不要修改state的格式或用除setData外的方式修改state数据
import { apiGetRejectedDetail } from "@/api/apply.js"
const state = {
	photo: "",								// 头像
	name: "",								// 姓名
	sex: -1,								// 性别 1男2女
	birthday_type: -1,						// 生日庆祝 1阴历 2阳历
	birthday: "",							// 生日 （格式 1996-01-01）
	native_place: "",						// 籍贯 (例如 广东 深圳)
	national: "",							// 民族
	phone: "",								// 手机号
	email: "",								// 邮箱
	home_province: 0,						// 居住省份id
	home_city: 0,							// 居住城市id
	home_area: 0,							// 居住县区id
	home_street: 0,							// 居住街道id
	home_address: "",						// 居住地址（展示用）
	home_detailed: "",						// 居住地址详情
	social_position:"",						// 社会职务
	hobbies:"",								// 兴趣爱好
	
	education: -1,							// 学历 （1大专 2 本科 3硕士 4博士）
	educationName: "",						// 学历（展示用）
	school_year: "",						// 入学年份
	college_id: -1,							// 学院id
	collegeName: "",						// 学院（展示用）
	major: "",								// 专业
	
	industry_id: -1,						// 工作行业id
	industryName: "",						// 工作行业（展示用）
	business_name: "",						// 企业名称
	business_position: "",					// 企业职务
	business_address: "",					// 企业地址
	business_detailed: "",					// 企业地址详情
	
	apply_user: "",							// 申请人姓名
}
const getters = {
	
}
const mutations = {
	setData(state, data){
		for(let key in state){
			state[key] = data[key] || state[key]
		}
	}
}
const actions = {
	async rejectedDetail ({ commit }, state){
		await apiGetRejectedDetail()
		.then(res => {
			commit("setData",res)
		})
	}
}
export default {
	state,
	getters,
	mutations,
	actions
}