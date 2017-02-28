title: TensorFlow学习笔记（一）
date: 2017-02-23 19:30:06
tags: tensorflow学习
---
按照[官网](https://www.tensorflow.org/)的介绍、教程学习。整理、记录知识点。

这一篇是最开始的一篇。[Getting Started With TensorFlow](https://www.tensorflow.org/get_started/get_started)

现在的TesorFlow的API可以分为两个，一个低级一点的，称为TensorFlow Core，更适合研究人员使用，对所构建的模型有更深层的控制；另一个高级一点的，使用更简单，但还在开发中。学会了更底层的东西，更简答的用法可以很快掌握。这里只记录TensorFlow Core中的知识点。

这篇文章其实可以分为两部分。一部分介绍TensorFlow中的一些名词、类、方法等等。另一部分介绍了一个简单的机器学习模型——线性回归。
<!--more-->
### 1. 一些概念

* **Tensor**
    
    * tensor可以说是一种**数据结构**，TensorFlow中所有的数据都是用这种数据结构表示的
    * 可以将一个tensor看成是一个n-维的数组或列表
    * 一个tensor的维度可以是静态的也可以是动态的
    * 只有tensor可以在计算图中传递（流动flow）
    * tensor的**rank 秩**？？？
    
    * tensro的**shape 形状**？？？
* **Computational Graph**
 
 为什么要有计算图呢？谷歌在[下一篇](https://www.tensorflow.org/get_started/mnist/beginners)的介绍中有讲。
 在Python中进行高效的数值运算，是用的NumPy，将耗时的计算（比如矩阵乘法）移到Python外，用更底层的语言，更高效地完成，之后再将结果倒回Python中。但这样倒过来倒过去的，也有很多开销。所以使用TensorFlow时，将所有的操作都先描述出来，然后将整个操作过程都移到外边进行，不用进行一次运算操作，来回倒一次，这样开销就会少很多。（很多其他的机器学习库都是类似这样的。）
 
 图是由什么组成的呢？点(**Node**)和边。所以一些数据（**常量constant**、**变量Variables**）和操作(**Operations**)都放在node中。边呢就表示tensor的流动了。

* **Session**
 
 有了上边计算图的概念，这个Session就好理解了。因为计算图中的东西（节点）只是一种描述，并没有真正的运算。所以需要一个东西去告诉tensorflow去运行图中的操作，就是这个Session了。

 两三个点可以组成一个子图，七八个点也可以组成一个子图。所以可以看到一个Session实例可以run好多次，这次run这两个点，下次run其他几个点，这都是可以的。

 还有一个问题。当用session去run多个节点时要注意写法。
    ``` python
    import tensorflow as tf
    node1 = ...
    node2 = ...
    sess = tf.Session()
    // 错误！！！
    sess.run(node1, node2)
    // 正确
    sess.run([node1, node2])
    ```
 [这里]()是run()方法的api，可以接收好几个参数。但第一个参数是说想要执行的tensor和operation（即图中的节点）。可以是一个，或者是任意嵌套的列表、字典等。

* **constant**
 
 常量。没什么特别的。注意是小写。

* **placeholder**
    
    * 看名字，这是一个空儿（茅坑），等会儿会有各种数据（shi||niao）填进来。
    
    * 之后run的时候要用到它时，用**dict字典**来给它传数据。{xx:XXX,yy:YYY}
    
    * 和变量的区别？当然也能给变量各种值。placeholder更简单？也不是。概念上更符合？

* **Variable**
 
 变量。注意首字母大写。

 需要专门的初始化。（常量不需要。）

### 2. 线性模型 

机器学习，简单一点的，有这么一种情况。我们是从很多的数据中去学习（挖掘）一些知识。这些数据其实是满足一种分布的。我们要想学习到一些知识，最根本又最有用的方法就是根据这些数据推断出数据的分布情况。这样需要什么样的知识都可以从这个分布推断出来。

线性模型就是假设数据是线性分布的。我们的目的就是找出一条直线去拟合（regression回归问题）这些数据。即求出这条直线的斜率（W）和偏差（b）。用变量来定义这两个参数。因为是要不停的试、不停的变的。
``` python
import tensorflow as tf
// 注意W被示例写为大写，而b是小写。因为W经常是个矩阵，b只是标量。
// 上边常量是小写，变量首字母大写。这个原因是什么？
W = tf.Variable([.3], tf.float32)
b = tf.Variable([-.3], tf.float32)
```
现在我们已有的东西是什么？一些数据。即一些x和其相应的y。用placeholder定义。等会儿run的时候再传具体的数。
``` python
x = tf.placeholder(tf.float32)
y = tf.placeholder(tf.float32)
```
我们的模型的是线性模型，根据x即W和b可以得到一些预测值。即
``` python
linear_model = W * x + b
```
现在我们根据x和W、b得到一些预测值，但这些值和真正的值有多少差距？即我们的模型和真实的数据分布有什么差距（当前的W、b和真的W、b的差距）？用**loss**或**cost**来表示这个损失。这里用预测值和实际值的差值的平方和来表示。
``` python
loss = tf.reduce_sum(tf.square(linear_model - y))
```
若有差距，我们怎样减少这些差距？因为我们的**终极目标**就是**使损失函数最小**（其实就是一个优化问题）。TensorFlow提供了各种各样的**优化器optimizers**，这里使用的是最简单的**梯度下降算法gradient descent**。这也正是TensorFlow这些机器学习库厉害之处？想想自己code实现梯度下降算法……
``` python
optimizer = tf.train.GradientDescentOptimizer(0.01)
train = optimizer.minimize(loss)
```
接下来就是进行训练了。根据这些数据x，沿着这个优化器optimizer的方向，不断的调整模型参数W和b。这些过程就在上边的train中自动完成了。这也是TensorFlow这些机器学习库厉害之处？

在run上边的train时，我们要给placeholder，x和y传入具体的训练数据。还有要将变量Variable，W和b进行初始化。
``` python
// 训练数据
x_train = [1, 2, 3, 4]
y_train = [0, -1, -2, -3]
// 准备初始化变量
init = tf.global_variables_initializer()
// 创建Session
sess = tf.Session()
// 真正初始化变量
sess.run(init)
// 训练过程
for i in range(1000):
    sess.run(train, {x: x_train, y: y_train})
```
这样就完成了一个简单的机器学习。当然之后还有验证学习到的模型的准确性、测试学习到的模型的泛化能力等等任务。