export const appId = "wxf30ebd420789bc4e"

// 版本号  版本号小版本加0.0.1, 解决bug不能加大于等于0.0.1的情况,对外加0.0.0.1,代码本身不改动版本,服务器只支持两个小数点
export const version = "V1.2.0"

// #ifdef MP-WEIXIN
export const os = "miniApp"
export const platform = "miniApp"
// #endif

// 盲盒的秘钥
export const httpKey = "5zZ6VV7SVIm53NSf8Mo2NAJK4eQX8FIj"

// #ifdef MP-WEIXIN
	export const appTitle = "深大会"
// #endif

// env用于环境判断，prod环境的添加点击统计，dev环境不做统计
// 默认运营环境
const env = "prod";
// const env = "dev";
let baseUrl = "https://sdhapi.loovee.com"
let wsUrl = "wss://bbws.loovee.com/live"
let logsUrl = "https://bbopen.loovee.com/"
let webViewUrl = "https://sdhapi.loovee.com"
const errUrl = "https://public.loovee.com"
/* 正式服务器模块映射表 */
const modules = {
	guild: "/Guild",
	home: "/home",
}
// 测试环境
if (env === "dev") {
	baseUrl = "https://sdhapit.loovee.com:1443"
	// baseUrl = "https://sdhapi.loovee.com"
	wsUrl = "wss://bbwst.loovee.com:1443"
	logsUrl = "https://bbopent.loovee.com:1443/"
	// webViewUrl = "https://sdhapit.loovee.com:1443"
	webViewUrl = "https://sdhapi.loovee.com"
}
export { env, wsUrl, logsUrl, baseUrl, webViewUrl, modules, errUrl }

export const qiniuUpUrl = "https://up.qiniup.com" // 暂时无用的

/* 网络资源图片前缀 */
export const qiniuUrl = "https://duimianimg.loovee.com/MediaServerMblove/servlet/Proxy/PhotoServlet/"

/* 分享图片 */
export const sharePic = "https://duimianimg.loovee.com/style/sdh/img/sdh_share_img_1.png"

// 手机号码检验格式
export const telRegex = /^[1][0-9]{10}$/;

// 存在游客模式的全部页面
export const hasSightseerPage = [
	"pages/home/main",
	"pages/schoolFellow/main",
	"pages/sharePage/main",
	"schoolFellowPackage/pages/schoolFellowDetails/main",
	"pages/me/main",
	'personalInfoPackage/pages/message/main',
	'pages/me/joinData', 
]

// 正常初始化页面处理
export const initPageHandle = [
	"pages/me/main",
	"pages/schoolFellow/main",
	"pages/invitationPage/main",
	"schoolFellowPackage/pages/schoolFellowDetails/main",
	"pages/sharePage/main",
	'personalInfoPackage/pages/message/main',
]
// 正常初始化页面处理
export const initSpecialPageHandle = {
	'pages/me/joinData': 'joinData'
}

// 初始化页面不用处理
export const initPageNoHandle = []

// 初始化页面特别处理
export const initPageDiyHandle = []

// 会员等级
// export const membershipLevel = {
// 	0: '会员',
// 	1: '副会长',
// 	2: '常务副会长',
// 	3: '会长',
// 	4: '名誉会长',
// 	5: '荣誉会长',
// 	6: '永远荣誉会长',
// }

// 小程序分享场景值
// export const miniProgramScene = [
// 	1007, // 单人聊天消息卡片
// 	1008, // 群聊消息卡片
// 	1096, // 聊天记录卡片
// 	1011, // 二维码扫描
// 	1012, // 长按图片识别二维码
// 	1013, // 相册选取二维码识别
// 	1036, // APP分享的消息卡片
// 	1047, // 小程序码扫描
// 	1048, // 长按图片识别小程序码
// 	1049, // 相册选取小程序码
// ]

// 小程序可能存在重载页面的场景值，结合潮玩公众号、社群分享、订阅消息等可以打开小程序的入口
export const miniReloadScene = [
	1007, // 单人聊天消息卡片
	1008, // 群聊消息卡片
	1096, // 聊天记录卡片
	1011, // 二维码扫描
	1012, // 长按图片识别二维码
	1013, // 相册选取二维码识别
	1014, // 小程序订阅消息（与1107相同）
	1035, // 公众号自定义菜单
	1036, // APP分享的消息卡片
	1043, // 公众号模板消息
	1044, // 带 shareTicket 的小程序消息卡片
	1047, // 小程序码扫描
	1048, // 长按图片识别小程序码
	1049, // 相册选取小程序码
	1058, // 公众号文章
	1067, // 公众号文章广告
	1074, // 公众号会话下发的小程序消息卡片
	1107, // 订阅消息，打开小程序
]