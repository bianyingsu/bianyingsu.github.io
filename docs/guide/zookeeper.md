---
aliases:
  - zookeeper
标题: zookeeper
---
**linux系统下安装Zookeeper详细教程**


**笔记本：** zookeeper


**创建时…** 2022/8/16 18:59 **更新时…** 2022/8/16 19:16


**作者：** 彼岸樱速


1、创建zookeeper安装目录

<img src="/img/zookeeper.pdf-0-1.png">0-1

2、进入zookeeper目录，下载zookeeper安装包


3、解压zookeeper安装包：



<img src="/img/zookeeper.pdf-0-0.png">0-0

<img src="/img/zookeeper.pdf-0-2.png">0-2


4、进入zookeeper 中的 conf目录：





<img src="/img/zookeeper.pdf-1-1.png">1-1

5、复制一份 zoo_sample.cfg 为zoo.cfg: cp
zoo_sample.cfg zoo.cfg
因为高版本的zookeeper 默认加载配置文件名称为

<img src="/img/zookeeper.pdf-1-2.png">1-2
zoo.cfg，因此需要修改下配置文件名称


6、编辑zoo.cfg配置文件：


①新建zookeeper数据存放目录：


mkdir /home/zookeeper/apache-zookeeper
<img src="/img/zookeeper.pdf-1-3.png">1-3
3.7.0-bin/MyZkData


②、vi zoo.cfg，修改zookeeper的数据存放目录


<img src="/img/zookeeper.pdf-2-0.png">2-0

7、启动zookeeper服务端：


cd /home/zookeeper/apache-zookeeper-3.7.0bin/bin


执行 ./zkServer.sh start


8、启动zookeeper客户端，测试是否安装成功：


执行 ./zkCli.sh start
执行几个命令在测试一下：



<img src="/img/zookeeper.pdf-2-1.png">2-1
<img src="/img/zookeeper.pdf-3-0.png">3-0

莫得问题，zookeeper启动成功！


