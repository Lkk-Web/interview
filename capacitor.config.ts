import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kying.interview',
  appName: 'Interview',
  webDir: 'dist',
  plugins: {
    // 用原生 iOS 网络栈替代 WKWebView 的 fetch，绕过跨域限制
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
