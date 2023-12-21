export {};

const arrFn = <T>(arr: T[]): T => {
  // 返回数组第一项
  return arr[0];
};
arrFn(['22', '33']).trim();

arrFn([44, 55]).toFixed(2);

console.log('arrFn([44, 55]).toFixed(2)----->', arrFn([44, 55]).toFixed(2)); //44.00
