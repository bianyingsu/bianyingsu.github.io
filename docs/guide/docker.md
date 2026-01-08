# Docker
---
aliases:
  - docker
标题: docker
---
**docker compose是什么**


**笔记本：** docker


**创建时间：** 2023/12/11 14:37 **更新时间：** 2024/5/20 17:41

## **docker compose是什么**


docker compose是一个命令行工具，是用于定义和运行多容器Docker应用程序的工

具；通过Compose，开发者可以使用YML文件来配置应用程序需要的所有服务。

<img src="/img/docker.pdf-0-0.png">


本教程操作环境：linux5.9.8系统、docker-1.13.1版、Dell G3电脑。


**docker Compose 简介**


Compose 是用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，您可以使用


YML 文件来配置应用程序需要的所有服务。然后，使用一个命令，就可以从 YML 文件配置中


创建并启动所有服务。


Compose 使用的三个步骤：

1. 
   使用 Dockerfile 定义应用程序的环境。

2. 
   使用 docker-compose.yml 定义构成应用程序的服务，这样它们可以在隔离环境中一起运行。

3. 
   最后，执行 docker-compose up 命令来启动并运行整个应用程序。



**Compose 安装**


Linux 上我们可以从 Github 上下载它的二进制包来使用，最新发行的版本地址：


https://github.com/docker/compose/releases。


运行以下命令以下载 Docker Compose 的当前稳定版本：

```
$ sudo curl -L "https://github.com/docker/compose/releases/download/v2.2.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```


要安装其他版本的 Compose，请替换 1.24.1。


将可执行权限应用于二进制文件：

```
$ sudo chmod +x /usr/local/bin/docker-compose
```

创建软链：

