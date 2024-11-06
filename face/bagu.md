##### html

盒子模型

#### css

css选择器以及优先级

BFC，触发条件，作用，解决的问题

实现左侧固定，右侧自适应



##### 浏览器

跨域cors  access-control-allow-origin  

简单请求，非简单请求（access-control-allow-method）

jsonp，安全性问题

nginx

postMessage

csrf

xss

http2和http1

缓存

SSR 同构项目

```
新建服务端配置文件：server.config.js，入口server，target：node
新建客户端配置文件：client.config.js， 入口 client，
最后新建 base 配置文件：base.config.js，打包命令设置client，server
入口文件创建createSSRApp(App);
服务端入口文件：server.entry.js， 新建客户端入口文件：client.entry.js
路由共享：router.js
vue组件
```

作用域链



虚拟dom

虚拟 DOM 是一种性能优化技术，主要用于前端框架（如 React、Vue）中。它是对真实 DOM 的一个抽象表示，目的是减少直接操作真实 DOM 的次数，从而提高性能

场景：

高频渲染的 UI：单页应用，实时数据展示等，购物车，

高频用户交互：表单动态验证

高效的 DOM 更新：diff算法

跨平台：在多个平台之间共享代码

 真实 DOM：

真实 DOM 是浏览器实际渲染的 DOM，它是页面中所有元素的最终呈现方式。每次对真实 DOM 的操作都会引起浏览器重新渲染

场景：静态页面，简单的应用，性能要求较低的场景

图片轮播



闭包

闭包（Closure）是 JavaScript 中的一种特性，指的是**函数可以“记住”并访问定义时的作用域，即使在函数外部执行时**，这个函数依然可以访问到它创建时的变量。

简单来说，闭包是函数和其引用的外部变量的组合。它允许函数在外部环境中执行时仍然保留对定义时环境的访问权限。闭包非常有用，尤其是在处理异步操作、数据封装等场景中。





