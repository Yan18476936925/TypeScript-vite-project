export {};
// 接口interface使用extends继承
interface IPerson1 {
  x: number;
  y: number;
}
interface IPerson2 extends IPerson1 {
  z: number;
}

const person: IPerson2 = {
  x: 22,
  y: 23,
  z: 24,
};
