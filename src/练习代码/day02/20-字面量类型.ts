export default {};

// 1. 变量 str1 的类型为：string
// 2. 变量 str2 的类型为：'Hello TS'
let str1 = 'Hello TS';
const str2 = 'Hello TS';

/* 
  字面量类型 通常配合 联合类型 去使用
  应用场景非常广，用户性别选择，methods方法，组件按钮大小颜色等
*/
type Gender = '男' | '女' | '未知';
let gender: Gender = '男';
gender = '未知';
// 报错
// gender = '外星人'

// 接口
type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'get';
let method: Methods = 'GET';
method = 'DELETE'
// 报错
// method = 'post'