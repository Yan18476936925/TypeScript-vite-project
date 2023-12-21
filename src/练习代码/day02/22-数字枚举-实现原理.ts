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
  'Unknown' = -1,
  'Gril',
  'Boy',
}
// 会被编译为以下 JS 代码：
// var Gender;
// (function (Gender) {
//   Gender[(Gender['Unknown'] = -1)] = 'Unknown';
//   Gender[(Gender['Gril'] = 0)] = 'Gril';
//   Gender[(Gender['Boy'] = 1)] = 'Boy';
// })(Gender || (Gender = {}));

/* 
  Gender
  1. undefined
  2. {}
  3. { Unknown: -1 , -1 : 'Unknown'}
  4. { Unknown: -1 , -1 : 'Unknown' , Gril:0, 0:'gril'}
  5. { Unknown: -1 , -1 : 'Unknown' , Gril:0, 0:'gril' , Boy:1 , 1:'Boy'}
*/
