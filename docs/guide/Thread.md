# Thread
---
aliases:
  - Thread
标题: Thread
---
**Java 多线程编程之 Object.wait 方法（工作原理、高级特性、notify 方法与 notifyAll 方法）**


**笔记本：** 多线程编程


**创建时间：** 2025/7/22 16:35 **更新时间：** 2025/7/22 17:10


**URL：** https://blog.csdn.net/weixin_52173250/article/details/146769903

# **Java 多线程编程之 Object.wait 方法（工作原理、高级特性、**


**一、wait 方法** **`java`** **AI写代码** **复制** **`运行`**


**1、基本介绍**


1. wait 方法是 Java 中每个对象都拥有的方法，它继承自 Object 类


2. wait 方法使当前线程进入等待状态，直到其他线程调用该对象的 notify 方法或 notifyAll 方法


3. wait 方法必须在同步代码块中使用，否则抛出 InterruptedException 异常

```
 public final void wait() throws InterruptedException

 public final native void wait(long timeoutMillis ) throws InterruptedException;

 public final void wait(long timeoutMillis, int nanos ) throws InterruptedException

```

**2、基本使用**


1. 不带超时的 wait 方法

```
 Object o = new Object();

 new Thread(() -> {

 synchronized ( o ) {

 try {

                    "
 System. out .println("t1 进入等待状态 );

 o .wait();

                      "
 System. out .println("t1 被唤醒后继续执行 );

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

 new Thread(() -> {

 synchronized ( o ) {

 try {
 Thread.sleep(2000);
 System. out .println("t2 唤醒 t1");

 o .notify();

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

```

```
 # 输出结果

 t1 进入等待状态

 t2 唤醒 t1

 t1 被唤醒后继续执行

```

2. 带超时的 wait 方法

```
 Object o = new Object();

 new Thread(() -> {

 synchronized ( o ) {

 try {

                    "
 System. out .println("t1 进入等待状态 );

 o .wait(2000);

                      "
 System. out .println("t1 被唤醒后继续执行 );

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

 # 输出结果

 t1 进入等待状态

 t1 被唤醒后继续执行

```

3. 必须在同步代码块中使用 wait 方法

```
 Object o = new Object();

 try {

 o .wait();

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }

 # 输出结果

 Exception in thread "main" java.lang.IllegalMonitorStateException: current thread is not owner

```

**3、wait 方法对比 sleep 方法**

|特性|wait方法|
|---|---|
|所属类|Object类|
|释放锁|会释放锁|
|唤醒方式|notify / notifyAll /超时 /中断|
|使用场景|线程间协作|



**二、wait 方法工作原理**


**1、wait 方法与对象锁的关系**


**（1）基本介绍**


1. 调用 wait 方法前：必须持有对象锁


2. 调用 wait 方法后：立即释放对象锁


3. 被唤醒后：需要重新竞争对象锁，再继续执行


**（2）演示**


1. 被唤醒后，还是需要重新竞争对象锁，再继续执行

```
 Object o = new Object();

 new Thread(() -> {

 synchronized ( o ) {

 try {

                    "
 System. out .println("t1 进入等待状态 );

 o .wait();

                      "
 System. out .println("t1 被唤醒后继续执行 );

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

 new Thread(() -> {

 synchronized ( o ) {

 try {
 Thread.sleep(2000);
 System. out .println("t2 唤醒 t1");

 o .notify();
 Thread.sleep(2000);

                  "
 System. out .println("t2 执行完毕 );

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

 # 输出结果

 t1 进入等待状态

 t2 唤醒 t1

 t2 执行完毕

 t1 被唤醒后继续执行

```

2. 超时后，还是需要重新竞争对象锁，再继续执行

```
 Object o = new Object();

 new Thread(() -> {

 synchronized ( o ) {

 try {

                    "
 System. out .println("t1 进入等待状态 );

 o .wait(2000);

                      "
 System. out .println("t1 被唤醒后继续执行 );

 } catch (InterruptedException e ) {

 e .printStackTrace();

```

```
 }
 }
 }).start();

 new Thread(() -> {

 synchronized ( o ) {

 try {
 Thread.sleep(4000);

                  "
 System. out .println("t2 执行完毕 );

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

 # 输出结果

 t1 进入等待状态

 t2 执行完毕

 t1 被唤醒后继续执行

```

**2、对象监视器模型**


每个 Java 对象都有一个关联的监视器（monitor），包含


1. `Owner Thread` ：当前持有对象锁的线程


2. `Entry Set` ：等待获取对象锁的线程集合


3. `Wait Set` ：调用了 wait 方法的线程集合


