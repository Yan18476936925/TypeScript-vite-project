export {};

// 不推荐使用 any**!这会让 TypeScript 变为 “AnyScript”(失去 TS 类型保护的优势)
const obj: any = {
  name: 'Jordan',
};

// 任意类型都可以
obj.age = 100;
obj();
