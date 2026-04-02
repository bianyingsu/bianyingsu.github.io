# Linux
---
aliases:
  - linux
标题: linux
---
**linux查看文件夹使用情况以及查看文件大小**


**笔记本：** linux


**创建时间：** 2024/4/2 23:30 **更新时间：** 2024/4/2 23:32

## **linux查看文件夹使用情况以及查看文件大小**


查看文件夹的使用情况，包含已用和可用空间大小





<img src="/img/linux.pdf-0-1.png">0-1

然后再查看里面某一个文件夹占用大小





<img src="/img/linux.pdf-0-3.png">0-3

**1、ls**


ls 命令是 Linux 中最常用的文件和目录列表命令之一。它可以显示文件的各种属性，包括文件大


小。





上述命令会显示文件的详细信息，其中包括文件的大小。文件大小以字节为单位显示，并且在输


出中的第 5 列。4096 表示文件的大小为 4096 字节。





**2、 du**


du 命令用于计算目录或文件所占用的磁盘空间。



<img src="/img/linux.pdf-1-0.png">1-0





通过命令du -h –max-depth=1 *，可以查看当前目录下各文件、文件夹的大小，这个比较实用。


（du -h --max-depth=0：该选项用于只显示当前目录的总体大小；du -h --max-depth=1：该选


项用于显示当前目录及其直接子目录的大小。）





获取文件夹磁盘使用情况





检查单个文件的大小，-h 选项用于以人类可读的格式显示文件大小。这样，文件大小将以更易


读的单位（如 KB、MB 或 GB）显示。命令输出类似于以下内容4.0K example.txt，表示文件的


大小为 4.0K，即 4 KB。





**3、 stat 命令**


stat 命令用于显示文件或文件系统的详细信息，包括文件大小。要使用 stat 命令检查文件大


小，可以执行以下命令：


上述命令会显示文件的各种属性，其中包括文件大小，以字节为单位显示。



<img src="/img/linux.pdf-2-1.png">2-1



**4、 find 命令结合 -size 参数**


find 命令用于在文件系统中搜索文件和目录。它也可以用来检查文件的大小。结合 -size 参数，


可以指定文件大小的范围来搜索文件。以下是使用 find 命令检查文件大小的示例：





上述命令中的 <路径> 是要搜索的目录路径，<文件名> 是要搜索的文件名，<大小限制> 是指定


的文件大小限制。


例如，要在 /home/user 目录下搜索文件名为 example.txt 并且大小大于 1 MB 的文件，可以运


行以下命令：





上述命令将搜索指定路径下的文件，找到文件名为 example.txt 并且大小大于 1 MB 的文件。


**解决“/bin/bash^M: bad interpreter: No such file or directory”_./make_spi_nor.sh:**
**/bin/bash^m: bad interpreter: n**


**笔记本：** linux


**创建时间：** 2024/4/2 21:40 **更新时间：** 2024/4/2 21:42

## **解决“/bin/bash^M: bad interpreter: No such** **file or directory”**


在执行 **shell脚本** 时提示这样的错误主要是由于shell脚本文件是dos格式，即每一行结尾以/r/n来


标识，而unix格式的文件行尾则以/n来标识。


1.查看脚本文件是dos格式还是unix格式的几种办法：


（1） **cat -A filename** 从显示结果可以判断，dos格式的文件行尾为^M$，unix格式的文件行尾


为$。


（2） **od -t x1 filename** 如果看到输出内容中存在0d 0a的字符，那么文件是dos格式，如果只有


0a，则是unix格式。


（3） **vi filename** 打开文件，执行 : **set ff** ，如果文件为dos格式则显示为fileformat=dos，如果是


unxi则显示为fileformat=unix。


2.解决方法：


（1）使用linux命令 **dos2unix filename** ，直接把文件转换为unix格式。

（2）使用sed命令 **sed -i "s//r//" filename** 或者 **sed -i "s/^M//" filename** 直接替换结尾符为


unix格式。


（3） **vi filename** 打开文件，执行 : **set ff=unix** 设置文件为unix，然后执行 **:wq** ，保存成unix格

