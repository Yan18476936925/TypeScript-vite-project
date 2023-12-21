export default {};
/* 
    类型别名: type
    使用场景：当同一类型（复杂）被多次使用时，可以通过类型别名，简化该类型的使用
    语法：
    type 类型名 = 类型描述
*/

// 规定为number和string类型的数组
type ArrType = (number | string)[]
let arr:ArrType = [1,2,'Jordan',33,'允儿']

// 规定为number和string和boolean类型的数组
type ArrType2 = (number | string | boolean)[]
let arr2:ArrType2 = [1,2,'Jordan',33,'允儿',true]