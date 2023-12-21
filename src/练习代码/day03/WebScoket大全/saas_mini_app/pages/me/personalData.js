export const personalInfoList = [{
		label: '图片',
		stay: true,
		fields: 'photo',
		ifImg: true
	},
	{
		label: '姓名',
		stay: true,
		fields: 'name',
	},
	{
		label: '手机号',
		stay: false,
		fields: 'phone',
	},
	{
		label: '性别',
		stay: true,
		fields: 'sex',
	},
	{
		label: '微信号',
		stay: false,
		fields: 'wechat_id',
	},
	{
		label: '所在地',
		stay: false,
		fields: 'home_address',
		fieldsList: ['home_area','home_city','home_province','home_street'],
	},
	{
		label: '详细地址',
		stay: false,
		fields: 'home_detailed',
	},
	{
		label: '个人简介',
		stay: false,
		fields: 'introduction',
	},
	{
		label: '兴趣爱好',
		stay: false,
		fields: 'hobbies',
	},
	// {
	// 	label: '企业名称',
	// 	stay: false,
	// 	fields: 'business_name',
	// },
	// {
	// 	label: '所属行业',
	// 	stay: false,
	// 	fields: 'industry',
	// 	updateField:'industry_id',
	// 	fieldsList: ['industry_id'],
	// },
	// {
	// 	label: '职位',
	// 	stay: true,
	// 	fields: 'business_position',
	// },
	// {
	// 	label: '工作地区',
	// 	stay: false,
	// 	fields: 'business_address',
	// },
	// {
	// 	label: '工作地址',
	// 	stay: false,
	// 	fields: 'business_detailed',
	// },
]
