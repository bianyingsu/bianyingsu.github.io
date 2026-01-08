# Dubbo 
---
aliases:
  - dubbo
标题: dubbo
---
**谈谈 Spring Cloud 与 Dubbo 有什么区别？**


**笔记本：** dubbo


**创建时间：** 2023/12/11 14:25 **更新时间：** 2023/12/11 14:29

## Spring Cloud 与 Dubbo 有什么区别？


**1、SpringCloud与Dubbo的区别**


两者都是现在主流的微服务框架，但却存在不少差异：


**初始定位不同：** SpringCloud定位为微服务架构下的一站式解决方案；Dubbo 是 SOA 时代


的产物，它的关注点主要在于服务的调用和治理


**生态环境不同：** SpringCloud依托于Spring平台，具备更加完善的生态体系；而Dubbo一开始


只是做RPC远程调用，生态相对匮乏，现在逐渐丰富起来。


**调用方式：** SpringCloud是采用Http协议做远程调用，接口一般是Rest风格，比较灵活；Dub


bo是采用Dubbo协议，接口一般是Java的Service接口，格式固定。但调用时采用Netty的NIO


方式，性能较好。


组件差异比较多，例如SpringCloud注册中心一般用Eureka，而Dubbo用的是Zookeeper


SpringCloud生态丰富，功能完善，更像是品牌机，Dubbo则相对灵活，可定制性强，更像


是组装机。


**SpringCloud：** Spring公司开源的微服务框架，SpirngCloud 定位为微服务架构下的一站式


解决方案。


**Dubbo：** 阿里巴巴开源的RPC框架，Dubbo 是 SOA 时代的产物，它的关注点主要在于服务


的调用，流量分发、流量监控和熔断

两者的生态对比：

<img src="/img/dubbo.pdf-0-0.png">


Spring Cloud 的功能很明显比 Dubbo 更加强大，涵盖面更广，而且作为 Spring 的旗舰项目，


它也能够与 Spring Framework、Spring Boot、Spring Data、Spring Batch 等其他 Spring 项目完美融合，这些对于微服务而言是至关重要的。


使用 Dubbo 构建的微服务架构就像组装电脑，各环节选择自由度很高，


但是最终结果很有可能因为一条内存质量不行就点不亮了，总是让人不怎么放心，


但是如果使用者是一名高手，那这些都不是问题。



而 Spring Cloud 就像品牌机，在 Spring Source 的整合下，做了大量的兼容性测试，


保证了机器拥有更高的稳定性，但是如果要在使用非原装组件外的东西，就需要对其基础原


理有足够的了解。


**2、dubbo和Feign远程调用的差异**


Feign是SpringCloud中的远程调用方式，基于成熟Http协议，所有接口都采用Rest风格。


因此接口规范更统一，


而且只要符合规范，实现接口的微服务可以采用任意语言或技术开发。


但受限于http协议本身的特点，请求和响应格式臃肿，其通信效率相对会差一些。


Dubbo框架默认采用Dubbo自定义通信协议，与Http协议一样底层都是TCP通信。


但是Dubbo协议自定义了Java数据序列化和反序列化方式、数据传输格式，


因此Dubbo在数据传输性能上会比Http协议要好一些。


不过这种性能差异除非是达极高的并发量级，否则无需过多考虑。


相关资料：

```
Dubbo采用自定义的Dubbo协议实现远程通信，是一种典型的RPC调用方案，而SpringCloud中使用的Feign是基于Rest风格的调用方式。
```

**1）Rest风格**


REST是一种架构风格，指的是一组架构约束条件和原则。满足这些约束条件和原则的应用


程序或设计就是 RESTful。


Rest的风格可以完全通过HTTP协议实现，使用 HTTP 协议处理数据通信。REST架构对资


源的操作包括获取、创建、修改和删除资源的操作正好对应HTTP协议提供的GET、POS


T、PUT和DELETE方法。


因此请求和想要过程只要遵循http协议即可，更加灵活


SpringCloud中的Feign就是Rest风格的调用方式。


**2）RPC**


Remote Procedure Call，远程过程调用，就是像调用本地方法一样调用远程方法。


RPC一般要确定下面几件事情：


**数据传输方式：** 多数RPC框架选择TCP作为传输协议，性能比较好。


**数据传输内容：** 请求方需要告知需要调用的函数的名称、参数、等信息。


**序列化方式：** 客户端和服务端交互时将参数或结果转化为字节流在网络中传输，那么数据转


