title: JS高程（五）
date: 2017-02-27 14:00:42
tags: js基础
---
## 第5章 引用类型（二）（Function类型、基本包装类型、单体内置对象）

### 5.5 Function类型
> 函数是对象。
> 函数名实际上是一个指向对象的指针。

**函数的定义**
 * 法一：**函数声明**
 * 法二：**函数表达式**
 * 法三：使用Function构造函数

<!--more-->

    ``` javascript
    // 函数声明语法
    function sayHi() {
        alert("Hi");
    }
    // 函数表达式 没有函数名，通过变量sayHi即可引用；函数末尾有分号，是"var sayHi = XXX;"中的分号
    // 要执行函数时，应是sayHi()而不是sayHi
    var sayHi = function() {
        alert("Hi");
    };
    // 使用Function构造函数 不要用
    var sayHi = new Function("name", "alert("Hi" + name)");
    ```
 
 * 法一和法二，函数声明和函数表达式的异同。
  * 同：两者的sayHi都是指针，指向函数对象；执行函数时都是sayHi()，要加圆括号。
  * 异：解析器会率先读取函数声明，并在其执行任何代码之前可用。（**函数声明提升**function declaration hoisting）;函数表达式没有这个待遇。 
    
    ``` javascript
    // 函数声明提升
    sayHi("Dashuaibi"); // 没问题
    function sayHi(name) {
        alert("Hi " + name + "!");
    }
    // 至于函数表达式
    sayHi2("Dashuaibi"); // 发生错误！！！
    var sayHi2 = function(name) {
        alert("Hi " + name + "!");
    };
    ```

**函数没有重载**
    
第3章也曾经讲过。其他语言中的函数重载是通过相同的函数名而不同的参数形成的，但在JS中，定义函数时并不真正的关心形参，它只是个便利，调用函数时想传递多少参数都可以，在函数内部通过**arguments对象**来访问具体传递的参数。所以真正的函数重载在JS中不可能实现。

另一方面，函数是对象，函数名是指向栈内存对象的一个指针。如果连续定义了两个同名的不同函数体的函数A和函数B，相当于函数名从开始的指向栈内存函数A对象，变成了后来函数名指向栈内存函数B对象了。

**函数作为值**
 * 情形1：函数作为参数。注意此时是传递someFunction，而不是传递someFunction()。前一篇**数组排序问题**时就用到了compare函数做参数。

    ``` javascript
    // 函数1
    function funAsArg1 (name) {
        alert("Let's party, " + name + "!");
    }
    // 函数2
    var funAsArg2 = function (curPro) {
        var end = 100; 
        alert("还有百分之" + (end - cuPro) + "了~");
    };
    // 用函数做参数的函数
    function callSomeFun (someFun, someArg) {
        someFun(someArg);
    } 
    // 调用函数 函数做参数 不要圆括号
    callSomeFun(funAsArg1, "DaShuaiBi");
    callSomeFun(funAsArg2, 50);
    // 这次会弹出 Let's party, undefined! 但是callSomeFun中会出现错误，说someFun不是一个Function。总之和预想的不同
    callSomeFun(funAsArg1(), "DaShuaiBi");
    ```

 * 情形2：函数作为返回值。书中的例子还是比较好的。有个数据是对象数组，每个对象都有name和age，这样要对这个数组排序的话，可以按照name排也可以按照age排。
 如果还是和上一次一样，compare函数的参数是两个值，之前数组中是两个数字，而现在则是两个对象，~~就不存在顺序了~~ ，而应该是对象的属性的值才对。对象也可以存在顺序，但是是根据对象属性的值排序的

    ``` javascript
    // 降序
    function compareDown(value1, value2) {
        if (value1 > value2) {
            return -1;
        } else if (value1 < value2) {
            return 1;
        } else {
            return 0;
        }
    }
    // 升序
    function compareUp(value1, value2) {
        if (value1 > value2) {
            return 1;
        } else if (value1 < value2) {
            return -1;
        } else {
            return 0;
        }
    }
    // 数值数组
    var numArr = [5, 3, 2, 1, 4];
    numArr.sort(compareDown); 
    numArr; // numArr 变成 5 4 3 2 1
    numArr.sort(compareUp); 
    numArr; // numArr变成 1 2 3 4 5
    // 对象数组
    var data = [{name: "Zachary", age: 28}, {name: "Nicholas", age : 29}];
    data.sort(compareDown); 
    data; // data 不变
    data.sort(compareUp);
    data; // data 不变


    // 函数作为返回值，多传递一个参数
    function compareObjectArray(propertyName) {
        // 这个函数是返回一个比较函数，比较函数可以用到对象的属性名了
        // 这里compare函数的两个参数就成了对象，而不是values了。虽然只是个形参。
        return function compare(object1, object2) {
            var value1 = object1[propertyName]; // 可以用.方法吗？ 不可以。
            var value2 = object2[propertyName]; // 可以用.方法吗？ 不可以
            // 升序的
            if (value1 > value2) {
                return 1;
            } else if (vale1 < value2) {
                return -1;
            } else {
                retrun 0;
            }
        }
    }

    data.sort(compareObjectArray("name")); // 为什么传"name"，而不是name呢？函数中用的是[]法，不是.法访问属性值。而且name是个变量名，并没有在哪儿定义。
    data[0]; // Object {name: "Nicholas", age: 29}
    data.sort(compareObjectArray("age"));
    data[0]; // Object {name: "Zachary", age: 28}
    ```

 还有疑问说对于对象数组的排序多了一个参数（属性名），那在写compare比较函数时直接传递不行吗？可是貌似就不行。。compare只有两个参数，就是要~~比较的东西~~ 应该是要排序的“对象”吧。那在写sort排序函数时传递行吗？即使可以传，它再怎样传递给compare呢？所以还是上边的方法可以解决问题。将compare函数作为返回值，传递给sort函数，而所需的属性名参数通过外层函数传递给compare函数（不算是传递给compare函数，应该说是compare可以使用该属性名参数）。

