# Etcd
---
aliases:
  - etcd
标题: etcd
---
**Etcd教程**


**笔记本：** etcd


**创建时…** 2024/5/20 17:45 **更新时…** 2024/5/20 17:55

# **Etcd教程**

### **etcd简介**

etcd官方的定义：分布式系统中最关键数据的分布式、


可靠的键值存储。


etcd是一个由CoreOS团队开源的，基于Go语言实现


的，用于构建高可用的分布式键值(key-value)数据库。

### **etcd特点**

- 
  简单：基于 gRPC 定义了清晰、面向用户的

- 
  API。

- 
  安全：支持可选的客户端 TLS 证书自动认证特

- 
  性。

- 
  快速：每个节点可支持上万QPS读写。

- 
  可靠：基于 Raft 算法协议保证一致性。


### **与zookeeper对比**

- 
  使用简单：使用 Go 语言编写部署简单；使用gRPC 定义接口，支持跨语言、跨平台特性，而zookeeper需要安装客户端，且官方只提供了java和c两种语言接口。

- 
  发展快：相较于zookeeper的缓慢发展维护，etcd正处于高速迭代开发中。

- 
  性能优越：官方提供的基准测试数据中，etcd 集群可以支持每秒 10000+ 次的写入，性能优于Zookeeper。

- 
  安全性：etcd 支持 TLS 访问，而 ZooKeeper 在权限控制方面做得略显粗糙。

- 
  稳定可靠：etcd更加稳定可靠，它的唯一目标就是把分布式一致性KV存储做到极致，所以它更注重稳定性和扩展性。


### **应用场景**

- 
  服务注册与发现：服务进程在ETCD注册自己的位置，客户端应用进程向ETCD发起查询，来获取服务的位置，ETCD提供一个可用的服务列表。


- 
  发布订阅消息：数据提供者在配置中心发布消息，消息消费者订阅他们关心的主题，一旦主题有新消息发布，就会实时通知订阅者，通过这种方式可以做到分布式系统配置的集中式管理与动态更新。


- 
  负载均衡：etcd本身分布式架构存储的信息访问支持负载均衡，etcd集群化以后，每个etcd的核心节点都可以处理用户的请求。所以把数据量小但是访问频繁的消息数据直接存储到etcd中也是个不错的选择。etcd可以监控一个集群中多个节点的状态，利用etcd维护一个负载均衡节点表，当有一个请求发过来后，可以轮询式的把请求转发给存活着的节点。


- 
  分布式锁：因为etcd使用Raft算法保持了数据的强一致性，某次操作存储到集群中的值必然是全局一致的，所以很容易实现分布式锁。当有多个竞争者node节点，etcd作为总控，在分布式集群中与一个节点成功分配lock分布式队列：分布式队列的常规用法与分布式锁的控制时序用法类似，创建一个先进先出的队列，保证顺序。另一种比较有意思的实现是在保证队列达到某个条件时再统一按顺序执行。这种方法的实现可以在/queue这个目录中另外建立一个/queue/condition节点


- 
  分布式通知和协调：分布式通知与协调，与消息发布和订阅有些相似。都用到了etcd中Watche机制，通过注册与异步通知机制，实现分布式环境下不同系统之间 的通知与协调，从而对数据变更做到实时处理。实现方式：不同系统都在etcd上对同一个目录进行注册，同时设置Watcher观测该目录的变化(如果对子目录的变化也有需要，可以设置递归模式)，当某个系统更新了etcd的目录，那么设置了Watcher的系统就会收到通知作出相应处理。


- 
  主备选举：使用分布式锁，可以完成Leader竞选。这种场景通常是一些长时间CPU计算或者使用IO操作的机器，只需要竞选出的Leader计算或处理一次，就可以把结果复制给其他的Follower，从而避免重复劳动，节省计算资源。


- 
  集群监控：使用etcd来实现集群的实时性的监控，可以第一时间检测到各节点的健康状态，以完成集群的监控要求。etcd本身就有自带检点健康监控功能，实现起来也比较简单。


## **工作原理**

### **架构图**

<img src="/img/etcd.pdf-3-0.png">

### **架构解析**

按照分层模型，etcd可分为Client层、API网络层、Raft


算法层、逻辑层和存储层。这些层的功能如下:

- 
  Client层: Client层包括client v2和v3两个大版本APl客户端库，提供了简洁易用的API，同时支持负载均衡、节点间故障自动转移，可极大降低业务使用etcd复杂度，提升开发效率、服务可用性。


- 
  API网络层: API网络层主要包括client访问server和server节点之间的通信协议。一方面，client访问etcd server的API分为v2和v3两个大版本。v2API使用HTTP/1.x协议，v3 API使用gRPC协议。同时v3通过etcd grpc-gateway组件也支持 HTTP/1.x协议，便于各种语言的服务调用。另一方面，server之间通信协议，是指节点间通过Raft算法实现数据复制和Leader 选举等功能时使用的HTTP协议。


