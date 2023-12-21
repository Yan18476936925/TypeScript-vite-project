export default {};

// const handle = (start: number = 0, end: number = 100) => {
//   console.log('----->', start, end);
// };
// handle(10, 20);
// handle();

// 能够使用给函数参数添加 默认值
const handle = (start = 0, end = 100) => {
  console.log('----->', start, end);
};
handle(10, 20);
handle();
