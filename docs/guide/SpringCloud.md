---
aliases:
  - SpringCloud
标题: SpringCloud
---
**深入SpringBoot：Apollo配置中心的集成与实现_springboot apollo**


**笔记本：** SpringCloud


**创建时间：** 2024/11/3 22:25 **更新时间：** 2026/1/8 2:32


**URL：** https://blog.csdn.net/qq_47183158/article/details/142211062

# **深入SpringBoot：Apollo配置中心的集成与实现**


**一、基本概念**


**1、背景**


随着程序功能的日益复杂，程序的配置日益增多，各种功能的开关、参数的配置、服务器的地


址……对程序配置的期望值也越来越高，配置修改后实时生效，灰度发布，分环境、分集群管理


配置，完善的权限、审核机制…… 在这样的大环境下，传统的通过配置文件、数据库等方式已


经越来越无法满足开发人员对配置管理的需求。因此 Apollo 配置中心应运而生！


**2、简介**


Apollo（阿波罗）是携程框架部门研发的开源配置管理中心，能够集中化管理应用不同环境、不


同集群的配置，配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性。


**3、特点**


部署简单


灰度发布


版本发布管理


提供开放平台API


客户端配置信息监控


提供和.Net原生客户端


配置修改实时生效（热发布）


权限管理、发布审核、操作审计


统一管理不同环境、不同集群的配置


**4、基础模型**


如下即是 Apollo 的基础模型：


(1)、用户在配置中心对配置进行修改并发布


(2)、配置中心通知Apollo客户端有配置更新


(3)、Apollo客户端从配置中心拉取最新的配置、更新本地配置并通知到应用


<img src="/img/SpringCloud.pdf-1-0.png">1-0

**5、Apollo 的四个维度**


**Apollo支持4个维度管理Key-Value格式的配置：**


application (应用)


environment (环境)


cluster (集群)


namespace (命名空间)


**(1)、application**


Apollo 客户端在运行时需要知道当前应用是谁，从而可以根据不同的应用来获取对应应用


的配置。


每个应用都需要有唯一的身份标识，可以在代码中配置 `app.id` 参数来标识当前应用，Apollo


会根据此指来辨别当前应用。


**(2)、environment**


在实际开发中，我们的应用经常要部署在不同的环境中，一般情况下分为开发、测试、生产等等


不同环境，不同环境中的配置也是不同的，在 Apollo 中默认提供了四种环境：


FAT（Feature Acceptance Test）：功能测试环境


UAT（User Acceptance Test）：集成测试环境


DEV（Develop）：开发环境


PRO（Produce）：生产环境


在程序中如果想指定使用哪个环境，可以配置变量 `env` 的值为对应环境名称即可。


**(3)、cluster**


一个应用下不同实例的分组，比如典型的可以按照数据中心分，把上海机房的应用实例分为


一个集群，把北京机房的应用实例分为另一个集群。


对不同的集群，同一个配置可以有不一样的值，比如说上面所指的两个北京、上海两个机房


设置两个集群，两个集群中都有 mysql 配置参数，其中参数中配置的地址是不一样的。


**(4)、namespace**


一个应用中不同配置的分组，可以简单地把 namespace 类比为不同的配置文件，不同类型的配


置存放在不同的文件中，如数据库配置文件，RPC 配置文件，应用自身的配置文件等。


熟悉 SpringBoot 的都知道，SpringBoot 项目都有一个默认配置文件 `application.yml` ，如果还想


用多个配置，可以创建多个配置文件来存放不同的配置信息，通过指定 `spring.profiles.active` 参


数指定应用不同的配置文件。这里的 `namespace` 概念与其类似，将不同的配置放到不同的配置


`namespace` 中。


Namespace 分为两种权限，分别为：


**public（公共的）：** public权限的 Namespace，能被任何应用获取。


**private（私有的）：** 只能被所属的应用获取到。一个应用尝试获取其它应用 private 的


Namespace，Apollo 会报 “404” 异常。


Namespace 分为三种类型，分别为：


**私有类型：** 私有类型的 Namespace 具有 private 权限。例如 application Namespace 为私


有类型。


**公共类型：** 公共类型的 Namespace 具有 public 权限。公共类型的N amespace 相当于游


离于应用之外的配置，且通过 Namespace 的名称去标识公共 Namespace，所以公共的


Namespace 的名称必须全局唯一。


**关联类型（继承类型）：** 关联类型又可称为继承类型，关联类型具有 private 权限。关联类


型的 Namespace 继承于公共类型的 Namespace，将里面的配置全部继承，并且可以用于


覆盖公共 Namespace 的某些配置。


**6、本地缓存**


Apollo客户端会把从服务端获取到的配置在本地文件系统缓存一份，用于在遇到服务不可用，或


网络不通的时候，依然能从本地恢复配置，不影响应用正常运行。


本地缓存路径默认位于以下路径，所以请确保/opt/data或C:/opt/data/目录存在，且应用有读写


权限。


**Mac/Linux：** /opt/data/{appId}/config-cache


**Windows：** C:/opt/data{appId}/config-cache


本地配置文件会以下面的文件名格式放置于本地缓存路径下：


**7、客户端设计**


<img src="/img/SpringCloud.pdf-3-0.png">3-0

**上图简要描述了Apollo客户端的实现原理**


客户端和服务端保持了一个长连接，从而能第一时间获得配置更新的推送。


客户端还会定时从 Apollo 配置中心服务端拉取应用的最新配置。


这是一个 fallback 机制，为了防止推送机制失效导致配置不更新


