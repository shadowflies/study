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