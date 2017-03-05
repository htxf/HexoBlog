title: TensorFLow学习笔记（二）
date: 2017-02-28 17:09:08
tags: tensorflow学习
---
官方文档第二篇。[MNIST for ML Beginners](https://www.tensorflow.org/get_started/mnist/beginners) 
先介绍MNIST，还有softmax regression（softmax回归），然后利用tensorflow构建一个模型。

### 1. MNIST

MNIST对于机器学习就相当于Hello World对于一门编程语言。

MNIST是一个简单的计算机视觉数据集。有好多手写数字图片，并有相应的**label标记**，说明这张图片是数字几（0~9）。

一个简单的任务就是，训练一个模型，然后给它一张图片，它会预测出这张图片是数字几。（是一个分类Classification问题，多分类）

<!--more-->

MNIST是放在[Yann LeCun's website](http://yann.lecun.com/exdb/mnist/) (CNN的提出者)，Google提供代码可以将数据下载下来，并已经把数据分为了**training data**训练数据、**validation data**验证数据、**test data**测试数据。训练数据是训练模型用，验证数据也是在训练模型的过程中用（比如防止模型对于训练数据的过拟合，模型对于训练数据的表现在越来越好，而对于验证数据的表现并没有越来越好），测试数据是为了验证模型的泛化能力，在训练过程中是不能被模型“看到的“。这些数据是很多的。

具体到计算机上的数据表示。图片本身是28像素 X 28像素的，用一个28 X 28的数字矩阵表示。图片上越黑，对应数字矩阵的数字越大（图片都是灰度的）。然后将这个数字矩阵“压扁”成为一个28 \* 28 = 784维的向量。用x表示一张图片，那么 ~~x = [0.1, 0.2, 0., 0.5……]~~ x中的值应该是0~255中的一个，数字越大，像素点越黑，一共784个值。对于这张图片的标签，用y表示，它是一个“**one-hot vector**”，假设这张图片是数字3，那y就是[0, 0, 1, 0, 0, 0, 0, 0, 0]。

### 2. Softmax Regressions

Softmax回归。机器学习的问题分为两种，一种分类Classification问题，一种回归Regression问题。分类问题的输出是离散值，回归问题的输出是连续值。虽然Softmax Regressions有个回归，但它是解决分类问题的，而且是多分类问题。对应的，二分类问题有**Logistic Regression**方法。

给定一个输入，比如一张动物图片，经过模型的推理，它告诉我们这张图片有20%的概率是猪，20%的概率是猫，60%的概率是马。Softmax回归就是干这件事儿的。它先算出根据图片中的哪些东西推断出这张图片是猪、是猫、是马（三个类别的**evidence**）。比如，图片中有个尖尖的耳朵，那 evidence(猫) 和 evidence(马)就比evidence(猪)要大，但图片中还有长腿，那evidence(马)就比evidence(猫)和evidence(猪)要大许多了。就这样找好多特征，算出每个特征对应的每个类别的evidence，最后总和起来就得到了这张图片可能是某个类别的evidence。（对于每个类别再加上一定的偏差。）之后softmax回归可以把这些evidence“映射”到每个类别的概率上。


具体到这个例子。图片有10个类别。每个类别i的evidence为：$\text{evidence}_i = \sum_j W x_j + b_i$ 

（其中W为 $W_{i,~j}$）。i 是0-9；j 是0-783（或者是1-784）共784个；W一共有10 X 784个，每个W代表每一个像素是某个类别的权重是多少；b是每个类别的偏置。
softmax回归的功能就是将这些evidence（共10个）映射到10个概率上。即：$y = \text{softmax}(\text{evidence})$ 这里的y其实是一个数组，其中的每个值代表图片是某个类别的概率。

### 3. 设计模型、训练模型、评估模型

接下来在代码中实现这个softmax回归。

首先设置输入。图像数据x，及其对应的标签y_。使用placeholder。
这里的[None, 784]是x这个tensor的形状shape。None表示任意数字。这个tensor是一个2-D（2维）的tensor，秩也为2。但要注意，其中的数据是784维的，即784个数字。2-D的tensor可以当成一个矩阵来看待。每一行代表一个数据，每一行中的每一个数代表一个数据中的一个维度。MNIST中一共有55000个图片，要让计算机一下处理这么多数据很慢。所以可以批量次的“喂给”计算机一部分数据。这里的None就是代表，等会儿“送”None个数据进来。
``` python
import tensorflow as tf
x = tf.placeholder(tf.float32, [None, 784])
y_ = tf.placeholder(tf.float32, [None, 10])
```

之后搭建softmax模型。根据上边介绍的公式，需要参数W和b。
参数在训练过程中是不停的变的，用tensorflow中的变量Variable。
W的shape是[784, 10]，是2-D的tensor，秩为2。相当于一个矩阵。其实它可以是784 X 10也可以是10 X 784的。前者每一行代表图中一个像素是某个类的权重，一行10个数，对应10个类别；后者则是每一列代表图中一个像素是某个类的权重，一列10个数，对应10个类别。
b的shape是[10]，是1-D的tensor，秩为1。相当于一个向量，共10个数，即每个类别的偏置。
``` python
W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.zeros([10]))
```
之后就是利用数据x，参数W和b和及softmax回归产生每个类别的概率了（tensorflow的厉害之处……）。
matmul应该是matrix multiplication的简写，矩阵乘法，x X W 是 None x 784 X 784 x 10，得到的是None X 10的矩阵，再加上b（1 X 10），得到的就是None个图片数据是某个类别的evidence。
tensorflow用tf.nn.softmax就可以把evidence映射到每个类别的概率上，而且这里的y的shape是[None, 10]，即None X 10的矩阵，表示None个数据是每个类别的概率。（等等……，现在这个y中存的是概率呢还是进一步被tensorflow转换成“one-hot”数据了呢（这个应该很简单，每一行找出最大值，设为1，其余位置设为0。）？从后边的代码看，应该是前者。）
``` python
y = tf.nn.softmax(tf.matmul(x, W) + b)
```

现在我们有了预测值，和[上一篇](http://htxf.github.io/2017/02/23/TensorFlow%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%EF%BC%88%E4%B8%80%EF%BC%89/)一样，我们需要算出当前预测的loss（cost）。上一篇中用的是预测值和实际值的差值的平方和。这一篇利用**cross-entropy 交叉熵**。公式是$H_{y'}(y) = -\sum_i y'_i \log(y_i)$ y 是预测值，y' 是实际值，i 代表每个类别。根据公式写代码。
``` python
cross_entropy = tf.reduce_mean(-tf.reduce_sum(y_ * log(y)), reduction_indices=[1])
```
代码中（y_ \* log(y)）的shape，是[None, 10]，reduction_indices=[1]表示做reduce_sum加法时作用在第2维的tensor上。所以（-tf.reduce\_sum(y_ \* log(y)), reduction_indices=[1]）的shape就成了[None, 1]。最后算出这None个交叉熵的平均值，即用tf.reduce_mean。我们的目的还是为了把模型预测的结果的损失降到最小。即，使得cross_entropy最小。这一篇仍然使用**梯度下降**优化器。
``` python
train_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entropy)
```

最后就是把数据“喂给”建好的模型，不断的训练模型，训练出使得损失最小的W和b。
``` python
// 初始化参数变量
init = tf.global_variables_initializer()
sess = tf.InteractiveSession()
sess.run(init)
for _ in range(1000):
    // 每次随机取100个数据来feed给模型进行训练
    // 100就代替了上边的None
    batch_xs, batch_ys = mnist.train.next_batch(100)
    sess.run(train_step, feed_dict={x: batch_xs, y_: batch_ys})
```

最后的最后，对模型进行评估。这里只是算了下模型在测试数据上预测的准确性。
tf.argmax能返回一个tensor某个维度上最大值的位置。y\_ 是实际数据，由0、1组成，而且其shape是[None, 10]，第2维上，最大值是1，它的位置（0~9）就刚好是该数据的类别。y 是预测数据，由0到1的小数组成，其shape也是[None, 10]，第2维上，最大值的索引也就代表了该数据被预测为了该索引值。（有个问题！！！要是预测到某两个类别的可能性一样大呢？又刚好是最大的？）tf.equal返回一个布尔值的列表，比较的两者相同就为true。
tf.argmax(y, 1)和tf.argmax(y_, 1)的shape是[None, 1]，correct_prediction的shape是[None, 1]，或者是[None]？
tf.cast能将布尔值true、false转化为1、0。
然后对None个0、1求平均reduce_mean，就刚好是预测的准确率。如：[true false false true]，预测的准确率是50%，对[1 0 0 1]求平均刚好时0.5。
``` python
// 预测的正确与否
correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
// 预测的准确性
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
```
给这块儿的y、y_中的x“喂”测试集上的数据。
``` python
print(sess.run(accuracy, feed_dict={x: mnist.test.images, y_: mnist.test.labels}))
```

### 4. tensorflow中的tensor
TensorFlow中数据都存在tensor中。上一篇文章没有搞明白tensor的shape、rank。后来又查资料、想了很多。做如下的测试。
``` python
x0 = tf.Variable(tf.random_uniform([]))
x1 = tf.Variable(tf.random_uniform([3]))
x2 = tf.Variable(tf.random_uniform([2, 3]))
x3 = tf.Variable(tf.random_uniform([2, 3, 4]))
x4 = tf.Variable(tf.ones([2, 2, 3, 4]))

init = tf.global_variables_initializer()

sess = tf.Session()

sess.run(init)

print(sess.run(x0))
print(sess.run(x1))
print(sess.run(x2))
print(sess.run(x3))
print(sess.run(x4))

print(sess.run(x1[1]))
print(sess.run(x2[1, 2]))
print(sess.run(x3[1, 1, 1]))
print(sess.run(x4[0, 1, 1, 1]))
```
对得到的数据的rank、shape、dimension做如下整理。

<img src="..\TensorFLow学习笔记（二）\tensor.jpg" width="100%" height="100%">

### 5. 底层知识
其实本篇所训练出的模型，核心在于**Softmax Regression**、**cross-entropy**以及**gradient decent**。现在只是简单的知道了它们是干什么的。虽然也看过它们的原理、公式的推导过程，但都没有记住……哦多给？？？