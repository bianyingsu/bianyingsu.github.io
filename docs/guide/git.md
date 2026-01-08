# Git
---
aliases:
  - git
标题: git
---
## **Git如何设置/清除代理**


**笔记本：** git

**创建时间：** 2024/3/10 21:38 **更新时间：** 2024/3/10 21:39


**设置ss**


git config --global http.proxy ‘socks5://127.0.0.1:1080’


git config --global https.proxy ‘socks5://127.0.0.1:1080’


**设置代理**


git config --global http.proxy http://127.0.0.1:1080


git config --global https.proxy https://127.0.0.1:1080


**取消代理**


git config --global --unset http.proxy

git config --global --unset https.proxy




**清除git项目的git信息**


**笔记本：** git


**创建时间：** 2024/3/1 17:43 **更新时间：** 2024/3/1 17:47


**URL：** https://blog.csdn.net/zh1442113005/article/details/127011504

## **清除git项目的git信息** 

#### **1.查看当前 git提交 拉取路径**

```
   git remote -v
```

2.删除当前的路径

```
   git remote rm origin
```

3.打开.idea文件夹下的 [vcs](https://so.csdn.net/so/search?q=vcs&spm=1001.2101.3001.7020) .xml文件，将当前vcs设置的值改为NONE

```
   vcs ="NONE" />
```

4.重启 idea 就可以了



## **git误操作提交或推送代码到远程的回滚方法**


**笔记本：** git

**创建时间：** 2021/12/31 18:58 **更新时间：** 2022/1/4 14:46


**作者：** 彼岸樱速

有些时候，会在git操作失误，这时候需要一些办法来恢复到我们想要的版本
大致有两种办法~

**一、暴力推送（不推荐）**

```
1、git reset --hard
2、git cherry-pick
3、git push origin HEAD --force
```

- 第一小步：使用git reset --hard 或soft，强制或软恢复代码到某个版本下，就是把新的内
  容都重置到未提交的状态。
- 第二小步：你回滚的内容，可能是由于，别人发版本，跟自己的版本隔了几个版本，有部
  分代码是需要回滚的，但是别人或者自己的代码不能回滚，就使用git cherry -pick来把需
  要恢复代码给pick(挑拣)出来，放到待提交列表里面去。
- 第三小步：强制推送当前已经挑拣清晰，也就是清晰完毕的版本，强制推送到远端分支
  去。但这里需要注意的是，此操作其实是很危险的，覆盖代码的操作还是少用啦~

***上面第三步如果强制推送失败，gitlab的话一般是因为开启了分支保护机制。可以在仓库的
设置页面，找到protect对应的标签下面，把保护分支暂时去除，过后再重新开启

<img src="/img/git.pdf-2-1.png">

网上的说法~

<img src="/img/git.pdf-2-2.png">


所以，下面是第二种

**二、使用git revert（推荐）**

以下是 git renert 的三种用法

```
git revert HEAD ：撤销前一次 commit 
git revert HEAD^ ：撤销前前一次 commit 
git revert (commit id)： 撤销指定的版本，撤销也会作为一次提交进行保存。 
```

**下面是测试demo**

1、git checkout -b newmaster

<img src="/img/git.pdf-3-0.png">

2、git push origin newmaster:newmaster

<img src="/img/git.pdf-3-1.png">

3、修改当前分支，某个配置文件然后提交，推送，如

<img src="/img/git.pdf-3-2.png">

4、再修改一个版本，提交推送

<img src="/img/git.pdf-3-3.png">

5、切回到master分支，并把newmaster的内容合并过来，并且推送。

<img src="/img/git.pdf-4-0.png">

6、使用revert命令，回滚提交
1. 连续

git revert -n commit_id_start..commit_id_end
使用该命令可以将提交撤回到commit_id_start的位置
2. 不连续

git revert -n commit_id_1
git revert -n commit_id_3
Revert之后，再推送，就可以回滚某次commit_id对应的所有提交内容。

7、或者直接在sourceTree上操作

<img src="/img/git.pdf-4-1.png">

从上面可以看出，使用revert会把某个提交下的内容全部放弃，并放到待提交列表里面，此时再
次推送，就可以恢复某个或者某些版本的代码了~

## **IDEA上传代码到gitee**

**笔记本：** git

**创建时间：** 2021/9/24 16:35 **更新时间：** 2021/9/24 16:41

**作者：** 彼岸樱速

步骤1：创建远程项目

<img src="/img/git.pdf-5-0.png">

步骤2：复制远程项目地址 注意：此处码云官方已经给出上传项目方法，不过用的是命令行的形式，我们选择一种更加简单的方法。

<img src="/img/git.pdf-5-1.png">

步骤3：创建好本地项目，点击VCS,按照图中指示给项目创建Git仓库。

<img src="/img/git.pdf-6-0.png">

步骤4：选择此项目的根目录作为仓库。

<img src="/img/git.pdf-6-1.png">


步骤5：选中项目名先将项目add到缓冲区，再commit到本地仓库。

<img src="/img/git.pdf-7-0.png">

这里放一张git的add和commit图解帮助大家理解为什么一个新的项目要先add再commit：

<img src="/img/git.pdf-7-1.png">


步骤6：点击Commit Directory后在弹出框中填写Commit Message(提交信息），然后选择Commit and Push。

<img src="/img/git.pdf-8-0.png">

步骤7：在弹出的Push Commits对话框中点击“Define remote",填入步骤2中复制的远程项目地址。

<img src="/img/git.pdf-8-1.png">


步骤8：点击push。

<img src="/img/git.pdf-9-0.png">

步骤9：查看Version Control--》log

<img src="/img/git.pdf-9-1.png">


步骤10：上传成功！

<img src="/img/git.pdf-10-0.png">

下次更新代码直接：


在Terminal中输入命令

```
git add .
git commit -m "备注"
git pull
git push
```


