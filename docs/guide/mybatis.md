# Mybatis
---
aliases:
  - mybatis
标题: mybatis
---
**为什么Mybatis就能直接调用userMapper接口的方法**


**笔记本：** mybatis


**创建时间：** 2021/11/16 16:29 **更新时间：** 2023/3/9 11:36


**作者：** 彼岸樱速


**为什么Mybatis就能直接调用userMapper接口的方法**


先上案例代码，这样大家可以更加熟悉是如何使用的，看过Mybatis系列的小伙伴，对这段代码
差不多都可以背下来了。


哈哈~，有点夸张吗？不夸张的，就这行代码。



<img src="/img/mybatis.pdf-0-0.png">0-0



看源码有什么用？


<img src="/img/mybatis.pdf-1-0.png">1-0

通过源码的学习，我们可以收获Mybatis的核心思想和框架设计，另外还可以收获设计模式的
应用。


Mybatis配置文件解析到获取SqlSession，下面我们来分析从SqlSession到userMapper：





这里的sqlSession使用的是默认实现类DefaultSqlSession。所以我们直接进入
DefaultSqlSession的getMapper方法。

```
 //DefaultSqlSession 中
 private final Configuration configuration;
 //type=UserMapper.class
 @Override
 public <T> T getMapper(Class<T> type) {
 return configuration.getMapper(type, this);
 }

```

这里有三个问题：


**问题1：getMapper返回的是个什么对象？**


上面可以看出，getMapper方法调用的是Configuration中的getMapper方法。然后我们进入
Configuration中

```
 //Configuration 中
 protected final MapperRegistry mapperRegistry = new MapperRegistry(this);
 ////type=UserMapper.class
 public <T> T getMapper(Class<T> type, SqlSession sqlSession) {
 return mapperRegistry.getMapper(type, sqlSession);
 }

```


<img src="/img/mybatis.pdf-1-2.png">1-2
这里也没做什么，继续调用MapperRegistry中的getMapper：



<img src="/img/mybatis.pdf-2-0.png">2-0



MapperProxyFactory对象里保存了mapper接口的class对象，就是一个普通的类，没有什么逻
辑。


在MapperProxyFactory类中使用了两种设计模式：


**单例模式** methodCache（注册式单例模式）。
**工厂模式** getMapper()。


继续看MapperProxyFactory中的newInstance方法。

```
 public class MapperProxyFactory`<`T`>` {
 private final Class`<`T`>` mapperInterface;
 private final Map`<`Method, MapperMethod`>` methodCache = new ConcurrentHashMap`<` `>`();
 public MapperProxyFactory(Class`<`T`>` mapperInterface) {

```

```
 this.mapperInterface = mapperInterface;
 }
 public T newInstance(SqlSession sqlSession) {
 // 创建 MapperProxy 对象
 final MapperProxy`<`T`>` mapperProxy = new MapperProxy`<` `>`(sqlSession, mapperInter
 return newInstance(mapperProxy);
 }
 // 最终以 JDK 动态代理创建对象并返回
 protected T newInstance(MapperProxy`<`T`>` mapperProxy) {
 return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Clas
 }
 }

```

从代码中可以看出，依然是稳稳的基于 JDK Proxy 实现的，而 InvocationHandler 参数是
MapperProxy 对象。

```
 //UserMapper 的类加载器
 // 接口是 UserMapper
 //h 是 mapperProxy 对象
 public static Object newProxyInstance(ClassLoader loader,
 Class`<`  `?` `>`[] interfaces,
 InvocationHandler h){
 }

```

**问题2：为什么就可以调用他的方法？**


上面调用newInstance方法时候创建了MapperProxy对象，并且是当做newProxyInstance的第
三个参数，所以MapperProxy类肯定实现了InvocationHandler。


进入MapperProxy类中：



<img src="/img/mybatis.pdf-3-0.png">3-0


也就是说，getMapper方法返回的是一个JDK动态代理对象（类型是$Proxy+数字）。这个代
理对象会继承Proxy类，实现被代理的接口UserMpper，里面持有了一个MapperProxy类型的
触发管理类。


**当我们调用UserMpper的方法时候，实质上调用的是MapperProxy的invoke方法。**





<img src="/img/mybatis.pdf-4-1.png">4-1

为什么要在MapperRegistry中保存一个工厂类？


原来他是用来创建并返回代理类的。这里是代理模式的一个非常经典的应用。


MapperProxy如何实现对接口的代理？


**JDK动态代理**


我们知道，JDK动态代理有三个核心角色：


被代理类（即就是实现类）
接口
实现了InvocationHanndler的触发管理类，用来生成代理对象。


被代理类必须实现接口，因为要通过接口获取方法，而且代理类也要实现这个接口。



<img src="/img/mybatis.pdf-4-2.png">4-2
<img src="/img/mybatis.pdf-5-0.png">5-0

而Mybatis中并没有Mapper接口的实现类，怎么被代理呢？它忽略了实现类，直接对Mapper
接口进行代理。


**MyBatis动态代理：**


在Mybatis中，JDK动态代理为什么不需要实现类呢？


这里我们的目的其实就是根据一个可以执行的方法，直接找到Mapper.xml中statement ID ，
方便调用。


最后返回的userMapper就是MapperProxyFactory的创建的代理对象，然后这个对象中包含了
MapperProxy对象，


**问题3：到底是怎么根据Mapper.java找到Mapper.xml的？**


最后我们调用userMapper.selectUserById()，本质上调用的是MapperProxy的invoke()方法。



<img src="/img/mybatis.pdf-5-1.png">5-1
请看下面这张图：


如果根据(接口+方法名找到Statement ID )，这个逻辑在InvocationHandler子类
（MapperProxy类）中就可以完成了，其实也就没有必要在用实现类了。


**总结**


本文中主要是讲getMapper方法，该方法实质上是获取一个JDK动态代理对象（类型是
Proxy+数字）,这个代理类会继承MapperProxy类，实现被代理的接口UserMapper，并且里面
持有一个MapperProxy类型的触发管理类。这里我们就拿到代理类了，后面我们就可以使用这
个代理对象进行方法调用。


问题涉及到的设计模式：


代理模式。
工厂模式。
单例模式。


整个流程图：



<img src="/img/mybatis.pdf-6-0.png">6-0

<img src="/img/mybatis.pdf-6-1.png">6-1
<img src="/img/mybatis.pdf-7-0.png">7-0
**Mybatis自定义分页返回结果PageBean**


**笔记本：** mybatis


**创建时间：** 2022/10/28 9:27 **更新时间：** 2022/10/28 14:06


**作者：** 彼岸樱速



<img src="/img/mybatis.pdf-8-0.png">8-0



其实我在写上一篇【Mybatis自定义拦截器】的时候，有段这样的代码



<img src="/img/mybatis.pdf-8-1.png">8-1

<img src="/img/mybatis.pdf-8-2.png">8-2


<img src="/img/mybatis.pdf-9-0.png">9-0

然后我在拦截器最后这样子写



<img src="/img/mybatis.pdf-9-1.png">9-1

<img src="/img/mybatis.pdf-9-2.png">9-2



<img src="/img/mybatis.pdf-9-3.png">9-3




<img src="/img/mybatis.pdf-10-0.png">10-0



<img src="/img/mybatis.pdf-10-1.png">10-1

<img src="/img/mybatis.pdf-10-2.png">10-2



<img src="/img/mybatis.pdf-10-3.png">10-3


<img src="/img/mybatis.pdf-11-0.png">11-0



<img src="/img/mybatis.pdf-11-2.png">11-2


<img src="/img/mybatis.pdf-12-0.png">12-0



<img src="/img/mybatis.pdf-12-2.png">12-2
<img src="/img/mybatis.pdf-13-0.png">13-0

<img src="/img/mybatis.pdf-13-1.png">13-1



<img src="/img/mybatis.pdf-13-2.png">13-2



<img src="/img/mybatis.pdf-13-3.png">13-3


<img src="/img/mybatis.pdf-14-0.png">14-0



<img src="/img/mybatis.pdf-14-2.png">14-2

<img src="/img/mybatis.pdf-14-3.png">14-3


<img src="/img/mybatis.pdf-15-0.png">15-0

<img src="/img/mybatis.pdf-15-1.png">15-1


<img src="/img/mybatis.pdf-16-0.png">16-0

<img src="/img/mybatis.pdf-16-1.png">16-1




<img src="/img/mybatis.pdf-17-0.png">17-0









<img src="/img/mybatis.pdf-17-2.png">17-2
<img src="/img/mybatis.pdf-18-0.png">18-0


}





<img src="/img/mybatis.pdf-19-1.png">19-1



下面是要补充的代码


自定义配置类



<img src="/img/mybatis.pdf-19-3.png">19-3




<img src="/img/mybatis.pdf-20-0.png">20-0






<img src="/img/mybatis.pdf-21-0.png">21-0





自定义代理类
public class MyMapperProxy`<`T`>` implements InvocationHandler, Serializable {


private static final long serialVersionUID = -5892500526905816916L;
private static final int ALLOWED_MODES = MethodHandles.Lookup.PRIVATE |
MethodHandles.Lookup.PROTECTED
| MethodHandles.Lookup.PACKAGE | MethodHandles.Lookup.PUBLIC;
private static final Constructor<MethodHandles.Lookup> lookupConstructor;
private static final Method privateLookupInMethod;
private SqlSession sqlSession;
private final Class`<`T`>` mapperInterface;
private final Map<Method, MyMapperMethod> methodCache;


public MyMapperProxy(SqlSession sqlSession, Class`<`T`>` mapperInterface, Map`<`Method,
MyMapperMethod`>` methodCache) {
this.sqlSession = sqlSession;
this.mapperInterface = mapperInterface;
this.methodCache = methodCache;
}


static {
Method privateLookupIn;
try {
privateLookupIn = MethodHandles.class.getMethod("privateLookupIn", Class.class,
MethodHandles.Lookup.class);
} catch (NoSuchMethodException e) {
privateLookupIn = null;
}
privateLookupInMethod = privateLookupIn;


Constructor`<`MethodHandles.Lookup`>` lookup = null;
if (privateLookupInMethod == null) {
// JDK 1.8
try {
lookup = MethodHandles.Lookup.class.getDeclaredConstructor(Class.class,
int.class);
lookup.setAccessible(true);
} catch (NoSuchMethodException e) {
throw new IllegalStateException(
"There is neither 'privateLookupIn(Class, Lookup)' nor 'Lookup(Class, int)'
method in java.lang.invoke.MethodHandles.",
e);
} catch (Throwable t) {
lookup = null;
}
}
lookupConstructor = lookup;
}


@Override
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
try {
// method.getDeclaringClass()获取class类对象名词
if (Object.class.equals(method.getDeclaringClass())) {
return method.invoke(this, args);
} else if (method.isDefault()) {
if (privateLookupInMethod == null) {
return invokeDefaultMethodJava8(proxy, method, args);
} else {
return invokeDefaultMethodJava9(proxy, method, args);


}
}
} catch (Throwable t) {
throw ExceptionUtil.unwrapThrowable(t);
}
final MyMapperMethod mapperMethod = cachedMapperMethod(method);
return mapperMethod.execute(sqlSession, args);
}


