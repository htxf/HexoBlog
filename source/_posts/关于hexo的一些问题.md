title: 关于hexo的一些问题
date: 2016-03-13 21:24:23
tags:
---
## 1.hexo的deploy问题
之前在修改完主题之后，deploy就有过问题。

**解决：**

查资料后说是ssh key的问题。然后按照github上的关于ssh keys的[help](https://help.github.com/categories/ssh/)重新产生了一个ssh key，问题解决。
但这次写完上篇笔记再deploy时，又出现了问题。但是我去**C:\Users\Administrator\.ssh**目录查看,ssh key的几个文件都在，值和github自己账户上的ssh keys的值也完全一样。应该不是ssh key的问题了。
~~网上有个方法是将github上的clone url改为HTTPS，同时配置hexo的_config.yml，并将.deploy_git文件夹删除。再进行deploy，然而还不行。~~
最后是看见有人分享是因为Git的版本太高，降级到1.9几就好了。本来我用的是2.5的，降级到1.9.5的确解决了！！！

<!--more-->

**之后还是要学一下ssh的知识**
## 2.hexo的markdown格式
hexo的官网上说明
>Hexo 支持 GitHub Flavored Markdown 的所有功能，甚至可以整合 Octopress 的大多数插件。

不知道这个markdown的格式和markdown本身的格式具体是什么区别。我也是刚刚学markdown写作，开始还得照着简明语法手册来编辑。我用的编辑器是作业部落Cmd Markdown。再写第一篇笔记时，在Cmd Markdown上的预览上比如标题、引用、公式都能显示出正常的状态。但是hexo后好多都不显示该有的格式。

**解决：**

### 标题
hexo上的Markdown的符号之后要有空格，比如###2.XXX 就不能正常显示，而要写成### 2.XXX才可以。（但这里并没有变成标题，是因为要写在开头才行吧）
而这也是hexo很多配置的文件中的格式，**属性后的值要先跟一个空格**。
### 引用
我改了主题，而引用的效果是要自己写的，应用其实就是HTML上加了一对*blockquote*标签（具体是在article.styl中的.article-entry下的blockquote修改）。我用了[Apollo](https://github.com/pinggod/hexo-theme-apollo)的引用的样式。（好吧，标题的hover也是，感觉和我的背景的树和hamburger比较搭……）

### 列表
文章中有一个无序列表，我发现不管我在 - 后空不空格，都不能显示标点。才想起来是在写主题时，在css Reset时候写了


``` css
ol,li {margin:0; padding:0; list-style:none;}
```


这样当然不能显示标点了。。删掉后发现在文章的标签处也有了圆点标记了。标签也是列表结构的，还是在在article.styl中.article-tag-list属性下添加  list-style: none；然后还有hamburger上的导航也是列表也有圆点标记，再找到代码添加。**这样是不是还不如整体上ol,li的list-none，具体要的标记的地方再写样式。问题是list-style最基本的有什么值都不知道。。**

>list-style定义和用法
list-style 简写属性在一个声明中设置所有的列表属性。
该属性是一个简写属性，涵盖了所有其他列表样式属性。由于它应用到所有 display 为 list-item 的元素，所以在普通的 HTML 和 XHTML 中只能用于 li 元素，不过实际上它可以应用到任何元素，并由 list-item 元素继承。
可以按顺序设置如下属性：
list-style-type
list-style-position
list-style-image
可以不设置其中的某个值，比如 "list-style:circle inside;" 也是允许的。未设置的属性会使用其默认值。
默认值：	disc outside none

比如有圆形的标记，方块的标记；outside和inside的区别感觉就是把列表项往后移动了；还有一些自定义的标记。

### 公式
文章中有些公式。还是用Cmd Markdown编辑，按照它的说明写，预览是正确的。但在hexo后，显示不出来。


经查阅，Cmd Markdown是用的[LaTeX](https://zh.wikipedia.org/wiki/LaTeX) 公式，LaTeX是一种格式，
>利用这种格式，即使用户没有排版和程序设计的知识也可以充分发挥由TEX所提供的强大功能，能在几天，甚至几小时内生成很多具有书籍质量的印刷品。

尤其是对生成数学公式比较厉害。（自己理解是，这是定一些规矩，按照这种规矩书写就可以被相应的工具解析成你想要的东西。）

而
>Hexo並沒有內建Tex解析功能

所以要在hexo中加入解析Tex的功能，网上大家大部分用的是[MathJax](https://www.mathjax.org/)，按照[这篇文章](http://lukang.me/2014/mathjax-for-hexo.html)成功解决。

但其中有比如说 $3000H\times16=30000H$，我开始是写成了$3000H\*16=30000H$了，后者在Cmd Markdown的预览下看着还是公式，然而在hexo下不是。**因为**在LaTeX中乘号不是用 \* 表示的，而是用\times 表示。在网上找到了一篇[常用数学符号的 LaTeX 表示方法](http://mohu.org/info/symbols/symbols.htm)。（星号\*表示斜体的开始，还要用\来转译的。）