客户端定时拉取会上报本地版本，所以一般情况下，对于定时拉取的操作，服务端都会返回


304 - Not Modified


定时频率默认为每 5 分钟拉取一次，客户端也可以通过在运行时指定 `apollo.refreshInterval`


来覆盖，单位为分钟。


客户端从 Apollo 配置中心服务端获取到应用的最新配置后，会保存在内存中。


客户端会把从服务端获取到的配置在本地文件系统缓存一份 在遇到服务不可用，或网络不


通的时候，依然能从本地恢复配置。


应用程序从 Apollo 客户端获取最新的配置、订阅配置更新通知。


**配置更新推送实现**


前面提到了 Apollo 客户端和服务端保持了一个长连接，从而能第一时间获得配置更新的推送。


长连接实际上我们是通过 Http Long Polling 实现的，具体而言：


客户端发起一个 Http 请求到服务端


服务端会保持住这个连接 60 秒


如果在 60 秒内有客户端关心的配置变化，被保持住的客户端请求会立即返回，并告知客户


端有配置变化的 namespace 信息，客户端会据此拉取对应 namespace 的最新配置


如果在 60 秒内没有客户端关心的配置变化，那么会返回 Http 状态码 304 给客户端


客户端在收到服务端请求后会立即重新发起连接，回到第一步


考虑到会有数万客户端向服务端发起长连，在服务端我们使用了 async servlet(Spring


DeferredResult) 来服务 Http Long Polling 请求。


**8、总体设计**


<img src="/img/SpringCloud.pdf-4-0.png">4-0

上图简要描述了Apollo的总体设计，我们可以从下往上看：


Config Service 提供配置的读取、推送等功能，服务对象是 Apollo 客户端


Admin Service 提供配置的修改、发布等功能，服务对象是 Apollo Portal（管理界面）


Config Service 和 Admin Service 都是多实例、无状态部署，所以需要将自己注册到


Eureka 中并保持心跳


在 Eureka 之上我们架了一层 Meta Server 用于封装Eureka的服务发现接口


Client 通过域名访问 Meta Server 获取Config Service服务列表（IP+Port），而后直接通过


IP+Port 访问服务，同时在 Client 侧会做 load balance 错误重试


Portal 通过域名访问 Meta Server 获取 Admin Service 服务列表（IP+Port），而后直接通


过 IP+Port 访问服务，同时在 Portal 侧会做 load balance、错误重试


为了简化部署，我们实际上会把 Config Service、Eureka 和 Meta Server 三个逻辑角色部


署在同一个 JVM 进程中


**9、可用性考虑**


配置中心作为基础服务，可用性要求非常高，下面的表格描述了不同场景下Apollo的可用性：






|场景|影响|降级|原因|
|---|---|---|---|
|某台 config<br>service下线|无影响||Config service无<br>状态，客户端重连<br>其它config<br>service|
|||||


|所有config<br>service下线|客户端无法读取最<br>新配置 ，Portal无<br>影响|客户端重启时可<br>,<br>以读取本地缓存配<br>置文件|Col4|
|---|---|---|---|
|某台 admin<br>service下线|无影响||Admin service无<br>状态，Portal重连<br>其它 admin<br>service|
|所有 admin<br>service下线|客户端无影响，<br>portal无法更新配<br>置|||
|某台 portal下线|无影响||Portal域名通过slb<br>绑定多台服务器，<br>重试后指向可用的<br>服务器|
|全部 portal下线|客户端无影响，<br>portal无法更新配<br>置|||
|某个数据中心下线|无影响||多数据中心部署，<br>数据完全同步，<br>Meta<br>Server/Portal域<br>名通过 slb自动切<br>换到其它存活的数<br>据中心|


**二、Apollo 配置中心创建项目与配置**


**1、登录 Apollo**


打开地址登录 Apollo：


用户名：apollo


密 码：admin


**2、修改与增加部门数据**





<img src="/img/SpringCloud.pdf-5-0.png">5-0
在登录后创建项目时，选择部门默认只能选择 Apollo 自带的 测试部门1与测试部门2两个选项。


这是因为 Apoloo 没有修改或新增部门信息的管理节目，只能通过修改数据库，来新增或者修改


数据，这里打开 `Portal` 对月的数据库中的表 `ApolloPortalDB` 修改 `key` 为 `organizations` 的 `value` 的


json 数据，改成自己对于的部门信息。


**3、创建一个项目**


修改完数据库部门信息后，重新登录 Apollo Portal，然后创建项目，这时候选择部门可以看到已


经变成我们自己修改后的部门信息了，选择我们自定义部门，然后设置应用 ID 为 `apollo-test` ，


应用名为 `apollo-demo` 。



<img src="/img/SpringCloud.pdf-6-0.png">6-0

<img src="/img/SpringCloud.pdf-6-1.png">6-1

<img src="/img/SpringCloud.pdf-6-2.png">6-2
创建完成后进入配置管理界面


**4、创建一个配置参数**


创建一个配置参数，方便后续 Apollo 客户端项目引入该参数，进行动态配置测试。


设置 key 为 `test` value 为 `123456` 然后设置一个备注，保存。



<img src="/img/SpringCloud.pdf-7-0.png">7-0

<img src="/img/SpringCloud.pdf-7-1.png">7-1
<img src="/img/SpringCloud.pdf-8-0.png">8-0

创建完成后可以看到配置管理节目新增了一条配置。


接下来我们将此配置通过发布按钮，进行发布。


**三、创建 Apollo 客户端测试项目**


