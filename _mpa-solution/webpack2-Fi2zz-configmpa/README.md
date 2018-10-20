
# app.json 

本模板基于Vue webpack-template 

适用于Vue项目和非Vue项目

本模板默认css预处理为stylus

项目根目录下不要建 index.html和index.js。这两个文件将由Node.js自动生成

源码目录结构随意，页面入口文件名称和html模板名称必须是index，即index.js和index.html

```
 ` build `
 
	target                		打包文件发布目录
    publicPath            		资源公共路径
    asset                 		资源路径
    sub                   		资源子目录
    "html-template-path"  		打包html的存放路径   
    inject                		自动注入
    clean						清除上一次打包的文件
    hash						文件名添加hash串    

 ` dev ` 
    
    port                  		devSever的端口
    proxy                 		devServer proxy table的url
    autoOpenBrowser       		自动打开浏览器[Boolean]
    autoBuild             		开发期间自动打包[Boolean]
    
 ` module `  
    
    moduleName            		模块名称[String]
      enable              		启用模块 [Boolean]
      path                		模块所在目录 [String]
      page/pages          		模块页面名称 [String,Array]
      category				模块所属类别，打包时将创建类别目录
      
      如：pageA.category ="page-a" => template/path/page-a/pageName.html	 
      	
```



# app.json

```
{
  "build": {
    "target": "../static",
    "publicPath": "/",
    "asset": "./",
    "sub": "",
    "html-template-path": "../template",
    "inject": false,
    "hash": false,
    "clean": false
  },
  "dev": {
    "port": 8081,
    "proxy": false,
    "autoOpenBrowser": false,
    "autoBuild": true
  },
  "module": {
    "page": {
      "enable": true,
      "path": "./src/pages/page",
      "pages": [
        "home"
      ],
      "category": "page"
    },
    "moduleName0":{
      "enable":false,
      "path":"module/entry/file/path",
      "pages":["module-page-01","module-page-02"],
    },
    "moduleName":{
      "enable":true,
      "path":"module/entry/file/path",
      "page":"your-module-page-name",
      "category":"your-module-category"
    }
  }
}
```

