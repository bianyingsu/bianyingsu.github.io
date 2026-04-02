---
aliases:
  - nginx
标题: nginx
---
**CentOS8安装Nginx**


**笔记本：** nginx


**创建时间：** 2024/4/2 20:55 **更新时间：** 2024/4/2 21:38

## **CentOS8安装Nginx**


**前言：**


Nginx（engine x）是一个高性能的HTTP和反向代理web服务器，它同时提供了

IMAP/POP3/SMTP服务，Nginx是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点

（俄文：Рамблер）开发的。


Nginx是一款轻量级的Web服务器 / 反向代理服务器以及电子邮件（IMAP/POP3）代理服务器。

在BSK-like 协议下发行。其特点是占有内存少、并发能力强。


nginx的并发能力在同类型的网页服务器中表现较好。


由于在CentOS8中安装nginx比较简单，接下来直接进入主题


1、安装必要的插件


1.1、安装gcc


GCC（GNU Compiler Collection，GNU编译器套件）是由GNU开发的编程语言编译器。它可以

编译 C、C++、ada、object-c、java、Go等语言。


一般来说 CentOS8中都自带有gcc，可以使用命令：gcc -v 来查看gcc是否安装


如果gcc没有安装，可使用命令：yum install gcc -y 来进行安装


1.2、安装pcre pcre-devel


pcre是一个 perl 库，它包括了 perl 兼容的正则表达式库，nginx中的http模块需要使用 pcre 来解
析正则表达式，所以，安装 pcre 库是必须的。


命令：yum install pcre pcre-devel -y



<img src="/img/nginx.pdf-0-0.png">0-0
<img src="/img/nginx.pdf-1-0.png">1-0

<img src="/img/nginx.pdf-1-1.png">1-1

1.3、安装zlib zlib-devel


zlib库提供了很多种压缩和解压缩的方式，nginx需要使用zlib库来对http包的内容进行gzip，所以

zlib插件也必须要安装。


命令：yum install zlib zlib-devel -y


1.4、安装openssl openssl-devel



<img src="/img/nginx.pdf-1-2.png">1-2
openssl是web安全通信的基石，如果没有spenssl，我们的所有信息都相当于是在裸奔，会全部

暴露出来，其重要程度可想而知，所以也必须要安装。


命令：yum install openssl openssl-devel -y


2、安装nginx


2.1、安装nginx，首页进入 src目录，然后创建一个nginx文件夹，进入nginx目录后再使用命令

安装nginx。当然安装目录可以自行选择。


命令：


cd usr/local/src


mkdir nginx


cd nginx


2.1、使用下列命令下载nginx安装包


命令：wget http://nginx.org/download/nginx-1.18.0.tar.gz



<img src="/img/nginx.pdf-2-0.png">2-0

<img src="/img/nginx.pdf-2-1.png">2-1

<img src="/img/nginx.pdf-2-2.png">2-2
2.2、使用下列命令将nginx安装包进行解压，将解压后的nginx文件重命名，然后删除原装安装

包。





2.3 进入nginx-1.18.0目录，然后执行下列命令





--prefix=/usr/local/src/nginx 是指指定路径安装


执行命令： make 进行编译



<img src="/img/nginx.pdf-3-2.png">3-2

<img src="/img/nginx.pdf-3-3.png">3-3

<img src="/img/nginx.pdf-3-4.png">3-4
<img src="/img/nginx.pdf-4-0.png">4-0

执行命令：make install 进行安装


2.4、安装完成后，进入conf目录，执行命令：vim nginx.conf 查看端口



<img src="/img/nginx.pdf-4-1.png">4-1

<img src="/img/nginx.pdf-4-2.png">4-2
<img src="/img/nginx.pdf-5-0.png">5-0

2.5、启动nginx


切换到下图中的路径


然后进入sbin目录执行命令：./nginx 启动nginx，然后执行命令：ps -ef | grep nginx 查看nginx

是否启动成功。


然后在虚拟机的浏览器中输入地址：http://localhost:80访问nginx。



<img src="/img/nginx.pdf-5-1.png">5-1
<img src="/img/nginx.pdf-6-0.png">6-0

3、如果想要在外部主机访问nginx，需要关闭服务器防火墙或者开放nginx服务端口，nginx的

服务端口为nginx.conf中配置的端口。


命令：systemctl stop firewalld.service   #关闭防火墙


最后在外部主机的浏览器输入nginx地址就可以访问了。


4、扩展


4.1、nginx.conf解释说明：

```
 #user nobody;
 worker_processes 1; #工作进程：数目。根据硬件调整，通常等于cpu数量或者2倍cpu数量。
 #错误日志存放路径
 #error_log logs/error.log;
 #error_log logs/error.log notice;
 #error_log logs/error.log info;
 #pid    logs/nginx.pid; # nginx进程pid存放路径
 events {
 worker_connections 1024; # 工作进程的最大连接数量
 }

```


<img src="/img/nginx.pdf-6-1.png">6-1
<img src="/img/nginx.pdf-7-0.png">7-0



make过程如果出现报错，解决方法如下


**第一个，报错**



<img src="/img/nginx.pdf-8-0.png">8-0



分析原因：
是将警告当成了错误处理，打开 nginx的安装目录/objs/Makefile， `去掉CFLAGS中的-Werror，再`