**3、** [线程状态转换](https://so.csdn.net/so/search?q=%E7%BA%BF%E7%A8%8B%E7%8A%B6%E6%80%81%E8%BD%AC%E6%8D%A2&spm=1001.2101.3001.7020)


当调用 wait 方法方法时，线程状态会发生一系列变化


1. 线程状态转换 `RUNNABLE -> WAITING / TIMED_WAITING`


2. 释放对象锁


3. 进入该对象锁的等待集合（ `Wait Set` ）


4. 当调用 notify 方法后，线程状态转换 `WAITING -> BLOCKED` （等待获取对象锁）


5. 获取对象锁后，线程状态转换 `BLOCKED -> RUNNABLE`


**三、wait 方法高级特性**


**1、虚假唤醒**


1. 虚假唤醒是指线程在没有收到 notify / notifyAll 的情况下从 wait 返回，虚假唤醒可能由以下原因引起


2. 某些操作系统的线程调度机制可能导致 wait 提前返回，即使没有收到 notify / notifyAll


3. JVM 实现可能在某些情况下允许虚假唤醒


防御虚假唤醒的正确模式：wait 放在 while 语句中检查条件，而不是 if 语句，这样可以确保即使发生虚假


```
 synchronized (【锁对象】) {

 while (【条件】) {

 【锁对象】.wait();

 }
```

_`//`_ 处理逻辑
```
 }

```

**2、中断处理**


**（1）基本介绍**


wait 会响应中断，抛出 InterruptedException 异常，中断处理最佳策略是


1. 捕获 InterruptedException 异常


2. 恢复中断状态，即调用 interrupt 方法


**（2）演示**

```
 Object o = new Object();

 Thread t1 = new Thread(() -> {

 synchronized ( o ) {

 try {

                    "
 System. out .println("t1 进入等待状态 );

 o .wait();

                      "
 System. out .println("t1 被唤醒后继续执行 );

 } catch (InterruptedException e ) {

                 "
 System. out .println("t1 被中断 );

 System. out .println("t1 中断状态：" + Thread.currentThread().isInterrupted());
 Thread.currentThread().interrupt();
 System. out .println("t1 中断状态：" + Thread.currentThread().isInterrupted());
 }
 }
 });

 Thread t2 = new Thread(() -> {

 synchronized ( o ) {

 try {
 Thread.sleep(2000);
 System. out .println("t2 中断 t1");

 t1 .interrupt();

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 });

 t1 .start();

 t2 .start();

 # 输出结果

 t1 进入等待状态

 t2 中断 t1

 t1 被中断

 t1 中断状态： false

 t1 中断状态： true

```

**四、notify 方法与 notifyAll 方法**


**1、基本介绍**


1. notify 方法随机唤醒等待集合（ `Wait Set` ）中的 1 个线程

```
 public final native void notify()

```

2. notifyAll 方法唤醒等待集合（ `Wait Set` ）中的所有线程

```
 public final native void notifyAll()

```

3. notify 方法与 notifyAll 方法必须在同步代码块中使用，否则抛出 InterruptedException 异常


**2、演示**


1. notify 方法

```
 Object o = new Object();

 new Thread(() -> {

 synchronized ( o ) {

 try {

                    "
 System. out .println("t1 进入等待状态 );

 o .wait();

                      "
 System. out .println("t1 被唤醒后继续执行 );

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

 new Thread(() -> {

 synchronized ( o ) {

 try {

                    "
 System. out .println("t2 进入等待状态 );

 o .wait();

                      "
 System. out .println("t2 被唤醒后继续执行 );

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

 new Thread(() -> {

 synchronized ( o ) {

 try {
 Thread.sleep(2000);

                       "
 System. out .println("t3 随机唤醒 1 个线程 );

 o .notify();

 } catch (InterruptedException e ) {

 e .printStackTrace();
 }
 }
 }).start();

 # 输出结果

 t1 进入等待状态

 t2 进入等待状态

```

```
t3 随机唤醒 1 个线程

t1 被唤醒后继续执行

```

2. notifyAll 方法

```
Object o = new Object();

new Thread(() -> {

synchronized ( o ) {

try {

                    "
System. out .println("t1 进入等待状态 );

o .wait();

                      "
System. out .println("t1 被唤醒后继续执行 );

} catch (InterruptedException e ) {

e .printStackTrace();
}
}
}).start();

new Thread(() -> {

synchronized ( o ) {

try {

                    "
System. out .println("t2 进入等待状态 );

o .wait();

                      "
System. out .println("t2 被唤醒后继续执行 );

} catch (InterruptedException e ) {

e .printStackTrace();
}
}
}).start();

new Thread(() -> {

synchronized ( o ) {

try {
Thread.sleep(2000);

                    "
System. out .println("t3 唤醒全部线程 );

o .notifyAll();

} catch (InterruptedException e ) {

e .printStackTrace();
}
}
}).start();

# 输出结果

t1 进入等待状态

t2 进入等待状态

t3 唤醒全部线程

t1 被唤醒后继续执行

t2 被唤醒后继续执行

```

3. notify 方法与 notifyAll 方法必须在同步代码块中使用

```
Object o = new Object();

new Thread(() -> {

synchronized ( o ) {

try {

                    "
System. out .println("t1 进入等待状态 );

o .wait();

```

```
                      "
System. out .println("t1 被唤醒后继续执行 );

} catch (InterruptedException e ) {

e .printStackTrace();
}
}
}).start();

try {
Thread.sleep(1000);
} catch (InterruptedException e ) {

e .printStackTrace();
}

o .notify();

# 输出结果

t1 进入等待状态

Exception in thread "main" java.lang.IllegalMonitorStateException: current thread is not owner

Object o = new Object();

new Thread(() -> {

synchronized ( o ) {

try {

                    "
System. out .println("t1 进入等待状态 );

o .wait();

                      "
System. out .println("t1 被唤醒后继续执行 );

} catch (InterruptedException e ) {

e .printStackTrace();
}
}
}).start();

try {
Thread.sleep(1000);
} catch (InterruptedException e ) {

e .printStackTrace();
}

o .notifyAll();

# 输出结果

t1 进入等待状态

Exception in thread "main" java.lang.IllegalMonitorStateException: current thread is not owner

```

**CountDownLatch与Thread.join()的区别**


**笔记本：** 多线程编程


**创建时间：** 2024/3/11 1:24 **更新时间：** 2024/3/11 1:26



<img src="/img/Thread.pdf-8-0.png">8-0

<img src="/img/Thread.pdf-8-1.png">8-1


<img src="/img/Thread.pdf-9-0.png">9-0

<img src="/img/Thread.pdf-9-1.png">9-1


<img src="/img/Thread.pdf-10-0.png">10-0

<img src="/img/Thread.pdf-10-1.png">10-1


**java并发包之atomic包**


**笔记本：** 多线程编程


**创建时间：** 2024/3/11 1:03 **更新时间：** 2024/3/11 1:17


java多线程相关类的实现都在Java的并发包concurrent，concurrent包主要包含3部分内容。


第一个是atomic包，里面主要是一些原子类，比如AtomicInteger、AtomicIntegerArray等；


第二个是locks包，里面主要是锁相关的类，比如ReentrantLock、Condition等；


第三个就是属于concurrent包的内容，主要包括线程池相关类（Executors）、阻塞集合类


（BlockingQueue）、并发Map类（ConcurrentHashMap）、线程相关类（Thread、Runnable、


Callable）等。

# **atomic包**


在并发编程中很容易出现并发安全的问题，有一个很简单的例子就是多线程更新变量i=1,比如多个线程执行


i++操作，就有可能获取不到正确的值，而这个问题，最常用的方法是通过Synchronized进行控制来达到线


程安全的目的。但是由于synchronized是采用的是悲观锁策略，并不是特别高效的一种解决方案。atomic包


提供了一系列的操作简单，性能高效，并能保证线程安全的类去更新基本类型变量，数组元素，引用类型以及


更新对象中的字段类型。atomic包下的这些类都是采用的是 **乐观锁** 策略去原子更新数据， 在java中则是 **使用**


**CAS操作具体实现** 。


**原子更新基本类型**


atomic包提高原子更新基本类型的工具类，主要有这些：


1. AtomicBoolean：以原子更新的方式更新boolean；


2. AtomicInteger：以原子更新的方式更新Integer;


3. AtomicLong：以原子更新的方式更新Long；


这几个类的用法基本一致，这里以AtomicInteger为例总结常用的方法


还有一些方法，可以查看API，不再赘述。为了能够弄懂AtomicInteger的实现原理，以getAndIncrement方


法为例，来看下源码：



<img src="/img/Thread.pdf-11-0.png">11-0

<img src="/img/Thread.pdf-11-1.png">11-1



可以看出，该方法实际上是调用了unsafe实例的getAndAddInt方法，unsafe实例的获取时通过UnSafe类的


静态方法getUnsafe获取：


Unsafe类在sun.misc包下，Unsafer类提供了一些底层操作，atomic包下的原子操作类的也主要是通过


Unsafe类提供的compareAndSwapInt，compareAndSwapLong等一系列提供CAS操作的方法来进行实


现。 **atomicInteger借助了UnSafe提供的CAS操作能够保证数据更新的时候是线程安全的，并且由于CAS是**


**采用乐观锁策略，因此，这种数据更新的方法也具有高效性** 。


**原子更新数组类型**


atomic包下提供能原子更新数组中元素的类有：


1. AtomicIntegerArray：原子更新整型数组中的元素；


2. AtomicLongArray：原子更新长整型数组中的元素；


3. AtomicReferenceArray：原子更新引用类型数组中的元素


这几个类的用法一致，就以AtomicIntegerArray来总结下常用的方法：


可以看出，AtomicIntegerArray与AtomicInteger的方法基本一致，只不过在AtomicIntegerArray的方法中


会多一个指定数组索引位i。下面举一个简单的例子：



<img src="/img/Thread.pdf-12-0.png">12-0

<img src="/img/Thread.pdf-12-1.png">12-1



通过getAndAdd方法将位置为1的元素加5，从结果可以看出索引为1的元素变成了7，该方法返回的也是相加


之前的数为2。


**原子更新引用类型**


如果需要原子更新引用类型变量的话，为了保证线程安全，atomic也提供了相关的类：


1. AtomicReference：原子更新引用类型；


2. AtomicReferenceFieldUpdater：原子更新引用类型里的字段；


3. AtomicMarkableReference：原子更新带有标记位的引用类型；


这几个类的使用方法也是基本一样的，以AtomicReference为例，来说明这些类的基本用法。下面是一个


demo

```
 public class AtomicDemo {

 private static AtomicReference<User> reference = new AtomicReference<>();

 public static void main(String[] args) {

```

```
 User user1 = new User("a", 1);

 reference.set(user1);

 User user2 = new User("b",2);

 User user = reference.getAndSet(user2);

 System.out.println(user);

 System.out.println(reference.get());

 }

 static class User {

 private String userName;

 private int age;

 public User(String userName, int age) {

 this.userName = userName;

 this.age = age;

 }

 @Override

 public String toString() {

 return "User{" +

 "userName='" + userName + '/'' +

 ", age=" + age +

 '}';

 }

 }

 }

```

输出结果：

```
 User{userName='a', age=1}

 User{userName='b', age=2}

```

首先将对象User1用AtomicReference进行封装，然后调用getAndSet方法，从结果可以看出，该方法会原子


更新引用的user对象，变为 `User{userName='b', age=2}` ，返回的是原来的user对象User `{userName='a',`


`age=1}` 。


**原子更新字段类型**


如果需要更新对象的某个字段，并在多线程的情况下，能够保证线程安全，atomic同样也提供了相应的原子


操作类：


1. AtomicIntegeFieldUpdater：原子更新整型字段类；


2. AtomicLongFieldUpdater：原子更新长整型字段类；


3. AtomicStampedReference： **原子更新引用类型，这种更新方式会带有版本号。而为什么在更新的时**


**候会带有版本号，是为了解决CAS的ABA问题**


要想使用原子更新字段需要两步操作：


1. 原子更新字段类都是抽象类，只能通过静态方法 `newUpdater` 来创建一个更新器，并且需要设置想要更新


的类和属性；


2. 更新类的属性必须使用 `public volatile` 进行修饰；


这几个类提供的方法基本一致，以AtomicIntegerFieldUpdater为例来看看具体的使用

```
 public class AtomicDemo {

 private static AtomicIntegerFieldUpdater updater =

 AtomicIntegerFieldUpdater.newUpdater(User.class,"age");

 public static void main(String[] args) {

 User user = new User("a", 1);

 int oldValue = updater.getAndAdd(user, 5);

 System.out.println(oldValue);

 System.out.println(updater.get(user));

 }

```

```
 static class User {

 private String userName;

 public volatile int age;

 public User(String userName, int age) {

 this.userName = userName;

 this.age = age;

 }

 @Override

 public String toString() {

 return "User{" +

 "userName='" + userName + '/'' +

 ", age=" + age +

 '}';

 }

 }

 }

```

输出结果：

```
 1

 6

```

从示例中可以看出，创建 `AtomicIntegerFieldUpdater` 是通过它提供的静态方法进行创建， `getAndAdd` 方法会将


指定的字段加上输入的值，并且返回相加之前的值。user对象中age字段原值为1，加5之后，可以看出user对


象中的age字段的值已经变成了6。


如下是AtomicStampedReference的demo



<img src="/img/Thread.pdf-14-0.png">14-0
**volatile与Java内存模型**


**笔记本：** 多线程编程


**创建时间：** 2024/3/11 1:08 **更新时间：** 2024/3/11 1:17


**URL：** https://blog.csdn.net/m0_37450089/article/details/120427569

# **volatile与Java内存模型**


在 **多线程** 并发编程中synchronized和volatile都扮演着重要的角色，Volatile是轻量级的同步机制 是一个可以保证


“ ”
它在并发编程中保证了共享变量的 可见性 。


可见性的意思是当一个线程修改一个共享变量时，另外一个线程能读到这个修改的值。


如果volatile变量修饰符使用恰当的话，它比synchronized的使用和执行成本更低，因为它不会引起线程上下文


**volatile的内存语义**


即 Volatile如何保证内存可见性:


当写一个volatile变量时，JMM会把该线程对应的本地内存中的共享变量值立即刷新回主内存中。


当读一个volatile变量时，JMM会把该线程对应的本地内存设置为无效，直接从主内存中读取共享变量


所以volatile的写内存语义是直接刷新到主内存中，读的内存语义是直接从主内存中读取。


**volatile的两条实现原则**


**如果对声明了volatile的变量进行写操作，JVM就会向这个写线程发送一条Lock前缀的指令，将这个变量所在


**但是，就算写回到主内存，如果其他线程本地内存的值还是旧的，再执行计算操作就会有问题。


所以，在多线程场景下，为了保证各个线程的缓存是一致的，就会实现缓存一致性协议，


每个线程通过嗅探在总线上传播的数据来检查自己缓存的值是不是过期了，


当线程发现自己缓存的值对应的主内存的值被修改，就会将当前线程缓存的值设置成无效状态，


当线程对这个数据进行修改操作的时候，会重新从系统主内存中把数据读到本地内存里。


如果对声明了volatile的变量进行写操作，会锁定这块本地内存的缓存并回写到主内存，并使用缓存一致性机制


此操作被称为“缓存锁定”，缓存一致性机制会阻止同时修改由两个以上线程缓存的本地内存数据。


如果一个线程通过嗅探技术检测到其他线程打算写主内存，那么正在嗅探的线程就会将当前线程缓存的值设置


当线程对这个数据进行修改操作的时候，会重新从系统主内存中把数据读到本地内存里。


**什么是内存屏障:**


内存屏障（也称内存栅栏，内存栅障，屏障指令等，是一类同步屏障指令，是CPU或编译器在对内存随机访问


使得此点之前的所有读写操作都执行后才可以开始执行此点之后的操作），避免代码重排序。


内存屏障其实就是一种JVM指令，Java内存模型的重排规则会要求Java编译器在生成JVM指令时插入特定的内


通过这些内存屏障指令，volatile实现了Java内存模型中的可见性和有序性，但volatile无法保证原子性。


<img src="/img/Thread.pdf-16-0.png">16-0

内存屏障之前的所有写操作都要回写到主内存，


内存屏障之后的所有读操作都能获得内存屏障之前的所有写操作的最新结果(实现了可见性)。


因此重排序时，不允许把内存屏障之后的指令重排序到内存屏障之前。


一句话：对一个 volatile 域的写, happens-before 于任意后续对这个 volatile 域的读，也叫写后读。


**volatile凭什么可以保证可见性和有序性？？？**


内存屏障 (Memory Barriers / Fences)


阻止屏障两边的指令重排序


写数据时加入屏障，强制将线程私有工作内存的数据刷回主物理内存


读数据时加入屏障，线程私有工作内存的数据失效，重新到主物理内存中获取最新数据


为了实现volatile的内存语义，编译器在生成字节码时，会在指令序列中插入内存屏障来禁止特定类型的处理器


对于编译器来说，发现一个最优布置来最小化插入屏障的总数几乎不可能。


为此，JMM采取保守策略。下面是基于保守策略的JMM内存屏障插入策略。


- 在每个volatile写操作的前面插入一个StoreStore屏障。


- 在每个volatile写操作的后面插入一个StoreLoad屏障。


- 在每个volatile读操作的后面插入一个LoadLoad屏障。


- 在每个volatile读操作的后面插入一个LoadStore屏障。


上述内存屏障插入策略非常保守，但它可以保证在任意处理器平台，任意的程序中都能得到正确的volatile内存


**JVM中提供了四类内存屏障指令**


**C++源码分析**


IDEA工具里面找 `Unsafe.class`


<img src="/img/Thread.pdf-17-0.png">17-0

OpenJDK中 `Unsafe.java`


<img src="/img/Thread.pdf-18-0.png">18-0
```
Unsafe.cpp

```

这三个方法分别调用OrderAccess的 三个方法



<img src="/img/Thread.pdf-18-1.png">18-1
```
OrderAccess.hpp

```

四个内存屏障指令就分别对应这四个方法

```
orderAccess_linux_x86.inline.hpp

```

这四个内存屏障指令其实调用的就是刚才所看到的OrderAccess中的三个方法


这三个方法涉及到 **asm** 汇编语言，就不再深究了。



<img src="/img/Thread.pdf-19-0.png">19-0
<img src="/img/Thread.pdf-20-0.png">20-0

**四大屏障分别是什么意思**



<img src="/img/Thread.pdf-20-1.png">20-1
<img src="/img/Thread.pdf-21-0.png">21-0

**happens-before 之 volatile 变量规则**


当第一个操作为volatile读时，不论第二个操作是什么，都不能重排序。这个操作保证了volatile读之后的操作不


当第二个操作为volatile写时，不论第一个操作是什么，都不能重排序。这个操作保证了volatile写之前的操作不


当第一个操作为volatile写时，第二个操作为volatile读时，不能重排。


**JMM 就将内存屏障插⼊策略分为 4 种**


1. 在每个 volatile 写操作的前⾯插⼊⼀个 StoreStore 屏障


2. 在每个 volatile 写操作的后⾯插⼊⼀个 StoreLoad 屏障



<img src="/img/Thread.pdf-21-1.png">21-1
<img src="/img/Thread.pdf-22-0.png">22-0

<img src="/img/Thread.pdf-22-1.png">22-1

1. 在每个 volatile 读操作的后⾯插⼊⼀个 LoadLoad 屏障


2. 在每个 volatile 读操作的后⾯插⼊⼀个 LoadStore 屏障


<img src="/img/Thread.pdf-23-0.png">23-0

<img src="/img/Thread.pdf-23-1.png">23-1

**凭什么我们java写了一个volatile关键字，系统底层就加入内存屏障？这两者有什么关系?**


<img src="/img/Thread.pdf-24-0.png">24-0

当某个字段加上volatile时，字节码中对应的Field的flags就会添加一个ACC_VOLATILE


当JVM将字节码生成为机器码的时候，发现操作是volatile的变量的话，就会根据JMM要求，在相应的位置去插


**volatile特性**


当一个变量定义为 volatile 之后，将具备两种特性：


volatile可见性：对一个volatile 的读，总可以看到对这个变量最终的写。


禁止指令重排序（有序性）：JVM 底层采用“内存屏障”来实现 volatile 语义，



<img src="/img/Thread.pdf-24-1.png">24-1
对volatile修饰的成员变量进行读写时，


会插入内存屏障，而内存屏障可以达到禁止重排序的效果，从而保证有序性


但是不保证原子性


**保证可见性**


保证不同线程对这个变量进行操作时的可见性，即变量一旦改变所有线程立即可见


不加volatile，没有可见性，程序无法停止


加了volatile，保证可见性，程序可以停止

```
 package com dongguo juc. . ;

 import java util concurrent. . .TimeUnit;

 /**
 * @author Dongguo
 * @date 2021/9/6 0006-23:02
 * @description:
 */
 public class VolatileSeeDemo {
```

`static` `boolean` `flag` `=` `true;` _`//`_ 不加 _`volatile`_ ，没有可见性


_`//static volatile boolean flag = true; //`_ 加了 _`volatile`_ ，保证可见性

```
 public static void main(String[] args ) {
 new Thread(() -> {
 System. out .println(Thread.currentThread().getName() + "/t come in");
 while ( flag ) {

```

_`//`_ 死循环
```
 }
 System. out .println(Thread.currentThread().getName() + "/t flag被修改为false,退出..
 }, "t1").start();

```

_`//`_ 暂停 _`2`_ 秒钟后让 _`main`_ 线程修改 _`flag`_ 值
```
 try {
 TimeUnit. SECONDS .sleep(2);
 } catch (InterruptedException e ) {
 e .printStackTrace();
 }
 flag = false;

                          "
 System. out .println("main线程修改完成 );
 }
 }

```

运行是无法停止的


线程t1 将flag= true 从主内存中读取到本地内存 执行while(true)


主线程 将自己本地内存的running true改为false


线程t1 是无法感知到的


加上volatile 能够停止 保证了线程可见性

```
 package com dongguo juc. . ;

 import java util concurrent. . .TimeUnit;

 /**
 * @author Dongguo
 * @date 2021/9/6 0006-23:02
 * @description:
 */
 public class VolatileSeeDemo {
```

_`// static boolean flag = true; //`_ 不加 _`volatile`_ ，没有可见性
`static` `volatile` `boolean` `flag` `=` `true;` _`//`_ 加了 _`volatile`_ ，保证可见性


```
 public static void main(String[] args ) {
 new Thread(() -> {
 System. out .println(Thread.currentThread().getName() + "/t come in");
 while ( flag ) {

```

_`//`_ 死循环
```
 }
 System. out .println(Thread.currentThread().getName() + "/t flag被修改为false,退出..
 }, "t1").start();

```

_`//`_ 暂停 _`2`_ 秒钟后让 _`main`_ 线程修改 _`flag`_ 值
```
 try {
 TimeUnit. SECONDS .sleep(2);
 } catch (InterruptedException e ) {
 e .printStackTrace();
 }
 flag = false;

                          "
 System. out .println("main线程修改完成 );
 }
 }
 运行结果

 t1   come in

 main 线程修改完成

 t1   flag 被修改为 false, 退出 .....

```

**线程t1中为何看不到被主线程main修改为false的flag的值？**


**问题:**


1. 主线程修改了flag之后没有及时将其刷新到主内存，所以t1线程看不到。


2. 因为t1线程需要频繁从主内存中读取flag的值，JIT编译器就会将flag的值缓存到自己工作内存的高速缓存中


以减少对主内存中flag的访问，以提高效率。


主线程将flag刷新到了主内存，但是t1一直读取的是自己工作内存中flag的值，


没有去主内存中更新获取flag最新的值。


我们的诉求：


1.线程中修改了工作内存中的副本之后，立即将其刷新到主内存；


2.工作内存中每次读取共享变量时，都去主内存中重新读取，然后拷贝到工作内存。


**解决** ：


使用volatile修饰共享变量，就可以达到上面的效果，被volatile修改的变量有以下特点：


1. 线程中读取的时候，每次读取都会去主内存中读取共享变量最新的值，然后将其复制到工作内存


2. 线程中修改了工作内存中变量的副本，修改之后会立即刷新到主内存


当然加同步锁也是可以 不过对有个共享变量的操作推荐使用volatile


<img src="/img/Thread.pdf-27-0.png">27-0

**volatile变量的读写过程**


Java内存模型中定义的8种工作内存与主内存之间的原子操作


read(读取)→load(加载)→use(使用)→assign(赋值)→store(存储)→write(写入)→lock(锁定)→unlock(解锁)


read: 作用于主内存，将变量的值从主内存传输到工作内存，主内存到工作内存


load: 作用于工作内存，将read从主内存传输的变量值放入工作内存变量副本中，即数据加载


use: 作用于工作内存，将工作内存变量副本的值传递给执行引擎，每当JVM遇到需要该变量的字节码指令时会


assign: 作用于工作内存，将从执行引擎接收到的值赋值给工作内存变量，每当JVM遇到一个给变量赋值字节码


store: 作用于工作内存，将赋值完毕的工作变量的值写回给主内存


write: 作用于主内存，将store传输过来的变量值赋值给主内存中的变量


由于上述只能保证单条指令的原子性，针对多条指令的组合性原子保证，没有大面积加锁，所以，JVM提供了



<img src="/img/Thread.pdf-27-1.png">27-1
lock: 作用于主内存，将一个变量标记为一个线程独占的状态，只是写时候加锁，就只是锁了写变量的过程。


unlock: 作用于主内存，把一个处于锁定状态的变量释放，然后才能被其他线程占用


**没有原子性**


volatile变量的复合操作(如i++)不具有原子性

```
 package com dongguo juc. . ;

 import java util concurrent. . .TimeUnit;

 /**
 * @author Dongguo
 * @date 2021/9/6 0006-23:14
 * @description:
 */
 class MyNumber
 {
 volatile int number = 0;

 public void addPlusPlus()
 {

 number ++;
 }
 }

 public class VolatileNoAtomicDemo
 {
 public static void main(String[] args ) throws InterruptedException
 {
 MyNumber myNumber = new MyNumber();

 for (int i = 1; i <=10; i ++) {

 new Thread(() -> {
 for (int j = 1; j <= 1000; j ++) {
 myNumber .addPlusPlus();

 }
 },String.valueOf( i )).start();
 }

```

_`//`_ 暂停几秒钟线程
```
 try { TimeUnit. SECONDS .sleep(3); } catch (InterruptedException e ) { e .printStackTrace(); }
 System. out .println(Thread.currentThread().getName() + "/t" + myNumber . number );
 }
 }
 运行结果

 main   9987

```

为什么不是10000呢？


**volatile —AB正常顺序读写**


主内存变量值为3，A将3读取到自己的本地内存


A执行3+1 =4，将4写回主内存中


主内存变量值为4，B将4读取到自己的本地内存中


B执行4+1 =5，将5写回主内存中


那么为什么会出现执行10000次，只累加到了9000多呢？（volatile不保证原子性）


**异常即AB同时发生读写**


主内存变量值为3，A将3读取到自己的本地内存


此时，B将3也读取到自己的本地内存中


A执行3+1=4，将4写回主内存


B执行3+1=4，在将4写回主内存时判断主内存的值已经发生变化不是3了，本次操作就作废了


B再次读取主内存中的值4到自己的本地内存中


B执行4+1=5，将5写回主内存


执行了3次操作，加了两次1


**不保证原子性原因**


**从i++的字节码角度说明不保证原子性**


number++被拆分成了3个指令:


执行getfield拿到原始值number；


执行iadd进行加1操作；


执行 putfield把累加后的值写回


原子性指的是一个操作是不可中断的，即使是在多线程环境下，一个操作一旦开始就不会被其他线程影响。

```
 public void add()
 {
```

`i` `++;` _`//`_ 不具备原子性，该操作是先读取值，然后写回一个新值，相当于原来的值加上 _`1`_ ，分 _`3`_ 步完成
```
 }

```

如果第二个线程在第一个线程读取旧值和写回新值期间读取i的域值，那么第二个线程就会与第一个线程一起看


并执行相同值的加1操作，这也就造成了线程安全失败，因此对于add方法必须使用synchronized修饰，以便保



<img src="/img/Thread.pdf-29-0.png">29-0
<img src="/img/Thread.pdf-30-0.png">30-0

多线程环境下，"数据计算"和"数据赋值"操作可能多次出现，即操作非原子。若数据在加载之后，若主内存cou


载，从而不会对变更操作做出相应变化，即私有内存和公共内存中变量不同步，进而导致数据不一致


对于volatile变量，JVM只是保证从主内存加载到线程工作内存的值是最新的，也就是数据加载时是最新的。


由此可见volatile解决的是变量读时的可见性问题，但无法保证原子性，对于多线程修改共享变量的场景必须使


**读取赋值一个普通变量的情况**


当线程1对主内存对象发起read操作到write操作第一套流程的时间里，线程2随时都有可能对这个主内存对象发


<img src="/img/Thread.pdf-31-0.png">31-0

**没有加volatile** ，线程1对主内存对象发起read操作到write操作时，其他线程随时都有可能再次发起read操作到


**volatile既然一修改就是可见，为什么还不能保证原子性？**


volatile主要是对其中部分指令做了处理


**要求要use(使用)一个变量的时候必需load(载入），要载入的时候必需从主内存read(读取）**这样就解决了读


写操作是把 **assign和store做了关联(在assign(赋值)后必需store(存储))。store(存储)后write(写入)。**


也就是做到了给一个变量赋值的时候一串关联指令直接把变量值写到主内存。


就这样通过用的时候直接从主内存取，在赋值到直接写回主内存做到了内存可见性


<img src="/img/Thread.pdf-32-0.png">32-0

**加了volatile** ，在use和assign之间 use会把工作内存中的值传递给执行引擎CPU 区计算


计算后再赋值执行assign


**在这之间，还没有将新值写回内存，随时都可能会有其他线程读取这个变量的旧值**


也就是说volatile读操作到写操作不是原子性的。


**结论**


读取赋值一个volatile变量的情况


<img src="/img/Thread.pdf-33-0.png">33-0

read-load-use 和 assign-store-write 成为了两个不可分割的原子操作，但是在use和assign之间依然有极小的一


但是无论在哪一个时间点主内存的变量和任一工作内存的变量的值都是相等的。这个特性就导致了volatile变量


那么依靠可见性的特点volatile可以用在哪些地方呢？ 通常volatile用做保存某个状态的boolean值or int值。


《深入理解Java虚拟机》提到：


[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-fGV42YVA-1632358276563)(E:


20210906231808352]


**总结**


JVM的字节码，i++分成三步，间隙期不同步非原子操作(i++)


<img src="/img/Thread.pdf-34-0.png">34-0

**指令禁重排（有序性）**


**指令重排序**


重排序是指编译器和处理器为了优化程序性能而对指令序列进行重新排序的一种手段，有时候会改变程序语句


它需要满足以下两个条件：


不改变程序运行的结果；


不存在数据依赖关系


不存在数据依赖关系，可以重排序；


存在数据依赖关系，禁止重排序


但重排后的指令绝对不能改变原有的串行语义！这点在并发设计中必须要重点考虑！


单线程环境下能确保程序最终执行结果和代码顺序执行的结果一致


多线程环境中线程交替执行，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致是无法确定的


**重排序的分类和执行流程**


在执行程序时，为了提高性能，编译器和处理器常常会对指令做重排序。重排序分3种类型。


1）编译器优化的重排序。编译器在不改变单线程程序语义的前提下，可以重新安排语句的执行顺序。


2）指令级并行的重排序。现代处理器采用了指令级并行技术（Instruction-LevelParallelism，ILP）来将多条指


对应机器指令的执行顺序。


3）内存系统的重排序。由于处理器使用缓存和读/写缓冲区，这使得加载和存储操作看上去可能是在乱序执行


<img src="/img/Thread.pdf-35-0.png">35-0

上述的1属于编译器重排序，2和3属于处理器重排序。这些重排序可能会导致多线程程序


出现内存可见性问题。对于编译器，JMM的编译器重排序规则会禁止特定类型的编译器重排


序（不是所有的编译器重排序都要禁止）。对于处理器重排序，JMM的处理器重排序规则会要


求Java编译器在生成指令序列时，插入特定类型的内存屏障（Memory Barriers，Intel称之为


Memory Fence）指令，通过内存屏障指令来禁止特定类型的处理器重排序。


编译器优化的重排序： 编译器在不改变单线程串行语义的前提下，可以重新调整指令的执行顺序


指令级并行的重排序： 处理器使用指令级并行技术来讲多条指令重叠执行，若不存在数据依赖性，处理器可以


内存系统的重排序： 由于处理器使用缓存和读/写缓冲区，这使得加载和存储操作看上去可能是乱序执行


数据依赖性：若两个操作访问同一变量，且这两个操作中有一个为写操作，此时两操作间就存在数据依赖性。


JMM属于语言级的内存模型，它确保在不同的编译器和不同的处理器平台之上，通过禁止特定类型的编译器重


证。


**案例 ：**


不存在数据依赖关系，可以重排序===> 重排序OK 。


重排前 重排后


int a = 1; //1


int b = 20; //2


int c = a + b; //3


int b = 20; //1


int a = 1; //2


int c = a + b; //3


结论：编译器调整了语句的顺序，但是不影响程序的最终结果。 重排序OK


存在数据依赖关系，禁止重排序===> 重排序发生，会导致程序运行结果不同。


编译器和处理器在重排序时，会遵守数据依赖性，不会改变存在依赖关系的两个操作的执行,但不同处理器和不


用于单处理器和单线程环境，下面三种情况，只要重排序两个操作的执行顺序，程序的执行结果就会被改变。


**volatile的底层实现是通过内存屏障**


见JMM四种内存屏障



<img src="/img/Thread.pdf-35-1.png">35-1
在每一个volatile写操作前面插入一个StoreStore屏障


StoreStore屏障可以保证在volatile写之前，其前面的所有普通写操作都已经刷新到主内存中。


在每一个volatile写操作后面插入一个StoreLoad屏障


StoreLoad屏障的作用是避免volatile写与后面可能有的volatile读/写操作重排序


在每一个volatile读操作后面插入一个LoadLoad屏障


LoadLoad屏障用来禁止处理器把上面的volatile读与下面的普通读重排序。


在每一个volatile读操作后面插入一个LoadStore屏障


LoadStore屏障用来禁止处理器把上面的volatile读与下面的普通写重排序。


_`//`_ 模拟一个单线程，什么顺序读？什么顺序写？
```
 public class VolatileTest {
 int i = 0;

 volatile boolean flag = false;
 public void write(){
 i = 2;

 flag = true;
 }
 public void read(){
 if( flag ){

 System. out .println("---i = " + i );
 }
 }
 }

```


<img src="/img/Thread.pdf-36-0.png">36-0
<img src="/img/Thread.pdf-37-0.png">37-0

<img src="/img/Thread.pdf-37-1.png">37-1

**使用场景**


1单一赋值可以，but含复合运算赋值不可以(i++之类)

```
 volatile int a = 10

 volatile boolean flag = false

```

2状态标记变量，判断业务是否结束

```
 package com dongguo juc prepare. . . ;

 import java util concurrent. . .TimeUnit;

 /**

 *

```

_`*`_ 使用：作为一个布尔状态标志，用于指示发生了一个重要的一次性事件，例如完成初始化或任务结束

_`*`_ 理由：状态标志并不依赖于程序内任何其他状态，且通常只有一种状态转换

_`*`_ 例子：判断业务是否结束
```
 */
 public class UseVolatileDemo {
 private volatile static boolean flag = true;

 public static void main(String[] args ){
 new Thread(() -> {
 while( flag ) {

 //do something......
 }
 },"t1").start();

```

_`//`_ 暂停几秒钟线程
```
 try { TimeUnit. SECONDS .sleep(2L); } catch (InterruptedException e ) { e .printStackTrace();

 new Thread(() -> {
 flag = false;

 },"t2").start();
 }
 }

```

3开销较低的读，写锁策略 读多写少的场景

```
 public class UseVolatileDemo
 {
 /**
```

_`*`_ 使用：当读远多于写，结合使用内部锁和 _`volatile`_ 变量来减少同步的开销

_`*`_ 理由：利用 _`volatile`_ 保证读取操作的可见性；利用 _`synchronized`_ 保证复合操作的原子性
```
 */
 public class Counter{
 private volatile int value ;

 public int getValue(){
```

`return` `value` `;` _`//`_ 利用 _`volatile`_ 保证读取操作的可见性

```
 }
 public synchronized int increment(){
```

`return` `value` `++;` _`//`_ 利用 _`synchronized`_ 保证复合操作的原子性
```
 }
 }
 }

```

4、Double Check **双重校验锁** 。（DCL）


double-checked locking 单例模式

```
 package com dongguo concurrent. . ;

 import com sun xml internal bind v2 model core. . . . . . . . ID ;

 /**
 * @author Dongguo
 * @date 2021/9/7 0007-7:38
 * @description:
 */
 public class DoubleCheckSingleton {
 private /*volatile*/ static DoubleCheckSingleton singleton ;

```

_`//`_ 私有化构造方法
```
 private DoubleCheckSingleton() {
 }
```

_`//`_ 双重锁设计
```
 public static DoubleCheckSingleton getInstance() {
 if ( singleton == null) {

```

_`//1.`_ 多线程并发创建对象时，会通过加锁保证只有一个线程能创建对象
```
 synchronized (DoubleCheckSingleton.class) {
 if ( singleton == null) {
```

_`//`_ 隐患：多线程环境下，由于重排序，该对象可能还未完成初始化就被其他线程读取
```
 singleton = new DoubleCheckSingleton();
 }
 }
 }
```

_`//2.`_ 对象创建完毕，执行 _`getInstance()`_ 将不需要获取锁，直接返回创建对象
```
 return singleton ;
 }
 }

```

以上的实现特点是：


懒惰实例化


首次使用 getInstance() 才使用 synchronized 加锁，后续使用时无需加锁


有隐含的，但很关键的一点：第一个 if 使用了 singleton变量，是在同步块之外


**Dcl双重校验锁。为什么要加volatile？**


singleton = new DoubleCheckSingleton();


单线程环境下(或者说正常情况下)，在"问题代码处"，会执行如下操作，保证能获取到已完成初始化的实例


right


多线程环境下，在"问题代码处"，会执行如下操作，由于重排序导致2,3乱序，后果就是其他线程得到的是未完


problem



<img src="/img/Thread.pdf-39-0.png">39-0

<img src="/img/Thread.pdf-39-1.png">39-1
<img src="/img/Thread.pdf-40-0.png">40-0

<img src="/img/Thread.pdf-40-1.png">40-1

导致实际已经创建了单例对象 但返回的是未完全初始化对象

```
 if ( singleton == null) {

```

_`//1.`_ 多线程并发创建对象时，会通过加锁保证只有一个线程能创建对象
```
 synchronized (DoubleCheckSingleton.class) {
 if ( singleton == null) {
```

_`//`_ 隐患：多线程环境下，由于重排序，该对象可能还未完成初始化就被其他线程读取
```
 singleton = new DoubleCheckSingleton();
 }
 }
 }

```

在判断singleton == null就是false了，别的线程就拿着未完全初始化的instance去操作业务，导致调用报错


因为是单例模式，所以之后所有的线程使用的都会是这个未完全初始化的对象


在知晓了问题发生的根源之后，我们可以想出两个办法来实现线程安全的延迟初始化。


1）不允许2和3重排序。


2）允许2和3重排序，但不允许其他线程“看到”这个重排序。


**解决Dcl双重校验锁多线程问题**


**解决1加volatile修饰**

```
 package com dongguo concurrent. . ;

 import com sun xml internal bind v2 model core. . . . . . . . ID ;

 /**
 * @author Dongguo
 * @date 2021/9/7 0007-7:38
 * @description:
 */
 public class DoubleCheckSingleton {
 private volatile static DoubleCheckSingleton singleton ;
```

_`//`_ 私有化构造方法
```
 private DoubleCheckSingleton() {
 }
```

_`//`_ 双重锁设计
```
 public static DoubleCheckSingleton getInstance() {
 if ( singleton == null) {

```

_`//1.`_ 多线程并发创建对象时，会通过加锁保证只有一个线程能创建对象
```
 synchronized (DoubleCheckSingleton.class) {
 if ( singleton == null) {
```

_`//`_ 隐患：多线程环境下，由于重排序，该对象可能还未完成初始化就被其他线程读取
```
 singleton = new DoubleCheckSingleton();
 }
 }
 }
```

_`//2.`_ 对象创建完毕，执行 _`getInstance()`_ 将不需要获取锁，直接返回创建对象
```
 return singleton ;
 }
 }

```

<img src="/img/Thread.pdf-42-0.png">42-0

这个方案本质上是通过禁止2和3之间的重排序，来保证线程安全的延迟初始


化


**解决02采用静态内部类的方式实现**


_`//`_ 现在比较好的做法就是采用静态内部内的方式实现
```
 public class SingletonDemo{
 private SingletonDemo() { }

 private static class SingletonDemoHandler{
 private static SingletonDemo instance = new SingletonDemo();
 }

 public static SingletonDemo getInstance(){
 return SingletonDemoHandler. instance ;
 }
 }

```

<img src="/img/Thread.pdf-43-0.png">43-0
**volatile详解**


**笔记本：** 多线程编程


**创建时间：** 2022/8/25 10:43 **更新时间：** 2024/3/11 0:19


**作者：** 彼岸樱速

# **volatile详解**

问：请谈谈你对volatile的理解？
答：volatile是Java虚拟机提供的轻量级的同步机制，它有３个特性：
１）保证可见性
２）不保证原子性
３）禁止指令重排


刚学完java基础，如果有人问你什么是volatile？它有什么作用的话，相信一定非常懵逼…
可能看了答案，也完全不明白，什么是同步机制？什么是可见性？什么是原子性？什么是指令重
排？


**1.1、什么是JMM模型？**
要想理解什么是可见性，首先要先理解JMM。


JMM（Java内存模型，Java Memory Model）本身是一种抽象的概念，并不真实存在。它描
述的是一组规则或规范，通过这组规范，定了程序中各个变量的访问方法。JMM关于同步的规
定：
１）线程解锁前，必须把共享变量的值刷新回主内存；
２）线程加锁前，必须读取主内存的最新值到自己的工作内存；
３）加锁解锁是同一把锁；


由于JVM运行程序的实体是线程，创建每个线程时，JMM会为其创建一个工作内存（有些地方
称为栈空间），工作内存是每个线程的私有数据区域。


Java内存模型规定所有变量都存储在主内存，主内存是共享内存区域，所有线程都可以访问。


但线程对变量的操作（读取、赋值等）必须在工作内存中进行。因此首先要将变量从主内存拷贝
到自己的工作内存，然后对变量进行操作，操作完成后再将变量写会主内存中。


看了上面对JMM的介绍，可能还是有点懵，接下来用一个卖票系统来进行举例：


１）如下图，此时卖票系统后端只剩下１张票，并已读入主内存中：ticketNum=1。
２）此时网络上有多个用户都在抢票，那么此时就有多个线程同时都在进行买票服务，假设此时
有３个线程都读入了目前的票数：ticketNum=1，那么接着就会买票。
３）假设线程１先抢占到cpu的资源，先买好票，并在自己的工作内存中将ticketNum的值改为
０：ticketNum=0，然后再写回到主内存中。



<img src="/img/Thread.pdf-44-0.png">44-0
此时，线程１的用户已经买到票了，那么线程２，线程３此时应该不能再继续买票了，因此需要
系统通知线程２，线程３，ticketNum此时已经等于０了：ticketNum=0。如果有这样的通知
操作，你就可以理解为就具有可见性。


通过上面对JMM的介绍和举例，可以简单总结下。


JMM内存模型的可见性是指，多线程访问主内存的某一个资源时，如果某一个线程在自己的工


作内存中修改了该资源，并写回主内存，那么JMM内存模型应该要通知其他线程来从新获取最


新的资源，来保证最新资源的可见性。


**1.2、volatile保证可见性的代码验证**


在1.1中，已经基本理解了可见性的含义，接下来用代码来验证一下，volatile确实可以保证可见


性。


**1.2.1、无可见性代码验证**


首先先验证下，不使用volatile，是不是就是没有可见性。



<img src="/img/Thread.pdf-45-0.png">45-0



运行结果如下图，可以看到虽然线程0已经将number的值改为了10，但是主线程还是在while循


环中跑不出来了，因为此时number不具有可见性，系统不会主动通知。


<img src="/img/Thread.pdf-46-0.png">46-0

**1.2.1、volatile保证可见性验证**


在上面代码的第7行给变量number添加volatile后再次测试，如下图，此时主线程成功退出了循


环，因为JMM主动通知了主线程更新number的值了，number已经不为０了。


**2、volatile不保证原子性**


**2.1 什么是原子性？**


理解了上面说的可见性之后，再来理解下什么叫原子性？


原子性是指不可分隔，完整性，即某个线程正在做某个业务时，中间不能被分割。要么同时成
功，要么同时失败。


还是有点抽象，接下来举个例子。


如下图，创建了一个测试原子性的类：TestPragma。在add方法中将n加１，通过查看编译后的
代码可以看到，n++被拆分为３个指令进行执行。



<img src="/img/Thread.pdf-46-1.png">46-1
因此可能存在线程１正在执行第１个指令，紧接着线程２也正在执行第１个指令，这样当线程１
和线程２都执行完３个指令之后，很容易理解，此时n的值只加了１，而实际是有２个线程加了
２次，因此这种情况就是不保证原子性。


**2.2 不保证原子性的代码验证**


在2.1中已经进行了举例，可能存在２个线程执行n++的操作，但是最终n的值却只加了１的情


况，接下来对这种情况再用代码进行演示下。


首先给MyData类添加一个add方法



<img src="/img/Thread.pdf-47-0.png">47-0

<img src="/img/Thread.pdf-47-1.png">47-1

<img src="/img/Thread.pdf-47-2.png">47-2
<img src="/img/Thread.pdf-48-0.png">48-0

结果


**2.3 volatile不保证原子性的解决方法**


上面介绍并证明了volatile不保证原子性，那如果希望保证原子性，怎么办呢？以下提供了２种


方法


**2.3.1 方法１：使用synchronized**
方法1是在add方法上添加synchronized，这样每次只有１个线程能执行add方法。


结果如下图，最终确实可以使number的值为20000，保证了原子性。


但是，实际业务逻辑方法中不可能只有只有number++这１行代码，上面可能还有n行代码逻
辑。现在为了保证number的值是20000，就把整个方法都加锁了（其实另外那n行代码，完全
可以由多线程同时执行的）。所以就优点杀鸡用牛刀，高射炮打蚊子，小题大做了。



<img src="/img/Thread.pdf-48-1.png">48-1

<img src="/img/Thread.pdf-48-2.png">48-2
<img src="/img/Thread.pdf-49-0.png">49-0

**2.3.2 方法１：使用JUC包下的AtomicInteger**


给MyData新增一个原子整型类型的变量num，初始值为0。



<img src="/img/Thread.pdf-49-1.png">49-1



让num也同步加20000次。结果如下图，可以看到，使用原子整型的num可以保证原子性，也就
是number++的时候不会被抢断。



<img src="/img/Thread.pdf-49-2.png">49-2


**3、volatile禁止指令重排**


**3.1 什么是指令重排？**


在第2节中理解了什么是原子性，现在要理解下什么是指令重排？


计算机在执行程序时，为了提高性能，编译器和处理器常常会对指令进行重排：
源代码–>编译器优化重排–>指令并行重排–>内存系统重排–>最终执行指令


处理器在进行重排时，必须要考虑指令之间的数据依赖性。


单线程环境中，可以确保最终执行结果和代码顺序执行的结果一致。


但是多线程环境中，线程交替执行，由于编译器优化重排的存在， **两个线程使用的变量能否保持**
**一致性是无法确定的，结果无法预测** 。


看了上面的文字性表达，然后看一个很简单的例子。
比如下面的mySort方法，在系统指令重排后，可能存在以下３种语句的执行情况：



<img src="/img/Thread.pdf-50-1.png">50-1



以上这３种重排结果，对最后程序的结果都不会有影响，也考虑了指令之间的数据依赖性。


**3.2 单线程单例模式**
看完指令重排的简单介绍后，然后来看下单例模式的代码。



<img src="/img/Thread.pdf-50-3.png">50-3
```
}
}

```

首先是在单线程情况下进行测试，结果如下图。可以看到，构造方法只执行了一次，是没有问题
的。


**3.3 多线程单例模式**
接下来在多线程情况下进行测试，代码如下。


在多线程情况下的运行结果如下图。可以看到，多线程情况下，出现了构造方法执行了２次的情
况。



<img src="/img/Thread.pdf-51-0.png">51-0

<img src="/img/Thread.pdf-51-1.png">51-1
<img src="/img/Thread.pdf-52-0.png">52-0

**3.4 多线程单例模式改进：DCL**
在3.3中的多线程单里模式下，构造方法执行了两次，因此需要进行改进，这里使用双端检锁机
制：Double Check Lock, DCL。即加锁之前和之后都进行检查。


在多次运行后，可以看到，在多线程情况下，此时构造方法也只执行１次了。


**3.5 多线程单例模式改进，DCL版存在的问题**
需要注意的是3.4中的DCL版的单例模式依然不是100%准确的！！！


是不是不太明白为什么3.4DCL版单例模式不是100%准确的原因？
是不是不太明白在3.1讲完指令重排的简单理解后，为什么突然要讲多线程的单例模式？


因为3.4DCL版单例模式可能会由于指令重排而导致问题，虽然该问题出现的可能性可能是千万
分之一，但是该代码依然不是100%准确的。如果要保证100%准确，那么需要添加volatile关键



<img src="/img/Thread.pdf-52-1.png">52-1
字，添加volatile可以禁止指令重排。


接下来分析下，为什么3.4DCL版单例模式不是100%准确？


查看instance = new SingletonDemo();编译后的指令，可以分为以下３步：
１）分配对象内存空间：memory = allocate();
２）初始化对象：instance(memory);
３）设置instance指向分配的内存地址：instance = memory;


由于步骤２和步骤３不存在数据依赖关系，因此可能出现执行132步骤的情况。
比如线程1执行了步骤13，还没有执行步骤2，此时instance!=null，但是对象还没有初始化完
成；
如果此时线程2抢占到cpu，然后发现instance!=null，然后直接返回使用，就会发现instance
为空，就会出现异常。


这就是指令重排可能导致的问题，因此要想保证程序100%正确就需要加volatile禁止指令重
排。


**3.6 volatile保证禁止指令重排的原理**
在3.1中简单介绍了下执行重排的含义，然后通过3.2-3.5，借助单例模式来举例说明多线程情况
下，为什么要使用volatile的原因，因为可能存在指令重排导致程序异常。


接下来就介绍下volatile能保证禁止指令重排的原理。


首先要了解一个概念：内存屏障（Memory Barrier），又称为内存栅栏。它是一个CPU指令，
有２个作用：
１）保证特定操作的执行顺序；
２）保证某些变量的内存可见性；


由于编译器和处理器都能执行指令重排。如果在指令之间插入一条Memory Barrier则会告诉编
译器和CPU，不管什么指令都不能和这条Memory Barrier指令重排序，也就是说，通过插入内
存屏障，禁止在内存屏障前后的指令执行重排需优化。


内存屏障的另一个作用是强制刷出各种CPU的缓存数据，因此任何CPU上的线程都能读取到这
些数据的最新版本。



<img src="/img/Thread.pdf-53-0.png">53-0
**volatile关键字详解**


**笔记本：** 多线程编程


**创建时间：** 2024/3/11 0:01 **更新时间：** 2024/3/11 0:15

# **volatile关键字详解** **1 volatile作用**


**volatile关键字** 的主要作用是使变量在多个线程间可见，方式是强制性从公共堆栈中进行取值。


先看个例子：

```
 public class RunThread extends Thread{
 private boolean isRunning = true;

 public boolean isRunning() {
 return isRunning ;

 }

 public void setRunning(boolean running ) {

 isRunning = running ;

 }

 @Override
 public void run() {

                 " "
 System. out .println( 进入 run 了 );
 while ( isRunning == true){

 }

                 " "
 System. out .println( 线程被停止了 );
 }
 }

 public class TestMain {
 public static void main(String[] args ) {
 try {
 RunThread thread = new RunThread();

 thread .start();

 Thread.sleep(1000);
 thread .setRunning(false);

                   "
 System. out .println( 已经赋值为false");
 }catch (InterruptedException e ){
 e .printStackTrace();
 }
 }
 }

```

运行结果如下：


程序会一直运行下去，造成死循环。因为在启动RunThread.java 线程时，变量private boolean isRunning = tru


存在于公共堆栈及线程的私有堆栈中。线程一直在私有堆栈中取得isRunning的值是true。


而代码thread.setRunning(false) 虽然被执行，更新的确实公共堆栈中的isRunning变量值false，



<img src="/img/Thread.pdf-54-0.png">54-0
所以一直就是死循环状态。内存结构如下图所示：


线程的私有堆栈


这个问题是私有堆栈中的值和公共堆栈中的值不同不造成的。


解决这样的问题就要使用volatile关键字了，它主要的作用就是当线程访问isRunning这个变量时，强制性从公共


更改后RunThread.java 代码如下：

```
 public class RunThread extends Thread{
 volatile private boolean isRunning = true;

 public boolean isRunning() {
 return isRunning ;
 }

 public void setRunning(boolean running ) {

 isRunning = running ;
 }

 @Override
 public void run() {

                 " "
 System. out .println( 进入 run 了 );
 while ( isRunning == true){

 }

                 " "
 System. out .println( 线程被停止了 );
 }
 }

 public class TestMain {
 public static void main(String[] args ) {
 try {
 RunThread thread = new RunThread();

 thread .start();
 Thread.sleep(1000);
 thread .setRunning(false);

                   "
 System. out .println( 已经赋值为false");
 }catch (InterruptedException e ){
 e .printStackTrace();
 }
 }
 }

```

运行结果如下：



<img src="/img/Thread.pdf-55-0.png">55-0

<img src="/img/Thread.pdf-55-1.png">55-1
通过使用volatile关键字，强制的从公共内存中读取变量的值，内存结构如下图所示


读取公共内存


使用volatile关键字增加了实例变量在多个线程之间的可见性。但volatile关键字最致命的缺点是不支持原子性。


原子性(Atomicity)：指事务的不可分割性，一个事物的所有操作要么不间断地全部被执行，要么一个也没有执行


**2 volatile非原子的特性**


示例如下：

```
 public class MyThread extends Thread{
 volatile public static int count ;
 private static void addCount(){
 for (int i =0; i < 1000; i ++){

 count ++;

 }
 System. out .println("count = " + count );
 }

 @Override
 public void run() {
 addCount();
 }
 }

 public class TestRun {
 public static void main(String[] args ) {
 MyThread[] arr = new MyThread[100];
 for (int i = 0; i < 100; i ++){

 arr [ i ] = new MyThread();
 }

 for (int j = 0; j < 100; j ++){

 arr [ j ].start();
 }
 }
 }

```

运行结果如下：



<img src="/img/Thread.pdf-56-0.png">56-0
<img src="/img/Thread.pdf-57-0.png">57-0

更改MyThread.java 文件代码如下：

```
 public class MyThread extends Thread{
 volatile public static int count ;

```

_`//`_ 注意一定要添加 _`static`_ 关键字
_`//`_ 这样 _`synchronized`_ 与 _`static`_ 锁的内容就是 _`MyThread.class`_ 类了，也就达到同步的效果了。
```
 synchronized private static void addCount(){
 for (int i =0; i < 1000; i ++){

 count ++;

 }
 System. out .println("count = " + count );
 }

 @Override
 public void run() {
 addCount();
 }
 }

 public class TestRun {
 public static void main(String[] args ) {
 MyThread[] arr = new MyThread[100];
 for (int i = 0; i < 100; i ++){

 arr [ i ] = new MyThread();
 }

 for (int j = 0; j < 100; j ++){

 arr [ j ].start();
 }
 }
 }

```

运行结果如下：


<img src="/img/Thread.pdf-58-0.png">58-0

在本示例中，如果在方法private static void addCount()前加入synchronized同步关键字，也就没有必要再使用v


关键字volatile主要使用的场合是在多个线程中可以感知实例变量被更改了，并且可以获得最新的 值使用，


也就是用多线程读取共享变量时可以获得最新值使用。


关键字volatile提示线程每次从共享内存中读取变量，而不是从私有内存中读取，这样就保证了同步数据的可见


但在这里需要注意的是：如果修改实例变量中的数据，比如i++，也就是i= i+1，


则这样的操作其实并不是一个原子操作，也就是非线程安全的。表达式i++的操作步骤分解如下：


1 从内存中取出i的值


2 计算i的值


3 将i的值写到内存中


假如在第二步计算值的时候，另外一个线程也修改i的值，那么这个时候就会出现脏数据。


解决的办法其实就是使用 **synchronized** 关键字。所以说volatile本身并不处理数据的原子性，而是强制对数据的


用图演示关键字volatile出现非线程安全的原因，变量在内存中工作的过程如下图所示。


<img src="/img/Thread.pdf-59-0.png">59-0

可以得出以下结论：


1 read 和 load 阶段：从主存复制变量到当前线程工作内存；


2 use 和 assign 阶段：执行代码，改变共享变量值。


3 store 和 write 阶段：用工作内存数据刷新主存对应变量的值。


在多线程环境中，use 和 assign 是多次出现的，但这一操作并不是原子性，也就是在read 和 load 之后，


如果主内存count变量发生修改之后，线程工作内存中的值由于已经加载，不会产生对应的变化 ，


也就是私有内存和公共内存中的变量不同步，所以计算出来的结果会和预期不一样，也就出现了非线程安全问


对于用volatile修饰的变量，jvm虚拟机只是保证从主内存加载到线程工作内存的值是最新的。


例如线程1和线程2在进行read和load的操作中，发现主内存中count的值都是5，那么都会加载这个最新的值。


也就是说，volatile关键字解决的是变量读时的可见性问题，但无法保证原子性，对于多个线程访问同一个实例


**3 原子类也并不完全安全**


示例如下

```
 public class MyService {
 public static AtomicLong al = new AtomicLong();

 public void addNum(){
 System. out .println(Thread.currentThread().getName() + " 加了100 之后的值是 ： " + al .addA
 al .addAndGet(1);

 }
 }

 public class MyThread extends Thread{
 private MyService myService ;

 public MyThread(MyService myService ) {
 this. myService = myService ;
 }

```

```
 @Override
 public void run() {
 super.run();
 myService .addNum();

 }
 }

 public class TestRun {
 public static void main(String[] args ) {
 try {
 MyService service = new MyService();
 MyThread[] array = new MyThread[5];
 for (int i = 0; i < array . length ; i ++){

 array [ i ] = new MyThread( service );
 }
 for (int j = 0; j < array . length ; j ++){

 array [ j ].start();
 }
 Thread.sleep(1000);
 System. out .println( service . al .get());
 }catch (InterruptedException e ){
 e .printStackTrace();
 }
 }
 }

```

运行结果如下：


打印顺序出错了，应该每加1次100再加一次1.出现这样的情况是因为addAndGet()方法是原子的，但方法和方法


更改后的代码如下：

```
 public class MyService {
 public static AtomicLong al = new AtomicLong();

 synchronized public void addNum(){
 System. out .println(Thread.currentThread().getName() + " 加了100 之后的值是 ： " + al .addA

 al .addAndGet(1);
 }
 }

 public class MyThread extends Thread{
 private MyService myService ;

 public MyThread(MyService myService ) {
 this. myService = myService ;

 }

 @Override
 public void run() {
 super.run();
 myService .addNum();
 }
 }

 public class TestRun {

```


<img src="/img/Thread.pdf-60-0.png">60-0
```
 public static void main(String[] args ) {
 try {
 MyService service = new MyService();
 MyThread[] array = new MyThread[5];
 for (int i = 0; i < array . length ; i ++){
 array [ i ] = new MyThread( service );
 }
 for (int j = 0; j < array . length ; j ++){
 array [ j ].start();

 }
 Thread.sleep(1000);
 System. out .println( service . al .get());
 }catch (InterruptedException e ){
 e .printStackTrace();
 }
 }
 }

```

运行结果如下：


从运行结果可以看到，是每次加100再加1，这就是我们想要得到的过程，结果是505的同时还保证在过程中累加


**4 原子类和volatile区别**


volatile 和原子类的使用场景是不一样的，如果我们有一个可见性问题，那么可以使用volatile关键字，


但如果我们的问题是一个组合操作，需要用同步来解决原子性问题的话，那么可以使用原子变量。



<img src="/img/Thread.pdf-61-0.png">61-0
**Thread.yield()方法**


**笔记本：** 多线程编程


**创建时间：** 2024/3/10 22:58 **更新时间：** 2024/3/10 23:18

# **Thread.yield()方法是Thread类中的静态方法，直** **接由类名调用。**


Yield是一种启发式尝试，用于改善线程之间的相对进展，否则会过度利用CPU。 它的使用应与详细的分析和基


准测试相结合，以确保它实际上具有所需的效果。


使用此方法很少合适。 它可能对调试或测试目的很有用，它可能有助于重现因竞争条件而产生的错误。 在设计


并发控制结构（例如 **java.util.concurrent.locks** 包中的结构）时，它也可能很有用。



<img src="/img/Thread.pdf-62-0.png">62-0

根据运行情况得出结论：


通过对比使用Thread.yield()方法和未使用的运行结果，可以发现使用yield()方法后，很大概率上


出现让出CPU给其它线程执行的情况。

```
 class YieldThread implements Runnable {

    public void run() {

      for (int i = 0; i < 5; i++) {

 System.out.println(Thread.currentThread().getName() + "-" + i);

        if (i == 3) {

 Thread.yield();

 }

 }

```

```
 }

 }

 public class YieldDemo {

    public static void main(String[] args) {

 YieldThread yThield = new YieldThread();

 Thread t1 = new Thread(yThield,"t1");

 Thread t2 = new Thread(yThield,"t2");

 t1.setPriority(1);

 t2.setPriority(10);

 System.out.println("t1.getPriority()"+t1.getPriority());

 System.out.println("t2.getPriority()"+t2.getPriority());

 t1.start();

 t2.start();

 }

 }

```

根据运行情况得出结论：


实际运行中发现，Thread.yield()方法并不是仅仅选择让步于同等或者更高优先级的线程。高优先


级的线程也会让步与低优先级的线程。因此高优先级仅仅是线程获得的CPU时间片更多一些，相对执行到的


机会更大，并不是一定先执行。


（1）首先介绍线程运行状态转换，如下图：


新建状态（New）：新创建了一个线程对象。


就绪状态（可执行状态，Runnable）：线程对象创建后，其他线程调用了该对象的start()方法。该状态
的线程位于可运行线程池中，变得可运行，等待获取CPU的使用权。


运行状态（运行状态,Running）：就绪状态的线程获取了CPU，执行程序代码。


阻塞状态（Blocked）：阻塞状态是线程因为某种原因放弃CPU使用权，暂时停止运行。直到线程进入就
绪状态，才有机会转到运行状态。阻塞的情况分三种：


(1) 等待阻塞：运行的线程执行wait()方法，该线程进入等待池中


(2) 同步阻塞：运行的线程在获取对象的同步锁时，若该同步锁被别的线程占用，则该线程进入锁池中


(3) 其他阻塞：运行的线程执行sleep()或join()方法，或者发出了I/O请求时，该线程置为阻塞状态。当
sleep()状态超时、join()等待线程终止或者超时、或者I/O处理完毕时，线程重新转入就绪状态。


死亡状态（Dead）：线程执行完了或者因异常退出了run()方法，该线程结束生命周期。



<img src="/img/Thread.pdf-63-0.png">63-0
（2）理解线程的优先权


接下来，理解线程优先级是很重要的一步，尤其是了解 yield() 函数的工作过程：


1、记住当线程的优先级没有指定时，所有线程都携带普通优先级。
2、优先级可以用从 1 到 10 的范围指定。10 表示最高优先级，1 表示最低优先级，5 是普通优先级。
3、记住优先级最高的线程在执行时被给予优先。但是不能保证线程在启动时就进入运行状态。
4、与在线程池中等待运行机会的线程相比，当前正在运行的线程可能总是拥有更高的优先级。
5、由调度程序决定哪一个线程被执行。
6、t.setPriority() 用来设定线程的优先级。
7、记住在线程 start() 方法被调用之前，线程的优先级应该被设定。
8、你可以使用常量，如 MIN_PRIORITY，MAX_PRIORITY，NORM_PRIORITY 来设定优先级。


（3）Thread.yield


方法作用： 让当前线程从运行状态 转为 就绪状态，以允许具有相同优先级的其他线程获得运行机会。


（4）代码示例：



<img src="/img/Thread.pdf-64-0.png">64-0



多次运行会如下结果：


threads0：1

threads1：1

threads0：2

threads1：2


或者


threads0：1

threads0：2

threads1：1

threads1：2


结论：无法保证yield()达到让步目的，因为让步的线程还有可能被线程调度程序再次选中。


（5）总结如下几点


1、yield 是一个静态的原生（native）方法。


2、yield 告诉当前正在执行的线程把运行机会交给线程池中拥有相同优先级的线程。


3、yield 不能保证使得当前正在运行的线程迅速转换到可运行的状态。


4、它仅能使一个线程从运行状态转到可运行状态，而不是等待或阻塞状态。


5、无法保证yield()达到让步目的，因为让步的线程还有可能被线程调度程序再次选中。


**Thread类中join方法的实现原理**


**笔记本：** 多线程编程


**创建时间：** 2024/3/10 22:36 **更新时间：** 2024/3/10 23:17

# **Thread类中join方法的实现原理** **一.简介**


join()是Thread类的一个方法，根据jdk文档的定义，join()方法的作用，是等待这个线程结束，


即当前线程等待另一个调用join()方法的线程执行结束后再往下执行。


通常用于在main主线程内，等待其它调用join()方法的线程执行结束再继续执行main主线程。


主线程往往将于子线程之前结束，但是如果主线程处理完其他的事务后，需要用到子线程的处理结果，


也就是主线程需要等待子线程执行完成之后再结束，这个时候就要用到join()方法了。

```
 /**
 * Waits for this thread to die.

 *

 */
 public final void join() throws InterruptedException

```

**二.使用示例**


通过下面两个例子，我们来看看使用join()方法的作用是什么。


**1.不使用join()方法的情况**

```
 public class CreateThreadTest {
 public static void main( String [] args ) {

               " "
 System . out .println( 主线程执行开始 );
 Thread threadA = new Thread(new RunnableTest(), "线程A");

 threadA .start();

               " "
 System . out .println( 主线程执行结束 );
 }
 }

 class RunnableTest implements Runnable{
 @Override
 public void run() {
 System . out .println( Thread .currentThread().getName() + "执行开始");
 try {
 Thread .sleep(5000);
 } catch (InterruptedException e ) {
 e .printStackTrace();
 }
 System . out .println( Thread .currentThread().getName() + "执行结束");
 }
 }

```

执行结果如下：

```
 主线程执行开始

 线程 A 执行开始

 主线程执行结束

 线程 A 执行结束

```

因为上述子线程执行时间相对较长，所以主线程执行结束之后子线程才执行结束。


**2.使用了join()方法的情况**

```
 public class CreateThreadTest {
 public static void main( String [] args ) {

               " "
 System . out .println( 主线程执行开始 );
 Thread threadA = new Thread(new RunnableTest(), "线程A");

 threadA .start();
 try {
 threadA .join();
 } catch (InterruptedException e ) {
 e .printStackTrace();
 }

               " "
 System . out .println( 主线程执行结束 );
 }
 }

 class RunnableTest implements Runnable{
 @Override
 public void run() {
 System . out .println( Thread .currentThread().getName() + "执行开始");
 try {
 Thread .sleep(5000);
 } catch (InterruptedException e ) {
 e .printStackTrace();
 }
 System . out .println( Thread .currentThread().getName() + "执行结束");
 }
 }

```

执行结果如下：

```
 主线程执行开始

 线程 A 执行开始

 线程 A 执行结束

 主线程执行结束

```

对子线程threadA调用了join()方法之后，我们发现主线程会等待子线程执行结束之后才继续往下执行。


**三.join()方法的实现原理**


下面通过Thread类源码(JDK1.8)来深入了解一下join()方法：

```
 public final void join() throws InterruptedException {
 join(0);
 }

 public final synchronized void join(long millis ) throws InterruptedException {
 long base = System .currentTimeMillis();
 long now = 0;

 if ( millis < 0) {
 throw new IllegalArgumentException("timeout value is negative");
 }

 if ( millis == 0) {
 while (isAlive()) {
 wait(0);
 }
 } else {
 while (isAlive()) {
 long delay = millis - now ;
 if ( delay <= 0) {
 break;
 }
 wait( delay );
 now = System .currentTimeMillis() - base ;
 }
 }
 }

```

上述代码，有两个代码需要注意下，其一：


```
 public final synchronized void join(long millis ) throws InterruptedException {}

```

成员方法加了synchronized说明是synchronized(this)，this是谁？this就是threadA子线程对象本身。


也就是说，主线程持有了threadA这个子线程对象的锁。


其二：

```
 while (isAlive()) {
 wait(0);
 }

```

注意，这个wait()方法是Object类中的方法，也就是说执行wait()方法之后主线程会释放threadA对象的锁，


进入等待状态，直到被再次唤醒。大家都知道，有了wait()，必然有notify()，什么时候才会notify呢？在jvm源码

```
 // 一个 c++ 函数：

 void JavaThread::exit(bool destroy_vm, ExitType exit_type) ；

 // 里面有一个不起眼的一行代码

 ensure_join(this);

 static void ensure_join(JavaThread* thread) {

 Handle threadObj(thread, thread->threadObj());

 ObjectLocker lock(threadObj, thread);

 thread->clear_pending_exception();

 java_lang_Thread::set_thread_status(threadObj(), java_lang_Thread::TERMINATED);

 java_lang_Thread::set_thread(threadObj(), NULL);

 // 同志们看到了没，别的不用看，就看这一句

 //thread 就是当前线程，是啥？就是刚才例子中说的 threadA 线程

 lock.notify_all(thread);

 thread->clear_pending_exception();

 }

```

当子线程threadA执行结束的时候，jvm会自动唤醒阻塞在threadA对象上的线程，在我们的例子中也就是主线程


至此，threadA线程对象被notifyall了，那么主线程也就能继续跑下去了。


**四.总结**


在main主线程中调用threadA.join()方法，因为join() 方法是一个synchronized方法，所以 **主线程会首先持有thre**


接下来在join()方法里面调用wait()方法， **主线程会释放thread线程对象的锁，进入等待状态** 。


最后，threadA线程执行结束，JVM会调用 **lock.notify_all(thread);**


**唤醒持有threadA这个对象锁的线程，也就是主线程，所以主线程会继续往下执行** 。


**synchronized实战例子**


**笔记本：** 多线程编程


**创建时间：** 2021/8/5 0:42 **更新时间：** 2024/3/10 23:10


**作者：** 彼岸樱速


**1、账号测试类**



<img src="/img/Thread.pdf-68-0.png">68-0



**2、实现一个ATM模拟类Bank，它使用subtractAmount()方法对账户的余额进行扣除，实现**
**Runnable接口。**
```
/**
```

_`*`_ _**`@author`**_ wuyuying
```
* @version 1.0.0
* @date 2021/7/12 17:25
```

_`*`_ _**`@description`**_ 实现一个 _`ATM`_ 模拟类 _`Bank`_ ，它使用 _`subtractAmount()`_ 方法对账户的余额进行扣除，实现 _`Runnable`_ 接口。
```
*/

public class Bank implements Runnable {

/**
* The account affected by the operations
*/

private Account account;

/**
* Constructor of the class. Initializes the account
* @param account The account affected by the operations
*/

public Bank(Account account) {
this .account=account;
}

```

```
/**
* Core method of the Runnable
*/
@Override
public void run() {
for ( int i=0; i<100; i++){
account.subtractAmount(1000);
}
}

}

```

**3、公司类，公司负责收钱**
```
/**
```

_`*`_ _**`@author`**_ wuyuying
```
* @version 1.0.0
* @date 2021/7/12 17:27
```

_`*`_ _**`@description`**_ 公司类，公司负责收钱
```
*/

public class Company implements Runnable {

/**
* The account affected by the operations
*/

private Account account;

/**
* Constructor of the class. Initializes the account
*

* @param account the account affected by the operations
*/

public Company(Account account) {

this .account = account;
}

/**
* Core method of the Runnable
*/
@Override
public void run() {
for ( int i = 0; i < 100; i++) {
account.addAmount(1000);
}
}
}

```

**4、测试类**
```
/**
```

_`*`_ _**`@author`**_ wuyuying
```
* @version 1.0.0
* @date 2021/7/12 17:28
* @description
*/

public class GetMoneyTest {
/**
* Main method of the example
* @param args
*/

public static void main(String[] args) {
```

_`//`_ 创建账户
```
Account account= new Account();
```

_`//`_ 初始化账户余额为 _`1000`_
```
account.setBalance(1000);

// Prints the initial balance

System.out.printf("Account : Initial Balance: %f/n", account.getBalance());

// Creates a new Company and a Thread to run its task
Company company= new Company(account);
Thread companyThread= new Thread(company);

// Creates a new Bank and a Thread to run its task

Bank bank= new Bank(account);
Thread bankThread= new Thread(bank);

// Starts the Threads
companyThread.start();
bankThread.start();

try {
// Wait for the finalization of the Threads
companyThread.join();
bankThread.join();
// Print the final balance

```

```
System.out.printf("Account : Final Balance: %f/n", account.getBalance());
```

_`//`_ 相同时间内，存与取执行后应该是相等的。如果我们在方法中不去使用 _`synchronized`_ 关键字，那么得出的结
果就不对了。

```
// Account : Initial Balance: 1000.000000

// Account : Final Balance: 1000.000000

} catch (InterruptedException e) {
e.printStackTrace();
}
}
}

```

**Condition的作用(用一个例子来理解)**


**笔记本：** 多线程编程


**创建时间：** 2021/10/18 19:34 **更新时间：** 2023/1/31 17:32


**作者：** 彼岸樱速


**问题**


自己编的的一个小题目：有两个线程，一个会不断的向一个共享变量上边添加字符 A ，另一个会
不断的添加字符 + ，


要求共享变量最后达到 "A+A+A+A+..." 这样的形式。


**不考虑线程同步和协调会怎么样**


我们启两个线程，分别不断的向一个volatile变量追加A和+，然后每隔一段时间打印出这个变量
观察。


**代码** ：

```
public class ConditionTest {

private volatile static String kp = "";

public static void main(String[] args) {

Thread tA = new Thread(() -> {
while(true) {

kp = kp + "A";

try {

```

**`TimeUnit.`** _**`SECONDS`**_ **`.sleep(1);`** _**`//`**_ **不会释放锁**

```
} catch (InterruptedException e) {
e.printStackTrace();
}
}
});

Thread tB = new Thread(() -> {
while(true) {

kp = kp + "+";

try {

```

**`TimeUnit.`** _**`SECONDS`**_ **`.sleep(1);`** _**`//`**_ **不会释放锁**

```
} catch (InterruptedException e) {
e.printStackTrace();
}
}
});

tA.start();
tB.start();
while(true) {
System. out .println( kp );

try {
TimeUnit. SECONDS .sleep(1);

} catch (InterruptedException e) {
e.printStackTrace();
}
}
}
}

```

运行结果：



<img src="/img/Thread.pdf-71-1.png">71-1


```
 A++A++A+AA+++A++A

 A++A++A+AA+++A++AA

 A++A++A+AA+++A++AA+

 A++A++A+AA+++A++AA+A

 A++A++A+AA+++A++AA+AA

 A++A++A+AA+++A++AA+AA+A

 A++A++A+AA+++A++AA+AA+A+A

```

显然不满足题目的要求。


**解决问题**


要解决的问题其实是：协调多个线程 **按指定的交替顺序** 向共享变量追加相应的字符。
思路，设置一个ReentrantLock上两个Condition，A，B两个线程分别对应ConditionA和
ConditionB，
比如Thread A做完自己的操作，就会通过ConditionA.singal()通知其他线程，
然后通过ConditionB.await()表明自己阻塞等待ConditionB也就是Thread B的操作。


完整代码：

```
public class ConditionTest {

private volatile static String kp = "";

private static ReentrantLock lock = new ReentrantLock(false);

private static Condition conditionA = lock .newCondition();

private static Condition conditionB = lock .newCondition();

public static void main(String[] args) {

Thread tA = new Thread(() -> {
while(true) {

try {
lock .lock();

kp = kp + "A";

```

**`TimeUnit.`** _**`MILLISECONDS`**_ **`.sleep(200);;`** _**`//`**_ **不会释放锁**


_**`conditionA`**_ **`.signal();`** _**`//`**_ **通知** _**`tB`**_ **自己的操作做完了**


_**`conditionB`**_ **`.await();`** _**`//`**_ **自己等待** _**`Conditon B`**_ **也就是** _**`tB`**_ **的操作**

```
} catch (Exception e) {
e.printStackTrace();

} finally {
if( lock .isHeldByCurrentThread())
lock .unlock();
}
}
});

Thread tB = new Thread(() -> {
while(true) {

try {
lock .lock();

kp = kp + "+";

```

**`TimeUnit.`** _**`MILLISECONDS`**_ **`.sleep(500);`** _**`//`**_ **不会释放锁**
```
conditionB .signal();
conditionA .await();

} catch (Exception e) {
e.printStackTrace();

} finally {
if( lock .isHeldByCurrentThread())
lock .unlock();
}
}
});

tA.start();
tB.start();

while(true) {
System. out .println( kp );

try {
TimeUnit. MILLISECONDS .sleep(700);

} catch (InterruptedException e) {
e.printStackTrace();
}
}

```

```
}
}

```

运行结果：



<img src="/img/Thread.pdf-73-0.png">73-0



**但是如果只是保留Lock代码而注释condition代码，运行结果如下：**



<img src="/img/Thread.pdf-73-1.png">73-1



**总结+提要**


Condition就是依附于ReentrantLock锁的一个“条件”，条件和锁一起可以用来协调安排多个
线程的执行，


比如上述例子里边，两个线程围绕竞争一把锁，锁是可以确保只有持有锁的一个线程在执行，


但Condition可以更进一步精确的让线程指定自己等待的是哪一个线程持有锁执行完了之后、自
己才执行。可以理解条件是某一个锁逻辑上分解出来的更细粒度的锁。


**Condition的特性:**


**例子2**

```
public class ConditionTask {

private final Lock lock = new ReentrantLock();

private final Condition addCondition = lock.newCondition();

```


<img src="/img/Thread.pdf-73-2.png">73-2
<img src="/img/Thread.pdf-74-0.png">74-0
































<img src="/img/Thread.pdf-75-0.png">75-0



































**运行结果**

```
 add Banana, The Lists Size is 1
 add Banana, The Current Thread is Thread-0

 ==============================

 add Banana, The Lists Size is 2
 add Banana, The Current Thread is Thread-1

 ==============================

 add Banana, The Lists Size is 3
 add Banana, The Current Thread is Thread-2

 ==============================

 add Banana, The Lists Size is 4
 add Banana, The Current Thread is Thread-3

 ==============================

 add Banana, The Lists Size is 5
 add Banana, The Current Thread is Thread-4

 ==============================

 add Banana, The Lists Size is 6
 add Banana, The Current Thread is Thread-5

 ==============================

 add Banana, The Lists Size is 7
 add Banana, The Current Thread is Thread-6

 ==============================

 add Banana, The Lists Size is 8
 add Banana, The Current Thread is Thread-7

 ==============================

 add Banana, The Lists Size is 9
 add Banana, The Current Thread is Thread-8

 ==============================

 add Banana, The Lists Size is 10
 add Banana, The Current Thread is Thread-9

 ==============================

 The list is full, please wait
 The list is full, please wait
 The list is full, please wait
 The list is full, please wait
 The list is full, please wait
 The list is full, please wait
 The list is full, please wait
 The list is full, please wait
 The list is full, please wait
 The list is full, please wait
 sub Banana, The Token Banana is [add Banana1]
 sub Banana, The Lists Size is 9
 sub Banana, The Current Thread is Thread-20

```

```
==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-10

==============================

sub Banana, The Token Banana is [add Banana2]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-21

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-11

==============================

sub Banana, The Token Banana is [add Banana3]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-22

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-12

==============================

sub Banana, The Token Banana is [add Banana4]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-23

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-13

==============================

sub Banana, The Token Banana is [add Banana5]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-24

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-14

==============================

sub Banana, The Token Banana is [add Banana6]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-25

==============================

sub Banana, The Token Banana is [add Banana7]
sub Banana, The Lists Size is 8
sub Banana, The Current Thread is Thread-26

==============================

add Banana, The Lists Size is 9
add Banana, The Current Thread is Thread-15

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-16

==============================

sub Banana, The Token Banana is [add Banana8]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-27

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-17

==============================

sub Banana, The Token Banana is [add Banana9]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-28

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-18

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-29

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-19

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-30

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 8
sub Banana, The Current Thread is Thread-31

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 7
sub Banana, The Current Thread is Thread-32

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 6
sub Banana, The Current Thread is Thread-33

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 5
sub Banana, The Current Thread is Thread-34

==============================

sub Banana, The Token Banana is [add Banana9]
sub Banana, The Lists Size is 4
sub Banana, The Current Thread is Thread-35

==============================

sub Banana, The Token Banana is [add Banana10]

```

```
sub Banana, The Lists Size is 3
sub Banana, The Current Thread is Thread-36

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 2
sub Banana, The Current Thread is Thread-37

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 1
sub Banana, The Current Thread is Thread-38

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 0
sub Banana, The Current Thread is Thread-39

==============================

The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
The list is empty, please wait
add Banana, The Lists Size is 1
add Banana, The Current Thread is Thread-60

==============================

sub Banana, The Token Banana is [add Banana1]
sub Banana, The Lists Size is 0
sub Banana, The Current Thread is Thread-40

==============================

add Banana, The Lists Size is 1
add Banana, The Current Thread is Thread-61

==============================

sub Banana, The Token Banana is [add Banana1]
sub Banana, The Lists Size is 0
sub Banana, The Current Thread is Thread-41

==============================

add Banana, The Lists Size is 1
add Banana, The Current Thread is Thread-65

==============================

add Banana, The Lists Size is 2
add Banana, The Current Thread is Thread-62

==============================

add Banana, The Lists Size is 3
add Banana, The Current Thread is Thread-78

==============================

add Banana, The Lists Size is 4
add Banana, The Current Thread is Thread-79

==============================

add Banana, The Lists Size is 5
add Banana, The Current Thread is Thread-71

==============================

add Banana, The Lists Size is 6
add Banana, The Current Thread is Thread-66

==============================

add Banana, The Lists Size is 7
add Banana, The Current Thread is Thread-70

==============================

add Banana, The Lists Size is 8
add Banana, The Current Thread is Thread-72

==============================

add Banana, The Lists Size is 9
add Banana, The Current Thread is Thread-69

==============================

add Banana, The Lists Size is 10
add Banana, The Current Thread is Thread-67

==============================

The list is full, please wait
The list is full, please wait
The list is full, please wait
The list is full, please wait
The list is full, please wait
The list is full, please wait
The list is full, please wait
The list is full, please wait
sub Banana, The Token Banana is [add Banana1]
sub Banana, The Lists Size is 9
sub Banana, The Current Thread is Thread-42

==============================

sub Banana, The Token Banana is [add Banana2]

```

```
sub Banana, The Lists Size is 8
sub Banana, The Current Thread is Thread-43

==============================

sub Banana, The Token Banana is [add Banana3]
sub Banana, The Lists Size is 7
sub Banana, The Current Thread is Thread-44

==============================

sub Banana, The Token Banana is [add Banana4]
sub Banana, The Lists Size is 6
sub Banana, The Current Thread is Thread-45

==============================

sub Banana, The Token Banana is [add Banana5]
sub Banana, The Lists Size is 5
sub Banana, The Current Thread is Thread-46

==============================

sub Banana, The Token Banana is [add Banana6]
sub Banana, The Lists Size is 4
sub Banana, The Current Thread is Thread-47

==============================

sub Banana, The Token Banana is [add Banana7]
sub Banana, The Lists Size is 3
sub Banana, The Current Thread is Thread-48

==============================

sub Banana, The Token Banana is [add Banana8]
sub Banana, The Lists Size is 2
sub Banana, The Current Thread is Thread-49

==============================

sub Banana, The Token Banana is [add Banana9]
sub Banana, The Lists Size is 1
sub Banana, The Current Thread is Thread-50

==============================

sub Banana, The Token Banana is [add Banana10]
sub Banana, The Lists Size is 0
sub Banana, The Current Thread is Thread-51

==============================

add Banana, The Lists Size is 1
add Banana, The Current Thread is Thread-73

==============================

add Banana, The Lists Size is 2
add Banana, The Current Thread is Thread-68

==============================

add Banana, The Lists Size is 3
add Banana, The Current Thread is Thread-77

==============================

add Banana, The Lists Size is 4
add Banana, The Current Thread is Thread-74

==============================

add Banana, The Lists Size is 5
add Banana, The Current Thread is Thread-64

==============================

add Banana, The Lists Size is 6
add Banana, The Current Thread is Thread-75

==============================

add Banana, The Lists Size is 7
add Banana, The Current Thread is Thread-63

==============================

add Banana, The Lists Size is 8
add Banana, The Current Thread is Thread-76

==============================

sub Banana, The Token Banana is [add Banana1]
sub Banana, The Lists Size is 7
sub Banana, The Current Thread is Thread-52

==============================

sub Banana, The Token Banana is [add Banana2]
sub Banana, The Lists Size is 6
sub Banana, The Current Thread is Thread-53

==============================

sub Banana, The Token Banana is [add Banana3]
sub Banana, The Lists Size is 5
sub Banana, The Current Thread is Thread-54

==============================

sub Banana, The Token Banana is [add Banana4]
sub Banana, The Lists Size is 4
sub Banana, The Current Thread is Thread-55

==============================

sub Banana, The Token Banana is [add Banana5]
sub Banana, The Lists Size is 3
sub Banana, The Current Thread is Thread-56

==============================

sub Banana, The Token Banana is [add Banana6]
sub Banana, The Lists Size is 2
sub Banana, The Current Thread is Thread-57

==============================

sub Banana, The Token Banana is [add Banana7]
sub Banana, The Lists Size is 1
sub Banana, The Current Thread is Thread-58

==============================

sub Banana, The Token Banana is [add Banana8]
sub Banana, The Lists Size is 0
sub Banana, The Current Thread is Thread-59

==============================

```

Condition是一个接口，这个接口是为了结合ReentrantLock实现管程模型。再次搬出Java中的管
程示意图。


Lock与Condition这两者之间的关系可以参考synchronized和wait()/notify()。


Condition声明了一组等待/通知的方法，AbstractQueuedSynchronizer 中的ConditionObject内
部类实现了这个接口。 通过API的方式来对ReentrantLock进行类似于wait和notify的操作 。

```
 // Codition 方法 void await() throws InterruptedException;

 boolean await(long time, TimeUnit unit) throws InterruptedException;

 void signal();

 void signalAll();

```

**3.2 Condition原理**


在每个Condition中, 都维护着一个队列，每当执行await()方法，都会将当前线程封装为一个节
点，并添加到条件等待队列尾部。然后彻底释放与Condition对象绑定的锁（也就是
ReentrantLock对象），注意这里是彻底释放，无论ReentrantLock重入了几次都会全部释放，在
释放锁的同时还会并唤醒阻塞在锁的入口等待队列中的一个线程，完成以上操作后再将自己阻
塞。


在其他线程调用该Condition的signal()后，该线程会被唤醒，唤醒后会从条件变量等待队列中将
该线程对应的节点移除 ，然后重新去竞争锁，如果拿不到的话会再次进去入口等待队列中。

```
 public final void await() throws InterruptedException {

 if (Thread.interrupted())

 throw new InterruptedException();

 Node node = addConditionWaiter();
```

**`//`** 彻底释放锁，并唤醒入口等待队列中仍在等待的头节点，可能有的节点在等待途中取消


**`//`** 但队列不会立刻移除这些节点，只是会将等待状态修改为取消，


**`//`** 在需要执行唤醒的时候，再统一将这些已取消的节点移除。

```
 int savedState = fullyRelease(node);

 int interruptMode = 0;
```

**`//`** 判断当前节点是否在入口等待队列中，在入口等待队列中的线程是不持有锁的。


**`//`** 如果对一个不持有锁的对象进行挂起和唤醒操作，则可能出现 **`Lost-weakup`** 问题。

**`//`** 线程在阻塞过程中产生中断也会退出循环。

```
 while (!isOnSyncQueue(node)) {
```

**`//`** 调用 **`LockSupport.park`** 阻塞当前线程



<img src="/img/Thread.pdf-79-0.png">79-0
```
 LockSupport.park(this);
```

**`//`** 唤醒后会检查在阻塞期间是否被中断过，检查的结果是三种状态：

**`//THROW_IE`** 、 **`REINTERRUPT`** 、 **`0`** 。前两种会导致退出循环。


**`/* THROW_IE`** ：

**`*`** 中断在 **`node`** 转移到同步队列 **`“`** 前 **`”`** 发生，需要当前线程自行将 **`node`** 转移到同步


队


**`*`** 列中，并在随后抛出 **`InterruptedException`** 异常。

**`* REINTERRUPT`** ：

**`*`** 中断在 **`node`** 转移到同步队列 **`“`** 期间 **`”`** 或 **`“`** 之后 **`”`** 发生，此时表明有线程正在调用


**`* singal/singalAll`** 转移节点。在该种中断模式下，再次设置线程的中断状态。

# **4.总结**


**synchronized和ReentrantLock 的区别**

|synchronized|ReentrantLock|Col3|
|---|---|---|
|能够响应中断|N|Y|
|支持超时|N|Y|
|非阻塞地获取锁|N|Y|
|可重入|Y|Y|
|支持公平锁|N|Y|
|获取锁/释放锁|自动|手动|
|发生异常时|自动释放锁|需手动释放锁|
|**支持多个条件变量**|N|Y|



**synchronized 依赖于 JVM 而 ReentrantLock 依赖于 API**


synchronized 是依赖于 JVM 实现的，JDK6 为 synchronized 关键字进行了很多优化，这些优化
都是在虚拟机层面实现的。ReentrantLock 是 JDK 层面实现的，也就是 API 层面，需要 lock() 和
unlock() 方法配合 try/finally 语句块来完成。


**ReentrantLock可以支持多个条件变量**


通过synchronized关键字与wait()和notify()/notifyAll()方法相结合实现的管程，其内部只能通过
调用锁定对象的wait()和notify()进行线程间通信。假设有一个生产者多个消费者，消费者在消费
完后需要通知生产者进行生产，但由于生产者和其他消费者都在synchronized锁定的同一个对象
上wait。


调用notify随机唤醒的话，可能会唤醒的消费者，也可能唤醒生产者，如果唤醒生产者则可以进
行生产，如果被唤醒的是消费者，那么该消费者还是会由于没有库存会唤醒其他线程，自己继续
等待，如果消费者的数量远远多于生产者，那么会一直出现消费者唤醒其他消费者的现象，生产
者不会被唤醒，则程序无法继续执行下去；


调用notifyAll方法的话，可以解决这个问题，但也带来另一个问题。唤醒全部消费者的同时也会
唤醒全部生产者，会带来很大的性能开销。


因此如果有一种方式能将生产者和消费者分离开，支持区分类型的唤醒，那这个问题就迎刃而解
了。


通过Lock和Condition实现的管程对这一问题进行了解决，之前开头的时候提过， **Lock解决互**
**斥，Condition解决同步** ，通过ReentrantLock对象的newCondition()方法，可以在锁定对象上绑
定多个条件变量，也就是一个Lock对象中可以创建多个Condition实例。


线程对象可以注册在指定的Condition中，从而可以有选择性的进行线程通知，在调度线程上更
加灵活。Condition实例的signalAll()方法 只会唤醒注册在该Condition实例中的所有等待线程。

```
 Lock lock = new ReentrantLock();

 Condition providers = lock.newCondition();

 Condition consumer = lock.newCondition();

 ...

 // 唤醒所有生产者

 providers.signalAll();

 // 唤醒所以消费者

 consumer.signalAll();

```

**写在最后：**


自己动手实践才是真理，自己写两个线程，然后使用线程断点一步一步的跟着看，在每个环节尽
可能自己模拟多线程并发的情况来观察程序的运行变化。


在本人学习这一部分内容时，也对AQS源码进行了阅读，大致的流程很容易走下来，但是在
流程背后的一些设计细节，却不知其所以然。因此在本篇中没有对整个AQS原理进行详细的
介绍，学习是一个逐渐深入的过程。有的东西需要周期反复的思考才能理解透彻。



<img src="/img/Thread.pdf-81-0.png">81-0
**CyclicBarrier原来是这样的**


**笔记本：** 多线程编程


**创建时间：** 2021/10/15 14:34 **更新时间：** 2023/1/31 15:11


**作者：** 彼岸樱速


**一、官网解释：**


允许一组线程全部等待彼此达到共同屏障点的同步辅助。循环阻塞在涉及固定大小的线程方的程
序中很有用，这些线程必须偶尔等待彼此。屏障被称为循环 ，因为它可以在等待的线程被释放
之后重新使用。


意思就是每个线程都得 **执行到等待点进行等待** ，直到所有线程都执行到等待点，才会继续往下执
行。相当于日常开会，只有等每个参会的人都到之后才会开始会议。


**用法：（以开会举例）**



<img src="/img/Thread.pdf-82-0.png">82-0

<img src="/img/Thread.pdf-82-1.png">82-1














上述代码运行的结果为：


源码解析：


**一、构造方法**


有两个构造方法，只有带Runnable参数的构造方法才会在所有线程都到达等待点之后执行
Runnable里面的run方法。



<img src="/img/Thread.pdf-83-0.png">83-0

<img src="/img/Thread.pdf-83-1.png">83-1

<img src="/img/Thread.pdf-83-2.png">83-2


**二、维护锁状态逻辑**


其底层使用 **ReentrantLock+Condition** 进行锁状态的维护



<img src="/img/Thread.pdf-84-0.png">84-0



具体看看其是如何实现等待逻辑的，线程等待需要调用await方法



<img src="/img/Thread.pdf-84-1.png">84-1



最终调用的是 **dowait** 方法

```
private int dowait(boolean timed, long nanos){

final ReentrantLock lock = this.lock;
```

_**`//1`**_ **、获取锁**
```
lock.lock();

try {

final Generation g = generation;

if (g.broken)

throw new BrokenBarrierException();
```

_**`//2`**_ **、如果线程中断，重置等待线程数量并且唤醒当前等待的线程**

```
if (Thread. interrupted ()) {
breakBarrier();

throw new InterruptedException();
}
```

_**`//3`**_ **、等待线程数减** _**`1`**_

```
int index = --count;
```

_**`//4`**_ **、当等待线程数为时**

```
if (index == 0) { // tripped

boolean ranAction = false;

try {
```

_**`//5`**_ **、执行所有线程都到达等待点之后的** _**`Runnable`**_

```
final Runnable command = barrierCommand;

if (command != null)
command.run();

ranAction = true;

```

<img src="/img/Thread.pdf-85-0.png">85-0























可以看到，是通过 **index字段** 控制线程等待的，


当 **index不为0** 的时候， **线程统一会进行阻塞** ，


直到 **index为0** 的时候，才会 **唤醒所有线程** ，这时候所有线程才会继续往下执行。


**三、重复使用**


这个跟 **CountdownLatch** 不一样的是，


**CountdownLatch** 是 **一次性** 的，


而 **CycliBarrier** 是可以 **重复使用** 的， **只需调用一下reset方法** 。

```
 public void reset() {

 final ReentrantLock lock = this.lock;
 lock.lock();

 try {
```

_**`//1`**_ **、破坏当前的屏障点并唤醒所有线程**
```
      breakBarrier();
```

_**`//2`**_ **、生成下一代**
```
      nextGeneration();

 } finally {
 lock.unlock();
 }
 }

 private void breakBarrier() {

```

<img src="/img/Thread.pdf-86-0.png">86-0

上述就是对CycliBarrier的解析。



<img src="/img/Thread.pdf-86-1.png">86-1
**Semaphore 使用及原理**


**笔记本：** 多线程编程


**创建时间：** 2021/10/15 13:13 **更新时间：** 2023/1/31 11:57


**作者：** 彼岸樱速


**1、Semaphore 是什么**

Semaphore 一般译作 信号量 ，它也是一种线程同步工具，主要用于多个线程对共享资源进行并
行操作的一种工具类。它代表了一种 许可 的概念，是否允许多线程对同一资源进行操作的许可，
使用 Semaphore 可以控制并发访问资源的线程个数。


Semaphore 通常我们叫它信号量， 可以用来控制同时访问特定资源的线程数量，通过协调各
个线程，以保证合理的使用资源。


可以把它简单的理解成我们停车场入口立着的那个显示屏，每有一辆车进入停车场显示屏就会显
示剩余车位减1，每有一辆车从停车场出去，显示屏上显示的剩余车辆就会加1，当显示屏上的
剩余车位为0时，停车场入口的栏杆就不会再打开，车辆就无法进入停车场了，直到有一辆车从
停车场出去为止。


**2、使用场景**


通常用于那些资源有明确访问数量限制的场景，常用于限流 。


比如：数据库连接池，同时进行连接的线程有数量限制，连接不能超过一定的数量，当连接达到
了限制数量后，后面的线程只能排队等前面的线程释放了数据库连接才能获得数据库连接。


比如：停车场场景，车位数量有限，同时只能容纳多少台车，车位满了之后只有等里面的车离开
停车场外面的车才可以进入。


**3、Semaphore常用方法说明**

```
 acquire()
 获取一个令牌，在获取到令牌、或者被其他线程调用中断之前线程一直处于阻塞状态。

 acquire(int permits)
 获取一个令牌，在获取到令牌、或者被其他线程调用中断、或超时之前线程一直处于阻塞状态。
 acquireUninterruptibly()
 获取一个令牌，在获取到令牌之前线程一直处于阻塞状态（忽略中断）。
 tryAcquire()
 尝试获得令牌，返回获取令牌成功或失败，不阻塞线程。

 tryAcquire(long timeout, TimeUnit unit)
 尝试获得令牌，在超时时间内循环尝试获取，直到尝试获取成功或超时返回，不阻塞线程。
 release()
 释放一个令牌，唤醒一个获取令牌不成功的阻塞线程。
 hasQueuedThreads()
 等待队列里是否还存在等待线程。
 getQueueLength()
 获取等待队列里阻塞的线程数。
 drainPermits()
 清空令牌把可用令牌数置为 0 ，返回清空令牌的数量。
 availablePermits()
 返回可用的令牌数量。

```

**4、用semaphore 实现停车场提示牌功能。**


每个停车场入口都有一个提示牌，上面显示着停车场的剩余车位还有多少，


当剩余车位为0时，不允许车辆进入停车场，直到停车场里面有车离开停车场，这时提示牌上会
显示新的剩余车位数。


**业务场景 ：**


1、停车场容纳总停车量10。


2、当一辆车进入停车场后，显示牌的剩余车位数响应的减1.


3、每有一辆车驶出停车场后，显示牌的剩余车位数响应的加1。


4、停车场剩余车位不足时，车辆只能在外面等待。


**代码：**



<img src="/img/Thread.pdf-88-0.png">88-0













**5、Semaphore实现原理**


**(1)、Semaphore初始化。**





1、当调用new Semaphore(2) 方法时，默认会创建一个 **非公平的锁的同步阻塞队列** 。


2、把初始令牌数量赋值给同步队列的state状态，state的值就代表当前所剩余的令牌数量。


**初始化完成后同步队列信息如下图：**


<img src="/img/Thread.pdf-89-0.png">89-0

**（2）获取令牌**





1、当前线程会尝试去同步队列获取一个令牌，获取令牌的过程也就是使用原子的操作去修改同
步队列的state,获取一个令牌则修改为state=state-1。


2、 当计算出来的state<0，则代表令牌数量不足，此时会创建一个Node节点加入阻塞队列，
挂起当前线程。


3、当计算出来的state>=0，则代表获取令牌成功。


源码：



<img src="/img/Thread.pdf-89-2.png">89-2





<img src="/img/Thread.pdf-89-3.png">89-3












```
/**
```

_**`* 1`**_ **、创建节点，加入阻塞队列，**

_**`* 2`**_ **、重双向链表的** _**`head`**_ **，** _**`tail`**_ **节点关系，清空无效节点**

_**`* 3`**_ **、挂起当前节点线程**

```
* @param arg

* @throws InterruptedException
*/

private void doAcquireSharedInterruptibly(int arg) throws InterruptedException {
```

_**`//`**_ **创建节点加入阻塞队列**

```
final Node node = addWaiter(Node.SHARED);

boolean failed = true;

try {

for (;;) {
```

_**`//`**_ **获得当前节点** _**`pre`**_ **节点**


<img src="/img/Thread.pdf-90-0.png">90-0

















**线程1、线程2、线程3、分别调用semaphore.acquire(),整个过程队列信息变化如下图：**


**(3)、释放令牌**



<img src="/img/Thread.pdf-90-1.png">90-1



当调用semaphore.release() 方法时


1、线程会尝试释放一个令牌，释放令牌的过程也就是把同步队列的state修改为 **state=state+1**
的过程


2、释放令牌成功之后，同时会 **唤醒** 同步队列中的一个线程。


3、被唤醒的节点会重新尝试去修改state=state-1 的操作，如果state>=0则获取令牌成功，否
则重新进入阻塞队列，挂起线程。


**源码：**



<img src="/img/Thread.pdf-91-1.png">91-1





<img src="/img/Thread.pdf-91-2.png">91-2

























**继上面的图，当我们线程1调用semaphore.release(); 时候整个流程如下图：**


<img src="/img/Thread.pdf-92-0.png">92-0

**Semaphore 信号量的模型**


上面代码虽然比较简单，但是却能让我们了解到一个信号量模型的 `五脏六腑` 。下面是一个信号量
的模型：


来解释一下 Semaphore ，Semaphore 有一个初始容量，这个初始容量就是 Semaphore 所能够允许
的信号量。在调用 Semaphore 中的 acquire 方法后，Semaphore 的容量 -1，相对的在调用 release
方法后，Semaphore 的容量 + 1，在这个过程中，计数器一直在监控 Semaphore 数量的变化，等到流
量超过 Semaphore 的容量后，多余的流量就会放入等待队列中进行排队等待。等到 Semaphore 的容
量允许后，方可重新进入。


**Semaphore 所控制的流量其实就是一个个的线程，因为并发工具最主要的研究对象就是线**
**程。**


它的工作流程如下



<img src="/img/Thread.pdf-92-1.png">92-1
<img src="/img/Thread.pdf-93-0.png">93-0

这幅图应该很好理解吧，这里就不再过多解释啦。


**Semaphore 深入理解**


在了解 Semaphore 的基本使用和 Semaphore 的模型后，下面我们还是得从源码来和你聊一
聊 Semaphore 的种种细节问题，因为我写文章最核心的东西就是想让我的读者 **了解 xxx，看**
**这一篇就够了** ，这是我写文章的追求，好了话不多说，源码走起来！


**Semaphore 基本属性**


Semaphore 中只有一个属性

```
private final Sync sync;
```

Sync 是 Semaphore 的同步实现，Semaphore 保证线程安全性的方式和 **ReentrantLock** 、

也绕不开 AQS，所以说 AQS 真的太重要了。


**Semaphore 的公平性和非公平性**


那么我们进入 Sync 内部看看它实现了哪些方法

```
abstract static class Sync extends AbstractQueuedSynchronizer {

```

<img src="/img/Thread.pdf-94-0.png">94-0



























































首先是 Sync 的初始化，内部调用了 `setState` 并传递了 permits ，我们知道，AQS 中的 State
其实就是同步状态的值，而 Semaphore 的这个 permits 就是代表了许可的数量。


getPermits 其实就是调用了 getState 方法获取了一下线程同步状态值。后面的
nonfairTryAcquireShared 方法其实是在 Semaphore 中构造了 NonfairSync 中的
tryAcquireShared 调用的



<img src="/img/Thread.pdf-94-1.png">94-1
这里需要提及一下什么是 **`NonfairSync`** ，除了 NonfairSync 是不是还有 **FairSync** 呢？查阅 JDK
源码发现确实有。


那么这里的 FairSync 和 NonfairSync 都代表了什么？为什么会有这两个类呢？


事实上，Semaphore 就像 ReentrantLock 一样，也存在“公平”和"不公平"两种，默认情况
下 Semaphore 是一种不公平的信号量


Semaphore 的不公平意味着它不会保证线程获得许可的顺序，Semaphore 会在线程等待之前
为调用 acquire 的线程分配一个许可，拥有这个许可的线程会自动将自己置于线程等待队列的
头部。


当这个参数为 true 时，Semaphore 确保任何调用 acquire 的方法，都会按照先入先出的顺序
来获取许可。



<img src="/img/Thread.pdf-95-0.png">95-0
<img src="/img/Thread.pdf-96-0.png">96-0

























<img src="/img/Thread.pdf-96-1.png">96-1





























从上面这幅源码对比图可以看到，NonfairSync 和 FairSync 最大的区别就在
于 `tryAcquireShared` 方法的区别。


NonfairSync 版本中，是不会管当前等待队列中是否有排队许可的，它会直接判断信号许可量
和 CAS 方法的可行性。


FairSync 版本中，它首先会判断是否有许可进行排队，如果有的话就直接获取失败。


这时候可能就会有读者问了，你上面说公平性和非公平性的区别一直针对的是 acquire 方法
来说的，怎么现在他们两个主要的区别在于 `tryAcquireShared` 方法呢？


别急，让我们进入到 `acquire` 方法一探究竟


可以看到，在 acquire 方法中，会调用 tryAcquireShared 方法，根据其返回值判断是否调
用 `doAcquireSharedInterruptibly` 方法


这里需要注意下，acquire 方法具有阻塞性，而 tryAcquire 方法不具有阻塞性。
这也就是说，调用 acquire 方法如果获取不到许可，那么 Semaphore 会阻塞，直到有可用
的许可。而 tryAcquire 方法如果获取不到许可会直接返回 false。


这里还需要注意下 `acquireUninterruptibly` 方法，其他 acquire 的相关方法要么是非阻塞，要
么是阻塞可中断，而 acquireUninterruptibly 方法不仅在没有许可的情况下执着的等待，而且
也不会中断，使用这个方法时需要注意，这个方法很容易在出现大规模线程阻塞而导致 Java 进
程出现假死的情况。


有获取许可相对应的就有释放许可，但是释放许可不会区分到底是公平释放还是非公平释放。不
管方式如何都是释放一个许可给 Semaphore ，同样的 Semaphore 中的许可数量会增加。


在上图中调用 tryReleaseShared 判断是否能进行释放后，再会调用 AQS 中
的 `releasedShared` 方法进行释放。



<img src="/img/Thread.pdf-97-0.png">97-0

<img src="/img/Thread.pdf-97-1.png">97-1
<img src="/img/Thread.pdf-98-0.png">98-0

上面这个释放流程只是释放一个许可，除此之外，还可以释放多个许可





后面这个 releaseShared 的释放流程和上面的释放流程一致。


**其他 Semaphore 方法**


除了上面基本的 acquire 和 release 相关方法外，我们也要了解一下 Semaphore 的其他方
法。Semaphore 的其他方法比较少，只有下面这几个


**drainPermits** ： 获取并退还所有立即可用的许可，其实相当于使用 CAS 方法把内存值置为 0


**reducePermits** ：和 `nonfairTryAcquireShared` 方法类似，只不过 nonfairTryAcquireShared
是使用 CAS 使内存值 + 1，而 reducePermits 是使内存值 - 1 。


**isFair** ：对 Semaphore 许可的争夺是采用公平还是非公平的方式，对应到内部的实现就是
FairSync 和 NonfairSync。


**hasQueuedThreads** ：当前是否有线程由于要获取 Semaphore 许可而进入阻塞。


**getQueuedThreads** ：返回一个包含了等待获取许可的线程集合。


**getQueueLength** ：获取正在排队而进入阻塞状态的线程个数


**CompletableFuture使用详解**


**笔记本：** 多线程编程


**创建时间：** 2023/1/31 9:54 **更新时间：** 2023/1/31 11:22


**作者：** 彼岸樱速


**前言**





**一、创建异步任务**
**1. supplyAsync**
supplyAsync是创建带有返回值的异步任务。它有如下两个方法，一个是使用默认线程池
（ForkJoinPool.commonPool()）的方法，一个是带有自定义线程池的重载方法



<img src="/img/Thread.pdf-99-1.png">99-1



**测试代码** ：


**测试结果** ：


**2. runAsync**
runAsync是创建没有返回值的异步任务。它有如下两个方法，一个是使用默认线程池
（ForkJoinPool.commonPool()）的方法，一个是带有自定义线程池的重载方法



<img src="/img/Thread.pdf-99-2.png">99-2

<img src="/img/Thread.pdf-99-3.png">99-3

<img src="/img/Thread.pdf-99-4.png">99-4
<img src="/img/Thread.pdf-100-0.png">100-0



**测试代码** ：


**测试结果** ：


**3.获取任务结果的方法**



<img src="/img/Thread.pdf-100-1.png">100-1

<img src="/img/Thread.pdf-100-2.png">100-2

<img src="/img/Thread.pdf-100-3.png">100-3



**二、异步回调处理**
**1.thenApply和thenApplyAsync**
thenApply 表示某个任务执行完成后执行的动作，即回调方法，会将该任务的执行结果即方法
返回值作为入参传递到回调方法中，带有返回值。


测试代码：



<img src="/img/Thread.pdf-100-4.png">100-4
<img src="/img/Thread.pdf-101-0.png">101-0

测试结果：


从上面代码和测试结果我们发现thenApply和thenApplyAsync区别在于，使用thenApply方法
时子任务与父任务使用的是同一个线程，而thenApplyAsync在子任务中是另起一个线程执行任
务，并且thenApplyAsync可以自定义线程池，默认的使用ForkJoinPool.commonPool()线程
池。


**2.thenAccept和thenAcceptAsync**
thenAccep表示某个任务执行完成后执行的动作，即回调方法，会将该任务的执行结果即方法
返回值作为入参传递到回调方法中，无返回值。


测试代码



<img src="/img/Thread.pdf-101-1.png">101-1

<img src="/img/Thread.pdf-101-2.png">101-2
<img src="/img/Thread.pdf-102-0.png">102-0

测试结果：


从上面代码和测试结果我们发现thenAccep和thenAccepAsync区别在于，使用thenAccep方
法时子任务与父任务使用的是同一个线程，而thenAccepAsync在子任务中可能是另起一个线程
执行任务，并且thenAccepAsync可以自定义线程池，默认的使用
ForkJoinPool.commonPool()线程池。


**2.thenRun和thenRunAsync**
thenRun表示某个任务执行完成后执行的动作，即回调方法，无入参，无返回值。


测试代码：



<img src="/img/Thread.pdf-102-1.png">102-1

<img src="/img/Thread.pdf-102-2.png">102-2
<img src="/img/Thread.pdf-103-0.png">103-0





测试结果：


从上面代码和测试结果我们发现thenRun和thenRunAsync区别在于，使用thenRun方法时子任
务与父任务使用的是同一个线程，而thenRunAsync在子任务中可能是另起一个线程执行任务，
并且thenRunAsync可以自定义线程池，默认的使用ForkJoinPool.commonPool()线程池。


**3.whenComplete和whenCompleteAsync**
whenComplete是当某个任务执行完成后执行的回调方法，会将执行结果或者执行期间抛出的
异常传递给回调方法，如果是正常执行则异常为null，回调方法对应的CompletableFuture的
result和该任务一致，如果该任务正常执行，则get方法返回执行结果，如果是执行异常，则get
方法抛出异常。


测试代码：



<img src="/img/Thread.pdf-103-1.png">103-1
<img src="/img/Thread.pdf-104-0.png">104-0

测试结果：


whenCompleteAsync和whenComplete区别也是whenCompleteAsync可能会另起一个线程
执行任务，并且thenRunAsync可以自定义线程池，默认的使用ForkJoinPool.commonPool()
线程池。



<img src="/img/Thread.pdf-104-1.png">104-1
**4.handle和handleAsync**
跟whenComplete基本一致，区别在于handle的回调方法有返回值。


测试代码：


测试结果 ：


**三、多任务组合处理**
**1.thenCombine、thenAcceptBoth 和runAfterBoth**
这三个方法都是将两个CompletableFuture组合起来处理，只有两个任务都正常完成时，才进
行下阶段任务。



<img src="/img/Thread.pdf-105-0.png">105-0

<img src="/img/Thread.pdf-105-1.png">105-1
区别：thenCombine会将两个任务的执行结果作为所提供函数的参数，且该方法有返回值；
thenAcceptBoth同样将两个任务的执行结果作为方法入参，但是无返回值；runAfterBoth没有
入参，也没有返回值。注意两个任务中只要有一个执行异常，则将该异常信息作为指定任务的执
行结果。


测试代码：



<img src="/img/Thread.pdf-106-0.png">106-0














```
//Thread[ForkJoinPool.commonPool-worker-1,5,main] cf2 do something....
//Thread[main,5,main] cf5 do something....
```

`//cf5` 结果 `->null`
```
}

```

测试结果：


**2.applyToEither、acceptEither和runAfterEither**
这三个方法和上面一样也是将两个CompletableFuture组合起来处理，当有一个任务正常完成
时，就会进行下阶段任务。


区别：applyToEither会将已经完成任务的执行结果作为所提供函数的参数，且该方法有返回
值；acceptEither同样将已经完成任务的执行结果作为方法入参，但是无返回值；
runAfterEither没有入参，也没有返回值。


测试代码：



<img src="/img/Thread.pdf-107-0.png">107-0

<img src="/img/Thread.pdf-107-1.png">107-1




<img src="/img/Thread.pdf-108-0.png">108-0
















`//` 输出结果
```
//Thread[ForkJoinPool.commonPool-worker-1,5,main] cf1 do something....
//Thread[ForkJoinPool.commonPool-worker-2,5,main] cf2 do something....
```

`//cf1` 任务完成
```
//Thread[ForkJoinPool.commonPool-worker-1,5,main] cf5 do something....
```

`//cf5` 任务完成
`//cf5` 结果 `->null`
```
}

```

测试结果：


从上面可以看出cf1任务完成需要2秒，cf2任务完成需要5秒，使用applyToEither组合两个任务
时，只要有其中一个任务完成时，就会执行cf3任务，显然cf1任务先完成了并且将自己任务的结
果传值给了cf3任务，cf3任务中打印了接收到cf1任务完成，接着完成自己的任务，并返回cf3任
务完成；acceptEither和runAfterEither类似，acceptEither会将cf1任务的结果作为cf3任务的
入参，但cf3任务完成时并无返回值；runAfterEither不会将cf1任务的结果作为cf3任务的入
参，它是没有任务入参，执行完自己的任务后也并无返回值。


**3.allOf / anyOf**
allOf：CompletableFuture是多个任务都执行完成后才会执行，只有有一个任务执行异常，则
返回的CompletableFuture执行get方法时会抛出异常，如果都是正常执行，则get返回null。
anyOf ：CompletableFuture是多个任务只要有一个任务执行完成，则返回的
CompletableFuture执行get方法时会抛出异常，如果都是正常执行，则get返回执行完成任务
的结果。


测试代码：



<img src="/img/Thread.pdf-109-0.png">109-0

<img src="/img/Thread.pdf-109-1.png">109-1


<img src="/img/Thread.pdf-110-0.png">110-0






`//` 输出结果
```
//Thread[ForkJoinPool.commonPool-worker-2,5,main] cf1 do something....
//Thread[ForkJoinPool.commonPool-worker-3,5,main] cf2 do something....
//Thread[ForkJoinPool.commonPool-worker-1,5,main] cf2 do something....
```

`//cf1` 任务完成
`//cfAny` 结果 `->cf1` 任务完成
```
}

```

测试结果：



<img src="/img/Thread.pdf-111-0.png">111-0
**InheritableThreadLocal详解**


**笔记本：** 多线程编程


**创建时间：** 2023/1/30 11:24 **更新时间：** 2023/1/30 13:49


**作者：** 彼岸樱速


**本文内容**



<img src="/img/Thread.pdf-112-0.png">112-0



**1. InheritableThreadLocal可以做什么**
我们知道ThreadLocal解决的是让每个线程读取的ThreadLocal变量是相互独立的。通俗的讲就
是，比如我在线程1中set了ThreadLocal的值，那我在线程2中是get不到线程1设置的值的，只
能读到线程2自己set的值。


ThreadLocal有一个需求不能满足：就是子线程无法直接复用父线程的ThreadLocal变量里的内
容。demo如下：


运行结果：



<img src="/img/Thread.pdf-112-1.png">112-1

<img src="/img/Thread.pdf-112-2.png">112-2
可以看到虽然在main线程中启动了一个新的子线程，但是threadlocal变量的内容并没有传递到
新的子线程中。


于是乎，InheritableThreadLocal就出现了。他可以实现在子线程中使用父线程中的线程本地变
量（也即InheritableThreadLocal变量）。


**2. InheritableThreadLocal使用实例**
demo，根据上面的threadlocal测试代码稍作修改，把Threadlocal换做
InheritableThreadLocal。


运行结果如下：


在子线程设置值之前，就已经能够get到主线程设置的值了，说明在父子进制之间传递了
InheritableThreadLocal变量。


**3.InheritableThreadLocal原理**


通过观察InheritableThreadLocal代码Structure，看到只是重写了ThreadLocal的三个方法。
childValue，createMap，getMap。



<img src="/img/Thread.pdf-113-0.png">113-0

<img src="/img/Thread.pdf-113-1.png">113-1
<img src="/img/Thread.pdf-114-0.png">114-0

我们进入到createMap方法中查看。


可以看到，InheritableThreadLocal其实也是用ThreadLocalMap去存放值，这点和
ThreadLocal一样，只不过InheritableThreadLocal的变量在Thread类里的名字叫
inheritableThreadLocals。我们进到Thread类中看这个变量。


当我们在主线程start一个子线程时，会new 一个Thread。所以我们要追到Thread类中，看看
创建线程时发生了什么才让父子线程的InheritableThreadLocal可以传递。

<img src="/img/Thread.pdf-114-3.png">114-3


首先我们调用的是Thread（Runnable target）这个方法。


这个方法会调用init方法，然后经过一系列init函数重载，最终来到下面这个init方法。



<img src="/img/Thread.pdf-114-1.png">114-1

<img src="/img/Thread.pdf-114-2.png">114-2
<img src="/img/Thread.pdf-115-0.png">115-0

在这个init方法里 ，跟InheritableThreadLocal紧密相关的有下面这些代码：


这里还是处于初始化阶段，此时获取到的当前线程，还是调用它的父线程。


重点就是if里面的逻辑。
if (inheritThreadLocals && parent.inheritableThreadLocals != null)


第一项inheritThreadLocals 是传进来的boolean值，重载时传的是true，所以满足条件。


第二项就是判断父线程中的inheritableThreadLocals 是不是空，如果不是空就满足条件。


当同时满足if的两个条件后，就执行


新创建出来的子线程的inheritableThreadLocals 变量就和父线程的inheritableThreadLocals
的内容一样了。



<img src="/img/Thread.pdf-115-1.png">115-1

<img src="/img/Thread.pdf-115-2.png">115-2

<img src="/img/Thread.pdf-115-4.png">115-4
<img src="/img/Thread.pdf-116-0.png">116-0

以上就是从源码的角度分析InheritableThreadLocal的原理。


**4.InheritableThreadLocal和线程池搭配使用的问题**
首先给出结论：



<img src="/img/Thread.pdf-116-1.png">116-1



下面是DEMO:



<img src="/img/Thread.pdf-116-2.png">116-2


运行结果：


从上图可以看出，我们在main线程中第二次set并没有被第二次submit的线程get到。也印证了
我们的结论。


**TransmittableThreadLocal**


TransmittableThreadLocal是阿里开源的工具，弥补了InheritableThreadLocal的缺陷，在使
用线程池等会池化复用线程的执行组件情况下，提供ThreadLocal值的传递功能，解决异步执行
时上下文传递的问题。


使用起来也是非常简单，添加依赖如下：

```
<dependency>
<groupId>com.alibaba</groupId>
<artifactId>transmittable-thread-local</artifactId>
<version>2.14.2</version>
</dependency>

```

这时候，把上面的例子，改成TransmittableThreadLocal



<img src="/img/Thread.pdf-117-1.png">117-1

<img src="/img/Thread.pdf-117-2.png">117-2
<img src="/img/Thread.pdf-118-0.png">118-0





**结论**


1. `TransmittableThreadLocal` 可以让线程池中的上下文保持和父线程一致；


2. `TransmittableThreadLocal` 解决了线程复用导致多任务共享同一个线程上下文的问题；


**Java 多线程同步中while(true)位置的理解**


**笔记本：** 多线程编程


**创建时间：** 2021/11/17 14:28 **更新时间：** 2021/11/17 14:30


**作者：** 彼岸樱速

# **Java 多线程同步中while(true)位置的理解**

**在学习多线程同步问题的时候，经常使用多窗口同时买票的例子进行理解学习**


**当while（true）不在同步函数内部时：3个窗口交替卖票**


**while（true）不在同步代码块中：当窗口一获取到CPU执行权后，进入while（true）语句，**
**执行同步方法，然后执行sleep方法，进程堵塞，假设此时窗口3进程获取到CPU执行权，进入**
**while（true）语句，执行ticket.sale()同步方法，但是由于未获取到同步锁（窗口一线程执行**
**的是sleep方法，不会释放锁对象）只能进入堵塞状态，当窗口1自动苏醒后继续执行sleep方法**
**后的代码（卖票操作），执行完卖票操作后同步方法就结束了，释放了同步锁，此时多个线程之**
**间竞争这个锁资源，此时如果窗口三获取到锁资源后就能执行卖票操作，执行完卖票操作后同样**
**会释放锁资源。**


**当while（true）在同步函数中时：就只是一个窗口卖票**


**当while（true）在同步函数内部时，while（true）这个循环语句也成为了共享资源。虽然窗**
**口一线程执行了sleep方法释放了CPU的执行权，但是由于未释放锁，导致窗口二三的线程虽然**
**获取到CPU的执行权，但是无法获取到共享锁，进而无法操作共享资源（就是这儿的票，while**



<img src="/img/Thread.pdf-119-0.png">119-0

<img src="/img/Thread.pdf-119-1.png">119-1

<img src="/img/Thread.pdf-119-2.png">119-2

<img src="/img/Thread.pdf-119-3.png">119-3
**（true））。又因为同步方法中卖票是在while（true中）执行的，导致该线程一直执行卖票直**
**到票数为0为止。**
**只有一个窗口卖票的核心原因：while（true）循环会不断去执行卖票动作。当sleep函数结束**
**当前线程自动苏醒（其他线程由于未获取到共享锁而进入堵塞状态，窗口一获取到CPU执行**
**权），执行sleep函数后的代码，即卖票操作，执行完后并未退出同步函数，而是执行while**
**（true）这个循环语句。导致其他线程根本无法获取到锁。**


**线程和事务的关系**


**笔记本：** 多线程编程


**创建时间：** 2021/11/16 18:10 **更新时间：** 2021/11/16 18:11


**作者：** 彼岸樱速

# **线程和事务的关系** 1、会话可以创建多个事务 比如：使用客端连接数据库，这样你就可以执行很多 个事务了 2、一个事务只能由一个会话产生 在数据库里的事务，如果在执行的SQL都是由会话发 起的，哪怕是自动执行的JOB也是由系统会话发起的 3、一个事务可能会产生一个或多个线程 比如RMAN备份，是可以创建多个线程可加快备份速 度 4、一个线程在同一时间内只能执行一个事务 而一个线程，在没结束当前事务是无法释放资源来执 行第二个事务 事务、会话与线程的关系和区别 我一直没弄明白数据库中的这三个概念之间的关系。 事务：简单理解局势一个业务需求的最小处理单位。 如：从A银行卡转账500元到B银行卡，事务就包括两 部分，1、从A卡减掉500元 2、从B卡加上500元


# 这两个部分只要一个部分出错，就要整体“回滚”， 那这就是一个事务 会话：可以包含N个事务 如：你登陆网银之后，可以重复转账步骤2次，第二 次转账失败，并不影响你第一次转账成功。 线程：一个事情，一个人干和多个人干的问题 如：比如植树，任务是植树500棵，一个人(线程)干5 天，那五个人(线程)干1天。 至于会话和线程的关系，个人理解，植树任务就是一 个session 一个会话中可以由多个事务。 线程是操作系统概念。


**start、run的区别**


**笔记本：** 多线程编程


**创建时间：** 2021/8/25 17:54 **更新时间：** 2021/11/3 0:03


**作者：** 彼岸樱速


**URL：** about:blank


**Java Thread之start和run方法的区别**


**start**


**用start方法来启动线程，真正实现了多线程运行，这时无需等待run方法体代码执行完毕而直接继续执行下面的代码。通过调**
**用Thread类的start()方法来启动一个线程，这时此线程处于就绪（可运行）状态，并没有运行，一旦得到cpu时间片，就开始**
**执行run()方法，这里方法run()称为线程体，它包含了要执行的这个线程的内容，run方法运行结束，此线程随即终止。**


**start方法源码示例**


**一个** **Java 线程的创建本质上就对应了一个本地线程（native thread）的创建，两者是一一对应的。**


**关键问题是：本地线程执行的应该是本地代码，而** **Java 线程提供的线程函数（run）是 Java 方法，编译出的是 Java 字节**

**码。**


**所以，** **Java 线程其实提供了一个统一的线程函数，该线程函数通过 Java 虚拟机调用 Java 线程方法, 这是通过 Java 本地方**
**法 start0 调用来实现的。**


**也就是新创建的线程启动调用native start0方法，而这些native方法的注册是在Thread对象初始化的时候完成的**



<img src="/img/Thread.pdf-123-0.png">123-0

<img src="/img/Thread.pdf-123-1.png">123-1
**Thread 类有个 registerNatives 本地方法，该方法主要的作用就是注册一些本地方法供 Thread 类使用，如 start0()，**
**stop0() 等等，可以说，所有操作本地线程的本地方法都是由它注册的。**


**这个方法放在一个** **static 语句块中，当该类被加载到 JVM 中的时候，它就会被调用，进而注册相应的本地方法。(查看本地方**
**[法的源码需要前往 http://jdk.java.net/java-se-ri/8 下载openjdk的源代码)](http://jdk.java.net/java-se-ri/8)**


**而本地方法** **registerNatives 是定义在 Thread.c 文件中的。Thread.c 是个很小的文件，它定义了各个操作系统平台都要用到**
**的关于线程的公用数据和操作，如下：**


**可以看出** **Java 线程调用 start->start0 的方法，实际上会调用到 JVM_StartThread 方法，而 JVM_StartThread 最终调用**
**的是 Java 线程的 run 方法。**


**在** **jvm.cpp 中，有如下代码段：**



<img src="/img/Thread.pdf-124-0.png">124-0

<img src="/img/Thread.pdf-124-1.png">124-1
**这里** **JVM_ENTRY 是一个宏，用来定义 JVM_StartThread 函数，可以看到函数内创建了真正的平台相关的本地线程，其线程**
**函数是 thread_entry，如下：**


**可以看到调用了** **vmSymbols::run_method_name 方法，而 run_method_name 是在 vmSymbols.hpp 用宏定义的：**


run


**run()方法只是类的一个普通方法而已，如果直接调用Run方法，程序中依然只有主线程这一个线程，其程序执行路径还是只有**
**一条，还是要顺序执行，还是要等待run方法体执行完毕后才可继续执行下面的代码，这样就没有达到写线程的目的。**


**run方法源码示例**


**分别测试start和run**


**public class** **Test** **{**


**public static void** **main(String[] args) {**


**Thread** **thread** **=** **new** **Thread(new** **Runnable() {**
**@Override**


**public void** **run() {**


**System.out.println(Thread.currentThread().getName()** **+** **" invoked...");**



<img src="/img/Thread.pdf-125-0.png">125-0

<img src="/img/Thread.pdf-125-1.png">125-1

<img src="/img/Thread.pdf-125-2.png">125-2
**}**
**});**
**thread.start();**
**//thread.run();**
**}**
**}**


**先运行thread.start()**

```
Thread-0 invoked...

```

**注释调thread.start()方法，运行thread.run()**

```
main invoked...

```

**start方法可启动多线程**


**run方法只是thread的一个普通方法调用，还是在主线程里执行，是不会开启多线程的**


**CountDownLatch的理解和使用**


**笔记本：** 多线程编程


**创建时间：** 2021/10/15 14:12 **更新时间：** 2021/10/15 15:19


**作者：** 彼岸樱速


**CountDownLatch概念**



<img src="/img/Thread.pdf-127-0.png">127-0



**CountDownLatch的用法**



<img src="/img/Thread.pdf-127-1.png">127-1



**CountDownLatch的不足**





**CountDownLatch（倒计时计算器）使用说明**


方法说明


递减锁存器的计数，如果计数到达零，则释放所有等待的线程。如果当前计数大于零，则将计数减少。


使当前线程在锁存器倒计数至零之前一直等待，除非线程被中断或超出了指定的等待时间。如果当前计数
为零，则此方法立刻返回true值。


如果当前计数大于零，则出于线程调度目的，将禁用当前线程，且在发生以下三种情况之一前，该线程将
一直出于休眠状态：


由于调用countDown()方法，计数到达零；或者其他某个线程中断当前线程；或者已超出指定的等待时
间。


如果计数到达零，则该方法返回true值。


如果当前线程，在进入此方法时已经设置了该线程的中断状态；或者在等待时被中断，则抛出
InterruptedException，并且清除当前线程的已中断状态。


如果超出了指定的等待时间，则返回值为false。如果该时间小于等于零，则该方法根本不会等待。


参数：


timeout-要等待的最长时间


unit-timeout 参数的时间单位


返回：


如果计数到达零，则返回true；如果在计数到达零之前超过了等待时间，则返回false


抛出：


InterruptedException-如果当前线程在等待时被中断


例子1：


主线程等待子线程执行完成在执行



<img src="/img/Thread.pdf-128-0.png">128-0













例子2：


百米赛跑，4名运动员选手到达场地等待裁判口令，裁判一声口令，选手听到后同时起跑，当所有选手到
达终点，裁判进行汇总排名

```
public class CountdownLatchTest2 {

public static void main(String[] args) {

ExecutorService service = Executors. newCachedThreadPool ();

final CountDownLatch cdOrder = new CountDownLatch(1);

final CountDownLatch cdAnswer = new CountDownLatch(4);

for (int i = 0; i < 4; i++) {

Runnable runnable = () -> {

try {

```

**`System.`** _**`out`**_ **`.println("`** **选手** **`"`** **`+`** **`Thread.`** _**`currentThread`**_ **`().getName()`** **`+`** **`"`** **正在等待裁判发布口**
**令** **`");`**
```
cdOrder.await();

```

**`System.`** _**`out`**_ **`.println("`** **选手** **`"`** **`+`** **`Thread.`** _**`currentThread`**_ **`().getName()`** **`+`** **`"`** **已接受裁判口令** **`");`**

```
Thread. sleep ((long) (Math. random () * 10000));

```

**`System.`** _**`out`**_ **`.println("`** **选手** **`"`** **`+`** **`Thread.`** _**`currentThread`**_ **`().getName()`** **`+`** **`"`** **到达终点** **`");`**
```
cdAnswer.countDown();

} catch (InterruptedException e) {
e.printStackTrace();
}
};
service.execute(runnable);
}

try {

Thread. sleep ((long) (Math. random () * 10000));
```

**`System.`** _**`out`**_ **`.println("`** **裁判** **`"+Thread.`** _**`currentThread`**_ **`().getName()+"`** **即将发布口令** **`");`**
```
cdOrder.countDown();
```

**`System.`** _**`out`**_ **`.println("`** **裁判** **`"+Thread.`** _**`currentThread`**_ **`().getName()+"`** **已发送口令，正在等待所有选手到达**
**终点** **`");`**
```
cdAnswer.await();
```

**`System.`** _**`out`**_ **`.println("`** **所有选手都到达终点** **`");`**


<img src="/img/Thread.pdf-129-0.png">129-0




**多线程使用executor.submit(callable).get()不并发执行问题**


**笔记本：** 多线程编程


**创建时间：** 2021/9/30 22:09 **更新时间：** 2021/9/30 22:22


**作者：** 彼岸樱速


业务场景


for循环处理数据，串行执行效率很慢，所以想用多线程并行处理，提高效率


原来的代码如下



<img src="/img/Thread.pdf-130-0.png">130-0







执行结果如下

```
 任务 -0--> 执行开始 .
 任务 -0--> 执行结束 .

 next task...
 任务 -1--> 执行开始 .
 任务 -1--> 执行结束 .

 next task...
 任务 -2--> 执行开始 .
 任务 -2--> 执行结束 .

 next task...
 任务 -3--> 执行开始 .
 任务 -3--> 执行结束 .

 next task...
 任务 -4--> 执行开始 .
 任务 -4--> 执行结束 .

 next task...
 任务 -5--> 执行开始 .
 任务 -5--> 执行结束 .

 next task...
 任务 -6--> 执行开始 .
 任务 -6--> 执行结束 .

 next task...
 任务 -7--> 执行开始 .
 任务 -7--> 执行结束 .

 next task...
 任务 -8--> 执行开始 .
 任务 -8--> 执行结束 .

 next task...
 任务 -9--> 执行开始 .
 任务 -9--> 执行结束 .

 next task...
 任务 -10--> 执行开始 .

```

```
 任务 -10--> 执行结束 .

 next task...
 任务 -11--> 执行开始 .
 任务 -11--> 执行结束 .

 next task...
 任务 -12--> 执行开始 .
 任务 -12--> 执行结束 .

 next task...
 任务 -13--> 执行开始 .
 任务 -13--> 执行结束 .

 next task...
 任务 -14--> 执行开始 .
 任务 -14--> 执行结束 .

 next task...
 任务 -15--> 执行开始 .
 任务 -15--> 执行结束 .

 next task...
 任务 -16--> 执行开始 .
 任务 -16--> 执行结束 .

 next task...
 任务 -17--> 执行开始 .
 任务 -17--> 执行结束 .

 next task...
 任务 -18--> 执行开始 .
 任务 -18--> 执行结束 .

 next task...
 任务 -19--> 执行开始 .
 任务 -19--> 执行结束 .

 next task...
 总耗时： 6

```

可以看到这20个任务，并没有并行处理，都是第一个处理结束，再到第二个。


原来 **ExecutorService.submit(Callable)** 返回一个Future对象，而 **Future.get()** 方法(此方法会
造成阻塞)是等到Future对应的线程执行完后获取结果数据。


在for循环中调用get()，手动把并行改成了同步执行


修改后的代码

```
public static void main(String[] args) {
try {
long total = 0;
long start = System. currentTimeMillis ();
ExecutorService executor = Executors. newFixedThreadPool (8);
List < Future <Long>> futures = new CopyOnWriteArrayList<>();
CountDownLatch latch = new CountDownLatch(20);
for (int i = 0; i < 20; i++) {
```

**`Task`** **`task = new`** **`Task(100000, "`** **任务** **`-" + i);`**
```
futures.add(executor.submit(task));
latch.countDown();
System. out .println("next task...");
}
executor.shutdown();
latch.await();
for ( Future <Long> future : futures) {
total += future.get();
}
```

**`System.`** _**`out`**_ **`.println("`** **总耗时：** **`" + (System.`** _**`currentTimeMillis`**_ **`() - start));`**
```
} catch (Exception e) {
e.printStackTrace();
}
}

```

执行结果

```
 next task...
 任务 -0--> 执行开始 .

 next task...
 任务 -1--> 执行开始 .

 next task...
 任务 -2--> 执行开始 .
 任务 -0--> 执行结束 .
 任务 -1--> 执行结束 .

 next task...
 任务 -3--> 执行开始 .

 next task...
 任务 -4--> 执行开始 .

 next task...
 任务 -5--> 执行开始 .
 任务 -2--> 执行结束 .

 next task...
 任务 -6--> 执行开始 .

 next task...

```

```
 next task...

 next task...

 next task...

 next task...

 next task...

 next task...

 next task...

 next task...

 next task...

 next task...

 next task...

 next task...
 任务 -7--> 执行开始 .
 任务 -3--> 执行结束 .
 任务 -9--> 执行开始 .
 任务 -7--> 执行结束 .
 任务 -10--> 执行开始 .
 任务 -9--> 执行结束 .
 任务 -11--> 执行开始 .
 任务 -10--> 执行结束 .
 任务 -12--> 执行开始 .
 任务 -11--> 执行结束 .
 任务 -13--> 执行开始 .
 任务 -14--> 执行开始 .
 任务 -13--> 执行结束 .
 任务 -15--> 执行开始 .
 任务 -14--> 执行结束 .
 任务 -16--> 执行开始 .
 任务 -8--> 执行开始 .
 任务 -16--> 执行结束 .
 任务 -8--> 执行结束 .
 任务 -17--> 执行开始 .
 任务 -15--> 执行结束 .
 任务 -12--> 执行结束 .
 任务 -4--> 执行结束 .
 任务 -6--> 执行结束 .
 任务 -5--> 执行结束 .
 任务 -17--> 执行结束 .
 任务 -19--> 执行开始 .
 任务 -18--> 执行开始 .
 任务 -19--> 执行结束 .
 任务 -18--> 执行结束 .
 总耗时： 16

```

可以看到任务是并发执行的


**sleep和wait的区别**


**笔记本：** 多线程编程


**创建时间：** 2021/9/20 21:42 **更新时间：** 2021/9/20 23:38


**作者：** 彼岸樱速


**sleep()**





下面用一个例子来演示：


Service类：



<img src="/img/Thread.pdf-133-1.png">133-1



就定义了两个方法， mSleep()方法会让调用线程休眠3秒，mWait() 就打印一句话。两个方法都


使用了同步锁。


SleepThread类：



<img src="/img/Thread.pdf-133-2.png">133-2







线程类，用于调用Service 的mSleep方法


WaitThread类：



<img src="/img/Thread.pdf-133-3.png">133-3








线程类，用于调用Service 的mWait方法


测试类：



<img src="/img/Thread.pdf-134-0.png">134-0









梳理一下逻辑：



<img src="/img/Thread.pdf-134-1.png">134-1



**wait()**


wait()是Object类的方法，当一个线程执行到wait方法时，它就进入到一个和该对象相关的等待


池，同时释放对象的机锁，使得其他线程能够访问，可以通过notify，notifyAll方法来唤醒等待的


线程


下面修改程序如下所示：



<img src="/img/Thread.pdf-134-2.png">134-2



测试类：


public class `Test{`


<img src="/img/Thread.pdf-135-0.png">135-0









综上所诉：
sleep() 和 wait() 的区别就是
调用 **sleep()** 方法的线程 **不会释放对象锁**
而调用 **wait()** 方法 **会释放对象锁**


**线程状态转换**


**笔记本：** 多线程编程


**创建时间：** 2021/9/19 18:36 **更新时间：** 2021/9/19 18:38


**作者：** 彼岸樱速



<img src="/img/Thread.pdf-136-0.png">136-0

<img src="/img/Thread.pdf-136-1.png">136-1








**Java多线程线程池**


**笔记本：** 多线程编程


**创建时间：** 2021/9/17 16:48 **更新时间：** 2021/9/17 18:42


**作者：** 彼岸樱速


**1 线程池的优势**


总体来说，线程池有如下的优势：





**2 线程池的使用**


线程池的真正实现类是 **ThreadPoolExecutor** ，其构造方法有如下4种：



<img src="/img/Thread.pdf-137-1.png">137-1








































































可以看到，其需要如下几个参数：



<img src="/img/Thread.pdf-138-1.png">138-1



线程池的使用流程如下：



<img src="/img/Thread.pdf-138-2.png">138-2





















**3 线程池的工作原理**


下面来描述一下线程池工作的原理，同时对上面的参数有一个更深的了解。其工作原理流程图如


下：


<img src="/img/Thread.pdf-139-0.png">139-0

**4 线程池的参数**


**4.1 任务队列（workQueue）**


任务队列是基于阻塞队列实现的，即采用生产者消费者模式，在 Java 中需要实现

<img src="/img/Thread.pdf-139-1.png">139-1
BlockingQueue 接口。但 Java 已经为我们提供了 7 种阻塞队列的实现：





注意有界队列和无界队列的区别：如果使用有界队列，当队列饱和时并超过最大线程数时就会执
行拒绝策略；而如果使用无界队列，因为任务队列永远都可以添加任务，所以设置
maximumPoolSize 没有任何意义。


**4.2 线程工厂（threadFactory）**


线程工厂指定创建线程的方式，需要实现 **ThreadFactory** 接口，并实现 **newThread(Runnable**


**r)** 方法。该参数可以不用指定，Executors 框架已经为我们实现了一个默认的线程工厂：

```
static class DefaultThreadFactory implements ThreadFactory {

private static final AtomicInteger poolNumber = new AtomicInteger(1);

private final ThreadGroup group;

private final AtomicInteger threadNumber = new AtomicInteger(1);

private final String namePrefix;

DefaultThreadFactory() {

```

<img src="/img/Thread.pdf-140-0.png">140-0













**4.3 拒绝策略（handler）**



<img src="/img/Thread.pdf-140-1.png">140-1



**5 功能线程池**


嫌上面使用线程池的方法太麻烦？其实Executors已经为我们封装好了 4 种常见的功能线程池，


如下：



<img src="/img/Thread.pdf-140-2.png">140-2



**5.1 定长线程池（FixedThreadPool）**


创建方法的源码：



<img src="/img/Thread.pdf-140-3.png">140-3



















使用示例


_**`// 1.`**_ **创建定长线程池对象** _**`&`**_ **设置线程池线程数量固定为** _**`3`**_

```
ExecutorService fixedThreadPool = Executors. newFixedThreadPool (3);

```

_**`// 2.`**_ **创建好** _**`Runnable`**_ **类线程对象** _**`&`**_ **需执行的任务**


_**`Runnable`**_ **`task`** **`=`** **`()`** **`->`** **`System.`** _**`out`**_ **`.println("`** **执行任务啦** **`");`**


**5.2 定时线程池（ScheduledThreadPool ）**


创建方法的源码：



<img src="/img/Thread.pdf-141-1.png">141-1

























<img src="/img/Thread.pdf-141-2.png">141-2

















**5.3 可缓存线程池（CachedThreadPool）**


创建方法的源码：



<img src="/img/Thread.pdf-141-3.png">141-3

















<img src="/img/Thread.pdf-141-4.png">141-4











**5.4 单线程化线程池（SingleThreadExecutor）**


创建方法的源码：


<img src="/img/Thread.pdf-142-0.png">142-0





















<img src="/img/Thread.pdf-142-1.png">142-1











**5.5 对比**


**6 总结**



<img src="/img/Thread.pdf-142-2.png">142-2

<img src="/img/Thread.pdf-142-3.png">142-3


**Java创建多线程的方式**


**笔记本：** 多线程编程


**创建时间：** 2021/9/17 15:18 **更新时间：** 2021/9/17 15:38


**作者：** 彼岸樱速


1、继承 **Thread** 类：但Thread本质上也是实现了Runnable 接口的一个实例，它代表一个线程的实例，并
且，启动线程的唯一方法就是通过 Thread 类的 start()实例方法。start()方法是一个 native 方法，它将启动
一个新线程，并执行run()方法。这种方式实现多线程很简单，通过自己的类直接extend Thread，并复写
run()方法，就可以启动新线程并执行自己定义的run()方法。例如：继承Thread类实现多线程，并在合适的地
方启动线程。


2、实现 **Runnable** 接口的方式实现多线程，并且实例化Thread，传入自己的Thread实例，调用run( )方法 。
```
public class RunnableTest implements Runnable {
@Override
public void run() {
System. out .println("RunnableTest.run()");
}

public static void main(String[] args) {
RunnableTest myThread = new RunnableTest();
Thread thread = new Thread(myThread);
thread.start();
}
}

```

3、 使用 **ExecutorService、Callable、Future** 实现有返回结果的多线程：ExecutorService、Callable、
Future这 个 对 象 实际 上 都是属 于 Executor 框 架中 的 功 能 类。 这里面对该框架做了很详细的解释。返
回结果的线程是在JDK1.5中引入的新特征，确实很实用，有了这种特征我就不需要再为了得到返回值而大费
周折了，而且即便实现了也可能漏洞百出。 **可返回值** 的任务必须实现 **Callable** 接口，类似的， **无返回值** 的任务
必须 **Runnable** 接口。执行Callable任务后，可以获取一个 Future 的对象，在该对象上调用 get 就可以获取
到 Callable 任务返回的 Object 了，再结合线程池接口ExecutorService就可以实现传说中有返回结果的多线
程了。下面提供了一个完整的有返回结果的多线程测试例子，在JDK1.5下验证过没问题可以直接使用。代码
如下
```
class MyCallable implements Callable <Object> {

private String taskNum;

MyCallable(String taskNum) {
this.taskNum = taskNum;
}

@Override
public Object call() throws Exception {
```

**`System.`** _**`out`**_ **`.println(">>>" + taskNum + "`** **任务启动** **`");`**
```
Date dateTmp1 = new Date();
Thread. sleep (1000);
Date dateTmp2 = new Date();
long time = dateTmp2.getTime() - dateTmp1.getTime();
```

**`System.`** _**`out`**_ **`.println(">>>" + taskNum + "`** **任务终止** **`");`**
**`return`** **`taskNum + "`** **任务返回运行结果** **`,`** **当前任务时间【** **`" + time + "`** **毫秒】** **`";`**
```
}
}

@SuppressWarnings("unchecked")
public class CallableTest {
public static void main(String[] args) throws ExecutionException,
InterruptedException {
```

**`System.`** _**`out`**_ **`.println("----`** **程序开始运行** **`----");`**
```
Date date1 = new Date();

int taskSize = 5;
```

_**`//`**_ **创建一个线程池**
```
ExecutorService pool = Executors. newFixedThreadPool (taskSize);
```

_**`//`**_ **创建多个有返回值的任务**
```
List < Future > list = new ArrayList<>();
for (int i = 0; i < taskSize; i++) {
Callable c = new MyCallable(i + " ");
```

_**`//`**_ **执行任务并获取** _**`Future`**_ **对象**
```
Future f = pool.submit(c);

```


<img src="/img/Thread.pdf-143-0.png">143-0
```
// System.out.println(">>>" + f.get().toString());
list.add(f);
}
```

_**`//`**_ **关闭线程池**
```
pool.shutdown();

```

_**`//`**_ **获取所有并发任务的运行结果**
```
for ( Future f : list) {
```

_**`//`**_ **从** _**`Future`**_ **对象上获取任务的返回值，并输出到控制台**
```
System. out .println(">>>" + f.get().toString());
}

Date date2 = new Date();
```

**`System.`** _**`out`**_ **`.println("----`** **程序结束运行** **`----`** **，程序运行时间【** **`"`**
**`+ (date2.getTime() - date1.getTime()) + "`** **毫秒】** **`");`**
```
}
}

```

**ThreadLocal是怎么把变量复制到Thread的ThreadLocalMap中的？**


**笔记本：** 多线程编程


**创建时间：** 2021/9/9 11:15 **更新时间：** 2021/9/9 11:32


**作者：** 彼岸樱速



<img src="/img/Thread.pdf-145-0.png">145-0



其实就是Thread有个成员变量：ThreadLocalMap，而ThreadLocalMap是ThreadLocal的静
态内部类


**再来看ThreadLocal的set方法**
```
public void set(T value) {
Thread t = Thread. currentThread ();
ThreadLocalMap map = getMap(t);
if (map != null )

```


<img src="/img/Thread.pdf-145-1.png">145-1

<img src="/img/Thread.pdf-145-2.png">145-2
```
map.set( this, value);
else
createMap(t, value);
}
```

可以看出，set方法



<img src="/img/Thread.pdf-146-0.png">146-0


**ThreadLocal全面解析**


**笔记本：** 多线程编程


**创建时间：** 2021/9/2 15:10 **更新时间：** 2021/9/3 0:20


**作者：** 彼岸樱速


**ThreadLocal全面解析**
**学习目标**



<img src="/img/Thread.pdf-147-0.png">147-0



**1. ThreadLocal介绍**
**1.1 官方介绍**



<img src="/img/Thread.pdf-147-1.png">147-1



**1.2 基本使用**
**1.2.1 常用方法**
在使用之前,我们先来认识几个ThreadLocal的常用方法

|方法声明|描述|
|---|---|
|ThreadLocal()|创建ThreadLocal对象|
|public void set( T value)|设置当前线程绑定的局部变量|
|public T get()|获取当前线程绑定的局部变量|
|public void remove()|移除当前线程绑定的局部变量|



**1.2.2 使用案例**
我们来看下面这个案例, 感受一下ThreadLocal 线程隔离的特点：

```
public class MyDemo {

private String content;

private String getContent() {

return content;
}

private void setContent(String content) {

this .content = content;
}

public static void main(String[] args) {

MyDemo demo = new MyDemo();

for ( int i = 0; i < 5; i++) {

Thread thread = new Thread(() -> {

```

**`demo.setContent(Thread.`** _**`currentThread`**_ **`().getName()`** **`+`** **`"`** **的数据** **`");`**
```
System.out.println("-----------------------");

System.out.println(Thread. currentThread ().getName() + "--->" + demo.getContent());
});

```

**`thread.setName("`** **线程** **`"`** **`+`** **`i);`**
```
thread.start();
}
}
}
```

打印结果:


偶然得到正确的结果
```
//----------------------```

_`//`_ 线程 _`0--->`_ 线程 _`0`_ 的数据
```
//----------------------```

_`//`_ 线程 _`1--->`_ 线程 _`1`_ 的数据
```
//----------------------```

_`//`_ 线程 _`2--->`_ 线程 _`2`_ 的数据
```
//----------------------```

_`//`_ 线程 _`3--->`_ 线程 _`3`_ 的数据
```
//----------------------```

_`//`_ 线程 _`4--->`_ 线程 _`4`_ 的数据
再来一次
```
//----------------------```

_`//`_ 线程 _`1--->`_ 线程 _`0`_ 的数据
```
//----------------------```

_`//`_ 线程 _`0--->`_ 线程 _`0`_ 的数据
```
//----------------------```

_`//`_ 线程 _`3--->`_ 线程 _`2`_ 的数据
```
//----------------------```

_`//`_ 线程 _`2--->`_ 线程 _`2`_ 的数据
```
//----------------------```

_`//`_ 线程 _`4--->`_ 线程 _`4`_ 的数据


从结果可以看出多个线程在访问同一个变量的时候出现的异常，线程间的数据没有隔离。下面我
们来看下采用 ThreadLocal 的方式来解决这个问题的例子。

```
public class MyDemo1 {

private static ThreadLocal<String> tl = new ThreadLocal<>();

private String content;

private String getContent() {

return tl .get();
}

private void setContent(String content) {
tl .set(content);
}

public static void main(String[] args) {

MyDemo1 demo = new MyDemo1();

for ( int i = 0; i < 5; i++) {

Thread thread = new Thread(() -> {

```

**`demo.setContent(Thread.`** _**`currentThread`**_ **`().getName()`** **`+`** **`"`** **的数据** **`");`**
```
System.out.println("-----------------------");

System.out.println(Thread. currentThread ().getName() + "--->" + demo.getContent());
});

```

**`thread.setName("`** **线程** **`"`** **`+`** **`i);`**
```
thread.start();
}
}
}

```

打印结果(无论来几次都一样):

从结果来看，这样很好的解决了多线程之间数据隔离的问题，十分方便。


**1.3 ThreadLocal类与synchronized关键字**
**1.3.1 synchronized同步方式**
这里可能有的朋友会觉得在上述例子中我们完全可以通过加锁来实现这个功能。我们首先来看一
下用synchronized代码块实现的效果:

```
public class MyDemo2 {

```


<img src="/img/Thread.pdf-148-0.png">148-0
```
private String content;

public String getContent() {

return content;
}

public void setContent(String content) {

this .content = content;
}

public static void main(String[] args) {

MyDemo2 demo02 = new MyDemo2();

for ( int i = 0; i < 5; i++) {

Thread t = new Thread(() -> {

synchronized (MyDemo2. class ){

```

**`demo02.setContent(Thread.`** _**`currentThread`**_ **`().getName()`** **`+`** **`"`** **的数据** **`");`**
```
System.out.println("-------------------------------------");

String content = demo02.getContent();

System.out.println(Thread. currentThread ().getName() + "--->" + content);
}
});

```

**`t.setName("`** **线程** **`"`** **`+`** **`i);`**
```
t.start();
}
}
}

```

打印结果:

从结果可以发现, 加锁确实可以解决这个问题，但是在这里我们强调的是线程数据隔离的问题，
并不是多线程共享数据的问题, 在这个案例中使用synchronized关键字是不合适的。


**1.3.2 ThreadLocal与synchronized的区别**
虽然ThreadLocal模式与synchronized关键字都用于处理多线程并发访问变量的问题, 不过两者
处理问题的角度和思路不同。



<img src="/img/Thread.pdf-149-0.png">149-0







|Col1|synchronized|ThreadLocal|
|---|---|---|
|原理|同步机制采用’**以时间换空间**’的方<br>式, 只提供了一份变量,让不同的线程排<br>队访问|ThreadLocal采用’**以空间换时间**’的方<br>式, 为每一个线程都提供了一份变量的副<br>本,从而实现同时访问而相不干扰|
|侧重点|多个线程之间访问资源的同步|多线程中让每个线程之间的数据相互隔离|


总结：
在刚刚的案例中，虽然使用ThreadLocal和synchronized都能解决问题,但是使用 **ThreadLocal**
**更为合适**,因为这样 **可以使程序拥有更高的并发性** 。


**2. 运用场景_事务案例**
通过以上的介绍，我们已经基本了解ThreadLocal的特点。但是它具体是运用在什么场景中呢？
接下来让我们看一个案例： 事务操作。


**2.1 转账案例**
**2.1.1 场景构建**
这里我们先构建一个简单的转账场景： 有一个数据表account，里面有两个用户Jack和Rose，
用户Jack 给用户Rose 转账。


案例的实现主要用mysql数据库，JDBC 和 C3P0 框架。以下是详细代码 ：


（1） 项目结构


（2） 数据准备


（3） dao层代码 ： AccountDao

```
public class AccountDao {

public void out(String outUser, int money) throws SQLException {

String sql = "update account set money = money - ? where name = ?";

Connection conn = JdbcUtils. getConnection ();

PreparedStatement pstm = conn.prepareStatement(sql);

pstm.setInt(1, money);

pstm.setString(2, outUser);
pstm.executeUpdate();

JdbcUtils. release (pstm, conn);
}

public void in(String inUser, int money) throws SQLException {

String sql = "update account set money = money + ? where name = ?";

Connection conn = JdbcUtils. getConnection ();

PreparedStatement pstm = conn.prepareStatement(sql);
pstm.setInt(1,money);
pstm.setString(2,inUser);
pstm.executeUpdate();

JdbcUtils. release (pstm,conn);
}
}

```

（4） service层代码 ： AccountService

```
public class AccountService {

```

**`//`** **转账**

```
public boolean transfer(String outUser, String inUser, int money) {

AccountDao ad = new AccountDao();

```


<img src="/img/Thread.pdf-150-0.png">150-0

<img src="/img/Thread.pdf-150-1.png">150-1
```
try {

```

_**`//`**_ **转出**

```
ad.out(outUser, money);

```

_**`//`**_ **转入**

```
ad.in(inUser, money);

} catch (Exception e) {
e.printStackTrace();

return false ;
}

return true ;
}
}

```

（5） 工具类 ： JdbcUtils



<img src="/img/Thread.pdf-151-0.png">151-0

















2.1.2 引入事务
案例中的转账涉及两个DML操作： 一个转出，一个转入。这些操作是需要具备原子性的，不可
分割。不然就有可能出现数据修改异常情况。

```
public class AccountService {

public boolean transfer(String outUser, String inUser, int money) {

AccountDao ad = new AccountDao();

try {

```

_**`//`**_ **转出**

```
ad.out(outUser, money);

```

_**`//`**_ **模拟转账过程中的异常**

```
int i = 1/0;

```

_**`//`**_ **转入**

```
ad.in(inUser, money);

} catch (Exception e) {
e.printStackTrace();

return false ;
}

return true ;
}
}

```

所以这里就需要操作事务，来保证转出和转入操作具备原子性，要么同时成功，要么同时失败。


（1） JDBC中关于事务的操作的api

|Connection接口的方法|作用|
|---|---|
|void setAutoCommit(false)|禁用事务自动提交（改为手动|
|void commit();|提交事务|
|void rollback();|回滚事务|



（2） 开启事务的注意点:


为了保证所有的操作在一个事务中,案例中使用的连接必须是同一个: service层开启事务的
connection需要跟dao层访问数据库的connection保持一致


线程并发情况下, 每个线程只能操作各自的 connection


**2.2 常规解决方案**
**2.2.1 常规方案的实现**
基于上面给出的前提， 大家通常想到的解决方案是 ：


传参: 从service层将connection对象向dao层传递
加锁
以下是代码实现修改的部分：


（1 ) AccountService 类

```
public class AccountService {

public boolean transfer(String outUser, String inUser, int money) {

AccountDao ad = new AccountDao();
```

_**`//`**_ **线程并发情况下** _**`,`**_ **为了保证每个线程使用各自的** _**`connection,`**_ **故加锁**

```
synchronized (AccountService. class ) {

Connection conn = null ;

try {

conn = JdbcUtils. getConnection ();
```

_**`//`**_ **开启事务**
```
conn.setAutoCommit( false );

```

_**`//`**_ **转出**

```
ad.out(conn, outUser, money);

```

_**`//`**_ **模拟转账过程中的异常**
```
// int i = 1/0;

```

_**`//`**_ **转入**

```
ad.in(conn, inUser, money);
```

_**`//`**_ **事务提交**
```
JdbcUtils. commitAndClose (conn);

} catch (Exception e) {
e.printStackTrace();
```

_**`//`**_ **事务回滚**
```
JdbcUtils. rollbackAndClose (conn);

return false ;
}

return true ;
}
}
}

```

（2) AccountDao 类 （这里需要注意的是： connection不能在dao层释放，要在service层，
不然在dao层释放，service层就无法使用了）

```
public class AccountDao {
public void out( Connection conn, String outUser, int money) throws SQLException{
String sql = "update account set money = money - ? where name = ?";
```

_`//`_ 注释从连接池获取连接的代码 _`,`_ 使用从 _`service`_ 中传递过来的 _`connection`_


```
// Connection conn = JdbcUtils.getConnection();
PreparedStatement pstm = conn.prepareStatement(sql);
pstm.setInt(1,money);
pstm.setString(2,outUser);
pstm.executeUpdate();
```

_`//`_ 连接不能在这里释放 _`,service`_ 层中还需要使用
```
// JdbcUtils.release(pstm,conn);
JdbcUtils. release (pstm);
}

public void in( Connection conn, String inUser, int money) throws SQLException {
String sql = "update account set money = money + ? where name = ?";
// Connection conn = JdbcUtils.getConnection();
PreparedStatement pstm = conn.prepareStatement(sql);
pstm.setInt(1,money);
pstm.setString(2,inUser);
pstm.executeUpdate();
// JdbcUtils.release(pstm,conn);
JdbcUtils. release (pstm);
}
}

```

**2.2.2 常规方案的弊端**
上述方式我们看到的确按要求解决了问题，但是仔细观察，会发现这样实现的弊端：


直接从service层传递connection到dao层, 造成代码耦合度提高


**加锁会造成线程失去并发性，程序性能降低**


**2.3 ThreadLocal解决方案**
**2.3.1 ThreadLocal方案的实现**
像这种需要在项目中进行数据传递和线程隔离的场景，我们不妨用ThreadLocal来解决：


（1） 工具类的修改： 加入ThreadLocal

```
public class JdbcUtils {
```

_`//ThreadLocal`_ 对象 _`:`_ 将 _`connection`_ 绑定在当前线程中

```
private static final ThreadLocal< Connection > tl = new ThreadLocal();

```

_`// c3p0`_ 数据库连接池对象属性
```
private static final ComboPooledDataSource ds = new ComboPooledDataSource();

```

_`//`_ 获取连接

```
public static Connection getConnection() throws SQLException {
```

_`//`_ 取出当前线程绑定的 _`connection`_ 对象

```
Connection conn = tl.get();
if (conn == null ) {
```

_`//`_ 如果没有，则从连接池中取出

```
conn = ds.getConnection();
```

_`//`_ 再将 _`connection`_ 对象绑定到当前线程中
```
tl.set(conn);
}

return conn;
}

```

_`//`_ 释放资源
```
public static void release( AutoCloseable ... ios) {
for ( AutoCloseable io : ios) {
if (io != null ) {
try {
io.close();
} catch (Exception e) {
e.printStackTrace();
}
}
}
}

public static void commitAndClose() {
try {
Connection conn = getConnection ();
```

_`//`_ 提交事务
```
conn.commit();
```

_`//`_ 解除绑定
```
tl.remove();
```

_`//`_ 释放连接
```
conn.close();
} catch (SQLException e) {
e.printStackTrace();
}

```

```
}

public static void rollbackAndClose() {
try {
Connection conn = getConnection ();
```

_`//`_ 回滚事务
```
conn.rollback();
```

_`//`_ 解除绑定
```
tl.remove();
```

_`//`_ 释放连接
```
conn.close();
} catch (SQLException e) {
e.printStackTrace();
}
}
}

```

（2） AccountService类的修改：不需要传递connection对象

```
public class AccountService {

public boolean transfer(String outUser, String inUser, int money) {

AccountDao ad = new AccountDao();

try {

Connection conn = JdbcUtils. getConnection ();
```

_**`//`**_ **开启事务**
```
conn.setAutoCommit( false );

```

_**`//`**_ **转出：** **这里不需要传参了！**

```
ad.out(outUser, money);

```

_**`//`**_ **模拟转账过程中的异常**
```
// int i = 1 / 0;

```

_**`//`**_ **转入**

```
ad.in(inUser, money);
```

_**`//`**_ **事务提交**
```
JdbcUtils. commitAndClose ();

} catch (Exception e) {
e.printStackTrace();
```

_**`//`**_ **事务回滚**
```
JdbcUtils. rollbackAndClose ();

return false ;
}

return true ;
}
}

```

（3） AccountDao类的修改：照常使用


**2.3.2 ThreadLocal方案的好处**





**3. ThreadLocal的内部结构**





**3.1 常见的误解**




<img src="/img/Thread.pdf-155-0.png">155-0

**3.2 现在的设计**



<img src="/img/Thread.pdf-155-1.png">155-1



<img src="/img/Thread.pdf-155-2.png">155-2

**3.3 这样设计的好处**



<img src="/img/Thread.pdf-155-3.png">155-3





**4. ThreadLocal的核心方法源码**
基于ThreadLocal的内部结构，我们继续分析它的核心方法源码，更深入的了解其操作原理。


除了构造方法之外， ThreadLocal对外暴露的方法有以下4个：


|方法声明|描述|
|---|---|
|protected T initialValue()|返回当前线程局部变量的初始值|
|public void set( T value)|设置当前线程绑定的局部变量|
|public T get()|获取当前线程绑定的局部变量|
|public void remove()|移除当前线程绑定的局部变量|


以下是这4个方法的详细源码分析(为了保证思路清晰, ThreadLocalMap部分暂时不展开,下一个
知识点详解)


**4.1 set方法**
（1 ) 源码和对应的中文注释

（2 ) 代码执行流程



<img src="/img/Thread.pdf-156-0.png">156-0



**4.2 get方法**
（1 ) 源码和对应的中文注释