式。


**Linux基础——Shell**


**笔记本：** linux


**创建时间：** 2024/4/2 20:52 **更新时间：** 2024/4/2 20:54

## **Linux基础——Shell**











|shell脚本 case菜单&函数|Col2|
|---|---|
|**作**<br>**用**|**使用case语句改写if多分支可以使脚本结构更加清晰、层次分明。针对变量的不同取**<br>**值，执行不同的命令序列。**|
|**特**<br>**点**|**case没有优先级，输入那个就调用哪个**|
|**结**<br>**构**|**case** **变量值** **in**<br>**模式1）**<br> **命令序列1**<br>**;;**<br>**模式2）**<br> **命令序列2**<br>**;;**<br>***）**<br> **默认命令序列**<br>**esac**|
|**示**<br>**例**||
|**小**<br>**实**<br>**验**|**设置一个脚本文件，将其添加到chkconfig中，使用chkconfig命令可以看到它在服务**<br>**列表中。**|


**编写一个脚本**



<img src="/img/linux.pdf-4-0.png">4-0

<img src="/img/linux.pdf-4-1.png">4-1
<img src="/img/linux.pdf-5-0.png">5-0

|Col1|Col2|
|---|---|
|**PS**|**# chkconfig：35 81 31**<br>**此处的#并非注释，而是让chkconfig可以识别后面的内容。**<br>**35为启动模式，3模式和5模式；“-”表示所有启动级别都不默认开启。**<br>**81为此程序是第81个开启的程序**<br>**31为此程序是第31个关闭的程序**|
||[root@centos mulu]#**chmod +x /etc/init.d/qidong.sh**<br>**为文件添加执行权限，让其可以使用路径执行**|
||[root@centos mulu]#**chkconfig --add /etc/init.d/qidong.sh**<br>**将qidong.sh添加到启动服务中，就可以使用chkcofig查看服务**|
|||


**优化脚本**



<img src="/img/linux.pdf-5-1.png">5-1
<img src="/img/linux.pdf-6-0.png">6-0

**. /etc/init.d/functions为调用functions库。（下面的为软链接）**


**action** **也是输出的意思，类似于echo，但功能略有不同**


**/bin/true显示效果为OK，/bin/false显示效果为FAILED**



|Col1|Col2|
|---|---|
||**我的shell为中文的，所以显示的是失败和确定。**|
|||
|**函数**|**函数**|
|**作**<br>**用**|**将命令格式写在一起，可方便重复使用命令序列**|
|**格**<br>**式**|**[ function ]** **函数名(){**<br>**命令序列**<br>**[ return x ]**<br>**}**|


**调**


**用**


**函**


**数**



<img src="/img/linux.pdf-6-1.png">6-1

**函数名 [** **参数1 ] [** **参数2 ]**

**return：跳出整个函数体**


**continue：临时终止本次循环**



<img src="/img/linux.pdf-6-2.png">6-2
<img src="/img/linux.pdf-7-0.png">7-0

**break：直接终止整个循环（终止离他最近的循环，外部循环与他无关）**


**exit：直接终止整个脚本**



**例**


**子**



<img src="/img/linux.pdf-7-1.png">7-1

<img src="/img/linux.pdf-7-2.png">7-2

<img src="/img/linux.pdf-7-3.png">7-3
|Col1|函数名不需要加$，封装的过程为函数，每引用一次函数的名字，就会执行一遍过程。|
|---|---|
|**例**<br>**子**|**将函数先进行定义好，然后用循环包含菜单，每执行一条匹配的内容，就会走一遍流**<br>**程，直到退出。**|
|**解**<br>**析**|**clear清屏，然后调用Title函数，中的内容，用户输入的内容赋值给Choose，Choose**<br>**值为1的话，会去调用Login函数中的匹配项；Choose值为2的话，会调用Exit函数中**<br>**的选项，从而退出脚本；如果Choose值既不是1也不是2的话，会在桌面显示sb，然**<br>**后两秒后清屏再次进入循环。**|
|||
|**练习**|**练习**|