```
重新make
```

-Wall 表示打开gcc的所有警告


-Werror，它要求gcc将所有的警告当成错误进行处理


**第二个，make出现的错误**



<img src="/img/nginx.pdf-8-1.png">8-1





这里提示我们struct crypt_data’没有名为‘current_salt’的成员：cd.current_salt[0] =
~salt[0]；
最好的办法是换一个版本，因为条件限制，我们就进到源码里把这行直接注释掉好了。 `# vim`

`src/os/unix/ngx_user.c` 进入里面注释掉36行


**第三个错误openssl版本错误**

```
    src/event/ngx_event_openssl.c: In function ‘ngx_ssl_dhparam’:

    src/event/ngx_event_openssl.c:954:11: error: dereferencing pointer to i

    dh->p = BN_bin2bn(dh1024_p, sizeof(dh1024_p), NULL);^~

    src/event/ngx_event_openssl.c: In function ‘ngx_ssl_connection_error’:

    src/event/ngx_event_openssl.c:1941:21: error: ‘SSL_R_NO_CIPHERS_PASSED

```


<img src="/img/nginx.pdf-8-2.png">8-2
<img src="/img/nginx.pdf-9-0.png">9-0



解决：
直接安装openssl1.0版本

`wget http://www.openssl.org/source/openssl-1.1.0e.tar.gz` //下载openssl

[root@iZgt88z6l1kvd7Z ~]# `tar -zxvf openssl-1.1.0e.tar.gz` //解压

[root@iZgt88z6l1kvd7Z ~]# `cd openssl-1.1.0e/ &&./config shared zlib --`

`prefix=/usr/local/openssl && make && make install` 进入目录把openssl编译安装到
/usr/local/openssl 下

[root@iZgt88z6l1kvd7Z openssl-1.1.0e]# `./config -t`

[root@iZgt88z6l1kvd7Z openssl-1.1.0e]# `make depend` [//一种度makefile的规则，通过扫描](https://so.csdn.net/so/search?q=makefile&spm=1001.2101.3001.7020)
仪个目录下的所有C/C++ 代码，从而判专断出文件之间的依赖关系，如a.cc文件中调用了
b.h(如以形势include<b.h>)，如果之后a.cc文件被改动，那 么只需要重新编属译a.cc文件，不
需要编译b.h文件。否则所有的文件都需要重新编译。

[root@localhost openssl-1.1.0e]# `cd /usr/local`

[root@iZgt88z6l1kvd7Z local]# `ln -s openssl ssl`

[root@iZgt88z6l1kvd7Z local]# `echo "/usr/local/openssl/lib" >>/etc/ld.so.conf`

[root@iZgt88z6l1kvd7Z local]# `cd /root/openssl-1.1.0e` 注意每个人的目录都是不一样
的，我这里是root下的openssl，至于其他人看自己情况，切换目录

[root@iZgt88z6l1kvd7Z openssl-1.1.0e]# `ldconfig`

[root@iZgt88z6l1kvd7Z openssl-1.1.0e]# `echo $?`

0


[root@iZgt88z6l1kvd7Z openssl-1.1.0e]# `echo "PATH=$PATH:/usr/local/openssl/bin"`

```
>> /etc/profile && source /etc/profile

```

然后重新进入nginx-1.9.9执行[root@iZwz967a5gqt3aqi2g3pbkZ nginx-1.9.9]# `./configure --`

```
prefix=/usr/local/nginx --add-module=/root/nginx-1.9.9/headers-more-nginx```

`module-0.33 --with-http_stub_status_module --with-http_ssl_module` 注意，我这里的


是这条命令，至于你们的 `./configure……` 就看你们自身情况


重新 `make` 一下哎


**在 windows 下调试 nginx 配置时，暂时关闭后台运行模式**


**笔记本：** nginx


**创建时间：** 2024/3/26 17:45 **更新时间：** 2024/3/26 17:46



<img src="/img/nginx.pdf-10-0.png">10-0


**关于nginx反向代理的最好解释**


**笔记本：** nginx


**创建时间：** 2022/4/2 14:20 **更新时间：** 2022/4/2 14:34


**作者：** 彼岸樱速


**正向代理**


**什么是正向代理？** 是一个位于客户端和原始服务器(origin server)之间的服务器，为了从原始服
务器取得内容，客户端向代理发送一个请求并指定目标(原始服务器)，


然后代理向原始服务器转交请求并将获得的内容返回给客户端（ **目的是为了保护客户端用户** ），


比如客户端使用的是内网，正常情况下，是无法访问外网的网址的，此时需要一个代理服务器，
客户端请求代理服务器，然后转发到目标服务器，获取的结果再返回到客户端。


**反向代理**


**什么是反向代理？** 在客户端和服务器端的一个代理服务器，但是这个代理服务器的 **目的是用来**
**保护服务器端** 的，


总之就是，现在网络技术爆炸的时代，黑客那么多，为了保护你的服务器或者你的服务端信息，
nginx做了一层代理，你表面上看到的ip地址，还有端口之类的，根本就不是真正的信息，真正
的信息已经被nginx隐藏起来了。


**正向代理保护的是客户端用户，反向代理保护的是服务端的服务，保护的目标是刚好相反的**


