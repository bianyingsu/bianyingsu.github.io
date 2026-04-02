---
aliases:
  - java-base
标题: java-base
---
**try中return A，catch中return B，finally中return C，最终返回值是什么？_try中return a,catch中**
**return b,finally中return c,最终返回值-CSDN博客**


**笔记本：** Java基础


**创建时间：** 2025/7/22 15:26


**URL：** https://blog.csdn.net/2202_75439262/article/details/146973045

## **try中return A，catch中return B，finally中return C，最终**


[寒992](https://blog.csdn.net/2202_75439262) 于 2025-04-03 09:55:32 发布 阅读量204 收藏 点赞数
1


文章标签： [c语言](https://so.csdn.net/so/search/s.do?q=c%E8%AF%AD%E8%A8%80&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [java](https://so.csdn.net/so/search/s.do?q=java&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [开发语言](https://so.csdn.net/so/search/s.do?q=%E5%BC%80%E5%8F%91%E8%AF%AD%E8%A8%80&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art)



最终的返回值将会是 **`java`** C！


因为finally块总是在try和catch块之后执行，无论是否有异常发生。如果finally块中有一个return语句，它将覆盖



<img src="/java-base.pdf-0-0.png">





所以在这种情况下，无论try和catch块的执行情况如何，finally块中的return C;总是最后执行的语句，并且其返


还有关于try-catch-finally的一些问题：


对于下面代码最后的返回值是什么？



<img src="/java-base.pdf-0-1.png">




<img src="/java-base.pdf-1-0.png">









这个代码得到的结果是2，try-catch-finally的执行顺序是try->finally或者try-catch-finally，然后在执行每一个代码

然后再执行后面的代码块，然后再把之前暂存的结果返回回去。


所以以上代码，会先把i++即2的结果暂存，然后执行i=100，接着再把2返回。


但是如果在finally中还有一个return，就会返回100了。


**所以，如果finally块中有return语句，则其返回值将是整个try-catch-finally结构的返回值。如果finally块中没**

**执行了）将确定最终的返回值。**


**@SuppressWarnings(“serial“)注解**


**笔记本：** Java基础


**创建时间：** 2024/6/4 16:43 **更新时间：** 2024/6/4 16:47

## **@SuppressWarnings(“serial“)注解**


**一、@SuppressWarnings**


J2SE 提供的一个批注或者注解。该批注的作用是给编译器一条指令，告诉它对被批注的代码元


素内部的某些警告保持静默，即忽略这些警告信息。 在平常的编码过程中，我们经常使用到的


是unchecked,serial这些。

@SuppressWarnings()中可传入一个字符串数组，数组中列出需要忽略的情况。 如果传入多种

情况，这几种情况的处理同时执行。


例如：



<img src="/java-base.pdf-2-0.png">



若是只忽略一种情况的话，就可以写成这样



<img src="/java-base.pdf-2-1.png">



以下是主要的几种情况：

|关键字|用途|
|---|---|
|deprecation|使用了已过时或者不推荐使用的类或方法时的警告|
|unchecked|执行了未检查的转换时的警告，例如当使用集合时没有用泛型 (Generics)来指定集合<br>保存的类型|
|fallthrough|当 Switch程序块直接通往下一种情况而没有 Break时的警告|
|path|在类路径、源文件路径等中有不存在的路径时的警告|
|serial|当在可序列化的类上缺少 serialVersionUID定义时的警告|
|all|关于以上所有情况的警告|



**二、解释**


简介：java.lang.SuppressWarnings是J2SE 5.0中标准的Annotation之一。可以标注在类、字

段、方法、参数、构造方法，以及局部变量上。


作用：告诉编译器忽略指定的警告，不用在编译完成后出现警告信息。


使用：





根据sun的官方文档描述：


value - 将由编译器在注释的元素中取消显示的警告集。允许使用重复的名称。忽略第二个和后


面出现的名称。出现未被识别的警告名不是 错误：编译器必须忽略无法识别的所有警告名。但


如果某个注释包含未被识别的警告名，那么编译器可以随意发出一个警告。


各编译器供应商应该将它们所支持的警告名连同注释类型一起记录。鼓励各供应商之间相互合


作，确保在多个编译器中使用相同的名称。


示例：


**@SuppressWarnings("unchecked") :** 告诉编译器忽略 unchecked 警告信息，如使用List，

ArrayList等未进行参数化产生的警告信息。
**@SuppressWarnings("serial"):** 如果编译器出现这样的警告信息：The serializable class


WmailCalendar does not declare a static final serialVersionUID field of type long，


**@SuppressWarnings("deprecation")：** 如果使用了使用@Deprecated注释的方法，编译器将

出现警告信息。


**@SuppressWarnings(value={"unchecked", "deprecation"})：** 告诉编译器同时忽略

unchecked和deprecation的警告信息，使用这个注释将警告信息去掉。。


**@SuppressWarnings(value={"unchecked", "deprecation"}) ：** 等同于


@SuppressWarnings("unchecked", "deprecation")


**Java强、软、弱、虚四大引用（附代码示例）**


**笔记本：** Java基础


**创建时间：** 2024/5/2 17:02 **更新时间：** 2024/5/2 17:15


**URL：** about:blank

## **Java强、软、弱、虚四大引用（附代码示例）**


**一. 整体架构**


**Reference: 强引用**


**SoftReference: 软引用**


**WeakReference: 弱引用**


**PhantomReference: 虚引用**


**二. 强引用**


**概念**


**当内存不足，JVM开始垃圾回收，对于强引用的对象，就算是出现了OOM也不会对该对象**


**进行回收，死都不收。**


强引用是我们最常见的普通对象引用，只要还有强引用指向一个对象，就能表明对象还“活


着”，垃圾收集器不会碰这种对象。在 Java中最常见的就是强引用，把一个对象赋给一个引用变


量，这个引用变量就是一个强引用。当一个对象被强引用变量引用时，它处于可达状态，它是不


可能被垃圾回收机制回收的， **即使该对象以后永远都不会被用到JVM也不会回收。** 因此强引用


是造成Java内存泄漏的主要原因之一。


对于一个普通的对象，如果没有其他的引用关系，只要超过了引用的作用域或者显式地将

相应（强）引用赋值为 null，一般认为就是可以被垃圾收集的了(当然具体回收时机还是要看垃

圾收集策略)。


**代码示例**


myObjct对象创建时默认被强引用指向，GC后不会被回收；后将其置为null，可被回收



<img src="/java-base.pdf-4-0.png">

<img src="/java-base.pdf-4-1.png">
**三. 软引用**


**概念**


软引用是一种相对强引用弱化了一些的引用，需要用java.lang.ref.SoftReference类来实

现，可以让对象豁免一些垃圾收集。 **对于只有软引用的对象来说，当系统内存充足时它不会被回**


**收，当系统内存不足时它会被回收。**


软引用通常用在对内存敏感的程序中，比如高速缓存就有用到软引用，内存够用的时候就


保留，不够用就回收！


**应用场景**


假如有一个应用需要读取大量的本地图片: 如果每次读取图片都从硬盘读取则会严重影响性


能, 如果一次性全部加载到内存中又可能造成内存溢出。


此时使用软引用可以解决这个问题。设计思路是：用一个HashMap来保存图片的路径和相

应图片对象关联的软引用之间的映射关系，在内存不足时，JVM会自动回收这些缓存图片对象所

占用的空间，从而有效地避免了 **OOM** 的问题。 Map`<`String, SoftReference`<`Bitmap`>` `>`


imageCache = new HashMap`<`String, SoftReference`<`Bitmap`>` `>`()


**代码示例**


执行前，设置参数-Xms10m -Xmx10m，保证内存空间不足。


sofeReference对象被设为软引用，当内存空间够用时，GC后不被回收。因空间被设为


10m,现创建一个9m的对象导致内存空间不足，此时sofeReference被回收



<img src="/java-base.pdf-5-1.png">

<img src="/java-base.pdf-5-2.png">

<img src="/java-base.pdf-5-3.png">
<img src="/java-base.pdf-6-0.png">

**四. 弱引用**


**概念**


弱引用需要用java.lang.ref.WeakReference类来实现，它比软引用的生存期更短， **对于只**
**有弱引用的对象来说，只要垃圾回收机制一运行，不管JVM的内存空间是否足够，都会回收该**


**对象占用的内存。**


**代码示例**


weakReference对象被设为弱引用，一经GC就被回收


**四. 虚引用**


**概念**


虚引用需要java.lang.ref.PhantomReference类来实现。顾名思义，就是形同虚设，与其他

几种引用都不同，虚引用并不会决定对象的生命周期。


**如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回**

**收器回收** ，它不能单独使用也不能通过它访问对象， **虚引用必须和引用队列 (ReferenceQueue)**

**联合使用** 。虚引用的主要作用是跟踪对象被 **垃圾回收** 的状态。 仅仅是提供了一种确保对象被

finalize以后，做某些事情的机制。 **PhantomReference的get方法总是返回null，因此无法访问**

**对应的引用对象。**


其意义在于：说明一个对象已经进入finalization阶段，可以被gc回收，用来实现比

finalization机制更灵活的回收操作。换句话说，设置虚引用关联的唯一目的，就是在这个对象被


收集器回收的时候收到一个系统通知或者后续添加进一步的处理。


**代码示例**



<img src="/java-base.pdf-6-1.png">

<img src="/java-base.pdf-6-2.png">

<img src="/java-base.pdf-6-3.png">
phantomReference对象被设为虚引用，同样在执行前设置参数-Xms10m -Xmx10m，保证

内存空间不足。模拟内存空间不足的情况，使得phantomReference对象被回收，当虚引用对象

被回收后会进入ReferenceQueue中



<img src="/java-base.pdf-7-0.png">





<img src="/java-base.pdf-7-1.png">
**for循环执行顺序**


**笔记本：** Java基础


**创建时间：** 2024/3/11 15:12 **更新时间：** 2024/3/11 15:17


**作者：** 彼岸樱速


for循环的执行顺序用如下表达式：
for(expression1; expression2; expression3) {
expression4;
}


执行的顺序应该是：
1）第一次循环，即初始化循环。 首先执行表达式expression1（一般为初始化语句）；再执行
expression2（一般为条件判断语句），判断expression1是否符合expression2的条件；如果
符合，则执行expression4，否则，停止执行；最后执行expression3。
2）第N（N>=2）次循环 首先执行expression2，判断在expression3是否符合在expression2
要求；如果符合，则继续执行在expression4，否则，停止执行。最后执行在expression3。如
此往复，直至expression3不满足在expression2条件是为止。


总结： 总的来说，执行的顺序是一致的。先条件判断（expression2），再函数体执行
（expression4），最后for执行（expression3）。往复......区别在于，条件判断的对象。第一
次判断时，对象为初始化语句（expression1），后续的判断对象为执行后的结果
（expression3）。


带一道Java面试题



<img src="/java-base.pdf-8-0.png">



<img src="/java-base.pdf-8-1.png">




**Java中正则表达式**


**笔记本：** Java基础


**创建时间：** 2023/12/23 3:40 **更新时间：** 2023/12/23 3:41
# Java 中正则表达式
### **一、概念**

正则表达式，又称规则表达式 **。** （英语： Regular Expression ，在代码中常简写为 regex 、

regexp 或 RE ），计算机科学的一个概念。正则表达式通常被用来检索、替换那些符合某个模式

( 规则 ) 的文本。在众多语言中都可以支持正则表达式，如 Perl 、 PHP 、 Java 、 Python 、 Ruby 等。

当然在 Java 中也可以通过处理字符串的方式达到检索，替换文本字符串的目的，但是有了正则表


达式写代码更加简洁，通常两三行代码就可以达到目的，当然这也是建立在熟悉正则表达式的基


础之上的。

### **二、正则表达式的规则**


1. 任意一个字符表示匹配任意对应的字符，如 a 匹配 a ， 7 匹配 7 ， ~~-~~ 匹配 ~~-~~ 。

2. [] 代表匹配中括号中其中任一个字符，如 [abc] 匹配 a 或 b 或 c 。

b]



3. ~~-~~ 在中括号里面和外面代表含义不同，如在外时，就匹配 ~~-~~ ，如果在中括号内 [a ~~-~~ b] 表示匹配 26

9]



个小写字母中的任一个； [a ~~-~~ zA ~~-~~ Z] 匹配大小写共 52 个字母中任一个； [0 ~~-~~ 9] 匹配十个数字中任一


个。

9]



4. ^ 在中括号里面和外面含义不同，如在外时，就表示开头，如 ^7[0 ~~-~~ 9] 表示匹配开头是 7 的，且


第二位是任一数字的字符串；如果在中括号里面，表示除了这个字符之外的任意字符 ( 包括数

字，特殊字符 ) ，如 [^abc] 表示匹配出去 abc 之外的其他任一字符。


5. . 表示匹配任意的字符。

6. /d 表示数字。

7. /D 表示非数字。

8. /s 表示由空字符组成， [ /t/n/r/x/f] 。

9. /S 表示由非空字符组成， [^/s] 。

10. /w 表示字母、数字、下划线， [a ~~-~~ zA ~~-~~ Z0 ~~-~~ 9_] 。

11. /W 表示不是由字母、数字、下划线组成。

?:



12. ?: 表示出现 0 次或 1 次。


13. + 表示出现 1 次或多次。


14. - 表示出现 0 次、 1 次或多次。

15. {n} 表示出现 n 次。


16. {n,m} 表示出现 n~m 次。

17. {n,} 表示出现 n 次或 n 次以上。


18. XY 表示 X 后面跟着 Y ，这里 X 和 Y 分别是正则表达式的一部分。

19. X|Y 表示 X 或 Y ，比如 "food|f" 匹配的是 foo （ d 或 f ），而 "(food)|f" 匹配的是 food 或 f 。

20. (X) 子表达式，将 X 看做是一个整体。
### 二、 Java 中如何写正则表达式

在 java 中调用正则表达式的类是 java.util.regex.Matcher 和 java.util.regex.Pattern ， java.util.regex 包


是从 jdk1.4 开始提供的。有多种写法来使用正则表达式。


1. 仅仅是匹配


1). 实现方式 1 ，匹配一个数字。



<img src="/java-base.pdf-10-19.png">



2). 实现方式 2, 匹配 3 个到 5 个字母，大小写不限，包括 3 和 5 个。

public void regex2() {


// 要匹配的字符

String str = "hello";


// 正则表达式

String regex = "[a ~~-~~ zA ~~-~~ Z]{3,5}";


// 输出匹配的结果, 此次匹配返回 true 。


}

3). 实现方式 3( 此种实现方式最快 ) ， 匹配 11 位的电话号码，匹配规则：第一个数字是 1 ，第二个


数字是 2,3,7,8 中任一个，后面 9 位数字中不包含 4 。


2. 替换。

public void regexReplace () {


// 要匹配的字符

String str = "12a6B985Ccv65";


// 正则表达式



<img src="/java-base.pdf-11-4.png">
String regex = "[a ~~-~~ zA ~~-~~ Z]+";


// 正则表达式

String regex2 = "//d+";


// 将字符串中英文字母替换为 & 符号，输出 12&6&985&65

// 将字符串中单个数字或者连续的数字替换为 0 ，输出 0a0B0Ccv0


}


3. 切割，根据大写字母切割字符串。



<img src="/java-base.pdf-12-13.png">


**Java对象序列化为什么要使用SerialversionUID**


**笔记本：** Java基础


**创建时间：** 2023/12/11 21:03 **更新时间：** 2023/12/11 21:07

## **Java对象序列化为什么要使用SerialversionUID**


**1、首先谈谈为什么要序列化对象**

```
 - 把对象转换为字节序列的过程称为对象的序列化。

 - 把字节序列恢复为对象的过程称为对象的反序列化。

```

对象的序列化主要有两种用途：


1） 把对象的字节序列永久地保存到硬盘上，通常存放在一个文件中；


2） 在网络上传送对象的字节序列。


在很多应用中，需要对某些对象进行序列化，让它们离开内存空间，入住物理硬盘，以便长期保存。


比如最常见的是Web服务器中的Session对象，当有 10万用户并发访问，就有可能出现10万个Session对象，


内存可能吃不消，于是Web容器就会把一些seesion先序列化到硬盘中，等要用了，再把保存在硬盘中的对象还


当两个进程在进行远程通信时，彼此可以发送各种类型的数据。


无论是何种类型的数据，都会以二进制序列的形式在网络上传送。


发送方需要把这个Java对象转换为字节序列，才能在网络上传送；接收方则需要把字节序列再恢复为Java对象


**2、为什么要使用SerialversionUID呢**


简单看一下 Serializable接口的说明

```
 If a serializable class does not explicitly declare a serialVersionUID,

 then the serialization runtime will calculate a default

 serialVersionUID value for that class based on various aspects of the class,

 as described in the Java(TM) Object Serialization Specification.

```

如果用户没有自己声明一个serialVersionUID,接口会默认生成一个serialVersionUID


However, it is _stronglyrecommended_ that all serializable classes explicitly declareserialVersionUID values,


since the default serialVersionUID computation is highly sensitive to class details that may vary depending


on compiler implementations, and can thus result in unexpected `InvalidClassException` s during deserialization.


但是强烈建议用户自定义一个serialVersionUID,因为默认的serialVersinUID对于class的细节非常敏感，


反序列化时可能会导致InvalidClassException这个异常。


e.g:1.使用默认的serialVersionUID


我们先建一个实体类Person 实现Serializable接口

```
 public class Person implements Serializable {

 private int age;

 private String name;

 private String sex;

 public int getAge() {

 return age;

 }

 public void setAge(int age) {

 this.age = age;

 }

 public String getName() {

```

```
 return name;

 }

 public void setName(String name) {

 this.name = name;

 }

 public String getSex() {

 return sex;

 }

 public void setSex(String sex) {

 this.sex = sex;

 }

 }

```

然后去序列化和反序列化它

```
 public class TestPersonSerialize {

 public static void main(String[] args) throws Exception {

 serializePerson();

 Person p = deserializePerson();

 System.out.println(p.getName()+";"+p.getAge());

 }

 private static void serializePerson() throws FileNotFoundException,IOException {

 Person person = new Person();

 person.setName(" 测试实例 ");

 person.setAge(25);

 person.setSex("male");

 ObjectOutputStream oo = new ObjectOutputStream(new FileOutputStream(

 new File("E:/person.txt")));

 oo.writeObject(person);

 System.out.println(" 序列化成功 ");

 oo.close();

 }

 private static Person deserializePerson() throws IOException, Exception {

 ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("E:/person.txt")));

 Person person = (Person) ois.readObject();

 System.out.println(" 反序列化成功 ");

 return person;

 }

 }

```

结果如图


e.g:2


如果我们先尽心序列化，然后在反序列化之前修改了Person类会怎样呢

```
 public class Person implements Serializable {

 private int age;

 private String name;

```


<img src="/java-base.pdf-14-0.png">14-0
```
 private String sex;

 private String address;

 public String getAddress() {

 return address;

 }

 public void setAddress(String address) {

 this.address = address;

 }

 public int getAge() {

 return age;

 }

 public void setAge(int age) {

 this.age = age;

 }

 public String getName() {

 return name;

 }

 public void setName(String name) {

 this.name = name;

 }

 public String getSex() {

 return sex;

 }

 public void setSex(String sex) {

 this.sex = sex;

 }

 }

```

运行结果


可以看到，当我们修改Person类的时候，Person类对应的SerialversionUID也变化了，


而序列化和反序列化就是通过对比其SerialversionUID来进行的，一旦SerialversionUID不匹配，反序列化就无


在实际的生产环境中，我们可能会建一系列的中间Object来反序列化我们的pojo，


为了解决这个问题，我们就需要在实体类中自定义SerialversionUID。


e.g:3 在Person类中加入自定义SerialversionUID

```
 public class Person implements Serializable {

 private static final long serialVersionUID = -5809782578272943999L;

 private int age;

 private String name;

 private String sex;

 private String address;

 public String getAddress() {

 return address;

 }

```


<img src="/java-base.pdf-15-0.png">
```
 public void setAddress(String address) {

 this.address = address;

 }

 public int getAge() {

 return age;

 }

 public void setAge(int age) {

 this.age = age;

 }

 public String getName() {

 return name;

 }

 public void setName(String name) {

 this.name = name;

 }

 public String getSex() {

 return sex;

 }

 public void setSex(String sex) {

 this.sex = sex;

 }

 }

```

不管我们序列化之后如何更改我们的Person（不删除原有字段），最终都可以反序列化成功。


**java注解使用**


**笔记本：** Java基础


**创建时间：** 2023/12/11 20:41 **更新时间：** 2023/12/11 20:43

## java注解使用、java获取注解的属性、获取注解的字段 值


一、前言


1、前面一直讲注解的基础知识，注解的定义，对于注解的使用几乎是一笔略过，本篇将着重讲讲注解的使


用。 获取注解的属性，通过反射获取注解的属性值。


二、示例代码


1、定义一个注解，用于给 全局变量 field 字段 赋值


2、定义一个注解 。



<img src="/java-base.pdf-17-0.png">

<img src="/java-base.pdf-17-1.png">



3、创建一个普通的类，使用 @ConsAnnotation、@Fields 注解



<img src="/java-base.pdf-17-2.png">


```
 public String getUserName() {
 return userName;
 }
 public void setUserName(String userName) {
 this.userName = userName;
 }
 }

```

4、针对 com.haha.study.annotation.value.User 类使用注解的测试



<img src="/java-base.pdf-18-0.png">


**JAVA8之妙用Optional解决判断Null为空的问题**


**笔记本：** Java基础


**创建时间：** 2023/12/11 20:26 **更新时间：** 2023/12/11 20:29

## **JAVA8之妙用Optional解决判断Null为空的问题**

引言


在文章的开头，先说下NPE问题，NPE问题就是，


我们在开发中经常碰到的NullPointerException.假设我们有两个类，他们的UML类图如下图所示


在这种情况下，有如下代码

```
 user.getAddress().getProvince();

```

这种写法，在user为null时，是有可能报NullPointerException异常的。为了解决这个问题，于是采用下面的写法



<img src="/java-base.pdf-19-0.png">

<img src="/java-base.pdf-19-1.png">



这种写法是比较丑陋的，为了避免上述丑陋的写法，让丑陋的设计变得优雅。


JAVA8提供了Optional类来优化这种写法，接下来的正文部分进行详细说明


**API介绍**


先介绍一下API，与其他文章不同的是，本文采取类比的方式来讲，同时结合源码。


而不像其他文章一样，一个个API罗列出来，让人找不到重点。


1、Optional(T value),empty(),of(T value),ofNullable(T value)


这四个函数之间具有相关性，因此放在一组进行记忆。


先说明一下， `Optional(T value)` ，即构造函数，它是private权限的，不能由外部调用的。


其余三个函数是public权限，供我们所调用。


那么，Optional的本质，就是内部储存了一个真实的值，


在构造的时候，就直接判断其值是否为空。


好吧，这么说还是比较抽象。直接上 `Optional(T value)` 构造函数的源码，如下图所示


<img src="/java-base.pdf-20-0.png">

那么， **of(T value)** 的源码如下



<img src="/java-base.pdf-20-1.png">



也就是说of(T value)函数内部调用了构造函数。根据构造函数的源码我们可以得出两个结论:


通过 `of(T value)` 函数所构造出的Optional对象，当Value值为空时，依然会报NullPointerException。


通过 `of(T value)` 函数所构造出的Optional对象，当Value值不为空时，能正常构造Optional对象。


除此之外呢，Optional类内部还维护一个value为null的对象，大概就是长下面这样的



<img src="/java-base.pdf-20-2.png">





那么， `empty` `（）` 的作用就是返回EMPTY对象。


好了铺垫了这么多，可以说 `ofNullable(T value)` 的作用了，上源码



<img src="/java-base.pdf-20-3.png">





好吧，大家应该都看得懂什么意思了。相比较 `of(T value)` 的区别就是，


当value值为null时，of(T value)会报NullPointerException异常；


`ofNullable(T value)` 不会throw Exception， `ofNullable(T value)` 直接返回一个 `EMPTY` 对象。


那是不是意味着，我们在项目中只用 `ofNullable` 函数而不用of函数呢?


不是的，一个东西存在那么自然有存在的价值。


当我们在运行过程中，不想隐藏 `NullPointerException` 。


而是要立即报告，这种情况下就用Of函数。


但是不得不承认，这样的场景真的很少。


博主也仅在写junit测试用例中用到过此函数。


