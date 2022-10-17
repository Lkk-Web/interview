---
order: 2
---

# Git

这里想单独开一栏 Git 文章，是因为 git 经常用到，也是伴随我们程序生涯的必经之路。

```git
*git 三大指令

git add .
git commit -m 'guide: message'
git push
```

## 一、代码/仓库管理

### 1、环境配置

下载 git：[Git 官网下载](git-scm.com/)

查看版本，测试是否安装成功 : git -v

cd ～/.ssh 如果提示 cd: no such file or directory: ～/.ssh 就说明是没有配置过，是正常的，继续操作即可

git config --global user.name "你的账号名"

git config --global user.email "你的 git 邮箱"

ssh-keygen -t rsa -C "你的 git 邮箱" 生成免登陆密钥

open ~/.ssh 将 id_rsa.pub 文件内部的文本添加到 git 代码托管平台进行 ssh key 添加

### 2、代码管理

[]为说明，实际不需要。

拉取仓库：git clone [gitUrl]

拉取代码：git pull <远程主机名> <远程分支名>:<本地分支名>

    git pull 命令用于从远程获取代码并合并本地的版本。
    相当于 git fetch 和 git merge FETCH_HEAD 的简写

暂存代码：git add [filePath]

提交代码：git commmit -m [message]

上传代码：git push <远程主机名> <本地分支名>:<远程分支名>

#### commit Message 规范

目前团队规范使用较多的是 [Angular 团队的规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines),如下：

```xml
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- feat: 新特性
- fix: 修改问题
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理.

  -----------------分割线-----------------

- type: commit 的类型
- scope: commit 影响的范围, 比如: route, component, utils, build...
- subject: commit 的概述, 建议符合 50/72 formatting
- body: commit 具体修改内容, 可以分为多行, 建议符合 50/72 formatting
- footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

#### 项目配置 commitlint

#### 上传忽略 .gitignore 文件

该文件有用来屏蔽文件上传 git 的作用，一般放在根目录。用法是编辑改文件，以相对路径添加文件或文件夹。

## 二、分支管理

checkout gitremote git merge git rebase

## 三、版本管理

git reset [--soft | --mixed | --hard] [HEAD]

--soft 参数用于回退到某个版本：

--mixed 为默认，可以不用带该参数，用于重置暂存区的文件与上一次的提交(commit)保持一致，工作区文件内容保持不变。

-hard 参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交：

## 四、标签管理

恭喜你 🎉 🎉 🎉 ！学到这已经出师了！

## 五、Jenkens、webhook
