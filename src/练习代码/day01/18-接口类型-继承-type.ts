export default {};

/* 
  interface继承，interface 类型名 extends 要继承的类型名 {要添加的属性}
  type 继承, type 类型名 = 继承的类型名 & {要添加的属性}
*/
interface P2D {
  x: Number;
  y: Number;
}
// type实现继承，实际项目用得比较少，了解即可
type P3D = P2D & {
  z:Number,
}
const Point2D: P2D = {
  x: 0,
  y: 0,
};
const Point3D: P3D = {
  x: 0,
  y: 0,
  z: 50,
};
