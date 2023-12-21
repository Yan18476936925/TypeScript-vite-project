export {};

// 使用 `axios({ ... })` 时，如果发送 GET 请求，method 属性就可以省略
type configType = {
  url: string;
  method?: string;
};
const axios = (config: configType) => {
  console.log('config----->', config);
};
const config: configType = {
  url: 'www.baidu.com',
  method: 'get',
};
axios({
  url: 'www.tengxun.com',
  method: 'get',
});
// 可选
axios({
  url: 'xxxxxxxxxxx',
});
