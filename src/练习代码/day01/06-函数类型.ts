export default {};
// 箭头函数声明
const handle = (a:number,b:number):number => {
  return a + b;
};
// handle(10, 20);
console.log('----->',handle(10, 20))
console.log('----->',handle(10, "20"))

// 普通函数声明
// function handle2(a:number,b:number):number {
//   return a + b;
// }
// console.log('----->',handle2(10, 20));
// console.log('----->',handle2(10, "20"));