export {};
// 普通写法
const arr: string[] = ['马云', '马化腾', '刘强东'];
const arr2: number[] = [1, 2, 3, 4];
// const arr: string[] = ['马云', '马化腾', 123];//报错
// const arr2: number[] = [1, 2, 3, 4, '哈哈哈'];//报错
// 泛型写法
const arr3: Array<number> = [1, 2, 3, 4];
const arr4: Array<string> = ['1, 2, 3, 4', ''];

const arr5: boolean[] = [true, false, true];
