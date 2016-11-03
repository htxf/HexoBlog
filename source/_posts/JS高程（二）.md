title: JS高程（二）
date: 2016-11-03 11:50:23
tags: JS基础
---
## 第3章 基本概念

### 1. 语法
* 区分大小写

* 多行注释
    ``` javascript
    /*
     * 这两行的星星是没有必要的，
     * 但就是好看啊。
     */
    ```

### 2. 关键字和保留字
这两个的异同是什么呢？
异：
> 关键字可用于表示控制语句的开始或结束，或者用于执行特定操作等

> 保留字有可能将来被用作关键字

同：都是小写的。。

### 3. 变量
* 变量是**松散类型**，可以用来保存任何类型的数据。

* 用 var 定义的变量将成为该变量作用域中的**局部变量**；省略 var操作符，创建的是**全局变量**。（对函数而言？）
    ``` javascript
    function test() {
      var message = "hi"; // 局部变量
    }
    test();
    alert(message); // 错误！
    ```

    ``` javascript
    function test() {
      message = "hi"; // 全局变量
    }
    test();
    alert(message); // "hi"
    ```
* 可用一条语句定义多个变量，用**逗号**分开。（可以初始化也可以不初始化）
    ``` javascript
    var message = "hi",   
        age,
        found = false;  // 这里的换行和缩进是不必要的，但是好看啊。
    ```

### 4. 数据类型
5种简单数据类型（基本数据类型）：**Undefined**、**Null**、**Boolean**、**Number**、**String**。
1种复杂数据类型：**Object**。
> ECMAScript中，所有值最终都将是上述6种数据类型之一。

说XX类型时，首字母都大写，但Undefined、Null、Boolean的值都是小写。

#### 4.1 typeof操作符
* 用来检测给定变量的数据类型。

* 返回值有："undefined"、"boolean"、"string"、"number"、"object"(如果变量是对象或null)、"fucntion"。（也是6种，但和上边的6中数据类型不完全对应）

    > null被认为是一个空的对象引用，所以返回object
     
    > 函数在ECMAScript中是对象，但又有其特殊性，所以返回function

* 返回值都是**字符串**类型的

* typeof是一个**操作符**，而**不是**一个**函数**，**不是**一个**方法**。
    ``` javascript
    var message;
    alert(typeof message); // 正确的写法；"undefined"  
    alert(typeof(message)); // 函数的话，有可能要传参，虽然能返回"undefined"，但不好
    alert(message.typeof); // 按照方法来写，错误
    ```

#### 4.2 Undefined 类型
* 只有一个值：undefined 。

* 使用var声明变量，但未初始化，这个变量的值就是undefined。

* 尚未声明（定义）的变量，是不能对其操作的，但对其执行typeof操作符，返回"undefined"。因此**建议**：
    > 显示地初始化变量，这样当typeof操作符返回"undefined"值时，就知道被检测的变量是还没有被声明，而不是尚未初始化。

#### 4.3 Null 类型
* 只有一个值：null 。

* null和Object的关系：null表示一个空对象指针。所以typeof时，会返回"object"。
* null和undefined关系：undefined值是派生自null的值的。
    ``` javascript
    alert(null == undefined); // true
    ```
  但是用全等的话就不行了。
    ``` javascript
    alert(null === undefined); // false
    ```
  相等（==）会进行类型转换，全等（===）类型也要相同才等。
* null和Object及undefined另一个关系：没有必要把一个变量的值显式地设置为undefined；但要把还没有来得及保存对象的变量设置为null，可以体现null作为空对象指针的惯例。
    ``` javascript
    var message = undefined; // 没有必要

    var student = null; //student准备存放对象，但现在还不知道要存的具体内容。
    /*
     * 一些操作……
     */
    student = {id:666,name:"DaShuaiBi"};
    ```

#### 4.4 Boolean 类型
* 两个值：true和false 。

* **转型函数**Boolean()。是个**函数**。可对任何数据类型的值调用Boolean()函数。
    ``` javascript
    // Undefined类型
    Boolean(undefined); // false
    // Null类型 和 Object类型
    Boolean(null); // false
    var student = {id:666,name:"DaShuaiBi"};
    Boolean(student); // true
    // String类型
    Boolean("HeiHeiHei"); // true
    Boolean(""); // false
    // Number类型
    Boolean(666); // true
    Boolean(0); // false
    Boolean(NaN); // false
    ```

* 流控制语句会自动执行相应的Boolean转换。

#### 4.5 Number 类型
* 十进制（**Decimal**）、八进制（**Octal**）、十六进制（**Hexadecimal**）
    ``` javascript
    var intNum = 55; // 整数 十进制
    // 八进制 Octal
    var octalNum1 = 070; // 八进制，十进制的56
    var octalNum2 = 079; // 不是八进制，0~7，忽略0，是十进制79
    var octalNum3 = 08; // 不是八进制，是十进制8
    // 十六进制 Hexadecimal
    var hexNum1 = 0xA; // 十六进制的10
    var hexNum2 = 0x1f; // 十六进制的31
    ```
  二进制（**Binary**）

