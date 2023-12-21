export default {};

// 使用 `axios({ ... })` 时，如果发送 GET 请求，method 属性就可以省略
type Person = {
  url: String,
  method?:String,//可选参数
}
const axios = (obj:Person) => {
  console.log('obj----->',obj);
}
axios({
  url: '/api',
  method:'post'
})
axios({
  url: '/api',
})