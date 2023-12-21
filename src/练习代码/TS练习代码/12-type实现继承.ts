export {};
{
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
}

{
  type IPerson1 = {
    x: number;
    y: number;
  };
  // type继承使用&
  type IPerson2 = IPerson1 & {
    z: number;
  };
  const person: IPerson2 = {
    x: 22,
    y: 23,
    z: 24,
  };
}
