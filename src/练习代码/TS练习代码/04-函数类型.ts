export {};
// 函数的类型实际上指的是：函数参数和返回值的类型
const handlerFn = (name: number, age: number): number => {
  return name + age;
};
// handlerFn('乔丹', 18);
// handlerFn('22', 18);
console.log('handlerFn(23, 18)----->', handlerFn(23, 18));
// console.log('handlerFn(23, 18)----->', handlerFn('23', '18'));

// 函数类型别名写法
type handlerType = (num1: number, num2: number) => number;
const handlerFn2: handlerType = (num1, num2) => {
  return num1 + num2;
};

console.log('handlerFn2----->', handlerFn2(10, 13));
