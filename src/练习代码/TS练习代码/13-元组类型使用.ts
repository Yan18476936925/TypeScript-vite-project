export {};

// 不规定长度
const arr: number[] = [22, 33];
arr[3] = 44;
// 规定长度，只能是0，1
const arr2: [number, number] = [22, 33];
arr2[0];
// arr2[3];