**函数的属性和方法** ！@#%&……&%#@！

 函数是对象，是对象就是有属性和方法。这些属性和方法没有闹明白……不知在何时用？？？也挺绕的……
 * 函数内部的对象arguments的属性**callee**
    > callee是一个指针，指向拥有这个arguments对象的函数。
 * 函数内部的对象**this**
    > this引用的是函数据以执行的**环境对象**，或者说是this值。
    
    那什么是环境对象呢？在第4章 *执行环境及作用域* 一节中，有**执行环境**、**变量对象**、**活动对象**、**作用域链**。 
 * 函数对象的属性**caller**
    > caller中保存着调用当前函数的函数的引用。
 * **length**属性
    > length属性表示函数希望接收的命名参数（形参？）的个数。
 * **prototype**属性
    > prototype中保存了引用类型的所有实例方法。
 * <span id="apply">**apply()**方法和**call()**方法</span>
    > 两者都是在特殊作用域中调用函数，等于设置函数体的this（对象）值。
    > 可以扩充函数赖以运行的作用域。

### 5.6 基本包装类型

基本包装类型有三个：Boolean、Number和String。

基本包装类型本质上是对象。但我们知道JS有五种**基本数据类型**，Undefined、Null、Boolean、Number和String，一种**复杂数据类型**，Object。所以Boolean、Number和String三者比较特殊，它们既有基本类型的特殊行为，也有引用类型的特点，即有属性、有方法。

**基本类型值**不是对象，它们不应该有方法，但它们真的有……比如下边的substring()方法
``` javascript
var s1 = "HeiHei, Jian Gui le.";
var s2 = s1.substring(3);
s2; //
```
这是因为：
> 每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而能够调用一些方法来操作这些数据。

那**基本包装类型**和**引用类型**的**区别**是什么？区别在于**对象的生存期**。
> 引用类型的实例只要执行操作还没离开作用域，它就一直活在内存中。
> 自动创建的基本包装类型的对象，只存在于一行代码的执行瞬间。

既然Boolean、Number和String是基本包装类型，是特殊的引用类型，就可以**显式地**用new来创建对象。
``` javascript
var num = 250;
num.name = "sb";
alert(num.name); // undefined 为什么呢？基本包装类型的对象只存在于一行代码的执行瞬间。
// 显式地创建基本包装类型 这样与上边的情况就不同了。
var numObj = new Number(250);
numObj; // Number {[[PrimitiveValue]]: 250}
alert(numObj); // 250
// 此时numObj还可以添加属性、方法
numObj.name = "SB";
numObj; // Number {name: "SB", [[PrimitiveValue]]: 250}
alert(numObj); // 但这块儿还是 250
// 如果是
var ob = {name: "SB", age: 18};
alert(ob); // [object Object]
```