2、orElse(T other)，orElseGet(Supplier`<? extends T>` other)和orElseThrow(Supplier`<?` extends X> exceptio


这三个函数放一组进行记忆，都是在构造函数传入的value值为null时，进行调用的。


`orElse` 和 `orElseGet` 的用法如下所示，相当于value值为null时，给予一个默认值:



<img src="/java-base.pdf-21-0.png">



这两个函数的区别：当user值不为null时， `orElse` 函数依然会执行createUser()方法，


而 `orElseGet` 函数并不会执行createUser()方法，大家可自行测试。


至于orElseThrow，就是value值为null时,直接抛一个异常出去，用法如下所示





3、map(Function`<?` super T, `?` extends U`>` mapper)和flatMap(Function`<?` super T, Optional`<U>``>` mapper)


这两个函数放在一组记忆，这两个函数做的是转换值的操作。


直接上源码



<img src="/java-base.pdf-21-2.png">




```
 19 }20 }

```

这两个函数，在函数体上没什么区别。唯一区别的就是入参，


map函数所接受的入参类型为 `Function` `<?` super T, `?` extends U`>` ，


而flapMap的入参类型为 `Function` `<?` super T, Optional`<U>` `>` 。


在具体用法上，对于map而言：


如果User结构是下面这样的



<img src="/java-base.pdf-22-0.png">



这时候取name的写法如下所示

```
 String city = Optional .ofNullable(user).map(u- > u.getName()). get ();

```

对于flatMap而言:


如果User结构是下面这样的



<img src="/java-base.pdf-22-1.png">





这时候取name的写法如下所示

```
 String city = Optional .ofNullable(user).flatMap(u- > u.getName()). get ();

```

4、isPresent()和ifPresent(Consumer`<?` super T`>` consumer)


这两个函数放在一起记忆， `isPresent` 即判断value值是否为空，


而 `ifPresent` 就是在value值不为空时，做一些操作。这两个函数的源码如下



<img src="/java-base.pdf-22-2.png">





需要额外说明的是，大家千万不要把



<img src="/java-base.pdf-22-3.png">




给写成



<img src="/java-base.pdf-23-0.png">



因为这样写，代码结构依然丑陋。博主会在后面给出正确写法


至于 `ifPresent(Consumer`<?` super T`>` consumer)` ，用法也很简单，如下所示



<img src="/java-base.pdf-23-1.png">





5、filter(Predicate`<?` super T`>` predicate)


不多说，直接上源码



<img src="/java-base.pdf-23-2.png">23-2





filter 方法接受一个 `Predicate` 来对 `Optional` 中包含的值进行过滤，


如果包含的值满足条件，那么还是返回这个 Optional；否则返回 `Optional.empty` 。


用法如下

```
 Optional< User > user 1 = Optional .ofNullable(user).filter(u - > u.getName(). length () <6 );

```

如上所示，如果user的name的长度是小于6的，则返回。如果是大于6的，则返回一个EMPTY对象。


**实战使用**


例一


在函数方法中


以前写法



<img src="/java-base.pdf-23-3.png">





JAVA8写法




<img src="/java-base.pdf-24-0.png">







例二


比如，在主程序中


以前写法



<img src="/java-base.pdf-24-1.png">





JAVA8写法



<img src="/java-base.pdf-24-2.png">





例三


以前写法



<img src="/java-base.pdf-24-3.png">





java8写法



<img src="/java-base.pdf-24-4.png">





其他的例子，不一一列举了。不过采用这种链式编程，虽然代码优雅了。


但是，逻辑性没那么明显，可读性有所降低，大家项目中看情况酌情使用。


**BigDecimal中divide方法注意问题**


**笔记本：** Java基础


**创建时间：** 2023/12/11 19:31 **更新时间：** 2023/12/11 19:32

## **BigDecimal中divide方法注意问题**


**BigDecimal中divide方法抛异常:Non-terminating decimal expansion; no exact representable decim**


在使用

```
 BigDecimal rate = new BigDecimal(1).divide( new BigDecimal(3));

```

时抛异常:

```
 Non-terminating decimal expansion; no exact representable decimal result

```

原来是在做除法的时候出现了无限不循环小数如： `0.333333333333`


**解决方案**


在做做除法的时候指定保留的小数的位数:

```
 BigDecimal rate = new BigDecimal(1).divide( new BigDecimal(3), 6, BigDecimal.ROUND_HALF_UP);

```

**JDK和JRE的区别**


**笔记本：** Java基础


**创建时间：** 2021/8/5 0:17 **更新时间：** 2023/6/1 17:07


**作者：** 彼岸樱速


**JDK: Java Development Kit** 的简称，Java开发工具包，提供了 Java的开发环境和运行
环境。

- **JRE: Java Runtime Environment** 的简称，Java运行环境，为Java的运行提供了所需环
境。


具体来说JDK其实包含了 JRE,同时还包含了编译Java源码的编译器Javac,还包含了很多Java程序
调试和分析的工具。


简单来说：如果你需要运行Java程序,只需安装JRE就可以了,如果你需要编写 Java程序，需要安
装JDK。


一、JDK、JRE、JVM分别是什么
（一）JDK


JDK，全称Java Development Kit，是 Java 语言的软件开发工具包，主要用于移动设备、嵌入
式设备上的Java应用程序。JDK是整个Java开发的核心。


（二）JRE


JRE，全称Java Runtime Environment，是指Java的运行环境，是可以在其上运行、测试和传
输应用程序的Java平台。


（三）JVM


JVM，全称Java Virtual Machine（Java虚拟机），是一种用于计算设备的规范，它是一个虚构
出来的计算机，引入JVM后，Java语言在不同平台上运行时不需要重新编译。JVM是Java跨平
台的核心。


二、JDK、JRE、JVM之间的关系
JDK包含了Java的运行环境（即JRE）和Java工具。JRE包含了一个Java虚拟机（JVM）以及一
些标准的类别函数库。总的来说，JDK、JRE、JVM三者都处在一个包含关系内，JDK包含JRE，
而JRE又包含JVM。


具体地讲：


JDK = JRE + 开发工具集（例如Javac编译工具等）


JRE = JVM + Java SE标准类库


**Java SPI详解**


**笔记本：** Java基础


**创建时间：** 2022/11/25 15:25 **更新时间：** 2022/11/25 16:10


**作者：** 彼岸樱速

## **Java SPI详解**


**1.什么是SPI**


SPI全称Service Provider Interface，是Java提供的一套用来被第三方实现或者扩展的接口，


它可以用来启用框架扩展和替换组件。 SPI的作用就是为这些被扩展的API寻找服务实现。


SPI机制 (Service Provider Interface)其实源自服务提供者框架 (Service
ProviderFramework，参考[EffectiveJava] page6)，是一种将服务接口与服务实现分离以达到
解耦、大大提升了程序可扩展性的机制。引入服务提供者就是引入了spi接口的实现者，通过本
地的注册发现获取到具体的实现类，轻松可插拔


**2.SPI和API的使用场景**


API （Application Programming Interface）在大多数情况下，都是实现方制定接口并完成对

接口的实现，调用方仅仅依赖接口调用，且无权选择不同实现。 从使用人员上来说，API 直接


被应用开发人员使用。


SPI （Service Provider Interface）是调用方来制定接口规范，提供给外部来实现，调用方在


调用时则选择自己需要的外部实现。 从使用人员上来说，SPI 被框架扩展人员使用。


**3.SPI的简单实现**


下面我们来简单实现一个jdk的SPI的简单实现。


首先第一步，定义一组接口：


这个接口分别有两个实现：


然后需要在resources目录下新建META-INF/services目录，并且在这个目录下新建一个与上述接


口的全限定名一致的文件，在这个文件中写入接口的实现类的全限定名：



<img src="/java-base.pdf-27-1.png">

<img src="/java-base.pdf-27-2.png">
<img src="/java-base.pdf-28-0.png">

这时，通过serviceLoader加载实现类并调用：


输出如下：


这样一个简单的spi的demo就完成了。可以看到其中最为核心的就是通过ServiceLoader这个类
来加载具体的实现类的。


**4. SPI原理解析**


通过上面简单的demo，可以看到最关键的实现就是ServiceLoader这个类，可以看下这个类


的源码，如下：

```
public final class ServiceLoader`<`S`>` implements Iterable`<`S`>` {

```

`//` 扫描目录前缀
```
private static final String PREFIX = "META-INF/services/";

```

`//` 被加载的类或接口

```
private final Class<S> service;

```

//用于定位、加载和实例化实现方实现的类的类加载器

```
private final ClassLoader loader;

```

//上下文对象

```
private final AccessControlContext acc;

```

`//` 按照实例化的顺序缓存已经实例化的类
```
private LinkedHashMap<String, S> providers = new LinkedHashMap<>();

```

`//` 懒查找迭代器

```
private java.util.ServiceLoader.LazyIterator lookupIterator;

```

`//` 私有内部类，提供对所有的 `service` 的类的加载与实例化
```
private class LazyIterator implements Iterator`<`S`>` {
Class`<`S`>` service;
ClassLoader loader;

Enumeration`<`URL`>` configs = null;

String nextName = null;

//...
private boolean hasNextService() {
if (configs == null) {
try {
```

`//` 获取目录下所有的类
```
String fullName = PREFIX + service.getName();
if (loader == null)
configs = ClassLoader.getSystemResources(fullName);
else
configs = loader.getResources(fullName);
} catch (IOException x) {
//...

```


<img src="/java-base.pdf-28-1.png">

<img src="/java-base.pdf-28-2.png">
<img src="/java-base.pdf-29-0.png">

上面的代码只贴出了部分关键的实现，有兴趣的读者可以自己去研究，下面贴出比较直观的spi
加载的主要流程供参考：


**典型实例：jdbc的设计**
通常各大厂商（如Mysql、Oracle）会根据一个统一的规范(java.sql.Driver)开发各自的驱动实
现逻辑。客户端使用jdbc时不需要去改变代码，直接引入不同的spi接口服务即可。

<img src="/java-base.pdf-29-2.png">
Mysql的则是com.mysql.jdbc.Drive,Oracle则是oracle.jdbc.driver.OracleDriver。


**伪代码如下:**


**jdbc连接源码分析**


1. java.sql.DriverManager静态块初始执行，其中使用spi机制加载jdbc具体实现

```
//java.sql.DriverManager.java

```


<img src="/java-base.pdf-29-1.png">

<img src="/java-base.pdf-29-3.png">
<img src="/java-base.pdf-30-0.png">

2.loadInitialDrivers()中完成了引入的数据库驱动的查找以及载入，本示例只引入了oracle厂商
的mysql，我们具体看看。



<img src="/java-base.pdf-30-1.png">







3.java.util.ServiceLoader 加载spi实现类.上一步的核心代码如下，我们接着分析：


<img src="/java-base.pdf-31-0.png">



主要是通过ServiceLoader来完成的,我们按照执行顺序来看看ServiceLoader实现：


遍历所有存在的service实现

```
public S next() {
```

`if` `(acc ==` `null) {//` 用来判断 `serviceLoader` 对象是否完成初始化



<img src="/java-base.pdf-31-1.png">

<img src="/java-base.pdf-31-2.png">

<img src="/java-base.pdf-31-3.png">
<img src="/java-base.pdf-32-0.png">

上一步中，Sp = service.cast(c.newInstance()) 将会导致具体实现者的初始化，比如
mysqlJDBC，会触发如下代码：


4.最终Driver全部注册并初始化完毕，开始执行DriverManager.getConnection(url, “root”,
“root”)方法并返回。



<img src="/java-base.pdf-32-1.png">
**Java8中那些方便又实用的Map函数**


**笔记本：** Java基础


**创建时间：** 2022/11/17 9:58 **更新时间：** 2022/11/17 10:35


**作者：** 彼岸樱速


**简介**





**computeIfAbsent函数**


比如，很多时候我们需要对数据进行分组，变成Map<Integer, List`<?` `>` `>`的形式，在java8之
前，一般如下实现：

```
List`<`Payment`>` payments = getPayments();
Map`<`Integer, List`<`Payment`>` `>` paymentByTypeMap = new HashMap`<` `>`();
for(Payment payment : payments){
if(!paymentByTypeMap.containsKey(payment.getPayTypeId())){
paymentByTypeMap.put(payment.getPayTypeId(), new ArrayList`<` `>`());
}
paymentByTypeMap.get(payment.getPayTypeId())
.add(payment);
}

```

可以发现仅仅做一个分组操作，代码却需要考虑得比较细致，在Map中无相应值时需要先塞一
个空List进去。


但如果使用java8提供的 **computeIfAbsent** 方法，代码则会简化很多，如下：

```
List<Payment> payments = getPayments();
Map<Integer, List<Payment>> paymentByTypeMap = new HashMap<>();
for(Payment payment : payments){
paymentByTypeMap.computeIfAbsent(payment.getPayTypeId(), k -> new ArrayList<>())
.add(payment);
}

```

computeIfAbsent方法的逻辑是，如果map中没有(Absent)相应的key，则执行lambda表达式
生成一个默认值并放入map中并返回，否则返回map中已有的值。

**带默认值Map**


由于这种需要默认值的Map太常用了，我一般会封装一个工具类出来使用，如下：

```
public class DefaultHashMap`<`K, V`>` extends HashMap`<`K, V`>` {
Function`<`K, V`>` function;

public DefaultHashMap(Supplier`<`V`>` supplier) {
this.function = k -`>` supplier.get();
}

@Override
@SuppressWarnings("unchecked")
public V get(Object key) {
return super.computeIfAbsent((K) key, this.function);
}
}

```

然后再这么使用，如下：

```
List`<`Payment`>` payments = getPayments();
Map`<`Integer, List`<`Payment`>` `>` paymentByTypeMap = new DefaultHashMap`<` `>`(ArrayList::new);
for(Payment payment : payments){
paymentByTypeMap.get(payment.getPayTypeId())
.add(payment);
}

```

呵呵，这玩得有点像python的defaultdict(list)了😁


**临时Cache**


有时，在一个for循环中，需要一个临时的Cache在循环中复用查询结果，也可以使用
computeIfAbcent，如下：

```
List`<`Payment`>` payments = getPayments();
Map`<`Integer, PayType`>` payTypeCacheMap = new HashMap`<` `>`();
for(Payment payment : payments){
PayType payType = payTypeCacheMap.computeIfAbsent(payment.getPayTypeId(),
k -`>` payTypeMapper.queryByPayType(k));
payment.setPayTypeName(payType.getPayTypeName());
}

```

因为payments中不同payment的pay_type_id极有可能相同，使用此方法可以避免大量重复查
询，但如果不用computeIfAbcent函数，代码就有点繁琐晦涩了。


比如payType只有“支付宝”和“微信支付”两种类型，然后payments有10条数据，每条数据
的payType都不尽相同，然后如果for循环来查，就要查10次，其中可能“支付宝”查了6次，
“微信支付”查了4次。


通过这种方式就可以只查2次，避免了大量重复查询。


**computeIfPresent函数**


computeIfPresent函数与computeIfAbcent的逻辑是相反的，如果map中存在(Present)相应
的key，则对其value执行lambda表达式生成一个新值并放入map中并返回，否则返回null。


这个函数一般用在两个集合做等值关联的时候，可少写一次判断逻辑，如下：

```
@Data
public static class OrderPayment {
private Order order;
private List`<`Payment`>` payments;

public OrderPayment(Order order) {
this.order = order;
this.payments = new ArrayList`<` `>`();
}

public OrderPayment addPayment(Payment payment){
this.payments.add(payment);
return this;
}
}

public static void getOrderWithPayment(){
List`<` Order`>` orders = getOrders();
Map`<`Long, OrderPayment`>` orderPaymentMap = new HashMap<>();
for(Order order : orders){
orderPaymentMap.put(order.getOrderId(), new OrderPayment(order));
}
List`<`Payment`>` payments = getPayments();
```

`//` 将 `payment` 关联到相关的 `order` 上
```
for(Payment payment : payments){
orderPaymentMap.computeIfPresent(payment.getOrderId(),
(k, orderPayment) -`>` orderPayment.addPayment(payment));
}
}

```

从上面的例子可以看出，OrderPayment里面有order（订单信息）和payments（付款列表信

<img src="/java-base.pdf-34-0.png">
息）两个属性，getOrderWithPayment()方法就是要组装一个OrderPayment对象。





**compute函数**


compute函数，其实和computeIfPresent、computeIfAbcent函数是类似的，不过它不关心
map中到底有没有值，都执行lambda表达式计算新值并放入map中并返回。


这个函数适合做分组迭代计算，像分组汇总金额的情况，就适合使用compute函数，如下，就
是一个根据不同typeId来分组统计汇总金额的例子：

```
List`<`Payment`>` payments = getPayments();
Map`<`Integer, BigDecimal`>` amountByTypeMap = new HashMap`<` `>`();
for(Payment payment : payments){
amountByTypeMap.compute(payment.getPayTypeId(),
(key, oldVal) -`>` oldVal == null `?` payment.getAmount() :
oldVal.add(payment.getAmount())
);
}

```

当oldValue是null，表示map中第一次计算相应key的值，直接给amount就好，而后面再次累
积计算时，直接通过add函数汇总就好。


**merge函数**


可以发现，上面在使用compute汇总金额时，lambda表达式中需要判断是否是第一次计算key
值，稍微麻烦了点，而使用merge函数的话，可以进一步简化代码，如下：

```
List`<`Payment`>` payments = getPayments();
Map`<`Integer, BigDecimal`>` amountByTypeMap = new HashMap`<` `>`();
for(Payment payment : payments){
amountByTypeMap.merge(payment.getPayTypeId(), payment.getAmount(), BigDecimal::add);
}

```

这个函数太简洁了😄，merge的第一个参数是key，第二个参数是value，第三个参数是值合并
函数。


当是第一次计算相应key的值时，直接放入value到map中，后面再次计算时，使用值合并函数
BigDecimal::add计算出新的汇总值，并放入map中即可。


**putIfAbsent函数**


putIfAbsent从命名上也能知道作用了，当map中没有相应key时才put值到map中，主要用于
如下场景：


如将list转换为map时，若list中有重复值时，put与putIfAbsent的区别如下：


put保留最晚插入的数据。
putIfAbsent保留最早插入的数据。


**forEach函数**


说实话，java中要遍历map，写法上是比较啰嗦的，不管是entrySet方式还是keySet方式，如
下：

```
for(Map.Entry`<`String, BigDecimal`>` entry: amountByTypeMap.entrySet()){
Integer payTypeId = entry.getKey();
BigDecimal amount = entry.getValue();
System.out.printf("payTypeId: %s, amount: %s /n", payTypeId, amount);
}

```

再看看在python或go中的写法，如下：

```
for payTypeId, amount in amountByTypeMap.items():
print("payTypeId: %s, amount: %s /n" % (payTypeId, amount))

```

可以发现，在python中的map遍历写法要少写好几行代码呢，不过，虽然java在语法层面上并
未支持这种写法，但使用map的forEach函数，也可以简化出类似的效果来，如下：

```
amountByTypeMap.forEach((payTypeId, amount) -`>` {
System.out.printf("payTypeId: %s, amount: %s /n", payTypeId, amount);
});

```

**总结**


**transient关键字解析**


**笔记本：** Java基础


**创建时间：** 2022/8/25 11:32 **更新时间：** 2022/8/25 11:35


**作者：** 彼岸樱速


**1、transient关键字的定义**


**定义：** transient只能用来修饰成员变量（field），被transient修饰的成员变量不参与序列化过
程。


**简析：** Java中的对象如果想要在网络上传输或者存储在磁盘时，就必须要序列化。Java中序列化
的本质是Java对象转换为字节序列。但是在序列化的过程中，可以允许被序列对象中的某个成员
变量不参与序列化，即该对象完成序列化之后，被transient修饰的成员变量会在字节序列中消
失。


**举例：**


小美的昵称希望被人看到，但是小美的真名不希望被人看到。



<img src="/java-base.pdf-37-0.png">



写个测试代码：



<img src="/java-base.pdf-37-1.png">


```
 // TODO Auto-generated catch block
 e . printStackTrace ();
 }
 }
 }

```

输出结果如下：





可以看出，使用transient关键字修饰的成员变量没有被序列化。


**2、transient关键字设计思路和底层实现思路**


毫无疑问，这是一个平常的编程语言设计思路，即实现两种编码转化的时候，我们希望用户在转
化过程中可以控制一些内容。


理解transient的关键在于理解序列化，序列化是Java对象转换为字节序列。


详细的说，就是Java对象在电脑中是存于内存之中的，内存之中的存储方式毫无疑问和磁盘中的
存储方式不同（一个显而易见的区别就是对象在内存中的存储分为堆和栈两部分，两部分之间还
有指针；但是存到磁盘中肯定不可能带指针，一定是某种文本形式）。序列化和反序列化就是在
这两种不同的数据结构之间做转化。


序列化：JVM中的Java对象转化为字节序列。


反序列化：字节序列转化为JVM中的Java对象。


理解到这里，实现原理也是显而易见的，只要在处理两个数据结构转化的过程中，把标为
transient的成员变量特殊处理一下就好了。


**3、静态成员变量不加transient关键字也不能被序列化**


在Java中，静态成员变量是不能被序列化的，不管有没有transient关键字。


大家可以看Serializable的相关文档：

```
 /**

 * The readObject method is responsible for reading from the stream and
 * restoring the classes fields . It may call in . defaultReadObject to invoke
 * the default mechanism for restoring the object's non -static and

 * non -transient fields .

```

在所有Serializable的实现类中，都明确说明了实例化过程中不包含静态成员变量和被transient
修饰的关键字。


**4、使用Externalizable自定义序列化**


Externalizable这个接口也是实现序列化的，但是和Serializable有不同。首先，Externalizable
是继承Serializable的，其次Externalizable是需要程序员自己指定成员变量实现序列化的。


也就是说，使用Externalizable接口，程序员需要实现writeExternal以及readExternal这两个方
法，来自己实现序列化和反序列化。 **实现的过程中，需要自己指定需要序列化的成员变量，此**
**时，static和transient关键词都是不生效的，因为你重写了序列化中的方法。**


举例：

```
 public class XiaoMei implements Externalizable {
 private String nickName ;
 private transient String realName ;
 private static String childName = " 美美 " ;

 public XiaoMei(){
 }

 public XiaoMei( String nickName, String realName ){
 this. nickName = nickName ;
 this. realName = realName ;
 }

 public String toString(){
 return String . format ( "XiaoMei.toString(): nickName=%s,realName=%s,childName=
 }

 @Override
 public void writeExternal( ObjectOutput out ) throws IOException {
 out . writeUTF ( realName );
 out . writeUTF ( childName );
 }

 @Override
 public void readExternal( ObjectInput in ) throws IOException, ClassNotFoundExceptio
 realName = in . readUTF ();
 childName = in . readUTF ();
 }
 }

```

使用上述例子中的测试代码，输出结果如下：

```
 序列化前： XiaoMei . toString (): nickName = 王美美, realName = 王小美, childName = 美美序列化后： XiaoMei .

```

可以看出，Externalizable接口中，指定的成员变量被序列化了，不管是否有static和transient
关键词，但是不被指定的成员变量不能被序列化。


**一文搞懂 Java 中的 Native 方法**


**笔记本：** Java基础


**创建时间：** 2022/8/24 16:59 **更新时间：** 2022/8/25 10:27


**作者：** 彼岸樱速


**1. 简介**
**1.1 个人理解**





因为还是第一次遇到，所以就去搜了一些文章进行了解。下面就对一些 Native 关键字进行一些
总结。


native 也即 **JNI —— Java Native Interface（Java 本地接口）** 。凡是一种语言，都希望是纯
的。比如解决某一个方案就单单使用同一个语言来实现。
而 Java 却不然，Java 平台有个用户和本地 C 代码进行相互操作的 API，称为 Java Native
Interface (Java 本地接口)。
也就是说，相当于使用 Java 语言声明了一个方法，而这个方法的具体实现是在其他语言（如
C、C++等）中实现的，
所以 Java 中编写的也就类似于一个接口，只是这个接口被称作本地接口。


Java 使用本地接口也是有原因的，因为 Java 的平台无关性，有优势当然也有牺牲，它的缺点就
是不能使用 Java 代码直接对一些底层进行操作，
但是对底层的操作又是一个语言必不可少的，于是 Java 就想到了间接去操作底层，而中间利用
的就是操作系统。
所以有些方法，Java 声明为了 native ，具体的实现是在 DLL 中，JVM 去进行真正的操作。


简单记忆：native 方法是 Java 中声明，由操作系统中具体方法实现。


**1.2 其他介绍**
网友见解：



<img src="/java-base.pdf-40-1.png">



Java 本地方法适用的情况：





**2. 用 Java 调用 C 的实例**
为了更好的理解 Java 中调用 Native 方法，特来编写一个具体的小的测试。


以下所有文件都存于个人本地文件夹：C:/Users/Eric/Desktop/NativeTest。


**2.1 创建包含本地方法的类**
在文件夹下创建一个 HelloNative.java 文件，里面包含着一个 native 的方法和加载库的方法

<img src="/java-base.pdf-40-3.png">
loadLibrary。代码如下：




<img src="/java-base.pdf-41-0.png">

首先注意的是 native 方法，然后那个加载库的静态代码块在后面也起作用。native 关键字告诉
编译器（其实是 JVM）调用的是该方法在外部定义，这里指的是 C。


**2.2 编译运行**
在当前文件夹下使用 CMD 命令行编译 HelloNative.java，如下，得到class文件。





如果当前类中没有 Native 方法，那么我们可以直接使用 java 命令直接运行，但是此时大家直
接运行这个代码，会出现以下结果：


意思是虚拟机说不知道如何找到 sayHello。因为我们定义的 sayHello 方法为 native 类型，所
以我们还需要再进行下文的操作步骤。


**2.3 获得头文件**
在当前文件目录下运行 javah，得到包含该方法的 C 声明头文件 。命令如下：



<img src="/java-base.pdf-41-2.png">



<img src="/java-base.pdf-41-4.png">

得到的结果如下，得到的 com_wyy_test_HelloNative.h 文件，内容如下：


```
/* DO NOT EDIT THIS FILE - it is machine generated */

#include <jni.h>
/* Header for class com_wyy_test_HelloNative */

#ifndef _Included_com_wyy_test_HelloNative

#define _Included_com_wyy_test_HelloNative

#ifdef __cplusplus
extern "C" {

#endif
/*
* Class: com_wyy_test_HelloNative
* Method: sayHello
* Signature: ()V
*/

JNIEXPORT void JNICALL Java_com_wyy_test_HelloNative_sayHello
(JNIEnv *, jclass);

#ifdef __cplusplus
}
#endif

#endif
```

这个头文件中可以看见我们声明的 Java 本地化 sayHello 方法，对应 C 的声明：JNIEXPORT
void JNICALL Java_com_wyy_test_HelloNative_sayHello(JNIEnv *, jclass);，我们只要实现
这个方法即可。

<img src="/java-base.pdf-42-0.png">


注意：头文件中 jni.h 这个文件，是在本地 JDK 目录下的 include 文件夹中，例如我的目录：


**2.3 C 实现头文件的声明方法**
生成了头文件之后，我们再在当前文件夹下创建一个 HelloNative.c 文件，并简单地实现
HelloNative.h 文件中声明的 sayHello 方法，代码如下：
`//` 包含刚才生成的 `.h` 文件
```
#include "com_wyy_test_HelloNative.h"

#include <stdio.h>

JNIEXPORT void JNICALL Java_com_wyy_test_HelloNative_sayHello(JNIEnv *env, jclass thisClass) {
printf("Hello, Native!!");
}

```

**2.4 生成动态链接库**
到了这一步，我们需要将上述两个文件 HelloNative.c 和 HelloNative.h 编译为动态链接库。


这里说明两种方法：分步编译或一次性编译形成动态链接库文件。


（1）一次性编译


在 Windows CMD 命令行里，使用如下命令：





注意：上述 JDK 为个人本地路径，需要根据个人情况进行修改。-m64 表示生成 dll 库是 64 位
的，参数 -I 指定头文件路径上述命令运行后，我们会在目录文件夹下生成相应的动态链接库文
件，如下：


如果使用的 Windows 上面没有 gcc，需要先下载压缩包然后配置一下环境变量即可使用（两分
钟就搞定），压缩包及配置步骤，
这里先安装一下mingw





<img src="/java-base.pdf-43-1.png">

可以单独看这篇文章





安装了下来，发现是32位的，如果系统是64位的，在这里下载





<img src="/java-base.pdf-43-4.png">
<img src="/java-base.pdf-44-0.png">

**2.5 再次运行Java类**
使用 2.4 中的方法生成动态链接库 HelloNative.dll 文件后，


我们再次使用 java 命令运行 Java 类，结果如下：


我们可以看到 Java 类已经可以成功运行了，并且我们也可以看出它运行的实际是我们使用 C 语
言编写的实现方法，它作为本地方法 native 来被 Java 代码调用。


**2.6 总结**
可以将 native 方法比作 Java 程序同Ｃ程序的接口，其实现步骤：



<img src="/java-base.pdf-44-1.png">

<img src="/java-base.pdf-44-2.png">

<img src="/java-base.pdf-44-3.png">


**JAVA中代码块的作用**


**笔记本：** Java基础


**创建时间：** 2022/6/7 16:18 **更新时间：** 2022/6/7 16:23


**作者：** 彼岸樱速

## **JAVA中代码块的作用**



<img src="/java-base.pdf-45-0.png">
<img src="/java-base.pdf-46-0.png">



<img src="/java-base.pdf-46-1.png">
**深克隆、浅克隆、引用拷贝**


**笔记本：** Java基础


**创建时间：** 2021/10/24 21:21 **更新时间：** 2022/5/6 18:35


**作者：** 彼岸樱速


**前言**


克隆，即复制一个对象，该对象的属性与被复制的对象一致，如果不使用Object类中的clone方法实现克隆，
可以自己new出一个对象，并对相应的属性进行数据，这样也能实现克隆的目的。


但当对象属性较多时，这样的克隆方式会比较麻烦，所以Object类中实现了clone方法，用于克隆对象。


**深拷贝和浅拷贝区别了解吗？什么是引用拷贝？**


关于深拷贝和浅拷贝区别，我这里先给结论：


**浅拷贝** ：浅拷贝会在堆上创建一个新的对象（区别于 **引用拷贝** 的一点），不过，如果原对象
内部的属性是引用类型的话，浅拷贝会直接复制内部对象的引用地址，也就是说拷贝对象和
原对象共用同一个内部对象。


**深拷贝** ：深拷贝会完全复制整个对象，包括这个对象所包含的内部对象。


上面的结论没有完全理解的话也没关系，我们来看一个具体的案例！


**浅拷贝**


浅拷贝的示例代码如下，我们这里实现了 `Cloneable` 接口，并重写了 `clone()` 方法。


`clone()` 方法的实现很简单，直接调用的是父类 `Object` 的 `clone()` 方法。

```
  public class Address implements Cloneable {
  private String name;
  // 省略构造函数、 Getter&Setter 方法
  @Override
  public Address clone() {
  try {
  return (Address) super.clone();
  } catch (CloneNotSupportedException e) {
  throw new AssertionError();
  }
  }
  }

  public class Person implements Cloneable {
  private Address address;
  // 省略构造函数、 Getter&Setter 方法
  @Override
  public Person clone() {
  try {
  Person person = (Person) super.clone();
  return person;
  } catch (CloneNotSupportedException e) {
  throw new AssertionError();
  }
  }
  }

```

测试 ：

```
  Person person1 = new Person(new Address(" 武汉 "));
  Person person1Copy = person1.clone();
  // true
  System.out.println(person1.getAddress() == person1Copy.getAddress());

```

从输出结构就可以看出， `person1` 的克隆对象和 `person1` 使用的仍然是同一个 `Address` 对象。


**深拷贝**


这里我们简单对 `Person` 类的 `clone()` 方法进行修改，连带着要把 `Person` 对象内部的 `Address` 对
象一起复制。

```
  @Override
  public Person clone() {
  try {
  Person person = (Person) super.clone();
  person.setAddress(person.getAddress().clone());
  return person;
  } catch (CloneNotSupportedException e) {
  throw new AssertionError();
  }
  }

```

测试 ：

```
  Person person1 = new Person(new Address(" 武汉 "));
  Person person1Copy = person1.clone();
  // false
  System.out.println(person1.getAddress() == person1Copy.getAddress());

```

从输出结构就可以看出，虽然 `person1` 的克隆对象和 `person1` 包含的 `Address` 对象已经是不同的
了。


**那什么是引用拷贝呢？** 简单来说，引用拷贝就是两个不同的引用指向同一个对象。


我专门画了一张图来描述浅拷贝、深拷贝、引用拷贝：


**Java中的克隆分为浅克隆与深克隆**


**一、实现克隆的方式**


1.对象的类需要实现Cloneable接口


2.重写Object类中的clone()方法


3.根据重写的clone()方法得到想要的克隆结果，例如浅克隆与深克隆。


**二、浅克隆与深克隆的区别**



<img src="/java-base.pdf-48-0.png">
浅克隆：复制对象时仅仅复制对象本身，包括基本属性，但该对象的属性引用其他对象时，该引用对象不会被
复制，即拷贝出来的对象与被拷贝出来的对象中的属性引用的对象是同一个。


深克隆：复制对象本身的同时，也复制对象包含的引用指向的对象，即修改被克隆对象的任何属性都不会影响
到克隆出来的对象。


**例子如下：**

```
public class PersonClone implements Cloneable {

private int age;

private String name;

public PersonClone(int age, String name) {

this.age = age;

this.name = name;
}

public void setAge(int age) {

this.age = age;
}

public void setName(String name) {

this.name = name;
}

@Override

public String toString() {

return "PersonClone{" +

"age=" + age +

```


<img src="/java-base.pdf-49-0.png">

<img src="/java-base.pdf-49-1.png">
<img src="/java-base.pdf-50-0.png">





**测试代码：**



<img src="/java-base.pdf-50-1.png">











**测试结果：**

```
 PersonClone{age=21, name='HanMeimei'} 984849465
 PersonClone{age=22, name='LiLei'} 787387795

```

即在克隆出新的对象后，修改被克隆对象的基本属性，并不会影响克隆出来的对象。但当被克隆的对象的属性
引用其他对象时，此时会有不同的结果。


**例子如下** ：

```
public class StudentClone implements Cloneable {

private String name;

```

**`private Achievement`** **`achievement;`** _**`//`**_ **成绩**

```
public StudentClone(String name, Achievement achievement) {

this.name = name;

this.achievement = achievement;
}

public void setName(String name) {

this.name = name;
}

public void setAchievement(Achievement achievement) {

this.achievement = achievement;
}

public Achievement getAchievement() {

return achievement;
}

@Override

public String toString() {

return "StudentClone{" +

"name='" + name + '/'' +

", achievement=" + achievement +
'}';
}

@Override

protected StudentClone clone() throws CloneNotSupportedException {

return (StudentClone) super.clone();
}
}

class Achievement implements Cloneable {

private float Chinese;

private float math;

```

<img src="/java-base.pdf-51-0.png">

































**测试代码：**



<img src="/java-base.pdf-51-1.png">













**测试结果：**

```
 StudentClone{name='LiLei', achievement=Achievement{Chinese=90.0, math=90.0, English=90.0}}
 [hashcode=1918627686] achievement.hashcode=716143810
 StudentClone{name='HanMei',achievement=Achievement{Chinese=90.0, math=90.0, English=90.0}}
 [hashcode=1849433705] achievement.hashcode=716143810

```

以上现象表明，上述克隆方式为浅克隆，并不会克隆对象的属性引用的对象，当修改被克隆对象的成绩时，克
隆出来的对象也会跟着改变，即两个对象的属性引用指向的是同一个对象。


但只要修改一下Student类中重写的clone()方法，即可实现深克隆。


**修改代码如下：**

```
@Override

```

<img src="/java-base.pdf-52-0.png">





**测试结果：**

```
 StudentClone{name='LiLei',achievement=Achievement{Chinese=100.0,math=100.0, English=100.0}}
 [hashcode=1918627686] achievement.hashcode=716143810
 StudentClone{name='HanMei', achievement=Achievement{Chinese=90.0, math=90.0, English=90.0}}
 [hashcode=1849433705] achievement.hashcode=411631404

```

即在Student类中的clone()方法中再克隆一次Achievement对象，并赋值给Student对象。


**值得一提的是，上文所说的浅拷贝只会克隆基本数据属性，而不会克隆引用其他对象的属性，但String对象**
**又不属于基本属性，这又是为什么呢？**


**这是因为String对象是不可修改的对象，每次修改其实都是新建一个新的对象，而不是在原有的对象上修**
**改，所以当修改String属性时其实是新开辟一个空间存储String对象，并把引用指向该内存，而克隆出来的**
**对象的String属性还是指向原有的内存地址，所以String对象在浅克隆中也表现得与基本属性一样。**


**JAVA替换字符串中的反斜杠**


**笔记本：** Java基础


**创建时间：** 2022/2/22 17:23 **更新时间：** 2022/2/22 17:25


**作者：** 彼岸樱速


**JAVA替换字符串中的反斜杠**


**在java中，对于反斜杠 " / " 有特定的含义。要想使用replaceAll把反斜杠替换成空字符串，需要使用四个反**


**斜杠 " //// "。**


原因是反斜杠是转义字符，在regex中"//"表示一个"/"，在java中一个"/"也要用"//"表示。因此，前一个"//"代


表regex中的"/"，后一个"//"代表java中的"/"。说明原因后且看下面的示例：







对于上述字符串的定义，看似没有问题，但编译器会报错。需要再加一个反斜杠，如下：





那么如何把上述的字符串的反斜杠去掉呢？使用replaceAll方法即可：







同理当需要把指定的字符串替换为反斜杠时，也需要使用四个反斜杠。





在上面的字符串中所有单引号后面都添加一个反斜杠：





总而言之，使用四个反斜杠作为反斜杠即可！


**Java变量及类名称定义坑之第二个字母大写**


**笔记本：** Java基础


**创建时间：** 2022/2/18 19:17 **更新时间：** 2022/2/18 19:27


**作者：** 彼岸樱速

## **Java变量及类名称定义坑之第二个字母大写**

在Java开发中，命名规范一直备受关注，驼峰命名法各种命名规范常被开发中使用，在此不再
赘述。本文主要记录一下当命名中第二个字母大写遇到的麻烦。
**一、Entity属性第二个字段为大写，如**



<img src="/java-base.pdf-54-0.png">



当第一个字母为小写，生成的getter和setter方法get和set后面的第一个字母为小写，后面的为大


写。若此时通过反射调用set方法为此entity实例属性设置值或通过get方法取此entity实例的属性


值时需注意，传方法名容易错误的将名称写成getATest或setATest（因为其他正常的命名方式是


第一个字母大写），此时会报没有此方法的错误。


**二、类名第二个字母大写，如**


Spring容器中时生成的实例ID和名称为“PProcesServiceImpl”，正常的实例和名称为第一个字母


小写，此时应注意不能写成pProcesServiceImpl，否则会报找不到实例的错误。



<img src="/java-base.pdf-54-2.png">
**项目为什么要使用jar或war进行打包发布？区别是什么？**


**笔记本：** Java基础


**创建时间：** 2021/11/16 17:29 **更新时间：** 2021/11/16 17:57


**作者：** 彼岸樱速

## **项目为什么要使用jar或war进行打包发布？区别是什** **么？**



<img src="/java-base.pdf-55-0.png">



<img src="/java-base.pdf-55-1.png">

**jar包和war包区别及理解**


<img src="/java-base.pdf-56-0.png">



<img src="/java-base.pdf-56-1.png">

**jar包**




<img src="/java-base.pdf-57-0.png">

**war包**



<img src="/java-base.pdf-57-1.png">



<img src="/java-base.pdf-57-2.png">

**Web存档(war)文件包含Web应用程序的所有内容。它减少了传输文件**
**所需要的时间。**

<img src="/java-base.pdf-57-3.png">

**jar包和war包区别**




<img src="/java-base.pdf-58-0.png">


**@Transient 理解**


**笔记本：** Java基础


**创建时间：** 2021/11/12 15:32 **更新时间：** 2021/11/12 15:32


**作者：** 彼岸樱速


**transient使用小结**
1）一旦变量被transient修饰，变量将不再是对象持久化的一部分，该变量内容在序列化后无法
获得访问。


2）transient关键字只能修饰变量，而不能修饰方法和类。注意，本地变量是不能被transient
关键字修饰的。变量如果是用户自定义类变量，则该类需要实现Serializable接口。


3）被transient关键字修饰的变量不再能被序列化，一个静态变量不管是否被transient修饰，均不能被序列化。


transient的作用












**Java中枚举类的ordinal()方法**


**笔记本：** Java基础


**创建时间：** 2021/11/9 10:08 **更新时间：** 2021/11/9 10:10


**作者：** 彼岸樱速


定义一个枚举类：





Enum类提供了一个 ，用来 ，比如本例中SPRING, SUMMER,
AUTUMN, WINTER的序数就分别是0，1，2，3。在某些情况下，我们需要根据这个序数生成我们需
要的枚举对象。
我们可以使用枚举类型的values()方法做到：



<img src="/java-base.pdf-60-1.png">


**java 父子类方法执行顺序**


**笔记本：** Java基础


**创建时间：** 2021/11/2 22:35 **更新时间：** 2021/11/2 22:43


**作者：** 彼岸樱速


打印



<img src="/java-base.pdf-61-0.png">

<img src="/java-base.pdf-61-1.png">
**Java中i+=i-=i*=i的运行结果是什么？**


**笔记本：** Java基础


**创建时间：** 2021/11/2 22:26 **更新时间：** 2021/11/2 22:34


**作者：** 彼岸樱速

## **Java中i+=i-=i*=i的运行结果是什么？**

i*(2-i)
要搞清楚运算的方法和顺序
i += x ; ( x为 i-=i*=i )
即i = i + x
i -= y ; ( y 为 i*=i)
即 x = i -y
i*=i 即 i = i _i_
即 _y = i_ i
所以有
i = i + i - i _i_

即 _i = i_ (2-i);


12 * (2-12) = 12 * -10 = -120


**JAVA语言中a+=a-=a*=a/=a为什么不是等于0而是等于12？**

**a=12**


经过验证，确定，java在进行这样的运算时，用到了临时变量，即中间的计算结果并没有存储到
变量a中。
运算过程是从右向左的
先运行a/=a ; 结果为1
再运行a*=1;结果为12
再运行a-=10;结果为0
再运行a+=0;结果为12


**java中定义int i=0xffffff;输出为什么是-1**


**笔记本：** Java基础


**创建时间：** 2021/11/2 22:18 **更新时间：** 2021/11/2 22:20


**作者：** 彼岸樱速


你这里应该是 int i = 0xffffffff 有8个F ;
**0x表示16进制** 8个0xffffffff = 2的32次方，
已经超过的了int的取值范围（-2的31次方 到 2 的31次方-1）
超出范围后则0xfffffff则取它的补码，0xffffffff => 1111 1111 1111 .... 1111 ->1000 0000

0000 ... 0001


ffff ffff 的二进制为 1111 1111 1111 1111 1111 1111 1111 1111
补码为1000 0000 0000 0000 0000 0000 0000 0001 为-1


追问


怎么输出补码？？？


追答


正数的补码和原码相同，负数的补码是按位取反，然后加1。倒过来说好理
解：0xFFFFFFFF是32 bits全是1, 符号位（最高位）是1，所以这个数是负
数。内存中的数值为补码表示，所以0xFFFFFFFF是一个负数的补码。负数
从补码求原码，最高符号位不变，还是1，其余各位按位求反，末尾加1，
这是结果就是-1，也就是 0xFFFFFFFF，二进制为：1111 1111 1111 111

1 1111 1111 1111 1111


**Math.round()**


**笔记本：** Java基础


**创建时间：** 2021/11/2 22:11 **更新时间：** 2021/11/2 22:13


**作者：** 彼岸樱速


该方法的效果是: 参数的相邻整数区间向最接近的那个整数进行舍取, 如果刚好在中间,那么取正
无穷方向的那个整数


**`Math.`** _**`round`**_ **`(1.2);`** _**`//1.2`**_ **的相邻整数区间是** _**`[1,2],`**_ **更加靠近** _**`1,`**_ **所以结果是** _**`1`**_
**`Math.`** _**`round`**_ **`(1.6);`** _**`//1.6`**_ **相邻整数区间是** _**`[1,2],`**_ **更加靠近** _**`2,`**_ **所以结果是** _**`2`**_
**`Math.`** _**`round`**_ **`(1.5);`** _**`//1.5`**_ **相邻整数区间是** _**`[1,2],`**_ **刚好在区间正中间** _**`,`**_ **所以取区间较大的那个** _**`,`**_ **所以结果是** _**`2`**_
**`Math.`** _**`round`**_ **`(-1.2);`** _**`//-1.2`**_ **的相邻整数区间是** _**`[-1,-2],`**_ **更加靠近** _**`-1,`**_ **所以结果是** _**`-1`**_
**`Math.`** _**`round`**_ **`(-1.6);`** _**`//-1.6`**_ **的相邻整数区间是** _**`[-1,-2],`**_ **更加靠近** _**`-2,`**_ **所以结果是** _**`-2`**_
**`Math.`** _**`round`**_ **`(-1.5);`** _**`//-1.5`**_ **的相邻整数区间是** _**`[-1,-2],`**_ **刚好在区间正中间** _**`,`**_ **所以取区间较大的那个** _**`,`**_ **所以结果**
**是** _**`-1`**_



<img src="/java-base.pdf-64-0.png">
**关于double、float、long的定义**


**笔记本：** Java基础


**创建时间：** 2021/11/2 21:50 **更新时间：** 2021/11/2 22:08


**作者：** 彼岸樱速


**1、double定义时跟int一样可以不用写d或D，写也可以，但如果**
**时其他字母比如float的f就不行了。**
**2、double转float需要调d.floatValue(),float转double需要强**
**转；**
**3、long定义时要在数字后面加L或l，当然了最好写L，小写的l会有**
**警告提示。**


**一道面试题：若x是单精度实型变量，表达式 (x = 10/4) 的值是？**


1．若x是单精度实型变量，表达式 (x = 10/4) 的值是_____ 。


A、2.5 B、 2.0 C、 3 D、 2


为什么答案不是2.000000，是省略了吗？


不存在省不省略的问题，没人规定一定得用 2.000000 来表示，仅仅规定了写程序的时候一般在立即
数后面带上 f 后缀来指明 float 类型。不能把 printf 这一类函数的默认输出格式拿来说事，何况
printf 的输出格式是可调的。


反正在我看来，只要回答的人知道答案是 2，并且被转为了 float，那考察的目的也就达到了。从这点
上来看，选 B 没毛病。



<img src="/java-base.pdf-65-0.png">
**Cloneable接口和Object的clone()方法**


**笔记本：** Java基础


**创建时间：** 2021/11/2 21:48 **更新时间：** 2021/11/2 21:48


**作者：** 彼岸樱速


Java中实现了Cloneable接口的类有很多。


像我们熟悉的ArrayList、Calendar、Date、HashMap、Hashtable、HashSet、LinkedList
等等。


**1、Cloneable 接口**


（1）一个类如果实现了 Cloneable 接口，就表示 Object 的 clone() 方法可以合法地对该类实
例进行按字段复制。


（3）按照惯例，实现此接口的类应该使用公共方法重写 Object 的 clone() 方法，Object 的
clone() 方法是一个受保护的方法。


**2、Object 的 clone() 方法**


创建并返回此对象的一个副本。对于任何对象 x，表达式：
（1）x.clone() != x 为 true
（2）x.clone().getClass() == x.getClass() 为 true


（3）x.clone().equals(x) 一般情况下为 true，但这并不是必须要满足的要求


**克隆一个对象并不会调用对象的构造方法。**


**Java自动转换和强制转换**


**笔记本：** Java基础


**创建时间：** 2021/11/2 21:34 **更新时间：** 2021/11/2 21:38


**作者：** 彼岸樱速


自动转换和强制转换我知道的有两种情况：

因为java是 **强类型语言** ，

比如：double 类型相比int类型是属于强类型，则由double类型的数据向int类型数据转换就需
要强制转换，反之则自动转换。
另外八大基本数据类型的强弱关系如下： **byte<short=char<int<long<float<double**
同级之间相互转换也需要强制转换。


再说 **类** ：
在类中 **由子类对象向父类对象** （包括接口）转换时，系统 **自动转换** ，称为向上转型，
而 **由父类对象（包括接口）向子类对象** 转换时，则需要进行 **强制转换** ，称为向下强制转换。


**静态方法中为什么不能使用this，super**


**笔记本：** Java基础


**创建时间：** 2021/11/2 21:29 **更新时间：** 2021/11/2 21:31


**作者：** 彼岸樱速


静态方法是在类里面的,是由类直接调用的.


this指的是调用该方法的对象.


熟读上面两点,然后看;例子



<img src="/java-base.pdf-68-0.png">



如果用A.add(); 我们说add里面的this指的是调用当前add方法的对象,


可是add是由类A直接调用的,不是由对象调用的,所以这里的this是谁?


由于可能有这种情况发生,所以不能在static中用this.


应为你不知道在用的时候,到底有没有创建对象.


super指的是父类对象,同理.你不能保证静态方法被调用时,有创建对象,如果没创建,this,super有


指代谁?


**String.intern方法详解**


**笔记本：** Java基础


**创建时间：** 2021/10/20 14:16 **更新时间：** 2021/10/20 16:04


**作者：** 彼岸樱速


记录创建String的两种方式，"" 和 new String()区别，


String intern方法的使用和常量池。


**String的使用 (Jdk1.8)**


**代码**

```
public static void main(String[] args) {
```

_**`//`**_ **使用** _**`""`**_ **创建会直接存储在常量池中**
```
String a = "lantao";
```

_**`//`**_ **使用** _**`new String`**_ **创建，** **会将** _**`zahngsan`**_ **存储到常量池中，然后在** _**`Heap`**_ **中创建对象指**
**向** _**`b`**_
```
String b = new String("zhangsan");
```

_**`//`**_ **使用字符串连接符拼接，会直接存储** _**`'wangwuzhaoliu'`**_ **字符串在常量池中**
```
String c = "wangwu" + "zhaoliu";
```

_**`//`**_ **使用字符串** _**`"`**_ **引用** _**`"`**_ **拼接，不执行** _**`intern`**_ **方法，不会存放到常量池中，但是会将** _**`-`**_
_**`--`**_ **存入到常量池中**
```
String d = a + "---";
```

_**`//`**_ **使用** _**`new String`**_ **拼接，不执行** _**`intern`**_ **方法，不会存放到常量池中，但是会将**
_**`wang`**_ **和** _**`jiu`**_ **两个字符串存到常量池中**
```
String f = new String("wang") + "jiu";
```

_**`//`**_ **使用** _**`new String`**_ **拼接，不执行** _**`intern`**_ **方法，不会存放到常量池中，** **但是会将**
_**`zhao`**_ **和** _**`ba`**_ **两个字符串存入到常量池中**
```
String g = new String("zhao") + new String("ba");
}

```

**解析**


**变量a：** "lantao" 是 **字符串常量** ，在 **编译期就被确定** 了，先检查 **字符串常量池中是否含**
**有"lantao"字符串**,若没有则 **添加** "lantao"到字符串常量池中，并且直接指向它。所以a直接指向
**字符串常量池** 的”lantao”,也就是变量a指向的地址是 **常量池中的 lantao** 。
**变量b：** 用new String() 创建的字符串不是常量， **不能在编译期就确定** ，所以new String() 创建
的字符串不放入常量池中，它们有自己的地址空间(Java Heap 中)， **变量b的引用的地址在Java**
**Heap中** 。 但是"zhangsan"字符串常量在编译期也会被加入到字符串常量池（如果常量池不存
在的话）。
**变量c：** "wangwu"和"zhaoliu"也都是 **字符串常量** ，当 **一个字符串** 由 **多个字符串常量** 连接而成
时，它自己 **肯定也是字符串常量** ，在编译器会被编译器优化成"wangwuzhaoliu"，所以c也同样
在编译期就被解析为一个字符串常量，并且c是常量池中”wangwuzhaoliu”的一个引用， **所以**
**变量c的引用地址在常量池中** 。
**变量d：** JVM对于字符串引用，由于在字符串的”+”连接中，有字符串引用存在，而引用的值
在程序编译期是无法确定的，即`(a+"---")
**变量f：** 变量f同样不能在编译期确定， **但是"wang"和"jiu"这两个字符串常量会添加到字符串**
**常量池中** ，并且在堆中创建String对象。（字符串常量池并不会存放"wangjiu"这个字符串,除非
执行f.intern()方法）


**变量g： 同理变量f。**


**String 拼接**


**字符串拼接**
```
public static void main(String[] args) {
String a = "lan" + "tao";
}

```

lan 和 tao 都是 **字符串** ，都是在编译器 **可知的** ，编译器会将这行代码优化， **当一个字符串是由多个可**
**知的字符串(非引用字符串)连接组成** ，将会优化为如下。


**JVM会将字符串"lantao"放入到String常量池中。**


**引用拼接**


当Java编译器遇到 **字符串引用** 或 **字符串引用和可知字符串** 拼接的时候，会创建一个
**StringBuilder** 对象，后面的append()。


因为有字符串引用存在，而引用的值在程序编译期是无法确定的。 **另外 "lan"、"tao" 都会编译**
**器添加到字符串常量池中（如果没有的话）** ，因为它们都是编译期确定的字符串常量， **但是最后**
**的"lantao"并不会添加到字符串常量池, 除非执行b.intern() 方法**


**final拼接**
```
public static void main(String[] args) {
final String a = "lan";
final String b = "tao";
String c = a + b + "2019";
}

```

final拼接和以上两者的区别就是在前边增加了final修饰， **用final修饰的字符串就是在编译期可**
**知的** ，编译期就会将以上代码优化为
```
public static void main(String[] args) {
String str = "lantao2019";
}

```

**这里 final 拼接的效果是和字符串拼接是一致的。**


**String#intern方法**


**intern方法详解**


**使用**


**注意：基本数据类型之间的 == 是比较值，引用数据类型 == 比较的是地址值**


**常量池中存在字符串**



<img src="/java-base.pdf-70-1.png">

<img src="/java-base.pdf-70-3.png">
<img src="/java-base.pdf-71-0.png">

**解释** ：


1：在 **Java Heap** 中 **创建对象** 然后在 **字符串常量** 池中 **添加** zhangsan。


2：调用 **intern** 方法，因上一步中已经将zhangsan存入常量池中，这里直接返回常量池
zhangsan 的引用地址。


3：因 a 的地址在Heap中，b的地址在字符串常量池中。


4：因为常量池中已经包含zhangsan，所以直接返回


5： b c 的地址一致，所以是true


地址可以使用System.identityHashCode(a)方法获取


**常量池中不存在字符串**

```
public static void main(String[] args) {
```

_**`//1`**_ **：** **首先会在** _**`Heap`**_ **中创建对象，然后在常量池中放入** _**`zhagnsan`**_ **和** _**`wangwu`**_ **，但是并不**
**会放入** _**`zhagnsanwangwu`**_
```
String a = new String("zhangsan") + "wangwu";
```

_**`// 2`**_ **：调用** _**`intern`**_ **，因为字符串常量池中没有** _**`”zhangsanwangwu”`**_ **这种拼接后的字符**
**串，**
_**`//`**_ **所以将堆中** _**`String`**_ **对象的引用地址添加到字符串常量池中。** _**`jdk1.7`**_ **后常量池引入到了**
_**`Heap`**_ **中，所以可以直接存储引用**
```
String b = a.intern();
```

_**`// 3`**_ **：因为** _**`a`**_ **的地址和** _**`b`**_ **的地址一致，锁以是** _**`true`**_
```
System. out .println(a == b);

```

_**`//4`**_ **：因常量池中已经存在** _**`zhangsanwangwu`**_ **了，所以直接返回引用就是** _**`a`**_ **类型** _**`a ==b`**_
**锁** _**`a==b==c`**_
```
String c = "zhangsanwangwu";
System. out .println(a == c); // true
System. out .println(b == c); // true

```

_**`// 5`**_ **：首先会在** _**`Heap`**_ **中创建对象，然后会在常量池中存储** _**`zhang`**_ **和** _**`san`**_
```
String d = new String("zhang") + "san";
```

_**`// 6`**_ **：** **返回的是常量池中的地址，因在** _**`a`**_ **变量时已经将** _**`zhangsan`**_ **放入到了常量池中**
```
String f = d.inter();
System. out .println(d = f); // false
}

```

**解释** ：


1：首先会在 **Heap中创建对象a，然后在** 常量池中放入zhagnsan 和 wangwu** ，但是 **并不会**
**放入** zhagnsanwangwu。


2：调用 intern ，因为字符串常量池中没有”zhangsanwangwu”这种拼接后的字符串，所以
将堆中 **String对象的引用地址添加到字符串常量池中** 。jdk1.7后常量池引入到了Heap中，所以
可以直接存储引用。


3：因为 a 的地址和 b的地址一致，所以是true。


4：因常量池中 **已经存在 zhangsanwangwu** 了，所以 **直接返回引用就是 a 类型** ， a ==b 所以
a==b==c。


5：首先会在 **Heap中创建对象d** ，然后会在 **常量池中存储 zhang 和 san** 。


6：因在创建对象a时，已经将 "zhangsan"放入到了常量池，所以 **返回的是常量池中的**
**zhangsan地址** ，对象d的地址在Heap中，f的地址在常量池中，并不是一个，所以false；


再来一个例子



<img src="/java-base.pdf-72-0.png">









**运行结果**



<img src="/java-base.pdf-72-1.png">



**可以看到c和d，intern前后的地址是改变的了，返回了常量池中是"abc"这个字符**
**串的地址**
**a = "a" + "b" + "c"在编译期间就已经变成了a = "abc",放到常量池中;**
**b = "abc"；常量池中有，那就直接把上面"abc"的地址值也返回给b；**
**c和d明显是拼接出来的，并且是在堆中的对象的引用地址值，内容虽说都是abc，**
**但是地址是不同于a和b的，**
**然后c和d在intern之后，也去常量池中找"abc"这个的地址值，这么一来，abcd**
**的地址都一样了，都是指向常量池中的那个"abc"的地址值。**


**Intern的意义在于何处**
为了比较而用intern 是无意义的，且消耗了cpu。因为string.equal 是把其char[] value 拿出来逐个char 是否相
等，所以不论string在什么地方，equal肯定是靠谱的。
而intern的意义其实应该是用在那些运行中产生的string中。如这么用


前提是在这个string值有很多重复产生情况并且长久使用，这样就可以节省内存。


也就是说我们平时很多时候使用字符串拼接，会产生很多碎片，多个字符串拼接之前，都有自己存放的地址
值，就算得出了拼接之后的，一个新的String对象，那也是在堆中，如果把这个转化为常量池中的字符串，并
把这个在常量池中的地址返回给当前对象，原先的堆中的对象就可以被gc回收了。


**IntegerCache存在的意义**


**笔记本：** Java基础


**创建时间：** 2021/10/18 11:05 **更新时间：** 2021/10/18 11:42


**作者：** 彼岸樱速


**如何看待Java中IntegerCache存在的意义，为何默认的cache范围**
**定在了-128~127？**


如何看待Java中IntegerCache存在的意义？为何默认的cache范围定了-128~127。


**初始设计 不可得兼**



<img src="/java-base.pdf-73-0.png">



**向下兼容 历史遗留**


随着java版本越来越高，机器内存越来越大，也许官方也曾想缓存更多的数字。但由于计算机程序一
般默认要求 **向下兼容** ，导致不能随便更改缓存设计。


也就把这256个整数缓存的设计延续到了现在的Java15【从Java1.4用到Java8，没用过Java15，猜
的】。


**雷同情况 隐形动作**


类似的设计情况还有一种，本来Java是不允许接口中的函数写实现的，也就是说接口中只能有抽象函
数。


而Java8中为了加入集合的流操作，在集合Collection接口中加入了 stream() 的default函数，从而达
到了加入流操作的需求【改变了接口的中必须是抽象函数的约束条件，Java7之前接口不允许写函数体
成了陈旧知识】。


为了维持向下兼容，实际上软件提供者做了很多不可见的事和维持了很多旧的落后的设计，但这些都
是不可见的，所以也很少有人知道。


**源码**

```
public final class Integer extends Number implements Comparable `<`Integer`>` {

```

Integer是final类型的，表示不能被继承，同时实现了Number类，并实现了Comparable接口；


java中数据类型可以分为两类，一种的 **基本数据类型** ，一种是 **引用数据类型** 。


基本数据类型的数据不是对象，所以对于要将数据类型作为对象来使用的情况，java提供了相对应的包
装类。


int是基本数据类型，integer是引用数据类型，是int的包装类。


自动装箱的过程：引用了valueOf()的方法


<img src="/java-base.pdf-74-0.png">







assertion就是在程序中的一条语句，它对一个boolean表达式进行检查，一个正确程序必须保证这个
boolean表达式的值为true；如果该值为false，说明程序已经处于不正确的状态下，系统将给出警告并
且退出。一般来说，assertion用于保证程序最基本、关键的正确性。
java内部为了节省内存，IntegerCache类中有一个数组缓存了值从-128到127的Integer对象。当我们调
用Integer.valueOf（int i）的时候，如果i的值时结余-128到127之间的，会直接从这个缓存中返回一个
对象，否则就new一个新的Integer对象。


即：当我们定义两个Integer的范围在【-128—+127】之间，并且值相同的时候，用==比较值为true；


当大于127或者小于-128的时候即使两个数值相同，也会new一个integer,那么比较的是两个对象，
用==比较的时候返回false



<img src="/java-base.pdf-74-1.png">







































IntegerCache是Integer的内部类，用来将-128——high之间的对象进行实例化


这边固定了缓存的下限，但是上限可以 **通过设置jdk的AutoBoxCacheMax参数调整，自动缓存区间设**
**置为[-128,N]** ；


IntegerCache 不会有实例，它是 private static class IntegerCache，在 Integer 中都是直接使用其
static 方法



<img src="/java-base.pdf-74-3.png">
<img src="/java-base.pdf-75-0.png">



<img src="/java-base.pdf-75-1.png">

Integer 缓存策略仅在自动装箱的时候有用，使用构造器创建的 Integer 对象不能被缓存，Java 编译
器把原始类型自动转换为封装类的过程称为自动装箱，这相当于调用 valueOf那个方法


在创建新的 Integer 对象之前会先在 IntegerCache.cache 中查找。有一个专门的 Java 类来负责
Integer 的缓存。


**其他**
Byte，Short，Long 有固定范围: -128 到 127，对于 Character, 范围是 0 到 127。
除了 Integer 可以通过参数改变范围外，其它的都不行。


解析案例

<img src="/java-base.pdf-75-2.png">
Integer整体阅览


**构造方法**





太简单了，没什么可讲的。


**valueOf()方法**
public static Integer valueOf(String s) throws NumberFormatException {  return
Integer.valueOf(parseInt(s, 10));}//@HotSpotIntrinsicCandidate 这个注解是JDK9才引入
的//HotSpot 虚拟机将对标注了@HotSpotIntrinsicCandidate注解的方法的调用，//替换为直
接使用基于特定 CPU 指令的高效实现。这些方法我们便称之为 intrinsic。public static
Integer valueOf(int i) {  //如果i在low和high之间就使用缓存  if (i >= IntegerCache.low
&& i <= IntegerCache.high){    return IntegerCache.cache[i + (IntegerCache.low)];  }  return new Integer(i);}
上面valueOf()方法中用到了IntegerCache，下面我们来聊聊。


IntegerCache
下面是IntegerCache源码和部分注释：



<img src="/java-base.pdf-76-0.png">



整个静态块：


<img src="/java-base.pdf-77-0.png">

那么，如何设置java.lang.Integer.IntegerCache.high的值呢？


The size of the cache may be controlled by the {@code **-XX:AutoBoxCacheMax=** }
option.


注释中已经说清楚，可以使用 **-XX:AutoBoxCacheMax=** 设置。


写个demo来debug看看



<img src="/java-base.pdf-77-1.png">



**设置`-XX:AutoBoxCacheMax`=100**


<img src="/java-base.pdf-78-0.png">

<img src="/java-base.pdf-78-1.png">

开始debug

<img src="/java-base.pdf-78-2.png">


看看high的值


是127，那就对了，因为上面


设置`-XX:AutoBoxCacheMax`=130



<img src="/java-base.pdf-78-3.png">
<img src="/java-base.pdf-79-0.png">

<img src="/java-base.pdf-79-1.png">

开启debug模式





**-XX:AutoBoxCacheMax最大能设置成多大？**

<img src="/java-base.pdf-79-3.png">
因为Integer的最大值是2147483647 ，所以我们这里使用这个值试试，


开始debug，直接报OOM了


<img src="/java-base.pdf-80-0.png">

为什么会OOM呢？


如果-XX:AutoBoxCacheMax没有设置值，那么对应数组是这样的。


equals()方法
上面的案例中有equals方法，这里把这个方法也拿出来聊聊


**回到上面的案例中**
当我们使用equals方法比较两个对象是否相等的时候其实就是比较他们的value值。


**所以不管是128还是8，equals后肯定都是true。**


当引用类型使用==进行比较的时候，此时比较的是两个引用的对象的地址，是不是同一个。



<img src="/java-base.pdf-80-1.png">

<img src="/java-base.pdf-80-2.png">

<img src="/java-base.pdf-80-3.png">

<img src="/java-base.pdf-80-4.png">


<img src="/java-base.pdf-81-0.png">



我们看看器class文件中的字节码；


本地变量表


每个本地变量赋值的过程


这里我们可以得出一个结论：


Integer c =8;就是Integer c = Integer.valueOf(8);


上面Integer b = Integer.valueOf(8);，那就说明变量b和c都是使用Integer.valueOf()获取到
的。


valueOf方法中


-XX:AutoBoxCacheMax不设置
上面关于IntegerCache的low和high已经进行了说明,low永远是-128，所以当我们没有设置


-XX:AutoBoxCacheMax 的值的时候，这时候 high=127。


当Integer.valueOf(8);的时候，就会进入上面代码中的if中。然后从IntegerCache中的数组
cache中获取。


但是IntegerCache中的cache数组是个常量数组。



<img src="/java-base.pdf-81-1.png">

<img src="/java-base.pdf-81-2.png">

<img src="/java-base.pdf-81-3.png">
<img src="/java-base.pdf-82-0.png">

言外之意，就是一旦给这个数组cache赋值后，就不会变了。


Integer b = Integer.valueOf(8);和Integer c=8;


b和c不就是都指向同一个引用地址吗？


所以 b==c为true;


但是Integer b=Integer.valueOf(128);


此时就不进入if中，而是直接new一个Integer对象



<img src="/java-base.pdf-82-1.png">
<img src="/java-base.pdf-83-0.png">

所以此时


Integer b=Innteger.valueOf(128) ；和Integer c = 128;


都会各自new 一个Integer对象，


此时的b==c为false。


这里也就是网上很多文章也就说到这里，就是比较当前int i 这个i是不是在-128到127范围之
内。


-XX:AutoBoxCacheMax设置为130
如果我们把-XX:AutoBoxCacheMax设置为130。那么上面


Integer b=Innteger.valueOf(128) ；和Integer c = 128;


也会进入if条件中。


最后b==c为true。



<img src="/java-base.pdf-83-1.png">
<img src="/java-base.pdf-84-0.png">

**如何避坑**
Integer是基本类型int的封装类，那么在平常使用的时候需要注意几点：


1，如果使用Integer，注意Integer的默认是null，容易引起空指针异常
NullPointerException。


2，如果使用int类型，注意int类型的初始值是0，很多设计某某状态时，很喜欢用0作为某个状
态，这里要小心使用。


3，另外从内存使用层面来讲，int是基本数据类型，只占用4个字节，Integer是一个对象，当表
示一个值时Integer占用的内存空间要高于int类型，从节省内存空间考虑，建议使用int类型(建
议了解一下Java对象内存布局)。


4，Integer使用的时候，直接赋值，Integer c = 8，不要new Integer(8)。因为直接赋值就是
Integer.valueOf方法使用缓存，没必要每次都new一个新对象，有效提高内存使用。


5，如果系统中大量重复的使用比127大的数，建议JVM启动的时候为XX:AutoBoxCacheMax=size 适当的大小，提升内存使用效率(但是也不能太大，上面我们已经
演示了可能出现OOM)。


**面试题**
**面试题1**
Integer num1 = new Integer(10);
Integer num2 = new Integer(10);
System.out.println(num1.equals(num2));
System.out.println(num1 == num2);


**面试题2**
Integer num3 = 100;
Integer num4 = 100;
System.out.println(num3.equals(num4));
System.out.println(num3 == num4);


**面试题3**
Integer num5 = 1000;
Integer num6 = 1000;
System.out.println(num5.equals(num6));
System.out.println(num5 == num6);
把上面看完了，再回头来看看这种面试题，还难吗？


如果在面试中遇到面试题3，可以适当反问一下面试官是否有对缓存范围进行调整，或许某些面
试官都会懵逼。


赤裸裸的吊打面试官。


**总结**



<img src="/java-base.pdf-85-0.png">


**Java中的byte类型**


**笔记本：** Java基础


**创建时间：** 2021/8/4 23:24 **更新时间：** 2021/10/18 2:07


**作者：** 彼岸樱速


**详解java中的byte类型**


Java也提供了一个byte数据类型，并且是基本类型。


java byte是做为最小的数字来处理的，因此它的值域被定义为-128~127，也就是signed byte。


**介绍**


**byte** ，即字节，由 **8位的二进制** 组成。在Java中，byte类型的数据是 **8位带符号的二进制数** 。


在计算机中， **8位带符号二进制数的取值范围是[-128, 127]** ，所以在Java中， **byte类型的取值**

**范围也是[-128, 127]** 。


**取值范围分析**


一直在想 **为什么不是 -128 到 128** 呢？今天分析了一下这个问题。


首先我们得明白一件事情，那就是运算规则：


####正数的最高位都是 0 ，正数的值就是二进制表示的值。 ####


####负数的最高位都是 1 ，负数的值是 取反后加一 然后加个负号得到得值。 ####


我们用8位的二进制来说明一下此规则：


比如：00000001。最高位是0 为正数 ，那么表示的就是 十进制的 1。


再比如：10000001.最高位是1 为负数，值是多少？取反得到 01111110 加1 得到 01111111 ，


那么值为 -127


理解此运算规则我们正式开始说byte，byte正好是8位的二进制数。short是16位 int是32位 long

是64位。


不难理解，byte的最大正数就是 01111111（最高位必须是0），也就是 127。


那么你可能会想 byte的最小负数就是 11111111 了，对不对? 这么想就


大错特错了。让我们看看11111111这个二进制数表示多少。


根据上面的提示 我们知道这是一个负数。它的值是先取反再加1 。


11111111取反得到：00000000，加1得到 00000001 。最后得到的值为-1.


这可是最大的负数啊。由此你是不是想到了最小的负数会不会是10000000呢？


让我们算一下 取反：01111111 加1得到 10000000 最后得到 -128.


127是01111111 然而 -128是10000000 ，看出来一个奇怪的事情。


仔细的看一下这两个二进制数 是不是前者加1就得到后者呢？对。


可以编一个小程序实验一下：









结果正好是-128


由此我们可以看出来二进制从 00000000 到01111111到10000000到 11111111


即 十进制从 0 到 127 到 -128 到 -1。


**接下来，我们用一段代码来更深刻地理解byte:**



<img src="/java-base.pdf-87-0.png">















原因如下


456的二进制表示是111001000，由于 **int是32位的二进制** ，所以在计算机中，实际上是


00000000000……111001000，


当 **int转成byte** 的时候，那么计算机会 **只保留最后8位，即11001000** 。


然后11001000的最高位是1，那么表示是一个负数，而负数在计算机中都是以补码的形式保存


的，


所以我们计算11001000的原码为00111000，即56，


所以11001000表示的是-56，所以最后test的值为-56。


**Java BigDecimal详解**


**笔记本：** Java基础


**创建时间：** 2021/10/18 1:54 **更新时间：** 2021/10/18 2:05


**作者：** 彼岸樱速


**Java BigDecimal详解**

**引言**


float和double类型的主要设计目标是为了科学计算和工程计算。他们执行二进制浮点运


算，这是为了在广域数值范围上提供较为精确的快速近似计算而精心设计的。然而，它们没有提


供完全精确的结果，所以不应该被用于要求精确结果的场合。但是，商业计算往往要求结果精


确，这时候BigDecimal就派上大用场啦。


**先看下面代码**

```
 public static void main(String[] args) {

  System.out.println(0.2 + 0.1);

  System.out.println(0.3 - 0.1);

  System.out.println(0.2 * 0.1);

  System.out.println(0.3 / 0.1);

 }

```

运行结果如下


你认为你看错了，但结果却是是这样的。问题在哪里呢？原因在于我们的计算机是二进制的。浮
点数没有办法是用二进制进行精确表示。我们的CPU表示浮点数由两个部分组成：指数和尾
数，这样的表示方法一般都会失去一定的精确度，有些浮点数运算也会产生一定的误差。如：
2.4的二进制表示并非就是精确的2.4。反而最为接近的二进制表示是 2.3999999999999999。
浮点数的值实际上是由一个特定的数学公式计算得到的。


其实java的float只能用来进行科学计算或工程计算，在大多数的商业计算中，一般采用


java.math.BigDecimal类来进行精确计算。


**BigDecimal构造方法**



<img src="/java-base.pdf-88-0.png">

<img src="/java-base.pdf-88-1.png">



为什么不建议采用第一种构造方法呢？来看例子



<img src="/java-base.pdf-88-2.png">


运行结果如下


为什么会出现这种情况呢？


JDK的描述：


1、参数类型为double的构造方法的结果有一定的不可预知性。有人可能认为在Java中写入


newBigDecimal(0.1)所创建的BigDecimal正好等于 0.1（非标度值 1，其标度为 1），但是它


实际上等于0.1000000000000000055511151231257827021181583404541015625。这是


因为0.1无法准确地表示为 double（或者说对于该情况，不能表示为任何有限长度的二进制小


数）。这样，传入到构造方法的值不会正好等于 0.1（虽然表面上等于该值）。


2、另一方面，String 构造方法是完全可预知的：写入 newBigDecimal("0.1") 将创建一个


BigDecimal，它正好等于预期的 0.1。因此，比较而言， **通常建议优先使用String构造方法** 。

**当double必须用作BigDecimal的源时，** 请使用 `Double.toString(double)`

转成 `String` ，然后 使用String构造方法，或使用BigDecimal的静态方法valueOf，如下



<img src="/java-base.pdf-89-0.png">

<img src="/java-base.pdf-89-3.png">



结果如下


**BigDecimal加减乘除运算**


对于常用的加，减，乘，除，BigDecimal类提供了相应的成员方法。



<img src="/java-base.pdf-89-4.png">



大概的用法如下



<img src="/java-base.pdf-89-5.png">


<img src="/java-base.pdf-90-0.png">



运行结果


这里有一点需要注意的是除法运算divide.


BigDecimal除法可能出现不能整除的情况，比如 4.5/1.3，


这时会报错java.lang.ArithmeticException: Non-terminating decimal expansion; no exact


representable decimal result.


其实divide方法有可以传三个参数


public BigDecimal divide(BigDecimal divisor, int scale, int roundingMode)


第一参数表示除数，


第二个参数表示小数点后保留位数，


第三个参数表示舍入模式，只有在作除法运算或四舍五入时才用到舍入模式，有下面这几种



<img src="/java-base.pdf-90-1.png">

<img src="/java-base.pdf-90-2.png">





按照各自的需要，可传入合适的第三个参数。四舍五入采用 ROUND_HALF_UP


需要对BigDecimal进行截断和四舍五入可用setScale方法，例：



<img src="/java-base.pdf-90-3.png">





加减乘除其实最终都返回的是一个新的BigDecimal对象，


因为BigInteger与BigDecimal都是不可变的（immutable）的，在进行每一步运算时，都会产

生一个新的对象


<img src="/java-base.pdf-91-0.png">



**总结**



<img src="/java-base.pdf-91-1.png">


**泛型**


**笔记本：** Java基础


**创建时间：** 2021/10/18 0:21 **更新时间：** 2021/10/18 1:45


**作者：** 彼岸樱速


目录


一、Java泛型的实现方法：类型擦除

1、原始类型相等
2、通过反射添加其它类型元素
二、类型擦除后保留的原始类型

1、原始类型Object
2、Object泛型
三、类型擦除引起的问题及解决方法

1、先检查再编译以及编译的对象和引用传递问题
2、自动类型转换
3、类型擦除与多态的冲突和解决方法
4、泛型类型变量不能是基本数据类型
5、编译时集合的instanceof
6、泛型在静态方法和静态类中的问题





<img src="/java-base.pdf-92-1.png">

通过两个例子证明Java类型的类型擦除


**1、原始类型相等**

```
public class Test {

public static void main(String[] args) {

ArrayList`<`String`>` list1 = new ArrayList`<`String`>`();

list1.add("abc");

ArrayList`<`Integer`>` list2 = new ArrayList`<`Integer`>`();

list2.add(123);

System.out.println(list1.getClass() == list2.getClass());

}

}

```

在这个例子中，我们定义了两个 `ArrayList` 数组，


不过一个是 `ArrayList` `<`String`>` 泛型类型的，只能存储字符串；


一个是 `ArrayList` `<`Integer`>` 泛型类型的，只能存储整数，


**2、通过反射添加其它类型元素**

```
public class Test {

```


<img src="/java-base.pdf-92-2.png">
```
public static void main(String[] args) throws Exception {

ArrayList`<`Integer`>` list = new ArrayList`<`Integer`>`();

```

**`list.add(1); //`** **这样调用** **`add`** **方法只能存储整形，因为泛型类型的实例为** **`Integer`**

```
list.getClass().getMethod("add", Object.class).invoke(list, "asd");

for (int i = 0; i `<` list.size(); i++) {

System.out.println(list.get(i));

}

}

}

```

不过当我们利用 **反射** 调用 `add()` 方法的时候，却可以存储字符串，


这说明了 `Integer` 泛型实例在编译之后被擦除掉了，只保留了原始类型。





在上面，两次提到了原始类型，什么是原始类型？





**1、原始类型Object**

```
public class Pair`<`T`>` {

private T value;

public T getValue() {

return value;

}

public void setValue(T value) {

this.value = value;

}

}

```

Pair的原始类型为:

```
public class Pair {

private Object value;

public Object getValue() {

return value;

}

public void setValue(Object value) {

this.value = value;

}

}

```

因为在 `Pair<T>` 中，T 是一个无限定的类型变量，所以用 `Object` 替换，


其结果就是一个普通的类，如同泛型加入Java语言之前的已经实现的样子。





如果类型变量有限定，那么原始类型就用第一个边界的类型变量类替换。


比如: Pair这样声明的话

```
public class Pair`<`T extends Comparable `>` {}

```

那么原始类型就是 `Comparable` 。


要区分 **原始类型** 和 **泛型变量的类型** 。


在调用泛型方法时，可以指定泛型，也可以不指定泛型。


在不指定泛型的情况下，泛型变量的类型为该方法中的几种类型的同一父类的最小级，直到
Object。
在指定泛型的情况下，该方法的几种类型必须是该泛型的实例的类型或者其子类。

```
public class Test {

public static void main(String[] args) {

```

**`/**`** **不指定泛型的时候** **`*/`**


**`int i = Test.add(1, 2); //`** **这两个参数都是** **`Integer`** **，所以** **`T`** **为** **`Integer`** **类型**

**`Number f = Test.add(1, 1.2); //`** **这两个参数一个是** **`Integer`** **，以风格是** **`Float`** **，所以取同**

**一父类的最小级，为** **`Number`**


**`Object o = Test.add(1, "asd"); //`** **这两个参数一个是** **`Integer`** **，以风格是** **`Float`** **，所以取**

**同一父类的最小级，为** **`Object`**


**`/**`** **指定泛型的时候** **`*/`**


**`int a = Test.<Integer>add(1, 2); //`** **指定了** **`Integer`** **，所以只能为** **`Integer`** **类型或者其子**

**类**


**`int b = Test.<Integer>add(1, 2.2); //`** **编译错误，指定了** **`Integer`** **，不能为** **`Float`**

**`Number c = Test.<Number>add(1, 2.2); //`** **指定为** **`Number`** **，所以可以为** **`Integer`** **和** **`Float`**

```
}

```

**`//`** **这是一个简单的泛型方法**

```
public static `<`T`>` T add(T x,T y){

return y;

}

}

```

其实在泛型类中，不指定泛型的时候，也差不多，只不过这个时候的泛型为 `[Object]` ，


就比如 `[ArrayList]` 中，如果不指定泛型，那么这个 `[ArrayList]` 可以存储任意的对象。


**2、Object泛型**

```
public static void main(String[] args) {

ArrayList list = new ArrayList();

list.add(1);

list.add("121");

list.add(new Date());

}

```








**1、先检查再编译以及编译的对象和引用传递问题**





**A** : Java编译器是通过先检查代码中泛型的类型，然后在进行类型擦除，再进行编译。


例如：



<img src="/java-base.pdf-94-3.png">




<img src="/java-base.pdf-95-0.png">



在上面的程序中，使用 `[add]` 方法添加一个整型，在IDE中，直接会报错，说明这就是在编译之前的检查，


因为如果是在编译之后检查，类型擦除后，原始类型为 `[Object]` ，是应该允许任意引用类型添加的。


可实际上却不是这样的，这恰恰说明了关于泛型变量的使用，是会在编译之前检查的。


那么，这个类型检查是针对谁的呢？我们先看看参数化类型和原始类型的兼容。


以 ArrayList举例子，以前的写法:

```
 ArrayList list = new ArrayList();

```

现在的写法:

```
 ArrayList`<`String`>` list = new ArrayList`<`String`>`();

```

如果是与以前的代码兼容，各种引用传值之间，必然会出现如下的情况：


**`ArrayList` `<`String`>` list1 = new ArrayList(); //`** **第一种** **情况**

**`ArrayList list2 = new ArrayList`<`String`>`(); //`** **第二种** **情况**


这样是没有错误的，不过会有个 **编译时警告** 。


不过在第一种情况，可以实现与完全使用泛型参数一样的效果，第二种则没有效果。



而 **真正设计类型检查的是它的引用** ，因为我们是使用它引用 `list1` 来调用它的方法，比如说调用 `add` 方法，


所以 `list1` 引用能完成泛型类型的检查。而引用 `list2` 没有使用泛型，所以不行。


举例子：



<img src="/java-base.pdf-95-2.png">



泛型中参数话类型为什么不考虑继承关系？


在Java中，像下面形式的 **引用传递是不允许** 的:


**`ArrayList` `<`String`>` list1 = new ArrayList`<`Object`>`(); //`** **编译错误**

**`ArrayList`<`Object`>` list2 = new ArrayList`<`String`>`(); //`** **编译错误**


我们先看第一种情况，将第一种情况拓展成下面的形式：



<img src="/java-base.pdf-95-4.png">


<img src="/java-base.pdf-96-0.png">

实际上，在第4行代码的时候，就会有编译错误。那么，我们先假设它编译没错。





可是它里面实际上已经被我们存放了 `Object` 类型的对象，这样就会有 `ClassCastException` 了。





再看第二种情况，将第二种情况拓展成下面的形式：



<img src="/java-base.pdf-96-3.png">



可是，这样做有什么意义呢，泛型出现的原因，就是为了解决类型转换的问题。


我们使用了泛型，到头来，还是要自己强转，违背了泛型设计的初衷。所以java不允许这么干。





**所以，要格外注意，泛型中的引用传递的问题。**


**2、自动类型转换**


因为类型擦除的问题，所以所有的泛型类型变量最后都会被替换为原始类型。


既然都被替换为原始类型，那么为什么我们在获取的时候，不需要进行强制类型转换呢？


看下 `ArrayList.get()` 方法：

```
public E get(int index) {

RangeCheck(index);

return (E) elementData[index];

}

```

可以看到，在 `return` 之前，会根据泛型变量进行强转。









也会自动地在结果字节码中插入强制类型转换。


**3、类型擦除与多态的冲突和解决方法**


现在有这样一个泛型类：

```
class Pair`<`T`>` {

private T value;

```

```
public T getValue() {

return value;

}

public void setValue(T value) {

this.value = value;

}

}

```

然后我们想要一个子类继承它。



<img src="/java-base.pdf-97-0.png">

在这个子类中，我们设定父类的泛型类型为 `Pair<Date>` ，在子类中，我们覆盖了父类的两个方法，


我们的原意是这样的：将父类的泛型类型限定为 `Date` ，那么父类里面的两个方法的参数都为 `Date` 类型。



<img src="/java-base.pdf-97-1.png">







<img src="/java-base.pdf-97-4.png">





再看子类的两个重写的方法的类型：

```
@Override

public void setValue(Date value) {

super.setValue(value);

}

@Override

public Date getValue() {

return super.getValue();

}

```

我们在一个main方法测试一下：

```
public static void main(String[] args) throws ClassNotFoundException {

DateInter dateInter = new DateInter();

dateInter.setValue(new Date());
```

**`dateInter.setValue(new Object()); //`** **编译错误**

```
}

```




为什么会这样呢？


原因是这样的，我们传入父类的泛型类型是 `[Date]` [，] `[Pair<Date>]` ，我们的本意是将泛型类变为如下：



<img src="/java-base.pdf-98-2.png">



然后再子类中重写参数类型为Date的那两个方法，实现继承中的多态。


可是由于种种原因，虚拟机并不能将泛型类型变为 `[Date]` ，只能将类型擦除掉，变为原始类型 `[Object]` 。


这样，我们的本意是进行重写，实现多态。可是类型擦除后，只能变为了重载。


这样，类型擦除就和多态有了冲突。JVM知道你的本意吗？知道！！！





于是JVM采用了一个特殊的方法，来完成这项功能，那就是 **桥方法** 。


首先，我们用 `javap -c className` 的方式反编译下 `DateInter` 子类的字节码，结果如下：


**class com.tao.test.DateInter extends com.tao.test.Pair<java.util.Date> {**


**com.tao.test.DateInter();**


**Code:**


**0: aload_0**

**1: invokespecial #8 // Method com/tao/test/Pair."<init>":()V**


**4: return**


**public void setValue(java.util.Date); //我们重写的setValue方法**


**Code:**


**0: aload_0**

**1: aload_1**

**2: invokespecial #16 // Method com/tao/test/Pair.setValue:(Ljava/lang/Object;)V**


**5: return**


**public java.util.Date getValue(); //我们重写的getValue方法**


**Code:**


**0: aload_0**

**1: invokespecial #23 // Method com/tao/test/Pair.getValue:()Ljava/lang/Object;**

**4: checkcast #26 // class java/util/Date**


**7: areturn**


**public java.lang.Object getValue(); //编译时由编译器生成的桥方法**


**Code:**


**0: aload_0**

**1: invokevirtual #28 // Method getValue:()Ljava/util/Date 去调用我们重写的getValue方法;**


**4: areturn**


**public void setValue(java.lang.Object); //编译时由编译器生成的桥方法**


**Code:**


**0: aload_0**

**1: aload_1**

**2: checkcast #26 // class java/util/Date**

**5: invokevirtual #30 // Method setValue:(Ljava/util/Date; 去调用我们重写的setValue方法)V**


**8: return**


**}**


所以， **虚拟机巧妙的使用了桥方法，来解决了类型擦除和多态的冲突** 。


不过，要提到一点，这里面的 `[setValue]` 和 `[getValue]` 这两个桥方法的意义又有不同。


`setValue` 方法是为了解决类型擦除与多态之间的冲突。


而 `[getValue]` 却有普遍的意义，怎么说呢，如果这是一个普通的继承关系：


那么父类的 `[getValue]` 方法如下：

```
public Object getValue() {

return value;

}

```

而子类重写的方法是：

```
public Date getValue() {

return super.getValue();

}

```

其实这在普通的类继承中也是普遍存在的重写，这就是协变。


关于协变：。。。。。。


**4、泛型类型变量不能是基本数据类型**



<img src="/java-base.pdf-99-0.png">

<img src="/java-base.pdf-99-1.png">

**5、编译时集合的instanceof**

```
 ArrayList`<`String`>` arrayList = new ArrayList`<`String`>`();

```

因为类型擦除之后， `ArrayList` `<`String`>` 只剩下原始类型，泛型信息 `String` 不存在了。


那么，编译时进行类型查询的时候使用下面的方法是错误的

```
 if ( arrayList instanceof ArrayList`<`String`>`)

```

**6、泛型在静态方法和静态类中的问题**


泛型类中的静态方法和静态变量不可以使用泛型类所声明的泛型类型参数


举例说明：

```
public class Test2`<`T`>` {
```

**`public`** **`static T one; //`** **编译错误**


**`public`** **`static T show(T one){ //`** **编译错误**

```
return null;

}

}

```




但是要注意区分下面的一种情况：



<img src="/java-base.pdf-100-1.png">100-1





因为这是一个泛型方法，在泛型方法中使用的T是自己在方法中定义的 T，而不是泛型类中的T。


**Java 泛型（Generic）** 的引入加强了参数类型的安全性，减少了类型的转换，
但有一点需要注意：Java 的泛型在编译器有效，在运行期被删除，也就是说所有泛型参数类型
在编译后都会被清除掉，看下面一个列子，代码如下：

```
public class GenericTest {

public void listMethod( List `<`String`>` stringList){
}
public void listMethod( List `<`Integer`>` intList) {
}
}
```

代码很简单，看起来没什么问题，但是编译器却报出如下错误信息：
Error:(15, 17) java: 名称冲突: listMethod(java.util.List`<`java.lang.Integer`>`)和

<img src="/java-base.pdf-100-2.png">
listMethod(java.util.List`<`java.lang.String`>`)具有相同疑符


此错误的意思是说listMethod(List`<`String`>`) 方法在编译时擦除类型后的方法是
listMethod(List`<`E`>`)，
它与另外一个方法重复，也就是方法签名重复。反编译之后的方法代码如下：



<img src="/java-base.pdf-100-3.png">



从上面代码可以看出 Java 编译后的字节码中已经没有泛型的任何信息，在编译后所有的泛型类
型都会做相应的转化，转化如下：



<img src="/java-base.pdf-100-5.png">


<img src="/java-base.pdf-101-0.png">



**Java 为什么这么处理呢？**
有以下两个原因：


避免 JVM 的大换血。如果 JVM 将泛型类型延续到运行期，那么到运行期时 JVM 就需要进行大
量的重构工作了，提高了运行期的效率。
版本兼容。 在编译期擦除可以更好地支持原生类型（Raw Type）。

明白了 Java 泛型是类型擦除的，下面的问题就很好理解了：



<img src="/java-base.pdf-101-1.png">


**双亲委派机制（ClassLoader）**


**笔记本：** Java基础


**创建时间：** 2021/10/18 0:40 **更新时间：** 2021/10/18 1:00


**作者：** 彼岸樱速

## **通俗易懂的双亲委派机制**

**你得先知道**
在介绍双亲委派机制的时候，不得不提ClassLoader（类加载器）。
说ClassLoader之前，我们得先了解下Java的基本知识。
Java是运行在Java的虚拟机(JVM)中的，但是它是如何运行在JVM中了呢？我们在IDE中编写的
Java源代码被编译器编译成.class的字节码文件。
然后由我们得ClassLoader负责将这些class文件给加载到JVM中去执行。
JVM中提供了三层的ClassLoader：



<img src="/java-base.pdf-102-0.png">



那如果有一个我们写的Hello.java编译成的Hello.class文件，它是如何被加载到JVM中的呢？别
着急，请继续往下看。


**双亲委派机制**
java.lang 包下的ClassLoader类。然后将代码翻到loadClass方法：



<img src="/java-base.pdf-102-1.png">































其实这段代码已经很好的解释了双亲委派机制，为了大家更容易理解，我做了一张图来描述一下
上面这段代码的流程：


<img src="/java-base.pdf-103-0.png">

<img src="/java-base.pdf-103-1.png">



**为什么要设计这种机制**
这种设计有个好处是，如果有人想替换系统级别的类：String.java。篡改它的实现，在这种机制
下这些系统的类已经被Bootstrap classLoader加载过了（为什么？因为当一个类需要加载的时
候，最先去尝试加载的就是BootstrapClassLoader），所以其他类加载器并没有机会再去加
载，从一定程度上防止了危险代码的植入。


总结了一张脑图如下：


**双亲委派机制的作用**



<img src="/java-base.pdf-103-2.png">
<img src="/java-base.pdf-104-0.png">


**try/catch/finally**


**笔记本：** Java基础


**创建时间：** 2021/10/10 1:16 **更新时间：** 2021/10/17 20:10


**作者：** 彼岸樱速


**try/catch/finally**


给定以下JAVA代码，这段代码运行后输出的结果是（）



<img src="/java-base.pdf-105-0.png">



**正确答案: B  你的答案: D (错误)**

```
 exception in main finished

 finally finished

 exception in main finally

  finally exception in main finished

```

解题要点：
1、catch语句当没有异常抛出时不执行；
2、finally语句必定执行；
3、throws语句定义该方法可能抛出的异常，如果方法中没有异常产生，即便定义了throws语句，也不会
抛出异常；

4、区分抛异常和打印错误


答案：B
i / 10;无论i是多少，永远不会抛出异常，所以catch语句不会执行。 **分母为0才会抛出异常，分子为0是不**
**会出现异常的**
而finally语句是必定执行的语句。
所以先指向aMathod()的finally代码块，输出finally

然后执行main()方法的最后一条输出语句，输出finished


1、finally块一定会执行，无论是否try…catch。
2、finally前有return，会先执行return语句，并保存下来，再执行finally块，最后return。

3、finally前有return、finally块中也有return，先执行前面的return，保存下来，再执行finally的return，覆
盖之前的结果，并返回。


**更多案例**

```
 public class TryCatchTest {

 public static int aMethod(int i)throws Exception {

```

```
try {
return i / 10;
} catch (Exception ex) {
System. out .println("11");
throw new Exception("exception in a Method");
} finally {
System. out .printf("finally");
}
}

int test1Method() {
int a = 1;
try {
return a;
} catch (Exception e) {
```

_`//`_ 有异常才会打印 _`11`_
_`//`_ 没有异常不会打印 _`11`_
```
System. out .println("11");
} finally {

++a;
return a;
}
}

int test2Method() {
int a = 1;
try {
int u=1/0;
return a;
} catch (Exception e) {
System. out .println("11");
} finally {

++a;
return a;
}
}

int test3Method() {
int a = 1;
try {
int u=1/0;
return a;
} catch ( Exception e) {
System. out .println("11");
return a;
} finally {

++a;
}
}

int test4Method() {
int a = 1;
try {
return a;
} catch (Exception e) {
System. out .println("11");
} finally {

++a;
}
return a;
}

int test5Method() {
int a = 1;
try {
int u=1/0;
return a;
} catch (Exception e) {
System. out .println("catch 11");
return a+1;
} finally {
System. out .println(a); // 1

++a;
System. out .println(a); // 2
System. out .println("finally 22");
}
}

int test6Method() {
int a = 1;
try {
int u=1/0;
return a;
} catch ( ArithmeticException e) {
System. out .println("11");
return a+1;
} catch (Exception e) {
System. out .println("22");
return a;
} finally {

++a;
}

```

<img src="/java-base.pdf-107-0.png">

















**总结**



<img src="/java-base.pdf-107-1.png">



关于第6点，try 中的 return 语句调用的函数先于 finally 中调用的函数执行，
也就是说 try 中的 return 语句先执行，再到catch中的语句，finally 语句最后执行，
但 **try中的 return 并不是让函数马上返回结果** ，而是 return 语句执行后，将把返回结果放置进
函数栈中，此时函数并不是马上返回，

它要 **执行 finally 语句后才真正开始返回** 。但此时会出现两种情况：



<img src="/java-base.pdf-107-2.png">



注意：


1、不管有没有出现异常，finally块中代码都会执行

2、当try和catch中有return时，finally仍然会执行


3、finally是在try中return后面的表达式运算后执行的（此时并没有返回运算后的值，而是先把要返回的值


保存起来，


不管finally中的代码怎么样，返回的值都不会改变，仍然是之前保存的值），所以函数返回值是在finally执


行前确定的


4、 **finally中最好不要包含return** ，否则程序会提前退出，返回值不是try或catch中保存的返回值


以下两种情况要避免在finally中使用return


1. 如果catch块中捕获了异常，并将该异常throw给上级调用者处理，但finally中return了，


那么catch块中的throw就失效了，上级方法调用者是捕获不到异常的


例: 如下代码上级调用者是捕获不到异常的


2、在finally里的return之前执行了其他return ，最终的返回值还是finally中的return


例 : 如下代码返回的是finally里return的5


**在try-catch-finally语句块中，finally语句块中的return/抛出异常（立即结束语句）的优先级最高，**
**程序会优先返回finally语句块中的立即结束语句的结果，此时try-catch语句块中的return/抛出异常（立即**
所以我们在将捕获的异常抛出给调用的上层方法处理时，如果被finally语句块中的return语句覆盖掉了，那么



<img src="/java-base.pdf-108-0.png">

<img src="/java-base.pdf-108-1.png">
**关于try语句块中含有return的报错的问题**


**笔记本：** Java基础


**创建时间：** 2021/10/17 18:03 **更新时间：** 2021/10/17 18:10


**作者：** 彼岸樱速


写代码遇到的问题


try块有return语句，catch块没有return，函数末尾也没有return：


看代码：


编译结果：


1 错误，提示缺少返回语句
有人可能会说，我在try块中不是有return语句吗？为什么会提示缺少return语句呢？这是
因为编译器认为try块中是又可能产生异常操作的，也就是说在return语句之前如果出现异常的
话，那么return语句根本没有机会得到执行，所以编译器会认为缺少return语句。
解决办法:


在catch块中加入return语句，因为一旦出现异常，catch中的语句可以保证函数会有一个返
回值


还是会报错，再来



<img src="/java-base.pdf-109-0.png">

<img src="/java-base.pdf-109-1.png">
<img src="/java-base.pdf-110-0.png">

现在不会报错了，如果finally没有return，如果有多个catch语块，则每个语块都必须要有
return语句不能其中一个有而其他没有


**Java interface 的成员 为什么只能是public final static**


**笔记本：** Java基础


**创建时间：** 2021/10/17 16:30 **更新时间：** 2021/10/17 16:55


**作者：** 彼岸樱速


**Java** **interface** **的成员 为什么只能是public final static**



<img src="/java-base.pdf-111-0.png">



**Java中Interface方法默认访问修饰符为：public abstract**


**Java中Interface常量的默认访问修饰符为：public static final**


验证方式： **反射**


1、Interface代码



<img src="/java-base.pdf-111-1.png">











2、测试代码



<img src="/java-base.pdf-111-2.png">











3、验证结果




<img src="/java-base.pdf-112-0.png">

<img src="/java-base.pdf-112-1.png">
## **java1.8新特性之一——在interface中写实现方法**





简单的代码demo：
interface：



<img src="/java-base.pdf-112-2.png">









impl:



<img src="/java-base.pdf-112-3.png">













总结:interface中的的方法实现用 **default** 修饰之后就可以了，子类就可以直接使用了，当然，
interface中的方法实现也是支持方法覆盖的。如下impl2:



<img src="/java-base.pdf-112-4.png">


















**<<、>>、<<<、>>>位移运算符**


**笔记本：** Java基础


**创建时间：** 2021/10/17 15:50 **更新时间：** 2021/10/17 16:09


**作者：** 彼岸樱速


**要想运算<<、>>、<<<、>>>这些符号**
**首先必须了解** ：





**<<** 表示 **左移** ， **不分正负数，低位补0** ；
正数：比如运算’16<<2’的结果
首先 你要将16转换为二进制数





**16 << 2**

**就是将16的** **二进制补码左移两位** **，** **低位补0** **，那么得到：**





将得到的补码转换为十进制，那么 **16<<2** 的结果为 **64**
**负数** ：比如运算’-16<<2’的结果，首先 你要将-16转换为二进制数





**-16<<2**

就是将16的二进制补码左移两位，低位补0，那么得到：





将得到的原码转换为十进制，那么 **-16<<2** 的结果为 **-64**


**>>** 表示 **右移** ，如果 **该数为正** ，则 **高位补0** ，若为 **负数** ，则 **高位补1** ；
正数：比如运算’16>>2’的结果，首先 你要将16转换为二进制数





16>>2就是将16的二进制补码右移两位，高位补0，那么得到：





将得到的补码转换为十进制，那么 **16>>2** 的结果为 **4**
负数：比如运算’ **-16>>2** ’的结果，首先 你要将-16转换为二进制数




-16>>2就是将16的二进制补码右移两位，高位补1，那么得到：





将得到的原码转换为十进制，那么 **-16>>2** 的结果为 **-4**

**>>>** 表示 **无符号右移** ，也叫 **逻辑右移** ，即若 **该数为正** ，则 **高位补0** ，而若 **该数为负** 数，则 **右移**

**

正数：比如运算’16>>>2’，它的运算过程同等于’16>>2’，
方法参考上面’16>>2’的正数运算。
负数：比如运算’-16>>>2’的结果，首先 你要将-16转换为二进制数(32位)





-16>>>2就是将16的二进制补码右移两位，高位补0，那么得到：





转换为十进制，那么-16>>>2的结果为1073741820


**没有<<<** 符号没有理由，Java的编写规则就是这样定的


**~和^运算符**


**笔记本：** Java基础


**创建时间：** 2021/10/17 15:42 **更新时间：** 2021/10/17 15:48


**作者：** 彼岸樱速


**位异或运算（^）运算规则是** ：
两个数转为二进制，然后从高位开始比较，如果 **相同则为0** ， **不相同则为1** 。


**位非运算符（~）运算规则** ：
如果 **位为0** ， **结果是1** ，如果 **位为1** ， **结果是0** .


比如： **~37** 在Java中，所有数据的表示方法都是以 **补码** 的形式表示，
如果没有特殊说明，Java中的数据类型默认是int,int数据类型的长度是8位，一位是四个字节，
就是32字节，32bit.
8转为二进制是100101.
补码后为： 00000000 00000000 00000000 00100101
取反为：  11111111 11111111 11111111 11011010
因为高位是1，所以原码为负数，负数的补码是其绝对值的原码取反，末尾再加1。
因此，我们可将这个二进制数的补码进行还原：
首先，末尾减1得反码：   11111111 11111111 11111111 11011001
其次，将各位取反得原码： 00000000 00000000 00000000 00100110，此时二进制转原码为
38 所以~37 = -38.


**java & | 运算**


**笔记本：** Java基础


**创建时间：** 2021/10/17 15:30 **更新时间：** 2021/10/17 15:37


**作者：** 彼岸樱速


首先得明白10进制的数和2进制的数转换关系
遵循“8421”原则



<img src="/java-base.pdf-117-0.png">



<img src="/java-base.pdf-117-1.png">



<img src="/java-base.pdf-117-2.png">



这里举的两个例子比较简单，只是拿比较短的2进制数进行比较，长的2进制也是以此类推
那就比较一个长的



<img src="/java-base.pdf-117-3.png">



**总结**



<img src="/java-base.pdf-117-4.png">


**forward和redirect的区别**


**笔记本：** Java基础


**创建时间：** 2021/10/10 1:03 **更新时间：** 2021/10/10 1:05


**作者：** 彼岸樱速


看以下代码：
文件名称：forward.jsp



<img src="/java-base.pdf-118-0.png">



如果运行以上jsp文件，地址栏的内容为

**正确答案: A  你的答案: D (错误)**

```
 http://127.0.0.1:8080/myjsp/forward.jsp

 http://127.0.0.1:8080/myjsp/index.jsp

 http://127.0.0.1:8080/myjsp/index.htm

  http://127.0.0.1:8080/myjsp/forward.htm

```

redirect：请求重定向：客户端行为，本质上为2次请求，地址栏改变，前一次请求对象消失。举例：你去
银行办事（forward.jsp），结果告诉你少带了东西，你得先去公安局办(index.html)临时身份证,这时你就
会走出银行，自己前往公安局，地址栏变为index.html.

forward：请求转发:服务器行为，地址栏不变。举例：你把钱包落在出租车上，你去警察局
（forward.jsp）报案，警察局说钱包落在某某公司的出租车上（index.html)，这时你不用亲自去找某某公
司的出租车,警察局让出租车自己给你送来，你只要在警察局等就行。所以地址栏不变，依然为
forward.jsp


