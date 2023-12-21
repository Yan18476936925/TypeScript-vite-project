export {};

// const handler = (value: number): number => {
//   return value;
// };
// handler(23);

const handler = <T>(value: T): T => {
  return value;
};

let num = 23;
handler(num).toFixed();

const handler2 = <T>(value: T): T => {
  return value;
};
let str = '  Jordan';
//  <string>(value: string) => string
handler2(str).trim();
