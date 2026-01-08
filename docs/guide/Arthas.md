# Arthas
---
aliases:
  - arthas
标题: arthas
---
**记一次线上arthas热部署**


**笔记本：** arthas


**创建时…** 2023/4/27 19:22 **更新时…** 2023/12/11 14:19


**作者：** 彼岸樱速


这里不说arthas是什么，直接说具体使用命令


首先是安装好arthas

# **1、安装Arthas**


1. 下载 `arthas-boot.jar`
<img src="/img/arthas.pdf-0-0.png">

启动完之后，会显示出正在运行中的Java程序，1，2，3是编号，找到自己要热部署的应用，然后控制台输入数字，比如3


<img src="/img/arthas.pdf-0-0.png">

这时候就会进入上图中最后一行，可以理解为arthas容
器内部，这时候执行想要执行的arthas命令即可。


线上是一个CRM系统，springboot框架，maven项
目，有jar启动的方式，有war包启动的方式。由于线上
客户使用的功能，有时候会出现bug，但是客户白天正
在使用，有问题也要及时更新，又不能影响别的用户使
用其他功能，所以不能轻易重新部署项目。


这时候就用到了arthas的热部署。


先上一张线上热部署替换class文件的图
<img src="/img/arthas.pdf-1-1.png">

进入arthas容器之后，输入查询class命令查找你要热
部署的class名称
```
sc -d *className |grep classLoaderHash
```

这个命令，如果有返回值，证明已经启动的应用中，已
经加载了这个clas，先执行这个命令是确保真的有这个
Class，才能做下一步的替换操作。


本地IDE编辑器，比如我的Idea，构建得到最新的class
文件，丢到线上的某个暂时目录，比如我的是/tmp。


然后执行redefine命令进行热部署
```
redefine /tmp/className.class
```




这时候看到上图中，出现 redefine success，就表示
热部署成功了。


**arthas局限性**
1、不能添加或减少方法；
2、方法不能添加参数，因为添加参数会被认为是减少
了旧方法，然后新加了个增加了参数的方法；


以上之所以不能成功是因为jvm加载class完成之后，给
每个 方法和方法变量都分配好了对应的内存和空间，
如果方法或参数发生变动，可能会导致整个系统都会奔
溃。


官网文档：
[https://arthas.gitee.io/doc/](https://arthas.gitee.io/doc/)


