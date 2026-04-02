# Hibernate
---
aliases:
  - hibernate
标题: hibernate
---
**JPA和Hibernate到底是什么关系？**


**笔记本：** hibernate


**创建时间：** 2021/9/24 15:51 **更新时间：** 2023/6/5 11:17


**作者：** 彼岸樱速


**JPA和Hibernate到底是什么关系？**


在学习框架的过程中，发现学的东西很多，但是感觉他们之间的联系区别都不是很了解，知道


JPA可以去实现持久化数据到数据库当中，Hibernate也有这样的功能，总以为他们之间是一种


平级的关系，拥有同样的作用，是一种可以相互替代的关系，就像你吃饭时，选择吃米饭和吃面


条一样，然而，在进行了一番搜索之后，发现并不是那么回事儿。


JPA本身是一种规范，它的本质是一种ORM规范（不是ORM框架，因为JPA并未提供ORM实

现，只是制定了规范）因为JPA是一种规范，所以，只是提供了一些相关的接口，但是接口并不

能直接使用，JPA底层需要某种JPA实现，JPA现在就是Hibernate功能的一个子集


Hibernate 从3.2 开始，就开始兼容JPA 。Hibernate3.2 获得了Sun TCK

的 JPA(Java Persistence API) 兼容认证。 **JPA和Hibernate之间的关系，可以简单的理解为**

**JPA是标准接口，Hibernate是实现，并不是对标关系，借用下图可以看清楚他们之间的关系，**


**Hibernate属于遵循JPA规范的一种实现，但是JPA是Hibernate遵循的规范之一，Hibernate**


**还有其他实现的规范** ，所以它们的关系更像是JPA是一种做面条的规范，而Hibernate是一种遵


循做面条的规范的汤面，他不仅遵循了做面条的规范，同时也会遵循做汤和调料的其他规范，他


们之间并不是吃面条和吃米饭的关系


1.JPA


JPA全称： **Java Persistence API** ，JPA通过JDK 5.0注解或XML描述对象－关系表的映射关
系，并将运行期的实体对象持久化到数据库中。
JPA的出现有两个原因：
其一，简化现有Java EE和Java SE应用的对象持久化的开发工作；


<img src="/img/hibernate.pdf-0-0.png">
其二，Sun希望整合对ORM技术，实现持久化领域的统一。


Sun之所以提出JPA规范，其目的是以官方身份来统一各种ORM框架的规范，包括著名的
Hibernate、TopLink等
不过JPA规范给开发者带来了福音：开发者面向JPA规范的接口，但底层的JPA实现可以任意切
换：觉得Hibernate好的，可以选择Hibernate JPA实现；觉得TopLink好的，可以选择TopLink
JPA实现……这样开发者可以避免为使用Hibernate学习一套ORM框架，为使用TopLink又要再
学习一套ORM框架


JPA提供的技术：
(1)ORM映射元数据
JPA支持XML和JDK 5.0注解两种元数据的形式，元数据描述对象和表之间的映射关系，框架据
此将实体对象持
久化到数据库表中；
(2)JPA 的API
用来操作实体对象，执行CRUD操作，框架在后台替我们完成所有的事情，开发者从繁琐的
JDBC和SQL代码中解
脱出来。
(3)查询语言


通过面向对象而非面向数据库的查询语言查询数据，避免程序的SQL语句紧密耦合


2. Hibernate


JPA是需要Provider来实现其功能的，Hibernate就是JPA Provider中很强的一个。


例如：


(1)实体对象的状态，在Hibernate有自由、持久、游离三种，JPA里有new，managed，

detached，removed，而这些状态都是一一对应的。


(2)flush方法，都是对应的，


(3)Query query = manager.createQuery(sql)，它在Hibernate里写法上是session，而在

JPA中变成了 manager


3. JPA和Hibernate之间的关系，可以简单的理解为JPA是标准接口，Hibernate是实现。


那么Hibernate是如何实现与JPA 的这种关系的呢？


Hibernate 主要是通过三个组件来实现的，及hibernate-annotation 、hibernate

entitymanager和hibernate-core。


(1)hibernate-annotation是Hibernate支持annotation方式配置的基础，它包括了标准的JPA

annotation以及 Hibernate自身特殊功能的annotation。


(2)hibernate-core是Hibernate的核心实现，提供了Hibernate所有的核心功能。


(3)hibernate-entitymanager实现了标准的JPA，可以把它看成hibernate-core和JPA之间的

适配器，它并不直接提供ORM的功能，而是对hibernate-core进行封装，使得Hibernate符合


JPA的规范。


总的来说，JPA是规范，Hibernate是框架，JPA是持久化规范，而Hibernate实现了JPA。


1. jpa中有Entity, Table，hibernate中也有，但是内容不同

2. jpa中有Column,OneToMany等，Hibernate中没有，也没有替代品



