export default {};

/* 
  interface 用来描述对象，与 type 是一样
  早期时候，并没有 type，使用 interface
  type：不仅可以描述对象，还可以描述其他类型
  interface： 仅仅可以描述对象,在过去开发的框架上，使用比较多
  语法上有点不同, type 有等于号
    type 类型 = {对象的描述;}
    interface 类型 {对象的描述;}
*/
// 当一个对象类型被多次使用时，一般会使用接口（`interface`）来描述对象的类型，达到复用的目的
interface Person {
  name: string;
  age: number;
  isShow: boolean,
  handle:()=>void
}
const obj: Person = {
  name: 'Jordan',
  age: 23,
  isShow: true,
  handle:()=>{}
}