private MyMapperMethod cachedMapperMethod(Method method) {
return methodCache.computeIfAbsent(method,
k -`>` new MyMapperMethod(mapperInterface, method, sqlSession.getConfiguration()));
}


private Object invokeDefaultMethodJava9(Object proxy, Method method, Object[] args)
throws Throwable {
final Class`<`  `?` `>` declaringClass = method.getDeclaringClass();
return ((MethodHandles.Lookup) privateLookupInMethod.invoke(null, declaringClass,
MethodHandles.lookup()))
.findSpecial(declaringClass, method.getName(),
MethodType.methodType(method.getReturnType(), method.getParameterTypes()),
declaringClass)
.bindTo(proxy).invokeWithArguments(args);
}


private Object invokeDefaultMethodJava8(Object proxy, Method method, Object[] args)
throws Throwable {
final Class`<`  `?` `>` declaringClass = method.getDeclaringClass();
return lookupConstructor.newInstance(declaringClass,
ALLOWED_MODES).unreflectSpecial(method, declaringClass)
.bindTo(proxy).invokeWithArguments(args);
}
}


自定义代理工厂类
public class MyMapperProxyFactory`<`T`>` {


/**
- 原对象类
*/

@Getter

private final Class`<`T`>` mapperInterface;
private final Map`<`Method, MyMapperMethod`>` methodCache = new ConcurrentHashMap`<` `>`();


public MyMapperProxyFactory(Class`<`T`>` mapperInterface) {
this.mapperInterface = mapperInterface;
}


public Map`<`Method, MyMapperMethod`>` getMethodCache() {
return methodCache;
}


@SuppressWarnings("unchecked")
protected T newInstance(MyMapperProxy`<`T`>` mapperProxy) {
return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Class[]
{mapperInterface}, mapperProxy);
}


/**
- 第一个参数：用哪个类加载器去加载代理对象
- 第二个参数：动态代理类需要实现的接口
- 第三个参数：动态代理方法在执行时，会调用第三个参数里面的invoke方法去执行
- 方法返回的对象
- Proxy.newProxyInstance代理的是接口
*/
@SuppressWarnings("unchecked")
public T newInstance(SqlSession sqlSession) {
final MyMapperProxy`<`T`>` mapperProxy = new MyMapperProxy`<` `>`(sqlSession, mapperInterface,
methodCache);
return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Class[]
{mapperInterface}, mapperProxy);
}


}


自定义代理注册类
public class MyMapperRegistry extends MapperRegistry {


/**
- 存储代理器工厂容器


*/
private final Map<Class`<`  `?` `>`, MyMapperProxyFactory`<`  `?` `>` `>` knownMappers = new HashMap`<` `>`();
private final MyMapperConfiguration config;


public MyMapperRegistry(MyMapperConfiguration config) {
super(config);
this.config = config;
}


/**
- 获取容器中的对象并生成代理对象
*/

@Override
public `<`T`>` T getMapper(Class`<`T`>` type, SqlSession sqlSession) {
final MyMapperProxyFactory`<`T`>` mapperProxyFactory = (MyMapperProxyFactory`<`T`>`)
knownMappers.get(type);
if (mapperProxyFactory == null) {
throw new RuntimeException("Type " + type + " is not known to the MapperRegistry.");
}
try {
// 生成代理对象并返回
return mapperProxyFactory.newInstance(sqlSession);
} catch (Exception e) {
throw new RuntimeException("Error getting mapper instance. Cause: " + e, e);
}
}


@Override
public `<`T`>` void addMapper(Class`<`T`>` type) {
/* Mapper 必须是接口才会注册 */
if (type.isInterface()) {
if (hasMapper(type)) {

return;
}
boolean loadCompleted = false;
try {
knownMappers.put(type, new MyMapperProxyFactory`<` `>`(type));
MybatisMapperAnnotationBuilder parser = new
MybatisMapperAnnotationBuilder(config, type);
parser.parse();
loadCompleted = true;
} finally {
if (!loadCompleted) {
knownMappers.remove(type);
}
}
}
}


@Override
public `<`T`>` boolean hasMapper(Class`<`T`>` type) {
return knownMappers.containsKey(type);
}


@Override
public void addMappers(String packageName) {
addMappers(packageName, Object.class);
}


/**
- 使用自己的 knownMappers
*/

@Override
public Collection`<`Class`<`  `?` `>` `>` getMappers() {
return Collections.unmodifiableCollection(knownMappers.keySet());
}


}