这里创建一个 SpringBoot 项目，引入 Apollo 客户端来来实现与 Apollo 配置中心服务端交互。


**1、Mavne 添加 Apollo 依赖**



<img src="/img/SpringCloud.pdf-8-1.png">8-1

<img src="/img/SpringCloud.pdf-8-2.png">8-2

<img src="/img/SpringCloud.pdf-8-3.png">8-3


<img src="/img/SpringCloud.pdf-9-0.png">9-0





**2、配置文件添加参数**


在 application.yml 配置文件中添加下面参数，这里简单介绍下 Apollo 参数作用：


**apollo.meta：** Apollo 配置中心地址。


**apollo.cluster：** 指定使用某个集群下的配置。


**apollo.bootstrap.enabled：** 是否开启 Apollo。


**apollo.bootstrap.namespaces ：** 指定使用哪个 Namespace 的配置，默认 application。


**apollo.cacheDir=/opt/data/some-cache-dir：** 为了防止配置中心无法连接等问题，Apollo


会自动将配置本地缓存一份。


**apollo.autoUpdateInjectedSpringProperties：** Spring应用通常会使用 Placeholder 来注


入配置，如${someKey:someDefaultValue}，冒号前面的是 key，冒号后面的是默认值。如


果想关闭 placeholder 在运行时自动更新功能，可以设置为 false。


**apollo.bootstrap.eagerLoad.enabled ：** 将 Apollo 加载提到初始化日志系统之前，如果


设置为 false，那么将打印出 Apollo 的日志信息，但是由于打印 Apollo 日志信息需要日志先


启动，启动后无法对日志配置进行修改，所以 Apollo 不能管理应用的日志配置，如果设置


为 true，那么 Apollo 可以管理日志的配置，但是不能打印出 Apollo 的日志信息。



<img src="/img/SpringCloud.pdf-9-1.png">9-1




```
 6

 7

 8

 9

 10

 11

 12

 13

 14

 15

 16

 17

 18

 19

 20

```

**3、创建测试 Controller 类**


写一个 Controller 类来输出 test 变量的值，使用了 `Spring` 的 `@Value` 注解，用于读取配置文件中


的变量的值，这里来测试该值，项目启动后读取到的变量的值是设置在 application 配置文件中


的默认值，还是远程 Apollo 中的值，如果是 Apollo 中配置的值，那么再测试在 Apollo 配置中心


中改变该变量的值后，这里是否会产生变化。



<img src="/img/SpringCloud.pdf-10-0.png">10-0



**4、创建启动类**


SpringBoot 项目启动类。



<img src="/img/SpringCloud.pdf-10-1.png">10-1





**5、JVM 启动参数添加启动参数**


JVM 参数中必须添加两个变量：


**如果是在 Idea 中启动，可以配置启动参数，加上：**




<img src="/img/SpringCloud.pdf-11-0.png">11-0

**如果是 java 命令启动程序，需要 JVM 加上:**


注意：上面 env 指定的环境，要和 apollo.meta 指定 Config 地址的环境一致，例如 -Denv=DEV
即使用开发环境，那么 apollo.meta=http://xxx.xxx.xxx:8080 这个url 的 Config 也是开发环境下
的配置中心服务，而不能是 PRO 或者其它环境下的配置中心。


**四、启动项目进行测试**


**1、测试是否能够获取 Apollo 中设置的值**


启动上面的测试用例，然后访问 http://localhost:8080/test，可以看到使用的是 Apollo 中配置的


`test` 参数的值 `123456` ，而不是默认的值。


test的值为:123456


**2、测试当 Apollo 中修改参数值后客户端是否能及时刷新**


修改 Apollo 配置中心参数 `test` 值为 `666666` ，然后再次发布。


发布完成后再次访问 http://localhost:8080/test，可以看到示例应用中的值已经改变为最新的


值。


test的值为:666666


**3、测试当 Apollo 执行配置回滚操作时客户端是否能及时改变**



<img src="/img/SpringCloud.pdf-11-2.png">11-2

<img src="/img/SpringCloud.pdf-11-3.png">11-3
回滚完成后状态将变为未发布状态，访问 http://localhost:8080/test，可以看到已经回滚到之前


的 `test` 配置的值了。


test的值为:123456


**4、测试当不能访问 Apollo 时客户端的变化**


这里将 JVM 参数中 Apollo 配置中心地址故意改错：


-Dapollo.configService=http://192.168.2.100:30002 -Denv=DEV

然后访问 http://localhost:8080/test 可以看到值为：


test的值为:123456


可以看到显示的值并不是我们定义的默认值，而还是 Apollo 配置中心配置的 `test` 参数的值。考


虑到由于 Apollo 会在本地将配置缓存一份，出现上面原因，估计是缓存生效。当客户端不能连


接到 Apollo 配置中心时候，默认使用本地缓存文件中的配置。


这里找到对应的缓存配置文件，删除缓存配置文件后，重启应用，可以看到输出的值为自己定义


的默认值。：


test的值为:默认值


**5、测试当 Apollo 中将参数删除后客户端的变化**


进入 Apollo 配置中心，删除之前创建的 `test` 参数，然后发布。


然后再次访问 http://localhost:8080/test，可以看到显示的是应用程序中设置的默认值。


test的值为:默认值


**五、对 Apollo 的 Cluster、Namespace 进行探究**


在 Apollo 中，配置可以根据不同的环境划分为 Dev（开发）、Prod（生产） 等环境，又能根据


区域划分为不同的 Cluster（集群），还能根据配置参数作用功能的不同划分为不同的


