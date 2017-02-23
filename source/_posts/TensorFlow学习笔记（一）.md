title: TensorFlow学习笔记（一）
date: 2017-02-23 19:30:06
tags: tensorflow学习
---
按照[官网](https://www.tensorflow.org/)的介绍、教程学习。整理、记录知识点。

这一篇是最开始的一篇。[Getting Started With TensorFlow](https://www.tensorflow.org/get_started/get_started)

现在的TesorFlow的API可以分为两个，一个低级一点的，称为TensorFlow Core，更适合研究人员使用，对所构建的模型有更深层的控制；另一个高级一点的，使用更简单，但还在开发中。学会了更底层的东西，更简答的用法可以很快掌握。这里只记录TensorFlow Core中的知识点。

这篇文章其实可以分为两部分。一部分介绍TensorFlow中的一些名词、类、方法等等。另一部分介绍了一个简单的机器学习模型——线性回归。

### 1. 一些概念

* **Tensor**
* **Computational Graph**
* **constant**
* **Session**
* **operations**
* **placeholder**
* **Variable**

### 2. 线性模型 