# Tomcat
---
aliases:
  - tomcat
标题: tomcat
---
**WIN10安装Tomcat8**


**笔记本：** tomcat


**创建时…** 2024/4/1 23:05 **更新时…** 2024/4/1 23:46

# **WIN10安装Tomcat8**

## **一、确认安装了JDK1.8**


WIN+R打开运行后输入cmd进入DOS，输入java 

version确认版本号是1.8。


**如果没安装JDK1.8的看我其它文章里有安装教程**



<img src="/img/tomcat.pdf-0-0.png">0-0
<img src="/img/tomcat.pdf-1-0.png">1-0

确认了我的JDK是安装成功的并且版本号是1.8，因为


TOMCAT8要在JDK1.8版本下运行，所以这一步非常滴


重要。

## **二、下载Tomcat8**


进入 [tomcat](https://so.csdn.net/so/search?q=tomcat&spm=1001.2101.3001.7020) 官网，选择官网左边导航列表的


Tomcat8，下载64位Windows的Zip压缩包


[点击进入tomcat官网https://tomcat.apache.org/](https://tomcat.apache.org/)


下载好后解压到了D盘



<img src="/img/tomcat.pdf-1-1.png">1-1
<img src="/img/tomcat.pdf-2-0.png">2-0
## **三、Tomcat环境**

右键点击"此电脑" -> 属性 -> 高级系统设置 -> 高级 ->


环境变量


新建 用户变量：


变量名：CATALINA_HOME


变量值：D:/apache-tomcat-8.5.95


这是我Tomcat目录，不要光知道复制了啊，找找自己


的目录在哪


编辑 环境变量：


变量名：Path


变量值：%CATALINA_HOME%/bin;


WIN10用户部分不支持引用%MAVEN_HOME%，所以


我使用的绝对路径是这个


D:/apache-tomcat-8.5.95/bin


<img src="/img/tomcat.pdf-3-0.png">3-0
## **四、测试使用**

WIN+R打开运行后输入cmd进入DOS，输入


startup.bat


（startup.bat这个文件其实就是在tomcat文件夹里的


bin目录里）


看到他会运行成功，并且弹出窗口Tomcat



<img src="/img/tomcat.pdf-3-1.png">3-1
<img src="/img/tomcat.pdf-4-0.png">4-0

其中发现打开的窗口有类似的中文乱码，直接解决它


进入我们tomcat文件夹里的conf目录，编辑


logging.properties文件


搜索 `java.util.logging.ConsoleHandler.encoding` 找到它


将默认值 UTF-8 改成 GBK 并保存

```
java.util.logging.ConsoleHandler.encoding = GBK

```


<img src="/img/tomcat.pdf-4-1.png">4-1
<img src="/img/tomcat.pdf-5-0.png">5-0

重新在DOS里输入startup.bat，解决


[随后打开浏览器，输入http://localhost:8080/](http://localhost:8080/)


显示此页面代表成功



<img src="/img/tomcat.pdf-5-1.png">5-1
<img src="/img/tomcat.pdf-6-0.png">6-0
**Tomcat中redirectPort的作用**


**笔记本：** tomcat


**创建时…** 2023/5/4 11:12 **更新时…** 2023/5/4 11:13


**作者：** 彼岸樱速


在Tomcat配置文件Server.xml中redirectPort的作用
说明：
配置文件源代码片段：



<img src="/img/tomcat.pdf-7-0.png">7-0



这个代码片段是设置HTTP请求的配置，其中可以看到
8080和8443两个端口，8080就是HTTP的端口。


那么redirectPort属性的作用是什么呢？
当用户用http请求某个资源，而该资源本身又被设置了
必须要https方式访问，此时Tomcat会自动重定向到这
个redirectPort设置的https端口。


