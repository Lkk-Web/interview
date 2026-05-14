# 📘 Personal Tech Blog / Knowledge Base

Hi~ 👋 我是醒来就想躺，这是我的开源博客，欢迎提 PR😉

👋 关于我 | About Me

- 👨‍💻 职业：React / Node.js / Golang / Mysql / MongoDB / ...
- 🌱 关注方向：
  - Web 全栈架构
  - 工程化 & 性能优化
  - 后端 / 数据库 / 分布式
  - AI 在业务中的落地

✍️ 写作目的 | Writing Purpose

- 把学习过程变成长期资产
- 多输入多输出
- 记录职业生涯

📮 联系我 | Contact

- GitHub: https://github.com/Lkk-Web
- Blog: https://stb.kying.org/blog/index.html
- Email: workhardcl@icloud.com

如果这些内容对你有帮助，欢迎 Star 🌟正在持续维护...

## iOS App 维护

免费 Apple ID 签名通常 7 天过期。过期后 App 打不开时，重新连接 iPhone 并在 Xcode 里 `Cmd + R` 安装即可续签 7 天：

```bash
cd /Users/max/Desktop/github/interview
source ~/.nvm/nvm.sh && nvm use 22
npx cap open ios
```

如果只是续签、不改内容，不需要重新构建 Web 产物。

如果改了博客内容，需要先重新构建并同步：

```bash
cd /Users/max/Desktop/github/interview

source ~/.nvm/nvm.sh && nvm use 16.19.1
MOBILE=1 npm run docs:build

source ~/.nvm/nvm.sh && nvm use 22.22.2
npx cap sync ios
npx cap open ios
```

然后在 Xcode 里选择 iPhone，按 `Cmd + R` 安装。

🚀 最近更新 | Recent Updates

- ✅ tag v1.0.1 2026-05-14 增加ios app 浏览

- ✅ tag v1.0.0 2026-02-04 - 2026-02-07《MongoDB Schema设计、聚合管道（Aggregation Pipeline）、事务与一致性、索引》
