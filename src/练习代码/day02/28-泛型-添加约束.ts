export default {};

// 2. 需求： 封装一个函数，传入数组, 交换数组两项的位置（可能是 number/string/boolean 等）
const fn = <T>(value:T[]):T[] => {
  console.log('----->',value,value.length);
  return value
}
fn([])
fn([23,1,2,3])
fn([1,"aa",true])

// 报错——必须是数组
// fn(123)