forward和redirect是最常问的两个问题
forward，服务器获取跳转页面内容传给用户，用户地址栏不变
redirect，是服务器向用户发送转向的地址，redirect后地址栏变成新的地址

因此这个题是A


**servlet生命周期**


**笔记本：** Java基础


**创建时间：** 2021/10/10 0:53 **更新时间：** 2021/10/10 0:56


**作者：** 彼岸樱速


**Servlet的生命周期分为5个阶段：加载、创建、初始化、处理客户请求、卸载。**
(1)加载：容器通过类加载器使用servlet类对应的文件加载servlet
(2)创建：通过调用servlet构造函数创建一个servlet对象
(3)初始化：调用init方法初始化
(4)处理客户请求：每当有一个客户请求，容器会创建一个线程来处理客户请求
(5)卸载：调用destroy方法让servlet自己释放其占用的资源


**servlet在多线程下其本身并不是线程安全的。**
如果在类中定义成员变量，而在service中根据不同的线程对该成员变量进行更改，那么在并发的时候就会引
起错误。最好是在方法中，定义局部变量，而不是类变量或者对象的成员变量。由于方法中的局部变量是在栈
中，彼此各自都拥有独立的运行空间而不会互相干扰，因此才做到线程安全。


**Java符号优先级**


**笔记本：** Java基础


