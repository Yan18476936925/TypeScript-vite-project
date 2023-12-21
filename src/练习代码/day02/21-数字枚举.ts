export default {};
/* 
  枚举类型：
  定义一组已知的可选项
  语法：
  enum 类型名 {
    枚举项 = 枚举值,
    枚举项 = 枚举值
  }
    ✅开发需求：
    用户编辑界面，用户选择的性别    男  女  未知
    后端接口参数要求传的是数字对应为 1   0  -1
  🎉开发经验：
    TS项目中可通过设计枚举结构，提高源代码的可读性
*/

enum Gender {
  Girl = 0,
  Boy = 1,
  UnKnown = 2,
}
const query = {
  name: '张三',
  gender: Gender.Boy,
};
console.log('query----->',query);