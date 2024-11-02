webpack5

#### 为什么需要打包

1  前端有每场多资源，img, front, css, js, ts, vue, 输出产物

2  有些资源需要加工（抽象为loader）

​	1  ts，ts-loader

​	2  js， babel-loader

​	3  css， css-loader + （mini/style-loader）

​	4  html，  html-webpack-plugin

3  对产物需要优化（处理，多个包）

​	1  optimization

​	2  splitChunkPlugin

4  输出产物



##### 核心模块

webpack-cli， webpack， webpack-devServer

js（webpack.config.js）

webpack（{

​	...config

}）

没有脚手架也可以，内部也是调用这个方法

##### 初始化操作

1  读取配置

entry

output

module

loader

plugins

2  初始化  complier对象

conplier（构建实例），compliation(构建内容)

3  插件挂载

webpack  最核心的内容，tabaple实现  插件语法



##### 1  入口文件解析工作

​	entry

​	单入口  “”

​	多入口 []

​	指定多入口  {}

##### 2  解析依赖，生成依赖图  depsGraph

##### 3  模块处理（module）   识别目标文件，匹配对应loader解析处理

​	js， babel-loader（swc，esbulid， rsbulid）

​	ts， ts-loader

​	css，css-loader

​	解析其他的（自定义loader）

modules:{

​	rules:[{

​		test: "./test"

​	}]

}

chunk生成

##### 4  优化

模块去重合并

代码压缩，esbulid， terser， uglyfyjs（旧的）

tree shaking，把未使用到的内容移除掉

##### 5  资源输出

根据配置给到的output，输出内容

如果存在chunk，输出机制不同

写入文件系统， fs操作

##### 结束构建

完成钩子触发



钩子存在在Conplier.js中（tabable库）

commonjs规范，缺点是不能tree saking处理

##### 热更新（输出webpack-depServer）

文件变化监听

局部模块更新

开一个ws服务，更新内容抽象为json，推给客户端看看更新哪个模块

更新状态重新渲染



#### 面试话术

1  介绍webpack5背景，为什么会有，解决什么问题

2  大致思路，整体流程

3  我之前在某某场景，自定义过loader，plugin解决什么问题

4  我认为webpack中有一些好的设计思想

​		基于tabable  的钩子机制（重要）

​		面向切面变成思想AOP（插件植入和插件调用，不在程序本体里），AOP，OOP，FP（vue Composition API（函数式鞭编程思想），react hooks）



#### 简单介绍下工作中常用的loader，plugin，实现过自定义的loader，plugin嘛

常用loader   对css，静态资源语法打包，就需要用到这个转换器（处理非js模块）

​	babel-loader   @babel/core

​	css-loader

​	style-loader

​	url-loader：指定处理文件大小，转base64或者直接拷贝

​	file-loader：解析文件路径

​	sass-loader

​	vue-loader

​	postcss-loader(处理css做优化，自动添加前缀等)

常用plugin   主要是拓展webpack功能，webpack运行周期里，会有一些hooks对外暴力吧，所以在webpack打包编译过程中，plugin会根据这些hooks执行一些自定义操作，实现对输出结果的干预或增强

​	Html-Webpack-Plugin: 基于html模版，生成对应的文件爱你和引用关系，构建运行时的产物

​	MiniCssExteactPlugin（抽离css）

​	DefinePlugin：允许定义些全局变量

​	TerserPlugin：es6的压缩

​	clean-webpack-plugin：清理打包

​	mini-css-extract-plugin: 开发运行时不能用css-loader，单独抽离出来成文件

​	-css-minimize-webpack-plugin: css压缩

​	Terser-webpack-Plugin: js 压缩

​	-uglify-js-plugin：js代码压缩和优化

bundle-analyzer-webpack-plugin：包体积分析

无法满足实际开发需求，自己封装

自定义loader（loader本质是函数）

自定义plugin（plugin本质是类）



学习过程中需要安装依赖（devDependencies）

type：模块化规范，有conmonjs（required）和esm（import）

不用脚手架的话自己引入自己的

const config = require（）

用webpack（config,(err,stats)），然后node build.js就可以

```
module.exports  = {
	mode: "production" //webpack5会做很多优化处理
	entry：“./src/index/js”
	output：{
		filename：“bundle.js”
	}
	module：{}
	rules:{
			test: /\.js&/,
			use:{
				loader:"babel-loader",
				options：[
					presets:["@babel/preset-env"]
				]
		
			}
		}
	}
}
```

