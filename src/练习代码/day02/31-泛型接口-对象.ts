export default {};

// 定义泛型接口
interface Result<T> {
  msg: String;
  code: Number;
  result: T;
}
// 传递具体的类型
// 抽离出来定义-使用type
type Todos = {
  id: Number;
  name: String;
  done: Boolean;
}[]
const result: Result<Todos> = {
  msg: '成功',
  code: 200,
  result: [
    { id: 1, name: '吃饭', done: true },
    { id: 2, name: '睡觉', done: true },
    { id: 3, name: '敲代码', done: true },
  ],
};
const result2: Result<null> = {
  msg: '成功',
  code: 200,
  result: null,
};
// 打印
console.log('result----->', result);
console.log('result2----->', result2);
