title: Android还踢球app总结（三）
date: 2017-01-18 15:17:13
tags: Android
---
这一篇介绍一下用到的开发模式。做这款软件时对于Android开发的了解仅仅只是看了郭霖大神的《第一行代码》，对于开发模式，或者说软件架构什么的都不了解。不过之前帮一个老师做类似校园BBS时，听他介绍过MVC，自己也查过一些关于MVC的资料。其目的是为了让各个模块儿互相更独立，高内聚低耦合。而**M(Model)模型**、**V(View)视图**、**C(Controller)控制器**，应该是**数据访问**、**界面展示**、**业务逻辑**三者的对应，正是一个软件不可少的东西。

### 1. 预备知识
在敲代码之前，是先做了一些功能模块的划分，再做了UI，然后就在想用什么方式组织代码，可以提高效率。同时也在想如果是在公司做的话，会用什么方式分配这些不同模块、不同功能的代码任务。之后就在网上查到了应用于Android的MVP模式。它其实是从MVC模式演化而来。
> 在Android中Activity或者Fragment是用来做界面展示的，但是其生命周期对于整个软件是很关键的，所以会将一些业务逻辑写在Activity中，这样做很直观，但是其代价就是Activity会越来越臃肿……

<!--more-->

Android的MVP中**V(View)**就是Activity或者Fragment，**P(Presenter)**相当于MVC中的控制器，**M(Model)**就是MVC中的Model，但**M(Model)**和**V(View)**是完全解耦的，它们之间要打交道的话都要通过**P(Presenter)**。MVP和MVC的区别，一个是M和V更加独立，另一个是将MVP三者都先抽象成了接口，再用具体的类是实现。（第二点，感觉MVC也可以这样做？？或者这种东西其实不是很死板的，适合的才是最好的。）

看了很多资料，直到看到下面这张图，整个思路才算理清。(但是找不到真正的出处是哪儿的了……)

<img src="..\Android还踢球app总结（三）\login-classes.png" width="100%" height="100%">

在上图中，首先是有*LoginView*、*LoginPresenter*、*LoginInteractor*三个接口，对应上边的**V**、**P**、**M**。V获得账号密码，传递给P，P再传递给M，M验证之后通过*OnLoginFinishedListener*接口告知P结果，最后P再根据结果告诉V做什么。

LoginActiviy类实现了*LoginView*接口、LoginPresenterImp类实现了*LoginPresenter*接口和*OnLoginFinishedListener*接口、LoginInteractor类实现了*LoginIteractor*接口。LoginActivity中持有LoginPresenter的引用(其实是LoginPresenterImp)，而LoginPresenterImp中持有LoginView(其实是LoginActivity)和LoginInteractor(其实是LoginInteractorImp)的引用，这样就能实现信息的传递，而LoginInteractor(其实是LoginInteractorImp)中的消息是通过监听器传给LoginPresenterImp的。

再介绍下UML类图中的关系，三角形箭头虚线箭身是具体的类实现接口，实线箭头是关联，虚线箭头是依赖。

<img src="..\Android还踢球app总结（三）\class diagram relations.png" >

[这篇文章](http://www.cnblogs.com/liuzhang/archive/2013/03/17/2964095.html)有介绍关联和依赖之间的区别。简单点说就是以依赖关系更弱，关联关系更强。像上图中的LoginPresenterImp中持有LoginInteractor的引用，两者关系强，是关联；而LoginInteractor只是其中一个方法用到了OnLoginFinishedListener做参数，两者关系弱，是依赖。

### 2. 还踢球app
本软件就是完全按照上边那张图进行MVP的使用。还有一个问题，是应该按照不同的功能模块儿打包还是按照MVP这三者进行打包。网上两种方式都有使用者。我先按照功能模块建了包，然后再在里边按照MVP建了包，这样虽然层级深了，但感觉组织性更强了。

<img src="..\Android还踢球app总结（三）\module package.PNG" >

在找组织模块中，有一个entity包，还有三个子功能包，其中每个子功能包中都有三个包：Model、View和Presenter。本来觉得Java Bean 实体类应该算在Model中，但后来想比如entity中的Post类，有一些属性还有get、set方法，这些在每个子功能中都会用到，不知道该放到哪个里边。所以还不如这样，将所有的实体类放到一个包中，是其他类公用的，至于子功能中的Model就是单单做数据的访问，比如查询、添加等等。

<img src="..\Android还踢球app总结（三）\findallgames pakage.PNG" >

### 3. 找组织功能模块
