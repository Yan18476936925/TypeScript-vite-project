export default {};

interface Person {
  name: String;
  age: Number;
  gender:String
}
const str : 'name' | 'age' | 'gender' = 'gender'
// 上下两行代码是等价的
const str2: keyof Person = 'gender'