<img src="/img/hibernate.pdf-1-1.png">

两个额外的问题：


**JPA注解之“@GeneratedValue”详解JPA注解之“@GeneratedValue”详解**


**笔记本：** hibernate


**创建时间：** 2021/11/12 14:12 **更新时间：** 2021/11/12 14:15


**作者：** 彼岸樱速

# **JPA注解之“@GeneratedValue”详解**

一、JPA通用策略生成器
通过annotation来映射hibernate实体的，基于annotation的hibernate主键标识为@Id，


其生成规则是由@GeneratedValue设定的。这里的@id和@GeneratedValue都是JPA的标准用
法。
JPA提供四种标准用法，由@GeneratedValue的源代码可以明显看出：



<img src="/img/hibernate.pdf-3-0.png">

















<img src="/img/hibernate.pdf-3-1.png">






```
 pkColumnName="gen_name",

 valueColumnName="gen_value",

 pkColumnValue="PAYABLEMOENY_PK",

 allocationSize=1

 )

```

这里应用表tb_generator，定义为：



<img src="/img/hibernate.pdf-3-2.png">
















在主键生成后，这条纪录的value值，按allocationSize递增。


@TableGenerator的定义：


<img src="/img/hibernate.pdf-4-0.png">































2、SEQUENCE



<img src="/img/hibernate.pdf-4-1.png">




























<img src="/img/hibernate.pdf-5-3.png">








```
@Id

@GeneratedValue(strategy = GenerationType.AUTO)

```








此时主键生成策略，为默认值AUTO。


以下指定主键生成策略为AUTO，效果同上：



<img src="/img/hibernate.pdf-5-8.png">







二、hibernate主键策略生成器
hibernate提供多种主键生成策略，有点是类似于JPA，以下是hibernate特有的：


**native** ：对于 oracle 采用 **Sequence** 方式，对于MySQL 和 SQL Server 采用 **identity** （自增主


键生成机制），native就是将主键的生成工作交由数据库完成，hibernate不管（常用）；


**uuid** ：采用128位的uuid算法生成主键，uuid被编码为一个32位16进制数字的字符串，占用空间


大（字符串类型）；


**hilo** ：使用hilo生成策略，要在数据库中建立一张额外的表，默认表名为


hibernate_unique_key，默认字段为integer类型，名称是next_hi（比较少用）；


**assigned** ：在插入数据的时候主键由程序处理（很常用），这是 `<generator>`元素没有指定时


的默认生成策略。等同于JPA中的AUTO；


**identity** ：使用SQL Server 和 MySQL 的自增字段，这个方法不能放到 Oracle 中，Oracle 不支


持自增字段，要设定sequence（MySQL 和 SQL Server 中很常用），等同于JPA中的


INDENTITY；


**select** ：使用触发器生成主键（主要用于早期的数据库主键生成机制，少用）；


**sequence** ：调用底层数据库的序列来生成主键，要设定序列名，不然hibernate无法找到；


**seqhilo** ：通过hilo算法实现，但是主键历史保存在Sequence中，适用于支持 Sequence 的数据


库，如 Oracle（比较少用）；


**increment** ：插入数据的时候hibernate会给主键添加一个自增的主键，但是一个hibernate实例


就维护一个计数器，所以在多个实例运行的时候不能使用这个方法；


**foreign** ：使用另外一个相关联的对象的主键，通常和`<one-to-one>`联合起来使用；


**guid** ：采用数据库底层的guid算法机制，对应MYSQL的 **uuid()** 函数，SQL Server的 **newid()** 函


数，ORACLE的 **rawtohex(sys_guid())** 函数等；


**uuid.hex** ：看uuid，建议用uuid替换；


**sequence-identity** ：sequence策略的扩展，采用立即检索策略来获取sequence值，需要


JDBC3.0和JDK4以上（含1.4）版本；


hibernate提供了多种生成器供选择,基于Annotation的方式通过@GenericGenerator实现。


hibernate每种主键生成策略提供接口org.hibernate.id.IdentifierGenerator的实现类，如果要实现


自定义的主键生成策略也必须实现此接口。




```
 */

 public static final String ENTITY_NAME = "entity_name";

 /**

 * Generate a new identifier.

 * @param session

 * @param object the entity or toplevel collection for which the id is being
 *generated

 * @return a new identifier

 * @throws HibernateException

 */

 public Serializable generate(SessionImplementor session, Object object)

 throws HibernateException;
 }

```

IdentifierGenerator提供一generate方法，generate方法返回产生的主键。


三、@GenericGenerator
自定义主键生成策略，由@GenericGenerator实现。
hibernate在JPA的基础上进行了扩展，可以用以下方式引入hibernate独有的主键生成策略，就
是通过@GenericGenerator加入的。


如，JPA标准用法：


<img src="/img/hibernate.pdf-7-0.png">