- 
  Raft 算法层: Raft算法层实现了Leader 选举、日志复制、ReadIndex等核心算法特性，用于保障etcd多个节点间的数据一致性、提升服务可用性等，是etcd的基石和亮点。


- 
  功能逻辑层: etcd核心特性实现层，如典型的KVServer模块、MVCC模块、 Auth鉴权模块、Lease租约模块、Compactor压缩模块等，其中MVCC模块主要由treelndex模块和boltdb 模块组成。


- 
  Store存储层: 存储层包含预写日志(WAL)模块、快照(Snapshot)模块、boltdb模块。其中WAL可保障etcd crash后数据不丢失，boltdb则保存了集群元数据和用户写入的数据。



一个用户的请求发送过来，会经由 HTTP Server 转发


给 Store 进行具体的事务处理，如果涉及到节点的修


改，则交给 Raft 模块进行状态的变更、日志的记录，


然后再同步给别的 etcd 节点以确认数据提交，最后进


行数据的提交，再次同步。

### **概念术语**

- 
  Raft：etcd所采用的保证分布式系统强一致性的算法。

- 
  Node：一个Raft状态机实例。

- 
  Member：一个etcd实例。它管理着一个Node，并

- 
  且可以为客户端请求提供服务。

- 
  Cluster：由多个Member构成可以协同工作的etcd集群。

- 
  Peer：对同一个etcd集群中另外一个Member的称呼。

- 
  Client：向etcd集群发送HTTP请求的客户端。

- 
  WAL：预写式日志，etcd用于持久化存储的日志格式。

- 
  snapshot：etcd防止WAL文件过多而设置的快照，存储etcd数据状态。

- 
  Proxy：etcd的一种模式，为etcd集群提供反向代理服务。

- 
  Leader：Raft算法中通过竞选而产生的处理所有数据提交的节点。

- 
  Follower：竞选失败的节点作为Raft中的从属节点，为算法提供强一致性保证。

- 
  Candidate：当Follower超过一定时间接收不到

- 
  Leader的心跳时转变为Candidate开始竞选。

- 
  Term：某个节点成为Leader到下一次竞选时间，称为一个Term。

- 
  Index：数据项编号。Raft中通过Term和Index来定位数据。


### **核心特性**

- 
  数据读写



为了保证数据的强一致性，etcd集群中所有的数据流


向都是一个方向，从 Leader （主节点）流向


Follower，也就是所有 Follower 的数据必须与 Leader


保持一致，如果不一致会被覆盖。


用户对于etcd集群所有节点进行读写


读取：由于集群所有节点数据是强一致性的，读取可以


从集群中随便哪个节点进行读取数据


写入：etcd集群有leader，如果写入往leader写入，可


以直接写入，然后然后Leader节点会把写入分发给所


有Follower，如果往follower写入，然后Leader节点会


把写入分发给所有Follower

- 
  leader选举



假设三个节点的集群，三个节点上均运行Timer（每个


Timer持续时间是随机的），Raft算法使用随机Timer来


初始化Leader选举流程，第一个节点率先完成了


Timer，随后它就会向其他两个节点发送成为Leader的


请求，其他节点接收到请求后会以投票回应然后第一个


节点被选举为Leader。


成为Leader后，该节点会以固定时间间隔向其他节点


发送通知，确保自己仍是Leader。有些情况下当


Follower们收不到Leader的通知后，比如说Leader节


点宕机或者失去了连接，其他节点会重复之前选举过程


选举出新的Leader。

- 
  判断数据是否写入



etcd认为写入请求被Leader节点处理并分发给了多数


节点后，就是一个成功的写入。那么多少节点如何判定


呢，假设总结点数是N，那么多数节点


Quorum=N/2+1。关于如何确定etcd集群应该有多少个


节点的问题，上图的左侧的图表给出了集群中节点总数


(Instances)对应的Quorum数量，用Instances减去


Quorom就是集群中容错节点（允许出故障的节点）的


数量。


所以在集群中推荐的最少节点数量是3个，因为1和2个


节点的容错节点数都是0，一旦有一个节点宕掉整个集


群就不能正常工作了。

## **1 Etcd介绍**

### **1.1 介绍**


`Etcd` 是使用Go语言开发的一个开源的、高可用的分布式


key-value存储系统，可以用于配置共享和服务的注册


和发现。

### **1.2 Etcd特点**


`Etcd` 具有以下特点：


`完全复制` ：集群中的每个节点都可以使用完整的存


档。


`高可用性` ：Etcd可用于避免硬件的单点故障或网络问


题。


