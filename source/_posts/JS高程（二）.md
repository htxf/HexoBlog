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

<!--more-->

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

#### 4.6 String 类型
* 表示由零或多个16位Unicode字符组成的字符序列，即字符串。Uncicode字符是一个字符占2个字节，定长；UTF-8相当于是可变的Unicod字符。

* 每个字符串都有一个**length**的**属性**，但它是返回字符串的长度，而不是返回字符串占多少个字节。

* String类型有一些特殊的**字符字面量**，也叫**转义序列**，用于表示非打印字符或其他用途。
  比如\r（回车）、\n（换行）。回车换行来自于之前的打印机，回车：carriage return，换行：line feed。回车是把打印头定义在左边界，换行是把纸下移一行。看的[这里](http://www.ruanyifeng.com/blog/2006/04/post_213.html)。
  转义序列只占一个字符：
    ``` javascript
    var text = "This is the letter sigma: \u03a3.";
    alert(text.length); // 输出28 \u03a3 算是一个
    ```

* 转换为字符串。两种方法：**转型函数**String()；**几乎每个**值都有的toString()**方法**。
  xx的**toString()**方法
    ``` javascript
    // Undefined类型的值undefined和Null类型的值null没有这个方法
    // Boolean类型
    var found = true;
    var foundAsString = foud.toString(); // 字符串"true"
    // Number类型
    var age = 11;
    var ageAsString = age.toString(); // 字符串"11"
    // Number类型 可以给toString()方法传递一个参数：输出数值的基数
    var num = 10;
    alert(num.toString()); // "10"
    alert(num.toString(2)); // "1010"
    alert(num.toString(8)); // "12"
    alert(num.toString(10)); // "10"
    alert(num.toString(16)); // "a"
    // 事实上，3、4、5……进制都行
    alert(num.toString(3)); // "101"
    alert(num.toString(4)); // "22"
    alert(num.toString(5)); // "20"
    alert(num.toString(11)); // "a" 之后大于11制的都是"a" 最大的基还是36
    // Object类型
    var student = {id:666,name:"DaShuaiBi"};
    student.toString(); // 返回"[object Object]" ？？？
    student.id.toString(); // 返回"666"
    ```
  **String()函数**
    ``` javascript
    // Undefined类型
    var value1;
    alert(String(value1)); // 弹出 "undefined"
    // Null类型
    var value2 = null;
    alert(String(value2)); // 弹出 "null"
    //Boolean类型、Number类型、Object类型再用这个函数时，都是调用该值的toString()方法。
    ```

#### 4.7 Object 类型
* 是一组数据和功能的集合。键值对、json、Java中所谓的bean实体类、Python中的字典……

* 可以通过执行new操作符后跟要创建的对象类型的名称来创建。
    ``` javascript
    var o = new Object();
    o.name = "DaShuaiBi";
    o.age = 11;
    //更深入一点的？
    ```

* Object的每个实例都具有下列属性和方法：constructor函数、hasOwnProperty(propertyName)、isProtypeOf(object)、propertyIsEnumerable(propertyName)、toLocaleString()、toString()、valueOf()。更具体的之后再讲。

### 5. 操作符 

#### 5.1 一元操作符
* 递增和递减操作符 ++ --
  ++num和num++异同；
  用于非数值时，将值转换为数字
* 一元加和减操作符 + - 放在数值前面
  就是正负号……；
  用于非数值时，将值转换为数字
  
#### 5.2 位操作符
**最好不要在JS中用位操作符？**
* 按位非（NOT） ~
  按位非的本质：操作数的**负值减1**。速度更快。这个有个[小例子](http://www.cnblogs.com/hutaoer/p/3390710.html)。
* 按位与（AND） &
* 按位或（OR） |
* 按位异或（XOR） ^
* 左移 <<
* 有符号的右移 >>
* 无符号的右移 >>>

#### 5.3 布尔操作符
* 逻辑非 !
  记住Boolean()函数对每种数据类型的结果，再取反就是了。
  **Boolean(variable)**和**!! variable** 是等价的。
* 逻辑与 &&
  逻辑与是**短路操作符**，怎么说，看例子：
    ``` javascript
    // 第一个操作数是true，才会对第二个操作数求值
    var found = true;
    var result = (found && someUndefinedVariable); //这里发生错误，someUndefinedVariable就没有声明
    alert(result); // 不会执行
    // 第一个操作数是flase，不会对第二个操作数求值，整个表达式一定是false
    var found = false;
    var result = (found && someUndefinedVariable); // 不会发生错误，根本不管someUndefinedVariable
    alert(result); // 弹出false
    ```
  有操作数不是布尔值时：（这里的第一个操作数都是true，要是是false的话，不管第二个操作数是啥，整个表达式都会返回false）
    ``` javascript
    var student = {name:"DaShuaiBi",age:11};

    // Undefined类型 有一个操作数是undefined
    true && undefined; // 返回 undefined 不是说Boolean(undefined) 是false，然后再算
    
    undefined && true; // 返回 undefined 不是说Boolean(undefined)是false，然后整个都是false
    undefined && null; // 返回 undefined
    undefined && NaN; // 返回 undefined
    undefined && 0; // 返回 undefined
    undefined && student; // 返回 undefined
    
    // Null类型 有一个操作数是null
    true && null; // 返回 null 不是说Boolean(null) 是false，然后再算
    
    null && true; // 返回 null 不是说Boolean(null) 是false，然后整个都是false
    null && undefined; // 返回 null
    null && NaN; // 返回 null
    null && 0; // 返回 null
    null && student; // 返回 null
    
    // Number类型 
    true && 9453; // 返回 9453 不是说Boole(9453) 是true，然后再算
    true && 0; // 返回 0 不是说Boolean(0) 是false，然后再算
    true && NaN; // 返回 NaN 不是说Boolean(NaN) 是false，然后再算
    
    0 && true; // 返回 0
    0 && undefined; // 返回 0
    0 && null; // 返回 0
    0 && NaN; // 返回 0
    0 && student; // 返回 0

    NaN && true; // 返回 NaN
    NaN && undefined; // 返回 NaN
    NaN && null; // 返回 NaN
    NaN && 0; // 返回 NaN
    NaN && student; // 返回 NaN

    // 9453 && xx 就相当于 true && xx

    // String 类型
    true && ""; // 返回 "" 不是说Boolean("") 是false，然后再算
    true && "heiheihei"; // 返回 "heiheihei" 不是说Boolean("heiheihei") 是true，然后再算

    "" && true; // 返回 ""
    "" && undefined; // 返回 ""
    "" && null; // 返回 ""
    "" && NaN; // 返回 ""
    "" && student; // 返回 ""
    
    // "heiheihei" && xx 就相当于 true && xx

    // Object类型
    true && student; // 返回student1 不是说Boolean(student1) 是true，然后再算
    
    // student1 && xx 就相当于 true && xx  
    ```
* 逻辑或 ||
  逻辑或和逻辑非一样，也是**短路操作符**，看例子：
    ``` javascript
    // 第一个操作数是true，就不会对第二个操作数求值了，整个表达式一定是true
    var found = true;
    var result = (found || someUndefinedVariable); // 不会发生错误，根本不管someUndefinedVariable
    alert(result); // 弹出true
    // 第一个操作数是flase，才会对第二个操作数求值
    var found = false;
    var result = (found || someUndefinedVariable); // 这里发生错误，someUndefinedVariable就没有声明
    alert(result); // 不会执行
    ```
  有操作数不是布尔值时，（若是第一个操作数是true，就不会管第二个操作数了，整个表达式的值一定是true）
    ``` javascript
    var student = {name:"DaShuaiBi",age:11};

    // Undefined类型 
    false || undefined; // 返回 undefined
    undefined || false; // 返回 false

    undefined || undefined; // 返回 undefined

    null || undefined; // 返回 undefined
    undefined || null; // 返回 null

    0 || undefined; // 返回 undefined
    undefined || 0; // 返回 0

    NaN || undefined; // 返回 undefined
    undefined || NaN; // 返回 NaN

    "" || undefined; // 返回 undefined
    undefined || ""; // 返回 ""

    9453 || undefined; // 返回 9453 不是说Boolean(9453) 是true，然后返回true
    "heiheihei" || undefined; // 返回 "heiheihei" 不是说Boolean("heiheihei") 是true，然后再返回true
    student || undefined; // 返回student 不是说Boolean(student)是true，然后再返回true
    undefined || 9453; // 返回 9453
    undefined || "heiheihei"; // 返回 "heiheihei"
    undefined || student; // 返回 student
    
    // Null类型
    false || null; // 返回 null
    null || false; // 返回 false

    null || null; // 返回 null

    0 || null; // 返回 null
    null || 0; // 返回 0

    NaN || null; // 返回 null
    null || NaN; // 返回 NaN

    "" || null; // 返回 null
    null || ""; // 返回 ""

    9453 || null; // 返回 9453 不是说Boolean(9453) 是true，然后返回true
    null || 9453; // 返回 9453
    
    "heiheihei" || null; // 返回 "heiheihei" 不是说Boolean("heiheihei") 是true，然后再返回true
    null || "heiheihei"; // 返回 "heiheihei"
    
    student || null; // 返回student 不是说Boolean(student)是true，然后再返回true
    null || student; // 返回 student
    
    // Number类型
    false || 0; // 返回 0
    0 || false; // 返回 false

    "" || 0; // 返回 0
    0 || ""; // 返回 null

    false || NaN; // 返回 NaN
    NaN || false; // 返回 false

    "" || NaN; // 返回 NaN
    NaN || ""; // 返回 null

    false || 9453; // 返回 9453，不是说 Boolean(9453) 是true，然后返回true
    9453 || false; // 返回 9453

    9453 || 183; // 返回 9453
    183 || 9453; // 返回 183

    9453 || ""; // 返回 9453
    "" || 9453; // 返回 9453

    9453 || "heiheihei"; // 返回 9453
    "heiheihei" || 9453; // 返回 "heiheihei"

    9453 || student; // 返回 9453
    student || 9453; // 返回 student

    // String类型
    false || ""; // 返回 ""
    "" || false; // 返回 false

    "" || "heiheihei"; // 返回 "heiheihei"
    "heiheihei" || ""; // 返回 "heiheihei"

    "" || student; // 返回 student
    student || ""; // 返回 student

    false || "heiheihei"; // 返回 "heiheihei"
    "heiheihei" || false; // 返回 "heiheihei"
    
    "heiheihei" || "DaShuaiBi"; // 返回 "heiheihei"
    "DaShuaiBi" || "heiheihei"; // 返回 "DaShuaiBi"

    "heiheihei" || student; // 返回 "heiheihei"
    student || "heiheihei"; // 返回 student

    // Object类型
    // 上边都有了
    ```
#### 5.4 乘性操作符
* 乘法 *
    ``` javascript
    alert(Infinity * 0); // NaN
    ```
* 除法 /
    ``` javascript
    alert(Infinity / Infinity); // NaN
    alert(0 / 0); // NaN
    alert(5 / 0); // Infinity
    alert(-5 / 0); // Infinity 
    ```
* 求模 %
    ``` javascript
    alert(Infinity % 5); // NaN
    alert(Infinity % 0); // NaN
    alert(5 % 0); // NaN
    alert(5 % Infinity); // 5
    alert(0 % 5); // 0
    alert(0 % Infinity); // 0
    alert(Infinity % Infinity); // NaN
    ```

#### 5.5 加性操作符
* 加法 +
    ``` javascript
    
    alert(-Infinity + -Infinity); // -Infinity

    // 如果两个操作数都是字符串，拼接；如果只有一个操作数是字符串，将另一个转换成字符串，再拼接
    var student = {name:"DaShuaiBi",age:11};
    
    alert(undefined + "heiheihei"); // "undefinedheiheihei"
    alert(undefined + ""); // "undefined"
    alert(null + "heiheihei"); // "nullheiheihei"
    alert(null + ""); // "null"
    alert(true + "heiheihei"); // "trueheiheihei"
    alert(true + ""); // "true"
    alert(5 + "5"); // "55" 而不是 10
    alert(5 + ""); // "5" 
    alert(0 + "5"); // "05"
    alert(0 + ""); // "0"
    alert(NaN + "5"); // "NaN5"
    alert(NaN + ""); // "NaN"
    alert("Da" + "ShuaiBi"); // "DaShuaiBi"
    alert(student + "heiheihei"); // "[object Object]heiheihei"
    alert(student + ""); // "[object Object]"
    
    // 两个操作数都不是字符串，也不是Number类型呢？ 都用Number()函数转换
    undefined + undefined; // NaN
    undefined + null; // NaN
    undefined + true; // NaN
    undefined + false; // NaN
    undefined + 0; // NaN
    undefined + NaN; // NaN
    undefined + 5; // NaN
    undefined + student; // "undefined[object Object]" 感觉不是用Number()转型了

    null + true; // 1
    null + false; // 0
    null + 0; // 0
    null + NaN; // NaN
    null + 5; // 5
    null + student; // "null[object Object]" 感觉不是用Number()转型了

    true + false; // 1
    true + 5; // 6
    false + 5; // 5
    true + 0; // 1
    false + 0; // 0
    true + NaN; // NaN
    false + NaN; // NaN
    true + student; // "true[object Object]"
    false + student; // "false[object Object]"

    0 + student; // "0[object Object]" 
    NaN + student; // "NaN[object Object]"
    5 + student; // "5[object Object]"
    ```
* 减法 -
    ``` javascript
    alert(Infinity - Infinity); // NaN
    alert(-Infinity - -Infinity); // NaN

    // 如果有一个操作数是字符串、布尔值、null或undefined，先用Number()函数转成数值，再相减。
    var student = {name:"DaShuaiBi",age:11};
    
    5 - undefined; // NaN
    5 - null; // 5
    5 - true; // 4
    5 - false; // 5
    5 - "heiheihei"; // NaN
    5 - "222"; // -217
    5 - ""; // 5
    5 - student; // NaN 噢噢噢噢？

    // 两个操作数都不是数字呢？
    undefined - undefined; // NaN
    undefined - null; // NaN
    undefined - true; // NaN
    undefined - false; // NaN
    undefined - "heiheihei"; // NaN
    undefined - "222"; // NaN
    undefined - ""; // NaN
    undefined - student; // NaN

    null - null; // 0
    null - true; // -1
    null - false; // 0
    null - "heiheihei"; // NaN
    null - "222"; // -222
    null - ""; // 0
    null - student; // NaN

    true - true; // 0
    true - false; // 1
    true - "heiheihei"; // NaN
    false - "heiheihei"; // NaN
    true - "222"; // -221
    false - "222"; // -222
    true - ""; // 1
    false - ""; // 0
    true - student; // NaN
    false - student; // NaN

    "DaShuaiBi" - "Bi"; // NaN 要是"DaShuai"就不错哦
    "heiheihie" - "222"; // NaN
    "heiheihie" - ""; // NaN
    "heiheihie" - student; // NaN
    "222" - "2"; // 220
    "222" - ""; // 222
    "222" - student; // NaN
    "" - student; // NaN

    var people = {name:"DaShuaiBi",age:"23"};
    people - student; // NaN
    ```

#### 5.6 关系操作符
小于（<）、大于（>）、小于等于（<=）、大于等于（>=）
``` javascript
// 一些特殊的情况
"Brick" < "alphabet"; // true 字符串的比较 比较字符串对应的字符编码值 大写字母的字符编码全部小于小写字母的字符编码
"23" < "3"; // true 两个操作数都是字符串，比较的是对应的字符编码，"2"的字符编码是小于"3"的字符编码的
"23" < 3; // false 有一个是数字，"23"转换成23，再与3比较
// 有关NaN
"a" < 3; // false 有3，数值，需要把"a"转换成数值，然而"a"转换为Number类型是NaN， NaN与任何操作数进行关系比较，结果都是false
// 如果一个值不小于另一个值，则一定是大于或等于那个值。然而 NaN：
NaN < 3; // false
NaN >= 3; // false
```

#### 5.7 相等操作符
* 相等和不相等 == !=
  会先转换操作数（**强制转型**），然后再比较相等性
    ``` javascript
    // 一些特殊情况
    undefined == null; // true
    undefined == 0; // false
    null == 0; // false
    "NaN" == NaN; // false
    5 == NaN; // false
    NaN == NaN; // false
    NaN != NaN; // true
    false == 0; // true
    true == 1; // true
    true == 2; // false
    "5" == 5; // true
    ```
* 全等和不全等 === !==
  不进行转换操作数
    
> 为了保持代码中数据类型的完整性，推荐使用全等和不全等操作符。

#### 5.8 条件操作符
xx?xx:xx

#### 5.9 赋值操作符
* 简单赋值操作符 =
* 复合赋值操作符 *= /= %= += -= <<= >>= >>>=

#### 5.10 逗号操作符
比如声明多个变量时为啥用逗号隔开，还有对象中的不同属性之间用逗号隔开……    
    ``` javascript
        var num1 = 1,
            num2 = 2,
            num3;
        var student = {name:"DaShuaiBi",age:1}
    ```

### 6. 语句

#### 6.1 if语句
#### 6.2 do-while语句
后测试循环
#### 6.3 while语句
前测试循环
#### 6.4 for语句
前测试循环

> 由于ECMAScript中不存在块级作用域，因此在循环内部定义的变量也可以在外部访问到

``` javascript
var count = 10;
for (var i = 0; i < count; i++) {
    alert(i);
}
alert(i); // 10 i是在循环体内定义的，再循环体外也可访问到
```
#### 6.5 for-in语句

> for-in语句是一种精确的迭代语句，可以用来**枚举** **对象的** **属性**

#### 6.6 label语句
多与break和continue联合使用。多发生在**循环嵌套**情况下。比如可以从内层循环直接跳出外层循环。
#### 6.7 break和continue语句
#### 6.8 with语句

> with语句的作用是将代码的作用域设置到一个特定的对象中
> 
> 大量使用with语句会导致性能下降……不建议使用

#### 6.9 switch语句
避免写很多if、else if语句
switch、case、break、default
要是case后不加break，找到符合的case，之后的每个case都会执行。

> 可以在switch语句中使用任何数据类型（很多其他语言只能使用数值）
> 
> 每个case的值不一定是常量，可以是变量，甚至是表达式
> 
> switch语句在比较值时使用的是全等操作符

``` javascript
// 例子1 弹出"Greeting was found."
switch ("hello world") {
    case "hello" + " world":
        alert("Greeting was found.");
        break;
    case "goodbye":
        alert("Closing was found.");
        break;
    default:
        alert("Unexpected message was found.");
}
// 例子2 弹出"More than 20."
var num = 25;
switch (true) {
    case num < 0:
        alert("Less than 0.");
        break;
    case num >=0 && num <= 10:
        alert("Between 0 and 10.");
        break;
    case num > 10 && num <= 20:
        alert("Between 10 and 20.");
        break;
    default:
        alert("More than 20.");
}
```

### 7. 函数
* 函数的声明、调用、返回值。
    > 函数使用function关键字声明，后跟一组参数以及函数体
    > 
    > 函数可以通过其函数名来调用，后面还要加上一对圆括号和参数
    > 
    > 函数定义时不必指定是否返回值，在任何时候都可以通过return语句后跟要返回的值来实现返回值

* 理解参数
  (1) 其他语言可能需要事先创建一个**函数签名**（大概就是参数的类型吧），ECMAScript中不用

  (2) ECMAScript函数不介意传递进来多少个参数，也不在乎传进来参数是什么数据类型
    
    > ECMAScript中的**参数在内部**是用一个**数组**来表述的。函数接收的始终是这个数组，而不关心数组中包含哪些参数（如果有参数的话）

  (3) **在函数体内**，可以通过**arguments对象**访问这个数组。可以用**方括号语法**[]访问它的每一元素；可以使用**length属性**确定传递进来多少个参数

  (4) 函数中命名的参数只**提供便利**，但不是必需的

  (5) ECMAScript函数**没有重载**。其他函数的重载是通过声明定义相同的函数名，而有不同的参数类型或不同的参数数量实现的。
    
    > ECMAScript中由于函数没有签名，其参数是由包含零或多个值的数组表示的。没有函数签名，真正的重载是不可能做到的。
  
  但可以通过检查传入函数中参数的类型和数量并作出不同的反应，从而模拟重载。比如：
    ``` javascript
    function doAdd() {
        if (arguments.length == 1) {
            alert(arguments[0] + 10);
        } else if (arguments.lenght == 2) {
            alert(arguments[0] + arguments[1]);
        }
    }

    doAdd(10); // 20
    doAdd(30, 20); // 50
    ```

  (6) 关于**arguments**对象
  > arguments的**值**永远与对应的**命名参数**（大概就是形参吧）的值保持同步

    看例子：
  
    ``` javascript
    function doAdd(num1, num2) {
        arguments[1] = 10;
        alert(arguments[0] + num2);
    }
    

    doAdd(10,20); 
    /* 
     * 20 arguments对象中的值会自动反映到对应的命名参数本来传进来的参数是[10,20]，即arguments中是[10,20],但是
     * 修改了arguments[1]为10，则num2也被修改为10，最后alert的是10+10等于20
     */
    

    doAdd(10,"heihei"); 
    /*
     * 20 arguments刚开始是[10,"heihei"]，之后arguments[1]被修改为10，num2也跟着被修改为10，
     * 最后alert的是10+10等于20
     */
    ```

    > arguments对象的**长度**是由**传入的参数个数**决定的，不是由定义函数时的命名参数的个数决定的
    
    看例子：

    ``` javascript
    // 还是上边的函数
    

    doAdd(10,100,20);
     /*
      * 20 arguments刚开始是[10,100,20],之后被修改为[10,10,20]，
      * 再将num1、num2和arguments中的值对应，arguments[2]就没有用到，之后num2是10，最后alert的等于20
      */ 
    

    doAdd(10); 
    /*
     * NaN 如果只是传递了一个值，这时arguments中是[10],就没有arguments[1]，因此函数中第一句就没用。
     * 而对于没有传递值的命名参数将自动被赋予undefined值，也就是说这时num2中是undefined，alert的是 10 + undefined，
     * 先用Number(undefined)转型，为NaN，之后10 + NaN是NAN
     */ 
    ```

    > ECMAScript中的所有参数传递的都是值，不可能通过引用传递参数