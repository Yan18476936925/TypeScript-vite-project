export default {};

// 必传参数必须放在可传参数的前面，可传参数必须放在必传的后面，不可交叉使用
const handle = (start:number,end?:number) => {
  console.log('----->', start, end);
};
handle(10,20)
handle(10)

// const handle = (start?:number,end?:number) => {
//   console.log('----->', start, end);
// };
// handle(10,20)
// handle(10)
// handle()

//错误写法
// const handle2 = (start:number,end?:number,end2:number) => {
//   console.log('----->',start,end);
// };
// handle(10,20)