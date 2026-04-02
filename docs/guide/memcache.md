---
aliases:
  - memcache
标题: memcache
---
**memcache windows安装**


**笔记本：** memcache


**创建时间：** 2021/10/10 17:44 **更新时间：** 2024/10/21 4:45


**作者：** 彼岸樱速


在这里简单介绍一下Windows下的Memcache的安装：



<img src="/img/memcache.pdf-0-0.png">0-0



2. memcached的基本设置



<img src="/img/memcache.pdf-0-1.png">0-1






3. 设置Memcache缓存大小和端口


Memcache的默认启动时的参数可能不满足实际生产环境的需要，
于是就想到直接修改windows服务的启动参数，操作如下：


打开注册表，找到：
HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/Services/memcached
Server


其中的ImagePath项的值为： c:/memcached/memcached.exe"
-d runservice


改成：c:/memcached/memcached.exe" -p 12345 -m 128 -d
runservice


其中，-p就是端口，-m就是缓存大小，以M为单位。


cmd输入；telnet 127.0.0.1 11211，我的报错：'telnet' 不是内部
或外部命令,也不是可运行的程序 或批处理文件。


解决方法在地址：控制面板开启telnet服务


对Memcached缓存服务的状态查询，可以先telnet连接上服务：
telnet 127.0.0.1 11211 ，然后使用 stats命令查看缓存服务的状
态，会返回如下的数据：


<img src="/img/memcache.pdf-2-0.png">2-0

linux安装





1. 方法一：# yum install libevent libevent-devel -y(一键安装的形式)



<img src="/img/memcache.pdf-2-2.png">2-2


**memcache学习地址**


**笔记本：** memcache


**创建时间：** 2021/10/10 17:53 **更新时间：** 2021/10/10 17:54


**作者：** 彼岸樱速


                            https://www.runoob.com/memcached/memcached
tutorial.html


