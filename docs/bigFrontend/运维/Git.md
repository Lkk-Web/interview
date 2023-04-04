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

> 也可通过 `git config -list` 查看配置

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

```bash
git commmit -m [message]
git commmit --amend --message=[message] --author=[author]   # 修改最近一次commit的message 或 author
# 修改倒数第n次commit
git rebase -i HEAD~n   #使用rebase变基
# 按i进入编辑模式，将pick改为e|edit，然后ESC退出编辑，:wq保存。
git commmit --amend --message=[message] --author=[author]
git rebase --continue
```

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

1、项目依赖安装

```javascript
npm install husky commitlint/config-conventional commitlint/cli --save
npx husky install //安装node环境，一定要装！
```

2、package.json 配置

```json
 {
    "lint": "dumi g tmp && npm run lint:js && npm run lint:prettier",
    "lint-staged:js": "eslint --fix --format=pretty",
    "lint:js": "eslint --cache --ext .js,.jsx,.ts,.tsx --format=pretty",
    "lint:prettier": "prettier --check \"src/**/*\" --end-of-line auto"
 }
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint-staged"
    }
  },
  "gitHooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS"
  },
  "lint-staged": {
    "**/*.{js,jsx,tsx,ts,less,md,json}": [
      "prettier --write"
    ]
  },
```

3、添加 commitlint.config.js 文件

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

4、添加 eslintrc.js 文件

```javascript
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-restricted-syntax': 0,
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    'consistent-return': 0,
    'no-nested-ternary': 0,
  },
};
```

#### 上传忽略 .gitignore 文件

该文件有用来屏蔽文件上传 git 的作用，一般放在根目录。用法是编辑改文件，以相对路径添加文件或文件夹。

#### .gitkeep 文件

该文件使 git 无法追踪一个空的文件夹，当用户需要追踪(track)一个空的文件夹的时候，按照惯例，大家会把一个称为.gitkeep 的文件放在这些文件夹里。

就个人而言，一般需要.gitkeep 地方，是希望完成以下功能:

- 使 git 忽略一个文件夹下的所有文件，并保留该文件夹

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

- 本地分支推到远程分支

```sh
git push origin my_branch
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
git remote set-url origin <url>  # 修改本地代码关联的远程地址
```

- 查看上游分支

可以通过 git status 、 git checkout <分支>、git branch -vv 命令查看

- 设置上游分支

方式一（适用远程分支已存在）：

用参数 -u 或 --set-upstream-to 设置上游

```bash
git branch --set-upstream-to=origin/<远程分支> <本地分支>
```

方式二（适用远程分支不存在）：

上传本地分支到远程，同是把上传后的远程分支设置为本地分支的上游分支：

```bash
git push upstream origin HEAD:<远程分支>
```

- 取消分支上游：