**创建时间：** 2021/10/8 12:24 **更新时间：** 2021/10/8 12:25


**作者：** 彼岸樱速



<img src="/java-base.pdf-120-0.png">
**instanceof**


**笔记本：** Java基础


**创建时间：** 2021/9/24 23:17 **更新时间：** 2021/9/24 23:37


**作者：** 彼岸樱速


**目录**


1、obj 必须为引用类型，不能是基本类型


2、obj 为 null


3、obj 为 class 类的实例对象


4、obj 为 class 接口的实现类


5、obj 为 class 类的直接或间接子类


6、问题


7、深究原理


8、instanceof 的实现策略


instanceof 严格来说是Java中的一个双目运算符，用来测试一个对象是否为一个类的实例，用法
为：





其中 obj 为一个对象，Class 表示一个类或者一个接口，
当 obj 为 Class 的对象，或者是其直接或间接子类，或者是其接口的实现类，
结果result 都返回 true，否则返回false。


注意：编译器会检查 obj 是否能转换成右边的class类型，如果不能转换则直接报错，如果不能确
定类型，则通过编译，具体看运行时定。







instanceof 运算符只能用作对象的判断。




```
 System.out.println(null instanceof Object);//false

```

                                                 关于 null 类型的描述在官方文档：https://docs.oracle.com/javase/specs/jls/se7/html/jls
