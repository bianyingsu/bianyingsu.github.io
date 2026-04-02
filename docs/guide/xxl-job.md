# Xxl-Job
---
aliases:
  - xxl-job
标题: xxl-job
---
**xxl-job定时任务框架**


**笔记本：** xxl-job


**创建时间：** 2022/12/21 13:46 **更新时间：** 2022/12/22 14:26


**作者：** 彼岸樱速


**前言**


之前做定时任务，要么是Spring的定时任务，要么是quartz框架，现
在可以用xxl-job。


xxl-job需要拉取代码，maven打成可运行Jar包，
git地址：https://github.com/xuxueli/xxl-job


拉取代码之后，需要修改代码里面的，xxl-job-admin的配置文件，
需要修改的是数据库地址，账号密码，打包的话需要设置为
localhost，本地运行的话需要设置为服务器ip地址。


启动之前要先创建好数据库，数据库脚本在代码里面有，创建好数据
库，再在配置文件进行配置。



<img src="/img/xxl-job.pdf-0-0.png">0-0
<img src="/img/xxl-job.pdf-1-0.png">1-0

上传到服务器，启动之后
浏览器输入ip +启动端口 +/xxl-job-admin
账号密码是admin 123456


登录成功之后即可进行任务的配置了


配置说明



<img src="/img/xxl-job.pdf-1-1.png">1-1
<img src="/img/xxl-job.pdf-2-0.png">2-0

执行器


默认是自动注册，我们改为手动录入


xxl-job中有一个springboot-sample的代码示例，其中配置文件



<img src="/img/xxl-job.pdf-2-1.png">2-1
<img src="/img/xxl-job.pdf-3-0.png">3-0

xxl.job.admin.address我们需要配置为admin页面的地址，这里默认
是本机，127.0.0.1 我启动的tomcat端口是8090。可以看下面配置文
件的server.port


xxl.job.executor.appname就是指执行器的名字，我们把执行器的名
字给配置上去。


xxl.job.executor.port我这里配置为9999，那么在admin页面的时
候，配置执行器，我们使用手动录入的方式，ip就是
http://127.0.0.1:9999/


xxl.job.executor.logpath是日志目录，是使用 XxlJobHelper.log 进

<img src="/img/xxl-job.pdf-3-1.png">3-1
行打印日志时的输出目录，logback的日志不会输出到这个位置


xxl-job-admin配置文件如下
```
### web

server.port=8090
server.servlet.context-path=/xxl-job-admin

### actuator
management.server.base-path=/actuator
management.health.mail.enabled=false

### resources

spring.mvc.servlet.load-on-startup=0

```

```
spring.mvc.static-path-pattern=/static/**
spring.web.resources.static-locations=classpath:/static/

### freemarker
spring.freemarker.templateLoaderPath=classpath:/templates/
spring.freemarker.suffix=.ftl
spring.freemarker.charset=UTF-8
spring.freemarker.request-context-attribute=request
spring.freemarker.settings.number_format=0.##########

### mybatis
mybatis.mapper-locations=classpath:/mybatis-mapper/*Mapper.xml
#mybatis.type-aliases-package=com.xxl.job.admin.core.model

### xxl-job, datasource
```

`#` 服务器打包时使用 `localhost` ， `windows` 本地启动使用服务器 `ip`
```
#spring.datasource.url=jdbc:mysql://localhost:3306/xxl_job?
useUnicode=true&characterEncoding=UTF8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.url=jdbc:mysql://ip:3306/xxl_job?
useUnicode=true&characterEncoding=UTF8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=xxxxxx
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

### datasource-pool
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.maximum-pool-size=30
spring.datasource.hikari.auto-commit=true
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.pool-name=HikariCP
spring.datasource.hikari.max-lifetime=900000
spring.datasource.hikari.connection-timeout=10000
spring.datasource.hikari.connection-test-query=SELECT 1
spring.datasource.hikari.validation-timeout=1000

### xxl-job, email
spring.mail.host=smtp.qq.com
spring.mail.port=25
spring.mail.username=xxx@qq.com
spring.mail.from=xxx@qq.com
spring.mail.password=xxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory

### xxl-job, access token
xxl.job.accessToken=default_token

### xxl-job, i18n (default is zh_CN, and you can choose "zh_CN",
"zh_TC" and "en")
xxl.job.i18n=zh_CN

## xxl-job, triggerpool max size
xxl.job.triggerpool.fast.max=200
xxl.job.triggerpool.slow.max=100

### xxl-job, log retention days
xxl.job.logretentiondays=30

```

xxl.job.accessToken需要跟xxl-job-admin的配置文件一致，可以自
己修改


尝试执行git代码中的 springboot-sample模块，打包成可执行jar包
丢到服务器执行
其中关键的代码是
pom文件


新建一个java文件，定义为xxxJob.java
添加spring的@Component，使之可以被注册为一个组件


然后在具体的执行方法上，添加 @XxlJob 注解，如下


添加@XxlJob注解的位置，是具体要执行定时任务方法的服务，比如
springboot-sample，只要在方法上加这个注解，注册到xxl-Jobadmin，就可以在admin页面上，如上图操作，执行一次，即可执行
一次对应的方法代码


以下是点击执行一次后，springboot-sample服务打印的logback日
志



<img src="/img/xxl-job.pdf-5-0.png">5-0

<img src="/img/xxl-job.pdf-5-1.png">5-1

<img src="/img/xxl-job.pdf-5-2.png">5-2
<img src="/img/xxl-job.pdf-6-0.png">6-0

我们也可以查看一下 xxl.job.executor.logpath 对应的日志



<img src="/img/xxl-job.pdf-6-1.png">6-1
