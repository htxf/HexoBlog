title: TensorFLow学习笔记（三）
date: 2017-03-04 20:35:50
tags: tensorflow学习
---
官方文档第三篇。[Deep MNIST for Experts](https://www.tensorflow.org/get_started/mnist/pros)

这篇的前半部分和上一篇一样，用单一线性层构建了一个softmax回归模型，其预测准确度是92%。重点是后半部分，用多层卷积神经网络构建了一个softmax回归模型（或者说多层卷积神经网络+softmax回归），其准确度可以达到99.2%。

整个网络的结构是：第一层卷积 + 第一层池化 + 第二层卷积 + 第二层池化 + 全连接层 + Dropout层 + softmax回归。

<!--more-->

### 1. 定义函数

为了之后使用方便，定义了几个函数，方便地使用权值、偏差及方便地构建卷积层、池化层。

输入想要的权值和偏差的tensor的shape形状就能获得想要的权值和偏差。权值开始时是一些随机数，满足正态分布，有少量的标准差，为了防止梯度为0（to prevent 0 gradients）？？？至于偏差，之后要使用[ReLU](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)激活函数，为了不产生“dead neurons”,初始值是很小的正数。
``` python
def weight_variable(shape):
  initial = tf.truncated_normal(shape, stddev=0.1)
  return tf.Variable(initial)

def bias_variable(shape):
  initial = tf.constant(0.1, shape=shape)
  return tf.Variable(initial)
```

提供想要被卷积的数据及相应的权值就可以获得相应的卷积层；提供想要被池化的数据就可以获得相应的池化层。卷积时要知道一些超参数的设置，padding是多少？stride是多少？池化时要知道选择的是什么样的方法，平均池化？最大池化？在多大的区块池化？这里两层的卷积和池化都是选择的vanilla version。padding是SAME，stride是1，在2x2的区块上最大池化。

``` python
// conv--Convolutional 2d代表什么？2维？
// tf.nn.conv2d strides这四个值怎样理解？stride取2时怎么写？
def conv2d(x, W):
  return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')
// tf.nn.max_pool 这几个参数怎样理解？
def max_pool_2x2(x):
  return tf.nn.max_pool(x, ksize=[1, 2, 2, 1],
                        strides=[1, 2, 2, 1], padding='SAME')
```

### 2. 第一层卷积、池化

输入到网络中的数据是28x28=784个数字，要对其进行卷积时先要把它再转变成28x28的格式。28宽，28高，1个通道（灰度图）。

``` python
// -1代表什么？
x_image = tf.reshape(x, [-1,28,28,1])
```

卷积神经网络的原理是什么？人看一张图片时，是根据一小块儿一小块儿的图组合起来看。卷积神经网络就模拟这个过程，扫描图片上一小块儿一小块儿的区域，然后对这些信息进行加工（不同的权值、不同的组合），抽象出一些新的信息来代表这张图。人们对这些信息到底是代表着图片中的什么东西并不知道（也并不关心）。反正可以使用这些信息很好的代表这张图片。但这些信息，量还有点大，经过池化，可以用更少的信息来表示。可以进行这样好几次卷积、池化，反正最后就是将图片抽象成了一些信息。对每张图片都进行这样同样的操作，就可以用得到的信息去做图片的分类、识别等工作了。这只是粗浅的解释，还有统计不变性、权值共享等概念。[Udacity](https://classroom.udacity.com/courses/ud730/lessons/6377263405/concepts/63741833610923#)上有很好的解释。

具体到这篇教程，第一层卷积时从每5x5的patch中提取、组合32个特征；池化时从每2x2的block中选取一个最大的做代表。第一层的卷积、池化过程大概如下图所示。

<img src="..\TensorFLow学习笔记（三）\first-conv-pool.jpg" width="100%" height="100%">

``` python
// 先定义权值，5 5 是patch的大小，1是输入的通道数，32是输入的通道数
W_conv1 = weight_variable([5, 5, 1, 32])
// 每个输出的通道加一个偏置
b_conv1 = bias_variable([32])
// 卷积层 relu只是激活函数 h_conv1代表28x28x32个数 根据上边的x_image，它的shape应该是[-1 28 28 32]  
h_conv1 = tf.nn.relu(conv2d(x_image, W_conv1) + b_conv1)
// 池化层 h_pool1的shape应该是[-1 14 14 32]
h_pool1 = max_pool_2x2(h_conv1)
```

### 3. 第二层卷积、池化
第二层以第一层的输出h_pool1做输入，这一次卷积时从5x5的patch中提取、组合64个特征；池化时仍是从2x2的block中选取最大的做代表。其过程如下图所示。

<img src="..\TensorFLow学习笔记（三）\second-conv-pool.jpg" width="100%" height="100%">

``` python
// 权值
W_conv2 = weight_variable([5, 5, 32, 64])
// 偏置
b_conv2 = bias_variable([64])
// 卷积
h_conv2 = tf.nn.relu(conv2d(h_pool1, W_conv2) + b_conv2)
// 池化
h_pool2 = max_pool_2x2(h_conv2)
```

### 4. 全连接层
全连接层以第二层的输出做输入，这一次是从7x7x64=3136个数中，提取1024个数来作为代表。

<img src="..\TensorFLow学习笔记（三）\full-connect.jpg" width="30%" height="30%">

代码和之前的线性模型很像，外层再加上ReLU激活函数。
``` python
// 权值的shape是[3136, 1024] 即有3136个输入 1024个输出
W_fc1 = weight_variable([7 * 7 * 64, 1024])
b_fc1 = bias_variable([1024])
// 这一步是将第二层卷积池化的输出7x7x64展平为3136个数
h_pool2_flat = tf.reshape(h_pool2, [-1, 7*7*64])
// 与之前的线性模型类似，外边再加上ReLU激活函数
h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)
```

### 5. Dropout层

Dropout的原理？它可以防止模型的过拟合（在训练集上表现很好，而再未知的数据集上表现不好）。大概就是在训练过程中，丢掉一些已经学习到的知识。这个教程中，先设置了一个placeholder，存放要保留的知识的百分比，这样在训练过程中可以保证一定的dropout，在测试过程中可以将其设置为100%来取消dropout。

这一层的输入是上一层全连接层的输出。
``` python
keep_prob = tf.placeholder(tf.float32)
h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)
```

### 6. softmax回归

根据Dropout层的输出，1024个数（特征），来产生10个类别的evidence，然后再应用softmax函数将evidence转化为相应的概率。教程中这一步只是简单的应用线性模型产生了10个evidence，而softmax的应用放到了计算损失——交叉熵中了。

<img src="..\TensorFLow学习笔记（三）\final.jpg" width="30%" height="30%">

``` python
// 权值的shape是[1024, 10] 即1024个输入 10个输出
W_fc2 = weight_variable([1024, 10])
b_fc2 = bias_variable([10])
// 线性模型
y_conv = tf.matmul(h_fc1_drop, W_fc2) + b_fc2
```


### 7. 训练、验证模型
剩下的工作和之前一篇的就差不多一样了。算出损失**交叉熵**，这次使用了**AdamOptimizer优化器**，使得损失减小。
``` python
// 交叉熵的算法和上一篇不同
cross_entropy = tf.reduce_mean(
    tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y_conv))
// 训练过程 沿着AdamOptimizer的方向 使得损失越来越小
train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)
```

模型预测的准确度的计算方法和上一篇一样。然后初始化变量。之后一共训练20000次，每次取50个样本数据进行训练，每次都丢弃一半已学到的知识；每训练一百次输出一次此时模型对于训练数据预测的准确度，此时不用dropout。最后在测试集上验证模型的预测准确率，不用dropout。
``` python
// 预测准确度的计算
correct_prediction = tf.equal(tf.argmax(y_conv, 1), tf.argmax(y_, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
// 设置会话Session  Session和InteractiveSession的区别？？？
sess = tf.InteractiveSession()
// 初始化变量
sess.run(tf.global_variables_initializer())
// 训练模型
for i in range(20000):
    batch = mnist.train.next_batch(50)
    // 每一百次 输出一次此时模型对于训练集的预测准确率
    if i % 100 == 0:
        train_accuracy = accuracy.eval(
            feed_dict={x: batch[0], y_: batch[1], keep_prob: 1.0})
        print("step %d, train accuracy %g" % (i, train_accuracy))
    train_step.run(feed_dict={x: batch[0], y_: batch[1], keep_prob: 0.5})
// 最后输出模型在测试集上预测的准确率
print("test accuracy %g" % accuracy.eval(
    feed_dict={x: mnist.test.images, y_: mnist.test.labels, keep_prob: 1.0}))
```

### 8. 底层知识

这一篇中，**卷积神经网络**、**Dropout**、**AdamOptimizer优化函数**的具体原理还没有完全搞明白。