4.html#jls-4.1 有一些介绍。一般我们知道Java分为两种数据类型，


一种是 **基本数据类型** ，有八个分别是 **byte short int long float double char boolean,**


一种是 **引用类型** ，包括 **类，接口，数组** 等等。而Java中还有一种 **特殊的 null 类型** ，该类型没有
名字，所以不可能声明为 null 类型的变量或者转换为 null 类型，null 引用是 null 类型表达式唯一可
能的值，null 引用也可以转换为任意引用类型。我们不需要对 null 类型有多深刻的了解，我们只需要
知道 null 是可以成为任意引用类型的 **特殊符号** 。


[在 JavaSE规范 中对 instanceof 运算符的规定就是：如果 obj 为 null，那么将返回 false。](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.20.2)




```
 Integer integer = new Integer(1);
 System.out.println(integer instanceof Integer);//true

```

这没什么好说的，最普遍的一种用法。


了解Java 集合的，我们知道集合中有个上层接口 List，其有个典型实现类 ArrayList


所以我们可以用 instanceof 运算符判断 某个对象是否是 List 接口的实现类，如果是返回 true，
否则返回 false

```
  public class ArrayList`<`E`>` extends AbstractList`<`E`>`
  implements List`<`E`>`, RandomAccess, Cloneable, java.io.Serializable

  ArrayList arrayList = new ArrayList();
  System.out.println(arrayList instanceof List);//true

```