<img src="/img/Thread.pdf-156-2.png">156-2
```
/*
```

初始化 _`:`_ 有两种情况有执行当前代码
第一种情况 _`: map`_ 不存在，表示此线程没有维护的 _`ThreadLocalMap`_ 对象
第二种情况 _`: map`_ 存在 _`,`_ 但是没有与当前 _`ThreadLocal`_ 关联的 _`entry`_
```
*/

return setInitialValue();
}

/**
```

_`*`_ 初始化

```
*
```

_`*`_ _**`@return`**_ _`the initial value`_ 初始化后的值
```
*/

private T setInitialValue() {
```

_`//`_ 调用 _`initialValue`_ 获取初始化的值
_`//`_ 此方法可以被子类重写 _`,`_ 如果不重写默认返回 _`null`_
```
T value = initialValue();
```

_`//`_ 获取当前线程对象

```
Thread t = Thread. currentThread ();
```

_`//`_ 获取此线程对象中维护的 _`ThreadLocalMap`_ 对象
```
ThreadLocalMap map = getMap(t);
```

_`//`_ 判断 _`map`_ 是否存在
```
if (map != null )
```

_`//`_ 存在则调用 _`map.set`_ 设置此实体 _`entry`_
```
map.set( this, value);
else
```

_`// 1`_ ）当前线程 _`Thread`_ 不存在 _`ThreadLocalMap`_ 对象
_`// 2`_ ）则调用 _`createMap`_ 进行 _`ThreadLocalMap`_ 对象的初始化
_`// 3`_ ）并将 _`t(`_ 当前线程 _`)`_ 和 _`value(t`_ 对应的值 _`)`_ 作为第一个 _`entry`_ 存放至 _`ThreadLocalMap`_ 中
```
createMap(t, value);

```