化为字节流的或者将字节流转换成能读取的固定格式时就需要进行序列化和反序列化


因为有序列化和反序列化的需求，因此对数据传输格式有严格要求，不如Http灵活


Dubbo协议就是RPC的典型代表。


我们看看Dubbo协议和Feign的调用区别：

<img src="/img/dubbo.pdf-1-0.png">



**SpringBoot整合Dubbo**


**笔记本：** dubbo


**创建时间：** 2023/11/21 13:29 **更新时间：** 2023/11/21 13:43


**SpringBoot整合Dubbo**

**1. 创建基础工程**


我们创建一个maven工程，假设命名为dubbo05,在该工程下，创建一个模板，假设模板名为dubbo-api

<img src="/img/dubbo.pdf-3-0.png">

<img src="/img/dubbo.pdf-4-0.png">

<img src="/img/dubbo.pdf-5-0.png">

创建成功后，在该模板下引入下列依赖：

```xml
<dependencies>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.27</version>
    </dependency>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.5.2</version>
    </dependency>
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.51</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>RELEASE</version>
        <scope>compile</scope>
    </dependency>
</dependencies>

```

模板的目录如下：

<img src="/img/dubbo.pdf-6-0.png">


Product.java

```java
@Data
@TableName(value = "shop_product")
public class Product implements Serializable {
    @TableId(type = IdType.AUTO,value = "pid")
    private Integer pid;
    @TableField(value = "pname")
    private String pname;
    @TableField(value = "pprice")
    private Double pprice;
    @TableField(value = "stock")
    private Integer stock;
}
```

User.java

```java
@Data
@TableName(value = "shop_user")
public class User implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer id;
    @TableField(value = "username")
    private String username;
    @TableField(value = "password")
    private String password;
    @TableField(value = "telephone")
    private String telephone;
    @TableField(exist = false)
    private List<Product>productList;
}

```

ResultVO.java

```java
 @Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultVO <T> implements Serializable {
    private Integer code;
    private String msg;
    private T data;
    public ResultVO(Integer code,String msg){
        this.code=code;
        this.msg=msg;
    }
}

```

