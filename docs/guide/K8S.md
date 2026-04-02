# K8S
---
aliases:
  - K8S
标题: K8S
---
**K8S简介和安装部署详细教程**


**笔记本：** k8S


**创建时间：** 2024/5/20 22:14 **更新时间：** 2024/5/20 22:32

# **K8S简介和安装部署详细教程**


**一、K8S简介**


Kubernetes中文官网：Kubernetes


GitHub：github.com/kubernetes/kubernetes


Kubernetes简称为K8s，是用于自动部署、扩缩和管理容器化应用程序的开源系统，起源于

Google 集群管理工具Borg。


**Kubernetes集群组件逻辑图**


k8s集群属于Master-Slave主从架构，Master节点负责集群管理和资源调度，用于运行控制平面

组件(Control Plane Components)，Slave节点就是工作负载节点，一般称为Node节点，也叫

Worker节点，主要负责运行Pod，一个Pod里可以同时运行多个容器，而容器一般封装的就是基


于Dokcer打包的应用，Pod英文叫豌豆荚，每个容器就像是一颗豌豆，简单来说Pod就是一组容


器。


**Master节点组件及功能**


|组件名称|功能用途|
|---|---|
|kube-apiserver|负责处理接受请求。|
|etcd|高可用键值存储，用于k8s集群的后台数据库。|
|kube-scheduler|负责选择Worker节点运行新创建的Pod，需要考虑的因素包括资源需求，软硬<br>件及策略约束，亲和性和反亲和性规范、数据位置等。|
|kube-controller-|负责运行不同类型的控制器进程，每个控制器都是一个单独进程，常见的控制|



<img src="/img/K8S.pdf-0-0.png">0-0
|manager|器有节点控制器（NodeController） 任务控制器（JobController） 端点分<br>、 、<br>片控制器（EndpointSlice controller） 、服务账号控制器（ServiceAccount<br>controller）等<br>。|
|---|---|
|cloud-controller-<br>manager|用于嵌入特定的云平台的控制器。|
|||



**Slave节点组件及功能**



|组件名称|功能用途|
|---|---|
|kubelet|负责管理Node节点上容器的健康运行，通过接收一组PodSpecs来实现，每个<br>Node节点上都会运行一个kubelet，不会管理不是由 Kubernetes创建的容器。|
|kube-proxy|负责Node节点上的网络代理，用于维护网络规则，这些规则允许从集群内部或<br>外部与Pod进行网络通信，每个Node节点上都会运行一个kube-proxy，k8s的<br>Service就是利用该组件实现的。|
|Container Runtime|负责管理容器的执行和生命周期。支持多种类型的容器运行时环境，比如<br>containerd、 CRI-O及CRI自定义实现，k8s使用容器运行时接口<br>(CRI)和用户选择的容器运行时交互。|
|||


**安装部署**





生产环境部署k8s主要有两种方式：


**二进制包**


Github下载稳定版的二进制包，手动部署每个组件组成k8s集群。


**kubeadm工具**


使用Kubeadm工具可以快速搭建一个k8s集群，主要包括初始化控制平面节点和加入Worker节


点，提供的主要功能如下：


**kubeadm init：** 初始化一个Master节点


**kubeadm join：** 将Worker节点加入集群


**kubeadm upgrade：** 升级K8s版本


**kubeadm token：** 管理 kubeadm join 使用的令牌


**kubeadm reset：** 清空 kubeadm init 或者 kubeadm join 对主机所做的任何更改


**kubeadm version：** 打印 kubeadm 版本


**kubeadm alpha：** 预览可用的新功能


**二、准备工作**


**软硬件要求**


Linux操作系统，Ubuntu 或 CentOS


每台节点至少2G


Master节点至少2C


集群节点网络互通


**集群规划**

|操作系统|CentOSLinuxrelease792009x86 64<br>. . _|
|---|---|
|Docker|v24.0.6|
|k8s|v1.20.9|
|kubeadm|v1.20|


|主机|角色|IP|CPU|内存|
|---|---|---|---|---|
|node1|Master|192.168.5.10|16C|40G|
|node2|Node|192.168.5.11|16C|40G|
|node3|Node|192.168.5.12|16C|40G|



**环境配置**


**修改hosts配置**


配置所有节点的IP和域名映射



<img src="/img/K8S.pdf-2-0.png">2-0



**配置SSH免密登录**


先生成公钥对，再把公钥远程复制到所有节点。



<img src="/img/K8S.pdf-2-1.png">2-1





**关闭Swap分区**


kubelet要求必须禁用交换分区，所以kubeadm初始化时回检测swap是否关闭，如果没有关闭会

报错，如果不想关闭安装时命令行可以指定-ignore-preflight-errors=Swap，关闭Swap分区在所

有节点上执行如下命令:



<img src="/img/K8S.pdf-2-2.png">2-2




**禁用SELinux**


所有节点执行如下命令：



**关闭防火墙**


所有节点执行如下命令：





**修改内核参数**



<img src="/img/K8S.pdf-3-2.png">3-2





**配置集群时钟同步**


Centos7默认使用Chrony工具而非NTP进行时间同步，修改硬件时钟为UTC，时区为本地时

区，所有节点执行如下修改：



<img src="/img/K8S.pdf-3-3.png">3-3





**配置k8s的Yum源**


国外yum源因为网络问题下载比较慢，此处修改为国内aliyun，用于安装k8s各个组件。



<img src="/img/K8S.pdf-3-4.png">3-4


<img src="/img/K8S.pdf-4-0.png">4-0



**三、安装Docker**


k8s运行需要容器运行环境，每个节点都需要安装Docker，详细安装教程可参考我的另一篇博

客：在Centos系统中安装、体验和卸载Docker_猫吃了源码的博客-CSDN博客


**四、安装K8S集群**


**安装三大组件-kubeadm、kubelet、kubectl**


kubeadm：用来初始化k8s集群的指令。


kubelet：在集群的每个节点上用来启动 Pod 和容器等。


kubectl：用来与k8s集群通信的命令行工具，查看、创建、更新和删除各种资源。



<img src="/img/K8S.pdf-4-1.png">4-1







**初始化k8s集群**


apiserver-advertise-address：apiserver监听地址


control-plane-endpoint：控制平面的IP地址或DNS名称


image-repository：镜像仓库，此处为国内阿里云镜像仓库加速下载


service-cidr：为Service分配的IP地址段


pod-network-cidr：为pod分配的IP地址段



<img src="/img/K8S.pdf-4-2.png">4-2





初始化需要下载多个镜像，可能时间比较久，最终安装的镜像如下：



<img src="/img/K8S.pdf-4-3.png">4-3



成功界面：


<img src="/img/K8S.pdf-5-0.png">5-0



要使非root用户运行kubectl，请执行以下命令，这也是上面kubeadm init输出的一部分：



<img src="/img/K8S.pdf-5-1.png">5-1



如果是root用户，则可以执行以下命令：





记住上面输出的kubeadm join命令，下面用该命令将节点加入集群。


**加入节点**


所有Node节点执行如下命令：





查看token列表，可观察到每个token的剩余有效时间



<img src="/img/K8S.pdf-5-4.png">5-4



默认token有效期为24小时，过期之后token失效，可重新生成token：





修改角色：



<img src="/img/K8S.pdf-5-6.png">5-6





**安装网络插件**


Calico是一套开源的纯三层的虚拟化网络解决方案，是目前K8s主流的网络方案。它把每个节点


都作为一个虚拟路由器，把Pod当做路由器上一个终端设备为其分配一个IP地址，通过BGP协议


生成路由规则，实现不同节点上的Pod网络互通。


<img src="/img/K8S.pdf-6-0.png">6-0

<img src="/img/K8S.pdf-6-1.png">6-1



**五、测试K8S集群**


**创建nginx pod**


默认会在默认命名空间default中创建一个名称为mynignx的deployment，同时会创建一个名称以

myniginx为前缀，叫mynginx-5b686ccd46-wshz6的Pod。



<img src="/img/K8S.pdf-6-2.png">6-2



**对外暴露访问**


基于第一步创建的deployment再创建一个名叫mynginx的Service，资源类型由--type=ClusterIP

修改为--type=NodePort，会在每个Node节点上监听30161端口，用于接收集群外部访问。



<img src="/img/K8S.pdf-6-3.png">6-3



**访问nginx**


浏览器输入`<任意一个节点IP>`:`<port>`，都可以访问nginx首页表示测试成功。


<img src="/img/K8S.pdf-7-0.png">

**六、安装Dashboard**


k8s官方提供了一个简单的Dashboard，主要提供工作负载，服务，配置和存储，集群等管理功


能。