Namespace（命名空间），这里探究下，如何使用上述能力。


**1、不同环境下的配置**


**（1）Apollo 配置中心 PRO 环境添加参数**


打开 Apollo 配置中心，环境列表点击 PRO 环境，然后新增一条配置，和之前例子中参数保持


一致，都为 `test` 参数，创建完成后发布。



<img src="/img/SpringCloud.pdf-12-0.png">12-0
<img src="/img/SpringCloud.pdf-13-0.png">13-0

然后修改上面的示例项目，将配置参数指定为 PRO 环境:


**（2）示例项目修改 application.yml 配置文件**


把 `apollo.meta` 参数改成 RPO 的配置中心地址


**（3）示例项目修改 JVM 参数**


把 `apollo.configService` 参数改成 PRO 配置中心地址， `env` 参数的值改为 `PRO` 。



<img src="/img/SpringCloud.pdf-13-1.png">13-1



**（4）启动示例项目观察结果**


启动示例项目，访问 http://localhost:8080/test 查看信息：


test的值为:abcdefg

可以看到已经改成生成环境配置，所以在实际项目中，如果要更换环境，需要修改 JVM 参数


`env` （如果 Apollo 部署在 Kubernetes 环境中，还需要修改 `apollo.configService` 参数），和修


改 application.yml 配置文件的参数 `apollo.meta` 值。


**2、不同集群下的配置**


**（1）创建两个集群**


例如在开发过程中，经常要将应用部署到不同的机房，这里分别创建 `beijing` 、 `shanghai` 两个集


群。


<img src="/img/SpringCloud.pdf-14-0.png">14-0

<img src="/img/SpringCloud.pdf-14-1.png">14-1

<img src="/img/SpringCloud.pdf-14-2.png">14-2
**（2）两个集群都配置同样的参数不同的值**


在两个集群 `beijing` 与 `shanghai` 中，都统一配置参数 `test` ，并且设置不同的值。


**（3）修改集群配置参数，启动项目观察结果**


**指定集群为 beijing:**


启动示例项目，访问 http://localhost:8080/test 可以看到用的是 beijing 集群的配置：


test的值为:Cluster-BeiJing

**指定集群为 shanghai:**



<img src="/img/SpringCloud.pdf-15-0.png">15-0

<img src="/img/SpringCloud.pdf-15-1.png">15-1

<img src="/img/SpringCloud.pdf-15-2.png">15-2

<img src="/img/SpringCloud.pdf-15-3.png">15-3



启动示例项目，访问 http://localhost:8080/test 可以看到用的是 shanghai 集群的配置：


test的值为:Cluster-ShangHai


**3、不同命名空间下的配置**


**（1）创建两个命名空间**


命名空间有两种，一种是 public（公开），一种是 private 私有，公开命名空间所有项目都能读


取配置信息，而私有的只能 `app.id` 值属于该应用的才能读取配置。


这里创建 `dev-1` 与 `dev-2` 两个私有的命名空间。


<img src="/img/SpringCloud.pdf-16-0.png">16-0

<img src="/img/SpringCloud.pdf-16-1.png">16-1

<img src="/img/SpringCloud.pdf-16-2.png">16-2
**（2）两个集群都配置同样的参数不同的值**


在两个命名空间中，都统一配置参数 `test` ，并且设置不同的值，设置完后发布。


**（3）修改命名空间配置参数，启动项目观察结果**


**指定命名空间为 dev-1:**


启动示例项目，访问 http://localhost:8080/test 可以看到用的是 dev-1 命名空间的配置：


test的值为:dev-1 Namespace

**指定命名空间为 dev-2:**



<img src="/img/SpringCloud.pdf-17-0.png">17-0

<img src="/img/SpringCloud.pdf-17-1.png">17-1

<img src="/img/SpringCloud.pdf-17-2.png">17-2



<img src="/img/SpringCloud.pdf-17-3.png">17-3


**spring cloud中gateway存在的意义是什么**


**笔记本：** SpringCloud


**创建时间：** 2021/10/24 1:18 **更新时间：** 2021/10/24 1:19


**作者：** 彼岸樱速



<img src="/img/SpringCloud.pdf-18-0.png">18-0



在大型微服务系统中，网关是一个很重要的概念，它承载了很多这个系统的责任。


API网关是一个服务器，是系统的唯一入口。从面向对象设计的角度看，它与外观模式类似。API网
关封装了系统内部架构，为每个客户端提供一个定制的API。它可能还具有其它职责，如身份验
证、监控、负载均衡、缓存、请求分片与管理、静态响应处理。API网关方式的核心要点是，所有
的客户端和消费端都通过统一的网关接入微服务，在网关层处理所有的非业务功能。通常，网关也
是提供REST/HTTP的访问API。


网关应当具备以下功能：



<img src="/img/SpringCloud.pdf-18-1.png">18-1



以上功能对系统的稳定性和健壮性至关重要。


nginx和Spring Cloud Gateway在功能上是有一些重叠的地方，都可以做服务转发。但是网关在大型
微服务系统中是一个很重的角色，Spring Cloud Gateway是专为为网关的角色而设计的，功能强大，
而且是官方出品，所以在大型系统开发中基本上都会选用此组件。


而nginx只能实现一些上面所说的一部分功能，一般都是选择nginx做静态资源缓存和前端调用接口的
负载均衡。


现在前后端分离的系统一般都是如下设计：


nginx做静态资源服务器，前端页面调用后台接口时先请求到nginx，nginx负载均衡路由到后端网关
（gateway），然后网关做请求身份验证，服务路由，日志记录等等操作，再转发业务处理接口，处
理完返回数据。