<img src="/img/hibernate.pdf-7-1.png">








```
 */

 String name();

 /**

 * Generator strategy either a predefined Hibernate

 * strategy or a fully qualified class name.

 */

 String strategy();

 /**

 * Optional generator parameters

 */

 Parameter[] parameters() default {};
 }

```

以上属性说明如下：


**name** 属性指定生成器名称；


**strategy** 属性指定具体生成器的类名；


**parameters** 得到strategy指定的具体生成器所用到的参数；


对于这些hibernate主键生成策略和各自的具体生成器之间的关系，在
org.hibernate.id.IdentifierGeneratorFactory中指定了：



<img src="/img/hibernate.pdf-7-2.png">






























<img src="/img/hibernate.pdf-8-0.png">



















<img src="/img/hibernate.pdf-8-1.png">







<img src="/img/hibernate.pdf-8-2.png">







<img src="/img/hibernate.pdf-8-3.png">







<img src="/img/hibernate.pdf-8-4.png">







<img src="/img/hibernate.pdf-8-5.png">







<img src="/img/hibernate.pdf-8-6.png">







<img src="/img/hibernate.pdf-8-7.png">






<img src="/img/hibernate.pdf-9-3.png">


























```
 Integer id;

 @OneToOne

 EmployeeInfo info;

 ...

 }

```

11、guid



<img src="/img/hibernate.pdf-9-4.png">





<img src="/img/hibernate.pdf-9-5.png">










```
@GenericGenerator(name = "paymentableGenerator", strategy = "sequence-identity",parameters

```





<img src="/img/hibernate.pdf-10-0.png">












































```
 @GenericGenerator(name = "paymentableGenerator", strategy = "AssignedSequenceGenerator", p

```

四种数据库的支持情况如下：






|数据库名称|支持的id策略|
|---|---|
|mysql|`GenerationType.`_`TABLE`_<br>`GenerationType.`_`AUTO`_<br>`GenerationType.`_`IDENTITY`_<br>不支持`GenerationType.`_`SEQUENCE`_|
|oracle|`strategy=GenerationType.`_`AUTO`_<br>`GenerationType.`_`SEQUENCE`_<br>`GenerationType.`_`TABLE`_<br>不支持`GenerationType.`_`IDENTITY`_|
|postgreSQL|`GenerationType.`_`TABLE`_<br>`GenerationType.`_`AUTO`_<br>`GenerationType.`_`IDENTITY`_<br>`GenerationType.`_`SEQUENCE`_<br>都支持|
|kingbase|`GenerationType.`_`TABLE`_<br>`GenerationType.`_`SEQUENCE`_<br>`GenerationType.`_`IDENTITY`_<br>`GenerationType.`_`AUTO`_<br>都支持|


**Springboot 整合 hibernate 和 jpa**


**笔记本：** hibernate


**创建时间：** 2021/9/24 15:54 **更新时间：** 2021/9/24 16:10


**作者：** 彼岸樱速


**URL：** about:blank


hibernate 和 jpa 的关系这里就不介绍了，你可以这么理解：hibernate用jpa的方式来实现


**1.引入依赖 （jpa里面已经有了hiebrnate的依赖包）**

```
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
http://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>

<groupId>org.example</groupId>
<artifactId>springboot-hibernate</artifactId>
<version>1.0-SNAPSHOT</version>

<parent>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-parent</artifactId>
<version>2.0.6.RELEASE</version>

<relativePath/> <!-- lookup parent from repository -->
</parent>

<dependencies>
```

_**`<!--`**_ **整合** _**`hibernate`**_ **要** _**`jpa-->`**_
```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-data-jpa</artifactId>
<version>2.5.2</version>
</dependency>
<dependency>
<groupId>mysql</groupId>
<artifactId>mysql-connector-java</artifactId>
<version>8.0.16</version>
</dependency>
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-web</artifactId>
</dependency>
</dependencies>

</project>

```

**2.修改 application.properties**
datasource的参数跟你整合mybatis一样，不过整合hibernate还得指定jpa的配置

```
server.port=8686

#datasource
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/db2020?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=123456wyy

```

_**`#jpa`**_ **配置**

```
spring.jpa.database = MYSQL
# Show or not log for each sql query

spring.jpa.show-sql = true
# Hibernate ddl auto (create, create-drop, update)

spring.jpa.hibernate.ddl-auto = update
# Naming strategy

spring.jpa.hibernate.naming-strategy = org.hibernate.cfg.ImprovedNamingStrategy
# stripped before adding them to the entity manager)

spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.MySQL5Dialect

```

**3.创建实体类（这里用注解式开发，没有了.hbm.xml文件）**
通过注解将表名和类名，字段名和属性名关联起来，还有指定主键生成策略

```
package com.wyy.hibernate.entity;

import javax.persistence.*;
import java.io. Serializable ;

```