或者反过来也是返回 true







我们新建一个父类 Person.class，然后在创建它的一个子类 Man.class

```
 class Person {

 }

 class Man extends Person{

 }

 Person p1 = new Person();
 Person p2 = new Man();
 Man m1 = new Man();
 System.out.println(p1 instanceof Man);//false
 System.out.println(p2 instanceof Man);//true
 System.out.println(m1 instanceof Man);//true

```

注意第一种情况， p1 instanceof Man ，Man 是 Person 的子类，Person 不是 Man 的子类，
所以返回结果为 false。





前面我们说过 **编译器会检查 obj 是否能转换成右边的class类型，如果不能转换则直接报错，如果**
**不能确定类型，则通过编译，具体看运行时定。**


看如下几个例子：



<img src="/java-base.pdf-122-4.png">



按照我们上面的说法，这里就存在问题了，Person 的对象 p1 很明显不能转换为 String 对象，那
么自然 Person 的对象 p1 instanceof String 不能通过编译，但为什么 p1 instanceof List 却能通过
编译呢？而 instanceof List<Person> 又不能通过编译了？





我们可以看Java语言规范Java SE 8 版：
[https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.20.2)


<img src="/java-base.pdf-123-0.png">

如果用伪代码描述：



<img src="/java-base.pdf-123-1.png">



也就是说有表达式 obj instanceof T，instanceof 运算符的 obj 操作数的类型必须是引用类型或
空类型; 否则，会发生编译时错误。


如果 obj 强制转换为 T 时发生编译错误，则关系表达式的 instanceof 同样会产生编译时错误。
在这种情况下，表达式实例的结果永远为false。


在运行时，如果 T 的值不为null，并且 obj 可以转换为 T 而不引发ClassCastException，则
instanceof运算符的结果为true。 否则结果是错误的


简单来说就是： **如果 obj 不为 null 并且 (T) obj 不抛 ClassCastException 异常则该表达式值**
**为 true ，否则值为 false 。**


所以对于上面提出的问题就很好理解了，为什么 p1 instanceof String 编译报错，因为
(String)p1 是不能通过编译的，而 (List)p1 可以通过编译。





JavaSE 8 instanceof 的实现算法：
[https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.instanceof](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.instanceof)


1、obj如果为null，则返回false；否则设S为obj的类型对象，剩下的问题就是检查S是否为T的子
类型；



<img src="/java-base.pdf-123-3.png">
2、如果S == T，则返回true；


3、接下来分为3种情况，之所以要分情况是因为instanceof要做的是“子类型检查”，而Java语
言的类型系统里数组类型、接口类型与普通类类型三者的子类型规定都不一样，必须分开来讨论。


①、S是数组类型：如果 T 是一个类类型，那么T必须是Object；如果 T 是接口类型，那么 T 必
须是由数组实现的接口之一；


②、接口类型：对接口类型的 instanceof 就直接遍历S里记录的它所实现的接口，看有没有跟T一
致的；


③、类类型：对类类型的 instanceof 则是遍历S的super链（继承链）一直到Object，看有没有
跟T一致的。遍历类的super链意味着这个算法的性能会受类的继承深度的影响。


**详细分析Java8中default关键字**


**笔记本：** Java基础


**创建时间：** 2021/9/14 11:27 **更新时间：** 2021/9/14 14:27


**作者：** 彼岸樱速


**一、简介**


default关键字：与public、private等都属于修饰符关键字，与其他两个不同之处在于default关键


字大部分都应用于接口。


**二、出现的理由**


总所周知在使用接口的时候，很多人都会遇到一个很尴尬的事情，在实现某个接口的时候，需要


实现该接口所有的方法。这个时候default关键字就派上用场了。通过 **default** 关键字定义的方


法，集成该接口的方法 **不需要去实现该方法** 。


**三、例子**


创建一个person类， 使用default修饰该方法


实现该接口的类不需要去实现该方法





main方法


运行结果


**四、解决冲突**


如果集成的两个接口有同一个default定义的方法


编译器报错



<img src="/java-base.pdf-125-3.png">

<img src="/java-base.pdf-125-4.png">
<img src="/java-base.pdf-126-0.png">

解决办法（实现接口方法）



<img src="/java-base.pdf-126-1.png">




**java序列化**


**笔记本：** Java基础


**创建时间：** 2021/9/13 14:23 **更新时间：** 2021/9/13 16:07


**作者：** 彼岸樱速



<img src="/java-base.pdf-127-0.png">





**序列化：将对象写入到** **IO** **流中**


**反序列化：从** **IO** **流中恢复对象**


**意义：序列化机制允许将实现序列化的** **Java** **对象转换位字节序列，这些字节序列**
**可以保存在磁盘上，或通过网络传输，以达到以后恢复成原来的对象。序列化机**
**制使得对象可以脱离程序的运行而独立存在。**


**使用场景：所有可在网络上传输的对象都必须是可序列化的，** 比如 RMI （ remote
method invoke, 即远程方法调用），传入的参数或返回的对象都是可序列化
的，否则会出错； **所有需要保存到磁盘的** **java** **对象都必须是可序列化的。通常建**
**议：程序创建的每个** **JavaBean** **类都实现** **Serializeable** **接口。**





如果需要将某个对象保存到磁盘上或者通过网络传输，那么这个类应该实现
**Serializable** 接口或者 **Externalizable** 接口之一。


**1、Serializable**


**1.1** **普通序列化**


Serializable 接口是一个标记接口，不用实现任何方法。一旦实现了此接口，该类的
对象就是可序列化的。


**1、序列化步骤：**


**步骤一：创建一个** **ObjectOutputStream** **输出流；**


**步骤二：调用** **ObjectOutputStream** **对象的** **writeObject** **输出可序列化对象。**

```
public class Person implements Serializable {

private String name;

private int age;

/**

```

_**`*`**_ **我不提供无参构造器**

```
*/

public Person(String name, int age) {

```

<img src="/java-base.pdf-128-0.png">













我们会发现项目目录里面多了一个文件，输出结果截图


**2、反序列化步骤：**


**步骤一：创建一个** **ObjectInputStream** **输入流；**


**步骤二：调用** **ObjectInputStream** **对象的** **readObject()** **得到序列化的对象。**



<img src="/java-base.pdf-128-1.png">

<img src="/java-base.pdf-128-2.png">
```
}
}

```

**what????** **输出告诉我们，反序列化并不会调用构造方法。反序列的对象是由** **JVM**
**自己生成的对象，不通过构造方法生成。**


**1.2** **成员是引用的序列化**


**如果一个可序列化的类的成员不是基本类型，也不是** **String** **类型，那这个引用类型也**
**必须是可序列化的；否则，会导致此类不能序列化。**


看例子，我们新增一个 Teacher 类。将 Person 去掉实现 Serializable 接口代码。


输出结果



<img src="/java-base.pdf-129-0.png">

<img src="/java-base.pdf-129-1.png">



我们看到程序直接报错，因为 Person 类的对象是不可序列化的，这导致了 Teacher 的对象
不可序列化


**1.3** **同一对象序列化多次的机制**


**同一对象序列化多次，会将这个对象序列化多次吗？** 答案是 **否定** 的。

```
public class WriteTeacher {

```

<img src="/java-base.pdf-130-0.png">

依次将 t1 、 t2 、 person 、 t2 对象序列化到文件 teacher.txt 文件中。


**注意：反序列化的顺序与序列化时的顺序一致** 。


从输出结果可以看出， **Java** **序列化同一对象，并不会将此对象序列化多次得到多个**
**对象。**


**Java** **序列化算法**


1. **所有保存到磁盘的对象都有一个序列化编码号**


2. **当程序试图序列化一个对象时，会先检查此对象是否已经序列化过，只有此对象**

**从未（在此虚拟机）被序列化过，才会将此对象序列化为字节序列输出。**


3. **如果此对象已经序列化过，则直接输出编号即可。**


图示上述序列化过程。



<img src="/java-base.pdf-130-1.png">
<img src="/java-base.pdf-131-0.png">

**1.4 java** **序列化算法潜在的问题**


由于 java 序利化算法不会重复序列化同一个对象，只会记录已序列化对象的编号。 **如**
**果序列化一个可变对象（对象内的内容可更改）后，更改了对象内容，再次序列化，**
**并不会再次将此对象转换为字节序列，而只是保存序列化编号。**


打个断点



<img src="/java-base.pdf-131-1.png">
<img src="/java-base.pdf-132-0.png">

**1.5** **可选的自定义序列化**





<img src="/java-base.pdf-132-2.png">

从输出我们看到， **使用** **transient** **修饰的属性，** **java** **序列化时，会忽略掉此字段，所**
**以反序列化出的对象，被** **transient** **修饰的属性是默认值。对于引用类型，值是**
**null** **；基本类型，值是** **0** **；** **boolean** **类型，值是** **false** **。**


使用 transient 虽然简单，但将此属性完全隔离在了序列化之外。 java 提供了 **可选的**
**自定义序列化。** 可以进行控制序列化的方式，或者对序列化数据进行编码加密等。



<img src="/java-base.pdf-133-1.png">







1. **更彻底的自定义序列化**


ANY-ACCESS-MODIFIER Object writeReplace() throws
ObjectStreamException;


ANY-ACCESS-MODIFIER Object readResolve() throws
ObjectStreamException;


**writeReplace** **：在序列化时，会先调用此方法，再调用** **writeObject** **方法。此**
**方法可将任意对象代替目标序列化对象**


**readResolve** **：反序列化时替换反序列化出的对象，反序列化出来的对象被立即**
**丢弃。此方法在** **readeObject** **后调用。**

```
public class Person implements Serializable {

```


<img src="/java-base.pdf-133-3.png">
<img src="/java-base.pdf-134-0.png">

**readResolve** **常用来反序列单例类，保证单例类的唯一性。**


**注意：** **readResolve** **与** **writeReplace** **的访问修饰符可以是** **private** **、** **protected** **、**
**public** **，如果父类重写了这两个方法，子类都需要根据自身需求重写，这显然不是一**
**个好的设计。通常建议对于** **final** **修饰的类重写** **readResolve** **方法没有问题；否则，**
**重写** **readResolve** **使用** **private** **修饰。**


**2、Externalizable：强制自定义序列化**


通过实现 Externalizable 接口，必须实现 writeExternal 、 readExternal 方法。



<img src="/java-base.pdf-134-1.png">










































<img src="/java-base.pdf-135-0.png">





















**注意：** **Externalizable** **接口不同于** **Serializable** **接口，实现此接口必须实现接口中**
**的两个方法实现自定义序列化，这是强制性的；特别之处是必须提供** **pulic** **的无参构**
**造器，因为在反序列化的时候需要反射创建对象。**


**3、两种序列化对比**

|实现Serializable接口|实现Externalizable接口|
|---|---|
|系统自动存储必要的信息|程序员决定存储哪些信息|
|Java内建支持，易于实现，只需要实现<br>该接口即可，无需任何代码支持|必须实现接口内的两个方法|
|性能略差|性能略好|



**虽然** **Externalizable** **接口带来了一定的性能提升，但变成复杂度也提高了，所以一**
**般通过实现** **Serializable** **接口进行序列化。**





我们知道， **反序列化必须拥有** **class** **文件，但随着项目的升级，** **class** **文件也会升**
**级，序列化怎么保证升级前后的兼容性呢？**


java 序列化提供了一个 private static final long **serialVersionUID** 的序列化版
本号，只有版本号相同，即使更改了序列化属性，对象也可以正确被反序列化回来。


如果反序列化使用的 **class** **的版本号** 与序列化时使用的 **不一致** ，反序列化会 **报**
**InvalidClassException** **异常。**



<img src="/java-base.pdf-135-2.png">
<img src="/java-base.pdf-136-0.png">

**序列化版本号可自由指定，如果不指定，** **JVM** **会根据类信息自己计算一个版本号，这**
**样随着** **class** **的升级，就无法正确反序列化；不指定版本号另一个明显隐患是，不利**
**于** **jvm** **间的移植，可能** **class** **文件没有更改，但不同** **jvm** **可能计算的规则不一样，这**
**样也会导致无法反序列化。**


什么情况下需要修改 serialVersionUID 呢？分三种情况。


如果只是修改了方法，反序列化不容影响，则无需修改版本号；


如果只是修改了静态变量，瞬态变量（ transient 修饰的变量），反序列化不受影
响，无需修改版本号；


如果修改了非瞬态变量，则可能导致反序列化失败。 **如果新类中实例变量的类型**
**与序列化时类的类型不一致，则会反序列化失败，这时候需要更改**
**serialVersionUID** **。** 如果只是新增了实例变量，则反序列化回来新增的是默认
值；如果减少了实例变量，反序列化时会忽略掉减少的实例变量。





1. 所有需要网络传输的对象都需要实现序列化接口，通过建议所有的 javaBean 都

实现 Serializable 接口。


2. 对象的类名、实例变量（包括基本类型，数组，对其他对象的引用）都会被序列

化；方法、类变量、 transient 实例变量都不会被序列化。


3. 如果想让某个变量 **不被序列化** ，使用 **transient** 修饰。


4. 序列化对象的引用类型成员变量，也必须是可序列化的，否则，会报错。


5. 反序列化时必须有序列化对象的 class 文件。


6. 当通过文件、网络来读取序列化后的对象时，必须按照实际写入的顺序读取。


7. 单例类序列化，需要重写 readResolve() 方法；否则会破坏单例原则。


8. 同一对象序列化多次，只有第一次序列化为二进制流，以后都只是保存序列化编

号，不会重复序列化。


9. 建议所有可序列化的类加上 serialVersionUID 版本号，方便项目升级。


**for(;;)和while(true)的区别**


**笔记本：** Java基础


**创建时间：** 2021/9/11 15:34 **更新时间：** 2021/9/11 15:34


**作者：** 彼岸樱速


**为啥:如下（底层完全不同）**


“死循环”有两种写法：for(;;)和while(true)，


两者有啥区别，为啥源码中多数是for( ; ; )这种形式的，



<img src="/java-base.pdf-137-0.png">





对比之下，for (；；)指令少，不占用 **寄存器** ，而且没有判断跳转，比while (1)好。


也就是说两者在在宏观上完全一样的逻辑，但是底层完全不一样，for相对于来说更加简洁明了。


**雪花算法的原理和实现Java**


**笔记本：** Java基础


**创建时间：** 2021/8/26 15:53 **更新时间：** 2021/8/26 16:02


**作者：** 彼岸樱速


**SnowFlake 算法，是 Twitter 开源的分布式 id 生成算法。其核心思想就是：使用一个 64 bit**
**的 long 型的数字作为全局唯一 id。在分布式系统中的应用十分广泛，且ID 引入了时间戳，基**
**本上保持自增的，后面的代码中有详细的注解。**


这 64 个 bit 中，其中 **1 个 bit 是不用** 的，然后用其中的 **41 bit** 作为 **毫秒数** ，用 **10 bit** 作为 **工**
**作机器 id** ， **12 bit** 作为 **序列号** 。


给大家举个例子吧，比如下面那个 64 bit 的 long 型数字：


第一个部分，是 1 个 bit：0，这个是无意义的。


第二个部分是 41 个 bit：表示的是时间戳。


第三个部分是 5 个 bit：表示的是机房 id，10001。


第四个部分是 5 个 bit：表示的是机器 id，1 1001。


第五个部分是 12 个 bit：表示的序号，就是某个机房某台机器上这一毫秒内同时生成的 id 的序
号，0000 00000000。


①1 bit：是不用的，为啥呢？


因为二进制里第一个 bit 为如果是 1，那么都是负数，但是我们生成的 id 都是正数，所以第一
个 bit 统一都是 0。


②41 bit：表示的是时间戳，单位是毫秒。


41 bit 可以表示的数字多达 2^41 - 1，也就是可以标识 2 ^ 41 - 1 个毫秒值，换算成年就是表
示 69 年的时间。


③10 bit：记录工作机器 id，代表的是这个服务最多可以部署在 2^10 台机器上，也就是 1024
台机器。


但是 10 bit 里 5 个 bit 代表机房 id，5 个 bit 代表机器 id。意思就是最多代表 2 ^ 5 个机房
（32 个机房），每个机房里可以代表 2 ^ 5 个机器（32 台机器），也可以根据自己公司的实
际情况确定。


④12 bit：这个是用来记录同一个毫秒内产生的不同 id。



<img src="/java-base.pdf-138-0.png">
12 bit 可以代表的最大正整数是 2 ^ 12 - 1 = 4096，也就是说可以用这个 12 bit 代表的数字
来区分同一个毫秒内的 4096 个不同的 id。


简单来说，你的某个服务假设要生成一个全局唯一 id，那么就可以发送一个请求给部署了
SnowFlake 算法的系统，由这个 SnowFlake 算法系统来生成唯一 id。


这个 SnowFlake 算法系统首先肯定是知道自己所在的机房和机器的，比如机房 id = 17，机器
id = 12。


接着 SnowFlake 算法系统接收到这个请求之后，首先就会用二进制位运算的方式生成一个 64
bit 的 long 型 id，64 个 bit 中的第一个 bit 是无意义的。


接着 41 个 bit，就可以用当前时间戳（单位到毫秒），然后接着 5 个 bit 设置上这个机房 id，
还有 5 个 bit 设置上机器 id。


最后再判断一下，当前这台机房的这台机器上这一毫秒内，这是第几个请求，给这次生成 id 的
请求累加一个序号，作为最后的 12 个 bit。


最终一个 64 个 bit 的 id 就出来了，类似于：


这个算法可以保证说，一个机房的一台机器上，在同一毫秒内，生成了一个唯一的 id。可能一
个毫秒内会生成多个 id，但是有最后 12 个 bit 的序号来区分开来。


下面我们简单看看这个 SnowFlake 算法的一个代码实现，这就是个示例，大家如果理解了这个
意思之后，以后可以自己尝试改造这个算法。


总之就是用一个 64 bit 的数字中各个 bit 位来设置不同的标志位，区分每一个 id。


SnowFlake 算法的实现代码如下：


public class IdWorker {
//因为二进制里第一个 bit 为如果是 1，那么都是负数，但是我们生成的 id 都是正数，所以
第一个 bit 统一都是 0。
//机器ID 2进制5位 32位减掉1位 31个
private long workerId;
//机房ID 2进制5位 32位减掉1位 31个
private long datacenterId;
//代表一毫秒内生成的多个id的最新序号 12位 4096 -1 = 4095 个
private long sequence;
//设置一个时间初始值  2^41 - 1  差不多可以用69年
private long twepoch = 1585644268888L;
//5位的机器id
private long workerIdBits = 5L;
//5位的机房id
private long datacenterIdBits = 5L;
//每毫秒内产生的id数 2 的 12次方
private long sequenceBits = 12L;
// 这个是二进制运算，就是5 bit最多只能有31个数字，也就是说机器id最多只能是32以内
private long maxWorkerId = -1L ^ (-1L << workerIdBits);


// 这个是一个意思，就是5 bit最多只能有31个数字，机房id最多只能是32以内
private long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);
private long workerIdShift = sequenceBits;
private long datacenterIdShift = sequenceBits + workerIdBits;
private long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;
private long sequenceMask = -1L ^ (-1L << sequenceBits);
//记录产生时间毫秒数，判断是否是同1毫秒
private long lastTimestamp = -1L;
public long getWorkerId(){
return workerId;
}
public long getDatacenterId() {
return datacenterId;
}
public long getTimestamp() {
return System.currentTimeMillis();
}
public IdWorker(long workerId, long datacenterId, long sequence) {
// 检查机房id和机器id是否超过31 不能小于0
if (workerId > maxWorkerId || workerId < 0) {
throw new IllegalArgumentException(
String.format("worker Id can't be greater than %d or less than
0",maxWorkerId));
}
if (datacenterId > maxDatacenterId || datacenterId < 0) {
throw new IllegalArgumentException(
String.format("datacenter Id can't be greater than %d or less than
0",maxDatacenterId));
}
this.workerId = workerId;
this.datacenterId = datacenterId;
this.sequence = sequence;
}
// 这个是核心方法，通过调用nextId()方法，让当前这台机器上的snowflake算法程序生成一
个全局唯一的id
public synchronized long nextId() {
// 这儿就是获取当前时间戳，单位是毫秒
long timestamp = timeGen();
if (timestamp < lastTimestamp) {
System.err.printf(
"clock is moving backwards. Rejecting requests until %d.", lastTimestamp);
throw new RuntimeException(
String.format("Clock moved backwards. Refusing to generate id for %d
milliseconds",
lastTimestamp - timestamp));
}
// 下面是说假设在同一个毫秒内，又发送了一个请求生成一个id
// 这个时候就得把seqence序号给递增1，最多就是4096
if (lastTimestamp == timestamp) {
// 这个意思是说一个毫秒内最多只能有4096个数字，无论你传递多少进来，
//这个位运算保证始终就是在4096这个范围内，避免你自己传递个sequence超过了
4096这个范围
sequence = (sequence + 1) & sequenceMask;
//当某一毫秒的时间，产生的id数 超过4095，系统会进入等待，直到下一毫秒，系统继
续产生ID
if (sequence == 0) {
timestamp = tilNextMillis(lastTimestamp);
}
} else {
sequence = 0;
}


// 这儿记录一下最近一次生成id的时间戳，单位是毫秒
lastTimestamp = timestamp;
// 这儿就是最核心的二进制位运算操作，生成一个64bit的id
// 先将当前时间戳左移，放到41 bit那儿；将机房id左移放到5 bit那儿；将机器id左移放
到5 bit那儿；将序号放最后12 bit
// 最后拼接起来成一个64 bit的二进制数字，转换成10进制就是个long型
return ((timestamp - twepoch) << timestampLeftShift) |
(datacenterId << datacenterIdShift) |
(workerId << workerIdShift) | sequence;
}
/**
- 当某一毫秒的时间，产生的id数 超过4095，系统会进入等待，直到下一毫秒，系统继续产
生ID
- @param lastTimestamp
- @return

*/
private long tilNextMillis(long lastTimestamp) {
long timestamp = timeGen();
while (timestamp <= lastTimestamp) {
timestamp = timeGen();
}
return timestamp;
}
//获取当前时间戳
private long timeGen(){
return System.currentTimeMillis();
}
/**
- main 测试类
- @param args
*/
public static void main(String[] args) {
System.out.println(1&4596);
System.out.println(2&4596);
System.out.println(6&4596);
System.out.println(6&4596);
System.out.println(6&4596);
System.out.println(6&4596);
//    IdWorker worker = new IdWorker(1,1,1);
//    for (int i = 0; i < 22; i++) {
//      System.out.println(worker.nextId());
//    }
}
}
SnowFlake算法的优点：


（1）高性能高可用：生成时不依赖于数据库，完全在内存中生成。


（2）容量大：每秒中能生成数百万的自增ID。


（3）ID自增：存入数据库中，索引效率高。


SnowFlake算法的缺点：


依赖与系统时间的一致性，如果系统时间被回调，或者改变，可能会造成id冲突或者重复。


实际中我们的机房并没有那么多，我们可以改进改算法，将10bit的机器id优化，成业务表或者
和我们系统相关的业务。


**java类中的变量以及方法的执行顺序**


**笔记本：** Java基础


**创建时间：** 2021/8/26 11:44 **更新时间：** 2021/8/26 15:32


**作者：** 彼岸樱速


**URL：** about:blank


**1. java程序的类初始化以及方法的执行顺序**


首先应该明白java的类加载机制有关变量赋值的过程：


在 **连接** 阶段的 **准备** 阶段为 **静态变量分配内存并设置初值** ;对于被final修饰的静态变量，则会直接
赋常量值。


而对于一个没有父类的类，其加载过程应该为下面的顺序：



<img src="/java-base.pdf-143-0.png">



**1.1. 对于有父类的子类进行类加载的顺序**


初始化的过程其实就是一个执行类构造器< clint>方法的过程，类构造器执行的特点和注意事
项：


1).类构造器< clint>方法是由编译器自动收集类中所有类变量(静态非final变量)赋值动作和静
态初始化块(static{……})中的语句合并产生的，编译器收集的顺序是由语句在源文件中出现的
顺序决定。 **静态初始化块中只能访问到定义在它之前的类变量** ，定义在它之后的 **类变量** ，在前
面的静态初始化中 **可以赋值** ，但是 **不能访问** 。


2).类构造器< clint>方法与实例构造器< init>方法不同，它不需要显式地调用父类构造器方
法，虚拟机会保证在 **调用子类构造器方法之前** ， **父类的构造器< clinit>方法已经执行完毕** 。


3).由于父类构造器< clint>方法先与子类构造器执行，因此 **父类中定义的静态初始化块要先于**
**子类的类变量赋值操作** 。


