# Idea
---
aliases:
  - idea
标题: idea
---
**Idea配置Maven优先从本地仓库获取依赖**


**笔记本：** idea


**创建时间：** 2024/4/2 0:24 **更新时间：** 2024/4/2 0:26

# **Idea配置Maven优先从本地仓库获取依赖**


在设置中搜索 Runner,在VM Option中设置参数-DarchetypeCatalog=internal



<img src="/img/idea.pdf-0-0.png">
**【Intellij IDEA系列】IDEA泛型处理Unchecked assignment:'java.util.Map' to**
**'java.util.Map&lt;>'-CSDN博客**


**笔记本：** idea


**创建时间：** 2023/12/11 20:38 **更新时间：** 2023/12/11 20:38

# **【Intellij IDEA系列】IDEA泛型处理Unchecked assignmen** **ap&lt;>'**


在 intellij idea 编辑器中，把一个Map类型的数据，强制类型转换的时候。


在中不想看到代码的如下警告的解决方法：


警告信息------------

简单警告：


Unchecked cast: 'java.lang.Object' to 'java.util.List<java.lang.Object>'

或者Unchecked assignment:'java.util.Map' to 'java.util.Map<>'


点开查看详细警告：


Unchecked cast: 'java.lang.Object' to 'java.util.List<java.lang.Object>' less... (Ctrl+F1)


Signals places where an unchecked warning is issued by the [compiler](https://so.csdn.net/so/search?q=compiler&spm=1001.2101.3001.7020), for example:


void f(HashMap map) {


map.put("key", "value");

}


Hint: Pass -Xlint:unchecked to javac to get more details.


去除代码警告的解决方案：


在此方法上面或者那个强制类型转换的上面加上如下一句话。


**@SuppressWarnings("unchecked")**



<img src="/img/idea.pdf-1-0.png">
**IDEA Java程序启动添加参数**


**笔记本：** idea


**创建时间：** 2023/11/21 13:18 **更新时间：** 2023/12/11 14:35

# **IDEA Java程序启动添加参数 VM options、** **Program arguments、Program arguments**


**Run Configuration**


启动可以添加的参数主要就是以下三类


**1. VM options**


**1.1 添加方法**

```
 // -D 开头 + 参数名 = 参数值

 // = 两侧没有空格

 // 不同参数之间空格分隔

 // 如下所示我们增加两个参数 Env 和 Name

 -DEnv = prod -DName = zhangsan

```


<img src="/img/idea.pdf-2-0.png">
<img src="/img/idea.pdf-3-0.png">

**1.2 获取方法**


_`// System.getProperty("`_ 参数名 _`")`_
```
 System.getProperty("Env");
 System.getProperty("Name");

```

**2. Program arguments**


**2.1 添加方法**

```
 // 参数值（不需要写参数名）

 // 参数之间空格分隔

 123456 wangwu

```

**2.2 获取方法**


方法启动时 args 里就包含了你添加的参数


**3.** [Environment](https://so.csdn.net/so/search?q=Environment&spm=1001.2101.3001.7020) **variables**


**3.1 添加方法1**

```
 // 参数名 = 参数值

 // 多个参数之间使用分号分隔（注意这里不是用空格分隔）

 password=123456789;name= lisi

```


<img src="/img/idea.pdf-3-1.png">

<img src="/img/idea.pdf-3-2.png">
<img src="/img/idea.pdf-4-0.png">

**3.2 添加方法2**



<img src="/img/idea.pdf-4-1.png">
<img src="/img/idea.pdf-5-0.png">

**3.3 获取方法**


_`// System.getenv("`_ 参数名 _`")`_
```
 System.getenv("password");
 System.getenv("name");

```

**idea的debug模式各个按钮的作用**


**笔记本：** idea


**创建时间：** 2023/3/7 9:39 **更新时间：** 2023/3/7 9:43


**作者：** 彼岸樱速


**idea中debug模式各个按钮的作用：**


**1. 重启项目。**


**2. Resume Program (F9)：恢复程序，比如，你在第20行和25行有两个断点，当前运行至第20行，按F9，**
**则运行到下一个断点(即第25行)，再按F9，则运行完整个流程，因为后面已经没有断点了。**


**3. 暂停项目。**


**4. 查看所有断点。**


**5. 关闭所有断点，关闭后断点变灰色。**


**7.Step over（F6）** **步过， 如果当前行断点是一个方法，则不进入方法体内。**


**8. Step into（F5） 步入， 一般用于进入自定义方法内，不会进入官方类库的方法。**


**11. Drop frame 回退断点**


**12. Run to Cursor (ctrl + r)：运行到光标处，你可以将光标定位到你需要查看的那一行，然后使用这个功**
**能，代码会运行至光标行，而不需要打断点。**


**13. Evaluate Expression (ctrl + u)：计算表达式**



<img src="/img/idea.pdf-6-0.png">
**IDEA线上排错神器之Remote JVM Debug（JVM远程Debug）**


**笔记本：** idea


**创建时间：** 2022/5/23 18:13 **更新时间：** 2022/5/23 18:31


**作者：** 彼岸樱速


第一步
首先我们新建一个最简单的 Spring Boot 项目，输出 12345 是为了方便我们调试


通过 Maven 进行打包，并上传至远程服务器，我这里使用的虚拟机

使用以下命令运行 jar



<img src="/img/idea.pdf-7-0.png">

<img src="/img/idea.pdf-7-1.png">



以上参数可以在 IDEA 中找到，根据自己 JDK 的版本 copy 参数，本例使用的是 JDK8


参数说明:



<img src="/img/idea.pdf-7-3.png">

<img src="/img/idea.pdf-7-4.png">


<img src="/img/idea.pdf-8-0.png">



注意





<img src="/img/idea.pdf-8-2.png">

jar 运行之后的效果如下


第二步

<img src="/img/idea.pdf-8-3.png">
远程启动好 jar 后，在 idea 中配置远程 Debug，如图所示:

<img src="/img/idea.pdf-8-4.png">


最后我们运行 Remote JVM Debug，并在程序中打一个断点


我们使用 Postman 请求接口后，此时就可以调试线上的程序了，需要注意的是，本地程序不需
要运行，但是必须保证本地的代码和远程服务器上的代码是一致。


我自己的测试demo



<img src="/img/idea.pdf-9-0.png">

<img src="/img/idea.pdf-9-1.png">
<img src="/img/idea.pdf-10-0.png">



<img src="/img/idea.pdf-10-2.png">
