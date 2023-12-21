export {};

type PersonType = {
  name: string;
  age: number;
  handler: () => void;
  handler2: (a: any, b: any) => void;
};
const person: PersonType = {
  name: 'Jordan',
  age: 23,
  handler: () => {},
  handler2: () => {},
};

const obj: PersonType = {
  name: '马云',
  age: 18,
  handler: () => {},
  handler2: (a, b) => {
    return a + b;
  },
};
