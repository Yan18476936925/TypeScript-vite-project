export {};
// 接口，只能为对象指定类型
interface IPerson {
  name: string;
  age: number;
}
// 类型别名，不仅可以为对象指定类型，实际上可以为任意类型指定别名
type IPerson2 = {
  name: string;
  age: number;
};

const person: IPerson = {
  name: 'Jordan',
  age: 23,
};

const person2: IPerson = {
  name: '乔丹',
  age: 18,
};