[Github：github.com/kubernetes/dashboard](https://github.com/kubernetes/dashboard)


**通过kubectl命令安装**


对外暴露访问端口，由--type=ClusterIP修改为--type=NodePort





查看service



<img src="/img/K8S.pdf-7-3.png">7-3



[浏览器输入访问地址：https://192.168.5.10:31128/，需要token才能访问。](https://192.168.5.10:31128/)


**创建访问账号**



<img src="/img/K8S.pdf-7-4.png">7-4

<img src="/img/K8S.pdf-7-5.png">7-5




<img src="/img/K8S.pdf-8-0.png">8-0







**获取token**



<img src="/img/K8S.pdf-8-1.png">8-1















**登录界面**


输入上面的token，进入dashboard首页



<img src="/img/K8S.pdf-8-2.png">8-2
**K8S系列四：服务管理**


**笔记本：** k8S


**创建时间：** 2024/5/20 22:00 **更新时间：** 2024/5/20 22:08


**写在前面**


本文是K8S系列第四篇，主要面向对k8s新手同学。阅读本文需要读者对k8s的基本概念，比如


`Pod` 、 `Deployment` 、 `Service` 、 `Namespace` 等基础概念有所了解，尚且不了解的同学推荐先阅读本系列的


第一篇文章《K8S系列一：概念入门》[1]；阅读本文还需要读者对k8s的服务部署有一定深入的


了解，特别是怎么通过 `Pod` 部署自己的服务，尚且不熟悉的同学推荐阅读本系列前一篇文章


《K8S系列三：单服务部署》[2]。


本文旨在讲述如何基于k8s集群管理一群服务，包括如何做 **高可用（Hight Available，HA）部**


**署** 和管理、如何做服务 **平滑升级** 、如何隔离不同业务的服务等。因此，本文将重点介绍以下的


k8s对象/资源（API Resource）：




`Deployment` ：无状态、多服务管理




`StatefulSet` ：有状态、多服务管理




`Namespace` ：不同服务资源隔离


**0. 为什么需要服务管理？**


正文开始之前，我们需要统一一个观点：日常生产中所说的“服务”，或者说是传统的“服


务”，对应的是k8s的 `Pod` 对象（因为k8s有一个 `Service` 对象，经常被翻译和理解为服务，其实也


没啥毛病）。


在上一篇文章《K8S系列三：单服务部署》[2]中，详细介绍了如何在k8s集群中部署一个可用的


服务，包括容器环境的使用、数据卷的挂载、配置文件的使用、服务网络的配置。k8s会根据提


交的 `Pod` 的yaml文件 **自动** 拉取镜像、挂载数据和配置文件、流量负载均衡器等以确保镜像容器内

的服务正常运行。


这个难道还不足够么？还需要做什么呢？


答案是不够，因为还需要把部署在k8s集群上的服务更有效地管理起来，即服务管理。于是问题


又来了： **什么是服务管理？或者说，为什么需要服务管理？**


我们来考虑几个场景：


**场景一**


**高可用（Hight Available，HA）** 。虽然在实际生产中，后台服务架构设计原则没有统一的标


准，不过，大部分后台服务必须考虑 **“三高”** 的问题： **高并发、高性能、高可用** 。前两天看到一


个非常有趣的话题：


面试官问：“如果线上请求量大，服务扛不住了怎么办？”


我毫不犹豫：“加机器！”


话糙理不糙啊，加机器扩充服务实例绝对是首选（正经来说，面试官实际想听到的是对“三高”


的理解、具体解决措施等）！仔细分析“加机器”这个操作，其实就是高可用的一种很有效的解


决手段，而且在实际生产中往往一个程序也会部署几个服务实例，并且为了做有效容灾，服务实


例会分布在不同的机器、机房、区域。


那么， **“部署多个服务实例”的事情，仅仅用** **`Pod`** **不能完成么？**


显然是可以的，做法也挺简单的：准备好 **N** 份 `Pod` 的yaml文件，设置好正确的镜像地址、挂载的

数据卷、配置，以及配置好网络，只需要确保这 **N** 份yaml文件除了名字之外其余内容完全相

同，譬如pod_1,pod_2,...,pod_n；接着用 `kubectl` 工具提交给k8s集群， **N** 个服务实例就部署好


了。


完美！


但是，上述操作存在问题：不方便。


比如，部署后发现分配的CPU和内存资源太少了，需要修改 `Pod` 的yaml文件。这个时候就是灾难

了，因为你得人为修改这 **N** 份yaml文件。且不说损耗人力，更重要的是极易出错！就算是用


shell脚本，你也会发现用起来没那么顺畅。


**场景二**


其次，实际生产中，服务发布上线之后，总是免不了迭代（谁还不会写一两个Bug了；客户/产

品经理的需求单岂是一两次就提完了的）。这就意味着必须升级线上服务。


还是一样的问题： **替换升级线上的服务，仅仅用** **`Pod`** **不能完成么？**


也是可以的。做法也不复杂：首先把k8s集群中已经部署的 `Pod` 服务删除，然后再把修改好的 **N** 份


`Pod` 的yaml文件提交给k8s完成部署；或者直接修改（ `kubectl edit pod xxx` ）线上服务的配置信

息，k8s会先删除老 `Pod` 再创建新的 `Pod` 。


不过，这种操作会有个很大的问题： **在删除** **`Pod`** **和新建** **`Pod`** **中间，会有一段时间无法正常服务，客**


**户端请求全部失败。** 这就需要衡量你的服务是否能够接受这样子的“缺陷”；当然，你可以通过


选择请求流量最小（譬如晚上）操作，也可以提前告知用户接下来某个时间段要更新服务、这个


时间内不要向我发送请求。


但是在更多的实际生产场景中，上面的“缺陷”是不会被允许的。


其实，你也可以选择这么部署：再准备 **N** 份 `Pod` 的yaml文件，名字换另一组，譬如

pod_n+1,pod_n+2,...,pod_n+n，然后，先提交部署新的 **N** 份yaml，紧接着再删除老的 **N** 个


`Pod` 。


不过，我们可以看到上面的做法：更加不方便了！


**场景三**


实际生产中，往往会管理多条业务线的服务，于是一个非常合理的需求自然而然就提出了：能否


把不同业务线的服务分开管理？，一方面防止不同服务互相干扰，另一方面方便做资源隔离和管


理。


一个很自然的想法是：对于每一条业务线部署一套k8s集群。


但是，这种做法太重了，首先是部署k8s是一件相对耗时耗力的事情；其次，实际生产环境也不


一定有这么多的机器。最佳的方案是能够在一套k8s集群中完成（当然不排除在一些项目中，会


要求部署多套k8s集群）。


综上，我们可以发现， **仅仅使用** **`Pod`** **（** **`Volume`** **,** **`ConfigMap`** **,** **`Secret`** **和** **`Service`** **包括其中）一种对象无法满**


**足更多的常见的、可能更复杂的实际生产场景。** 但是，我们不应该责怪 `Pod` ，因为 `Pod` 的设计是合


理的：


**Pod** 是可以在 Kubernetes 中创建和管理的、最小的可部署的计算单元。


但是，上述几个场景中怎么解决呢？


k8s自然有解决办法和机制，这也是本文讨论的服务管理，这也是本文要重点讨论的几个API对


象，概括来说：




管理无状态的服务，用 `Deployment` ；




管理有状态服务，用 `StatefulSet` ；




隔离服务资源，用 `Namespace` ；


接下来，我们来看 `Deployment` 、 `StatefulSet` 和 `Namespace` 分别是怎么使用的吧！


**I.** **`Deployment`** **：无状态、多服务管理**


`Deployment` 是管理无状态服务的利器，官网[3]描述：


一个 **Deployment** 为 **Pods** 和 **ReplicaSets** 提供声明式的更新能力。


官方文档总是说些听不懂的话，而且这里又引入了新的名词： `ReplicaSet` 。这个是什么？


首先， `Deployment` 、 `ReplicaSet` 和 `Pod` 之间的关系如下（图片引自书籍《k8s-in-action》[4]）：


其次，在《K8S系列一：概念入门》[1]文中对 `Deployment` 、 `ReplicaSet` 和 `Pod` 三者之间的关系有过介


绍：


**ReplicaSet** 的作用就是管理和控制 **Pod** ，管控他们好好干活。但是， **ReplicaSet** 受控于

**Deployment** 。形象来说， **ReplicaSet** 就是总包工头 **Deployment** 手下的小包工头。


但是，上面的描述会有点小问题。严格来说， `ReplicaSet` 是一个独立的API对象，所谓的


“ `ReplicaSet` 受控于 `Deployment` ”是：当创建了 `Deployment` 对象后，它会自动创建 `ReplicaSet` 来管理


`Pod` 。



<img src="/img/K8S.pdf-11-0.png">11-0
这就好像你准备装修你的房子， `Deployment` 就是一个非常棒的装修公司，而 `ReplicaSet` 则是实际干


活的包工头，而 `Pod` 则是每个干活的工人。装修公司只需要告诉包工头这个工程需要多少个工人


干活，之后包工头就会实时监控每个工人，如果有M个工人请假，包工头会马上再雇佣M个工人


参与进来。如果你觉得说：这批工人做工质量不行啊，我需要升级更好的。那么装修公司会马上


撤走这个工程队，包括包工头和他手下所有工人，再雇佣新的工程队，包括新的包工头和新的工


人。


可以看到， **`Deployment`** **的高可用实际上是** **`ReplicaSet`** **的特性，** **`Deployment`** **实际特性则是做服务的平滑**


**升级** ，也就对应了上面例子提到的“更换工程队”。


好的，那就让我们一起来看看 `Deployment` 的yaml文件（来自官网[3]）：



<img src="/img/K8S.pdf-12-0.png">12-0



对比 `Pod` 的yaml文件，我们会发现： `Deployment` 比 `Pod` 多了几个字段：




**'replicas'** ：控制实际在运行的 `Pod` 数量；




**'selector'** ：通过该 `label` 管理对应的 `Pod` （请留意'template.metadata.labels'）；


由此也可以窥探到 `Deployment` 通过 `ReplicaSet` 管理 `Pod` 的内在机制：创建'replicas'个 `Pod` ，并且赋予

`Pod` 用户指定的 `label` 和一个名为 **'pod-template-hash'** 的 `label` ，内容为一个随机生成9位数的

hash值；通过'selector'实时匹配在运行的 `Pod` 数量，不足则创建、非Running状态的杀死后重


建、超过则杀死多余的。管理过程如下图：


<img src="/img/K8S.pdf-13-0.png">13-0

接下来，让我们分别来看 `Deployment` 的两个特性： **高可用** 和 **平滑升级** 。


**特性一：高可用**


在维基百科[5]上对 **高可用** 的定义是：


高可用性（英语：high availability，缩写为 HA），IT术语，指系统无中断地执行其功能的


能力，代表系统的可用性程度。是进行系统设计时的准则之一。高可用性系统与构成该系统


的各个组件相比可以更长时间运行。


高可用性通常通过提高系统的容错能力来实现。


**高可用** 的 **核心** 是： **无中断提供服务** 。因此，提升高可用可以从几个方面入手：




提升程序的鲁棒性（减少crash）；




增加服务实例，如采取主从（冷热）和双主（双热），甚至是多主的集群工作方式；


实际生产中，最佳手段还是 **增加服务实例** ，毕竟，谁也不能保证自己写的程序没有Bug。而


`Deployment` 的就可以做到确保k8s集群中实时存在用户需要的 **N** 个服务在正常工作。


笔者做了一个实验，假设我需要的是3个服务实例，那么只需要设置 `Deployment` 的yaml文件

的'replicas: 3'即可，提交后发现集群上确实启动了三个 `Pod` 。紧接着，模拟线上服务挂了的状


态，手动删除了其中一个 `Pod` ，再来看k8s中 `Pod` 的情况，发现马上有新的 `Pod` 被拉起。下图展示了


整个过程，删除的 `Pod` 名字为'kubia-depl-765b79cff9-grzbm'，而被 `Deployment` 新拉起来的 `Pod` 名

字为''kubia-depl-765b79cff9-zxx5g'：


前文已经说过： **`Deployment`** **的高可用实际上是** **`ReplicaSet`** **的特性** 。这个怎么理解呢？


我们在通过 `Deployment` 部署 `Pod` 服务之后，到k8s分别查看 `Deployment` 、 `ReplicaSet` 和 `Pod` ，会发现一个


有趣的现象： `ReplicaSet` 的名字是则 `Deployment` 名字基础上加了一个 **'-9位hash值'** 生成的，并且


其'selector'的 `label` =用户自定义的 `label` +'pod-template-hash:9位hash值'；而 `Pod` 的名字则是



<img src="/img/K8S.pdf-13-1.png">13-1
`ReplicaSet` 名字基础上再增加一个'-5位hash值'生成的，并且其 `label` 严格等于 `ReplicaSet`


的'selector'的 `label` 。如下图所示：


因此，确保'replicas'数量的 `Pod` 运行的特性的提供者，就是 `ReplicaSet` ！不信？你可以尝试一口气

把所有的 `Pod` 都删除了，最后发现还是会被 `ReplicaSet` 拉起来。该过程如下图：


实践出真知啊。


**特性二：平滑升级**


上面我们已经看到，其实用 `ReplicaSet` 也能够管理多个服务，并且k8s最早开源的时候，也没有


`Deployment` 对象。但是之后发现，在实际生产中，程序版本迭代是一件常见且相对高频的操作。


于是就推出了 `Deployment` （早前有 `ReplicationController` ，自动 `Deployment` 推出之后就不被推荐使用


了）。


我们现在来看看 `Deployment` 是怎么做服务的平滑升级。


在《k8s-in-action》[4]中第九章专门介绍了 `Deployment` 的升级，书中有一幅描述 `Deployment` 升级的


示意图：


更具体的升级过程应该如下图：



<img src="/img/K8S.pdf-14-0.png">14-0

<img src="/img/K8S.pdf-14-1.png">14-1

<img src="/img/K8S.pdf-14-2.png">14-2

<img src="/img/K8S.pdf-14-3.png">14-3
可以看到，升级过程和上一节高可用提到的实时确保'replicas'个 `Pod` 在运行是不一样的：后者是


依靠 `ReplicaSet` 完成的；而前者则是 `Deployment` 的功能特性。


**怎么才能触发** **`Deployment`** **的升级呢？**


**但凡修改** **`Deployment`** **中非'replicas'的其他有效字段（镜像地址'image'、资源'resources'），都**

**会触发** **`Deployment`** **的升级。** 笔者做了一个实验，修改了'resources'，可以看到：


然而，实际生产中仅仅知道 `Deployment` 会做平滑升级还不足够，还需要掌握选择 **升级策略** 和控制


**升级频率** 。关于这块，希望做更详细了解的同学建议阅读《Deployment Strategies》[6]和

《Kubernetes部署策略详解》[7]。




**`Deployment`** **升级策略**


**`Deployment`** **有两种升级策略：** **`Recreate`** **和** **`RollingUpdate`** **。前者是先把所有旧的/已有的** **`Pod`** **全部销毁，**


**然后再拉起新的；后者则是一个一个销毁旧的/已有的** **`Pod`** **，同时再一个一个拉起新的。**


**`RollingUpdate`** **是默认的。**




**`Deployment`** **升级频率**


这里重点介绍 `RollingUpdate` 策略的参数，主要原因它是大部分实际生产中最佳的选择。


首先来看yaml文件中与之相关的部分：



<img src="/img/K8S.pdf-15-0.png">15-0

<img src="/img/K8S.pdf-15-1.png">15-1



敲重点： **maxSurge** 和 **maxUnavailable** 是相对比较重要，且理解不直观的两个参数！网上关

于这俩参数的解读有很多，大部分的解释仍旧不直观。笔者结合实验，在这里尝试解释：


核心理解点在于： **maxSurge** 关系到 **启动新的** **`Pod`** **的速度** ；而 **maxUnavailable** 则关联到 **杀死旧**


**的** **`Pod`** **的速度** 。 `RollingUpdate` 的任务就是一个一个销毁旧的/已有的 `Pod` ，同时再一个一个拉起新


的。


我们假设'replica'为rp， **maxSurge** 为ms（绝对值），而 **maxUnavailable** 为mu（绝对值）。


实际上， `RollingUpdate` 是先拉起mu个新的 `Pod` ，同时销毁min{ms+mu，剩余的}个旧的/已有的；


（确保旧的/已有的被销毁了，而新的被拉起了）之后再拉起mu个新的 `Pod` ，同时销毁


min{ms+mu，剩余的}个旧的/已有的。借用《k8s-in-action》[4]的过程图来说明：


由此可见， **maxSurge** 和 **maxUnavailable** 越大，更新越快；反之，更新会越慢。并且， **k8s要**

**求maxSurge和maxUnavailable不能同时为0，为什么？** 因为都为0的话，根本没办法更新


了！那么，到底要怎么设置这两个值，这就要视实际生产要求而定。


笔者也做了下实验，和大家分享：




**实验一：replicas=4，maxSurge=0，maxUnavailable=1,2,4** 。


结论：升级速度越来越快。



<img src="/img/K8S.pdf-16-0.png">16-0

<img src="/img/K8S.pdf-16-1.png">16-1
<img src="/img/K8S.pdf-17-0.png">17-0

<img src="/img/K8S.pdf-17-1.png">17-1




**实验二：replicas=2，maxUnavailable=0，maxSurge=1,2**


但是由于笔者试用的k8s集群资源有限（一次至多4个 `Pod` 在跑，而且时不时会被抢占资源），因


此只能做 **replicas=2** 的实验，再大一点就会跑不起来。大家可以自行实验。


结论：升级速度越来越快。



<img src="/img/K8S.pdf-17-2.png">17-2
<img src="/img/K8S.pdf-18-0.png">18-0

不知道会不会有同学在想：如果我追求快速升级迭代，那是不是把 **maxSurge** 设置

跟'replicas'一样最好？一次性就升级好了！


但是请注意，笔者分享自己实际遇到的坑：k8s集群总归会有资源不足的情况（比如cpu、gpu

甚至是ip资源），因此在资源非常紧张的时候，如果 **maxSurge** 越大，升级反而不见得越快；并

且 **在资源恰好足够的时候，maxSurge大于零，就会造成升级卡主！！！** 因为， `RollingUpdate` 实

际升级过程是先拉起 **maxSurge** 新实例，紧接着销毁 **maxUnavailable** 个旧的/已有的实例。切

忌小心升级，别以为用了k8s就万事大吉！


**II.** **`StatefulSet`** **：有状态、多服务管理**


在讨论 `StatefulSet` 之前，笔者先说明：实际生产中笔者所用业务并没有使用到该类管理器API对


象，所有的知识都是从《k8s-in-action》[4]学习的。


首先， **我们要知道：为什么需要** **`StatefulSet`** **？或者说，它和** **`Deployment`** **不同点在哪？**


《k8s-in-action》[4]在第十章一开头，花了很大的篇幅在描述这个问题，笔者通过书籍、网上


博客和实验，感觉文章《StatefulSet和Deployment的区别 》[8]总结得很好：




稳定的、唯一的网络标识。




稳定的、持久的存储。




有序的、优雅的部署和伸缩。




有序的、优雅的删除和停止。




有序的、自动的滚动更新。


而在文章《Kubernetes服务之StatefulSets简介》[9]则对于 `StatefulSet` 的用法细节总结得很好：


<img src="/img/K8S.pdf-19-0.png">19-0

<img src="/img/K8S.pdf-19-1.png">19-1

笔者试验了 `StatefulSet` 的CURD，发现其创建和扩缩容确实都是按顺序扩增、缩小；但是如果直


接把 `StatefulSet` 删除的话，那么所有的 `Pod` 也就被删除了：


1) 创建：可以看到 `Pod` 是逐个被创建，并且以 `StatefulSet` 的名字+id(从0开始递增)的形式为其名


字。


2) 扩容：可以看到，扩增的 `Pod` 是在已有的id基础上继续递增，并且也是逐个创建。


