# Spring
---
aliases:
  - spring
标题: spring
---
**Spring三级缓存与解决循环依赖 - 冬日寻雾记 - 博客园**


**笔记本：** spring


**创建时间：** 2025/7/12 11:39 **更新时间：** 2025/7/12 11:40



<img src="/img/spring.pdf-0-0.png">0-0
<img src="/img/spring.pdf-1-0.png">1-0


<img src="/img/spring.pdf-2-0.png">2-0

<img src="/img/spring.pdf-2-1.png">2-1


<img src="/img/spring.pdf-3-0.png">3-0


**Spring的三级缓存详解 - jock_javaEE - 博客园**


**笔记本：** spring


**创建时间：** 2025/7/12 11:28 **更新时间：** 2025/7/12 11:37


这几个问题我们结合源码来一起看一下：


三级缓存分别在什么地方产生的？


三级缓存是怎么解决循环依赖的？


一定需要三级缓存吗？二级缓存不行？



<img src="/img/spring.pdf-4-0.png">4-0

<img src="/img/spring.pdf-4-1.png">4-1
二、三级缓存详解


不管你了不了解源码，我们先看一下Bean的生成流程，看看三级缓存是在什么地方有调用，就三个地方：


1、Bean实例化前会先查询缓存，判断Bean是否已经存在


2、Bean属性赋值前会先向三级缓存中放入一个lambda表达式，该表达式执行时会获取一个半成品Bean放入二级缓存并删


3、Bean初始化完成后将完整的Bean放入一级缓存，同时清空二、三级缓存


接下来我们一个一个看！


1、Bean实例化前


AbstractBeanFactory.doGetBean


Bean实例化前会从缓存里面获取Bean，防止重复实例化



<img src="/img/spring.pdf-5-0.png">5-0
<img src="/img/spring.pdf-6-0.png">6-0

DefaultSingletonBeanRegistry.getSingleton(String beanName, boolean allowEarlyReference)


我们看看这个获取的方法逻辑：


a、从一级缓存获取，获取到了，则返回


b、从二级缓存获取，获取到了，则返回


c、从三级缓存获取，获取到了，则执行三级缓存中的lambda表达式，将结果放入二级缓存，清除三级缓存


<img src="/img/spring.pdf-7-0.png">7-0

2、属性赋值/注入前


AbstractAutowireCapableBeanFactory.doCreateBean


<img src="/img/spring.pdf-8-0.png">8-0

DefaultSingletonBeanRegistry.addSingletonFactory


这里就是将一个lambda表达式放入了三级缓存，我们需要去看一下这个表达式是干什么的！！


AbstractAutowireCapableBeanFactory.getEarlyBeanReference 该方法在属性赋值之前、初始化之前执行


重点，该方法说白了就是会判断该Bean是否需要被动态代理，两种返回结果：


不需要代理，返回未属性注入、未初始化的半成品Bean


需要代理，返回未属性注入、未初始化的半成品Bean的代理对象



<img src="/img/spring.pdf-8-1.png">8-1
<img src="/img/spring.pdf-9-0.png">9-0

注意：这里只是把lambda表达式放入了三级缓存，如果不从三级缓存中获取，这个表达式是不执行的，一旦执行了，就会


品Bean的代理对象放入二级缓存中了


3、初始化后


AbstractBeanFactory.doGetBean


执行流程，sharedInstance = getSingleton(beanName, new ObjectFactory() --> singletonObject = singletonFacto
createBean方法 --> 又返回到singletonObject = singletonFactory.getObject()


DefaultSingletonBeanRegistry.getSingleton(beanName, singletonFactory)


这个方法与上面那个不一样，重载了



<img src="/img/spring.pdf-9-1.png">9-1
<img src="/img/spring.pdf-10-0.png">10-0

DefaultSingletonBeanRegistry.addSingleton


总结



<img src="/img/spring.pdf-10-1.png">10-1
整个过程就三个地方跟缓存有关，我们假设现在要实例化A这个Bean，看看缓存是怎么变化的：


1、实例化前，获取缓存判断（三个缓存中肯定没有A，获取为null，进入实例化流程）


2、实例化完成，属性注入前（往三级缓存中放入了一个lambda表达式，一、二级为null）


3、初始化完成（将A这个Bean放入一级缓存，清除二、三级缓存）


以上则是单个Bean生成过程中缓存的变化！！


三、怎么解决的循环依赖


上面我们把Bean流程中利用缓存的三个重要的点都找出来了，也分析了会带来什么变化，接下来看看是怎么解决的循环依赖


以A注入B，B注入A为例：


A属性注入前就把lambda表达式放入了第三级缓存，所以B再注入A的时候会从第三级缓存中找到A的lambda表达式并执行
入第二级缓存，所以此时B注入的只是半成品的A对象，然后B将完整对象返回给A注入，A继续初始化，完成创建。


从上述看第三级缓存是用来提前暴露Bean对象引用的，所以解决了循环依赖，但是第二级缓存的这个半成品Bean对象干嘛


假设 `A` 同时注入了 `B` 和 `C` ， `B` 和 `C` 又都注入了 `A` ，这时 `A` 注入 `B` ，实例化 `B` 的过程和上述是一样的，但随后还会注入 `C` ，那这个 `C` 在注入 `A` 的时候


没了吧，所以它就只能用第二级缓存的半成品 `Bean` 对象了，同样也是引用而已


四、不用三级缓存不行吗



<img src="/img/spring.pdf-11-0.png">11-0
可能很多小伙伴得到的答案就是不行，而且答案是因为不确定这个Bean是不是代理对象，所以搞了个lambda表达式？答案


那为什么要设计成三级缓存，而不是两级呢？比如说，如果只有二级缓存的话，可能会有什么问题？可能和AOP代理有关。
理，那么在生成代理对象的时候，需要确保在注入的时候使用的是最终的代理对象。三级缓存中的工厂可以处理这种情况，
者代理对象，而二级缓存可能无法处理这种情况，导致多次代理 或者 代理不一致的问题。


示例1


比如，当Bean A被AOP代理时，在创建A的原始对象后，会有一个工厂放入三级缓存。当其他Bean B需要引用A时，会通过
象，然后将这个代理对象放到二级缓存中。这样后续再需要A的时候，可以直接从二级缓存拿到代理对象，而不用再通过工
没有三级缓存，只有二级的话，可能在处理代理对象的时候会遇到问题，比如多次调用工厂或者无法正确生成代理。


另外，三级缓存的存在可能还涉及到性能优化。比如，避免在不需要的时候过早地创建代理对象，只有在有循环依赖的情况
理，这样在无循环依赖的情况下，可以延迟代理的创建，提高效率。


不过，可能有些情况下二级缓存也可以解决循环依赖的问题，但为什么Spring选择了三级呢？比如，假设只有一级和二级缓
实例化后放到二级缓存，然后填充属性时发现需要Bean B。Bean B在创建时同样需要Bean A，这时候从二级缓存拿到A的
建，然后A继续填充。这样看起来可能可以解决循环依赖。但问题在于，如果A需要被代理的话，这时候在二级缓存中的A可
是代理后的对象。而Spring的AOP通常是在Bean初始化后处理的，比如通过BeanPostProcessor。这时候，如果在填充属
象，但最终Bean却是代理对象，就会导致不一致，因为其他Bean引用的可能是原始对象，而不是代理后的，这样AOP的增


所以，为了解决这个问题，Spring引入了三级缓存，在需要提前暴露Bean的时候，不是直接暴露实例，而是通过一个工厂
理需要代理的情况，返回代理后的对象。这样，当存在循环依赖时，通过三级缓存中的工厂，可以生成正确的代理对象，并
直接从二级缓存获取，而不用每次都通过工厂创建，同时保证所有依赖方都使用同一个代理对象。


总结一下，三级缓存主要是为了解决循环依赖中存在的代理问题，确保即使存在AOP代理，也能正确地处理依赖注入，避免
二级缓存可能无法处理这种情况，导致代理对象被多次创建或引用的对象不正确。因此，Spring设计三级缓存是为了更细粒
程，处理各种复杂的依赖场景，尤其是涉及AOP的情况。


五、总结


一级缓存：用于存储被完整创建了的bean。也就是完成了初始化之后，可以直接被其他对象使用的bean。


二级缓存：用于存储半成品的Bean。也就是刚实例化但是还没有进行初始化的Bean


三级缓存：三级缓存存储的是工厂对象（lambda表达式）。工厂对象可以产生Bean对象提前暴露的引用（半成品的B
an对象），执行这个lambda表达式，就会将引用放入二级缓存中


经过以上的分析，现在应该懂了吧：


循环依赖是否一定需要三级缓存来解决？ 不一定，但三级缓存会更合适，风险更小


二级缓存能否解决循环依赖？ 可以，但风险比三级缓存更大


第二级缓存用来干嘛的？ 存放半成品的引用，可能产生多对象循环依赖，第三级缓存产生引用后，后续的就可以直接注入该


多例、构造器注入为什么不能解决循环依赖 ？


1、多例（Prototype）Bean为何无法解决循环依赖？


核心原因：作用域的生命周期不同


单例Bean的缓存机制：


`Spring` 通过三级缓存（ `singletonObjects` 、 `earlySingletonObjects` 、 `singletonFactories` ）管理单例 `Bean` 的创建过程，

`ean` 实例，以解决循环依赖


多例Bean的特性：


`Prototype` 作用域的 `Bean` 每次请求都会创建一个新实例， `Spring` 不缓存多例 `Bean` 的实例，因此无法在创建过程中提前暴露一个 `“` 半成


用。


具体场景示例


问题：当尝试获取Bean A或B时，Spring会尝试为每个Bean创建一个新实例，但由于它们相互依赖，每次创建都需要另一
限递归，最终抛出 BeanCurrentlyInCreationException


2、构造器注入为何无法解决循环依赖 ？


核心原因：实例化与依赖注入的顺序冲突


构造器注入的时机：


构造器注入发生在 `Bean` 的实例化阶段，此时 `Bean` 还未完成初始化，无法通过提前暴露引用（如三级缓存）解决循环依赖


属性注入（Setter注入）的时机：


属性注入发生在 `Bean` 实例化之后，此时 `Spring` 可以通过三级缓存提前暴露一个未完成属性填充的 `Bean` ，供其他对象引用


具体场景示例



<img src="/img/spring.pdf-13-0.png">13-0
<img src="/img/spring.pdf-14-0.png">14-0

问题：创建Bean A时，需要先实例化Bean B；而实例化Bean B时，又需要先实例化Bean A。两者互相等待对方完成实例化
BeanCurrentlyInCreationException


**谈谈为什么三重缓存是必要的**


**笔记本：** spring


**创建时间：** 2025/7/12 11:16 **更新时间：** 2025/7/12 11:26
## 谈谈为什么三重缓存是必要的


首先我们三重缓存应该是逻辑上的三重而不是物理上的三重。比如说其实我们可以

只使用一个map就可以实现三重缓存，而不用使用三个map。


首先，第一层缓存是必须存在的，因为它用来存放bean对象。


那么第二层缓存呢。


第二层缓存叫earlySingletonObjects，是用来存放早期对象的。早期对象也就是

半成品对象，spring利用半成品对象来提前暴露对象，从而解决循环依赖问题。

具体可以看上一篇博客。


那第三层缓存呢


在解决循环依赖的过程中三重缓存的作用是存放一个lamda表达式，这个表达式的


作用是把半成品bean放入二层缓存。那么我们为什么不直接把半成品bean放入第


二层缓存，而是要新建一个三层缓存呢。


其实是为了解决代理对象的问题。


这里做了一个判断，判断是否实现了后置处理器，如果实现了就加工bean



<img src="/img/spring.pdf-15-0.png">15-0

<img src="/img/spring.pdf-15-1.png">15-1
<img src="/img/spring.pdf-16-0.png">16-0

它有一个实现类叫autoProxy，自动代理，可以自动创建代理对象。


去掉三层缓存的话，spring的bean就只能存放普通bean而不能存放代理bean


了。


至于为什么需要使用lamda表达式。是利用了lamda表达式延迟实现的特性。只有


当你开始属性注入时，你才能知道这个bean是不是需要代理。而lamda表达式刚


好是调用了采取创建bean。而不是提前把bean放入缓存。


所以不改变执行顺序的前提下三层缓存不能缺少，但是如果改变逻辑，没创建一个


早期对象就创建一个代理对象就可以省去一层缓存，但得不偿失，没有必要


**Spring第三篇-@Configuration和@Bean,@Configuration加不加到底区别在哪_beanconfig-**
**CSDN博客**


**笔记本：** spring


**创建时间：** 2025/7/11 22:15 **更新时间：** 2025/7/11 22:21
## Spring第三篇-@Configuration和 @Bean,@Configuration加不加到底 区别在哪


本文详细介绍了Spring中@Configuration和@Bean注解的使用。

@Configuration注解用于将类转换为配置元数据，等同于XML配置文件。

@Bean注解则标记在方法上，表示该方法将返回一个bean实例到Spring容器。当

使用@Configuration时，Spring会通过CGLIB创建类的代理，确保被@Bean注解

的方法只被调用一次，确保单例。通过案例展示了@Configuration的加入如何影

响bean的创建和依赖关系。

#### @ Configuration 注解


@Configuration这个注解可以加在类上，让这个类的功能等同于一个bean xml

配置文件。



<img src="/img/spring.pdf-17-0.png">17-0



效果等同于



<img src="/img/spring.pdf-17-1.png">17-1





@Configuration 使用步骤：


1. 在类上使用 @Configuration 注解

2. 通过 AnnotationConfigApplicationContext 容器来加载 @Configuration

注解修饰的类

#### @Bean注解


用法：

这个注解类似于bean xml配置文件中的bean元素，用来在spring容器中注册一个

bean。


@Bean注解用在方法上，表示通过方法来定义一个bean，默认将方法名称作为


bean名称，将方法返回

值作为bean对象，注册到spring容器中。



<img src="/img/spring.pdf-17-2.png">17-2


<img src="/img/spring.pdf-18-0.png">18-0





看一@Bean的源码：



<img src="/img/spring.pdf-18-1.png">18-1





@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})说明这

个注解可以用在方法和注解类型上面


每个参数含义：


1. value和name是一样的，设置的时候，这2个参数只能选一个，原因是


@AliasFor导致的


@AliasFor这个注解不清楚的可以看这个文章：（文章最后）


https://blog.csdn.net/whatname123/article/details/107721423

1. value：字符串数组，第一个值作为bean的名称，其他值作为bean的别名

2. autowire：这个参数上面标注了@Deprecated，表示已经过期了，不建议使


用了


3. autowireCandidate：是否作为其他对象注入时候的候选bean。有多个同类型

的bean，在spring不知道选哪个的时候起作用。

4. initMethod：bean初始化的方法，这个和生命周期有关，这里先不讲

5. destroyMethod：bean销毁的方法，也是和生命周期相关的，先不讲


使用：

```
 class User {

 }

 @Configuration

 public class BeanConfig {

 //bean 名称为方法默认值： user1

 Bean

 public User user1(){

 return new User();

 }

 //bean 名称通过 value 指定了： userBean

 @Bean("userBean")

 public User user2(){

 return new User();

```

```
 }

 //bean 名称为： userBean1 ， 2 个别名： [testBean,myBean]

 @Bean({"userBean1","testBean","myBean"})

 public User user3(){

 return new User();

 }

 }

```

输出（只截取了部分）：



<img src="/img/spring.pdf-19-0.png">19-0


#### 去掉@Configuration会怎么样？

我们在BeanConfig类中去掉@Configuration

测试输出：



<img src="/img/spring.pdf-19-1.png">19-1





对比上面的输出得出结论：


1. 对比最后3行，可以看出：有没有@Configuration注解，@Bean都会起效，

都会将@Bean修饰的方法作为bean注册到容器中

2. 两个内容的第一行有点不一样，被@Configuration修饰的bean最后输出的时

候带有

EnhancerBySpringCGLIB 的字样，而没有@Configuration注解的bean没有

Cglib的字样；有EnhancerBySpringCGLIB 字样的说明这个bean被cglib处理

过的，变成了一个代理对象。

关于cglib不清楚的请看这篇文章


https://blog.csdn.net/whatname123/article/details/115578231

#### @Configuration加不加到底区别在哪？


通常情况下，bean之间是有依赖关系的，我们来创建个有依赖关系的bean，通过


这个案例你就可以看出根本的区别了。


案例一：（不加@Configuration）

```
 package com.test.annotation;

 import org.springframework.context.annotation.Bean;

 import org.springframework.context.annotation.Configuration;

```

<img src="/img/spring.pdf-20-0.png">20-0





测试类还是用上面的测试类就行。


输出结果（截取部分）：



<img src="/img/spring.pdf-20-1.png">20-1





加上@Configuration后

输出结果（截取部分）：


<img src="/img/spring.pdf-21-0.png">21-0





通过对比可以看出：


1. 有@Configuration的，被@Bean修饰的方法都只被调用了一次。

2. 有@Configuration的，所有的User都是同一个


这是为什么？

**被@Configuration修饰的类，spring容器中会通过cglib给这个类创建一个代**

**理，代理会拦截所有被@Bean 修饰的方法，默认情况（bean为单例）下确保这**


**些方法只被调用一次，从而确保这些bean是同一个bean，即单例的**

@Configuration修饰的类有cglib代理效果，默认添加的bean都为单例


**大公司为什么禁止在SpringBoot项目中使用@Autowired注解？**


**笔记本：** spring


**创建时间：** 2024/1/8 15:36 **更新时间：** 2024/1/8 15:44


S p r i n g 官方已不推荐使用 A u t o w i r e d 字段 / 属性注入 b e a n, ，一些大公司的新项


目也明令禁止使用了。


**1. 说明**


最近公司升级框架，由原来的 `s p r i n g f r a m e r w o r k 3 . 0` 升级到 `5 . 0` ，然后写代码


的时候突然发现 i d e a 在属性注入的 @ A u t o w i r e d 注解上给出警告提示，就像下


面这样的，也挺懵逼的，毕竟这么写也很多年了。


F i e l d i n j e c t i o n i s n o t r e c o m m e n d e d


查阅了相关文档了解了一下，原来这个提示是 `s p r i n g f r a m e r w o r k 4 . 0` 以后开


始出现的， s p r i n g 4 . 0 开始就不推荐使用属性注入，改为推荐构造器注入和


s e t t e r 注入。


下面将展示了 s p r i n g 框架可以使用的不同类型的依赖注入，以及每种依赖注入


的适用情况。



<img src="/img/spring.pdf-22-0.png">22-0

<img src="/img/spring.pdf-22-1.png">22-1

<img src="/img/spring.pdf-22-2.png">22-2





尽管针对 `s p r i n g f r a m e r w o r k 5 . 1 . 3` 的文档只定义了两种主要的依赖注入类


型，但实际上有三种：


基于构造函数的依赖注入


基于setter的依赖注入


基于字段的依赖注入


其中 `基于字段的依赖注入` 被广泛使用，但是 i d e a 或者其他静态代码分析工具会给出


提示信息，不推荐使用。


甚至可以在一些 S p r i n g 官方指南中看到这种注入方法 :


<img src="/img/spring.pdf-23-0.png">23-0

**2.1 基于构造函数的依赖注入**


在基于构造函数的依赖注入中，类构造函数被标注为 @ A u t o w i r e d ，并包含了许


多与要注入的对象相关的参数。



<img src="/img/spring.pdf-23-1.png">23-1



然后在 s p r i n g 官方文档中， @ A u t o w i r e d 注解也是可以省去的。

```
public class SimpleMovieLister {

  // the SimpleMovieLister has a dependency on a MovieFinder

  private MovieFinder movieFinder;

  // a constructor so that the Spring container can inject a MovieFinder

  public SimpleMovieLister(MovieFinder movieFinder) {

    this.movieFinder = movieFinder;

}

  // business logic that actually uses the injected MovieFinder is omitted...

 }

```

基于构造函数注入的主要优点是可以将需要注入的字段声明为 f i n a l ， 使得它们


会在类实例化期间被初始化，这对于所需的依赖项很方便。


**2.2 基于Setter的依赖注入**


在基于 s e t t e r 的依赖注入中， s e t t e r 方法被标注为 @ A u t o w i r e d 。一旦使用无参


数构造函数或无参数静态工厂方法实例化 B e a n ，为了注入 B e a n 的依赖项，


S p r i n g 容器将调用这些 s e t t e r 方法。



<img src="/img/spring.pdf-24-0.png">24-0



和基于构造器的依赖注入一样，在官方文档中，基于 S e t t e r 的依赖注入中的


@ A u t o w i r e d 也可以省去。



<img src="/img/spring.pdf-24-1.png">24-1





**2.3 基于属性的依赖注入**


在基于属性的依赖注入中，字段 / 属性被标注为 @ A u t o w i r e d 。一旦类被实例


化， S p r i n g 容器将设置这些字段。



<img src="/img/spring.pdf-24-2.png">24-2





正如所看到的，这是依赖注入最干净的方法，因为它避免了添加样板代码，并且


不需要声明类的构造函数。代码看起来很干净简洁，但是正如代码检查器已经向


我们暗示的那样，这种方法有一些缺点。


<img src="/img/spring.pdf-25-0.png">25-0

<img src="/img/spring.pdf-25-1.png">25-1





**3.1 不允许声明不可变域**


基于字段的依赖注入在声明为 f i n a l / i m m u t a b l e 的字段上不起作用，因为这


些字段必须在类实例化时实例化。声明不可变依赖项的惟一方法是使用基于构造


器的依赖注入。


**3.2 容易违反单一职责设计原则**


在面向对象的编程中，五大设计原则 S O L I D 被广泛应用，（国内一般为六大设计


原则），用以提高代码的重用性，可读性，可靠性和可维护性


_S_ 在 S O L I D 中代表单一职责原则，即即一个类应该只负责一项职责，这个类提供


的所有服务都应该只为它负责的职责服务。


使用基于字段的依赖注入，高频使用的类随着时间的推移，我们会在类中逐渐添


加越来越多的依赖项，我们用着很爽，很容易忽略类中的依赖已经太多了。但是


如果使用基于构造函数的依赖注入，随着越来越多的依赖项被添加到类中，构造


函数会变得越来越大，我们一眼就可以察觉到哪里不对劲。


有一个有超过 1 0 个参数的构造函数是一个明显的信号，表明类已经转变一个大


而全的功能合集，需要将类分割成更小、更容易维护的块。


因此，尽管属性注入并不是破坏单一责任原则的直接原因，但它隐藏了信号，使


我们很容易忽略这些信号。


**3.3 与依赖注入容器紧密耦合**


使用基于字段的依赖注入的主要原因是为了 避免 **g e t t e r** 和 **s e t t e r** 的样板代码或


为类创建构造函数 。最后，这意味着设置这些字段的唯一方法是通过 S p r i n g 容


器实例化类并使用反射注入它们，否则字段将保持 n u l l 。


依赖注入设计模式将类依赖项的创建与类本身分离开来，并将此责任转移到类注


入容器，从而允许程序设计解耦，并遵循单一职责和依赖项倒置原则 ( 同样可


靠 ) 。因此，通过自动装配（ a u t o w i r i n g ）字段来实现的类的解耦，最终会因为


再次与类注入容器 ( 在本例中是 S p r i n g ) 耦合而丢失，从而使类在 S p r i n g 容器之


外变得无用。


这意味着，如果您想在应用程序容器之外使用您的类，例如用于单元测试，您将


被迫使用 S p r i n g 容器来实例化您的类，因为没有其他可能的方法 ( 除了反射 ) 来


设置自动装配字段。


**3.4 隐藏依赖关系**


在使用依赖注入时，受影响的类应该使用公共接口清楚地公开这些依赖项，方法


是在构造函数中公开所需的依赖项，或者使用方法 ( s e t t e r ) 公开可选的依赖项。


当使用基于字段的依赖注入时，实质上是将这些依赖对外隐藏了。


**4. 总结**


我们已经看到，基于字段的注入应该尽可能地避免，因为它有许多缺点，无论它


看起来多么优雅。推荐的方法是使用基于构造函数和基于 s e t t e r 的依赖注入。对


于必需的依赖，建议使用基于构造函数的注入，设置它们为不可变的，并防止它


们为 n u l l 。对于可选的依赖项，建议使用基于 s e t t 的注入。


**springboot程序启动指定环境变量**


**笔记本：** spring


**创建时间：** 2023/12/11 22:30 **更新时间：** 2023/12/11 22:32

##### **springBOOT程序启动的时候根据环境变量** **配置指定要加载的application*.yml**



<img src="/img/spring.pdf-27-0.png">27-0


```
java -jar springboot.jar -Dspring.profiles.active=dev

```

**SpringBoot使用ApplicationContext对象获取Bean**


**笔记本：** spring


**创建时间：** 2023/12/11 22:28 **更新时间：** 2023/12/11 22:29

##### **SpringBoot使用ApplicationContext对象获取Bean**





（1）创建User（用户信息实体类），并在类上添加@Component注解。



<img src="/img/spring.pdf-28-1.png">28-1



（2）通过ApplicationContext对象获取Bean。



<img src="/img/spring.pdf-28-2.png">28-2




**@Autowired注解与@resource注解的区别(十分详细)**


**笔记本：** spring


**创建时间：** 2023/12/11 22:06 **更新时间：** 2023/12/11 22:07

# **背景：**


今天下班路上看到一个大货车，于是想到了装配，然后脑海里跳出了一个注解@Autowired（自动装配），于


是又想到最近工作项目用的都是@Resource注解来进行装配。于是本着学什么东西都要一钻到底才能从菜鸟


变大神的精神！！我就认真研究了一下，在此总结一波。以下内容先分别解释一下两个注解，再进行共同点与


不同点的总结。

# **@Autowired**


@Autowired为Spring提供的注解，需要导入包org.springframework.beans.factory.annotation.Autowired。


@Autowired采取的策略为按照类型注入。



<img src="/img/spring.pdf-29-0.png">29-0



如上代码所示，这样装配回去spring容器中找到类型为UserDao的类，然后将其注入进来。这样


会产生一个问题，当一个类型有多个bean值的时候，会造成无法选择具体注入哪一个的情况，


这个时候我们需要配合着@Qualifier使用。


@Qualifier告诉spring具体去装配哪个对象。

```
 public class UserService {

 @Autowired

 @Qualifier(name="userDao1")

 private UserDao userDao;

 }

```

这个时候我们就可以通过类型和名称定位到我们想注入的对象。

# **@Resource**


@Resource注解由J2EE提供，需要导入包javax.annotation.Resource。


@Resource默认按照ByName自动注入。

```
 public class UserService {

 @Resource

 private UserDao userDao;

 @Resource(name="studentDao")

 private StudentDao studentDao;

 @Resource(type="TeacherDao")

 private TeacherDao teacherDao;

 @Resource(name="manDao",type="ManDao")

 private ManDao manDao;

 }

```

①如果同时指定了name和type，则从Spring上下文中找到唯一匹配的bean进行装配，找不到则


抛出异常。


②如果指定了name，则从上下文中查找名称（id）匹配的bean进行装配，找不到则抛出异常。


③如果指定了type，则从上下文中找到类似匹配的唯一bean进行装配，找不到或是找到多个，


都会抛出异常。


④如果既没有指定name，又没有指定type，则自动按照byName方式进行装配；如果没有匹


配，则回退为一个原始类型进行匹配，如果匹配则自动装配。

# **总结:**


**Spring属于第三方的，J2EE是Java自己的东西。使用@Resource可以减少代码和Spring之间**


**的耦合。**


两者都可以写在字段和setter方法上。两者如果都写在字段上，那么就不需要再写setter方法。


当存在多个类型，却又没有指定的时候，会报如下的错误:



<img src="/img/spring.pdf-30-0.png">30-0


**springmvc中，加入@RequestParam，出现400的解决办法**


**笔记本：** spring


**创建时间：** 2023/12/11 21:15 **更新时间：** 2023/12/11 21:15

##### **springmvc中，加入@RequestParam，出现400的解决办法**


今天在做项目的时候，遇到一个bug,当我使用 springmvc 中的@RequestParam的注解时，浏览器显示400.


原来在使用@RequestParam这个标签的时候，必须给他设置value.

```
   @RequestParam(value="mh", required = false)

```

**@ConditionalOnProperty的作用和用法**


**笔记本：** spring


**创建时间：** 2023/12/11 21:01 **更新时间：** 2023/12/11 21:02


**@ConditionalOnProperty的作用和用法**

在spring boot中有时候需要控制配置类是否生效,可以使用@ConditionalOnProperty注解来控制@ **Configurati**


**配置类代码:**

```
 @Configuration

 @ConditionalOnProperty(prefix = "filter",name = "loginFilter",havingValue = "true")

 public class FilterConfig {

 //prefix 为配置文件中的前缀,

 //name 为配置的名字

 //havingValue 是与配置的值对比值, 当两个值相同返回 true, 配置类生效 .

 @Bean

 public FilterRegistrationBean getFilterRegistration() {

 FilterRegistrationBean filterRegistration = new FilterRegistrationBean(new LoginFilter());

 filterRegistration.addUrlPatterns("/*");

 return filterRegistration;

 }

 }

```

**配置文件中的代码**

```
 filter.loginFilter=true

```

**测试**


当配置文件中值为true时:输出了"过滤器"三个字,说明loginFilter生效了,说明配置类生效了.


当配置文件中值为false时:没有输出了"过滤器"三个字,说明loginFilter没有生效,说明配置类没有生效.


**总结:**


通过@ConditionalOnProperty控制配置类是否生效,可以将配置与代码进行分离,实现了更好的控制配置.


