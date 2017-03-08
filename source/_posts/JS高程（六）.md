title: JS高程（六）
date: 2017-03-05 17:15:14
tags: js基础
---
## 第6章 面向对象的程序设计

JS与传统的面向对象（Object-Oriented）的语言不同，它没有类的概念。

可以把JS的对象看作是散列表：无非就是一组名值对，其中值可以是**数据**或**函数**。

**每个对象**都是基于一个**引用类型**创建的，这个引用类型可以是原生引用类型（Object、Array、Date、RegExp、Function、基本包装类型（Boolean、Number、String）、Math），也可以是用户自定义的类型。

<!--more-->

两种简单的**创建自定义对象**的方法：

* **Object构造函数法**
``` javascript
var king = new Object();
king.name = "DaShuaiBi";
king.job = "playAndPlay";
king.age = 27;
king.say = function() {
    alert("I\'m the king.");
};
```

* **对象字面量法**
``` javascript
// 逗号隔开不同的属性 注意方法的写法
var king = {
    name: "DaShuaiBi",
    job: "playAndPlay",
    age: 27,
    say: function() {
        alert("I'm the king.");
    }
}
```

### 6.1 对象的属性

JS中对象的属性（property）有两种类型：**数据属性**和**访问器属性**，这两种属性都有自己的**特性**（attribute）。可以设置、更改、读取这些特性。

* 数据属性
  4个特性：[[Configurable]]（表示能否通过**delete**删除属性）、[[Enumerable]]（表示能否通过for-in循环返回属性）、[[Writable]]（表示能否**修改属性的值**）、[[Value]]
 
 在对象中定义了某种属性，那么这种属性就是数据属性了？？

* 访问器属性
  4个特性：[[Configurable]]、[[Enumerable]]、[[Get]]、[[Set]]
 
 访问器属性不能直接定义，必须使用Object.defineProperty()来定义。

三个方法
* **Object.defineProperty()** 定义、修改属性
 三个参数：属性所在对象、属性名、<span id= "des">描述符对象（即属性特性的描述，属性特性名：xx）</span>
    
    ``` javascript
    var person = {};
    // 设置了数据属性name
    Object.defineProperty(person, "name", {
        // 设置person的name属性不可修改
        writable: false,
        value: "DaShuaiBi"
    });
    alert(person.name); // DaShuaiBi
    person.name = "HeiHeiHei";
    // 还是DaShuaiBi
    alert(person.name); // "DaShuaiBi"
    ```

    ``` javascript
    // 这两个_year和edition属性 是数据属性 
    // 这种形式，其属性特性中的configurable、enumerable和writable都默认是true
    var book = {
        _year: 2004,
        edition: 1
    };
    // 这个year是 访问器属性，设置了getter和setter方法
    // 使用访问器属性常见的方法：设置一个属性（访问器属性）的值会导致其他属性（数据属性）发生变化
    Object.defineProperty(book, "year", {
        get: function(){
            return this._year;
        },
        set: function(newValue) {
            if (newValue > 2004) {
                this._year = newValue;
                this.edition += newValue - 2004;
            } 
        }
    });
    alert(book._year); // 2004
    alert(book.edition); // 1
    book.year = 2005;
    // 发现可以修改
    alert(book._year); // 2005
    alert(book.edition); // 2
    ```

 **注意**，在调用Object.defineProperty()方法时，如果不指定，configurable、enumerable和writable特性的默认值都是false；而在之前使用Object构造函数和对象字面量方法创建的对象，其属性的这几个特性都默认为true。(上边第二段代码中的book的_year和edition就是通过对象字面量定义的属性)

