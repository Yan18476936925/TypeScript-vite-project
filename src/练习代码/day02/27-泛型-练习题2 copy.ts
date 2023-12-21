export default {};

// 2. 需求： 封装一个函数，传入数组, 交换数组两项的位置（可能是 number/string/boolean 等）
const fn = <T,K>(arr:[T,K]):[K,T] => {
  console.log('arr[0]----->',arr[1],arr[0]);
  return [arr[1],arr[0]]
}
// fn([10,20])
fn(["Jordan",999])
