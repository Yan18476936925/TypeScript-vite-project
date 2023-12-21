export default {};

// 定义泛型接口
interface Result<T> {
  msg: String;
  code: Number;
  result: T;
}
// 传递具体的类型
const result:Result<Number[]> = {
  msg: '成功',
  code: 200,
  result: [1,2,3],
};
const result2:Result<{}> = {
  msg: '成功',
  code: 200,
  result: {},
};
const result3: Result<null> = {
  msg: '成功',
  code: 200,
  result: null,
};

result.result.push(4)
console.log('result----->',result);
console.log('result2----->',result2);
console.log('result3----->',result3);