@ConditionalOnProperty实现是通过havingValue与配置文件中的值对比,返回为true则配置类生效,反之失效.



<img src="/img/spring.pdf-32-0.png">32-0

<img src="/img/spring.pdf-32-1.png">32-1
**@PostConstruct详解**


**笔记本：** spring


**创建时间：** 2023/12/11 20:10 **更新时间：** 2023/12/11 20:12

##### **@PostConstruct详解**


**定义：**


@PostConstruct是Java自带的注解，在方法上加该注解会在项目启动的时候执行该方法，


也可以理解为在spring容器初始化的时候执行该方法。


从Java EE5规范开始，Servlet中增加了两个影响Servlet生命周期的注解，


@PostConstruct和@PreDestroy，这两个注解被用来修饰一个非静态的void（）方法。


**用法：**

```
 @PostConstruct

 public void someMethod(){}

```

或者

```
 public @PostConstruct void someMethod() {}

```

**作用：**


@PostConstruct注解的方法 **在项目启动的时候执行这个方法** ，也可以理解为在spring容器启动的时候执行，


可作为一些数据的常规化加载，比如数据字典之类的。


**执行顺序：**


其实从依赖注入的字面意思就可以知道，要将对象p注入到对象a，


那么首先就必须得生成对象a和对象p，才能执行注入。


所以，如果一个类A中有个成员变量p被@Autowried注解，那么@Autowired注入是发生在A的构造方法执行完之


如果想在生成对象时完成某些初始化操作，而偏偏这些初始化操作又依赖于依赖注入，那么久无法在构造函数


为此，可以使用@PostConstruct注解一个方法来完成初始化，@PostConstruct注解的方法将会在依赖注入完成


Constructor >> @Autowired >> @PostConstruct


<img src="/img/spring.pdf-34-0.png">34-0
**【Spring】Bean 的作用域和生命周期**


**笔记本：** spring


**创建时间：** 2023/11/6 0:59 **更新时间：** 2023/11/6 1:07

##### **【Spring】Bean 的作用域和生命周期**


**1. Bean 的作用域**


**1.1 通过一个案例来看 Bean 作用域的问题**


假设现有一个公用的 Bean，提供给两个用户 A 和 B 使用，但是在使用途中 A 用户在 B 用户不知情下修改
导致用户 B 拿到的 Bean 不是预设的 Bean


**公共 Bean**

```
 @Slf4j
 @Component
 @Data
 public class User {
 public int uid ;
 public String name ;

 public User() {
 this. uid = 1024;
 this. name = "java";
 log .info("User 的构造方法被调用，user 对象被创建 {}", this);
 }

 @Override
 public String toString() {
 return "User{" +
 "uid=" + uid +

 ", name='" + name + '/'' +

 ", hashCode()=" + this.hashCode() +
 '}';
 }
 }

```

**A 用户使用时，对 Bean 进行了修改**

```
 @Slf4j
 @Component
 public class CommandLine1 implements CommandLineRunner {
 private final User user ;

 @Autowired
 public CommandLine1(User user ) {
 this. user = user ;

 }

 @Override
 public void run(String... args ) throws Exception {
 user .setName("hsq");
 log .info("CommandLine-1 下的 user 是 {}", user );
 }
 }

```

**B 用户拿到 Bean 时**

```
 @Slf4j
 @Component
 public class CommandLine2 implements CommandLineRunner {
 private final User user ;

```

```
 @Autowired
 public CommandLine2(User user ) {

 this. user = user ;
 }

 @Override
 public void run(String... args ) throws Exception {
 log .info("CommandLine-2 下的 user 是 {}", user );
 }
 }

```

**原因分析**