```
$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

测试是否安装成功：

```
$ docker-compose --version
cker-compose version 1.24.1, build 4667896b
```

注意： 对于 alpine，需要以下依赖包： py-pip，python-dev，libffi-dev，openssl-dev，gcc，

libc-dev，和 make。



**「Docker」与「k8s」的区别**


**笔记本：** docker


**创建时间：** 2024/5/20 16:53 **更新时间：** 2024/5/20 17:00

## **「Docker」与「k8s」的区别**

随着 k8s 作为容器编排解决方案变得越来越流行，有些人开始拿 Docker 和 k8s 进行对比，


不禁问道：Docker不香吗？

```
k8s 是 kubernetes 的缩写，'8' 代表中间的八个字符。
```


其实 Docker 和 k8s 并非直接的竞争对手，它俩相互依存。 Docker 是一个容器化平台，而 k8s 是Docker 等容器平台的协调器。

##### # 1. 容器化时代来了

虚拟化技术已经走过了三个时代，没有容器化技术的演进就不会有 Docker 技术的诞生。

<img src="/img/docker.pdf-2-0.png">

（1） **物理机时代** ：多个应用程序可能会跑在一台机器上。

<img src="/img/docker.pdf-2-1.png">


（2） **虚拟机时代** ：一台物理机器安装多个虚拟机（VM），一个虚拟机跑多个程序。

<img src="/img/docker.pdf-2-2.png">

（3） **容器化时代** ：一台物理机安装多个容器实例（container），一个容器跑多个程序。

<img src="/img/docker.pdf-3-0.png">


容器化解决了软件开发过程中一个令人非常头疼的问题，用一段对话描述：

```
测试人员：你这个功能有问题。
开发人员：我 **本地** 是好的呀！
```


开发人员编写代码，在自己本地环境测试完成后，将代码部署到测试或生产环境中，经常会遇到各种


各样的问题。明明本地完美运行的代码为什么部署后出现很多 bug，原因有很多： **不同的操作系统、**


**不同的依赖库等，总结一句话就是因为本地环境和远程环境不一致** 。


**容器化技术正好解决了这一关键问题，它将软件程序和运行的基础环境分开。开发人员编码完成后将**


**程序打包到一个容器镜像中，镜像中详细列出了所依赖的环境，在不同的容器中运行标准化的镜像，**


**从根本上解决了环境不一致的问题。**


⭐虽然容器概念已经出现不短的时间，但 2013 年推出的开源项目 Docker 在很大程度上帮助推广了


容器这项技术，并推动了软件开发中 **容器化** 和 **微服务** 的趋势， **这种趋势后来被称为云原生开发** 。

##### # 2. 容器化技术的尖刀武器

<img src="/img/docker.pdf-3-1.png">


  - **可移植性** ：不依赖具体的操作系统或云平台，比如在阿里云或腾讯云直接随意迁移。


  - **占地小** ：容器只需要其应用程序以及它需要运行的所有容器和库的依赖清单，不需要将所有的依


赖库都打包在一起。


  - **共享 bin 和 lib** ：不同的容器可以共享 bin 和 lib，进一步节省了空间。

##### # 3. Docker 横空出世

2010 年一位年轻小伙子在美国旧金山成立了一家名叫【dotCloud】的公司， 开发了 Docker 的核心技术，从此开启了容器技术的时代。

<img src="/img/docker.pdf-4-0.png">

后面 dotCloud 公司将自己的容器技术进行了简化和标准化，取名为 Docker，就是大家熟悉的鲸鱼logo。

<img src="/img/docker.pdf-4-1.png">

2013 年 dotCloud 公司宣布将 Docker 开源，随着越来越多的工程师发现了它的优点， Docker 的人气迅速攀升，成为当时最火爆的开源技术之一。


当前有 30％ 以上的企业在其 AWS 环境中使用 Docker，并且这个数字还在继续增长。

<img src="/img/docker.pdf-5-0.png">

此时的 Docker，已经成为行业里人气最火爆的开源技术，没有之一。甚至像 Google、微软、Amazon、VMware 这样的巨头，都对它青睐有加，表示将全力支持。


Docker 火了之后，dotCloud 公司干脆把公司名字也改成了 Docker Inc.。


Docker 和容器技术为什么会这么火爆？说白了，就是因为它 “ **轻** ”。

在容器技术之前，业界的网红是 **虚拟机** 。虚拟机技术的代表，是 **VMWare** 和 **OpenStack** 。

<img src="/img/docker.pdf-5-1.png">


相信很多人都用过虚拟机。虚拟机，就是在你的操作系统里面，装一个软件，然后通过这个软件，再


模拟一台甚至多台“子电脑”出来。

<img src="/img/docker.pdf-6-0.png">

在 “子电脑” 里，你可以和正常电脑一样运行程序，例如登录 QQ。如果你愿意，你可以变出好几个


“子电脑”，里面都登录上 QQ。“子电脑” 和 “子电脑” 之间，是 **相互隔离** 的，互不影响。


虚拟机属于虚拟化技术。而 Docker 这样的容器技术，也是虚拟化技术，属于 **轻量级的虚拟化** 。


虚拟机虽然可以隔离出很多 “子电脑”，但占用空间更大，启动更慢，虚拟机软件可能还要花钱（例如：VMWare）。


而容器技术恰好没有这些缺点。它不需要虚拟出整个操作系统，只需要虚拟一个小规模的环境（类似“ [⇲](https://link.juejin.cn/?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F678d8836cdbd) 沙箱”）。Docker 可以轻松创建容器和基于容器的应用程序， **最初是为 Linux 构建的** ，现在也可以在 Windows 和 MacOS 上运行。

它启动时间很快，几秒钟就能完成。而且，它对资源的利用率很高（一台主机可以同时运行几千个Docker 容器）。此外，它占的空间很小，虚拟机一般要几 GB 到几十 GB 的空间，而容器只需要 MB级甚至 KB 级。

<img src="/img/docker.pdf-6-1.png">


正因为如此，容器技术受到了热烈的欢迎和追捧，发展迅速。大家需要注意， **Docker 本身并不是容器** ，它是创建容器的工具，是应用容器引擎。想要搞懂 Docker，其实看它的两句口号就行。


第一句，是 **“Build, Ship and Run”** 。


第二句口号则是： **“Build once，Run anywhere（搭建一次，到处能用）”。**

<img src="/img/docker.pdf-7-0.png">


  - **Build（构建镜像）** ： 镜像就像是集装箱，包含文件以及运行环境等等资源；


  - **Ship（运输镜像）** ：在 [⇲](https://link.juejin.cn/?target=https%3A%2F%2Fcloud.tencent.com%2Fproduct%2Fcdh%3Ffrom%3D10680) 宿主机和仓库间进行运输，这里仓库就像是超级码头；


  - **Run（运行镜像）** ：运行的镜像就是一个容器，容器就是运行程序的地方。


⭐说白了，这个 Docker 镜像，是一个特殊的文件系统。它除了提供容器运行时所需的程序、库、资


源、配置等文件外，还包含了一些为运行时准备的一些配置参数（例如：环境变量）。 **镜像不包含任何动态数据，其内容在构建之后也不会被改变** 。


⭐综上所述，Docker 的运行过程，也就是去仓库把镜像拉到本地，然后用执行命令把镜像运行起来


变成容器，这也就是为什么人们常常将 Docker 称为码头工人或码头装卸工。


⭐负责对 Docker 镜像进行管理的，是 **Docker Registry 服务** （类似仓库管理员）。当然，不是任何人建的任何镜像都是合法的。万一有人构建的镜像存在问题呢？所以，Docker Registry 服务对镜像的管理是非常严格的。最常使用的 Registry 公开服务，是官方的 [⇲](https://link.juejin.cn/?target=https%3A%2F%2Fhub.docker.com%2F) Docker Hub，这也是默认的Registry，并拥有大量的高质量的官方镜像。

##### # 4. Docker 如何使用


其实大多数人谈论 Docker 时说的是 **Docker Engine** ，这只是一个构建和运行的容器。


在运行容器前需要编写 Docker File，通过 **dockerFile** 生成镜像，然后才能运行 Docker 容器。


Docker File 定义了运行镜像（ **image** ）所需的所有内容，包括操作系统和软件安装位置。一般情况下


都不需要从头开始编写 Docker File，在 Docker Hub 中有来自世界各地的工程师编写好的镜像，你


可以基于此修改。


此外，Docker 容器提供了一种构建企业应用程序和业务流程应用程序的方法，这些应用程序比传统应


用程序更容易安装、维护和移动。


⭐Docker 容器支持 **隔离** ：Docker 容器使应用程序不仅彼此隔离，而且与底层系统隔离。这不仅使软


件栈更干净，而且更容易使容器化应用程序使用系统资源，例如 **CPU、GPU、内存、I/O、网络** 等，


它还可以 **确保数据和代码保持独立** 。


⭐Docker 容器支持 **可移植性** ：Docker 容器在支持容器运行环境的任何机器上运行。应用程序不必绑


定到主机操作系统，因此可以保持应用程序环境和底层操作环境的整洁和最小化。


例如，采用容器的 MySQL 将在大多数支持容器的 Linux 系统上运行，应用程序的所有依赖项通常都


在同一个容器中提供。基于容器的应用程序可以轻易从 on-prem 系统迁移到云环境中，或从开发人员


的笔记本电脑移到服务器上，只要目标系统支持 Docker 以及可能与之一起使用的任何第三方工具，


比如 Kubernetes。


⭐通常，Docker 容器镜像必须为特定的平台构建。例如 Windows 容器不能在 Linux 上运行，反之


亦然；以前，绕过此限制的一种方法是启动运行所需操作系统实例的虚拟机，并在虚拟机中运行容


器。


然而 Docker 团队后来设计了一个更优雅的解决方案，称为 **manifest** ，它允许多个操作系统的镜像并


行打包。尽管 manifest 还处于试验阶段，但这暗示了容器可能成为跨平台应用程序解决方案和跨环境


应用程序解决方案。


⭐Docker 容器支持 **可组合性** ：大多数业务应用程序由几个独立的组件组成，web 服务器、数据库和


cache 缓存。 **Docker 容器可以将这些部件组合成一个容易更换的功能单元。每个部分由不同的容器**


**提供，可以独立于其他容器进行维护、更新、交换和修改。**


这本质上是应用程序设计的 **微服务模型** 。通过将应用程序功能划分为独立的、自包含的服务，微服务


模型为过程缓慢的传统开发和单一僵化的应用程序提供了一种解决方案，轻量级和便携式容器使构建


和维护基于微服务的应用程序变得更加容易。

##### # 5. 编排系统的需求催生 k8s


尽管 Docker 为容器化的应用程序提供了开放标准，但随着容器越来越多出现了一系列新问题：


  - 如何 **协调、调度和管理** 这些容器？


 - 如何在升级应用程序时 **不中断服务** ？


  - 如何 **监视** 应用程序的运行状况？


 - 如何批量重新启动容器里的程序？


解决这些问题需要容器编排技术，可以将众多机器抽象，对外呈现出一台超大机器。现在业界比较流


行的有： **k8s** 、Mesos、 **Docker Swarm** 。


在业务发展初期只有几个微服务，这时用 Docker 就足够了，但随着业务规模逐渐扩大，容器越来越

多，运维人员的工作越来越复杂，这个时候就需要编排系统解救 opers。

<img src="/img/docker.pdf-8-0.png">


一个成熟的容器编排系统需要具备以下能力：


 - 处理大量的容器和用户


 - 负载均衡

 - 鉴权和安全性


 - 管理服务通信


 - 多平台部署

**其中，K8S，就是基于容器的集群管理平台，它的全称，是 kubernetes。**

<img src="/img/docker.pdf-9-0.png">


和 Docker 不同，K8S 的创造者，是众人皆知的行业巨头—— **Google** 。


然而，K8S 并不是一件全新的发明。它的前身，是 Google 自己捣鼓了十多年的 **Borg 系统** 。K8S 是Google 研发的容器协调器，已捐赠给 CNCF，现已开源。


Google 利用在容器管理多年的经验和专业知识推出了 k8s，主要用于 **自动化部署应用程序容器** ，可以


支持众多容器化工具包括现在非常流行的 Docker。


目前 k8s 是容器编排市场的领导者，开源并公布了一系列标准化方法，主流的公有云平台都宣布支持。


一流的厂商都在抢占标准的制高点，一堆小厂商跟着一起玩，这就叫 **生态** 了。国内的大厂商都在干嘛呢？抢社区团购市场，玩资本游戏，哎？！

##### # 6. k8s 架构和组件


k8s 由众多组件组成，组件间通过 API 互相通信，归纳起来主要分为三个部分：


  - controller manager


  - nodes


  - pods

**k8s 集群架构图** ：

<img src="/img/docker.pdf-10-0.png">


  - **Controller Manager** ，即控制平面，用于 **调度** 程序以及节点状态 **检测** 。


  - **Nodes** ，构成了 Kubernetes 集群的集体计算能力， **实际部署容器运行的地方** 。


  - **Pods** ，Kubernetes 集群中 **资源的最小单位** 。

下图是 **Kubernetes 集成 Jenkins 实现 CICD** （一图胜千言，需要对其有一个大致的认识）：

<img src="/img/docker.pdf-10-1.png">


而下图则是 **GitLab + Jenkins Pipeline + Doker + k8s + Helm 自动化部署** ：

<img src="/img/docker.pdf-11-0.png">

##### # 7. k8s 与 Docker Swarm 江湖恩怨

**Docker Swarm** 与 **k8s** 同为容器编排技术。

<img src="/img/docker.pdf-11-1.png">


如果你非要拿 Docker 和 k8s 进行比较，其实你更应该拿 **Docker Swarm** 和 **k8s** 比较。


Docker Swarm 是 Docker 自家针对集群化部署管理的解决方案，优点很明显，可以更紧密集成到


Docker 生态系统中。


虽说 Swarm 是 Docker 亲儿子，但依旧没有 k8s 流行，不流行很大程度是因为商业、生态的原因，


不多解释。

##### # 8. Docker 与 k8s 难舍难分


Docker 和 k8s 在业界非常流行，都已经是事实上的标准。


Docker 是用于构建、分发、运行（Build, Ship and Run）容器的平台和工具。


而 k8s 实际上是一个使用 Docker 容器进行编排的系统，主要围绕 pods 进行工作。 **Pods 是 k8s 生**


**态中最小的调度单位，可以包含一个或多个容器。**


Docker 和 k8s 是根本上不同的技术，两者可以很好的协同工作。

##### # 9. 开发实践，灵魂追问


（1） **为什么还要用 k8s？没有 k8s 可以使用 docker 吗？**

可以。实际上一些小型公司，在业务不太复杂的情况下都是直接使用 Docker。尽管 k8s 有很多好


处，但是众所周知它非常复杂，业务比较简单可以放弃使用 k8s。但 k8s 在业务达到一定规模后也得


启用！


（2） **没有 Docker 可以使用 k8s 吗？**


k8s 只是一个容器编排器，没有容器拿什么编排？！


k8s 经常与 Docker 进行搭配使用，但是也可以使用其他容器，如 RunC、Containerted 等。


（3） **Docker Swarm 和 k8s 怎么选？**

选 k8s。2019 年底 Docker Enterprise 已经出售给 Mirantis，Mirantis 声明要逐步淘汰 DockerSwarm，后续会将 k8s 作为默认编排工具。






**Docker /var/lib/docker/overlay2占用100%**


**笔记本：** docker


**创建时间：** 2024/4/2 23:36 **更新时间：** 2024/4/2 23:40

#### **Docker /var/lib/docker/overlay2占用100%**


本文解决方案：


出现问题


找到问题


解决问题


防止以后问题复现


今天很纳闷，打算上去看一下自己的小破站，结果上不去了，吓得我赶快登上服务器看一

下，结果是容器日志占用满了

<img src="/img/docker.pdf-13-0.png">


起初我还被这个“/var/lib/docker/overlay2/”路径给迷糊住了，一度认为是“overlay2”文件夹

内的日志把磁盘占用100%了，后来进去之后发现该文件夹占用也才5GB，遂开始了头疼掉头发


既然我已经知道是docker的问题了，这个时候就应该从docker目录开始查，在

“/var/lib/docker”目录下使用命令“du -h --max-depth=1”，ps：--max-depth=1意思为检索

文件的最大深度1，即只检索汇总计算当前目录下的文件

```
du -h --max-depth=1
```

<img src="/img/docker.pdf-13-2.png">

从图中可以看出虽然提示的是“/var/lib/docker/containers”目录磁盘占用34G，而

“overlay2”目录磁盘占用只有5G左右，所以小伙伴们不要被“/var/lib/docker/overlay2/”磁盘占用100%给骗了而 一时乱了手脚


这个时候我们进入“/var/lib/docker/containers”目录看看究竟是哪个容器沾满了咱们的磁


盘，进入“containers”目录后我们继续使用“du -h --max-depth=1”命令查看哪个目录占用

磁盘大，ps：docker ps命令中的容器ID是从“containers”目录中的文件夹名称头进行截取的，进行比对遂能查看出来是哪个容器占满了磁盘

```
du -h --max-depth=1
```

<img src="/img/docker.pdf-14-0.png">

<img src="/img/docker.pdf-14-1.png">

从这里咱们能够看出来占了咱们32G磁盘容量的就是redis容器了，这个时候咱们进去占用了32G磁盘的文件夹，ps：不是指redis容器里面的目录哦，而是还是在containers目录进行“cd”命令继续进入占用32G的文件夹内


进入文件夹之后使用“du -ah”命令查看当前文件夹中的文件磁盘占用大小，从图中咱们可以看出是redis的json日志文件磁盘占用太大，遂把文件进行清除处理先解决占用办法

```
du -ah
```

<img src="/img/docker.pdf-14-2.png">

咱们使用“cat /dev/null > *-json.log”命令将这个json文件给清理掉，通过下图咱们就能看出来该文件已经清理掉

```
cat /dev/null > *-json.log
```

<img src="/img/docker.pdf-14-4.png">

当然咯咱们清理了之后还是要重启容器服务哦，虽然这个时候容器还是显示运行，其实已经down了哦


以上咱们的问题解决了，但是这只是治本不治根，往下看解决根本的方法


如果说要从根本方法上解决docker容器日志文件磁盘满载的问题，有几种解决方法


方法一：不推荐，但是最快捷有效，把当前运行的容器直接给停止删掉


方法二：在docker运行的时候指定日志的最大磁盘容量

```
docker run ...... --log-opt max-size=10m --log-opt max-file=1
```

方法三：在docker的配置文件中进行全局修改：新建或修改/etc/docker/daemon.json，添加log-dirver和log-opts参数（daemon.json）：

```
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "labels": "production_status",
    "env": "os,customer"
  }
}
```

方法四：该方法针对docker-compose的童鞋们，在docker-compose文件中配置日志

```
logging:
  options:
    max-size: '12m'
    max-file: '5'
  driver: json-file