当外网客户端来访问我们的服务器时为了避免暴露应用服务器的实际ip地址，


我们会让客端访问代理服务器，然后代理服务器再根据客户端的请求去实际的应用服务器获取响
应内容并返回客户端。也就是说客户端访问的是反向代理服务器的ip地址，然后通过特定的匹配
去转发到目标服务器上，客户端是不知道目标服务器的地址。



<img src="/img/nginx.pdf-11-1.png">11-1

<img src="/img/nginx.pdf-11-2.png">11-2
nginx反向代理配置文件的修改（主要修改server_name和proxy_pass） **server_name** ：主机
名，这里填写反向代理服务器的地址 **proxy_pass** ：nginx 代理到的地址


**nginx 的启动、停止与重启**


**笔记本：** nginx


**创建时间：** 2022/1/28 16:43 **更新时间：** 2022/1/28 16:45


**作者：** 彼岸樱速


**nginx 的启动、停止与重启**


**详解**



<img src="/img/nginx.pdf-13-0.png">13-0





**停止**


查看进程号：

```
 $ ps -ef|grep nginx

 root 5747 1 0 May23 ? 00:00:00 nginx: master process /usr/local/nginx/sbin/nginx

 500 12037 7886 0 10:00 pts/1 00:00:00 grep nginx

 nobody 25581 5747 0 Sep27 ? 00:01:16 nginx: worker process

 nobody 25582 5747 0 Sep27 ? 00:01:25 nginx: worker process

 nobody 25583 5747 0 Sep27 ? 00:02:59 nginx: worker process

 nobody 25584 5747 0 Sep27 ? 00:02:05 nginx: worker process

```

杀死进程：

```
 $ kill -9 5747

```

**重启**


**1. 验证nginx配置文件是否正确**


进入nginx安装目录sbin下，输入命令：





看到如上显示，说明配置文件正确！


**2. 重启nginx服务**


进入nginx安装目录sbin下，输入命令：


**upstream模块介绍**


**笔记本：** nginx


**创建时间：** 2021/10/11 12:37 **更新时间：** 2021/10/11 12:49


**作者：** 彼岸樱速


**upstream模块介绍**


Nginx的负载均衡功能来自于其模块ngx_http_upstream_module模块，该模块支持的代理方
式有：



<img src="/img/nginx.pdf-15-0.png">15-0



ngx_http_upstream_module模块允许Nginx定义一组或多组节点服务器，使用时可以通过
proxy_pass代理方式，把用户请求发送到事先定于好的upstream组中。具体写法就是


**完整的upstream配置案例**



<img src="/img/nginx.pdf-15-1.png">15-1

<img src="/img/nginx.pdf-15-2.png">15-2



**使用域名及socket的upstream配置**



<img src="/img/nginx.pdf-15-3.png">15-3



**upstream参数**


**upstream模块调度算法**


【rr轮询调度算法】


**【wrr权重轮询】**



<img src="/img/nginx.pdf-15-4.png">15-4

<img src="/img/nginx.pdf-15-5.png">15-5


<img src="/img/nginx.pdf-16-0.png">16-0

**【ip_hash】**



<img src="/img/nginx.pdf-16-1.png">16-1



**【fail】**


该算法根据后端服务器节点的响应时间来分配，响应时间短的优先分配。nginx本身不支持fail
形式，如果要支持该算法，必须下载nginx的upstream模块。



<img src="/img/nginx.pdf-16-2.png">16-2



**【least_conn】**





**【url_hash】**


需要单独安装hash模块



<img src="/img/nginx.pdf-16-4.png">16-4



**proxy_pass指令**


**案例1**


**案例2**



<img src="/img/nginx.pdf-16-5.png">16-5

<img src="/img/nginx.pdf-16-6.png">16-6



**proxy_pass参数**


|参数|作用解释|
|---|---|
|proxy_set_header|设置反向代理向后端发送的http请求头信息，如添加host主机头<br>部字段，让后端服务器能够获取到真是客户端的IP信息等。|
|client_body_buffer_size|指定客户端请求主体缓冲区大小|
|||


|proxy connect timeout<br>_ _|反向代理和后端节点连接的超时时间 也是建立握手后等待响应<br>，<br>的时间|
|---|---|
|proxy_send_timeout|表示代理后端服务器的数据回传时间，在规定时间内后端若数据<br>未传完，nginx会断开连接|
|proxy_read_timeout|设置nginx从代理服务器获取数据的超时时间|
|proxy_buffer|设置缓冲区的数量大小|


**Nginx 配置详解**


**笔记本：** nginx


**创建时间：** 2021/10/11 12:27 **更新时间：** 2021/10/11 12:35


**作者：** 彼岸樱速

# **序言**


Nginx是lgor Sysoev为俄罗斯访问量第二的rambler.ru站点设计开发的。从2004年发布至今，凭借开源的力


量，已经接近成熟与完善。


Nginx功能丰富，可作为HTTP服务器，也可作为反向代理服务器，邮件服务器。支持FastCGI、SSL、Virtual


Host、URL Rewrite、Gzip等功能。并且支持很多第三方的模块扩展。


Nginx的稳定性、功能集、示例配置文件和低系统资源的消耗让他后来居上，在全球活跃的网站中有12.18%的