#### 5.6.1 Boolean类型
   > 永远不要使用Boolean对象！！！

比如
``` javascript
var falseObject = new Boolean(false);
alert(falseObject); // false 与预想相同
var result1 = falseObject && true;
result1; // true 与预想不同 falseObject && true做布尔运算，实际上是一个对象和true做&&，对象会被转化为true，本质上是true&&true。
var falseValue = false;
var result2 = false && true;
result2; // false
```

#### 5.6.2 Number类型
**toFixed()**，参数是指定的小数位，四舍五入
**toExponential()**，参数也是指定的小数位，用科学计数法（e表示法）做返回值
**toPrecision()**，以上两者的综合，自动选择合适的表达，不一定是四舍五入了。传递的参数是要保留几位数字，不是小数。

   > 不建议直接实例化Number类型！！！

原因同Boolean包装类型。
#### 5.6.3 String类型
 * **length属性**

    > 返回字符串包含多少个字符。
    > 占双字节的字符，每个字符也只算一个字符。

 
 * **charAt()方法**、**charCodeAt()方法**、**fromeCharCode()方法**
 前两个方法接收基于0的字符位置，最后一个方法接收一个或多个字符编码。
 第一个方法返回该位置的字符，第二个方法返回该位置的字符相应的字符编码，第三个方法返回字符编码相应的字符。
 
 * **concat()方法**、**slice()方法**、**substr()方法**、**substring()方法**
 第一个方法用来拼接字符串。在Array类型中也有。不常用，都用+。后三个方法用来切割字符串。slice()在Array类型中也有。
 但是很麻烦……！@#%&……&%#@！
 
 * **indexOf()方法**、**lastIndexOf()方法**
 和Array类型中的一样。接收一个给定的子字符串，返回相应位置。
 书中有个例子，在一个句子中**找到所有匹配的子字符串的位置**。自己写一下，现在，就现在！！！
 * **trim()方法**
    > 创建一个字符串副本，删除前置及后缀的所有空格，然后返回结果。

 * **toLowerCase()方法**、**toUpperCase()方法**、**toLocaleLowerCase()方法**、**toLocaleUpperCase()方法**
    比较简单。还要看一些**字符编码**的知识。这一下小节中length、charCodeAt()、还有这里都用到了。
 
 * **localeCompare()方法**
 比较两个字符串的排序情况。xxx.localeCompare(XXX);
 这个和之前数组Array的排序sort，用的compare比较函数很类似。value1在value2之前，返回-1；value1在value2之后，返回1；两者一样，返回0。xxx相当于value1，XXX相当于value2。
 
 * **HTML()方法**
    > 尽量不要使用
 
 * 字符串的模式匹配方法 正则表达式 ！@#%&……&%#@！

#### 5.7 单体内置对象
内置对象：
> 由ECMAScript实现提供的、不依赖于宿主环境的对象，这些对象在ECMAScript程序执行之前就已经存在了。
> 不必显式地实例化内置对象，因为已经实例化了。如Object、Array、String。 

单体内置对象：单体？？？
* **Global对象**
    > 这个对象不存在……WTF…；
    > 不属于任何其他对象的属性和方法，最终属于Global对象；
    > 在全局作用域定义的属性和函数，都属于Global对象。diao的1比
    
 * encodeURI()和encodeURIComponent()、decodeURI()和decodeURIComponent()
  处理URI(Uniform Resource Identifiers)通用（统一）资源标识符的。
  接收URI字符串做参数。
  **有效的URI中不能包含空格！！！** 
  encodeURI能将空格编码成%20，（UTF-8）。
  encodeURIComponent还能对任何**非标准字符**（如 : / ? #）进行编码，而encodeURI不行。
 * eval()方法 python中也有eval()函数。但具体的用法不清楚……
  JS中的eval()接收一个参数，要执行的JS字符串。但有什么用呢？？？
 
 * Global对象的属性
  好多。
 * window对象
  不知怎样访问Global对象，但在Web浏览器中，会把Global对象作为window对象的一部分加以实现。所以是Global的都成了window的了。

