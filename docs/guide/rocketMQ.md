---
aliases:
  - rocketMQ
标题: rocketMQ
---
**RocketMQ角色详解之Broker**


**笔记本：** rocketMQ


**创建时…** 2022/8/26 10:32 **更新时…** 2022/8/26 10:35


**作者：** 彼岸樱速


**一、Broker概述**



<img src="/img/rocketMQ.pdf-0-0.png">0-0



**二、消息的存储与转发**



<img src="/img/rocketMQ.pdf-0-1.png">0-1



**三、消息存储结构**



<img src="/img/rocketMQ.pdf-0-2.png">0-2



**四、高可用机制**

```
 RocketMQ 分布式集群是通过 Master 和 Slave 的配合达到高可用性的

 1. 消费端的高可用：
 Master 角色的 Broker 支持读和写， Slave 角色的 Broker 仅支持读
 当 Master 不可用或者繁忙的时候， Consumer 会被自动切换到从 Slave
 读 。
 当一个 Master 角色的机器出现故障后， Consumer 仍然可以从 Slave
 读，不影响 Consumer 程序 。

```

```
 2. 发送端的高可用：
 在创建 Topic 的时候，把 Topic 的多个 Message Queue 创建在多个
 Broker 组上
 ( 相同 Broker 名称，不同 brokerId 的 机器组成 一 个 Broker 组 ) ，
 这样当一个 Broker 组的 Master 不可用后，其他组的 Master 仍然可用，
 Producer 仍然可以发送消息 。

```

**五、同步刷盘和异步刷盘**



<img src="/img/rocketMQ.pdf-1-0.png">1-0



**六、同步复制和异步复制**



<img src="/img/rocketMQ.pdf-1-1.png">1-1




**RabbitMQ 和 RocketMQ 区别与选型**


**笔记本：** rocketMQ


**创建时…** 2022/8/26 10:09 **更新时…** 2022/8/26 10:11


**作者：** 彼岸樱速


一 概述
MQ（Message Queue）是典型的生产者消费者模型,没有业
务逻辑侵入,实现生产者和消费者的解耦。它具有低耦合、可
靠投递、广播、流量控制、最终一致性等一系列功能，成为异
步RPC的主要手段之一。


二 AMQP和JMS
MQ是消息通信的模型，并发具体实现。现在实现MQ的有两
种主流方式：AMQP、JMS。


两者的区别和联系:


JMS是定义了统一的接口，来对消息操作进行统一；AMQP
是通过规定协议来统一数据交互的格式
JMS限定了必须使用Java语言；AMQP只是协议，不规定实
现方式，因此是跨语言的。
JMS规定了两种消息模型；而AMQP的消息模型更加丰富
三 实现
1. RabbitMQ
是基于AMQP 协议的 具有跨语言的特性，支持多种开发语言,
基于erlang语言编写,天生具有高并发.
2. rocketMQ
是基于JMS的 是阿里巴巴旗下开发的mq,只能用java语言,声
称可用性极高,消息从来不会丢失.
具体比较，此图比较旧了，其中rocketMQ现在也能支持
golang了



<img src="/img/rocketMQ.pdf-2-0.png">2-0
<img src="/img/rocketMQ.pdf-3-0.png">3-0
**深入理解RocketMQ之NameServer**


**笔记本：** rocketMQ


**创建时…** 2022/8/26 9:48 **更新时…** 2022/8/26 10:07


**作者：** 彼岸樱速

# **NameServer介绍**


Name Server 是专为 RocketMQ 设计的轻量级名称服务，
具有简单、可集群横吐扩展、无状态，节点之间互不通信等特
点。整个Rocketmq集群的工作原理如下图所示：


可以看到，Broker集群、Producer集群、Consumer集群都
需要与NameServer集群进行通信：



<img src="/img/rocketMQ.pdf-4-0.png">4-0



:



Broker用于接收生产者发送消息，或者消费者消费消息的
请求。一个Broker集群由多组Master/Slave组成，Master
可写可读，Slave只可以读，Master将写入的数据同步给
Slave。每个Broker节点，在启动时，都会遍历
NameServer列表，与每个NameServer建立长连接，注册
自己的信息，之后定时上报。