使用比率，大约为2220万个网站。


牛逼吹的差不多啦，如果你还不过瘾，你可以百度百科或者一些书上找到这样的夸耀，比比皆是。

# **Nginx常用功能**


1、Http代理，反向代理：作为web服务器最常用的功能之一，尤其是反向代理。


这里我给来2张图，对正向代理与反向代理做个诠释，具体细节，大家可以翻阅下资料。


Nginx在做反向代理时，提供性能稳定，并且能够提供配置灵活的转发功能。Nginx可以根据不同的正则匹


配，采取不同的转发策略，比如图片文件结尾的走文件服务器，动态页面走web服务器，只要你正则写的没问


题，又有相对应的服务器解决方案，你就可以随心所欲的玩。并且Nginx对返回结果进行错误页跳转，异常判


断等。如果被分发的服务器存在异常，他可以将请求重新转发给另外一台服务器，然后自动去除异常服务器。

# **2** **、负载均衡**


Nginx提供的负载均衡策略有2种：内置策略和扩展策略。内置策略为轮询，加权轮询，Ip hash。扩展策略，


就天马行空，只有你想不到的没有他做不到的啦，你可以参照所有的负载均衡算法，给他一一找出来做下实


现。


上3个图，理解这三种负载均衡算法的实现


Ip hash算法，对客户端请求的ip进行hash操作，然后根据hash结果将同一个客户端ip的请求分发给同一台服


务器进行处理，可以解决session不共享的问题。



<img src="/img/nginx.pdf-18-0.png">18-0

<img src="/img/nginx.pdf-18-1.png">18-1
<img src="/img/nginx.pdf-19-0.png">19-0
# **3 web** **、 缓存**

Nginx可以对不同的文件做不同的缓存处理，配置灵活，并且支持FastCGI_Cache，主要用于对FastCGI的动


态程序进行缓存。配合着第三方的ngx_cache_purge，对制定的URL缓存内容可以的进行增删管理。

# **4** **、Nginx相关地址**