4). 类构造器< clint>方法对于类和接口并不是必须的，如果一个类中没有静态初始化块，也
没有类变量赋值操作，则编译器可以不为该类生成类构造器< clint>方法。


在深入理解java虚拟机中有上面的一段话，所以对于有父类的子类的加载顺序，应该为先加载父
类，然后再加载子类。



<img src="/java-base.pdf-144-0.png">








































































<img src="/java-base.pdf-145-0.png">

























由此可见，在导出类构造器构造前总会默认调用基类构造器(从Object类开始调用)，并且父类的
静态代码块以及静态变量也会先于构造器进行初始化。


**原码、反码、补码**


**笔记本：** Java基础


**创建时间：** 2021/8/25 10:13 **更新时间：** 2021/8/25 10:40


**作者：** 彼岸樱速

### **漫画：为什么计算机用补码存储数据？**



<img src="/java-base.pdf-146-0.png">

<img src="/java-base.pdf-146-1.png">

<img src="/java-base.pdf-146-2.png">
<img src="/java-base.pdf-147-0.png">

<img src="/java-base.pdf-147-1.png">

<img src="/java-base.pdf-147-2.png">

<img src="/java-base.pdf-147-3.png">


<img src="/java-base.pdf-148-0.png">

<img src="/java-base.pdf-148-1.png">

<img src="/java-base.pdf-148-2.png">

<img src="/java-base.pdf-148-3.png">
<img src="/java-base.pdf-149-0.png">



<img src="/java-base.pdf-149-2.png">



<img src="/java-base.pdf-149-3.png">

<img src="/java-base.pdf-149-4.png">


<img src="/java-base.pdf-150-0.png">



<img src="/java-base.pdf-150-2.png">

<img src="/java-base.pdf-150-3.png">



<img src="/java-base.pdf-150-4.png">


<img src="/java-base.pdf-151-0.png">

<img src="/java-base.pdf-151-1.png">



<img src="/java-base.pdf-151-3.png">


<img src="/java-base.pdf-152-0.png">



<img src="/java-base.pdf-152-2.png">

<img src="/java-base.pdf-152-3.png">


<img src="/java-base.pdf-153-0.png">



<img src="/java-base.pdf-153-2.png">

<img src="/java-base.pdf-153-3.png">
<img src="/java-base.pdf-154-0.png">

<img src="/java-base.pdf-154-1.png">



<img src="/java-base.pdf-154-3.png">



<img src="/java-base.pdf-154-4.png">

<img src="/java-base.pdf-154-5.png">


<img src="/java-base.pdf-155-0.png">

<img src="/java-base.pdf-155-1.png">

<img src="/java-base.pdf-155-2.png">



<img src="/java-base.pdf-155-4.png">


**重温servlet**


**笔记本：** Java基础


**创建时间：** 2021/8/24 11:42 **更新时间：** 2021/8/24 14:32


**作者：** 彼岸樱速


**目录**





对呀！现在都2020年了，时间过得真快，本文来说说现在Servlet它还有必要学吗？


因为Servlet已经是一个非常非常古老的技术了，而且在实际开发中几乎不会用到，在面


试中也几乎不会问到Servlet相关的知识。所以我们不需要学习Servlet了吗？这样想就大


错特错了。我们后面会学习到Struts2和SpringMVC框架，它两的底层都是跟Servlet有


关，所以Servlet还是很有必要的学习的，最好不要跳过它。我们只有打下坚实的基础，


后面的框架学习起来才能得心应手。




Servlet（Server Applet）是Java Servlet的简称，称为小服务程序或服务连接


器，用Java编写的服务器端程序，主要功能在于交互式地浏览和修改数据，生成动态Web


内容。这是百度百科上的一段话。说简单点Servlet就是对客户端发送过来的请求进行处


理，并且作出相应的响应，其本质就是一个实现了Servlet接口的实现类。其过程如下：


1. 客户端发送请求至Web服务器端。


2. 服务器将请求信息发送至Servlet。


3. Servlet 生成响应内容并将其传给服务器。响应内容动态生成，通常取决于客户端的请

求。


4. 服务器将响应返回给客户端。


注：servlet程序是由servlet容器（即tomcat服务器）进行管理，包括实例


化、初始化、服务、销毁的过程都由tomca在指定时间内完成。


服务器的三大组件：


servlet：用于处理请求和响应


filter：用于过滤请求和响应


listener：用于监听服务器的状态



<img src="/java-base.pdf-158-0.png">



在创建Servlet之前需要提前配置好环境：1、安装好JDK；2、开发工具Eclipse或


IDEA(推荐)；3、安装Tomcat。这三个条件是必须的，具体怎么配置网上教程很多，这


里不多BB。


创建Servlet程序的流程如下：


编写一个Java类，然后继承HttpServlet（或者继承GenericServlet，又或者直接实
现Servlet接口）。



<img src="/java-base.pdf-158-2.png">

<img src="/java-base.pdf-158-3.png">


注意：我们一般都是继承HTTPServlet，因为HttpServlet是指能够处理HTTP协议请


求的Servlet，它在原有Servlet接口上添加了一些与HTTP协议处理方法，它比Servlet接


口的功能更为强大。因此开发人员在编写Servlet时，通常应继承这个类，而避免直接去


实现Servlet接口和继承GenericServlet。而且HttpServlet在实现Servlet接口时，覆写


了service方法，该方法体内的代码会自动判断用户的请求方式，如为GET请求，则调用


HttpServlet的doGet方法，如为Post请求，则调用doPost方法。因此，开发人员在编写


Servlet时， **通常只需要覆写doGet或doPost方法** ，而不要去覆写service方法。


重写HttpServlet类中的doGet和doPost方法（IDEA快捷键Ctrl+O）。



<img src="/java-base.pdf-159-0.png">

<img src="/java-base.pdf-159-1.png">



使用web.xml文件或者注解对servlet进行配置。推荐使用注解


前面两步没什么可说的，重点是在配置web.xml文件上，这一步决定了我们的请求和


响应是哪个Servlet来完成的。上面说到配置Servlet有两种方式：


**一种是使用web.xml文件配置，另外一种就是使用注解配置** ，


所以下面我们来详解介绍这两种配置方式：

我们打开WEB-INF/web.xml文件，在 `<web-app>` 元素中编写一个 `<servlet>` 元素用于

配置一个Servlet，它包含有两个主要的子元素： `<servlet-name>` 和 `<servlet-class>` ，

分别用于设置Servlet的名称和Servlet的完整类名。另外一个 `<servlet-mapping>` 元素用

于映射一个已注册的Servlet的一个对外访问路径，它包含有两个子元素： `<servlet-`

`name>` 和 `<url-pattern>` ，分别用于指定映射到哪个Servlet和Servlet的对外访问路径。配


置详细信息如下：

```
&lt;?xml version="1.0" encoding="UTF-8"?>

```

<img src="/java-base.pdf-160-0.png">

<img src="/java-base.pdf-160-1.png">





完成上面的web.xml配置后，当服务器运行之后，Servlet程序就可以被外界访问


了，打开浏览器访问如下地址：http://localhost:8080/HelloServlet。


注：如果访问不了则在访问地址加上项目名：http://localhost:8080/{项目名


称}/HelloServlet


然后查看可知打印数据：

补充：同一个Servlet可以被映射到多个URL上，即多个 `<servlet-mapping>` 元素的

`<servlet-name>` 子元素的设置值可以是同一个Servlet的名称。 例如：



<img src="/java-base.pdf-160-4.png">
<img src="/java-base.pdf-161-0.png">

通过上面的配置，当我们想访问名称是MyServlet的Servlet，可以使用如下的几个


地址去访问，但结果都是访问的同一个Servlet：


http://localhost:8080/HelloServlet


http://localhost:8080/HelloServlet/HelloServlet


http://localhost:8080/HelloServlet/HelloServlet/HelloServlet


**注：用了注解，web.xml中就不能再配置该Servlet了**


我们都知道使用web.xml文件来配置是很头痛的事情，随着系统的开发，配置文件肯


定会越来越多，里面的文件也会看的眼花缭乱。所以Servlet3.0之后提供了注解


(annotation)，使得不再需要在web.xml文件中进行Servlet的配置，而是使用注解


**@WebServlet** 代替了web.xml，从而简化开发流程。

下面是注解 `@WebServlet` 源码中的属性列表:








|属性名|类型|描述|
|---|---|---|
|name|String|指定Servlet的 name属性，等价于<servlet-<br>name>。如果没有显式指定，则该 Servlet的取值即<br>为类的全限定名。|
|value|String[]|该属性等价于下面urlPatterns属性。这两个属性不能<br>同时使用。|
|urlPatterns|String[]|指定一组Servlet的URL匹配模式，等价于<url-<br>pattern>标签。|
|loadOnStartup|int|指定Servlet的加载顺序，等价于<load-on-startup><br>标签。|
|initParams|WebInitParam[]|指定一组Servlet初始化参数，等价于<init-param><br>标签|


|Col1|Col2|标签|
|---|---|---|
|asyncSupported|boolean|声明Servlet是否支持异步操作，等价于<async-<br>supported>标签。|
|smallIcon|String|此Servlet的小图标。|
|largeIcon|String|此Servlet的大图标。|
|description|String|该Servlet的描述信息，等价于<description>标签。|
|displayName|String|该Servlet的显示名，通常配合工具使用，等价于<br><display-name>标签。|


使用注解配置Servlet的示例如下：



<img src="/java-base.pdf-162-0.png">

<img src="/java-base.pdf-162-1.png">


上面实现的效果和web.xml中是一模一样的，是不是这样太爽了，所以一般推荐使用


注解进行开发，现在无论任何系统开发都基本上摒弃了XML开发，因为开发效率不高，而


且排错也很麻烦。


使用 ***** 通配符模糊匹配映射Servlet程序，在前面的所有例子中我们映射的URL都是


精确匹配，而在Servlet映射到的URL中也是可以使用 * 通配符进行模糊匹配的。


但是只能有两种固定的格式：一种格式是"*.扩展名"（例如：*.do *.action），另一


种格式是以正斜杠（/）开头并以"/*"结尾。


它们的匹配规则如下：


/*：匹配任何路径映射到servlet。


/abc/*：匹配/abc/下的任意路径映射到servlet。


/abc/def：只匹配/abc/def路径下的servlet。


*.do：匹配 任意名称.do 的路径映射到servlet。


其中例如：/abc/*.do、/*.do、abc*.do 这些都是非法的，启动时候会报错，我亲


自去试了一下，反正 * **.** 后缀名 这种格式前面是不能加正斜杠（/）的。


还有要注意的是，可能会出现这样的情况，例如：我请求的URL为：/abc/edf，而这


个路径有两个Servlet匹配（/* 和 /abc/*），那么它会选择哪一个呢？


答：会选择/abc/edf 的Servlet，因为匹配的原则是"谁长得更像就找谁"。


举一个完整的Servlet栗子：


①、修改index.jsp页面。



<img src="/java-base.pdf-163-0.png">
<img src="/java-base.pdf-164-0.png">

②、创建名为LoginServlet的Servlet类。并用@WebServlet注释。



<img src="/java-base.pdf-164-1.png">
<img src="/java-base.pdf-165-0.png">

**执行结果：**


登录页面：


提交登录结果信息：



<img src="/java-base.pdf-165-1.png">

<img src="/java-base.pdf-165-2.png">



Servlet接口中定义了五个方法，我们看一看Servlet接口中方法：



<img src="/java-base.pdf-165-4.png">

<img src="/java-base.pdf-165-5.png">
```
}

```

其中有 **三个为生命周期方法** ： **init()，service()，destory()** ：


1. **init()方法用于初始化该Servlet** 。当Servlet第一次被加载时，Servlet引擎调用这个

Servlet的init()方法，而且只调用一次。


2. **service()方法用于处理请求** 。这是Servlet最重要的方法，是真正处理请求的地方。

对于每个请求，Servlet引擎都会调用Servlet的service方法，并把Servlet请求对象和
Servlet响应对象最为参数传递给它，并且判断Servlet调用的是doGet方法还是doPost
方法。


3. **destory()方法用于销毁该Servlet** 。这是相对于init的可选方法，当Servlet即将被卸

载时由Servlet引擎来调用，这个方法用来清除并释放在init方法中所分配的资源。


此外，还有两个非生命周期方法。


getServletInfo()方法用于返回Servlet的一段描述，可以返回一段字符串。


getServletConfig()方法用于返回由Servlet容器传给init()方法的ServletConfig对
象。


下面来编写一个简单的Servlet来验证一下它的生命周期：



<img src="/java-base.pdf-166-0.png">
<img src="/java-base.pdf-167-0.png">

服务器运行后我们在浏览器访问：http://localhost:8080/HelloServlet1，控制台输


出了如下信息：


然后，我们在浏览器中刷新3遍：


接下来，我们关闭Servlet容器：


以上就是一个Servlet的整个生命周期了。可以发现，在Servlet的整个生命周期内，


Servlet的init()方法只被调用一次。也就是说当客户端多次Servlet请求时，服务器只会


创建一个Servlet实例对象，而且Servlet实例对象一旦创建，它就会驻留在内存中，为后


续的其它请求服务，直至web容器退出，Servlet实例对象才会销毁。而对一个Servlet的


每次访问请求都导致Servlet引擎调用一次servlet的service方法。对于每次访问请求，


Servlet引擎都会创建一个新的HttpServletRequest请求对象和一个新的


HttpServletResponse响应对象，然后将这两个对象作为参数传递给它调用的Servlet的


service()方法，service方法再根据请求方式分别调用doXXX方法。


上面说当客户端在第一次访问Servlet的时候会才创建Servlet实例对象，那如果这个


Servlet程序要处理的信息很多，那就会造成第一次访问的Servlet加载时间较长。所以为


了解决这样的问题Servlet提供了自动加载机制，就是在启动服务器的时候就将Servlet加


载起来，它的操作很简单。我们可以在web.xml中配置也可以在注解中配置。


在web.xml中进行配置：



<img src="/java-base.pdf-167-1.png">

<img src="/java-base.pdf-167-2.png">

<img src="/java-base.pdf-167-3.png">

<img src="/java-base.pdf-167-4.png">


注意： `<load-on-startup></load-on-startup>` 中的整数值越大，创建优先级越低！


在注解中进行配置：



<img src="/java-base.pdf-168-1.png">



通过上面的实例，可以看到Servlet在创建时只会执行一次init()方法，后面每次点击


都只调用 service() 方法。那么Servlet的一次执行过程是什么样的呢？


上面这幅图可以这样理解：


1、客户端向 Web 服务器发送请求，服务器查询 web.xml 文件配置。根据请求信息


找到对应的 Servlet。


2、Servlet 引擎检查是否已经装载并创建了该 Servlet 的实例对象，如果有，则直


接执行第4步，否则执行第3步，


3、Web 服务器加载 Servlet,并调用 Servlet 构造器（只会调用一次），创建


Servlet 的实例对象。并调用 init() 方法，完成 Servlet 实例对象的初始化（只会调用一


次）。


4、Web 服务器把接收到的 http 请求封装成 ServletRequest 对象，并创建一个


响应消息的 ServletResponse 对象，作为 service() 方法的参数传入。（每一次访问都


会调用一次该方法）


5、执行 service()方法，并将处理信息封装到 ServletResponse 对象中返回


6、浏览器拆除 ServletResponse 对象，形成 http 响应格式，返回给客户端。


7、Web 应用程序停止或者重新启动之前，Servlet 引擎将卸载 Servlet实例，并在


卸载之前调用 destory() 方法



<img src="/java-base.pdf-168-2.png">


**ServletConfig表示一个Servlet的配置信息，每个Servlet对象都有一个封装**


**Servlet配置的ServletConfig对象** 。因此可通过此对象获取servlet相关信息，也可以


用来读取web.xml中用<init-param>配置的Servlet初始化参数。


当我们的Servlet配置了初始化参数后，启动服务器，web容器在创建Servlet实例对


象后，接着ServletConfig对象就会被创建，而且会自动将初始化参数封装到


ServletConfig对象中，并在调用Servlet的init()方法时，将ServletConfig对象传递给


创建好的Servlet。进而，我们通过ServletConfig对象就可以得到当前Servlet的初始化


参数信息。


ServletConfig中有四个方法如下：

`String getServletName()` ：获取当前Servlet的名称，即：<servlet-name>中的
内容。

`ServletContext getServletContext()` ：获取当前当前Web的应用上下文，即整个
Servlet。


使用ServletConfig对象获取初始化数据的简单举例：


①、在Servlet的配置文件web.xml中，可以使用一个或多个<init-param>标签为


servlet配置一些初始化参数。



<img src="/java-base.pdf-169-0.png">

<img src="/java-base.pdf-169-5.png">
<img src="/java-base.pdf-170-0.png">

②、获取web.xml中<init-param>标签初始化参数，代码如下：



<img src="/java-base.pdf-170-1.png">
<img src="/java-base.pdf-171-0.png">

③、启动 Tomcat 服务器，在浏览器的地址栏中输入地


址： http://localhost:8080/config 访问Servlet，结果如图所示。


从上图中可以看出，web.xml 文件中配置的信息全部被读取了出来。



<img src="/java-base.pdf-171-1.png">



**ServletContext对象表示的当前整个上下文（应用程序），也就是整个Web应**


**用** 。这个对象在Tomcat启动的时候，会创建一个唯一的ServletContext对象代表当前的


整个Web应用，该对象封装了当前Web应用的所有信息。我们一般用来配置或者获取整个


应用的初始化配置信息、读取资源文件、多个Servlet之间的通信等。所以


ServletContext是相对于整个的应用，而ServletConfig是单个的应用。


<img src="/java-base.pdf-172-0.png">

下面对ServletContext对象获取不同的资源分别进行讲解。


我们在web.xml文件中，不仅可以配置Servlet的映射信息和初始化信息，也可以配


置整个Web应用的初始化信息。Web应用初始化参数的配置方式具体如下所示：



<img src="/java-base.pdf-172-2.png">

<img src="/java-base.pdf-172-3.png">



注意：在上面的配置文件中， `<context-param>` 元素位于根元素 `<web-app>` 中，它

的子元素 `<param-name>` 和 `<param-value>` 分别用于指定参数的名字和参数值。要想获


取这些参数名和参数值的信息，可以使用 ServletContext对象中定义

的 `getInitParameterNames()` 和 `getInitParameter(String name)` 方法分别获取。


下面通过案例演示如何使用 ServletContext对象获取Web应用程序的初始化参数。


①、在项目的web.xml文件中配置初始化参数信息和Servlet信息，其代码如下所


示：



<img src="/java-base.pdf-172-10.png">
<img src="/java-base.pdf-173-0.png">

②、使用ServletContext对象获取web.xml中配置的信息，代码如下所示。



<img src="/java-base.pdf-173-1.png">
<img src="/java-base.pdf-174-0.png">

上述代码中，当通过 this.getServletContext() 方法获取到 ServletContext 对象

后，首先调用 `getInitParameterNames()` 方法，获取到包含所有初始化参数名

的 `Enumeration` 对象，然后遍历 Enumeration 对象，根据获取到的参数名，通


③、启动 Tomcat 服务器，在浏览器的地址栏中输入地


址 http://localhost:8080/context 访问，浏览器的显示结果如图所示。


从图中可以看出，web.xml 文件中配置的信息被读取了出来。


我们在实际开发过程中，不仅需要从web.xml文件中配置信息，有时候也会会需要读


取 Web 应用中的一些资源文件，如配置文件和日志文件等。为此，在 ServletContext


接口中定义了一些读取 Web 资源的方法，这些方法是依靠 Servlet 容器实现的。


Servlet 容器根据资源文件相对于 Web 应用的路径，返回关联资源文件的 I/O 流或资源


文件在系统的绝对路径等。


ServletContext对象中用于获取资源路径的相关方法。

`Set getResourcePaths(String path)` ：返回一个 Set 集合，集合中包含资源目录
中子目录和文件的路径名 称。参数 path 必须以正斜线（/）开始，指定匹配资源的部
分路径

`String getRealPath(String path)` ：返回资源文件在服务器文件系统上的真实路
径（文件的绝对路径）。参数 path 代表资源文件的虚拟路径，它应该以正斜线（/）
开始，/ 表示当前 Web 应用的根目录，如果 Servlet 容器不能将虚拟路径转换为文
件系统的真实路径，则返回 null



<img src="/java-base.pdf-174-4.png">
`URL getResource(String path)` ：返回映射到某个资源文件的 URL 对象。参数
path 必须以正斜线（/）开始，/ 表示当前 Web 应用的根目录


InputStream 输入流对象。参数 path 的传递规则和 getResource() 方法完全一致


熟悉了下面的方法后，在通过使用 ServletContext 对象读取资源文件举例：


在项目的src目录下创建一个名称为userInfo.properties的文件，文件中的配置信息


如下：



<img src="/java-base.pdf-175-2.png">





②、使用ServletContext对象获取userInfo.properties中的资源文件配置信息，代


码如下所示：



<img src="/java-base.pdf-175-3.png">
<img src="/java-base.pdf-176-0.png">

③、启动 Tomcat 服务器，在浏览器的地址栏中输入地


址 http://localhost:8080/context1 访问，浏览器的显示结果如图所示。


从图中可以看出，userInfo.properties 资源文件中的内容已经被读取了出来。


ServletContext代表了整个Web应用，并且数据是共享的，而一个Web应用可以有


多个Servlet实例，也就意味着多个Servlet是可以实现通信的。下面使用


ServletContext实现多个Servlet之间的通信，相关的方法如下。



<img src="/java-base.pdf-176-1.png">
Object getAttribute(String var1)：获取域对象中共享的数据


void setAttribute(String var1, Object var2)：向域对象中共享数据


void removeAttribute(String var1)：删除域对象中共享的数据


我们创建两个类ServletContextDemo2和ServletContextDemo3通过


ServletContext对象实现通信。


ServletContextDemo2代码如下：



<img src="/java-base.pdf-177-0.png">

<img src="/java-base.pdf-177-1.png">



ServletContextDemo3代码如下：

```
package com.thr;

```

<img src="/java-base.pdf-178-0.png">

<img src="/java-base.pdf-178-1.png">





先运行ServletContextDemo2，并且访问该Servlet，将数据name和password数


据存储到ServletContext对象中。然后运行访问ServletContextDemo3，就可以从


ServletContext对象中取出数据了，这样就实现了多个Servlet的通信，运行结果如下图


所示：


<img src="/java-base.pdf-179-0.png">



Servlet，GenericServlet和HTTPServlet三者之间的关系如下图。


①、 **Servlet** 接口是Servlet程序的根接口，里面定义了5个方法。



<img src="/java-base.pdf-179-2.png">

<img src="/java-base.pdf-179-3.png">

<img src="/java-base.pdf-179-4.png">

②、 **GenericServlet** 实现了Servlet接口和ServletConfig接口，它是一个抽象


类，将Servlet接口中的init()、destroy()、getServletConfig()、getServletInfo()进


行了重写，并且将service()设置为抽象方法，因此若创建的Servlet继承了


GenericServlet，则只需要重写service()即可，但是在实际中一般不会使用它，因为它


有一个子类HttpServlet，功能更加强大。


GenericServlet抽象类相比于直接实现Servlet接口，有以下几个好处：


为Servlet接口中的所有方法提供了默认的实现，则程序员需要什么就直接改什么，不
再需要把所有的方法都自己实现了。


提供了一系列的方法，包括ServletConfig对象中的方法。


将init( )方法中的ServletConfig参数赋给了一个内部的ServletConfig引用从而来保
存ServletConfig对象，不需要程序员自己去维护ServletConfig了。

```
  package javax.servlet;

```

<img src="/java-base.pdf-180-0.png">


<img src="/java-base.pdf-181-0.png">

③、 **HttpServlet** 继承了GenericServlet，还记得在GenericServlet中的


service()方法，将其定义为了一个抽象的方法，所以在HttpServlet中肯定会进行重写，


然后来具体的看一看HttpServlet抽象类是如何实现自己的service方法吧。


首先来看GenericServlet抽象类中是如何定义service方法的：



HttpServlet又是怎么重写这个service方法的：



<img src="/java-base.pdf-182-1.png">

<img src="/java-base.pdf-182-2.png">



可以发现HttpServlet在重写GenericServlet中的service()时，将ServletRequest


强制转成了HttpServletRequest，ServletResponse强制转成了


HttpServletResponse，之所以将它两转为Http类型的因为它们的功能更加强大。然后


又调用了一个拥有HttpServletRequest和HttpServletResponse为参数的service()，


再来看看这个方法是如何实现的：



<img src="/java-base.pdf-182-3.png">
<img src="/java-base.pdf-183-0.png">

在这个方法中，先获取了当前请求的请求方式，通过判断请求的方式调用不同的方


法，分别调用了doXXX()方法，例如：GET请求调用了doGet()，POST请求调用了


doPost()，由于浏览器只能发送GET和POST请求，因此若Servlet继承了HttpServlet，


只需要重写其中的doGet()和doPost()即可。





HttpServletRequest表示Http环境中的Servlet请求。它是一个接口，继承自


javax.servlet.ServletRequest接口， **它封装了请求报文** ，因此可以通过此对象获取请求


报文中的数据以及请求转发。HttpServletRequest在ServletRequest接口的基础上添加


下面这几个方法：

`String getContextPath()` ：返回请求上下文的请求URI部分

`Cookie[] getCookies()` ：返回一个cookie对象数组

`String getMethod()` ：返回生成这个请求HTTP的方法名称

`String getQueryString()` ：返回请求URL中的查询字符串


<img src="/java-base.pdf-184-0.png">184-0

获得请求行的相关方法如下：


String getMethod()：获取请求的方式(get/post)


String getRequestURI()：获取请求的URI地址


StringBuffer getRequestURL()：获取请求的URL地址


String getContextPath()：获取web应用的名称


String getQueryString()：获取get提交url地址后的参数字符串


request获得请求行示例代码：



<img src="/java-base.pdf-184-2.png">

<img src="/java-base.pdf-184-3.png">



获取结果：


获得请求头的相关方法如下：


String getHeader(String name)：根据请求头的key获取对应的value



<img src="/java-base.pdf-184-4.png">
Enumeration getHeaderNames()：获取请求头中所有的key


Enumeration getHeaders(String name)：根据请求头的key获取对应批量的value


int getIntHeader(String name)：根据请求头的key获取对应的value，它返回的是
Int类型的值



<img src="/java-base.pdf-185-0.png">

<img src="/java-base.pdf-185-1.png">



<img src="/java-base.pdf-185-2.png">

**补充：HTTP请求中的常用消息头**


accept:浏览器通过这个头告诉服务器，它所支持的数据类型


Accept-Charset: 浏览器通过这个头告诉服务器，它支持哪种字符集


Accept-Encoding：浏览器通过这个头告诉服务器，支持的压缩格式


Accept-Language：浏览器通过这个头告诉服务器，它的语言环境


Host：浏览器通过这个头告诉服务器，想访问哪台主机


If-Modified-Since: 浏览器通过这个头告诉服务器，缓存数据的时间


Referer：浏览器通过这个头告诉服务器，客户机是哪个页面来的 防盗链


Connection：浏览器通过这个头告诉服务器，请求完后是断开链接还是何持链接


上面请求体中的内容是通过post提交的请求参数，格式是：



<img src="/java-base.pdf-186-1.png">

<img src="/java-base.pdf-186-2.png">



以上面参数为例，通过一下方法获得请求参数：


String getParameter(String name)：根据请求体中的key获取value


String[] getParameterValues(String name)：根据请求体中的key获取批量value


Enumeration getParameterNames()：获取所有请求体中的key



<img src="/java-base.pdf-186-3.png">

<img src="/java-base.pdf-186-4.png">






在service中使用的编码解码方式默认为：ISO-8859-1编码，但此编码并不支持中


文，因此会出现乱码问题，所以我们需要手动修改编码方式为UTF-8编码，才能解决中文


乱码问题，下面是发生乱码的具体细节：


乱码问题解决：


解决get提交的方式的乱码：

在tomcat的配置文件server.xml，在71行左右，改端口号的标签中，加入属性
URIEncoding="UTF-8"


或者使用String parameter = new String(parameter.getbytes("iso88591"),"utf-8");


解决post提交方式的乱码：





HttpServletResponse也是一个接口，它继承自ServletResponse接口，专门用来


封装HTTP响应报文，由于HTTP请求消息分为状态行，响应消息头，响应消息体三部分，


因此，在HttpServletResponse接口中定义了向客户端发送响应状态码，响应消息头，响


应消息体的方法。



<img src="/java-base.pdf-187-3.png">

<img src="/java-base.pdf-187-4.png">

<img src="/java-base.pdf-187-5.png">

<img src="/java-base.pdf-187-6.png">


转发：客户端向服务器端发送请求，服务器将请求转发到服务器内部，再响应给客户


端。



<img src="/java-base.pdf-188-0.png">

<img src="/java-base.pdf-188-1.png">



访问后的地址：


重定向：客户端向服务器端发送请求，服务器告诉客户端你去重定向（状态码302，


响应头location=客户端绝路路径），客户端继续向服务器发送请求（请求地址已经成重


定向的地址），服务器端给客户端响应。



<img src="/java-base.pdf-188-2.png">

<img src="/java-base.pdf-188-3.png">

<img src="/java-base.pdf-188-4.png">





访问后的地址：


**转发和重定向的区别：**


请求次数：转发只发出了一次请求，而重定向发出了两次请求。


地址栏变化：转发不会改变地址栏中的URL，而重定向则会改变URL。


项目名称：转发不用写项目名称(默认：http://localhost:8080/项目名称/)，重定向需
要编写项目名称(默认：http://localhost:8080/)。



<img src="/java-base.pdf-188-5.png">
跳转范围：转发只能访问到当前web应用中的内容，而重定向则可以访问到任意web应
用中的内容 。


request对象作用范围：转发后，在转发后的页面中仍然可以使用原来的request对
象，而重定向，原来的request对象则失去作用。





路径分为相对路径和绝对路径：


相对路径：目标资源相当于当前位置的路径


绝对路径

Static web：绝对路径指资源在磁盘上的完整路径


Web Application：绝对路径指资源在服务器中的路径，以/开头的路径都是绝对
路径


1、对于相同的资源，在不同的页面中访问路径不同，即对于同一个资源没有统一的


访问路径


2、若当前位置或目标资源的位置发生了变化，则相对路径有可能失效


3、由于转发浏览器发送一次请求，且在服务器的内部跳转到转发的地址，因此地址


栏不变，即访问servlet的地址，因此造成了地址栏中的地址和页面中显示的内容不匹配，


即当前位置发生了变化，就影响了页面中所有的相对路径


**总结：相对路径不靠谱，推荐使用绝对路径**

在web应用中，以 / 开头的路径都是绝对路径。绝对路径又分为 由浏览器解析的绝对


**由浏览器解析的绝对路径，/ 表示localhost:8080下访问**

由浏览器解析的绝对路径的情况有：html标签中所设置的绝对路径（超链接、
form标签中的action、img、link、script）、JavaScript中的location对象所
设置的绝对路径、重定向中设置的绝对路径





**由服务器解析的绝对路径，/ 表示localhost:8080/上下文路径** **下访问**

由服务器解析的绝对路径的情况有：web.xml中url-pattern设置的绝对路径、转
发中设置的绝对路径、jsp中jsp指令和jsp动作标签所设置的绝对路径


页面中所设置的绝对路径：手动添加上下文路径，例如：


重定向中所设置的绝对路径：在绝对路径前通过request.getContextPath()拼接上


下文路径，例如：




**java转发和重定向的区别有哪些**


**笔记本：** Java基础


**创建时间：** 2021/8/24 11:30 **更新时间：** 2021/8/24 11:36


**作者：** 彼岸樱速


**转发** **是在服务端直接做的事情，是对客户端的同一个request进行传递，浏览器并不知道。**
**重定向** **是由浏览器来做的事情。重定向时，服务端返回一个response，里面包含了跳转的地**

<img src="/java-base.pdf-191-0.png">
**址，由浏览器获得后，自动发送一个新request。**




**浮点数的单精度和双精度**


**笔记本：** Java基础


**创建时间：** 2021/8/9 11:43 **更新时间：** 2021/8/9 11:44


**作者：** 彼岸樱速


**1.数后5261加上字母f，如 2.3f、1.0f 等此4102类是单精度浮点数（float）1653 。**


**2.数直接专写出的数字，如 2.3、1.0 等此类是 double 型的。**
**使用属double声明的变量和常数是双精度浮点数。**
**使用float声明的变量和常数是单精度浮点数。**


**C 语言浮点数默认是 double 型（双精度浮点数）的。**


**Java中的值传递和引用传递**


**笔记本：** Java基础


**创建时间：** 2021/8/5 14:22 **更新时间：** 2021/8/6 10:58


**作者：** 彼岸樱速


**URL：** about:blank


**Java** 中的值传递和引用传递的理解（带例子、通俗易懂）

**1** 、 **Java** 不管是基本类型还是引用类型， 参数传递的方式只有一种：值传递 ，而有两种表现：值传

**2** 、首先了解一下基本类型和引用类型在 **JVM** 内存中的存储方式：

基本类型： **int a = 5** ； **jvm** 会在栈中开辟一块空间存储变量 **a** 并赋值为 **5** 。

引用类型： **Sample s = new Sample()** ； **JVM** 会在堆中开辟一块空间存储 **Sample** 对象，并在栈中开辟一块空
间存储对象的引用 **s** （存储 **Sample** 对象在堆中的地址），并将 **s** 指向堆中的 **Sample** 对象。

特殊类型： **String(** 是一种特殊的引用类型 **)** ， **JVM** 做了一些优化处理（下面我们再来详细的解释）。


**a** 、首先是在一个方法中传入一个基本类型的参数：输出结果为 **5**


**public class** **Demo01** **{**


**public static void** **main(String[] args) {**


**int** **a** **=5;**


**int[]** **arr={5};**
**add(a);**
**add(arr[0]);**


**System.out.println(a);** **//5**