_`//`_ 返回设置的值 _`value`_

```
return value;
}

```

（2 ) 代码执行流程



<img src="/img/Thread.pdf-157-0.png">157-0



**4.3 remove方法**
（1 ) 源码和对应的中文注释

```
/**
```

_`*`_ 删除当前线程中保存的 _`ThreadLocal`_ 对应的实体 _`entry`_
```
*/

public void remove() {
```

_`//`_ 获取当前线程对象中维护的 _`ThreadLocalMap`_ 对象
```
ThreadLocalMap m = getMap(Thread. currentThread ());
```

_`//`_ 如果此 _`map`_ 存在
```
if (m != null )
```

_`//`_ 存在则调用 _`map.remove`_
_`//`_ 以当前 _`ThreadLocal`_ 为 _`key`_ 删除对应的实体 _`entry`_
```
m.remove( this );
}
```

（2 ) 代码执行流程





**4.4 initialValue方法**
```
/**
```

_`*`_ 返回当前线程对应的 _`ThreadLocal`_ 的初始值
```
*
```

_`*`_ 此方法的第一次调用发生在，当线程通过 _`get`_ 方法访问此线程的 _`ThreadLocal`_ 值时
_`*`_ 除非线程先调用了 _`set`_ 方法，在这种情况下， _`initialValue`_ 才不会被这个线程调用。
_`*`_ 通常情况下，每个线程最多调用一次这个方法。
```
*
```