* 浮点数值
    > 数值中必须包含一个小数点，小数点后必须至少有一位数字
    > 
    > 保存浮点数值需要的内存空间是保存整数值的**两倍**，ECMAScript会不失时机地将浮点数值转换为整数
    > 
    > 可以用e表示法，科学表示法 
    > 
    > 浮点数数值的最高精度是**17位**小数，但在进行算术计算时其精确度远远不如整数
    
    ``` javascript
    alert(0.1 + 0.2); // 不是0.3，而是0.30000000000000004；小数点后17位，15个0
    alert(0.15 + 0.15); // 是0.3
    ```
    对浮点数的建议：
    > 永远不要测试某个特定的浮点数值

    ``` javascript
    if (a + b == 0.3) { // 卡起码~
        alert("You got 0.3");
    }
    ```

* 数值范围：Number.MIN_VALUE ~ Number.MAX_VALUE；有正负无穷大-Infinity, Infinity；有个isFinite()**函数**。

* **NaN**是一个特殊的数值。NaN（Not a Number）。表示一个本来要返回数值的操作数未返回数值的情况（这样不会抛出错误）。（之前看ID3算法时，有个Java代码，其中要统计留下的数据中拥有某属性的总数作为分母，若是没有就为NaN，之后一直是NaN。这样虽然没报错，但其实还是不对。）
    ``` javascript
    alert(0 / 0); // NaN 
    alert(5 / 0); // Infinity
    alert(-5 / 0); // -Infinity
    ```
  两个特点：
    > 任何涉及NaN的操作（例如NaN/10）都会返回NaN
    > 
    > NaN与任何值都不相等，包括NaN本身

    ``` javascript
    alert(NaN / 10); // NaN
    alert(NaN == NaN); // false
    ```
  有个isNaN()**函数**。

* 把XX转换成数值，3种方式：**转型函数**Number()、专门用于**把字符串转换成数值**的parseInt()、parseFloat()
  
  **Number()函数**
    ``` javascript
    // Undefined类型
    Number(undefined); // NaN
    // Null类型
    Number(null); // 0
    // Boolean类型
    Number(true); // 1
    Number(false); // 0
    // 字符串类型
    Number(""); // 0 空字符串
    Number("HeiHeiHei"); // NaN
    Number("woca9453"); // NaN 第一个不是数字就不会是数字了
    Number("9453"); // 9453
    Number("017"); // 17 不会认为是八进制，会把0全部忽略
    Number("00017"); // 17
    Number("0xf"); // 15 会识别十六进制，转换为相应的十进制
    // Object类型
    // 先调用对象的valueOf()方法，再用上边的规则转化，若是NaN，再用对象的toString()方法，再用上边的规则转化
    ```

  **parseInt()函数**
    ``` javascript
    // 虽然是专门用来转换字符串，处理整数时用，但
    parseInt(undefined); // NaN
    parseInt(null); // NaN
    parseInt(true); // NaN
    parseInt(false);// NaN
    // 处理字符串
    parseInt(""); // NaN
    parseInt("HeiHeiHei"); // NaN
    parseInt("9453"); // 9453
    parseInt("woca9453"); //NaN
    parseInt("9453woca"); // 9453
    parseInt("070"); // 56 会识别八进制 ECMAScript 3是这样的；ECMAScript 5就不会识别八进制了，认为是70，忽略0
    parseInt("00017"); // 17 
    parseInt("0xf"); // 15 会识别十六进制
    parseInt("22.25"); // 22 会识别成整数，识别到第一个不是数字字符的地方就会停下来
    parseInt("3.125e7"); // 3 虽说是科学计数法的整数 但同上
    // 更好的用法，转换时使用基数
    parseInt("10", 2); // 2 二进制
    parseInt("10", 8); // 8 八进制
    parseInt("10", 10); // 10 十进制
    parseInt("10", 16); // 16 十六进制
    // 事实上，3、4、5……进制都行
    parseInt("10", 3); // 3
    parseInt("10", 4); // 4
    parseInt("10", 5); // 5
    parseInt("10", 36); // 36 
    parseInt("10", 37); // NaN 大于36之后的基数就都是NaN了
    ```
    可以看到parseInt()和Number()对于一些数据是有区别的，**应该只把parseInt()用于处理字符串整数**，并且最好带上第二个参数，指明基数。
  
  **parseFloat()函数**
    ``` javascript
    // 和parseInt()基本一样，不过是处理浮点数
    parseFloat("9453heiheihei"); // 9453
    parseFloat("22.25"); // 22.25
    parseFloat("22.25.35"); // 22.25
    parseFloat("09453.9453"); // 9453.9453
    parseFloat("0xf"); // 0 而不像parseInt()认为是15 因为parseFloat()只解析十进制数
    parseFloat("3.125e7"); // 31250000 而不像parseInt()认为是3   
    ```
  