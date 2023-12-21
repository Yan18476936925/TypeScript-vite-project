export default {}

let arr:number[] = [1,2,3]
arr[3] = 4
arr.push(123)
// 报错
// arr[2] = "123"

let arr1:string[] = ['aa','bb','cc']
// 报错
// let arr1:string[] = ['aa','bb','cc',1]

let arr3:boolean[] = [true,false,true]
// let arr4:null[] = [null,null]
// let arr5:undefined[] = [undefined,undefined]

// 泛型写法，不常用
let arr6:Array<number> = [1,2,3]
let arr7:Array<string> = ['aa','bb','cc']