_`* <p>`_ 这个方法仅仅简单的返回 _`null`_ _`{`_ _**`@code`**_ _`null};`_
_`*`_ 如果程序员想 _`ThreadLocal`_ 线程局部变量有一个除 _`null`_ 以外的初始值，


_`*`_ 必须通过子类继承 _`{`_ _**`@code`**_ _`ThreadLocal}`_ 的方式去重写此方法
_`*`_ 通常 _`,`_ 可以通过匿名内部类的方式实现
```
*
```

_`*`_ _**`@return`**_ 当前 _`ThreadLocal`_ 的初始值
```
*/

protected T initialValue() {

return null ;
}

```

此方法的作用是 返回该线程局部变量的初始值。



<img src="/img/Thread.pdf-158-0.png">158-0



**5. ThreadLocalMap源码分析**
在分析ThreadLocal方法的时候，我们了解到ThreadLocal的操作实际上是围绕
ThreadLocalMap展开的。ThreadLocalMap的源码相对比较复杂, 我们从以下三个方面进行讨
论。


**5.1 基本结构**
ThreadLocalMap是ThreadLocal的内部类，没有实现Map接口，用独立的方式实现了Map的
功能，其内部的Entry也是独立实现。


（1） 成员变量

```
/**
```

_`*`_ 初始容量 _`——`_ 必须是 _`2`_ 的整次幂
```
*/

private static final int INITIAL_CAPACITY = 16;

/**
```