:



消息的生产者，通过NameServer集群获得Topic的路由信
息，包括Topic下面有哪些Queue，这些Queue分布在哪些
Broker上等。Producer只会将消息发送到Master节点上，
因此只需要与Master节点建立连接。





:


消息的消费者，通过NameServer集群获得Topic的路由信
息，连接到对应的Broker上消费消息。注意，由于Master
和Slave都可以读取消息，因此Consumer会与Master和
Slave都建立连接。

# **为什么要使用NameServer**


目前可以作为服务发现组件有很多，如etcd、consul，
zookeeper等：

那么为什么 rocketmq 选择自己开发一个 NameServer ，而不


是使用这些开源组件呢？

特别的， RocketMQ 设计之初时参考的另一款消息中间件

Kafka 就使用了 Zookeeper ， Zookeeper 其提供了 Master 选


举、分布式锁、数据的发布和订阅等诸多功能。

事实上，在 RocketMQ 的早期版本，即 MetaQ 1.x 和 MetaQ

2.x 阶段，也是依赖 Zookeeper 的。但 MetaQ 3.x （即

RocketMQ ）却去掉了 ZooKeeper 依赖，转而采用自己的


而



<img src="/img/rocketMQ.pdf-5-0.png">5-0

<img src="/img/rocketMQ.pdf-5-16.png">5-16



，不需要再依赖另一个中间件，从而减少整体维护成本。敏锐
的同学肯定已经意识到了，根据CAP理论，





：


<img src="/img/rocketMQ.pdf-6-0.png">6-0



：Name Server 集群中的多个实



例，彼此之间是不通信的，这意味着某一时刻，不同实例
上维护的元数据可能是不同的，客户端获取到的数据也可
能是不一致的。



可用性(Availability) ：只要不是所有NameServer节点


都挂掉，且某个节点可以在指定之间内响应客户端即可。







：对于分布式架构，网络



条件不可控，出现网络分区是不可避免的，只要保证部分
NameServer节点网络可达，就可以获取到数据。具体看
公司如何实施，例如：为了实现跨机房的容灾，可以将
NameServer部署的不同的机房，某个机房出现网络故
障，其他机房依然可用，当然Broker集群/Producer集
群/Consumer集群也要跨机房部署。

事实上，除了 RocketMQ 开发了自己的 NameServer ，最近

Kafka 社区也在 Wiki 空间上提交了一项新的改进提案 “KIP ~~-~~

500: Replace ZooKeeper with a Self ~~-~~ Managed Metadata

Quorum” ，其目的是为了消除 Kafka 对 ZooKeeper 的依赖，


该提案建议用自管理的元数据仲裁机制替换原来的

ZooKeeper 组件。感兴趣的读者可以自行查阅相关资料。

# **NameServer如何保证数据的最终** **一致**

NameServer 作为一个名称服务，需要提供服务注册、服务剔

除、服务发现这些基本功能，但是 NameServer 节点之间并不


通信，在某个时刻各个节点数据可能不一致的情况下，如何



保证客户端可以最终拿到正确的数据。下面分别从

、 路由剔除 ， 路由发现 三个角度进行介绍。




## **路由注册**

对于 Zookeeper 、 Etcd 这样强一致性组件，数据只要写到主


节点，内部会通过状态机将数据复制到其他节点，

Zookeeper 使用的是 Zab协议 ， etcd 使用的是 raft协议 。

但是 NameServer 节点之间是互不通信的，无法进行数据复

制。 RocketMQ 采取的策略是，在 Broker 节点在启动的时候，

轮训 NameServer 列表，与每个 NameServer 节点建立长连

接，发起注册请求。 NameServer 内部会维护一个 Broker 表，

用来动态存储 Broker 的信息。

同时， Broker 节点为了证明自己是存活的，会将最新的信息



上报给 NameServer ，然后





，心跳包中包含 BrokerId 、 Broker 地址、 Broker 名称、

Broker 所属集群名称等等，然后 NameServer 接收到心跳包