最后是，把我们自定义的配置类，注册到sqlSessionFactory里面。
MybatisConfig类
@Configuration
public class MybatisConfig {


@Bean
public SqlSessionFactory sqlSessionFactory(DataSource dataSource, MybatisPlusProperties
mybatisPlusProperties) throws Exception {
SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
sqlSessionFactoryBean.setDataSource(dataSource);


<img src="/img/mybatis.pdf-24-0.png">24-0





编写测试接口



<img src="/img/mybatis.pdf-24-1.png">24-1

<img src="/img/mybatis.pdf-24-2.png">24-2
<img src="/img/mybatis.pdf-25-0.png">25-0

<img src="/img/mybatis.pdf-25-1.png">25-1

IPage分页输出打印


自定义PageBean输出打印


至此，自定义PageBean分页，大功告成~



<img src="/img/mybatis.pdf-25-2.png">25-2

<img src="/img/mybatis.pdf-25-3.png">25-3

<img src="/img/mybatis.pdf-25-4.png">25-4

<img src="/img/mybatis.pdf-25-5.png">25-5

<img src="/img/mybatis.pdf-25-6.png">25-6


<img src="/img/mybatis.pdf-26-0.png">26-0


**MyBatis自定义拦截器**


**笔记本：** mybatis


**创建时间：** 2022/10/27 16:15 **更新时间：** 2022/10/28 9:26


**作者：** 彼岸樱速
## MyBatis 自定义拦截器实现分页





**一、拦截器Mybatis**


而我们实现的分页功能就是基于mybatis的插件模块，Mybatis为我们提供了Interceptor接口，
通过实现该接口就可以定义我们自己的拦截器。我们先来看一下这个接口的定义：

```
public interface Interceptor {
```

`//` 是实现拦截逻辑的地方，内部要通过 `invocation.proceed()` 显式地推进责任链前进，也就是调用下
一个拦截器拦截目标方法。
```
Object intercept(Invocation invocation) throws Throwable;
```

`//` 就是用当前这个拦截器生成对目标 `target` 的代理
```
Object plugin(Object target);
```

`//` 用于设置额外的参数，参数配置在拦截器的 `Properties` 节点里
```
void setProperties(Properties properties);
}

```

**二、简单案例实现**
Demo采用技术 **SpringBoot+MyBatis**
写在前面，这里如果你想要自定义拦截器来实现分页，其实分页主要就是分两种，物理分页和逻
辑分页
物理分页，就是利用mysql的limit关键字来进行分页。
逻辑分页，就是一次性把所有需要的数据查出来，然后程序员在代码里面进行分页返回。
我们使用mybatis的时候，大多数都是直接使用分页插件，最开始只有mybatis的时候，就是
github的 **PageHelper** 。
如果你想自己写分页逻辑，也就是本文所记录的代码内容，就不要引入任何其他的分页插件。引
入任何实现了Interceptor的分页插件，都会跟本文自定义的起冲突。
换句话说，你用了多个Interceptor，多个都会进入，就不知道用哪个，mybatis会报错，如下
图。

<img src="/img/mybatis.pdf-27-2.png">27-2
包括MybatisPlus的分页插件-- **MybatisPlusInterceptor**


1、pom.xml文件引入mybatis依赖

```
<dependency>
<groupId>org.mybatis.spring.boot</groupId>
<artifactId>mybatis-spring-boot-starter</artifactId>
<version>1.3.2</version>
</dependency>
<dependency>
<groupId>mysql</groupId>
<artifactId>mysql-connector-java</artifactId>
<scope>runtime</scope>
</dependency>

```

2、封装类代码实现


1. 该类封装了分页查询的页码和页面大小，还有排序规。



<img src="/img/mybatis.pdf-27-3.png">27-3
<img src="/img/mybatis.pdf-28-0.png">28-0

2. 分页结果集封装


<img src="/img/mybatis.pdf-29-0.png">29-0

3. 拦截器部分

这里的只要思路是：
建立一个Mybatis拦截器用于拦截Executor接口的query方法，在拦截之后如果参数列表
有分页请求对象，我这里分页重新拼接sql执行实现自己的query方法逻辑，否则按原来方
式执行。
@Intercepts 在实现Interceptor接口的类声明,使该类PageInterceptor注册成为拦截器。

```
import com.wuyh.demo.utils.Page;

import com.wuyh.demo.utils.PageRequest;

import org.apache.ibatis.executor.Executor;

import org.apache.ibatis.executor.parameter.ParameterHandler;

import org.apache.ibatis.mapping.BoundSql;

import org.apache.ibatis.mapping.MappedStatement;

import org.apache.ibatis.mapping.SqlSource;

import org.apache.ibatis.plugin.*;

import org.apache.ibatis.reflection.DefaultReflectorFactory;

import org.apache.ibatis.reflection.MetaObject;

import org.apache.ibatis.reflection.factory.DefaultObjectFactory;

import org.apache.ibatis.reflection.wrapper.DefaultObjectWrapperFactory;

import org.apache.ibatis.scripting.defaults.DefaultParameterHandler;

import org.apache.ibatis.session.Configuration;

import org.apache.ibatis.session.ResultHandler;

import org.apache.ibatis.session.RowBounds;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Sort;

```

<img src="/img/mybatis.pdf-30-0.png">30-0


<img src="/img/mybatis.pdf-31-0.png">31-0


```
ParamMap map = (ParamMap)paramMap;
Iterator iterator = map.entrySet().iterator();
while(iterator.hasNext()) {
Map.Entry entry = (Map.Entry)iterator.next();
Object obj = entry.getValue();
if (obj != null &&
PageRequest.class.isAssignableFrom(obj.getClass())) {
return (PageRequest)obj;
}
}
}
return null;
}
}

private Object getWhereParameter(Object obj) {
if (obj instanceof ParamMap) {
ParamMap paramMap = (ParamMap)obj;
if (paramMap.size() == 4) {
Iterator iterator = paramMap.entrySet().iterator();
while(iterator.hasNext()) {
Map.Entry var4 = (Map.Entry)iterator.next();
Object var5 = var4.getValue();
if (Sort.class.isAssignableFrom(var5.getClass()) ||
PageRequest.class.isAssignableFrom(var5.getClass())) {
return paramMap.get("param1");
}
}
}
}

return obj;
}
}

```

4）业务代码


mapper
```
@Mapper
public interface SysUserMapper {

Page<SysUser> selectUserPage(SysUser user, PageRequest pageRequest);
int addUser(SysUser user);
void deleteUser(Long userId);
}
```

service

```
@Service

public class UserService {

@Autowired

SysUserMapper userMapper;
public Page<SysUser> selectUserPage(){
SysUser sysUser = new SysUser();
return userMapper.selectUserPage(sysUser, new PageRequest(0, 10));
}

public void add(Long userId, String userName, String passWord) {
userMapper.deleteUser(userId);
SysUser sysUser = new SysUser();
sysUser.setUserId(userId);
sysUser.setUserName(userName);
sysUser.setPassWord(passWord);
userMapper.addUser(sysUser);
}
}
```

controller

```
@RestController
@RequestMapping("/user")
public class UserController {

@Autowired

private UserService userService;
@RequestMapping("getUser")
public String GetUser(){
userService.add(11L,"pageOne", "Admin1");
userService.add(12L,"pageTwo", "Admin1");
return userService.selectUserPage().getContent().toString();

```

```
}
}

```

4. Demo测试结果


**四、 小结**



<img src="/img/mybatis.pdf-33-0.png">33-0

<img src="/img/mybatis.pdf-33-1.png">33-1



**五、拓展**


关于github的PageHelper，其实通过观察源码，你会发现，都是一样的原理！


看一下mybatis的执行过程



<img src="/img/mybatis.pdf-33-2.png">33-2
<img src="/img/mybatis.pdf-34-0.png">34-0

我们可以看到，实际上，mybatis就是动态组装好sql，然后把sql发给Executor去执行，有参数
解析的ParameterHandler，有解析结果集的ResultSetHandler


接下来我们来看下 **@Intercepts** 的用法


@Intercepts注解的作用是，标记需要拦截的方法列表。mybatis通过该注解去判断当前方法是
否需要被拦截。
@Intercepts其实就是一个数组，用来添加复数个@Signature。
每个@Signature都指定了一个需要拦截的方法。


@Signature注解有3个参数。


1）type
指定拦截的类的类型，type有4个类型可选





2）method
指定拦截的方法名


3）args
指定方法的参数类型，去对应的方法里看有哪些参数类型就可以了。如果填错会报错。
mybatis会根据这三个参数找到对应的方法，并进行拦截。
mybatis给出了允许拦截的方法列表





例子



<img src="/img/mybatis.pdf-34-3.png">34-3



这个注解声明了，要拦截的类是


要拦截的方法名是





该方法的参数有4个，类型是





3 intercept方法详解
intercept方法用来在拦截时添加自定义的操作。
该方法提供给我们一个参数：Invocation invocation
Invocation类有3个字段，





target 被拦截的类
method 被拦截的方法
args 方法的实际参数


既然我们要添加参数到拦截的方法里，所以我们需要关心的主要就是这个args。
args是一个参数数组，里面的参数数量对应着@Signature声明的那几个参数，也就是拦截方法
的参数。
举个例子：





拦截该方法时，args就是一个长度为4的数组，里面4个参数是





其中，第二个参数，也就是args[1]，是实际执行Mapper时传入的参数，后续sql会根据args[1]
里的值来填充sql。


所以我们要做的就是把自己的参数添加到args[1]中。


添加参数也是有说法的。args[1]是一个Object类型，实际类型会根据Mapper方法的参数数量
和类型发生变化。
因此需要分多种情况考虑。


1）无参数
Mapper执行的是一个无参方法时，args[1]为null。
需要创建一个MapperMethod.ParamMap对象，然后将自定义的参数添加进去，再赋值给
arg[1]就可以了。





2）一个参数
Mapper执行的是一个单一参数方法时，args[1]是Object类型。
需要创建一个MapperMethod.ParamMap对象，将已经有的参数放进去，然后将自定义参数放
进去。
如果args[1]是一个基本数据类型，就存在一个问题，Map是key-value结构，args[1]只有值，
没有参数名。我们知道value是不够的，sql解析时根据参数名去找对应的value。
所以我们需要去反射实际执行的mapper，拿到对应的参数名。
如果args[1]是一个引用类型，我们就需要解析他所有的字段，将字段名和其值组成key-value键
值对，存储到Map中。
因为单一参数是引用时，mybatis会直接忽略参数名，直接匹配参数中的字段名。


3）多个参数
Mapper执行的是一个多参数方法时，args[1]已经是MapperMethod.ParamMap类型。
所以我们无需修改args[1]的类型，直接将自定义的参数添加进去就可以了。


注意点
@Param注解修饰的参数虽然参数名称发生改变，但无需特别处理，因为@Param注解并非修
改源参数的名称，而是添加了一个新的参数。


**物理分页&&逻辑分页**


**笔记本：** mybatis


**创建时间：** 2021/10/9 1:54 **更新时间：** 2022/10/27 16:42


**作者：** 彼岸樱速


**URL：** about:blank

### **Mybatis的物理分页和逻辑分页**


**逻辑分页**


通过SQL将所有数据全部查询出来，然后通过结果集 **ResultSets** 进行类似 **offset** 的分页效果，实际上所有的


结果已经查询出来了只是显示出来部分而已，常见的是mybatis的RowBounds，作用范围较小，只使用于数


据量小变化浮动小的情况。（把所有结果查出来只显示一部分）


优点：效率高       缺点：占用内存比较高


**物理分页**


物理分离是在获取数据库的返回结果是就已经是offset的数据了，一般会有两种方式：第一种是通过传统的显


示LIMIT实现分页，传入pageIndex和pageSize；第二种是通过PageHelper插件，在执行sql的时候通过拦截


器进行sql **拼接LIMIT** ，并且提供了PageInfo类返回，PageInfo中封装了返回结果和一些参与分页的详情数据


优点：不占用很多内存  缺点：效率比价低（相比于逻辑分页）


**方式1：使用RowBounds对象实现逻辑分页**
Mybatis使用RowBounds对象进行分页，它是针对ResultSet结果集执行的内存分页，而非物理分页。


使用方式就是在调取sql语句的时候，加上RowBounds对象来指定分页开始的位置和要显示的条数。
_**`//`**_ **调取** _**`sql`**_ **语句** _**`,selectList("`**_ **方法的完整路径** _**`"),`**_ **路径** _**`=namespace+id(`**_ **方法名** _**`)`**_

```
List<Student> list = session.selectList("com.maven.dao.StudentDao.getall",null,new
```

**`RowBounds(0,3));`** _**`// rowBounds(`**_ **开始位置** _**`,`**_ **显示条数** _**`)`**_


**方式2：使用.pageHelper分页插件**
分页插件的基本原理是使用Mybatis提供的插件接口，实现自定义插件，在插件的拦截方法内拦截待执行
的sql，然后重写sql，根据dialect方言，添加对应的物理分页语句和物理分页参数。



<img src="/img/mybatis.pdf-37-0.png">37-0
**MyBatis笔记之tinyint(1)自动转型为boolean**


**笔记本：** mybatis


**创建时间：** 2022/5/6 19:59 **更新时间：** 2022/5/9 13:56


**作者：** 彼岸樱速


背景
数据表定义：



<img src="/img/mybatis.pdf-38-0.png">38-0



其中有三个tinyint(1)字段。


Java接口定义为：


List`<`Map`>` selectListBySelective(Map`<`String, Object`>` map);


mybatis mapper文件定义：



<img src="/img/mybatis.pdf-38-1.png">38-1



可见，对于三个不同的tinyint(1)字段的处理方式不一样。


对于Spring Boot + MyBatis 应用，在配置文件application.properties里面新增一条配置信
息：logging.level.com.aaa.mapper=debug，即可实现打印输出SQL语句到日志控制台。


SQL语句如下：



<img src="/img/mybatis.pdf-38-2.png">38-2



拿到SQL语句去DataGrip执行，没有问题：





但postman调用接口得到的返回数据是：


<img src="/img/mybatis.pdf-39-0.png">39-0



分析


在返回值为Map类型（即resultType="Map"）时，数据表里的tinyint(1)类型的数据（即[1,
0]），被 **mybatis会自动把转换成boolean类型数据（即[true/false]）** ，参考Mybatis中
tinyint(1)数据自动转化为boolean处理。


如果想要不自动转为boolean：


使用ifnull(column, 0)处理该字段
在jdbcUrl添加参数：tinyInt1isBit=false（默认为true）
避免使用长度为1的tinyint类型字段存储数字格式的数据。
在笔者的问题场景下，只推荐第一种解决方案。即通过ifnull处理。因此，可以看到taskStatus
如期返回1，而mqSwitch还是返回true。


问题2
isactive字段，也采用ifnull(tt.isactive, 0)加以处理，但是没有后面的as表达式部分。接口返回
居然是：





备注
本文使用的mybatis为mybatis-spring-boot-starter，版本：



<img src="/img/mybatis.pdf-39-2.png">39-2



对应的mybatis版本：



<img src="/img/mybatis.pdf-39-3.png">39-3



在实体类PO里面有定义字段applyStatus，查询条件也返回t1.applyStatus，SQL执行没有问
题，但是mybatis就是不返回该数据；





问题
后来又遇到一个类似的问题，记录于此。


数据表有个表示状态的字段，类型定义为tinyint(1)，1表示状态开启，0表示状态关闭，前端查
询条件里有个下拉框，选择开启或者关闭，根据此状态来查询数据：





但是始终不生效，看前端传参0和1，1时查询正常，0时查询失败，说明问题不在前端。


打印SQL执行日志，发现根本没有带上AND status = 0这个条件。


此时才发现，MySQL字段定义为tinyint(1)时，MyBatis会把Integer = 0当作空字符串来处理。


因此上面的if条件不成立，解决方案：




**mybatis if 并且判断列表是否为空**


**笔记本：** mybatis


**创建时间：** 2022/5/6 19:52 **更新时间：** 2022/5/6 19:54


**作者：** 彼岸樱速



<img src="/img/mybatis.pdf-41-0.png">41-0
**TKMybatis 介绍和使用**


**笔记本：** mybatis


**创建时间：** 2022/5/6 19:21 **更新时间：** 2022/5/6 19:51


**作者：** 彼岸樱速


**一、什么是 TKMybatis**



<img src="/img/mybatis.pdf-42-0.png">42-0



**二、TKMybatis 使用**


**2.1 Springboot 项目中加入依赖**


在 POJO 类中加入依赖


在启动类中配置 @MapperScan 扫描


**2.2 使用讲解**


**2.2.1 实体类中使用**



<img src="/img/mybatis.pdf-42-1.png">42-1

<img src="/img/mybatis.pdf-42-2.png">42-2

<img src="/img/mybatis.pdf-42-3.png">42-3





|注解|解释|
|---|---|
|@Table|描述数据库表信息，主要属性有name(表名)、schema、catalog、<br>uniqueConstraints等|
|@Id|指定表主键字段，无属性值|
|@Column|描述数据库字段信息，主要属性有name(字段名)、columnDefinition、<br>insertable、length、nullable(是否可为空)、precision、scale、<br>table、unique、updatable等|
|@ColumnType|描述数据库字段类型，可对一些特殊类型作配置，进行特殊处理，主要属<br>性有jdbcType、column、typeHandler等|


其他注解如： **@Transient、@ColumnResult、@JoinColumn、@OrderBy、**
**@Embeddable** 等暂不描述


**2.2.2 dao中使用**


单表操作，只需要继承 tk.mybatis 下的 Mapper 接口即可使用



<img src="/img/mybatis.pdf-43-0.png">43-0



查看具体使用：内部都已经封装了基本的单表操作


**2.2.3 Service 层中使用**




















|操作|类型|介绍|
|---|---|---|
|增加|Mapper.insert(record)|保存一个实体，null的属性也会<br>保存，不会使用数据库默认值|
|增加|Mapper.insertSelective(record)|保存一个实体，忽略空值，即没<br>提交的值会使用使用数据库默认<br>值|
|删除|Mapper.delete(record)|根据实体属性作为条件进行删<br>除，查询条件使用等号|
|删除|Mapper.deleteByExample(example)|根据Example条件删除数据|
|删除|Mapper.deleteByPrimaryKey(key)|根据主键字段进行删除，方法参<br>数必须包含完整的主键属性|
|修改|Mapper.updateByExample(record,example)|根据Example条件更新实体<br>`record`包含的全部属性，null<br>值会被更新|
|修改|Mapper.updateByExampleSelective(record,<br>example)|根据Example条件更新实体<br>`record`包含的不是null的属性<br>值|
|修改|Mapper.updateByPrimaryKey(record)|根据主键更新实体全部字段，<br>null值会被更新|
|修改|Mapper.updateByPrimaryKeySelective(record)|根据主键更新属性不为null的值|
|查询|Mapper.select(record)|根据实体中的属性值进行查询，<br>查询条件使用等号|
|查询|Mapper.selectAll()|查询全部结果|
|查询|Mapper.selectByExample(example)|根据Example条件进行查询|
|查询|Mapper.selectByPrimaryKey(key)|根据主键字段进行查询，方法参<br>数必须包含完整的主键属性，查<br>询条件使用等号|
|查询|Mapper.selectCount(record)|根据实体中的属性查询总数，查<br>询条件使用等号|
|查询|Mapper.selectCountByExample(example)|根据Example条件进行查询总数|
|查询|Mapper.selectOne(record)|根据实体中的属性进行查询，只<br>能有一个返回值，有多个结果是<br>抛出异常，查询条件使用等号，|


<img src="/img/mybatis.pdf-44-0.png">44-0



**2.3 实际案例**


**2.3.1 dao 层使用**



<img src="/img/mybatis.pdf-44-1.png">44-1







**2.3.2 service 层使用**



<img src="/img/mybatis.pdf-44-2.png">44-2
<img src="/img/mybatis.pdf-45-0.png">45-0


**mybatis-plus更新字段的时候设置为null，忽略实体null判断**


**笔记本：** mybatis


**创建时间：** 2022/5/6 19:00 **更新时间：** 2022/5/6 19:08


**作者：** 彼岸樱速


**1 问题**


在用mybatis-plus封装的updateById方法来更新数据时，想把一个字段设置为null值，但是发现


更新后数据没有为null还是原来的值，这是因为mybatis-plus在更新的时候做了null判断，默认不


更新为null的传参。


**2 解决方法**


**1.将这个字段设置为空可以更新**


在实体类对应的字段上加注解 **@TableField(strategy=FieldStrategy.IGNORED)** ，忽略null值的


判断，例如









<img src="/img/mybatis.pdf-46-3.png">46-3

**2. 我们将全局更新策略设置为空可以更新**


这两种方式都是我 **极力不推荐** 的，大家也尽量不要使用这两种方法， **真的非常危险** ，有可能导致


别人在调用更新方法的时候不小心就把你的某些字段置为null 了。


这里推荐一种方法，也是官网给出的，但是必须要求mp的版本 大于3， 如果是3以下的版本没


有这个功能，就是使用UpdateWrapper.


比如，我们想把 user表中的gender设置为空：



<img src="/img/mybatis.pdf-46-4.png">46-4



通过UpdateWrapper 可以设置null.


官网说明


<img src="/img/mybatis.pdf-47-0.png">47-0
**mybatis-mapper.xml中大于等于、小于等于**


**笔记本：** mybatis


**创建时间：** 2022/5/6 18:49 **更新时间：** 2022/5/6 18:57


**作者：** 彼岸樱速


**标准写法如下** ：


**第一种写法** ：


|原符<br>号|<|<=|>|>=|&|'|"|
|---|---|---|---|---|---|---|---|
|替换<br>符号|**&lt;**|**&lt;=**|**&gt;**|**&gt;=**|**&amp;**|**&apos;**|**&quot;**|






|第二种写法：|Col2|
|---|---|
|大于等于|**<<img src="/img/CDATA[ >= ]]>**|
|小于等于|**<<img src="/img/CDATA[ <= ]]>**|




**mybatis中${}既然可能会出现sql注入的情况，为什么还要用**


**笔记本：** mybatis


**创建时间：** 2022/4/6 14:39 **更新时间：** 2022/4/6 15:04


**作者：** 彼岸樱速


**mybatis中${}既然可能会出现sql注入的情况，为什么还要用呢？**

<img src="/img/mybatis.pdf-49-0.png">49-0

**首先我们看下Mybatis中#{}与${}的区别**





<img src="/img/mybatis.pdf-49-1.png">49-1

**接下来我们来看一下什么是sql注入**

<img src="/img/mybatis.pdf-49-2.png">49-2

**mybatis中的${}是怎么引起SQL注入的呢**







<img src="/img/mybatis.pdf-49-3.png">49-3

**既然${}可能会出现sql注入的情况，为什么还要用？**







<img src="/img/mybatis.pdf-49-4.png">49-4

**预编译为什么能防sql注入？**




<img src="/img/mybatis.pdf-50-0.png">50-0



**预编译就一定安全？**



<img src="/img/mybatis.pdf-50-1.png">50-1



**有些特殊的场景怎么办？**



<img src="/img/mybatis.pdf-50-2.png">50-2


**tkmybatis VS mybatisplus**


**笔记本：** mybatis


**创建时间：** 2021/11/16 17:44 **更新时间：** 2021/11/16 17:52


**作者：** 彼岸樱速


**TkMybatis Vs MybatisPlus**
**1.基础CRUD BaseMapper**


基本一样，只是方法名不一样，tk和MBG更贴切


**2.代码生成器**
**Mybatis-Plus**



<img src="/img/mybatis.pdf-52-0.png">52-0


**Tk-Mybatis**





**3. 全局主键 Sequence主键**

<img src="/img/mybatis.pdf-53-1.png">53-1
**Mybatis-Plus**





**Tk-Mybatis**





两种策略是不太一样的。@KeySql(genId = UUIdGenId.class) ，Mapper 4.0.2


**4. 热加载**

<img src="/img/mybatis.pdf-53-3.png">53-3
**Mybatis-Plus**





**TK-Mybatis**





**5. 分页**
**Mybatis-Plus**





**Tk.Mybatis**





**6. 额外功能**

<img src="/img/mybatis.pdf-53-7.png">53-7
**Mybatis-Plus**





**Tk.Mybatis**




**MyBatis使用@SelectProvider拼接sql语句**


**笔记本：** mybatis


**创建时间：** 2021/11/16 17:31 **更新时间：** 2021/11/16 17:33


**作者：** 彼岸樱速

### **MyBatis使用@SelectProvider拼接sql语句**

如果使用 MyBatis 注解方式写 sql ，又想要 XML 写法的判断入参拼接条件，可以通过


**新建Provider**



<img src="/img/mybatis.pdf-54-2.png">54-2



这里的 para 会包含 6 个值，也就是 2 倍的入参参数，可以通过 key 方式或者 index 方式获取对应参
数。


**新建Entity**



<img src="/img/mybatis.pdf-54-6.png">54-6





**编写Mapper方法**

```
 @SelectProvider(type = RateProvider.class, method = "getFinishRate")

 @Results({

 @Result(property = "homeworkType", column = "homework_type"),

   @Result(property = "deviceType", column = "device type"),

```

<img src="/img/mybatis.pdf-55-0.png">55-0


**MyBatis开发，你用 xml 还是注解**


**笔记本：** mybatis


**创建时间：** 2021/11/16 16:38 **更新时间：** 2021/11/16 17:19


**作者：** 彼岸樱速

# **MyBatis开发，你用 xml 还是注解**

最近在看公司项目时发现有的项目mybatis是基于注解开发的,而我个人的习惯是基于xml文件开

发。


对于mybatis注解开发的原理理解不够，于是翻阅了部分源码，写下此文。主要介绍了mybatis开

发的两种形式、三种写法。还有一点瞎思考，介绍了一处骚代码、还有一个坑。


原创不易，感谢阅读，感谢关注，感谢点赞，感谢转发。


**两种形式，三种写法**


最近在看公司的一些项目的时候发现有的项目里面的 mybatis 是基于注解开发的。而我个人的习

惯是基于 xml 文件开发。


所以对于基于注解开发的原理不太了解，于是去翻看了一下相关源码，形成此文。


本文主要介绍基于 mybatis 开发的两种形式，三种写法。


其中两种形式是指：


1.基于 xml 文件。


2.基于注解开发。


三种写法是指除了 xml 的形式外，注解又有两种不同的写法，它们的实现原理也略有不同，拿

Select 语句举例，就有两种注解 @Select、@SelectProvider 。


**演示示例**


先上一个演示示例给大家直观的感受一下：


首先，我们有个用户表，包含这些字段和这样一条数据：


然后我们搞个接口类，用三种方式去查询用户的年龄，具体如下：


**xmlQueryAgeByName** **方法是使用 xml 的方法去查询用户年龄** ，对应的 xml 如下：



<img src="/img/mybatis.pdf-56-0.png">56-0
<img src="/img/mybatis.pdf-57-0.png">57-0

**annotationQueryAgeByName** **方法是使用 @Select 注解去查询用户的年龄** ，SQL

就写在注解里面：


**classQueryAgeByName** **方法是使用 @SelectProvider 注解去查询用户的年龄** ，

可以看到注解里面有个 type 字段，对应一个 class 类。一个 method 字段，对应 class 类中的

一个方法：


其中 UserInfoSql 类如下：


然后，再来一个测试用例，把三个方法都测试一下：


最后的输出结果如下：



<img src="/img/mybatis.pdf-57-1.png">57-1

<img src="/img/mybatis.pdf-57-2.png">57-2



测试用例就演示完成了，是一个极简的用例。


我就是基于这个案例去分析源码的，在分析之前，其实有点经验的老哥也能看出来了，我们先撇


开常规的 xml 文件的形式不谈。


基于 @Select 注解的接口， SQL 就在注解里面，所以我们只需要通过反射取出注解里面的

SQL 进行分析就行了。


基于 @SelectProvider 注解的接口，SQL 虽然在一个类的方法中，但是注解上都告诉你是哪个

类的哪个方法了，所以，一定是基于反射去取出方法里面的 SQL 的。


接下来，我们就是去验证一下。


**小心求证**


首先，我先问你一个问题。SpringBoot 是怎么加载 mybatis 的？


熟悉 SpringBoot 启动过程的朋友知道，SpringBoot 会去加载mybatis-spring-boot
autoconfigure-x.x.x.jar下 META-INF 中的spring.factories文件：


所以，下面的 sqlSessionFactory 方法就是我们的入口处：


入口给你找到了，你可以直接在这里加上断点开始 debug 了。


我知道，虽然是刚刚开始，但是可能有些读者觉得已经超纲了。但是没有关系的，继续看下去，


我这里只是给你说个入口在哪而已。


由于 debug 的过程不是文本重点，这里就不去介绍了。debug 的时候我们会看到这个方法：



<img src="/img/mybatis.pdf-58-0.png">58-0

<img src="/img/mybatis.pdf-58-1.png">58-1

<img src="/img/mybatis.pdf-58-2.png">58-2



这个方法的第 92 行，就是我们的 xml 内容：


<img src="/img/mybatis.pdf-59-0.png">59-0

然后在下面这个方法中对 xml 文件进行疯狂的解析：





图片可以点开看大图哦，debug 模式，可以看到一些输出：


**上面的源码的第 94 行，获** **取 SqlSource 很关键，要好好看看** ，这里调用了这个方法：


接着在下面方法的第 52 行，剥离出整个完整的 sql：



<img src="/img/mybatis.pdf-59-2.png">59-2

<img src="/img/mybatis.pdf-59-4.png">59-4
<img src="/img/mybatis.pdf-60-1.png">60-1

上面就是常规的 xml 形式的 SQL 原始语句（变量、条件表达式都还未进行替换，不可直接执行

的 SQL）获取过程，不是本文重点，简单的分析一下就行。


接下来继续 debug 的时候会遇到下面这个方法，看包名你就知道，这就是我们关心的注解解析

相关的方法了：





在这个方法里面，会去循环处理 mapper 类中的方法：


接下来，就会遇到这个方法了：


当循环到 annotationQueryAgeByName 方法的时候，下面方法的一些关键参数如下所示：



<img src="/img/mybatis.pdf-60-3.png">60-3
<img src="/img/mybatis.pdf-61-0.png">61-0

首先我们看 428 行，解析到了 sqlAnnotationType 为 Select：


所以会进入下面的 if 分支，然后运行到 435 行，通过反射获取到了 @Select 注解上的 SQL 语

句：


继续往下走，通过 436 行，我们可以走到这个方法：


这个方法就有点意思了，进来判断了 script 即 SQL 是否是以 script 脚本开头的，如果是，则走

的和之前 xml 一样的解析逻辑：



<img src="/img/mybatis.pdf-61-2.png">61-2
**我第一次看到这个地方的时候，一下才恍然大悟过来，我才明白，@Select 的本质还**
**是 xml 文件的形式啊。只是换了个展现形式而已。**


我之前的一个问题，或者说是错误的看法也就迎刃而解了。


我之前认为 @Select 的方式是只能支持简单 SQL 的书写，对于一些类似于判空的需求是不支持

的。（因为对 mybatis 注解开发确实不熟）


比如在 xml 文件中这样去写：





<img src="/img/mybatis.pdf-62-1.png">62-1

只是这个写法，呃，怎么说呢，非常不优雅。


不要为了注解而注解，很明显，这种情况直接用 xml 形式更好。


到这里，我们也知道了， **基于 @Select 注解的方式开发时, mybatis 会通过反射获取到**
**注解里面的 SQL ，而这些 SQL 需要一些比较复杂功能，比如判断条件是否为空时，**
**可以用 script 标签包裹起来** 。写法和在 xml 里面开发是一样的。


接下来，我们看看 @SelectProvider 方法是什么个样式。


还是在同样的方法中，只是走向了另外一个分支：


此时的 sqlProviderAnnotation 里面的东西如下：



<img src="/img/mybatis.pdf-62-2.png">62-2

<img src="/img/mybatis.pdf-62-3.png">62-3
接着去 new ProviderSqlSource 对象：


在这个方法中，获取到了注解上的具体的提供 SQL 原始语句的方法。


**注意红框中框起来的 providerMethod 对象，后面获取真正执行的 SQL 语句的时候**
**还会用到。**


同时，我们可以看到 ProviderSqlSource 是 SqlSource 的实现类。


所以，不管是 xml 还是注解，最终都需要获取到一个 SqlSource 对象。


而在本文的示例代码中， xml 和 @Select 生成的是 RawSqlSource。


@SelectProvider 生成的是 ProviderSqlSource。他们里面放的东西是不一样的。


在 RawSqlSource 里面的 sqlSource 变量（类型 StaticSqlSource）放的已经是从 xml 或者

@Select 注解中获取到的 SQL 原始语句了（但是里面的变量还没替换，因为程序启动过程中根

本不知道变量的值具体是什么，如果有一些条件表达式的话同理）。



<img src="/img/mybatis.pdf-63-0.png">63-0

<img src="/img/mybatis.pdf-63-1.png">63-1
<img src="/img/mybatis.pdf-64-0.png">64-0

而在ProviderSqlSource 里面，我们前面已经说了，放的是 @SelectProvider 注解上具体的提供

SQL 语句的方法，仅仅是方法，而不是语句。


前面的所有分析都是在我们的方法真正执行之前，接下来，才会 debug 到我们的测试用例，因

为只有我们的测试用例里面才有真正的入参， mybatis 才能根据入参，执行最终的 SQL 语句。


进入 getBoundSql 我们可以看到第292行，就是通过 sqlSource 的 getBoundSql 方法获取到的

boundSql 对象：



<img src="/img/mybatis.pdf-64-1.png">64-1

<img src="/img/mybatis.pdf-64-2.png">64-2



<img src="/img/mybatis.pdf-64-4.png">64-4
**这不就又呼应上了吗？又看到 sqlSource 了。**


所以，接下来，我们看一下这两个方法就可以了：


首先看一下 StaticSqlSource 的实现：


里面的一些关键参数如下：


首先可以 sql 变量，里面是一条待加工的 SQL 语句，我们前面已经分析过了，程序启动的过程

中，这里为什么不替换呢？


因为不知道换成啥呀。


**那你觉得在这个地方会替换吗？**


还是不会的。虽然我们已经告诉 mybatis ， userName 就是 why 了，但如果在这个地方把 why

带到 SQL 里面去，我们倒是可以获得一个完整的正确的 SQL。


但是，如果我们传入的是 “why or 1=1”呢？


这是什么东西我相信你一下就恍然大悟了吧，SQL 注入呀。


另外插一句，如果想看 SQL 注入的情况，就是走到 DynamicSqlSource 的情况，在 xml 中把 #

换成 $ 就行，有兴趣的可以试一试。


我这里只是给你截个图，瞅一眼：



<img src="/img/mybatis.pdf-65-1.png">65-1

<img src="/img/mybatis.pdf-65-2.png">65-2
<img src="/img/mybatis.pdf-66-0.png">66-0

好了，我们接着刚才继续说。


继续 debug 会走到这方法中去：





而这个方法的第 62 行，prepareStatement，这个东西不用说了吧，从学 JDBC 的时候就用上它

了，老朋友了：


最后去执行真正的查询操作，处理返回值。


接着看 ProviderSqlSource 的实现，注意看我圈起来的那部分的分支判断：


无非就是判断有几个参数，反射方法调用的时候需要怎么传参而已。最终会调用到这个方法里面


来获取 SQL 语句：



<img src="/img/mybatis.pdf-66-2.png">66-2

<img src="/img/mybatis.pdf-66-3.png">66-3
<img src="/img/mybatis.pdf-67-0.png">67-0

可以看一下这个时候 providerMethod 和 sql 变量分别是什么：


而这里这个 providerMethod 怎么来的知道了吧？我们前面刚刚分析过了。


new ProviderSqlSource 对象的时候，我还专门说了：“注意红框中框起来的 providerMethod 对

象，后面获取真正执行的 SQL 语句的时候还会用到。”


就是在这个地方用到的。


你看，又呼应上了。


这个时候，我们获取到了原始的 SQL 语句了，也有参数了，这样的场景和我们刚刚分析的情况


就一模一样了，所以后面的逻辑都一样，进行了代码复用：


进入第 98 行，也就是下面这个我们之前分析过的方法：





在这个方法中，返回了一个 StaticSqlSource 对象：


再次呼应，流程是一样一样的。


另外，再说一下，用 @SelectProvider 注解时的 class 对象里面的方法还可以这样去写，有兴趣

的可以去研究一下：


好了，我们的论证部分就算是完了，我发现这个东西，用视频真的几分钟就讲清楚了，描述起来


还是有点困难的，难道是在逼我当UP主吗？


不知道大家看的是否明白了，如果对 mybatis 了解不多的朋友可能看起来有一点吃力，但是没有

关系， **你就把这篇文章当做一个导读，然后自己搞个 Demo 跑起来，玩一玩就行。**



<img src="/img/mybatis.pdf-67-2.png">67-2

<img src="/img/mybatis.pdf-67-3.png">67-3
**个人思考**


其实在写这篇文章的时候我就产生了一个思考。


mybatis 为什么要去支持注解呢？


当然，我们都知道，基于注解开发是趋势，给我们简化了非常多的东西。


特别是 SpringBoot 的出现，可以说是注解开发的黄金时代。


遥想当年刚刚入行的时候，开发一个 SSM 项目大多数时间都是在进行 xml 文件的配置。


可以说是很羡慕现在入行的小年轻了，没有真正经历（也许自己搭建过，玩了一下）过被 xml


配置支配的恐惧。


在 xml 时代，大家都是粘来粘去的。而现在基于注解开发了，很多东西都简化了，渐渐的自己


也能很轻松的搭建一个可以跑起来的小项目了。


所以，基于注解开发大体上一件很优雅，很好，很值得推广的事情。


为什么说大体上呢？


因为我个人偏见的觉得对于 mybatis 框架来说，没有 xml 文件的 mybatis 是没有灵魂的。


当然，如果你全是简单的 SQL 语句就能实现的功能，你可以用注解开发。但是这个情况，我觉


得还是在少数的。


同样，我们可以用注解的形式实现所有 xml 文件能实现的功能。但是我觉得不太优雅。


所以，我觉得一个比较折中的方式是简单 SQL 可以用注解开发，如果是一些有诸如条件判断类


的需求的 SQL 还是要写在 xml 文件中。


不要为了拥抱注解，而完全摒弃了 xml 的形式。


你记得吗，在 xml 时代转向注解时代的时候，还有一个经常用到的注解。


有人说这是过渡时代的产物，而在我看来，这更是求同存异的完美体现。


这个注解，就完全的体现最近这句很火的话：


君子美美与共，和而不同。


当然这些都是我在写这篇文章的过程中产生的一些浅显的个人看法而已。不具备参考意义。


**骚代码**


另外，再给大家分享一个我认为的 mybatis 的骚代码吧。



<img src="/img/mybatis.pdf-68-0.png">68-0
代码非常的简单明了，很久以前第一次看 mybatis 源码的时候我就是觉得有点“骚”，给我留下了

深刻的影响：


selectOne 方法：


该方法调用的还是 selectList 方法，但是对返回集合进行了一个判断，如果集合大小为 1，说明


就真的是 selectOne ，如果大于 1，则抛出异常。


说真的，如果让我去实现这个功能，我不会一下就想到这个方法，我会去老老实实的写功能，然


后对返回值进行判断。写完之后，我可能才会发现。哎，这段代码和 selectList 方法可以复用


哦，然后才提取出来，变成这样。


记得很久之前面试，面试官问我对看过的源码中哪段影响深刻的，其中我就说到了这个方法。


总之，我个人觉得很妙。


**注意坑**


然后再说一个之前踩过的坑吧，还导致了一次紧急上线。


还是拿文中的示例说明：


如果我们把返回值从 Integer 变成 int：


用这个测试用例还是会正常查询出结果：


但是，如果我们查询一个数据库中不存在的人的年龄呢？比如这样：



<img src="/img/mybatis.pdf-69-1.png">69-1

<img src="/img/mybatis.pdf-69-2.png">69-2
<img src="/img/mybatis.pdf-70-0.png">70-0

那么就会抛出这样的错误：


找到对应源码，我们可以看到：


当返回值是 null 的时候，但是方法上的返回值类型又不是包装类型中的一种，也不是 void 类


型，则抛出异常。


看一下这个方法，是 native 的：


java.lang.Class#isPrimitive



<img src="/img/mybatis.pdf-70-1.png">70-1
<img src="/img/mybatis.pdf-71-0.png">71-0

你想想为什么 mybatis 给你进行了这样的一个判断呢？


那就是如果返回为 null ，自动拆箱的时候会抛出空指针的。


即使 mybatis 帮我们挡了一下，我还是完美的踩了一个坑，写出了空指针异常。


代码是这样的，接收的时候我还是用 Integer 去接收了：


但是接口调用时的返回值我手贱写成了这样：


明白了吧，妥妥的，空指针，没得跑了。


**网友评论**


还是得写下个人理解


1、之前mybatis，在公司的项目基本全都是xml方式，从未见过有人使用注解方式；



<img src="/img/mybatis.pdf-71-1.png">71-1

<img src="/img/mybatis.pdf-71-2.png">71-2
2、后来升级到mybatis-plus，就mapper，service继承了比如说BaseService，或者

BaseMapper之后，一些通用的增删查改，基本都不用再写sql了 ，基本都是QueryWrapper的eq

方法啊，in方法啊，就可以实现一些简单的sql拼接了。

3、然后来到第二家公司之后，我发现他们使用mybatis的方式不太一样，虽说因为分库分表，自

己定义路由规则，就自己在代码里面拼接sql得比较多。

4、然后发现一个 **tk.mybatis** ，这个其实就是跟mybatis-plus差不多的另一个开源的东西。

5、tk.mybatis这个呢，网上有个说法是，更加接近开源，其实就是用得比较多的

@SelectProvider这种注释的拼接sql的写法。实际上，跟mybatis-plus的eq方法，in方法，应该

都是差不多的东西。


6、然后结合网上说的，就是，基本上大部分都是用xml的形式来得到sql，xml动态sql拼接其实

更加灵活，更适用于复杂的sql查询，但是像mybatis-plus这样，或者tk.mybatis也好，这种eq方

法，in方法，以及@SelectProvider注解的写法，其实都是，在代码里面动态拼接sql的一种写

法，原因就是，我们不是所有的查询都是那么复杂的，很多一些查询都是通用的，所以就有了


selectOne，selectList这种便捷的方式。


**结论**
其实结论就是，三种方式都可以使用，通用的基本就是xml方式了，注解方式其实更加适合于一
些通用的，简单的sql查询，所以我们也不用拘泥于某一种写法而不灵活变通，具体什么场景，
用什么方式，需要自己想清楚。


**mybatis 3 中 @SelectProvider的用法总结**


**笔记本：** mybatis


**创建时间：** 2021/11/16 11:02 **更新时间：** 2021/11/16 11:31


**作者：** 彼岸樱速


**mybatis 3 中 @SelectProvider的用法总结**


mybatis 3 中增加了使用注解来配置 Mapper 的新特性，其中 @Provider 的使用方式较为复杂。 @provide 主要分


为四种： @InsertProvider 、 @DeleteProvider 、 @UpdateProvider 和 @SelectProvider ，分别对应着 sql 中的增


删改查四种操作。本文主要介绍一下 mybatis 3 中 @SelectProvider 的使用技巧。


**1、@SelectProvider源码**


**2、@SelectProvider的使用**


@SelectProvider 是声明在方法上的，这个方法定义在 Mapper 对应的的 interface 上。如下所示：


上例中是个很简单的 Mapper 接口，其中定义了一个方法： getUser ，这个方法根据提供的用户 id 来查询用户信


息，并返回一个 User 实体 bean 。这是一个很简单很常用的查询场景：根据 key 来查询记录并将结果封装成实体


bean 。其中：


（ 1 ） @SelectProvider 注解用于生成查询用的 sql 语句，有别于 @Select 注解， @SelectProvide 指定一个 Class 及


其方法，并且通过调用 Class 上的这个方法来获得 sql 语句。在我们这个例子中，获取查询 sql 的方法是


SqlProvider.selectUser 。


（ 2 ） @ResultMap 注解用于从查询结果集 RecordSet 中取数据然后拼装实体 bean 。


**3、定义拼装sql的类**


@SelectProvide 中 type 参数指定的 Class 类，必须要能够通过无参的构造函数来初始化。


@SelectProvide 中 method 参数指定的方法，必须是 public 的，返回值必须为 String 。


**4、无参数@SelectProvide方法**


在 Mapper 接口方法上和 @SelectProvide 指定类方法上，均无参数：


UserMapper.java ：

```
@SelectProvider(type = SqlProvider.class, method = "selectAllUser")

```


<img src="/img/mybatis.pdf-73-0.png">73-0

<img src="/img/mybatis.pdf-73-1.png">73-1

<img src="/img/mybatis.pdf-73-2.png">73-2
SqlProvider.java ：


**5、一个参数的@SelectProvide方法**


对于只有一个参数的情况，可以直接使用，参见前面的 getUser 和 selectUser 。


但是，如果在 getUser 方法中，对 userId 方法使用了 @Param 注解的话，那么相应 selectUser 方法必须接受


Map<String, Object> 做为参数：


UserMapper.java ：


SqlProvider.java ：


**6、更多参数的@SelectProvide方法**


在超过一个参数的情况下， @SelectProvide 方法必须接受 Map<String, Object> 做为参数。


如果参数使用了 @Param 注解，那么参数在 Map 中以 @Param 的值为 key ，如下例中的 userId 。


如果参数没有使用 @Param 注解，那么参数在 Map 中以参数的顺序为 key ，如下例中的 password 。


UserMapper.java ：


SqlProvider.java ：


**7、注意事项**


在 Mapper 接口和 @SelectProvide 方法类中，不要使用重载，也就是说，不要使用方法名相同参数不同的方


法，以避免发生诡异问题。

## **01、前言**


为什么会写这篇文章, 因为在看到 `MapperAnnotationBuilder` 构造方法初始化时, 发现了四个从未见过
的注解

```
 public MapperAnnotationBuilder(Configuration configuration, Class`<`  `?`> type) {

 ...

 sqlAnnotationTypes.add(Select.class);
 sqlAnnotationTypes.add(Insert.class);

 sqlAnnotationTypes.add(Update.class);
 sqlAnnotationTypes.add(Delete.class);

```

<img src="/img/mybatis.pdf-75-0.png">75-0



@SelectProvider、@InsertProvider、@UpdateProvider、@DeleteProvider


分别是 mybatis 定义的 **另类增删改查注解**

## **02、介绍篇**


四个注解中分别都有两个属性, 这里以 @SelectProvider举例


可以看到, 两个属性并没有默认值, 证明定义注解的话, 这两个属性必须组合使用


没有看到这一块的具体解析源码, 不过也能猜出来, 根据反射调用方法获取的返回值



<img src="/img/mybatis.pdf-75-1.png">75-1


## **03、实战篇**

如何根据注解定义 sql 语句呢, 首先定义 mapper 接口

```
 public interface AutoConstructorMapper {

 @SelectProvider(type = SubjectSqlProvider.class, method = "getSubjectTestProvider")

 PrimitiveSubject getSubjectTestProvider(@Param("id") int id);

 }

```

@Param() 为必须, 在解析时会将参数定义为 map, 进行调用指定 method


创建 type 对应的存放 sql 语句的类, 以及定义返回 sql 语句的方法


有三点需要注意:


方法入参必须为 Map
方法的权限修饰符 必须是 public
方法返回的必须是拼接好的 sql 字符串

```
 public class SubjectSqlProvider {
 public String getSubjectTestProvider(Map<String, Object> params) {

 return new SQL()
 .SELECT("*")

 .FROM("subject")

 .WHERE("id = " + params.get("id"))
 .toString();

 }

 }

 }

```

SQL 类是 mybatis 提供开发者在代码中灵活编写 sql 语句的工具类

## **04、思考篇**


思考一下, `@SelectProvider` 注解, 与 `@Select` 注解解析流程有什么不同?


`@Select` 与 `@SelectProvider` 只是在定义注解的方式上有所不同, 一个是直接定义 sql, 一个是在外部定
义好 sql 直接引用, 没有质的区别


在 mybatis 初始化定义 `MappedStatement` 时, 使用了两种不同的逻辑进行组装 `SqlSource`

```
 Class`<`  `?` extends Annotation> sqlAnnotationType = getSqlAnnotationType(method);
 Class`<`  `?` extends Annotation> sqlProviderAnnotationType = getSqlProviderAnnotationType(metho

 d);
 if (sqlAnnotationType != null) {

 if (sqlProviderAnnotationType != null) {
 throw new BindingException("You cannot supply both a static SQL and SqlProvider to

 method named " + method.getName());

 }

 Annotation sqlAnnotation = method.getAnnotation(sqlAnnotationType);

 final String[] strings = (String[]) sqlAnnotation.getClass().getMethod("value").invoke
 (sqlAnnotation);

 return buildSqlSourceFromStrings(strings, parameterType, languageDriver);
 } else if (sqlProviderAnnotationType != null) {

 Annotation sqlProviderAnnotation = method.getAnnotation(sqlProviderAnnotationType);
 return new ProviderSqlSource(assistant.getConfiguration(), sqlProviderAnnotation, type,

 method);

 }

## **05、使用篇**

```

这里介绍下 mybatis 具体编写 SQL 的三种形式, 以及介绍不同的方式对应的使用场景


**5.1 @Select**


这种方式能够定义简单的 sql, 不涉及复杂查询和多参数的场景, 类似下述方式


@Select 定义 sql 的方式是最简单的, 省去了定义 xml文件的繁琐, 也少了定义编写 @SelectProvider
对应类和方法的步骤





**5.2 @SelectProvider**


这种方式编写sql适合编写中等长度, 简单的查询搭配 join、group、order…


SQL 工具类提供了这种简单的 API 语法, 还是比较方便的


如果不想使用 SQL 工具类, 自己编写 sql 字符串也是可以的


**5.3 .xml 文件**



<img src="/img/mybatis.pdf-76-1.png">76-1
这种方式就不多说了, 功能全部具备, 比如计算函数、动态SQL、各种关键字都支持


这几种方式都能够实现我们的 sql 编写需求, 只不过针对不同的场景, 合理的使用即可

## **06、总结篇**


看 mybatis 源码, 对变量、方法的命名加深了感触, 一个好的变量或者方法命名在代码中是多么有必要


`getSqlSourceFromAnnotations` 是不是要比 `getSqlSource` 要好理解很多, 看了之后就能让阅读者知道这
个方法要做什么功能


**mybatisplus比mybatis到底好在哪里?**


**笔记本：** mybatis


**创建时间：** 2021/11/2 20:50 **更新时间：** 2021/11/2 20:50


**作者：** 彼岸樱速


1. **无侵入** ：只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑
2. **损耗小** ：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作
3. **强大的 CRUD 操作** ：内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部

分 CRUD 操作，更有强大的条件构造器，满足各类使用需求
4. **支持 Lambda 形式调用** ：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写

错
5. **支持主键自动生成** ：支持多达 4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自

由配置，完美解决主键问题
6. **支持 ActiveRecord 模式** ：支持 ActiveRecord 形式调用，实体类只需继承 Model 类即可进行

强大的 CRUD 操作
7. **支持自定义全局通用操作** ：支持全局通用方法注入（ Write once, use anywhere ）
8. **内置代码生成器** ：采用代码或者 Maven 插件可快速生成 Mapper 、 Model 、 Service 、

Controller 层代码，支持模板引擎，更有超多自定义配置等您来使用
9. **内置分页插件** ：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页

等同于普通 List 查询
10. **分页插件支持多种数据库** ：支持 MySQL、MariaDB、Oracle、DB2、H2、HSQL、SQLite、

Postgre、SQLServer 等多种数据库
11. **内置性能分析插件** ：可输出 Sql 语句以及其执行时间，建议开发测试时启用该功能，能快速揪出

慢查询
12. **内置全局拦截插件** ：提供全表 delete 、 update 操作智能分析阻断，也可自定义拦截规则，预

防误操作


**Mybatis配置和接口映射原理**


**笔记本：** mybatis


**创建时间：** 2021/10/9 2:04 **更新时间：** 2021/10/9 2:05


**作者：** 彼岸樱速


Mybatis可以把Mapper.xml文件直接映射到对应的接口，调用接口方法会自动去Mapper.xml文件


中找到对应的标签，这个功能就是利用java的动态代理在binding包中实现的。


**一、注册Mapper**


在初始化时会把获取到的Mapper接口注册到MapperRegistry，注册的时候创建一个Mapper代理


工厂，这个工厂通过JDK的代理创建一个执行对象，创建代理需要的InvocationHandler为


MapperProxy
```
 public class MapperRegistry{

 public <T> void addMapper(Class<T> type){

 if (type.isInterface()) {

 if (hasMapper(type)) {

 throw new BindingException("Type " + type + " is already known to the
 MapperRegistry."} );

 boolean loadCompleted = false;

 try {
```

_`//`_ 放到 _`map`_ 中 _`, value`_ 为创建代理的工厂

```
 knownMappers.put(type, new MapperProxyFactory<T>(type));

 // It's important that the type is added before the parser is run

 // otherwise the binding may automatically be attempted by the mapper parser.
```

_`If the type is already known, it won't try.//`_ 这里是解析 _`Mapper`_ 接口里面的注解

```
 MapperAnnotationBuilder parser = new MapperAnnotationBuilder(config, type);

 parser.parse();

 loadCompleted = true;

 } finally {

 if (!loadCompleted) {

 knownMappers.remove(type);

 }

 }

 }

 }

 }

```

**二、获取接口对象**


从knownMappers中根据接口类型取出对应的代理创建工厂，用该工厂创建代理。



<img src="/img/mybatis.pdf-79-4.png">79-4




















<img src="/img/mybatis.pdf-80-0.png">80-0























































**三、调用接口方法**


调用代理方法会进入到MapperProxy的public Object invoke(Object proxy, Method method,


Object[] args)方法

```
 private final SqlSession sqlSession;

 private final Class`<`T`>` mapperInterface;

 private final Map<Method, MapperMethod> methodCache;

 public MapperProxy(SqlSession sqlSession, Class`<`T`>` mapperInterface,
 Map`<`Method, MapperMethod`>` methodCache){this.sqlSession = sqlSession;

 this.mapperInterface = mapperInterface;

 this.methodCache = methodCache;

 }

 public Object invoke(Object proxy, Method method, Object[] args) throws
```

`Throwable {` _`//`_ 如果方法是 _`Object`_ 里面的则直接调用方法

```
 if (Object.class.equals(method.getDeclaringClass())) {

 try {

 return method.invoke(this, args);

 } catch (Throwable t) {

 throw ExceptionUtil.unwrapThrowable(t);

```

```
}

```

```
}

```


_`//`_ 获取执行方法的封装对象

```
 final MapperMethod mapperMethod = cachedMapperMethod(method);

```

_`//`_ 里面就是找到对应的 _`sql`_ 执行 _`sql`_ 语句

```
 return mapperMethod.execute(sqlSession, args);

 }

```

_`//`_ 缓存 _`,`_ 不需要每次都创建

```
 private MapperMethod cachedMapperMethod(Method method){

 MapperMethod mapperMethod = methodCache.get(method);

 if (mapperMethod == null) {

```

_`//`_ 传人配置参数

```
 mapperMethod = new MapperMethod(mapperInterface, method,
 sqlSession.getConfiguration());methodCache.put(method, mapperMethod);

 }

 return mapperMethod;

 }

 }

```

最终执行sql会进入到MapperMethod中execute方法：




```
private final SqlCommand command;

private final MethodSignature method;

public MapperMethod(Class`<`  `?`> mapperInterface, Method method, Configuration
```

`config){` _`//SqlCommand`_ 封装该接口方法需要执行 _`sql`_ 的相关属性，如： _`id(name),`_ 类型

```
this.command = new SqlCommand(config, mapperInterface, method);
```

_`//`_ 执行方法特性进行封装，用于构造 _`sql`_ 参数，判断执行 _`sql`_ 逻辑走哪条分支

```
this.method = new MethodSignature(config, method);

}

public Object execute(SqlSession sqlSession, Object[] args){

Object result;
```

_`//`_ 先找到对应的执行 _`sql`_ 类型 _`, sqlSession`_ 会调用不同方法

```
if (SqlCommandType.INSERT == command.getType()) {

Object param = method.convertArgsToSqlCommandParam(args);

result = rowCountResult(sqlSession.insert(command.getName(), param));

} else if (SqlCommandType.UPDATE == command.getType()) {

Object param = method.convertArgsToSqlCommandParam(args);

result = rowCountResult(sqlSession.update(command.getName(), param));

} else if (SqlCommandType.DELETE == command.getType()) {

Object param = method.convertArgsToSqlCommandParam(args);

result = rowCountResult(sqlSession.delete(command.getName(), param));

```

`} else` `if (SqlCommandType.SELECT == command.getType()) {` _`//`_ 如果是查询 _`,`_ 需要对返回做

```
if (method.returnsVoid() && method.hasResultHandler()) {

executeWithResultHandler(sqlSession, args);

result = null;

} else if (method.returnsMany()) {

result = executeForMany(sqlSession, args);

} else if (method.returnsMap()) {

result = executeForMap(sqlSession, args);

} else {

Object param = method.convertArgsToSqlCommandParam(args);

result = sqlSession.selectOne(command.getName(), param);

}

} else {

throw new BindingException("Unknown execution method for: " +
command.getName());}

```

```
 if (result == null && method.getReturnType().isPrimitive() &&
 !method.returnsVoid()) {throw new BindingException("Mapper method '" + command.getName()

 + " attempted to return null from a method with a primitive return type (" +
 method.getReturnType()+ ")."); }

 return result;

 }

 }

```

上面就是根据接口、方法、配置参数找到对应的执行sql，并构造参数，解析执行结果，具体sql


执行在sqlSession流程里面


**mybatis plus开启二级缓存**


**笔记本：** mybatis


**创建时间：** 2021/10/7 1:35 **更新时间：** 2021/10/7 1:36


**作者：** 彼岸樱速


开启二级缓存
mybatis 默认开启一级缓存,同一个sqlsession中相同的操作只会从磁盘上获取一次
作用范围：同一个sqlsession


mybatis plus开启二级缓存只需要两步
1、启动类：@EnableCaching //允许二级缓存
2、需要缓存的service层上面加上注解 如：@Cacheable(value = “SeatPerson”, key =
“#areaNo”)
注：key为传入的值，相当于map中的key当下次请求时发现该key存在，不会再去数据库层进行
sql查询，直接从缓存中取；
value用于缓存值的对象，当你更换对象后之前缓存对象中的值不能继续拿到，会重新执行sql,
存储给新的value对象
可用注解如下：



<img src="/img/mybatis.pdf-83-0.png">83-0



作用范围：namespace （二级缓存是用来解决一级缓存不能跨会话共享的问题的，范围是
namespace 级别的，可以被多个SqlSession 共享（只要是同一个接口里面的相同方法，都可
以共享））


优先级：二级缓存》一级缓存》查询数据库


缓存解决了那些问题：
1.存在内存中的临时数据
2.将用户经常查询的数据放在缓存（内存）中，用户去查询数据就不用从磁盘上(关系型数据库
数据文件)查询，从缓存中查询，从而提高查询效率，解决了高并发系统的性能问题。
3、减少和数据库的交互次数，减少系统开销，提高系统效率。


什么样的条件需要使用缓存？
经常查询并且不经常改变的数据。


**mybatis一级缓存二级缓存**


**笔记本：** mybatis


**创建时间：** 2021/10/7 0:22 **更新时间：** 2021/10/7 1:32


**作者：** 彼岸樱速


**一级缓存**



<img src="/img/mybatis.pdf-84-1.png">84-1

为什么要使用一级缓存，不用多说也知道个大概。但是还有几个问题我们要注意一下。


**1、一级缓存的生命周期有多长？**


b、如果SqlSession调用了close()方法，会释放掉一级缓存PerpetualCache对象，一级缓存将不可用。


c、如果SqlSession调用了clearCache()，会清空PerpetualCache对象中的数据，但是该对象仍可使用。





**2、怎么判断某两次查询是完全相同的查询？**


mybatis认为，对于两次查询，如果以下条件都完全一样，那么就认为它们是完全相同的两次查询。


2.1 传入的statementId


2.2 查询时要求的结果集中的结果范围





2.4 传递给java.sql.Statement要设置的参数值


**3、失效情况**


3.1 不同的sqlSession会失效


3.2 同一个sqlSession，但是查询语句不一样


3.3 同一个sqlSession，查询语句一样，期间执行增删改操作


3.4 同一个sqlSession，查询语句一样，执行手动清除缓存


**二级缓存：**


MyBatis的二级缓存是Application级别的缓存，它可以提高对数据库查询的效率，以提高应用的性能。


**MyBatis的缓存机制整体设计以及二级缓存的工作模式**


<img src="/img/mybatis.pdf-85-0.png">85-0

<img src="/img/mybatis.pdf-85-1.png">85-1

映射语句文件中的所有select语句将会被缓存。


映射语句文件中的所欲insert、update和delete语句会刷新缓存。


缓存会使用默认的Least Recently Used（LRU，最近最少使用的）算法来收回。


根据时间表，比如No Flush Interval,（CNFI没有刷新间隔），缓存不会以任何时间顺序
来刷新。


缓存会存储列表集合或对象(无论查询方法返回什么)的1024个引用


缓存会被视为是read/write(可读/可写)的缓存，意味着对象检索不是共享的，而且可以安
全的被调用者修改，不干扰其他调用者或线程所做的潜在修改。


<img src="/img/mybatis.pdf-86-0.png">86-0

**实践：**


**一、创建一个POJO Bean并序列化**



<img src="/img/mybatis.pdf-86-2.png">86-2


```
@Data

public class Student implements Serializable {

private static final long serialVersionUID = 735655488285535299L;

private String id;

private String name;

private int age;

private Gender gender;

private List <Teacher> teachers;

```

```
}

```

**二、在映射文件中开启二级缓存**

```
`<`  `?`xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.yihaomen.mybatis.dao.StudentMapper">
```

_**`<!--`**_ **开启本** _**`mapper`**_ **的** _**`namespace`**_ **下的二级缓存** _**`-->`**_
```
<!-```

_**`eviction:`**_ **代表的是缓存回收策略，目前** _**`MyBatis`**_ **提供以下策略。**
_**`(1) LRU,`**_ **最近最少使用的，一处最长时间不用的对象**
_**`(2) FIFO,`**_ **先进先出，按对象进入缓存的顺序来移除他们**
_**`(3) SOFT,`**_ **软引用，移除基于垃圾回收器状态和软引用规则的对象**
_**`(4) WEAK,`**_ **弱引用，更积极的移除基于垃圾收集器状态和弱引用规则的对象。这里采用的是** _**`LRU`**_ **，**
**移除最长时间不用的对形象**


_**`flushInterval:`**_ **刷新间隔时间，单位为毫秒，这里配置的是** _**`100`**_ **秒刷新，如果你不配置它，那么当**
_**`SQL`**_ **被执行的时候才会去刷新缓存。**


_**`size:`**_ **引用数目，一个正整数，代表缓存最多可以存储多少个对象，不宜设置过大。设置过大会导致内存溢出。**
**这里配置的是** _**`1024`**_ **个对象**


_**`readOnly:`**_ **只读，意味着缓存数据只能读取而不能修改，这样设置的好处是我们可以快速读取缓存，缺点是我们没有**
**办法修改缓存，他的默认值是** _**`false`**_ **，不允许我们修改**

```
--`>`

```
<cache eviction="LRU" flushInterval="100000" readOnly="true" size="1024"/>

<resultMap id="studentMap" type="Student">

<id property="id" column="id" />

<result property="name" column="name" />

<result property="age" column="age" />

<result property="gender" column="gender"

typeHandler="org.apache.ibatis.type.EnumOrdinalTypeHandler" />
</resultMap>

<resultMap id="collectionMap" type="Student" extends="studentMap">

<collection property="teachers" ofType="Teacher">

<id property="id" column="teach_id" />

<result property="name" column="tname"/>

<result property="gender" column="tgender"
typeHandler="org.apache.ibatis.type.EnumOrdinalTypeHandler"/>

<result property="subject" column="tsubject"
typeHandler="org.apache.ibatis.type.EnumTypeHandler"/>

<result property="degree" column="tdegree" javaType="string" jdbcType="VARCHAR"/>
</collection>
</resultMap>

<select id="selectStudents" resultMap="collectionMap">

SELECT
s.id, s.name, s.gender, t.id teach_id, t.name tname, t.gender tgender, t.subject
tsubject, t.degree tdegree
FROM

student s

LEFT JOIN stu_teach_rel str
ON s.id = str.stu_id
LEFT JOIN teacher t
ON t.id = str.teach_id
</select>
```

_**`<!--`**_ **可以通过设置** _**`useCache`**_ **来规定这个** _**`sql`**_ **是否开启缓存，** _**`ture`**_ **是开启，** _**`false`**_ **是关闭** _**`-->`**_

```
<select id="selectAllStudents" resultMap="studentMap" useCache="true">
SELECT id, name, age FROM student
</select>
```

_**`<!--`**_ **刷新二级缓存**
```
<select id="selectAllStudents" resultMap="studentMap" flushCache="true">
SELECT id, name, age FROM student
</select>

-->

</mapper>

```

**三、在 mybatis-config.xml中开启二级缓存**

```
`<`  `?`xml version="1.0" encoding="UTF-8" `?` `>`

<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
<settings>
```

_**`<!--`**_ **这个配置使全局的映射器** _**`(`**_ **二级缓存** _**`)`**_ **启用或禁用缓存** _**`-->`**_

```
<setting name="cacheEnabled" value="true" />

```

```
<!-```

**允许** _**`jdbc`**_ **支持生成的键。需要适合的驱动。如果设置为** _**`true`**_ **，**
**则这个设置强制生成的键被使用，尽管一些驱动拒绝兼容但**
**仍然有效**

```
--`>`

`<`setting name="useGeneratedKeys" value="true"/`>`
```

_**`<!--`**_ **配置默认的执行器。** _**`SIMPLE`**_ **执行器没有什么特别之初。**
_**`REUSE`**_ **执行器重用预处理语句。** _**`BATCH`**_ **执行器重用语句和批量更新** _**`-->`**_

```
`<`setting name="defaultExecutorType" value="REUSE"/`>`
```

_**`<!--`**_ **设置超时时间，它决定驱动等待一个数据库相应时间** _**`-->`**_

```
`<`setting name="defaultStatementTimeout" value="25000"/`>`
`<`/settings`>`
```

_**`<!--`**_ **配置别名**
```
`<`typeAliases`>`
`<`typeAlias alias="Student" type="com.yihaomen.mybatis.model.Student"/`>`
`<`/typeAliases`>`--`>`
```

_**`<!--`**_ **指定映射器路径**

```
`<`mappers`>`
`<`mapper resource="com/yihaomen/mybatis/model/Student.xml"/`>`
`<`/mappers`>`--`>`
`<`/configuration`>`

```

**四、测试**

```
public class BaseTest {

private static SqlSessionFactory sqlSessionFactory ;

private static Reader reader ;

static {

try {

reader = Resources. getResourceAsReader ("configuration.xml");

sqlSessionFactory = new SqlSessionFactoryBuilder().build( reader );

} catch (IOException e) {
e.printStackTrace();
}
}

public static SqlSessionFactory getSession() {

return sqlSessionFactory ;
}
}

public class TestStudent extends BaseTest {

public static void testStuTeachRela() {

SqlSessionFactory sqlSessionFactory = getSession ();

SqlSession session = sqlSessionFactory.openSession();

StudentMapper mapper = session.getMapper( StudentMapper .class);

List `<`Student`>` list = mapper.selectStudents();

for(Student s : list) {
System. out .println("------------------");

System. out .println(s.getName() + "," + s.getAge() + "," + s.getGender());

for(Teacher t : s.getTeachers()) {

System. out .println(t.getName() + "," + t.getGender() + "," + t.getSubject());
}
}
}

public static void selectAllStudent() {

SqlSessionFactory sqlSessionFactory = getSession ();

SqlSession session = sqlSessionFactory.openSession();

StudentMapper mapper = session.getMapper( StudentMapper .class);

List `<`Student`>` list = mapper.selectAllStudents();
System. out .println(list);
```

**`System.`** _**`out`**_ **`.println("`** **第二次执行** **`");`**

```
List `<`Student`>` list2 = mapper.selectAllStudents();
System. out .println(list2);
session.commit();
```

**`System.`** _**`out`**_ **`.println("`** **二级缓存观测点** **`");`**

```
SqlSession session2 = sqlSessionFactory.openSession();

StudentMapper mapper2 = session2.getMapper( StudentMapper .class);

List `<`Student`>` list3 = mapper2.selectAllStudents();
System. out .println(list3);
```

**`System.`** _**`out`**_ **`.println("`** **第二次执行** **`");`**


<img src="/img/mybatis.pdf-89-0.png">89-0





**结果：**



<img src="/img/mybatis.pdf-89-1.png">89-1



我们可以从结果看到，sql只执行了一次，证明我们的二级缓存生效了。



```