**docker安装seata、nacos、nginx**


**笔记本：** SpringCloud


**创建时间：** 2021/10/22 23:47 **更新时间：** 2021/10/23 0:04


**作者：** 彼岸樱速



<img src="/img/SpringCloud.pdf-19-0.png">19-0
<img src="/img/SpringCloud.pdf-20-0.png">20-0


```
}
sofa {
serverAddr = "127.0.0.1:9603"

application = "default"
region = "DEFAULT_ZONE"
datacenter = "DefaultDataCenter"

cluster = "default"

group = "SEATA_GROUP"
addressWaitTime = "3000"
}
file {
name = "file.conf"
}
}

config {
```

`# file` 、 `nacos` 、 `apollo` 、 `zk` 、 `consul` 、 `etcd3`
```
type = "nacos"

nacos {
serverAddr = "192.168.10.155:8848"

namespace = "abb1451f-bc94-49a3-906d-0b0c9b843e69"
group = "SEATA_GROUP"
username = "nacos"

password = "nacos"
dataId = "seataServer.properties"
}
consul {
serverAddr = "127.0.0.1:8500"

aclToken = ""
}
apollo {
appId = "seata-server"
## apolloConfigService will cover apolloMeta
apolloMeta = "http://192.168.1.204:8801"
apolloConfigService = "http://192.168.1.204:8080"
namespace = "application"
apolloAccesskeySecret = ""
cluster = "seata"
}
zk {
serverAddr = "127.0.0.1:2181"

sessionTimeout = 6000

connectTimeout = 2000

username = ""

password = ""
nodePath = "/seata/seata.properties"
}
etcd3 {
serverAddr = "http://localhost:2379"
}
file {
name = "file.conf"
}
}
```

`#registry.conf` 如上


`#file.conf` 如下
```
## transaction log store, only used in seata-server
store {

```

`## store mode: file` 、 `db` 、 `redis`

```
mode = "db"

## rsa decryption public key
publicKey = ""
## file store property
file {
## store location dir

dir = "sessionStore"

# branch session size, if exceeded first try compress lockkey, still exceeded throws
exceptions
maxBranchSessionSize = 16384

# globe session size, if exceeded throws exceptions
maxGlobalSessionSize = 512

# file buffer size, if exceeded allocate new buffer
fileWriteBufferCacheSize = 16384

# when recover batch read size

sessionReloadReadSize = 100

# async, sync
flushDiskMode = async
}

## database store property
db {
## the implement of javax.sql.DataSource, such as
DruidDataSource(druid)/BasicDataSource(dbcp)/HikariDataSource(hikari) etc.
datasource = "druid"

## mysql/oracle/postgresql/h2/oceanbase etc.
dbType = "mysql"
driverClassName = "com.mysql.jdbc.Driver"
## if using mysql to store the data, recommend add rewriteBatchedStatements=true in jdbc
connection param
url = "jdbc:mysql://192.168.10.155:3306/seata?rewriteBatchedStatements=true"

```

<img src="/img/SpringCloud.pdf-22-0.png">22-0


**eureka原理**


**笔记本：** SpringCloud


**创建时间：** 2021/10/21 16:42 **更新时间：** 2021/10/21 17:06


**作者：** 彼岸樱速


Eureka是Netflix开源的一款提供服务注册和发现的产品，github地址
为 **github.com/Netflix/eure** 。


注册中心是分布式开发的核心组件之一，而eureka是spring cloud推荐的注册中心实现，


因此对于Java开发同学来说，还是有必要学习eureka的，特别是其架构及设计思想。


官方文档定义是：Eureka is a REST (Representational State Transfer) based service that
is primarily used in the AWS cloud for locating services for the purpose of load
balancing and failover of middle-tier servers. We call this service, the Eureka Server.
Eureka also comes with a Java-based client component,the Eureka Client, which
makes interactions with the service much easier. The client also has a built-in load
balancer that does basic round-robin load balancing.
Eureka是一个REST (Representational State Transfer)服务，它主要用于AWS云，用于定位
服务，以实现中间层服务器的负载平衡和故障转移，我们称此服务为Eureka服务器。Eureka
也有一个基于java的客户端组件，Eureka客户端，这使得与服务的交互更加容易，同时客户
端也有一个内置的负载平衡器，它执行基本的循环负载均衡。


Eureka提供了完整的Service Registry和Service Discovery实现，并且也经受住了Netflix自己
的生产环境考验，相对使用起来会比较省心（同时Spring Cloud还有一套非常完善的开源代码
来整合Eureka，所以使用起来非常方便）。


**eureka基础**


**eureka架构图**


**Eureka Server** ：提供服务注册和发现，多个Eureka Server之间会同步数据，做到状态一致
（最终一致性）
**Service Provider** ：服务提供方，将自身服务注册到Eureka，从而使服务消费方能够找到
**Service Consumer** ：服务消费方，从Eureka获取注册服务列表，从而能够消费服务


注意，上图中的3个角色都是逻辑角色，在实际运行中，这几个角色甚至可以是同一个项目
（JVM进程）中。


**自我保护机制**


自我保护机制主要在Eureka Client和Eureka Server之间存在网络分区的情况下发挥保护作用，
在服务器端和客户端都有对应实现。假设在某种特定的情况下（如网络故障）, Eureka Client和