`一致性` ：每次读取都会返回跨多主机的最新写入。


`简单` ：包括一个定义良好、面向用户的API


（gRPC）。


`安全` ：实现了带有可选的客户端证书身份验证的自


动化TLS。


`快速` ：每秒10000次写入的基准速度。


`可靠` ：使用Raft算法实现了强一致、高可用的服务


存储目录。

## **2 Etcd单机安装**

### **2.1 开放端口**


开放每台机器上的2379、2380端口的命令：

```
firewall-cmd --zone=public --add-port=2379/tcp --permanent
firewall-cmd --zone=public --add-port=2380/tcp --permanent
```

重启防火墙：

```
firewall-cmd --reload
```

查看开放的端口：

```
firewall-cmd --list-port
```


### **2.2 安装包及安装教程**

[安装包下载地址：https://github.com/etcd-io/etcd/tags](https://github.com/etcd-io/etcd/tags)


**选择最新版本，同时里面还有Linux、macOS**


**(Darwin)、Docker这三种安装方式的步骤以及安装**

**包。**

<img src="/img/etcd.pdf-8-1.png">


**注意：2.2到2.4的安装方式在github上都有写，详见** ：


[https://github.com/etcd-io/etcd/releases/tag/v3.5.13](https://github.com/etcd-io/etcd/releases/tag/v3.5.13)

### **2.3 Linux安装Etcd**


**2.3.1 创建执行脚本**


在 linux的 `/opt/soft/etcd/` 目录下创建一个脚本文件：

```
vim etcd
```

**2.3.2 脚本内容**

```perl
ETCD_VER=v3.5.13

# choose either URL 翻译：选择下面两个任意一个地址即可
GOOGLE_URL=https://storage.googleapis.com/etcd
GITHUB_URL=https://github.com/etcd-io/etcd/releases/download
DOWNLOAD_URL=${GOOGLE_URL}

rm -f /opt/soft/etcd/etcd-${ETCD_VER}-linux-amd64.tar.gz
rm -rf /opt/soft/etcd/etcd-download-test && mkdir -p /opt/soft/etcd/etcd-download-test

curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-linux-amd64.tar.gz -o /opt/soft/etcd/etcd-${ETCD_VER}-linux-amd64.tar.gz
tar -zxvf /opt/soft/etcd/etcd-${ETCD_VER}-linux-amd64.tar.gz -C /opt/soft/etcd/etcd-download-test --strip-components=1
rm -f /opt/soft/etcd/etcd-${ETCD_VER}-linux-amd64.tar.gz

#查看安装是否成功的相关命令
/opt/soft/etcd/etcd-download-test/etcd --version
/opt/soft/etcd/etcd-download-test/etcdctl version
/opt/soft/etcd/etcd-download-test/etcdutl version
```

**2.3.3 执行脚本里的命令**


在 `/opt/soft/etcd` 执行：

```
./etcd
```

如果在执行时提示权限不够，则需要授权，然后再次执


行即可：

```
chmod 777 etcd
```

**2.3.4 查看Etcd安装是否成功**


**2.3.4.1 查看Etcd服务端安装是否成功**

```
/opt/soft/etcd/etcd-download-test/etcd --version
```

如下显示则安装成功：

```
etcd Version: 3.5.13
Git SHA: c9063a0dc
Go Version: go1.21.8
Go OS/Arch: linux/amd64
```


注意 ：需要将Etcd加入到环境变量中，否则会在 `3.3.3`


`执行` `goreman` `启动命令` 步骤时报 `/bin/sh: etcd:` `未找到命令` 。

```
vim ~/.bashrc
```

将Etcd环境变量添加到文件末尾。

```
export GOROOT=/usr/local/go #GOROOT是系统上安装Go软件包的位置。
export GOPATH=/root/go/GOPATH #GOPATH是工作目录的位置。这个是自己创建的，想放在哪都行
export ETCD=/opt/soft/etcd/etcd-download-test=#ETCD

#export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
export PATH=$GOPATH/bin:$GOROOT/bin:$ETCD:$PATHexport GOPROXY="https://goproxy.cn"
```

加完后按esc键退出编辑模式，输入：wq保存退出。


更新配置文件：

```
source ~/.bashrc
```

**2.3.4.2 查看Etcd客户端安装是否成功**

```
/opt/soft/etcd/etcd-download-test/etcdctl version
```

如下显示则安装成功：

```
etcdctl version: 3.5.13
API version: 3.5
```

**2.3.5 测试**


1. 启动Etcd

```
/opt/soft/etcd/etcd-download-test/etcd
```

2. 添加/查看数据

   ```perl
   /opt/soft/etcd/etcd-download-test/etcdctl --endpoints=localhost:2379 put foo bar
   /opt/soft/etcd/etcd-download-test/etcdctl --endpoints=localhost:2379 get foo
   
   [root@node1192 ~]*# /opt/soft/etcd/etcd-download-test/etcdctl --endpoints=localhost:2379 put foo bar*OK
   [root@node1192 ~]*# /opt/soft/etcd/etcd-download-test/etcdctl --endpoints=localhost:2379 get foo 
   foo
   bar
   ```

   

### **2.4 macOS (Darwin)安装Etcd（未实操）**

```perl
ETCD_VER=v3.5.13

# choose either URL
GOOGLE_URL=https://storage.googleapis.com/etcd
GITHUB_URL=https://github.com/etcd-io/etcd/releases/download
DOWNLOAD_URL=${GOOGLE_URL}


rm -f /tmp/etcd-${ETCD_VER}-darwin-amd64.zip
rm -rf /tmp/etcd-download-test && mkdir -p /tmp/etcd-download-test


curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-darwin-amd64.zip -o /tmp/etcd-${ETCD_VER}-darwin-amd64.zip
unzip /tmp/etcd-${ETCD_VER}-darwin-amd64.zip -d /tmp && rm -f /tmp/etcd-${ETCD_VER}-darwin-amd64.zip
mv /tmp/etcd-${ETCD_VER}-darwin-amd64/* /tmp/etcd-download-test && rm -rf mv /tmp/etcd-${ETCD_VER}-darwin-amd64

/tmp/etcd-download-test/etcd --version
/tmp/etcd-download-test/etcdctl version
/tmp/etcd-download-test/etcdutl version
```

### **2.5 Docker安装Etcd（推荐）**

Docker安装Etcd前，需要先在Linux上安装Docker，

[Docker的安装步骤参见：centos7安装docker](https://blog.csdn.net/Mr_XiMu/article/details/104268176)


**1 创建Etcd的数据目录**

```
mkdir -p /opt/soft/etcd/data
```

**2 Docker部署Etcd**


1. 拉取镜像：

```perl
#拉取etcd镜像
docker pull quay.io/coreos/etcd:v3.5.13
```

2. Docker运行Etcd：

```perl
docker run -d \
-p 2379:2379 \
-p 2380:2380 \
--restart=always \
--mount type=bind,source=/opt/soft/etcd/data,destination=/etcd-data \
--name etcd \
quay.io/coreos/etcd:v3.5.13 \
/usr/local/bin/etcd \
--name s1 \
--data-dir /etcd-data \
--listen-client-urls http://0.0.0.0:2379 \
--advertise-client-urls http://0.0.0.0:2379 \
--listen-peer-urls http://0.0.0.0:2380 \
--initial-advertise-peer-urls http://0.0.0.0:2380 \
--initial-cluster s1=http://0.0.0.0:2380 \
--initial-cluster-token tkn \
--initial-cluster-state new \
--log-level info \
--logger zap \
--log-outputs stderr
```

**3 Docker查看Etcd版本及使用**


相关命令：

```
# 查看Etcd服务器版本
docker exec etcd /usr/local/bin/etcd --version

# 查看Etcd客户端版本
docker exec etcd /usr/local/bin/etcdctl version
docker exec etcd /usr/local/bin/etcdutl version

# 查看Etcd健康状况
docker exec etcd /usr/local/bin/etcdctl endpoint health

# Etcd添加数据
docker exec etcd /usr/local/bin/etcdctl put foo bar

# Etcd查看数据
docker exec etcd /usr/local/bin/etcdctl get foo

# Etcd查看所有数据
docker exec etcd /usr/local/bin/etcdctl get --prefix ""

# Etcd删除数据 
docker exec etcd /usr/local/bin/etcdctl del foo
```

执行结果：

```perl
[root@node1192 soft]# docker exec etcd /usr/local/bin/etcd --version
etcd Version: 3.5.13
Git SHA: c9063a0dc
Go Version: go1.21.8
Go OS/Arch: linux/amd64


[root@node1192 soft]# docker exec etcd /usr/local/bin/etcdctl version
etcdctl version: 3.5.13
API version: 3.5


[root@node1192 soft]# docker exec etcd /usr/local/bin/etcdutl version
etcdutl version: 3.5.13
API version: 3.5


[root@node1192 soft]# docker exec etcd /usr/local/bin/etcdctl endpoint health
127.0.0.1:2379 is healthy: successfully committed proposal: took = 5.561765ms


[root@node1192 soft]# docker exec etcd /usr/local/bin/etcdctl put foo bar
OK


[root@node1192 soft]# docker exec etcd /usr/local/bin/etcdctl get foo
foo
bar


[root@node1192 soft]# docker exec etcd /usr/local/bin/etcdctl get --prefix ""
foo
bar


[root@node1192 soft]# docker exec etcd /usr/local/bin/etcdctl del foo
1
```

