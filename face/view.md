#### 场景题应对

1  交代背景

2  调研方案

3  方案落地

4  反思，求最优解

##### 1000w行表格如何渲染

在线表格追求大数据量，防止卡顿，需要更好的方案实现

1 dom  2  虚拟表格  3  canvas  table  4  可视区域算法绘制  

5  canvas结合webassembly 技术实现（skia + Webassembly）

我封装了画布表格引擎，解决了上述问题，并能够实现1000w数据加载流畅交互

在这个过程遇到的问题，卡点

##### js超过Number最大值的数怎么处理

Number.MAX_VALUE

场景：大数据计算，格式展示，用户输入

大数据处理（金融，科学计算，数据分析）

1  BigInt   2  外部js引入  decimal.js     const Decimal = new Decimal('1e+308')

3  big.js

格式化，格式化成用户好读的格式

表单校验，不允许用户输入超过多少位的

##### 如何解决页面请求接口大规模并发问题

滑动窗口，专门控制流量的

场景：数据采集平台，低代码编辑平台，有序相对稳定发送到后端

方案：1  请求队列  队列完成滑动窗口  

 2  防抖/节流（debounce，throttle）

防抖：确保在指定时间内函数只执行一次，常用于输入框搜索建议

节流：确保在指定时间间隔内函数执行一次，常用于窗口的resize，srcoll事件

分页加载

##### 大文件上传

背景：一般超过两三百兆，1g以上

问题：

1  网络断开后，之前传的没了     断点续传

2  网络波动后没了                        断开重连重传

3  关机了，不能接着传                切片上传

交代方案：

前端切片   chrunk  1024M（1024*1024）  切500k，获得size，将切片传递给后端，切片要取名，一般哈希取名，index，后端组合切片

前端切片：主进程卡顿，用web-worker 多线程切片，处理完交给主进程发送

切完后，将 blob（对应二进制内容），存到IndexDB上，下次用户进来之后，查看是否存在未完成上传的切片，有就尝试继续上传

能力允许的话引进websocket，实时通知和请求序列的一些控制  wss

整体说说我主要大文件上传的整体设计

-组件设计

-props，事件，状态

-拖拽上传，多文件选择

-通用化不同文件的上传，上传统一协议

反思和优化：

##### 前端怎么实现网页截图

背景：飞书文档，内容在列表页想要查看。内容导出pdf。设计类软件，出图

方案：以内容导出png讲解

-canvas

-响应式（移动，pc窗口不同）  puppeteer（无头浏览器），无头表格，无头ui库（headless）

需要能支持加载

-第三方库 html2canvas（canvas）

-上传cdn

具体落地

全页面，局部，特定区域，封装截图工具需要考虑通用性（‘seletor’）

设置具体协议（函数式，组件式）

隐藏canvas等

代码编写

##### 移动端怎么适配

背景：项目支持pc，移动端

方案：

根据不同段开发不同页面（成本高）

根据不同端加载不同css样式（可取）

根据响应式，运行不同的样式规则（常用）

style 预处理器

考虑问题：

1  设置视窗

2  掌握媒体查询

3  弹性布局（主轴，对齐方式等）

4  图片的响应式处理（media）

5  视口单位的适配

（rem，由html的font-size决定，em单位）

##### 修改第三方npm包

 稳定库，直接扒下来，node-modules，直接修改

patch 方案

fork package，自己来维护（自己构建修改发布，构建开源社区）

背景：

难言之隐（设计，产品，老板）

方案：

1  稳定库，node_modules,直接修改

2  patch方案，patch-package库，自动修改和构建替换库（自动化）postinstall

​	npm有很多钩子（hook）prepare postinstal

​	在package的json里直接调用

npx patch-package rspack，这个时候会在生成一个补丁，文件夹

3  长期的话，fork别人的库来去做

直接改源码，里面做整个构建，发布到npm私服（verdaccio，阿里云效制品库）

可以贡献社区，给原来坐着提pr，执行一边过程，合并了贡献社区，提升知名度

##### 使用同一个链接，实现pc打开web应用，手机打开h5应用

背景：一个链接访问页面同时适配pc和mobile

方案：区分pc和mobile

抓住主要矛盾，识别到端，然后再渲染

1  js识别

​	userAgent用户代理，从navigator拿取，navigator.userAgent，使用正则判断

​	/Mobi | Andriod / i.test(navigator.userAgent)

2 jsx里面

< DeviceProvider value={{type：isMobile（）}}>< /DeviceProvider >

子组件使用useContext（DeviceContext）

3  vue

js 非常重要api  provide（“deviceType”, isMobile()）

子组件使用inject（“deviceType”）

4  响应式

媒体查询，flex

5  框架类

封装hook，比如设置界面1024，返回是pc或mobile

##### QPS达到峰值怎么处理

背景：

当前端英勇的qps（每秒查询次数）达到峰值时，会对服务器和应用的性能造成很大的压力，甚至导致系统崩溃，为了解决这个问题，我们需要采取一系列措施来优化和管理高并发请求

方案

1  请求限流

后端做，比如nodejs，请求来到服务端后，来做个拦截，对比前后请求时间间隔频率

流量/速率判断

const ratelimit = require（'express-rate-limit'）

const limiter = ratelimit({windowMS: 60 * 1000 ,  max: 100,  mesage:})

2  请求合并

短时间内的请求进行合并，以此降低服务端压力

debounce，throttle

3  请求缓存 

react vue都有

swr（react）有针对请求内容的缓存

请求参数，请求方法，请求逻辑的内容没有发生变化，直接名中国缓存

4  任务队列

针对请求，设计任务队列，保证流量控制一定范围内发送，通过指针（滑动窗口）

文件，视频转码（入队等待处理）

##### 如何实现网页加载进度条

怎么拿到进度：方法兼容器，fetch，ajax

怎么绘制进度：dom，canvas，svg

背景：

提升用户加载等待体验

方案：

ajax：监听页面，拿到进度返回值，svg/dom绘制

fetch：

react页面加载过渡进度条

引入nprogress

vue借助导航守卫比如router.beforeEach

##### 了解前端水印功能

基础水印和暗水印

背景：为了保证用户隐私和数据相对安全，实现水印功能（飞书），waterMark

方案：

明水印：

1  背景图添加水印，css（比较好去掉），svg（内容生成）

2  图片水印，canvas（创建图片，在图片内容去引入）

暗水印：

将信息写入文件二进制代码里去，服务端，二进制的编辑处理（判断侵权）

后端做，在绘制区域额外添加一部分内容的处理

##### 对于静态资源加载失败场景做降级处理