<img src="/img/SpringCloud.pdf-23-0.png">23-0
Eureka Server无法进行通信，此时Eureka Client无法向Eureka Server发起注册和续约请求，
Eureka Server中就可能因注册表中的服务实例租约出现大量过期而面临被剔除的危险，然而此
时的Eureka Client可能是处于健康状态的（可接受服务访问），如果直接将注册表中大量过期
的服务实例租约剔除显然是不合理的，自我保护机制提高了eureka的服务可用性。


当自我保护机制触发时，Eureka不再从注册列表中移除因为长时间没收到心跳而应该过期的
服务，仍能查询服务信息并且接受新服务注册请求，也就是其他功能是正常的。这里思考
下，如果eureka节点A触发自我保护机制过程中，有新服务注册了然后网络回复后，其他
peer节点能收到A节点的新服务信息，数据同步到peer过程中是有网络异常重试的，也就是
说，是能保证最终一致性的。


**服务发现原理**


eureka server可以集群部署，多个节点之间会进行（异步方式）数据同步，保证数据最终一致
性，Eureka Server作为一个开箱即用的服务注册中心，提供的功能包括：服务注册、接收服务
心跳、服务剔除、服务下线等。需要注意的是，Eureka Server同时也是一个Eureka Client，在
不禁止Eureka Server的客户端行为时，它会向它配置文件中的其他Eureka Server进行拉取注
册表、服务注册和发送心跳等操作。


eureka server端通过 `appName` 和 `instanceInfoId` 来唯一区分一个服务实例，服务实例信息是保存
在哪里呢？其实就是一个Map中：



<img src="/img/SpringCloud.pdf-24-0.png">24-0



**服务注册**


Service Provider启动时会将服务信息（InstanceInfo）发送给eureka server，eureka server
接收到之后会写入registry中，服务注册默认过期时间 `DEFAULT_DURATION_IN_SECS = 90` 秒。
InstanceInfo写入到本地registry之后，然后同步给其他peer节点，对应方法
**com.netflix.eureka.registry.PeerAwareInstanceRegistryImpl#replicateToPeers** 。


**写入本地registry**


服务信息（InstanceInfo）保存在Lease中，写入本地registry对应方法

据覆盖。使用InstanceInfo创建一个新的InstanceInfo：



<img src="/img/SpringCloud.pdf-24-2.png">24-2


不知道小伙伴看了上述方法的代码有没有这样的疑问？


通过读锁并且 `registry` 的读取和写入不是原子的，那么在并发时其实是有可能发生数据覆盖
的，如果发生数据覆盖岂不是有问题了！猛一看会以为脏数据不就是有问题么？换个角度
想，脏数据就一定有问题么？
其实针对这个问题，eureka的处理方式是没有问题的，该方法并发时，针对InstanceInfo
Lease的构造，二者的信息是基本一致的，因为registrationTimestamp取的就是当前时间，
所以并发的数据不会产生问题。


**同步给其他peer**


InstanceInfo写入到本地registry之后，然后同步给其他peer节点，对应方法
**com.netflix.eureka.registry.PeerAwareInstanceRegistryImpl#replicateToPeers** 。如果当前节点
接收到的InstanceInfo本身就是另一个节点同步来的，则不会继续同步给其他节点， **避免形成**
**“广播效应”** ；InstanceInfo同步时会排除当前节点。


InstanceInfo的状态有依以下几种： `Heartbeat, Register, Cancel, StatusUpdate,`
`DeleteStatusOverride` ，默认情况下同步操作时批量异步执行的，同步请求首先缓存到Map
中，key为 `requestType+appName+id` ，然后由发送线程将请求发送到peer节点。


Peer之间的状态是采用异步的方式同步的，所以不保证节点间的状态一定是一致的，不过基
本能保证最终状态是一致的。结合服务发现的场景，实际上也并不需要节点间的状态强一
致。在一段时间内（比如30秒），节点A比节点B多一个服务实例或少一个服务实例，在业务
上也是完全可以接受的（Service Consumer侧一般也会实现错误重试和负载均衡机制）。所
以按照CAP理论，Eureka的选择就是放弃C，选择AP。
如果同步过程中，出现了异常怎么办呢，这时会根据异常信息做对应的处理，如果是读取超
时或者网络连接异常，则稍后重试；如果其他异常则打印错误日志不再后续处理。


**服务续约**


Renew（服务续约）操作由Service Provider定期调用，类似于heartbeat。主要是用来告诉
Eureka Server Service Provider还活着，避免服务被剔除掉。renew接口实现方式和register
基本一致：首先更新自身状态，再同步到其它Peer，服务续约也就是把过期时间设置为当前时
间加上duration的值。


注意：服务注册如果InstanceInfo不存在则加入，存在则更新；而服务预约只是进行更新，
如果InstanceInfo不存在直接返回false。


**服务下线**


Cancel（服务下线）一般在Service Provider shutdown的时候调用，用来把自身的服务从
Eureka Server中删除，以防客户端调用不存在的服务，eureka从本地”删除“（设置为删除状
态）之后会同步给其他peer，对应方法
**com.netflix.eureka.registry.PeerAwareInstanceRegistryImpl#cancel** 。


**服务失效剔除**


Eureka Server中有一个EvictionTask，用于检查服务是否失效。Eviction（失效服务剔除）用
来定期（默认为每60秒）在Eureka Server检测失效的服务，检测标准就是超过一定时间没有
Renew的服务。默认失效时间为90秒，也就是如果有服务超过90秒没有向Eureka Server发起
Renew请求的话，就会被当做失效服务剔除掉。失效时间可以通过


