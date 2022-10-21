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

## 一、仓库/代码管理

### 1、环境配置

下载 git：[Git 官网下载](git-scm.com/)

查看版本，测试是否安装成功 : git -v

cd ～/.ssh 如果提示 cd: no such file or directory: ～/.ssh 就说明是没有配置过，是正常的，继续操作即可

git config --global user.name "你的账号名"

git config --global user.email "你的 git 邮箱"

ssh-keygen -t rsa -C "你的 git 邮箱" 生成免登陆密钥

open ~/.ssh 将 id_rsa.pub 文件内部的文本添加到 git 代码托管平台进行 ssh key 添加

### 2、仓库管理

#### Fork

fork 只能对代码仓进行操作，且 fork 不属于 git 的命令，通常用于代码仓托管平台的一种“操作”.

Fork 出的仓库包含了原来的仓库（即 upstream repository，上游仓库）所有内容，如分支、Tag、提交如果想将你的修改合并到原项目中时，可以通过的 Pull Request 把你的提交贡献回原仓库。

### 3、代码管理 & git 常用命令

**初始化仓库**：

    git init

**拉取仓库**：

    git clone [gitUrl]

**拉取代码(fetch)**：

    git fetch <远程主机名> <远程分支名>:<本地分支名>

使用 git fetch 更新代码，本地的库中 master 的 commitID 不变,但是与 git 上面关联的那个 orign/master 的 commit ID 发生改变

这时候我们本地相当于存储了两个代码的版本号，我们还要通过 merge 去合并这两个不同的代码版本

也就是 fetch 的时候本地的 master 没有变化，但是与远程仓关联的那个版本号被更新了，接下来就是在本地 merge 合并这两个版本号的代码

**拉取代码(pull)**：

    git pull <远程主机名> <远程分支名>:<本地分支名>

git pull 命令用于从远程获取代码并合并本地(某分支,默认为本分支)。相当于 git fetch + git merge FETCH_HEAD

**暂存代码**：

    git add [filePath]
    git add . # 添加所有工作区的文件到暂存区

**review 代码**：

    git diff # 查看当前代码 add后，会 add 哪些内容
    git diff --staged # 查看现在 commit 提交后，会提交哪些内容

**提交代码**：

    git commmit -m [message]

**查看状态**：

    git status  # 查看当前分支状态

**上传代码**：

    git push <远程主机名> <本地分支名>:<远程分支名>

#### commit Message 规范

目前团队规范使用较多的是 [Angular 团队的规范](https:# github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines),如下：

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

### 2.1 git branch

```bash
git branch # 查看本地所有分支
git branch -r # 查看远程所有分支
git branch -a # 查看本地和远程所有分支
git branch <新分支名> # 基于当前分支，新建一个分支
git branch -D <分支名> # 删除本地某个分支
git branch <新分支名称> <提交ID> # 从提交历史恢复某个删掉的某个分支
git branch -m <原分支名> <新分支名> # 分支更名
```

### 2.2 git checkout

- 分支操作

```bash
git checkout <分支名> # 切换到本地某个分支
git checkout <远程库名>/<分支名> # 切换到仓库某个分支
git checkout -b <新分支名> # 把基于当前分支新建分支，并切换为这个分支
git checkout --orphan <新分支名> # 新建一个空分支（会保留之前分支的所有文件）
```

- 本地撤销操作

```bash
git checkout [file] # 放弃工作区的某个文件修改
git checkout . # 放弃工作区的所有修改
git checkout [commit] [file] # 恢复某个commit的指定文件到暂存区和工作区
```

### 2.3 git remote

```bash
git remote -v # 显示所有远程仓库
git remote show [remote] # 显示某个远程仓库的信息
git remote add [shortname] [url]  # 添加远程版本库到本地，shortname 为本地的版本库名称---可以理解为建立联系
git remote rm name  # 删除远程仓库
git remote rename old_name new_name  #修改仓库名
```

#### 场景：拉取远程仓库到本地分支

```bash
git remote add newName git@origin		# 建立远程仓库联系
git checkout -b newBranch newName/branch          # 拉取联系并创建新分支
```

### 2.4 git merge

```bash
git merge Dev #  Dev表示某分支，表示在当前分支合并Dev分支

git merge -m  “Merge from Dev”  Dev # -m可以加上merge时要添加的描述性语句，如果出现冲突，那么先解决冲突，再将文件git add，git commit，之后再merge
```

当合并分支出现冲突时，取消合并，一切回到合并前的状态

    git merge --abort

### 2.5 git rebase

git rebase 可以对某一段线性提交历史进行编辑、删除、复制、粘贴；因此，合理使用 rebase 命令可以使我们的提交历史干净.

#### 2.4.1、合并多个 commit 为一个完整 commit

把功能相同的 commit，合成一个 commit，review 的时候就整洁许多。

```bash
git rebase -i  [startpoint]  [endpoint]
```

#### 2.4.2、将某一段 commit 粘贴到另一个分支上

当我们项目中存在多个分支，有时候我们需要将某一个分支中的一段提交同时应用到其他分支中

```bash
git rebase   [startpoint]   [endpoint]  --onto  [branchName]
```

#### 2.4.3 合并分支

当 master 上有一个新提交 M，feature 上有两个新提交 C 和 D，此时切换到 feature 分支上，执行如下命令，相当于是想要把 master 分支合并到 feature 分支（这一步的场景就可以类比为我们在自己的分支 feature 上开发了一段时间了，准备从主干 master 上拉一下最新改动）

```bash
git checkout feature
git rebase master

# 这两条命令等价于git rebase master feature
```

##### git rebase 和 git merge 的区别

merge 是合并的意思，rebase 是复位基底的意思。

merge 操作会生成一个新的节点，之前提交分开显示。 而 rebase 操作不会生成新的节点，是将两个分支融合成一个线性的操作。

往公共分支上合代码的时候，使用 merge。如果使用 rebase，那么其他开发人员想看主分支的历史，就不是原来的历史了，历史已经被你篡改了。举个例子解释下，比如张三和李四从共同的节点拉出来开发，张三先开发完提交了两次然后 merge 上去了，李四后来开发完如果 rebase 上去，则李四的新提交变成了张三的新提交的新基底，本来李四的提交是最新的，结果最新的提交显示反而是张三的，就乱套了。

```bash
git rebase dev # 在当前分支合并Dev分支
```

与 merge 的形式一样，如果 git rebase 遇到冲突，第一步当然是解决冲突，然后 git add，之后并不需要 git commit,而是直接运行

```bash
git rebase --continue
```

这样 git 就会继续应用剩下的补丁了.

假如你不想解决冲突且不再进行合并，那么可以使用:

```bash
git rebase --abort
```

## 三、版本管理

### 3.1 git reset

git reset 命令用于回退版本，可以指定退回某一次提交的版本。

```bash
git reset [--soft | --mixed | --hard] [HEAD]
```

--soft 参数用于回退到某个版本：

--mixed 为默认，可以不用带该参数，用于重置暂存区的文件与上一次的提交(commit)保持一致，工作区文件内容保持不变。

-hard 参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交：

## 四、标签管理

恭喜你 🎉 🎉 🎉 ！学到这已经出师了！

## 五、Jenkens、webhook
