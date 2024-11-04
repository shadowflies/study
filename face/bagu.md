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
