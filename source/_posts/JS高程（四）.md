title: JS高程（四）
date: 2017-02-22 17:17:49
tags: JS基础
---
## 第5章 引用类型（一）（Object、Array、Date）

**引用类型**是一种数据结构，和其他面向对象语言中的**类**很相似。之前介绍的JS中的6种数据类型，5种基本数据类型Undefined，Null，Boolean，String，Number，还有1种复杂数据类型**Object**，这里用Object是由于JS中大多数引用类型的值都是Object类型的实例。JS中可以通过Object创建用户自定义的引用类型，也有许多内置的**原生引用类型**：Array、Date、RegExp、Function、基本包装类型、单体内置对象。

<!--more-->

### 5.1 Object类型

* 创建的方法
    
    * 法一：new Object()
    ``` javascript
    person = new Object();
    person.name = "DaShuaiBi";
    person.age = 18;
    ```
    * 法二：对象字面量
    ``` javascript
    person = {name: "Dashuaibi", age: 18}; // 属性名和属性值之间用冒号隔开； 不同属性之间用逗号隔开
    ```

* 访问对象属性的方法
    
    * 法一：点表示法 后边永远不是 字符串
    ``` javascript
    // 接上代码
    alert(person.name);
    ```
    * 法二：使用方括号 方括号中永远是 字符串
    ``` javascript
    // 接上代码
    alert(person[name]); // !!! 注意 !!! 这样是undefiend
    ```
    * 方括号的优势
    ``` javascript
    // 方括号中可以是变量！！！ 
    var propertyName = "name"; 
    alert(person[propertyName]); // DaShuaiBi
    var propertyName2 = "age";
    alert(person.propertyName2); // undefined
    person = {name: "Dashuaibi", "age": 18};
    var propertyName3 = "age";
    alert(person.propertyName3); // undefined
    // 对象的属性名可以是字符串
    personX = {"name": "DaShuaiBi", "age": 16};
    alert(personX.name); // "DaShuaiBi"；点表示法仍可用
    alert(personX."name"); // 错误！！
    alert(personX[name]); // undefined
    alert(personX["name"]); // "DaShuaiBi"
    // 若是属性名很变态
    personY = {"first name": "HeiHeiHei", age: 16};
    alert(personY.first name); // 错误！！
    alert(personY."first name"); // 错误！！
    alert(personY["first name"]); // "HeiHeiHei"
    ```

### 5.2 Array类型

* 与其他语言中数组的异同
    
    * 同： 都是数据的有序列表
    
    * 异： JS中数组可以存放不同数据类型的元素；JS中数组的大小（长度）是可变的

* 创建数组的方法
    
    * 法一： new Array()
    ``` javascript
    // 以下几种方法均可
    var colors = new Array();
    var colors = new Array("red", "blue", "green");
    var colors = new Array(3);
    ```
    * 法二： 数组字面量
    ``` javascript
    var colors = [];
    var colors = ["red", "blue", "green"];
    var colors = ["red", "blue",]; // 这样不好。很多情况下都不好，比如css的属性、json中的数据……
    ```
* 读取、设置数组元素
    
    使用方括号、基于0索引。
    ``` javascript
    // 读取
    var colors = ["red","blue", "green"];
    alert(colors[1]); // "blue"
    // 设置1 修改
    colors[1] = "shit_yellow";
    alert(colors[1]); // "shit_yellow"
    // 设置2 新增
    alert(colors[3]); // undefined
    colors[3] = "yima_red";
    alert(colors[3]); // "yima_red"
    ```

