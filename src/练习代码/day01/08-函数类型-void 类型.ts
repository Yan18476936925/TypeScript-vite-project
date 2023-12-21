export default {};

// 如果一个函数没有返回值，此时，在 TS 的类型中，应该使用 `void` 类型
const handle = ():void => {
  console.log('----->Hello Jordan');
};

// 如果指定 返回值类型为 undefined，此时，函数体中必须显示的 return undefined 才可以
const add = (): undefined => {
  console.log('----->Hello Jordan');
  // 此处，返回的 undefined 是 JS 中的一个值
  return undefined
}

