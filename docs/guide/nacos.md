# Nacos
---
aliases:
  - nacos
标题: nacos
---
**微服务治理：Nacos, Zookeeper, consul, etcd, Eureka**
**等 5 个常用微服务注册工具对比**


**笔记本：** nacos


**创建时…** 2024/5/20 17:31 **更新时…** 2024/5/20 17:43

# **微服务治理：Nacos,** **Zookeeper, consul, etcd,** **Eureka等 5 个常用微服务注册** **工具对比**


下面是 **Nacos** 、 **Zookeeper** 、 **Consul** 、 **etcd** 和


**Eureka** 这五个常用的注册中心的详细对比：


1. **Nacos** ：


**Nacos** 是由 HashiCorp 开发的高度可扩展和可靠


的服务发现、配置管理和服务网格解决方案。


它的架构基于一组服务器代理形成的共识组和与服


务器交互的许多客户端代理。


主要特点包括：


**服务发现** ：服务在 Nacos 中注册，客户端可以通


过 DNS 或 HTTP API 发现服务及其位置。


**健康检查** ：Nacos 监控已注册服务的健康状态，


确保只有健康的实例被服务发现查询返回。


**键值存储** ：用于存储配置数据和其他元数据的分布


式键值存储。


**服务网格** ：Nacos Connect 提供安全的服务间通


信，自动使用 TLS 加密和基于身份的授权。


**多数据中心** ：Nacos 支持多个数据中心，提供全


局视图以查看服务及其健康状态。


2. **Zookeeper** ：


**Zookeeper** 是一个分布式协调服务，提供键值存


储、领导者选举、分布式锁和屏障等功能。


它的架构基于一组服务器节点形成的共识组和与服


务器交互的许多客户端节点。


主要特点包括：


**键值存储** ：Zookeeper 提供了分布式、强一致性


的键值存储（称为 znodes）。


**观察机制** ：客户端可以订阅 znodes 的变化。


**领导者选举** ：Zookeeper 支持领导者选举，确保


只有一个节点负责协调分布式操作。


3. **Consul** ：


**Consul** 是一个云原生的配置管理和服务发现平


台。


它的架构基于一组服务器代理形成的共识组和与服


务器交互的许多客户端代理。


主要特点包括：


**服务发现** ：服务在 Consul 中注册，客户端可以通


过 DNS 或 HTTP API 发现服务及其位置。


**健康检查** ：Consul 监控已注册服务的健康状态，


确保只有健康的实例被服务发现查询返回。


**键值存储** ：用于存储配置数据和其他元数据的分布


式键值存储。


**服务网格** ：Consul Connect 提供安全的服务间通


信，自动使用 TLS 加密和基于身份的授权。


**多数据中心** ：Consul 支持多个数据中心，提供全


局视图以查看服务及其健康状态。


4. **etcd** ：


**etcd** 是一个开源的分布式键值存储，最初由


CoreOS 开发，现在是 Red Hat 的一部分。


它专注于强一致性和可靠性。


主要特点包括：


**键值存储** ：etcd 提供了分布式、强一致性的键值


存储。


**观察机制** ：etcd 支持订阅键或键范围的变化。


**事务** ：etcd 支持多键事务，实现多个键的原子更


新。


**租约** ：客户端可以创建有时限的租约，使键在租约


到期时自动过期。


**访问控制** ：etcd 支持基于角色的键和键范围访问


控制。


下面是 **Nacos** 、 **Zookeeper** 、 **Consul** 、 **etcd** 和


**Eureka** 这五个常用的注册中心的详细对比：



<img src="/img/nacos.pdf-2-0.png">2-0





服务在


Zookeeper


中注册，客


户端可以订



服务在


Consul


中注


册，客


户端可



服务


在


etcd


中注


册，



服务在


Eureka


中注册，


客户端可


以通过



**服**


**务**


**发**


**现**



服务在


Nacos


中注


册，客