_`*`_ 存放数据的 _`table`_ ， _`Entry`_ 类的定义在下面分析
_`*`_ 同样，数组长度必须是 _`2`_ 的整次幂。
```
*/

private Entry[] table;

/**
```

_`*`_ 数组里面 _`entrys`_ 的个数，可以用于判断 _`table`_ 当前使用量是否超过阈值。
```
*/

private int size = 0;

/**
```

_`*`_ 进行扩容的阈值，表使用量大于它的时候进行扩容。
```
*/

private int threshold; // Default to 0

```

跟HashMap类似，INITIAL_CAPACITY代表这个Map的初始容量；table 是一个Entry 类型的数
组，用于存储数据；size 代表表中的存储数目； threshold 代表需要扩容时对应 size 的阈值。


（2） 存储结构 - Entry
```
/*
```

_`* Entry`_ 继承 _`WeakReference`_ ，并且用 _`ThreadLocal`_ 作为 _`key.`_
_`*`_ 如果 _`key`_ 为 _`null(entry.get() == null)`_ ，意味着 _`key`_ 不再被引用，
_`*`_ 因此这时候 _`entry`_ 也可以从 _`table`_ 中清除。
```
*/

static class Entry extends WeakReference<ThreadLocal<?>> {
/** The value associated with this ThreadLocal. */

Object value;

Entry(ThreadLocal<?> k, Object v) {
super (k);

value = v;
}
}

```