```
/**

* @author wuyuying@qq.com

* @version 1.0

* @date 2021/9/24 15:17

* @description
*/

```

**`@Entity`** _**`// @Entity`**_ **标识一个实体类，任何** _**`Hibernate`**_ **映射对象都要有这个注解**

```
@Table(name = "Person")

public class Person implements Serializable {

@Id
// @GeneratedValue(strategy = GenerationType.AUTO)

```

_**`//`**_ **这个和默认一样是以** _**`Oracle`**_ **的方式来实现自增主键，会自动生成** _**`hibernate_sequence`**_ **表**
_**`// JPA`**_ **提供的四种标准用法为**
_**`// TABLE`**_ **：使用一个特定的数据库表格来保存主键。**
_**`// SEQUENCE`**_ **：根据底层数据库的序列来生成主键，条件是数据库支持序列。**
_**`// IDENTITY`**_ **：主键由数据库自动生成（主要是自动增长型）**
_**`// AUTO`**_ **：主键由程序控制。**

```
@GeneratedValue(strategy = GenerationType. IDENTITY )

protected Long id;

@Column(name = "name")

protected String name;

public Long getId() {

return id;
}

public void setId(Long id) {

this.id = id;
}

public String getName() {

return name;
}

public void setName(String name) {

this.name = name;
}

@Override

public String toString() {

return "Person{" +

"id=" + id +

", name='" + name + '/'' +
'}';
}
}

```

**4.定义数据库操作接口**
类似mybatis的mapper接口一样，包含操作数据库的方法，注入到service层使用，这里用的
jpa，继承 JpaRepository 类


JpaRepository 的子类已经实现了简单的增删改查的方法，我们也可以自定义HQL的方法

```
package com.wyy.hibernate.mapper;

import com.wyy.hibernate.entity.Person;
import org.springframework.data.jpa.repository. JpaRepository ;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**

* @author wuyuying@qq.com

* @version 1.0

* @date 2021/9/24 15:21

* @description
*/

public interface PersonRepository extends JpaRepository <Person,Integer> {

/**

```

_**`*`**_ **这个在集成的类的子类里面有明确的** _**`sql`**_ **实现，**


_**`*`**_ **不用再写** _**`SQL`**_ **或者** _**`HQL`**_ **，也可以不写，直接在** _**`service`**_ **里用子类的**
```
*/

public Person findById(Long id);

@Override

```

**`public Person`** **`save(Person`** **`user);`** _**`//`**_ **同上**


**`@Query(value`** **`=`** **`"SELECT p FROM Person p WHERE name=:name")`** _**`//`**_ **这是** _**`HQL :xx`**_ **指传入参数，跟下面注解** _**`@Param`**_
**对应**
```
// @Query(value = "SELECT * FROM Person WHERE name=?", nativeQuery = true)

```

_**`//`**_ **这是** _**`SQL nativeQuery`**_ **为** _**`true`**_ **代表使用** _**`SQL`**_ **语言**

```
public Person findByName(@Param("name") String name);

}

```

**5.service**

```
package com.wyy.hibernate.service;

import com.wyy.hibernate.entity.Person;
import com.wyy.hibernate.mapper. PersonRepository ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**

* @author wuyuying@qq.com

* @version 1.0

* @date 2021/9/24 15:24

* @description
*/

@Service

public class PersonService {

@Autowired

private PersonRepository personRepository;

public Person findById(Long id){

return personRepository.findById(id);
}

public Person findByName(String name){

return personRepository.findByName(name);
}

public void save(Person person){
personRepository.save(person);
}

}

```

**6.controller**



<img src="/img/hibernate.pdf-13-0.png">


















```
public String findById(String id){

return personService.findById(Long. parseLong (id)).toString();
}

@RequestMapping("/findByName")
@ResponseBody

public String findByName(String name){

return personService.findByName(name).toString();
}

@RequestMapping("/save")
@ResponseBody

public String save(){

Person person = new Person();
```

**`person.setName("`** **张三** **`");`**
```
personService.save(person);

```

**`return`** **`"`** **插入成功** **`";`**
```
}

}
```

6.测试
运行项目，发现数据库自动创建了person 表


