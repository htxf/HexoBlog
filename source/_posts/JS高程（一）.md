title: JS高程（一）
date: 2016-10-26 21:24:23
tags: JS基础
---
## 第1章 简介
### 1. 几个人东
* 布兰登 艾奇 (Brendan Eich)
* ECMA(European Computer Manufactures Association) 欧洲计算机制造商协会
* ISO/IEC(International Organization for Standardization and International Electrotechnical Commission) 国际标准化组织和国际电工委员会

### 2. JavaScript = ECMAScript + DOM + BOM
* ECMAScript：Web浏览器只是ECMAScript **宿主环境之一**, Node和Adobe Flash 也是ECMAScript的宿主环境。
* DOM(Document Object Model)：文档对象模型。
 * **是个API**。针对XML但经过扩展用于HTMl的API。
 * 由W3C(World Wide Web Consortium)万维网联盟闹的。避免Netscape和微软的两强割据。（两家闹不同的DHTML Dynamic HTML）
 * DOM级别。自己理解所谓级别是不同阶段的标准，或者说后来又加入的新功能；DOM1，DOM2，DOM3级。DOM0级呢？没有，其实对应上边的DHTML。 
 * 不光是JavaScript有DOM，有其他语言也实现了DOM。SVG(Scalable Vector Graphic)可伸缩矢量图是一种语言，实现了DOM，有自己的标准。？？？
* BOM(Browser Object Model)：浏览器对象模型。
<!--more-->

## 第2章 在HTML中使用JavaScript
### 1. 当然是分 在页面（HTML）中嵌入JavaScript 和 包含外部JavaScript文件两种。
* 在页面中嵌入JavaScript时，想输出或弹出“`</script>`”，怎么转义呢？
  ``` javascript
  alert("<\/script>")
  ```
  注意不是`“\</script>”`，重点是`/script>`。
* `<script>` 标签放在哪里？一种：`<head>`尾部；另一种`<body>`尾部。

> 在文档的`<head>`元素中包含所有JavaScript文件，意味着必须等到全部JavaScript代码都被下载、解析和执行完成以后，才能开始呈现页面的内容（浏览器在遇到`<body>`标签时才开始呈现内容）。

  这样在加载很多JS文件是，浏览器窗口将是一片空白。

> 现在Web应用程序一般都把全部JavaScript引用放在`<body>`元素中页面内容的后面。

  但是，尝试本地的JS文件或者嵌入JS就不是这样的。。
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<title>test</title>
</head>
<body>
	诶哟，厉害啦。我出现了！！！！！
    <script type="text/javascript">
        alert("Hi");
    </script>
</body>
</html>
```
  或者
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
</head>
<body>
    诶哟，厉害啦。我出现了！！！！！
    <script type="text/javascript" src="test.js"></script>
</body>
</html>
```

``` javascript
//test.js
alert("Hello");
```
  这两种本来以为先显示“诶哟，厉害啦。我出现了！！！！！”，再alert出对话框，但都不是。。。
  本来还想试试
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
    <script type="text/javascript">
	    alert("Hi");
	</script>
</head>
<body>
	诶哟，厉害啦。我出现了！！！！！
	<script type="text/javascript" src="test.js"></script>
</body>
</html>
```
  想的是先弹出“Hi”，再显示出“诶哟，厉害啦。我出现了！！！！！”，最后再弹出“Hello”。。。后边的**defer**属性也是这样的。或许因为是本地文件的原因。
 
### 2. 延迟脚本和异步脚本
在`<script>`标签中加入`defer`和`async`属性。只适用于外部脚本文件。但还是和上一个问题一样，试本地的JS文件没有用。。。具体的效果之后还得再看。
### 3. 文档模式
这是说HTML的。有**混杂模式**，**标准模式**，**准标准模式**。但到底有什么用呢？
> 主要影响CSS内容的呈现。但在某些情况下也会影响到JavaScript的解释执行。

``` html
<!DOCTYPE html>
```
对于HTML 5，这条代码就是用来开启文档类型的标准模式。。。
### 4. 浏览器禁用JS时
浏览器中能够设置禁用JavaScript的。这种情况下，用的JS都不起作用，Web应用程序很可能一些效果或功能都没了。而可以使用`<noscript>`元素设置一些提醒给用户，提高用户体验。。。但是在支持JavaScript时，不会呈现`<noscript>`中的内容。（在`<noscript>`元素中一些html标签当然还能用比如`<h1>`、`<p>`；但是JS中的就不行了，比如alert..）