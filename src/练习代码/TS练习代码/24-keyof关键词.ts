export {};

interface PersonType {
  name: string;
  age: number;
  gender: string;
}
type Keys = keyof PersonType;
// name | age
let num: Keys = 'name';
let count: Keys = 'age';
let gender: Keys = 'gender';

// let aa: Keys = 'gender';
// const bb: Keys = 'name';
