---
aliases:
  - Java面试
标题: Java面试
---
**面试官问我String能存储多少个字符**


**笔记本：** 面试


**创建时间：** 2024/3/11 15:53 **更新时间：** 2024/3/11 15:55


**URL：** https://juejin.cn/post/7343883765540831283

## **面试官问我String能存储多少个字符？**


1. 首先String的length方法返回是int。所以理论上长度一定不会超过int的最大值。


2. 编译器源码如下，限制了字符串长度 **大于等于** 65535就会编译不通过



<img src="/img/Java面试.pdf-0-0.png">













Java中的字符常量都是使用UTF8编码的，UTF8编码使用1~4个字节来表示具体的Unicode字


符。所以有的字符占用一个字节，而我们平时所用的大部分中文都需要3个字节来存储。



<img src="/img/Java面试.pdf-0-1.png">





对于s1，一个字母d的UTF8编码占用一个字节，65534字母占用65534个字节，长度是65534，


长度和存储都没超过限制，所以可以编译通过。


对于s2，一个中文占用3个字节，21845个正好占用65535个字节，而且字符串长度是21845，


长度和存储也都没超过限制，所以可以编译通过。


对于s3，一个英文字母d加上21845个中文”自“占用65536个字节，超过了存储最大限制，编译


失败。


3. JVM规范对常量池有所限制。量池中的每一种数据项都有自己的类型。Java中的UTF-8编


码的Unicode字符串在常量池中以CONSTANTUtf8类型表示。CONSTANTUtf8的数据结


构如下：



<img src="/img/Java面试.pdf-0-2.png">
<img src="/img/Java面试.pdf-1-0.png">







我们重点关注下长度为 length 的那个bytes数组，这个数组就是真正存储常量数据的地方，而


length 就是数组可以存储的最大字节数。length 的类型是u2，u2是无符号的16位整数，因此


理论上允许的的最大长度是2^16-1=65535。所以上面byte数组的最大长度可以是65535


4. 运行时限制


String 运行时的限制主要体现在 String 的构造函数上。下面是 String 的一个构造函数：



<img src="/img/Java面试.pdf-1-1.png">





上面的count值就是字符串的最大长度。在Java中，int的最大长度是2^31-1。所以在运行时，


String 的最大长度是2^31-1。


但是这个也是理论上的长度，实际的长度还要看你JVM的内存。我们来看下，最大的字符串会


占用多大的内存。


(2^31-1)216/8/1024/1024/1024 = 4GB


所以在最坏的情况下，一个最大的字符串要占用4GB的内存。如果你的虚拟机不能分配这么多内


存的话，会直接报错的。


JDK9以后对String的存储进行了优化。底层不再使用char数组存储字符串，而是使用byte数


组。对于LATIN1字符的字符串可以节省一倍的内存空间。


**牛客网 - 笔试题-3**


**笔记本：** 面试


**创建时间：** 2023/12/23 4:17 **更新时间：** 2023/12/23 4:25


**题友讨论(32)**