* 数组的length属性
    
    * 返回数组的大小
    ``` javascript
    var colors = ["red", "blue", "green"];
    alert(colors.length); // 3
    ```

    * 从数组末尾移除元素
    ``` javascript
    colors.length = 2;
    alert(colors[2]); // undefined
    colors.length = 1;
    alert(colors[1]); // undefined
    ```

    * 在数组末尾添加新项
    ``` javascript
    var colors = ["red", "blue", "green"];
    alert(colors.length); // 3
    colors[colors.length] = "yellow";
    colors; // ["red", "blue", "green", "yellow"]
    alert(colors.length); // 4
    ```

    * 增大length的值
    ``` javascript
    var colors = ["red", "blue", "green"];
    alert(colors.length); // 3
    colors.length = 5; 
    alert(colors[3]); // undefined
    alert(colors[4]); // undefined
    alert(colors[5]); // 也是undefined……
    ```

    * 给不在初始范围内的位置上赋值
    ``` javascript
    var colors = ["red", "blue", "green"];
    colors[999] = "yellow";
    alert(colors.length); // 1000
    alert(colors[555]); // undefined
    ```

#### 5.2.1 检测数组
说明：xxx表示变量名；XXX表示某种引用类型，如Array、Function...
* **typeof**操作符
    type of xxx;

* **instanceof**操作符
    xxx instanceof XXX

* **Array.isArray()**方法
    Array.isArray(xxx)

    ``` javascript
    var nickName = ["DaShuaiBi", "HeiHeiHei", "Ob"];
    var xiaoName = "xiaofei";
    
    alert(typeof nickName); // object
    alert(typeof xiaoName); // string

    alert(nickName instanceof Array); // true
    alert(xiaoName instanceof Array); // false
    alert(xiaoName instanceof String); // false !!!

    alert(Array.isArray(nickName)); // true
    alert(Array.isArray(xiaoName)); // false
    ```

#### <span id="5.2.2">5.2.2 转换方法</span>

toString()、toLocaleString()、valueOf()、join()方法

``` javascript
var colors = ["red","blue", "green"];
alert(colors.join()); // "red,blue,green" ；大多数的默认的，用逗号分隔
alert(colors.join("||")); // "red||blue||green"
```

toLocaleString()比较特殊。但不想看……

#### 5.2.3 和5.2.4 栈方法和队列方法

用数组Array模拟栈和队列。

栈：数据只能从栈顶进出；后进先出。

队列：数据只能从队首出，只能从队尾进；先进先出。

三个方法：**push()**模拟压栈；**pop()**模拟出栈和队列在队尾新增元素；**shift()**模拟队列删除队首元素

注意这几个函数的返回值！！！

``` javascript
// 模拟栈
var colors = new Array();
var count = colors.push("red", "green"); // push 将元素压入栈，并返回当前数组的长度
alert(count); // 2
colors; // ["red", "green"]
var count = colors.push("blue");
alert(count); // 3
colors; // ["red", "green", "blue"]
var item = colors.pop(); // 从栈顶删除元素即数组的最后边，并返回被退栈的元素
alert(item); // "blue" !!!
colors; // ["red", "green"]

// 模拟队列
var colors = new Array();
var count = colors.push("red", "green"); // 这里和模拟栈一样
alert(count); // 2
colors; // ["red", "green"]
var count = colors.push("blue");
alert(count); // 3
colors; // ["red", "green", "blue"] 至此还和栈一样
var item = colors.shift(); // 从队首删除元素即数组的最前边，并返回该元素
alert(item); // "red" !!!
colors; // ["green", "blue"]
```

另外还有一个函数**unshift()**，在数组前端添加元素，并返回数组的长度。

可以使用unshift()和pop()反向模拟队列。从队尾（数组后边）删除，从队首（数组前边）加入。

可以使用unshift()和shfit模拟倒着的栈？

这四个函数的关系：push() ~ unshift()；pop() ~ shift()

#### 5.2.5 重排序方法
有两个方法，sort()和reverse()。

* **reverse()**方法
 只是将数组元素反转，并不管大小顺序。
    ``` javascript
    var values = [1, 2, 3, 4, 5];
    values.reverse();
    alert(values); // 5, 4, 3, 2, 1
    alert(values.reverse()); // 返回值 排序后的数组 1, 2, 3, 4, 5
    ```