**题**


**目**



<img src="/img/linux.pdf-8-0.png">8-0



<img src="/img/linux.pdf-8-1.png">8-1
**代**


**码**



<img src="/img/linux.pdf-9-0.png">9-0

**#!/bin/bash**


**User1=root**


**Passwd1=abc123,**


**User2=xiaofa**


**Passwd2=123123**


**Lock=""**


**function Login(){**

**read -p "请输入用户名：" user**


**echo $Lock | grep -w "$user" &>/dev/null**

**[ $? -eq 0 ] && echo "账号被锁定，请登录其他账户" && sleep 2 && return**


**if [ $user != $User1 -a $user != $User2 ]; then**

**echo "用户名输入有误！"**


**sleep 2**


**return**


**fi**


**for i in 3 2 1**


**do**


**read -p "您还有$i次尝试次数，请输入$user用户的密码：" passwd**


**if [ $passwd == $Passwd1 -a $user == $User1 ]; then**

**echo "$user用户登陆成功，程序退出"**


**exit 0**


**elif [ $passwd == $Passwd2 -a $user == $User2 ]; then**

**echo "$user用户登录成功，程序退出"**


**exit 0**


**fi**


**done**


**echo "$user用户的密码已经输错3次，账户已经被锁定"**


**Lock=$Lock"$user"**


**sleep 2**


**}**


**function Title(){**


**cat <<FOF**


**************************


**1.登录**


**2.退出**


**************************


**FOF**


**read -p "请输入你的选择：" Choose**


**}**


**function Exit(){**

**echo "程序退出"**


**exit**


**}**


**while :**


**do**


**clear**


**Title**


**case $Choose in**


**1)**


**Login**


**;;**


**2)**


**Exit**


**;;**


***)**


**echo "sb"**


**sleep 2**


**;;**


**esac**


**done**



**解**


**析**



<img src="/img/linux.pdf-10-0.png">10-0
<img src="/img/linux.pdf-11-3.png">11-3



<img src="/img/linux.pdf-11-0.png">11-0

<img src="/img/linux.pdf-11-1.png">11-1

<img src="/img/linux.pdf-11-2.png">11-2
**centos 编写防火墙增加和删除端口脚本**


**笔记本：** linux


**创建时间：** 2024/4/2 20:46 **更新时间：** 2024/4/2 20:50



<img src="/img/linux.pdf-12-0.png">12-0
**利用nohup后台运行jar文件包程序**


**笔记本：** linux


**创建时间：** 2023/12/11 21:08 **更新时间：** 2023/12/11 21:09

## 利用nohup后台运行jar文件包程序


Linux 运行jar包命令如下：


方式一：


java -jar XXX.jar


特点：当前ssh窗口被锁定，可按CTRL + C打断程序运行，或直接关闭窗口，程序退出


那如何让窗口不锁定？


方式二


java -jar XXX.jar &


&代表在后台运行。


特定：当前ssh窗口不被锁定，但是当窗口关闭时，程序中止运行。


继续改进，如何让窗口关闭时，程序仍然运行？


方式三


nohup java -jar XXX.jar &


nohup 意思是不挂断运行命令,当账户退出或终端关闭时,程序仍然运行


当用 nohup 命令执行作业时，缺省情况下该作业的所有输出被重定向到nohup.out的文件中，除非另外指定


了输出文件。


方式四


nohup java -jar XXX.jar >temp.txt &


解释下 >temp.txt


command >out.file


command >out.file是将command的输出重定向到out.file文件，即输出内容不打印到屏幕上，而是输出到


out.file文件中。


可通过jobs命令查看后台运行任务


jobs


那么就会列出所有后台执行的作业，并且每个作业前面都有个编号。


如果想将某个作业调回前台控制，只需要 fg + 编号即可。


**linux下如何在.gz包中查找指定内容(大日志文件排错)**


**笔记本：** linux


**创建时间：** 2022/2/23 9:24 **更新时间：** 2022/2/23 9:47