[热爱学习的小怪兽。](https://www.nowcoder.com/users/769640169)


Java


java.lang包包含

包装类

String 类

Math 类   ——  包含函数


Class 类

Object 类


单选题


**2. 下面叙述错误的是** **( )**


A 一个类可以有多个构造方法


B 最终类不能派生子类，最终方法不能被覆盖


C 如果一个类中没有定义构造方法，则Java在生成这个类的实例时不会调用构造方法。


D 数组一旦创建之后，就不能再改变其长度



<img src="/img/Java面试.pdf-2-0.png">
正确答案：C


参考答案：


本题选C A.一个类可以有多个构造方法，实际上就是方法的重载，正确 B.用final修饰的类不能被继承


方法，编译器会自动添加一个空参构造方法，错误 D.由源码可知，数组内部采用字符数组存储，该字


变，正确 （答题不易，望采纳）


知识点：Java


**题友讨论(15)**


单选题


**3. 以下类定义中的错误是什么？（）**



<img src="/img/Java面试.pdf-3-0.png">



A 没有错误


B 类标题未正确定义


C 方法没有正确定义


D 没有定义构造函数


正确答案：C 你的答案：B


官方解析：抽象方法不可以有方法体


知识点：Java、Java工程师、2020


[阿呆的呆](https://www.nowcoder.com/users/5227440)


Java


1、抽象方法不能有方法体，这是规定


2、该方法缺少返回值，只有构造没有返回值


131 回复
[发布于 2019-07-27 14:54](https://www.nowcoder.com/discuss/comment/3312989)


[iTomato](https://www.nowcoder.com/users/656431074) 回复



**题友讨论(82)**


还有类名大写


1 回复


[发布于 2021-10-27 10:37](https://www.nowcoder.com/discuss/comment/11137739) 来自Android客户端


[竹子树柚子树](https://www.nowcoder.com/users/409801984) 回复 [iTomato](https://www.nowcoder.com/users/656431074)


**类名大写只是规范，编译不会报错**


1 回复
[发布于 2021-11-05 22:36](https://www.nowcoder.com/discuss/comment/11233199)


[非、](https://www.nowcoder.com/users/218401996) 回复 [云0103](https://www.nowcoder.com/users/996532226)


就是指明返回值类型，比如：abstract int sum (int x, int y)；


6 回复
[发布于 2021-03-01 14:35](https://www.nowcoder.com/discuss/comment/8528498)


[云0103](https://www.nowcoder.com/users/996532226) 回复


请问返回值该怎么写


点赞 回复


[发布于 2020-12-14 11:21](https://www.nowcoder.com/discuss/comment/8304976) 来自Android客户端


收起回复


[好滴](https://www.nowcoder.com/users/590257087)


Java


抽象方法不能有方法体，只能申明


65 回复
[发布于 2019-07-04 18:45](https://www.nowcoder.com/discuss/comment/3200119)


[奔跑的丶小胖子](https://www.nowcoder.com/users/77555644)


Java


抽象方法没有方法体，只有声明。 abstract sum (int x, int y);


35 回复
[发布于 2019-07-19 19:34](https://www.nowcoder.com/discuss/comment/3268590)


[BubbleTg](https://www.nowcoder.com/users/3275039) 回复


是这样的噢--------abstract void sum (int x, int y);别忘了返回值。


14 回复
[发布于 2019-10-24 14:22](https://www.nowcoder.com/discuss/comment/4740456)


[0Q0](https://www.nowcoder.com/users/347890351)


Java


10 回复
[发布于 2019-10-24 09:47](https://www.nowcoder.com/discuss/comment/4736122)


[offer快快快快快快快来吧](https://www.nowcoder.com/users/3032397)


Java


方法缺少返回值


8 回复
[发布于 2019-07-02 16:33](https://www.nowcoder.com/discuss/comment/3191841)


[CaiLiangcl](https://www.nowcoder.com/users/952832722) 回复


不是的 抽象类不能直接实现方法 要用一个类来继承然后实现


2 回复
[发布于 2019-07-03 16:57](https://www.nowcoder.com/discuss/comment/3195632)


[菜鸟555555555](https://www.nowcoder.com/users/948025612) 回复


抽象类的方法，可以有方法体的普通方法，也可以有抽象方法。但是抽象方法不能有方法体


点赞 回复
[发布于 2019-07-19 15:51](https://www.nowcoder.com/discuss/comment/3267108)


展开4条回复


[牛客472603104号](https://www.nowcoder.com/users/472603104)


新乡学院 计算机类


类名大写呢


5 回复


[发布于 2021-09-16 12:34](https://www.nowcoder.com/discuss/comment/10450789) 来自Android客户端


[风影201903032117899](https://www.nowcoder.com/users/582219115)


Java


抽象类不能被new，会出现编译错误， 抽象类中的抽象方法不能有方法体，而定义的一般方法可以有方法体。


4 回复
[发布于 2019-07-08 13:00](https://www.nowcoder.com/discuss/comment/3212254)


[笨小孩ovo](https://www.nowcoder.com/users/409028211)


Java


抽象类中不能有方法体！抽象类中不能有方法体！抽象类中不能有方法体！只能有声明


4 回复
[发布于 2022-03-31 19:04](https://www.nowcoder.com/discuss/comment/12388649)


[hpt学习中](https://www.nowcoder.com/users/7030223)


Java


抽象类是一个不能创建对象的类。抽象类可以有成员变量，成员方法，构造方法。抽象方法不能有方法体。


2 回复
[发布于 2019-07-23 09:19](https://www.nowcoder.com/discuss/comment/3284418)


[东鹏Meeesi](https://www.nowcoder.com/users/2327510)


Java


抽象类中的抽象方法没有方法体


题中的抽象方法缺少返回值


2 回复
[发布于 2020-07-26 23:39](https://www.nowcoder.com/discuss/comment/6567055)

收起 **1** **2** **3** **4** **5** **6** **7**


多选题


**4. 以下哪几个是java中的集合类型？**


A Vector


B Set


C String


D List


正确答案：ABD


[Java_小朱同学](https://www.nowcoder.com/users/8063197)


Java


106 回复
[发布于 2019-06-26 13:51](https://www.nowcoder.com/discuss/comment/3172276)


[KMY-BEYOND190825](https://www.nowcoder.com/users/917364003) 回复


感谢


3 回复
[发布于 2019-07-26 14:37](https://www.nowcoder.com/discuss/comment/3307164)


[佐治亚](https://www.nowcoder.com/users/942782089) 回复


感谢(❁´ω`❁)


1 回复
[发布于 2019-10-26 11:02](https://www.nowcoder.com/discuss/comment/4764621)


展开9条回复


[无限嚣张](https://www.nowcoder.com/users/896143184)


Java


接口也算么？


5 回复
[发布于 2019-09-07 19:16](https://www.nowcoder.com/discuss/comment/3920113)


[IDEA2022.4.2](https://www.nowcoder.com/users/181223548) 回复


为啥不算呢


点赞 回复
[发布于 2019-09-20 09:38](https://www.nowcoder.com/discuss/comment/4166457)


[夜是故乡明](https://www.nowcoder.com/users/6432095) 回复


父类引用指向子类实现，接口当然也用得很广泛


点赞 回复
[发布于 2020-11-10 12:51](https://www.nowcoder.com/discuss/comment/8093772)


[MC枫少](https://www.nowcoder.com/users/4171070)


Java


下面由MC枫少为您解答：

String为引用数据类型，直接pass


4 回复
[发布于 2021-12-10 11:19](https://www.nowcoder.com/discuss/comment/11460496)


[MC枫少](https://www.nowcoder.com/users/4171070) 回复



**题友讨论(23)**


另外三个看着眼熟，就都是了


1 回复
[发布于 2021-12-10 11:19](https://www.nowcoder.com/discuss/comment/11460499)


[达达利亚~](https://www.nowcoder.com/users/945773617)


门头沟学院 电子信息类


1 回复


[发布于 07-19 22:40](https://www.nowcoder.com/discuss/comment/16439936) 四川


[IDEA2022.4.2](https://www.nowcoder.com/users/181223548)


golang


选错的去看一下集合框架图就知道了


点赞 回复
[发布于 2019-09-20 09:40](https://www.nowcoder.com/discuss/comment/4166536)


[锐意进取233](https://www.nowcoder.com/users/31501944)


无线通信工程师


Java中的集合类型：Vector、Set、List


点赞 回复
[发布于 2021-04-07 10:25](https://www.nowcoder.com/discuss/comment/8921639)


[onlykitten](https://www.nowcoder.com/users/663386830) 回复


Vector接触太少了，不了解


点赞 回复


[发布于 06-08 09:50](https://www.nowcoder.com/discuss/comment/16215047) 重庆


[牛客451864317号](https://www.nowcoder.com/users/451864317)


Java


想着String是字符的集合就选了，踩坑了啊


点赞 回复


[发布于 2021-12-19 11:17](https://www.nowcoder.com/discuss/comment/11495633) 来自Android客户端


[牛客375938277号](https://www.nowcoder.com/users/375938277)


Java


Vector set list是，list包括Array list vector Linked list


点赞 回复


[发布于 2022-09-19 18:56](https://www.nowcoder.com/discuss/comment/14373905) 北京 来自Android客户端





多选题


**5. CMS垃圾回收器在那些阶段是没用用户线程参与的**


A 初始标记


B 并发标记


C


C 重新标记


D 并发清理


正确答案：AC 你的答案：CD


官方解析：


CMS收集器是一种以获取最短回收停顿时间为目标的收集器，它是基于标记清除算法实现的，


它的运作过程相对于其他收集器来说要更复杂一些，整个过程分为四个步骤，


包括：初始标记、并发标记、重新标记、并发清除。


其中初始标记、重新标记这两个步骤需要暂停整个JVM。


1. 初始标记仅仅只是标记一下GC Roots能直接关联到的对象，速度很快。


2. 并发标记阶段就是从GC Roots的直接关联对象开始遍历整个对象图的过程，


3. 这个过程耗时较长但是不需要停顿用户线程，可以与垃圾收集线程一起并发运行。


4. 重新标记阶段则是为了修正并发标记期间，因用户程序继续运作而导致标记产生变动的那一部分对象


5. 这个阶段的停顿时间通常会比初始标记阶段稍长一些，但也远比并发标记阶段的时间短。


6. 并发清除阶段，清理删除掉标记阶段判断的已经死亡的对象，由于不需要移动存活对象，


7. 所以这个阶段也是可以与用户线程同时并发的。


示意图如下：


综上所述，答案选择A C。


华为


海思


新凯来



<img src="/img/Java面试.pdf-8-0.png">
**牛客网 - 笔试题-2**


**笔记本：** 面试


**创建时间：** 2023/12/23 4:12 **更新时间：** 2023/12/23 4:20



新凯来


农发行


~~华为数~~ 通



<img src="/img/Java面试.pdf-9-0.png">

<img src="/img/Java面试.pdf-9-2.png">



<img src="/img/Java面试.pdf-9-1.png">







<img src="/img/Java面试.pdf-9-3.png">









正确答案：A


官方解析：暂无官方题目解析，去讨论区看看吧！


知识点：Java


**题友讨论(46)**


单选题


**2. java8中，下面哪个类用到了解决哈希冲突的开放定址法**


A LinkedHashSet


B HashMap


C ThreadLocal


D TreeMap


正确答案：B


官方解析：暂无官方题目解析，去讨论区看看吧！


知识点：Java、Java工程师、2019


[伦敦城下的小鞋匠](https://www.nowcoder.com/users/36200329)


Java


hashmap不是吗？？


6 回复
[发布于 2019-07-02 13:27](https://www.nowcoder.com/discuss/comment/3191043)


[牛客390593474号](https://www.nowcoder.com/users/390593474) 回复



**题友讨论(101)**



hashMap的结构可以看下，数组+链表，其中数组有自动扩容的机制，每一个数组中又有链表，链表里面

个说明发生了hash冲突，因为使用的是链表存储的对象，所以又叫链地址法，也或者说是拉链法


6 回复
[发布于 2019-12-09 09:13](https://www.nowcoder.com/discuss/comment/5088818)


[搬砖员](https://www.nowcoder.com/users/358490495) 回复


hashmap是拉链法


4 回复
[发布于 2019-07-15 07:43](https://www.nowcoder.com/discuss/comment/3241201)


[清風逐尘乀](https://www.nowcoder.com/users/91114325)


拼多多推荐服务端研发工程师


ThreadLocalMap中使用开放地址法来处理散列冲突，而HashMap中使用的是分离链表法。之所以采用不同的

分散得十分均匀，很少会出现冲突。并且ThreadLocalMap经常需要清除无用的对象，使用纯数组更加方便。

收起 


230 回复
[发布于 2019-07-03 14:53](https://www.nowcoder.com/discuss/comment/3195124)


[清風逐尘乀](https://www.nowcoder.com/users/91114325) 回复 [眉毛密过发](https://www.nowcoder.com/users/204442994)


jdk源码啊 还有网上找一些源码解析的博客看


25 回复
[发布于 2019-08-22 05:39](https://www.nowcoder.com/discuss/comment/3619047)


[眉毛密过发](https://www.nowcoder.com/users/204442994) 回复


很赞，请问这些知识是看哪些书籍的呢？


4 回复
[发布于 2019-08-22 00:43](https://www.nowcoder.com/discuss/comment/3618618)


展开12条回复


[字节跳动内推请找我](https://www.nowcoder.com/users/2893699)


字节跳动广告系统后端开发工程师


ThreadLocalMap通过key（ThreadLocal类型）的hashcode来计算数组存储的索引位置i。如果i位置已经存储

到空的位置，再将对象存放。另外，在最后还需要判断一下当前的存储的对象个数是否已经超出了阈值（thres


所有的对象重新计算位置。


50 回复
[发布于 2019-06-28 00:00](https://www.nowcoder.com/discuss/comment/3177606)


[HesionBlack](https://www.nowcoder.com/users/269407906) 回复


所有 这题答案不是应该是ThreadLocal C 为啥啊显示B HashMap


9 回复


[发布于 2022-08-29 10:38](https://www.nowcoder.com/discuss/comment/14058768) 浙江


[牛客865595709号](https://www.nowcoder.com/users/865595709) 回复


ThreadLocalMap通过key（ThreadLocal类型）的hashcode来计算数组存储的索引位置i。如果i位置已

推，直到找到空的位置，再将对象存放。另外，在最后还需要判断一下当前的存储的对象个数是否已经超


了，需要重新扩充并将所有的对象重新计算位置。


3 回复


[发布于 2022-05-13 16:58](https://www.nowcoder.com/discuss/comment/13077990) 来自Android客户端


[闷死作大死](https://www.nowcoder.com/users/433851177)


Java


threadlocal 使用开放地址法 - 线性探测法：当前哈希槽有其他对象占了，顺着数组索引寻找下一个，直到找到

hashset 中调用 hashmap 来存储数据的，hashmap 采用的链地址法：当哈希槽中有其他对象了，使用链表的


43 回复
[发布于 2019-07-25 19:40](https://www.nowcoder.com/discuss/comment/3302244)


[被发好人卡的闭门羹烹饪师很大胆](https://www.nowcoder.com/users/897763417) 回复


threadlocal 使用 开放地址法-线性探测法：当前hash槽有其他对象占了，顺着数组索引寻找下一个，知

据，hashmap采用链地址发： 档哈希槽中有其他对象了，使用链表的方式连接到那个对象上


点赞 回复


[发布于 09-23 22:58](https://www.nowcoder.com/discuss/comment/17334110) 湖南


[源于指尖](https://www.nowcoder.com/users/673909363)


Java


开放定址法：基本思想是：当关键字key的哈希地址p=H（key）出现冲突时，以p为基础，产生另一个哈希地址

哈希地址p2，…，直到找出一个不冲突的哈希地址pi ，将相应元素存入其中。

再哈希法：这种方法是同时构造多个不同的哈希函数：Hi=RH1（key） i=1，2，…，k当哈希地址Hi=RH1（k

到冲突不再产生。这种方法不易产生聚集，但增加了计算时间。


链地址法：这种方法的基本思想是将所有哈希地址为i的元素构成一个称为同义词链的单链表，并将单链表的头指


删除主要在同义词链中进行。链地址法适用于经常进行插入和删除的情况。


收起 


31 回复
[发布于 2020-03-10 15:28](https://www.nowcoder.com/discuss/comment/5423019)


[美丽的刚子在看牛客](https://www.nowcoder.com/users/387986989) 回复


还有一种，公共溢出区


点赞 回复


[发布于 03-17 09:22](https://www.nowcoder.com/discuss/comment/15504024) 湖南 来自Android客户端


[超级鸭脖](https://www.nowcoder.com/users/992391272)


华中师范大学 计算机类


hashset和hashmap通常是使用分离链接散列实现的。


16 回复
[发布于 2019-07-02 13:58](https://www.nowcoder.com/discuss/comment/3191141)


[一川烟草平如剪](https://www.nowcoder.com/users/247990274)


门头沟学院 计算机类


我醉了，你随意


... 展开 


13 回复
[发布于 2022-05-03 14:40](https://www.nowcoder.com/discuss/comment/12955578)


[五呀](https://www.nowcoder.com/users/176023843) 回复


**题目，真实服了


1 回复


[发布于 2022-11-29 20:55](https://www.nowcoder.com/discuss/comment/15075469) 浙江


[zygswo](https://www.nowcoder.com/users/672535528) 回复


我也觉得题目答案错了


点赞 回复


[发布于 2022-12-01 09:10](https://www.nowcoder.com/discuss/comment/15081577) 浙江


展开2条回复


[jfghdfg](https://www.nowcoder.com/users/609671194)


Java


我东哥把你当兄弟，你既然还做错


12 回复
[发布于 2019-08-27 18:40](https://www.nowcoder.com/discuss/comment/3712866)


[happinessCrab](https://www.nowcoder.com/users/728862594) 回复


东哥的兄弟


点赞 回复


[发布于 2022-08-22 18:23](https://www.nowcoder.com/discuss/comment/13967678) 北京 来自iOS客户端


[书风](https://www.nowcoder.com/users/466735236) 回复 [happinessCrab](https://www.nowcoder.com/users/728862594)


东哥是谁？


点赞 回复


[发布于 08-19 23:57](https://www.nowcoder.com/discuss/comment/16713282) 广东


[你的offer对我打了烊](https://www.nowcoder.com/users/598309941)


Java


HashMap采用了链地址法，ThreadLocalMap则是开放地址法。

开放定址法：当冲突发生时，使用某种探查(亦称探测)技术在散列表中形成一个探查(测)序列。沿此序列逐个单


... 展开 


6 回复
[发布于 2020-03-05 22:06](https://www.nowcoder.com/discuss/comment/5382505)


[仙人球9](https://www.nowcoder.com/users/779048390) 回复


mark


点赞 回复


[发布于 2022-10-27 20:56](https://www.nowcoder.com/discuss/comment/14833027) 广东 来自Android客户端


[牛客791400744号](https://www.nowcoder.com/users/791400744) 回复


马克


点赞 回复


[发布于 07-16 00:38](https://www.nowcoder.com/discuss/comment/16417498) 河北


[呆呆小瓜](https://www.nowcoder.com/users/809974115)


Java


threadlocal而是一个线程内部的存储类，可以在指定线程内存储数据，数据存储以后，只有指定线程可以得到


5 回复
[发布于 2019-10-14 09:47](https://www.nowcoder.com/discuss/comment/4566152)

收起 **1** **2** **3** **4** **5** **6** **7**


多选题


**3. servlet周期包含哪些：**


A 初始化


B 销毁


C 请求处理


D 开始


正确答案：ABC


官方解析：暂无官方题目解析，去讨论区看看吧！


知识点：Java


**题友讨论(102)**


[Farling](https://www.nowcoder.com/users/9659928)


Java


**init() --> 初始化**

**service() --> 处理请求**

**destory () --> 销毁（停止）**

收起 


145 回复
[发布于 2018-09-14 15:22](https://www.nowcoder.com/discuss/comment/1859189)


[夏商西周](https://www.nowcoder.com/users/2063120) 回复 [CM12](https://www.nowcoder.com/users/918208832)


眼神犀利 男能可贵


4 回复
[发布于 2018-11-03 03:00](https://www.nowcoder.com/discuss/comment/2313372)


[CM12](https://www.nowcoder.com/users/918208832) 回复


你的销毁写错了 正确的是destroy


13 回复
[发布于 2018-09-21 15:33](https://www.nowcoder.com/discuss/comment/1942977)


展开7条回复


[Allen烽](https://www.nowcoder.com/users/2218792)


Java


Servlet生命周期分成3个阶段：


1）初始化阶段：调用init方法

2）响应客户请求：调用service

3）终止：调用destory方法


初始化阶段：在下列时刻servlet容器装载servlet


1 servlet容器启动时，自动装载某些servlet


2 在servlet容器启动后，客户首次向servlet发送请求


3 servlet类文件被更新之后，重新装载servlet


Servlet被装载之后，servlet容器创建一个servlet'对象并调用servlet的init方法，在servlet生命周期内，init方

一个请求，servlet调用service方法时请求进行响应，service对请求的方式进行了匹配，选择调用dopost或者d

的方法，实现对客户的响应。


响应客户请求：对于用户到达servlet的请求，servlet容器会创建特定于该请求的servletrequest和servletresp

e方法从servletrequest对象中获取客户请求的信息，处理该请求，并且通过servletresponse对象向客户端返回


终止：当web应用终止或者servlet容器终止或servlet容器重新装载servlet新实例时，servlet容器会调用servle


rvlet占用的资源


收起 


52 回复
[发布于 2018-12-18 15:49](https://www.nowcoder.com/discuss/comment/2458873)


[并肩于雪山之巅♡.](https://www.nowcoder.com/users/115737565) 回复


是destroy()方法


1 回复
[发布于 2019-10-10 10:13](https://www.nowcoder.com/discuss/comment/4495999)


[已注销](https://www.nowcoder.com/users/759067082) 回复


init()方法，destroy()方法。（小小的细节）


点赞 回复
[发布于 2022-04-20 13:02](https://www.nowcoder.com/discuss/comment/12751022)


展开2条回复


[编程小海浪](https://www.nowcoder.com/users/797024057)


科大讯飞智慧城市事业部后端研发工程师


32 回复
[发布于 2019-09-24 10:14](https://www.nowcoder.com/discuss/comment/4259930)


[oasis 98](https://www.nowcoder.com/users/399207094) 回复


mark


点赞 回复


[发布于 2020-07-31 16:23](https://www.nowcoder.com/discuss/comment/6614692) 来自Android客户端


[锐意进取233](https://www.nowcoder.com/users/31501944) 回复


Mark


点赞 回复
[发布于 2021-05-19 11:24](https://www.nowcoder.com/discuss/comment/9237106)


展开1条回复


[牛客-凌凌漆](https://www.nowcoder.com/users/914738902)


Java


销毁就销毁，你干嘛叫停止； 就像请求处理我叫处理请求一样，能不能同一点


20 回复
[发布于 2018-09-23 09:34](https://www.nowcoder.com/discuss/comment/1961013)


[悟添](https://www.nowcoder.com/users/408291277) 回复


你销毁可以叫停止，那我开始为什么不能替代创建&hellip;&hellip;


2 回复
[发布于 2018-11-03 11:03](https://www.nowcoder.com/discuss/comment/2314141)


[MercyZhou](https://www.nowcoder.com/users/9724200) 回复


赞同+++


点赞 回复
[发布于 2018-10-16 18:54](https://www.nowcoder.com/discuss/comment/2175851)


展开4条回复


[哈哈哈哈哈哈哈吖](https://www.nowcoder.com/users/296436385)


Java


Servlet的生命周期分为5个阶段：加载、创建、初始化、处理客户请求、卸载。


(1)加载：容器通过类加载器使用servlet类对应的文件加载servlet


... 展开 


6 回复
[发布于 2020-02-17 17:10](https://www.nowcoder.com/discuss/comment/5284369)


[笨小孩ovo](https://www.nowcoder.com/users/409028211)


Java


servlet周期包含三个阶段：


... 展开 


5 回复
[发布于 2022-03-31 18:53](https://www.nowcoder.com/discuss/comment/12388497)


[陈浩程](https://www.nowcoder.com/users/8515955)


Java


初始化：init() 请求处理：service() 销毁：destroy()


3 回复
[发布于 2018-09-17 12:56](https://www.nowcoder.com/discuss/comment/1887185)


[我只做num1](https://www.nowcoder.com/users/88374797)


Java


servlet的生命周期:

servlet加载并实例化-->调用init()方法进行初始化-->调用service()方法进行请求的处理--->调用destroy()方


3 回复
[发布于 2020-08-24 14:31](https://www.nowcoder.com/discuss/comment/6963740)


[米米哥](https://www.nowcoder.com/users/718073472)


Java


1、创建与初始化


2、实例化


3、服务


4、反复服务


5、销毁 ... 展开 


2 回复
[发布于 2018-10-21 23:57](https://www.nowcoder.com/discuss/comment/2224674)


[咸鱼陈123](https://www.nowcoder.com/users/243585553) 回复


错了吧 老铁 先new一个 然后初始化吧 你1和2反了


点赞 回复
[发布于 2018-11-08 09:27](https://www.nowcoder.com/discuss/comment/2338059)


[行者201809061325271](https://www.nowcoder.com/users/116599502)


Java


1.加载并时例化：容器启动时，加载servlet 的class ，并new 出这个对象


2，初始化：init （）

3，服务：service （）

4，销毁中：destroy（）


2 回复
[发布于 2018-10-30 18:19](https://www.nowcoder.com/discuss/comment/2292248)

收起 **1** **2** **3** **4** **5** **6** **8**


多选题


**4. 下列说法正确的有（ ）**


A 构造方法的方法名必须与类名相同


B 构造方法也没有返回值，但可以定义为void


C 在子类构造方法中调用父类的构造方法，super() 必须写在子类构造方法的第一行，否则编译不通


D 一个类可以定义多个构造方法，如果在定义类时没有定义构造方法，则编译系统会自动插入一个默


代码


正确答案：ACD


官方解析：暂无官方题目解析，去讨论区看看吧！


知识点：Java


**题友讨论(45)**


[wkzq](https://www.nowcoder.com/users/3449349)


Java


D中默认的构造方法不应该调用父类的构造方法吗？


36 回复
[发布于 2017-03-24 10:03](https://www.nowcoder.com/discuss/comment/435176)


[笨小孩ovo](https://www.nowcoder.com/users/409028211) 回复


D选项中没有说这个类有父类呀


2 回复
[发布于 2022-03-09 19:19](https://www.nowcoder.com/discuss/comment/12001417)


[年少挽滑稽世无双](https://www.nowcoder.com/users/730848335) 回复 [笨小孩ovo](https://www.nowcoder.com/users/409028211)


Object类是所有类的父类


3 回复
[发布于 2022-03-18 23:16](https://www.nowcoder.com/discuss/comment/12170268)


展开7条回复


[Spongebobmay](https://www.nowcoder.com/users/7009754)


算法工程师


关于B选项：Java:语法要求的构造函数只能那么写。如果写成public void 类名(){} 这种格式的话。此时就相当与

用，调用这个类的时候不能自动执行构造函数里的代码。


23 回复
[发布于 2018-04-08 15:28](https://www.nowcoder.com/discuss/comment/1263072)


[GalaxyKris](https://www.nowcoder.com/users/5047418)


安卓


super（）在子类中不是可以不写吗？


16 回复
[发布于 2017-03-21 23:09](https://www.nowcoder.com/discuss/comment/431782)


[还好还好还好](https://www.nowcoder.com/users/6805166) 回复


是可以不写，但是系统会自动添加上，题干强调的是必须在第一行


2 回复
[发布于 2017-03-22 21:13](https://www.nowcoder.com/discuss/comment/433053)


[养猫的程序猿](https://www.nowcoder.com/users/170169391) 回复


你可以不要，但是它会存在，系统自动生成的


点赞 回复
[发布于 2022-05-13 11:30](https://www.nowcoder.com/discuss/comment/13074185)


[丁泠](https://www.nowcoder.com/users/552485710)


Java


构造函数不能添加void之类的修饰符


10 回复
[发布于 2021-12-24 12:40](https://www.nowcoder.com/discuss/comment/11515931)


[君然](https://www.nowcoder.com/users/796042485)


Java


默认的无参构造方法，不应该会默认执行父类的构造方法吗？怎么能算是不执行“任何代码”？


6 回复
[发布于 2021-10-25 15:11](https://www.nowcoder.com/discuss/comment/11112703)


[原来你是小幸运](https://www.nowcoder.com/users/727770529) 回复


父类的构造方***执行，但不是通过子类构造方法来执行的，否则难道你重写构造方法父类就不执行了么


点赞 回复


[发布于 2021-10-26 23:06](https://www.nowcoder.com/discuss/comment/11134420) 来自Android客户端


[菜菜不是程序员](https://www.nowcoder.com/users/179484797) 回复 [原来你是小幸运](https://www.nowcoder.com/users/727770529)


不是子类的构造里会隐含super()才调用的父类构造吗


点赞 回复


[发布于 2022-08-29 16:51](https://www.nowcoder.com/discuss/comment/14064525) 江西


[jacklimors](https://www.nowcoder.com/users/768607068)


东南大学 电子信息类


cpp哪来的super？


4 回复
[发布于 2021-03-26 16:48](https://www.nowcoder.com/discuss/comment/8798373)


[搬砖的Java小白](https://www.nowcoder.com/users/220139154) 回复


这是Java。。


1 回复


[发布于 2021-10-13 08:19](https://www.nowcoder.com/discuss/comment/10924878) 来自Android客户端


[鸢尾楚楚](https://www.nowcoder.com/users/109408)


C++


有没有人解释一下B选项


2 回复
[发布于 2017-12-05 11:32](https://www.nowcoder.com/discuss/comment/1117553)


[小冰丿丶焦](https://www.nowcoder.com/users/119697841) 回复


应该是不能定义为viod，构造方法是个很特殊的方法。平时普通的函数一般有返回值，当你不想返回任何


回东西。构造方法是不需要返回值的，自然也不用说告诉编译器我是viod


1 回复


[发布于 2021-11-09 15:36](https://www.nowcoder.com/discuss/comment/11257092) 来自iOS客户端


[飞翔的毛豆](https://www.nowcoder.com/users/478661384)


C++


<p>C选项是指的Java语言当中吗？</p>


2 回复


[发布于 2020-10-19 22:12](https://www.nowcoder.com/discuss/comment/7868072) 来自iOS客户端


[牛客520361200号](https://www.nowcoder.com/users/520361200)


Java


如果不执行任何代码，那么实例成员变量的默认值哪里来的？


2 回复


[发布于 2022-01-23 19:06](https://www.nowcoder.com/discuss/comment/11616382) 来自Android客户端


[已注销](https://www.nowcoder.com/users/710348587) 回复


应该是jvm赋的值吧


点赞 回复
[发布于 2022-03-20 11:39](https://www.nowcoder.com/discuss/comment/12192761)


[槿上雨](https://www.nowcoder.com/users/4050847)


C++


真的好坑爹啊 这也看不出来是java还是c++问题 java我记不清 但是c++的话 没有定义构造方法 则在需要时才会

咋选


1 回复
[发布于 2017-06-19 23:21](https://www.nowcoder.com/discuss/comment/552004)


[小冰丿丶焦](https://www.nowcoder.com/users/119697841) 回复


java没有定义过构造方法，也会默认生成一个无参构造方法


点赞 回复


[发布于 2021-11-09 15:28](https://www.nowcoder.com/discuss/comment/11256970) 来自iOS客户端


收起 **1** **2** **3**


多选题


**5. 多态的作用（）**


A 隐藏细节


B 提高可重用性


C 扩展代码模块


D 提高编译可靠性


正确答案：BC


官方解析：暂无官方题目解析，去讨论区看看吧！


知识点：Java、Java工程师、C++工程师


**题友讨论(83)**


[我的天鸭](https://www.nowcoder.com/users/243498)


集成电路IC设计


隐藏细节应该是封装干的事情吧


284 回复
[发布于 2019-08-02 11:22](https://www.nowcoder.com/discuss/comment/3367234)


[蜀醉游子心](https://www.nowcoder.com/users/5680535) 回复


虚函数属于运行多态，纯虚函数有一个接口类的应用，这个可以通过继承隐藏函数的实现细节。


8 回复
[发布于 2019-08-11 15:29](https://www.nowcoder.com/discuss/comment/3461789)


[垃圾桶](https://www.nowcoder.com/users/242432795) 回复


使用多态的时候，并不知道调用的是父类的还是子类的方法，这算隐藏细节么？


8 回复
[发布于 2019-09-27 14:01](https://www.nowcoder.com/discuss/comment/4339345)


展开18条回复


[Bean冷的心](https://www.nowcoder.com/users/411517301)


内蒙古大学 计算机类


是什么让C++程序员和Java程序员见面，是顺丰。


114 回复
[发布于 2019-08-02 18:27](https://www.nowcoder.com/discuss/comment/3371682)


[浮生后雪](https://www.nowcoder.com/users/995843523) 回复


强烈建议牛客重新检查顺丰的题目,各个都乱七八糟的,没一个正常的


16 回复
[发布于 2019-08-04 00:37](https://www.nowcoder.com/discuss/comment/3384558)


[黄色变白色](https://www.nowcoder.com/users/8547911) 回复


感觉顺丰和迅雷的题好多


点赞 回复
[发布于 2019-08-04 11:55](https://www.nowcoder.com/discuss/comment/3386597)


展开7条回复


[不知道取名字](https://www.nowcoder.com/users/877191350)


Java


有顺丰科技这个标签的java题目我从来没做对过


41 回复
[发布于 2019-08-19 15:48](https://www.nowcoder.com/discuss/comment/3575167)


[乒乓球去学校](https://www.nowcoder.com/users/797390480) 回复


哈哈哈


点赞 回复
[发布于 2019-08-21 15:08](https://www.nowcoder.com/discuss/comment/3608213)


[Jasonxcx](https://www.nowcoder.com/users/849716666) 回复


+1


点赞 回复
[发布于 2019-11-07 16:59](https://www.nowcoder.com/discuss/comment/4893964)


展开3条回复


[灵魂跟上我](https://www.nowcoder.com/users/912506641)


Java


多态的作用 1不必编写每一子类的功能调用，可以直接把不同子类当父类看，屏蔽子类间的差异，提高代码的通


能，提高了代码的扩充性和可维护性


38 回复
[发布于 2019-07-31 19:37](https://www.nowcoder.com/discuss/comment/3349185)


[晚成](https://www.nowcoder.com/users/632749710)


Java


封装是为了隐藏细节，限制可访问的权限； 继承是为了代码的复用； 但实质上二者都是为多态服务的，所以也


7 回复


[发布于 2020-05-11 12:29](https://www.nowcoder.com/discuss/comment/6112983) 来自Android客户端


[活跃的椰子拒绝pua](https://www.nowcoder.com/users/673412219) 回复


我也是这么想的,结果错了


点赞 回复


[发布于 02-28 11:15](https://www.nowcoder.com/discuss/comment/15370450) 四川


[小刘想要搞大钱](https://www.nowcoder.com/users/524970293) 回复


我也是这么想的


点赞 回复


[发布于 03-04 17:06](https://www.nowcoder.com/discuss/comment/15400213) 陕西


[阿要理](https://www.nowcoder.com/users/434646596)


Java


<p>谁能提高编译可靠性</p>


7 回复


[发布于 2020-12-17 22:03](https://www.nowcoder.com/discuss/comment/8322449) 来自iOS客户端


[牛客59880486号](https://www.nowcoder.com/users/59880486)


后端


多态的作用 1不必编写每一子类的功能调用，可以直接把不同子类当父类看，屏蔽子类间的差异，提高代码的通


能，提高了代码的扩充性和可维护性


5 回复


[发布于 2021-11-04 17:00](https://www.nowcoder.com/discuss/comment/11220722) 来自Android客户端


[索悟](https://www.nowcoder.com/users/2754733)


Java


做一次错一次。。。。


3 回复
[发布于 2020-01-08 13:02](https://www.nowcoder.com/discuss/comment/5200206)


[你的offer对我打了烊](https://www.nowcoder.com/users/598309941)


Java


我以为一个选项对应一个特性，隐藏细节是封装，提高可重用性是继承，扩展模块代码是多态


2 回复
[发布于 2020-03-06 09:22](https://www.nowcoder.com/discuss/comment/5384445)


[阿要理](https://www.nowcoder.com/users/434646596) 回复


堕胎？


1 回复


[发布于 2020-12-17 22:03](https://www.nowcoder.com/discuss/comment/8322448) 来自iOS客户端


[你的offer对我打了烊](https://www.nowcoder.com/users/598309941) 回复 [阿要理](https://www.nowcoder.com/users/434646596)


已修正


1 回复
[发布于 2020-12-18 09:42](https://www.nowcoder.com/discuss/comment/8323483)


展开1条回复


[寻欢作恶](https://www.nowcoder.com/users/202734540)


Java


我觉得这题吧,看看就行,别较真。


2 回复
[发布于 2020-06-15 16:06](https://www.nowcoder.com/discuss/comment/6313801)


**牛客网 -笔试题-1**


**笔记本：** 面试


**创建时间：** 2023/12/23 3:57 **更新时间：** 2023/12/23 4:05


正确答案：A


**题友讨论(42)**


[bipa](https://www.nowcoder.com/users/995289783)


Java


java只支持单一继承，多实现，继承和实现是两个不同的概念，只是通过实现多个接口来达到“多继承”的作用


1 回复
[发布于 2019-12-12 09:28](https://www.nowcoder.com/discuss/comment/5104305)


[Jeff_Lui](https://www.nowcoder.com/users/336667052)


Java


Java单继承多实现，一个类只能继承一个类，但是可以实现多个接口，也可以在继承一个类的同时实现多个接口


1 回复
[发布于 2020-03-23 13:51](https://www.nowcoder.com/discuss/comment/5592765)


[IDEA2022.4.2](https://www.nowcoder.com/users/181223548)


golang


全错 类只支持单继承，接口支持多继承


56 回复
[发布于 2019-08-22 10:35](https://www.nowcoder.com/discuss/comment/3621426)


[boonboonpeng](https://www.nowcoder.com/users/835432273) 回复 [牛客唯一菜鸡](https://www.nowcoder.com/users/5149122)


接口只能继承接口而不是实现接口


2 回复
[发布于 2019-09-22 21:15](https://www.nowcoder.com/discuss/comment/4228249)


[宁算什么牛马](https://www.nowcoder.com/users/829361479) 回复


人不是说类吗，又没说接口，接口不算类吧？



<img src="/img/Java面试.pdf-23-0.png">
1 回复


[发布于 2020-12-01 07:53](https://www.nowcoder.com/discuss/comment/8238379) 来自Android客户端


展开6条回复


[小董同学要努力](https://www.nowcoder.com/users/544472051)


字节跳动朝夕光年游戏服务器开发工程师


**全错**


A. 类支持单根继承，接口支持多继承


... 展开 


17 回复
[发布于 2020-03-25 10:41](https://www.nowcoder.com/discuss/comment/5619482)


[牛客736261213号](https://www.nowcoder.com/users/736261213)


说全错的都是不经过思考的吧，接口不是类，Java中单一继承说的是类，接口可以多继承


6 回复


[发布于 2021-08-13 08:23](https://www.nowcoder.com/discuss/comment/9745688) 来自iOS客户端


[hwx的offer快来](https://www.nowcoder.com/users/393090711) 回复


接口是不是class 接口能不能进行构造方法 接口会不会进行序列化


点赞 回复


[发布于 02-09 10:00](https://www.nowcoder.com/discuss/comment/15270909) 广东


[牛客72319378号](https://www.nowcoder.com/users/72319378) 回复


确实，题目说的是Java中 ！类，是单一继承，又没有说其他的，接口确实是多继承，但是接口又不是类


点赞 回复


[发布于 09-23 11:55](https://www.nowcoder.com/discuss/comment/17320589) 广东


[牛客-120抢救中心](https://www.nowcoder.com/users/6165623)


Java


单继承（类），多实现（接口）


3 回复
[发布于 2020-06-22 11:01](https://www.nowcoder.com/discuss/comment/6346489)


[Aomsir](https://www.nowcoder.com/users/949129631)


文华学院 计算机类


A. Java中的类和C++中的不同，C++支持多继承，但Java的类只支持单继承，为了解决多继承的需要，Java出


B. Java中一个类可以实现多个接口


... 展开 


2 回复
[发布于 2022-04-30 16:20](https://www.nowcoder.com/discuss/comment/12925448)


[快乐风男2^10+2](https://www.nowcoder.com/users/81213693)


Java


java中只允许单继承，可以多接口


1 回复
[发布于 2019-11-27 20:55](https://www.nowcoder.com/discuss/comment/5032570)


[牛客832854071号](https://www.nowcoder.com/users/832854071)


Java


即使知道全错我还是选对了。


1 回复


[发布于 2020-04-04 12:57](https://www.nowcoder.com/discuss/comment/5759412) 来自Android客户端


[天棚猿帅](https://www.nowcoder.com/users/119522738)


Java


服了，这题出的有脑子


点赞 回复
[发布于 2019-10-18 01:19](https://www.nowcoder.com/discuss/comment/4642936)

收起 **1** **2** **3**


单选题


**2. 以下哪一个正则表达式不能与字符串“https://www.tensorflow.org/”（不含引号）匹配？（）**


A [a-z]+://[a-z.]+/


B https[://]www[.]tensorflow[.]org[/]


C [https]+://www.tensorflow.org/


D [a-zA-Z.:/]+


正确答案：B 你的答案：D


1. 任意一个字符表示匹配任意对应的字符，如a匹配a，7匹配7，-匹配-。


2. []代表匹配中括号中其中任一个字符，如[abc]匹配a或b或c。

3. -在中括号里面和外面代表含义不同，如在外时，就匹配-，如果在中括号内[a-b]表示匹配26个小写字母中的

个；[0-9]匹配十个数字中任一个。

4. ^在中括号里面和外面含义不同，如在外时，就表示开头，如^7[0-9]表示匹配开头是7的，且第二位是任一数

符之外的任意字符(包括数字，特殊字符)，如[^abc]表示匹配出去abc之外的其他任一字符。

5. .表示匹配任意的字符。


6. /d表示数字。


7. /D表示非数字。


8. /s表示由空字符组成，[ /t/n/r/x/f]。

9. /S表示由非空字符组成，[^/s]。

10. /w表示字母、数字、下划线，[a-zA-Z0-9_]。

11. /W表示不是由字母、数字、下划线组成。


12. ?: 表示出现0次或1次。


13. +表示出现1次或多次。


14. *表示出现0次、1次或多次。


15. {n}表示出现n次。

16. {n,m}表示出现n~m次。

17. {n,}表示出现n次或n次以上。


18. XY表示X后面跟着Y，这里X和Y分别是正则表达式的一部分。

19. X|Y表示X或Y，比如"food|f"匹配的是foo（d或f），而"(food)|f"匹配的是food或f。

20. (X)子表达式，将X看做是一个整体


[&nbsp;&nbsp;详见：https://www.jianshu.com/p/3c076c6b2dc8&nbsp;](https://gw-c.nowcoder.com/api/sparta/jump/link?link=https%3A%2F%2Fwww.jianshu.com%2Fp%2F3c076c6b2dc8)


单选题 360集团真题


**3. 2022 奇虎360 Java**


**在串的简单模式匹配中，当模式串位j与目标串位i比较时，两字符不相等，则i的位移方式是？**


多选题


**4. 以下关于final关键字说法错误的是（）**


A final是java中的修饰符，可以修饰类、接口、抽象类、方法和属性


B final修饰的类肯定不能被继承


C final修饰的方法不能被重载


D final修饰的变量不允许被再次赋值


正确答案：AC 你的答案：AD


官方解析：


被final关键字修饰的类不能被继承，但抽象类存在的意义在于被其它类继承然后实现其内部方法的，


这样final和抽象类之间就产生了矛盾。因此，final并不能修饰抽象类，选项A错误，选项B正确。


C选项，重载的实现是编译器根据函数的不同的参数表，对同名函数的名称做修饰，


那么对于编译器而言，这些同名函数就成了不同的函数。


但重写则是子类方法对父类的方法的延申，即子类不仅继承了父类的方法，


还向父类的方法中添加了属于自己的内容，改变了父类方法原本的内容，


而final代表了一种不可变，这明显与重写形成了冲突。


因此被final修饰的类可以被重载但不能被重写，选项C错误。


当final用来修饰变量时，代表该变量不可被改变，一旦获得了初始值，该final变量就不能被重新赋值


1.final修饰变量，则等同于常量 2.final修饰方法中的参数，称为最终参数。 3.final修饰类，则类不能被继承 4.


饰抽象类 6. **final修饰的方法可以被重载 但不能被重写**


多选题


**5. 面向对象程序设计方法的优点包含：**


A 可重用性


B 可扩展性


C 易于管理和维护


D 简单易懂


正确答案：ABC 你的答案：ABCD


官方解析：暂无官方题目解析，去讨论区看看吧！


知识点：C++、Java


**java复习大纲-精华版**


**笔记本：** 面试


**创建时间：** 2023/12/11 22:17 **更新时间：** 2023/12/11 22:17


**java复习大纲（精华版）**


0.java的IO内容（java编程思想）


1.java的集合框架（java编程思想）


2.java的多线程机制（java编程思想）


3.tcp/ip协议，特别的其中的http协议这一块（计算机网络，http权威指南）


4.hibernate（JPA Spring +DATA）（精通HIbernat）


5.spring （基本讲代码的书）


6.spring mvc（跟开涛学MVC）


7.mybatis（课件和下载的那本书）


8.sql数据库这一块。如隔离级别，并发的问题，表链接，子查询，分页


9.具体的业务：增删改查，分页，带查询条件的分页


10.javaweb的三大组件：Servlet Filter Listener


11.Servlet域对象，jsp的隐含对象，EL表达式的隐含对象


12.JDBC这一块，statement prepratedstatemtn callablestateme.....


13.JVM相关的，内存管理，垃圾回收，各种引用的类型，垃圾回收的算法和回收器类型


14.javascript相关的，基础和使用


16.json的处理


17.单例模式


18.事务的性质


20.webservice json ajax


21.String的内存模型


String.intern();


22.==比较的是什么？java的对象在内存中的存放方式？


23.jvm常量池和class文件的常量池


24.多线程的知识


25.sql优化的内容


26.数据库的各种知识


27.线程 集合 io的知识


28.十个Spring mvc注解 十个linux常用命令 nosql中的redis的常见类型***作 git的常见***作


十个常见异常 常用的String的方法


数据库事务的acid属性 事务的隔离级别 事务并发是会出现的问题


29.maven 和 svn


30.linux的常见用法


31.String的内存分析 static final 的内存分析


32.报表和excel 上传下载功能 调度管理功能 石英调度 短信接口 邮件接口 rpc 远程访问


33.webservice git log 远程调用 权限框架


34.crm p2p linux marven协议就是固定的


35.看表的关系主要是看表的主外键关系


36.堆内存里面的对象是怎样管理的呢？


37.String 的 intern（）


38.OpenSessionInView


39.JNDI？


40.重写的机制


41.在局部变量上的对象的内存分配？


42.Callable接口


43.维护匿名内部类访问final呢？


44.虚假唤醒的问题？


45.性能优化的方方面面？数据库索引 负载均衡 前端 jvm linux服务器？


46.多种引用的类型


数据库MySQL的性能调优，如何用二维表储存无限扩展的树树结构


不同请求方式对于请求成功的意义如下:


GET: 已经取得资源，并将资源添加到响应的消息体中。


HEAD: 响应的消息体为头部信息。


POST: 响应的消息体中包含此次请求的结果。


TRACE: 响应的消息体中包含服务器接收到的请求信息。


PUT 和 DELETE 的请求成功通常并不是响应200 OK的状态码而是 204 No Content 表示无内


容(或者 201 Created表示一个资源首次被创建成功)。


描述MVC设计模式(以Java为例)


mvc设计模式在Java应用中主要体现在讲应用以view、controller、model的层次进行分离，以


简单的应用为例就是view(html,jsp)提交一个请求，


controller(servlet)接受请求发给model(业务处理类)进行处理， 最终model将处理的结果返回


给controller,然后由controller输出请求结果。


这种模式对开发团队开发有很大的好处，不同的人可以专注去做不同的事情，最终大家一起形成


一个完整应用，对开发人员的要求也逐步降低，降低了人力成本。


TCP和UDP区别是什么？


(1). TCP是面向连接的，而UDP是无连接的，区别大致如下：


a. UDP传送的数据单位协议是UDP，TCP传送数据单位的协议是TCP。


b. UDP发送数据之前是不需要建立连接，因此减少了开销和发送之前的时延。


c. TCP提供的是面向连接的服务，不提供广播和多播服务。


(2) 对方的运输层在收到UDP报文后，不需要给出任何确认。 TCP则需要确认。


(3) UDP没有拥塞控制的，它不保证可靠交付；TCP要提供可靠的，面向连接的运输服务。


(4) UDP用户数据报只有8个字节的首部开销，比TCP的20个字节的首部要少。


5. 简述XML在日常开发中的应用?使用XML有哪些优缺点?解析XML文档有哪几种方式?


(1) 用来作为一些配置文件，struts.ibatis,spring 等等。


(2) 作为数据的载体，比较在webservice，Ajax运用中都会用来传递一下数据。


a. 要求web客户机在两个或多个不同的数据库之间传递信息的应用。


b. 要求web客户机把同一数据以不同的表现方式提供给不同的用户应用。


优点：


a. XMl允许各种不同的专业开发和字节的特定领域有关的标记语言，这就使得该领域的人员交流


变得可行。


b. XmL具有良好的保值性(数据丢失主要原因是没有人写出如何读取历史数据的节制和文档格


式)。


c. 应用间交换数据。


解析的方法：


a.多数解析器提供了至少两种API，通常是一个对象模型API和一个事件API(也称为流API)


DOM / JDOM


b. 第二种是事件API，比如SAX，JAXP。


DOM和SAX的区别:


(1) DOM 文档对象类型。 为XML文档的已解析版本定义了一组接口。解析器读入整个文档，然


后构建一个驻


内存的树结构，然后代码就可以使用DOM接口来***作这个树结构。


优点：整个文档树在内存中，便于***作； 支持修改，删除，和重新排等多种***作。


缺点：将整个文档调入内存(包括无用的节点)，浪费时间和空间。


使用场合： 一旦解析了文档还需要多次访问这些数据；硬件资源充足(内存，CPU等)。


(2) 为解决DOM的问题出现了SAX； 事件驱动型，当解析器发现元素开始，元素结束，时发事


件，响应事件。


优点： 不用事先加载整个文档，占用资源少；


缺点： 不是持久的；事件过后，若没有保存数据，那么数据就丢了。


无状态行： 从时间汇总只能得到文本，但不知道该文本属于哪个元素。


使用场合: 只需要XML文档的少量类容，很少回头访问；机器内存少。


6. servlet的生命周期


Servlet被服务器实例化后，容器运行其init方法，请求到达时运行其service方法，service方法


自动派遣运行与请求对


应的doXXX方法（doGet，doPost）等，当服务器决定将实例销毁的时候调用其destroy方


法。


8.什么是WebService


(1) Web Services是由企业发布的完成其特定商务需求的在线应用服务,其他公司或应用软件能


够通过Internet来访问并使用这项在线服务,


它是一种构建应用程序的普遍模型,可以在任何支持网络通信的***作系统中实施运行;


它是一种新的web应用程序分支，是自包含、自描述、模块化的应用，可以发布、定位、通过


web调用。


(2)Web Service是一个应用组件,它逻辑性的为其他应用程序提供数据与服务.各应用程序通过网


络协议和规定的一些标准数据格式（Http，XML，Soap)来访问Web Service,通过Web


Service内部执行得到所需结果.


Web Service可以执行从简单的请求到复杂商务处理的任何功能。一旦部署以后，其他Web


Service应用程序可以发现并调用它部署的服务。


在构建和使用Web Service时,主要用到以下几个关键的技术和规则:


1.XML:描述数据的标准方法.


2.SOAP:表示信息交换的协议.


3.WSDL:Web服务描述语言.


4.UDDI:找到服务驱动器的的方法;


WebService的主要目标是跨平台的可互***作性。


为了达到这一目标，WebService完全基于XML（可扩展标记语言）、XSD（XMLSchema）等


独立于平台、独立于软件供应商的标准，是创建可互***作的、分布式应用程序的新平台。


9. Hibernate中get()和load()区别


1.从返回结果上对比load方式检索不到的话会抛出org.hibernate.ObjectNotFoundException


异常；get方法检索不到的话会返回null


2.hibernate对于load方法认为该数据在数据库中一定存在，可以放心的使用***来延迟加载，如


果在使用过程中发现了问题，只能抛异常；


而对于get方法，hibernate一定要获取到真实的数据，否则返回null。


10 将123 转换成321的编程


int num1 = 123,num2 = 0;


int tmp = 100;


while(num1 != 0)


{


num2 += num1 %10 * tmp;


后面求个位和十位 相加即可。


}


11. Hibernate 有几级缓存，各有什么用？


有两级缓存，作用如下：


a. 减少数据库的反复问频率，提高访问性能。


b. 保证缓存中的对象和数据库中同步，位于缓存中的对象称为持久化对象。


c. 当持久化对象之间存在关联时，Session保证不出现对象图的死锁。


12. 当有百万用户来访问一个网站时，用什么来优化? 请描述。


a. 考虑使用服务器负载均衡。


b. 存储设备可以使用服务器集群。


c. 尽量避免使用MS SQL server.


13. 序列化有什么用?


系列化是一种用来处理对象流的机制， 所谓对象流也就是将对象的内容进行流化。可以对流化


后的对象那个进行读写***作。


也可以将流化后的对象传输与网络之间。 序列化解决了对象流进行读写***作时引发的问题。


17 Struts1.* 和Struts2.*的区别。


a. 在Action实现类方面: Struts1要求Action继承一个抽象基类；struts2可以实现一个Action接


口，它也会提供一个ActionSupport基类实现接口。


b. 线程方面： Strtus1 Action是单例模式并且必须是线程安全，因为仅有Action的一个实例来


处理所有的请求。


Struts2 Action为每一个请求产生一个实例，因此没有线程安全问题。


3. Servlet依赖方面： struts1 Action依赖ServletAPI(因为struts1 Action的execute方法中有


request,response方法)


struts2 Action不再依赖Servlet API,从而允许Action脱离Web容器。


B+树是一个平衡的多叉树。B+树从根节点到叶子节点的搜索效率基本相当，不会出现大幅波


动。


哈希索引采用一定的哈希算法，把键值换成新的哈希值，检索时不需要类似B+树那样从根节点


逐级查找，只需一次哈希算法即可立刻定位到相应的位置。


两者的区别：


哈希索引的优势：


（1）等值查询。哈希索引具有绝对优势（前提是：没有大量重复键值，如果大量重复键值时，


哈希索引的效率很低，因为存在所谓的哈希碰撞问题。）


哈希索引不适用的场景：


（1）不支持范围查询


（2）不支持索引完成排序


（3）不支持联合索引的最左前缀匹配规则


MySQL中，只有HEAP/MEMORY引擎才显示支持哈希索引。而常用的InnoDB引擎中默认使用


的是B+树索引，它会实时监控表上索引的使用情况，如果认为建立哈希索引可以提高查询效


率，则自动在内存中的“自适应哈希索引缓冲区”建立哈希索引（在InnoDB中默认开启自适应


哈希索引），通过观察搜索模式，MySQL会利用index key的前缀建立哈希索引，如果一个表几


乎大部分都在缓冲池中，那么建立一个哈希索引能够加快等值查询。


注意：在某些工作负载下，通过哈希索引查找带来的性能提升远大于额外的监控索引搜索情况和


保持这个哈希表结构所带来的开销。但某些时候，在负载高的情况下，自适应哈希索引中添加的


read/write锁也会带来竞争，比如高并发的join***作。like***作和%的通配符***作也不适用于


自适应哈希索引，可能要关闭自适应哈希索引。


链表排序（快排）


*/


import java.util.*;


public class Solution {


public ListNode sortList(ListNode head) {


if(head==null)


return null;


quickSort(head,null);


return head;


}


public void quickSort(ListNode head,ListNode end){


if(head==null || head==end)


return ;


ListNode curNode=partition(head,end);


quickSort(head,curNode);


quickSort(curNode.next,end);


}


public ListNode partition(ListNode head,ListNode end){


ListNode cur=head;//从head到cur小于目标值得，cur到nextNode大于目标值


ListNode nextNode=head.next;


int target=head.val;


while(nextNode!=end){//交换，cur得下一个指针与nextNode值交换，因为cur对应的值肯定


小于目标值


if(nextNode.val<target){


cur=cur.next;


int t=cur.val;


cur.val=nextNode.val;


nextNode.val=t;


}


nextNode=nextNode.next;//cur不动，nextNode移动，所以cur到nextNode中间的值都大


于目标值


}


if(cur!=head){//如果cur位置改变了，交换目标值与cur对应的值


int t=cur.val;


cur.val=target;


head.val=t;


}


return cur;


}


}


排他锁（Exclusive Lock）


排他锁（Exclusive Lock）,  简称X锁。


若事务T对数据对象A加上X锁，则只允许T读取和修改A，其他任何事务都不能再对A加任何类型


的锁，直到T释放A上的锁。这就保证了其他事务在T释放A上的锁之前不能再读取和修改A。


规则1：写一个数据之前加X锁， 事务提交之后释放该X锁。


共享锁(Share lock)


共享锁(Share lock) ，简称S锁， 这个锁和之前的排他锁X锁有区别， 主要用于读取数据。


如果一个数据加了X锁， 就没法加S锁，没法再加X锁。


如果一个数据加了S锁， 就可以加S锁，没法再加X锁。


规则1：读一个数据之前加S锁， 读完之后立刻释放该S锁。


规则2：读一个数据之前加S锁， 事务提交之后立刻释放该S锁。


1、锁的两种分类方式


（1）从数据库系统的角度来看，锁分为以下三种类型：


独占锁（Exclusive Lock）


独占锁锁定的资源只允许进行锁定***作的程序使用，其它任何对它的***作均不会被接受。执行


数据更新命令，即INSERT、 UPDATE 或DELETE 命令时，SQL Server 会自动使用独占锁。但


当对象上有其它锁存在时，无法对其加独占锁。独占锁一直到事务结束才能被释放。


共享锁（Shared Lock）


共享锁锁定的资源可以被其它用户读取，但其它用户不能修改它。在SELECT 命令执行时，SQL


Server 通常会对对象进行共享锁锁定。通常加共享锁的数据页被读取完毕后，共享锁就会立即


被释放。


更新锁（Update Lock）


更新锁是为了防止死锁而设立的。当SQL Server 准备更新数据时，它首先对数据对象作更新锁


锁定，这样数据将不能被修改，但可以读取。等到SQL Server 确定要进行更新数据***作时，它


会自动将更新锁换为独占锁。但当对象上有其它锁存在时，无法对其作更新锁锁定。


（2）从程序员的角度看，锁分为以下两种类型：


悲观锁（Pessimistic Lock）


悲观锁，正如其名，它指的是对数据被外界（包括本系统当前的其他事务，以及来自外部系统的


事务处理）修改持保守态度，因此在整个数据处理过程中，将数据处于锁定状态。悲观锁的实


现，往往依靠数据库提供的锁机制（也只有数据库层提供的锁机制才能真正保证数据访问的排他


性，否则，即使在本系统中实现了加锁机制，也无法保证外部系统不会修改数据）。


乐观锁（Optimistic Lock）


相对悲观锁而言，乐观锁机制采取了更加宽松的加锁机制。悲观锁大多数情况下依靠数据库的锁


机制实现，以保证***作最大程度的独占性。但随之而来的就是数据库性能的大量开销，特别是


对长事务而言，这样的开销往往无法承受。


而乐观锁机制在一定程度上解决了这个问题。乐观锁，大多是基于数据版本（ Version ）记录


机制实现。何谓数据版本？即为数据增加一个版本标识，在基于数据库表的版本解决方案中，一


般是通过为数据库表增加一个 “version” 字段来实现。读取出数据时，将此版本号一同读


出，之后更新时，对此版本号加一。此时，将提交数据的版本数据与数据库表对应记录的当前版


本信息进行比对，如果提交的数据版本号大于数据库表当前版本号，则予以更新，否则认为是过


期数据。


在乐观锁中，我们有3种常用的做法来实现：


a. 在数据取得的时候把整个数据都copy到应用中，在进行提交的时候比对当前数据库中的数据


和开始的时候更新前取得的数据。


当发现两个数据一模一样以后，就表示没有冲突可以提交，否则则是并发冲突，需要去用业务逻


辑进行解决。


b. 版本戳：乐观锁的做法就是采用版本戳，这个在hibernate中得到了使用。


采用版本戳的话，首先需要在你有乐观锁的数据库table上建立一个新的column，比如为


number型，当你数据每更新一次的时候，版本数就会往上增加1。


比如同样有2个session同样对某条数据进行***作。两者都取到当前的数据的版本号为1，当第


一个session进行数据更新后，在提交的时候查看到当前数据的版本还为1，和自己一开始取到


的版本相同。就正式提交，然后把版本号增加1，这个时候当前数据的版本为2。当第二个


session也更新了数据提交的时候，发现数据库中版本为2，和一开始这个session取到的版本号


不一致，就知道别人更新过此条数据，这个时候再进行业务处理，比如整个Transaction都


Rollback等等***作。


在用版本戳的时候，可以在应用程序侧使用版本戳的验证，也可以在数据库侧采用Trigger(触发


器)来进行验证。不过数据库的Trigger的性能开销还是比较的大，所以能在应用侧进行验证的话


还是推荐不用Trigger。


c. 时间戳：第三种做法和第二种做法有点类似，就是也新增一个Table的Column，不过这次这


个column是采用timestamp型，存储数据最后更新的时间。


在Oracle9i以后可以采用新的数据类型，也就是timestamp with time zone类型来做时间戳。


这种Timestamp的数据精度在Oracle的时间类型中是最高的，精确到微秒(还没与到纳秒的级


别)，一般来说，加上数据库处理时间和人的思考动作时间，微秒级别是非常非常够了，其实只


要精确到毫秒甚至秒都应该没有什么问题。


和刚才的版本戳类似，也是在更新提交的时候检查当前数据库中数据的时间戳和自己更新前取到


的时间戳进行对比，如果一致则OK，否则就是版本冲突。如果不想把代码写在程序中或者由于


别的原因无法把代码写在现有的程序中，也可以把这个时间戳乐观锁逻辑写在Trigger或者存储


过程中。


**如下代码，执行test()函数后，屏幕打印结果为（）_计算机-Java专项练习_牛客网**


**笔记本：** 面试


**创建时间：** 2021/8/31 16:17 **更新时间：** 2022/6/7 15:48


如下代码，执行test()函数后，屏幕打印结果为（）


```
 1

 2

 3

 4

 5

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

```

```
public class Test2

{

  public void add(Byte b)

  {

    b = b++;

  }

  public void test()

  {

    Byte a = 127;

    Byte b = 127;

    add(++a);

    System.out.print(a + " ");

    add(b);

    System.out.print(b + "");

  }

}

```


正确答案: D  你的答案: B (错误)

```
 127 127

 128 127

 129 128

 以上都不对

```

推荐


答案：D


public void add(Byte b){ b=b++; } 这里涉及java的自动装包/自动拆包(AutoBoxing/UnBoxing) Byte的首字母为大写，是类


函数内实现++操作，会自动拆包成byte值传递类型，所以add函数还是不能实现自增功能。也就是说add函数只是个摆设，


小为-128~127之间。 add(++a);这里++a会越界，a的值变为-128 add(b); 前面说了，add不起任何作用，b还是127。


更多回答(134条)


<img src="/img/Java面试.pdf-36-0.png">

**包装类的值都是final 不可变的** ，对于++b 或者b++ ，只是新创建了一个对象，然后把引用传给了原对象句柄，在函数中操


了指向，实参的句柄还是指向原来的对象。所以即使不是b = b++ 这种，b的值在add之后也是不会变的。


该题的详细分析可参见博客：http://www.cnblogs.com/nailperry/p/4780354.html


这里简单说明两点：


1.b = b++;这一操作并未改变b的值，原因详见http://blog.csdn.net/lm2302293/article/details/6713147；


2.++a先是触发拆箱操作Byte.byteValue，得到基本类型的值127，然后执行+1操作，使得值变为-128，最后触发装箱操作


Byte对象赋值给a。


下面通过反编译得到字节码详细说明++a的执行过程：



<img src="/img/Java面试.pdf-36-1.png">
```
 1

 2

 3

 4

 5

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

21

22

23

24

```

```
// 源代码

public static void main(String[] args) {

  Byte a = 127;

  ++a;

}
// 字节码

public static void main(java.lang.String[]);

  Code:

    0: bipush    127 // 将一个 byte 型常量值推送至操作数栈栈顶
    2: invokestatic #2 // 自动装箱：访问栈顶元素，作为函数实参传入静态方法 Byte.valueOf(byt
               // 返回 value 值为 127 的 Byte 对象的地址，并压栈
    5: astore_1     // 将栈顶数值赋值给局部变量表中下标为 1 的引用型局部变量 a ，栈顶数值出
    6: aload_1      // 局部变量表中下标为 1 的引用型局部变量 a 进栈
    7: invokevirtual #3 // 自动拆箱，访问栈顶元素 a ，调用实例方法 a.byteValue 获取 a 所指 Byte
               // 对象的 value 值，并压栈

   10: iconst_1     // int 型常量值 1 进栈
   11: iadd       // 依次弹出栈顶两 int 型数值 1(0000 0001) 、 127(0111 1111)
               // （ byte 类型自动转型为 int 类型）相加，并将结果 128(1000 0000) 进栈
   12: i2b        // 栈顶 int 值 128(1000 0000) 出栈，强转成 byte 值 -128(1000 0000) ，并且结
   13: invokestatic #2 // 自动装箱：访问栈顶元素，作为函数实参传入静态方法 Byte.valueOf(byt
               // 返回 value 值为 -128 的 Byte 对象的地址，并压栈
   16: astore_1     // 将栈顶数值赋值给局部变量表中下标为 1 的引用型局部变量 a ，栈顶数值出

   17: return

```

```
}

```

**Java服务端如何防止订单重复支付**


**笔记本：** 面试


**创建时间：** 2021/11/16 16:14 **更新时间：** 2021/11/16 16:16


**作者：** 彼岸樱速

### **Java服务端如何防止订单重复支付**


**概述**


如图是一个简化的下单流程，首先是提交订单，然后是支付。


支付的话，一般是走支付网关（支付中心），然后支付中心与第三方支付渠道（微信、支付宝、


银联）交互。


支付成功以后，异步通知支付中心，支付中心更新自身支付订单状态，再通知业务应用，各业务


再更新各自订单状态。


这个过程中经常可能遇到的问题是掉单，无论是超时未收到回调通知也好，还是程序自身报错也


好。


总之由于各种各样的原因，没有如期收到通知并正确的处理后续逻辑等等，都会造成用户支付成


功了，但是服务端这边订单状态没更新。


这个时候有可能产生投诉，或者用户重复支付。


由于③⑤造成的掉单称之为外部掉单，由④⑥造成的掉单我们称之为内部掉单


**为了防止掉单，这里可以这样处理：**


1、支付订单增加一个中间状态“支付中”，当同一个订单去支付的时候，先检查有没有状态为“支


付中”的支付流水，当然支付（prepay）的时候要加个锁。支付完成以后更新支付流水状态的时


候再讲其改成“支付成功”状态。


2、支付中心这边要自己定义一个超时时间（比如：30秒），在此时间范围内如果没有收到支付


成功回调，则应调用接口主动查询支付结果，比如10s、20s、30s查一次，如果在最大查询次数


内没有查到结果，应做异常处理



<img src="/img/Java面试.pdf-38-0.png">
3、支付中心收到支付结果以后，将结果同步给业务系统，可以发MQ，也可以直接调用，直接调


用的话要加重试（比如：SpringBoot Retry）


4、无论是支付中心，还是业务应用，在接收支付结果通知时都要考虑接口幂等性，消息只处理


一次，其余的忽略


5、业务应用也应做超时主动查询支付结果


对于上面说的超时主动查询可以在发起支付的时候将这些支付订单放到一张表中，用定时任务去


扫


**为了防止订单重复提交，可以这样处理：**


1、创建订单的时候，用订单信息计算一个哈希值，判断redis中是否有key，有则不允许重复提


交，没有则生成一个新key，放到redis中设置个过期时间，然后创建订单。


其实就是在一段时间内不可重复相同的操作


**附上微信支付最佳实践：**



<img src="/img/Java面试.pdf-39-0.png">39-0
**return a++;、return ++a; return a+1;**


**笔记本：** 面试


**创建时间：** 2021/10/17 17:46 **更新时间：** 2021/10/17 17:50


**作者：** 彼岸樱速












**b=b++;**


**笔记本：** 面试


**创建时间：** 2021/8/31 15:50 **更新时间：** 2021/8/31 16:22


答案：D
public void add(Byte b){ b=b++; } 这里涉及java的自动装包/自动拆包(AutoBoxing/UnBoxing) Byte的首字母为
大写，是类，看似是引用传递，但是在add函数内实现++操作，会自动拆包成byte值传递类型，所以add函数
还是不能实现自增功能。也就是说add函数只是个摆设，没有任何作用。 Byte类型值大小为-128~127之间。
add(++a);这里++a会越界，a的值变为-128 add(b); 前面说了，add不起任何作用，b还是127



<img src="/img/Java面试.pdf-41-0.png">

<img src="/img/Java面试.pdf-41-1.png">
**一道int和Integer比较的面试题**


**笔记本：** 面试


**创建时间：** 2021/8/24 16:43 **更新时间：** 2021/8/24 17:02


**作者：** 彼岸樱速


**代码如下**


Integer s=new Integer(9);


Integer t=new Integer(9);


Long u=new Long(9);


Which test would return true?


**正确答案: C D E**

```
 A (s==u)

 B (s==t)

 C (s.equals(t))

 D (s.equals(9))

 E (s.equals(new Integer(9))

```


<img src="/img/Java面试.pdf-42-0.png">

<img src="/img/Java面试.pdf-42-1.png">