操作以上问题的原因是因为 Bean 默认情况下是 [单例](https://so.csdn.net/so/search?q=%E5%8D%95%E4%BE%8B&spm=1001.2101.3001.7020) 状态（singleton），也就是所有人的使用的都是同一
单例可以很大程度上提高性能，所以在 Spring 中 Bean 的作用域默认也是 singleton 单例模式。


**1.2 作用域的定义**


限定程序中变量的可用范围叫做作用域，或者说在源代码中定义变量的某个区域就叫做作用域。
而 Bean 的作用域是指 Bean 在 Spring 整个框架中的某种行为模式，比如 singleton 单例作用域，
就表示 Bean 在整个 Spring 中只有一份，它是全局共享的，
那么当其他人修改了这个值之后，那么另一个人读取到的就是被修改的值。


**1.3 Spring Bean 支持的作用域（未介绍完全）**


**singleton**


单例，Spring 中默认的作用域


**prototype**


每次从 Spring 容器中 get Bean 对象，都会触发一次创建过程，每个对象都是独立的对象
context.getBean(User.class) <=> new User()


**request**


以请求为单位，一次请求过程中，从开始到结尾，期间 context.getBean() 拿到的都是同一个 Bean ，
但如果不同请求，则获取对象不同


**session**


以用户 Session 为单位。每个用户都有自己独立的 Bean，context.getBean() 根据不同的 session，得到不



<img src="/img/spring.pdf-36-0.png">36-0
<img src="/img/spring.pdf-37-0.png">37-0

**1.4 修改 Bean 的作用域**


使用 @Scope() 注解修饰 Bean（参数填上作用域名），即可修改 Bean 的作用域，不加注解默认为 singlet


**1.5 Bean 执行流程**


1. 启动容器，加载配置文件（类加载路径下的 XML 文件）


2. 根据配置完成 Bean 初始化，扫描与 application 文件同包下的 @Controller、@Service、@Component、@Reposito


3. 注册 Bean 到容器中，如果 Bean 需要使用其他 Bean 作为属性，需提前注入


4. 将 Bean 注入到需要的类中


**2. Bean 的生命周期**


所谓的生命周期指的是一个对象从诞生到销毁的整个生命过程，我们把这个过程就叫做一个对象的生命周期


**2.1 Bean 的生命周期分为以下 5 大部分**


**2.1.1 实例化 Bean（为 Bean 分配内存空间）**


**2.1.2 设置属性（Bean 注入和装配）**


**2.1.3 Bean 初始化**


实现了各种 Aware 通知的方法，如 BeanNameAware、InitializingBean 等的接口方法


执行 BeanPostProcessor 初始化前置方法；


执行 @PostConstruct 初始化方法，依赖注入操作之后被执行；


执行自己指定的 init-method 方法（如果有指定的话）；


执行 BeanPostProcessor 初始化后置方法。


**2.1.4 Bean 使用**


**2.1.5 销毁 Bean**


销毁容器的各种方法，如 @PreDestroy、DisposableBean 接口方法、destroy-method。


**2.2 Bean 的生命周期执行流程**


**2.3 生命周期演示**

```
 @Slf4j
 @Component
 public class LifeOfBean implements ApplicationContextAware, BeanNameAware, BeanClassLoaderAwar
 ResourceLoaderAware, InitializingBean {

 @Autowired
 public LifeOfBean() {

                      "
 log .info("LifeOfBean 的构造方法 );
 }

 @Autowired
 public void setName(@Value("${custom-user.name}") String name ) {

                                "
 log .info("LifeOfBean 的 setName(name = {}) 方法, name );
 }

```

_`//`_ 一定发生属性被注入之后， _`bean`_ 被使用之前



<img src="/img/spring.pdf-38-0.png">38-0
`@PostConstruct` _`//`_ 指定 _`init-method`_
```
public void initMethod() {

                           "
log .info("LifeOfBean 的 init-method 方法 );

}

@Override
public void setApplicationContext(ApplicationContext applicationContext ) throws BeansExceptio
log .info("LifeOfBean 的 setApplicationContext(), applicationContext = {}", applicationCon
}

@Override
public void setBeanName(String name ) {
log .info("LifeOfBean 的 setBeanName(), beanName = {}", name );

}

@Override
public void setBeanClassLoader(ClassLoader classLoader ) {
log .info("LifeOfBean 的 setBeanClassLoader(), classLoader = {}", classLoader );

}

@Override
public void setResourceLoader(ResourceLoader resourceLoader ) {
log .info("LifeOfBean 的 setResourceLoader(), resourceLoader = {}", resourceLoader );

}

```

_`//`_ 一定发生属性被注入之后， _`bean`_ 被使用之前
```
@Override
public void afterPropertiesSet() throws Exception {
log .info("LifeOfBean 的 afterPropertiesSet()");
}

```

_`//`_ 销毁 _`Bean`_
```
@PreDestroy
public void preDestroy() {

         "
log .info( 执行：preDestroy()");
}
}

@Slf4j
@SpringBootApplication
public class BeanApplication {
public static void main(String[] args ) {
ConfigurableApplicationContext context = SpringApplication.run(BeanApplication.class,

                         "
log .info("Spring Application 启动结束 );

LifeOfBean bean = context .getBean(LifeOfBean.class);

         "
log .info( 拿到手的 bean: {}", bean );
}
}

```


<img src="/img/spring.pdf-39-0.png">39-0
**SpringBoot事务配置管理(5大隔离级别及传播机制详解)**


**笔记本：** spring


**创建时间：** 2023/11/6 0:45 **更新时间：** 2023/11/6 0:48



<img src="/img/spring.pdf-41-0.png">41-0
<img src="/img/spring.pdf-42-0.png">42-0


<img src="/img/spring.pdf-43-0.png">43-0

<img src="/img/spring.pdf-43-1.png">43-1








<img src="/img/spring.pdf-44-0.png">44-0


<img src="/img/spring.pdf-45-0.png">45-0


<img src="/img/spring.pdf-46-0.png">46-0


**@Transactional(readOnly = true) 意义**


**笔记本：** spring


**创建时间：** 2021/10/14 20:29 **更新时间：** 2023/9/18 21:29


**作者：** 彼岸樱速



<img src="/img/spring.pdf-47-0.png">47-0
**spring @lazy注解的使用**


**笔记本：** spring


**创建时间：** 2023/6/13 14:01 **更新时间：** 2023/6/13 15:57

##### **spring @lazy注解的使用**


在spring中@lazy注解表达延迟的含义，但在不同情况下，这里的延迟并不是同一层意思。下面将描述我发现的


**1. 延迟初始化bean**


首先我们知道，容器启动之前会扫描所有的class文件，并将需要加载到容器中的类，整理成 [BeanDefinition](https://so.csdn.net/so/search?q=BeanDefinition&spm=1001.2101.3001.7020)


容器启动时将依次将BeanDefinition构建成bean，构建过程中同时解决依赖注入和循环引用的问题。


但并不是所有的BeanDefinition都会被构建成bean，


观察源码中下面方法 `org.springframework.beans.factory.support.DefaultListableBeanFactory#preInstantiateSingletons`


此为容器启动过程时，从BeanDefinition构建成bean的入口。这里有三种情况不会进行初始化，


非抽象类


是 [单例](https://so.csdn.net/so/search?q=%E5%8D%95%E4%BE%8B&spm=1001.2101.3001.7020) 模式的bean


非Lazy模式的


所以这里就体现了Lazy的第一层含义，添加Lazy的注解的bean不会在容器启动时主动创建。

```
 @Override

 public void preInstantiateSingletons() throws BeansException {

 if (logger.isTraceEnabled()) {

 logger.trace("Pre-instantiating singletons in " + this);

 }

 // Iterate over a copy to allow for init methods which in turn register new bean definitions.

 // While this may not be part of the regular factory bootstrap, it does otherwise work fine.

 List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);

 // Trigger initialization of all non-lazy singleton beans...

 for (String beanName : beanNames) {

 RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);

 if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {

 if (isFactoryBean(beanName)) {

 Object bean = getBean(FACTORY_BEAN_PREFIX + beanName);

 if (bean instanceof FactoryBean) {

 FactoryBean<?> factory = (FactoryBean<?>) bean;

 boolean isEagerInit;

 if (System.getSecurityManager() != null && factory instanceof SmartFactoryBean)

 isEagerInit = AccessController.doPrivileged(

 (PrivilegedAction<Boolean>) ((SmartFactoryBean<?>) factory)::isEagerInit,

 getAccessControlContext());

 }

 else {

 isEagerInit = (factory instanceof SmartFactoryBean &&

 ((SmartFactoryBean<?>) factory).isEagerInit());

 }

 if (isEagerInit) {

 getBean(beanName);

```

```
 }

 }

 }

 else {

 getBean(beanName);

 }

 }

 }

```

有两种方式添加Lazy注解，一种直接在类上加@Lazy注解。一种是如果使用@Bean模式创建的bean，在方法上


但这里Lazy的含义仅仅是不在容器启动时主动生成bean，但可能会被动生成bean。


如果bean A被 bean B依赖，A是lazy的，在启动时虽然A不会被主动创建，但在创建B时，需要依赖A，此时A


所以仅对某个bean的创建添加Lazy意义不是特别大，因为bean相互之间都是有依赖关系的，即使不主动创建也


**2. 延迟** [依赖注入](https://so.csdn.net/so/search?q=%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5&spm=1001.2101.3001.7020)


第二种Lazy的方式就比较有用了，如下面的例子。

```
 @Component

 public class A {

 }

 public class B {

 @Lazy

 @Resource

 private A a;

 }

```

这个例子中B依赖A。在构建B时需要将A注入，但是我们添加了@Lazy注解，注入时并不会真的从容器中查找A


而是注入一个A的动态代理。在运行阶段，调用动态代理类的方法时，才会真的从容器中查找A。


下面代码是 `org.springframework.context.annotation.CommonAnnotationBeanPostProcessor`


的内部类，这里是负责依赖注入时查找依赖的部分， `getResourceToInject` 方法里进行判断，


如我上面讲的，如果是lazy的依赖则会生成动态代理，否则才会从容器中真实获取。


`lazyLookup` 变量的在 `ResourceElement` 的构造方法里获取的。

```
 private class ResourceElement extends LookupElement {

 private final boolean lazyLookup;

 public ResourceElement(Member member, AnnotatedElement ae, @Nullable PropertyDescriptor pd) {

 super(member, pd);

 Resource resource = ae.getAnnotation(Resource.class);

 String resourceName = resource.name();

 Class<?> resourceType = resource.type();

 this.isDefaultName = !StringUtils.hasLength(resourceName);

 if (this.isDefaultName) {

 resourceName = this.member.getName();

 if (this.member instanceof Method && resourceName.startsWith("set") && resourceName.len

 resourceName = Introspector.decapitalize(resourceName.substring(3));

 }

```

```
 }

 else if (embeddedValueResolver != null) {

 resourceName = embeddedValueResolver.resolveStringValue(resourceName);

 }

 if (Object.class != resourceType) {

 checkResourceType(resourceType);

 }

 else {

 // No resource type specified... check field/method.

 resourceType = getResourceType();

 }

 this.name = (resourceName != null ? resourceName : "");

 this.lookupType = resourceType;

 String lookupValue = resource.lookup();

 this.mappedName = (StringUtils.hasLength(lookupValue) ? lookupValue : resource.mappedName()

 Lazy lazy = ae.getAnnotation(Lazy.class);

 this.lazyLookup = (lazy != null && lazy.value());

 }

 @Override

 protected Object getResourceToInject(Object target, @Nullable String requestingBeanName) {

 return (this.lazyLookup ? buildLazyResourceProxy(this, requestingBeanName) :

 getResource(this, requestingBeanName));

 }

 }

```

**3.配合使用**


综上所述，如果将@Lazy 添加在类上，虽不会主动创建，但被依赖时还会被创建。


如果将@Lazy添加到注入的字段上，可以推迟注入的时间到运行时，但依赖已经被创建了，只是没注入而已，


将两者配合使用，即可达到运行时再创建需要的对象，如果不需要可一直不创建。


1 @Lazy的简介
@Lazy注解用于标识bean是否需要延迟加载.

```
 @Target({ElementType.TYPE, ElementType.METHOD, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.FIELD})
 @Retention(RetentionPolicy.RUNTIME)
 @Documented
 public @interface Lazy {

 /**
 * Whether lazy initialization should occur.
 */
 boolean value() default true;

 }

```

查看注解源码可知,只有一个参数, 默认为true, 即添加该注解的bean对象就会延迟初始化.


2 @Lazy的使用
以SpringBoot环境为例


1 准备一个Springboot环境
2 准备两个实体类对象

```
 @Data
 @NoArgsConstructor
 public class User {

```

```
 private String name;
 private String phone;
 private Integer age;
 private Person person;

 public User(String name, String phone, Integer age) {
 System.out.println(" 我 User 被初始化了 .............");
 this.name = name;
 this.phone = phone;
 this.age = age;
 }
 }

 @Data
 @NoArgsConstructor
 public class Person {

 private String name;
 private String phone;
 private Integer age;
 private User user;

 public Person(String name, String phone, Integer age) {
 System.out.println(" 我 Person 被初始化了 .............");
 this.name = name;
 this.phone = phone;
 this.age = age;
 }
 }

```

3 添加启动类

```
 @SpringBootApplication
 public class Application {

 public static void main(String[] args) {
 SpringApplication.run(Application.class, args);
 }

 @Bean
 public User createUser() {
 return new User(" 韩宣生 ", "11111", 24);
 }

 @Bean
 @Lazy
 public Person createPerson() {
 return new Person(" 韩立 ", "11111", 24);
 }
 }

```

4 测试查看控制台

```
 我 User 被初始化了 .............

```

5 去掉Person上的 @Lazy注解,重启项目

```
 我 User 被初始化了 .............
 我 Person 被初始化了 .............

```

3 @Lazy的作用
1 延迟加载bean对象(如上案列)
2 解决循环依赖问题
1 添加两个配置类

```
 @Component
 public class PersonConfig {

 private UserConfig userConfig;

 public PersonConfig( UserConfig userConfig) {
 this.userConfig = userConfig;
 System.out.println(" 我是用户配置 PersonConfig");
 }

 }

```

```
 @Component
 public class UserConfig {

 private PersonConfig personConfig;

 public UserConfig(PersonConfig personConfig) {
 this.personConfig = personConfig;
 System.out.println(" 我是用户配置 UserConfig");
 }
 }

```

2 重启项目, 项目报错,代码中存在循环依赖

```
 Description:
 The dependencies of some of the beans in the application context form a cycle:

```

解决办法,给其中一个添加@Lazy注解,如

```
 @Component
 public class PersonConfig {

 private UserConfig userConfig;

 public PersonConfig(@Lazy UserConfig userConfig) {
 this.userConfig = userConfig;
 System.out.println(" 我是用户配置 PersonConfig");
 }

 }

```

3 重启项目,查看日志
我是用户配置 PersonConfig
我是用户配置 UserConfig


4 错误总结
1 在项目启动过程中, 遇到异常错误
'url' attribute is not specified and no embedded datasource could be configure


解决方法: 是项目没有将application.yml配置文件加载. 点击maven中clean一下项目, 重启项目即可.


**Spring常用扩展点**


**笔记本：** spring


**创建时间：** 2023/6/13 14:33 **更新时间：** 2023/6/13 15:02

##### **Spring常用扩展点**


**一、前言介绍**


**1、常用扩展点**


我们知道，IOC（控制反转） 和 AOP（面向切面编程）是spring的基石。除此之外，spring的扩展能力非常强。


由于这个优势的存在，让spring拥有强大的包容能力，让很多第三方应用能够轻松投入spring的怀抱。


比如：rocketmq、mybatis、redis等。


Spring中最常用的11个扩展点


自定义 [拦截器](https://so.csdn.net/so/search?q=%E6%8B%A6%E6%88%AA%E5%99%A8&spm=1001.2101.3001.7020)


Spring容器对象获取


全局异常处理


类型转换器


导入配置


项目启动配置


BeanDefinition的修改


Bean前后初始化


初始化方法


容器关闭


自定义作用域


**2、Spring所有扩展接口**


Spring的核心思想就是容器，内部想要把自动装配玩的转，就必须要了解spring对于bean的构造生命周期以及各


当然业务代码也能合理利用这些扩展点写出更加漂亮的代码。这里总结了几乎 **Spring & Springboot所有的扩展**


以及各个扩展点的使用场景。下面是 **一个bean在spring内部从被加载到最后初始化完成所有可扩展点的顺序调**


<img src="/img/spring.pdf-54-0.png">54-0

**二、常用扩展点详解**


**1、自定义拦截器**


**1.1 介绍**


spring mvc拦截器与spring拦截器相比，它里面能够获取 `HttpServletRequest` 和 `HttpServletResponse` 等web对象实
[可以参考：springBoot整合JWT实现前后端Token验证](https://blog.csdn.net/lemon_TT/article/details/113262294)


spring mvc拦截器的顶层接口是： `HandlerInterceptor` ，包含三个方法：


**preHandle** 目标方法执行前执行


postHandle 目标方法执行后执行


**afterCompletion** 请求完成时执行


一般情况会 **用HandlerInterceptor接口的实现类HandlerInterceptorAdapter类** 。


假如有权限认证、日志、统计的场景，可以使用该拦截器。


**1.2 代码详情**


首先继承 `HandlerInterceptorAdapter` 类定义拦截器

```
 public class AuthInterceptor extends HandlerInterceptorAdapter {

 @Override
 public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handl
 throws Exception {
 String requestUrl = request .getRequestURI();
 if (checkAuth( requestUrl )) {

 return true;
 }

 return false;
 }

 private boolean checkAuth(String requestUrl ) {
 System. out .println("===权限校验===");

 return true;
 }
 }

```

然后将该拦截器注册到spring容器

```
 @Configuration
 public class WebAuthConfig extends WebMvcConfigurerAdapter {
 @Bean
 public AuthInterceptor getAuthInterceptor() {
 return new AuthInterceptor();
 }

 @Override
 public void addInterceptors(InterceptorRegistry registry ) {
 registry .addInterceptor(new AuthInterceptor());
 }
 }

```

最后在请求接口时spring mvc通过该拦截器，能够自动拦截该接口，并且校验权限。


**2、获取Spring容器对象**


[借鉴参考：Spring事件监听](https://blog.csdn.net/lemon_TT/article/details/126063399)


在我们日常开发中，除了通过 `@Autowired` 注解获取Bean外，有时候我们会经常需要从Spring容器中手动获取Bea


下面是几种手动获取Bean的方法


**2.1 BeanFactoryAware接口**


实现 `BeanFactoryAware` 接口，然后重写 `setBeanFactory` 方法，就能从该方法中获取到spring容器对象

```
 @Service
 public class PersonService implements BeanFactoryAware {
 private BeanFactory beanFactory ;

 @Override
 public void setBeanFactory(BeanFactory beanFactory ) throws BeansException {

```

```
 this. beanFactory = beanFactory ;

 }

 public void add() {
 Person person = (Person) beanFactory .getBean("person");
 }
 }

```

**2.2** [ApplicationContextAware](https://so.csdn.net/so/search?q=ApplicationContextAware&spm=1001.2101.3001.7020) **接口**


实现 `ApplicationContextAware` 接口，然后重写 `setApplicationContext` 方法，也能从该方法中获取到spring容器对象

```
 @Service
 public class PersonService2 implements ApplicationContextAware {
 private ApplicationContext applicationContext ;

 @Override
 public void setApplicationContext(ApplicationContext applicationContext ) throws BeansExceptio
 this. applicationContext = applicationContext ;

 }

 public void add() {
 Person person = (Person) applicationContext .getBean("person");
 }
 }

```

**2.3** [ApplicationListener](https://so.csdn.net/so/search?q=ApplicationListener&spm=1001.2101.3001.7020) **接口**

```
 @Service
 public class PersonService3 implements ApplicationListener<ContextRefreshedEvent> {
 private ApplicationContext applicationContext ;

 @Override
 public void onApplicationEvent(ContextRefreshedEvent event ) {
 applicationContext = event .getApplicationContext();
 }

 public void add() {
 Person person = (Person) applicationContext .getBean("person");
 }
 }

```

**3、全局异常处理**


[参考：Spring Boot后端接口规范](https://blog.csdn.net/lemon_TT/article/details/108309900)


我们在开发接口时，如果出现异常，为了给用户一个更友好的提示，必须在每一个接口处捕获异常，但是随着


代码量和可维护性也随之增加，因此全局异常捕获就派上用场了： `RestControllerAdvice` 。只需在 `handleException` 方


业务接口中可以放心使用，不再需要捕获异常（程序统一处理了）

```
 @RestControllerAdvice
 public class GlobalExceptionHandler {

 @ExceptionHandler(Exception.class)
 public String handleException(Exception e ) {
 if ( e instanceof ArithmeticException) {
 return "数据异常";
 }
 if ( e instanceof Exception) {
 return "服务器内部异常";
 }
 retur null;
 }
 }

```

**4、类型转换器**


**4.1 介绍**


spring目前支持3中类型转换器


**Converter<S,T>** ：将 S 类型对象转为 T 类型对象


**ConverterFactory<S, R>** ：将 S 类型对象转为 R 类型及子类对象


**GenericConverter** ：它支持多个source和目标类型的转化，同时还提供了source和目标类型的上下文，这


换


[常用的日期类转换可以参考：Java8 日期时间类整理](https://blog.csdn.net/lemon_TT/article/details/109145432)


**4.2 简单实战**


通过自定义Converter，可以转换简单的参数，如下，有一个 UserDto 类，表示用户信息

```
 public class UserDto {
```

_`//`_ 用户名
```
 private String name ;

```

_`//`_ 年龄
```
 private Integer age ;
```

_`//`_ 省略 _`getter`_ 、 _`setter`_ 方法
```
 }

```

要求后台所有接口接受 `UserDto` 数据时，参数的值格式为： `name,age`

```
 @RequestMapping("/convert/test1")
 public UserDto test1(@RequestParam("user") UserDto user ) {
 System. out .println("name：" + user .getName());
 System. out .println("age：" + user .getAge());

 return user ;
 }

```

SpringMVC 中提供了一个接口 `org.springframework.core.convert.converter.Converter` ，这个接口用来将一种类型转换


调用后端接口的时候，http 传递的参数都是字符串类型的，但是后端却可以使用 Integer、Double 等其他类型来


这就是 `Converter` 实现的。Spring 内部也提供了很多默认的实现，用于各种类型转换

```
 @FunctionalInterface
 public interface Converter<S, T> {

 /**
```

_`*`_ 将 _`source`_ 转换为目标 _`T`_ 类型
```
 */
 @Nullable
 T convert(S source );

 }

```

代码如下，添加一个配置类，实现 `WebMvcConfigurer` 接口


重写 `addFormatters` 方法，在这个方法中添加一个自定义的 `Converter` ，实现其 convert 方法，


将 `name,age` 格式的字符串转换为 UserDto 对象返回

```
 @Configuration
 public class MvcConfig implements WebMvcConfigurer {

 @Override
 public void addFormatters(FormatterRegistry registry ) {

```

```
 registry .addConverter(new Converter<String, UserDto>() {
 @Override
 public UserDto convert(String source ) {
 if ( source == null) {

 return null;
 }
 String[] split = source .split(",");
 String name = split [0];
 Integer age = Integer.valueOf( split [1]);
 return new UserDto( name, age );

 }
 });
 }
 }

```

最后访问 `/convert/test1?user=ready,1` 即可成功获取数据


**5、配置的导入**


**5.1 介绍**


[参考：Spring容器加入bean的几种方式](https://blog.csdn.net/lemon_TT/article/details/122196465)


有时我们需要在某个配置类中引入另外一些类，被引入的类也加到spring容器中。


这时可以使用 `@Import` 注解完成这个功能。通过源码会发现，引入的类支持三种不同类型，


**将普通类和@Configuration注解的配置类分开讲解** ，列了四种不同类型


**普通类**


**@Configuration注解**


**ImportSelector接口类**


**ImportBeanDefinitionRegistrar接口类**


**5.2 普通类**


这种引入方式是最简单的，被引入的类会被实例化bean对象

```
 public class A {
 }

 @Import(A.class)
 @Configuration
 public class TestConfiguration {
 }

```

通过 `@Import` 注解引入A类，spring就能自动实例化A对象，然后在需要使用的地方通过 `@Autowired` 注解注入即可，


不用加 `@Bean` 注解也能实例化bean


**5.3 配置类**


这种引入方式是最复杂的，因为 `@Configuration` 注解还支持多种组合注解，比如：


@Import


@ImportResource


@PropertySource等


通过@Import注解引入@Configuration注解的配置类，


会把该配置类相关 `@Import` 、 `@ImportResource` 、 `@PropertySource` 等注解引入的类进行递归，一次性全部引入。

```
 public class A {
 }

 public class B {
 }

 @Import(B.class)
 @Configuration
 public class AConfiguration {

 @Bean
 public A a() {
 return new A();
 }
 }

 @Import(AConfiguration.class)
 @Configuration
 public class TestConfiguration {
 }

```

**5.4 ImportSelector**


这种引入方式需要实现 `ImportSelector` 接口，好处是 `selectImports` 方法返回的是数组，意味着可以同时引入多个类

```
 public class AImportSelector implements ImportSelector {

 private static final String CLASS_NAME = "com.sue.cache.service.test13.A";

 public String[] selectImports(AnnotationMetadata importingClassMetadata ) {
 return new String[]{ CLASS_NAME };
 }
 }

 @Import(AImportSelector.class)
 @Configuration
 public class TestConfiguration {
 }

```

**5.5 ImportBeanDefinitionRegistrar**


种引入方式需要实现 `ImportBeanDefinitionRegistrar` 接口，这种方式是最灵活的，


能在 `registerBeanDefinitions` 方法中获取到 `BeanDefinitionRegistry` 容器注册对象，可以手动控制BeanDefinition的创

```
 public class AImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
 @Override
 public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionR
 RootBeanDefinition rootBeanDefinition = new RootBeanDefinition(A.class);

 registry .registerBeanDefinition("a", rootBeanDefinition );
 }
 }

 @Import(AImportBeanDefinitionRegistrar.class)
 @Configuration
 public class TestConfiguration {
 }

```

**6、项目启动时**


有时候我们需要在项目启动时定制化一些附加功能，比如：加载一些系统参数、完成初始化、预热本地缓存等


好消息是springboot提供了：


**CommandLineRunner**


ApplicationRunner


这两个接口帮助我们实现以上需求。它们的用法很简单的，以 `ApplicationRunner` 接口为例：

```
 @Component
 public class TestRunner implements ApplicationRunner {

 @Autowired
 private LoadDataService loadDataService ;

 public void run(ApplicationArguments args ) throws Exception {
 loadDataService .load();

 }
 }

```

实现 `ApplicationRunner` 接口，重写 `run` 方法，在该方法中实现自己定制化需求。


如果项目中有多个类实现了ApplicationRunner接口，他们的执行顺序要怎么指定呢？


答案是使用 `@Order(n)` 注解，n的值越小越先执行。当然也可以通过 `@Priority` 注解指定顺序。


**7、修改BeanDefinition**


Spring IOC在实例化Bean对象之前，需要先读取Bean的相关属性，保存到 `BeanDefinition` 对象中，


然后通过BeanDefinition对象，实例化Bean对象。如果 **想修改BeanDefinition对象中的属性** ，该怎么办呢？


我们可以实现 `BeanFactoryPostProcessor` 接口


在 `postProcessBeanFactory` 方法中，可以获取 `BeanDefinition` 的相关对象，并且修改该对象的属性

```
 @Component
 public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
 @Override
 public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFac
 DefaultListableBeanFactory defaultListableBeanFactory = (DefaultListableBeanFactory) configu
 BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.genericBeanDefinition
 beanDefinitionBuilder .addPropertyValue("id", 123);
 beanDefinitionBuilder .addPropertyValue("name", "shawn");
 defaultListableBeanFactory .registerBeanDefinition("user", beanDefinitionBuilder .getBeanDefiniti
 }
 }

```

**8、初始化Bean前后**


有时候需要在初始化Bean前后，实现一些自己的逻辑。这时可以实现 `BeanPostProcessor` 接口，该接口目前有两个


`postProcessBeforeInitialization` 该在初始化方法之前调用。


`postProcessAfterInitialization` 该方法再初始化方法之后调用。


如果spring中存在User对象，则将它的userName设置成：shawn666。其实，我们经常使用的注解，


比如： `@Autowired` 、 `@Value` 、 `@Resource` 、 `@PostConstruct` 等，


是通过 `AutowiredAnnotationBeanPostProcessor` 和 `CommonAnnotationBeanPostProcessor` 实现的。

```
 @Component
 public class MyBeanPostProcessor implements BeanPostProcessor {

 @Override

```

```
 public Object postProcessAfterInitialization(Object bean, String beanName ) throws BeansExcept
 if ( bean instanceof User) {
 ((User) bean ).setUserName("shawn666");

 }
 return bean ;
 }
 }

```

**9、初始化方法**


**9.1 介绍**


[参考：Spring Bean初始化](https://blog.csdn.net/lemon_TT/article/details/126063477)


spring中使用比较多的初始化bean的方法有：


**使用@PostConstruct注解**


**实现InitializingBean接口**


**9.2 使用@PostConstruct注解**


在需要初始化的方法上增加 `@PostConstruct` 注解，这样就有初始化的能力

```
 @Service
 public class AService {
 @PostConstruct
 public void init() {
 System. out .println("===初始化===");
 }
 }

```

**9.3 实现InitializingBean接口**


实现 `InitializingBean` 接口，重写 `afterPropertiesSet` 方法，该方法中可以完成初始化功能

```
 @Service
 public class BService implements InitializingBean {

 @Override
 public void afterPropertiesSet() throws Exception {
 System. out .println("===初始化===");
 }
 }

```

**10、关闭容器前**


有时候，我们需要在关闭spring容器前，做一些额外的工作，比如：关闭资源文件等。


这时可以实现 `DisposableBean` 接口，并且重写它的 `destroy` 方法：

```
 @Service
 public class DService implements InitializingBean, DisposableBean {

 @Override
 public void destroy() throws Exception {
 System. out .println("DisposableBean destroy");
 }

 @Override
 public void afterPropertiesSet() throws Exception {
 System. out .println("InitializingBean afterPropertiesSet");
 }

```

```
 }

```

这样spring容器销毁前，会调用该 `destroy` 方法，做一些额外的工作。


通常情况下，我们会同时实现 `InitializingBean` 和 `DisposableBean` 接口，重写初始化方法和销毁方法。


**11、自定义作用域**


我们都知道spring默认支持的 `Scope` 只有两种：


**singleton 单例** ，每次从spring容器中获取到的bean都是同一个对象。


prototype 多例，每次从spring容器中获取到的bean都是不同的对象。


spring web又对Scope进行了扩展，增加了：


**RequestScope **同一次请求从spring容器中获取到的bean都是同一个对象。


**SessionScope **同一个会话从spring容器中获取到的bean都是同一个对象。


即便如此，有些场景还是无法满足我们的要求。


比如，我们想在同一个线程中从spring容器获取到的bean都是同一个对象，该怎么办？


这就需要自定义Scope了。


第一步实现Scope接口

```
 public class ThreadLocalScope implements Scope {

 private static final ThreadLocal THREAD_LOCAL_SCOPE = new ThreadLocal();

 @Override
 public Object get(String name, ObjectFactory<?> objectFactory ) {
 Object value = THREAD_LOCAL_SCOPE .get();
 if ( value != null) {

 return value ;

 }

 Object object = objectFactory .getObject();
 THREAD_LOCAL_SCOPE .set( object );

 return object ;
 }

 @Override
 public Object remove(String name ) {
 THREAD_LOCAL_SCOPE .remove();
 return null;
 }

 @Override
 public void registerDestructionCallback(String name, Runnable callback ) {
 }

 @Override
 public Object resolveContextualObject(String key ) {
 return null;
 }

 @Override
 public String getConversationId() {
 return null;
 }
 }

```

第二步将新定义的Scope注入到spring容器中


```
 @Component
 public class ThreadLocalBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
 @Override
 public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory ) throws Beans
 beanFactory .registerScope("threadLocalScope", new ThreadLocalScope());
 }
 }

```

第三步使用新定义的Scope

```
 @Scope("threadLocalScope")
 @Service
 public class CService {
 public void add() {
 }
 }

```

**三、Spring所有扩展接口详解**


**1、ApplicationContextInitializer**


整个spring容器在刷新之前初始化 `ConfigurableApplicationContext` 的回调接口，


简单来说，就是在容器刷新之前调用此类的 `initialize` 方法。


这个点允许被用户自己扩展。用户可以在整个spring容器还没被初始化之前做一些事情。


可以想到的场景可能为，在 **最开始激活一些配置** ，或者利用这时候class还没被类加载器加载的时机，进行动态

```
 public class TestApplicationContextInitializer implements ApplicationContextInitializer {
 @Override
 public void initialize(ConfigurableApplicationContext applicationContext ) {
 System. out .println("[ApplicationContextInitializer]");
 }
 }

```

这时候spring容器还没被初始化，所以想要自己的扩展的生效，有以下三种方式：


在启动类中用 `springApplication.addInitializers(new TestApplicationContextInitializer())` 语句加入

```
   @SpringBootApplication
   public class SpringextendApplication {

   public static void main(String[] args ) {
   SpringApplication springApplication = new SpringApplication(SpringextendApplication.class);
   springApplication .addInitializers(new TestApplicationContextInitializer());
   springApplication .run( args );
   }
   }

```

配置文件配置 `context.initializer.classes=com.example.demo.TestApplicationContextInitializer`


Spring SPI扩展，在spring.factories中加入

```
org.springframework.context.ApplicationContextInitializer=com.example.demo.TestApplicati

```

**2、BeanDefinitionRegistryPostProcessor**


这个接口在读取项目中的 `beanDefinition` 之后执行，提供一个补充的扩展点。


使用场景：可以在这里动态注册自己的 `beanDefinition` ，可以加载classpath之外的bean

```
 @Component
 public class TestBeanDefinitionRegistryPostProcessor implements BeanDefinitionRegistryPostPro
 @Override

```

```
 public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry ) throws Beans
 System. out .println("[BeanDefinitionRegistryPostProcessor] postProcessBeanDefinition
 }

 @Override
 public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory ) throws Beans
 System. out .println("[BeanDefinitionRegistryPostProcessor] postProcessBeanFactory");
 }
 }

```

**3、BeanFactoryPostProcessor**


这个接口是 `beanFactory` 的扩展接口，调用时机在spring在读取 `beanDefinition` 信息之后， **实例化bean之前** 。


在这个时机，用户可以通过实现这个扩展接口来自行处理一些东西，比如修改已经注册的 `beanDefinition` 的元信息

```
 @Component
 public class TestBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
 @Override
 public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory ) throws Beans
 System. out .println("[BeanFactoryPostProcessor]");
 }
 }

```

**4、InstantiationAwareBeanPostProcessor**


该接口继承了 `BeanPostProcess` 接口，区别如下： `BeanPostProcess` **接口只在bean的初始化阶段进行扩展（注入sprin**


**而** `InstantiationAwareBeanPostProcessor` **接口在此基础上增加了3个方法，把可扩展的范围增加了实例化阶段和属性**


该类主要的扩展点有以下5个方法，主要在bean生命周期的两大阶段： **实例化阶段** 和 **初始化阶段** ，，按调用顺序


`postProcessBeforeInstantiation` ：实例化bean之前，相当于new这个bean之前


`postProcessAfterInstantiation` ：实例化bean之后，相当于new这个bean之后


`postProcessPropertyValues` ：bean已经实例化完成，在属性注入时阶段触发， `@Autowired`, `@Resource` 等注解原理基


`postProcessBeforeInitialization` ：初始化bean之前，相当于把bean注入spring上下文之前


`postProcessAfterInitialization` ：初始化bean之后，相当于把bean注入spring上下文之后


使用场景：，无论是写中间件和业务中，都能利用这个特性。


比如对实现了某一类接口的bean在各个生命期间进行收集，或者对某个类型的bean进行统一的设值等等。

```
 @Component
 public class TestInstantiationAwareBeanPostProcessor implements InstantiationAwareBeanPostPro

 @Override
 public Object postProcessBeforeInitialization(Object bean, String beanName ) throws BeansExcep
 System. out .println("[TestInstantiationAwareBeanPostProcessor] before initialization

 return bean ;

 }

 @Override
 public Object postProcessAfterInitialization(Object bean, String beanName ) throws BeansExcept
 System. out .println("[TestInstantiationAwareBeanPostProcessor] after initialization

 return bean ;
 }

 @Override
 public Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName ) throws Beans
 System. out .println("[TestInstantiationAwareBeanPostProcessor] before instantiation
 return null;

```

```
 }

 @Override
 public boolean postProcessAfterInstantiation(Object bean, String beanName ) throws BeansExcept
 System. out .println("[TestInstantiationAwareBeanPostProcessor] after instantiation "

 return true;
 }

 @Override
 public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName )
 System. out .println("[TestInstantiationAwareBeanPostProcessor] postProcessProperties

 return pvs ;

 }

 }

```

**5、SmartInstantiationAwareBeanPostProcessor**


该扩展接口有3个触发点方法：


`predictBeanType` ：该触发点发生在 `postProcessBeforeInstantiation` 之前(在图上并没有标明，因为一般不太需要扩


测成功的Class类型，如果不能预测返回null；当你调用 `BeanFactory.getType(name)` 时当通过bean的名字无法得


`determineCandidateConstructors` ：该触发点发生在 `postProcessBeforeInstantiation` 之后，用于确定该bean的构造


扩展这个点，来自定义选择相应的构造器来实例化这个bean。


`getEarlyBeanReference` ：该触发点发生在 `postProcessAfterInstantiation` 之后，当有循环依赖的场景，当bean实例


于bean实例化的后置处理。这个方法就是在提前暴露的回调方法中触发。

```
 @Component
 public class TestSmartInstantiationAwareBeanPostProcessor implements SmartInstantiationAwareB

 @Override
 public Class<?> predictBeanType(Class<?> beanClass, String beanName ) throws BeansException {
 System. out .println("[TestSmartInstantiationAwareBeanPostProcessor] predictBeanType

 return beanClass ;
 }

 @Override
 public Constructor<?>[] determineCandidateConstructors(Class<?> beanClass, String beanName ) th
 System. out .println("[TestSmartInstantiationAwareBeanPostProcessor] determineCandida
 return null;
 }

 @Override
 public Object getEarlyBeanReference(Object bean, String beanName ) throws BeansException {
 System. out .println("[TestSmartInstantiationAwareBeanPostProcessor] getEarlyBeanRefe

 return bean ;

 }
 }

```

**6、BeanFactoryAware**


这个类只有一个触发点，发生在bean的实例化之后，注入属性之前，也就是Setter之前。


这个类的扩展点方法为 `setBeanFactory` ，可以拿到 `BeanFactory` 这个属性。


使用场景：你可以在bean实例化之后，但还未初始化之前，拿到 `BeanFactory` ，


在这个时候，可以对每个bean作特殊化的定制。也或者可以把 `BeanFactory` 拿到进行缓存，日后使用

```
 @Component
 public class TestBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
 @Override
 public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory ) throws Beans

```

```
 System. out .println("[BeanFactoryPostProcessor] " + beanFactory .toString());

```

_`//`_ 下面这个有循环依赖问题
```
 // System.out.println("[TestBeanFactoryAware] " + beanFactory.getBean(TestBeanFact
 }
 }

```

**7、ApplicationContextAwareProcessor**


该类本身并没有扩展点，但是该类内部却有6个扩展点可供实现 ，


这些类触发的时机在bean实例化之后，初始化之前。


该类 **用于执行各种驱动接口** ，在bean实例化之后，属性填充之后，


通过执行扩展接口，来获取对应容器的变量。 **所以这里应该来说是有6个扩展点**


`EnvironmentAware` ：用于获取 `EnviromentAware` 的一个扩展类，这个变量非常有用， 可以获得系统内的所有参数


可以通过注入的方式来直接获得。


`EmbeddedValueResolverAware` ：用于获取 `StringValueResolver` 的一个扩展类， `StringValueResolver` 用于获取基于 `Stri`


取，如果实现了这个Aware接口，把 `StringValueResolver` 缓存起来，通过这个类去获取 `String` 类型的变量，效


`ResourceLoaderAware` ：用于获取 `ResourceLoader` 的一个扩展类， `ResourceLoader` 可以用于获取classpath内所有的资


`ApplicationEventPublisherAware` ：用于获取 `ApplicationEventPublisher` 的一个扩展类， `ApplicationEventPublisher` 可


介绍 `ApplicationListener` 时会详细提到。这个对象也可以通过spring注入的方式来获得。


`MessageSourceAware` ：用于获取 `MessageSource` 的一个扩展类， `MessageSource` 主要用来做国际化。


`ApplicationContextAware` ：用来获取 `ApplicationContext` 的一个扩展类， `ApplicationContext` 应该是很多人非常熟悉


何在spring上下文注册的bean，我们经常扩展这个接口来缓存spring上下文，包装成静态方法。同时 `Applic`


`ApplicationEventPublisher` 等接口，也可以用来做相关接口的事情。


**8、BeanNameAware**


这个类也是Aware扩展的一种，触发点在bean的初始化之前，也就是 `postProcessBeforeInitialization` 之前，


这个类的触发点方法只有一个： `setBeanName` 。


使用场景：用户可以扩展这个点， **在初始化bean之前拿到spring容器中注册的的beanName，来自行修改这个**

```
 @Component
 public class NormalBeanA implements BeanNameAware {
 public NormalBeanA() {
 System. out .println("NormalBean constructor");
 }

 @Override
 public void setBeanName(String name ) {
 System. out .println("[BeanNameAware] " + name );
 }
 }

```

**9、@PostConstruct**


这个并不算一个扩展点，其实就是一个标注。


其作用是在bean的初始化阶段，如果对一个方法标注了 `@PostConstruct` ，会先调用这个方法。


这里重点是要关注下这个标准的触发点，


这个触发点是在 `postProcessBeforeInitialization` 之后， `InitializingBean.afterPropertiesSet` 之前。


使用场景： **用户可以对某一方法进行标注，来进行初始化某一个属性**


**10、InitializingBean**


这个类也是用来初始化bean的。


`InitializingBean` 接口为bean提供了初始化方法的方式，它只包括 `afterPropertiesSet` 方法，


凡是继承该接口的类，在初始化bean的时候都会执行该方法。


这个扩展点的触发时机在 `postProcessAfterInitialization` 之前。


使用场景：用户实现此接口，来进行系统启动的时候一些业务指标的初始化工作。


**11、FactoryBean**


Spring通过反射机制利用bean的class属性指定支线类去实例化bean，
在某些情况下，实例化Bean过程比较复杂，
如果按照传统的方式，则需要在bean中提供大量的配置信息。
配置方式的灵活性是受限的，这时采用编码的方式可能会得到一个简单的方案。
Spring为此提供了一个 `org.springframework.bean.factory.FactoryBean` 的工厂类接口，
用户可以通过实现该接口定制实例化Bean的逻辑。

`FactoryBean` 接口对于Spring框架来说占用重要的地位，
Spring自身就提供了70多个 `FactoryBean` 的实现。
它们隐藏了实例化一些复杂bean的细节，给上层应用带来了便利。
从Spring3.0开始， `FactoryBean` 开始支持泛型，即接口声明改为 `FactoryBean`<`T`>`` 的形式


使用场景：用户可以扩展这个类，来为要实例化的bean作一个代理，


比如为该对象的所有的方法作一个拦截，在调用前后输出一行log，模仿 `ProxyFactoryBean` 的功能。

```
 @Component
 public class TestFactoryBean implements FactoryBean<TestFactoryBean.TestFactoryInnerBean> {

 @Override
 public TestFactoryBean.TestFactoryInnerBean getObject() throws Exception {
 System. out .println("[FactoryBean] getObject");
 return new TestFactoryBean.TestFactoryInnerBean();
 }

 @Override
 public Class<?> getObjectType() {
 return TestFactoryBean.TestFactoryInnerBean.class;
 }

 @Override
 public boolean isSingleton() {
 return true;
 }

 public static class TestFactoryInnerBean{

 }
 }

```

**12、SmartInitializingSingleton**


这个接口中只有一个方法 `afterSingletonsInstantiated` ，


其作用是是 在spring容器管理的所有单例对象（非懒加载对象）初始化完成之后调用的回调接口。


其触发时机为 `postProcessAfterInitialization` 之后。


使用场景： **用户可以扩展此接口在对所有单例对象初始化完毕后，做一些后置的业务处理。**

```
 @Component
 public class TestSmartInitializingSingleton implements SmartInitializingSingleton {
 @Override
 public void afterSingletonsInstantiated() {
 System. out .println("[TestSmartInitializingSingleton]");
 }
 }

```

**13、CommandLineRunner**


这个接口也只有一个方法： `run(String... args)` ，触发时机为整个项目启动完毕后，自动执行。


如果有多个 `CommandLineRunner` ，可以利用 `@Order` 来进行排序。


使用场景：用户扩展此接口，进行启动项目之后一些业务的预处理。

```
 @Component
 public class TestCommandLineRunner implements CommandLineRunner {

 @Override
 public void run(String... args ) throws Exception {
 System. out .println("[TestCommandLineRunner]");
 }
 }

```

**14、DisposableBean**


这个扩展点也只有一个方法： `destroy()` ，其触发时机为当此对象销毁时，会自动执行这个方法。


比如说运行 `applicationContext.registerShutdownHook` 时，就会触发这个方法。


**15、ApplicationListener**


准确的说，这个应该不算spring&springboot当中的一个扩展点， `ApplicationListener` 可以监听某个事件的 `event` ，


触发时机可以穿插在业务方法执行过程中，用户可以自定义某个业务事件。


但是spring内部也有一些内置事件，这种事件，可以穿插在启动调用中。


我们也可以利用这个特性，来自己做一些内置事件的监听器来达到和前面一些触发点大致相同的事情。


接下来罗列下spring主要的内置事件：


**ContextRefreshedEvent**


ApplicationContext 被初始化或刷新时，该事件被发布。这也可以在 `ConfigurableApplicationContext` 接口中使


成功装载，后处理Bean被检测并激活，所有Singleton Bean 被预实例化， `ApplicationContext` 容器已就绪可用


ContextStartedEvent


当使用 `ConfigurableApplicationContext` （ApplicationContext子接口）接口中的 start() 方法启动 `ApplicationCo`


以在接受到这个事件后重启任何停止的应用程序。


**ContextStoppedEvent**


当使用 `ConfigurableApplicationContext` 接口中的 `stop()` 停止 `ApplicationContext` 时，发布这个事件。你可以在接


ContextClosedEvent


当使用 `ConfigurableApplicationContext` 接口中的 `close()` 方法关闭 `ApplicationContext` 时，该事件被发布。一个已


**RequestHandledEvent**


这是一个 web-specific 事件，告诉所有 bean HTTP 请求已经被服务。只能应用于使用DispatcherServlet的


Spring处理用户请求结束后，系统会自动触发该事件


参考文章：


[https://mp.weixin.qq.com/s/Bih1XRVLi6ywMtErG_YcgQ](https://mp.weixin.qq.com/s/Bih1XRVLi6ywMtErG_YcgQ)


[https://www.jianshu.com/p/38d834db7413](https://www.jianshu.com/p/38d834db7413)


**Spring的生命周期**


**笔记本：** spring


**创建时间：** 2023/6/7 19:32 **更新时间：** 2023/6/7 19:38

##### **Spring的生命周期**


Spring作为当前Java最流行、最强大的轻量级框架，受到了程序员的热烈欢迎。准确的了解Spring [Bean的生命](https://so.csdn.net/so/search?q=Bean%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F&spm=1001.2101.3001.7020)

ApplicationContext作为Spring容器。这里，我们讲的也是 ApplicationContext中Bean的生命周期。而实际上Be

需要手动注册。


**一、生命周期流程图：**


Spring Bean的完整生命周期从创建Spring容器开始，直到最终Spring容器销毁Bean，这其中包含了一系列


若容器注册了以上各种接口，程序那么将会按照以上的流程进行。下面将仔细讲解各接口作用。



<img src="/img/spring.pdf-70-0.png">70-0

<img src="/img/spring.pdf-70-1.png">70-1
**二、各种接口方法分类**


Bean的完整生命周期经历了各种方法调用，这些方法可以划分为以下几类：


1、Bean自身的方法 ： 这个包括了Bean本身调用的方法和通过配置文件中`<`bean`>`的init-method和des


2、Bean级生命周期接口方法 ： 这个包括了BeanNameAware、BeanFactoryAware、 [InitializingBean](https://so.csdn.net/so/search?q=InitializingBean&spm=1001.2101.3001.7020)


3、容器级生命周期接口方法 ： 这个包括了InstantiationAwareBeanPostProcessor 和 BeanPostProce


4、工厂后处理器接口方法 ： 这个包括了BeanFactoryPostProcessor等等非常有用的工厂后处理器接口

置文件之后立即调用。


**三、演示**


我们用一个简单的Spring Bean来演示一下Spring Bean的生命周期。


1、首先是一个简单的Spring Bean，调用Bean自身的方法和Bean级生命周期接口方法，为了方便演示，它实现

和DiposableBean这4个接口，同时有2个方法，对应配置文件中`<`bean`>`的init-method和destroy-method。如下



<img src="/img/spring.pdf-71-0.png">71-0


```
38   }
       39

40 public void setAddress (String address) {

41     System.out.println("【注入属性】注入属性address");

42     this.address = address;

43   }

44

45 public int getPhone () {

46 return phone;

47   }

48

49 public void setPhone ( int phone) {

50     System.out.println("【注入属性】注入属性phone");

51     this.phone = phone;

52   }

53

54   @Override

55 public String toString () {

56 return "Person [address=" + address + ", name=" + name + ", phone="

57         + phone + "]";

58   }

59

60   // 这是BeanFactoryAware接口方法

61   @Override

62 public void setBeanFactory (BeanFactory arg0) throws BeansException {

63     System.out

64         .println("【BeanFactoryAware接口】调用BeanFactoryAware.setBeanFactory()")

65     this.beanFactory = arg0;

66   }

67

68   // 这是BeanNameAware接口方法

69   @Override

70 public void setBeanName (String arg0) {

71     System.out.println("【BeanNameAware接口】调用BeanNameAware.setBeanName()");

72     this.beanName = arg0;

73   }

74

75   // 这是InitializingBean接口方法

76   @Override

77 public void afterPropertiesSet () throws Exception {

78     System.out

79         .println("【InitializingBean接口】调用InitializingBean.afterPropertiesSet

80   }

81

82   // 这是DiposibleBean接口方法

83   @Override

84 public void destroy () throws Exception {

85     System.out.println("【DiposibleBean接口】调用DiposibleBean.destory()");

86   }

87

88   // 通过`<`bean`>`的init-method属性指定的初始化方法

89 public void myInit () {

90     System.out.println("【init-method】调用`<`bean`>`的init-method属性指定的初始化方法");

91   }

92

93   // 通过`<`bean`>`的destroy-method属性指定的初始化方法

94 public void myDestory () {

95     System.out.println("【destroy-method】调用`<`bean`>`的destroy-method属性指定的初始化方法

96   }

```

```
 97 }

```

2、接下来是演示BeanPostProcessor接口的方法，如下：



<img src="/img/spring.pdf-73-0.png">73-0







如上，BeanPostProcessor接口包括2个方法postProcessAfterInitialization和postProcessBeforeInitialization，这

数都是Bean的name。返回值也都是要处理的Bean对象。这里要注意。


3、InstantiationAwareBeanPostProcessor接口本质是BeanPostProcessor的子接口，一般我们继承Spring为其

InstantiationAwareBeanPostProcessorAdapter来使用它，如下：



<img src="/img/spring.pdf-73-1.png">73-1












<img src="/img/spring.pdf-74-0.png">74-0



这个有3个方法，其中第二个方法postProcessAfterInitialization就是重写了BeanPostProcessor的方法。第三个

该是PropertyValues对象。


4、演示工厂后处理器接口方法，如下：



<img src="/img/spring.pdf-74-1.png">74-1




```
 24 }

```

5、配置文件如下beans.xml，很简单，使用ApplicationContext,处理器不用手动注册：



<img src="/img/spring.pdf-75-0.png">75-0















6、下面测试一下：



<img src="/img/spring.pdf-75-1.png">75-1





关闭容器使用的是实际是AbstractApplicationContext的钩子方法。


我们来看一下结果：

```
 现在开始初始化容器
 2014-5-18 15:46:20 org.springframework.context.support.AbstractApplicationContext prepareRefresh
 信息 : Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@19a0c7c: startup date [Sun May 1
 2014-5-18 15:46:20 org.springframework.beans.factory.xml.XmlBeanDefinitionReader loadBeanDefinitions
 信息 : Loading XML bean definitions from class path resource [springBeanTest/beans.xml]
 这是 BeanFactoryPostProcessor 实现类构造器！！
 BeanFactoryPostProcessor 调用 postProcessBeanFactory 方法
 这是 BeanPostProcessor 实现类构造器！！
 这是 InstantiationAwareBeanPostProcessorAdapter 实现类构造器！！
 2014-5-18 15:46:20 org.springframework.beans.factory.support.DefaultListableBeanFactory preInstantiateSingletons
 信息 : Pre-instantiating singletons in org.springframework.beans.factory.support.DefaultListableBeanFactory@9934d4: d
 [beanPostProcessor,instantiationAwareBeanPostProcessor,beanFactoryPostProcessor,person]; root of factory hierarchy
 InstantiationAwareBeanPostProcessor 调用 postProcessBeforeInstantiation 方法
 【构造器】调用 Person 的构造器实例化
 InstantiationAwareBeanPostProcessor 调用 postProcessPropertyValues 方法
 【注入属性】注入属性 address
 【注入属性】注入属性 name
 【注入属性】注入属性 phone
 【 BeanNameAware 接口】调用 BeanNameAware.setBeanName()
 【 BeanFactoryAware 接口】调用 BeanFactoryAware.setBeanFactory()
 BeanPostProcessor 接口方法 postProcessBeforeInitialization 对属性进行更改！
 【 InitializingBean 接口】调用 InitializingBean.afterPropertiesSet()
 【 init-method 】调用 `<`bean`>` 的 init-method 属性指定的初始化方法
 BeanPostProcessor 接口方法 postProcessAfterInitialization 对属性进行更改！
 InstantiationAwareBeanPostProcessor 调用 postProcessAfterInitialization 方法
 容器初始化成功
 Person [address= 广州, name= 张三, phone=110]
 现在开始关闭容器！
 【 DiposibleBean 接口】调用 DiposibleBean.destory()
 【 destroy-method 】调用 `<`bean`>` 的 destroy-method 属性指定的初始化方法

```


<img src="/img/spring.pdf-76-0.png">76-0
**spring之i18n**


**笔记本：** spring


**创建时间：** 2023/5/29 15:36 **更新时间：** 2023/5/29 15:40

##### **spring之i18n**


**简介：**


国际化信息也称为本地化信息， **i18n** 是“国际化”的简称。在资讯领域，国际化(i18n)指让产品无需做大的改变就


内部代码的情况下，能根据不同语言及地区显示相应的界面。


**demo**


**step 1. 新增国际化资源问题**


分别在三个文件中添加内容如下：


**message.properties** ：表示默认的，里面可以没有值，但必须有这样的一个文件，可以参见源码：


MessageSourceAutoConfiguration.ResourceBundleCondition#getMatchOutcomeForBasename


**zh_CH**

```
    10001=你好，世界

    10002=你好 JAVA

```

**en_US**

```
    10001=hello word

    10002=hello JAVA

```

**step 2. 配置资源文件位置**

```
    spring.messages.basename=i18n.message

```

**step 3. 配置解析器**


SessionLocaleResolver为spring内置解析器之一，主要处理session会话级语言解析，其他还有 `CookieLocale`

```
AcceptHeaderLocaleResolver

```


<img src="/img/spring.pdf-77-0.png">77-0
```
    @Configuration

    public class LocaleConfig {

    @Bean

    public LocaleResolver localeResolver() {

    SessionLocaleResolver localeResolver = new SessionLocaleResolver();

    localeResolver.setDefaultLocale(Locale.CHINA);//默认语言

    return localeResolver;

    }

    }

```

**step 4 配置** [拦截器](https://so.csdn.net/so/search?q=%E6%8B%A6%E6%88%AA%E5%99%A8&spm=1001.2101.3001.7020)


有了解析器，还需要拦截器来对请求的语言参数进行获取，采用默认的LocaleChangeInterceptor作为拦截器来


lang=zh_CN表示读取国际化文件messages_zh_CN.properties。

```
    @Configuration

    public class WebConfig implements WebMvcConfigurer {

    @Override

    public void addInterceptors(InterceptorRegistry registry) {

    LocaleInterceptor localeInterceptor = new LocaleInterceptor();

    registry.addInterceptor(localeInterceptor);
    }
    }

    @Slf4j

    public class LocaleInterceptor extends LocaleChangeInterceptor {

    private static final String LOCALE = "X-Locale";

    @Override

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Obj

    String newLocale = request.getHeader(LOCALE);

    if (newLocale != null) {

    LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);

    if (localeResolver == null) {

    throw new IllegalStateException("No LocaleResolver found: not in a DispatcherServlet
    }
    try {

    localeResolver.setLocale(request, response, parseLocaleValue(newLocale));

    } catch (IllegalArgumentException e) {

    if (isIgnoreInvalidLocale()) {
    log.warn("Ignoring invalid locale value [{}]: ", newLocale, e);

    } else {

    throw e;
    }
    }
    }

    return true;
    }
    }

```

**step 5 . i18n工具类**

```
    @Slf4j

    @Component

    public class LocaleMessageUtils {

    @Autowired

    private MessageSource messageSource;

    public String getMessage(String code, Object[] args, String defaultMessage) {

```

```
    try {

    Locale locale = LocaleContextHolder.getLocale();

    return messageSource.getMessage(code, args, defaultMessage, locale);

    } catch (Exception e) {

    log.error("get locale message failed, ErrorMsg:" + e.getMessage());

    return defaultMessage;
    }
    }
    }

```

**step 6. 测试**


**源码分析**


**MessageSourceAutoConfiguration**


ResourceBundleCondition作为是否加载该配置类的条件


_`//`_ 该方法主要根据配置资源路径是否能找到对应的资源，只要能找到资源时才能加载此配置类

```
    @Override

    public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTyp

    String basename = context.getEnvironment().getProperty("spring.messages.ba

    ConditionOutcome outcome = cache.get(basename);

```


<img src="/img/spring.pdf-79-0.png">79-0

<img src="/img/spring.pdf-79-1.png">79-1
```
           if (outcome == null) {

    outcome = getMatchOutcomeForBasename(context, basename);

    cache.put(basename, outcome);

           }

           return outcome;

         }

```

springboot提供了国际化信息自动配置类，配置类中注册了ResourceBundleMessageSource实现类。

```
    @Bean

     public MessageSource messageSource(MessageSourceProperties properties) {

     ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();

```

_`//`_ 设置资源路径

```
         if (StringUtils.hasText(properties.getBasename())) {

     messageSource.setBasenames(StringUtils

                .commaDelimitedListToStringArray(StringUtils.trimAllWhitespace(pr

         }

```

_`//`_ 设置资源文件默认编码

```
         if (properties.getEncoding() != null) {

     messageSource.setDefaultEncoding(properties.getEncoding().name());

         }

```

_`//`_ 在找不到当前系统对应的资源文件时，如果该属性为 _`true`_ ，则会默认查找当前系统对应的资源文件，

```
     messageSource.setFallbackToSystemLocale(properties.isFallbackToSystemLocale()

```

_`//`_ 设置缓存过期时间

```
     Duration cacheDuration = properties.getCacheDuration();

         if (cacheDuration != null) {

     messageSource.setCacheMillis(cacheDuration.toMillis());

         }

```

_`//`_ 该参数控制的是，当输入参数为空时，是否还是使用 _`MessageFormat.format`_ 函数对结果进行格式化

```
     messageSource.setAlwaysUseMessageFormat(properties.isAlwaysUseMessageFormat()

```

_`//`_ 解析不到资源时是否用 _`code`_ 作为返回值

```
     messageSource.setUseCodeAsDefaultMessage(properties.isUseCodeAsDefaultMessage

         return messageSource;

      }

```

**RequestContextFilter**


[springmvc 自动装配](https://so.csdn.net/so/search?q=%E8%87%AA%E5%8A%A8%E8%A3%85%E9%85%8D&spm=1001.2101.3001.7020) 配置类，注册了一个RequestContextFilter过滤器,一次请求，LocaleContextHolder都会保


_`//`_ 处理过滤器

```
    @Override

    protected void doFilterInternal(

    HttpServletRequest request, HttpServletResponse response, FilterChain filt

    throws ServletException, IOException {

    ServletRequestAttributes attributes = new ServletRequestAttributes(request, res

         initContextHolders(request, attributes);

    try {

    filterChain.doFilter(request, response);

         }

    finally {

```

_`//`_ 请求结束清空本次请求本地化信息

```
           resetContextHolders();

           if (logger.isTraceEnabled()) {

    logger.trace("Cleared thread-bound request context: " + request);

           }

```

```
    attributes.requestCompleted();

         }

      }

```

_`//`_ 初始化本次请求的本地化配置

```
    private void initContextHolders(HttpServletRequest request, ServletRequestAttribut

    LocaleContextHolder.setLocale(request.getLocale(), this.threadContextInherita

    RequestContextHolder.setRequestAttributes(requestAttributes, this.threadConte

         if (logger.isTraceEnabled()) {

    logger.trace("Bound request context to thread: " + request);

         }

      }

```

_`//`_ 重置清空吧本地化配置

```
    private void resetContextHolders() {

    LocaleContextHolder.resetLocaleContext();

    RequestContextHolder.resetRequestAttributes();

      }

```

buildLocaleContext


**DispatcherServlet#LocaleContextHolder**


在每次请求都会用注册的LocaleResolver构造LocaleContext实例，如SessionLocaleResolver#resolveLocaleC


HttpServletRequest中的Locale返回，然后this.initContextHolders方法将解析后的Locale对象设值到LocaleCon

```
    @Override

    protected LocaleContext buildLocaleContext(final HttpServletRequest request) {

    LocaleResolver lr = this.localeResolver;

         if (lr instanceof LocaleContextResolver) {

           return ((LocaleContextResolver) lr).resolveLocaleContext(request);

         }

         else {

           return () -> (lr != null ? lr.resolveLocale(request) : request.getLocale());

         }

      }

```

LocaleContextHolder是用来处理Local的上下文容器(其实就是内部维护了一个ThreadLocal),其中LocaleContex


_`//`_ 设置当前请求上下文本地化信息

```
    public static void setLocaleContext(@Nullable LocaleContext localeContext, boolean inhe

         if (localeContext == null) {

           resetLocaleContext();

         }

         else {

           if (inheritable) {

    inheritableLocaleContextHolder.set(localeContext);

    localeContextHolder.remove();

           }

           else {

    localeContextHolder.set(localeContext);

    inheritableLocaleContextHolder.remove();

           }

         }

      }

```

**ResourceBundleMessageSource**


首先遍历各个basename， 如果资源文件没加载首先会根据basename、locale去加载资源，并将加载的内容缓


化message。该实接口实现类还有一个与之相近的版本ReloadableResourceBundleMessageSource，支持内容

```
    @Override

    protected String resolveCodeWithoutArguments(String code, Locale locale) {

    Set<String> basenames = getBasenameSet();

         for (String basename : basenames) {

    ResourceBundle bundle = getResourceBundle(basename, locale);

           if (bundle != null) {

    String result = getStringOrNull(bundle, code);

              if (result != null) {

                return result;

              }

           }

         }

         return null;

      }

```

**MessageSourceControl**


负责资源的具体加载逻辑

```
    @Nullable

    public ResourceBundle newBundle(String baseName, Locale locale, String format,

    throws IllegalAccessException, InstantiationException, IOException {
```

_`//`_ 资源格式： _`properties`_

```
           if (format.equals("java.properties")) {

```

_`//`_ 拼接资源名

```
    String bundleName = toBundleName(baseName, locale);

    final String resourceName = toResourceName(bundleName, "properties");

    final ClassLoader classLoader = loader;

    final boolean reloadFlag = reload;

    InputStream inputStream;

    try {

```

_`//`_ 加载资源文件流

```
    inputStream = AccessController.doPrivileged((PrivilegedExceptionAc

    InputStream is = null;

                  if (reloadFlag) {

    URL url = classLoader.getResource(resourceName);

                     if (url != null) {

    URLConnection connection = url.openConnection();

                       if (connection != null) {

    connection.setUseCaches(false);

    is = connection.getInputStream();

                       }

                     }

                  }

                  else {

    is = classLoader.getResourceAsStream(resourceName);

                  }

                  return is;

                });

              }

              catch (PrivilegedActionException ex) {

                throw (IOException) ex.getException();

              }

              if (inputStream != null) {

    String encoding = getDefaultEncoding();

```

_`//`_ 设置文件编码

```
            if (encoding != null) {

              try (InputStreamReader bundleReader = new InputStreamReader(inp
```

_`//`_ 用 _`Properties`_ 在家文件流，在资源转换成 _`key-value`_ 形式

```
                 return loadBundle(bundleReader);

              }

            }

            else {

              try (InputStream bundleStream = inputStream) {
```

_`//`_ 用 _`Properties`_ 在家文件流，在资源转换成 _`key-value`_ 形式

```
                 return loadBundle(bundleStream);

              }

            }

          }

          else {

            return null;

          }

       }

       else {

```

_`//`_ 文件格式是 _`class`_

```
          return super.newBundle(baseName, locale, format, loader, reload);

       }

     }

```

**BeanFactory和FactoryBean的区别**


**笔记本：** spring


**创建时间：** 2023/5/29 0:13 **更新时间：** 2023/5/29 0:16

##### **BeanFactory和FactoryBean的区别**


**区别：**


BeanFactory是个Factory，也就是IOC容器或对象工厂，


而FactoryBean就是个Bean。在Spring中，所有的Bean都是由BeanFactory(也就是IOC容器)来进行管理的。


但对FactoryBean而言，这个Bean不是简单的Bean， **FactoryBean是一个能生产或者修饰对象生成的工厂Bea**


FactoryBean 的源码分析；


**FactoryBean概述**


一般情况下，Spring是通过反射机制利用bean的class属性指定实现类来实例化bean的。在某些情况下，实例化


签中提供大量的配置信息，配置方式的灵活性是受限的，这时采用编码的方式可以得到一个更加简单的方案。


org.springframework.bean.factory.FactoryBean的工厂类接口，用户可以通过实现该接口定制实例化bean的逻


FactoryBean接口对于Spring框架来说占有非常重要的地位，Spring自身就提供了70多个FactoryBean接口的实


来了便利。从Spring 3.0开始，FactoryBean开始支持泛型，即接口声明改为FactoryBean的形式。



<img src="/img/spring.pdf-84-0.png">84-0
<img src="/img/spring.pdf-85-0.png">85-0

**当配置文件中标签的class属性配置的实现类是FactoryBean时，通过 getBean()方法返回的不是FactoryBean**


**相当于FactoryBean#getObject()代理了getBean()方法。**


**FactoryBean案例**


首先，创建一个ColorFactoryBean类，它得实现FactoryBean接口，如下所示。

```
    package com meimeixia bean. . ;

    import org springframework beans factory. . . .FactoryBean;

    /**
```

_`*`_ 创建一个 _`Spring`_ 定义的 _`FactoryBean`_

_`* T`_ （泛型）：指定我们要创建什么类型的对象
```
    * @author liayun
    *

    */
    public class ColorFactoryBean implements FactoryBean<Color> {

```

_`//`_ 返回一个 _`Color`_ 对象，这个对象会添加到容器中

```
      @Override

      public Color getObject() throws Exception {

         // TODO Auto-generated method stub

    System.out.println("ColorFactoryBean...getObject...");

         return new Color();

      }

      @Override

      public Class<?> getObjectType() {

         // TODO Auto-generated method stub

```

`return` `Color.class;` _`//`_ 返回这个对象的类型

```
      }

```

_`//`_ 是单例吗？


_`//`_ 如果返回 _`true`_ ，那么代表这个 _`bean`_ 是单实例，在容器中只会保存一份；


_`//`_ 如果返回 _`false`_ ，那么代表这个 _`bean`_ 是多实例，每次获取都会创建一个新的 _`bean`_

```
      @Override

      public boolean isSingleton() {

         // TODO Auto-generated method stub

         return false;

      }

    }

```

然后，我们在MainConfig2配置类中加入ColorFactoryBean的声明，如下所示。

```
    package com meimeixia config. . ;

    import org springframework context annotation. . . .Bean;
    import org springframework context annotation. . . .Conditional;
    import org springframework context annotation. . . .Configuration;
    import org springframework context annotation. . . .Import;
    import org springframework context annotation. . . .Lazy;

    import com meimeixia bean. . .Color;
    import com meimeixia bean. . .ColorFactoryBean;
    import com meimeixia bean. . .Person;
    import com meimeixia bean. . .Red;
    import com meimeixia condition. . .LinuxCondition;
    import com meimeixia condition. . .MyImportBeanDefinitionRegistrar;
    import com meimeixia condition. . .MyImportSelector;
    import com meimeixia condition. . .WindowsCondition;

```

_`//`_ 对配置类中的组件进行统一设置
`@Conditional({WindowsCondition.class})` _`//`_ 满足当前条件，这个类中配置的所有 _`bean`_ 注册才能生效
```
    @Configuration
    @Import({Color.class, Red.class, MyImportSelector.class, MyImportBeanDefinitionRegistr
    public class MainConfig2 {

      @Lazy

      @Bean("person")

      public Person person() {

                    "
     System.out.println( 给容器中添加咱们这个Person对象...");

         return new Person("美美侠", 25);

      }

      @Bean("bill")

      public Person person01() {

         return new Person("Bill Gates", 62);

      }

      @Conditional({LinuxCondition.class})

      @Bean("linus")

      public Person person02() {

         return new Person("linus", 48);

      }

      @Bean

      public ColorFactoryBean colorFactoryBean() {

         return new ColorFactoryBean();

      }

    }

```

这里需要小伙伴们注意的是：我在这里使用@Bean注解向Spring容器中注册的是ColorFactoryBean对象。


那现在我们就来看看Spring容器中到底都有哪些bean。我们所要做的事情就是，运行IOCTest类中的testImport


可以看到，结果信息中输出了一个colorFactoryBean，我们看下这个colorFactoryBean到底是个什么鬼！此时，


colorFactoryBean的代码，并输出colorFactoryBean实例的类型，如下所示。

```
    @Test
    public void testImport() {
    AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplication

    String[] definitionNames = applicationContext.getBeanDefinitionNames();

    for (String name : definitionNames) {

    System.out.println(name);
    }
```

_`//`_ 工厂 _`bean`_ 获取的是调用 _`getObject`_ 方法创建的对象
```
    Object bean2 = applicationContext.getBean("colorFactoryBean");

    System.out.println("bean的类型：" + bean2.getClass());

    }

```

再次运行IOCTest类中的testImport()方法，发现输出的结果信息如下所示。


**可以看到，虽然我在代码中使用@Bean注解注入的是ColorFactoryBean对象，但是实际上从Spring容器中获**


**getObject()方法获取到的Color对象。**


如何在Spring容器中获取到FactoryBean对象本身呢？



<img src="/img/spring.pdf-87-0.png">87-0

<img src="/img/spring.pdf-87-1.png">87-1
<img src="/img/spring.pdf-88-0.png">88-0

看到这里，是不是明白了呢？没错，在BeanFactory接口中定义了一个&前缀，只要我们使用bean的id来从Spri


FactoryBean本身。


**BeanFactory概述**


**1、简单介绍**


这个其实是所有Spring Bean的容器根接口，给Spring 的容器定义一套规范，给IOC容器提供了一套完整的规范


进入到这个类，我们可以看到如下注释，意思是： **访问Spring bean容器的根接口。**


**2、定义方法**


getBean(String name)： Spring容器中获取对应Bean对象的方法，如存在，则返回该对象。


containsBean(String name)：判断Spring容器中是否存在该对象。


isSingleton(String name)：通过beanName判断是否为单例对象。


isPrototype(String name)：判断bean对象是否为多例对象。



<img src="/img/spring.pdf-88-1.png">88-1
isTypeMatch(String name, ResolvableType typeToMatch)：判断name值获取出来的bean与typeToMath是


getType(String name)：获取Bean的Class类型。


getAliases(String name)：获取name所对应的所有的别名。


**3、主要实现类（包括抽象类）**


AbstractBeanFactory：抽象Bean工厂，绝大部分的实现类，都是继承于它。


DefaultListableBeanFactory：Spring默认的工厂类。


XmlBeanFactory：前期使用XML配置用的比较多的时候用的Bean工厂。


AbstractXmlApplicationContext：抽象应用容器上下文对象。


ClassPathXmlApplicationContext：XML解析上下文对象，用户创建Bean对象我们早期写Spring的时候用的


**4、使用方式**


BeanFactory的使用方式有很多，这里就不一一列举了，具体请查看源码。


**举一个简单的例子，使用ClassPathXmlApplicationContext读取对应的xml文件实例对应上下文对象：**

```
    ApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"applicati

    BeanFactory factory = (BeanFactory) context;

```


<img src="/img/spring.pdf-89-0.png">89-0
**Java实现异步编程的8种方式**


**笔记本：** spring


**创建时间：** 2023/4/11 9:13 **更新时间：** 2023/4/11 10:12


**作者：** 彼岸樱速


**一、前言**


异步执行对于开发者来说并不陌生，在实际的开发过程中，很多场景多会使用到异
步，相比同步执行，异步可以大大缩短请求链路耗时时间，比如： **发送短信、邮件、**
**异步更新等** ，这些都是典型的可以通过异步实现的场景。


**二、异步的八种实现方式**


**三、什么是异步？**


首先我们先看一个常见的用户下单的场景：


在同步操作中，我们执行到 **发送短信** 的时候，我们必须等待这个方法彻底执行完才能执行 **赠送**
**积分** 这个操作，如果 **赠送积分** 这个动作执行时间较长，发送短信需要等待，这就是典型的同步



<img src="/img/spring.pdf-90-0.png">90-0

<img src="/img/spring.pdf-90-1.png">90-1
场景。


实际上，发送短信和赠送积分没有任何的依赖关系，通过异步，我们可以实现赠送积分和发送短
信这两个操作能够同时进行，比如：


这就是所谓的异步，是不是非常简单，下面就说说异步的几种实现方式吧。


**四、异步编程**


**4.1 线程异步**

```
public class AsyncThread extends Thread {

@Override
public void run() {
System.out.println("Current thread name:" + Thread.currentThread().getName() + "
Send email success!");
}

public static void main(String[] args) {
AsyncThread asyncThread = new AsyncThread();
asyncThread.run();
}
}

```

当然如果每次都创建一个Thread线程，频繁的创建、销毁，浪费系统资源，我们可以采用线程
池：

```
private ExecutorService executorService = Executors.newCachedThreadPool();

public void fun() {
executorService.submit(new Runnable() {
@Override
public void run() {
```

`log.info("` 执行业务逻辑 `...");`



<img src="/img/spring.pdf-91-0.png">91-0
```
}
});
}

```

可以将业务逻辑封装到Runnable或Callable中，交由线程池来执行。


**4.2 Future异步**



<img src="/img/spring.pdf-92-0.png">92-0



输出结果：





**4.2.1 Future的不足之处**


Future的不足之处的包括以下几点：


1️⃣ 无法被动接收异步任务的计算结果：虽然我们可以主动将异步任务提交给线程池中的线程来
执行，但是待异步任务执行结束之后，主线程无法得到任务完成与否的通知，它需要通过get方
法主动获取任务执行的结果。
2️⃣ Future件彼此孤立：有时某一个耗时很长的异步任务执行结束之后，你想利用它返回的结果
再做进一步的运算，该运算也会是一个异步任务，两者之间的关系需要程序开发人员手动进行绑
定赋予，Future并不能将其形成一个任务流（pipeline），每一个Future都是彼此之间都是孤立
的，所以才有了后面的CompletableFuture，CompletableFuture就可以将多个Future串联起
来形成任务流。


3️⃣ Futrue没有很好的错误处理机制：截止目前，如果某个异步任务在执行发的过程中发生了异
常，调用者无法被动感知，必须通过捕获get方法的异常才知晓异步任务执行是否出现了错误，
从而在做进一步的判断处理。


**4.3 CompletableFuture实现异步**



<img src="/img/spring.pdf-92-2.png">92-2




<img src="/img/spring.pdf-93-0.png">93-0

我们不需要显式使用ExecutorService，CompletableFuture 内部使用了ForkJoinPool来处理
异步任务，如果在某些业务场景我们想自定义自己的异步线程池也是可以的。


**4.4 Spring的@Async异步**


**4.4.1 自定义异步线程池**


**4.4.2 AsyncService**

```
public interface AsyncService {

MessageResult sendSms(String callPrefix, String mobile, String actionType, String
content);

MessageResult sendEmail(String email, String subject, String content);
}

@Slf4j
@Service
public class AsyncServiceImpl implements AsyncService {

```


<img src="/img/spring.pdf-93-1.png">93-1
<img src="/img/spring.pdf-94-0.png">94-0

在实际项目中， 使用@Async调用线程池，推荐等方式是是使用自定义线程池的模式，不推荐
直接使用@Async直接实现异步。


对于异步方法调用，从 Spring3 开始提供了 @Async 注解，该注解可以被标注在方法上，以便
异步地调用该方法。


调用者将在调用时立即返回，方法的实际执行将提交给 Spring TaskExecutor 的任务中，由指
定的线程池中的线程执行。


在实际项目中， 使用 @Async 调用线程池，推荐等方式是是使用自定义线程池的模式，自定义
线程池常用的方案：重新实现 AsyncConfigurer 接口。


**场景**


同步： 同步就是整个处理过程顺序执行，当各个过程都执行完毕，并返回结果。
异步： 异步调用则是只是发送了调用的指令，调用者无需等待被调用的方法完全执行完
毕；而是继续执行下面的流程。例如， 在某个调用中，需要顺序调用 A, B, C 三个过程方
法；如他们都是同步调用，则需要将他们都顺序执行完毕之后，方算作过程执行完毕；如
B 为一个异步的调用方法，则在执行完 A 之后，调用 B，并不等待 B 完成，而是执行开始
调用 C，待 C 执行完毕之后，就意味着这个过程执行完毕了。在 Java 中，一般在处理类
似的场景之时，都是基于创建独立的线程去完成相应的异步调用逻辑，通过主线程和不同
的业务子线程之间的执行流程，从而在启动独立的线程之后，主线程继续执行而不会产生
停滞等待的情况。


**Spring 已经实现的线程池**


SimpleAsyncTaskExecutor：不是真的线程池，这个类不重用线程，默认每次调用都会创
建一个新的线程
SyncTaskExecutor：这个类没有实现异步调用，只是一个同步操作。只适用于不需要多线
程的地方。
ConcurrentTaskExecutor：Executor 的适配类，不推荐使用。如果
ThreadPoolTaskExecutor 不满足要求时，才用考虑使用这个类。



<img src="/img/spring.pdf-94-1.png">94-1
SimpleThreadPoolTaskExecutor：是 Quartz 的 SimpleThreadPool 的类。线程池同时
被 quartz 和非 quartz 使用，才需要使用此类。
ThreadPoolTaskExecutor ：最常使用，推荐。其实质是对
java.util.concurrent.ThreadPoolExecutor 的包装。


**常见的异步方式有：**


1. 最简单的异步调用，返回值为 void。
2. 带参数的异步调用，异步方法可以传入参数。
3. 存在返回值，常调用返回 Future/CompletableFuture。


**@Async 应用默认线程池**


Spring 应用默认的线程池，指在 @Async 注解在使用时，不指定线程池的名称。查看源码，
@Async 的默认线程池为 SimpleAsyncTaskExecutor。


**无返回值的异步调用**


**默认线程池的弊端**


在线程池应用中，参考阿里巴巴 java 开发规范：线程池不允许使用 Executors 去创建，不允许
使用系统默认的线程池，推荐通过 ThreadPoolExecutor 的方式，这样的处理方式让开发的工
程师更加明确线程池的运行规则，规避资源耗尽的风险。Executors 各个方法的弊端：


newFixedThreadPool 和 newSingleThreadExecutor：主要问题是堆积的请求处理队列
可能会耗费非常大的内存，甚至 OOM。
newCachedThreadPool 和 newScheduledThreadPool：要问题是线程数最大数是
Integer.MAX_VALUE，可能会创建数量非常多的线程，甚至 OOM。


@Async 默认异步配置使用的是 SimpleAsyncTaskExecutor，该线程池默认来一个任务创建一
个线程，若系统中不断的创建线程，最终会导致系统占用内存过高，引发 OutOfMemoryError
错误。针对线程创建问题，SimpleAsyncTaskExecutor 提供了限流机制，通过
concurrencyLimit 属性来控制开关，当 concurrencyLimit>=0 时开启限流机制，默认关闭限
流机制即 concurrencyLimit=-1，当关闭情况下，会不断创建新的线程来处理任务。基于默认
配置，SimpleAsyncTaskExecutor 并不是严格意义的线程池，达不到线程复用的功能。


**@Async 应用自定义线程池**



<img src="/img/spring.pdf-95-0.png">95-0
自定义线程池，可对系统中线程池更加细粒度的控制，方便调整线程池大小配置，线程执行异常
控制和处理。在设置系统自定义线程池代替默认线程池时，虽可通过多种模式设置，但替换默认
线程池最终产生的线程池有且只能设置一个（不能设置多个类继承 AsyncConfigurer）。自定
义线程池有如下方式：


重新实现接口 AsyncConfigurer；
继承 AsyncConfigurerSupport；
配置由自定义的 TaskExecutor 替代内置的任务执行器。


通过查看 Spring 源码关于 @Async 的默认调用规则，会优先查询源码中实现
AsyncConfigurer 这个接口的类，实现这个接口的类为 AsyncConfigurerSupport。但默认配
置的线程池和异步处理方法均为空，所以，无论是继承或者重新实现接口，都需指定一个线程
池。且重新实现 public Executor getAsyncExecutor () 方法。


**实现接口 AsyncConfigurer**

```
@Configuration
public class AsyncConfiguration implements AsyncConfigurer {

@Bean("taskExecutor")
public ThreadPoolTaskExecutor executor() {
ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
int corePoolSize = 10;
executor.setCorePoolSize(corePoolSize);
int maxPoolSize = 50;
executor.setMaxPoolSize(maxPoolSize);
int queueCapacity = 10;
executor.setQueueCapacity(queueCapacity);
executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
executor.setThreadNamePrefix( "asyncServiceExecutor-");
executor.setWaitForTasksToCompleteOnShutdown(true);
executor.setAwaitTerminationSeconds(awaitTerminationSeconds);
executor.initialize();

return executor;
}

@Override
public Executor getAsyncExecutor() {
return executor();
}
}

```

**继承 AsyncConfigurerSupport**

```
@Configuration
@EnableAsync
public class SpringAsyncConfigurer extends AsyncConfigurerSupport {
@Bean
public ThreadPoolTaskExecutor asyncExecutor() {
ThreadPoolTaskExecutor threadPool = new ThreadPoolTaskExecutor();
threadPool.setCorePoolSize(3);
threadPool.setMaxPoolSize(3);
threadPool.setWaitForTasksToCompleteOnShutdown(true);
threadPool.setAwaitTerminationSeconds(60 * 15);
return threadPool;
}

@Override
public Executor getAsyncExecutor() {
return asyncExecutor();
}
}

```

**配置自定义的 TaskExecutor (建议采用方式)**



<img src="/img/spring.pdf-96-0.png">96-0
<img src="/img/spring.pdf-97-0.png">97-0

**多个线程池**


@Async 注解，使用系统默认或者自定义的线程池（代替默认线程池）。可在项目中设置多个
线程池，在异步调用时，指明需要调用的线程池名称，如 @Async ("new_taskName")。


**4.5 Spring ApplicationEvent事件实现异步**


**4.5.1 定义事件**



<img src="/img/spring.pdf-97-1.png">97-1



**4.5.2 定义事件处理器**

```
@Slf4j
@Component
public class AsyncSendEmailEventHandler implements ApplicationListener<AsyncSendEmailEvent> {

@Autowired

private IMessageHandler mesageHandler;

```

```
@Async("taskExecutor")
@Override
public void onApplicationEvent(AsyncSendEmailEvent event) {
if (event == null) {

return;
}

String email = event.getEmail();
String subject = event.getSubject();
String content = event.getContent();
String targetUserId = event.getTargetUserId();
mesageHandler.sendsendEmailSms(email, subject, content, targerUserId);
}
}

```

另外，可能有些时候采用ApplicationEvent实现异步的使用，当程序出现异常错误的时候，需
要考虑补偿机制，那么这时候可以结合Spring Retry重试来帮助我们避免这种异常造成数据不一
致问题。


**4.6 消息队列**


**4.6.1 回调事件消息生产者**



<img src="/img/spring.pdf-98-0.png">98-0





**4.6.2 回调事件消息消费者**

```
@Slf4j
@Component
@RabbitListener(queues = "message.callback", containerFactory =
"rabbitListenerContainerFactory")
public class CallbackConsumer {

@Autowired

private IGlobalUserService globalUserService;

@RabbitHandler
public void handle(String json, Channel channel, @Headers Map<String, Object> map) throws
Exception {

if (map.get("error") != null) {
```

`//` 否认消息
```
channel.basicNack((Long) map.get(AmqpHeaders.DELIVERY_TAG), false, true);

return;
}

```

```
try {
CallbackDTO callbackDTO = JsonMapper.getInstance().fromJson(json,
CallbackDTO.class);
```

`//` 执行业务逻辑
```
globalUserService.execute(callbackDTO);
```

`//` 消息消息成功手动确认，对应消息确认模式 `acknowledge-mode: manual`
```
channel.basicAck((Long) map.get(AmqpHeaders.DELIVERY_TAG), false);
} catch (Exception e) {
```

`log.error("` 回调失败 `-> {}", e);`
```
}
}
}

```

**4.7 ThreadUtil异步工具类**


**4.8 Guava异步**


Guava的ListenableFuture顾名思义就是可以监听的Future，是对java原生Future的扩展增强。
我们知道Future表示一个异步计算任务，当任务完成时可以得到计算结果。如果我们希望一旦
计算完成就拿到结果展示给用户或者做另外的计算，就必须使用另一个线程不断的查询计算状
态。这样做，代码复杂，而且效率低下。使用 **Guava ListenableFuture** 可以帮我们检测Future
是否完成了，不需要再通过get()方法苦苦等待异步的计算结果，如果完成就自动调用回调函
数，这样可以减少并发程序的复杂度。


ListenableFuture是一个接口，它从jdk的Future接口继承，添加了void
addListener(Runnable listener, Executor executor)方法。


我们看下如何使用ListenableFuture。首先需要定义ListenableFuture的实例:

```
ListeningExecutorService executorService =
MoreExecutors.listeningDecorator(Executors.newCachedThreadPool());
final ListenableFuture<Integer> listenableFuture = executorService.submit(new Callable<Integer>
() {
@Override
public Integer call() throws Exception {
log.info("callable execute...")
TimeUnit.SECONDS.sleep(1);
return 1;
}
});

```

首先通过MoreExecutors类的静态方法listeningDecorator方法初始化一个
ListeningExecutorService的方法，然后使用此实例的submit方法即可初始化
ListenableFuture对象。


ListenableFuture要做的工作，在Callable接口的实现类中定义，这里只是休眠了1秒钟然后返
回一个数字1，有了ListenableFuture实例，可以执行此Future并执行Future完成之后的回调函
数。

```
Futures.addCallback(listenableFuture, new FutureCallback<Integer>() {
@Override
public void onSuccess(Integer result) {

```


<img src="/img/spring.pdf-99-0.png">99-0
<img src="/img/spring.pdf-100-0.png">100-0

处理并发是一个很困难的问题，但是我们可以通过使用功能强大的抽象来简化这个工作。为了简
化这个问题，Guava 提供了 ListenableFuture，它继承了 JDK 中的 Future 接口。


我们强烈建议：在你的代码中，使用ListenableFuture 来替代 Future，因为


很多Future 相关的方法需要它。
一开始就使用 ListenableFuture会省事很多。
这样工具方法提供者就不需要针对 Future 和 ListenableFuture 都提供方法。
<meta charset="utf-8">

### **接口**


Future 代表了异步执行的结果：一个可能还没有产生结果的执行过程。 Future 可以正在被执
行，但是会保证返回一个结果。


ListenableFuture 可以使你注册回调函数，使得在结果计算完成的时候可以回调你的函数。如
果结果已经算好，那么将会立即回调。这个简单的功能使得可以完成很多 Future 支持不了的操
作。


ListenableFuture 添加的基本函数是 **addListener(Runnable, Executor)** 。通过这个函数，当
Future 中的结果执行完成时，传入的 Runnable 会在传入的 Executor 中执行。

### **添加回调函数**


使用者偏向于使用 **Futures.addCallback(ListenableFuture`<`V`>`, FutureCallback`<`V`>`,**
**Executor)**,


或者当需要注册轻量级的回调的时候，可以使用默认为 MoreExecutors.directExecutor() 的版
本。


FutureCallback`<`V`>` 实现了两个方法:


onSuccess(V) ：当 future 执行成功时候的反应。
onFailure(Throwable)：当 future 执行失败时候的反应。

### **创建**


与 JDK 中 通过 **ExecutorService.submit(Callable)** 来初始化一个异步的任务相似，Guava
提供了一个 ListeningExecutorService 接口，这个接口可以返回一个 ListenableFuture
（ExecutorService 只是返回一个普通的 Future）。如果需要将一个 ExecutorService 转换为
ListeningExecutorService，可以使用
**MoreExecutors.listeningDecorator(ExecutorService)** 。一个使用示例如下：

```
ListeningExecutorService service =
MoreExecutors.listeningDecorator(Executors.newFixedThreadPool(10));
ListenableFuture`<`Explosion`>` explosion = service.submit(new Callable`<`Explosion`>`() {
public Explosion call() {
return pushBigRedButton();
}
});
Futures.addCallback(explosion, new FutureCallback`<`Explosion`>`() {
// we want this handler to run immediately after we push the big red button!

```

```
public void onSuccess(Explosion explosion) {
walkAwayFrom(explosion);
}
public void onFailure(Throwable thrown) {
battleArchNemesis(); // escaped the explosion!
}
});

```

如果你想从一个基于 **FutureTask** 的 API 转换过来，Guava 提供了
**ListenableFutureTask.create(Callable`<`V`>`)** 和 **ListenableFutureTask.create(Runnable,**
**V)** 。和 JDK 不一样，ListenableFutureTask 并不意味着可以直接扩展。


如果你更喜欢可以设置 future 值的抽象，而不是实现一个方法来计算结果，那么可以考虑直接
扩展 **AbstractFuture`<`V`>`** 或者 **SettableFuture** 。


如果你一定要将一个基于 Future 的 API 转换为基于 ListenableFuture 的话，你不得不采用硬
编码的方式 **JdkFutureAdapters.listenInPoolThread(Future)** 来实现从 Future 到
ListenableFuture 的转换。所以，尽可能地使用 ListenableFuture。

### **应用**


使用 ListenableFuture 一个最重要的原因就是：可以基于他实现负责的异步执行链。如下所
示：

```
ListenableFuture`<`RowKey`>` rowKeyFuture = indexService.lookUp(query);
AsyncFunction`<`RowKey, QueryResult`>` queryFunction = new AsyncFunction`<`RowKey, QueryResult`>`() {
public ListenableFuture`<`QueryResult`>` apply(RowKey rowKey) {
return dataService.read(rowKey);
}
};
ListenableFuture`<`QueryResult`>` queryFuture = Futures.transformAsync(rowKeyFuture, queryFunction,
queryExecutor);

```

很多不能被 Future 支持的方法可以通过 ListenableFuture 被高效地支持。不同的操作可能被
不同的执行器执行，而且一个 ListenableFuture 可以有多个响应操作。


当 ListenableFuture 有多个后续操作的时候，这样的操作称为：“扇出”。当它依赖多个输入
future 同时完成时，称作“扇入”。可以参考 **Futures.allAsList** 的实现。










|方法|描述|参考|
|---|---|---|
|transformAsync(ListenableFuture`<`A`>`,<br>AsyncFunction`<`A, B`>`, Executor)|返回新的<br>ListenableFuture，<br>它是给定<br>AsyncFunction 结<br>合的结果|transformAsync(ListenableF<br>AsyncFunction`<`A, B`>`)|
|transform(ListenableFuture`<`A`>`, Function`<`A, B`>`,<br>Executor)|返回新的<br>ListenableFuture,<br>它是给定 Function<br>结合的结果|transform(ListenableFuture<br>Function`<`A, B`>`)|
|allAsList(Iterable`<`ListenableFuture`<`V`>` `>`)|返回一个<br>ListenableFuture,<br>它的值是一个输入<br>futures 的值的按序<br>列表，任何一个<br>future 的失败都会<br>导致最后结果的失<br>败|allAsList(ListenableFuture`<`V|
|successfulAsList(Iterable<ListenableFuture`<`V`>` `>`)|返回一个<br>ListenableFuture,<br>它的值是一个输入<br>futures 的成功执行<br>值的按序列表，对|successfulAsList(ListenableF|


<img src="/img/spring.pdf-102-0.png">102-0

AsyncFunction`<`A, B`>` 提供了一个方法：ListenableFuture`<`B`>` apply(A input)。可以被用来
异步转换一个值。

```
List`<`ListenableFuture`<`QueryResult`>` `>` queries;// The queries go to all different data centers, but
we want to wait until they're all done or failed.

ListenableFuture`<`List`<`QueryResult`>` `>` successfulQueries = Futures.successfulAsList(queries);

Futures.addCallback(successfulQueries, callbackOnSuccessfulQueries);

### **避免嵌套 Future**

```

在使用通用接口返回 Future 的代码中，很有可能会嵌套 Future。例如：

```
executorService.submit(new Callable`<`ListenableFuture`<`Foo`>`() {
@Override
public ListenableFuture`<`Foo`>` call() {
return otherExecutorService.submit(otherCallable);
}
});

```

上述代码将会返回：ListenableFuture`<`ListenableFuture`<`Foo`>` `>`。这样的代码是不正确的，
因为外层 future 的取消操作不能传递到内层的 future。此外，一个常犯的错误是：使用 get()
或者 listener 来检测其它 future 的失败。为了避免这样的情况，Guava 所有处理 future 的方
法（以及一些来自 JDK 的代码）具有安全解决嵌套的版本。

### **CheckedFuture**


Guava 也提供 **CheckedFuture`<`V, X extends Exception`>`** 接口。


CheckedFuture 是这样的一个 ListenableFuture：具有多个可以抛出受保护异常的 get 方法。
这使得创建一个执行逻辑可能抛出异常的 future 变得容易。使用
**Futures.makeChecked(ListenableFuture`<`V`>`, Function`<`Exception, X`>`)** 可以将
ListenableFuture 转换为 CheckedFuture。


**测试demo**



<img src="/img/spring.pdf-102-1.png">102-1




<img src="/img/spring.pdf-103-0.png">103-0




<img src="/img/spring.pdf-104-0.png">104-0





**返回结果**



<img src="/img/spring.pdf-104-1.png">104-1


**事务传播实战**


**笔记本：** spring


**创建时间：** 2021/10/10 0:48 **更新时间：** 2023/4/7 16:35


**作者：** 彼岸樱速


**事务传播实战**


事务具有四个特性 ——ACID。其中 A 代表原子性，意思是一个事务要么成功（将结果写入数
据库），要么失败（不对数据库有任何影响）。这种方式在一个事务单打独斗的时候是一个非常
好的做法，但是如果在一个批量任务里（假设包含 1000 个独立的任务），前面的 999 个任务
都非常顺利、完美、漂亮、酷毙且成功的执行了，等到执行最后一个的时候，结果这个任务非常
悲催、很是不幸的失败了。这时候 Spring 对着前面 999 个成功执行的任务大手一挥说：兄弟
们，我们有一个任务失败了，现在全体恢复原状！如果这样的话，那可真是「一顿操作猛如虎，
定睛一看原地杵」。


在 Spring 中， 当一个方法调用另外一个方法时，可以让事务采取不同的策略工作，如新建事
务或者挂起当前事务等，这便是事务的传播行为。Spring 为我们提供了七种传播行为的策略，
通过枚举类 Propagation 定义，源码如下：



<img src="/img/spring.pdf-105-0.png">105-0



本文会研究一些常用场景的事务传播机制，文中代码只是突出了关键代码，并不完整，完整代码
请参考文章末尾的链接。对照代码食用更好！


准备两张表

```
 CREATE TABLE ` student ` (
 ` id ` int(11) NOT NULL AUTO_INCREMENT,
 ` name ` varchar(255) DEFAULT NULL,
 ` age ` int(255) DEFAULT NULL,
 PRIMARY KEY ( ` id ` )
 )

```

```
 CREATE TABLE ` course ` (
 ` id ` int(11) NOT NULL AUTO_INCREMENT,
 ` name ` varchar(255) DEFAULT NULL,
 PRIMARY KEY ( ` id ` )
 )

```

**REQUIRED(同生共死)**


结论：一旦发生回滚，所有接口都回滚


**内层失败场景**

```
 //StudentServiceImpl.java
 @Transactional ( propagation = Propagation . REQUIRED )
 @Service
 public class StudentServiceImpl implements StudentService {

 @Autowired
 private CourseService courseService ;

 @Resource
 private StudentMapper studentMapper ;

 @Override
 public int insert( Student record ) {
 int insert = studentMapper . insert ( record );
 courseService . deleteByPrimaryKey ( 1 );
 return insert ;
 }
 }

 // CourseServiceImpl.java
 @Transactional ( propagation = Propagation . REQUIRED )
 @Service
 public class CourseServiceImpl implements CourseService {
 public int deleteByPrimaryKey( Integer id ) {
```

**`int`** `res` **`=`** `1` **`/`** `0` **`;`** _`//`_ 内层事务失败
```
 return courseMapper . deleteByPrimaryKey ( id );
 }
 }

 - Creating new transaction with name [ com . cxf . data . service . impl . StudentServiceImpl . ins

 - Acquired Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jdbc . Con

 - Switching JDBC Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jd
 - ==> Preparing : insert into student ( `name`, age ) values (?, ?)
 - ==> Parameters : zhangsan ( String ), null
```

**`-`** **`<==`** `Updates` **`:`** `1` _`//`_ 加入当前事务
**`-`** `Participating` `in` `existing` `transaction` _`//`_ 加入事务失败，标记当前事务回滚
```
 - Participating transaction failed - marking existing transaction as rollback - only
 - Setting JDBC transaction [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jdb
 - Initiating transaction rollback
 - Rolling back JDBC transaction on Connection [ HikariProxyConnection@2096598149 wrappin
 - Releasing JDBC Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jd

```

**外层失败场景**

```
 //StudentServiceImpl.java

```

<img src="/img/spring.pdf-107-0.png">107-0



日志如下

```
 - Creating new transaction with name [ com . cxf . data . service . impl . StudentServiceImpl . ins
 HikariPool - 1 - Starting ...
 HikariPool - 1 - Start completed .
 - Acquired Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jdbc . Con
 - Switching JDBC Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jd
 - Initiating transaction rollback - Rolling back JDBC transaction on Connection
 [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jdbc . ConnectionImpl@ebe067d ]
 - Releasing JDBC Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jd

```

**REQUIRES_NEW(不受外层影响)**


当内部方法的传播行为设置为 REQUIRES_NEW 时，内部方法会先将外部方法的事务挂起，然
后开启一个新的事务，等内部方法执行完后再提交外层事务。


结论：


**内部回滚会导致外部事务也回滚**
**外层回滚不影响内层的提交**


**内层失败场景**

```
 @Transactional ( propagation = Propagation . REQUIRES_NEW )
 @Service
 public class CourseServiceImpl implements CourseService {
 public int deleteByPrimaryKey( Integer id ) {
 int res = 1 / 0 ;
 return courseMapper . deleteByPrimaryKey ( id );
 }
 }

```

日志输出如下

```
 - Creating new transaction with name [ com . cxf . data . service . impl . StudentServiceImpl . ins
 HikariPool - 1 - Starting ...
 HikariPool - 1 - Start completed .
 - Acquired Connection [ HikariProxyConnection@1700751834 wrapping com . mysql . cj . jdbc . Con
 - Switching JDBC Connection [ HikariProxyConnection@1700751834 wrapping com . mysql . cj . jd
```

_`//`_ 挂起当前事务，创建新事务

```
 - Suspending current transaction, creating new transaction with name [ com . cxf . data . servi
 - Acquired Connection [ HikariProxyConnection@1888400144 wrapping com . mysql . cj . jdbc . Con
 - Switching JDBC Connection [ HikariProxyConnection@1888400144 wrapping com . mysql . cj . jd
```

_`//`_ 回滚

```
 - Initiating transaction rollback
 - Rolling back JDBC transaction on Connection [ HikariProxyConnection@1888400144 wrappin
 - Releasing JDBC Connection [ HikariProxyConnection@1888400144 wrapping com . mysql . cj . jd
```

**`-`** `Resuming` `suspended` `transaction` `after` `completion` `of` `inner` `transaction` _`//`_ 执行回滚
```
 - Initiating transaction rollback
 - Rolling back JDBC transaction on Connection [ HikariProxyConnection@1700751834 wrappin
 - Releasing JDBC Connection [ HikariProxyConnection@1700751834 wrapping com . mysql . cj . jd

```

**外层失败场景**


外层失败不影响内层事务的成功提交



<img src="/img/spring.pdf-108-5.png">108-5



日志如下

```
 - Creating new transaction with name [ com . cxf . data . service . impl . StudentServiceImpl . ins
 - Acquired Connection [ HikariProxyConnection@674667952 wrapping com . mysql . cj . jdbc . Conn
 - Switching JDBC Connection [ HikariProxyConnection@674667952 wrapping com . mysql . cj . jdb
 - ==> Preparing : insert into student ( `name`, age ) values (?, ?)
 - ==> Parameters : zhangsan ( String ), null

```

```
 - <== Updates : 1
```

_`//`_ 挂起当前事务，并创建一个新事务

```
 - Suspending current transaction, creating new transaction with name [ com . cxf . data . servi
 - Acquired Connection [ HikariProxyConnection@1857852787 wrapping com . mysql . cj . jdbc . Con
 - Switching JDBC Connection [ HikariProxyConnection@1857852787 wrapping com . mysql . cj . jd
 Preparing: delete from course where id = ?
 arameters: 1 ( Integer )
 Updates : 1
```

_`//`_ 提交内层事务 _`---`_ 注意，内层成功了，通过查看数据库发现记录被成功删除

```
 - Initiating transaction commit
 - Committing JDBC transaction on Connection [ HikariProxyConnection@1857852787 wrapping
 - Releasing JDBC Connection [ HikariProxyConnection@1857852787 wrapping com . mysql . cj . jd
 - Resuming suspended transaction after completion of inner transaction

 - Initiating transaction rollback
 - Rolling back JDBC transaction on Connection [ HikariProxyConnection@674667952 wrapping
 - Releasing JDBC Connection [ HikariProxyConnection@674667952 wrapping com . mysql . cj . jdb

```

**NESTED(不受内层影响)**


当内部方法的传播行为设置为 NESTED 时，内部方法会开启一个新的嵌套事务


每个 NESTED 事务执行前会将当前操作保存下来，叫做 savepoint （保存点），如果当前
NESTED 事务执行失败，则回滚到之前的保存点，以便之前的执行结果不受当前 NESTED 事务
的影响，从而内层方法回滚，则并不影响外层方法的提交。


NESTED 事务在外部事务提交以后自己才会提交。


**外层为REQUIRED**


**内层失败场景**


结论： 内层回滚不影响外层的执行



<img src="/img/spring.pdf-109-6.png">109-6



日志如下


```
 - Creating new transaction with name [ com . cxf . data . service . impl . StudentServiceImpl . ins
 HikariPool - 1 - Starting ...
 HikariPool - 1 - Start completed .
 - Acquired Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jdbc . Con
 - Switching JDBC Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jd
 - ==> Preparing : insert into student ( `name`, age ) values (?, ?)
 - ==> Parameters : zhangsan ( String ), null
 - <== Updates : 1
```

_`//`_ 创建嵌套事务 _`,`_ 挂起外层事务
```
 - Creating nested transaction with name [ com . cxf . data . service . impl . CourseServiceImpl . d
```

_`//`_ 嵌套事务回滚到 _`savepoint`_
```
 - Rolling back transaction to savepoint
 - Initiating transaction rollback
 - Rolling back JDBC transaction on Connection [ HikariProxyConnection@2096598149 wrappin
 - Releasing JDBC Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jd

```

**外层失败场景**


外层失败会导致内层回滚



<img src="/img/spring.pdf-110-3.png">110-3



日志如下


_`//`_ 新建事务

```
 - Creating new transaction with name [ com . cxf . data . service . impl . StudentServiceImpl . ins
 HikariPool - 1 - Starting ...
 HikariPool - 1 - Start completed .
 - Acquired Connection [ HikariProxyConnection@247334525 wrapping com . mysql . cj . jdbc . Conn
 - Switching JDBC Connection [ HikariProxyConnection@247334525 wrapping com . mysql . cj . jdb
 - ==> Preparing : insert into student ( `name`, age ) values (?, ?)
 - ==> Parameters : zhangsan ( String ), null
 - <== Updates : 1

 - Creating nested transaction with name [ com . cxf . data . service . impl . CourseServiceImpl . d
 arameters: 1 ( Integer )
 Updates : 1
```

_`//`_ 释放 _`savepoint`_
```
 - Releasing transaction savepoint

 - Initiating transaction rollback
 - Rolling back JDBC transaction on Connection [ HikariProxyConnection@247334525 wrapping
 - Releasing JDBC Connection [ HikariProxyConnection@247334525 wrapping com . mysql . cj . jdb

```

查看数据库发现外层失败会导致内层回滚。


**MANDATORY**


必须在一个已有的事务中执行，否则报错


如果外层NOT_SUPPORTED，而内层是MANDATORY，则会抛异常

```
 Should roll back transaction but cannot - no transaction availableorg . springframework . tr
 No existing transaction found for transaction marked with propagation 'mandatory'

```

**NEVEL**


必须在一个没有的事务中执行，否则报错


**SUPPORTS**


如果其他bean调用这个方法时，其他bean声明了事务，则就用这个事务，如果没有声明事务，
那就不用事务


外层使用REQUIRED，内层使用SUPPORTS

```
 - Creating new transaction with name [ com . cxf . data . service . impl . StudentServiceImpl . ins
 - Acquired Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jdbc . Con
 - Switching JDBC Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jd
 - ==> Preparing : insert into student ( `name`, age ) values (?, ?)
 - ==> Parameters : zhangsan ( String ), null
```

**`-`** **`<==`** `Updates` **`:`** `1` _`//`_ 加入已有事务
```
 - Participating in existing transaction
 - Participating transaction failed - marking existing transaction as rollback - only
 - Setting JDBC transaction [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jdb
 - Initiating transaction rollback
 - Rolling back JDBC transaction on Connection [ HikariProxyConnection@2096598149 wrappin
 - Releasing JDBC Connection [ HikariProxyConnection@2096598149 wrapping com . mysql . cj . jd

```

**总结**


**区别**


REQUIRES_NEW 最为简单，不管当前有无事务，它都会开启一个全新事务，既不影响外部事
务，也不会影响其他内部事务，真正的井水不犯河水，坚定而独立。


REQUIRED 在没有外部事务的情况下，会开启一个事务，不影响其他内部事务；而当存在外部
事务的情况下，则会与外部事务还有其他内部事务同命运共生死。有条件会直接上，没条件是会
自己创造条件，然后再上。


NESTED 在没有外部事务的情况下与 REQUIRED 效果相同；而当存在外部事务的情况下，则与
外部事务生死与共，但与其他内部事务互不相干。要么孑然一身，要么誓死追随主公（外部事
务）。


**传播**


REQUIRED( **同生共死** )


当两个方法的传播机制都是REQUIRED时，如果一旦发生回滚，两个方法都会回滚


REQUIRES_NEW( **内层可独立提交** )


**内部回滚会导致外部事务也回滚**
**外层回滚不影响内层的提交**


当内层方法传播机制为REQUIRES_NEW，会开启一个新的事务，并单独提交方法，所以外层方
法的回滚并不影响内层方法事务提交


NESTED( **外层可单独提交)**


**外部回滚会导致内部事务也回滚**
**内层回滚不影响外层的提交**


当外层方法为REQUIRED，内层方法为NESTED时，内层方法开启一个嵌套事务；
当外层方法回滚时，内层方法也会回滚；反之，如果内层方法回滚，则并不影响外层方法的提交


方法A调用方法B：
1、如果只有A加@Transactional注解；则AB在同一事务中，任意异常都回滚；
2、如果只有B加@Transactional注解；AB方法为同一类，事务失效任意异常都不回滚；AB不
同类，只有B有事务且只有B异常B才回滚；
3、AB不同类加@Transactional注解，AB任意异常，全部都回滚；
4、如果A不加@Transactional注解，而B加了@Transactional注解，则A出现异常不会回滚，B
出现异常会回滚；

##### **REQUIRES_NEW、NESTED失效解决**


**REQUIRES_NEW**


spring 的事务传播这边就不提了，各种可百度到。但在用REQUIRES_NEW的时候，发现没有

起作用。


分析了一下，原因是A方法（有事务）调用B方法（要独立新事务），如果两个方法写在同一个

类里，spring的事务会只处理能同一个。


原因：spring的事务管理通过切面实现，如果直接使用this.方法()或者方法()，不会触发切面中对

事务的管理。应使用该方法所在的类的实例.方法()。


解决方案1：需要将两个方法分别写在不同的类里。


解决方案2：方法写在同一个类里，但调用B方法的时候，将service自己注入自己，用这个注入


对象来调用B方法。（ApplicationContext getBean获取service自己）


解决方案3：方法只能为public修饰。


spring一些日志输出：
logging.level.com.ryan.practice.redislock.mapper=debug
logging.level.org.apache.ibatis=DEBUG
logging.level.org.mybatis=DEBUG


logging.level.java.sql.Connection=DEBUG
logging.level.java.sql.Statement=DEBUG


logging.level.org.springframework=DEBUG


**NESTED**


场景：父方法，调用多个子方法（声明式事务，propagation = Propagation.NESTED）， **父方**

**法调用时需要catch子方法异常，否则NESTED不生效** 。


以下为日志记录，一个connection对应一次事务


2021-06-09 14:25:47.659 DEBUG 19264 --- [      main]
o.s.j.d.DataSourceTransactionManager   : Creating new transaction with name

[com.ryan.practice.redislock.service.tran.ServiceA.addWillDeleteUser]:
PROPAGATION_REQUIRED,ISOLATION_READ_COMMITTED,-java.lang.Exception
2021-06-09 14:25:47.660 DEBUG 19264 --- [      main]
o.s.j.d.DataSourceTransactionManager   : Acquired Connection

[HikariProxyConnection@1987428721 wrapping
com.mysql.jdbc.JDBC4Connection@44e4cb76] for JDBC transaction
2021-06-09 14:25:47.663 DEBUG 19264 --- [      main]
o.s.jdbc.datasource.DataSourceUtils   : Changing isolation level of JDBC Connection

[HikariProxyConnection@1987428721 wrapping
com.mysql.jdbc.JDBC4Connection@44e4cb76] to 2
2021-06-09 14:25:47.664 DEBUG 19264 --- [      main]
o.s.j.d.DataSourceTransactionManager   : Switching JDBC Connection

[HikariProxyConnection@1987428721 wrapping
com.mysql.jdbc.JDBC4Connection@44e4cb76] to manual commit
2021-06-09 14:25:47.673 DEBUG 19264 --- [      main]
org.mybatis.spring.SqlSessionUtils    : Creating a new SqlSession
2021-06-09 14:25:47.678 DEBUG 19264 --- [      main]
org.mybatis.spring.SqlSessionUtils    : Registering transaction synchronization for
SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@13866329]
2021-06-09 14:25:48.056 DEBUG 19264 --- [      main]
o.m.s.t.SpringManagedTransaction     : JDBC Connection

[HikariProxyConnection@1987428721 wrapping
com.mysql.jdbc.JDBC4Connection@44e4cb76] will be managed by Spring
2021-06-09 14:25:48.077 DEBUG 19264 --- [      main]
org.mybatis.spring.SqlSessionUtils    : Releasing transactional SqlSession

[org.apache.ibatis.session.defaults.DefaultSqlSession@13866329]
result add is : 1
2021-06-09 14:25:48.078 DEBUG 19264 --- [      main]
o.s.j.d.DataSourceTransactionManager   : Creating nested transaction with name

[com.ryan.practice.redislock.service.tran.ServiceA.updateWillDeleteUser]
2021-06-09 14:25:48.083 DEBUG 19264 --- [      main]
org.mybatis.spring.SqlSessionUtils    : Fetched SqlSession

[org.apache.ibatis.session.defaults.DefaultSqlSession@13866329] from current
transaction
2021-06-09 14:25:48.108 DEBUG 19264 --- [      main]
org.mybatis.spring.SqlSessionUtils    : Releasing transactional SqlSession

[org.apache.ibatis.session.defaults.DefaultSqlSession@13866329]


2021-06-09 14:25:48.109 DEBUG 19264 --- [      main]
o.s.j.d.DataSourceTransactionManager   : Rolling back transaction to savepoint


result udpate is : false
2021-06-09 14:25:48.206 DEBUG 19264 --- [      main]
org.mybatis.spring.SqlSessionUtils    : Transaction synchronization committing
SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@13866329]
2021-06-09 14:25:48.207 DEBUG 19264 --- [      main]
org.mybatis.spring.SqlSessionUtils    : Transaction synchronization deregistering
SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@13866329]
2021-06-09 14:25:48.207 DEBUG 19264 --- [      main]
org.mybatis.spring.SqlSessionUtils    : Transaction synchronization closing SqlSession

[org.apache.ibatis.session.defaults.DefaultSqlSession@13866329]
2021-06-09 14:25:48.208 DEBUG 19264 --- [      main]
o.s.j.d.DataSourceTransactionManager   : Initiating transaction commit


2021-06-09 14:25:48.208 DEBUG 19264 --- [      main]
o.s.j.d.DataSourceTransactionManager   : Committing JDBC transaction on Connection

[HikariProxyConnection@1987428721 wrapping
com.mysql.jdbc.JDBC4Connection@44e4cb76]
2021-06-09 14:25:48.250 DEBUG 19264 --- [      main]
o.s.jdbc.datasource.DataSourceUtils   : Resetting isolation level of JDBC Connection

[HikariProxyConnection@1987428721 wrapping
com.mysql.jdbc.JDBC4Connection@44e4cb76] to 4


2021-06-09 14:25:48.251 DEBUG 19264 --- [      main]
o.s.j.d.DataSourceTransactionManager   : Releasing JDBC Connection

[HikariProxyConnection@1987428721 wrapping
com.mysql.jdbc.JDBC4Connection@44e4cb76] after transaction


**@Async的使用、应用场景**


**笔记本：** spring


**创建时间：** 2022/11/15 14:27 **更新时间：** 2022/11/15 14:36


**作者：** 彼岸樱速


**@Async的作用**
正常方法被调用时是同步执行，而@Async标识的方法调用时是异步执行。


**应用场景**
通常用于耗时较长或者不需要立即得到执行结果的逻辑，说白了就是异步执行
例如：





**@Async的使用**
这里就同步商品为例，简单说下商品同步的业务便于理解


假设现在有个SaaS化的商城有个商品总库，总库新增了商品，每个企业的商城可以自主同步总
库所新增的商品，这个商品同步过程就可以使用@Async异步去实现。


闲话不多说，直接上代码。


项目目录结构：


要使用@Async首先需要开启该功能，在配置类下加入@EnableAsync



<img src="/img/spring.pdf-115-1.png">115-1



商品同步接口（按照规范来说Controller中不应该存在业务逻辑，这里为了便于理解，写的可能
不是那么规范）

```
 @RestController
 @RequiredArgsConstructor
 @RequestMapping("/product")
 @Slf4j
 public class ProductController {

 private final ProductService productService;

 /**
 * 模拟同步商品 测试异步执行 ( 无返回值 )
 */
 @GetMapping("/syncProduct")
 public ResultVo<String> syncProduct() {

```

```
 log.info("syncProduct invoke start");
 productService.syncProduct();
 log.info("syncProduct invoke end");
 return ResultVo.success();
 }

 /**
 * 测试异步执行 ( 有返回值 )
 */
 @GetMapping("/testAsyncResult")
 public ResultVo<String> testAsyncResult() {
 log.info("syncProduct invoke start");
 Future<String> stringFuture = productService.testAsyncResult();
 try {
 String result = stringFuture.get();
 log.info(result);
 } catch (InterruptedException | ExecutionException e) {
 e.printStackTrace();
 }
 log.info("syncProduct invoke end");
 return ResultVo.success();
 }

 }

```

上方包含两个接口





商品Service接口





商品Service接口实现



<img src="/img/spring.pdf-116-2.png">116-2



**结论**

<img src="/img/spring.pdf-116-3.png">116-3
调用syncProduct时输出





1、可以看到Service中打印日志和Controller中打印日志使用了不一样的线程
2、观察打印日志时间可以看出syncProduct invoke start 和syncProduct invoke end 打印的
间隔不到10毫秒，很明显已经异步执行了。


<img src="/img/spring.pdf-117-0.png">117-0

3、不需要等 productService.syncProduct 方法执行完，用户已经收到响应接口





由此得出 productService.syncProduct 确实异步执行了。


**调用testAsyncResult时，有两种情况**


1、如果使用了stringFuture.get()获取执行结果，那么当前线程会阻塞，直到Service执行结束
返回结果才会继续向下执行。
日志打印：



<img src="/img/spring.pdf-117-1.png">117-1



2、如果没有使用stringFuture.get()获取执行结果，和 productService.syncProduct 一样，不
会阻塞。
日志打印：



<img src="/img/spring.pdf-117-2.png">117-2



**疑问解答**



<img src="/img/spring.pdf-117-3.png">117-3


**Spring ApplicationEventPublisher的使用学习**


**笔记本：** spring


**创建时间：** 2022/6/20 10:54 **更新时间：** 2022/6/20 11:12


**作者：** 彼岸樱速


**一、介绍**


**1.ApplicationEventPublisherAware**



<img src="/img/spring.pdf-118-1.png">118-1



**2.ApplicationListener**





**3.ApplicationEventPublisher**





**二、使用@EventLister**


**1.示例程序【同步】**


**接口** ：


**接口实现** ：


**监听** ：



<img src="/img/spring.pdf-118-4.png">118-4

<img src="/img/spring.pdf-118-5.png">118-5
```
public void handleEvent(Student student){
try {
Thread.sleep(5000);
} catch (InterruptedException e) {
e.printStackTrace();
}
System.out.println(student);
}
}

```

**测试** ：


**效果** ：



<img src="/img/spring.pdf-119-0.png">119-0

<img src="/img/spring.pdf-119-1.png">119-1



**2.进行异步**


**进行配置类** ：


**在监听方法上添加@Async**



<img src="/img/spring.pdf-119-2.png">119-2

<img src="/img/spring.pdf-119-3.png">119-3
```
}

```

**效果** ：





**三、使用@TransactionalEventListener**


Spring事务监听机制---使用@TransactionalEventListener处理数据库事务提交成功后再执行
操作


**1.为什么使用**





为了解决上述问题，Spring为我们提供了两种方式 ：





**2.示例**


这样，只有当前事务提交之后，才会执行事件监听器的方法。其中参数phase默认为
AFTER_COMMIT，共有四个枚举：



<img src="/img/spring.pdf-120-3.png">120-3

<img src="/img/spring.pdf-120-4.png">120-4


**别再乱用了，这才是 @Validated 和 @Valid 的真正区别**


**笔记本：** spring


**创建时间：** 2022/6/8 14:57 **更新时间：** 2022/6/8 15:21


**作者：** 彼岸樱速


**别再乱用了，这才是 @Validated 和 @Valid 的真正区别**


概述


`@Valid` 是使用 `Hibernate validation` 的时候使用


`@Validated` 是只用 `Spring Validator` 校验机制使用





`@Validation` 对 `@Valid` 进行了二次封装，在使用上并没有区别，但在分组、注解位置、嵌套验证


等功能上有所不同，这里主要就这几种情况进行说明。


**注解位置**


`@Validated` ：用在类型、方法和方法参数上。但不能用于成员属性（field）


`@Valid` ：可以用在方法、构造函数、方法参数和成员属性（field）上


如：


如果 `@Validated` 注解在成员属性上，则会报不适用于field错误


**分组校验**


`@Validated` ：提供分组功能，可以在参数验证时，根据不同的分组采用不同的验证机制


`@Valid` ：没有分组功能


举例：


定义分组接口：


定义需要检验的参数bean：



<img src="/img/spring.pdf-121-2.png">121-2
<img src="/img/spring.pdf-122-0.png">122-0

测试代码：


检验分组为IGroupA的情况


测试：


这里对分组IGroupB的就没检验了


如果把测试代码改成下面这样，看看测试结果


说明：


1、不分 配groups，默认每次都要进行验证



<img src="/img/spring.pdf-122-1.png">122-1

<img src="/img/spring.pdf-122-2.png">122-2

<img src="/img/spring.pdf-122-3.png">122-3
2、对一个参数需要多种验证方式时，也可通过分配不同的组达到目的。


**组序列**


默认情况下 不同级别的约束验证是无序的，但是在一些情况下，顺序验证却是很重要。


一个组可以定义为其他组的序列，使用它进行验证的时候必须符合该序列规定的顺序。在使用组


序列验证的时候，如果序列前边的组验证失败，则后面的组将不再给予验证。


举例：


定义组序列：


需要校验的Bean，分别定义IGroupA对age进行校验，IGroupB对className进行校验：


测试代码：


测试发现，如果age出错，那么对组序列在IGroupA后的IGroupB不进行校验，即例子中的


className不进行校验，结果如下：



<img src="/img/spring.pdf-123-1.png">123-1

<img src="/img/spring.pdf-123-2.png">123-2
<img src="/img/spring.pdf-124-0.png">124-0

**嵌套校验**


一个待验证的pojo类，其中还包含了待验证的对象，需要在待验证对象上注解 `@Valid` ，才能验


证待验证对象中的成员属性，这里不能使用 `@Validated` 。


举例：


需要约束校验的bean：



<img src="/img/spring.pdf-124-1.png">124-1

<img src="/img/spring.pdf-124-2.png">124-2
}


注意：


这里对 `teacherBeans` 只校验了 `NotNull`, 和 Size，并没有对teacher信息里面的字段进行校验，具


体测试如下：


这里teacher中的type明显是不符合约束要求的，但是能检测通过，是因为在student中并没有


做 嵌套校验


可以在 `teacherBeans` 中加上 `@Valid` ，具体如下：


这里再来测试，会发现如下结果：



<img src="/img/spring.pdf-125-0.png">125-0
<img src="/img/spring.pdf-126-0.png">126-0
**Spring中工具类如何引入bean**


**笔记本：** spring


**创建时间：** 2022/2/25 9:10 **更新时间：** 2022/2/25 14:59


**作者：** 彼岸樱速


**Spring中工具类如何引入bean**


先来看一个例子


现在有一个工具类，工具类的方法一般都是加上static关键字，这样子在其他地方使用的时候，
就可以直接XXXUtil.xxxMethod就可以调用了（如图一的encrypt方法）


但是现在有个方法，因为要从nacos配置里面取值，所以使用了@Value注解进行注入这个参
数，然后重构了一个encrypt方法(不带key参数，因为key参数从nacos动态获取)


我们可以看到，如果想要在静态方法里面使用全局的参数defaultAESKey，除非把这个参数也定
义成static的，那么静态方法就无法使用这个参数


我们尝试把defaultAESKey设置成static，看下会发生什么。



<img src="/img/spring.pdf-127-0.png">127-0

<img src="/img/spring.pdf-127-1.png">127-1
<img src="/img/spring.pdf-128-0.png">128-0

这样子的确不会提示编译不通过了，但是我们跑起来之后，就会发现这个defaultAESKey根本拿
不到nacos里面配置的值，但是如果把static去掉，你就会发现，又可以拿到值了。


然后你就会发现，要么你加上很多没必要的代码，要么就妥协，凡是有使用@Value，
@Service，@Controller这些spring容器管理的注解，


从上面的第一条规则里面就可以看出，这些注解跟static本身其实是冲突的。


那如何是好？以前的时候，一个工具类里面有好多static方法，


有的时候好像上面的，需要动态注入一个nacos配置的参数的值，


有的时候需要查数据库，就要用@Autowired这些注解 注入XXXMapper，XXXService


这时候如果你想继续用@Autowired这些注解，那么你只能把整个工具类的所有static方法，


把static关键字都去掉，然后在工具类上面，加上@Component加入到spring容器当中作为一
个组件而存在



<img src="/img/spring.pdf-128-1.png">128-1
<img src="/img/spring.pdf-129-0.png">129-0

然后在具体使用的地方，用@Autowired注入这个工具类的组件，然后在具体的地方，


那么本来应该是static，不需要实例，XXXUtil.xxxMethod就可以调用的方法，通通要改为通过
实例调用


如果你的工具类本来就有很多方法，并且引用的地方也不少，那么你要改动的代码量就很多了，
这就是所谓的，牵一发而动全身。


我们知道，工具类通常都是static方法，如果直接引用xxxbean，那么xxxbin的变量必须要声明
为static类型，


但是这怎么行呢，spring框架new出来的那个实例就注入不进来了啊？


如何解决？其实解决方法很简单，我们都使用惯了@Autowired这些注解，慢慢的忘记了我们初
学spring的时候，这些bean是怎么创建和拿到的。


直接在工具类的static方法中，使用





获取实例。


下面是SpringContextUtil的代码示例



<img src="/img/spring.pdf-129-2.png">129-2
<img src="/img/spring.pdf-130-0.png">130-0


**spring 通过@responsebody接收多个对象参数**


**笔记本：** spring


**创建时间：** 2022/2/21 18:38 **更新时间：** 2022/2/21 18:42


**作者：** 彼岸樱速


**springmvc不支持多个@RequestBody** .


requestbody的含义是在当前对象获取整个http请求的body里面的所有数据，因此spring就不可能将这个数
据强制包装成Course或者List类型，并且从@requestbody设计上来说，只获取一次就可以拿到请求body里
面的所有数据，就没必要出现有多个@requestbody出现在controller的函数的形参列表当中。


解决方法：


**1、组装一个新的实体，将需要的entity都装进去，但是不够优雅。**


**2、用Map<String,Object>接收参数，自己反序列化得到对应的entity** 。


前台js



<img src="/img/spring.pdf-131-0.png">131-0



后台代码：



<img src="/img/spring.pdf-131-1.png">131-1







json 工具类：

```
 public final class JSONHelper {

 /***

```

`*` 将将对象转换为传入类型的对象

```
 *

 * @param `<`T`>`

 * @param object

 * @param beanClass

```

```
 * @return

 */

 public static `<`T`>` T toBean(Object object, Class`<`T`>` beanClass) {

 JSONObject jsonObject = JSONObject.fromObject(object);

 return (T) JSONObject.toBean(jsonObject, beanClass);

 }

 /***

```

`*` 将对象转换为传入类型的 `List`

```
 *

 * @param `<`T`>`

 * @param jsonArray

 * @param objectClass

 * @return

 */

 public static `<`T`>` List`<`T`>` toList(Object object, Class`<`T`>` objectClass) {

 JSONArray jsonArray = JSONArray.fromObject(object);

 return JSONArray.toList(jsonArray, objectClass);

 }

 }

```

3、实现自己的HandlerMethodArgumentResolver


**@Validated 和 @Valid 的区别**


**笔记本：** spring


**创建时间：** 2022/2/21 14:42 **更新时间：** 2022/2/21 16:57


**作者：** 彼岸樱速


**Spring Validation验证框架** 对参数的验证机制提供了 **@Validated** （Spring's JSR-303 规范，是标准 JSR303 的一个变种），javax提供了@Valid（标准JSR-303规范），配合 BindingResult 可以直接提供参数验证
结果。其中对于字段的特定验证注解比如 @NotNull 等网上到处都有，这里不详述


在检验 Controller 的入参是否符合规范时，使用 @Validated 或者 @Valid 在基本验证功能上没有太多区
别。但是在分组、注解地方、嵌套验证等功能上两个有所不同：


**1. 分组**


@Validated：提供了一个分组功能，可以在入参验证时，根据不同的分组采用不同的验证机制，这个网上也
有资料，不详述。@Valid：作为标准JSR-303规范，还没有吸收分组的功能。


**2. 注解地方**


**@Validated** ：可以用在类型、方法和方法参数上。但是 **不能用在成员属性（字段）** 上

**@Valid** ：可以用在方法、构造函数、方法参数和成员属性（字段）上， **如果需要嵌套验证，则需要在具体子**


两者是否能用于成员属性（字段）上直接影响能否提供嵌套验证的功能。


**3. 嵌套验证**


在比较两者嵌套验证时，先说明下什么叫做嵌套验证。比如我们现在有个实体叫做Item：

```
 public class Item {

```

`@NotNull(message =` `"id` 不能为空 `")`


`@Min(value =` `1, message =` `"id` 必须为正整数 `")`

```
 private Long id;

```

`@NotNull(message =` `"props` 不能为空 `")`

`@Size(min =` `1, message =` `"` 至少要有一个属性 `")`

```
 private List<Prop> props;

 }

```

Item带有很多属性，属性里面有属性id，属性值id，属性名和属性值，如下所示：

```
 public class Prop {

```

`@NotNull(message =` `"pid` 不能为空 `")`


`@Min(value =` `1, message =` `"pid` 必须为正整数 `")`

```
 private Long pid;

```

`@NotNull(message =` `"vid` 不能为空 `")`


`@Min(value =` `1, message =` `"vid` 必须为正整数 `")`

```
 private Long vid;

```

`@NotBlank(message =` `"pidName` 不能为空 `")`

```
 private String pidName;

```

`@NotBlank(message =` `"vidName` 不能为空 `")`

```
 private String vidName;

 }

```

属性这个实体也有自己的验证机制，比如属性和属性值id不能为空，属性名和属性值不能为空等。


现在我们有个 ItemController 接受一个Item的入参，想要对Item进行验证，如下所示：

```
 @RestController

 public class ItemController {

 @RequestMapping("/item/add")

```

```
 public void addItem(@Validated Item item, BindingResult bindingResult) {

 doSomething();

 }

 }

```

在上图中，如果Item实体的props属性不额外加注释，只有@NotNull和@Size，无论入参采用@Validated
还是@Valid验证，Spring Validation框架只会对Item的id和props做非空和数量验证，不会对props字段里
的Prop实体进行字段验证，也就是@Validated和@Valid加在方法参数前，都不会自动对参数进行嵌套验
证。也就是说如果传的List中有Prop的pid为空或者是负数，入参验证不会检测出来。


为了能够进行嵌套验证，必须手动在Item实体的props字段上明确指出这个字段里面的实体也要进行验证。由
于@Validated不能用在成员属性（字段）上，但是@Valid能加在成员属性（字段）上，而且@Valid类注解
上也说明了它支持嵌套验证功能，那么我们能够推断出：@Valid加在方法参数时并不能够自动进行嵌套验
证，而是用在需要嵌套验证类的相应字段上，来配合方法参数上@Validated或@Valid来进行嵌套验证。


我们修改Item类如下所示：

```
 public class Item {

```

`@NotNull(message =` `"id` 不能为空 `")`


`@Min(value =` `1, message =` `"id` 必须为正整数 `")`

```
 private Long id;

```

`@Valid` `//` 嵌套验证必须用 `@Valid`


`@NotNull(message =` `"props` 不能为空 `")`

`@Size(min =` `1, message =` `"props` 至少要有一个自定义属性 `")`

```
 private List<Prop> props;

 }

```

然后我们在ItemController的addItem函数上再使用@Validated或者@Valid，就能对Item的入参进行嵌套验
证。此时Item里面的props如果含有Prop的相应字段为空的情况，Spring Validation框架就会检测出来，
bindingResult就会记录相应的错误。


总结一下 @Validated 和 @Valid 在嵌套验证功能上的区别：


**@Validated：** 用在方法入参上无法单独提供嵌套验证功能。不能用在成员属性（字段）上，也无法提示框
架进行嵌套验证。能配合嵌套验证注解@Valid进行嵌套验证。


**@Valid：** 用在方法入参上无法单独提供嵌套验证功能。能够用在成员属性（字段）上，提示验证框架进行嵌
套验证。能配合嵌套验证注解@Valid进行嵌套验证。


**java参数校验validation-api**


**笔记本：** spring


**创建时间：** 2022/2/18 19:08 **更新时间：** 2022/2/18 19:15


**作者：** 彼岸樱速

##### **一、参数校验的由来**


校验参数在项目中是很常见的，在java中，几乎每个有入参的方法，在执行下一步操作之前，都要验证参数的
合法性，比如是入参否为空，数据格式是否正确等等，往常的写法就是一大推的 `if-else`,既不美观也不优雅，

这个时候 `JCP` 组织站出来了，并且制定了一个标准来规范校验的操作，这个标准就是


但是这个仅仅是一个标准而是，并没有具体的实现，下面介绍两种常用实现。

##### **二、Java Validation API 的实现者**


**2.1、hibernate-validator**

```
 <dependency>

 <groupId>org.hibernate.validator</groupId>

 <artifactId>hibernate-validator</artifactId>

 <version>6.0.20.Final</version>

 </dependency>

```

这个实现是有hibernate实现的，如果入参是一个对象,配合 `@Valid` 注解即可，但是无法对单个参数应用


`@NotNull` 、 `@Min` 这类的注解


**2.2、spring-boot-starter-validation**

```
 <dependency>

 <groupId>org.springframework.boot</groupId>

 <artifactId>spring-boot-starter-web</artifactId>

 </dependency>

```

或者

```
 <dependency>

 <groupId>org.springframework.boot</groupId>

 <artifactId>spring-boot-starter-validation</artifactId>

 </dependency>
```

这两个 `[pom]` 是 `[spring]` 对 `[hibernate-validator]` 的一个封装和扩展，同时提供了一个 `[@Validated]` 的注解，该注解


即可标记在类上，也可以跟 `[@Valid]` 注解用法一样，标记一个入参对象，更强大的是，该注解支持了单个参数


的校验，但是需要在 [类] 上加 `[@Validated]` 这个注解，可见该注解完全可以替代@Valid注解来使用。



<img src="/img/spring.pdf-135-3.png">135-3
<img src="/img/spring.pdf-136-0.png">136-0
##### **三、使用**

**3.1、需求**


用户注册接口，名称，年龄，邮箱、不能为空


用户修改接口，名称，年龄，邮箱，主键id，不能为空


用户信息接口，入参为单个参数


**3.2、代码实现**


**注册接口group**

```
 /**

```

`*` 添加时的验证规则

```
 * @author DUCHONG

 * @since 2020-08-24 23:35:46

 */

 public interface ValidAddRules {

 }

```

**修改接口group**

```
 /**

```

`*` 修改时的验证规则

```
 * @author DUCHONG

 * @since 2020-08-24 23:35:46

 **/

 public interface ValidUpdateRules {

 }

```

**入参对象UserRequest**

```
 /**

```

`*` 入参对象

```
 *

 * @author DUCHONG

 * @since 2020-08-24 23:33

```

```
 **/

 @Data@Builder

 public class UserRequest implements java.io.Serializable {

 private static final long serialVersionUID = -2655536314774756670L;

 /**

```

`*` 主键

```
 */

```

`@NotNull(message = "id` 不能为空 `",groups = {ValidUpdateRules.class})`

```
 @Min(1)

 private Long userId;

 /**

```

`*` 年龄

```
 */

```

`@NotNull(message = "` 年龄不能为空 `",groups =`

```
 {ValidUpdateRules.class,ValidAddRules.class})

 @Min(1)

 private Integer age;

 /**

```

`*` 企业类型名称

```
 */

```

`@NotBlank(message = "` 名称不能为空 `",groups =`

```
 {ValidUpdateRules.class,ValidAddRules.class})

 private String name;

 /**

```

`*` 邮箱

```
 */

```

`@NotBlank(message = "` 邮箱不能为空 `",groups =`

```
 {ValidUpdateRules.class,ValidAddRules.class})
```

`@Email(message = "` 邮箱格式不正确 `")`

```
 private String email;

 /**

```

`*` 昵称

```
 */

 private String nickName;

 }

```

**controller**

```
 import lombok.extern.slf4j.Slf4j;

 import org.springframework.validation.BindingResult;

 import org.springframework.validation.annotation.Validated;

 import org.springframework.web.bind.annotation.PostMapping;

 import org.springframework.web.bind.annotation.RequestBody;

 import org.springframework.web.bind.annotation.RestController;

 import javax.validation.constraints.Min;

 import javax.validation.constraints.NotNull;

 import java.util.ArrayList;

 import java.util.List;

 import java.util.stream.Collectors;

 /**

```

`*` 用户控制器

```
 *

 * @author DUCHONG

 * @since 2020-08-24 23:41

 **/

```

```
 @RestController

 @Slf4j

 @Validated

 public class UserController {

 /**

```

`*` 用户注册

```
 * @param userRequest

 * @param bindingResult

 * @return

 */

 @PostMapping("/user/register")

 public String registerUser(@Validated(ValidAddRules.class) @RequestBody

 UserRequest userRequest, BindingResult bindingResult){

 List<String> list=new ArrayList<>();

 bindingResult.getFieldErrors().forEach(fieldError -> {

 list.add(fieldError.getDefaultMessage());

 });

 return list.stream().collect(Collectors.joining(",")) ;

 }

 /**

```

`*` 用户注册

```
 * @param userId

 * @param bindingResult

 * @return

 */

 @PostMapping("/user/get")
```

`public` `String` `getUser(@NotNull(message = "` 用户 `id` 不能为空 `")` `@Min(1)` `Long userId,`

```
 BindingResult bindingResult){

 List<String> list=new ArrayList<>();

 bindingResult.getFieldErrors().forEach(fieldError -> {

 list.add(fieldError.getDefaultMessage());

 });

 return list.stream().collect(Collectors.joining(",")) ;

 }

 /**

```

`*` 用户修改

```
 * @param userRequest

 * @param bindingResult

 * @return

 */

 @PostMapping("/user/update")

 public String updateUser(@Validated(ValidUpdateRules.class) @RequestBody

 UserRequest userRequest, BindingResult bindingResult){

 List<String> list=new ArrayList<>();

 bindingResult.getFieldErrors().forEach(fieldError -> {

 list.add(fieldError.getDefaultMessage());

 });

 return list.stream().collect(Collectors.joining(",")) ;

 }

 }

```

搞定！！！


但是你有木有发现，每个方法上有一个 `[BindingResult]` ，存储这报错的信息，那是不是可以提供一个公用的方


法，当校验规则触发时，能捕获到异常信息，然后返回，它来了，它就是统一的异常处理入口，话不多少上代

码

##### **四、校验统一异常处理**


```
import lombok.extern.slf4j.Slf4j;

import org.springframework.validation.BindException;

import org.springframework.validation.BindingResult;

import org.springframework.web.bind.MethodArgumentNotValidException;

import org.springframework.web.bind.annotation.ExceptionHandler;

import org.springframework.web.bind.annotation.RestControllerAdvice;

import

org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.validation.ConstraintViolation;

import javax.validation.ConstraintViolationException;

import java.util.ArrayList;

import java.util.List;

import java.util.Set;

import java.util.stream.Collectors;

/**

```

`*` 统一的异常处理器

```
* @author DUCHONG

* @since 2020-08-25 00:57:40

*/

@Slf4j

@RestControllerAdvice

public class GlobalExceptionHandler {

/**

```

`*` 参数合法性校验异常

```
* @param exception

* @return

*/

@ExceptionHandler(MethodArgumentNotValidException.class)

public BaseResponse

handleMethodArgumentNotValidException(MethodArgumentNotValidException exception){

BaseResponse exceptionInfo = getErrorInfo(exception);
```

`log.error("` 参数校验异常 `---{}",exceptionInfo.getMsg());`

```
return exceptionInfo;

}

/**

```

`*` 参数合法性校验异常 `-` 类型不匹配

```
* @param exception

* @return

*/

@ExceptionHandler(MethodArgumentTypeMismatchException.class)

public BaseResponse

handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException

exception){

BaseResponse exceptionInfo = getErrorInfo(exception);
```

`log.error("` 参数校验异常 `---{}",exceptionInfo.getMsg());`

```
return exceptionInfo;

}

/**

```

`*` 参数绑定异常

```
* @param exception

* @return

*/

@ExceptionHandler(value = BindException.class)

public BaseResponse handleBindException(BindException exception) {

BaseResponse exceptionInfo = getErrorInfo(exception);
```

`log.error("` 参数校验异常 `---{}",exceptionInfo.getMsg());`

```
return exceptionInfo;

```

```
}

/**

```

`*` 违反约束异常 单个参数使用

```
* @param exception

* @return

*/

@ExceptionHandler(value = ConstraintViolationException.class)

public BaseResponse

handleConstraintViolationException(ConstraintViolationException exception) {

BaseResponse exceptionInfo = getErrorInfo(exception);
```

`log.error("` 参数校验异常 `---{}", exceptionInfo.getMsg());`

```
return exceptionInfo;

}

/**

```

`*` 将 `List` 结果转换成 `json` 格式

```
* @param exception

* @return

*/

public BaseResponse getErrorInfo(Exception exception) {

if(exception instanceof BindException){

return convertBindingResultToJson(((BindException)

exception).getBindingResult());

}

if(exception instanceof MethodArgumentNotValidException){

return convertBindingResultToJson(((MethodArgumentNotValidException)

exception).getBindingResult());

}

if(exception instanceof ConstraintViolationException){

return convertSetToJson(((ConstraintViolationException)

exception).getConstraintViolations());

}

if(exception instanceof MethodArgumentTypeMismatchException){

String msg= exception.getMessage();

return new BaseResponse(500, msg, null);

}

```

`//` 未定义的异常


`return` `new` `BaseResponse(500,` `"` 未知错误 `",` `null);`

```
}

/**

```

`*` 将单个参数实体校验结果封装

```
* @param constraintViolations

* @return

*/

public BaseResponse convertSetToJson(Set<? extends ConstraintViolation>

constraintViolations) {

List<String> list=new ArrayList<>();

for (ConstraintViolation violation : constraintViolations) {

list.add(violation.getMessage());

}

return new BaseResponse(500,list.stream().collect(Collectors.joining(",")),

null);

}

**

```

`*` 将实体对象的校验结果封装

```
* @param result

* @return

*/

public BaseResponse convertBindingResultToJson(BindingResult result){

```

```
 List<String> list=new ArrayList<>();

 result.getFieldErrors().forEach(fieldError -> {

 list.add(fieldError.getDefaultMessage());

 });

 return new

 BaseResponse(500,list.stream().collect(Collectors.joining(",")),null);

 }

 }

```

到此可以跟 `[BindingResult]` 说拜拜了。


**springBoot整合mail以及邮件发送实例**


**笔记本：** spring


**创建时间：** 2021/11/17 13:34 **更新时间：** 2021/11/17 13:49


**作者：** 彼岸樱速

##### **springBoot整合mail以及邮件发送实例** **前言**



<img src="/img/spring.pdf-142-0.png">142-0


##### **一、基础配置** **1.1 引入依赖**

<img src="/img/spring.pdf-142-1.png">142-1
##### **这里使用的是maven集成的，引入starter的jar包**




##### **1.2 获取邮箱授权码**




##### **1.3 配置文件** **二、示例** **2.1 实体Bean**



<img src="/img/spring.pdf-142-3.png">142-3

<img src="/img/spring.pdf-142-4.png">142-4
<img src="/img/spring.pdf-143-0.png">143-0




##### **2.2 工具类**



<img src="/img/spring.pdf-143-1.png">143-1
<img src="/img/spring.pdf-144-0.png">144-0
##### **三、邮件服务的问题** **3.1 邮件发送失败** **3.2 邮件异步发送**



<img src="/img/spring.pdf-144-1.png">144-1

<img src="/img/spring.pdf-144-2.png">144-2



<img src="/img/spring.pdf-144-3.png">144-3
<img src="/img/spring.pdf-145-0.png">145-0
**SpringBootServletInitializer作用**


**笔记本：** spring


**创建时间：** 2021/11/16 18:02 **更新时间：** 2021/11/16 18:08


**作者：** 彼岸樱速

<img src="/img/spring.pdf-146-0.png">146-0

**1. springboot最基本的启动类模样**





这边的


@MapperScan ：
其实就是让接口变成实现类，然后加上@Mapper,


但是每个都要加就很麻烦，所以直接用@MapperScan 来表示要变成实现类的接口的所在的
包。


这个主要是搭载mybatis和mybatis plus等来使用，mapper注解一般来实现的是


类似：



<img src="/img/spring.pdf-146-1.png">146-1



<img src="/img/spring.pdf-146-2.png">146-2

**2. extends SpringBootServletInitializer 有什么用？**





springboot项目，若打包成war包，使用外置的tomcat启动


1、需要继承 org.springframework.boot.context.web.SpringBootServletInitializer类


2、然后重写configure(SpringApplicationBuilder application)方法
因为我们的项目是打成war包，然后部署到tomcat的~(还延续了mvc的方式)


3. implements CommandLineRunner 有什么用？
因为项目中有时候需要项目启动之后，执行某些功能。


所以简单的实现方案就是来进行实现


CommandLineRunner接口，实现功能的代码放在实现的run方法中


当然也可以写在一个model类里面，也可以写在启动类的里面。


比如：


# 如果有多个类实现CommandLineRunner接口，如何保证顺序

- SpringBoot在项目启动后会遍历所有实现CommandLineRunner的实体类并执行run方法，
如果需要按照一定的顺序去执行，那么就需要在实体类上使用一个@Order注解（或者实现
Order接口）来表明顺序


比如在类的上面加上@Order(value=2)


@Order 注解的执行优先级是按value值从小到大顺序。


PS:


String os = System.getProperty("os.name");
这样可以获得你当前操作系统的名字，比如我用的是win10 就可以获取到 Windows 10


我们的需求是启动了项目之后，根据环境修改一下对应的视频流脚本~


然后可以这样来重写一个run接口~


比如



<img src="/img/spring.pdf-147-0.png">147-0

<img src="/img/spring.pdf-147-1.png">147-1


**spring @Primary-在spring中的使用**


**笔记本：** spring


**创建时间：** 2021/11/9 10:15 **更新时间：** 2021/11/9 10:21


**作者：** 彼岸樱速



<img src="/img/spring.pdf-148-0.png">148-0



有如下一个接口





有下面的两个实现类:



<img src="/img/spring.pdf-148-2.png">148-2



<img src="/img/spring.pdf-148-3.png">148-3



下面就是注入上面的



<img src="/img/spring.pdf-148-4.png">148-4



输出结果：





原因很简单，就是 OperaSinger 这个类上面根本没有加上注解@Copmonent 或者 @Service,
所以spring 注入的时候，只能找到 MetalSinger 这个实现类. 所以才有这个结果。


但是如果一旦 OperaSinger 这个类加上了@Copmonent 或者 @Service 注解，有趣的事情就
会发生，你会发现一个错误的结果或异常:





提示很明确了，spring 根据类型无法选择到底注入哪一个。这个时候@Primay 可以闪亮登场
了。



<img src="/img/spring.pdf-148-7.png">148-7


<img src="/img/spring.pdf-149-0.png">149-0



如果代码改成这样，再次运行，结果如下：
“I am singing in Bocelli voice: song lyrics”， 用@Primary 告诉spring 在犹豫的时候优先
选择哪一个具体的实现。


二、用@Qualifier这个注解来解决问题


将上面的两个类改为如下:



<img src="/img/spring.pdf-149-1.png">149-1

<img src="/img/spring.pdf-149-2.png">149-2



<img src="/img/spring.pdf-149-3.png">149-3




**Spring注解常用汇总**


**笔记本：** spring


**创建时间：** 2021/11/9 10:11 **更新时间：** 2021/11/9 10:13


**作者：** 彼岸樱速



<img src="/img/spring.pdf-150-0.png">150-0


**spring中BeanFactory和FactoryBean的区别**


**笔记本：** spring


**创建时间：** 2021/11/2 23:28 **更新时间：** 2021/11/2 23:33


**作者：** 彼岸樱速

<img src="/img/spring.pdf-151-0.png">151-0

##### **spring中BeanFactory和FactoryBean的区别**





**1、 BeanFactory**


**BeanFactory定义了IOC容器的最基本形式，并提供了IOC容器应遵守的的最基本的接口，**
**也就是Spring IOC所遵守的最底层和最基本的编程规范。在Spring代码中，BeanFactory只是**
**个接口，并不是IOC容器的具体实现，但是Spring容器给出了很多种实现，如**
**DefaultListableBeanFactory、XmlBeanFactory、ApplicationContext等，都是附加了某**
**种功能的实现。**


**Java代码**



<img src="/img/spring.pdf-151-1.png">151-1



**2、FactoryBean**
**一般情况下，Spring通过反射机制利用`<`bean`>`的class属性指定实现类实例化Bean，在某些**
**情况下，实例化Bean过程比较复杂，如果按照传统的方式，则需要在`<`bean`>`中提供大量的配**
**置信息。配置方式的灵活性是受限的，这时采用编码的方式可能会得到一个简单的方案。**
**Spring为此提供了一个org.springframework.bean.factory.FactoryBean的工厂类接口，**
**用户可以通过实现该接口定制实例化Bean的逻辑。**
**FactoryBean接口对于Spring框架来说占用重要的地位，Spring自身就提供了70多个**
**FactoryBean的实现。它们隐藏了实例化一些复杂Bean的细节，给上层应用带来了便利。从**
**Spring3.0开始，FactoryBean开始支持泛型，即接口声明改为FactoryBean`<`T`>`的形式**


**Java代码**



<img src="/img/spring.pdf-151-2.png">151-2



**在该接口中还定义了以下3个方法：**
**T getObject()：返回由FactoryBean创建的Bean实例，如果isSingleton()返回true，则该实**
**例会放到Spring容器中单实例缓存池中；**


**boolean isSingleton()：返回由FactoryBean创建的Bean实例的作用域是singleton还是**
**prototype；**
**Class`<`T`>` getObjectType()：返回FactoryBean创建的Bean类型。**
**当配置文件中`<`bean`>`的class属性配置的实现类是FactoryBean时，通过getBean()方法返回**
**的不是FactoryBean本身，而是FactoryBean#getObject()方法所返回的对象，相当于**
**FactoryBean#getObject()代理了getBean()方法。**
**例：如果使用传统方式配置下面Car的`<`bean`>`时，Car的每个属性分别对应一个`<`property`>`**
**元素标签。**


**Java代码**



<img src="/img/spring.pdf-152-0.png">152-0



**如果用FactoryBean的方式实现就灵活点，下例通过逗号分割符的方式一次性的为Car的所**
**有属性指定配置值：**


**Java代码**



<img src="/img/spring.pdf-152-1.png">152-1


**// 接受逗号分割符设置属性信息**
**public  void setCarInfo ( String carInfo )  {**
**this . carInfo = carInfo;**
**}**
**}**


**有了这个CarFactoryBean后，就可以在配置文件中使用下面这种自定义的配置方式配置**
**CarBean了：**





**当调用getBean("car")时，Spring通过反射机制发现CarFactoryBean实现了FactoryBean的**
**接口，这时Spring容器就调用接口方法CarFactoryBean#getObject()方法返回。如果希望获**
**取CarFactoryBean的实例，则需要在使用getBean(beanName)方法时在beanName前显示**
**的加上"&"前缀：如getBean("&car");**
**3、区别**
**BeanFactory是个Factory，也就是IOC容器或对象工厂，FactoryBean是个Bean。在Spring**
**中，所有的Bean都是由BeanFactory(也就是IOC容器)来进行管理的。但对FactoryBean而**
**言，这个Bean不是简单的Bean，而是一个能生产或者修饰对象生成的工厂Bean,它的实现与设**
**计模式中的工厂模式和修饰器模式类似。**


**Spring MVC的工作原理**


**笔记本：** spring


**创建时间：** 2021/11/2 20:53 **更新时间：** 2021/11/2 20:56


**作者：** 彼岸樱速


流程说明：



<img src="/img/spring.pdf-154-0.png">154-0

<img src="/img/spring.pdf-154-1.png">154-1


**Spring框架中用到了哪些设计模式**


**笔记本：** spring


**创建时间：** 2021/11/2 20:52 **更新时间：** 2021/11/2 20:52


**作者：** 彼岸樱速


1.工厂设计模式：Spring使用工厂模式通过BeanFactory和ApplicationContext创建bean对象。


2.代理设计模式：Spring AOP功能的实现。


3.单例设计模式：Spring中的bean默认都是单例的。







6.观察者模式：Spring事件驱动模型就是观察者模式很经典的一个应用。




**springboot 读取 yml 配置的几种方式**


**笔记本：** spring


**创建时间：** 2021/10/19 17:00 **更新时间：** 2021/10/19 17:06


**作者：** 彼岸樱速


**前言**


在springboot 项目中一般默认的配置文件是application.properties,


但是实际项目中我们一般会使用application.yml 文件,下面就介绍一下在springboot 中读取 yml 配置的几种
方式.





yml文件的好处，天然的树状结构，一目了然，实质上跟properties是差不多的。
不支持tab缩进
可以使用 "-小写字母" 或 "_小写字母"来 代替 "大写字母",如 userName 与 user-name,user_name 含
义是一样的
key: value 格式书写
key 后面跟着冒号,再后面跟着一个空格,然后是值


**几种数据格式的表示方式**


1.普通的值（数字，字符串，布尔）
2.对象、Map (属性和值) (键值对)
3.数组 (List、Set)


**普通的值（数字，字符串，布尔）**


直接就是 key: value,如:





注:


字符串默认不用加上单引号或者双引号；


`""` ：双引号；不会转义字符串里面的特殊字符；特殊字符会作为本身想表示的意思


`name:` `"zhangsan /n lisi"` ：输出； `zhangsan` 换行 `lisi`

`''` ：单引号；会转义特殊字符，特殊字符最终只是一个普通的字符串数据


`name: ‘zhangsan /n lisi’` ：输出； `zhangsan /n lisi`


**对象、Map（属性和值）（键值对）**


对象还是k: v的方式


k: v：在下一行来写对象的属性和值的关系；注意缩进(不支持tab,使用空格),如:

```
person:

age: 18

name: mysgk

```

**数组（List、Set）**


用- 值表示数组中的一个元素,如:



<img src="/img/spring.pdf-156-2.png">156-2





如果我们只需要配置文件中的一两个值, **@Value** 是最简单方便的方式.

```
server:

port: 8081

```

我们在代码中可以这样取值


注:此处的prot 所在的类需要是一个组件,如果是实体类需要加上 **@Component**




```
student:

age: 18

name: mysgk

```

javabean:

```
@Component

@ConfigurationProperties(prefix = "student")

public class Student {

private String name;

private Integer age;

public String getName() {

return name;

}

public void setName(String name) {

this.name = name;

}

public Integer getAge() {

return age;

}

public void setAge(Integer age) {

this.age = age;

}

@Override

public String toString() {

return "Student{" +

"name='" + name + '/'' +

", age=" + age +

'}';

}

}

```

使用 **@ConfigurationProperties**,需要配置一个prefix (前缀) 参数, 即写上 key 就可以了.





这种方法好像用的比较少,基本没用过...

```
test:

msg: aaa

```

代码:

```
@Autowired

private Environment env

@RequestMapping(value = "index2", method = RequestMethod.GET)

public String index2() {

```

```
System.out.println(env.getProperty("test.msg"));

return "The Way 2 : "+ env.getProperty("test.msg");

}

}

```


<img src="/img/spring.pdf-158-0.png">158-0
**@ControllerAdvice实现优雅地处理异常**


**笔记本：** spring


**创建时间：** 2021/10/19 16:48 **更新时间：** 2021/10/19 16:57


**作者：** 彼岸樱速


**@ControllerAdvice** ，是Spring3.2提供的新注解,它是一个Controller增强器，
可对controller中被 @RequestMapping注解的方法加一些逻辑处理。最常用的就是异常处理


统一异常处理
需要配合@ExceptionHandler使用。
当将异常抛到controller时,可以对异常进行统一处理,规定返回的json格式或是跳转到一个错误
页面


如果返回报文是json，不想像下面写的@ResponseBody，可以用 **@RestControllerAdvice**



<img src="/img/spring.pdf-159-0.png">159-0

<img src="/img/spring.pdf-159-1.png">159-1





分别访问testException和testMyException接口,可得到以下结果





如果不需要返回json数据，而要渲染某个页面模板返回给浏览器，那么可以这么实现：



<img src="/img/spring.pdf-159-3.png">159-3


<img src="/img/spring.pdf-160-0.png">160-0


##### **@ControllerAdvice 注解的三种使用场景**

@ControllerAdvice ，很多初学者可能都没有听说过这个注解，实际上，这是一个非常有用的注解，顾名思
义，这是一个增强的 Controller。使用这个 Controller ，可以实现三个方面的功能：


1. 全局异常处理
2. 全局数据绑定
3. 全局数据预处理


灵活使用这三个功能，可以帮助我们简化很多工作，需要注意的是，这是 SpringMVC 提供的功能，在
Spring Boot 中可以直接使用，下面分别来看。

##### **全局异常处理**


使用 @ControllerAdvice 实现全局异常处理，只需要定义类，添加该注解即可定义方式如下：

```
@ControllerAdvice

public class MyGlobalExceptionHandler {

@ExceptionHandler(Exception.class)

public ModelAndView customException(Exception e) {

ModelAndView mv = new ModelAndView();

mv.addObject("message", e.getMessage());

mv.setViewName("myerror");

return mv;

}

}

```

在该类中，可以定义多个方法，不同的方法处理不同的异常，例如专门处理空指针的方法、专门处理数组越界
的方法...，也可以直接向上面代码一样，在一个方法中处理所有的异常信息。


@ExceptionHandler 注解用来指明异常的处理类型，即如果这里指定为 NullpointerException，则数组越
界异常就不会进到这个方法中来。

##### **全局数据绑定**


全局数据绑定功能可以用来做一些初始化的数据操作，我们可以将一些公共的数据定义在添加了
@ControllerAdvice 注解的类中，这样，在每一个 Controller 的接口中，就都能够访问导致这些数据。


使用步骤，首先定义全局数据，如下：

```
@ControllerAdvice

public class MyGlobalExceptionHandler {

@ModelAttribute(name = "md")

public Map<String,Object> mydata() {

HashMap<String, Object> map = new HashMap<>();

map.put("age", 99);

```

**`map.put("gender",`** **`"`** **男** **`");`**

```
return map;

}

}

```

使用 @ModelAttribute 注解标记该方法的返回数据是一个全局数据，默认情况下，这个全局数据的 key 就
是返回的变量名，value 就是方法返回值，当然开发者可以通过 @ModelAttribute 注解的 name 属性去重
新指定 key。


定义完成后，在任何一个Controller 的接口中，都可以获取到这里定义的数据：


```
@RestController

public class HelloController {

@GetMapping("/hello")

public String hello(Model model) {

Map<String, Object> map = model.asMap();

System.out.println(map);

int i = 1 / 0;

return "hello controller advice";

}

}

##### **全局数据预处理**

```

考虑我有两个实体类，Book 和 Author，分别定义如下：

```
public class Book {

private String name;

private Long price;

//getter/setter

}

public class Author {

private String name;

private Integer age;

//getter/setter

}

```

此时，如果我定义一个数据添加接口，如下：

```
@PostMapping("/book")

public void addBook(Book book, Author author) {

System.out.println(book);

System.out.println(author);

}

```

这个时候，添加操作就会有问题，因为两个实体类都有一个 name 属性，从前端传递时 ，无法区分。此时，
通过 @ControllerAdvice 的全局数据预处理可以解决这个问题


解决步骤如下:


1.给接口中的变量取别名

```
@PostMapping("/book")

public void addBook(@ModelAttribute("b") Book book, @ModelAttribute("a")

Author author) {

System.out.println(book);

System.out.println(author);

}

```

2.进行请求数据预处理


在 @ControllerAdvice 标记的类中添加如下代码:

```
@InitBinder("b")public void b(WebDataBinder binder) {

binder.setFieldDefaultPrefix("b.");

}

@InitBinder("a")public void a(WebDataBinder binder) {

binder.setFieldDefaultPrefix("a.");

}

```

@InitBinder("b") 注解表示该方法用来处理和Book和相关的参数,在方法中,给参数添加一个 b 前缀,即请求参
数要有b前缀.


3.发送请求


请求发送时,通过给不同对象的参数添加不同的前缀,可以实现参数的区分.



<img src="/img/spring.pdf-162-0.png">162-0
**post和put的区别**


**笔记本：** spring


**创建时间：** 2021/10/19 16:19 **更新时间：** 2021/10/19 16:35


**作者：** 彼岸樱速


**post和put的本质区别详解！！！**


一般在浏览器中输入网址访问资源都是通过GET方式；在FORM提交中，可以通过Method指定提交方
式为GET或者POST，默认为GET提交。


**Http定义了与服务器交互的不同方法，最基本的方法有4种，分别是GET，POST，PUT，DELETE**


URL全称是资源描述符，我们可以这样认 为：一个URL地址，它用于描述一个网络上的资源，而HTTP
中的GET，POST，PUT，DELETE就对应着对这个资源的查 ，改 ，增 ，删 4个操作。到这里，大家应
该有个大概的了解了，GET一般用于获取/查询 资源信息，而POST一般用于更新 资源信息(个人认为这
是GET和POST的本质区别，也是协议设计者的本意，其它区别都是具体表现形式的差异 )。


**根据HTTP规范，GET用于信息获取，而且应该是安全的和幂等的 。**


1.所谓安全的意味着该操作用于获取信息而非修改信息。换句话说，GET请求一般不应产生副作
用。就是说，它仅仅是获取资源信息，就像数据库查询一样，不会修改，增加数据，不会影响资源的
状态。


- 注意：这里安全的含义仅仅是指是非修改信息。


2.幂等的意味着对同一URL的多个请求应该返回同样的结果。这里我再解释一下幂等 这个概念：


幂等 （idempotent、idempotence）是一个数学或计算机学概念，常见于抽象代数中。


**幂等有以下几种定义：**


对于单目运算，如果一个运算对于在范围内的所有的一个数多次进行该运算所得的结果和进行一
次该运算所得的结果是一样的，那么我们就称该运算是幂等的。比如绝对值运算就是一个例子，在实
数集中，有abs(a) =abs(abs(a)) 。


对于双目运算，则要求当参与运算的两个值是等值的情况下，如果满足运算结果与参与运算的两
个值相等，则称该运算幂等，如求两个数的最大值的函数，有在在实数集中幂等，即max(x,x) = x 。


**看完上述解释后，应该可以理解GET幂等的含义了。**


但在实际应用中，以上2条规定并没有这么严格。引用别人文章的例子：比如，新闻站点的头版不
断更新。虽然第二次请求会返回不同的一批新闻，该操 作仍然被认为是安全的和幂等的，因为它总是
返回当前的新闻。从根本上说，如果目标是当用户打开一个链接时，他可以确信从自身的角度来看没
有改变资源即可。


根据HTTP规范，POST表示可能修改变服务器上的资源的请求 。继续引用上面的例子：还是新闻
以网站为例，读者对新闻发表自己的评论应该通过POST实现，因为在评论提交后站点的资源已经不同
了，或者说资源被修改了。


**上面大概说了一下HTTP规范中，GET和POST的一些原理性的问题。但在实际的做的时候，很多**
**人却没有按照HTTP规范去做，导致这个问题的原因有很多，比如说：**


1.很多人贪方便，更新资源时用了GET，因为用POST必须要到FORM（表单），这样会麻烦一
点。


2.对资源的增，删，改，查操作，其实都可以通过GET/POST完成，不需要用到PUT和DELETE。


3.另外一个是，早期的但是Web MVC框架设计者们并没有有意识地将URL当作抽象的资源来看待
和设计 。还有一个较为严重的问题是传统的Web MVC框架基本上都只支持GET和POST两种HTTP方
法，而不支持PUT和DELETE方法。


- 简单解释一下MVC：MVC本来是存在于Desktop程序中的，M是指数据模型，V是指用户界
面，C则是控制器。使用MVC的目的是将M和V的实现代码分离，从而使同一个程序可以使用不同的表
现形式。


**以上3点典型地描述了老一套的风格（没有严格遵守HTTP规范），随着架构的发展，**


**现在出现REST(Representational State Transfer)，一套支持HTTP规范的新风格，这**


**里不多说了，可以参考《RESTful Web Services》。**


**http方法有哪些？get、post、put、delete，为什么一般只用**
**过get和post？什么时候用put、delete，为什么没用过**


get请求：参数在url后，如：


post请求：参数在请求体中。


put和delete呢？是什么，为什么没用过呢？



<img src="/img/spring.pdf-164-0.png">164-0

<img src="/img/spring.pdf-164-1.png">164-1
<img src="/img/spring.pdf-165-0.png">165-0

<img src="/img/spring.pdf-165-1.png">165-1

这篇文章很好的解释了put和delete是什么，有什么用，为什么没用过。


[https://www.v2ex.com/t/373770](https://www.v2ex.com/t/373770)


<img src="/img/spring.pdf-166-0.png">166-0
<img src="/img/spring.pdf-167-0.png">167-0
**Spring的注解@Qualifier用法**


**笔记本：** spring


**创建时间：** 2021/10/19 1:43 **更新时间：** 2021/10/19 1:47


**作者：** 彼岸樱速


**Spring的注解@Qualifier用法**

在Controller中需要注入service那么我的这个server有两个实现类如何区分开这两个impl呢？
根据注入资源的注解不同实现的方式有一点小小的区别


下面上铺垫图


请忽略我的红线


##在Controller中使用 @Autowired注入时


**Qualifier的意思是合格者** ，通过这个标示，表明了哪个实现类才是我们所需要的，添加
@Qualifier注解，需要注意的是@Qualifier的参数名称为我们之前定义@Service注解的名称之

一。


**##使用@Resource注入时**


使用@resource注入时比较简单了注解自带了“name”的val就是@Service注解的名称之一。



<img src="/img/spring.pdf-168-0.png">168-0

<img src="/img/spring.pdf-168-1.png">168-1
**Spring AOP 中那些让人发狂的专业术语**


**笔记本：** spring


**创建时间：** 2021/10/19 0:17 **更新时间：** 2021/10/19 1:34


**作者：** 彼岸樱速



<img src="/img/spring.pdf-169-0.png">169-0



<img src="/img/spring.pdf-169-1.png">169-1

**AOP 相关术语分析**



<img src="/img/spring.pdf-169-2.png">169-2



连接点与切入点定义如图-4所示：


<img src="/img/spring.pdf-170-0.png">170-0

说明：我们可以简单的将机场的一个安检口理解为连接点，多个安检口为切入点，安全检查过程
看成是通知。总之，概念很晦涩难懂，多做例子，做完就会清晰。先可以按白话去理解。


**AOP实现步骤**


公式：AOP=（切面）=通知方法（5种）+ 切入点表达式（4种）


**通知方法**


**切入点表达式**



<img src="/img/spring.pdf-170-1.png">170-1

<img src="/img/spring.pdf-170-2.png">170-2



**例子**



<img src="/img/spring.pdf-170-3.png">170-3
```
@Pointcut("execution(* com.wyy.transactional.controller.*.*(..))")
private void webLog(){}

/**
```

_**`*`**_ **请求前通知**
_**`*`**_ _**`@Before(value`**_ _**`= "webLog()")`**_ **这个注解的作用是** _**`:`**_ **在切点** _**`webLog()`**_ **前执行方法** _**`,`**_ **内容为指定的切点**
_**`* JoinPoint`**_ **切入点对象** _**`,`**_ **因为** _**`Spring`**_ **只支持方法类型的连接点，所以在** _**`Spring`**_ **中连接点指的就是被拦截到的方法，实**
**际上连接点还可以是字段或者构造器**
```
*/
@Around(value = "webLog()")
public Object methodAround( ProceedingJoinPoint joinPoint) throws Throwable{
ServletRequestAttributes requestAttributes = (ServletRequestAttributes)
RequestContextHolder. getRequestAttributes ();
HttpServletRequest request = requestAttributes.getRequest();

MethodSignature joinPointObject = ( MethodSignature ) joinPoint.getSignature();
```

_**`//`**_ **获得请求的方法**
```
Method method = joinPointObject.getMethod();
```

_**`//`**_ **如果方法上有** _**`Logs`**_ **这个注解** _**`,`**_ **则记录这个方法的调用日志**
```
if(hasAnnotationOnMethod(method, Logs.class)){
```

_**`//`**_ **打印请求内容**
_**`log`**_ **`.info("==============`** **请求前内容** **`=============");`**
_**`log`**_ **`.info("`** **请求地址** **`:" + request.getRequestURI().toString());`**
_**`log`**_ **`.info("`** **请求方式** **`" + request.getMethod());`**
_**`log`**_ **`.info("`** **请求类方法** **`" + joinPoint.getSignature());`**
_**`log`**_ **`.info("`** **请求类方法参数** **`" + Arrays.`** _**`toString`**_ **`(joinPoint.getArgs()));`**
_**`log`**_ **`.info("==============`** **请求前内容** **`==============");`**
```
}

try {

```

_**`log`**_ **`.info("------------`** **正常返回内容** **`--------------");`**
_**`log`**_ **`.info("Response`** **内容** **`:" + joinPoint.proceed().toString());`**
_**`log`**_ **`.info("------------`** **正常返回内容** **`--------------");`**

```
} catch (Exception e) {
```

_**`log`**_ **`.info("*************`** **异常返回内容** **`*************");`**
_**`log`**_ **`.info("`** **业务异常** **`: "+e.getMessage());`**
_**`log`**_ **`.info("*************`** **异常返回内容** **`*************");`**
```
}

```

_**`log`**_ **`.info("++++++++++++`** **发不发生异常都返回** **`++++++++++++");`**
_**`log`**_ **`.info("`** **不管业务有没有发生异常** **`,`** **都执行** **`");`**
_**`log`**_ **`.info("++++++++++++`** **发不发生异常都返回** **`++++++++++++");`**

```
return joinPoint.proceed();
}

/**
```

_**`*`**_ **请求前通知**
_**`*`**_ _**`@Before(value`**_ _**`= "webLog()")`**_ **这个注解的作用是** _**`:`**_ **在切点** _**`webLog()`**_ **前执行方法** _**`,`**_ **内容为指定的切点**
_**`* JoinPoint`**_ **切入点对象** _**`,`**_ **因为** _**`Spring`**_ **只支持方法类型的连接点，**
_**`*`**_ **所以在** _**`Spring`**_ **中连接点指的就是被拦截到的方法，**
_**`*`**_ **实际上连接点还可以是字段或者构造器**
```
*/
@Before(value = "webLog()")
public void methodBefore( JoinPoint joinPoint) {
ServletRequestAttributes requestAttributes = (ServletRequestAttributes)
RequestContextHolder. getRequestAttributes ();
HttpServletRequest request = requestAttributes.getRequest();

MethodSignature joinPointObject = ( MethodSignature ) joinPoint.getSignature();
```

_**`//`**_ **获得请求的方法**
```
Method method = joinPointObject.getMethod();

```

_**`//`**_ **如果方法上有** _**`Logs`**_ **这个注解** _**`,`**_ **则记录这个方法的调用日志**
```
if(hasAnnotationOnMethod(method, Logs.class)){
```

_**`//`**_ **打印请求内容**
_**`log`**_ **`.info("================`** **请求内容** **`===============");`**
_**`log`**_ **`.info("`** **请求地址** **`:" + request.getRequestURI().toString());`**
_**`log`**_ **`.info("`** **请求方式** **`" + request.getMethod());`**
_**`log`**_ **`.info("`** **请求类方法** **`" + joinPoint.getSignature());`**
_**`log`**_ **`.info("`** **请求类方法参数** **`" + Arrays.`** _**`toString`**_ **`(joinPoint.getArgs()));`**
_**`log`**_ **`.info("================`** **请求内容** **`================");`**
```
}
}

/**
```

_**`*`**_ **业务正常执行完后通知**
```
* @AfterReturning(returning = "o", pointcut = "webLog()")
```

_**`*`**_ **这个注解的作用是** _**`:`**_ **在切入点** _**`,return`**_ **后执行** _**`,`**_
_**`*`**_ **如果想对某些方法的返回参数进行处理** _**`,`**_ **可以在这操作**
```
*/
@AfterReturning(returning = "o", pointcut = "webLog()")
public void methodAfterReturing( JoinPoint joinPoint,Object o) {
```

_**`log`**_ **`.info("------------`** **正常返回内容** **`--------------");`**


<img src="/img/spring.pdf-172-0.png">172-0





**然后要调用的接口上面加上@Logs注解**


发请求，打印结果如下



<img src="/img/spring.pdf-172-2.png">172-2
**NESTED和REQUIRED的区别**


**笔记本：** spring


**创建时间：** 2021/10/14 19:43 **更新时间：** 2021/10/14 20:52


**作者：** 彼岸樱速


经过我之前的实践，可以看出 NESTED事务申明在调用者上会新建一个独立事务。申明在被调


用者上，若调用者存在事务则加入调用者事务。调用者不存在事务则新建一个独立事务。


这个功能好像和spring默认的事务传播行为REQUIRED一样的？


不，它的功能可是比REQUIRED要强大！


我来通过实验证明NESTED和REQUIRED的区别


首先，InsertUsers和InsertCuser方法上都申明了REQUIRED，让他们属于同一个事务。


将引发异常的语句 int i = 1/0; 放到 InsertCuser方法里



<img src="/img/spring.pdf-173-0.png">173-0











<img src="/img/spring.pdf-173-1.png">173-1





<img src="/img/spring.pdf-173-2.png">173-2
```
 程序运行，结果是InsertCuser中出现异常，导致事务回滚、users表和cuser表均无数据插入。由于两个

```


<img src="/img/spring.pdf-173-3.png">173-3




<img src="/img/spring.pdf-174-0.png">174-0



<img src="/img/spring.pdf-174-1.png">174-1











<img src="/img/spring.pdf-174-3.png">174-3



<img src="/img/spring.pdf-174-5.png">174-5



`这就是` **`NESTED`** 嵌套事务 `的奥秘之处-----它能` 让事务部分回滚



<img src="/img/spring.pdf-174-7.png">174-7






这段话中提到的 savepoint 其实是mysql的innodb引擎的特性，为了去了解它我在mysql客户端


对它进行了简单使用，可以看看这篇文章https://www.jianshu.com/p/c93c1730e5dc 。 总之它就


是一个保存点，生成一个保存点就是生成一个数据镜像。然后无论经过了什么sql操作，只要使


用回滚至此保存点的命令即可恢复至创建保存点的数据状态。


那么上面代码的演示结果也就说的通了。即使InsertUsers和InsertCuser方法属于同一个事务，


被NESTED嵌套事务申明的InsertCuser方法出现异常也没导致REQUIRED申明的InsertUsers的


全部回滚，只是部分回滚到了调用InsertCuser方法之前。因为在调用InsertCuser方法时会自动


生成一个savepoint


InsertUsers方法里出现异常会导致InsertCuser方法嵌套事务回滚吗？


将出现异常的代码行放到这里，结果都回滚了，毕竟是同一个事务


总结下NESTED的回滚特性


主事务和嵌套事务属于同一个事务


嵌套事务出错回滚不会影响到主事务


主事务回滚会将嵌套事务一起回滚了



<img src="/img/spring.pdf-175-1.png">175-1
**readOnly只读事务**


**笔记本：** spring


**创建时间：** 2021/10/14 18:25 **更新时间：** 2021/10/14 18:27


**作者：** 彼岸樱速


事务是什么？事务是一个原子操作，由一系列动作组成。事务的原子性确保动作要么全部完成，要么
完全不起作用。


下面来看一个项目中遇到的问题：


有这么一个需求，我们要查询一些数据，但是在查询这个数据之前我们要往查询的表中插入一些数
据，虽然这个需求有点愚蠢，但是难不到我们。


上面的代码看上去很完美也很简洁，但是经过测试发现查询出来的数据并没有把插入的数据一并查出
来。那么问题到底出在哪里呢？难道是事务管理哪里出问题了？


事务又会分为 “ **读写事务** ”和“ **只读事务** ”，“只读事务”并不是一个强制选项，它只是一个“暗示”，提示数
据库驱动程序和数据库系统，这个事务并不包含更改数据的操作，那么JDBC驱动程序和数据库就有可
能根据这种情况对该事务进行一些特定的优化，比方说不安排相应的数据库锁，以减轻事务对数据库
的压力，毕竟事务也是要消耗数据库的资源的。Oracle默认情况下是没有事务控制的，即只能查询出
语句执行前状态的数据，那么如果当你在做报表查询，两次查询结果可能会不一致。这个时候就可以
用到只读事务。如果两条查询语句被一个只读事务包围，则两条查询结构就能保证一致性。也就是说
只读事务开启期间数据库的变化是不会被查询出来。


说了这么多，跟上面的问题有什么关系呢，我的查询又没有开启只读事务？其实Spring事务控制是包
含注解控制和xml配置控制。在通过各种方法查询，最后在核心层项目中找到了这么一段配置。


也就是说我们的query*方法被配置为只读事务，并且insert操作是发生在事务开启之后，所以导致查询
不出插入的数据。


但是如果我一定要这么操作怎么办呢？也有办法，我们可以在queryStudent 方法前面 通过
@Transactional(readOnly = false)来改变该方法的事务控制。并且建议将 insertStudent方法放到其他
的bean中。因为调用同一个类中事务控制方法，会导致该事务失效。具体可以参考这篇文章



<img src="/img/spring.pdf-176-0.png">176-0

<img src="/img/spring.pdf-176-1.png">176-1
**NESTED和REQUIRES_NEW的区别**


**笔记本：** spring


**创建时间：** 2021/10/14 17:19 **更新时间：** 2021/10/14 17:25


**作者：** 彼岸樱速


今天在看Spring事务的处理，注意到了传播级别这个参数，一共是以下几个值



<img src="/img/spring.pdf-177-0.png">177-0



**REQUIRES_NEW和NESTED的区别**


先看如下代码



<img src="/img/spring.pdf-177-1.png">177-1



不论使用REQUIRES_NEW或是NESTED，在调用B的invoke时如果发生异常，都能正确完成业
务逻辑


REQUIRES_NEW执行到B时，A事物被挂起，B会新开了一个事务进行执行，B发生异常
后，B中的修改都会回滚，然后外部事物继续执行
NESTED执行到B时，会创建一个savePoint，如果B中执行失败，会将数据回滚到这个
savePoint


重点来了，如果B处正常执行，就会产生区别了


REQUIRES_NEW如果B正常执行，则B中的数据在A提交之前已经完成提交，其他线程已
经可见其修改，这就意味着可能有脏数据的产生；同时，如果接下来A的其他逻辑发生了
异常，A回滚，但是B已经完成提交，不会回滚了。当然，如果A接下来的逻辑没有相关要
求，那就无所谓了,


NESTED如果B正常执行，此时B中的修改并不会立即提交，而是在A提交时一并提交，如
果A下面的逻辑中发生异常，A回滚时，B中的修改也会回滚，就可以避免上述情况的发生


**@Autowired 不是自动装配**


**笔记本：** spring


**创建时间：** 2021/10/13 23:13 **更新时间：** 2021/10/13 23:29


**作者：** 彼岸樱速


证明 **@Autowired 不是自动装配**
记得上一篇博客 Spring源码系列 - 依赖注入（Dependency Injection），我有说
@Autowired 不属于自动装配的范畴，只属于手动装配，有同学表示不可理解，毁三观，再此
我会用代码来证明，Talk is cheap, show me the code

<img src="/img/spring.pdf-178-0.png">178-0


上代码前，我们先看一段 Spring 官方给出的 bean 定义：



<img src="/img/spring.pdf-178-1.png">178-1



<img src="/img/spring.pdf-178-2.png">178-2

那现在我们就知道了，每一个 Spring Bean 都有一个 Autowiring 字段，用来表示该 Bean 的
装配模式


现在我们先来看代码，下面这段代码先注释掉了 **@Autowired** 注解，我们先看看这个 Bean 的
装配模式是什么？



<img src="/img/spring.pdf-178-3.png">178-3

<img src="/img/spring.pdf-178-4.png">178-4


```
 }

```

运行结果如下：


我们可以看出来 Bean 的定义中，AutowireMode = 0，表示没有任何装配，而且 userService
= null


现在我们将 @Autowired 的注解去掉，继续执行，如果 AutowireMode != 0，表示采用了其
他装配模式，我们来验证一下



<img src="/img/spring.pdf-179-0.png">179-0

<img src="/img/spring.pdf-179-1.png">179-1



运行结果如下：


我们可以清晰的看出 **AutowireMode = 0，依然没有用任何装配模型** ，所以我们可以总结如
下：


**@Autowired 属于手动装配** ，具体可以参考Spring源码系列 - 依赖注入（Dependency
Injection）
自动装配仅仅在 XML 模式下存在，注解模式下，并不存在自动装配一说
那么真的是这样么？精彩的在下面
我们思考一下，我们可以拿到 Bean 中的 AutowireMode 值，那么我们是否可以改变这个值
呢？
如果改变了整个值，那么是不是就实现了 @Autowired 自动装配呢？


继续试验…



<img src="/img/spring.pdf-179-2.png">179-2

<img src="/img/spring.pdf-179-3.png">179-3


同时我们再次注释掉了 @Autowired 注解，增加了 setUserService 方法，因为我们知道无论
是按名称还是按类型注入，都是利用 setter 方式来实现的



<img src="/img/spring.pdf-180-0.png">180-0



运行结果如下：


OK，在此我们就实现了 Autowired 按类型自动注入


**所以我们再次总结一下本文观点** ：



<img src="/img/spring.pdf-180-1.png">180-1

<img src="/img/spring.pdf-180-2.png">180-2



**@Autowired 注解（手动装配）**



<img src="/img/spring.pdf-180-3.png">180-3



**@Autowired 也是一种特殊的注入模型，整合了byType 和 byName**


**springboot是怎么实现自动装配的？**


**笔记本：** spring


**创建时间：** 2021/10/13 19:27 **更新时间：** 2021/10/13 23:06


**作者：** 彼岸樱速


**一、了解注解@SpringBootApplication**
**注解源码** :

```
@Target(ElementType. TYPE )
@Retention(RetentionPolicy. RUNTIME )
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration

@ComponentScan(excludeFilters = {

@Filter(type = FilterType. CUSTOM, classes = TypeExcludeFilter.class),

@Filter(type = FilterType. CUSTOM, classes = AutoConfigurationExcludeFilter.class) })

public @interface SpringBootApplication {

...

```

1. **@SpringBootConfiguration**
源码

```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration

public @interface SpringBootConfiguration {
}

```

发现其实就是一个 **@Configuration** 注解，作用就是将配置了这个注解的类加载到ioc容器。主
要是 **为了替换掉xml配置文件** 。


2. **@ComponentScan**
这个注解是大家接触得最多的了，相当于xml配置文件中的 **<context:component-scan>** 。它
的主要作用就是扫描指定路径下的标识了需要装配的类，自动装配到spring的Ioc容器中。


标识需要装配的类的形式主要是： **@Component、@Repository、@Service、**
**@Controller** 这类的注解标识的类。
ComponentScan默认会扫描当前package下的的所有加了相关注解标识的类到IoC容器中


3. **@EnableAutoConfiguration**
仍然是在spring3.1版本中，提供了一系列的@Enable开头的注解，Enable主机应该是在
JavaConfig框架上更进一步的完善，是的用户在使用spring相关的框架是，避免配置大量的代
码从而降低使用的难度比如常见的一些Enable注解：@EnableWebMvc，（这个注解引入了
MVC框架在Spring 应用中需要用到的所有bean）；比如@EnableScheduling，开启计划任务
的支持


<img src="/img/spring.pdf-182-0.png">182-0

找到 **EnableAutoConfiguration** ，我们可以看到每一个涉及到Enable开头的注解，都会带有
一个 **@Import** 的注解。

```
@Target(ElementType. TYPE )
@Retention(RetentionPolicy. RUNTIME )
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)

public @interface EnableAutoConfiguration {

```

**@Import**
这个注解相当于xml 格式下的<import resource/>
import就是把多个配置合并在一个配置中。在JavaConfig中所表达的意义是一样的。


我们用Import注解将bean进行注入
1基于普通bean或者带有@Configuration的bean进行注入
比如这个时候@Import(AutoConfigurationImportSelector.class)
AutoConfigurationImportSelector 就会被ico管理。
2. **实现ImportSelector接口** 进行动态注入

```
public interface ImportSelector {
String[] selectImports(AnnotationMetadata var1);
}
```

返回值是一个字符串的数组，这个数组会将里面的字符串加载到ioc容器当中，这个字符串必须
就是类的的全限定名


3.实现ImportBeanDefinitionRegistrar接口进行动态注入


这个上面的类似，感兴趣的可以去了解下。


我们回来过来继续看AutoConfigurationImportSelector 中有个selectImports 方法。
我们不是将那些需要自动装备的类的名称找到并返回不就好了吗？

```
@Override
public String[] selectImports( AnnotationMetadata annotationMetadata) {
if (!isEnabled(annotationMetadata)) {
return NO_IMPORTS ;
}
AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader
. loadMetadata (this.beanClassLoader);
AnnotationAttributes attributes = getAttributes(annotationMetadata);
List <String> configurations = getCandidateConfigurations(annotationMetadata,
attributes);
configurations = removeDuplicates(configurations);
Set <String> exclusions = getExclusions(annotationMetadata, attributes);
checkExcludedClasses(configurations, exclusions);
configurations.removeAll(exclusions);

```

```
configurations = filter(configurations, autoConfigurationMetadata);
fireAutoConfigurationImportEvents(configurations, exclusions);
return StringUtils. toStringArray (configurations);
}

```

这个方法返回了configurations，这个configurations 我们猜想就是那些 **需要自动装备的类** ，
我们跟下configurations 是怎么来的

```
List <String> configurations = getCandidateConfigurations(annotationMetadata,
attributes);

```

点进去

```
protected List <String> getCandidateConfigurations( AnnotationMetadata metadata,
AnnotationAttributes attributes) {
List <String> configurations = SpringFactoriesLoader. loadFactoryNames (
getSpringFactoriesLoaderFactoryClass(), getBeanClassLoader());
Assert. notEmpty (configurations,
"No auto configuration classes found in META-INF/spring.factories. If you "
+ "are using a custom packaging, make sure that file is correct.");
return configurations;
}

```

我们发现是由一个 **SpringFactoriesLoader** 的类加载到的，继续点进去，最终发下了一行这样
带代码


它会去" **META-INF/spring.factories** " 查找，我们去找找看，我们发现在 autoconfigere 包下
确实有这个文件。



<img src="/img/spring.pdf-183-0.png">183-0
<img src="/img/spring.pdf-184-0.png">184-0

<img src="/img/spring.pdf-184-1.png">184-1

我们发现了个大秘密，这不就是那些自动装配的配置类吗？


**为什么我们导入这个redis 的包就可以直接使用 RedisTemplate来操作redis（还是要在配置文**
**件中配置端口的。）？**





我们发现在 **spring.factories** 的文件中有一个类


这个类会被spring 管理，我们点进去

```
@Configuration
@ConditionalOnClass( RedisOperations .class)

```

```
@EnableConfigurationProperties(RedisProperties.class)
@Import({ LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class })
public class RedisAutoConfiguration {

@Bean
@ConditionalOnMissingBean(name = "redisTemplate")
public RedisTemplate<Object, Object> redisTemplate(
RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
RedisTemplate<Object, Object> template = new RedisTemplate<>();
template.setConnectionFactory(redisConnectionFactory);
return template;
}

@Bean
@ConditionalOnMissingBean
public StringRedisTemplate stringRedisTemplate(
RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
StringRedisTemplate template = new StringRedisTemplate();
template.setConnectionFactory(redisConnectionFactory);
return template;
}

}

```

为什么可以使用RedisTemplate？ **因为这个类帮我们创建了RedisTemplate** 。


**tip** :
**@ConditionalOnClass(RedisOperations.class)**
这个注解的意思是RedisOperations.class这个类存在时，会加载这个类。
而RedisOperations是spring-boot-starter-data-redis包中的一个类，所以需要导包才能使
用。


**@ConditionalOnMissingBean注解的作用**


**笔记本：** spring


**创建时间：** 2021/10/13 18:40 **更新时间：** 2021/10/13 19:00


**作者：** 彼岸樱速


@ConditionalOnMissingBean，它是修饰bean的一个注解，主要实现的是，当你的bean被注
册之后，如果而注册相同类型的bean，就不会成功，它会保证你的bean只有一个，即你的实例
只有一个，当你注册多个相同的bean时，会出现异常，以此来告诉开发人员。


**代码演示**



<img src="/img/spring.pdf-186-0.png">186-0

<img src="/img/spring.pdf-186-1.png">186-1



因为在aMapper1上面标识了AMapper类型的bean只能有一个实现

`@ConditionalOnMissingBean(AMapper.class)` ，所以在进行aMapper2注册时，系统会出现上面图
上的异常，这是正常的。


当我们把 `[@ConditionalOnMissingBean(AMapper.class)]` 去掉之后，你的bean可以注册多次，这时
需要用的@Primary来确定你要哪个实现；一般来说，对于自定义的配置类，我们应该加上
@ConditionalOnMissingBean注解，以避免多个配置同时注入的风险。


_**`@Primary`**_ **标识哪个是默认的** _**`bean`**_



<img src="/img/spring.pdf-186-2.png">186-2


**The server time zone value is unrecognized or represents more than one time zone. 这个问**
**题的解决方法**


**笔记本：** spring


**创建时间：** 2021/10/11 0:49 **更新时间：** 2021/10/11 0:50


**作者：** 彼岸樱速


The server time zone value '???ú±ê×??±??' is unrecognized or represents more than
one time zone.
其中是有乱码。


解决的方法是，在连接mysql的url后面加上了一句话。


[原来的url:jdbc:mysql://localhost:3306/stock](mysql://localhost:3306/stock)


[修改后的是：jdbc:mysql://localhost:3306/stock?](mysql://localhost:3306/stock?serverTimezone=GMT) **serverTimezone=GMT**


修改好，至少这个问题解决了。


用文章记录下，万一其它同学遇到类似问题，也可以用这个办法解决。


**@Documented注释使用**


**笔记本：** spring


**创建时间：** 2021/10/10 15:44 **更新时间：** 2021/10/10 15:47


**作者：** 彼岸樱速


**Documented注释的作用及其javadoc文档生成工具的使用**


**代码放在MyDocumentedtAnnotationDemo.java文件中**



<img src="/img/spring.pdf-188-0.png">188-0



<img src="/img/spring.pdf-188-1.png">188-1



仔细看看下面的编译的结果：


**在java文件所在的路径中可以发现生成了doc文件夹，打开文件夹，打开index.html可以发现查看生成的文档**



<img src="/img/spring.pdf-188-2.png">188-2

<img src="/img/spring.pdf-188-3.png">188-3
**下面是Documented注释用在类上的作用：给类添加注释**


**下面是Documented注释用在类方法上的作用：给类方法添加注释**



<img src="/img/spring.pdf-189-0.png">189-0

<img src="/img/spring.pdf-189-1.png">189-1
**java元注解 @Retention注解使用**


**笔记本：** spring


**创建时间：** 2021/10/10 15:38 **更新时间：** 2021/10/10 15:42


**作者：** 彼岸樱速


**@Retention** 定义了该Annotation被保留的时间长短：


1.某些Annotation仅出现在源代码中，而被编译器丢弃；


3.而另一些在class被装载时将被读取，注解保留在程序运行期间，此时可以通过反射获得定义在某个类上的所有注解


**作用：表示需要在什么级别保存该注释信息，用于描述注解的生命周期（即：被描述的注解在什么范围内有效）**


**取值（RetentionPoicy）有：**


1.SOURCE:在源文件中有效（即源文件保留）
2.CLASS:在class文件中有效（即class保留）


3.RUNTIME:在运行时有效（即运行时保留）


Retention meta-annotation类型有唯一的value作为成员


它的取值来自 **java.lang.annotation.RetentionPolicy** 的枚举类型值。具体实例如下：



<img src="/img/spring.pdf-190-1.png">190-1

<img src="/img/spring.pdf-190-2.png">190-2







@Retention作用 是定义 被它所注解的注解保留多久 ，一共有三种策略，定义在

RetentionPolicy 枚举中.


从注释上看：



<img src="/img/spring.pdf-190-6.png">190-6




这3个生命周期分别对应于：Java源文件(.java文件) ---> .class文件 ---> 内存中的字节码。


那怎么来选择合适的注解生命周期呢？


首先要明确生命周期长度 **SOURCE < CLASS < RUNTIME** ，所以前者能作用的地方后者一定也能作用。一


般如果需要 **在运行时去动态获取注解信息，那只能用 RUNTIME 注解** ；如果要 **在编译时进行一些预处理操**


**作** ，比如生成一些辅助代码（如 ButterKnife ） **，就用 CLASS注解** ；如果 **只是做一些检查性的操作** ，比

如 **@Override** 和 **@SuppressWarnings** ，则 **可选用 SOURCE 注解** 。



<img src="/img/spring.pdf-191-0.png">191-0
**spring boot: Annotation 注解之@Target的用法介绍**


**笔记本：** spring


**创建时间：** 2021/10/10 15:29 **更新时间：** 2021/10/10 15:34


**作者：** 彼岸樱速


前言


目前，越来越多的架构设计在使用注解，例如spring3.0、struts2等框架。让我们先来看看注解的定义。


如下是一段使用了JDK 5 Annotation @Target的代码：



<img src="/img/spring.pdf-192-0.png">192-0















**一、@Target的用法**


java.lang.annotation.Target


用于设定注解使用范围


java.lang.annotation.ElementType


Target通过ElementType来指定注解可使用范围的枚举集合


**二、ElementType的用法**

|取值|注解使用范围|
|---|---|
|METHOD|可用于方法上|
|TYPE|可用于类或者接口上|
|ANNOTATION_TYPE|可用于注解类型上（被@interface修饰的类型）|
|CONSTRUCTOR|可用于构造方法上|
|FIELD|可用于域上|
|LOCAL_VARIABLE|可用于局部变量上|
|PACKAGE|用于记录java文件的package信息|
|PARAMETER|可用于参数上|



这里重点说明下：ElementType. PACKAGE。它并不是使用在一般的类中，而是用在固定的文件package-info.java中。这里需
要强调命名一定是“package-info”。由于package-info.java并不是一个合法的类，使用eclipse创建类的方式会提示不合法，
所以需要以创建文件的方式来创建package-info.java。


例如，定义可使用范围PACKAGE：



<img src="/img/spring.pdf-192-1.png">192-1














那么，创建文件：package-info.java，内容如下：








**Spring事务的传播特性**


**笔记本：** spring


**创建时间：** 2021/10/10 0:06 **更新时间：** 2021/10/10 0:07


**作者：** 彼岸樱速


所谓事务的嵌套就是两个事务方法之间相互调用。spring事务开启 ，或者是基于接口的或者是基


于类的代理被创建（注意一定要是代理，不能手动new 一个对象，并且此类（有无接口都行）


一定要被代理——spring中的bean只要纳入了IOC管理都是被代理的）。


所谓事务传播行为就是多个事务方法相互调用时，事务如何在这些方法间传播。Spring 支持 7


种事务传播行为（Transaction Propagation Behavior）：
















|传播行为|描述|
|---|---|
|PROPAGATION_REQUIRED|如果没有，就开启一个事务；如果有，就加<br>入当前事务（方法B看到自己已经运行在 方<br>法A的事务内部，就不再起新的事务，直接<br>加入方法A）|
|RROPAGATION_REQUIRES_NEW|如果没有，就开启一个事务；如果有，就将<br>当前事务挂起。（方法A所在的事务就会挂<br>起，方法B会起一个新的事务，等待方法B的<br>事务完成以后，方法A才继续执行）|
|PROPAGATION_NESTED|如果没有，就开启一个事务；如果有，就在<br>当前事务中嵌套其他事务|
|PROPAGATION_SUPPORTS|如果没有，就以非事务方式执行；如果有，<br>就加入当前事务（方法B看到自己已经运行<br>在 方法A的事务内部，就不再起新的事务，<br>直接加入方法A）|
|PROPAGATION_NOT_SUPPORTED|如果没有，就以非事务方式执行；如果有，<br>就将当前事务挂起，（方法A所在的事务就<br>会挂起，而方法B以非事务的状态运行完，<br>再继续方法A的事务）|
|PROPAGATION_NEVER|如果没有，就以非事务方式执行；如果有，<br>就抛出异常。|
|PROPAGATION_MANDATORY|如果没有，就抛出异常；如果有，就使用当<br>前事务|



**其中前4种是开发中用到概率比较大的，建议熟记；后面3种不常用，了解就行。**


我们经常会提到，方法A传播到方法B，那到底是A调用B，还是B调用A，这个问题我一开始学


Spring的时候犯浑过，搞反了，导致久久理解不了。其实只要仔细斟酌字面意思就不会像我那样


犯傻了。


A传播到B，显而易见进入A方法执行半途中，再次进入B方法，这才叫做传播到方法B中。


**浅谈Spring之@Nullable、@NonNull注解**


**笔记本：** spring


**创建时间：** 2021/10/6 1:31 **更新时间：** 2021/10/6 1:37


**作者：** 彼岸樱速


**URL：** https://www.cnblogs.com/zhilili/p/12202079.html





**以上两个注解在程序运行的过程中不会起任何作用，只会在IDE、编译器、FindBugs检查、生**
**成文档的时候有做提示**


在写程序的时候你可以定义是否可为空指针。通过使用像@NotNull和@Nullable


之类的annotation来声明一个方法是否是空指针安全的。现代的编译器、IDE或者工


具可以读此annotation并帮你添加忘记的空指针检查，或者向你提示出不必要的乱七


八糟的空指针检查。IntelliJ和findbugs已经支持了这些annotation。这些


annotation同样是JSR 305的一部分，但即便IDE或工具中没有，这个annotation本身


可以作为文档。看到@NotNull和@Nullable，程序员自己可以决定是否做空指针检


查。顺便说一句，这个技巧对Java程序员来说相对比较新，要采用需要一段时间。


如果可以传入NULL值，则标记为@Nullable，如果不可以，则标注为@Nonnull。


那么在我们做一些不安全严谨操作的编码操作时，这些注释会给我们一些警告。如下


是我看spring源码时，发现用到@Nullable，借此源码做个测试:


我们把@Nullable改成@Nonnull，然后发现调用该方法的地方出现告警：



<img src="/img/spring.pdf-195-1.png">195-1

<img src="/img/spring.pdf-195-2.png">195-2
**Spring Bean的生命周期**


**笔记本：** spring


**创建时间：** 2021/9/29 1:43 **更新时间：** 2021/9/29 1:48


**作者：** 彼岸樱速


Bean生命周期是这样的：


简单来说，就是4个步骤



<img src="/img/spring.pdf-196-0.png">196-0



<img src="/img/spring.pdf-196-1.png">196-1


**spring bean的init、destory的几种方法**


**笔记本：** spring


**创建时间：** 2021/9/29 1:40 **更新时间：** 2021/9/29 1:43


**作者：** 彼岸樱速



<img src="/img/spring.pdf-197-0.png">197-0


**@PostConstruct，@Autowired 和 Constructor的先后顺序**


**笔记本：** spring


**创建时间：** 2021/9/24 18:17 **更新时间：** 2021/9/24 18:24


**作者：** 彼岸樱速


**@PostConstruct**



<img src="/img/spring.pdf-198-0.png">198-0



**这个注释是修饰初始化之后需要执行的方法，那么它和@Autowired、构造函数的执行顺序是**
**什么呢？**
```
@Data
@Component
public class BeanA {

@Autowired
private BeanB beanB;

public BeanA() {
```

`System.` _`out`_ `.println("` 这是 `Bean A` 的构造方法 `");`
```
}

@PostConstruct
private void init() {
```

`System.` _`out`_ `.println("` 这是 `BeanA` 的 `init(PostConstruct)` 方法 `");`
```
beanB.testB();
}
}

@Data
@Component
public class BeanB {

@PostConstruct
private void init() {
```

`System.` _`out`_ `.println("` 这是 `BeanB` 的 `init(PostConstruct)` 方法 `");`
```
}

public BeanB() {
```

`System.` _`out`_ `.println("` 这是 `Bean B` 的 构造方法 `");`
```
}

void testB() {
```

`System.` _`out`_ `.println("` 这是 `Bean B` 的 `testB` 方法 `");`
```
}
}

```

测试main
```
@SpringBootTest
@RunWith (SpringRunner.class)
public class PostConstuctTest {

@Autowired
private ApplicationContext applicationContext;

@Test
public void testIoc() {
BeanA beanA = (BeanA)applicationContext.getBean("beanA");
System. out .println(beanA.toString());
```

_`//`_ 初始化结果
_`//`_ 这是 _`Bean A`_ 的构造方法
_`//`_ 这是 _`Bean B`_ 的构造方法
_`//`_ 这是 _`BeanB`_ 的 _`init(PostConstruct)`_ 方法
_`//`_ 这是 _`BeanA`_ 的 _`init(PostConstruct)`_ 方法


**所以得到结论： Constructor > @Autowired > @PostConstruct**


