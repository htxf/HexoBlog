title: JS高程（三）
date: 2016-11-14 11:08:26
tags: JS基础
---
## 第4章 变量、作用域和内存问题

### 1. 基本类型和引用类型值

注意区别：ECMAScript有6种**数据类型**（5种基本数据类型，1种复杂数据类型）；ECMAScript变量可能包含2种不同**数据类型的值**，即
**基本数据类型值** 是指简单的数据段
**引用类型值**是指那些可能由多个值构成的对象

5种基本数据类型：Undefined、Null、Boolean、Number、String是**基本类型值**，是**按值访问**的，因为可以操作保存在变量中的实际的值。
1种复杂数据类型：Object是**引用类型的值**，是**按引用访问**的，因为操作对象时，实际上是在操作对象的引用而不是实际的对象。

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
