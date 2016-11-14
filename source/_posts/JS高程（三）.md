title: JS高程（三）
date: 2016-11-14 11:08:26
tags: JS基础
---
## 第4章 变量、作用域和内存问题

### 1. 基本类型值和引用类型值

注意区别：ECMAScript有6种**数据类型**（5种基本数据类型，1种复杂数据类型）；ECMAScript变量可能包含2种不同**数据类型的值**，即
**基本类型值** 是指简单的数据段
**引用类型值**是指那些可能由多个值构成的对象

5种基本数据类型：Undefined、Null、Boolean、Number、String是**基本类型值**，是**按值访问**的，因为可以操作保存在变量中的实际的值。
1种复杂数据类型：Object是**引用类型值**，是**按引用访问**的，因为操作对象时，实际上是在操作对象的引用而不是实际的对象。

#### 1.1 复制变量值
* 基本类型值的复制
    ``` javascript
    var num1 = 5;
    var num2 = num1;
    alert(num1); // 5
    alert(num2); // 5
    num1 = 10;
    alert(num1); // 10
    alert(num2); // 5    num1和num2的值各一份 互不影响
    ```

* 引用类型值的复制
    ``` javascript
    var obj1 = new Object();
    obj1.name = "HeiHei";
    var obj2 = obj1;
    alert(obj1.name); // "HeiHei"
    alert(obj2.name); // "HeiHei"
    obj1.name = "DaShuaiBi";
    alert(obj1.name); // "DaShuaiBi"
    alert(obj2.name); // "DaShuaiBi"  与基本类型值的区别 obj1和obj2存的实际是指针，指向同一个对象
    // 怎样画图 插图？
    ```

#### 1.2 函数传递参数
ECMAScript中所有函数的参数都是**按值传递**的。访问变量有按值和按引用两种方式，而参数只能按值传递。

* 向参数传递基本类型值
   
    ``` javascript
    function addTen(num) {
        num += 10;
        return num;
    }    

    var count = 20;
    var result = addTen(count);
    alert(count); // 20，是按值传递的，count并没有变
    alert(result); // 30
    ```

* 向参数传递引用类型值

    ``` javascript
    function setName(obj) {
        obj.name = "HeiHei";
    }

    var person = new Object();
    setName(person);
    alert(person.name); // "HeiHei"
    // 按照上边的代码，在局部作用域中修改过的对象会在全局作用域中反映出来，就说明参数是按引用传递的？
    // 这是不对的，看下边的
    
    function setName(obj) {
        obj.name = "HeiHei";
        obj = new Object();
        obj.name = "DaShuaiBi";
    }

    var person = new Object();
    setName(person);
    alert(person.name); // "HeiHei" 这里并不是"DaShuaiBi"
    // 如果person是按引用传递的，那么person将会自动被修改为指向其name属性为"DaShuaiBi"的新对象
    // 在函数内部修改了参数的值，但原始的引用仍然保持不变
    // 当在函数内部重写obj时，这个变量引用的就是一个局部对象了，在函数执行完毕后立即被销毁
    // 画图更能表现。。。。。
    ```

#### 1.3 检测类型
**typeof 操作符**用来检测一个变量是不是基本数据类型。（注意typeof用来检测null时会返回object。null是一个空的对象的引用，一个指向空的对象的指针？ **引用**和**指针**在JS中差不多是一个意思？）

**instanceof 操作符**用来检测引用类型的值。

typeof操作符检测引用类型的值（对象）时，会返回object，而我们不仅想知道这个值是object，还想知道它**是什么类型的对象**，这时，要用instanceof操作符。
``` javascript
// 语法；具体还得看constructor；不像 typeof 变量名，而是 变量名 instanceof XXX
result = variable instanceof constructor
// 例子
alert(person instanceof Object);
alert(colors instanceof Array);
alert(pattern instanceof RegExp);
```

### 2. 执行环境及作用域
几个概念：执行环境、变量对象、全局执行环境、函数的执行环境、作用域链
* **执行环境**：（环境）定义了变量或函数有权访问的其他数据，决定了他们各自的行为。
* **变量对象**：每个执行环境都有一个变量对象，环境中定义的变量和函数都保存在这个对象中。
* **全局执行环境**：最外围的一个执行环境。如Web浏览器中就是window对象。
* **函数的执行环境**：每个函数都有自己的执行环境。
* **作用域链**：代码在**执行环境**中执行时，会创建**变量对象**的一个作用域链。用来保证对执行环境有权访问的所有变量和函数（即变量对象中保存的变量和函数）**有序访问**。作用域链的前端始终都是当前执行的代码所在的执行环境的变量对象；全局执行环境的变量对象始终都是作用域链中的最后一个对象。

一个问题：**没有块级作用域**。前一篇提到过，for循环中计数的i。块级作用域应该就是{ }中的代码吧。

另一个问题，前一篇也提到过，声明变量时用var操作符和不用var操作符。前者的变量会自动被添加到**最接近的环境**（执行环境）中，后者的变量会被添加**全局执行环境**中。

``` javascript
// 例子1 
var color = "blue";

function changeColor() {
    var anotherColor = "red";
    
    function swapColor() {
        var tempColor = anotherColor;
        anotherColor = color;
        color = tempColor;
        // 这里可以访问 tempColor、anotherColor、color；这三个在swapColor()函数执行环境的变量对像的作用域链上能找到
    }
    
    swapColor();
    // 这里可以访问 anotherColor、color；这两个在changeColor()函数执行环境的变量对象的作用域链上能找到，tempColor找不到了。
}

changeColor();
// 这里只能访问 color；这个在全局执行环境的变量对象的作用域链上能找到，tempColor和anotherColor找不到了。

alert("Color is now " + color); // "Color is now red"

// 例子2 查询标识符
// 情形1
var color = "blue";

function getColor() {
    return color;
}

alert(getColor()); // "blue"
// 情形2
var color = "blue";

function getColor() {
    var color = "red";
    return color;
}

alert(getColor()); // "red"
```

### 3. 垃圾收集

* JavaScript是一门具有自动垃圾收集机制的编程语言，开发人员不必关心内存分配和回收问题。C和C++开发人员需要手动跟踪内存的使用情况（free(xxx)?）。

* 两种垃圾收集算法。**标记清除**：给当前不使用的值加上标记，然后再回收其内存；**引用计数**：跟踪记录所有值被引用的次数。 代码中有循环引用时，引用计数算法就会出问题。现在几乎没有使用引用计数的了。

* 怎样优化内存占用？想法：为执行中的代码只保存必要的数据。做法：**解除引用**：一旦数据不再有用，通过将其值设置为null来释放其引用。适用于**全局变量**和**全局对象的属性**。**局部变量**会在离开执行环境时自动被解除引用。
    
    ``` javascript
    //例子
    function createPerson(name) {
        var localPerson = new Object();
        localPerson.name = name;
        return localPerson;
    }

    var globalPerson = createPerson("DaShuaiBi");

    // 手工解除globalPerson的引用
    globalPerson = null;
    ```