发起接口请求 [http://localhost:8080/save](http://localhost:8080/save) 成功插入数据


控制台打印日志

<img src="/img/hibernate.pdf-14-1.png">


发起接口请求 [http://localhost:8080/findById?id=1](http://localhost:8080/findById?id=1) 成功返回一条person数据


发起接口请求 [http://localhost:8080/findByName?name=张三 成功返回一条person数据](http://localhost:8080/findByName?name=)


**总结：**
**1、整体下来，跟整合mybatis的用法大同小异，只不过其中的具体实现有点差别。**
**2、hibernate配置默认会自动创建表格，但是不是创建数据库，如果自动创建表失败，可能是**
**方言设置有问题，ddl-auto = update有几种值，(create, create-drop, update)，create相**
**关的慎用，因为每次启动都会清空表。还有一定要注意 hibernate 命名规范。**



<img src="/img/hibernate.pdf-14-0.png">

<img src="/img/hibernate.pdf-14-2.png">
**Hibernate入门这一篇就够了**


**笔记本：** hibernate


**创建时间：** 2021/9/24 15:37 **更新时间：** 2021/9/24 15:50


**作者：** 彼岸樱速

# **什么是Hibernate框架？**


**Hibernate是一种ORM框架，全称为 Object_Relative DateBase-Mapping** ，在Java对象与关系数据库之
间 **建立某种映射，以实现直接存取Java对象** ！

# **ORM概述**


在介绍Hibernate的时候，说了 **Hibernate是一种ORM的框架** 。那什么是ORM呢？ **ORM是一种思想**


O代表的是Objcet
R代表的是Relative
M代表的是Mapping


ORM->对象关系映射....ORM关注是 **对象与数据库中的列的关系**

# **为什么要使用Hibernate？**


既然Hibernate是关于Java对象和关系数据库之间的联系的话，也就是 **我们MVC中的数据持久层->在编写程**
**序中的DAO层...**


首先，我们来回顾一下我们在DAO层写程序的历程吧：


1. **在DAO层操作XML，将数据封装到XML文件上，读写XML文件数据实现CRUD**
2. **在DAO层使用原生JDBC连接数据库，实现CRUD**
3. **嫌弃JDBC的Connection/Statement/ResultSet等对象太繁琐，使用对原生JDBC的封装组件--**

**>DbUtils组件**


我们来看看使用DbUtils之后，程序的代码是怎么样的：

```
public class CategoryDAOImpl implements zhongfucheng.dao.CategoryDao {

@Override

public void addCategory(Category category) {

QueryRunner queryRunner = new QueryRunner(Utils2DB.getDataSource());

String sql = "INSERT INTO category (id, name, description) VALUES(?,?,?)";

try {

queryRunner.update(sql, new Object[]{category.getId(), category.getName(),

category.getDescription()});

} catch (SQLException e) {

throw new RuntimeException(e);

}

}

@Override

public Category findCategory(String id) {

QueryRunner queryRunner = new QueryRunner(Utils2DB.getDataSource());

String sql = "SELECT * FROM category WHERE id=?";

try {

Category category = (Category) queryRunner.query(sql, id, new

BeanHandler(Category.class));

return category;

} catch (SQLException e) {

throw new RuntimeException(e);

```

```
}

}

@Override

public List<Category> getAllCategory() {

QueryRunner queryRunner = new QueryRunner(Utils2DB.getDataSource());

String sql = "SELECT * FROM category";

try {

List<Category> categories = (List<Category>) queryRunner.query(sql, new

BeanListHandler(Category.class));

return categories;

} catch (SQLException e) {

throw new RuntimeException(e);

}

}

}

```

其实使用DbUtils时，DAO层中的代码编写是很 **有规律的。**


**当插入数据的时候，就将JavaBean对象拆分，拼装成SQL语句**
**当查询数据的时候，用SQL把数据库表中的列组合，拼装成JavaBean对象**


也就是说： **javaBean对象和数据表中的列存在映射关系!** 如果程序能够自动生成SQL语句就好了....那么
Hibernate就实现了这个功能！


简单来说： **我们使用Hibernate框架就不用我们写很多繁琐的SQL语句，从而简化我们的开发！**

# **ORM概述**


在介绍Hibernate的时候，说了 **Hibernate是一种ORM的框架** 。那什么是ORM呢？ **ORM是一种思想**


O代表的是Objcet
R代表的是Relative
M代表的是Mapping

# **Hibernate快速入门**


学习一个框架无非就是三个步骤：


**引入jar开发包**
**配置相关的XML文件**
**熟悉API**


**引入相关jar包**


我们使用的是Hibernate3.6的版本


**hibernate3.jar核心 + required 必须引入的(6个) + jpa 目录 + 数据库驱动包**


**编写对象和对象映射**


编写一个User对象-> **User.java**

```
public class User {

private int id;

private String username;

private String password;

private String cellphone;

```

`//` 各种 `setter` 和 `getter`

```
}

```

编写对象映射-> **User.hbm.xml。** 一般它 **和JavaBean对象放在同一目录下**


我们是不知道该XML是怎么写的，可以搜索一下Hibernate文件夹中后缀为 `[.hbm.xml]` 。看看它们是怎么写的。


然后复制一份过来



<img src="/img/hibernate.pdf-17-0.png">



在上面的模板上修改～下面会具体讲解这个配置文件!


`<!--` 在 `domain` 包下 `--><hibernate-mapping` `package="zhongfucheng.domain">`


`<!--` 类名为 `User` ，表名也为 `User-->`

```
<class name="User" table="user">

```

`<!--` 主键映射，属性名为 `id` ，列名也为 `id-->`

```
<id name="id" column="id">

```

`<!--` 根据底层数据库主键自动增长 `-->`

```
<generator class="native"/>

</id>

```

`<!--` 非主键映射，属性和列名一一对应 `-->`

```
<property name="username" column="username"/>

<property name="cellphone" column="cellphone"/>

<property name="password" column="password"/>

```

```
</class></hibernate-mapping>

```

**主配置文件**


**hibernate.cfg.xml**


如果使用Intellij Idea生成的Hibernate可以指定生成出主配置文件 `[hibernate.cfg.xml]` ，它是要 **放在src目录**


**下的**


如果不是自动生成的，我们可以在Hibernate的 `[hibernate-distribution-3.6.0.Final/project/etc]` 这个目


录下可以找到


它长得这个样子：



<img src="/img/hibernate.pdf-18-0.png">



通过上面的模板进行修改，后面会有对该配置文件进行讲解！

```
<hibernate-configuration>
```

`<!--` 通常，一个 `session-factory` 节点代表一个数据库 `-->`

```
<session-factory>

```

`<!-- 1.` 数据库连接配置 `-->`

```
<property

name="hibernate.connection.driver_class">com.mysql.jdbc.Driver</property>

<property

name="hibernate.connection.url">jdbc:mysql:///zhongfucheng</property>

<property name="hibernate.connection.username">root</property>

<property name="hibernate.connection.password">root</property>

<!-
```

数据库方法配置， `hibernate` 在运行的时候，会根据不同的方言生成符合当前数据库语法的 `sql`

```
-->

<property

name="hibernate.dialect">org.hibernate.dialect.MySQL5Dialect</property>

```

`<!-- 2.` 其他相关配置 `-->`


`<!-- 2.1` 显示 `hibernate` 在运行时候执行的 `sql` 语句 `-->`

```
<property name="hibernate.show_sql">true</property>
```

`<!-- 2.2` 格式化 `sql -->`

```
<property name="hibernate.format_sql">true</property>
```

`<!-- 2.3` 自动建表 `-->`

```
<property name="hibernate.hbm2ddl.auto">create</property>

```

`<!--3.` 加载所有映射 `-->`

```
<mapping resource="zhongfucheng/domain/User.hbm.xml"/>

```

```
</session-factory></hibernate-configuration>

```

**测试**



<img src="/img/hibernate.pdf-19-0.png">



值得注意的是： **JavaBean的主键类型只能是int类型，因为在映射关系中配置是自动增长的，String类型是**
**不能自动增长的。如果是你设置了String类型，又使用了自动增长，那么就会报出下面的错误！**

```
Caused by: com.mysql.jdbc.exceptions.jdbc4.MySQLSyntaxErrorException: Table

'zhongfucheng.user' does

```

执行完程序后，Hibernate就为我们创建对应的表，并把数据存进了数据库了


我们看看快速入门案例的代码用到了什么对象吧，然后一个一个讲解



<img src="/img/hibernate.pdf-20-0.png">


# **Configuration**

**配置管理类：主要管理配置文件的一个类**


它 **拥有一个子类AnnotationConfiguration** ，也就是说： **我们可以使用注解来代替XML配置文件来配置相对**
**应的信息**


**configure方法**


**configure()方法用于加载配置文件**


**加载主配置文件的方法**

如果指定参数，那么加载参数的路径配置文件
**如果不指定参数，默认加载src/目录下的hibernate.cfg.xml **


**buildSessionFactory方法**


**buildSessionFactory()用于创建Session工厂**

# **SessionFactory**


**SessionFactory-->Session的工厂，也可以说代表了hibernate.cfg.xml这个文件** ...hibernate.cfg.xml的就
有 `[<session-factory>]` 这么一个节点


**openSession方法**


创建一个Session对象


**getCurrentSession方法**


创建Session对象或取出Session对象

# **Session**


**Session是Hibernate最重要的对象，Session维护了一个连接（Connection），只要使用Hibernate操作**
**数据库，都需要用到Session对象**


通常我们在DAO层中都会有以下的方法， **Session也为我们提供了对应的方法来实现** ！



<img src="/img/hibernate.pdf-21-0.png">





**更新操作**


我们在快速入门中使用到了save(Objcet o)方法，调用了这个方法就把对象保存在数据库之中了。Session对
象还提供着其他的方法来进行对数据库的更新


**session.save(obj); 【保存一个对象】**
**session.update(obj); 【更新一个对象】**
**session.saveOrUpdate(obj); 【保存或者更新的方法】**

**没有设置主键，执行保存； **
**有设置主键，执行更新操作; **
**如果设置主键不存在报错！**


我们来使用一下update()方法吧.... **既然是更新操作了，那么肯定需要设置主键的** ，不设置主键，数据库怎么
知道你要更新什么。将id为1的记录修改成如下：



<img src="/img/hibernate.pdf-21-1.png">





**主键查询**


**通过主键来查询数据库的记录，从而返回一个JavaBean对象**


**session.get(javaBean.class, int id); 【传入对应的class和id就可以查询】**
**session.load(javaBean.class, int id); 【支持懒加载】**


**User重写toString()来看一下效果：**

```
User user1 = (User) session.get(User.class, 1);

System.out.println(user1);

```

<img src="/img/hibernate.pdf-22-0.png">

**HQL查询**


**HQL:hibernate query language 即hibernate提供的面向对象的查询语言**


**查询的是对象以及对象的属性【它查询的是对象以及属性，因此是区分大小写的！】** 。


**SQL：Struct query language 结构化查询语言**


**查询的是表以及列【不区分大小写】**


**HQL是面向对象的查询语言，可以用来查询全部的数据！**

```
Query query = session.createQuery("FROM User");

List list = query.list();

System.out.println(list);

```

当然啦，它也可以 **传递参数进去查询**



<img src="/img/hibernate.pdf-22-1.png">



**QBC查询**


**QBC查询: query by criteria 完全面向对象的查询**


从上面的HQL查询，我们就可以发现： **HQL查询是需要SQL的基础的，因为还是要写少部分的SQL代**
**码** .... **QBC查询就是完全的面向对象查询** ...但是呢，我们用得比较少


我们来看一下怎么使用吧：



<img src="/img/hibernate.pdf-22-2.png">









**本地SQL查询**


有的时候，如果SQL是非常复杂的，我们 **不能靠HQL查询来实现功能的话，我们就需要使用原生的SQL来进**
**行复杂查询了！**


但是呢，它有一个缺陷： **它是不能跨平台的...因此我们在主配置文件中已经配置了数据库的“方言“了。**


我们来简单使用一下把：


`//` 将所有的记录封装成 `User` 对象存进 `List` 集合中

```
SQLQuery sqlQuery = session.createSQLQuery("SELECT * FROM

user").addEntity(User.class);

```

```
List list = sqlQuery.list();

System.out.println(list);

```

**beginTransaction方法**


开启事务，返回的是一个事务对象.... **Hibernate规定所有的数据库操作都必须在事务环境下进行，否则报错！**

# **主配置文件**


主配置文件主要配置：


**数据库的信息**
**其他参数**
**加载映射文件**


常用的配置信息都可以在 `[hibernate-distribution-3.6.0.Final/project/etc/hibernate.properties]` 目录


下可以找到..


**数据库信息**


常用的配置信息都可以在hibernate.properties文件中找到，因此，我们来搜索一下：


`<!-- 1.` 数据库连接配置 `-->`

```
<property

name="hibernate.connection.driver_class">com.mysql.jdbc.Driver</property>

<property name="hibernate.connection.url">jdbc:mysql:///hib_demo</property>

<property name="hibernate.connection.username">root</property>

<property name="hibernate.connection.password">root</property>

<!-
```

数据库方法配置， `hibernate` 在运行的时候，会根据不同的方言生成符合当前数据库语法的 `sql` 【大致可

以理解成：不同的版本对应的 `SQL` 不同】

```
-->

<property

name="hibernate.dialect">org.hibernate.dialect.MySQL5Dialect</property>

```

**其他参数信息**


常用的有那么三个：


`<!-- 2.` 其他相关配置 `-->`


`<!-- 2.1` 显示 `hibernate` 在运行时候执行的 `sql` 语句 `-->`

```
<property name="hibernate.show_sql">true</property>
```

`<!-- 2.2` 格式化 `sql -->`

```
<property name="hibernate.format_sql">true</property>
```

`<!-- 2.3` 自动建表 `-->`

```
<property name="hibernate.hbm2ddl.auto">update</property>

```

需要我们注意的是自动建表，其中它有几个参数：


create-drop 每次在创建sessionFactory时候执行创建表。当调用sesisonFactory的close方法的时
候，删除表！
**create 每次都重新建表； 如果表已经存在就先删除再创建**
**update 如果表不存在就创建； 表存在就不创建；**
validate (生成环境时候) 执行验证： 当映射文件的内容与数据库表结构不一样的时候就报错！


**加载映射文件**


值得注意的是： **mapping的属性使用的是resource!**


`<!--3.` 加载映射文件 `-->`

```
<mapping resource="zhongfucheng/domain/User.hbm.xml"/>

```

加载映射文件其实我们可以在程序中加载，不一定在配置文件中配置.... **一般地，我们在测试的时候一般使用程**
**序的方式去加载映射文件【方便】**


那么怎么在程序中加载映射文件呢？


在Configuration对象中提供了 **addClass()的方法** 。


一般地我们的 **映射配置文件和JavaBean对象是放在同一个包下** 的。并且映射文件的 **命名是有规范的** 。因此
Hibernate是可以通过 **提供的JavaBean对象从而找到相对应的映射文件** ！



<img src="/img/hibernate.pdf-24-0.png">


# **映射配置文件**

**映射文件: 映射一个实体类对象； 描述一个对象最终实现可以直接保存对象数据到数据库中**


**通常地，我们都是一个JavaBean对象对应一个映射配置文件，并且配置文件和JavaBean对象是放在同一个**
**目录下的**


我们按照快速入门的映射配置文件一步一步来讲解：


`<!--` 在 `domain` 包下 `--><hibernate-mapping` `package="zhongfucheng.domain">`


`<!--` 类名为 `User` ，表名也为 `User-->`

```
<class name="User" table="user">

```

`<!--` 主键映射，属性名为 `id` ，列名也为 `id-->`

```
<id name="id" column="id">

```

`<!--` 根据底层数据库主键自动增长 `-->`

```
<generator class="native"/>

</id>

```

`<!--` 非主键映射，属性和列名一一对应 `-->`

```
<property name="username" column="username"/>

<property name="cellphone" column="cellphone"/>

<property name="password" column="password"/>

</class></hibernate-mapping>

```

**`hibernate-mapping`** **节点**


常用的属性：


**package【要映射的对象所在的包(可选,如果不指定,此文件所有的类都要指定全路径)】**
**auto-import**

**默认为true， 在写hql的时候自动导入包名**
**如果指定为false, 再写hql的时候必须要写上类的全名；**


**`class`** **节点**


**class 映射某一个对象的(一般情况，一个对象写一个映射文件，即一个class节点)**


常用的属性：


**name【指定要映射的对象的类型】**
**table【指定对象对应的表】**

**如果没有指定，默认与对象名称一样 **


**`property`** **节点**


property是普通属性的映射，即 **JavaBean普通的成员变量属性就使用property来描述** ！


常用的属性：


**name 指定对象的属性名称**
**column 指定对象属性对应的表的字段名称**

**如果不写默认与对象属性一致** 。


**length 指定字符的长度, 默认为255**
**type 指定映射表的字段的类型，如果不指定会匹配属性的类型**

**java类型： 必须写全名【例：java.lang.String】 **
** hibernate类型： 直接写类型，都是小写**


值得注意的是： **如果列名称为数据库关键字，需要用反引号或改列名。** 当然啦，我们一般不使用关键字来作为
列名


**`id`** **节点**


**id是主键映射** ....


**name 指定对象的属性名**
**column 指定对象属性对应的表的字段名称**


**`<id>`** **节点下还有子节点** **`<generator class=""/>`**


**主键的自动生成策略**


identity 自增长(mysql,db2)
sequence 自增长(序列)， oracle中自增长是以序列方法实现**
**native 自增长【会根据底层数据库自增长的方式选择identity或sequence】**

**如果是mysql数据库, 采用的自增长方式是identity**
**如果是oracle数据库， 使用sequence序列的方式实现自增长**


increment 自增长(会有并发访问的问题，一般在服务器集群环境使用会存在问题。)


指定主键生成策略为 **手动指定主键的值**


**assigned**


指定主键生成策略为 **UUID生成的值**


**uuid**


**foreign(外键的方式， one-to-one讲)**

```
composite-id

```

主键一般分为两种：


单列主键
多列复合主键


单列主键就是上面那种，那么 **如果要使用多列复合主键就需要使用** **`[<composite-id>]`** **节点来配置了**


现在我有这么下面的一个对象，我想 **使用username和password作为复合主键**

```
public class User2 {

private String username;

private String password;

private String cellphone;
```

`//` 各种 `setter` 和 `getter` 方法

```
}

```

**将username和password抽取成一个类---->CompositeKey** .... **必须实现Serializable接口**


```
package zhongfucheng.domain;

/**

* Created by ozc on 2017/5/6.

*/public class CompositeKey implements Serializable{

private String username;

private String password;

public String getUsername() {

return username;

}

public void setUsername(String username) {

this.username = username;

}

public String getPassword() {

return password;

}

public void setPassword(String password) {

this.password = password;

}

}

```

在User2中需要 **指定一个变量来维护这个主键对象**

```
package zhongfucheng.domain;

/**

* Created by ozc on 2017/5/6.

*/public class User2 {

```

`//` 在 `User` 对象中维护这个主键对象

```
private CompositeKey key;

private String cellphone;

public CompositeKey getKey() {

return key;

}

public void setKey(CompositeKey key) {

this.key = key;

}

public String getCellphone() {

return cellphone;

}

public void setCellphone(String cellphone) {

this.cellphone = cellphone;

}

}

```

**测试**

```
public static void main(String[] args) {

```

<img src="/img/hibernate.pdf-27-0.png">


