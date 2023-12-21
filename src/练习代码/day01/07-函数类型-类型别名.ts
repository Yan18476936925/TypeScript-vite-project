export default {};
/* 
    函数注解 - 类型别名type：
	注意：只能在函数表达式(箭头函数)中使用
    语法：
    type 类型名 = (参数1:类型, 参数2:类型) => 类型
*/
// 了解即可-不常用
type ArrType = (a: number, b: number) => number;
const handle:ArrType = (a: number, b: number): number => {
  return a + b;
};
handle(10,20)
console.log('----->',handle(10,20));
