# interview

Hi~ 👋 我是醒来就想躺，这是我的开源博客，欢迎提 PR😉

```bash
node:internal/crypto/hash:69
  this[kHandle] = new _Hash(algorithm, xofLen);

Error: error:0308010C:digital envelope routines::unsupported
```

是 Node.js 在使用加密模块（如 crypto）时发生的错误，通常出现在 Node.js v17+ 之后运行基于 Webpack 的项目，尤其是使用了 md5、sha256 等哈希算法的场景。

解决方法：

使用 nvm 切换到 Node.js v16 版本即可。

- nvm install 16
- nvm use 16

正在持续维护...

                                tag1:2022.10.17
                                tag2:2025.06.24
