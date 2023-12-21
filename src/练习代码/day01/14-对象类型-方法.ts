export default {};

// 1. 使用 `{}` 来描述对象结构
// 2. 属性采用`属性名: 类型`的形式
// 3. 方法采用`方法名(): 返回值类型`的形式
type Person = {
  name: string;
  age: number;
  isShow?:boolean,
  gender?:String,
  others?: String[],
  sayHi:()=>void,
  sayHello:()=>void,
  handle:(a:Number,b:Number)=>Number,
};
const obj1: Person = {
  name: 'Jordan',
  age: 23,
  isShow: true,
  gender: '男',
  others: ['清华大学', '北京大学'],
  sayHi:()=>{},
  sayHello:()=>{},
  handle: (a,b) => {
    return a + b;
  },
};
obj1.handle(100,200)

console.log('obj1.gender----->',obj1.handle(100,200));
console.log('obj1.gender----->',obj1.gender);
console.log('obj1.sayHi()----->',obj1.sayHi());
