export {};
/* 
    类型别名: type
    使用场景：当同一类型（复杂）被多次使用时，可以通过类型别名，简化该类型的使用
    语法：
    type 类型名 = 类型描述
*/
type MyType = (number | string)[];

const arr: MyType = [1, 2, 3, '马云'];
const arr2: MyType = [21, 22, 23, '马化腾'];
console.log('arr----->', arr);
console.log('arr2----->', arr2);