后，会更新时间戳，记录这个 Broker 的最新存活时间。

NameServer 在处理心跳包的时候，存在多个 Broker 同时操作

一张 Broker 表，为了防止并发修改 Broker 表导致不安全，路

由注册操作引入了 ReadWriteLock 读写锁，这个设计亮点允


许多个消息生产者并发读，保证了消息发送时的高并发，但

是同一时刻 NameServer 只能处理一个 Broker 心跳包，多个心


跳包串行处理。这也是读写锁的经典使用场景，即读多写


少。

## **路由剔除**

正常情况下，如果 Broker 关闭，则会与 NameServer 断开长连

接， Netty 的通道关闭监听器会监听到连接断开事件，然后会

将这个 Broker 信息剔除掉。

异常情况下， NameServer 中有一个定时任务，


。


特别的，对于一些日常运维工作，例如：Broker升级，
RocketMQ提供了一种优雅剔除路由信息的方式。如在升级
一个节Master点之前，可以先通过命令行工具禁止这个
Broker的写权限，发送消息到这个Broker的请求，都会收到
一个NO_PERMISSION响应，客户端会自动重试其他的
Broker。


当观察到这个broker没有流量后，再将这个broker移除。

## **路由发现**


路由发现是客户端的行为，这里的客户端主要说的是生产者


和消费者。具体来说：


对于生产者，可以发送消息到多个Topic，因此一般是在发
送第一条消息时，才会根据Topic获取从NameServer获取
路由信息


对于消费者，订阅的Topic一般是固定的，所在在启动时就
会拉取。


那么生产者 / 消费者在工作的过程中，如果路由信息发生了变

化怎么处理呢？如： Broker 集群新增了节点，节点宕机或者

Queue 的数量发生了变化。细心的读者注意到，前面讲解

NameServer 在路由注册或者路由剔除过程中，并不会主动推


送会客户端的，这意味着，需要





。



事实上， RocketMQ 客户端提供了定时拉取 Topic 最新路由信


息的机制，这里我们直接结合源码来讲解。

DefaultMQProducer 和 DefaultMQConsumer 有一个





，用于定时从 NameServer 并



获取最新的路由表，默认是 30 秒，它们底层都依赖一个





类中有一个



定的拉取时间间隔，周期性的的从 NameServer 拉取路由信

息。 在拉取时，会把当前启动的 Producer 和 Consumer 需要


使用到的 Topic 列表放到一个集合中，逐个从 NameServer 进


行更新。以下源码展示了这个过程：


然而定时拉取，还不能解决所有的问题。因为客户端默认是每
客户端获取路由信息总是会有30秒的延时。这就带来一个严重
者和消费者在这30秒内，依然会向这个宕机的broker发送或消



<img src="/img/rocketMQ.pdf-9-2.png">9-2
这个问题 可以通过 客户端重试机制 来解决

在讲解生产者重试机制之前，我们必须先对三种消息类型：

普通消息 、 普通有序消息 、 严格有序消息 进行介绍。因为


RocketMQ客户端的生产者重试机制，只会普通消息有作
用。对于普通有序消息、严格有序消息是没有作用。目前网上
绝大部分文章对此并没有进行区分，导致参考了这些文章的同
学误以为自己的消息发送失败会自动进行重试，然而事实上可
能根本没有进行重试。


三种消息的类型介绍如下：



普通消息 ：消息是无序的，任意发送发送哪一个队列都可


以。







：同一类消息(例如某个用户的消息)总是发



送到同一个队列，在异常情况下，也可以发送到其他队
列。



严格有序消息 ：消息必须被发送到同一个队列，即使在异


常情况下，也不允许发送到其他队列。





对于这三种类型的消息， RocketMQ 分别提供了对应的方法

来发送消息，例如同步发送 ( 异步 / 批量 /oneway 也是类似 ) ：


对于普通消息，消息发送默认采用round-robin机制来选择发
送到哪一个队列，如果发送失败，默认重试2次。由于之前发
送失败的Queue必然位于某个Broker上，在重试过程中，这
个失败的Broker上的Queue都不会选择，这里主要是考虑，
既然发送到这个Broker上某个Queue失败了，那么发送到这
个Broker上的Queue失败的可能性依然很大,所以选择其他
Broker。