在ThreadLocalMap中，也是用 **Entry来保存K-V结构数据的。不过Entry中的key只能是**
**ThreadLocal对象，这点在构造方法中已经限定死了** 。


另外，Entry继承 **WeakReference** ，也就是key（ThreadLocal）是 **弱引用** ，其目的是将
ThreadLocal对象的生命周期和线程生命周期解绑。


**5.2 弱引用和内存泄漏**
有些程序员在使用ThreadLocal的过程中会发现有内存泄漏的情况发生，就猜测这个内存泄漏跟
Entry中使用了弱引用的key有关系。这个理解其实是不对的。


我们先来回顾这个问题中涉及的几个名词概念，再来分析问题。





<img src="/img/Thread.pdf-159-1.png">159-1



<img src="/img/Thread.pdf-159-2.png">159-2



<img src="/img/Thread.pdf-159-3.png">159-3

<img src="/img/Thread.pdf-159-4.png">159-4


<img src="/img/Thread.pdf-160-0.png">160-0

<img src="/img/Thread.pdf-160-1.png">160-1



<img src="/img/Thread.pdf-160-2.png">160-2

**5.3 hash冲突的解决**
hash冲突的解决是Map中的一个重要内容。我们以hash冲突的解决为线索，来研究一下
ThreadLocalMap的核心源码。