* **Object.defineProperties()** 定义多个属性
 两个参数：要添加或修改其属性的对象、一个对象（与第一个参数对象要添加或修改的属性一一对应，即{属性名1: {属性特姓名1: xx}, 属性名2: {属性特性名: xx}, 属性名3: { {属性特性名1: xx}, {属性特姓名2: xx}}）

 注意，这是上边**注意**的一个例子。

    ``` javascript
    var book = {};
    // 用这种方法设置了数据属性_year和edition，还有访问器属性year
    // 但是与上边的方法不同。这里属性特性configurable、enumerable和writable都默认是false
    Object.defineProperties(book, {
        _year: {
            value: 2004;
        },
        edition: {
            value: 1;
        },  

        year: {
            get: function() {
                return this._year;
            },
            set: function(newValue) {
                if (newValue > 2004) {
                    this._year = newValue;
                    this.edition += newValue - 2004;
                }
            }
        }
    });
    alert(book._year); // 2004
    alert(book.edition); // 1
    book.year = 2005;
    // 发现并不能更改_year和edition的值
    alert(book._year); // 2004
    alert(book.edition); // 1
    ```

* **Object.getOwnPropertyDescriptor()** 读取属性的特性
 两个参数：属性所在对象、要读取其描述符的特性名称；返回一个对象，包含相应的属性特性。


### 6.2 创建对象
《JS高级程序设计》中可以说一共提供了9种**创建对象**的方法。为什么会有这么多的方法？要让JS更“面向对象”，就要满足一些要求。开始的方法不能很好的满足一定的要求，就会有新的方法出现。

总结这些要求大概有：
* 1.代码复用
* 2.封装性、继承性？？、多态性？？
* 3.对象识别，即可以方便的知道实例是什么自定义类型 xxx instanceof XXX
* 4.实例间要有**不同**的**基本值的属性**
* 5.实例间要有**不同**的**引用类型值的属性**，除Function之外 
* 6.实例间要有**相同（共享）**的函数（方法），空间复用？

#### Object构造函数法、对象字面量法
本篇最开始就介绍了这两种方法。
缺点：不满足第1点要求，创建对个实例时会产生大量重复代码。

#### &rarr;&rarr; 工厂模式 &larr;&larr;
``` javascript
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        alert(o.name);
    };
    return o;
}
// 没有用 new ，只是调用函数
var person1 = createPerson("DaShuaiBi", 27, "playAndPlay");
var person2 = createPerson("HeiHeiHei", 18, "heixiuheixiu");
```

优点：解决了Object构造函数法和对象字面量方法的不足之处，代码可以复用。

缺点：不满足第3点要求（对象识别），不能知道person1和person2是什么样的自定义类型；不满足第6点，实例间的函数是不同的，（函数也是对象），占用空间。

#### &rarr;&rarr; 构造函数模式 &larr;&larr;
``` javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        alert(this.name);
    }
}
// 使用了new关键字
var person1 = new Person("DaShuaiBi", 27, "playAndPlay");
var person2 = new Person("HeiHeiHei", 18, "heixiuheixiu");
```

注意：Person的首字母是大写（惯例）

优点：解决了工厂模式的不足之一，可以进行对象识别。
``` javascript
alert(person1 instanceof Object); // true
alert(person1 instanceof Person); // true
alert(person2 instanceof Object); // true
alert(person2 instanceof Person); // true
```

<span id="construct_fault">缺点：不满足第6点，实例间的函数是不同的，（函数也是对象），占用空间。</span>
``` javascript
person1.sayName == person2.sayName; // false
// 不能写成
person1.sayName() == person2.sayName(); // 先运行函数，再返回true（都是function？？ 不对，因为person1的sayName()方法没有返回值，默认是undefined）
```


#### 构造函数模式的改进
``` javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}
// 把函数定义转移到构造函数外部
function sayName() {
    alert(this.name);
}

var person1 = new Person("DaShuaiBi", 27, "playAndPlay");
var person2 = new Person("HeiHeiHei", 18, "heixiuheixiu");
```

优点：解决了构造函数模式的缺点，实例间的函数是相同的。
``` javascript
person1.sayName == person2.sayName; // true
```

缺点：应是实例的方法sayName现在成了全局函数，而且要是自定义类型的方法很多时，就得定义很多个全局函数。不满足第2点中的封装性。

#### &rarr;&rarr; 原型模式 &larr;&larr;
每个**函数**都有一个**prototype属性**，这个属性是个指针，指向一个对象，这个对象包含可以由特定类型的**所有实例共享**的属性和方法。

prototype是通过调用**构造函数**而创建的那个**对象实例**的**原型对象**。（prototype是对象）

``` javascript
function Person() {

}

Person.prototype.name = "DaShuaiBi";
Person.prototype.age = 27;
Person.prototype.job = "playAndPlay";
Person.prototype.sayName = function() {
    alert(this.name);
};

var person1 = new Person();
var person2 = new Person();

person2.name = "HeiHeiHei";
person2.age = 18;
person2.job = "heixiuheixiu";
```

优点：解决了构造函数模式的不足，实例的函数是同一个函数。
``` javascirpt
person1.sayName == person2.sayName; // true
```

缺点：Person.prototype.代码重复太多；不满足第4、5点要求。由于原型对象上所有属性都是实例对象所共享的，结果默认情况下实例的基本值的属性和引用类型值的属性都一样。虽然可以通过在实例上添加同名属性来**屏蔽**原型对象上的同名属性，但当只是**简单的修改实例上的引用类型值的属性**时，就比较难受了。

#### 更简单的原型模式
``` javascript
function Person() {

}
// 用一个包含所有属性和方法的 对象字面量 来重写整个原型对象
// 注意这儿的constructor 之后再介绍
Person.prototype = {
    constructor: Person,
    name: "DaShuaiBi",
    age: 27,
    job: "playAndPlay",
    sayName: function() {
        alert(this.name);
    }
};
```

优点：解决了Person.prototype代码复用问题

<span id="proto_fault">缺点：原型模式的真正缺点还没有解决。</span>
``` javascript
function Person() {

}

Person.prototype = {
    constructor: Person,
    name: "DaShuaiBi",
    age: 27,
    job: "playAndPlay",
    // 引用类型值的属性 
    friends: ["ErShuai", "SanShuai"],
    sayName: function() {
        alert(this.name);
    }
};

var person1 = new Person();
var person2 = new Person();
// 假如没有更改person2的属性值
//person2.name = "HeiHeiHei";
//person2.age = 18;
//person2.job = "heixiuheixiu";
//person2.friends = ["haha","jiji"];

// 简单的修改person1的引用类型值的属性friends
person1.friends.push("SiShuai");
alert(person1.friends); // ErShuai,SanShuai,SiShuai
alert(person2.friends); // ErShuai,SanShuai,SiShuai !!! 注意此时并不想更改person2的friends，ErShuai,SanShuai是person1和person2共同的朋友，而SiShuai并不是。
alert(person1.friends == person2.friends); // true
```

#### &hearts;&hearts;&hearts; &rarr;&rarr; 组合使用构造函数模式和原型模式 &larr;&larr; &hearts;&hearts;&hearts;
``` javascript
// 构造函数用于定义实例的属性
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ["ErShuai", "SanShuai"];
}
// 原型模式用于定义方法和共享的属性
Person.prototype = {
    constructor: Person,
    sayName: function() {
        alert(this.name);
    }
}

var person1 = new Person("DaShuaiBi", 27, "playAndPlay");
var person2 = new Person("HeiHeiHei", 18, "heixiuheixiu");
```

优点：结合了构造函数模式和原型模式的优点。每个实例都有自己的一份**实例属性的副本**，但同时又**共享着对方法的引用**，最大限度地节省了内存。
解决了原型模式的不足。（使用最广泛、认同度最高）
``` javascript
// 因为两个person中的属性name、age、job、friends在堆内存中两个不同的堆上。
// 两个person中friends更是在另两个堆上。
// 对象和对象的属性在内存中怎样表示？？？ 即怎样知道person1的name和age都在person1上，person1的friends在person1上同时又是一个新的堆内存上的对象？？？
person1.friends.push("SiShuai");
alert(person1.friends); // ErShuai,SanShuai,SiShuai
alert(person2.friends); // ErShuai,SanShuai
alert(person1.friends == person2.friends); // false
```

缺点：实例的不同属性（构造函数）、共享方法（原型对象）合起来才算是创建对象的方法。缺一点点封装性。

#### &hearts;&hearts;&hearts; &rarr;&rarr; 动态原型模式 &larr;&larr; &hearts;&hearts;&hearts;
``` javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    // 把在原型对象上添加共享方法的代码写进构造函数中，并有个判断
    if (typeof this.sayName != "function") {
        Person.prototype.sayName = function() {
            alert(this.name);
        }
    }
}

var person1 = new Person("DaShuaiBi", 27, "playAndPlay");
var person2 = new Person("HeiHeiHei", 18, "heixiuheixiu");
```

优点：if(){}代码块只会在初次调用构造函数时（生成person1时）才会执行。在生成person2时就不用执行了！JS中创建对象**非常完美**的方法。

#### &rarr;&rarr; 寄生构造函数模式 &larr;&larr;
不太理解。函数中有return一个对象，创建对象时还使用new关键字？？？
#### &rarr;&rarr; 稳妥构造函数模式 &larr;&larr;
不太理解。虽说是xx构造函数模式，但函数中有return一个对象，创建对象时没有使用new关键字，更像是xx工厂模式？？？

### 6.3 继承
这部分和上边创建对象有很大联系。一些模式之间的代码结构很相似。

创建对象的方法：Object构造函数、对象字面量、工厂模式、构造函数模式、（构造函数模式的改进）、原型模式、（更简单的形式原型模式）、组合模式（构造函数+原型模式）、动态原型模式、寄生构造函数模式、稳妥构造函数模式。

继承方法：原型链继承、借用构造函数继承、组合继承（构造函数+原型链）、原型式继承、寄生式继承（原型式plus）、寄生组合式继承（寄生式+构造函数+原型链）

#### &rarr;&rarr; 原型链继承 &larr;&larr;

关键语句 SubType.prototype = new SuperType();

``` javascript
function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function() {
    return this.property;
};

function SubType() {
    this.subproperty = false;
}
// 将SuperType的实例赋给SubType的原型对象 实现继承
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function() {
    return this.subproperty;
};

var instance = new SubType();
// 能使用“父类”SuperType原型对象上的方法
alert(instance.getSuperValue()); // true

// 注意！！！
SuperType.prototype.constructor; // function SuperType() {...}

SubType.prototype.constructor; // function SuperType() {...} 也是SupserType！！！ 本来是SubType，但将new SuperType()赋给了SubType.prototype。书中说是就断了，没有了，但实际上是跟着SuperType.prototype的步伐指向了SuperType
instance.constructor; // function SuperType() {...}
```

<span id="proto_inherit">问题1：与[使用原型模式创建对象](#proto_fault)时的问题类似</span>
``` javascript
function SuperType() {
    this.colors = ["red", "blue", "green"];
}

function SubType(){

}

// 原型链继承
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors); // red,blue,green,black

var instance2 = new SubType();
alert(instance2.colors); // red,blue,green,black 实际上并不想要black

//因为instance1、instance2都是SubType的实例，而它们的colors属性本来是在SuperType的构造函数中，通过SubType.prototype = new SuperType();实际上是在SubType.prototype上。又是引用类型的值的属性。就和使用原型模式创建对象的问题一样了。
 
```

问题2：在创建子类型的实例时，不能向超类型的构造函数中传递参数。

#### &rarr;&rarr; 借用构造函数继承 &larr;&larr;

关键语句 SuperType.call(this);

``` javascript
function SuperType() {
    this.property = true;   
    this.colors = ["red", "blue", "green"];
    this.sayHi = function() {
        alert("hi");
    };
}

SuperType.prototype.name = "siguoyi";

SuperType.prototype.getSuperValue = function() {
    return this.property;
};

function SubType() {
    // 借用构造函数 在SubType的构造函数中 运行SuperType函数，将其作用域定为SubType的实例
    // 实现继承 “复制”？？？
    SuperType.call(this);
    this.subproperty = false;
}

SubType.prototype.getSubValue = function() {
    return this.subproperty;
};

var instance = new SubType();
alert(instance.subproperty); // false
alert(instance.property); // true
instance.sayHi(); // 弹出hi
alert(instance.getSubValue()); //  false

// 注意1！！！ 并不能使用父类型原型对象上定义的属性、方法
instance.getSuperValue(); // 出错！！！  Uncaught TypeError: instance.getSuperValue is not a function
alert(instance.name); // undefined

// 注意2！！！
SuperType.prototype.constructor; // function SuperType() {...}

SubType.prototype.constructor; // function SubType() {...} 和原型链继承不同
instance.constructor; // function SubType() {...} 和原型链继承不同

```

优点1：解决了原型链继承的问题1。子类型实例有各自的属性副本。
``` javascript
// 比原型链继承好的地方
var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors);

var instance2 = new SubType();
alert(instance2.colors);
```

优点2：解决原型链继承的问题2 可以个超类型的构造函数传递参数。

缺点：与[使用构造函数模式创建对象](#construct_fault)的缺点类似。函数不能复用。
``` javascript
instance1.sayHi == instance2.sayHi // false 父类型上的函数sayHi()并没有复用
instance1.getSubValue == instance2.getSubValue // true 这个不算 这是在子类型原型对象上定义的函数
```

#### &hearts;&hearts;&hearts; &rarr;&rarr; 组合继承 &larr;&larr; &hearts;&hearts;&hearts;
``` javascript
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
    alert(this.name);
};

function SubType(name, age) {
    // 构造函数继承
    SuperType.call(this, name);

    this.age = age;
}

// 原型链继承
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType; // 推荐写法

SubType.prototype.sayAge = function() {
    alert(this.age);
};

var instance1 = new SubType("DaShuaiBi", 27);

// 注意！！！
SuperType.prototype.constructor; // function SuperType() {...}
SubType.prototype.constructor; // function SubType() {...} 改回来了
instance1.constructor; // function SubType() {...} 改回来了
```

优点：结合了原型链继承和借用构造函数继承的优点，消除了两者的缺点。JS中**最常用的继承模式**。
``` javascript
instance1.colors.push("black");
alert(instance1.colors); // red,blue,green,black
instance1.sayName(); // DaShuaiBi
instance1.sayAge(); // 27

var instacne2 = new SubType("HeiHeiHei", 18);
alert(instacne2.colors); // red,blue,green 解决了原型链继承的问题
instacne2.sayName(); // HeiHeiHei
instacne2.sayAge(); // 18

instance1.sayName == instance2.sayName; // true 解决了借用构造函数继承的问题
instance1.sayAge == instance2.sayAge; // true
```

<sapn id="comInherit">缺点：虽然最常用，也是有缺点。会调用超类型（SubType）构造函数两次。第一次：SubType.prototype = new SuperType(); 第二次：SuperType.call(this, name); （更准确的说应该是在实例化一个SubType时（调用SubType的构造函数时，因为这一行代码就在SubType的构造函数里边）） 。</span>

#### &rarr;&rarr; 原型式继承 &larr;&larr;
有两种方式。

第一种：ECMAScript5增加的方法**Object.create()**
（其中属性描述符与[前边的](#des)一样）
``` javascript
// 有两个参数
var person = {
    name: "DaShuaiBi",
    friends: ["ErShuai", "SanShuai"]
};

var anotherPerson = Object.create(person, {
    // 属性描述符 
    name: {
        value: "HeiHeiHei"
    }
});

alert(anotherPerson.name); // "HeiHeiHei"

// 只有一个参数 
var person = {
    name: "DaShuaiBi",
    friends: ["ErShuai", "SanShuai"]
};

var anotherPerson = Object.create(person);
anotherPerson.name = "HeiHeiHei";

// 上面两种写法一模一样
```

第二种 先自己定义一个函数object()
``` javascript
function object(o) {
    function F() {}
    F.prototype = o; // 把o当做是F的原型对象
    return new F();
}

var person = {
    name: "DaShuaiBi",
    friends: ["ErShuai", "SanShuai"]
};

var anotherPerson = object(person);
anotherPerson.name = "HeiHeiHei";

// 注意！！！
// 这种方法 就没有 构造函数 ！！！
person.prototype.constructor; //  错误！！！ 只有 构造函数（函数）才有prototype属性！！！
anotherPerson.prototype.constructor; // 错误！！！

person.constructor; // function Object() {...} 是Object的构造函数
anotherPerson.constructor; // function Object() {...}

person.__proto__; // 找person对象的原型对象 Object {...} 这个东西就是 Object.prototype 而不是Object的构造函数
Object.isPrototypeOf(person); // false
Object.prototype.isPrototypeOf(person); // true

anotherPerson.__proto__; // 注意 ！！！ 找anotherPerson的原型对象 Object {name: "DaShuaiBi", friends: Array[2]} 这个东西就是 person！！！
anotherPerson.__proto__ == person; // true
person.isPrototypeOf(anotherPerson); // true 
Object.prototype.isPrototypeOf(anotherPerson); // true 链起来了
```

优点： **不必兴师动众地创建构造函数**

缺点：当然没有构造函数，不能知道实例是什么“类型”，只是知道实例跟哪个对象很像；与[使用原型模式创建对象](#proto_fault)及[使用原型链继承](#proto_inherit)时的问题一样。
``` javascript
anotherPerson.friends.push("yoyoyo");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "bang";
yetAnotherPerson.friends.push("zero");

alert(person.friedns); // ErShuai,SanShuai,yoyoyo,zero
alert(person.name); // DaShuaiBi
```

原型式继承中，object()函数实际上是对传入其中的对象进行了一次[浅复制](http://www.cnblogs.com/tracylin/p/5346314.html)，浅复制是针对引用类型的值而言的。上边的例子中anotherPerson对person进行了浅复制，所以改变anotherPerson上的值，person上的值也会改变。可是name是基本类型值，所以是真的复制了一个副本出来，而friends是引用类型值，准确的说是浅复制了引用类型（对象）上的引用类型（数组Array）值。

#### &rarr;&rarr; 寄生式继承 &larr;&larr;
寄生式继承感觉是在原型式继承的基础上，又套了一层函数用来对新实例增加一些自己的东西。
``` javascript
// 原型式继承中的函数 虽然 也可以是任何可以返回对象的函数，但不太懂。。暂且理解为与原型式中的一样
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
// 再套一层函数，增加了sayHi方法
function createAnother(original) {
    var clone = object(original);
    clone.sayHi = function() {
        alert("hi");
    };
    return clone;
}

var person = {
    name: "DaShuaiBi",
    friends: ["ErShuai", "SanShuai"]
};

var anotherPerson = createAnother(person);

// 注意！！！ 和原型式继承一样
person.constructor; // function Object() { [native code] }
anotherPerson.constructor; // function Object() { [native code] }

person.isPrototypeOf(anotherPerson); // true
anotherPerson.__proto__; // Object {name: "DaShuaiBi", friends: Array[2]} 即person
anotherPerson.__proto__ == person; // ture

anotherPerson.sayHi(); // hi

// 注意！！
person.sayHi(); // 错误，person上并没有这个方法

var yetAnotherPerson = createAnother(person);

// 注意！！！ 函数不能复用
anotherPerson.sayHi == yetAnotherPerson.sayHi; // false
```

优点：貌似和原型式继承差不多？

缺点：貌似和原型式继承差不多？

书中还写说寄生式继承为对象添加函数时不能复用，就像这里所示；原型式继承也有这个问题啊！！！但没有写。是不是因为一般使用原型式继承时只是简单的复制一下某个对象，而使用寄生式继承时除了复制一下某个对象外还稍微加点方法、属性什么的？？？

#### &hearts;&hearts;&hearts; &rarr;&rarr; 寄生组合式继承 &larr;&larr; &hearts;&hearts;&hearts;

这个的感觉就和**使用动态原型模式创建对象**的地位一样。

**寄生组合式继承是引用类型最理想的继承范式**

原型式继承+寄生式继承+借用构造函数继承+原型链继承 = 寄生组合式继承

``` javascript
// 原型式继承中的 函数 
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

// 寄生式继承中的方式
function inheritPrototype(subType, superType) {
    var prototype = object(superType.prototype);
    prototype.constructor = subType; // 将子类的新的原型对象（通过父类的原型对象创建出来的，但并不是父类的原型对象）上的constructor重新链到子类构造函数上
    subType.prototype = prototype; // 将子类的原型对象设置为通过父类的原型对象创建出来的一个对象
}

function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
    alert(this.name);
};

function SubType(name, age) {
    // 借用构造函数继承 继承了 name、colors
    SuperType.call(this, name);
    this.age = age;
}

// 与组合继承不同之处 通过这个方法实现 原型链继承
// 继承了sayName方法
inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function() {
    alert(this.age);
}

var instance1 = new SubType("DaShuaiBi", 27);

SuperType.prototype.constructor; // function SuperType(name) {...}

// 注意！！！ 之前的原型链继承、组合继承应该都是这样
// 与原型式继承和寄生式继承不同，就确定是person对象了，这里是new的新对象作为子类的原型对象。
SubType.prototype; // SuperType {constructor:SubType(name, age)  ayAge:()  __proto__:Object}
SubType.prototype.constructor; // function SubType(name, age) {...} 改回来了
SubType.prototype == SuperType // false
SubType.prototype == SuperType.prototype // false
SuperType.isPrototypeOf(SubType.prototype) // false
SuperType.prototype.isPrototypeOf(SubType.prototype) // true

instance1.constructor; // function SubType(name, age) {...} 改回来了
instance1.__proto__; // SuperType {constructor:SubType(name, age)  ayAge:()  __proto__:Object} 就是 SuperType.prototype ？？并不是
instance1.__proto__ == SuperType.prototype; // false
SuperType.prototype.isPrototypeOf(instance1); // true

instance1.colors.push("black");
alert(instance1.colors); // red,blue,green,black
instance1.sayName(); // DaShuaiBi
instance1.sayAge(); // 27

var instacne2 = new SubType("HeiHeiHei", 18);
alert(instacne2.colors); // red,blue,green
instacne2.sayName(); // HeiHeiHei
instacne2.sayAge(); // 18
```

优点：解决了[组合继承的问题](#comInherit)，父类型构造函数只调用了一次。

17-03-08