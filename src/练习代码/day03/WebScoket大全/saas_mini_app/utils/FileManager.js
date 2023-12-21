/*
 * @Author: ZhangST 
 * @Date: 2019-06-24 14:15:35 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-08-18 12:52:20
 */

/*——————   盲盒文件管理系统备注说明  ——————*/

/*
 * 1.盲盒大玩家目前需要下载的文件为开盒帧动画文件以及封面图：
 * ———————— 命名规则 ————————
 * 封面图： cardpic.png
 * 帧动画文件： boxAnimation (文件夹名称)
 *
 * 2.调用 save 方法，支持接收一个对象，格式如下
 * {
 *     file： [{
 *         url: 需要保存的网络文件 URL，
 *         name: 保存之后的名称
 *     }],
 *     orderId: 订单ID（选填）
 * }
 * 
 * 开盒动画文件保存目录为  `${wx.env.USER_DATA_PATH}/${订单ID}/${文件名/文件夹名}`
 * 
 * 再保存一份清单到 storage  订单ID 对应 保存时毫秒级时间戳
 * 每次保存前，遍历清单，将时间戳与当前时间对比，超过600秒的直接删除
 * 
 * 开盒动画在播放之后也会删除盒子文件
 * 
 * 备注： 还是会有一种情况，就是用户600秒内，买了很多个盒子，一直不开，保存文件超过10M，就有问题（目前我没有想到好的办法解决）；
 * 
 * 3、系统消息保存在 message.json 文件里，可以通过 writeFile 方法对文件进行编写；
 *    通过 readFile 方法读取文件，并保存为 global.messageInfo 全局对象
 * 
 */

class File {
    constructor () {
        // 获取全局唯一的文件管理器
		// 不支持文件管理器
		if(!uni.getFileSystemManager) {
			uni.showModal({
				title: "提示-无法文件管理器",
				content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。"
			})
			return
		}
        this.fileSystemManager = uni.getFileSystemManager()
        // 要删除时间值
        this.delTime = 600000 // 600秒
    }
    // 下载文件
    downloadFile (url) {
        return new Promise ((resolve, reject) => {
            uni.downloadFile({
                url,
                success (res) {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                        resolve(res.tempFilePath)
                    }
                },
                fail (err) {
                    reject(err)
                }
            })
        })
    }
}

const file = new File()
export default file