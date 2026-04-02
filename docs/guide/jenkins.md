---
aliases:
  - jenkins
标题: jenkins
---
**centos下安装jenkins**


**笔记本：** jenkins


**创建时…** 2021/9/25 1:12 **更新时…** 2022/1/5 12:46


**作者：** 彼岸樱速


**1、安装JDK**

```
 yum install -y java

```

**2、安装jenkins**


添加Jenkins库到yum库，Jenkins将从这里下载安装。



<img src="/img/jenkins.pdf-0-0.png">0-0



                                       [如果不能安装就到官网下载jenkis的rmp包，官网地址（http://pkg.jenkins](http://pkg.jenkins-ci.org/redhat-stable/)
    
       ci.org/redhat stable/）



<img src="/img/jenkins.pdf-0-1.png">0-1





但是官网的速度实在太慢，还是使用国内的





rpm命令安装不了就




## **开启服务**




## **修改默认镜像源**





将 url 修改为 清华大学官方镜像：
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update

center.json


配置jenkis的端口

```
 vi /etc/sysconfig/jenkins

```

找到修改端口号：


JENKINS_PORT="8080" 此端口不冲突可以不修改

# **配置权限**


为了不因为权限出现各种问题，这里直接使用root


修改用户为root

```
vim /etc/sysconfig/jenkins

```

`#` 修改配置 `$JENKINS_USER="root"`


修改目录权限

```
chown -R root:root /var/lib/jenkins

chown -R root:root /var/cache/jenkins

chown -R root:root /var/log/jenkins

```

**3、启动** jenkins

```
 service jenkins start/stop/restart

```

安装成功后Jenkins将作为一个守护进程随系统启动
系统会创建一个“jenkins”用户来允许这个服务，如果改
变服务所有者，同时需要修改/var/log/jenkins,
/var/lib/jenkins, 和/var/cache/jenkins的所有者
启动的时候将从/etc/sysconfig/jenkins获取配置参数
默认情况下，Jenkins运行在8080端口，在浏览器中直接访
问该端进行服务配置
Jenkins的RPM仓库配置被加
到/etc/yum.repos.d/jenkins.repo



<img src="/img/jenkins.pdf-1-0.png">1-0
我这里启动失败了：


错误信息为

```
Starting Jenkins bash: /usr/bin/java: No such file or

directory

```

是java环境配置的问题。


找到你的jdk目录，我是在 `[usr/local/java/jdk1.8.0_171/]` 下，创


建软链接即可：



<img src="/img/jenkins.pdf-2-0.png">2-0



java安装目录，可以通过whereis java命令查找


然后 vim /etc/init.d/jenkins

```
ps -ef|grep jenkins 这个命令查看jenkins是否启动

```

如果服务已经如上图起来了，但是浏览器ip:port无法打开


查看端口


卧槽！why???


难道是防火墙，查下防火墙



<img src="/img/jenkins.pdf-2-2.png">2-2

<img src="/img/jenkins.pdf-2-3.png">2-3
先别急着禁用，再查看下端口是否被占用


好像少了点什么，查下是否开放8888端口


一顿操作


再次查看端口是否被占用


**4、打开** jenkins


在浏览器中访问 ip:port
首次进入会要求输入初始密码如下图，


初始密码
在：/var/lib/jenkins/secrets/initialAdminPassword


选择“Install suggested plugins”安装默认的插件，下面Jenkins就会自己去
下载相关的插件进行安装。



<img src="/img/jenkins.pdf-3-0.png">3-0
<img src="/img/jenkins.pdf-4-0.png">4-0

<img src="/img/jenkins.pdf-4-1.png">4-1

创建超级管理员账号



<img src="/img/jenkins.pdf-4-2.png">4-2
<img src="/img/jenkins.pdf-5-0.png">5-0
