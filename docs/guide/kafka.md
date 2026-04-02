# Kafka
---
aliases:
  - kafka
标题: kafka
---
**SpringBoot整合Kafka**


**笔记本：** kafka


**创建时间：** 2021/10/19 22:59 **更新时间：** 2021/10/19 23:06


**作者：** 彼岸樱速

# **一、Kafka简介**


**Kafka是一个分布式消息队列。★Kafka对消息保存时根据Topic进行归类，发送消息者称**
**为Producer，消息接受者称为Consumer，此外kafka集群有多个kafka实例组成，每个实例**
**(server)称为broker。无论是kafka集群，还是consumer都依赖于zookeeper集群保存一些**
**meta信息，来保证系统可用性。**

# **二、Maven依赖**

```
<!--kafka-->
<dependency>
<groupId>org.springframework.kafka</groupId>
<artifactId>spring-kafka</artifactId>
</dependency>

# **三、配置**

```

**application.properties**


_`#`_ 指定 _`kafka`_ 代理地址，可以多个
```
spring.kafka.bootstrap-servers=192.168.10.155:9092
```

_`#`_ 生产者序列化
```
spring.kafka.producer.retries=0
```

_`#`_ 每次批量发送消息的数量
```
spring.kafka.producer.batch-size=16384
spring.kafka.producer.buffer-memory=33554432
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.properties.linger.ms=1
```

_`#`_ 消费者配置
```
spring.kafka.consumer.enable-auto-commit=false
spring.kafka.consumer.auto-commit-interval=100ms
```

_`#`_ 指定消息 _`key`_ 和消息体的编解码方式
```
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.properties.session.timeout.ms=15000
```

_`#`_ 指定默认消费者 _`group id`_
```
spring.kafka.consumer.group-id=test-hello-group

# **四、简单测试**

```

1. **控制器**

```
@RestController
@Slf4j
public class KafkaController {

@Autowired
private KafkaTemplate kafkaTemplate;

/**
```

_`*`_ 生成消息
```
*/
@GetMapping ("send")
public String produce( @RequestParam ( value = "msg") String msg) throws ExecutionException,
InterruptedException {
ListenableFuture test_topic = kafkaTemplate.send("test_topic", msg);
log .info(test_topic.get().toString());
```

_`log`_ `.info("` 生产者消息发送成功 `");`
`return` `"` 生产者消息发送成功 `";`
```
}

```

```
/**
```

_`*`_ 消费消息
```
* @param record
*/
@KafkaListener ( topics = "test_topic")
public void listen(ConsumerRecord<?, ?> record) {
log .info("topic = {}, offset = {}, value = {} /n", record.topic(), record.offset(),
record.value());
}
}

```

2. **测试**

<img src="/img/kafka.pdf-1-0.png">1-0

http://localhost:8080/send?msg=wyy


3. **查看结果**


**也可以通过可视化界面kafdrop查看**



<img src="/img/kafka.pdf-1-1.png">1-1
<img src="/img/kafka.pdf-2-0.png">2-0
**Docker搭建Kafdrop(kafka可视化界面)**


**笔记本：** kafka


**创建时间：** 2021/10/19 22:21 **更新时间：** 2021/10/19 22:46


**作者：** 彼岸樱速


**1、docker search kafdrop**


命令:



<img src="/img/kafka.pdf-3-0.png">3-0

<img src="/img/kafka.pdf-3-1.png">3-1



**查看portainer界面，kafdrop的这个按钮**



<img src="/img/kafka.pdf-3-2.png">3-2
<img src="/img/kafka.pdf-4-0.png">4-0

<img src="/img/kafka.pdf-4-1.png">4-1

**其实查看容器日志就可以看出是一个springboot项目的jar包了**


**所以我才知道其实就是加上-Dserver.port=9001来设置自己的端口号，因为9000端口号被占**



<img src="/img/kafka.pdf-4-2.png">4-2



**然后进入到容器内部，想看下有什么启动脚本或者配置文件来着，结果发现了**



<img src="/img/kafka.pdf-4-3.png">4-3
<img src="/img/kafka.pdf-5-0.png">5-0

**而前面的启动命令信息可以看出，可以把-Dserver.port=9001 放到JVM_OPTS这个参数里面**
**就可以了**


**这个时候再访问ip:9001，终于可以访问了，天，花了一晚时间~**



<img src="/img/kafka.pdf-5-1.png">5-1

<img src="/img/kafka.pdf-5-2.png">5-2
**kafka报错**


**笔记本：** kafka


**创建时间：** 2021/10/19 19:46 **更新时间：** 2021/10/19 19:47


**作者：** 彼岸樱速


新安装的单机版kafka启动消费者的时候报错！



<img src="/img/kafka.pdf-6-2.png">6-2



**端口号的问题，以前启动消费者的时候监听的端口是 2181，但是新版本的kafka对zookeeper**
**的依赖没有那么强烈了，所以改成了自己的 9092。**

```
 kafka-console-consumer.sh --bootstrap-server basecoalmine:2181 --topic test --from
 beginning

```

修改端口号

```
kafka-console-consumer.sh --bootstrap-server basecoalmine:9092 -
topic test --from-beginning

```

**docker安装kafka**


**笔记本：** kafka


**创建时间：** 2021/10/19 19:20 **更新时间：** 2021/10/19 19:41


**作者：** 彼岸樱速


**一、下载镜像**





<img src="/img/kafka.pdf-7-1.png">7-1

**二、启动zookeeper**





**三、启动kafka**


**portainer界面中可以看到zookeeper和kafka都起来了**

<img src="/img/kafka.pdf-7-4.png">7-4

**四、创建一个topic**



<img src="/img/kafka.pdf-7-2.png">7-2

<img src="/img/kafka.pdf-7-3.png">7-3




<img src="/img/kafka.pdf-8-0.png">8-0

<img src="/img/kafka.pdf-8-1.png">8-1

**五、kafka设置分区数量**



<img src="/img/kafka.pdf-8-2.png">8-2