output配置environment，把arrowFunction设置false

在package.json把js编程可编译的es5代码

自定义loader（loader本质是函数）支持webpack不支持的文件

比如yanlin-loader.js

```
module.exports = function(source){
	//比如加正则
	source = source.replace(/yanlin/g, "yl")
	return source
}
然后引用就行
```

yanlinPlugin.js

```
module.exports = class Yanlin{
	construtor(){
		apply(complier){
			complier.hooks.emit.tap((compilation)=>{
			console.log(compliation.assets)//输出的内容
			
			const complierHtml = html.replace(
			"{{js}}"，//可以js插入
			`
				<srcipt></script>
				${assetsKeys.map(
					(keu) => key.index('.map') === -1 && 
					`<srcipt src="${key}"></script>` 
				).filter(Boolean).ioin("")}
			`
			)
			source:() =>complierHtml;
			size :()=> complierHtml.length,
			})
		}
	}
}
```



##### 手写配置

```js
const path = require('path');
module.exports ={
	mode:'devlopmen5'
    entry: path.resolve( dirname,"../src/index.js"),
    output:{
        path: path.resolve( dirname,"../dist"),
        filename:"main[chunkhash:8].js",
        publicPath:"./',
        clean: true,
    }
    resolve:{
    extensions:['.jsx','.js']//解析
    }
    module:{
    	rules:[
    	{
    		test:/\(js | jsx)$/,
    		use:{
    		loader: "babel-loader",
    		options:{
    			persets:['@babel/preset-env', "@babel/preset-react"]
    				}
    			}
    		},
    		{
    		test:/\.(css | less)$/
    		use:{
    			'style-loader',
    			'css-loader',
    			'less-loader'
    		},
    		{
    		test:/\.(png | jpg)$/
    		generator:{
    			filename:"static/asserts/[name].[contenthash:8][ext]"
    		}
    		}
    	]
    },
    plugin:[{
    	new HtmWebpackPlugin({
    		template: path/resolve(_dirname, "../public/index.html")
    	})
    }]
}
```



##### babel-loader常见配置

```js
{
	test:/\.(jsx | tsx | js | ts)$/
	use:{
		loader:"babel-loader",
     	options:(
        	presets:[
            	"@babel/preset-env",
            	{
            		targets:{
            			chrome:"60",
            		}
    				useBulitIns:'usage',
                    corejs: 3
            	}
            ]
        )
	}
}
//第二中，独立出来，或者 .babelsrc 或者 babel.config.js
//配置presets和plugin
{
    presets:[
        "@babel/presets-env",
        "@babel/presets-react"
        "@babel/presets-typescript",
        "@babel/presets-flow"
    ]
}
```

##### webpack的指纹占位符

```
filename："main.[chunkhash:8].js"
name:文件名字
ext:资源后缀名
path:文件相对路径
folder:文件所在文件夹

hash:每次构建，任何一点改动，整个项目hash会变
chunkhash:只在当前chunk有改动，hash会变
contenthash:根据文件内容，决定是否改变
```

##### webpack构建流程：

1  初始化各种参数，读取配置文件，进行解析，各种merge。。。，形成标准化配置

2  开始编译：complier，对象初始化，注册所有配置插件，执行run开始编译

3  entry开始，读取所有依赖，形成ast，递归处理

4  文件编译：根据文件整个匹配对应的loader，进行文件转换

5  形成一个整体资源树，完成模块的编译

6  输出资源：根据入口模块的关系，组成一个个chunk，再把每个chunk转换成单独的文件，准备输出

7  输出完成，根据output配置的内容，把文件最后写入磁盘中

##### bundle，chunk，module

module：构建角度上来说，一个文件，或者几个高内聚文件，就是一个module

chunk：一般是一个构建流程的产物，代表一个静态分析的过程，从入口如何行测好难过一整个依赖树->形成一个chunk

bundle：最后的产物，main.xxx.js，把所有文件合并在一起，最后形成一个bundle.js

##### webpack的 tree shaking

三种

usedExports:静态分析过程中，有一些导入但是没有用过的，可以直接删除

sideEffects：删除模块中导出了，但是未被使用的变量

dead code elimination: 一些不会被用到的，最终产物删除一些死代码