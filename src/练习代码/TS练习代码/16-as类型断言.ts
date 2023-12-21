export {};

// HTMLAnchorElement
const aLink = document.querySelector('a') as HTMLAnchorElement;
aLink.href;

// HTMLHeadingElement
const h3Dome = document.querySelector('h3') as HTMLHeadingElement;
h3Dome.appendChild;

// HTMLImageElement
const imgDom = document.querySelector('img') as HTMLImageElement;
imgDom?.src;

// HTMLInputElement
const input = document.querySelector('input') as HTMLInputElement;
input?.value;
input.children;
input.onchange;
// 写法二
const input2 = <HTMLInputElement>document.querySelector('input');
