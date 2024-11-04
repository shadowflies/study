#### 课程管理

##### 作用：对课程的增加，删除，修改，查询

##### 模块：增加

点击添加，跳出表单填写信息，包括工种选择，视频课件资源上传，小节管理，题目分配等。

对于视频上传，难点在于大文件上传卡顿和时间关系

针对大文件上传卡顿问题，通过文件分片将文件切割小块并发上传，支持断点续传，上传速度提升





#### 封装

API：

接口调用的api，分别写在对应的js文件中

axios请求：

创建axios实例，对请求和响应进行拦截，请求添加自定义token，响应添加状态码的判断。

组件：

对视频上传组件封装，主要是使用到阿里云的sdk进行js的上传

表单规则：

对表单规则校验进行封装

判断账号名（手机号，身份证），判断密码。

本地存储：

localstorage的增删改查

name, content, type



#### gzip

在webpack中可以使用compression-webpack-plugin来实现、

Nginx服务器只需要配置：gzip_static on;

```js
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  // ...其他配置
  plugins: [
    new CompressionPlugin({
      // 匹配需要进行Gzip压缩的文件类型
      test: /\.(js|css|html|svg)$/,
      // 只有文件大小大于等于该值时才会生成Gzip文件
      threshold: 10240,
    }),
  ],
};
```



nginx设置gzip   compression 和 gzip_comp_level

```js
gzip on;
gzip_static on;
gzip_comp_level 4;
gzip_types text/plain text/html text/css application/x-javascript text/xml application/xml application/xml
```

查看

响应

Content-Edcoding:gzip表示gzip压缩已经生效

Etag中只有简单字符表示静态资源加载，而前面带 W/ 表示启动了在线压缩

对比文件大小

##### 问题：

我们使用过程中有一个配置项是`filename`,为了适配范围更广

但其实如果不指定，他会有一个默认值    导致   全篇就只有一个`.gz`文件

因为老版本的`[path]`是结合了新版本`[path]和[base]`的值，为了让插件更灵活，新版本要分开写这两个文件
