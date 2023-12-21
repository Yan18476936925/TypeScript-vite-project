export default {};

// 两个接口之间有相同的属性或方法，可以将公共的属性或方法抽离出来，通过extends继承来实现复用
interface P2D {
  x: Number;
  y: Number;
}
// 继承方法——推荐
// 使用extends实现接口的继承,可以理解为把 属性都拿过来，都复制过来，都合并过来
interface P3D extends P2D {
  z: Number;
}

// 古老写法
// interface P3D {
//   x: Number;
//   y: Number;
//   z: Number;
// }

const Point2D: P2D = {
  x: 0,
  y: 0,
};
const Point3D: P3D = {
  x: 0,
  y: 0,
  z: 50,
};