（1） 首先从ThreadLocal的set() 方法入手

```
public void set(T value) {
Thread t = Thread. currentThread ();
ThreadLocal.ThreadLocalMap map = getMap(t);
if (map != null )
```

_`//`_ 调用了 _`ThreadLocalMap`_ 的 _`set`_ 方法
```
map.set( this, value);
else

createMap(t, value);
}

ThreadLocal.ThreadLocalMap getMap(Thread t) {

return t.threadLocals;
}

```

```
void createMap(Thread t, T firstValue) {
```

_`//`_ 调用了 _`ThreadLocalMap`_ 的构造方法
```
t.threadLocals = new ThreadLocal.ThreadLocalMap( this, firstValue);
}

```

这个方法我们刚才分析过, 其作用是设置当前线程绑定的局部变量 :


这段代码有两个地方分别涉及到ThreadLocalMap的两个方法, 我们接着分析这两个方法。


（2）构造方法 **ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue)**

```
/*
```

_`* firstKey :`_ 本 _`ThreadLocal`_ 实例 _`(this)`_
_`* firstValue`_ ： 要保存的线程本地变量
```
*/

ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
```

_`//`_ 初始化 _`table`_

```
table = new ThreadLocal.ThreadLocalMap.Entry[INITIAL_CAPACITY];
```

_`//`_ 计算索引 _`(`_ 重点代码）
```
int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
```

_`//`_ 设置值

```
table[i] = new ThreadLocal.ThreadLocalMap.Entry(firstKey, firstValue);

size = 1;
```

_`//`_ 设置阈值
```
setThreshold(INITIAL_CAPACITY);
}

```

构造函数首先 **创建一个长度为16的Entry数组** ，然后计算出firstKey对应的索引，然后存储到
table中，并设置size和threshold。


重点分析： **int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1)** 。



<img src="/img/Thread.pdf-161-0.png">161-0

<img src="/img/Thread.pdf-161-1.png">161-1





（3） ThreadLocalMap中的set方法

```
private void set(ThreadLocal<?> key, Object value) {
ThreadLocal.ThreadLocalMap.Entry[] tab = table;
int len = tab.length;
```

_`//`_ 计算索引 _`(`_ 重点代码，刚才分析过了）
```
int i = key.threadLocalHashCode & (len-1);
/**
```

_`*`_ 使用线性探测法查找元素（重点代码）
```
*/

for (ThreadLocal.ThreadLocalMap.Entry e = tab[i];

e != null ;
e = tab[i = nextIndex (i, len)]) {

```

```
ThreadLocal<?> k = e.get();
```

_`//ThreadLocal`_ 对应的 _`key`_ 存在，直接覆盖之前的值
```
if (k == key) {

e.value = value;
return ;
}
```

_`// key`_ 为 _`null`_ ，但是值不为 _`null`_ ，说明之前的 _`ThreadLocal`_ 对象已经被回收了，
_`//`_ 当前数组中的 _`Entry`_ 是一个陈旧（ _`stale`_ ）的元素
```
if (k == null ) {
```

_`//`_ 用新元素替换陈旧的元素，这个方法进行了不少的垃圾清理动作，防止内存泄漏
```
replaceStaleEntry(key, value, i);
return ;
}
}

```

_`//ThreadLocal`_ 对应的 _`key`_ 不存在并且没有找到陈旧的元素，则在空元素的位置创建一个新的 _`Entry`_ 。
```
tab[i] = new Entry(key, value);

int sz = ++size;
/**
```

_`* cleanSomeSlots`_ 用于清除那些 _`e.get()==null`_ 的元素，
_`*`_ 这种数据 _`key`_ 关联的对象已经被回收，所以这个 _`Entry(table[index])`_ 可以被置 _`null`_ 。
_`*`_ 如果没有清除任何 _`entry,`_ 并且当前使用量达到了负载因子所定义 _`(`_ 长度的 _`2/3)`_ ，那么进行 _`* rehash`_ （执行一
次全表的扫描清理工作）
```
*/

if (!cleanSomeSlots(i, sz) && sz >= threshold)
rehash();
}

/**
```

_`*`_ 获取环形数组的下一个索引
```
*/

private static int nextIndex( int i, int len) {
return ((i + 1 < len) ? i + 1 : 0);
}

```

代码执行流程：



<img src="/img/Thread.pdf-162-0.png">162-0



最后调用 **cleanSomeSlots** ，清理key为null的Entry，最后返回是否清理了Entry，接下来再判
断sz 是否>= thresgold达到了rehash的条件，达到的话就会调用rehash函数执行一次全表的扫
描清理。


重点分析 ： **ThreadLocalMap使用线性探测法来解决哈希冲突的** 。


该方法一次探测下一个地址，直到有空的地址后插入，若整个空间都找不到空余的地址，则产生
溢出。


举个例子，假设当前table长度为16，也就是说如果计算出来key的hash值为14，如果table[14]
上已经有值，并且其key与当前key不一致，那么就发生了hash冲突，这个时候将14加1得到
15，取table[15]进行判断，这个时候如果还是冲突会回到0，取table[0],以此类推，直到可以插
入。


按照上面的描述，可以把Entry[] table看成一个环形数组。