**作者：** 彼岸樱速
## **linux下如何在.gz包中查找指定内容**





**grep小记**



<img src="/img/linux.pdf-14-1.png">14-1



**示例：gunzip -c file.gz | grep ‘需要搜索的内容’**
**1、按条件查询一行记录**
**gunzip -c synchronization2YeayTrades.log.2022-02-22.log.gz | grep 御泥坊旗舰**
**店.*trades容量**


**2、按条件查询并向上显示2行**
**gunzip -c synchronization2YeayTrades.log.2022-02-22.log.gz | grep 御泥坊旗舰**
**店.*trades容量** **-B2**


可以看到，加上-B2就会，在关键字出现位置的上面多打印两行的内容


另外，上面的grep命令中，有一个，.* 这样的字符，代表着某个关键字开头，然后以某个关键
字结尾，过滤查询这样的一行出来。


<img src="/img/linux.pdf-15-0.png">15-0
**linux安装MySQL8**


**笔记本：** linux


**创建时间：** 2022/1/13 15:53 **更新时间：** 2022/1/13 19:25


**作者：** 彼岸樱速

**1、检查系统是否装有mysql**





这里返回空值，说明没有安装
如果有，则使用命令 **rpm -e --nodeps 包名** 干掉

**2、下载mysql的repo源**





**3、安装mysql-community-release-el7-1.noarch.rpm包**





<img src="/img/linux.pdf-16-3.png">16-3

**4、安装mysql**





<img src="/img/linux.pdf-16-5.png">16-5

**5、安装后再次查看mysql**





<img src="/img/linux.pdf-16-7.png">16-7

**6、启动mysql**





**7、设置系统启动时自动启动**




**8、查看启动状态**





<img src="/img/linux.pdf-17-1.png">17-1

<img src="/img/linux.pdf-17-2.png">17-2



9，使用命令登录



<img src="/img/linux.pdf-17-3.png">17-3



如果出现


则 **vim /etc/my.cnf**
找到[mysqld]这一块代码，在后面加上 **skip-grant-tables**


<img src="/img/linux.pdf-18-0.png">18-0

保存后重启mysql





此时可以不用密码直接进入mysql，然后就可以 **mysql -uroot** 登录进入了，接着就修改密
码。



<img src="/img/linux.pdf-18-2.png">18-2



如果host是localhost的，就通过 **update user set host = '%' where user = 'root';** 来修改，如果不
改这里，使用navicat进行连接的时候就会报1130的报错



<img src="/img/linux.pdf-18-3.png">18-3
<img src="/img/linux.pdf-19-0.png">19-0

然后重启mysql





密码尽量设置得复杂一点，因为Mysql自己有个插件会检验这些密码的复杂度



<img src="/img/linux.pdf-19-2.png">19-2




**linux查看端口被哪个进程占用**


**笔记本：** linux


**创建时间：** 2021/12/21 10:56 **更新时间：** 2021/12/30 9:32


**作者：** 彼岸樱速


1、 查询被占用的端口。首先是需要输入命令，查看被占用的端口的进程， **netstat -tunpl**
**|grep 端口号**
例如，前端访问一个系统 ip+端口 如127.0.0.1:28888


2、从上面可以看出该端口是由nginx占用着
3、 根据集成id查询进程。如果想详细查看这个进程，ID具体是哪一个进程，可以通过命令的方
式进行查看进程的详细信息， **ps -ef|grep 进程ID**


4、然后接下来，这样子可看不出这个nginx到底在哪里，配置文件在哪个目录
查看进行所在目录。通过 **ll /proc/进程ID/exe** 命令，可以直接查看进程所在的目录，这样的话
就可以快速定位到进程的目录


5、然后进入到目录，发现conf目录下根本没有配置28888端口的配置，但在nginx.conf发现了
这个


