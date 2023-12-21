export {};

interface LengthType {
  length: number;
}
const handler = <T extends LengthType>(params: T): number => {
  return params.length;
};

const res = handler([1, 2, 3]);
const res2 = handler('Jordan');
const res3 = handler({ length: 2 });
console.log('res----->', res);
console.log('res2----->', res2);
console.log('res3----->', res3);
