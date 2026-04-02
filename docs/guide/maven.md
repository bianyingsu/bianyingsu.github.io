---
aliases:
  - maven
标题: maven
---
**Maven仓库加载顺序详解：settings.xml配置优先级解析**


**笔记本：** maven


**创建时间：** 2025/5/11 15:38


**URL：** https://blog.csdn.net/qq_47183158/article/details/146228956

### **Maven仓库加载顺序详解：settings.xml配置优先级解析**


[一枚码仔](https://blog.csdn.net/qq_47183158) 于 2025-03-13 14:03:55 发布 阅读量1.1k 收藏
11 点赞数
20


分类专栏： [Java](https://blog.csdn.net/qq_47183158/category_12742826.html) 文章标签： [maven](https://so.csdn.net/so/search/s.do?q=maven&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [xml](https://so.csdn.net/so/search/s.do?q=xml&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [java](https://so.csdn.net/so/search/s.do?q=java&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art)


Java [[专栏收录该内容]](https://blog.csdn.net/qq_47183158/category_12742826.html)



在Maven **`1`** 构建企业级项目时，依赖仓库的加载顺序问题常引发隐蔽的构建故障。开发者配置的私有仓库可能被

新异常，阻碍联调；甚至本地缓存残留引发依赖冲突。这些问题的根源在于Maven的多级仓库加载机制和配置





仓库、 **`3`** Profile仓库与POM仓库的优先级关系，还原依赖加载的全链路逻辑。



**一、仓库配置全景图** **`5`**



<img src="/img/maven.pdf-0-1.png">0-1


**二、核心配置元素优先级**

|配置位置|生效范围|优先级|
|---|---|---|
|**本地仓库**|全局|最高|
|**Mirror镜像**|全局覆盖|高|
|**settings.xml**|Profile级|中|
|**POM文件**|项目级|低|



**三、详细加载顺序解析**


**1. 本地仓库优先原则**


Maven首先检查 `${user.home}/.m2/repository` ：

```
 <settings>

  <localRepository>/path/to/custom/repo</localRepository>

 </settings>

```

**2. Mirror镜像覆盖机制**


示例配置：

```
 <mirrors>

  <mirror>

     <id>aliyun</id>

     <name>阿里云镜像</name>

     <url>https://maven.aliyun.com/repository/public</url>

     <mirrorOf>central,jcenter</mirrorOf>

  </mirror>

 </mirrors>

```

**3. Profile仓库加载顺序**



<img src="/img/maven.pdf-1-0.png">1-0
```
 <profiles>

  <profile>

     <id>custom</id>

     <repositories>

       <repository>

          <id>internal-repo</id>

          <url>http://repo.internal.com</url>
```

_`<!--`_ 优先级高于 _`pom`_ 中的仓库 _`-->`_

```
          <releases>

            <enabled>true</enabled>

            <updatePolicy>daily</updatePolicy>

          </releases>

       </repository>

     </repositories>

  </profile>

 </profiles>

 <activeProfiles>

  <activeProfile>custom</activeProfile>

 </activeProfiles>

```

**4. POM文件仓库兜底**

```
 <!-- pom.xml -->

 <repositories>

  <repository>

     <id>thirdparty</id>

     <url>http://nexus.company.com/repo</url>

  </repository>

 </repositories>

```

**四、完整加载顺序流程**


<img src="/img/maven.pdf-3-0.png">3-0

**五、关键配置策略**


**1. 更新策略控制**

```
 <repository>

  <id>snapshots</id>

  <snapshots>

     <enabled>true</enabled>

```

_`<!--`_ 更新频率策略 _`-->`_

```
     <updatePolicy>interval:60</updatePolicy>

  </snapshots>

 </repository>

```



<img src="/img/maven.pdf-4-0.png">4-0



`always` 每次


`daily` (默认) 每天首


`interval:X` 每隔X


`never` 仅


**2. 认证信息优先级**


**六、常见问题排查**


**场景1** ：依赖下载始终来自中央仓库

✅ 检查 `mirrorOf` 是否覆盖了目标仓库ID


**场景2** ：私有仓库依赖无法解析

✅ 验证 `settings.xml` 中server配置与repository ID匹配


**场景3** ：SNAPSHOT版本不更新

✅ 检查 `updatePolicy` 是否设置为 `always`



<img src="/img/maven.pdf-4-1.png">4-1
**调试命令** ：

```
 mvn dependency:resolve -X | grep 'Downloading from'`

```

**七、最佳实践建议**


1. **镜像全局覆盖** ：配置阿里云镜像加速公共依赖下载

```
 <mirror>

  <id>aliyun</id>

  <mirrorOf>*</mirrorOf>

  <url>https://maven.aliyun.com/repository/public</url>

 </mirror>

```

2. **分层配置策略** ：


基础镜像配置在 `settings.xml`


项目特殊仓库声明在 `pom.xml`


环境差异配置通过 `profile` 管理


3. **版本锁定** ：结合 `<dependencyManagement>` 控制依赖版本


**maven缺失ojdbc6解决方法（手动安装ojdbc6）**


**笔记本：** maven


**创建时间：** 2024/11/3 16:44


**URL：** https://www.cnblogs.com/wusl123/p/18298820



<img src="/img/maven.pdf-6-0.png">6-0

<img src="/img/maven.pdf-6-1.png">6-1

<img src="/img/maven.pdf-6-2.png">6-2
**maven不能下载ojdbc14-10.2.0.4.0.jar**


**笔记本：** maven


**创建时间：** 2024/11/3 16:44


**URL：** https://zhuanlan.zhihu.com/p/539224803


**maven不能下载ojdbc14-10.2.0.4.0.jar**


**[Alixia](https://www.zhihu.com/people/alixia-10)**


1 人赞同了该文章


**原因：ojdbc14-10.2.0.4.0.jar是收费的，不能从maven中央仓库中下载；**


**解决办法**


1、单独下载jar包，下载地址：


2、安装jar包，在maven 的bin目录中执行以下指令（-Dfile后根jar文件的路径）



<img src="/img/maven.pdf-7-1.png">7-1



编辑于 2022-10-09 09:54


[Maven](https://www.zhihu.com/topic/19629084) [Java](https://www.zhihu.com/topic/19561132) [Spring Boot](https://www.zhihu.com/topic/20044714)


**解决安装JAR包的The goal you specified requires a project to execute but there is no POM in**
**this directory**


**笔记本：** maven


**创建时间：** 2024/11/3 16:43


**URL：** https://blog.csdn.net/zhebushibiaoshifu/article/details/142604861

### **解决安装JAR包的The goal you specified requires a proje** **OM in this directory**


[疯狂学习GIS](https://fkxxgis.blog.csdn.net/) 于 2024-09-28 00:13:32 发布 阅读量724 收藏
4 点赞数
11


分类专栏： [Java学习与应用](https://blog.csdn.net/zhebushibiaoshifu/category_12722214.html) [Groovy学习与应用](https://blog.csdn.net/zhebushibiaoshifu/category_12414409.html) [计算机高效操作](https://blog.csdn.net/zhebushibiaoshifu/category_10834230.html) 文章标签： [Maven](https://so.csdn.net/so/search/s.do?q=Maven&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [JAR](https://so.csdn.net/so/search/s.do?q=JAR&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [mvn](https://so.csdn.net/so/search/s.do?q=mvn&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [Java](https://so.csdn.net/so/search/s.do?q=Java&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [Ja](https://so.csdn.net/so/search/s.do?q=Jar%E6%96%87%E4%BB%B6&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art)



<img src="/img/maven.pdf-8-0.png">8-0

<img src="/img/maven.pdf-8-1.png">8-1

<img src="/img/maven.pdf-8-2.png">8-2

<img src="/img/maven.pdf-8-3.png">8-3



**`1`** 本文介绍在 **Windows** 中，通过 **Maven** 的 `mvn install:install-file` 命令安装 **JAR** 包时，提示 `The goal you specif`

`directory` 错误的解决方法。


在 **Java** 开发中，如果需要安装一些不在公共 **Maven** 仓库中的第三方库时，或者需要在内网环境中安装库时


将本地的 `.jar` 文件安装到本地的 **Maven** 仓库中。但是，有时这样的操作就会出现类似 `The goal you specified requi`


样的报错提示信息。


例如，我在电脑中的 **PowerShell** 中，运行了如下所示的 `mvn install:install-file` 命令。





随后，按下 `回车` 键，就出现了这个提示；如下图所示。


其中，可以保证我这里的 `mvn install:install-file` 命令肯定是没问题的。经过不断尝试，随后终于发现问题所


问题出在了运行命令的终端中。对于 **PowerShell** ，如果需要运行 `mvn install:install-file` 命令，必须将其后


如以下代码所示。



<img src="/img/maven.pdf-8-5.png">8-5
其中，上述代码和本文开头的那句代码一模一样，唯一的不同就是 **每一个参数都用英文的双引号包围起来**


在 **PowerShell** 中运行这个修改后的命令，发现此时就可以成功将本地的 `.jar` 文件安装到本地的 **Maven** 仓库


而如果大家是在 **cmd** 中运行的 `mvn install:install-file` 命令，那么就 **不需要** 在参数上加 **双引号** 了。


例如，我换了本地的另一个 `.jar` 文件，然后在 **cmd** 中运行以下不带双引号的命令。



<img src="/img/maven.pdf-9-1.png">9-1



运行上述代码，发现这个不带有双引号的命令也可以将本地的 `.jar` 文件安装到本地的 **Maven** 仓库中，如下图



<img src="/img/maven.pdf-9-3.png">9-3
所以，大家如果遇到本文的这个 `The goal you specified requires a project to execute but there is no POM in th`


试添加或删除参数上的双引号来解决问题。


至此，大功告成。


欢迎关注：疯狂学习GIS


**文章知识点与官方知识档案匹配，可进一步学习相关知识**


[Java技能树](https://edu.csdn.net/skill/java/?utm_source=csdn_ai_skill_tree_blog) [首页](https://edu.csdn.net/skill/java/?utm_source=csdn_ai_skill_tree_blog) [概览](https://edu.csdn.net/skill/java/?utm_source=csdn_ai_skill_tree_blog) 153046 人正在系统学习中



<img src="/img/maven.pdf-10-0.png">10-0
**nexus配置阿里云代理**


**笔记本：** maven


**创建时间：** 2024/3/19 12:41 **更新时间：** 2024/3/19 12:49

### nexus配置阿里云代理


1. 点击 repositories


2. 点击 create repository


3. 选中maven(proxy)


4. 设置阿里云


阿里云nexus仓库URL: http://maven.aliyun.com/nexus/content/groups/public



<img src="/img/maven.pdf-11-0.png">11-0

<img src="/img/maven.pdf-11-1.png">11-1

<img src="/img/maven.pdf-11-2.png">11-2
<img src="/img/maven.pdf-12-0.png">12-0

<img src="/img/maven.pdf-12-1.png">12-1

5. maven-public


6. 把阿里云设置为第一位



<img src="/img/maven.pdf-12-2.png">12-2

<img src="/img/maven.pdf-12-3.png">12-3
<img src="/img/maven.pdf-13-0.png">13-0

设置maven的setting.xml文件



<img src="/img/maven.pdf-13-1.png">13-1



<img src="/img/maven.pdf-13-2.png">13-2


**maven 中deploy命令报401错误的原因及解决方案**


**笔记本：** maven


**创建时间：** 2023/12/11 16:49 **更新时间：** 2023/12/11 17:01

### **maven 中deploy命令报401错误的原因及解决方案**


在mac版idea使用过程中有时候会出现deploy时候报401错误，如图：


经过详细的论证分析，找到如下原因及解决方案：


原因一、pom 文件李配置的私服仓库地址和settings.xml里配置的用户名和密码没有匹配上


1、pom.xml里的仓库配置：

```
 <!--项目分发信息，在执行mvn deploy后表示要发布的位置。有了这些信息就可以把网站部署到远程服务器或者把构件j

 <distributionManagement>

 <repository><!--部署项目产生的构件到远程仓库需要的信息 -->

 <id>releases</id><!-- 此处id和settings.xml的id保持一致 -->

 <name>Release Deploy</name>

 <url>http://10.60.145.41:881/repository/maven-releases/</url>

 </repository>

 <snapshotRepository><!--构件的快照部署到哪里？如果没有配置该元素，默认部署到repository元素配置的

 <id>snapshots</id><!-- 此处id和settings.xml的id保持一致 -->

 <name>Snapshot Deploy</name>

 <url>http://10.60.145.41:881/repository/maven-snapshots/</url>

 </snapshotRepository>

 </distributionManagement>

```

2、此时对应的setting.xml里的配置信息为：

```
 <server>

 <id>snapshots</id><!-- 此处id和上面pom.xml的id保持一致 -->

 <username>nandao</username>

 <password>123456</password>

 </server>

 <server>

 <id>releases</id><!-- 此处id和上面pom.xml的id保持一致 -->

 <username>nandao</username>

 <password>123456</password>

```


<img src="/img/maven.pdf-14-0.png">14-0
```
 </server>

```

3、检查两者信息是否一致，就可以解决问题。如果还是报401问题，则可能是下面的原因。


原因二、idea中自定义的settings.xml配置没有生效


1、idea中的配置：


但是经过严格验证，在mac电脑上可能没生效，原因可能是配置环境变量的问题。


2、此时我们应该采用idea 默认的配置，即把该自定义setting.xml配置放到.m2的目录下


3、检查环境变量配置，一切就会OK.


4、maven deploy 已存在的包的时候出现400错误，这个问题不大。



<img src="/img/maven.pdf-15-0.png">15-0

<img src="/img/maven.pdf-15-1.png">15-1
**maven上传jar包到nexus私服后的存放路径**


**笔记本：** maven


**创建时间：** 2023/12/11 16:42 **更新时间：** 2023/12/11 16:47



<img src="/img/maven.pdf-16-0.png">16-0
<img src="/img/maven.pdf-17-0.png">17-0

<img src="/img/maven.pdf-17-1.png">17-1


**Maven本地上传Nexus私服的两种方式**


**笔记本：** maven


**创建时间：** 2023/12/11 16:31 **更新时间：** 2023/12/11 16:34
## Maven 本地上传 Nexus 私服的两种方式

1. **通过** Web **界面上传本地** jar **包到私服**

登录配置好的私服地址（进入 Nexus 私服可视化界面）

Views/Repositories ~~---~~  - repositories ~~---~~  - 选择右边： “3rd party” ~~---~~  - 选择下方： “Artifact


操作步骤图

2. **通过** cmd **窗口使用命令行上传**

**使用命令上传的原因：** Nexus **私服的** Release **仓库不允许上传** SNAPSHOT **版本，会报错，而**

SNAPSHOT **仓库不提供** Web **界面上传功能。所以通过** Maven **命令行直接上传文件。**



<img src="/img/maven.pdf-18-11.png">18-11

<img src="/img/maven.pdf-18-17.png">18-17


**参数分析**

url: nexus 上的目标 SNAPSHOT 仓库的 URL 地址。

repositoryId: maven 本地 settings.xml 中，与上述 URL 对应的节点中配置的 id 。



<img src="/img/maven.pdf-19-3.png">19-3
**Maven 打包项目到私服**


**笔记本：** maven


**创建时间：** 2023/12/11 16:25 **更新时间：** 2023/12/11 16:28



<img src="/img/maven.pdf-20-0.png">20-0

<img src="/img/maven.pdf-20-1.png">20-1


<img src="/img/maven.pdf-21-0.png">21-0

<img src="/img/maven.pdf-21-1.png">21-1


**Maven的pom.xml文件结构之环境配置distributionManagement**


**笔记本：** maven


**创建时间：** 2023/12/11 16:18 **更新时间：** 2023/12/11 16:23

### **Maven的pom.xml文件结构之环境配置** **distributionManagement**


Maven项目的POM中，环境配置<distributionManagement>负责管理构件的发布。


当然，完整的配置，还需要在settings.xml中配置构件库所在的服务器server相关的参数。


1.<distributionManagement>的基本配置

```
 <distributionManagement>

 ...

 <downloadUrl>http://cat.myserver.org/my-project</downloadUrl>

 <status>deployed</status>

 </distributionManagement>

```

说明：


downloadUrl，一个URL，其他Maven项目可以通过该URL下载并引用当前Maven项目的构件。


注意区别本文下面的<repository>中的URL，<repository>中的URL给出了当前Maven项目的构件的发布UR


status，当前Maven项目的状态，可用的状态如下所示。注意，该值是由Maven自动设置，永远不要人工设


none，未指明状态，默认值


converted，该Maven项目的构件已经被转换为兼容Maven 2


partner，该Maven项目的构件保持与另一个库的Maven版本一致


deployed，该Maven项目的构件是通过Maven 2或Maven 3发布的，最常用的值


verified，该Maven项目的构件已经被验证过


2.<distributionManagement>的<repository>配置


给出Maven部署当前项目的构件到远程库时，关于远程库的配置。示例如下：

```
 <distributionManagement>

 <repository>

 <uniqueVersion>false</uniqueVersion>

 <id>corp1</id>

 <name>Corporate Repository</name>

 <url>scp://repo/maven2</url>

 <layout>default</layout>

 </repository>

 <snapshotRepository>

 <uniqueVersion>true</uniqueVersion>

 <id>propSnap</id>

 <name>Propellors Snapshots</name>

 <url>sftp://propellers.net/maven</url>

 <layout>legacy</layout>

 </snapshotRepository>

 ...

 </distributionManagement>

```

具体配置参数，参考前文。


3. <distributionManagement>的<site>配置


除了部署当前Maven项目的构件，还可以部署当前Maven项目的网站和文档。示例如下：


```
 <distributionManagement>

 ...

 <site>

 <id>mojo.website</id>

 <name>Mojo Website</name>

 <url>scp://beaver.codehaus.org/home/projects/mojo/public_html/</url>

 </site>

 ...

 </distributionManagement>

```

这里的配置参数与<repository>中的对应配置参数一致。


4. <distributionManagement>的<relocation>配置


随着一个Maven项目的发展壮大，该Maven项目的构件可能需要重新发布到新的库。


<relocation>可以将当前Maven项目以新的构件的形式发布到另一个库。示例如下：

```
 <distributionManagement>

 ...

 <relocation>

 <groupId>org.apache</groupId>

 <artifactId>my-project</artifactId>

 <version>1.0</version>

 <message>We have moved the Project under Apache</message>

 </relocation>

 ...

 </distributionManagement>

```

**继承spring boot父项目后project报错parent.relativePathxxx**


**笔记本：** maven


**创建时间：** 2023/12/11 16:15 **更新时间：** 2023/12/11 16:17

### **继承spring boot父项目后project报错** **parent.relativePath‘ of POM** **org.example:springboot_day01:1.0-SNAPSHOT (*:/**

```
  <parent>
  <groupId> org.springframework.boot </groupId>
  <artifactId> spring-boot-starter-parent </artifactId>

  <version> 2.2.5.RELEASE </version>

  </parent>

```

后改为

```
  <parent>
  <groupId> org.springframework.boot </groupId>
  <artifactId> spring-boot-starter-parent </artifactId>
  <version> 2.2.5.RELEASE </version>

  <relativePath />
  </parent>

```

就正常了


原因：因为我这个项目已经是子项目 然后在子项目中继承了个父项目 继承的却不是自己的父项目所以报红



<img src="/img/maven.pdf-24-0.png">24-0
**maven - setting.xml 国内资源中央仓库配置样例**


**笔记本：** maven


**创建时间：** 2023/12/11 15:58 **更新时间：** 2023/12/11 15:59



<img src="/img/maven.pdf-25-0.png">25-0
```
<snapshots>
<enabled>false</enabled>
</snapshots>
</pluginRepository>
</pluginRepositories>
</profile></profiles>
</settings>

```

**springboot pom文件＜packaging＞pom＜/packaging＞ 无法加载读取的问题**


**笔记本：** maven


**创建时间：** 2023/12/11 15:55 **更新时间：** 2023/12/11 15:57

### **springboot pom文件设置＜packaging＞pom＜/packagin** **对于application.yml无法加载读取的问题**


**一.问题描述**


**1.1 描述**


1.一个jpa的项目，不知道怎么创建的项目时，反正pom文件中有打包方式为<packaging>pom</packaging>，


启动项目无法启动,报错如下：



<img src="/img/maven.pdf-27-0.png">27-0
<img src="/img/maven.pdf-28-0.png">28-0

**1.2 解决办法**


妈蛋，解决了一上午最后才发现 ，是这个地方闹腾的， **将pom文件的<packaging>pom</packaging>去掉，**

**动起来了**


**1.3 原因**


`<packaging>pom</packaging>` 的意思是项目 **里没有java代码，也不执行任何代码，只是为了聚合工程或传递依赖用的**


**所以并不会寻找配置文件，若想配置文件生效，改为** **`<packaging>jar</packaging>`**


[https://segmentfault.com/q/1010000022275334](https://segmentfault.com/q/1010000022275334)


**二.<packing>pom</packing>的使用场景**


maven 默认的打包类型为 jar， **在项目聚合的时候，需要显式的将** **父项目的 packing 指定为 pom，**


**然后再指定所属的子模块** ，如下所示：


如果没有将packing 指定为pom ，那么子 **模块之间将无法正常的进行依赖传递。**



<img src="/img/maven.pdf-28-1.png">28-1

<img src="/img/maven.pdf-28-2.png">28-2
我们执行的maven命令的时候将首先对父项目执行，而后 **当** **父项目** **的packing 类型为 pom 时，**

**将对所有的子模块执行同样的命令** ，


否则 **将无法执行同样的命令，那么依赖的传递将无法由maven 编译或者打包命令** **得以执行** 。


参考官网：


http://maven.apache.org/guides/introduction/introduction-to-the-pom.html


总结： **Maven-多模块项目的聚合，父项目必须将packing 指定** **为 pom**


**三.pom.xml配置文件中的packaging标签的作用**


**3.1 项目打包的类型**


**3.2 案例介绍**


MyProject下面有三个模块项目SubProject1、SubProject2、SubProject3，项目目录结构如下：


MyProject下面有三个模块项目SubProject1、SubProject2、SubProject3。


那么我们可以 **将三个模块项目的公共部分，写在MyProject项目的pom.xml文件上，**


**然后在模块项目的pom.xml中来继承** 它，这样模块项目就可以用到公共部分的东西。


MyProject项目的pom.xml **就是我们的所说的父类型，它的打包类型要写成pom** ，如：



<img src="/img/maven.pdf-29-0.png">29-0

<img src="/img/maven.pdf-29-1.png">29-1
<img src="/img/maven.pdf-30-0.png">30-0

在ＭyProject下的pom.xml通过<modules>标签指定了子项目的相对路径。


这就可以 **直接在MyProject项目里执行mvn命令，一次构建全部模块。**


**当然，到每个模块的目录下执行mvn命令，逐个构建也是没问题的** 。


在分模块（子项目）下的pom.xml通过 **<parent>标签继承ＭyProject下的pom.xml即可** ，如SubProject1子项目



<img src="/img/maven.pdf-30-1.png">30-1
**【坑】【maven】在PowerShell窗口下执行maven命令行报错：Unknown lifecycle phase**
**".test.skip=true"**


**笔记本：** maven


**创建时间：** 2023/12/11 15:53 **更新时间：** 2023/12/11 15:53

### **【坑】【maven】在PowerShell窗口下执行maven命令行报** **Unknown lifecycle phase ".test.skip=true".**


在PowerShell窗口下执行maven命令行报错：Unknown lifecycle phase “.test.skip=true”.


不说废话，先展示错误信息


解决方法


方法一

```
   命令改为： mvn clean install package '-Dmaven.test.skip=true'

```

方法二

```
   不要使用 PowerShell 命令行模式，使用 cmd 进入命令行执行： mvn clean install package -Dmaven.test.skip=true

```

终结


win10下 Shift+右击 打开的是 PowerShell 窗口，而 PowerShell 窗口下，执行带参数的需要’单引号’包起来才



<img src="/img/maven.pdf-31-0.png">31-0
**【Maven】pom中的optional元素是什么？**


**笔记本：** maven


**创建时间：** 2023/12/11 15:50 **更新时间：** 2023/12/11 15:51

### **【Maven】pom中的optional元素是什么？**

pom.xml里面依赖dependency的元素标签optional的作用


假如你的Project A的某个依赖D添加了 `<optional>true</optional>` ，


<dependency>

<groupId>org.springframework.boot</groupId>


<artifactId>spring-boot-devtools</artifactId>

<optional>true</optional> <!-- 防止将devtools依赖传递到其他模块中 -->


</dependency>


**当别人通过pom依赖Project A的时候，D不会被传递依赖进来**


**当你依赖某各工程很庞大或很可能与其他工程的jar包冲突的时候建议加上该选项，可以节省开销，同时减少依**


**maven deploy 400 Bad Request**


**笔记本：** maven


**创建时间：** 2023/12/11 15:45 **更新时间：** 2023/12/11 15:49


将一个 maven 项目发布到私有的 nexus 服务器，很简单，就是这样一个命令即可





但是在首次尝试时遇到了一个 400 错误

一番检查发现是因为 pom.xml 中配置错了发布地址



<img src="/img/maven.pdf-33-4.png">33-4



需要将 release.url 变量改成一个允许发布的地址。


怎么找这样的地址呢？在私服 nexus 中可以看到仓库分为

我们一开始设置的 release url 是 group 类型的地址，而这个地址是不能够用于发布的，因为它只

是将各个参考 group/ 聚合在一起的呀。

我们只能选择 hosted 类型的仓库进行发布，这里我们根据项目的特点，选择 releases 那个仓库。

因为这个库的 Deployment Policy 是 **`Allow Redeploy`** ，所以能够进行发布。



<img src="/img/maven.pdf-33-10.png">33-10
<img src="/img/maven.pdf-34-0.png">34-0

我们在 Summary 中查看 distributionManagement 所需的信息

用其中的 url 替换我们项目 pom 文件中的内容，即

```
 <properties>

 <releases.url>http://yourhost/nexus/content/repositories/releases</releases.url>

```


<img src="/img/maven.pdf-34-4.png">34-4
<img src="/img/maven.pdf-35-0.png">35-0





再次执行 `mvn deploy` 就可以看到我们的 jar 包被成功发布到私有仓库了。

PS ：因为发布到私有仓库是需要账号密码的，所以你需要在自己的 ~/.m2/settings.xml 中指定


server 的 id 和账号密码，其中 id 要和项目中的 id 一致。



<img src="/img/maven.pdf-35-2.png">35-2
**本地安装maven的jar包报错Artifact is already in the local repository**


**笔记本：** maven


**创建时间：** 2023/12/11 15:41 **更新时间：** 2023/12/11 15:43

### **本地安装maven的jar包报错Artifact is already in the loca**


原因是我直接把jar包放在了仓库里面


解决办法：将jar办放在不是仓库路径位置，在进行install就okle


**maven setting 多仓库配置**


**笔记本：** maven


**创建时间：** 2023/11/21 11:03 **更新时间：** 2023/12/11 15:42

### **maven setting 多仓库配置**


**前言**


maven setting 通常公司都有私服地址，但不是所有包私服上都有，这时就要用阿里云或者其他地址去拉包。


那么我们可以直接设置setting 使其拉包时第一个地址拉取不到自动到第二个地址拉取以此类推可设置多个仓库


**一 、setting文件**

```
 <?xml version="1.0" encoding="UTF-8"?>
 <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/set

 <localRepository> D:/software/dev/apache-maven-3.6.3/Repositories </localRepository>
 <pluginGroups></pluginGroups>
 <proxies></proxies>
 <servers></servers>
 <mirrors></mirrors>

 <profiles>
 <profile>
 <id> aliyun </id>

 <repositories>
 <repository>
 <id> aliyun </id>
 <url> https://maven.aliyun.com/repository/public </url>

 <releases>
 <enabled> true </enabled>

 </releases>
 <snapshots>
 <enabled> true </enabled>

 <updatePolicy> always </updatePolicy>
 </snapshots>
 </repository>
 </repositories>
 </profile>
    <profile>
      <id> private </id>
      <repositories>
        <repository>
          <id> maven-releases </id>

          <name> User Porject Release </name>
          <url> http:// 私服地址 /nexus/repository/maven-releases/ </url>

          <snapshots>
            <enabled> false </enabled>

          </snapshots>
          <releases>

            <enabled> true </enabled>

          </releases>

        </repository>
        <repository>
          <id> maven-snapshots </id>

          <name> User Porject Snapshot </name>

          <url> http:// 私服地址 /nexus/repository/maven-snapshots/ </url>
          <snapshots>

            <enabled> true </enabled>

            <updatePolicy> always </updatePolicy>
          </snapshots>
        </repository>

```

_`<!--`_ 也可以把阿里云等仓库地址直接在这里补充 _`-->`_
```
        <repository>

```

```
           <id> com.e-iceblue </id>

           <name> e-iceblue </name>

            <url> http://repo.e-iceblue.cn/repository/maven-public/ </url>

         </repository>
        </repositories>
      </profile>
  <!-- <profile>-->
  <!-- <id>repo1</id>-->
  <!-- <repositories>-->
  <!-- <repository>-->
  <!-- <id>repo1</id>-->
  <!-- <url>https://repo1.maven.org/maven2</url>-->
  <!-- <releases>-->
  <!-- <enabled>true</enabled>-->
  <!-- </releases>-->
  <!-- <snapshots>-->
  <!-- <enabled>true</enabled>-->
  <!-- <updatePolicy>always</updatePolicy>-->
  <!-- </snapshots>-->
  <!-- </repository>-->
  <!-- </repositories>-->
  <!-- </profile>-->
  <!-- <profile>-->
  <!-- <id>repo2</id>-->
  <!-- <repositories>-->
  <!-- <repository>-->
  <!-- <id>repo2</id>-->
  <!-- <url>https://repo2.maven.org/maven2</url>-->
  <!-- <releases>-->
  <!-- <enabled>true</enabled>-->
  <!-- </releases>-->
  <!-- <snapshots>-->
  <!-- <enabled>true</enabled>-->
  <!-- <updatePolicy>always</updatePolicy>-->
  <!-- </snapshots>-->
  <!-- </repository>-->
  <!-- </repositories>-->
  <!-- </profile>-->
  </profiles>

  <activeProfiles>
  <activeProfile> aliyun </activeProfile>

  <activeProfile> private </activeProfile>
  <!-- <activeProfile>repo1</activeProfile>-->
  <!-- <activeProfile>repo2</activeProfile>-->
  </activeProfiles>
  </settings>

```

**二、其他问题**


1. maven 默认有一个setting文件，如果我们的setting文件有很多，而默认setting中的mirror 直接指定了仓库


2. 此时无论引用哪个setting文件，都会首先到默认setting内指定的仓库中拉取。


如下图所示，我的默认setting文件如此设置后，我指定了另外的setting文件，


3. 但是他会去D:/software/dev/apache-maven-3.6.3/Repositories/hlj路径下寻包，


4. 寻找不到直接报错 `Could not find artifact xxx in public`


5. `(file://D:/software/dev/apache-maven-3.6.3/Repositories/hlj)` ，最好只保留一个setting文件。



<img src="/img/maven.pdf-38-0.png">38-0
**maven搭建脚手架**


**笔记本：** maven


**创建时间：** 2022/1/27 16:12 **更新时间：** 2023/5/30 16:43


**作者：** 彼岸樱速

**Maven archetype**





<img src="/img/maven.pdf-39-1.png">39-1

**准备一个demo工程**




<img src="/img/maven.pdf-40-0.png">40-0

**创建脚手架并打包**
1、首先是工程(或者父工程)的pom.xml文件要加上脚手架的插件配置


2、IDEA下面，打开终端，就是当前工程的根目录，首先清理一下



<img src="/img/maven.pdf-40-1.png">40-1


<img src="/img/maven.pdf-41-0.png">41-0

3、接着使用maven命令(或者用上面的插件也行)，以当前项目为模板，创建脚手架


命令行生成：



<img src="/img/maven.pdf-41-1.png">41-1


<img src="/img/maven.pdf-42-0.png">42-0

<img src="/img/maven.pdf-42-1.png">42-1

4、target文件夹下，会多出了脚手架生成文件夹


<img src="/img/maven.pdf-43-0.png">43-0

**脚手架文件夹说明**
1、archetype文件夹是刚刚上面的 cretefrom命令生成的， **archetype-resources** 文件夹，才
是我们最终要生成的代码包含内容。



<img src="/img/maven.pdf-43-1.png">43-1
<img src="/img/maven.pdf-44-0.png">44-0

上面的内容，不是生成之后就是这样子的，大部分是上面的内容，还是要经过自己手动调整一下
的。


**archetype-metadata.xml配置文件说明**
该配置文件中主要列出了原型文件以及使用archetype生成模板工程需要的参数

<img src="/img/maven.pdf-44-1.png">44-1
[完整的说明参考官网archetype-metadata.xml详解](http://maven.apache.org/archetype/archetype-models/archetype-descriptor/archetype-descriptor.html)





如果是父工程的形式，则可以加上 **<modules>...</modules>** 部分的配置内容


<img src="/img/maven.pdf-45-0.png">45-0

**modules例子**

<img src="/img/maven.pdf-45-2.png">45-2


3、 **archetype.properties** 配置文件


这个配置文件又是什么意思？我们可以打开 **archetype-resourcces** 文件夹下面的 **pom.xml**
看下



<img src="/img/maven.pdf-45-1.png">45-1
<img src="/img/maven.pdf-46-0.png">46-0

**.gitignore未生成问题解决**
1、一开始createfrom 生成的时候，是没有.gitignore文件带进来的，或者REDEME.md，这需

<img src="/img/maven.pdf-46-1.png">46-1
要我们自己手动复制一个.gitignore文件，到 archetype-resources 文件夹下





archetype文件夹下，两个pom.xml是不一样的，不要混淆了


<img src="/img/maven.pdf-47-0.png">47-0

1处的pom.xml(就是从作为模板的项目工程的pom.xml文件过来的，除了gav部分之外，其余都
一模一样)


2处的pom.xml文件(这个就是脚手架自己独有的pom.xml了)



<img src="/img/maven.pdf-47-1.png">47-1

<img src="/img/maven.pdf-47-2.png">47-2


<img src="/img/maven.pdf-48-0.png">48-0












除了 **<distributionManagement>** 标签部分的是自己加的，其他的是createfrom的时候就生
成的


**<distributionManagement>部分，是为了将这个脚手架发布到远程的私服仓库(我这里是自**

<img src="/img/maven.pdf-49-0.png">49-0
**己搭建的nexus)，对应的maven settings.xml文件也要设置好**

password，如果nexus私服开启仓库用户密码校验的话就输入，没有就不输入


**注意pom.xml和setting.xml中的id属性要一致**


**将脚手架发布到远程nexus仓库**
1、配置好上面的内容之后，IDEA终端打开，cd 进入到archetype目录下，使用命令行进行发
布





<img src="/img/maven.pdf-49-2.png">49-2

如果出现401未授权错误


则在命令行中加多 --settings settings.xml (因为我这里是要发布到自己的私服，并且有身份密
码验证，所以要加上这个配置才能运行成功)



<img src="/img/maven.pdf-49-3.png">49-3



<img src="/img/maven.pdf-49-5.png">49-5
<img src="/img/maven.pdf-50-0.png">50-0

这样子就成功发布到远程私服仓库了


**脚手架安装到本地仓库，并使用脚手架创建项目**
1、继续在刚刚的 archetype 文件夹下，使用命令行进行安装





<img src="/img/maven.pdf-50-2.png">50-2

<img src="/img/maven.pdf-50-3.png">50-3

这时候进本地仓库的文件夹下面，就可以找到自己刚刚安装进来的内容啦


<img src="/img/maven.pdf-51-0.png">51-0

**IDEA使用脚手架创建项目**
1、新建maven项目，并且勾中 Create from archetype(就是下图中的 **从原型创建** )选项，点击

<img src="/img/maven.pdf-51-1.png">51-1
添加原型(Add Archetype)按钮，在弹出的窗口里，输入刚刚脚手架的gav


2、gav具体可以从上面所说的，第2处的pom.xml里面复制过来。完成之后就可以看到在
archetype列表中了


<img src="/img/maven.pdf-52-0.png">52-0

3、其实我做完第2步的时候，并没有如期看到出现在列表，解决方案是，这时候需要去
**C:/Users/[你的用户名]/AppData/Local/JetBrains/IntelliJIdea2021.2/Maven/Indices**

<img src="/img/maven.pdf-52-1.png">52-1
目录下，创建一个 UserArchetypes.xml 文件


具体内容(下面的gav，自己改成刚刚上面说的gav，自己的脚手架的gav)，保存之后，重启
IDEA，再打开页面就可以看到啦


**使用脚手架实际创建项目**



<img src="/img/maven.pdf-53-0.png">53-0

<img src="/img/maven.pdf-53-1.png">53-1
<img src="/img/maven.pdf-54-0.png">54-0

**命令行模式**



<img src="/img/maven.pdf-54-1.png">54-1



至此，本文教程完成。


**pom.xml里面依赖dependency的元素标签optional的作用**


**笔记本：** maven


**创建时间：** 2023/5/24 13:12 **更新时间：** 2023/5/24 13:46


**作者：** 彼岸樱速


pom.xml里面依赖dependency的元素标签optional的作用


假如你的Project A的某个依赖D添加了<optional>true</optional>，
```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-devtools</artifactId>
```

`<optional>true</optional>` `<!--` 防止将 `devtools` 依赖传递到其他模块中 `-->`
```
</dependency>

```

当别人通过pom依赖Project A的时候，D不会被传递依赖进来


当你依赖某各工程很庞大或很可能与其他工程的jar包冲突的时候建议加上该选项，可以节省开
销，同时减少依赖冲突


**maven中profiles使用详解**


**笔记本：** maven


**创建时间：** 2023/5/24 11:47 **更新时间：** 2023/5/24 12:12


**作者：** 彼岸樱速


**使用的场景**
常常遇到一些项目中多环境切换的问题。比如在开发过程中用到开发环境，在测试中使用测试环
境，在生产中用生产环境的情况。springboot中提供了 spring.profile.active的方式来实现多环
境的切换，通过设置环境变量和启动参数的方式。但是这样做终究不能一劳永逸，要么需要修改
yml文件，要么需要记得启动的时候带上参数。而利用maven的profiles，可以减少很多工作。
让我们通过几个例子一步步的掌握使用maven的profiles属性。


**快速上手**
**pom.xml文件设置**
```
<profiles>
<profile>
```

`<!--` 不同环境 `Profile` 的唯一 `id-->`
```
<id>dev</id>
<properties>
```

`<!--profiles.active` 是自定义的字段（名字随便起），自定义字段可以有多个 `-->`
```
<profiles.active>dev</profiles.active>
</properties>
</profile>
<profile>
<id>prod</id>
<properties>
<profiles.active>prod</profiles.active>
</properties>
<activation>
<activeByDefault>true</activeByDefault>
</activation>
</profile>
<profile>
<id>test</id>
<properties>
<profiles.active>test</profiles.active>
</properties>
</profile>
</profiles>

```

**目录结构**


**application.yml**
```
spring:
profiles:

active: @profiles.active@

```

**application-dev.yml中代码如下**



<img src="/img/maven.pdf-56-0.png">56-0
```
server:

port: 7091

```

其他几个文件我只是把端口号进行了修改，方便打包看不同的效果。


**maven打包与激活profiles**
**你可以执行命令**

```
mvn clean package -Ptest

```

然后启动jar包，可以看到jar包启动的是test的配置，如果换成-Pdev启动的就是dev包的端口。


**默认启动方式**
如果不带-Ptest，启动的是 prod的端口。因为在profiles中我们看到有配置默认的选项。
```
<activation>
<activeByDefault>true</activeByDefault>
</activation>

```

**settings.xml中使用activeProfiles指定**
```
<activeProfiles>
<activeProfile>profileTest1</activeProfile>
</activeProfiles>

```

**通过IDEA的可视化的方式**
当然如果使用IDEA工具进行开发，还可以使用可视化的方式进行打包。



<img src="/img/maven.pdf-57-0.png">57-0
**更高级的玩法**
**通过和pom结合的方式设置动态参数**
如果我们希望通过docker-maven-plugin插件，把编译好的jar打包成docker并且传入相应的开
发、测试、生产的服务器中去。这个时候，我们就需要根据不同的条件去传入不同的服务器。


在profiles中我们可以做以下定义
```
<profiles>
<profile>
<id>dev</id>
<properties>
<profile.id>dev</profile.id>
<docker.host>http://dev.demo.com:2375</docker.host>
</properties>
<activation>
<activeByDefault>true</activeByDefault>
</activation>
</profile>
<profile>
<id>test</id>
<properties>
<profile.id>test</profile.id>
<docker.host>http://test.demo.com375</docker.host>
</properties>
</profile>
<profile>
<id>prod</id>
<properties>
<profile.id>prod</profile.id>
<docker.host>http://prod.demo.com:2375</docker.host>
</properties>
</profile>
</profiles>

```

而在build控件中我们可以使用以下配置
```
<build>

<plugins>
<plugin>
<groupId>com.spotify</groupId>
<artifactId>docker-maven-plugin</artifactId>
<version>1.1.0</version>

<executions>

<execution>
<id>build-image</id>
<phase>package</phase>
<goals>
<goal>build</goal>
</goals>
</execution>
</executions>
<configuration>
<imageName>demo/${project.artifactId}</imageName>
<imageTags>
<imageTag>${project.version}-${current.time}</imageTag>
<imageTag>latest</imageTag>
</imageTags>
<forceTags>true</forceTags>
<dockerHost>${docker.host}</dockerHost>
<forceTags>true</forceTags>
<baseImage>java:8</baseImage>
<entryPoint>["java", "-jar", "/${project.build.finalName}.jar"]
</entryPoint>
<resources>

<resource>
<targetPath>/</targetPath>
<directory>${project.build.directory}</directory>
<include>${project.build.finalName}.jar</include>
</resource>
</resources>
</configuration>
</plugin>
</plugins>
</build>

```

其中 ${project.artifactId} 和${project.version}是关于节点下面和的引用。${current.time}是
在build-helper-maven-plugin定义的，我们回头再研究。


${docker.host}则是我们在profiles中定义的，可以随着我们选择不同的profile，把jar包build成
不同的docker镜像，并传入指定服务器。


**通过和yml结合设置动态参数**
除了可以在pom中设置动态参数，使得其根据profile的不同选择不同的参数。还可以通过设置
不同的profile，让yml选择不同的参数。这点和快速上手的例子有点相似。具体如下：


设置profiles
```
<profiles>
<profile>
<id>dev</id>
<properties>
<profile.id>dev</profile.id>
<eureka.url>http://127.0.0.1:8001/eureka</eureka.url>
</properties>
<activation>
<activeByDefault>true</activeByDefault>
</activation>
</profile>
<profile>
<id>test</id>
<properties>
<profile.id>test</profile.id>
<eureka.url>http://base-registry:8001/eureka</eureka.url>
</properties>
</profile>
<profile>
<id>prod</id>
<properties>
<profile.id>prod</profile.id>
<eureka.url>http://base-registry:8001/eureka</eureka.url>
</properties>
</profile>
<profile>
<id>new</id>
<properties>
<profile.id>new</profile.id>
<eureka.url>http://base-registry:8001/eureka</eureka.url>
</properties>
</profile>
</profiles>

```

我们在profile中设置了一个eureka.url的属性，就可以在yml中直接调用。
```
eureka:

client:

service-url:

defaultZone: @eureka.url@

registry-fetch-interval-seconds: 10
instance:

prefer-ip-address: true

```

在IDEA调试和启动的时候，一般会报错如下：





解决方法就是引入yaml.sankeyaml的jar包
```
<dependency>
<groupId>org.yaml</groupId>
<artifactId>snakeyaml</artifactId>
</dependency>

```

**打包不同的资源**
在profile打包yml文件的时候，如果我们解压了jar包，会发现还是把所有的applicationprofile.yml文件给打包进去了。这个可以通过设置打包参数，只打包需要的application文件。
```
<profiles>
<profile>
<id>dev</id>
<properties>
<env>dev</env>
</properties>
<activation>
<activeByDefault>true</activeByDefault>
</activation>
</profile>
<profile>
<id>prd</id>

```

```
<properties>
<env>prd</env>
</properties>
</profile>
</profiles>

<build>
<finalName>springmvc</finalName>
<resources>

<resource>
<directory>src/main/java</directory>
<includes>
<include>*.xml</include>
</includes>
</resource>

<resource>
<directory>src/main/resources</directory>
<excludes>
<exclude>dev/*</exclude>
<exclude>prd/*</exclude>
</excludes>
</resource>

<resource>
<directory>src/main/resources/${env}</directory>
</resource>
</resources>
</build>

```

目录结构如下：



<img src="/img/maven.pdf-60-0.png">60-0
**maven知识补充**


**笔记本：** maven


**创建时间：** 2023/4/11 10:25 **更新时间：** 2023/4/11 11:00


**作者：** 彼岸樱速


**依赖**


依赖是我们在使用Maven构建项目时最常使用的功能，通过依赖标签，我们可以直接从Maven
仓库中引入对应的Jar包，无需手动再将Jar添加到目录下了，可谓是十分方便，不过我们除了使
用，还需要考虑多模块下依赖之间的关系。


**依赖配置**


这个大家应该都很熟悉了，通过<dependency>标签引入Maven依赖


引入依赖之后，刷新一下Maven依赖就可以引入相关的Jar包了。


**依赖传递**


依赖具有传递性，当我们引入了一个依赖的时候，就会自动引入该依赖引入的所有依赖，依次往
下引入所有依赖。


比如我们引入了Druid数据库连接池的SpringBoot-Starter，那么就会自动引入一些依赖


如图，我们仅仅引入了druid-spring-boot-starter依赖，就自动引入了该依赖依赖的依赖。总
而言之就是套娃就完事了。


我们将这三个依赖称为间接引入的依赖，而我们在<dependency>标签中引入的依赖称为直接
依赖，那么如果这两个重复了并且版本不一样的话会怎么办呢，最后引入的到底是哪个版本呢，
还是说都会引入呢？


如果重复了，遵从以下规则



<img src="/img/maven.pdf-61-0.png">61-0

<img src="/img/maven.pdf-61-1.png">61-1
<img src="/img/maven.pdf-62-0.png">62-0

简单来说，就是越在外层的优先级越高，如果同级的就按照配置顺序，配置顺序靠前的覆盖配置
顺序靠后的。


**可选依赖**


可选依赖指对外隐藏当前所依赖的资源

```
<dependency>
<groupId>junit</groupId>
<artifactId>junit</artifactId>
<optional>true</optional>
</dependency>

```

配置了该选项之后，间接依赖就失效了。


**排除依赖**


排除依赖指主动断开间接依赖的资源

```
<dependency>
<groupId>junit</groupId>
<artifactId>junit</artifactId>
<version>4.12</version>
<exclusions>

<exclusion>
<groupId>org.hamcrest</groupId>
<artifactId>hamcrest-core</artifactId>
</exclusion>
</exclusions>
</dependency>

```

配置了该选项之后，间接依赖也会失效。


排除依赖和可选依赖的区别：


可选依赖是依赖提供者设置的，比如我们引入了Durid，那么该选项由Durid开发者设置


排除依赖由依赖引入者设置，比如我们引入了Durid，那么我们可以设置该选项


**依赖范围**


依赖的jar默认情况可以在任何地方使用，可以通过scope标签来改变依赖的作用范围。


<img src="/img/maven.pdf-63-0.png">63-0

主代码指的是main文件夹下的代码，测试代码指的是test文件夹下的代码（就那个绿色的玩
意），打包指的是maven package指令执行时是否将Jar包打包。


其实如果我们偷懒的话，全部都默认也不是不可能，不过为了我们程序代码的可读性与简洁性，
还是按照规范来比较好。


**生命周期与插件**


**项目构建生命周期**


Maven项目构建生命周期描述的是一次构建过程经历了多少个事件，我们可以把生命周期当成
一个人的年龄。


Maven将生命周期划分为三个大阶段，类似于人类的婴儿，青年，入土


clean：清理工作
default：核心工作，例如编译，测试，打包，部署
site：产生报告，发布站点


第一个和第三个周期比较简单，我们重点介绍一下default阶段


先上一张劝退图


以上就是defalut阶段完整的生命周期，其中标红的地方，是几个比较重要的周期，在Idea的
Maven工具中也能体现出来



<img src="/img/maven.pdf-63-1.png">63-1
<img src="/img/maven.pdf-64-0.png">64-0

当我们在Idea中点击这几个生命周期时，Maven会自动将之前所有的生命周期都执行到，就类
似于如果我18岁了，那么我肯定经历过8岁。


**插件**


插件就是Idea中Maven工具的Plugins部分


通过pom文件中的<build></build>标签引入新的插件

```
<build>

<plugins>
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-compiler-plugin</artifactId>
<version>3.1</version>
<configuration>
<source>1.8</source>
<target>1.8</target>
<encoding>UTF-8</encoding>
</configuration>
</plugin>
</plugins>
</build>

```

那么什么是插件呢？


**插件与生命周期内的阶段绑定** ，在 **执行到对应生命周期时执行对应的插件功能**


默认maven在各个生命周期上绑定有预设的功能


通过插件可以自定义其他功能

```
<build>

<plugins>
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-source-plugin</artifactId>
<version>2.2.1</version>

<executions>

<execution>

<goals>
<goal>jar</goal>
</goals>

```


<img src="/img/maven.pdf-64-1.png">64-1
<img src="/img/maven.pdf-65-0.png">65-0

上述自定义插件的作用指的是在generate-test-resources生命周期执行打jar包的操作。


其实简单的说，生命周期就是一个人的年龄阶段，而插件就是每个人在每个年龄需要做的事情


总结：


Maven将一个项目构建的过程分为一长串连续的生命周期，在对应的生命周期会通过插件完成
对应的事件，通过使用Maven的生命周期，我们可以获得我们需要的功能，可能是打jar包，可
能是安装到本地仓库，可能是部署到私服。


**模块聚合**


当使用Maven进行多模块开发的时候，有可能出现A模块依赖B模块，B模块依赖C模块，那么我
们如果想对A模块打包，那么就要先打包C模块，再打包B模块，最后打包A模块才能成功，否则
会报错，并且，如果C模块更新了，我们也要手动更新所有依赖C模块的模块，这样是及不方便
的，Maven为了更好的进行多模块开发，提供了模块聚合的功能。


作用： **聚合用于快速构建Maven工程，一次性构建多个项目/模块**


使用步骤，我们用开源项目ruoyi的项目结构来看一下聚合在ruoyi中的使用


1.


2. RuoYi-Vue父模块的pom文件



<img src="/img/maven.pdf-65-1.png">65-1

<img src="/img/maven.pdf-65-2.png">65-2
<img src="/img/maven.pdf-66-0.png">66-0

1. 直接对打包类型为pom的模块进行生命周期的管理，Maven会自动帮我们管理聚合的所有

模块的生命周期，操作顺序跟依赖顺序有关系。


**模块继承**


还是在多模块项目开发中，多个子模块可能会引入相同的依赖，但是他们有可能会各自使用不同
的版本，版本问题，有可能会导致最后构建的项目出问题，所以我们需要一种机制，来约定子模
块的相关配置，于是就有了模块继承


作用：通过继承可以实现在子工程中沿用父工程中的配置


实现步骤：还是以ruoyi为例


1. 在子工程中声明其父工程坐标与对应的位置


<parent>
<artifactId>ruoyi</artifactId>
<groupId>com.ruoyi</groupId>
<version>3.8.1</version>
</parent>复制代码


2. 在父工程中定义依赖管理


<dependencyManagement>
<dependencies>
<!-- SpringBoot的依赖配置-->
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-dependencies</artifactId>
<version>2.5.8</version>
<type>pom</type>
<scope>import</scope>
</dependency>
<!-- 阿里数据库连接池 -->
<dependency>
<groupId>com.alibaba</groupId>
<artifactId>druid-spring-boot-starter</artifactId>
<version>${druid.version}</version>
</dependency>
<!-- SpringBoot集成mybatis框架 -->
<dependency>
<groupId>org.mybatis.spring.boot</groupId>
<artifactId>mybatis-spring-boot-starter</artifactId>
<version>${mybatis-spring-boot.version}</version>
</dependency>
<!-- pagehelper 分页插件 -->
<dependency>
<groupId>com.github.pagehelper</groupId>
<artifactId>pagehelper-spring-boot-starter</artifactId>
<version>${pagehelper.boot.version}</version>
</dependency>
</dependencies></dependencyManagement>复制代码


3. 定义完成之后，子工程相关的依赖就无需定义版本号，会直接使用父工程的版本号


<dependency>
<groupId>com.github.pagehelper</groupId>
<artifactId>pagehelper-spring-boot-starter</artifactId></dependency>复制代码


继承除了依赖版本号之外，还会继承一些资源，如下图


**属性**


在Maven中，对于有些依赖可能需要保证相同的版本，比如Spring相关依赖，那么我们就需要
一个机制来保证这些依赖的版本都相同，我们可以使用Maven中的属性，类似编程语言的全局
变量。


Maven中有很多属性：


1. 自定义属性
2. 内置属性
3. Setting属性
4. Java系统属性
5. 环境变量属性


此处我们重点讲解一下


**自定义属性**


作用：将一些字符串定义为变量，方便统一维护


使用步骤：还是以ruoyi为例


1. 定义自定义属性


<properties>
<ruoyi.version>3.8.1</ruoyi.version></properties>复制代码


2. 调用：${xxx.yyy}


<groupId>com.ruoyi</groupId><artifactId>ruoyi</artifactId>
<version>${ruoyi.version}</version>复制代码


**内置属性**


作用：使用Maven内置属性，快速配置一些文件


${basedir}
${version}
复制代码



<img src="/img/maven.pdf-67-0.png">67-0
**Setting属性**


作用：使用Maven配置文件setting.xml中的标签属性，用于动态配置


${settings.localRepository}
复制代码


**Java系统属性**


作用：读取Java系统属性


调用格式


${user.home}
复制代码


系统属性查询方式


mvn help:system
复制代码


**环境变量属性**


作用：使用Maven环境变量


${env.JAVA_HOME}复制代码


**版本管理**


对于我们的项目来说，如果我们将其放到一些Maven仓库中，那么就需要对其进行版本控制，
我们可以看一下一些开源项目的Maven官网上的版本。


pom文件配置


<version>1.0.0.RELEASE</version>复制代码


工程版本号约定



<img src="/img/maven.pdf-68-0.png">68-0
<img src="/img/maven.pdf-69-0.png">69-0

工程版本


**环境配置**


一个项目，开发环境、测试环境、生产环境的配置文件必然不同，那么Maven就需要进行多环
境配置管理


Maven多环境对应Idea中Maven工具的Profiles


配置文件：通过<profiles>配置文件配置，一个profile代表一个可选项


<profiles>
<profile>
<id>local</id>
<properties>
<!-- 环境标识，需要与配置文件的名称相对应 -->
<profiles.active>local</profiles.active>
<logging.level>debug</logging.level>
</properties>



<img src="/img/maven.pdf-69-1.png">69-1

<img src="/img/maven.pdf-69-2.png">69-2
</profile>
<profile>
<id>dev</id>
<properties>
<!-- 环境标识，需要与配置文件的名称相对应 -->
<profiles.active>dev</profiles.active>
<logging.level>debug</logging.level>
</properties>
<activation>
<!-- 默认环境 -->
<activeByDefault>true</activeByDefault>
</activation>
</profile>
<profile>
<id>test</id>
<properties>
<profiles.active>test</profiles.active>
<logging.level>debug</logging.level>
</properties>
</profile>
<profile>
<id>prod</id>
<properties>
<profiles.active>prod</profiles.active>
<logging.level>warn</logging.level>
</properties>
</profile></profiles>复制代码


然后我们在application.yml配置文件中设置即可，之后通过设置maven的profiles，就可以动
态调整环境了。


**私服**


Maven私服指的是企业自己搭建的Maven仓库，通过Maven私服，第三方组织可以把自己组织
内部的Maven依赖安装到私服上，提供给组织内部使用，搭建完私服之后，通过配置Maven，
我们不止可以从中央仓库中获取Maven依赖，还可以从私服中获取Maven依赖。


下图是获取资源的过程，中央仓库的资源会从中央仓库获取，其他资源会从私服仓库获取



<img src="/img/maven.pdf-70-0.png">70-0
<img src="/img/maven.pdf-71-0.png">71-0

**私服搭建**


通过Nexus搭建私服


Nexus是Sonatype公司的一款Maven私服产品


[下载地址：Download (sonatype.com)](https://link.juejin.cn/?target=https%3A%2F%2Fhelp.sonatype.com%2Frepomanager3%2Fproduct-information%2Fdownload)


**私服仓库介绍**


安装好之后我们来看一下私服默认的仓库列表


可以将这些仓库分为三大类


**宿主仓库hosted** ：保存无法从中央仓库获取的资源

自主研发
第三方非开源项目



<img src="/img/maven.pdf-71-1.png">71-1

<img src="/img/maven.pdf-71-2.png">71-2
**代理仓库proxy**

代理远程仓库，通过nexus访问其他公共仓库
**仓库组** ：将若干个仓库组成一个群组，简化配置，它仅仅是一种配置，不是真实的仓库

比如我们可以将二课项目相关的依赖放到一个仓库组中，将抽奖项目的依赖放到一个
仓库组中


创建私服仓库


点击create repository


选择maven2（hosted）


填入仓库名称



<img src="/img/maven.pdf-72-0.png">72-0

<img src="/img/maven.pdf-72-1.png">72-1
<img src="/img/maven.pdf-73-0.png">73-0

创建完之后在仓库列表可见，将新建的仓库加入maven-public仓库组，之后通过该仓库组的url
访问


点击maven-public仓库组



<img src="/img/maven.pdf-73-1.png">73-1
<img src="/img/maven.pdf-74-0.png">74-0

**本地仓库访问私服配置**


配置本地仓库访问私服的权限（setting.xml文件），如果你想从这个仓库中获取或者部署资
源，那么就需要server配置来验证权限，此处可以是不同的账号密码，不同的用户对于仓库的权
限也不同。


**配置Servers**


<servers>

<server>

<id>ticknet-release</id>
<username>admin</username>
<password>admin</password>
</server>

<server>
<id>ticknet-snapshots</id>
<username>admin</username>
<password>admin</password>
</server></servers>复制代码


**配置setting.xml的Profiles**


<profiles>
<profile>
<id>artifactory</id>
<repositories>
<repository>
<snapshots>
<enabled>false</enabled>
</snapshots>
<id>repo</id>
<name>repo</name>
<url>xxxx</url>
</repository>
<repository>


<snapshots/>
<id>snapshots</id>
<name>snapshots-only</name>
<url>xxxx</url>
</repository>
</repositories>
</profile>
</profiles>复制代码


此处的URL通过


这个copy按钮获取。


**配置激活profiles**


<activeProfiles>
<activeProfile>artifactory</activeProfile>
</activeProfiles>复制代码


之后就可以从私服获取资源了


**上传资源到私服**


配置项目pom文件


<distributionManagement>
<repository>
<id>ticknet-release</id>
<url>http://localhost:8081/repository/ticknet-release/</url>
</repository>
<snapshotRepository>
<id>ticknet-snapshots</id>
<url>http://localhost:8081/repository/ticknet-release/</url>
</snapshotRepository></distributionManagement>复制代码


配置完执行生命周期的deploy即可。


**centos8搭建nexus私服**


**笔记本：** maven


**创建时间：** 2022/1/27 9:09 **更新时间：** 2022/1/28 14:48


**作者：** 彼岸樱速


**两种方式：压缩包，docker**



<img src="/img/maven.pdf-76-0.png">76-0



**一、压缩包方式**
[1、nexus官网：https://www.sonatype.com/nexus-repository-oss](https://www.sonatype.com/nexus-repository-oss)
2、获得tar zxvf nexus-3.21.1-01-unix.tar.gz之后，将文件丢至Linux服务器上。
3、解压 tar -zxvf nexus-3.21.1-01-unix.tar.gz
4、进入nexus-3.21.1-01/etc目录，vim nexus-default.properties配置，修改端口，保存退出。
5、配置环境变量 ，记得先安装jdk





6、启动nexus，记得安全组打开了你设置的端口。访问   http://IP:自定义端口
7、nexus之前的默认账号密码为admin/admin123，现在已经修改了，密码在解压目录/sonatypework下的admin.password文件中，cat便可以看到。账号还是admin


**二、docker方式**
1、docker中搜索nexus镜像



<img src="/img/maven.pdf-76-2.png">76-2

<img src="/img/maven.pdf-76-3.png">76-3


<img src="/img/maven.pdf-77-0.png">77-0

2、找到stars数最多的 pull（网速慢的话,可能pull不下来） ：





3、配置外部挂载文件夹





4、安装并运行





5、进入挂载目录(就是刚刚配置的挂载目录 **/usr/local/nexus-data** )，找到登录密码(admin.password
文件)，cat 就行，登录完之后，就是上面第2张图所示了。


6、登录成功后，会提示修改密码，按提示一步步操作


**下面就是配置说明了**
左上角有个小方块按钮，Browser页面可以看到默认的仓库


**页面说明**
1、默认仓库说明



<img src="/img/maven.pdf-77-4.png">77-4

<img src="/img/maven.pdf-77-5.png">77-5

<img src="/img/maven.pdf-77-6.png">77-6


2、仓库类型



<img src="/img/maven.pdf-78-0.png">78-0



**nexus配置**



<img src="/img/maven.pdf-78-1.png">78-1



1、点击第4的螺丝按钮(设置按钮)


2、点击为hosted的，就可以进入到仓库的具体设置页面



<img src="/img/maven.pdf-78-3.png">78-3
<img src="/img/maven.pdf-79-0.png">79-0

如图只改一个地方，改为Allow redeploy，保存并返回上一级页面。


3、点击列表中proxy类型的进去


配置为阿里云的仓库进行拉取



<img src="/img/maven.pdf-79-1.png">79-1

<img src="/img/maven.pdf-79-2.png">79-2



<img src="/img/maven.pdf-79-4.png">79-4

查看图中的Type的属性


<img src="/img/maven.pdf-80-0.png">80-0

**上传JAR包到仓库中**
上传方式分为 2种类 nexus3的upload上传和idea上传


1. nexus3的upload上传


2. idea上传jar包到仓库中

2.1配置maven的settings.xml文件
在mirrors中配置 maven私服的连接地址



<img src="/img/maven.pdf-80-1.png">80-1





上面的这个url地址是这个地址


2.2 配置私服maven的验证地址


在settings.xml文件中找到servers配置如下



<img src="/img/maven.pdf-80-2.png">80-2





2.3在项目的pom中配置如下

```
     <distributionManagement>
     <!-- 正式版本 -->

     <repository>
     <!-- nexus 服务器中用户名：在 settings.xml 中 <server> 的 id-->

     <id>releases</id>

     <!-- 这个名称自己定义 -->

     <name>RELEASE</name>

         <! 这里的 l 和上面配置 tti 中的 样 >

```

```
     <!-- 这里的 url 和上面配置 settings 中的一样 -->

     <url>http://localhost:8081/repository/maven-releases/</url>

     </repository>

     <!-- 快照版本 -->

     <snapshotRepository>

     <id>snapshots</id>

     <name>SNAPSHOT</name>

     <url>http://localhost:8081/repository/maven-snapshots/</url>

     </snapshotRepository>

     </distributionManagement>

```

2.4发布什么版本是根据你这个项目的版本号定义的也就是pom文件中的这里


**批量上传本地maven依赖到私服**
一般，本地已有一些依赖，可上传到私服，供其他人下载


1、 压缩本地依赖，上传到服务器
在任意路径解压，如





2 、进入解压的仓库路径，创建脚本文件





3 、添加脚本内容如下



<img src="/img/maven.pdf-81-2.png">81-2



:wq保存退出
添加执行权限





4 、根据已配置的账号密码，及实际ip+port，启动脚本





打印信息如下



<img src="/img/maven.pdf-81-5.png">81-5


<img src="/img/maven.pdf-82-0.png">82-0



5、上传完毕后，打开nexus web页面，可看到依赖已上传完毕

**本地maven及项目pom配置**



<img src="/img/maven.pdf-82-1.png">82-1



1 、修改maven的setting.xml
在xml中，添加以下配置



<img src="/img/maven.pdf-82-3.png">82-3

2 、修改项目的pom.xml
增加发布到私服的配置，如下



<img src="/img/maven.pdf-82-4.png">82-4


```
 <snapshotRepository>
 <id>nexus-snapshots</id>
 <name>Snapshot</name>
 <url>http://192.168.56.101:28080/repository/maven-snapshots/</url>
 </snapshotRepository>
 </distributionManagement>
```

**IDEA 发布本地jar到私服**





在maven项目中，执行[mvn deploy]或直接使用IDEA操作发布


再到nexus页面查看，如下



<img src="/img/maven.pdf-83-1.png">83-1

<img src="/img/maven.pdf-83-2.png">83-2
**maven pom.xml配置文件中的packaging标签**


**笔记本：** maven


**创建时间：** 2021/10/9 23:58 **更新时间：** 2021/10/10 0:01


**作者：** 彼岸樱速


项目的打包类型：pom、jar、war
指定打包类型使用<packing>标签，它默认是jar类型。

**pom** ：父类型都为pom类型





**jar** ：内部调用或者是作服务使用





**war** ：打包项目，用于在容器（Tomcat、Jetty等）上部署





举个打包类型为pom的例子：
项目目录结构如下：


MyProject下面有三个模块项目SubProject1、SubProject2、SubProject3。那么我们可以将
三个模块项目的公共部分，写在MyProject项目的pom.xml文件上，然后在模块项目的
pom.xml中来继承它，这样模块项目就可以用到公共部分的东西。MyProject项目的pom.xml
就是我们的所说的父类型，它的打包类型要写成pom，如：



<img src="/img/maven.pdf-84-3.png">84-3

<img src="/img/maven.pdf-84-4.png">84-4



在ＭyProject下的pom.xml通过<modules>标签指定了子项目的相对路径。这就可以直接在
MyProject项目里执行mvn命令，一次构建全部模块。当然，到每个模块的目录下执行mvn命
令，逐个构建也是没问题的。


在分模块（子项目）下的pom.xml通过<parent>标签继承ＭyProject下的pom.xml即可，如
SubProject1子项目的pom.xml：



<img src="/img/maven.pdf-84-5.png">84-5


```
 <parent>
 <groupId>com.wong.tech</groupId>
 <artifactId>myproject</artifactId>
 <version>1.0</version>
 <relativePath>../pom.xml</relativePath>
 </parent>

 ...

 </project>

```

其他的子项目依此类推。


**springboot pom文件设置＜packaging＞pom＜/packaging＞ 对于application.yml无法加载读取**
**的问题**


**笔记本：** maven


**创建时间：** 2021/10/9 23:44 **更新时间：** 2021/10/9 23:58


**作者：** 彼岸樱速


**一.问题描述**
**1.1 描述**
1.一个jpa的项目，不知道怎么创建的项目时，反正pom文件中有打包方式为

<img src="/img/maven.pdf-86-0.png">86-0
**<packaging>pom</packaging>** ，


启动项目无法启动,报错如下：


**1.2 解决办法**
妈蛋，解决了一上午最后才发现 ，是这个地方闹腾的，将pom文件的
<packaging>pom</packaging>去掉，或者改为 **<packaging>jar</packaging>**,就可以
了，服务启动起来了


**1.3 原因**
<packaging>pom</packaging>的意思是项目里没有java代码，也不执行任何代码，只是为
了聚合工程或传递依赖用的。所以并不会寻找配置文件，若想配置文件生效，改为
<packaging>jar</packaging>


**二.<packing>pom</packing>的使用场景**
maven 默认的打包类型为 jar，在项目聚合的时候，需要显式的将 父项目的 packing 指定为
pom，然后再指定所属的子模块，如下所示：



<img src="/img/maven.pdf-86-1.png">86-1

<img src="/img/maven.pdf-86-2.png">86-2
<img src="/img/maven.pdf-87-0.png">87-0

如果没有将packing 指定为pom ，那么子模块之间将无法正常的进行依赖传递。
我们执行的maven命令的时候将首先对父项目执行，而后当 父项目 的packing 类型为 pom
时，将对所有的子模块执行同样的命令，否则将无法执行同样的命令，那么依赖的传递将无法由
maven 编译或者打包命令 得以执行。
参考官网：
http://maven.apache.org/guides/introduction/introduction-to-the-pom.html


总结：Maven-多模块项目的聚合，父项目必须将packing 指定 为 pom


**三.pom.xml配置文件中的packaging标签的作用**
**3.1 项目打包的类型**


**3.2 案例介绍**
MyProject下面有三个模块项目SubProject1、SubProject2、SubProject3，项目目录结构如
下：


MyProject下面有三个模块项目SubProject1、SubProject2、SubProject3。那么我们可以将
三个模块项目的公共部分，写在MyProject项目的pom.xml文件上，然后在模块项目的



<img src="/img/maven.pdf-87-1.png">87-1

<img src="/img/maven.pdf-87-2.png">87-2
pom.xml中来继承它，这样模块项目就可以用到公共部分的东西。MyProject项目的pom.xml
就是我们的所说的父类型，它的打包类型要写成pom，如：


在ＭyProject下的pom.xml通过<modules>标签指定了子项目的相对路径。这就可以直接在
MyProject项目里执行mvn命令，一次构建全部模块。当然，到每个模块的目录下执行mvn命
令，逐个构建也是没问题的。


在分模块（子项目）下的pom.xml通过<parent>标签继承ＭyProject下的pom.xml即可，如

<img src="/img/maven.pdf-88-1.png">88-1
SubProject1子项目的pom.xml：


**个人总结**
总的来说就是，父工程里面的pom.xml，packaging里面是pom，并且不能有配置文件，也就
是说父工程其实不能是一个可运行的工程，一般都是放一些公共的部分和代码



<img src="/img/maven.pdf-88-0.png">88-0
**maven安装**


**笔记本：** maven


**创建时间：** 2021/9/20 18:42 **更新时间：** 2021/9/20 18:54


**作者：** 彼岸樱速


**maven的下载安装配置教程（详细图文）**


想要实现一个优秀的项目，光靠自己一个码农是很难的，我们需要引入别人已经集成好的类包来帮助我们优化


项目，这个时候就需要使用maven了。


**一、maven是什么**


Maven是基于项目对象模型(POM project object model)，可以通过一小段描述信息（配置）来管理项目的构


建，报告和文档的软件项目管理工具。


通俗的讲maven就是专门用于构建和管理项目的工具，他可以帮助我们去下载我们所需要jar包，帮助我们去


管理项目结构，帮助我们去实现项目的维护、打包等等...


**二、maven的下载**


这里提供两种下载方式：


官网下载：


[maven官网下载](https://maven.apache.org/download.cgi)


**三、maven的安装**


注意：maven的安装需要依赖jdk的安装，所以必须先安装完成jdk且配置好jdk环境变量后在进行maven的安


装！！


jdk安装教程（略）


maven的安装很简单，就是直接解压文件就行了（当然了，前提是你下载的是zip压缩包格式）


**1、准备好maven安装文件**


**2、右击解压缩，注意解压缩过程就是安装过程，注意自己解压后文件的目录**


记住自己解压后的文件目录，我是专门有个文件夹存放安装文件的。这个目录以后要经常用到的，可以集中放


在某一路径下。


解压好就是安装完成了，下面进行maven的配置


**四、maven的环境变量配置**



<img src="/img/maven.pdf-89-0.png">89-0

<img src="/img/maven.pdf-89-1.png">89-1
**1、打开高级系统设置界面**


右击桌面的“此电脑”图标，点击“属性”，弹出系统窗口，然后点击“高级系统设置”


**注意：有时候你桌面上的“此电脑”图标是快捷方式，这样可能就没有“属性”这个选项了，这里提供另一种方**


**法：**


双击桌面“此电脑”图标，打开文件资源管理器，输入：控制面板/系统和安全/系统，然后回车就可进入上图界


面。


**2、打开环境变量配置界面**



<img src="/img/maven.pdf-90-0.png">90-0

<img src="/img/maven.pdf-90-1.png">90-1

<img src="/img/maven.pdf-90-2.png">90-2
<img src="/img/maven.pdf-91-0.png">91-0

**3、配置环境变量**


在“环境变量”界面中，分为上下两部分，上面部分是“某某某的用户变量”的设置，针对的是当前你登录电脑的


账户；下面部分是系统变量的设置，针对的是这台电脑，相当于是所有账户。对于自己使用的电脑来说，建议


直接在下面部分的“系统变量”中来配置。下面来以系统变量为例讲解：


**a、在系统变量中新建一个MAVEN_HOME变量，设置变量名跟变量值**


MAVEN_HOME这个变量里面可以只存放maven相关的路径配置，方便日后管理。


这个时候在系统变量里面便会多了MAVEN_HOME这个变量



<img src="/img/maven.pdf-91-1.png">91-1

<img src="/img/maven.pdf-91-2.png">91-2
**b、将MAVEN_HOME配置到系统环境变量path中**


双击path变量，新建一参数，输入%MAVEN_HOME%/bin后点击确定即可。


环境变量path的作用：提供windows命令行中指令的可执行文件路径，当我们在命令行中键入指令时，根据环


境变量中的path值，找到对应的指令可执行文件进行执行。简单的说就是配置在path中的目录参数，在命令行


中的任何目录下都可以使用。


完成以上操作后点击确定保存并关闭配置界面


**4、检测是否安装配置成功**


注意在此步骤前需要保存并关闭上面步骤窗口


**a、键盘同时按住Windows + r，弹出运行界面。也可以右击“开始”，点击“运行”，弹出界面**


**b、输入cmd，点击确定打开cmd窗口**


**c、在cmd窗口中键入mvn -version后回车，如果出现下面的版本号，及说明maven安装成功**



<img src="/img/maven.pdf-92-0.png">92-0

<img src="/img/maven.pdf-92-1.png">92-1

<img src="/img/maven.pdf-92-2.png">92-2
<img src="/img/maven.pdf-93-0.png">93-0

**五、setting文件配置**


这步骤配置主要是针对于maven的使用来配置的，主要包括本地仓库的配置、仓库服务器的配置。


**1、本地仓库的配置**


**a、在一个磁盘中创建一个文件夹，取名repository。（非C盘，且磁盘容量较大的）**


**b、打开maven的安装目录，选择conf文件夹中的setting.xml文件**


**c、修改文件settings.xml**


**找到settings.xml中的localRepository配置，修改成刚刚创建的文件夹的目录。注意将**

**<localRepository>E:/repository</localRepository>移出注释！**


<localRepository>E:/repository</localRepository>


**d、检验下是否已经设置成功**


**保存后控制台输入 mvn help:system**



<img src="/img/maven.pdf-93-1.png">93-1

<img src="/img/maven.pdf-93-2.png">93-2
<img src="/img/maven.pdf-94-0.png">94-0

再打开刚刚创建的文件夹，如果里面生成文件，即说明修改成功。


**2、修改maven的原地址为阿里源**


**a、同样打开conf文件夹中的setting.xml文件，找到</mirrors>，在</>上一行中加入下面**

**这段代码即可**



<img src="/img/maven.pdf-94-1.png">94-1

<img src="/img/maven.pdf-94-2.png">94-2



<img src="/img/maven.pdf-94-3.png">94-3