```bash
git branch --unset-upstream
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

git rebase 命令在另一个分支基础之上重新应用，用于把一个分支的修改合并到当前分支。

```bash
git rebase [<upstream> [<branch>]]
```

git rebase 的最大优点是它可以重写历史,可以对某一段线性提交历史进行编辑、删除、复制、粘贴；因此，合理使用 rebase 命令可以使我们的提交历史干净.

#### 2.4.1、合并多个 commit 为一个完整 commit

当你运行 git rebase -i 时，你会进入一个编辑器会话，其中列出了所有正在被变基的提交，以及可以对其执行的操作的多个选项。默认的选择是选择（Pick）。

- Pick：会在你的历史记录中保留该提交。
- Reword：允许你修改提交信息，可能是修复一个错别字或添加其它注释。
- Edit：允许你在重放分支的过程中对提交进行修改。
- Squash：可以将多个提交合并为一个。

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

但是，rebase 生成的合并冲突，虽然由最新的 commiter 提交，但是这样可以保证 git 的 log 日志查看，利于回滚，推荐使用 git rebase。

rebase 和 merge 分公司而异，以企业为准。

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

git reset 命令用于回退版本，可以指定退回某一次提交的版本，其间的 commit 会被丢弃，工作树的内容上也会一起删除。

```bash
git reset [--soft | --mixed | --hard] [HEAD]
```

--soft 参数用于回退到某个版本：

git reset --soft HEAD^ : 用于撤销的 commit

--mixed 为默认，可以不用带该参数，用于重置暂存区的文件与上一次的提交(commit)保持一致，工作区文件内容保持不变。

-hard 参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交：

### 3.1 git revert

git revert 命令用于将某次 commit 的更改取消，可以用作某次 commit 的回退，在工作树上会有一次重新提交的记录。

```bash
git revert HEAD   # 撤销前一个commit
git revert HEAD^  # 撤销前前一个commit
git revert <commit_id>  # 撤销某一次commit
```

#### git reset 和 git revert 的区别

撤销（revert）被设计为撤销公开的提交（比如已经 push）的安全方式，git reset 被设计为重设本地更改

两者主要区别如下：

- git revert 是用一次新的 commit 来回滚之前的 commit，git reset 是直接删除指定的 commit

- git revert 是用一次逆向的 commit“中和”之前的提交，因此日后合并老的 branch 时，之前提交合并的代码仍然存在，导致不能够重新合并但是 git reset 是之间把某些 commit 在某个 branch 上删除，因而和老的 branch 再次 merge 时，这些被回滚的 commit 应该还会被引入

- 才如果回退分支的代码以后还需要的情况则使用 git revert， 如果分支是提错了没用的并且不想让别人发现这些错误代码，则使用 git reset

### 3.3 git stash

stash，译为存放，在 git 中，可以理解为保存当前工作进度，会把暂存区和工作区的改动进行保存，这些修改会保存在一个栈上后续你可以在任何时候任何分支重新将某次的修改推出来，重新应用这些更改的代码

```bash
git stash   # 保存当前工作进度，会把暂存区和工作区的改动保存起来
git stash save  # 与 git stash 用处一致，但即将废除
git stash list  # 查看每次stash操作的列表
git stash pop [stashname] # 从栈恢复到工作区,默认栈顶
git stash apply [stashname] #将堆栈中的内容应用到当前目录，不同于git stash pop，该命令不会将内容从堆栈中删除
# 也就说该命令能够将堆栈的内容多次应用到工作目录中，适应于多个分支的情况
git stash show [stashname]  #查看堆栈中最新保存的stash和当前目录的差异
git stash drop [stashname]   # 从堆栈中移除某个指定的stash
git stash clear # 清除堆栈中的所有内容,不会回到工作区
```

#### 场景：开发进行到一半,但是代码还不想进行提交 ,然后需要同步去关联远端代码时，可能发生冲突

这时候就可以依次使用下述的命令：

```bash
git stash
git pull
git stash pop
```

## 四、标签管理

通常，发布一个版本时，会在版本库中打一个标签（tag），这样，就唯一确定了打标签时刻的版本。将来无论什么时候，取某个标签的版本，就是把那个打标签的时刻的历史版本取出来。所以，标签也是版本库的一个快照。

简单理解：标签是某个版本的别名，因为 Git 的版本号都是用一串字母数字组成，为了便于管理，Git 可以给版本取个别名（也就是打上标签，比如标签的名字叫做 v1.0.0）。默认标签是打在最新提交的 commit 上的

```bash
git tag <name>      # 最后一次commit打上标签name
git tag <name> [commitId]  # 某次commit打上标签name
git tag -d <tagname>   # 删除标签tagname
git push [origin] <tagname>  # 推送标签至远程
git push [origin] :refs/tags/<tagname>   # 删除远程标签
```

恭喜你 🎉 🎉 🎉 ！学到这已经出师了！

## 五、Jenkins、webhook

## 六、git message Emoji

```ts
'use strict';

module.exports = {
  types: [
    { value: '✨feat', name: '✨feat:          增加新功能' },
    { value: '🐛fix', name: '🐛fix:           修复bug' },
    { value: '📝docs', name: '📝docs:          修改文档' },
    { value: '🚀perf', name: '🚀perf:          性能优化' },
    { value: '📦build', name: '📦build:         打包' },
    { value: '👷ci', name: '👷ci:            CI部署' },
    { value: '🔂revert', name: '🔂revert:        版本回退' },
    { value: '💎style', name: '💎style:         样式修改不影响逻辑' },
    { value: '🚨test', name: '🚨test:          增删测试' },
  ],
  messages: {
    type: '请选择提交的类型；',
    subject: '请简要描述提交（必填）',
    body: '请输入详细描述（可选）',
    footer: '请选择要关闭的issue（可选）例如：#31, #34',
    confirmCommit: '确认要使用以上信息提交？（y/n）',
  },
  allowCustomScopes: false,
  skip: ['body', 'footer'],
  subjectLimit: 72,
};
```
