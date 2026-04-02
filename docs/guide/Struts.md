---
aliases:
  - Struts
标题: Struts
---
**action**


**笔记本：** Struts


**创建时…** 2021/10/10 0:57 **更新时…** 2021/10/10 0:59


**作者：** 彼岸樱速


**从action类上分析** :



<img src="/img/Struts.pdf-0-0.png">



**Struts1和Struts2的区别和对比:**


Action 类:

- Struts1要求Action类继承一个抽象基类。Struts1的一个普遍
问题是使用抽象类编程而不是接口，而struts2的Action是接

口。

- Struts 2 Action类可以实现一个Action接口，也可实现其他接
口，使可选和定制的服务成为可能。Struts2提供一个
ActionSupport基类去 实现 常用的接口。Action接口不是必须
的，任何有execute标识的POJO对象都可以用作Struts2的
Action对象。


线程模式:

- Struts1 Action是单例模式并且必须是线程安全的，因为仅有
Action的一个实例来处理所有的请求。单例策略限制了Struts1
Action能作的事，并且要在开发时特别小心。Action资源必须
是线程安全的或同步的。

- Struts2 Action对象为每一个请求产生一个实例，因此没有线
程安全问题。（实际上，servlet容器给每个请求产生许多可丢
弃的对象，并且不会导致性能和垃圾回收问题）


Servlet 依赖:

- Struts1 Action 依赖于Servlet API,因为当一个Action被调用
时HttpServletRequest 和 HttpServletResponse 被传递给
execute方法。

- Struts 2 Action不依赖于容器，允许Action脱离容器单独被测
试。如果需要，Struts2 Action仍然可以访问初始的request和
response。但是，其他的元素减少或者消除了直接访问
HttpServetRequest 和 HttpServletResponse的必要性。


可测性:

- 测试Struts1 Action的一个主要问题是execute方法暴露了
servlet API（这使得测试要依赖于容器）。一个第三方扩展－
－Struts TestCase－－提供了一套Struts1的模拟对象（来进行
测试）。

- Struts 2 Action可以通过初始化、设置属性、调用方法来测
试，“依赖注入”支持也使测试更容易。


捕获输入:

- Struts1 使用ActionForm对象捕获输入。所有的ActionForm必
须继承一个基类。因为其他JavaBean不能用作ActionForm，
开发者经常创建多余的类捕获输入。动态Bean
（DynaBeans）可以作为创建传统ActionForm的选择，但是，
开发者可能是在重新描述(创建)已经存 在的JavaBean（仍然会
导致有冗余的javabean）。

- Struts 2直接使用Action属性作为输入属性，消除了对第二个
输入对象的需求。输入属性可能是有自己(子)属性的rich对象类
型。Action属性能够通过 web页面上的taglibs访问。Struts2也
支持ActionForm模式。rich对象类型，包括业务对象，能够用
作输入/输出对象。这种 ModelDriven 特性简化了taglib对
POJO输入对象的引用。


表达式语言：

- Struts1 整合了JSTL，因此使用JSTL EL。这种EL有基本对
象图遍历，但是对集合和索引属性的支持很弱。

- Struts2可以使用JSTL，但是也支持一个更强大和灵活的表达
式语言－－"Object Graph Notation Language" (OGNL).


**servle是单例的  Struts2是多例的**