```


**Docker-V 详解**


**笔记本：** docker


**创建时间：** 2023/12/11 15:37 **更新时间：** 2023/12/11 15:38

#### **Docker-V 详解**


**1. 作用**


挂载宿主机的一个目录。


**2. 案例**


譬如我要启动一个centos容器，宿主机的/test目录挂载到容器的/soft目录，可通过以下方式指定：

```
docker run -it -v /test:/soft centos /bin/bash
```

冒号":"前面的目录是宿主机目录，后面的目录是容器内目录

**3. 注意事项**

- 3.1 容器目录不可以为相对路径
- 3.2宿主机目录如果不存在，则会自动生成

这样宿主机目录和容器内的目录就互通.可以互相传输文件




**docker如何删除容器里的文件**


**笔记本：** docker


**创建时间：** 2023/12/11 15:35 **更新时间：** 2023/12/11 15:36

#### **docker如何删除容器里的文件**


**问题起因**


为什么会有这个问题呢？


起因是要从一个es搜索引擎从另一个es搜索引擎中拷贝数据


图方便没用软件导致重启es的时候拷贝的数据，引发了es的启动异常


**解决方案**


docker inspect

```
   docker inspect 容器 Id
```

先使用docker inspect 查询出容器的所有信息

然后找到他的Mounts 下的Source，就是容器在宿主机中的位置

<img src="/img/docker.pdf-17-0.png">


我的路径是

```
   cd /home/data/docker/docker/volumes/509ada780c40cd8ea226c5507929e1e5160702733b032495b1776250fb6d3e89/_data
```

进入目录找到要删除的文件

<img src="/img/docker.pdf-17-1.png">


然后 rm 要删除的文件



**Docker Portainer忘记admin登录密码怎么办**


**笔记本：** docker


**创建时间：** 2023/12/11 15:32 **更新时间：** 2023/12/11 15:34


**[Docker管理工具Portainer忘记admin登录密码怎么办?](https://www.cnblogs.com/A1999/p/15993682.html)**


Portainer官网解决方法链接


[https://docs.portainer.io/v/ce-2.11/advanced/reset-admin](https://links.jianshu.com/go?to=https%3A%2F%2Fdocs.portainer.io%2Fv%2Fce-2.11%2Fadvanced%2Freset-admin)


炒鸡详细步骤！

1.查看所有容器,包括未运行的

```
  docker ps -a
```

2.找到Portainer对应信息

<img src="/img/docker.pdf-18-1.png" style="zoom:500%;" >

3.停止Portainer容器

```
docker stop portainerid
我这里就应该是
docker stop 507566f7086e
```

4.找到Portainer容器挂载信息

```
docker inspect portainerid
我这里就应该是
docker inspect 507566f7086e
```

找到这个信息

<img src="/img/docker.pdf-18-2.png" style="zoom:500%;" >


5.执行命令重置密码

```
docker run --rm -v /dockerpath:/data portainer/helper-reset-password
我这里应该是
docker run --rm -v /mnt/docker/portainer:/data portainer/helper-reset-password
```

<img src="/img/docker.pdf-18-4.png" style="zoom:500%;" >

现在admin登录的密码就为：4~!15SlshwmY#89FpcRE06u/{HL2(_Z:

6.启动容器,输入用户名密码就可以登录喽

```
docker start portainerid
我这里就应该是
docker start 507566f7086e
```

7.修改Portainer登录密码

左侧菜单->Users

<img src="/img/docker.pdf-18-3.png">


点击admin,输入新密码更新就OK喽

<img src="/img/docker.pdf-19-0.png">



**docker下载镜像卡死或太慢**


**笔记本：** docker


**创建时间：** 2023/12/11 15:29 **更新时间：** 2023/12/11 15:30

#### **docker下载镜像卡死或太慢**


**docker下载镜像多数为国外资源，很慢，这里百度找到可以使用阿里云加速**


**1、找到个人阿里云的镜像加速器（要1.10.0以上版本的docker）**

```
 docker -v 查看 docker 版本
```

**2、到阿里云官网找属于自己的加速器地址（不建议照抄我的，每个人都有，免费的）**

[https://cr.console.aliyun.com/cn-beijing/instances/mirrors](https://cr.console.aliyun.com/cn-beijing/instances/mirrors)

<img src="/img/docker.pdf-20-0.png">


**3、编辑daemon.json文件添加个人阿里云加速器地址进去**


**（如果没有daemon.json文件就用vim编辑创建）sudo 命令是暂时获取管理员权限**

```
 sudo mkdir -p/etc/docker

 sudo tee /etc/docker/daemon.json << - 'EOF'

 {
 "registry-mirrors": ["https://wb640ddh.mirror.aliyuncs.com"]
 }

 EOF

 sudo systemctl daemon-reload
 sudo systemctl restart docker
```

[参考：https://blog.csdn.net/meltsnow/article/details/92851811](https://blog.csdn.net/meltsnow/article/details/92851811)


**centos8安装docker**


**笔记本：** docker


**创建时间：** 2023/12/11 15:27 **更新时间：** 2023/12/11 15:28

#### **centos8安装docker**


安装依赖

```
 yum install - y yum - utils device - mapper - persistent - data lvm2
```

添加 **yum源**

```
 yum - config - manager -- add - repo https ://download.docker.com/linux/ centos / docker - ce . repo