户端可


阅 znodes


的变化。



以通过


DNS 或


HTTP


API 发


现服务


及其位


置。



客户


端可


以订


阅键


或键


范围


的变


化。



DNS 或


HTTP


API 发现


服务及其


位置。





以通过


DNS


或


HTTP


API 发


现服务


及其位


置。


|健<br>康<br>检<br>查|Nacos<br>监控已<br>注册服<br>务的健<br>康状<br>态 确<br>，<br>保只有<br>健康的<br>实例被<br>服务发<br>现查询<br>返回<br>。|Zookeeper<br>不直接提供<br>健康检查功<br>能 但可以<br>，<br>通过监控<br>znodes的<br>变化来实<br>现<br>。|Consul<br>监控已<br>注册服<br>务的健<br>康状<br>态 确<br>，<br>保只有<br>健康的<br>实例被<br>服务发<br>现查询<br>返回<br>。|etcd<br>不直<br>接提<br>供健<br>康检<br>查功<br>能<br>，<br>但可<br>以通<br>过监<br>控键<br>的变<br>化来<br>实<br>现<br>。|Eureka<br>监控已注<br>册服务的<br>健康状<br>态 确保<br>，<br>只有健康<br>的实例被<br>服务发现<br>查询返<br>回<br>。|
|---|---|---|---|---|---|
|**键**<br>**值**<br>**存**<br>**储**|分布式<br>键值存<br>储，用<br>于存储<br>配置数<br>据和其<br>他元数<br>据。|分布式、强<br>一致性的键<br>值存储（称<br>为<br>znodes），<br>用于存储配<br>置数据和其<br>他元数据。|分布式<br>键值存<br>储，用<br>于存储<br>配置数<br>据和其<br>他元数<br>据。|分布<br>式、<br>强一<br>致性<br>的键<br>值存<br>储，<br>用于<br>存储<br>配置<br>数据<br>和其<br>他元|分布式键<br>值存储，<br>用于存储<br>配置数据<br>和其他元<br>数据。|


数


据。

|观<br>察<br>机<br>制|支持订<br>阅键或<br>键范围<br>的变<br>化<br>。|支持订阅<br>znodes的<br>变化<br>。|支持订<br>阅键或<br>键范围<br>的变<br>化<br>。|支持<br>订阅<br>键或<br>键范<br>围的<br>变<br>化<br>。|支持订阅<br>键或键范<br>围的变<br>化<br>。|
|---|---|---|---|---|---|
|**事**<br>**务**|支持多<br>键事<br>务，实<br>现多个<br>键的原<br>子更<br>新。|不直接支持<br>事务，但可<br>以通过编程<br>实现。|不直接<br>支持事<br>务，但<br>可以通<br>过编程<br>实现。|支持<br>多键<br>事<br>务，<br>实现<br>多个<br>键的<br>原子<br>更<br>新。|不直接支<br>持事务，<br>但可以通<br>过编程实<br>现。|
|**租**<br>**约**|客户端<br>可以创<br>建有时<br>限的租<br>约，使<br>键在租<br>约到期<br>时自动<br>过期。|不直接支持<br>租约，但可<br>以通过编程<br>实现。|不直接<br>支持租<br>约，但<br>可以通<br>过编程<br>实现。|客户<br>端可<br>以创<br>建有<br>时限<br>的租<br>约，<br>使键<br>在租<br>约到<br>期时<br>自动<br>过<br>期。|不直接支<br>持租约，<br>但可以通<br>过编程实<br>现。|



支持


基于


角色



支持基于


角色的访


问控制。



**访**


**问**



支持基


于角色


的键和



支持基于角


色的访问控


制。



支持基


于角色


<img src="/img/nacos.pdf-5-0.png">5-0








**Nacos Win10 安装及配置（单机版）**


**笔记本：** nacos


**创建时…** 2024/4/2 0:21 **更新时…** 2024/4/2 0:22

