// 映射表总表
/**
 * 跳转链接 Tabs 页面标识
 * 所有的 Tab 页面都要记录在这里
 */
export const switchTabs = "home,schoolFellow,company,me";
export const switchTabsAll = "/pages/home/main,/pages/schoolFellow/main,/pages/company/main,/pages/me/main";
// 链接映射表
export const appLink = {
	"app://applyForMembership": "/otherPackage/pages/applyMember/userInfo", 
	"app://toClub":"/otherPackage/pages/club/club"
}

// 盲盒分包路径改动，后台配置到
export const packagePageLink = {}