* **Math对象**
 * Math对象的属性
  如：Math.E、Math.PI（π）……
 
 * min()和max()函数
    接收多个数值做参数。但是不能接收一个数组！！!
    ``` javascript
    var max = Math.max(5, 6, 8, 1, 5, 7);
    alert(max); // 8
    var values = [5, 6, 8, 1, 5, 7];
    var max2 = Math.max(values);
    alert(max2); // NaN !!!
    ```
    书中有一个技巧。应用了 *函数的属性和方法* 中的[apply()](#apply)方法:
    ``` javascript
    var values = [5, 6, 8, 1, 5, 7];
    var max = Math.max.apply(Math, values); apply的第一个参数设置了this值为Math，第二个参数可以是数组。？？？还是不懂。
    alert(max); // 8
    ```
    
 * ceil()、floor()、round()方法
    分别是向上舍入、向下舍入、四舍五入

 * random()方法
    > Math.random()方法返回**大于等于0小于1**的一个随机数。
    
    书中有一个公式利用Math.random()**从某个整数范围内**随机选择一个值。是什么？？？自己写！！！就现在！！！
    还有一中情况，告诉你最小值和最大值，怎样随机取其范围中的某个整数值？？？


#### !!上边两个问题的代码!!

##### 1. 找到所有匹配的子字符串。
``` javascript
var hw = "A \"Hello, World!\" program is a computer program that outputs or displays \"Hello, World!\" to the user. ";
// 错误！！！ 死循环了，浏览器崩溃了！？
var position = [];
var pos = hw.indexOf("e");
position.push(pos);
for (pos = pos + 1; pos > -1; pos++) {
    pos = hw.indexOf("e", pos);
    position.push(pos);
}

// 改成 pos++ 和indexOf中换了下 就对了？？ 感觉一样啊
// 不过最后还多一个 -1
var position = [];
var pos = hw.indexOf("e");
position.push(pos);
for (pos = pos + 1; pos > -1;) {
    pos = hw.indexOf("e", pos + 1);
    position.push(pos);
}
position; // [4, 37, 75, 94, 98, -1]

// 书中做法
var position = new Array();
var pos = hw.indexOf("e");

while(pos > 1){
    position.push(pos);
    pos = hw.indexOf("e", pos + 1);
}

position; // [4, 37, 75, 94, 98]
```

##### 2. 从某个整数范围内随机选择一个值

> **整数随机值 = Math.floor(Math.random() \* 可能值的总数 + 第一个可能的值 )**

反推：
s <= XXX < N + s
0 <= XXX -s < N
0 <= (XXX - s) / N < 1
则 ((XXX - s) / N) = Math.random()，推出XXX = Math.random() \* N + s
这样 s < XXX < N + s
刚好**向下取整**就可以取到s和最大值N+S-1了。

另一种：
lowValue <= XXX <= upValue
0 <= XXX - lowValue <= upValue - lowValue
0 <= (XXX - lowValue) / (upValue - lowValue) <= 1
则 (XXX - lowValue) / (upValue - lowValue) = Math.random()，推出XXX = (upValue - lowValue) \* Math.random() + lowValue
但这样下来
lowValue < XXX < upValue
取不到最小值和最大值，**向下取整**或**向上取整**只能解决一半问题。

设m大于0小于1，则
lowValue + m < XXX < upValue + m
然后两边都**向下取整**，才可以使得XXX取到lowValue和upValue。
又，m就是Math.random()，所以开始时
lowValue < XXX - Math.random()< upValue 
……
XXX = (upValue - lowValue + 1) \* Math.random() + lowValue
所以：
** 整数随机值 = Math.floor((最大值 - 最小值 + 1) \* Math.random() + 最小值) **

``` javascript
// 已知最大值和最小值，取一个区间内的整数
var start = Date.now();
function creatRanIntNum(lowerValue, upperValue) {
    return Math.floor((upperValue - lowerValue + 1) * Math.random() + lowerValue);
}
var ranNums1 = [];
var ranNums2 = [];
var ranNums3 = [];
for (var i = 0; i < 100; i++) {
    ranNums1.push(creatRanIntNum(1, 9));
    ranNums2.push(creatRanIntNum(10, 16));
    ranNums3.push(creatRanIntNum(0, 50));
}
var stop = Date.now();
alert("花了" + (stop - start) + "ms" ); // 有时候是0ms...加大随机个数到10000，差不多10ms左右
// var start = Date.now(); 这一句应该写在哪儿呢？？
```