* **sort()**方法
    > sort()方法会调用每个数组项的toString()转型方法，然后比较得到的字符串，以确定如何排序。
 
 所以有时候并不是人们期望的结果。

    ``` javascript
    var values = [0, 1, 5, 10, 15];
    values.sort();
    alert(values); // 0, 1, 10, 15, 5
    alert(values.sort()); // 返回值 排序后的数组 0, 1, 10, 15, 5
    ```

 为了解决上述问题。sort()方法接收一个**比较函数**作为参数，以便指定排序规则。
 > **比较函数**接收两个参数，返回值可以是负数、0、正数。若是正数，则规定第一个参数在第二个参数之后；若是负数，则规定第一个参数在第二个参数之前。

    ``` javascript
    // 升序
    function compareUp(value1, value2) {
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    }

    // 降序
    function compareDown(value1, value2) {
        if (value1 < value2) {
            return 1;
        } else if (value1 > value2) {
            return -1;
        } else {
            return 0;
        }
    }
    
    var values = [1, 4, 5, 3, 2];
    values.sort(compareUp);
    alert(values); // 1,2,3,4,5
    values.sort(compareDown);
    alert(values); // 5,4,3,2,1

    // 更简单的方法，适合数值类型
    // 升序
    function compareUp2(value1, value2) {
        return value1 - value2;
    }
    // 降序
    function compareDown2(value1, value2) {
        return value2 - value1;
    }
    ```

#### 5.2.6 操作方法

类似python中的切片。

三个函数：concat()、slice()、splice()。concat--合并；slice--薄片、切开；splice--拼接

* **concat()**
    
    ``` javascript
    var skills1 = ["code", "ps","football"];
    var skills2 = skills1.concat("dream",["piebi", "kandan"]);

    alert(skills1); // code,ps,football
    alert(skills2); // code,ps,football,dream,piebi,kandan
    ```

* **slice()**
 
 两种情况

    ``` javascript
    var colors = ["red", "blue", "green", "white", "black"];
    // 情况1 只有一个参数
    var colors1 = colors.slice(1);
    alert(colors); // red,blue,green,white,black
    alert(colors1); // blue,green,white,black
    // 情况2 有两个参数
    var colors2 = colors.slice(1, 3);
    alert(colors); // red,blue,green,white,black
    alert(colors2); // blue,green
    ```

* **splice()**
 第一个参数：要删除的第一项的位置；第二个参数：要删除的项数；第三、四...个参数：要增加的项目。
    
    ``` javascript
    var colors = ["red", "green", "blue"];
    // 删除 只需指定前两个参数
    var removed1 = colors.splice(0, 1);
    alert(colors); // green,blue
    alert(removed1); // red
    
    // 插入 即第二项 要删除的项数为0
    var removed2 = colors.splice(1, 0, "yellow", "purple");
    alert(colors); // green,yellow,purple,blue
    alert(removed2); // []

    var removed3 = colors.splice(0, 0, ["white", "black"]);
    colors; // [["white","black"],"green","yellow","purple","blue"]
    alert(colors); // white,black,green,yellow,purple,blue
    alert(removed3); // []
    
    // 替换 需要三个参数
    var removed4 = colors.splice(0, 1, "orange");
    // 注意！！！ 这里的第一个元素是一个数组,当成一个整体。
    colors; // ["orange","green","yellow","purple","blue"] 
    alert(removed4); // white,black
    ```

#### 5.2.7 位置方法

两个函数：indexOf()和lastIndexOf()，一个从前往后，一个从后往前。

两种情况。

``` javascript
var numbers = [1, 3, 4, 5, 6, 7, 3, 5];
// 情况1 只有一个参数  表示要找的元素而不是索引位置
alert(numbers.indexOf(3)); // 1 而不是 5
// 情况2 两个参数 第一个是要查找的元素，第二个是查找起点位置
alert(numbers.indexOf(3, 0)); // 1
alert(numbers.indexOf(3, 2)); // 6
alert(numbers.indexOf(3, 7)); // -1 找不到了，不会再返回0号位置找
```