但是一定会这样吗？例如Broker集群只是由一组
Master/Slave组成，发送消息只会选择Master，如果这个



<img src="/img/rocketMQ.pdf-10-9.png">10-9
Master失败了，没有其他Master可选，此时已然会选择这个
Master上的其他Queue。

在实际生产环境中，通常 Broker 集群至少由 2 组 Master/Slave


组成，甚至更多，例如我司就是 3 主 3 从。这样就可以很好的

利用 RocketMQ 对于普通消息发送的重试机制，每次重试到

不同的 Broker 上。

从源码层面来看，对于普通消息， RocketMQ 选择队列默认


个的队列，在未开启延迟容错的情况下，内部会调用





方法，这个方法



源码体现了前面说的重试逻辑：



<img src="/img/rocketMQ.pdf-11-7.png">11-7



隔离，优先从其他正常的broker中进行选择





：优先发送消息到延迟比较小的broker


对于无序消息，通过这种异常重试机制，就可以保证消息发

送的高可用了。同时由于不需要 NameServer 通知众多不固定

的生产者，也降低了 NameServer 实现的复杂性。


既然重试机制有这么明显的好处，那么对于普通有序消息，和
严格有序消息，rocketmq为什么默认不进行重试呢？


答案很简单，这些消息只能发送某个特定的Broker上的某个
特定的Queue中，如果发送失败，重试失败的可能依然很
大，所以默认不进行重试。如果需要重试，需要业务方自己来
做。

## **普通有序消息失败情况下的短暂无序**


首先说明，对于普通有序消息，RocketMQ是不会进行重试
的。如果需要重试，那么业务RD同学需要自己编写重试代
码，例如通过一个for循环，最多重试几次。


这里主要说明：对于普通有序消息，在异常情况下，


源码来寻找答案：

可以看到，这个接口到的 select 方法接收一个 List 类型参数，

也就是当前 Topic 下的队列集合。这个接口由业务 RD 实现，


生产者客户端在发送消息之前会回调这个接口。



<img src="/img/rocketMQ.pdf-12-4.png">12-4



业务RD在实现这个接口时，为了保证消息的有序。可以
采取一些策略，例如：发送的是一个用户的消息，先计算
pos=user_id%mqs.size()，之后mqs.get(pos)获得对应的
队列。因此在正常情况下，一个用户的消息总是有序的。





在异常情况下，例如一个Broker宕机，路由信息刷新后，
这个Broker上队列就会从List集合中移除。此时按照相同
的方式选择队列，就会选择到其他队列上，造成了无序。


但是这个无序是很短暂的，因为之后同一个用户的信息，
都会发送到同一个新的队列上。


如果宕机的broker恢复了，那么再次经历一下短暂无序，
之后又变得有序了。

## **严格有序消息的重试**

对于严格有序消息，由于直接指定了一个 MessageQueue 。

如果这个 MessageQueue 所在的 Broker 宕机了，那么之后的


重试必然都失败，只有无限重试，直到成功。因此，非必要


的情况下，是不建议使用严格有序消息的。

# **客户端NameServer选择策略**


前面讲解了客户端在获取路由信息时，每次都会尝试先从缓

存的路由表中查找 Topic 路由信息，如果找不到，那么就去

NameServer 更新尝试。下面介绍一下客户端 NameServer 节


点的选择策略。

RocketMQ 会将用户设置的 NameServer 列表会设置到

NettyRemotingClient 类的 namesrvAddrList 字段中，

NettyRemotingClient 是 RocketMQ 对 Netty 进行了封装，如


下：

具体选择哪个 NameServer ，也是使用 round ~~-~~ robin 的策略。

需要注意的是，尽管使用 round ~~-~~ robin 策略，但是在选择了一

个 NameServer 节点之后，后面总是会优先选择这个

NameServer ，除非与这个 NameServer 节点通信出现异常的


情况下，才会选择其他节点。





