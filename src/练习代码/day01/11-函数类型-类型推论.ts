export default {};

// // (start?: number, end?: number) => void
// const handle = (start = 100, end = 200) => {
//   console.log('----->', start, end);
// };
// handle(10, 20);
// handle();

// 函数返回值的类型被自动推断为：number
function add2(num1: number, num2: number): number {
  return num1 + num2
}
add2(100, 200);