3) 缩容：是从当前最大id逐个销毁。



<img src="/img/K8S.pdf-19-2.png">19-2

<img src="/img/K8S.pdf-19-3.png">19-3
<img src="/img/K8S.pdf-20-0.png">20-0

4) 删除：直接全部删除了。


笔者这个时候在思考，如果仅仅是其中一个 `Pod` 挂了会怎么样？实验后发现： `StatefulSet` 会拉起！


并且， `StatefulSet` 并没有中间创建 `ReplicaSet` 或者 `ReplicationController` ，因此有理由相信 `StatefulSet`


自己实现了实时监督 `Pod` 和拉起失败 `Pod` 的能力（可能复用了 `StatefulSet` 的代码）。


仅仅从CURD层面看， `StatefulSet` 和 `Deployment` 是完全不一样的。至于其他方面的特性，笔者还没


来得及深入了解，挖个坑吧！


**III.** **`Namespace`** **：不同服务资源隔离**


`Namespace` 可就太基本，而且使用起来也非常简单：



<img src="/img/K8S.pdf-20-1.png">20-1

<img src="/img/K8S.pdf-20-2.png">20-2

<img src="/img/K8S.pdf-20-3.png">20-3



那么为什么要特别为它设立一个章节呢？因为越是基础，越是重要，也越是容易被忽略！请一定


合理为不同的项目创建 `Namespace` ！


**写在后面**


k8s实践tip1： 实际生产中使用 `kubectl` 工具时，会发现有些API对象有缩写，比如 `pod` 是 `po` ，

`replicaset` 就写 `rs` 。怎么查看呢？


**`kubectl api-resources`** 非常重要！可以看到当前k8s的所有API对象、其缩写、它是否可以被


`Namespace` 隔离等：


最后，如果文章中有纰漏，非常欢迎留言或者私信指出；有理解错误的地方，更是欢迎留言或者


私信告知。总之，非常欢迎大家留言或者私信交流更多k8s的问题。


**参考文献**