```

centos8默认使用podman代替 **docker**


直接安装docker会出现以下错误

```
 [ root @localhost ~] # yum install docker-ce
 上次元数据过期检查： 0:00:13 前，执行于 2021 年 06 月 13 日 星期日 16 时 22 分 32 秒。

 错误：

 问题 : package docker - ce -3:20.10.7-3. el8 . x86_64 requires containerd . io >= 1.4.1, but none of the providers can
 - package containerd . io -1.4.3-3.1. el8 . x86_64 conflicts with runc provided by runc -1.0.0-70. rc92 . module_el 8.
 - package containerd . io -1.4.3-3.1. el8 . x86_64 obsoletes runc provided by runc -1.0.0-70. rc92 . module_el 8.4.0+
 - package containerd . io -1.4.3-3.2. el8 . x86_64 conflicts with runc provided by runc -1.0.0-70. rc92 . module_el 8.
 - package containerd . io -1.4.3-3.2. el8 . x86_64 obsoletes runc provided by runc -1.0.0-70. rc92 . module_el 8.4.0+
 - package containerd . io -1.4.4-3.1. el8 . x86_64 conflicts with runc provided by runc -1.0.0-70. rc92 . module_el 8.
 - package containerd . io -1.4.4-3.1. el8 . x86_64 obsoletes runc provided by runc -1.0.0-70. rc92 . module_el 8.4.0+
 - package containerd . io -1.4.6-3.1. el8 . x86_64 conflicts with runc provided by runc -1.0.0-70. rc92 . module_el 8.
 - package containerd . io -1.4.6-3.1. el8 . x86_64 obsoletes runc provided by runc -1.0.0-70. rc92 . module_el 8.4.0+
 - problem with installed package buildah -1.19.7-1. module_el 8.4.0+781+ acf4c33b . x86_64
 - package buildah -1.19.7-1. module_el 8.4.0+781+ acf4c33b . x86_64 requires runc >= 1.0.0-26, but none of the pr
 - cannot install the best candidate for the job
 - package runc -1.0.0-56. rc5 . dev . git2abd837 . module_el 8.3.0+569+ 1bada2e4 . x86_64 is filtered out by modular fi
 - package runc -1.0.0-64. rc10 . module_el 8.4.0+522+ 66908d0c . x86_64 is filtered out by modular filtering
 - package runc -1.0.0-65. rc10 . module_el 8.4.0+819+ 4afbd1d6 . x86_64 is filtered out by modular filtering
 - package runc -1.0.0-70. rc92 . module_el 8.4.0+786+ 4668b267 . x86_64 is filtered out by modular filtering
 ( 尝试在命令行中添加 '--allowerasing' 来替换冲突的软件包 或 '--skip-broken' 来跳过无法安装的软件包 或 '--nobest'

```

解决办法，命令后追加 –allowerasing

```
 yum install docker - ce docker - ce - cli containerd . io -- allowerasing
```

或者先卸载podman

```
 yum erase podman buildah
```

安装docker-ce

```
 [ root @localhost ~] # yum install docker-ce

 安装 :

 docker - ce x86_64 3:20.10.7-3. el8 docker - ce - stable 27 M

 安装依赖关系 :

 container - selinux noarch 2:2.158.0-1. module_el 8.4.0+781+ acf4c33b

 appstream 51 k

 containerd . io x86_64 1.4.6-3.1. el8 docker - ce - stable 34 M
 docker - ce - cli x86_64 1:20.10.7-3. el8 docker - ce - stable 33 M

 docker - ce - rootless - extras x86_64 20.10.7-3. el8 docker - ce - stable 9.2 M
 docker - scan - plugin x86_64 0.8.0-3. el8 docker - ce - stable 4.2 M

 fuse - overlayfs x86_64 1.4.0-2. module_el 8.4.0+673+ eabfc99d
 appstream 72 k

 fuse3 x86_64 3.2.1-12. el8 baseos 50 k
 fuse3 - libs x86_64 3.2.1-12. el8 baseos 94 k
```

```
 libcgroup x86_64 0.41-19. el8 baseos 70 k

 libslirp x86_64 4.3.1-1. module_el 8.4.0+575+ 63b40ad7
 appstream 69 k

 slirp4netns x86_64 1.1.8-1. module_el 8.4.0+641+ 6116a774

 appstream 51 k
```

启动并设置开机自启动

```
 systemctl start docker
 systemctl enable docker
```

验证安装是否成功

```
 docker version
```

**docker容器拷文件**


**笔记本：** docker


**创建时间：** 2023/12/11 15:24 **更新时间：** 2023/12/11 15:25


**docker从容器里面拷文件到宿主机或从宿主机拷文件到docker容器里面**


1、从容器里面拷文件到宿主机？


答：在宿主机里面执行以下命令


docker cp 容器名：要拷贝的文件在容器里面的路径    要拷贝到宿主机的相应路径


示例： 假设容器名为testtomcat,要从容器里面拷贝的文件路为：/usr/local/tomcat/webapps/test/js/test.js, 现


在要将test.js从容器里面拷到宿主机的/opt路径下面，那么命令应该怎么写呢？


答案：在宿主机上面执行命令

```
docker cp 
testtomcat：/usr/local/tomcat/webapps/test/js/test.js /opt
```


2、从宿主机拷文件到容器里面


答：在宿主机里面执行如下命令


docker cp 要拷贝的文件路径 容器名：要拷贝到容器里面对应的路径


示例：假设容器名为testtomcat,现在要将宿主机/opt/test.js文件拷贝到容器里面


的/usr/local/tomcat/webapps/test/js路径下面，那么命令该怎么写呢？


答案：在宿主机上面执行如下命令

```
docker cp /opt/test.js 
testtomcat ： /usr/local/tomcat/webapps/test/js
```


3、在这里在记录一个问题，怎么看容器名称？

执行命令：docker ps，出现如图所示，其中NAMES就是容器名了。

<img src="/img/docker.pdf-21-0.png">

4.需要注意的是，不管容器有没有启动，拷贝命令都会生效。



**docker save与export**


**笔记本：** docker

**创建时间：** 2023/12/11 15:09 **更新时间：** 2023/12/11 15:22


docker save与docker export的区别 
缘起
docker save和docker export都能导出镜像包，咋看起来区别似乎不大。
本文就针对这个问题，试图搞清楚docker save和docker export的功能是什么？适用于什么应用场景？
本文的测试的Docker版本如下，不保证所有版本的docker都能重现本文的结果。
```
>docker version


Client:
Version: 17.07.0-ce-rc1
API version: 1.31
Go version: go1.8.3
Git commit: 8c4be39
Built: Wed Jul 26 05:19:44 2017
OS/Arch: windows/amd64


Server:
Version: 17.07.0-ce-rc1
API version: 1.31 (minimum version 1.12)
Go version: go1.8.3
Git commit: 8c4be39
Built: Wed Jul 26 05:25:01 2017
OS/Arch: linux/amd64
Experimental: true
```

另外我是在Windows on bash里面操作docker，有些命令如ls并不是windows命令，如果想要复现我的试验，请换成相应的windows命令。
docker save
docker的命令行接口设计得很优雅，很多命令的帮助直接在后面加--help就可以查看。
docker save的帮助如下：
```
>docker save --help

Usage: docker save [OPTIONS] IMAGE [IMAGE...]

Save one or more images to a tar archive (streamed to STDOUT by default)

Options:
--help Print usage
-o, --output string Write to a file, instead of STDOUT
```
从命令行帮助可以看出，docker save是用来将一个或多个image打包保存的工具。
例如我们想将镜像库中的postgres和mongo打包，那么可以执行：

```
docker save -o images.tar postgres:9.6 mongo:3.4
```

打包之后的images.tar包含postgres:9.6和mongo:3.4这两个镜像。
虽然命令行参数要求指定image，实际上也可以对container进行打包，例如：

打包之后的images.tar包含postgres:9.6和mongo:3.4这两个镜像。
虽然命令行参数要求指定image，实际上也可以对container进行打包，例如：

```
>docker ps
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
3623943d369f postgres:9.6 "docker-entrypoint..." 3 hours ago Up 3 hours 5432/tcp postgres


>docker save -o b.tar postgres
>docker save -o c.tar postgres:9.6
>ls -al
-rwxrwxrwx 1 root root 277886464 8月 26 14:40 b.tar
-rwxrwxrwx 1 root root 277886464 8月 26 14:41 c.tar
```
通过以上命令可以看到，b.tar和c.tar是完全一模一样的。这说明，docker save如果指定的是container，docker save将保存的是容器背后的image。
将打包后的镜像载入进来使用docker load，例如：

```
docker load -i images.tar
```

上述命令将会把postgres:9.6和mongo:3.4载入进来，如果本地镜像库已经存在这两个镜像，将会被覆盖。
docker save的应用场景是，如果你的应用是使用docker-compose.yml编排的多个镜像组合，但你要部署的客户服务器并不能连外网。这时，你可以使用docker save将用到的镜像打个包，然后拷贝到客户服务器上使用docker load载入。
docker export
照例查看下docker export的帮助：

上述命令将会把postgres:9.6和mongo:3.4载入进来，如果本地镜像库已经存在这两个镜像，将会被覆盖。
docker save的应用场景是，如果你的应用是使用docker-compose.yml编排的多个镜像组合，但你要部署的客户服务器并不能连外网。这时，你可以使用docker save将用到的镜像打个包，然后拷贝到客户服务器上使用docker load载入。
docker export
照例查看下docker export的帮助：
```
>docker export --help


Usage: docker export [OPTIONS] CONTAINER


Export a container's filesystem as a tar archive


Options:
--help Print usage
-o, --output string Write to a file, instead of STDOUT
```
从帮助可以看出，docker export是用来将container的文件系统进行打包的。例如：
```
docker export -o postgres-export.tar postgres
```

docker export需要指定container，不能像docker save那样指定image或container都可以。

将打包的container载入进来使用docker import，例如：
```
docker import postgres-export.tar postgres:latest
```

从上面的命令可以看出，docker import将container导入后会成为一个image，而不是恢复为一个container。
另外一点是，docker import可以指定IMAGE[:TAG]，说明我们可以为镜像指定新名称。如果本地镜像库中已经存在同名的镜像，则原有镜像的名称将会被剥夺，赋给新的镜像。原有镜像将成为孤魂野鬼，只能通过IMAGE ID进行操作。
docker export的应用场景主要用来制作基础镜像，比如你从一个ubuntu镜像启动一个容器，然后安装一些软件和进行一些设置后，使用docker export保存为一个基础镜像。然后，把这个镜像分发给其他人使用，比如作为基础的开发环境。


# docker save和docker export的区别
总结一下docker save和docker export的区别：

1. docker save保存的是镜像（image），docker export保存的是容器（container）；
2. docker load用来载入镜像包，docker import用来载入容器包，但两者都会恢复为镜像；
3. docker load不能对载入的镜像重命名，而docker import可以为镜像指定新名称。

  ## 脑洞

  前面所讲的内容都是些基础知识，相信各位读者只要仔细看下官方文档就能知晓。这一节我来讲讲文档上没有的东西。
  docker load和docker import都可以将tar包导入为镜像，我不禁脑洞一下，docker load能不能导入docker export的容器包，docker import能不能导入docker save的镜像包呢？
  以下开始试验，准备以下两个文件：
```
>ls -al
-rwxrwxrwx 1 root root 271760384 8月 26 12:15 postgres-export.tar
-rwxrwxrwx 1 root root 398292480 8月 26 12:13 postgres-save.tar
```
其中postgres-export.tar是通过docker export导出的容器包，postgres-save.tar是通过docker save保存的镜像包，两者都是基于postgres:9.6镜像。从文件大小可以直观的发现，postgres-export.tar显然要比postgres-save.tar小100多M。
现在试试docker load容器包postgres-export.tar：
```
>docker load -i postgres-export.tar
open /var/lib/docker/tmp/docker-import-082344818/bin/json: no such file or directory
```
显然，docker load不能载入容器包。
那么，反过来，docker import载入镜像包可不可以呢？
```
>docker import postgres-save.tar postgres
sha256:8910feec1ee2fac8c152dbdd0aaab360ba0b833af5c3ad59fcd648b9a24d4838
>docker image ls
REPOSITORY TAG IMAGE ID CREATED SIZE
postgres latest 8910feec1ee2 2 minutes ago 398MB
```
WTF，竟然成功了！！！
莫慌，再试试启动一个postgres容器：
```
>docker run postgres
C:\Program Files\Docker\Docker\resources\bin\docker.exe: Error response from daemon: No command specified.
See 'C:\Program Files\Docker\Docker\resources\bin\docker.exe run --help'.
```
虽然能够成功地导入为一个镜像，然而这个镜像并不能使用。
要搞清楚到底是怎么回事，我们先看看镜像包和容器包由什么区别：
<img src="/img/docker.pdf-22-0.png">

从上面可以看出右边的postgres-export.tar的内容是一个linux系统的文件目录，猜测就是一个linux镜像。而postgres-save.tar里面到底是什么内容呢？点开一个文件夹看看：
<img src="/img/docker.pdf-23-0.png">

其实就是一个分层的文件系统。Docker镜像实际上就是由这样的一层层文件进行叠加起来的，上层的文件会覆盖下层的同名文件。如果将postgres-save.tar中的各层文件合并到一起，基本就是postgres-export.tar的内容。由于postgres-save.tar里面的各层文件会存在很多重复的文件，这也解释了为什么postgres-save.tar会比postgres-export.tar大100多M。
docker load必须要载入的是一个分层文件系统，而postgres-export.tar并不具有这样的结构，因此无法载入。
而docker import仅仅是将tar包里面的文件复制进来，所以不管tar包里面的文件结构是怎样的，都可以载入进来，所以能够载入postgres-save.tar。但postgres-save.tar并不是一个有效的操作系统镜像，因此当我试图以改镜像启动容器时，容器并不能启动。
我们再来看看docker import的帮助：
```
Usage: docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]


