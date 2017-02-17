#### 1.安装
	npm install

#### 2.常用命令
			a.启动服务：npm start
			b.打包项目：npm run build
			c.自定义服务：npm run [taskName]
			d.metabse发布文件地址拼接：npm run metabse

#### 3.关于框架

	需要添加第三方库可在package.json中添加

	项目相关服务配置在config文件夹中
	config
	├── app.conf.js					项目相关配置
	├── app.task.js					项目自定义服务
	├── webpack.base.js			基础webpack配置
	├── webpack.build.js		webpack打包功能配置
	├── webpack.dev.js			webpack本地服务配置
	└── webpack.server.js		webpack启动服务配置

	项目服务相关nodejs文件
	script
	├── build.js				打包功能  
	├── server.js				服务功能  
	└── task.js					其他自定义服务

#### 4.关于目录结构

	├── build		打包服务配置脚本目录
	├── dist		打包后文件目标目录
	├── assets		打包后去除html文件的可发布资源目录
	└── src
			├── component		组件		(可复用模块 或 方便实用的模块)
			├── data			数据		(公共数据层，事件、通知、公共字符串等)
			├── lib				公共库		(公共的工具或者样式等等)
			├── style			应用样式		(应用除了主题外单独的样式库)
			├── server			服务		(服务层，包含数据处理，状态机等各种公共服务)
			├── static			静态资源	(其他静态资源)
			├── views			各种页面的 views
			└── app.jsx			项目入口jsx

