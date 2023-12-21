export default {};

// as 类型断言，十分肯定的告诉 ts ，它是什么类型，听我的就可以了
// 💥💥注意：使用了类型断言，我们就要自己保证，代码千万不能出错
const a = document.querySelector('a') as HTMLAnchorElement;
// a.href = 'www.baidu.com'

// 这么写是一次性的，实际用的不多，建议还是使用上面的
const img = document.querySelector('img') as HTMLImageElement;
// img.src = 'linyuner.jpg'

/* 
  提示：怎么拿到dom的类型
  可以利用vscode 的提示
  可以写一个  document.querySelector('img')，把鼠标放到上面，就可以看到类型的提示了
*/
