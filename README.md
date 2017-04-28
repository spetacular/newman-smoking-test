# 如何生成测试集
可以使用POSTMAN生成测试集，使用方法见[《Postman 及 Newman 使用开发指南》](http://blog.text.wiki/tags.html#postman-ref)

# 如何运行脚本
采用nodejs脚本，用到了两个插件,安装方法如下：
```
npm install newman --save
npm install nodemailer --save
```

最后执行`node smoke.js`即可查看测试结果。
