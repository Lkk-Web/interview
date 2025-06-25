---
order: 6
---

# others

## 一、外区 appleId 注册

注册日本 Apple ID（也就是日本区 Apple 账号）可以让你访问日本 App Store、下载日本限定 App（如部分游戏、工具等）。下面是最简单、稳定的注册流程，无需日本手机号也能成功，可在手机或电脑操作。

1. 🔗 进入注册页面： https://appleid.apple.com/account

| 项目      | 填写说明                   |
| --------- | -------------------------- |
| 国家/地区 | `选择「日本」`             |
| 姓名      | 随意填写（英文或日文都行） |
| 生日      | 随意填写满 18 岁的日期     |
| 邮箱      | 用你已有的邮箱（如 Gmail） |
| 电话      | 使用国内手机号即可         |

填完后邮箱会收到验证码，输入后完成注册。

2. 登陆 App Store，激活 Apple ID

   - 打开 App Store
   - 点击右上角头像 → 滑到最底部，退出当前 Apple ID
   - 回到 App Store，随便找一个免费 App → 点“获取”
   - 弹出登录框时 → 选择「使用已有 Apple ID」登录
   - 弹出提示：「此 Apple ID 尚未在 iTunes Store 使用过」→ 点「查看」
   - 跳转到账户设置页面，这时就会有付款方式选项， 选择付款方式时：请选择「None」

3. 添加付款方式信息

| 字段（中文 / 英文）     | 填写内容               |
| ----------------------- | ---------------------- |
| 姓 / Last Name          | Tanaka                 |
| 名 / First Name         | Haruto                 |
| 邮政编码 / Postal Code  | 100-0001               |
| 都道府县 / Prefecture   | 東京都（Tokyo）        |
| 市区町村 / City         | 千代田区（Chiyoda-ku） |
| 街道地址 / Street       | 1-1-1 Chiyoda          |
| 建筑名与房号 / Building | （可留空）             |
| 电话号码 / Phone Number | 03-1234-5678           |
| 付款方式 / Payment      | なし（None）           |

## 二、1Panel 面板

安装：

```sh
curl -sSL https://resource.1panel.pro/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh
```

tips：

1. 最好换端口
2. (1Panel)[https://github.com/1Panel-dev/1Panel]
3. 服务器终端输入 `sudo 1pctl user-info`查看登陆网址
