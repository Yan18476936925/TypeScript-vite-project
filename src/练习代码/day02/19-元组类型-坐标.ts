export default {};

// 在地图中，使用经纬度坐标来标记位置信息
// 不够严谨
// const position:Number[] = [112.23, 23.33];
// 严谨
// const position:[Number,Number] = [112.23, 23.33];
let position: [Number, Number] = [112.23, 23.33];

// 报错，元素的个数不对
// position[2] = 123.422242
// position = [123.422242]

let position2: [String, String] = ['aa', 'cc'];
let position3: [String, Boolean, String] = ['aa', true, 'cc'];
