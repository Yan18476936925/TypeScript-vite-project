const companyInfoList = [
	{
			label: '企业封面',
			fields: 'business_cover',
			type: 'imageUpload',
			message: "请上传企业封面"
	},
	{
			label: '企业名称',
			fields: 'business_name',
			type: 'text',
			maxLength: 30,
			message: "请输入就职的企业名称"
	},
	{
			label: '所属行业',
			fields: 'industry_id',
			type: 'select',
			message: "请选择企业行业",
			showFields: 'industry',
	},
	{
			label: '我的职务',
			fields: 'business_position',
			type: 'text',
			maxLength: 20,
			message: "请输入你在企业的职务"
	},
	{
			label: '所在地区',
			fields: "all_address",
			type: 'select',
			message: "请选择所在地区"
	},
	{
			label: '详细地址',
			fields: 'business_address',
			type: 'text',
			maxLength: 30,
			ifSkip: true,
	},
	{
			label: '企业简介',
			fields: 'business_detail',
			type: 'text',
			maxLength: 100,
			ifSkip: true,
	},
	{
			label: '企业图片',
			fields: 'business_images',
			type: 'imagesUpload',
			ifSkip: true,
	},
	// {
	// 		label: '企业官网',
	// 		fields: 'business_link',
	// 		type: 'text',
	// 		maxLength: 50,
	// 		ifSkip: true,
	// },
]
export default companyInfoList;
