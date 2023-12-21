export {};

interface ResultType<T> {
  msg: string;
  code: number;
  data: T;
}
// interface ResultType2 {
//   msg: string;
//   code: number;
//   data: number[];
// }
// interface ResultType3 {
//   msg: string;
//   code: number;
//   data: null;
// }
const result: ResultType<number[]> = {
  msg: '成功',
  code: 200,
  data: [1, 2, 3, 4],
};
const result2: ResultType<string[]> = {
  msg: '成功',
  code: 200,
  data: ['刘备', '关羽', '张飞', '赵云'],
};
