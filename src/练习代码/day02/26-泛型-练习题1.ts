export default {};

// 1. 需求： 封装一个函数，传入一个参数，包装成数组返回（可能是 number/string/boolean 等）
const fn = <Type>(params:Type):[Type] => {
  console.log('params----->',params);
  return [params]
}
fn(100)[0].toFixed(2)
fn("Jordan")[0].trim()