#### 5.2.8 迭代方法 & 5.2.9 归并方法
好多函数：every()、filter()、forEach()、map()、some()和reduce()、reduceRight()。都不是很了解。。。都会接收一个函数参数？？？

### 5.3 Date类型

**UTC**(Coordinated Universal Time)和**GMT**(Greenwich Mean Time)的区别。GMT是时区(time zone)，UTC是时间标准(time standard)。更具体的参考[这里](https://www.timeanddate.com/time/gmt-utc-time.html)和[这里](http://pansci.asia/archives/84978)。

Date类型使用自UTC，1970.1.1,00:00:00开始的**毫秒数**。

* 创建方法
    * 使用 new Date()方法
    ``` javascript
    // 不传参数 获取当前的日期时间
    var date = new Date();
    date; // Thu Feb 23 2017 14:58:01 GMT+0800 (中国标准时间)
    // 传递参数 需要传递想要时间的距离1970.1.1,00:00:00的毫秒数
    var date1 = new Date(123456789);
    date1; // Fri Jan 02 1970 18:17:36 GMT+0800 (中国标准时间)
    ```
    * 还是使用 new Date()方法，但参数更容易理解 Date.parse()和Date.UTC()
    ``` javascript
    // 传递的是 表示日期的字符串参数 用Date.parse()处理
    var date2 = new Date(Date.parse("Feb 11, 2017")); // 还有其他格式的日期。。。
    date2; // Sat Feb 11 2017 00:00:00 GMT+0800 (中国标准时间)
    // 传递的是 表示日期的数字 年 月 天 时 分 秒 毫秒
    var date3 = new Date(Date.UTC(2017, 1, 11, 03, 35)); // 前两个参数 是必须的 后边的参数可以省略 默认0 月份是从0-11
    date3; // Sat Feb 11 2017 11:35:00 GMT+0800 (中国标准时间) 注意这里想要的是凌晨3点，但是中国的标准时间是上午11点。这是基于GMT创建的，是GMT+0时区的时间，浏览器（或者说JS寄宿环境）会将其转换为本地的时间，中国是GMT+8。
    ```
    * 其实上边的Date.parse()和Date.UTC()放法可以省略…有些许不同
    ``` javascript
    var date4 = new Date("Feb,11,2017");
    date4; // Sat Feb 11 2017 00:00:00 GMT+0800 (中国标准时间) 和之前完全一样
    var date5 = new Date(2017, 1, 11, 03, 35);
    date5; // Sat Feb 11 2017 03:35:00 GMT+0800 (中国标准时间) 注意这里时间就是凌晨3点了。这是基于本地时区创建的。与之前不同
    ```

* **做性能度量** 
    
    ``` javascript
    var start = Date.now(); // 也可用 +new Date() 获取Date对象的时间戳？
    doSomething();
    var stop = Date.now(); // 也可用 +new Date()
    var cost = stop - start; // 所用的毫秒数
    ```

* 继承的方法
 
 上边的数组也有这些 在[5.2.2](#5.2.2) 转换方法中
 toString()、toLocaleString()、valueOf()（返回日期的毫秒数）

* 日期格式化
 
 专门用于将日期格式化为字符串
 toDateString()、toTimeString()、toLocaleDateString()、toLocaleTimeString()、toUTCString() 用的时候再看？不同浏览器或许还不同？

* 日期/时间组件方法
    
    FullYear、Month、Date（天数 1-31）、Day（星期几 0日-6六）、Hours、Minutes、Seconds、Milliseconds（**日期中的**毫秒数）、Time（**日期的**毫秒数）、TimezoneOffset（？） 都有get、set方法，还有UTCXX。
    ``` javascript
    var date = new Date();
    date.getMilliseconds(); // 118
    date.getTime(); // 1487832517118
    ```
