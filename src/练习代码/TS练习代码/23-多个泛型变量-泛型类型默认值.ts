export {};

// const handler = <T, K = unknown>(name: T, age?: K) => {
//   console.log('name----->', name);
//   console.log('age----->', age);
// };
const handler = <T, K>(name: T, age?: K) => {
  console.log('name----->', name);
  console.log('age----->', age);
};
// <string, number>
handler('Jordan', 23);
// <string, unknown>
handler('Jordan');
