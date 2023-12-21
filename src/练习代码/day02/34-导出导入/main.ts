// 导入Obj
// 如果引进的是 ts 的类型，需要加上type区分开来
import { Arr, Obj } from './types';
export default {};

// .ts:    js+type，里面可以写 js，也可以写 类型 的代码
// .js:    js，标准的js文件，任何其他非标准(例如ts的类型)都不能识别，写上去就报错
// .d.ts:  type,只能写类型的代码,真正打包时，不会生成任何的js文件
const obj: Obj = {
  name: 'Jordan',
  age: 18,
};
const arr: Arr = [1, 2, 3];

console.log('obj----->',obj);
console.log('arr----->',arr);