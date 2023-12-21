export default {};

// 原则:不推荐使用 any!这会让 TypeScript 变为 “AnyScript”(失去 TS 类型保护的优势)
let obj:any = {
  num: 0,
}
obj.num = "123"
obj.num = true

console.log('obj----->',obj);