export {};

const handler = <T>(arr: T[]): T => {
  const index = Math.round(Math.random() * (arr.length - 1));
  return arr[index];
};
handler(['刘备', '关羽', '张飞']);

console.log(handler(['刘备', '关羽', '张飞']).slice(0, 1)); //刘
console.log(handler([22, 33, 44]).toFixed(3)); //22.000

// 普通函数类型
{
  function handler<T>(arr: T[]): T {
    const index = Math.round(Math.random() * (arr.length - 1));
    return arr[index];
  }
  handler(['刘备', '关羽', '张飞']);
}