Import the contents from a tarball to create a filesystem image


Options:
-c, --change list Apply Dockerfile instruction to the created image
--help Print usage
-m, --message string Set commit message for imported image
```
似乎和docker commit很像：
```
Usage: docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]


Create a new image from a container's changes


Options:
-a, --author string Author (e.g., "John Hannibal Smith
<hannibal@a-team.com>")
-c, --change list Apply Dockerfile instruction to the created image
--help Print usage
-m, --message string Commit message
-p, --pause Pause container during commit (default true)
```
发现docker import和docker commit都有--change和--message选项。我们可以将docker import理解为将外部文件复制进来形成只有一层文件系统的镜像，而docker commit则是将当前的改动提交为一层文件系统，然后叠加到原有镜像之上。
关于docker save和docker export的区别讲得差不多，拜了个拜。




**docker--portainer**


**笔记本：** docker


**创建时间：** 2021/9/25 20:11 **更新时间：** 2023/12/11 15:21


**作者：** 彼岸樱速

查找可安装版本

```
docker search portainer
```

<img src="/img/docker.pdf-30-1.png">

选择一个版本安装

```
docker pull portainer/portainer
```

3、docker启动项目

```
docker run -d -p 9000:9000 --restart=always --name portainer -v /var/run/docker.sock:/var/run/docker.sock -v /home/docker/data:/data portainer/portainer
```

4、初始化密码


输入服务器地址+端口9000

输入密码即完成初始化

<img src="/img/docker.pdf-30-4.png">


然后即可正常使用


如果需要汉化

创建目录，并解压文件

```
mkdir -p /data/portainer/data /data/portainer/publiccd cd /data/portainerwget https://[dl.quchao.net/Soft/Portainer-CN.zip](http://dl.quchao.net/Soft/Portainer-CN.zip)unzip Portainer-CN.zip -d public
```

运行Portainer

```
docker run -d --restart=always --name portainer -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v /data/portainer/data:/data -v /data/portainer/public:/public portainer/portainer
```


**Docker 配置容器固定IP**


**笔记本：** docker


**创建时间：** 2023/12/11 14:42 **更新时间：** 2023/12/11 15:21

**Docker 配置容器固定IP的方法**

**前言**


之前使用pipework 分配静态ip是暂时的,重启之后就会失效,并且使用pipework绑定的ip 物理机,


虚拟机，docker容器的ip都在同一网段,这在生产环境是很困难的,下面使用docker自带的network


实现固定ip分配,并且重启不会消失。

**环境介绍**

<img src="/img/docker.pdf-32-0.png">


**绑定步骤**


先操作192.168.1.105虚拟机


第一步：创建自定义网络

```
docker network create --subnet=172.172.0.0/24 docker-br0
```

备注：这里选取了172.172.0.0网段，也可以指定其他任意空闲的网段，docker-br0为自定义网桥的名字，可自己任意取名。


注意：这里子网掩码要使用255.255.255.0也就是IP后面的那个24,因为后面要使用iptables配置路由表,我之前使用255.255.0.0 无法配置.所以这里配置成24.


创建网桥之后,使用ifconfig查看 会多出一个网桥,该网桥在docker启动或者重启之后,会自动显示出来。


永久的,可以使用docker network rm docker-br0 移除网桥。

<img src="/img/docker.pdf-32-2.png">第二步：在你自定义的网段选取任意IP地址作为你要启动容器IP

```
docker run -i -d --net docker-br0 --ip 172.172.0.10 --name nginx -v /usr/local/software/:/mnt/software/ 3bee3060bfc8 /bin/bash
```

备注：创建容器时,在第一步创建的网段中选取了172.172.0.10作为静态IP地址。并且以docker-br0网桥启动. -v是挂载,表示需要将本地哪个目录挂载到容器中。3bee3060bfc8是镜像ID

使用docker exec -it nginx /bin/bash 进入已启动的容器,使用 yum install net-tools 下载 iptables然后使用ifconfig查看容器ip

<img src="/img/docker.pdf-33-1.png">

第三步：测试本机和容器是否ping通

<img src="/img/docker.pdf-33-2.png">


**跨主机容器互访**


第四步：在192.168.1.106虚拟机上,给容器绑定固定ip, 按照之前 第一步到 第三步.


第五步：在两个容器中互相访问,发现跨主机容器互访,并不能ping通。

<img src="/img/docker.pdf-34-0.png">

第六步：配置路由表


#添加路由规则


ip route add 对方容器所在的ip网段/子网掩码 via 对方虚拟机ip dev 通过哪个网卡通信


如： ip route add 172.172.1.0/24 via 192.168.1.106 dev eno16777736


添加完成之后,可以使用 route命令 查看添加之后的规则,也可以使用 ip route del 172.172.1.0/24 移除路由规则


在192.168.1.105 和 192.168.1.106虚拟机上,分别添加对应的路由规则！


192.168.1.105： ip route add 172.172.1.0/24 via 192.168.1.106 dev eno16777736


192.168.1.106： ip route add 172.172.0.0/24 via 192.168.1.105 dev eno16777736


第七步：在两个容器中互相访问,发现可以实现跨主机容器互相ping通了。

<img src="/img/docker.pdf-34-1.png">



**docker服务器、以及容器设置自动启动**


**笔记本：** docker


**创建时间：** 2023/12/11 15:19 **更新时间：** 2023/12/11 15:20
### docker 服务器、以及容器设置自动启动

**一、** docker **服务设置自动启动**


**查看已启动的服务**

```
systemctl list-units --type=service
```

**查看是否设置开机启动**

```
systemctl list-unit-files | grep enable
```

**设置开机启动**

```
systemctl enable docker.service
```

**关闭开机启动**

```
systemctl disable docker.service
```

**二、** docker **容器设置自动启动**

启动时加--restart=always

```
docker run -tid --name isaler_v0.0.11 -p 8081:8080 --restart=always -v /alidata/iDocker/run/projectImages/isaler/v0.0.11/log:/usr/local/tomcat/logs isaler_v0.0.11
```

```
Flag Description
no 不自动重启容器. (默认value)
on-failure 容器发生error而退出(容器退出状态不为0)重启容器unless-stopped 在容器已经stop掉或Docker stoped/restarted的时候才重启容器
always 在容器已经stop掉或Docker stoped/restarted的时候才重启容器
```

如果已经过运行的项目

如果已经启动的项目，则使用update更新：

```
docker update --restart=always isaler_v0.0.11
```

**Docker容器应用日志查看**


**笔记本：** docker


**创建时间：** 2023/12/11 15:16 **更新时间：** 2023/12/11 15:18

#### **Docker容器应用日志查看**


**docker** **attach命令**


`docker attach [options]` `容器` 会连接到正在运行的容器，然后将容器的标准输入、输出和错误流信息附在本地打印


命令中 `options` 的取值有三种： **`--detach-keys`** **,** **`--no-stdin`** **,** **`--sig-proxy`** 。


该命令只是进入容器终端，不会启动新的进程。


所以当你同时使用多个窗口进入该容器，所有的窗口都会同步显示。


如果一个窗口阻塞，那么其他窗口也就无法再进行操作。


使用 `ctrl+c` 可以直接断开连接，但是这样会导致容器退出，而且还 `stop` 了。


如果想在脱离容器终端时，容器依然运行。就需要使用 `--sig-proxy` 这个参数。例如：

```
 $ docker attach --sig-proxy=false mytest
```

**注意：** 当使用 `docker attach` 连接到容器的标准输入输出时， `docker` 使用大约 `1MB` 的内存缓冲区来最大化应用程序的


如果此缓冲区填满，那么输出或写入的速度将会受到影响。因此查看应用日志，可以使用 `docker logs` 命令。


**docker logs命令**


`docker logs [options]` `容器` 获取容器的日志。

|名字|默认值|描述|
|-|-|-|
|–details| |显示提供给日志的额外细节|
|–follow或-f| |按日志输出|
|–since| |从某个时间开始显示，例如2013-01-02T13:23:37|
|–tail|all|从日志末尾多少行开始显示|
|–timestamps或-t| |显示时间戳|
|–until| |打印某个时间以前的日志，例如 2013-01-02T13:23:37|



例如打印容器 `mytest` 应用后10行的内容。

```
 $ docker logs --tail="10" mytest
```

**docker 容器设置自动重启**


**笔记本：** docker


**创建时间：** 2023/12/11 15:14 **更新时间：** 2023/12/11 15:15

#### **docker 容器设置自动重启**

```
  # 已有的容器更新为自动重启

```

<img src="/img/docker.pdf-37-0.png">






**Docker批量删除指定名称的容器镜像**


**笔记本：** docker


**创建时间：** 2023/12/11 15:12 **更新时间：** 2023/12/11 15:13

#### **【Docker实战】批量删除指定名称的容器镜像**


【场景】


在学习 **docker** 的时候，经常会编译docker镜像，很多都是基于上一个Dockerfile修改编译而来，


因此出现了很多 `REPOSITORY` 和 `TAG` 为 `none` 的镜像。


每次 `docker images` 查看镜像，都会列出一长串，有的时候一屏还展示不全，


所以就想要删除某些镜像。但是一个一个删又很费时，那就只有批量删除了。

```
 $ docker images

 REPOSITORY TAG IMAGE ID CREATED SIZE

 golang dev f22e6969a040 15 seconds ago 614MB

 <none> <none> 4db779627117 46 hours ago 614MB

 redis latest 6ae3401db8cc 5 days ago 154MB

 <none> <none> 7f2bafff6c0f 9 days ago 151MB

 <none> <none> a8f72b3b263d 9 days ago 151MB

 <none> <none> 92e01ab212ce 13 days ago 263MB

 <none> <none> abc55744f08a 13 days ago 263MB

```

【实战】


使用 `grep` 函数查找出所有包含 `none` 的镜像，然后使用 `awk` 函数找出所有的镜像ID，并将它们作为参数，使用 `d`

```
 # 查询所有匹配上的 docker 镜像 ID

 $ docker images | grep none | awk '{print $3}'

 4db779627117

 7f2bafff6c0f

 a8f72b3b263d

 92e01ab212ce

 abc55744f08a

 b0b5849d174f

 3bddbb428319

```

【使用】


`docker images | grep none | awk '{print $3}' | xargs docker rmi`, 执行该命令即可批量删除指定容器了。

```
 # docker rmi 删除匹配到的镜像 ID

 $ docker images | grep none | awk '{print $3}' | xargs docker rmi

 Deleted: sha256:4db779627117f5cb89b4ed3bac92a24ad708b507fce1ea388bfa4d99d6f0e920

 Deleted: sha256:d303d0e4b3b49cb877ff345ae408ac2bf6f36247510c8c8c818235c046e3ab95

 Deleted: sha256:c6b43a612c619c71bfe83f4d65d3b65123fc22b62159175d72bd2d7c3a61e6b9

 Deleted: sha256:98f6c071ac53971c1ff45bffd07d7cbf4079a69c0d18e1c3309500a456490a6b

 Deleted: sha256:2ab1af2a5356b9d32f260a0cac4915614afae360010112513435ea91c34d05a6

```

**Docker中如何删除image**


**笔记本：** docker


**创建时间：** 2023/12/11 15:06 **更新时间：** 2023/12/11 15:08

#### **Docker中如何删除image（镜像）**


docker中删除images的命令是 `docker rmi` ，但有时候执行此命令并不能删除images

```
 [yaxin@ubox ~]$docker images

 REPOSITORY TAG IMAGE ID CREATED VIRTUAL SIZE

 eg_sshd latest ed9c93747fe1 45 hours ago 329.8 MB

 CentOS65 latest e55a74a32125 2 days ago 360.6 MB

 [yaxin@ubox ~]$docker rmi ed9c93747fe1

 Untagged: ed9c93747fe16627be822ad3f7feeb8b4468200e5357877d3046aa83cc44c6af

 [yaxin@ubox ~]$docker images

 REPOSITORY TAG IMAGE ID CREATED VIRTUAL SIZE

 <none> <none> ed9c93747fe1 45 hours ago 329.8 MB

 CentOS65 latest e55a74a32125 2 days ago 360.6 MB

```

可以看出，image并没有被删除，只是他的tag被删除了，再次执行 `docker rmi IMAGE_ID` 只会报错

```
 [yaxin@ubox ~]$docker rmi ed9c93747fe1

 Error: image_delete: Conflict, ed9c93747fe1 wasn't deleted

 2014/03/22 15:58:27 Error: failed to remove one or more images

```

查看docker的帮助会发现有两个与删除有关的命令 `rm` 和 `rmi`

```
rm Remove one or more containers
rmi Remove one or more images
```


这里有两个不同的单词，images和container。其中images很好理解，跟平常使用的虚拟机的镜像一个意思，


相当于一个模版，而container则是images运行时的的状态。


docker对于运行过的image都保留一个状态（container），


可以使用命令 `docker ps` 来查看正在运行的container，


对于已经退出的container，则可以使用 `docker ps -a` 来查看。


如果你退出了一个container而忘记保存其中的数据，


你可以使用 `docker ps -a` 来找到对应的运行过的container使用 `docker commit` 命令将其保存为image然后运行


回到之前的问题，由于image被某个container引用（拿来运行），


如果不将这个引用的container销毁（删除），那image肯定是不能被删除。


所以想要删除运行过的images必须首先删除它的container。继续来看刚才的例子，

```
 [yaxin@ubox ~]$docker ps -a

 CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES

 117843ade696 ed9c93747fe1 /bin/sh -c /usr/sbin 46 hours ago Up 46 hours 0.0.0.0:49153->22/tcp test_ss

```

可以看出ed9c93747fe1的image被117843ade696的container使用着，所以必须首先删除该container

```
 [yaxin@ubox ~]$docker rm 117843ade696

 Error: container_delete: Impossible to remove a running container, please stop it first

```

```
 2014/03/22 16:36:44 Error: failed to remove one or more containers

```

出现错误，这是因为该container正在运行中(运行 `docker ps` 查看)，先将其关闭

```
[yaxin@ubox ~]$docker rm 117843ade696

 117843ade696

 [yaxin@ubox ~]$docker rmi ed9c93747fe1

 Deleted: ed9c93747fe16627be822ad3f7feeb8b4468200e5357877d3046aa83cc44c6af

 Deleted: c8a0c19429daf73074040a14e527ad5734e70363c644f18c6815388b63eedc9b

 Deleted: 95dba4c468f0e53e5f1e5d76b8581d6740aab9f59141f783f8e263ccd7cf2a8e

 Deleted: c25dc743e40af6858c34375d450851bd606a70ace5d04e231a7fcc6d2ea23cc1

 Deleted: 20562f5714a5ce764845119399ef75e652e23135cd5c54265ff8218b61ccbd33

 Deleted: c8af1dc23af7a7aea0c25ba9b28bdee68caa8866f056e4f2aa2a5fa1bcb12693

 Deleted: 38fdb2c5432e08ec6121f8dbb17e1fde17d5db4c1f149a9b702785dbf7b0f3be

 Deleted: 79ca14274c80ac1df1333b89b2a41c0e0e3b91cd1b267b31bef852ceab3b2044

 [yaxin@ubox ~]$docker images

 REPOSITORY TAG IMAGE ID CREATED VIRTUAL SIZE

 CentOS65 latest e55a74a32125 2 days ago 360.6 MB

```

可以看出，image已经被删除。






**Docker镜像的导入导出**


**笔记本：** docker


**创建时间：** 2023/12/11 15:04 **更新时间：** 2023/12/11 15:05


**Docker镜像的导入导出**


本文介绍Docker镜像的导入导出，用于迁移、备份、升级等场景，准备环境如下：


**CentOS 7.0**


**Docker 1.18**


**导入导出命令介绍**


涉及的命令有export、import、save、load


**save**


命令

```
   docker save [options] images [images...]
```

<img src="/img/docker.pdf-41-0.png">

示例

```
   docker save -o nginx.tar nginx:latest
```

或

```
   docker save > nginx.tar nginx:latest
```

其中-o和>表示输出到文件， `nginx.tar` 为目标文件， `nginx:latest` 是源镜像名（name:tag）


**load**


命令

```
   docker load [options]

```

<img src="/img/docker.pdf-41-1.png">

示例

```
   docker load -i nginx.tar
```

或

```
   docker load < nginx.tar
```

其中-i和<表示从文件输入。会成功导入镜像及相关元数据，包括tag信息

**export**

命令

```
   docker export [options] container
```

<img src="/img/docker.pdf-42-0.png">

示例

```
   docker export -o nginx-test.tar nginx-test
```

其中-o表示输出到文件， `nginx-test.tar` 为目标文件， `nginx-test` 是源容器名（name）


**import**


命令

```
   docker import [options] file|URL|- [REPOSITORY[:TAG]]
```

<img src="/img/docker.pdf-42-1.png">

示例

```
   docker import nginx-test.tar nginx:imp
```

或

```
   cat nginx-test.tar | docker import - nginx:imp
```

**区别**

export命令导出的tar文件略小于save命令导出的

<img src="/img/docker.pdf-42-2.png">


export命令是从容器（container）中导出tar文件，而save命令则是从镜像（images）中导出


基于第二点，export导出的文件再import回去时，无法保留镜像所有历史（即每一层layer信息，不熟悉的可以去看Dockerfile），不能进行回滚操作；而save是依据镜像来的，所以导入时可以完整保留下每一层layer信息。如下图所示，nginx:latest是save导出load导入的，nginx:imp是export导出import导入的。

<img src="/img/docker.pdf-43-0.png">

**建议**


可以依据具体使用场景来选择命令

- 
  若是只想备份images，使用save、load即可

- 
  若是在启动容器后，容器内容有变化，需要备份，则使用export、import



**Docker 镜像打标签**


**笔记本：** docker


**创建时间：** 2023/12/11 15:02 **更新时间：** 2023/12/11 15:03

#### Docker 镜像打标签


前面一章节中，我们使用 `docker build` 创建了一个 `twle/flask_365_102` 的镜像


但是，我们创建的镜像的标签都是 `latest`

```
 REPOSITORY TAG IMAGE ID CREATED SIZE

 twle/flask_365_102 latest 083eecd092af 27 seconds ago 922MB

```

如果我们可以将标签设置为 `365_102` 那该多好


**设置镜像标签**


我们可以使用 `docker tag` 命令，为镜像添加一个新的标签

```
 [root@localhost flask_365_102]# docker tag 083eecd092af twle/my-flask:365-102
```





|参数|说明|
|---|---|
|083eecd092af|镜像 ID|
|twle|用户名称|
|my-flask:365-<br>102|镜像源名<br>(repository<br>name)和新的标<br>签名|



使用 docker images 命令可以看到，ID 为 083eecd092af 的镜像多一个标签

```
 [root@localhost flask_365_102]# docker images

 REPOSITORY TAG IMAGE ID CREATED SIZE

 twle/my-flask 365-102 083eecd092af 13 minutes ago 922MB

 twle/flask_365_102 latest 083eecd092af 13 minutes ago 922MB

 twle/py365flask102 latest aaf108c1dbdc 4 hours ago 922MB

 python 3.6.5 29d2f3226daf 3 weeks ago 912MB

 nginx latest ae513a47849c 4 weeks ago 109MB

 ubuntu latest 452a96d81c30 4 weeks ago 79.6MB

 ubuntu 17.10 e4422b8da209 4 weeks ago 99.2MB

 hello-world latest e38bc07ac18e 7 weeks ago 1.85kB

```

```
jcdemo/flaskapp latest 084bae02af1b 4 months ago 98.9MB

ubuntu 17.04 fe1cc5b91830 5 months ago 95.6MB

ubuntu 16.10 7d3f705d307c 10 months ago 107MB

```

**docker 权限问题 Got permission denied while trying to connect to the Docker daemon**
**socket at 。。。**


**笔记本：** docker


**创建时间：** 2023/12/11 15:00 **更新时间：** 2023/12/11 15:02

#### **docker 权限问题** **Got permission denied while trying to connect to** **the Docker daemon socket at 。。。**

在用户权限下 [docker](https://so.csdn.net/so/search?q=docker&spm=1001.2101.3001.7020) 命令需要 sudo 否则出现以下问题

<img src="/img/docker.pdf-46-0.png">


通过将用户添加到docker用户组可以将sudo去掉，命令如下


sudo groupadd docker #添加docker用户组


sudo gpasswd -a $USER docker #将登陆用户加入到docker用户组中


newgrp docker #更新用户组


ubuntu18.04在重启后会生效，如果不是特别着急，可以先重启然后再做docker操作。



**构建docker镜像并推送到Harbor仓库**


**笔记本：** docker


**创建时间：** 2023/12/11 14:58 **更新时间：** 2023/12/11 15:00

#### **构建docker镜像并推送到Harbor仓库**


拉取tomcat镜像并推到harbor。

```
 docker pull tomcat

 docker login test.com

 docker tag tomcat:latest test.com/sunsy/basic-tomcat

 docker push test.com/sunsy/basic-tomcat

 #tomcat后面要跟上tag或者image id,如果忘记了,可以使用命令docker images查看

 #test.com是Harbor仓库地址,sunsy是Harbor仓库下的项目名称

 #basic-tomcat是推到项目上,该镜像的镜像名

```

<img src="/img/docker.pdf-47-0.png">

1、开始构建镜像


先要登录到harbor上，才有权限

docker login test.com

<img src="/img/docker.pdf-47-1.png">


写dockerfile

```
 FROM docker.io/tomcat:latest

 MAINTAINER crj

 RUN rm -rf /usr/local/tomcat/webapps/*

 ADD target/*.war /usr/local/tomcat/webapps/ROOT.war
 
 docker build -t test.com/sunsy/tomcat-java-demo .

```

6、开始推到harbor上

```
docker push 192.168.1.25/project/php-demo
```

7、登录harbor 192.168.1.25查看






**docker 镜像仓库Harbor https访问**


**笔记本：** docker


**创建时间：** 2023/12/11 14:52 **更新时间：** 2023/12/11 14:57

#### **docker 镜像仓库Harbor https访问**


配置harbor的https


为什么要配置https?


因为后续你将镜像打包好放入到harbor仓库中，若是生产环境的镜像，会包含很多隐私的配置文件（db，redis等），需要用到https进行加密


[参考文档：https://github.com/goharbor/harbor/blob/master/docs/configure_https.md](https://github.com/goharbor/harbor/blob/master/docs/configure_https.md)

[下载：https://github.com/goharbor/harbor/releases](https://github.com/goharbor/harbor/releases)

<img src="/img/docker.pdf-49-0.png">

下载：docker-compose


                         [https://docs.docker.com/compose/install/#install](https://docs.docker.com/compose/install/#install-compose) compose

**配置如下**


1、在harbor的目录中新建ssl目录，用来存放自签证书


[root@docker harbor]# mkdir ssl


2、[root@docker harbor]# cd ssl/


3、[root@docker ssl]# openssl genrsa -out ca.key 4096


4、主要是这里的域名test.com 就是待会访问harbor的域名


[root@docker ssl]# openssl req -x509 -new -nodes -sha512 -days 3650


-subj “/C=GZ/ST=Guangd/L=Taipei/O=example/OU=Personal/CN=test.com”


-key ca.key


-out ca.crt


5、[root@docker ssl]# openssl genrsa -out test.com.key 4096


6、[root@docker ssl]# openssl req -sha512 -new

-subj “/C=GZ/ST=Guangd/L=Taipei/O=example/OU=Personal/CN=test.com”

-key test.com.key


-out test.com.csr


7、[root@docker ssl]# cat > v3.ext <<-EOF


authorityKeyIdentifier=keyid,issuer


basicConstraints=CA:FALSE


keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment


extendedKeyUsage = serverAuth


subjectAltName = @alt_names


[alt_names]


DNS.1=test.com


DNS.2=test


DNS.3=hostname


EOF


8、[root@docker ssl]# openssl x509 -req -sha512 -days 3650


-extfile v3.ext


-CA ca.crt -CAkey ca.key -CAcreateserial

-in test.com.csr

-out test.com.crt

<img src="/img/docker.pdf-50-0.png">


9、修改配置文件


[root@docker harbor]# vi harbor.cfg


hostname = test.com #这个就是你访问的地址


ui_url_protocol = https


ssl_cert = ./ssl/test.com.crt


ssl_cert_key = ./ssl/test.com.key


harbor_admin_password = 123456


10、重载配置文件

[root@docker harbor]# ./prepare

<img src="/img/docker.pdf-50-1.png">11、安装，这个过程需要等5分钟

[root@docker harbor]# ./install.sh

<img src="/img/docker.pdf-51-0.png">

12、结果正常

<img src="/img/docker.pdf-51-1.png">

13、绑定hosts，访问

<img src="/img/docker.pdf-51-3.png">

<img src="/img/docker.pdf-51-2.png">


docker拉取镜像验证：


1、[root@docker ~]# vi /etc/docker/daemon.json


{“registry-mirrors”: [“  http://f1361db2.m.daocloud.io”],“insecure-registries”:[“  https://test.


com”,“192.168.1.13”]}

<img src="/img/docker.pdf-52-0.png">

2、绑定hosts

<img src="/img/docker.pdf-52-1.png">


3、重启docker

```
[root@docker ~]# systemctl restart docker
```

4、登录

```
[root@docker ~]# docker login  https://test.com
```

<img src="/img/docker.pdf-52-2.png">

第二种推荐：


最简单的方式


1、[root@docker ~]# mkdir -p /etc/docker/certs.d/test.com

2、拷贝生成的test.com.crt


[root@docker ~]# scp 192.168.1.25:/data/harbor/ssl/test.com.crt /etc/docker/certs.d/test.com/


3、[root@docker ~]# docker login test.com

4、不需要重启docker就可以

<img src="/img/docker.pdf-52-3.png">






**Docker-compose启动报错:Pool overlaps with other one on this address space**


**笔记本：** docker


**创建时间：** 2023/12/11 14:45 **更新时间：** 2023/12/11 14:49

#### **Docker-compose** **启动报错:Pool overlaps with other one on this address**


该错误的意思是 **docker** 已有一个容器占用了目前docker-compose里的subnet。


解决方法


1、修改当前docker-compose里的network配置，换一个subnet

2.执行命令 `docker network prune` （原因：即使容器停止/删除，网段依旧会被占用，运行该命令可清除占用子




**docker将镜像导出为tar文件并导入启动容器**


**笔记本：** docker


**创建时间：** 2023/12/11 14:47 **更新时间：** 2023/12/11 14:48

#### **docker将镜像导出为tar文件并导入启动容器**


**需求** ：在实际使用 **docker** 的过程中，某些机器不能上网，但是又需要某些docker镜像，


所以我们可以在能上网的机器上将docker镜像pull下来，然后保存为tar文件，这样直接就可以拿去别的机器上使


**保存镜像文件**


1. 启动目标镜像并查看，docker ps

   <img src="/img/docker.pdf-54-0.png">

[2. 将digapiss/ axis](https://so.csdn.net/so/search?q=axis&spm=1001.2101.3001.7020) 镜像下载下来

```
 docker save -o 镜像名字 .tar digapiss/axis
```

<img src="/img/docker.pdf-54-1.png">

3.默认保存在当前路径下

<img src="/img/docker.pdf-54-2.png">


这样我们就将镜像保存下来了。


**恢复镜像文件**


我们将保存的镜像文件进行恢复，首先先将我们一开始有的镜像删除，如果是别的机器就不要删除。


1. 先将运行的容器关闭，然后查看镜像，docker images，接着删除镜像

```
 docker rmi -f 镜像名字
```

<img src="/img/docker.pdf-55-0.png">

已经删除了

<img src="/img/docker.pdf-55-1.png">


2. 导入保存的镜像

```
 docker load --input axis1.4.tar
```

<img src="/img/docker.pdf-55-2.png">

查看是否倒入成功 ，可见已经成功倒入

<img src="/img/docker.pdf-55-3.png">


3. 启动倒入的镜像

   ```
   docker run -itd 镜像名字
   #如果显示未找到镜像则：
   docker run -itd 镜像名字:TAG的值
   ```

<img src="/img/docker.pdf-56-0.png">

可见，容器已经启动





## **docker常用命令**


**笔记本：** docker


**创建时间：** 2021/9/30 23:36 **更新时间：** 2021/9/30 23:40


**作者：** 彼岸樱速



`##` 查看 `docker` 容器版本

```
docker version
```

`##` 查看 `docker` 容器信息

```
docker info
```

`##` 查看 `docker` 容器帮助

```
docker --help
```




提示：对于镜像的操作可使用镜像名、镜像长ID和短ID。


**2.1、镜像查看**

`##` 列出本地 `images`

```
docker images
```

<img src="/img/docker.pdf-57-2.png">

`##` 含中间映像层

```
docker images -a
```

`##` 只显示镜像 `ID`

```
docker images -q
```

`##` 含中间映像层

```
docker images -qa

```

`##` 显示镜像摘要信息 `(DIGEST` 列 `)`

```
docker images --digests
```

<img src="/img/docker.pdf-57-3.png">

`##` 显示镜像完整信息

```
docker images --no-trunc
```

`##` 显示指定镜像的历史创建；参数： `-H` 镜像大小和日期，默认为 `true` ； `--no-trunc` 显示完整
的提交记录； `-q` 仅列出提交记录 `ID`

```
docker history -H redis
```

**2.2、镜像搜索**

`##` 搜索仓库 `MySQL` 镜像

```
docker search mysql
```

`## --filter=stars=600` ：只显示 `starts>=600` 的镜像

```
docker search --filter=stars=600 mysql
```

`## --no-trunc` 显示镜像完整 `DESCRIPTION` 描述

```
docker search --no-trunc mysql
```

`## --automated` ：只列出 `AUTOMATED=OK` 的镜像

```
docker search --automated mysql
```

**2.3、镜像下载**


`##` 下载 `Redis` 官方最新镜像，相当于： `docker pull redis:latest`

```
docker pull redis
```

`##` 下载仓库所有 `Redis` 镜像

```
docker pull -a redis
```

`##` 下载私人仓库镜像

```
docker pull bitnami/redis
```

<img src="/img/docker.pdf-58-0.png">

**2.4、镜像删除**


`##` 单个镜像删除，相当于： `docker rmi redis:latest`

```
docker rmi redis
```

`##` 强制删除 `(` 针对基于镜像有运行的容器进程 `)`

```
docker rmi -f redis
```

`##` 多个镜像删除，不同镜像间以空格间隔

```
docker rmi -f redis tomcat nginx
```

`##` 删除本地全部镜像

```
docker rmi -f $(docker images -q)
```

**2.5、镜像构建**


`##` （ `1` ）编写 `dockerfile`

```
cd /docker/dockerfile
vim mycentos
```

`##` （ `2` ）构建 `docker` 镜像

```
docker build -f /docker/dockerfile/mycentos -t mycentos:1.1
```

**3.1、容器启动**

提示：对于容器的操作可使用CONTAINER ID 或 NAMES。


`##` 新建并启动容器，参数： `-i` 以交互模式运行容器； `-t` 为容器重新分配一个伪输入终端； `--`
`name` 为容器指定一个名称


```
docker run -i -t --name mycentos
```

`##` 后台启动容器，参数： `-d` 已守护方式启动容器

```
docker run -d mycentos
```

注意：此时使用"docker ps -a"会发现容器已经退出。这是docker的机制：要使Docker容器后台运行，就必
须有一个前台进程。解决方案：将你要运行的程序以前台进程的形式运行。


`##` 启动一个或多个已经被停止的容器

```
docker start redis
```

`##` 重启容器

```
docker restart redis
```

**3.2、容器进程**


`##top` 支持 `ps` 命令参数，格式： `docker top [OPTIONS] CONTAINER [ps OPTIONS]##` 列
出 `redis` 容器中运行进程

```
docker top redis
```

`##` 查看所有运行容器的进程信息

```
for i in `docker ps |grep Up|awk '{print $1}'`;do echo / &&docker top $i;

done
```

**3.3、容器日志**


`##` 查看 `redis` 容器日志，默认参数

```
docker logs rabbitmq
```

`##` 查看 `redis` 容器日志，参数： `-f` 跟踪日志输出； `-t` 显示时间戳； `--tail` 仅列出最新 `N` 条容器

日志；

```
docker logs -f -t --tail=20 redis
```

`##` 查看容器 `redis` 从 `2019` 年 `05` 月 `21` 日后的最新 `10` 条日志。

```
docker logs --since="2019-05-21" --tail=10 redis
```

**3.4、容器的进入与退出**


`##` 使用 `run` 方式在创建时进入

```
docker run -it centos /bin/bash
```

`##` 关闭容器并退出

```
exit
```

`##` 仅退出容器，不关闭


快捷键： `Ctrl + P + Q`
`##` 直接进入 `centos` 容器启动命令的终端，不会启动新进程，多个 `attach` 连接共享容器屏幕，参


数： `--sig-proxy=false` 确保 `CTRL-D` 或 `CTRL-C` 不会关闭容器

```
docker attach --sig-proxy=false centos
```

`##` 在 `centos` 容器中打开新的交互模式终端，可以启动新进程，参数： `-i` 即使没有附加也保持
`STDIN` 打开； `-t` 分配一个伪终端

```
docker exec -i -t centos /bin/bash
```

`##` 以交互模式在容器中执行命令，结果返回到当前终端屏幕

```
docker exec -i -t centos ls -l /tmp
```

`##` 以分离模式在容器中执行命令，程序后台运行，结果不会反馈到当前终端

```
docker exec -d centos touch cache.txt
```

**3.5、查看容器**


`##` 查看正在运行的容器

```
docker ps
```

`##` 查看正在运行的容器的 `ID`

```
docker ps -q
```

`##` 查看正在运行 `+` 历史运行过的容器

```
docker ps -a
```

`##` 显示运行容器总文件大小

```
docker ps -s
```

<img src="/img/docker.pdf-60-0.png">

`##` 显示最近创建容器

```
docker ps -l
```

`##` 显示最近创建的 `3` 个容器

```
docker ps -n 3
```

`##` 不截断输出

```
docker ps --no-trunc
```

<img src="/img/docker.pdf-60-1.png">

`##` 获取镜像 `redis` 的元信息

```
docker inspect redis
```

`##` 获取正在运行的容器 `redis` 的 `IP`


`docker inspect --format='{{range .` NetworkSettings.Networks `}}{{.IPAddress}}`

```
{{end}}' redis
```

**3.6、容器的停止与删除**


`##` 停止一个运行中的容器

```
docker stop redis
```

`##` 杀掉一个运行中的容器

```
docker kill redis
```

`##` 删除一个已停止的容器

```
docker rm redis
```

`##` 删除一个运行中的容器

```
docker rm -f redis
```

`##` 删除多个容器

```
docker rm -f $(docker ps -a -q)
docker ps -a -q | xargs docker rm
```

`## -l` 移除容器间的网络连接，连接名为 `db`

```
docker rm -l db
```

`## -v` 删除容器，并删除容器挂载的数据卷

```
docker rm -v redis
```

**3.7、生成镜像**


`##` 基于当前 `redis` 容器创建一个新的镜像；参数： `-a` 提交的镜像作者； `-c` 使用 `Dockerfile` 指令


来创建镜像； `-m :` 提交时的说明文字； `-p :` 在 `commit` 时，将容器暂停
`docker commit -a="DeepInThought" -m="my redis" [redis` 容器 `ID] myredis:v1.1`


**3.8、容器与主机间的数据拷贝**


`##` 将 `rabbitmq` 容器中的文件 `copy` 至本地路径

```
docker cp rabbitmq:/[container_path] [local_path]
```

`##` 将主机文件 `copy` 至 `rabbitmq` 容器

```
docker cp [local_path] rabbitmq:/[container_path]/
```

`##` 将主机文件 `copy` 至 `rabbitmq` 容器，目录重命名为 `[container_path]` （注意与非重命名 `copy`

的区别）

```
docker cp [local_path] rabbitmq:/[container_path]
```

