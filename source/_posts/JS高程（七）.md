title: JS高程（七）
date: 2017-03-13 19:25:47
tags: js基础
---
## 第七章 函数表达式

函数表达式是干什么的？用来创建函数的。创建函数的方法有：**函数声明**、**函数表达式**。

函数声明，有个特征：**函数声明提升**。函数表达式并没有。

函数表达式的语法形式：有两种？一种，创建一个函数表达式，没有给这个函数表达式起名字。这个函数就叫做**匿名函数（拉姆达函数）**；另一种，创建一个函数表达式，并给这个函数表达式起了个名字。这个函数就叫做**命名函数表达式**。

<!--more-->

### 1.1 匿名函数

举个例子：

``` javascript
// 这个function() {...}就是匿名函数（它并没有名字，但是sayHi指向了它），函数表达式。
var sayHi = function() {
    alert("Hi!");
}
```

### 1.2 命名函数表达式

举个例子。

先介绍下**递归**，在第五章的**函数的属性和方法**中，讲到**函数内部的对象arguments的属性callee**时并没有搞懂。arguments是传给函数的参数所在地，callee是指向拥有这个arguments对象的函数（指针）。（callee不知道什么意思，但像caller，召唤者）
``` javascript
// 阶乘，典型的用到了递归
function factorial(num) {
    if (num < 1){
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}
// 有个问题 就是 当factorial指向了其他地方，函数内部的factorial也不能用了。
var anotherFactorial = factorial;
factorial = null;
// 函数名只是个指针！！！ 
// 所以其实可以进行递归的函数还在堆内存中，只是现在找不到指引到它的指针了 ？？貌似不能这样解释
alert(anotherFactorial(4)); // 错误！！！ factorial已经被置成空了

// 用arguments.callee来解决这个问题
function factorial(num) {
    if (num < 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1); // 注意！！！
    }
}

var anotherFactorial = factorial;
factorial = null;
// 用来阶乘的函数在对象中，其内部并没有用其他的函数名（指针），而是用了自己（arguments.callee），所以就不会再“迷路”了？？能这样解释吗？？
alert(anotherFactorial(4)); // 24 成功 

```

貌似用arguments.callee很好的解决了递归问题，但是在严格模式下，并不能访问arguments.callee！！！此时用命名函数表达式可以解决这个问题。
``` javascript
var factorial = (function f(num) {
    if(num < 1) {
        return 1;
    } else {
        return num * f(num - 1);
    }
}); 

var anoterFactorial = factorial;
factorial = null;
alert(anoterFactorial(4)); // 24

// 对上边的代码进行类似英语阅读理解中的长句分析……
// var factorial = (); ！！！
// 本来function f(num) {...} 是声明了一个名叫f(num)的函数，但是把它放进了()中！！！
// (function f(num) {...}) 这样，这就是一个表达式！！！ 这是一个什么表达式呢？函数表达式！！！而且这个函数表达式是有名字的，叫f(num)！！！
// 所以堆内存中有一个叫做f(num)的函数，anotherFactorail就指向它
// 上边一句的解释貌似不对。应该是当 var factorial = ();时在内存中创建了一个命名函数，factorial指向了它，之后anotherFactorial也指向了它。但是f(num)这个名字并不是在栈内存中声明的一个值，f()并不能指向它？？
alert(f(4)); // 错误！！！ f is not defined
// 这样就用 命名函数表达式 解决递归问题
```


函数表达式定义的函数怎样才能运行？可以让一个指针指向它，或者创建就立即执行。要不像上边的f(num)，在全局下就顶是没有定义。

### 2. 闭包

> 闭包是指有权访问另一个函数作用域中的变量的函数

再进行下长句分析，闭包是函数。

创建闭包的常见方式：在一个函数内部创建另一个函数。

理解闭包就要理解第四章中的**执行环境及作用域**当中的一系列概念。

最基本的概念：**执行环境**，所有“活动”都有其执行环境。最外层的执行环境就叫做**全局执行环境**。
每个执行环境都有之关联的**变量对象**，其中保存着在执行环境中定义的变量和函数。浏览器的全局执行环境的变量对象就是**window对象**。
每个函数也有自己的执行环境，它的**变量对象**也叫做**活动对象**？？
书中说是当代码在一个执行环境中执行时，会创建变量对象的一个**作用域链**，其实感觉应该表达为创建一个**该执行环境可以访问到的所有变量对象的一个作用域链**，该链就把所有变量对象链起来了。（注意这儿是变量对象，是自身及其他执行环境的变量对象，而不是说某个变量、某个函数）

