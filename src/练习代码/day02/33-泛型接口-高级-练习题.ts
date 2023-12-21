export default {};

/* 
  1. 保证参数1，是对象
  2. 保证参数2，是对象的某一个 key 值
*/
const getProps = <T extends object,K extends keyof T>(obj:T,prop:K) => {
  console.log('obj[prop]----->',obj[prop]);
}
getProps({name:"Jordan",age:18},'name')