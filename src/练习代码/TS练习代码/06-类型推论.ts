export {};
// 变量 age 的类型被自动推断为：number
//let age: number
// let age = 18;
let age = '马云';
// age.toString();
// age.trim();
console.log('age----->', age);

// 函数返回值的类型被自动推断为：number
function add(num1: number, num2: number): number {
  return num1 + num2;
}

function add2(num1: number, num2: number) {
  return num1 + num2;
}
[].slice;
add(22, 33);
add2(22, 33);