服务剔除#evict方法中有很多限制，都是为了保证Eureka Server的可用性：比如自我保护时期
不能进行服务剔除操作、过期操作是分批进行、服务剔除是随机逐个剔除，剔除均匀分布在所有


应用中，防止在同一时间内同一服务集群中的服务全部过期被剔除，以致大量剔除发生时，在未
进行自我保护前促使了程序的崩溃。


**eureka server/client流程**


**服务信息拉取**


Eureka consumer服务信息的拉取分为全量式拉取和增量式拉取，eureka consumer启动时进
行全量拉取，运行过程中由定时任务进行增量式拉取，如果网络出现异常，可能导致先拉取的数
据被旧数据覆盖（比如上一次拉取线程获取结果较慢，数据已更新情况下使用返回结果再次更
新，导致数据版本落后），产生脏数据。对此，eureka通过类型AtomicLong的
fetchRegistryGeneration对数据版本进行跟踪，版本不一致则表示此次拉取到的数据已过期。

fetchRegistryGeneration过程是在拉取数据之前，执行 `fetchRegistryGeneration.get` 获取
当前版本号，获取到数据之后，通过 **fetchRegistryGeneration.compareAndSet** 来判断当前版
本号是否已更新。
注意：如果增量式更新出现意外，会再次进行一次全量拉取更新。


**Eureka server的伸缩容**


Eureka Server是怎么知道有多少Peer的呢？Eureka Server在启动后会调用


这个方法的默认实现是从配置文件读取，所以如果Eureka Server节点相对固定的话，可以通过
在配置文件中配置来实现。如果希望能更灵活的控制Eureka Server节点，比如动态扩容/缩容，
那么可以 `override getEurekaServerServiceUrls` 方法，提供自己的实现，比如我们的项目中会
通过数据库读取Eureka Server列表。


eureka server启动时把自己当做是Service Consumer从其它Peer Eureka获取所有服务的注
册信息。然后对每个服务信息，在自己这里执行Register，isReplication=true，从而完成初
始化。


**Service Provider**


Service Provider启动时首先时注册到Eureka Service上，这样其他消费者才能进行服务调用，
除了在启动时之外，只要实例状态信息有变化，也会注册到Eureka Service。需要注意的是，需

Server Url上，如果注册出现异常，则会继续注册其他的url。


Renew操作会在Service Provider端定期发起，用来通知Eureka Server自己还活着。 这里
`instance.leaseRenewalIntervalInSeconds` 属性表示Renew频率。默认是30秒，也就是每30秒
会向Eureka Server发起Renew操作。这部分逻辑在HeartbeatThread类中。在Service
Provider服务shutdown的时候，需要及时通知Eureka Server把自己剔除，从而避免客户端调
用已经下线的服务，逻辑本身比较简单，通过对方法标记@PreDestroy，从而在服务
shutdown的时候会被触发。


**Service Consumer**


Service Consumer这块的实现相对就简单一些，因为它只涉及到从Eureka Server获取服务列

地有一份Service Registries缓存，所以需要定期更新，定期更新频率可以通过
`eureka.client.registryFetchIntervalSeconds` 配置。


**小结**


为什么要用eureka呢，因为分布式开发架构中，任何单点的服务都不能保证不会中断，因此需
要服务发现机制，某个节点中断后，服务消费者能及时感知到保证服务高可用。从eureka的设
计与实现上来说还是容易理解的，SpringCloud将它集成在自己的子项目spring-cloud-netflix
中，实现SpringCloud的服务发现功能。


注册中心除了用eureka之外，还有zookeeper、consul、nacos等解决方案，他们实现原理不
同，各自适用于不同的场景，可按需使用。


**Eureka比ZooKeeper相比优势是什么**


**Zookeeper保证CP** 当向注册中心查询服务列表时，我们可以容忍注册中心返回的是几分钟以
前的注册信息，但不能接受服务直接down掉不可用。也就是说，服务注册功能对可用性的要求
要高于一致性。但是zk会出现这样一种情况，当master节点因为网络故障与其他节点失去联系
时，剩余节点会重新进行leader选举。问题在于，选举leader的时间太长，30 ~ 120s, 且选举
期间整个zk集群都是不可用的，这就导致在选举期间注册服务瘫痪。在云部署的环境下，因网
络问题使得zk集群失去master节点是较大概率会发生的事，虽然服务能够最终恢复，但是漫长
的选举时间导致的注册长期不可用是不能容忍的。


**Eureka保证AP** Eureka看明白了这一点，因此在设计时就优先保证可用性。Eureka各个节点都
是平等的，几个节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务。
而Eureka的客户端在向某个Eureka注册或时如果发现连接失败，则会自动切换至其它节点，只
要有一台Eureka还在，就能保证注册服务可用(保证可用性)，只不过查到的信息可能不是最新的
(不保证强一致性)。除此之外，Eureka还有一种自我保护机制，如果在15分钟内超过85%的节
点都没有正常的心跳，那么Eureka就认为客户端与注册中心出现了网络故障。


**eureka有哪些不足：** eureka consumer本身有缓存，服务状态更新滞后，最常见的状况就是，
服务下线了但是服务消费者还未及时感知，此时调用到已下线服务会导致请求失败，只能依靠
consumer端的容错机制来保证。


**Eureka的工作原理如下图**
实际上，在推送请求和拉取请求这件事上，推送注册表是一个写操作，而拉取注册表是一个读
操作。写与读是有一个冲突的问题的，在eureka中为了避免读写的冲突，采用了多级缓存，延
迟加载，通过最终一致性来解决读写冲突。


**Eureka满足AP，无法满足C。（Zookeeper是CP模型）**


