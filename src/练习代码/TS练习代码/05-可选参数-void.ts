export {};

const handler = (): void => {
  console.log('123----->', 123);
};
handler();
// 可选参数
const handlerSlice = (start?: number, end?: number) => {
  console.log('----->', start, end);
};
handlerSlice(22, 33);
handlerSlice(22);
handlerSlice();

// 默认参数
const handlerSlice2 = (start = 10, end = 20): void => {
  console.log('----->', start, end);
};
handlerSlice2(22, 33);
handlerSlice2(22);
handlerSlice2();
