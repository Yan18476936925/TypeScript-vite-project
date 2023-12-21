export default {};

// 需求：创建一个 id 函数，传入什么数据就返回该数据本身
/* 
  泛型：(理解为 JS 的函数)
  作用：把类型当做参数传递，实现代码复用的同时，保证类型的安全
  记住口诀:凡是有不确定类型的地方，直接放泛型
    语法：
    1. <T>,小尖括号，代表是泛型，T代表要传进来的类型，传进来后，泛型里面就可以使用了
    2. 命名可以使任意合法的名字，例如 T,Type,K,建议首字母大写，一般使用T
*/
const fn = <T>(value: T): T => {
  return value;
};
fn<Number>(100).toFixed(3);
fn<String>("Jordan").trim();
console.log('fn<Number>(100).toFixed(3)----->',fn<Number>(100).toFixed(3));//100.000
console.log('fn<String>("Jordan").trim()----->',fn<String>("Jordan").trim());//Jordan

// const test = <Type>(value:Type):Type => {
//   return value
// }