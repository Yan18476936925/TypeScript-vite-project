export {};

type PersonType = {
  name: string;
  age?: number;
  handler: (a?: number, b?: number) => void;
  handler2?: () => void;
};
const person: PersonType = {
  name: 'Jordan',
  age: 23,
  handler: (a = 22, b = 33) => {
    return a + b;
  },
  handler2: () => {},
};

const person2: PersonType = {
  name: '乔丹',
  handler: () => {},
};
person.handler(10, 20);