笔者考虑，通常NameServer节点是固定的几个，但是客户端
的数量可能是成百上千，为了减少每个NameServer节点的压
力，所以每个客户端节点只随机与其中一个NameServer节点
建立连接。


为了尽可能保证NameServer集群每个节点的负载均衡，在
round-robin策略选择时，每个客户端的初始随机位置都不
同，如下：


private final AtomicInteger namesrvIndex = ne

其中 initValueIndex() 就是计算一个随机值，之后每次选择

NameServer 时， namesrvIndex+1 之后，对 namesrvAddrList


取模，计算在数据下标的位置，尝试创建连接，一旦创建成

功，会将当前选择的 NameServer 地址记录到

namesrvAddrChoosed 字段中：


private final AtomicReference<String> namesrvAd

如果某个 NameServer 节点创建连接失败是，会自动重试其他



节点。具体可参见：





最后留一个笔者没有想明白的问题，选择 NameServer 的初始

随机位置是 initValueIndex() 方法，这个方法的实现如下：



<img src="/img/rocketMQ.pdf-14-10.png">14-10
**springboot整合rocketMQ demo**


**笔记本：** rocketMQ


**创建时…** 2022/6/7 14:46 **更新时…** 2022/6/7 15:05


**作者：** 彼岸樱速


**1、首先是pom.xml**


**2、配置文件**
```
# NameServer地址

rocketmq.name-server=xx.xx.xx.xx:8876
# 默认的消息组

rocketmq.producer.group=springBootGroup

```

**3、生产者**



<img src="/img/rocketMQ.pdf-15-0.png">15-0

<img src="/img/rocketMQ.pdf-15-1.png">15-1
<img src="/img/rocketMQ.pdf-16-0.png">16-0





**4、消费者**



<img src="/img/rocketMQ.pdf-16-1.png">16-1
<img src="/img/rocketMQ.pdf-17-0.png">17-0

**5、可以自定义事务监听器**



<img src="/img/rocketMQ.pdf-17-1.png">17-1








<img src="/img/rocketMQ.pdf-18-0.png">18-0


<img src="/img/rocketMQ.pdf-19-0.png">19-0

**6、测试接口**



<img src="/img/rocketMQ.pdf-19-1.png">19-1








<img src="/img/rocketMQ.pdf-20-0.png">20-0

**7、浏览器打开swagger的doc.html，找到对应的接口进行**
**测试发送**



<img src="/img/rocketMQ.pdf-20-1.png">20-1
<img src="/img/rocketMQ.pdf-21-0.png">21-0
**linux安装rocketMQ**


**笔记本：** rocketMQ


**创建时…** 2022/6/7 11:42 **更新时…** 2022/6/7 14:44


**作者：** 彼岸樱速


**1、首先到官网进行下载**





<img src="/img/rocketMQ.pdf-22-1.png">22-1

**2、上传到服务器上，解压**





**3、配置环境变量**


**4、修改启动配置**



<img src="/img/rocketMQ.pdf-22-3.png">22-3

<img src="/img/rocketMQ.pdf-22-4.png">22-4
修改目录/xxx/rocketmq-4.9.3/bin下的配置文件：
runserver.sh、runbroker.sh不然会报insufficient memory


修改runserver.sh 中原有内存配置，更改为





<img src="/img/rocketMQ.pdf-23-1.png">23-1

修改runbroker.sh 中原有内存配置，更改为





<img src="/img/rocketMQ.pdf-23-3.png">23-3

修改/xxx/rocketmq-4.9.3/conf/broker.conf文件，如果找不
到，就自己手动创建一个，添加配置


<img src="/img/rocketMQ.pdf-24-0.png">24-0

在rocketmq的conf目录下添加namesrv.properties文件，文
件中添加端口配置


**5、编写启动脚本**
首先是启动nameserver，再启动broker，nameserver就像
是一个注册中心，broker是注册到nameserver里面的。



<img src="/img/rocketMQ.pdf-24-1.png">24-1

<img src="/img/rocketMQ.pdf-24-2.png">24-2