**System.out.println(arr[0]);** **//5**
**}**


**public static void** **add(int** **a){**

**a++;**
**}**


**public static void** **add(int** **[] arr){**
**arr[0]++;**
**}**
**}**

分析一下上面的过程：（我们这里只说一下 **int a = 5** 的过程 **int [] arr ={5}** 其实是一样的原理）


**1** 、首先执行 **main** 方法的主线程会先在栈中申请一块内存空间，然后分配给变量 **a** 并赋值为 **5** 。

**2** 、然后执行 **add** （ **int a** ）方法时，会将变量 **a** 复制一份，然后传入 **add** 方法中的方法体去执行。

**3** 、复制的变量 **a** 并不是原来的变量，只不过值也是 **5** 而已。


**4** 、方法结束，方法外打印 **a** 的值，由于原来的 **a** 并没有改变，所以输出的还是 **5** 。


**b** 、再来看一下在方法中传入一个引用类型：输出结果为 **after** 和 **1**


**public class** **Demo02** **{**
**public static voidmain(String[] args) {**
**Person** **p** **=** **new** **Person();**
**p.setName("before");**
**p.setAge(0);**
**changePerson(p);**


**System.out.println("p.name="+p.getName());** **//p.name=after**
**System.out.println("p.age="+p.getAge());** **//p.age=1**
**}**


**private static voidchangePerson(Person** **p) {**
**p.setName("after");**
**p.setAge(1);**
**}**
**}**


**class** **Person{**
**private int** **age;**
**private** **String** **name;**

**public int** **getAge() {**
**return** **age;**
**}**

**public voidsetAge(int** **age) {**
**this.age** **=** **age;**
**}**


**public** **String** **getName() {**
**return** **name;**
**}**

**public voidsetName(String** **name) {**
**this.name** **=** **name;**
**}**
**}**


**是不是很奇怪？明明没有写p = changePerson(p);**

**2** 、此时我们调用 **p** 的 **setName** 方法和 **setAge** 方法会根据 **p** 引用找到堆中的 **Person** 对象， **Person** 对象的类信
息和方法等是存在方法区中的， **Person** 对象去方法区中找到该类的相关方法然后执行，将 **Person** 的属性

**4** 、将复制后的 **p** 传入 **changePerson** 方法中，重复 **2** 的过程，将对象的属性改为 **age** ： **1** ， **name** ： **after** 。

象 ，所以复制到方法中的 **p** 改变了 **Person** 对象，所以最后输出的值也是改变的。

**c** 、我们最后看一下在方法中传入 **String** 类型的参数：输出结果为： **String** ： **A** 、 **StringBuffer** ： **AA**


**public class** **Demo03** **{**


**public static void** **main(String[] args) {**


**String** **s="A";**


**StringBuilder** **ss=new** **StringBuilder("A");**
**add(s);**
**add(ss);**


**System.out.println("s:"+s);** **//A**


**System.out.println("ss:"+ss);** **//AA**
**}**


**public static void** **add(String** **s){**
**s+="A";**
**}**



<img src="/java-base.pdf-194-1.png">
**public static void** **add(StringBuilder** **s){**
**s.append("A");**
**}**
**}**

首先说一下 **String** ，其实 **String** 创建对象的过程是比较复杂的， **String s =** “ **A** ” **;** 和 **String s = new**

**String(** “ **A** ” **);** 也是不同的，有兴趣可以了解一下：点击了解 **String** 创建对象的详细过程，我们这里是第

**3** 、这一步非常关键，进入方法中以后， **A** 会变成 **AA** ，然后会在常量池中判断常量池中是否会有 **AA** ，显

**4** 、方法结束后，在方法外打印 **s** ，因为 **s** 并没有改变，还是指向的是常量池中的 **A** ，所以会输出 **A** 。

**2** ）那么为什么 **StringBuffer** 的值改变了呢？下面说下上面的代码内部实现过程（其实和其它的引用类型

**StringBuffer** 是在 **Java5** 提出的，它和 **String** 不同的是， **StringBuffer** 类的对象能够被多次修改而不产生未使用
的对象， **StringBuffer** 的内部封装了对字符串操作的方法。

**1** 、首先创建一个 **StringBuffer** 对象，在堆中申请一块区域然后存放该对象，然后在栈中存放 **ss** 引用（值

为 **StringBuffer** 在堆中的地址）并指向堆中的 **StringBuffer** 对象。

**2** 、调用 **StringBuffer** 的 **add** 方法，虚拟机会复制一份 **ss** 然后传入到 **add** 方法中， **ss** 和复制后的 **ss** 值一样，都
是指向堆中的 **StringBuffer** 对象。

**3** 、传入以后调用 **append** 方法将 **StringBuffer** 的值变为 **AA** ，然后调用 **toString** 方法将返回给 **StringBuffer** 对
象。

**4** 、方法结束，方法外输出 **ss** ，因为 **ss** 也指向的是 **StringBuufer** 对象，所以会输出最后 **toString** 返回的值。


总结：


**抽象类和接口的区别**


**笔记本：** Java基础


**创建时间：** 2021/8/5 10:57 **更新时间：** 2021/8/5 11:39


**作者：** 彼岸樱速


**URL：** about:blank


**抽象类和接口的区别** （ **重要** ）


我们从我们实际设计场景中来切入这个话题先来举一个简单的例子：狗都具有 eat() 、sleep()
方法，我们分别通过抽象类和接口定义这个抽象概念


//通过抽象类定义


public abstract class Dog {


public abstract void eat();


public abstract void sleep();
}

//通过接口定义


public interface Dog {


public abstract void eat();


public abstract void sleep();
}
但是我们现在如果需要让狗拥有一项特殊的技能——钻火圈 DrillFireCircle()，如何增加这个行
为呢？


思考：将钻火圈方法与前面两个方法一同写入抽象类中，
但是这样的话，但凡继承这个抽象类狗都具有了钻火圈技能，明显不合适将钻火圈方法与前面两
个方法一同写入接口中，
当需要使用钻火圈功能的时候，就必须实现 接口中的eat() 、sleep() 方法（重写该接口中所有
的方法）显然也不合适 那么该如何解决呢 ? 我们可以仔细想一想,eat和sleep都是狗本身所应该
具有的一种行为,而钻火圈这种行为则是后天训练出来的,只能算是对狗类的一种附加或者延伸,
两者不应该在同一个范畴内,所以我们考虑将这个单独的行为,独立的设计一个接口,其中包含
DrillFireCircle()方法, Dog设计为一个抽象类, 其中又包括eat() 、sleep() 方法.一个SpecialDog
即可继承Dog类并且实现DrillFireCircle()接口下面给出代码: //定义接口，含有钻火圈方法
public interface DrillFireCircle() {
public abstract void drillFireCircle();
}

//定义抽象类狗类
public abstract class Dog {
public abstract voideat();
public abstract voidsleep();
}

//继承抽象类且实现接口
public class SpecialDog extends Dog implements DrillFireCircle {
public voideat() {
//....
}


public voidsleep() {
//....
}


public voiddrillFireCircle() () {
//....
}


}


总结：继承是一个 "是不是"的关系，而 接口 实现则是 "有没有"的关系。如果一个类继承了某个
抽象类，则子类必定是抽象类的种类，而接口实现则是有没有、具备不具备的关系，比如狗是否
能钻火圈，能则可以实现这个接口，不能就不实现这个接口。


个人总结
换句话说，我可以从一组业务当中，抽取每个业务同样都会进行一样的动作，放到抽象类中，实
现了抽象类的子类必须继承抽象类的所有方法，而接口则是一个额外的，不是必须要拥有的技


能，我想要这个功能的时候，就可以去实现这个接口就好了，如果不需要，那我也可以不去实现
这个接口。


**Java语言的特性**


**笔记本：** Java基础


**创建时间：** 2021/8/5 0:15 **更新时间：** 2021/8/5 0:16


**作者：** 彼岸樱速


1. **Java语言是易学的** 。Java语言的语法与C语言和C++语言很接近，使得大多数程序员很容易学习和使用

Java。
2. **Java语言是强制面向对象的** 。Java语言提供类、接口和继承等原语，为了简单起见，只支持类之间的单继

承，但支持接口之间的多继承，并支持类与接口之间的实现机制（关键字为implements）。
3. **Java语言是分布式的** 。Java语言支持Internet应用的开发，在基本的Java应用编程接口中有一个网络应用

编程接口（java net），它提供了用于网络应用编程的类库，包括URL、URLConnection、Socket、
ServerSocket等。Java的RMI（远程方法激活）机制也是开发分布式应用的重要手段。
4. **Java语言是健壮的** 。Java的强类型机制、异常处理、垃圾的自动收集等是Java程序健壮性的重要保证。对

指针的丢弃是Java的明智选择。
5. **Java语言是安全的** 。Java通常被用在网络环境中，为此，Java提供了一个安全机制以防恶意代码的攻击。

如：安全防范机制（类ClassLoader），如分配不同的名字空间以防替代本地的同名类、字节代码检查。
6. **Java语言是体系结构中立的** 。Java程序（后缀为java的文件）在Java平台上被编译为体系结构中立的字节

码格式（后缀为class的文件），然后可以在实现这个Java平台的任何系统中运行。
7. **Java语言是解释型的** 。如前所述，Java程序在Java平台上被编译为字节码格式，然后可以在实现这个Java

平台的任何系统的解释器中运行。
8. **Java是性能略高的** 。与那些解释型的高级脚本语言相比，Java的性能还是较优的。
9. **Java语言是原生支持多线程的** 。在Java语言中，线程是一种特殊的对象，它必须由Thread类或其子（孙）

类来创建。


**Java三大特性(封装、继承、多态)**


**笔记本：** Java基础


**创建时间：** 2021/8/5 0:10 **更新时间：** 2021/8/5 0:15


**作者：** 彼岸樱速


1 、 封装 ，封装就是把属于同一类 事物的共性（包括属性与方法）归到一个类中。举个栗子就是，一个
人，都有手，有脚，有身体，有眼睛，有耳朵等等，把这些器官都当成是人的一个属性，全部组合起来到一个
类里面，如


A.java


String hand;


String food


String eye;


......


2 、 继承(extends)


一个类继承另一个类，则称被继承的类为父类，继承的类为子类，继承后子类自动拥有了父类的属性和方法。


3 、 多态


- (1) 同一个动作与不同的对象产生不同的行为


- (2) 多态指的是一个对象的多种形态


体现方式


- (1). 使用继承：不同的子类重写父类方法后，体现出来的形式不一样


- (2) 接口的实现


形成多态的必要条件


- (1) 继承：存在子类和父类的关系


- (2) 重写：子类重写了父类的方法


- (3). 子类对象的多态性（重点）：父类的引用指向子类的实例

是子类对父类的允许访问的方法的实现过程进行重新编写, 返回值和形参都不能改变 。即外壳不变，核心重
写！


重载 (overloading) 是在一个类里面， 方法名字相同，而参数不同 。返回类型可以相同也可以不同。


每个重载的方法（或者构造函数）都必须有一个独一无二的参数类型列表。


最常用的地方就是构造器的重载。


重载规则 :

1. 被重载的方法必须改变参数列表 **(** 参数个数或类型不一样 **)** ；


4. 被重载的方法可以声明新的或更广的检查异常；


5. 方法能够在同一个类中或者在一个子类中被重载。


6. 无法以返回值类型作为重载函数的区分标准。


**Java8大数据基本类型**


**笔记本：** Java基础


**创建时间：** 2021/8/4 23:14 **更新时间：** 2021/8/5 0:09


**作者：** 彼岸樱速

|基本类型|大小(字节)|默认值|封装类|
|---|---|---|---|
|**byte**|**1**|**(byte)0**|**Byte**|
|**short**|**2**|**(short)0**|**Short**|
|**int**|**4**|**0**|**Integer**|
|**long**|**8**|**0L**|**Long**|
|**float**|**4**|**0.0f**|**Float**|
|**double**|**8**|**0.0d**|**Double**|
|**boolean**|**-**|**false**|**Boolean**|
|**char**|**2**|**/u0000(null)**|**Character**|



boolean类型占了单独使用是4个字节，在数组中又是1个字节
基本类型所占的存储空间是不变的。这种不变性也是Java具有可移植性的原因之一。 基本类型
放在栈中，直接存储值。
所有数值类型都有正负号,没有无符号的数值类型。


**为什么需要封装类？**
因为泛型类包括预定义的集合
使用的参数都是对象类型
无法直接使用基本数据类型
所以Java又提 供了这些基本类型的封装类。


**基本类型和对应的封装类由于本质的不同。具有一些区别** ：
1.基本类型只能按值传递，而封装类按引用传递。
2.基本类型会在栈中创建，而对于对象类型，对象在堆中创建，对象的引用在栈中创建，基本类
型由于 在栈中，效率会比较高，但是可能存在内存泄漏的问题。


**基本类型优点**
a.用于计算是效率高(effective java书上讲过的)，其实就是包装类需要装箱拆箱的过程
b.不会由于常量池引起比较大小错误(例如java integer对象判断两个数字是否相等)


**包装类型优点**
1.可以存放null,从数据库中查出值时可能会有null
2.表示一个值(不用于计算,只用于保存值时和int类型一样);


**Java基本类型之short**


**笔记本：** Java基础


**创建时间：** 2021/8/4 23:49 **更新时间：** 2021/8/5 0:09


**作者：** 彼岸樱速


**首先来看几道面试题**


1. **short s1=1;s1=s1+1;有什么问题？**


2. **short s1=1;s1+=1;有什么问题?**


3. **short s1=1,s2=1;short s3=s1+s2;有什么问题？**


一、 **short s1=1;s1=s1+1;**


这两句代码的 **s1=s1+1** 存在 **数据类型转换问题**
表达式右边：s1是short型，1是int型（1会被自动归为int型），二者相加，首先s1会被自动转
为int型，相加的结果也就为int型。
然而表达式的左边：s1是short型。此时就需要把表达时的右侧的数据类型强制转换为shor型
所以s1=s1+1;存在问题，会报出编译错误，正确的写法应该是 **s1=(short)(s1+1);**


二、 **short s1=1;s1+=1;**


首先说一下，这两句代码没有编译错误，结果也是正确的，那么，


有些人看到这两句代码会说，这个和刚才不是一样的吗，
如果简单的认为s1+=1和s1=s1+1完全相同，那就错了。
java语言规范中关于复合赋值的解释是这样的：
**E1 op=E2** 等价于 **E1=(T)(E1 op E2)**,
也就是 **s1+=1** 等价于 **s1=(short)(s1 + 1)**
这里的T是E1的数据类型，看到这里 ，大家应该豁然开朗了，原来这个复合赋值 **(s1+=1)** 是自
带了 **隐式的强制类型转换** 的。


三、 **short s1=1,s2=1;short s3=s1+s2;**


这两句代码也有编译错误，
有些人会说了，难道同类型的数据还需要类型转换？答案是否定的，
那么这里为什么会有编译错误呢，报错的原因主要是从数据安全方面考虑的，
**s1+s2的默认类型是int** ，
因为如果s1的值接近 **short类型取值范围的最大值(** **取值范围-32768~32767，SHORT长度**
**16)** ，
同时s2的值也接近short类型取值范围的最大值，那么s1+s2的肯定超出了short的取值范围，
此时二者之和就是int型的数据，此时就需要强制把左边的int型数据转换为右边的short型。
有些人又说了，我明明写的s1为1，s2也为1，那为什么还报错。因为此时还不知道s1和s2的值
到底是多少。
所以这两句代码正确的写法应该是 **short s1=1,s2=1;short s3=(short)(s1+s2);**




```
public class ShortTest {
static void m1() {
Short short1 = new Short(( short ) 23);
Short short2 = new Short("12");
```

`System.out.println("` 静态方法 `short1` ： `"` `+` `short1);`
`System.out.println("` 静态方法 `short2` ： `"` `+` `short2);`
```
}

public static void main(String[] args) {
m1 ();

```

_`//byteValue()`_ 返回此值 _`Short`_ 为 _`byte`_ 的基本收缩转换后。
```
Short short1 = new Short(( short ) 23);

```

```
System.out.println("main short1.byteValue(): " + short1.byteValue());

```

_`//compareTo(Short anotherShort)`_ 以数字比较两个 _`Short`_ 对象。
_`//`_ 其实就是 _`short1-short2`_
```
System.out.println(short1.compareTo( new Short(( short ) 12))); // 11
System.out.println(short1.compareTo( new Short(( short ) 24))); // -1
System.out.println(short1.compareTo( new Short(( short ) 0))); // 23

```

_`//decode(String nm)`_ 将 _`String`_ 解码为 _`Short`_ 。
```
System.out.println(short1. decode ("12")); // 12
System.out.println(short1. decode ("-12")); // -12

```

_`//doubleValue()`_ 返回此值 _`Short`_ 为 _`double`_ 一个宽元转换后。
```
System.out.println(short1.doubleValue()); // 23.0

```

_`//floatValue()`_ 在扩展原始转换后，以 _`float`_ 形式返回此 _`Short`_ 的值。
```
System.out.println(short1.floatValue()); // 23.0

```

_`//hashCode()`_ 返回这个 _`Short`_ 的哈希码 _`;`_ 等于调用 _`intValue()`_ 的结果。
```
System.out.println(short1.hashCode()); // 23

```

_`//hashCode(short value)`_ 返回一个 _`short`_ 值的哈希码 _`;`_ 兼容 _`Short.hashCode()`_ 。
```
System.out.println(short1. hashCode ( new Short(( short ) 12))); // 12

```

_`//intValue()`_ 返回此的值 _`Short`_ 作为 _`int`_ 加宽原始转换之后。
```
System.out.println(short1.intValue()); // 23

```

_`//longValue()`_ 返回此值 _`Short`_ 为 _`long`_ 一个宽元转换后。
```
System.out.println(short1.longValue()); // 23

```

_`//parseShort(String s)`_ 将字符串参数解析为带符号的十进制 _`short`_ 。
```
System.out.println(short1. parseShort ("12")); // 12

```

_`//reverseBytes(short i)`_ 返回反转指定的二进制补码表示的字节顺序而获得的值 _`short`_ 值。
```
System.out.println(short1. reverseBytes ( new Short(( short ) 33))); // 8848

```

_`//shortValue()`_ 将此 _`Short`_ 的值作为 _`short`_
```
System.out.println(short1.shortValue()); // 23

```

_`//toUnsignedInt(short x)`_ 的参数的转换 _`int`_ 由无符号转换。
```
System.out.println(short1. toUnsignedInt ( new Short(( short ) 3))); // 3

```

_`//valueOf(String s)`_ 返回一个 _`Short`_ 物体保持由指定的给定的值 _`String`_ 。
```
System.out.println(short1. valueOf ("11")); // 11
}
}

```