源码： [https://trac.nginx.org/nginx/browser](https://trac.nginx.org/nginx/browser)


官网： [http://www.nginx.org/](http://www.nginx.org/)

# **Nginx配置文件结构**


如果你下载好啦，你的安装文件，不妨打开conf文件夹的nginx.conf文件，Nginx服务器的基础配置，默认的


配置也存放在此。


在 nginx.conf 的注释符号为： **`#`**


默认的 nginx 配置文件 nginx.conf 内容如下：

```
  #user nobody;

  worker_processes 1;

  #error_log logs/error.log;#error_log logs/error.log notice;#error_log logs/error.log info;

  #pid logs/nginx.pid;

  events {

  worker_connections 1024;

  }

  http {

  include mime.types;

  default_type application/octet-stream;

  #log_format main '$remote_addr - $remote_user [$time_local] "$request" '

  # '$status $body_bytes_sent "$http_referer" '

  # '"$http_user_agent" "$http_x_forwarded_for"';

  #access_log logs/access.log main;

  sendfile on;

  #tcp_nopush on;

```

```
#keepalive_timeout 0;

keepalive_timeout 65;

#gzip on;

server {

listen 80;

server_name localhost;

#charset koi8-r;

#access_log logs/host.access.log main;

location / {

root html;

index index.html index.htm;

}

#error_page 404 /404.html;

# redirect server error pages to the static page /50x.html

#

error_page 500 502 503 504 /50x.html;

location = /50x.html {

root html;

}

# proxy the PHP scripts to Apache listening on 127.0.0.1:80

#

#location ~ /.php$ {

#   proxy_pass http://127.0.0.1;

#}

# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000

#

#location ~ /.php$ {

# root html;

# fastcgi_pass 127.0.0.1:9000;

# fastcgi_index index.php;

# fastcgi_param SCRIPT_FILENAME /scripts$fastcgi_script_name;

# include fastcgi_params;

#}

# deny access to .htaccess files, if Apache's document root

# concurs with nginx's one

#

#location ~ //.ht {

# deny all;

#}

}

# another virtual host using mix of IP-, name-, and port-based configuration

#

#server {

# listen 8000;

# listen somename:8080;

# server_name somename alias another.alias;

# location / {

# root html;

# index index.html index.htm;

# }

#}

# HTTPS server

```

```
  #

  #server {

  # listen 443 ssl;

  # server_name localhost;

  # ssl_certificate cert.pem;

  # ssl_certificate_key cert.key;

  # ssl_session_cache shared:SSL:1m;

  # ssl_session_timeout 5m;

  # ssl_ciphers HIGH:!aNULL:!MD5;

  # ssl_prefer_server_ciphers on;

  # location / {

  # root html;

  # index index.html index.htm;

  # }

  #}

  }

```

**nginx 文件结构**

```
  ... # 全局块

  events { #events 块

  ...

  }

  http #http 块

  {

  ... #http 全局块

  server #server 块

  {

  ... #server 全局块

  location [PATTERN] #location 块

  {

  ...

  }

  location [PATTERN]

  {

  ...

  }

  }

  server

  {

  ...

  }

  ... #http 全局块

  }

```

1、 **全局块** ：配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，


日志存放路径，配置文件引入，允许生成worker process数等。


2、 **events块** ：配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件


驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。


3、 **http块** ：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。


如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求


数等。


4、 **server块** ：配置虚拟主机的相关参数，一个http中可以有多个server。


5、 **location块** ：配置请求的路由，以及各种页面的处理情况。


下面给大家上一个配置文件，作为理解。



<img src="/img/nginx.pdf-22-0.png">22-0



上面是nginx的基本配置，需要注意的有以下几点：


1、几个常见配置项：



<img src="/img/nginx.pdf-22-1.png">22-1



2、惊群现象：一个网路连接到来，多个睡眠的进程被同时叫醒，但只有一个进程能获得链接，这样会影响系


统性能。


3、每个指令必须有分号结束。


**Nginx反向代理中proxy_set_header参数说明**


**笔记本：** nginx


**创建时间：** 2021/10/11 12:18 **更新时间：** 2021/10/11 12:23


**作者：** 彼岸樱速







如果启用缓存，来自之前请求的头字段“If-Modified-Since”, “If-Unmodified-Since”, “If
None-Match”, “If-Match”, “Range”, 和 “If-Range” 将不会被代理服务器传递。


一个不会变化的“Host”头请求字段可通过如下方式被传递：





然后，当字段不在请求头中就无法传递了，在这种情况下，可通过设置Host变量，将需传递值赋给Host变量





此外，服务器名称和端口一起通过代理服务器传递

```
   1 proxy_set_header Host    $host:$proxy_port;

```

如果请求头的存在空的字段将不会通过代理服务器传递出去










```
1 ）如下测试，不设置 proxy_set_header

Nginx 配置：

upstream test {

server 192.168.1.123:9099;

server 192.168.1.123:58080;

}

server {

listen  5800;

server_name 192.168.1.123;

root     /usr/share/nginx/html;

include /etc/nginx/default.d/*.conf;

location / {

proxy_pass http://test;

}

测试 jsp 想获取客户端 IP 、客户端 port 、代理服务器 IP 、代理服务器 port

<%@page contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"%>

<%

String scheme = request.getScheme();

String serverName = request.getServerName();

String remoteName = request.getRemoteAddr();

String realIP = request.getHeader("X-Forwarded-For");

String realIP2 = request.getHeader("X-Real-IP");

```

```
26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

```

```
String Host = request.getHeader("Host");

int port = request.getServerPort();

int portR = request.getRemotePort();

String requestURIC1 = scheme+"://"+realIP+":"+portR;

String requestURIC2 = scheme+"://"+realIP2+":"+portR;

String requestURIC3 = scheme+"://"+remoteName+":"+portR;

String requestURI = scheme+"://"+serverName+":"+port;

%>

其中：

客户端地址 1:<%=requestURIC1 %>

客户端地址 2:<%=requestURIC2 %>

客户端地址 3:<%=requestURIC3%>

服务器地址 1:<%=requestURI%>

服务器地址 2:<%=Host%>

测试结果

客户端地址 1:http://null:58828

客户端地址 2:http://null:58828

客户端地址 3:http://192.168.1.123:58828

服务器地址 1:http://test:80

服务器地址 2:test

Nginx 日志

192.168.1.177 -20508---5800 [25/Aug/2016:16:34:13 +0800] "GET /docs/test.jsp HTTP/1.1" 200 223 "

其中客户端 IP 不能获取到，而通过 request.getRemoteAddr();

获取的 IP 是代理服务器 IP ，而不是客户端 IP ，而在 nginx 中 $remote_addr 变量的值是客户端的 IP ，可见 remoteaddr 没有传递。

而 server_port 值也不对，当前值为 5800 ，当前打印出的是 80 。

而当前代理为 http://test 所有通过 host 得到的是 test 。

客户端 port 也获取不到值为 20508 ，可传给应用的是 58828

--------------------------------------------------------------------------------------------------------
2 ）如下测试，设置 proxy_set_header

Nginx 配置：

upstream test {

server 192.168.1.123:9099;

server 192.168.1.123:58080;

}

server {

listen  5800;

server_name 192.168.1.123;

root     /usr/share/nginx/html;

include /etc/nginx/default.d/*.conf;

location / {

proxy_pass http://test;

proxy_set_header Host $host:$server_port;

proxy_set_header X-Real-IP $remote_addr;

proxy_set_header X-Real-PORT $remote_port;

proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

}

测试页面改成：

<%@page contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"%>

<%

String scheme = request.getScheme();

String serverName = request.getServerName();

```

```
 86

 87

 88

 89

 90

 91

 92

 93

 94

 95

 96

 97

 98

 99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

```

```
String remoteName = request.getRemoteAddr();

String realIP = request.getHeader("X-Forwarded-For");

String realIP2 = request.getHeader("X-Real-IP");

String Host = request.getHeader("Host");

int port = request.getServerPort();

int portR = request.getRemotePort();

String portR2 = request.getHeader("X-Real-Port");

String requestURIC1 = scheme+"://"+realIP+":"+portR;

String requestURIC2 = scheme+"://"+realIP2+":"+portR;

String requestURIC3 = scheme+"://"+remoteName+":"+portR;

String requestURI = scheme+"://"+serverName+":"+port;

%>

其中：

客户端地址 1:<%=requestURIC1 %>

客户端地址 2:<%=requestURIC2 %>

客户端地址 3:<%=requestURIC3%>

服务器地址 1:<%=requestURI%>

服务器地址 2:<%=Host%>

客户端 port2:<%=portR2%>

客户端地址 1:http://192.168.1.177:21548

客户端地址 2:http://192.168.1.177:21548

客户端地址 3:http://192.168.1.123:21548

服务器地址 1:http://192.168.1.123:5800

服务器地址 2:192.168.1.123:5800

客户端 port2:20604

nginx 日志：

192.168.1.177 -20604---5800 [25/Aug/2016:16:38:42 +0800] "GET /docs/test.jsp HTTP/1.1" 200 275 "-" "Mozill

除 request.getRemoteAddr(); 获取的值不对外，其他值都是对的。

getRemoteAddr 获取的是代理的请求地址。

因重定义了 host, 所以 test 值被改写成代理服务器 IP 。

因重定义了 X-Real-PORT- 并传递 $remote_port ，客户端 port 也获取正确了。

```





```
nginx 反向代理中经常碰过的一个 " 坑 " ： proxy_set_header 自定义 header 头无效的问题

解决办法：

nginx underscores_in_headers 默认 off

可以用减号 - 替代下划线符号 _ ，避免这种变态问题。 nginx 默认忽略掉下划线可能有些原因。

upstream os-8080 {

ip_hash;

server 192.168.1.20:8080 max_fails=3 fail_timeout=15s;

server 192.168.1.21:8080 max_fails=3 fail_timeout=15s;

}

server {

listen   80;

server_name bpm.wangshibo.com;

access_log /data/nginx/logs/bpm.wangshibo.com-access.log main;

```

```
error_log /data/nginx/logs/bpm.wangshibo.com-error.log;

nginx underscores_in_headers on;

location / {

proxy_pass http://os-8080;

proxy_redirect off ;

proxy_set_header Host $host;

proxy_set_header X-Real-IP $remote_addr;

proxy_set_header REMOTE-HOST $remote_addr;

proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

proxy_connect_timeout 300;

proxy_send_timeout 300;

proxy_read_timeout 600;

proxy_buffer_size 512k;

proxy_buffers 8 512k;

proxy_busy_buffers_size 512k;

proxy_temp_file_write_size 512k;

proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_404;

proxy_max_temp_file_size 128m;

}

error_page  500 502 503 504 /50x.html;

location = /50x.html {

root  html;

}

}

```




<img src="/img/nginx.pdf-26-2.png">26-2









==================不妨看一个proxy_set_header配置实例==================




```
windows 客户端（请求 web 服务）： 192.168.1.1

nginx 作为反向代理服务器： 192.168.1.136

nginx 作为后端 web 服务器： 192.168.1.137

前提条件：配置 nginx 转发到后端服务器

server {

listen 8080;

server_name 192.168.1.136;

location / {

root "/www/html";

index index.html;

   #auth_basic "required auth";

   #auth_basic_user_file "/usr/local/nginx/users/.htpasswd";

```



```
error_page 404 /404.html;

}

location /images/ {

root "/www";

rewrite ^/images/bbs/(.*/.jpeg)$ /images/$1 break;

rewrite ^/images/www/(.*)$ http://192.168.1.136/$1 redirect;

}

location /basic_status {

stub_status;

}

location ^~/proxy_path/ {

root "/www/html";

index index.html;

proxy_pass http://192.168.1.137/;

proxy_set_header Host $host;

proxy_set_header X-Real-IP $remote_addr;

   #proxy_set_header X-Forwarded-For $remote_addr;

proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

}

location ^~/proxy_path/ {

root "/www/html";

index index.html;

proxy_pass http://192.168.1.137/;

}

}

将左侧匹配到的 /proxy_path/ 开头的 url 全部转发到后端服务器 192.168.223.137

```


**下面将一一测试各个proxy_set_header设置的变量的内容：**



<img src="/img/nginx.pdf-27-1.png">27-1







如果将后端服务器关闭了，则会出现502网管错误：



<img src="/img/nginx.pdf-27-2.png">27-2

<img src="/img/nginx.pdf-27-3.png">27-3








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

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

```

```
2 ） proxy_set_header Host $proxy_host;

将设置修改为上述 proxy_host 然后重启 ngxin 代理服务器 136

[root@wadeson nginx]# sbin/nginx -s reload

重新请求代理页面： http://192.168.1.136:8080/proxy_path/index.html ，然后日志如下：

首先查看 136 代理服务器的日志：

192.168.1.1 - - [18/Jul/2017:10:30:12 +0800] "GET /proxy_path/index.html HTTP/1.1" 192.168.1.136:8080 304

(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"

因为 windows 是 136 的客户端，请求的 host 为 192.168.223.136:8080 ，而 nginx 代理服务器作为 137 后端服务器的客户端，将请求的

将 proxy_host 封装为请求的 host

那么 137 上面日志请求的 host 就是其自身， proxy_host 就是代理服务器请求的 host 也就是后端服务器 137

192.168.1.136 "192.168.1.1" - - [18/Jul/2017:10:30:12 +0800] "GET /index.html HTTP/1.0" "192.168.1.137" 30

(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"

3 ） proxy_set_header Host $host:$proxy_port;

了解了上面的知识，那么此处对应的 host 就知道代表的啥了， $host 代表转发服务器， $proxy_port 代表 136 转发服务器请求后端服务

于是观察 136 、 137 的日志进行验证：

192.168.1.1 - - [18/Jul/2017:10:38:38 +0800] "GET /proxy_path/index.html HTTP/1.1" 192.168.1.136:8080 304

(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"

192.168.1.136 "192.168.1.1" - - [18/Jul/2017:10:38:38 +0800] "GET /index.html HTTP/1.0" "192.168.1.136:80

(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"

4 ） proxy_set_header X-Real-IP $remote_addr;

将 $remote_addr 的值放进变量 X-Real-IP 中，此变量名可变， $remote_addr 的值为客户端的 ip

nginx 转发 136 服务器日志格式为：

log_format main '$remote_addr - $remote_user [$time_local] "$request" $http_host '

'$status $body_bytes_sent "$http_referer" '

'"$http_user_agent" "$http_x_forwarded_for"';

nginx 后端 137 服务器的日志格式：

log_format main '$remote_addr "$http_x_real_ip" - $remote_user [$time_local] "$request" "$http_host" '

'$status $body_bytes_sent "$http_referer" '

'"$http_user_agent" "$http_x_forwarded_for"';

两者区别在于 "$http_x_real_ip" ，添加了这个变量的值

重新请求需要访问的地址 http://192.168.1.136:8080/proxy_path/index.html

136 的日志：

192.168.1.1 - - [18/Jul/2017:10:45:07 +0800] "GET /proxy_path/index.html HTTP/1.1" 192.168.1.136:8080 304

(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"

137 的日志：

192.168.1.136 "192.168.1.1" - - [18/Jul/2017:10:45:07 +0800] "GET /index.html HTTP/1.0" "192.168.1.136:80

(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"

红色标记的就是 "$http_x_real_ip" 的值，即可以看见用户真实的 ip ，也就是客户端的真实 ip

5 ） proxy_set_header X-Forwarded-For $remote_addr;

理解了上面的含义那么这个封装报文的意思也就请求了

首先还是比对 136 和 137 的日志格式：

```

```
 60

 61

 62

 63

 64

 65

 66

 67

 68

 69

 70

 71

 72

 73

 74

 75

 76

 77

 78

 79

 80

 81

 82

 83

 84

 85

 86

 87

 88

 89

 90

 91

 92

 93

 94

 95

 96

 97

 98

 99

100

101

102

103

104

105

106

```

```
136 代理服务器的日志格式：

log_format main '$remote_addr - $remote_user [$time_local] "$request" $http_host '

'$status $body_bytes_sent "$http_referer" '

'"$http_user_agent" "$http_x_forwarded_for"';

137 后端服务器的日志格式：

log_format main '$remote_addr "$http_x_real_ip" - $remote_user [$time_local] "$request" "$http_host" '

'$status $body_bytes_sent "$http_referer" '

'"$http_user_agent" "$http_x_forwarded_for"';

重新请求需要访问的地址 http://192.168.1.136:8080/proxy_path/index.html

136 的日志显示：

192.168.1.1 - - [18/Jul/2017:10:51:25 +0800] "GET /proxy_path/index.html HTTP/1.1" 192.168.1.136:8080 304

(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"

"$http_x_forwarded_for" 对应的为空值

137 的日志显示：

192.168.1.136 "192.168.1.1" - - [18/Jul/2017:10:51:25 +0800] "GET /index.html HTTP/1.0" "192.168.1.136:80

(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"

可以看出 137 后端服务器成功的显示了真实客户端的 ip

6 ） proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

5 、 6 两者的区别：

在只有一个代理服务器的转发的情况下，两者的效果貌似差不多，都可以真实的显示出客户端原始 ip

但是区别在于：

$proxy_add_x_forwarded_for 变量包含客户端请求头中的 "X-Forwarded-For" ，与 $remote_addr 两部分，他们之间用逗号分开。

##########################################################################################################

举个例子，有一个 web 应用，在它之前通过了两个 nginx 转发， www.kevin.com 即用户访问该 web 通过两台 nginx 。

在第一台 nginx 中, 使用

proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

现在的 $proxy_add_x_forwarded_for 变量的 "X-Forwarded-For" 部分是空的，所以只有 $remote_addr ，而 $remote_addr 的值是

X-Forwarded-For 变量的值就是用户的真实的 ip 地址了。

到了第二台 nginx ，使用

proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

现在的 $proxy_add_x_forwarded_for 变量， X-Forwarded-For 部分包含的是用户的真实 ip ， $remote_addr 部分的值是上一台 ngi

于是通过这个赋值以后现在的 X-Forwarded-For 的值就变成了 " 用户的真实 ip ，第一台 nginx 的 ip" ，这样就清楚了吧。

```


**######  Nginx反向代理Tomcat访问报错400问题  #######**


线上用nginx反向代理tomcat访问，配置完成后，直接访问tomcat完全正常，但是只要在
nginx添加反向代理tomcat，访问nginx就会报错400。


**原因和解决办法：**
1）后端服务器设置有类似防盗链或者根据http请求头中的host字段来进行路由或判断功能的
话， **如果nginx代理层不重写请求头中的host字段，将会导致请求失败** ，报400错误。


解决办法：


2） **nginx配置中header头部信息的host不能被配置重了** 。tomcat没有对headers中的host进
行唯一校验。


解决办法（下面两个要去掉一个）：






**nginx后端服务器返回给nginx502、504、404、执行超时等错误状态的解决方法**


**笔记本：** nginx


**创建时间：** 2021/10/11 12:13 **更新时间：** 2021/10/11 12:18


**作者：** 彼岸樱速


今天公司的网站访问的时候全部变成404页面，查看网站的文件没有问题，来检查nginx的配置
的时候，
发现后端的一台服务器不可用，直接访问那台后台的服务器的时候，返回的是404页面，
因为upstream 里面设置了ip_hash。所以导致我怎么刷新都是404页面。
由此想到了nginx的一个功能，就是当后端的服务器返回给nginx 502、504、404、执行超时等
错误状态的时候，
nginx会自动再把这个请求转发到upstream里面别的服务器上面，从而给网站用户提供更稳定的
服务。


配置如下：



<img src="/img/nginx.pdf-31-0.png">31-0



这样的话，也算是保障了后端服务器的一个高可用性，不得不说，nginx还是很强大的。


**Nginx 细说proxy_set_header $remote_addr和X-Forwarded-For**


**笔记本：** nginx


**创建时间：** 2021/10/11 11:46 **更新时间：** 2021/10/11 12:12


**作者：** 彼岸樱速


**先来看下proxy_set_header的语法**

|语法|proxy set headerfieldvalue;<br>_ _|
|---|---|
|**默认值**|**proxy_set_header Host $proxy_host;**<br>**proxy_set_header Connection close;**|
|**上下文**|**http, server, location**|



**允许重新定义或者添加发往后端服务器的请求头。value可以包含文本、变量或者它们的组合。**
**当且仅当当前配置级别中没有定义proxy_set_header指令时，会从上面的级别继承配置。 默**
**认情况下，只有两个请求头会被重新定义：**





proxy_set_header也可以自定义参数，如：proxy_set_header test paroxy_test;


如果想要支持下划线的话，需要增加如下配置：





可以加到http或者server中


语法：underscores_in_headers on|off
默认值：off
使用字段：http, server
是否允许在header的字段中带下划线



<img src="/img/nginx.pdf-32-2.png">32-2

**使用Nginx后如何在web应用中获取用户ip及原理解释**


**问题背景：**


在实际应用中，我们可能需要获取用户的ip地址，比如做异地登陆的判断，或者统计ip访问次数等，通常
情况下我们使用 **request.getRemoteAddr()** 就可以获取到客户端ip，但是当我们使用了 **nginx作为反向**
**代理后** ，使用request.getRemoteAddr() **获取到的就一直是nginx服务器的ip的地址** ，那这时应该怎么
办？


**part1：解决方案1 X-real-ip $remote_addr;**



<img src="/img/nginx.pdf-32-3.png">32-3




其中这个 **X-real-ip** 是一个 **自定义的变量名，名字可以随意取** ，这样做完之后，用户的真实ip就
被放在X-real-ip这个变量里了，然后，在web端可以这样获取： **request.getAttribute("X-**
**real-ip")** ，这样就明白了吧。


当一个请求通过多个代理服务器时，用户的IP将会被代理服务器IP覆盖





**part2：解决方案2 X-Forwarded-For $proxy_add_x_forwarded_for**





上面说到，这句就可以在web服务器端获得用户的真实ip，但是，实际上要获得用户的真实ip，
不是只有这一个方法，下面我们继续看。


**$http_x_forwarded_for** ：



<img src="/img/nginx.pdf-33-2.png">33-2



**X-Forwarded-For $proxy_add_x_forwarded_for** ：



<img src="/img/nginx.pdf-33-3.png">33-3



$proxy_add_x_forwarded_for变量包含客户端请求头中的"X-Forwarded-For"，与
$remote_addr两部分，他们之间用逗号分开。


**举个例子，有一个web应用，在它之前通过了两个nginx转发， 即用户访问该web通过两台**
**nginx。**


在 **第一台nginx** 中,使用





现在的$proxy_add_x_forwarded_for变量的"X-Forwarded-For"部分是空的，所以 **只有**
**$remote_addr** ，而$remote_addr的值是用户的ip，于是赋值以后，X-Forwarded-For变量的
值就是 **用户的真实的ip地址** 了。（总结就是获得了客户端的IP）


到了 **第二台nginx** ，使用





现在的$proxy_add_x_forwarded_for变量，X-Forwarded-For部分包含的是用户的真实ip，
$remote_addr部分的值是上一台nginx的ip地址，于是通过这个赋值以后现在的 **X-**
**Forwarded-For的值** 就变成了 **“用户的真实ip，第一台nginx的ip“** 。（总结就是第二台获取
到了第一台IP和客户端的IP）


举个例子说明


<img src="/img/nginx.pdf-34-0.png">34-0





<img src="/img/nginx.pdf-34-1.png">34-1



<img src="/img/nginx.pdf-34-2.png">34-2



**可以看到获取客户端的IP地址**


**不仅可以通过proxy_set_header  X-real-ip $remote_addr;获取到**
**也可以通过proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;**



```