<img src="/img/rocketMQ.pdf-24-3.png">24-3


两个启动都要用 -c 指定对应的配置文件，
**autoCreateTopicEnable=true，这样可以自动创建topic**
两个都使用nohup进行启动，并指定了日志输出的位置，


查看broker日志，如图所示就算成功


但我自己在安装过程中，查了网上无数资料，其实很多博客都
是人云亦云，但在linux装个什么东西，环境不同，版本不
同，就有各种各样千奇百怪的问题。
这里虽然我用nohup指定了输出日志，但这个本来就是一个
sh的脚本文件，在conf下面可以看到有logback框架配置文
件。说到这里不得不提一下，rocketMQ是Java语言编写的。


broker启动，出现上面所示大概率是成功的了，但就像上面

<img src="/img/rocketMQ.pdf-25-2.png">25-2
说的，它自己有自己的logback日志输出


这里我修改成了自己的日志位置



<img src="/img/rocketMQ.pdf-25-1.png">25-1

<img src="/img/rocketMQ.pdf-25-3.png">25-3
我是在整合springboot + rocketMQ写demo的时候，要么
就是连不上，要么就是找不到route，要么就是找不到topic，
要么超时，但最多的就是RemotingConnectException。
进到它自己的broker日志查看，尽管有上面的boot success
输出，但它自己的日志输出还是有很多error打印


只有日志输出看起来正常的，才能是正确运行的


**6、安装rocketMQ-console控制台**
RocketMQ有一个可视化的的dashboard，通过该控制台可
以直观的看到很多数据


**下载**



<img src="/img/rocketMQ.pdf-26-0.png">26-0

<img src="/img/rocketMQ.pdf-26-1.png">26-1



master分支看不到rocketmq-console时，可以切换develop
分支


<img src="/img/rocketMQ.pdf-27-0.png">27-0

安装这个控制台，也耗费了我很长时间，因为我自己的是在腾
讯云的服务器，像阿里云、腾讯云这些，都是有着自己的一套
防火墙规则的，首先这个控制台，最好还是在window下用
吧，因为防火墙的因素，基本每开一个服务，就要开放一系列
端口，关键是按照网上一大堆的配置来配，正常启动和使用我
也不觉得什么，但是配各种东西依然各种报错，尽管我也想刨
根问底的，找它源码来解析到底是什么鬼问题，但真的很耗费
时间。


修改配置修改其src/main/resources中的
application.properties配置文件。
默认端口号为 8080 ，修改为一个不常用的 指定RocketMQ
的name server地址，我这里之所以用window记事本打开，
是我自己其实没有拉代码下来来改，其实就是一个控制台的
web页面，很多博客虽说都这么跟你说，自己打包，但我觉得
这种东西，弄好成一个jar包和正确的配置，就行了。不过自
己去看源码和打包也不错，主要是我觉得一开始接触，还是花
多点时间来研究技术本身，而不是花那么多时间研究各种其他
方便的工具。


改好之后，就用maven打包成可运行jar包



<img src="/img/rocketMQ.pdf-27-1.png">27-1
我自己尝试，想把它放在服务器上， 开放这个jar所需的端口
也好，但总是有很多的RemotingConnectException，网上
各有所云，有的说因为linux服务器存在自己的防火墙，一个
连接如果没有后续的请求的话它会自动断开之类的，但总结下
来，就是因为防火墙的原因，配置公网地址咯，自己访问不了
自己，配置内网地址之后是可以咯，但demo又识别不了这个
内网地址，配127.0.0.1或localhost也都试过了，但就是
RemotingConnectException，最后，还是用公网IP，demo
是没问题了，控制台在window上使用，其实控制台最多就是
拿来看下topic之类的，里面还是有很多其他的问题的，这里
也不再一一研究了，先用起来，后面遇到问题，有需要的时候
再解决吧。



<img src="/img/rocketMQ.pdf-28-1.png">28-1

<img src="/img/rocketMQ.pdf-28-2.png">28-2
<img src="/img/rocketMQ.pdf-29-0.png">29-0

<img src="/img/rocketMQ.pdf-29-1.png">29-1
