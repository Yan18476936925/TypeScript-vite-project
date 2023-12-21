export {};
// 定义泛型接口
interface ResultType<T> {
  msg: string;
  code: number;
  data: T;
}
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
// 定义data下泛型接口
interface TodoType {
  id: number;
  name: string;
  done: boolean;
}

const result3: ResultType<TodoType[]> = {
  msg: '成功',
  code: 200,
  data: [
    { id: 1, name: '吃饭', done: true },
    { id: 2, name: '睡觉', done: true },
    { id: 3, name: '敲代码', done: false },
  ],
};

result3.data.push({ id: 4, name: 'Jordan', done: true });

const res = result3.data.filter((item) => item.id);
console.log('res----->', res);