6、然后进入到这个目录，发现也好多好多配置文件，要找到配置了28888端口的文件，可以通
过以下命令，在当前目录下查找包含xxx字符串的文件
**grep -rn "28888" ./**


然后就找到这段配置了



<img src="/img/linux.pdf-20-0.png">20-0

<img src="/img/linux.pdf-20-1.png">20-1
<img src="/img/linux.pdf-21-0.png">21-0
**linux安装docker**


**笔记本：** linux


**创建时间：** 2021/8/4 17:42 **更新时间：** 2021/12/22 11:55


**作者：** 彼岸樱速


卸载


1.查询安装过的包


yum list installed | grep docker


docker-engine.x86_64         17.03.0.ce-1.el7.centos     @dockerrepo


2.删除安装的软件包


**yum -y remove docker-engine.x86_64**


**离线安装模式**


**1、** **安装包官方地址** [：https://download.docker.com/linux/static/stable/x86_64/](https://download.docker.com/linux/static/stable/x86_64/)


可以先下载到本地，然后通过ftp工具上传到服务器上，或者在服务器上使用命令下载

```
 wget https://download.docker.com/linux/static/stable/x86_64/docker-18.06.3-ce.tgz

```

**2、解压**

```
 tar -zxvf docker-18.06.3-ce.tgz

```

**3、将解压出来的docker文件复制到 /usr/bin/ 目录下**

```
 cp docker/* /usr/bin/

```


<img src="/img/linux.pdf-22-1.png">22-1




**3.5 启动docker**


给docker.service文件添加执行权限

```
 chmod +x /etc/systemd/system/docker.service

```

重新加载配置文件（每次有修改docker.service文件时都要重新加载下）

```
 systemctl daemon-reload

```

启动

```
 systemctl start docker

```

设置开机启动

```
 systemctl enable docker.service

```

查看docker服务状态

```
 systemctl status docker

```

上图表示docker已安装成功

## **centos8安装docker**


安装依赖



<img src="/img/linux.pdf-23-1.png">23-1



添加yum源





centos8默认使用podman代替docker
直接安装docker会出现以下错误

```
 [root@localhost ~]# yum install docker-ce
 上次元数据过期检查： 0:00:13 前，执行于 2021 年 06 月 13 日 星期日 16 时 22 分 32 秒。
 错误：
 问题 : package docker-ce-3:20.10.7-3.el8.x86_64 requires containerd.io >= 1.4.1, but none of the
 providers can be installed
 - package containerd.io-1.4.3-3.1.el8.x86_64 conflicts with runc provided by runc-1.0.0 70.rc92.module_el8.4.0+673+eabfc99d.x86_64
 - package containerd.io-1.4.3-3.1.el8.x86_64 obsoletes runc provided by runc-1.0.0 70.rc92.module_el8.4.0+673+eabfc99d.x86_64
 - package containerd.io-1.4.3-3.2.el8.x86_64 conflicts with runc provided by runc-1.0.0 70.rc92.module_el8.4.0+673+eabfc99d.x86_64
 - package containerd.io-1.4.3-3.2.el8.x86_64 obsoletes runc provided by runc-1.0.0 70.rc92.module_el8.4.0+673+eabfc99d.x86_64
 - package containerd.io-1.4.4-3.1.el8.x86_64 conflicts with runc provided by runc-1.0.0 70.rc92.module_el8.4.0+673+eabfc99d.x86_64
 - package containerd.io-1.4.4-3.1.el8.x86_64 obsoletes runc provided by runc-1.0.0 70.rc92.module_el8.4.0+673+eabfc99d.x86_64
 - package containerd.io-1.4.6-3.1.el8.x86_64 conflicts with runc provided by runc-1.0.0 70.rc92.module_el8.4.0+673+eabfc99d.x86_64
 - package containerd.io-1.4.6-3.1.el8.x86_64 obsoletes runc provided by runc-1.0.0 70.rc92.module_el8.4.0+673+eabfc99d.x86_64

```

```
 - problem with installed package buildah-1.19.7-1.module_el8.4.0+781+acf4c33b.x86_64
 - package buildah-1.19.7-1.module_el8.4.0+781+acf4c33b.x86_64 requires runc >= 1.0.0-26, but none
 of the providers can be installed
 - cannot install the best candidate for the job
 - package runc-1.0.0-56.rc5.dev.git2abd837.module_el8.3.0+569+1bada2e4.x86_64 is filtered out by
 modular filtering
 - package runc-1.0.0-64.rc10.module_el8.4.0+522+66908d0c.x86_64 is filtered out by modular
 filtering
 - package runc-1.0.0-65.rc10.module_el8.4.0+819+4afbd1d6.x86_64 is filtered out by modular
 filtering
 - package runc-1.0.0-70.rc92.module_el8.4.0+786+4668b267.x86_64 is filtered out by modular
 filtering
 ( 尝试在命令行中添加 '--allowerasing' 来替换冲突的软件包 或 '--skip-broken' 来跳过无法安装的软件包 或 '- nobest' 来不只使用软件

```

解决办法，命令后追加 –allowerasing





或者先卸载podman





**安装docker-ce**



<img src="/img/linux.pdf-24-2.png">24-2



启动并设置开机自启动





验证安装是否成功




**linux解压命令**


**笔记本：** linux


**创建时间：** 2021/12/21 10:49 **更新时间：** 2021/12/21 10:55


**作者：** 彼岸樱速



<img src="/img/linux.pdf-25-0.png">25-0



**Linux下解压命令大全**



<img src="/img/linux.pdf-25-1.png">25-1



**———————————————**



<img src="/img/linux.pdf-25-2.png">25-2



**———————————————**



<img src="/img/linux.pdf-25-3.png">25-3



**———————————————**



<img src="/img/linux.pdf-25-4.png">25-4



**———————————————**



<img src="/img/linux.pdf-25-5.png">25-5



**———————————————**





**———————————————**





**———————————————**


**———————————————**





**———————————————**





**———————————————**



<img src="/img/linux.pdf-26-3.png">26-3



**gzip 命令**



<img src="/img/linux.pdf-26-4.png">26-4



**rpm命令使用简介**


什么是rpm？rpm是RPM package manager的缩写，最早由RedHat公司提出的软件包标准，


后来随着rpm的不断发展而又增加许多功能，逐渐的成为linux公认的软件包管理标准。支持该格


式的厂商有RedHat linux、suse linux、Mandriva linux。


rpm命令十分强大，那么rpm命令究竟有什么功能呢？


1 查询已安装在linux系统中的rpm软件包的信息
2 查询rpm软件包安装文件的信息
3 安装rpm软件包到当前linux系统
4 从linux系统中卸载已安装的rpm软件包


5 升级当前linux系统的rpm软件包



<img src="/img/linux.pdf-26-5.png">26-5


**linux安装jdk1.8**


**笔记本：** linux


**创建时间：** 2021/12/20 18:04 **更新时间：** 2021/12/21 10:45


**作者：** 彼岸樱速


1、 ：

[https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)


2、 解包：tar zxvf FileName.tar.gz


3、 **配置环境变量**


1. 使用vim /etc/profile编辑profile文件
2. 在/etc/profile底部加入如下内容


JAVA_HOME=/usr/java/jdk1.8.0_25
PATH=$JAVA_HOME/bin:$PATH
CLASSPATH=$JAVA_HOME/jre/lib/ext:$JAVA_HOME/lib/tools.jar


export PATH JAVA_HOME CLASSPATH


3. 以上，环境变量配置完成。 **需要注意的是，PATH在配置的时候，一定要把$JAVA_HOME/bin放在前面** ，

不然使用java命令时，系统会找到以前的java，再不往下找了。这样java这个可执行文件运行的目录其实不在
$JAVA_HOME/bin下，而在其它目录下，会造成很大的问题。
4. 还要注意， **以前其它教程写的CLASSPATH=$JAVA_HOME/lib.tools.jar，不知道以前的版本是怎么样**

**的，现在的版本是没有这样的jar包的** 。
5. 最后使用source /etc/profile让profile文件立即生效
6. 最后 java -version查看是否安装成功



<img src="/img/linux.pdf-28-0.png">28-0

<img src="/img/linux.pdf-28-1.png">28-1
