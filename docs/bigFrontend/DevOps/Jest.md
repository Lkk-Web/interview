---
order: 4
---

# jest 框架

Jest 是 Facebook 出品的一个测试框架，相对其他测试框架，其一大特点就是就是内置了常用的测试工具，比如自带断言、测试覆盖率工具，实现了开箱即用。Jest 的设计初衷就是希望能够零配置实现测试，但有时候你需要更强大的配置能力。


## Charles(v4.6.8)

### 安装

(官方地址)[https://www.charlesproxy.com/download/]

#### 抓包 macOS

1. 下载证书

Help -> SSL Proxying -> Install Charles Root Certificate

2. 在钥匙串中信任

钥匙串访问 -> search 「charles」 -> 信任 「始终信任」

3. Proxy -> 勾选 macOS Proxy 开始抓包

#### 抓包ios

- 手机信任证书（ios）

1. 将iOS与电脑置于同一局域网下(注意手机不要开vpn)，同时设置wifi代理，WLAN -> 局域网icon -> HTTP Proxy / Configure Proxy -> Manual & Server: 局域网ip & Port: 8888 -> save

2. 浏览器同源访问 http://chls.pro/ssl，下载证书文件

3. 打开setting -> general -> vpn & Device Management -> 证书名，下载。下载后信任证书 setting -> general -> about -> certificate Trust Settings -> Turst 

#### 其他问题

- 如何长期使用 (工具地址 v4.x.x)[https://www.cnblogs.com/hahaniuer/p/17915980.html]

- 解决乱码问题

菜单 -> Proxy -> SSL Proxying Settings... -> 勾选 Enable SSL Proxying & Include Add -> Host: * & Prot: * -> 重启 

之后乱码问题解决

