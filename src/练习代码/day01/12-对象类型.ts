export default {};

// 1. 使用 `{}` 来描述对象结构
// 2. 属性采用`属性名: 类型`的形式
// 3. 方法采用`方法名(): 返回值类型`的形式
type Person = {
  name: string;
  age: number;
};
const obj1: Person = {
  name: 'Jordan',
  age: 23,
};

const obj2: Person = {
  name: 'Jordan',
  age: 23,
};