1.Eureka集群间同步，无法保证强一致性。


2.每个Eureka服务里面的 **三级缓存（readCacheMap，readWrtiteCacheMap，register）**
也不保证C，最差情况下，服务列表在30秒内不一致（无法满足数据强一致性）。



<img src="/img/SpringCloud.pdf-27-0.png">27-0


<img src="/img/SpringCloud.pdf-28-0.png">28-0

**3 eureka优雅停服**
**3.1 Eureka自我保护**
**3.1.1 自我保护的条件**





**3.1.2 Eureka Server收不到微服务的心跳**



<img src="/img/SpringCloud.pdf-28-2.png">28-2



**3.1.3 eureka阀值**





**3.2 为什么需要eureka自我保护**



<img src="/img/SpringCloud.pdf-28-4.png">28-4



**3.3 关闭自我保护**
**修改 Eureka Server 配置文件**





**3.4 优雅停服**
**3.4.1 不需要在Eureka Server中配置关闭自我保护**
**3.4.2 添加actator的坐标依赖**




<img src="/img/SpringCloud.pdf-29-0.png">29-0

**3.4.3 修改properties文件**





**3.4.4 发送关闭服务的URL请求**

<img src="/img/SpringCloud.pdf-29-1.png">29-1

**post请求**





**main方法发送**



<img src="/img/SpringCloud.pdf-29-2.png">29-2



在main方法发送后，就可以在本地看到启动的服务自己就关闭了，也可以在服务注册管理页面
查看


**CAP原理**


**笔记本：** SpringCloud


**创建时间：** 2021/10/21 16:05 **更新时间：** 2021/10/21 16:53


**作者：** 彼岸樱速


**CAP原则(CAP定理)**



<img src="/img/SpringCloud.pdf-30-0.png">30-0





|原则分类|详解|
|---|---|
|**C**<br>数据一致性(Consistency)|也叫做数据原子性系统在执行某项操作后仍然处<br>于一致的状态。 在分布式系统中， 更新操作执<br>行成功后所有的用户都应该读到最新的值，这样<br>的系统被认为是具有强一致性的。 等同于所有节<br>点访问同一份最新的数据副本|
|**A**<br>服务可用性(Availablity)|每一个操作总是能够在一定的时间内返回结果，<br>这里需要注意的是一定时间内和返回结果。 一定<br>时间内指的是，在可以容忍的范围内返回结果，<br>结果可以是成功或者是失败|
|**P**<br>分区容错性(Partition-torlerance)|在网络分区的情况下， 被分隔的节点仍能正常对<br>外提供服务(分布式集群， 数据被分布存储在不<br>同的服务器上， 无论什么情况， 服务器都能正<br>常被访问)|


**分区容错性重点讲解**





<img src="/img/SpringCloud.pdf-30-1.png">30-1


<img src="/img/SpringCloud.pdf-31-0.png">31-0



**如何舍弃**
定律： 任何分布式系统只可同时满足二点，没法三者兼顾






|三者择其二|分析|
|---|---|
|CA， 放弃 P|如果想避免分区容错性问题的发生， 一种做法是<br>将所有的数据(与事务相关的)都放在一台机器上。<br>虽然无法 100%保证系统不会出错， 单不会碰到<br>由分区带来的负面效果。 当然这个选择会严重的<br>影响系统的扩展性|
|CP， 放弃 A|相对于放弃"分区容错性"来说， 其反面就是放弃<br>可用性。一旦遇到分区容错故障， 那么受到影响<br>的服务需要等待一定时间， 因此在等待时间内系<br>统无法对外提供服务|
|AP， 放弃 C|这里所说的放弃一致性，**并不是完全放弃数据一**<br>**致性，而是放弃数据的强一致性**， **而保留数据的**<br>**最终一致性**。 以网络购物为例， 对只剩下一件库<br>存的商品， 如果同时接受了两个订单， 那么较晚<br>的订单将被告知商品告罄|



**Eureka比ZooKeeper相比优势是什么**


**Zookeeper保证CP**


当向注册中心查询服务列表时，我们可以容忍注册中心返回的是几分钟以前的注册信息，但不能
接受服务直接down掉不可用。也就是说，服务注册功能对可用性的要求要高于一致性。但是zk
会出现这样一种情况，当master节点因为网络故障与其他节点失去联系时，剩余节点会重新进
行leader选举。问题在于，选举leader的时间太长，30 ~ 120s, 且选举期间整个zk集群都是不
可用的，这就导致在选举期间注册服务瘫痪。在云部署的环境下，因网络问题使得zk集群失去
master节点是较大概率会发生的事，虽然服务能够最终恢复，但是漫长的选举时间导致的注册
长期不可用是不能容忍的。


**Eureka保证AP**


Eureka看明白了这一点，因此在设计时就优先保证可用性。Eureka各个节点都是平等的，几个
节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务。而Eureka的客
户端在向某个Eureka注册或时如果发现连接失败，则会自动切换至其它节点，只要有一台
Eureka还在，就能保证注册服务可用(保证可用性)，只不过查到的信息可能不是最新的(不保证
强一致性)。除此之外，Eureka还有一种自我保护机制，如果在15分钟内超过85%的节点都没有
正常的心跳，那么Eureka就认为客户端与注册中心出现了网络故障。


**eureka有哪些不足**


eureka consumer本身有缓存，服务状态更新滞后，最常见的状况就是，服务下线了但是服务
消费者还未及时感知，此时调用到已下线服务会导致请求失败，只能依靠consumer端的容错机
制来保证。


