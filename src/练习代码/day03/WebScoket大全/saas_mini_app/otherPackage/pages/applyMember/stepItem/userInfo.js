const userInfoList = [
	// fields 字段名
	// showFields 显示字段名
	// ifSkip 是否可跳过
	// 1
	{
		tabTitle: "填写学籍信息",
		bottom_img: "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FkEjE0xvkAAh_Fa3iAkj2Rr-Pxid.png",
		infoList: [{
				label: '姓名',
				fields: 'name',
				type: 'text',
				stay: true,
				placeholder: "你的真实姓名",
				maxLength: 13,
				message: "请输入你的真实姓名"
			},
			{
				label: '学历',
				fields: 'education',
				showFields: "education_name",
				type: 'select',
				stay: true,
				placeholder: "请选择",
				message: "请选择学历"
			},
			{
				label: '入学年份',
				fields: 'school_year',
				type: 'select',
				placeholder: "请选择",
				select_type: "time",
				message: "请选择入学年份",
				timeType:"YYYY"
			},
			{
				label: '院系',
				fields: 'college_id',
				type: 'select',
				showFields: "college",
				stay: true,
				placeholder: "请选择",
				message: "请选择院系"
			},
			{
				label: '专业',
				stay: true,
				showFields: "major",
				fields: 'major_id',
				placeholder: "请选择",
				type: 'select',
				maxLength: 30,
				message: "请选择专业"
			},
		]
	},
	// 2
	{
		tabTitle: "填写基本信息",
		bottom_img: "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FlImzRkhew_foMgXYjdidqkSLe_T.png",
		infoList: [{
				label: '性别',
				stay: true,
				fields: 'sex',
				type: 'switch',
				switchData: ['男', '女'],
				message: "请选择性别"
			},
			{
					label: '生日庆祝',
					fields: 'birthday_type',
					type: 'switch',
					switchData: ['阴历', '阳历'],
					message: "请选择生日庆祝，方便协会为你庆祝"
				},
			{
				label: '生日',
				stay: true,
				fields: 'birthday',
				type: 'select',
				placeholder: "请选择",
				select_type: "time",
				message: "请选择生日日期"
			},
			{
				label: '民族',
				fields: 'national',
				type: 'text',
				stay: true,
				placeholder: "请输入你的民族",
				maxLength: 10,
				message: "请输入你的民族"
			},
		]
	},
	// 3
	{
		tabTitle: "填写工作信息",
		bottom_img: "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/Fmap5fkhzZ2Xgg_7Zp2oSrrtgFar.png",
		infoList: [{
				label: '行业',
				stay: true,
				fields: 'industry_id',
				type: 'select',
				placeholder: "请选择",
				showFields: 'industry',
				message: "请选择行业"
			},
			{
				label: '企业名称',
				fields: 'business_name',
				type: 'text',
				placeholder: "请输入你就职的企业名称",
				maxLength: 50,
				message: "请输入你就职的企业名称"
			},
			{
				label: '职务',
				fields: 'business_position',
				type: 'text',
				stay: true,
				placeholder: "请输入你的职务",
				maxLength: 20,
				message: "请输入你的职务"
			},
			{
				label: '工作地址',
				fields: 'all_address',
				type: 'select',
				placeholder: "请选择",
				message: "请选择工作地址"
			},
			{
				fields: 'business_address',
				type: 'no_label_text',
				placeholder: "请输入企业详细地址",
				message: "请输入企业详细地址",
				maxLength: 20,
			},
		]
	},
	// 4
	{
		bottom_img: "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FkDS7r-6s3XwXFNHNZp0h1ncTewt.png",
		tabTitle: "怎样方便联系您～",
		infoList: [{
				label: '手机号',
				fields: 'phone',
				type: 'text',
				stay: true,
				placeholder: "请留下你的手机号吧～",
				maxLength: 11,
				message: "请留下你的手机号吧～"
			},
			{
				label: '微信号',
				fields: 'wechat_id',
				type: 'text',
				stay: true,
				placeholder: "请留下你的微信号吧～",
				maxLength: 50,
				message: "请留下你的微信号吧～"
			},
			{
				label: '邮箱(选填)',
				fields: 'email',
				type: 'text',
				placeholder: "请留下你的邮箱吧～",
				maxLength: 25,
				message: "请留下你的邮箱吧～",
				ifSkip: true,
			},
		],
	},
	// 5
	{
		tabTitle: "您在哪里",
		bottom_img: "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FiyyIR1zB0BKDXdSltlYscDkInq5.png",
		infoList: [{
			label: '居住地',
			fields: 'home_address',
			type: 'select',
			stay: true,
			placeholder: "请选择",
			fieldsList: ['home_area', 'home_city', 'home_province', 'home_street'],
			message: "请选择居住地"
		},
		{
			fields: 'home_detailed',
			type: 'no_label_text',
			placeholder: "请输入详细地址",
			message: "请输入居住地详细地址",
			maxLength: 50,
		},
		{
			label: '家乡所在地',
			fields: 'native_place',
			type: 'select',
			placeholder: "请选择",
			message: "请选择家乡所在地"
		}],
	},
	// 6
	{
		tabTitle: "是否在社会上担任职务？",
		bottom_img: "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/Flbnc96vMjXMhncl4OztsNk6akH_.png",
		subTitle: "例如人大代表，其他商会等社会组织职务",
		skip: true,
		infoList: [{
			label: '社会组织职务',
			fields: 'social_position',
			type: 'text',
			placeholder: "请输入社会组织职务",
			maxLength: 25,
			ifSkip: true,
		}],
	},
	// 7
	{
		tabTitle: "你的兴趣爱好",
		bottom_img: "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FsyjroZpHKG3L3IkE_CMijyEnfjJ.png",
		subTitle: "有共同的爱好，更快找到志趣相投的校友哦",
		skip: true,
		infoList: [{
			label: '爱好',
			stay: true,
			fields: 'hobbies',
			type: 'text',
			placeholder: "请输入你的爱好信息，例如高尔夫、摄影等",
			maxLength: 50,
			ifSkip: true,
		}],
	},
	// 8
	{
		tabTitle: "你的头像",
		bottom_img: "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/FoeG4cGvwmItcBlyjOFnxVcrM4L1.png",
		subTitle: "头像将用户校友卡和名片展示",
		infoList: [{
			fields: 'photo',
			type: 'upload',
			message: "请上传你的头像"
		}],
	},
]
export default userInfoList;
