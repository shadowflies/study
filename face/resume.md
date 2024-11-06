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



大文件切片上传流程：

自己是使用了阿里云的sdk，通过配置完成了切片上传，断点续传，暂停恢复等功能

```
分片上传原理：客户端将选择的文件进行切分，每一个分片都单独发送请求到服务端

断点续传 & 秒传原理：客户端发送请求询问服务端某文件的上传状态，服务端响应该文件已上传分片，客户端再将未上传分片上传即可

每个文件要有自己唯一的标识，这个标识就是将整个文件进行MD5加密，这是一个Hash算法，将加密后的Hash值作为文件的唯一标识

文件的合并时机：当服务端确认所有分片都发送完成后，此时会发送请求通知服务端对文件进行合并操作

第一步：将文件进行分片，并计算其Hash值（文件的唯一标识）
第二步：发送请求，询问服务端文件的上传状态
第三步：根据文件上传状态进行后续上传

文件已经上传过了，结束 --- 秒传功能
文件存在，但分片不完整，将未上传的分片进行上传 --- 断点续传功能
文件不存在，将所有分片上传

第四步：文件分片全部上传后，发送请求通知服务端合并文件分片

```

blob对象的slice对文件切片，定义每个chunk大小5 *1024 *1024，计算切片数量

对文件标识，hash，每个切片index，存formdata

对每一个切片处理上传，将请求peomiseall

后端对每个分片接收后存储排序，最后核对，当最后一个分片上传完成后，核对数量排序，拼接完成，可以的话就返回给前端，不行的话就指明上传失败，重试的信息（retry）



RBAC（基于角色的访问控制）

是一种常见的权限管理策略，用于根据用户的角色来控制他们对系统资源的访问权限。通过为用户分配角色，然后将权限与角色关联，用户的权限得以间接控制

在路由守卫那里配置roles



代码压缩分割

```
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true, // 启用代码压缩
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 移除 console.log 
          },
        },
      }),
    ],
  },
};

```