注意，上面的类都要实现序列化，因为Dubbo在 [远程调用](https://so.csdn.net/so/search?q=%E8%BF%9C%E7%A8%8B%E8%B0%83%E7%94%A8&spm=1001.2101.3001.7020) 时，会进行序列化


ResultVOUtil.java

```java
public class ResultVOUtil {
    public static ResultVO success(){
        return new ResultVO<>(200,"操作成功");
    }
    public static ResultVO success(Object data){
        return new ResultVO<>(200,"操作成功",data);
    }
    public static ResultVO error(Integer code,String msg){
        return new ResultVO<>(code,msg);
    }
}

```

ProductService.java

```java
public interface ProductService {
    ResultVO getProductById(Integer id);
    ResultVO saveProduct(Product product);
}
```

UserService.java

```java
public interface UserService {
    ResultVO getUserById(int id);
}
```

application.yml

```yml
spring:
    datasource:
        username: root
        password: 3fa4d180
        url: jdbc:mysql://localhost:3306/young1?useSSL=false&serverTimezone=UTC
        driver-class-name: com.mysql.cj.jdbc.Driver
mybatis-plus:
    mapper-locations: mapper/*.xml

```

**2. 创建dubbo-provider和dubbo-consumer模板**


先启动zookeeper


创建模板的过程在上面演示过了，新建的两个模板导入的依赖都如下：

<img src="/img/dubbo.pdf-8-0.png">

```xml
<dependencies>
    <dependency>
        <groupId>com.young</groupId>
        <artifactId>dubbo-api</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>2.7.4</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>2.7.4</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <version>2.7.4</version>
    </dependency>
    <dependency>
        <groupId>com.alibaba.boot</groupId>
        <artifactId>dubbo-spring-boot-starter</artifactId>
        <version>0.2.0</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.27</version>
    </dependency>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.5.2</version>
    </dependency>
</dependencies>
```

目录结构如下：

<img src="/img/dubbo.pdf-9-0.png">

<img src="/img/dubbo.pdf-9-1.png">

数据库的内容如下：

<img src="/img/dubbo.pdf-9-2.png">

<img src="/img/dubbo.pdf-10-0.png">

我们先看dubbo-provider模板


ProductMapper.java

```java
@Mapper
public interface ProductMapper extends BaseMapper<Product> {
}
```

ProductServicImpl.java

```java
package com.young.dubbo.provider.service.impl;


import com.alibaba.dubbo.config.annotation.Service;
import com.young.dubbo.api.entity.Product;
import com.young.dubbo.api.service.ProductService;
import com.young.dubbo.api.util.ResultVOUtil;
import com.young.dubbo.api.vo.ResultVO;
import com.young.dubbo.provider.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import java.util.HashMap;
import java.util.Map;


@Service
@Component
public class ProductServiceImpl implements ProductService {


    @Autowired
    private ProductMapper productMapper;


    @Override
    public ResultVO getProductById(Integer id) {
        Product product=productMapper.selectById(id);
        return ResultVOUtil.success(product);
    }


    @Override
    public ResultVO saveProduct(Product product) {
        int addNum=productMapper.insert(product);
        if(addNum<=0){
            return ResultVOUtil.error(400,"添加商品失败");
        }else{
            Map<String,Object>res=new HashMap<>();
            res.put("addNum",addNum);
            res.put("id",product.getPid());
          return ResultVOUtil.success(res);
        }
    }
}
```

ProviderApplication.java


```java
package com.young.dubbo.provider;

import com.alibaba.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDubbo
public class ProviderApplication {
    public static void main(String[]args){
        SpringApplication.run(ProviderApplication.class,args);
    }
}
```

ProviderApplicationTest.java

```java
package com.young.dubbo.provider;


import com.young.dubbo.api.entity.Product;
import com.young.dubbo.api.service.ProductService;
import com.young.dubbo.api.vo.ResultVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import javax.annotation.Resource;


@SpringBootTest
public class ProviderApplicationTest {


    @Resource
    private ProductService productService;


    @Test
    public void testGet(){
        ResultVO resultVO=productService.getProductById(1);
        System.out.println(resultVO);
    }


    @Test
    public void testAdd(){
        Product product=new Product();
        product.setPname("魅族");
        product.setPprice(2000.0);
        product.setStock(100);
        ResultVO resultVO=productService.saveProduct(product);
        System.out.println(resultVO);
    }
}
```

application.yml

```yml
server:
    port: 8081
dubbo:
    application:
        name: dubbo-provider
    registry:
        address: zookeeper://127.0.0.1:2181
        protocol: zookeeper
    protocol:
        name: dubbo
        port: 20881
    monitor:
        protocol: registry


spring:
    datasource:
        username: root
        password: 123456
        url: jdbc:mysql://localhost:3306/young1?useSSL=false&serverTimezone=UTC
        driver-class-name: com.mysql.cj.jdbc.Driver
mybatis-plus:
    mapper-locations: mapper/*.xml
```

测试ProviderApplicationTest.java的testGet方法和testAdd方法

<img src="/img/dubbo.pdf-12-0.png">

<img src="/img/dubbo.pdf-12-1.png">


接下来是dubbo-consumer模块


UserMapper.java

```java
 @Mapper
 public interface UserMapper extends BaseMapper<User> {
 }

```

UserServiceImpl.java

```java
package com.young.dubbo.consumer.service.impl;


import com.young.dubbo.api.entity.User;
import com.young.dubbo.api.service.UserService;
import com.young.dubbo.api.util.ResultVOUtil;
import com.young.dubbo.api.vo.ResultVO;
import com.young.dubbo.consumer.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class UserServiceImpl implements UserService {


    @Autowired
    private UserMapper userMapper;


    @Override
    public ResultVO getUserById(int id) {
        User user=userMapper.selectById(id);
        return ResultVOUtil.success(user);
    }
}
```

ConsumerApplication.java

```java
package com.young.dubbo.consumer;

import com.alibaba.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDubbo
public class ConsumerApplication {
    public static void main(String[]args){
        SpringApplication.run(ConsumerApplication.class,args);
    }
}
```

ConsumerApplicationTest.java

```java
package com.young.dubbo.consumer;

import com.young.dubbo.api.entity.User;
import com.young.dubbo.api.service.UserService;
import com.young.dubbo.api.vo.ResultVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ConsumerApplicationTest {


    @Autowired
    private UserService userService;


    @Test
    public void testGet(){
        ResultVO resultVO=userService.getUserById(1);
        System.out.println(resultVO);
    }
}
```

application.yml

```yml
server:
    port: 8082
dubbo:
    application:
        name: dubbo-consumer
    registry:
        address: zookeeper://127.0.0.1:2181
    protocol:
        name: dubbo
        port: 20882
    monitor:
        protocol: registry


spring:
    datasource:
        username: root
        password: 123456
        url: jdbc:mysql://localhost:3306/young1?useSSL=false&serverTimezone=UTC
        driver-class-name: com.mysql.cj.jdbc.Driver
mybatis-plus:
    mapper-locations: mapper/*.xml
```

测试testGet方法

<img src="/img/dubbo.pdf-14-0.png">

**3.整合Dubbo**


在上面的步骤都没问题时，我们可以确定数据库能正常访问，接下来假设我们要在UserServiceImpl中，调用ProductService来获取商品信息，具体操作如下

```java
package com.young.dubbo.consumer.service.impl;

import com.alibaba.dubbo.config.annotation.Reference;
import com.young.dubbo.api.entity.Product;
import com.young.dubbo.api.entity.User;
import com.young.dubbo.api.service.ProductService;
import com.young.dubbo.api.service.UserService;
import com.young.dubbo.api.util.ResultVOUtil;
import com.young.dubbo.api.vo.ResultVO;
import com.young.dubbo.consumer.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class UserServiceImpl implements UserService {

    @Reference
    private ProductService productService;

    @Autowired
    private UserMapper userMapper;

    @Override
    public ResultVO getUserById(int id) {
        User user=userMapper.selectById(id);
        Product product1=(Product) productService.getProductById(1).getData();
        Product product2=(Product) productService.getProductById(2).getData();
        user.setProductList(Arrays.asList(product1,product2));
        return ResultVOUtil.success(user);
    }
}
```

我们注意到，ProductServiceImpl类上用到的Service注解，引入的是


我们在dubbo-consumer下，在创建一个controller软件包，在该包下创建UserController.java

```java
package com.young.dubbo.consumer.controller;

import com.young.dubbo.api.service.UserService;
import com.young.dubbo.api.util.ResultVOUtil;
import com.young.dubbo.api.vo.ResultVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
public class UserController {

    @Resource
    private UserService userService;

    @GetMapping("/getUserById/{id}")
    public ResultVO getUserById(@PathVariable(value = "id",required = true)Integer id){
        return userService.getUserById(id);
    }
}
```

接下来先运行dubbo-provider项目，在dubbo-consumer项目，然后访问http://localhost:8082/getUserById/1

<img src="/img/dubbo.pdf-15-0.png">

整合成功！


**4.设置超时时间和重试**


我们先修改ProductServiceImpl.java，模拟网络延迟

```java
@Service
@Component
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductMapper productMapper;

    @Override
    public ResultVO getProductById(Integer id) {
        try{
            Thread.sleep(3000);
        }catch (Exception e){
            e.printStackTrace();
        }
        Product product=productMapper.selectById(id);
        return ResultVOUtil.success(product);
    }

    @Override
    public ResultVO saveProduct(Product product) {
        int addNum=productMapper.insert(product);
        if(addNum<=0){
            return ResultVOUtil.error(400,"添加商品失败");
        }else{
            Map<String,Object>res=new HashMap<>();
            res.put("addNum",addNum);
            res.put("id",product.getPid());
          return ResultVOUtil.success(res);
        }
    }
}
```

接着重新运行项目，访问http://localhost:8082/getUserById/1

<img src="/img/dubbo.pdf-16-0.png">

<img src="/img/dubbo.pdf-16-1.png">

这里提示超时了，这是因为dubbo默认的超时时间为1秒，我们将进一步修改ProductServiceImpl.java,设置超时

```java
@Service(timeout = 4000)
@Component
public class ProductServiceImpl implements ProductService {


    @Autowired
    private ProductMapper productMapper;


    @Override
    public ResultVO getProductById(Integer id) {
        try{
            Thread.sleep(3000);
        }catch (Exception e){
            e.printStackTrace();
        }
        Product product=productMapper.selectById(id);
       return ResultVOUtil.success(product);
    }


    @Override
    public ResultVO saveProduct(Product product) {
        int addNum=productMapper.insert(product);
        if(addNum<=0){
            return ResultVOUtil.error(400,"添加商品失败");
        }else{
            Map<String,Object>res=new HashMap<>();
            res.put("addNum",addNum);
            res.put("id",product.getPid());
          return ResultVOUtil.success(res);
        }
    }
}
```

重新访问http://localhost:8082/getUserById/1,大概6秒后返回结果

<img src="/img/dubbo.pdf-17-0.png">

我们重新修改ProductServicImpl.java，设置重试次数为4次，超时时间为1秒

```java
Service(timeout = 1000,retries = 4)
@Component
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductMapper productMapper;

    @Override
    public ResultVO getProductById(Integer id) {
        System.out.println("---------getProductById-----------");
        try{
            Thread.sleep(3000);
        }catch (Exception e){
            e.printStackTrace();
        }
        Product product=productMapper.selectById(id);
       return ResultVOUtil.success(product);
    }

    @Override
    public ResultVO saveProduct(Product product) {
        int addNum=productMapper.insert(product);
        if(addNum<=0){
            return ResultVOUtil.error(400,"添加商品失败");
        }else{
            Map<String,Object>res=new HashMap<>();
            res.put("addNum",addNum);
            res.put("id",product.getPid());
            return ResultVOUtil.success(res);
        }
    }
}
```

重新访问http://localhost:8082/getUserById/1

<img src="/img/dubbo.pdf-18-0.png">

查看提供方（ProviderApplication）的控制台

<img src="/img/dubbo.pdf-18-1.png">


这里再第一次请求失败后，会重试4次，不过因为我们设置的超时时间短于3秒，所有都访问失败


**5. 负载均衡方式**


我们修改ProviderServiceImpl.java

```java
@Service(timeout = 1000,retries = 4)
@Component
public class ProductServiceImpl implements ProductService {

    @Value("${server.port}")
    private Integer port;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public ResultVO getProductById(Integer id) {
        System.out.println("getProductById:"+port);
        Product product=productMapper.selectById(id);
       return ResultVOUtil.success(product);
    }

    @Override
    public ResultVO saveProduct(Product product) {
        int addNum=productMapper.insert(product);
        if(addNum<=0){
            return ResultVOUtil.error(400,"添加商品失败");
        }else{
            Map<String,Object>res=new HashMap<>();
            res.put("addNum",addNum);
            res.put("id",product.getPid());
          return ResultVOUtil.success(res);
        }
    }
}
```

先把项目都停掉，点击编辑配置

<img src="/img/dubbo.pdf-19-0.png">


选择ProviderApplication，点击添加VM选项

<img src="/img/dubbo.pdf-19-1.png">

<img src="/img/dubbo.pdf-20-0.png">

复制两个ProviderApplication，然后把端口分别改为9002和9003

<img src="/img/dubbo.pdf-20-1.png">

<img src="/img/dubbo.pdf-21-0.png">

ProviderApplication

<img src="/img/dubbo.pdf-21-1.png">


ProviderApplication2

<img src="/img/dubbo.pdf-22-0.png">

ProviderApplication3

<img src="/img/dubbo.pdf-22-1.png">


然后运行ConsumerApplication


然后多次访问http://localhost:8082/getUserById/1


查看控制台

<img src="/img/dubbo.pdf-23-0.png">

<img src="/img/dubbo.pdf-23-1.png">

<img src="/img/dubbo.pdf-24-0.png">

可以发现，默认使用的负载均衡是随机的，我们可以修改UserServiceImpl来使用 [轮询](https://so.csdn.net/so/search?q=%E8%BD%AE%E8%AF%A2&spm=1001.2101.3001.7020) 的方法

```java
@Component
public class UserServiceImpl implements UserService {

    @Reference(loadbalance = "roundrobin")
    private ProductService productService;

    @Autowired
    private UserMapper userMapper;

    @Override
    public ResultVO getUserById(int id) {
        User user=userMapper.selectById(id);
        Product product1=(Product) productService.getProductById(1).getData();
        Product product2=(Product) productService.getProductById(2).getData();
        user.setProductList(Arrays.asList(product1,product2));
        return ResultVOUtil.success(user);
    }
}
```

重新启动ConsumerApplication，多次访问

<img src="/img/dubbo.pdf-24-1.png">

<img src="/img/dubbo.pdf-24-2.png">

<img src="/img/dubbo.pdf-25-0.png">

**6.宕机**


我们把ProviderApplication2和ProviderApplication3都关闭，然后把zookeeper也停掉，此时再访问http://localhost:8082/getUserById/1

<img src="/img/dubbo.pdf-25-1.png">

发现依然能访问成功，这是因为虽然zookeeper停了，但是我们的服务有缓存，也就是说，即使没有注册中心，


置，然后再去请求，这体现了Dubbo的高可用性

