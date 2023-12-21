export {};

// 泛型的类型变量可以有多个，并且**类型变量之间还可以约束**(比如，第二个类型变量受第一个类型变量约束)
const getProps = <T extends object, K extends keyof T>(obj: T, key: K) => {
  return obj[key];
};

// 第二个参数继承第一个参数里面的属性
console.log('getProps();----->', getProps({ name: 'Jordan', age: 18 }, 'name'));
console.log('getProps();----->', getProps({ name: 'Jordan', age: 18 }, 'age'));
console.log(
  'getProps();----->',
  getProps({ name: 'Jordan', age: 18, gender: '男' }, 'gender')
);
