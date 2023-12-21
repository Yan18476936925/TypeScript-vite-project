export default {};

interface Length{
  length: Number
}

// 保证传过来的参数里，必须有length的属性
// 那么就是泛型 T 要满足 ILength，于是直接extends继承即可
const fn = <T extends Length>(value:T):T => {
  console.log('value----->',value.length);
  return value
}
// fn(123)//错误
fn([])
fn('123')
fn({length:20})