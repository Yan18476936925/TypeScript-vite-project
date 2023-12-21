export default {};
/* 
    联合类型注解：
    作用：
        把多种类型联合起来，形成一种类型给变量使用
    语法：
    | ， 跟JS的或 || 非常相似
*/

// 注意 | 的优先级，使用小括号包起来
// 规定为number和string类型的数组
let arr: (number | string)[] = [1, 'cc', 2, 3, 'aa'];

// 规定为number和string boolean类型的数组
let arr2: (number | string | boolean)[] = [1, 'cc', 2, 3, 'aa', true];