书中P179值得多看几遍。

可以把作用域链看做一个栈，其中保存的都是变量对象。先压哪些变量对象入栈、再压哪些变量对象入栈。

没有闭包，只有一个函数，执行到函数时，对于该函数的作用域链，先压该函数的活动对象（变量对象），再压全局的变量对象。在函数中访问某个变量时，就沿着这个链一步步去查。若是在该函数的活动对象上找见了，就不会再去全局的变量对象上找了。

若有闭包。（闭包 有人理解为 必须是在一个函数内部，并且访问了其包含函数的变量；但按照这书上的定义，闭包有权访问另一个函数上的变量就可。具体见[这里](https://www.zhihu.com/question/20479109)的讨论）对于包含函数和上边的解释一样。对于闭包，闭包的作用域链，先压闭包的活动对象，再压包含函数的变量对象，最后压全局的变量对象。

看几个例子。没有闭包的情况。
``` javascript
// 情况1
var name = "Window";

function getName() {
    alert(name);
}

getName(); // Window

// 情况2.1
var name = "Window";

function getName() {
    alert(name);
    var name;
}

getName(); // undefined

// 情况2.2
var name = "Window";

function getName() {
    alert(name); 
    var name = "Local";
}

getName(); // undefined

// 情况3
var name = "Window";

function getName() {
    var name = "Local";
    alert(name);
}
```
注意在一个执行环境中有了var xxx，那么xxx就已经挂在该执行环境的变量对象上了。要是你在该执行环境中var xxx 之前使用xxx，实际上相当于该执行环境中已经声明了xxx，只不过是还未赋值，所以是undefined。

<img src="..\JS高程（七）\case1.png" width="50%" height="50%">
<img src="..\JS高程（七）\case2.png" width="50%" height="50%">
<img src="..\JS高程（七）\case3.png" width="50%" height="50%">

看几个例子。有闭包。（我理解的函数中的函数？）
``` javascript
// 情况4 有闭包
// 注意 这里都是getName后两个()！！！先执行getName再执行其返回的函数
var name = "Window";

function getName() {
    alert(name); 
    return function() {
        alert(name);
    }
}

getName()(); // Window Window

// 情况5 有闭包
var name = "Window";

function getName() {
    alert(name);
    return function() {
        alert(name);
    }
    var name = "Local";
}

getName()(); // undefined undefined

// 情况6 有闭包
var name = "Window";

function getName() {
    alert(name);
    var name = "Local";
    return function() {
        alert(name);
    }
}

getName()(); // undefined Local

// 情况7 有闭包
var name = "Window";

function getName() {
    var name = "Local";
    alert(name);
    return function() {
        alert(name);
    }
}

getName()(); // Local Local

// 情况8 有闭包
var name = "Window";

function getName() {
    alert(name);
    return function() {
        alert(name);
        var name = "Local-Local";
    }
}

getName()(); // Window undefined

// 情况9 有闭包
var name = "Window";

function getName() {
    alert(name);
    return function() {
        var name = "Local-Local";
        alert(name);
    }
}

getName()(); // Window Local-Local

// 补充一种 和 本质和情况8一样
var name = "Window";

function getName() {
    alert(name);
    return function(name) {
        alert(name);
    }
}

getName()(); // Window undefined 
// 形参的name也挂在了匿名函数的变量对象上了。

```

<img src="..\JS高程（七）\case4.png" width="50%" height="50%">
<img src="..\JS高程（七）\case5_case6.png" width="50%" height="50%">
<img src="..\JS高程（七）\case6_case7.png" width="50%" height="50%">
<img src="..\JS高程（七）\case8.png" width="50%" height="50%">
<img src="..\JS高程（七）\case9.png" width="50%" height="50%">

为什么会想这么多。因为今天看到一个题目：
``` javascript
var z = 10;
function foo() {
    console.log(z);
}

(function(funArg){
    var z = 20;
    funArg();
})(foo); // 10
```
开始想成了外边是一个匿名函数，并且立即执行了，把foo传进去，错误的把funArg()当成了匿名函数中存在的一个闭包……以为funArg()先去自身的变量对象上找z，没有；再去其包含函数(function(){...})上找z，找到了，是20，那么就打印出20……
这个问题还不是说什么情况下才是闭包？而是说**函数名只是个指针**。首先声明了一个foo函数，该函数的变量对象上啥也没，但它能访问到全局执行环境的变量对象上的z，是10。而执行匿名函数时，只是相当于 var funArg = foo; funArg也指向了该函数，它并不是外边匿名函数的闭包。实际上如下图所示：

<img src="..\JS高程（七）\case0.1.png" width="50%" height="50%">

若是像这样的话：
``` javascript
var z = 10;
(function(){
    var z = 20;
    (function() {
        console.log(z)
    })();
})(); // 20
```
有两个匿名函数，并且都立即执行了。内部的匿名函数的作用域链0号指向自己的活动对象（无z），1号指向外部匿名函数的活动对象（有z），2号指向全局的变量对象（有z 但找不到这儿了）。这儿的匿名函数就是闭包。

<img src="..\JS高程（七）\case0.2.png" width="50%" height="50%">


#### 2.1 闭包与变量
闭包可以访问到的变量都是存在它的作用域链链起来的各个**变量对象**上，并不是某个变量或者某个函数。
``` javascript
// 预想的是创建一个函数数组，每一个都返回其在数组中的索引
// 这里匿名函数就是闭包，并且访问了其包含函数上的变量i
// 但这个有问题。循环中创建的所有匿名函数访问到的i都只是同一个i
// 所以在循环过程中i在变，但i每变一次，已经创建好的匿名函数所访问到的i也就变了，
// 最终i就是10
function createFunctions() {
    var result = new Array();

    for (var i = 0; i < 10; i++) {
        result[i] = function() {
            return i;
        };
    }

    return result;
}

var functions = createFunctions();

functions[0](); // 10
functions[1](); // 10
functions[2](); // 10
// ... 10
functions[9](); // 10
```

<img src="..\JS高程（七）\notexpect.jpg" width="50%" height="50%">

这就是使用闭包访问变量时要注意的地方。可能和自己想要的结果不同。书中的解决方法。
``` javascript
// 先创建了一个带参的匿名函数，并马上执行了，传入了i。我理解这个也是一个闭包，只是没有访问其包含函数的变量。
// 在这个匿名函数内，返回了一个匿名函数，所以这里边的匿名函数也是一个闭包，只不过访问到了它的包含函数上的变量num。（num在外层匿名函数的变量对象上。）
function createFunctions() {
    var result = new Array();

    for (var i = 0; i < 10; i++) {
        result[i] = function(num) {
            return function() {
                return num;
            }
        }(i);
    }

    return result;
}

var functions = createFunctions();

functions[0](); // 0
functions[1](); // 1
functions[2](); // 2
// ... // 
functions[9](); // 9
```

<img src="..\JS高程（七）\expect.jpg" width="50%" height="50%">

[这里](https://www.zhihu.com/question/20479109)大家讨论上边的解法是不是为了闭包而闭包。不用里层的匿名函数，直接返回num就好了。但是我认为，这只是为了统一例子内容。上边两个的result都是存的是函数，而这里的result存的是数字。
``` javascript
// 我认为这个匿名函数，也是闭包，虽然没有访问到包含函数中的变量。
function createFunctions() {
    var result = new Array();

    for (var i = 0; i < 10; i++) {
        result[i] = function(num){
            return num;
        }(i);
    }

    return result;
}

var results = createFunctions();

result; // [0,1,2,3,4,5,6,7,8,9]
```


#### 2.2 闭包中this对象
> 匿名函数的执行环境具有全局性，因此其this对象通常指向window。

其实不光是匿名函数，在全局作用域下定义的函数，在其中使用this，也指的是window。应该考虑到对象时才有意思。在对象中定义函数，在这个函数中使用this，那指的就是这个对象的实例。要是在这个**对象的函数中还有匿名函数，或者命名函数表达式（即有函数表达式）**？然后再在函数表达式中使用this，就是window而不是对象的实例。

``` javascript
// 情况1 没有闭包 全局作用域下定义的函数 使用this也是window对象
var name = "Window";

function getName() {
    var name = "Local";
    alert(this.name); // Window
}

// 情况2 有闭包 对象的方法中的函数 匿名函数方式
var name = "The Window";

var object = {
    name: "My Object",

    getNameFunc: function() {
        return function() {
            return this.name;
        };
    }
};

// object.getNameFunc()是一个函数，再加() 就是执行了这个函数
alert(object.getNameFunc()()); // The Window

// 情况3 有闭包 对象的方法中的函数 命名函数表达式
var name = "The Window";

var object = {
    name: "My Object",

    getNameFunc: function() {
        return (function f() {
            return this.name;
        });
    }
};

alert(object.getNameFunc()()); // The Window
```

这是因为内部函数表达式上的变量对象上已经有了自己的this和arguments，不会再往上找其包含函数的变量对象的this了。

若是想要在闭包中使用包含函数的this：
``` javascript
var name = "The Window";

var object = {
    name: "My Object",

    getNameFunc: function() {
        // 注意，这里的this就是getNameFunc变量对象上的this对象
        // 赋值给that that其实就指向了object。
        // 对象名 只是个指针！！！
        var that = this;
        return function() {
            return that.name;
        };
    }
};

alert(object.getNameFunc()()); // My Object
```

这种方式之后很常见。刚看了看Vue的例子，里边就有这种使用。
``` 
new Vue() {
    el:xx,
    data:{
        xx:xx;
    },
    methods:{
        getAnswer: function () {
            // 虽然这里的this 在Vue中已经被处理过了，但这里赋值给vm意思和上边的差不多
            var vm = this
            if (this.question.indexOf('?') === -1) {
                vm.answer = 'Questions usually contain a question mark. ;-)'
                return
            }
            vm.answer = 'Thinking...'
            axios.get('https://yesno.wtf/api')
                .then(function (response) {
                    vm.answer = _.capitalize(response.data.answer)
                })
                .catch(function (error) {
                    vm.answer = 'Error! Could not reach the API. ' + error
                }
    }
}
```

书中最后一个例子挺有意思。
``` javascript
var name = "The Window";

var object = {
    name: "My Object",

    getName: function() {
        return this.name;
    }
};

object.getName(); // My Objcet
(object.getName)(); // My Object
(object.getName = object.getName)(); // The Window
```
前两个好理解。注意要把函数名当做是指针！！！

第三个要注意的是括号括起来()是一个表达式，一个赋值表达式，将object.getName(是个指针)，赋值给了object.getName(也是个指针)，最后这个表达式会返回一个函数，就是后边object.getName所指向的函数！！！（就相当于 var a; 控制台返回undefined，然后 a = 4; 控制台返回4）再跟着使用()就是调用函数，就等于是在全局直接调用了这个函数。所以this是window。

这样画图应该不太对？栈内存应该在一块儿。object用到了它自己的一块。这样画图更清晰一点。
<img src="..\JS高程（七）\bibaothis.jpg" width="50%" height="50%">

### 3. 使用函数表达式中匿名函数可以模仿块儿级作用域

**块儿级作用域**，也叫作**私有作用域**。比如一个for循环，其他语言会把在其中定义的变量只用在for循环内，循环结束后这些变量也就被销毁了。但是JavaScript中并没有这样的私有作用域。但是可以用匿名函数模拟私有作用域。

定义一个匿名函数，并且立即执行。
``` javascript
(function() {
    // 这里是私有作用域
})();

// 这样是不行的，会认为function是关键字，声明一个函数，但没有跟函数名，会产生错误
function() {

}();
```

> 这种技术经常在全局作用域中被用在函数外部，从而限制向全局作用域中添加过多的变量和函数。一般来说，我们都应该尽量少向全局作用域中添加变量和函数。


### 4. 私有变量

JS没有**私有成员**？？ 
JS**对象属性是公有的**？？
怎样理解？私有成员说的是什么呢？对象属性，对象的属性？

JS中有**私有变量**的概念。私有变量是在函数中定义的变量，所谓私有，是指不能在函数外部访问这些变量。私有变量包括：**函数的参数**、**局部变量**、**在函数内部定义的其他函数**。

想要在函数外访问到这些私有变量，即用一些**公有方法**，访问私有变量，这样的公有方法被称作**特权方法**。

可以使用**函数表达式**创建特权方法。

#### 4.1 法一：在构造函数中使用匿名函数，闭包，访问私有变量
``` javascript
// name 是一个私有变量，注意这里只有一个name，就是Person函数的参数
// getName中的name很好理解。
// setName中的name也是构造函数的参数。
// setName和getName中的name是一回事。都是在闭包中访问包含函数上的变量。
// 先在自己的活动对象上找，没有，然后再去包含函数的活动对象上找。找到了参数name。
function Person(name) {
    this.getName = function() {
        return name;
    };
    this.setName = function(value) {
        name = value;
    }
}

var person = new Person("DaShuaiBi");
alert(person.getName()); // DaShuaiBi
person.setName("HeiHeiHei");
alert(person.getName()); // HeiHeiHei

// 继续上边的解释，如果在getName和setName的包含函数上再定义一个局部变量
// 也叫做name的话，那闭包中找的name应该是局部变量的name而不是参数上的name！！！
function Person(name) {
    var name = "局部变量";
    this.getName = function() {
        return name;
    };
    this.setName = function(value) {
        name = value;
    }
}

var person = new Person("DaShuaiBi" + "参数进来的");
alert(person.getName()); // 局部变量 （注意！！！）
person.setName("HeiHeiHei");
alert(person.getName()); // HeiHeiHei
```

缺点：和之前使用构造函数创建对象的缺点类似。每个实例的方法都是不一样的，浪费空间。
``` javascript
var person2 = new Person("ErShuai");

person.getName == person2.getName; // false
```

#### 4.2 法二：利用匿名函数创建私有作用域，在私有作用域定义私有变量，在其中再创建函数，这些函数就是特权方法了。
``` javascript
// name 就是私有变量（外部匿名函数的），在这里逻辑上是Person的属性！！！！
(function() {
    var name = "";
    // 注意这里没有用 function Person(value) {name = value}
    // 因为函数声明只能创建局部函数！！！
    // 没有使用var的变量初始化，将创建全局变量！！！
    Person = function(value) {
        name = value;
    };

    Person.prototype.getName = function() {
        return name;
    };

    Person.prototype.setName = function(value) {
        name = value;
    }
})();

var person1 = new Person("DaShuai");
alert(person1.getName()); // DaShuai
person1.setName("HeiHeiHei");  
alert(person1.getName()); // HeiHeiHei
```

优点：解决了使用构造函数，在闭包中访问私有变量时，每个实例方法都是独立的。
``` javascript
var person2 = new Person("ErShuai");
alert(person1.getName == person2.getName); // true
```

缺点：每个实例都没有自己的私有变量。就类似使用原型模式创建对象时的问题。但是可惜的是，那时在实例中可以**覆盖**掉原型上的同名属性。这里不行了。
``` javascript
alert(person2.getName()); // ErShuai
alert(person1.getName()); // ErShuai
```

问，可以像之前使用**组合使用构造函数和原型模式创建对象**那样，在这里创建特权方法吗？貌似是不行的，私有变量，特权方法，和之前的对象还是很不一样的。比如
``` javascript
(function() {
    Person = function(name) {
    };

    Person.prototype.getName = function() {
        return name;
    };

    Person.prototype.setName = function(value) {
        name = value;
    }
})();

// 构造函数中name是私有变量了，但getName和setName并不是Person函数的闭包，不能访问name
// 而且getName和setName中的name都算是全局中的变量了！！！没有使用var，在其作用域链上也找不到name。
// 最重要的，外部的匿名函数虽说创建了一个私有作用域，但根本就没用……
```

这样呢？
``` javascript
Person = function(value) {
    var name = value;

    Person.prototype.getName = function() {
        return name;
    };

    Person.prototype.setName = function(value) {
        name = value;
    }

};


var person1 = new Person("DaShuai"); 
alert(person1.getName()); // DaShuai
person1.setName("HeiHeiHei"); 
alert(person1.getName()); // HeiHeiHei

var person2 = new Person("ErShuai");
alert(person1.getName == person2.getName); // true 这里符合期望 是在原型上创建的方法
alert(person2.getName()); // ErShuai 
alert(person1.getName()); // ErShuai ！！！注意，这里就不符合期望了，
//这个name是在Person这个函数的活动对象上局部变量，这里注意不应该说是person1和person2的name，而是说getName和setName是Person中的闭包，它们沿着作用域链去找name，找到的都是同一个！！！
```


书中还有两部分讲为**单例**创建私有变量和特权方法的**模块模式**和**增强的模块儿模式**。但不知道具体的使用方式、场景？？？

还有整个**私有变量**和**特权方法**这块儿感觉比较乱……

2017.03.16