# **Nacos Win10 安装及配置** **（单机版）**


**目录**


[一、Nacos 简介](https://blog.csdn.net/weixin_54699502/article/details/130790957#t1)


[二、下载安装包](https://blog.csdn.net/weixin_54699502/article/details/130790957#t2)


[三、程序包目录说明](https://blog.csdn.net/weixin_54699502/article/details/130790957#t3)


[1. 程序包目录](https://blog.csdn.net/weixin_54699502/article/details/130790957#t4)


[2. bin目录（启动脚本）](https://blog.csdn.net/weixin_54699502/article/details/130790957#t5)


[3. conf目录（配置文件）](https://blog.csdn.net/weixin_54699502/article/details/130790957#t6)


[4. 启动](https://blog.csdn.net/weixin_54699502/article/details/130790957#t7)


[4.1 修改脚本](https://blog.csdn.net/weixin_54699502/article/details/130790957#t8)


[4.2 命令启动](https://blog.csdn.net/weixin_54699502/article/details/130790957#t9)


[5. 登录 Nacos 管理平台](https://blog.csdn.net/weixin_54699502/article/details/130790957#t10)

## **一、Nacos 简介**


Dynamic Naming and Configuration Service的首字母
简称，一个更易于构建云原生应用的动态服务发现、配

置管理和服务管理平台。


Nacos 致力于帮助您发现、配置和管理微服务。Nacos

提供了一组简单易用的特性集，帮助您快速实现动态服

务发现、服务配置、服务元数据及流量管理。


Nacos 帮助您更敏捷和容易地构建、交付和管理微服

务平台。 Nacos 是构建以“服务”为中心的现代应用架
构 (例如微服务范式、云原生范式) 的服务基础设施。


[官网地址：https://nacos.io/](https://nacos.io/)

## **二、下载安装包**


地址：Release 2.2.2 (Apr 11, 2023) · alibaba/nacos ·

GitHub

## **三、程序包目录说明**

### **1. 程序包目录**


bin：启动脚本


conf : 配置文件

### **2. bin目录（启动脚本）**


bin目录中启动脚本分为window 和Linus 启动脚本 与

关闭脚本。



<img src="/img/nacos.pdf-7-0.png">7-0

<img src="/img/nacos.pdf-7-1.png">7-1
### **3. conf目录（配置文件）**

Nacos配置文件相关的目录。


①端口配置


Nacos的默认端口是：8848，如果需要更换默认端口

在application.properties文件中进行修改，如下图所

示：


② Nacos在win10 上的日志是乱码（解决）


打开 nacos-logback.xml文件中找到如下图所示：UTF8改为GBK。



<img src="/img/nacos.pdf-8-0.png">8-0

<img src="/img/nacos.pdf-8-1.png">8-1

<img src="/img/nacos.pdf-8-2.png">8-2
### **4. 启动**

Nacos启动模式有两种：cluster 集群模式 和

standalone 单机模式 。


如果以单机模式模式启动的话有两种方式：


①修改脚本文件的启动该模式为：standalone


②命令模式启动时指定模式为：standalone

#### **4.1 修改脚本**


在 bin 目录的 startup.cmd 文件中，找到 MODE ，
将其修改为 standalone 。


② 双击 startup.cmd  启动即可。



<img src="/img/nacos.pdf-9-0.png">9-0

<img src="/img/nacos.pdf-9-1.png">9-1

<img src="/img/nacos.pdf-9-2.png">9-2
#### **4.2 命令启动**

在 bin 目录 CMD 输入  startup.cmd -m standalone
回车 启动即可！

### **5. 登录 Nacos 管理平台**


Nacos 管理平台的地址 ： [http://localhost:8848/nacos](http://localhost:8848/nacos)


(默认端口是：8848， 如果有改动使用最新的端口号)


默认的用户名密码都是 ：nacos。



<img src="/img/nacos.pdf-10-0.png">10-0