[[1]. 《K8S系列一：概念入门》链接：zhuanlan.zhihu.com/p/29...](https://zhuanlan.zhihu.com/p/292081941)


[[2]. 《K8S系列三：单服务部署》链接：zhuanlan.zhihu.com/p/36...](https://zhuanlan.zhihu.com/p/365137154)


[[3]. 官方文档《Deployment》链接：kubernetes.io/zh/docs/c...](https://link.zhihu.com/?target=https%3A//kubernetes.io/zh/docs/concepts/workloads/controllers/deployment/)


[[4]. 书籍《k8s-in-action》Github链接：github.com/wuYin/k8s-in...](https://link.zhihu.com/?target=https%3A//github.com/wuYin/k8s-in-action)


[5]. “高可用”维基百科词条链接：zh.wikipedia.org/wiki/%...


[[6]. 英文博客《Deployment Strategies》链接：docs.openshift.com/cont...](https://link.zhihu.com/?target=https%3A//docs.openshift.com/container-platform/3.3/dev_guide/deployments/deployment_strategies.html)


[[7]. 中文博客《Kubernetes部署策略详解》链接：qikqiak.com/post/k8s-de...](https://link.zhihu.com/?target=https%3A//www.qikqiak.com/post/k8s-deployment-strategies/)


[[8]. 中文博客《StatefulSet和Deployment的区别》链接：cnblogs.com/weifeng1463...](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/weifeng1463/p/10284122.html)


[[9]. 中文博客《Kubernetes服务之StatefulSets简介》链接：cnblogs.com/styshoo/p/6...](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/styshoo/p/6859840.html)



<img src="/img/K8S.pdf-21-0.png">21-0
**K8S系列三：单服务部署**


**笔记本：** k8S


**创建时间：** 2024/5/20 21:48 **更新时间：** 2024/5/20 21:58


**K8S系列三：单服务部署**


- `Pod` 的容器 - Container




`Pod` 的存储 - `Volume`




`Pod` 的配置 - `ConfigMap` 和 `Secret`




`Pod` 的网络 - `Service`


**I. 单服务部署概要**


在前文中提到过，传统的服务部署方式一般是：


(1).首先准备好“完整的程序文件包”，其内容包括脚本文件、可执行程序、依赖库、配置文


件等。


(2).接着把这个“完整的程序文件包”分发到物理机器的某个固定位置，比


如/opt/、/usr/local/services/等。

(3).最后通过脚本文件或者直接命令启动程序入口的可执行程序，程序就会运行起来。


当然，运行程序还有可能需要网络顺畅，比如需要下载数据；还需要物理机上磁盘有足够空


间，用以存储日志和中间结果等。


从上面的过程中摘取核心要点，不难发现，一个服务的部署需要满足几个要素：


<img src="/img/K8S.pdf-23-0.png">23-0

服务部署四要素




**环境** 。一个完整的服务可能是由可执行程序组成的（这也是一种“微服务”架构），每一个可执


行程序对应了 `Pod` 内部的Container；显然，在这块k8s的做法更具备优势，因为不同程序的依赖


库和版本不同，如果在同一个环境中往往需要解决版本冲突问题，而放到不同Container之后，


冲突问题就不存在了。




**存储** 。私以为在一个 `Pod` 中多Container之间存储共享的方式是不方便的，但这个也是由于环境隔


离造成的，总体来说利大于弊。k8s的解决办法是引入了 `Volume` 资源对象，而Container通过挂载


`Volume` 方式来共享存储资源。这种也是解决Container没办法持久化存储的最有效办法。




**配置** 。其实配置文件完全可以和可执行程序一起打包/挂载到镜像的手段来完成。但是k8s也提


供了一种比较好的做法，即通过 `ConfigMap` 或 `Secret` 管理配置内容，再通过挂载到 `Pod` 的具体


Container内部暴露给Container内的服务。




**网络** 。k8s集群有自己的一套网络机制，通过 `Service` 、 `Ingress` 甚至ISTIO组件来做k8s集群内部、


内外通信。


而k8s把以上几个要素都考虑到了。这里，我们需要达成统一的观点：对于k8s而言，我们平时


经常说的一个“服务”实际上对应是一个 `Pod` 。k8s中提出的措施机制是： **Container（环境）、**


**`Volume`** **（存储）、** **`ConfigMap`** **和** **`Secret`** **（配置）、** **`Service`** **（网络）** 。本章将详细展开每一个API对象


的使用办法、以及实际使用的小tip。下图可以表述它们之间的关系：


<img src="/img/K8S.pdf-24-0.png">24-0

k8s服务部署四要素之间关系


本文介将围绕下面这个 `Pod` 展开：


**II. Container**


其实，Container并不是k8s的API对象，但是Container可以说是Pod非常重要的元素，因此单


独拎出来介绍。此外，我们常用的容器一般是docker，本节也会以docker为例。


首先，来看下Container基础的用法。上面名为“demo”的 `Pod` 的yaml文件中，与Container相


关的参数几乎占了一半，把相关的拎出来并给出注释：



<img src="/img/K8S.pdf-24-1.png">24-1

<img src="/img/K8S.pdf-24-2.png">24-2


<img src="/img/K8S.pdf-25-0.png">25-0





容器的名称、镜像地址没什么可说的。'container.resources'这块只要记


住'container.resources. **requests** '<='container.resources. **limits** '，容器实际占用一定是

**[** 'container.resources. **requests** ', 'container.resources. **limits** ' **]** ， **前者是容器对机器的资源要**

**求的下限，后者是容器占用机器资源的上限** 。而'container.command'和'container.args'则是


容器入口命令，本文不做展开。'container.volumeMounts'是容器的挂载点，这个非常关键！


k8s外部的存储盘、配置文件都是通过这个挂载到容器内的，这块的具体使用在下一节会提到。


接着，再来看点相对不基础，但是很常用的知识。


**1. 如何拉取需要密钥的镜像？**


**通过Secret配置！** 官方有非常详细的指导手册《从私有仓库拉取镜像》[2]，总结来说是：




首先，把拉取镜像的鉴权信息保存成k8s的Secret对象；




接着，在Pod的yaml文件中的imagePullSecrets指定到上面的Secret即可；


**2. 拉取镜像的策略？**


这个非常坑！笔者曾经遇到过一次，修改了镜像内容后没有修改tag直接push回镜像仓库，回到

k8s集群重启pod对象，但是镜像没有更新。后来才知道需要指定imagePullPolicy为Always。


不过根据《k8s-in-action》[3]书籍中所述：


You need to be aware that the default imagePullPolicy depends on the image tag. If a


container refers to the latest tag (either explicitly or by not specifying the tag at all),

imagePullPolicy defaults to Always, but if the container refers to any other tag, the


policy defaults to IfNotPresent.

你需要注意imagePullPolicy的默认值视镜像的tag不同。如果容器镜像的tag是latest（显示

指定或者缺省），imagePullPolicy的默认值是Always；否则，imagePullPolicy的默认值是


IfNotPresent。


总之为了保险起见，笔者建议 **指定imagePullPolicy为Always** 。


**3. 如何登陆镜像排查问题？**


线上经常遇到服务出现问题之类的，因此避免不了登录容器排查问题。情况分为几种：




服务还在。这种情况处理起来比较简单，使用 `kubectl -n ${namespace} exec -it ${pod-name} -c`


`${container-name} /bin/bash` 就能以交互式bash进入容器操作；使用 `kubectl -n ${namespace} exec`


`${pod-name} -c ${container-name} -- ${command}` 则可以不进入容器做一些简单的操作，比如查看


日志。当然，直接用 `kubectl -n ${namespace} logs ${pod-name} -c ${container-name}` 也能不用登录


容器查看日志。




服务挂了。这种情况相对比较麻烦，登录容器肯定是不可能的了，但是仍旧可以查看日志，用


法是加一个 `-p` 或者 `--previous=true` ，具体命令为 `kubectl -n ${namespace} logs -c ${pod-name} -c`


`${container-name}` 。不过，只有因为异常退出的容器才能使用该命令，如果是被Terminated的


容器则无法查看。可以参考How to see logs of terminated pods[4]的讨论。


**更好的建议是，对于部署到k8s上的服务，最好有集中的日志管理系统来统一管理服务日志，比**


**如** Elasticsearch **[5]。**


**4. 容器分类？**


k8s支持一个 `Pod` 内包括多个Container，并且，k8s把Container也分了类型：




**InitContainer** 。初始化容器，这个最为特别，它是通过'initContainers'而非'containers'指


定的，k8s会确保'initContainers'下的容器首先启动，结束后再启动'containers'下的容器。




**StandardContainer** 。标准容器，即我们常见常用的容器，无特别之处，不提。




**SidecarContainer** 。边车容器，u1s1，sidecarContainer和mainContainer没有什么不同，


仅是从业务角度来说，这个容器内做的事情与主业务无关、往往辅助类事情。据说，在k8s


1.8版本之后新增了'container.lifecycle.type'来和标准容器进行区分[6]。




**EphemeralContainer** 。临时容器，笔者还没有用过这类容器，因此特性并不清楚。


在真正使用中，initContainer可以做些前提准备工作，比如下载数据；sidecarContainer则做


些辅助工作，比如收集日志。


**4. 多容器的使用？**


在前文中提到过，虽然由于不同Container的文件系统隔离关系，它们无法互相访问彼此的数据


（但是k8s仍然给出了解决办法，具体措施在下一节），但是其他各个方面，譬如网络、IPC


等，同个 `Pod` 内各个Container之间就如同部署在同一台“物理机”上。


那么，k8s究竟做了什么使得同个 `Pod` 内的Container之间能够共享网络、IPC等，而不同 `Pod` 的


Container之间完全隔离呢？这个是unix提供的 **namespace** 和 **cgroup** 技术。前者欢迎阅读文章

《Multi-Container Pods in Kubernetes》[7]；后者也可以自行Google了解，对于docker的

虚拟化会有更深的了解。


（unix提供的 **namespace** 和 **cgroup** 技术笔者也不十分了解，暂且在这里挖个坑，后面填。）


**III. Volume**


`Volume` 是k8s中十分基础且重要，但也很容易被忽视的一个API对象，就像我们在部署服务时经常


忽视磁盘一样，因为实在太基础且越来越便宜。但是如果不做好 `Volume` 的功课，简单把它等同于


磁盘mount的话，k8s的 `Volume` 是会服务部署带来不少困扰的。


`Volume` 的语法格式其实也相对比较简单，把"demo"的yaml文件中和 `Volume` 有关的拎出来：





嗯， `Volume` 的语法基本是由'name'和具体类型组成的。 **请注意：'volumes'单单做了** **`Volume`** **的声**


**明，真正使用的话，还是要在'container.volumeMounts'通过** **`Volume`** **的'name'挂载到**


**Container中。**


**1.** **`Volume`** **分类？**


k8s的 `Volume` 提供了非常丰富的类型，可以涵盖大部分应用场景。关于 `Volume` 类型的介绍，网上的


博文非常多，而且都写的非常棒，本文就不再赘述，推荐几篇：《Volumes》[8]、《


Kubernetes 存储卷》[9]、《[Kubernetes] Volume Overview》[10]。这里对常用到的做个简


单总结：












|类型|Col2|使用办法|
|---|---|---|
||||
|emptyDir|同`Pod`|临时空文件夹，随<br>着`Pod`的销毁而销<br>毁|
|nfs|同NFS|类似hostPath|
|configMap/secret|？|依赖于<br>`ConfigMap`/`Sec<br>ret`。`Pod`销毁数<br>据还在<br>`ConfigMap`/`Sec<br>ret`中|



**2.** **`hostPath`** **有坑？**


坑很大！


**2.1. 慎重选择hostPath的type**

第一个坑是k8s为hostPath提供了多种挂载的type，从官网[8]可以看到目前提供的类型：


Volume类型为hostPath的细分type


坑就出现在第一个取值为空的type上，或许读者会问“这个功能不是挺好的么，不对挂载盘做


检查，使用起来非常自由，哪里坑了？”


分享笔者一次遇到的问题：通过hostPath和type为空的方式挂载了本地的一个压缩包文件

${tar}，但是事先出了意外导致${tar}没有放到正确的位置，最后 `Pod` 正常启动但是程序响应异常


了。排查后知道是压缩包文件没放上去，企图重新放压缩包文件，再重启 `Pod` ，但是失败了！ **原**


**因是：当type为空且k8s发现挂载的路径/文件不存在，它会创建一个同名的目录！！！** （当然


上传压缩包文件的程序写的也不够鲁邦）


**2.2. 小心hostPath把本地磁盘打满**


**`Pod`** **会通过'container.resources.limit'来约束容器内程序对CPU和内存等资源的占用，但是目**


**前并没有约束对磁盘的占用** 。特别在一台机器上会被分配到多个 `Pod` ，一定小心多个 `Pod` 把本地磁


盘占满的情况。而磁盘满的话，k8s会把这个worker node上的 `Pod` 都驱逐掉，分配到其他woker


node上；如果k8s集群的node资源紧张，那么这些 `Pod` 的服务就一直起不来了。


分享笔者项目中遇到的问题：有几次发现线上多个服务突然不工作了，定位发现是一台机器磁盘


满了，再进一步定义发现多个 `Pod` 都在往同一个数据盘存日志，日积月累就把磁盘打满了；还有


好几次k8s整个集群不能工作，结果也是把机器上的系统盘等打满了。



<img src="/img/K8S.pdf-27-0.png">27-0
**虽然“磁盘满”这个问题听上去是新手小白才会犯的错误，但是实际在管理一个庞大集群的时**


**候，是非常容易遇到的。**


**3.** **`configMap/secret`** **热加载/同步？**


通过 `Volume` 挂载 `ConfigMap` 和 `Secret` ，在实际场景中非常常见。譬如把服务所需的配置文件记录在


`ConfigMap` 或者 `Secret` 中，通过挂载就变成容器内的一个配置文件。


但是使用中需要注意热加载，或者说是同步的问题：即 **修改了** **`ConfigMap`** **和** **`Secret`** **的内容，已经挂**


**载到Container的配置文件内容会同步修改么？** 答案是： **不会。** 为此笔者做了几次实验，除非重


建 `Pod` 否则并不会做同步，并且k8s似乎也没有提供热加载/同步的机制。


**IV. ConfigMap和Secret**


**`ConfigMap`** **和** **`Secret`** **是k8s中经常被使用到的API对象** ，他俩本质都是存储kv键值对的，只是 **前者存**


**储的数据是明文的；后者存储的是base64加密后的数据。** `ConfigMap` 比 `Secret` 更简单，纯粹的kv键


值对，借用官方《ConfigMaps》[11]中的例子，一个 `ConfigMap` 的yaml文件长下面这个样子：



<img src="/img/K8S.pdf-28-0.png">28-0



而 `Secret` 更复杂些，因为它的初衷是用于存储一些敏感的数据，如密钥、密码等。 `Secret` 分为多种


类型，在官方文档《Secrets》[12]中有详细介绍，本文不再赘述：



<img src="/img/K8S.pdf-28-1.png">28-1
Secret的type


这里插一句题外话：base64加密的级别实在太弱了，直接用base64 decode命令 `base64 -d`


`${data-string}` 就看到了（捂脸）。


再借用官方[12]的例子，一个 `Secret` 的yaml文件长下面这个样子：



<img src="/img/K8S.pdf-29-0.png">29-0



`ConfigMap` 和 `Secret` 的yaml文件内容极其相似，真正的数据都在'data'项目下；而且它俩在使用上

也极为相似，总结来说可以分为：




**配置文件** 。正如上一节最后提到的用法，通过 `Volume` 挂载到Container中。而且 `ConfigMap` / `Secret` 的


挂载非常有趣，k8s不是简单把 `ConfigMap` / `Secret` 作为文件挂载进去，而是对于'data'下的每个kv键


值对，以key作为文件名，value作为文件内容得到一个文件，挂载到Container内指定的路径。




**环境变量** 。这也是实际场景中常见的用法之一，通过'container.envFrom'进行指定，既可以只


指定几个键值对，也可以 `ConfigMap` / `Secret` 所有的键值对都加载进来。这里有一个事情需要注意：


**通过环境变量加载** **`Secret`** **到Container之后，在Container内部看到的value值是经过base64**


**decode后的数据。** 至于上面配置文件，笔者没有试验过，有清楚的朋友欢迎留言告知。此外，


**配置文件挂载的方式不支持热加载/同步，环境变量加载的方式同样也不支持热加载/同步** 。


**V. Service**


前文[1]已经解释过k8s中 `Service` 的意思： **k8s的** **`Service`** **并不是传统意义上的“服务”，而更像是**


**网关层，是若干个** **`Pod`** **的流量入口、流量均衡器** 。


**第一点.** 可以看到，配置好Container环境、 `Volume` 数据盘、 `ConfigMap` / `Secret` 配置文件或者环境变


量之后，一个服务已经可以独立跑起来了！但是真正部署好服务之后会发现，在k8s集群外部似


乎访问不了部署到k8s集群中的服务？（请注意，k8s的网络模型有underlay和overlay两种，本

文默认k8s使用overlay。k8s的网络模型笔者也没完全搞懂，这里继续挖个坑。）如下图，笔者


在k8s上部署了一个开放8080端口的服务，发现通过IP根本访问不通！


Pod部署好后，集群外部telnet不通


**第二点.** 在实际场景中为了提供高可用服务，往往会在不同的机器上部署多个服务实例。在k8s


中如果一个 `Pod` 部署多份（名字一定不同，比如kubia-1，kubia-2这种），那么这多份 `Pod` 一定得


对外有统一的访问当时，即IP和Port，并且有流量负载均衡策略，把流量分配到多份 `Pod` 上。


以上这些，就是k8s的 `Service` 要做的事情： **屏蔽服务细节，对外暴露统一的服务接口，真正做到**


**了“（微）服务”** 。总的来说， `Service` 带来的优势有：


1.


**`Service`** **提供了几种类型/机制，分别对集群内可访问和对集群外可访问的服务接口；**


2.


**`Service`** **通过** **`label`** **来绑定若干** **`Pod`** **，使得这若干的** **`Pod`** **能够对外暴露统一的服务接口。最重要的是，**


**即使** **`Pod`** **重启后其IP改变了，也不会影响** **`Service`** **。**


可以说， `Service` 是k8s非常重要的一个API对象，一定要掌握其使用办法！笔者阅读过很多博


文，总是越看越糊涂，最后是阅读了《k8s-in-action》[5]后豁然开朗，强烈推荐！这里，笔者


会详细 `Service` 的几种访问机制、排查 `Service` 不工作的手段。因为这些都是实际场景中部署和运维


服务必备的。


在此之前，先来看一个 `Service` 的yaml文件（来自官网《Service》[13]）：



<img src="/img/K8S.pdf-30-0.png">30-0



内容非常简单，重点需要关注的有2点：




'selector'： **这个是** **`Service`** **用以绑定** **`Pod`** **的关键语法** 。这里的'app: MyApp'被称为 `label` ， `label` 可以

有多个。'selector'则会去同一个namespace下寻找匹配 `label` 的 `Pod` 做绑定。而 `Pod` 的 `lable` 则是

在'metadata.labels'定义的，用户可以随便写，甚至可以写'foo: bar'。




'ports'：端口映射。其中'port'是 `Service` 对外（k8s集群内/外）暴露的端口，而'targetPort'则是


匹配绑定了的 `Pod` 的端口，不要弄反了。看了下图会更清晰些：


Service的端口映射


**5.1** **`Service`** **的类型**



<img src="/img/K8S.pdf-30-1.png">30-1
常用的 `Service` 有三种类型/机制（也有说法还有headless等其他类型，这里不展开）：


ClusterIP、NodePort和LoadBalancer。第一点需要记住的是： **ClusterIP只能提供对k8s集群**


**内部可访问的IP和Port，NodePort和LoadBalancer则能够提供k8s集群外可访问的IP和**


**Port** 。第二点需要记住的是： **这三种类型/机制的关系不是互相排斥，而是层层递进。** 也就是


说，NodePort机制包含ClusterIP，LoadBlanacer包含NodePort和CluterIP。相信看了下图会


更明白：


Service三种类型之间的关系


借用《k8s-in-action》[3]的插图来解释这三种类型/机制：




**CluterIP**


**ClusterIP是** **`Service`** **默认的类型/机制** 。如上面的yaml文件，并没有指定type，那执行 `kubectl`


`create -f service-demo.yaml` 之后就会是一个CluterIP类型的 `Service` 。 **CluterIP类型的** **`Service`** **会提供**


**一个'CLUSTER-IP'和'PORT(S)'，能够允许k8s内部相同namespace下的任何** **`Pod`** **访问** 。


在k8s集群中，用kubectl查看ClusterIP会得到如下图：


Service的CluterIP




**NodePort**



<img src="/img/K8S.pdf-31-0.png">31-0
如果希望直接通过 `Service` 对集群外部提供访问方式，那么NodePort是一种勉强不错的方法，并


且所有的k8s集群都能支持这种机制。创建时，需要指定'type: NodePort'。在k8s集群中，用

kubectl查看NodePort你会得到：


Service的NodePort


会发现NodePort和ClusterIP似乎没有太大的不同，仅仅是在'PORT(S)'中多了一个数字


30839。于是你尝试 `telnet ${CLUSTER-IP} 80` ，发现不行；你又尝试 `telnet ${CLUSTER-IP} 30839` ，哎


还是不行。恼羞成怒：怎么回事，NodePort不能用啊，垃圾？！


因此，我们需要了解NodePort究竟做了什么使得集群外部能够访问。笔者认为，下图非常有助


于理解（图片来自于《k8s-in-action》[3]）：


Service的NodePort示意图


**NodePort实际是在** **`Pod`** **所在的物理机器上开了一个端口，让外部流量从这个端口先导流到自己**


**的'port'，再导入'targetPort'（也就是** **`Pod`** **的端口）。**

所以，在使用NodePort类型的时候，请记住正确的访问方式是 `telnet ${Pod` `所在的` `NODE} ${PORT(S)` `非`


`定义的端口号` `}` 。这就意味着，你还需要查看绑定的 `Pod` 所在的物理机IP，可以使用 `kubectl get pod -o`


`wide -l ${lable}` ：


Pod信息


那么，使用 `telnet 9.235.138.15 30839` 原则上应该是可以访问通的，我们来试试：


NodePort访问可行



<img src="/img/K8S.pdf-32-0.png">32-0
**果然可以！**


再回过头来看，NodePort的'CLUSTER-IP'其实是供k8s集群内访问的IP，这就是ClusterIP的机


制，也就证明了NodePort类型/机制是包括ClusterIP的。




**LoadBalancer**


NodePort类型/机制仅仅提供了对k8s集群外访问的方式，很快就会发现这种方法违背了 `Service`


的流量负载均衡的策略，因为通过 `Pod` 所在机器IP访问的流量，只能够导入到该机器上的 `Pod` ，其


他机器上就不行了。因此就有了LoadBalancer。 **LoadBalancer的做法是在NodePort基础上**


**增加一个EXTERNAL-IP，集群外部调用该IP+自定义的port就能够访问** **`Pod`** **。** 相信下图会更有助

于对LoadBalancer的理解（图片来自于《k8s-in-action》[3]）：


Service的LoadBalancer示意图


但是，并不是所有的k8s集群都能够支持LoadBalancer，笔者目前使用的k8s集群就不支持，


在'EXTERNAL-IP'这一列一直处于`<pending>`状态：


Service的LoadBalancer


**5.2** **`Service`** **问题排查**


一般来说，创建好一个 `Service` 之后，只要绑定了正常可服务的 `Pod` 就应该能够通过 `Service` 提供的


访问方式访问到 `Pod` 了（k8s集群内或外）。具体绑定方式在上文中已经提到过，这里再强调一


遍： **通过** **`label`** **来关联** **`Service`** **和** **`Pod`** 。


但实际场景中，遇到访问不通的问题时有发生（这里指的是telnet不通的情况），本小节就介绍


下怎么排查这个问题，以及 `Service` 和 `Pod` 究竟是怎么通过 `label` 绑定的。



<img src="/img/K8S.pdf-33-0.png">
首先需要了解k8s另一个API对象 `Endpoint` ，端点切片。 **`Endpoint`** **是随着** **`Service`** **的生成而被动生成**


**的** 。此外，虽然从使用上来看， `Service` 和 `Pod` 是通过 `label` 绑定的，但是实际上 **`Service`** **和** **`Pod`** **是通过**


**`Endpoint`** **来做关联的** 。因此 `Endpoint` 是查看 `Service` 是否真正绑定到 `Pod` 上的有力工具！


一个正常的、可用的 `Service` 和 `Pod` 的状态应该如下图：


会看到 `Endpoint` 其实是一个如倒排表的结构，存储了 `Service` 名称和其绑定的一系列 `Pod` IP+Port。


但是，如果仅仅创建了一个 `Service` 而没有 `Pod` 的话，再查看 `Endpoint` 会发现其内容为`<none>`：


再比如， `Service` 和 `Pod` 都被创建了，但是 `Pod` 由于种种原因没有正常服务，这个时候 `EndPoint` 内容是


空：


因此，实际应用中操作 `Service` ，一定记得把 `Endpoint` 用起来！


最后，k8s内部的网络策略/机制，包括DNS策略/机制，非常值得深挖和学习，笔者在这里继续


挖个坑。


**参考文献**


[[1]. 中文博文《K8S系列一：概念入门》链接：zhuanlan.zhihu.com/p/29...](https://zhuanlan.zhihu.com/p/292081941)


[[2]. 中文博文《从私有仓库拉取镜像》链接：kubernetes.io/zh/docs/t...](https://link.zhihu.com/?target=https%3A//kubernetes.io/zh/docs/tasks/configure-pod-container/pull-image-private-registry/)


[[3]. 英文书籍《k8s-in-action》Github链接：github.com/wuYin/k8s-in...](https://link.zhihu.com/?target=https%3A//github.com/wuYin/k8s-in-action)


[[4]. Stack Overflow问题How to see logs of terminated pods链接：](https://link.zhihu.com/?target=https%3A//stackoverflow.com/questions/57007134/how-to-see-logs-of-terminated-pods)
stackoverflow.com/quest...


[5]. Elasticsearch官网链接：elastic.co/cn/


[[6]. 中文博文《细数k8s支持的4种类型的container》链接：zhuanlan.zhihu.com/p/14...](https://zhuanlan.zhihu.com/p/145233597)



<img src="/img/K8S.pdf-34-0.png">34-0

<img src="/img/K8S.pdf-34-1.png">34-1

<img src="/img/K8S.pdf-34-2.png">34-2
[[7]. 英文博文《Multi-Container Pods in Kubernetes》链接：linchpiner.github.io/k8...](https://link.zhihu.com/?target=https%3A//linchpiner.github.io/k8s-multi-container-pods.html)


[[8]. k8s官方文档《Volumes》链接：kubernetes.io/docs/conc...](https://link.zhihu.com/?target=https%3A//kubernetes.io/docs/concepts/storage/volumes/)


[9]. 中文指南《 [Kubernetes 存储卷》链接：feisky.gitbooks.io/kube...](https://link.zhihu.com/?target=https%3A//feisky.gitbooks.io/kubernetes/content/concepts/volume.html)


[[10]. 中文博文《[Kubernetes] Volume Overview》链接：godleon.github.io/blog/...](https://link.zhihu.com/?target=https%3A//godleon.github.io/blog/Kubernetes/k8s-Volume-Overview/)


[[11]. k8s官方文档《ConfigMaps》链接：kubernetes.io/docs/conc...](https://link.zhihu.com/?target=https%3A//kubernetes.io/docs/concepts/configuration/configmap/)


[[12]. k8s官方文档《Secrets》链接：kubernetes.io/docs/conc...](https://link.zhihu.com/?target=https%3A//kubernetes.io/docs/concepts/configuration/secret/)


[[13].k8s官方文档《Service》链接：kubernetes.io/docs/conc...](https://link.zhihu.com/?target=https%3A//kubernetes.io/docs/concepts/services-networking/service/)


**K8S系列二：实战入门**


**笔记本：** k8S


**创建时间：** 2024/5/20 21:22 **更新时间：** 2024/5/20 21:47


**K8S系列二：实战入门**


**I. 配置kubectl**


**1.1 什么是kubectl？**


官方文档中介绍kubectl是：


Kubectl 是一个命令行接口，用于对 Kubernetes 集群运行命令。Kubectl的配置文件在


$HOME/.kube目录。我们可以通过设置KUBECONFIG环境变量或设置命令参数-

kubeconfig来指定其他位置的kubeconfig文件。


也就是说，可以通过 `kubectl` 来操作K8S集群，官方文档中介绍其基本语法：


通过man来查看 `kubectl` 的用法，只需要输入命令 `kubectl -h` 就可以看到：



<img src="/img/K8S.pdf-36-0.png">36-0
<img src="/img/K8S.pdf-37-0.png">37-0

总结最粗粒度的用法：




官方文档： `kubectl [command][TYPE][NAME][flags]`




man文档： `kubectl [flags] [options]`


乍一看可能会觉得有出入，实际上 `kubectl` 确实有2类用法，笔者做一个不是很专业的总结：


1.


操作k8s上的资源（增删改查）： `kubectl [command][TYPE][NAME][flags]` ，即 `kubectl [` `操作` `(` `动词` `)][` `资源`


`(` `名词` `)][` `名字` `(` `名词，缺省代表当前所有` `)][` `参数` `(` `控制选项，如在哪个` `namespace` `等` `)]` 。如操作Deployment, Pod,

Service等常见资源。


2.


操作k8s相关配置（增改查）： `kubectl [flags][options]` ，即 `kubectl [` `配置内容` `(` `名词` `)][` `参数` `(` `控制选项` `)]`


。如操作config，plugin等。


具体怎么使用 `kubectl` ，建议先了解基本用法，实践几次就能够得心应手了。不过对于新手而言，


还是需要解释几句： **kubectl是K8S的命令行工具，并不需要kubectl安装在K8S集群的任何**


**Node上，但是，需要确保安装kubectl的机器和K8S的集群能够进行网络互通** 。


接下来，一起看看怎么使用 `kubectl` 吧，切身感受下 `kubectl` 的使用。


请注意，如何安装 `kubectl` [的办法有许多非常明确的教程，比如《安装并配置 kubectl》，本文不](https://link.zhihu.com/?target=https%3A//kubernetes.io/zh/docs/tasks/tools/install-kubectl/)


再赘述。


**1.2 怎么配置kubectl？**


**第一步，必须准备好要连接/使用的K8S的配置文件** ，笔者给出一份杜撰的配置：



<img src="/img/K8S.pdf-38-0.png">38-0



解读如下：




`clusters` 记录了clusters（一个或多个K8S集群）信息：




`name` 是这个cluster（K8S集群）的名称代号




`server` 是这个cluster（K8S集群）的访问方式，一般为IP+PORT




`certificate-authority-data` 是证书数据，只有当cluster（K8S集群）的连接方式是https时，为


了安全起见需要证书数据




`users` 记录了访问cluster（K8S集群）的账号信息：




`name` 是用户账号的名称代号




`user/token` 是用户的token认证方式，token不是用户认证的唯一方式，其他还有账号+密码


等。




`contexts` 是上下文信息，包括了cluster（K8S集群）和访问cluster（K8S集群）的用户账号等信


息：




`name` 是这个上下文的名称代号




`cluster` 是cluster（K8S集群）的名称代号




`user` 是访问cluster（K8S集群）的用户账号代号




`current-context` 记录当前kubectl默认使用的上下文信息




`kind` 和 `apiVersion` 都是固定值，用户不需要关心




`preferences` 则是配置文件的其他设置信息，笔者没有使用过，暂时不提。


**第二步，给kubectl配置上配置文件** 。


1.


**`--kubeconfig`** **参数** 。第一种办法是每次执行 `kubectl` 的时候，都带上 `--kubeconfig=${CONFIG_PATH}` 。给一


点温馨小提示：每次都带这么一长串的字符非常麻烦，可以用alias别名来简化码字量，比如


`alias k=kubectl --kubeconfig=${CONFIG_PATH}` 。


2.


**`KUBECONFIG`** **环境变量** 。第二种做法是使用环境变量 `KUBECONFIG` 把所有配置文件都记录下来，即 `export`


`KUBECONFIG=$KUBECONFIG:${CONFIG_PATH}` 。接下来就可以放心执行 `kubectl` 命令了。


3.


**$HOME/.kube/config配置文件** 。第三种做法是把配置文件的内容放到$HOME/.kube/config


内。具体做法为：


1.


如果$HOME/.kube/config不存在，那么 `cp ${CONFIG_PATH} $HOME/.kube/config` 即可；


2.


如果$HOME/.kube/config已经存在，那么需要把新的配置内容加到$HOME/.kube/config


下。单单只是 `cat ${CONFIG_PATH} >> $HOME/.kube/config` 是不行的，正确的做法是：


`KUBECONFIG=$HOME/.kube/config:${CONFIG_PATH} kubectl config view --flatten > $HOME/.kube/config` 。


解释下这个命令的意思：先把所有的配置文件添加到环境变量 `KUBECONFIG` 中，然后执行 `kubectl`


`config view --flatten` 打印出有效的配置文件内容，最后覆盖$HOME/.kube/config即可。


请注意， **上述操作的优先级分别是1>2>3** ，也就是说， **`kubectl`** **会优先检查** **`--kubeconfig`** **，若无则**


**检查** **`KUBECONFIG`** **，若无则最后检查$HOME/.kube/config** ，如果还是没有，报错。但凡某一步找


到了有效的cluster，就中断检查，去连接K8S集群了。


**第三步：配置正确的上下文**


按照第二步的做法，如果配置文件只有一个cluster是没有任何问题的，但是对于有多个cluster


怎么办呢？到这里，有几个关于配置的必须掌握的命令：




`kubectl config get-contexts` 。列出所有上下文信息。


kubectl config get-contexts




`kubectl config current-context` 。查看当前的上下文信息。其实，命令1线束出来的*所指示的就是


当前的上下文信息。


kubectl config current-context




`kubectl config use-context ${CONTEXT_NAME}` 。更改上下文信息。


kubectl config use-context ${CONTEXT_NAME}




`kubectl config set-context ${CONTEXT_NAME} --${KEY}=${VALUE}` 。修改上下文的元素。比如可以修改用


户账号、集群信息、连接到K8S后所在的namespace。一般来说，比较常见的是修改当前

cluster的namespace，每次都要记住当前的cluster_name多麻烦，所以这里可以用“-
current”来指代当前的cluster_name。例子如下：


kubectl config set-context ${CONTEXT_NAME}|--current --${KEY}=${VALUE}


关于该命令，还有几点要啰嗦的：




`config set-context` 可以修改任何在配置文件中的上下文信息，只需要在命令中指定上下文名称


就可以。而 **--current则指代当前上下文** 。




**上下文信息所包括的内容有：cluster集群（名称）、用户账号（名称）、连接到K8S后所在**


**的namespace** ，因此有 `config set-context` 严格意义上的用法：
```
 kubectl config set-context [NAME|--current] [--cluster=cluster_nickname] [--user=user_nickname] [-
 namespace=namespace] [options]

```

（备注：[options]可以通过 `kubectl options` 查看）


综上，如何操作kubectl配置都已交代。


**II. kubectl部署服务**


K8S核心功能就是部署运维容器化服务，因此最重要的就是如何又快又好地部署自己的服务了。


本章会介绍如何部署Pod和Deployment。


**2.1 如何部署Pod？**


通过kubectl部署Pod的办法分为两步：1). 准备Pod的yaml文件；2). 执行kubectl命令部署



<img src="/img/K8S.pdf-40-0.png">40-0
**第一步：准备Pod的yaml文件** 。关于Pod的yaml文件初步解释，本系列上一篇文章《K8S系列


一：概念入门》已经有了初步介绍，这里再复习下：



<img src="/img/K8S.pdf-41-0.png">41-0



继续解读：




`metadata` ，对于新入门的同学来说，需要重点掌握的两个字段：




`name` 。这个Pod的名称，后面到K8S集群中查找Pod的关键字段。




`namespace` 。命名空间，即该Pod隶属于哪个namespace下，关于Pod和namespace的关系，


上一篇文章已经交代了。




`spec` 记录了Pod内部所有的资源的详细信息，这里我们重点查看 `containers` 下的几个重要字段：




`name` 。Pod下该容器名称，后面查找Pod下的容器的关键字段。




`image` 。容器的镜像地址，K8S会根据这个字段去拉取镜像。




`resources` 。容器化服务涉及到的CPU、内存、GPU等资源要求。可以看到有 `limits` 和 `requests` 两


个子项，那么这两者有什么区别吗，该怎么使用？在What's the difference between Pod


resources.limits and resources.requests in Kubernetes?回答了：


**`limits`** **是K8S为该容器至多分配的资源配额；而** **`requests`** **则是K8S为该容器至少分配的资源配**


**额** 。打个比方，配置中要求了memory的 `requests` 为100M，而此时如果K8S集群中所有的


Node的可用内存都不足100M，那么部署服务会失败；又如果有一个Node的内存有16G充


裕，可以部署该Pod，而在运行中，该容器服务发生了内存泄露，那么一旦超过200M就会因


为OOM被kill，尽管此时该机器上还有15G+的内存。




`command` 。容器的入口命令。对于这个笔者还存在很多困惑不解的地方，暂时挖个坑，有清楚的


同学欢迎留言。




`args` 。容器的入口参数。同上，有清楚的同学欢迎留言。




`volumeMounts` 。容器要挂载的Pod数据卷等。请务必记住： **Pod的数据卷只有被容器挂载后才能**


**使用** ！


**第二步：执行kubectl命令部署** 。有了Pod的yaml文件之后，就可以用kubectl部署了，命令非


常简单： `kubectl create -f ${POD_YAML}` 。


随后，会提示该命令是否执行成功，比如yaml内容不符合要求，则会提示哪一行有问题：


kubectl create -f 失败


修正后，再次部署：


kubectl create -f 成功


**2.2 如何部署Deployment？**


**第一步：准备Deployment的yaml文件** 。首先来看Deployment的yaml文件内容：



<img src="/img/K8S.pdf-42-0.png">42-0



继续来看几个重要的字段：




`metadata` 同Pod的yaml，这里提一点：如果没有指明namespace，那么就是用kubectl默认的

namespace（如果kubectl配置文件中没有指明namespace，那么就是default空间）。


`spec` ，可以看到Deployment的 `spec` 字段是在Pod的 `spec` 内容外“包了一层”，那就来看

Deployment有哪些需要注意的：




`replicas` 。副本个数。也就是该Deployment需要起多少个相同的Pod， **如果用户成功在K8S中**

**配置了n（n>1）个，那么Deployment会确保在集群中始终有n个服务在运行** 。




`template` 。




`metadata` ，新手同学先不管这边的信息。




`spec` ，会发现这完完全全是上文提到的Pod的 `spec` 内容，在这里写明了Deployment下属管

理的每个Pod的具体内容。


**第二步：执行kubectl命令部署** 。Deployment的部署办法同Pod： `kubectl create -f`


`${DEPLOYMENT_YAML}` 。由此可见， **K8S会根据配置文件中的** **`kind`** **字段来判断具体要创建的是什么资**


**源** 。


这里插一句题外话： **部署完deployment之后，可以查看到自动创建了ReplicaSet和Pod** ，如


下图所示：


部署Deployment后自动创建ReplicaSet和Pod


还有一个有趣的事情： **通过Deployment部署的服务，其下属的RS和Pod命名是有规则的** 。读

者朋友们自己总结发现哦。


综上，如何部署一个Pod或者Deployment就结束了。


**III. kubectl查看、更新/编辑、删除服务**


作为K8S使用者而言，更关心的问题应该是本章所要讨论的话题：如何通过kubectl查看、更新/


编辑、删除在K8S上部署着的服务。


**3.1 如何查看服务？**


请务必记得一个事情： **在K8S中，一个独立的服务即对应一个Pod。即，当我们说要xxx一个服**


**务的就是，也就是操作一个Pod** 。而与Pod服务相关的且需要用户关心的，有Deployment。


通过kubectl查看服务的基本命令是：



<img src="/img/K8S.pdf-43-0.png">43-0
在此之前，还有一个需要回忆的事情是：Deployment、ReplicaSet和Pod之间的关系 - 层层隶

属；以及这些资源和namespace的关系是 - 隶属。如下图所示。


namespace和Deployment、ReplicaSet、Pod之间的关系


因此， **要查看一个服务，也就是一个Pod，必须首先指定namespace** ！那么，如何查看集群中

所有的namespace呢？命令 `kubectl get ns` 可以帮助你：


kubectl get ns


于是，只需要通过 `-n=${NAMESPACE}` 就可以指定自己要操作的资源所在的namespace。比如查看


Pod： `kubectl get pod -n=oona-test` ，同理，查看Deployment： `kubectl get deployment -n=oona-`


`test` 。


问题又来了： **如果已经忘记自己所部属的服务所在的namespace怎么办？这么多**

**namespace，一个一个查看过来吗？**


`kubectl get pod --all-namespaces` 或者 `kubectl get pod -A` 。是的， `--all-namespaces` 和 `-A` 是一个意思，


代表所有namespace。



<img src="/img/K8S.pdf-44-0.png">44-0

<img src="/img/K8S.pdf-44-1.png">44-1
<img src="/img/K8S.pdf-45-0.png">45-0

kubectl get pod --all-namespaces


这样子就可以看到所有namespace下面部署的Pod了！同理，要查找所有的命名空间下的

Deployment的命令是： `kubectl get deployment --all-namespaces` 。


于是，就可以开心地查看Pod： `kubectl get pod [-o wide] -n=oona-test` ，或者查看Deployment：


`kubectl get deployment [-o wide] -n=oona-test` 。


哎，这里是否加 `-o wide` 有什么区别吗？实际操作下就明白了，其他资源亦然：


[kubectl get pod] vs. [kubectl get pod -o wide]


哎，那我们看到之前部署的Pod服务memory-demo显示的“ImagePullBackOff”是怎么回事


呢？先不着急，我们慢慢看下去。


**3.2 如何更新/编辑服务？**


两种办法：1). 修改yaml文件后通过kubectl更新；2). 通过kubectl直接编辑K8S上的服务。


**方法一：修改yaml文件后通过kubectl更新** 。我们看到，创建一个Pod或者Deployment的命令

是 `kubectl create -f ${YAML}` 。但是，如果K8S集群当前的namespace下已经有该服务的话，会提


示资源已经存在：


kubectl create -f 提示存在


通过kubectl更新的命令是 `kubectl apply -f ${YAML}` ，我们再来试一试：


kubectl apply -f 成功


（备注：命令 `kubectl apply -f ${YAML}` 也可以用于首次创建一个服务哦）


**方法二：通过kubectl直接编辑K8S上的服务** 。命令为 `kubectl edit ${RESOURCE} ${NAME}` ，比如修改


刚刚的Pod的命令为 `kubectl edit pod memory-demo` ，然后直接编辑自己要修改的内容即可。


但是请注意，无论方法一还是方法二，能修改的内容还是有限的，从笔者实战下来的结论是： **只**


**能修改/更新镜像的地址和个别几个字段** 。如果修改其他字段，会报错：


The Pod "memory-demo" is invalid: spec: Forbidden: pod updates may not change


fields other than `spec.containers[*].image`, `spec.initContainers[*].image`,


`spec.activeDeadlineSeconds` or `spec.tolerations` (only additions to existing tolerations)


如果真的要修改其他字段怎么办呢？恐怕只能删除服务后重新部署了。


**3.3 如何删除服务？**


在K8S上删除服务的操作非常简单，命令为 `kubectl delete ${RESOURCE} ${NAME}` 。比如删除一个Pod


是： `kubectl delete pod memory-demo` ，再比如删除一个Deployment的命令是： `kubectl delete`


`deployment ${DEPLOYMENT_NAME}` 。但是，请注意：




**如果只部署了一个Pod，那么直接删除该Pod即可** ；


kubectl delete pod




**如果是通过Deployment部署的服务，那么仅仅删除Pod是不行的，正确的删除方式应该是：**

**先删除Deployment，再删除Pod** 。


kubectl delete pod without deleting deployment


关于第二点应该不难想象：仅仅删除了Pod但是Deployment还在的话，Deployment定时会检

查其下属的所有Pod，如果发现失败了则会再拉起。因此，会发现过一会儿，新的Pod又被拉起


来了。


另外，还有一个事情：有时候会发现一个Pod总也删除不了，这个时候很有可能要实施强制删除


措施，命令为 `kubectl delete pod --force --grace-period=0 ${POD_NAME}` 。



<img src="/img/K8S.pdf-46-0.png">46-0

<img src="/img/K8S.pdf-46-1.png">46-1
**IV. kubectl排查服务问题**


上文说道：部署的服务memory-demo失败了，是怎么回事呢？本章就会带大家一起来看看常


见的K8S中服务部署失败、服务起来了但是不正常运行都怎么排查呢？


首先，祭出笔者最爱的一张K8S排查手册，来自博客《Kubernetes Deployment故障排除图解


指南》：


哈哈哈，对于新手同学来说，上图还是不够友好，下面我们简单来看两个例子：


**4.1 K8S上部署服务失败了怎么排查？**



<img src="/img/K8S.pdf-47-0.png">47-0
请一定记住这个命令： `kubectl describe ${RESOURCE} ${NAME}` 。比如刚刚的Pod服务memory

demo，我们来看：


kubectl describe ${RESOURCE} ${NAME}


拉到最后看到 `Events` 部分，会显示出K8S在部署这个服务过程的关键日志。这里我们可以看到是


拉取镜像失败了，好吧，大家可以换一个可用的镜像再试试。


一般来说，通过 `kubectl describe pod ${POD_NAME}` 已经能定位绝大部分部署失败的问题了，当然，


具体问题还是得具体分析。大家如果遇到具体的报错，欢迎分享交流。


这里岔一个关于event log的小知识：在k8s上做任何操作，k8s都会把关键步骤记录到etcd，这

个其实就是k8s的操作日志，跟常见日志一样，也有级别区分：Normal，Warning等。也就是

常常听到event log。 **默认情况下，k8s只会保存最近1h的event log。** 因此对于重要的业务，

需要自行收集event log保存。如果要单独查看event log，可以通过命令 `kubectl get event` 查


看。


**4.2 K8S上部署的服务不正常怎么排查？**


如果服务部署成功了，且状态为 `running` ，那么就需要进入Pod内部的容器去查看自己的服务日志


了：




查看Pod内部某个container打印的日志： `kubectl log ${POD_NAME} -c ${CONTAINER_NAME}` 。




进入Pod内部某个container： `kubectl exec -it [options] ${POD_NAME} -c ${CONTAINER_NAME} [args]` ，


嗯，这个命令的作用是通过kubectl执行了 `docker exec xxx` 进入到容器实例内部。之后，就是用户


检查自己服务的日志来定位问题。


显然，线上可能会遇到更复杂的问题，需要借助更多更强大的命令和工具。


**K8S系列一：概念入门**


**笔记本：** k8S


**创建时间：** 2024/5/20 21:13 **更新时间：** 2024/5/20 21:20


**K8S系列一：概念入门**


**写在前面**


**I. K8S概览**


**1.1 K8S是什么？**


K8S是 **Kubernetes** 的全称，官方称其是：


Kubernetes is an open source system for managing containerized applications across


multiple hosts. It provides basic mechanisms for deployment, maintenance, and

scaling of applications.


用于自动部署、扩展和管理“容器化（containerized）应用程序”的开源系统。


翻译成大白话就是：“ **K8S是负责自动化运维管理多个Docker程序的集群** ”。那么问题来了：


Docker运行可方便了，为什么要用K8S，它有什么优势？


插一句题外话：




为什么Kubernetes要叫Kubernetes呢？维基百科已经交代了（老美对星际是真的痴迷）：

Kubernetes（在希腊语意为“舵手”或“驾驶员”）由Joe Beda、Brendan Burns和Craig


McLuckie创立，并由其他谷歌工程师，包括Brian Grant和Tim Hockin等进行加盟创作，并由


谷歌在2014年首次对外宣布 。该系统的开发和设计都深受谷歌的Borg系统的影响，其许多顶级

贡献者之前也是Borg系统的开发者。在谷歌内部，Kubernetes的原始代号曾经是Seven，即星

际迷航中的Borg（博格人）。Kubernetes标识中舵轮有七个轮辐就是对该项目代号的致意。




为什么Kubernetes的缩写是K8S呢？我个人赞同Why Kubernetes is Abbreviated k8s中说的

观点“嘛，写全称也太累了吧，不如整个缩写”。其实只保留首位字符，用具体数字来替代省略


的字符个数的做法，还是比较常见的。


**1.2 为什么是K8S?**


试想下传统的后端部署办法：把程序包（包括可执行二进制文件、配置文件等）放到服务器上，


接着运行启动脚本把程序跑起来，同时启动守护脚本定期检查程序运行状态、必要的话重新拉起


程序。


有问题吗？显然有！最大的一个问题在于： **如果服务的请求量上来，已部署的服务响应不过来怎**


**么办？** 传统的做法往往是，如果请求量、内存、CPU超过阈值做了告警，运维马上再加几台服


务器，部署好服务之后，接入负载均衡来分担已有服务的压力。


问题出现了：从监控告警到部署服务，中间需要人力介入！那么， **有没有办法自动完成服务的部**


**署、更新、卸载和扩容、缩容呢？**


**这，就是K8S要做的事情：自动化运维管理Docker（容器化）程序** 。


**1.3 K8S怎么做？**


我们已经知道了K8S的核心功能：自动化运维管理多个容器化程序。那么K8S怎么做到的呢？这


里，我们从宏观架构上来学习K8S的设计思想。首先看下图，图片来自文章Kubernetes


Components（笔者以为这张官方的组件图比架构图更清晰准确）：


k8s components


K8S是属于 **主从设备模型（Master-Slave架构）** ，即有Master节点负责核心的调度、管理和运


维，Slave节点则在执行用户的程序。但是在K8S中，主节点一般被称为 **Master Node或者**


**Head Node** （本文采用Master Node称呼方式），而从节点则被称为 **Worker Node或者**


**Node** （本文采用Worker Node称呼方式）。


要注意一点：Master Node和Worker Node是分别安装了K8S的Master和Woker组件的实体服


务器，每个Node都对应了一台实体服务器（虽然Master Node可以和其中一个Worker Node


安装在同一台服务器，但是建议Master Node单独部署）， **所有Master Node和Worker**


**Node组成了K8S集群** ，同一个集群可能存在多个Master Node和Worker Node。


首先来看 **Master Node** 都有哪些组件：




**API Server** 。 **K8S的请求入口服务** 。API Server负责接收K8S所有请求（来自UI界面或者CLI命


令行工具），然后，API Server根据用户的具体请求，去通知其他组件干活。从图中可以知道，


API Server实际可以部署多个实例，以增大请求吞吐。




**Scheduler** 。 **K8S中的调度服务** 。当用户要部署服务时，Scheduler会选择最合适的Worker


Node（服务器）来部署。从上图可以知道，Scheduler也可以部署多个实例，以增大处理能


力。




**Controller Manager** 。 **K8S的控制服务** 。Controller Manager本身就是总称，实际上有很多

具体的Controller，在文章Components of Kubernetes Architecture中提到的有Node

Controller、Service Controller、Volume Controller等，分别负责不同K8S对象。举个例子，


比如用户要求A服务部署2个副本，那么当其中一个服务挂了的时候，Controller会马上调整，


让Scheduler再选择一个Worker Node重新部署服务。




**etcd** 。 **K8S的存储服务** 。etcd存储了K8S的关键配置和用户配置，K8S中仅API Server才具备读


写权限，其他组件必须通过API Server的接口才能读写数据（见Kubernetes Works Like an


Operating System）。



<img src="/img/K8S.pdf-50-0.png">50-0
接着来看 **Worker Node** 的组件，笔者更赞同HOW DO APPLICATIONS RUN ON


KUBERNETES文章中提到的组件介绍：




**Kubelet** 。 **Worker Node的监视器，以及与Master Node的通讯器** 。Kubelet是Master


Node安插在Worker Node上的“眼线”，它会定期向Master Node汇报自己Node上运行的


服务的状态，并接受来自Master Node的命令，并执行。




**Kube-Proxy** 。 **K8S的网络代理** 。私以为称呼为Network-Proxy可能更适合？Kube-Proxy负责

Node在K8S的网络通讯、以及对外部网络流量的负载均衡。




**Container Runtime** 。 **Worker Node的运行环境** 。即安装了容器化所需的软件环境确保容器


化程序能够跑起来，比如Docker Engine。大白话就是帮忙装好了Docker运行环境。




**Logging Layer** 。 **K8S的监控状态收集器** 。私以为称呼为Monitor可能更合适？Logging Layer

负责采集Node上所有服务的CPU、内存、磁盘、网络等监控项信息。




**Add-Ons** 。 **K8S管理运维Worker Node的插件组件** 。有些文章认为Worker Node只有三大组


件，不包含Add-On，但笔者认为K8S系统提供了Add-On机制，让用户可以扩展更多定制化功


能，是很不错的亮点。


总结来看， **K8S的Master Node具备：请求入口管理（API Server），Worker Node调度**


**（Scheduler），监控和自动调节（Controller Manager），以及存储功能（etcd）；而K8S**

**的Worker Node具备：状态和监控收集（Kubelet），网络和负载均衡（Kube-Proxy）、保**


**障容器化运行环境（Container Runtime）、以及定制化功能（Add-Ons）。**


到这里，相信你已经对K8S究竟是做什么的，有了大概认识。接下来，再来认识下K8S的


Deployment、Pod、Replica Set、Service等，但凡谈到K8S，就绕不开这些名词，而这些名


词也是最让K8S新手们感到头疼、困惑的。


**II. K8S重要概念**


**2.1 Pod实例**


官方对于 **Pod** 的解释是：


**Pod** 是可以在 Kubernetes 中创建和管理的、最小的可部署的计算单元。


这样的解释还是很难让人明白究竟Pod是什么，但是对于K8S而言，Pod可以说是所有对象中最


重要的概念了！因此，我们 **必须首先清楚地知道“Pod是什么”** ，再去了解其他的对象。


从官方给出的定义，联想下“最小的xxx单元”，是不是可以想到本科在学校里学习“进程”的


时候，教科书上有一段类似的描述：资源分配的最小单位；还有”线程“的描述是：CPU调度


的最小单位。什么意思呢？ **”最小xx单位“要么就是事物的衡量标准单位，要么就是资源的闭**


**包、集合** 。前者比如长度米、时间秒；后者比如一个”进程“是存储和计算的闭包，一个”线程


“是CPU资源（包括寄存器、ALU等）的闭包。


同样的， **Pod就是K8S中一个服务的闭包** 。这么说的好像还是有点玄乎，更加云里雾里了。简单


来说， **Pod可以被理解成一群可以共享网络、存储和计算资源的容器化服务的集合** 。再打个形象


的比喻，在同一个Pod里的几个Docker服务/程序，好像被部署在同一台机器上，可以通过


localhost互相访问，并且可以共用Pod里的存储资源（这里是指Docker可以挂载Pod内的数据


卷，数据卷的概念，后文会详细讲述，暂时理解为“需要手动mount的磁盘”）。笔者总结


Pod如下图，可以看到： **同一个Pod之间的Container可以通过localhost互相访问，并且可以**


**挂载Pod内所有的数据卷；但是不同的Pod之间的Container不能用localhost访问，也不能挂**


**载其他Pod的数据卷** 。


K8S Pod示意图


对Pod有直观的认识之后，接着来看K8S中Pod究竟长什么样子，具体包括哪些资源？


K8S中所有的对象都通过yaml来表示，笔者从官方网站摘录了一个最简单的Pod的yaml：



<img src="/img/K8S.pdf-52-0.png">52-0

<img src="/img/K8S.pdf-52-1.png">52-1



看不懂不必慌张，且耐心听下面的解释：




`apiVersion` 记录K8S的API Server版本，现在看到的都是 `v1` ，用户不用管。




`kind` 记录该yaml的对象，比如这是一份Pod的yaml配置文件，那么值内容就是 `Pod` 。




`metadata` 记录了Pod自身的元数据，比如这个Pod的名字、这个Pod属于哪个namespace（命名


空间的概念，后文会详述，暂时理解为“同一个命名空间内的对象互相可见”）。




`spec` 记录了Pod内部所有的资源的详细信息，看懂这个很重要：




`containers` 记录了Pod内的容器信息， `containers` 包括了： `name` 容器名， `image` 容器的镜像地址，


`resources` 容器需要的CPU、内存、GPU等资源， `command` 容器的入口命令， `args` 容器的入口参


数， `volumeMounts` 容器要挂载的Pod数据卷等。可以看到， **上述这些信息都是启动容器的必要和**


**必需的信息** 。




`volumes` 记录了Pod内的数据卷信息，后文会详细介绍Pod的数据卷。


**2.2 Volume 数据卷**


K8S支持很多类型的volume数据卷挂载，具体请参见K8S卷。前文就“如何理解volume”提


到：“ **需要手动mount的磁盘** ”，此外，有一点可以帮助理解： **数据卷volume是Pod内部的**


**磁盘资源** 。


其实，单单就Volume来说，不难理解。但是上面还看到了 `volumeMounts` ，这俩是什么关系呢？


**volume是K8S的对象，对应一个实体的数据卷；而volumeMounts只是container的挂载**


**点，对应container的其中一个参数** 。但是， **volumeMounts依赖于volume** ，只有当Pod内有


volume资源的时候，该Pod内部的container才可能有volumeMounts。


**2.3 Container 容器**


本文中提到的镜像Image、容器Container，都指代了Pod下的一个 `container` 。关于K8S中的容


器，在2.1Pod章节都已经交代了，这里无非再啰嗦一句： **一个Pod内可以有多个容器**


**container** 。


在Pod中，容器也有分类，对这个感兴趣的同学欢迎自行阅读更多资料：




**标准容器 Application Container** 。




**初始化容器 Init Container** 。




**边车容器 Sidecar Container** 。




**临时容器 Ephemeral Container** 。


一般来说，我们部署的大多是 **标准容器（ Application Container）** 。


**2.4 Deployment 和 ReplicaSet（简称RS）**


除了Pod之外，K8S中最常听到的另一个对象就是Deployment了。那么，什么是Deployment


呢？官方给出了一个要命的解释：


一个 Deployment 控制器为 Pods 和 ReplicaSets 提供声明式的更新能力。

你负责描述 Deployment 中的 目标状态，而 Deployment 控制器以受控速率更改实际状

态， 使其变为期望状态。你可以定义 Deployment 以创建新的 ReplicaSet，或删除现有

Deployment，并通过新的 Deployment 收养其资源。


翻译一下： **Deployment的作用是管理和控制Pod和ReplicaSet，管控它们运行在用户期望的**

**状态中** 。哎，打个形象的比喻， **Deployment就是包工头** ，主要负责监督底下的工人Pod干


活，确保每时每刻有用户要求数量的Pod在工作。如果一旦发现某个工人Pod不行了，就赶紧新


拉一个Pod过来替换它。


新的问题又来了：那什么是ReplicaSets呢？


ReplicaSet 的目的是维护一组在任何时候都处于运行状态的 Pod 副本的稳定集合。 因此，


它通常用来保证给定数量的、完全相同的 Pod 的可用性。


再来翻译下：ReplicaSet的作用就是管理和控制Pod，管控他们好好干活。但是，ReplicaSet受

控于Deployment。形象来说， **ReplicaSet就是总包工头手下的小包工头** 。


笔者总结得到下面这幅图，希望能帮助理解：


K8S Deployment、ReplicaSet和Pod关系图


新的问题又来了： **如果都是为了管控Pod好好干活，为什么要设置Deployment和ReplicaSet**

**两个层级呢，直接让Deployment来管理不可以吗？**


引入这样子的层级管理制度是为了实现 **前后两个版本平滑升级、平滑回滚等高级功能。** 笔者画了


一副Deployment平滑升级（其中一种策略，实际可选有很多策略，本文不展开），或许可以帮


助理解。如下：



<img src="/img/K8S.pdf-54-0.png">54-0
<img src="/img/K8S.pdf-55-0.png">55-0

Deployment 升级


因此，才会看到许多地方建议K8S用户，使用Deployment来部署服务，而不要直接用

ReplicaSet。当Deployment被部署的时候，K8S会自动生成要求的ReplicaSet和Pod。在K8S

官方文档中也指出用户只需要关心Deployment而不操心ReplicaSet：


This actually means that you may never need to manipulate ReplicaSet objects: use a


Deployment instead, and define your application in the spec section.

这实际上意味着您可能永远不需要操作ReplicaSet对象：直接使用Deployments并在规范部

分定义应用程序。


补充说明：在K8S中还有一个对象 --- **ReplicationController（简称RC）** ，官方文档对它的定


义是：


ReplicationController 确保在任何时候都有特定数量的 Pod 副本处于运行状态。 换句话

说，ReplicationController 确保一个 Pod 或一组同类的 Pod 总是可用的。


怎么样，和ReplicaSet是不是很相近？在Deployments, ReplicaSets, and pods教程中说

“ReplicationController是ReplicaSet的前身”，官方也推荐用Deployment取代

ReplicationController来部署服务。


**2.5 Service，Ingress和Istio**


吐槽下K8S的概念/对象/资源是真的多啊！ **前文介绍的Deployment、ReplicationController**

**和ReplicaSet主要管控Pod程序服务；那么，Service和Ingress则负责管控Pod网络服务** 。


我们先来看看官方文档中Service的定义：


将运行在一组 Pods 上的应用程序公开为网络服务的抽象方法。


使用 Kubernetes，您无需修改应用程序即可使用不熟悉的服务发现机制。 Kubernetes 为


Pods 提供自己的 IP 地址，并为一组 Pod 提供相同的 DNS 名， 并且可以在它们之间进行负


载均衡。


翻译下：K8S中的服务（Service）并不是我们常说的“服务”的含义，而更像是网关层，是若


干个Pod的流量入口、流量均衡器。


那么， **为什么要Service呢** ？


私以为在这一点上，官方文档讲解地非常清楚：


Kubernetes Pod 是有生命周期的。 它们可以被创建，而且销毁之后不会再启动。 如果您使


用 Deployment 来运行您的应用程序，则它可以动态创建和销毁 Pod。


每个 Pod 都有自己的 IP 地址，但是在 Deployment 中，在同一时刻运行的 Pod 集合可能与


稍后运行该应用程序的 Pod 集合不同。


这导致了一个问题： 如果一组 Pod（称为“后端”）为群集内的其他 Pod（称为“前端”）


提供功能， 那么前端如何找出并跟踪要连接的 IP 地址，以便前端可以使用工作量的后端部


分？


补充说明：K8S集群的网络管理和拓扑也有特别的设计，以后会专门出一章节来详细介绍K8S中


的网络。这里需要清楚一点：K8S集群内的每一个Pod都有自己的IP（是不是很类似一个Pod就


是一台服务器，然而事实上是多个Pod存在于一台服务器上，只不过是K8S做了网络隔离），在


K8S集群内部还有DNS等网络服务（一个K8S集群就如同管理了多区域的服务器，可以做复杂的


网络拓扑）。


此外，笔者推荐k8s外网如何访问业务应用对于Service的介绍，不过对于新手而言，推荐阅读


前半部分对于service的介绍即可，后半部分就太复杂了。我这里做了简单的总结：


**Service是K8S服务的核心，屏蔽了服务细节，统一对外暴露服务接口，真正做到了“微服**


**务”** 。举个例子，我们的一个服务A，部署了3个备份，也就是3个Pod；对于用户来说，只需要


关注一个Service的入口就可以，而不需要操心究竟应该请求哪一个Pod。优势非常明显： **一方**


**面外部用户不需要感知因为Pod上服务的意外崩溃、K8S重新拉起Pod而造成的IP变更，外部用**


**户也不需要感知因升级、变更服务带来的Pod替换而造成的IP变化，另一方面，Service还可以**


**做流量负载均衡** 。


K8S的Service有3种类型（最新出了一种新的ClusterName，可以直接提供DNS Name），总


结如下：




**ClusterIP** ：只能提供K8S集群内可以访问的IP和Port。




**NodePort** ：在上面的基础上，提供K8S集群外部可以访问的Port，IP则是集群内任意一个


NodeIP。




**LoadBlancer** ：在上面的基础上，提供K8S集群外可以访问的IP和Port。需要注意的是，在


LoadBlancer中可以设置关闭NodePort。还有一点需要注意，LoadBlanacer依赖集群底座的能


力，并不是所有的K8S都能使用LoadBlancer。


**因此，我们可以看到，Service实际上已经能够满足基础通讯要求，包括K8S集群内部和内外。**


**那么，还需要Ingress和Istio吗？**


官方文档中的对Ingress解释是：


Ingress 是对集群中服务的外部访问进行管理的 API 对象，典型的访问方式是 HTTP。

Ingress 可以提供负载均衡、SSL 终结和基于名称的虚拟托管。


翻译一下：Ingress是整个K8S集群的接入层，复杂集群内外通讯。


这里对于Ingress和Istio不做深入介绍，感兴趣的读者欢迎关注后续文章。Ingress是官方团队推


出的K8S集群接入层，Istio则是社区开发和运维的适配K8S的接入层组件。在实际项目中，我们


往往需要功能更为复杂的网关层，比如流量转发，熔断等。而Service提供的功能太过简单，流


量只能导入到单点或者有限服务上，无法满足实际生产需求，因此Ingress和Istio应运而生。其


中，Istio又发展最好，功能和生态最丰富，是目前主流采用的网关组件。


最后，笔者把Ingress/Istio和Service的关系绘制网络拓扑关系图如下，希望对理解这两个概念


有所帮助：


K8S Ingress、Service和Pod关系图


**2.6 namespace 命名空间**


和前文介绍的所有的概念都不一样，namespace跟Pod没有直接关系，而是K8S另一个维度的

对象。或者说，前文提到的概念都是为了服务Pod的，而namespace则是为了服务整个K8S集

群的。


那么，namespace是什么呢？


上官方文档定义：


Kubernetes 支持多个虚拟集群，它们底层依赖于同一个物理集群。 这些虚拟集群被称为名


字空间。


翻译一下： **namespace是为了把一个K8S集群划分为若干个资源不可共享的虚拟集群而诞生**


**的** 。


也就是说， **可以通过在K8S集群内创建namespace来分隔资源和对象** 。比如我有2个业务A和


B，那么我可以创建ns-a和ns-b分别部署业务A和B的服务，如在ns-a中部署了一个


deployment，名字是hello，返回用户的是“hello a”；在ns-b中也部署了一个

deployment，名字恰巧也是hello，返回用户的是“hello b”（要知道，在同一个namespace

下deployment不能同名；但是不同namespace之间没有影响）。前文提到的所有对象，都是

在namespace下的；当然，也有一些对象是不隶属于namespace的，而是在K8S集群内全局可


见的，官方文档提到的可以通过命令来查看，具体命令的使用办法，笔者会出后续的实战文章来


介绍，先贴下命令：



<img src="/img/K8S.pdf-57-0.png">57-0

<img src="/img/K8S.pdf-57-1.png">57-1


<img src="/img/K8S.pdf-58-0.png">58-0



不在namespace下的对象有：


在namespace下的对象有（部分）：



<img src="/img/K8S.pdf-58-1.png">58-1

<img src="/img/K8S.pdf-58-2.png">58-2
**kubectl常用命令**


**笔记本：** k8S


**创建时间：** 2023/12/11 20:58 **更新时间：** 2023/12/11 21:00

# **Kubernetes之kubectl常用命令**

**1. get**


get命令用于获取集群的一个或一些resource信息。kubectl可以列出集群所有resource的详细，


resource包括集群节点、运行的pod，ReplicationController，service等


**1.1 获取pod信息**


获取所有/某一个Pod的详细信息：

```
 kubectl get pods [pod_name]

```

获取pod的节点信息等：

```
 kubectl get pods -o wide

```

获取指定namespace的pods：

```
 kubectl get pods -- namespace =kube-system

```

获取所有namespace的pods：

```
 kubectl get pods --all-namespaces

```

以yaml/json格式输出pod详细信息：

```
 kubectl get pods < pod_name > -o yaml / json

```

**一般情况下要获取pod信息时，需要你加入namespace来确定在哪个命名空间下查找，查看kube-system空间**



<img src="/img/K8S.pdf-59-0.png">59-0



**1.2 获取namespace信息**



<img src="/img/K8S.pdf-59-1.png">59-1




**1.3 获取节点信息**



<img src="/img/K8S.pdf-60-1.png">60-1



**2. describe**


describe类似于get，同样用于获取resource的相关信息。不同的是，get获得的是更详细的resource个性的详细


describe获得的是resource集群相关的信息。describe命令同get类似，但是describe不支持-o选项，


对于同一类型resource，describe输出的信息格式，内容域相同。


获取pod的详细信息：



<img src="/img/K8S.pdf-60-2.png">60-2





获取node的详细信息：



<img src="/img/K8S.pdf-60-3.png">60-3





**3. create**


根据文件创建集群resource（pod或者rc），


kubectl create -f <yaml_file>


Eg: rc-nginx.yaml


apiVersion: v1


kind: ReplicationController


metadata:


name: rc-nginx-2


spec:


replicas: 2


template:


metadata:


labels:


app: nginx-2


spec:


containers:


  - name: nginx-2


image: xingwangc.docker.rg/nginx


ports:


  - containerPort: 80


kind 可以指定是Pod或者ReplicationController


直接使用create则可以基于rc-nginx.yaml文件创建出ReplicationController（rc），rc会创建两个副本：

```
 kubectl create - f rc - nginx.yaml

```

创建后，使用“kubectl get rc”可以看到一个名为rc-nginx-2的ReplicationController将被创建，


同时“kubectl get po”的结果中会多出两个前缀为“rc-nginx-2-”的pod。


**4. replace**


用于对正在运行的已有资源进行更新替换（修改副本数量，修改image版本，端口等），


可以直接修改原yaml文件，然后执行replace命令（删除原有资源然后重新构建资源）


注：名字不能被更更新。另外，如果是更新label，原有标签的pod将会与更新label后的rc断开联系，


有新label的rc将会创建指定副本数的新的pod，但是默认并不会删除原来的pod。


所以此时如果使用get po将会发现pod数翻倍，进一步check会发现原来的pod已经不会被新rc控制，


此处只介绍命令不详谈此问题，好奇者可自行实验。

```
 kubectl replace -f < yaml_ file>

```

**5. patch**


如果一个容器已经在运行，这时需要对一些容器属性进行修改，又不想删除容器，或不方便通过replace的方式


[kubernetes](https://so.csdn.net/so/search?q=kubernetes&spm=1001.2101.3001.7020) 还提供了一种在容器运行时，直接对容器进行修改的方式，就是patch命令。

```
 kubectl patch pod rc-nginx- 2 -kpiqt -p '{ "metadata" :{ "labels" :{ "app" : "nginx-3" }}}'

```

**6. edit**


edit提供了另一种更新resource源的操作，通过edit能够灵活的在一个common的resource基础上，


发展出更过的significant resource。例如，使用edit直接更新前面创建的pod的命令为：

```
 kubectl get pods < pod_name >

```

等同于：



<img src="/img/K8S.pdf-61-0.png">61-0


**7. delete**


删除Pod等资源

```
 kubectl delete pods < pod_name >

```

**8. logs**


logs命令用于显示pod运行中，容器内程序输出到标准输出的内容。跟docker的logs命令类似。


如果要获得tail -f 的方式，也可以使用-f选项。

```
 kubectl logs -f < pod_name >

```

**9. rolling-update**


rolling-update是一个非常重要的命令，对于已经部署并且正在运行的业务，rolling-update提供了不中断业务的


rolling-update每次起一个新的pod，等新pod完全起来后删除一个旧的pod，


然后再起一个新的pod替换旧的pod，直到替换掉所有的pod。


rolling-update需要确保新的版本有不同的name，Version和label，否则会报错 。

```
 kubectl rolling-update < pod_name > -f < new_yaml_ file>

```

如果在升级过程中，发现有问题还可以中途停止update，并回滚到前面版本

```
 kubectl rolling-update < pod_name > - rollback

```

**10. scale**


scale用于程序在负载加重或缩小时副本进行扩容或缩小，


如前面创建的nginx有两个副本，可以轻松的使用scale命令对副本数进行扩展或缩小。


扩展副本数到4：

```
 kubectl scale rc rc-nginx- 3 —replicas =4

```

重新缩减副本数到2：

```
 kubectl scale rc rc-nginx- 3 —replicas =2

```

**11. autoscale**


scale虽然能够很方便的对副本数进行扩展或缩小，但是仍然需要人工介入，


不能实时自动的根据系统负载对副本数进行扩、缩。autoscale命令提供了自动根据pod负载对其副本进行扩缩


autoscale命令会给一个rc指定一个副本数的范围，


在实际运行中根据pod中运行的程序的负载自动在指定的范围内对pod进行扩容或缩容。

```
 kubectl autoscale rc rc-nginx- 3 —min =1 —max =4

```

**12. exec**


exec命令同样类似于docker的exec命令，为在一个已经运行的容器中执行一条shell命令，


如果一个pod容器中，有多个容器，需要使用-c选项指定容器。


通过bash获得pod中某个容器的TTY，相当于登录容器

```
 kubectl exec -it < pod-name > -n < name-space > bash

```

**13. label**


为kubernetes集群的resource打标签，如前面实例中提到的为rc打标签对rc分组。


还可以对nodes打标签，这样在编排容器时，可以为容器指定nodeSelector将容器调度到指定lable的机器上，


如如果集群中有IO密集型，计算密集型的机器分组，


可以将不同的机器打上不同标签，然后将不同特征的容器调度到不同分组上。


在1.2之前的版本中，使用kubectl get nodes则可以列出所有节点的信息，


包括节点标签，1.2版本中不再列出节点的标签信息，如果需要查看节点被打了哪些标签，需要使用describe查


