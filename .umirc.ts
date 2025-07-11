import { defineConfig } from 'dumi';
import { styles } from './app.style';
import dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

export default {
  // ssr: {
  //   devServerRender: true,
  //   mode: 'stream', // 流式渲染
  // },
  //  exportStatic: {}, // 预渲染
  //TODO docSearch
  hash: true,
  styles, //全局样式
  metas: [
    {
      name: 'keywords',
      content:
        'blog, dumi, 前端博客, 前端面经, 面试题, 算法, 运维, 算法, 数据结构, 前端全栈, 技术文档, 考研',
    },
    {
      name: 'description',
      content: '关注前端技术学习交流，记录与分享自己前端学习历程',
    },
  ],
  manifest: {
    basePath: '/blog/', //SPA路径
  },
  history: { type: 'hash' },
  publicPath: '/blog/', //导出路径
  // logo: 'https://oss.kyingsoft.cn/import/logo.jpg',
  ...defineConfig({
    mode: 'site', //doc | site
    title: `思必行-醒来就想躺`,
    // dynamicImport: {
    //   // loading: ''
    // }, // 启用按需加载
    // description: '----<>',
    locales: [
      ['en-US', 'English'],
      ['zh-CN', '中文'],
    ], // 不需要多语言
    // menus: {}, // 约定式 侧边导航
    favicon: 'https://oss.kyingsoft.cn/import/logo.ico',
    navs: [
      null, // null 值代表保留约定式生成的导航，只做增量配置
      {
        title: 'GitHub',
        path: 'https://github.com/Lkk-Web',
      },
    ],
    // more config: https://d.umijs.org/config
  }),
  define: {
    REACT_APP_SERVER_SOURCE_URL: process.env.REACT_APP_SERVER_SOURCE_URL,
  },
  // chunks: ['vendors', 'umi'],
  // chainWebpack: function (config, { webpack }) {
  //   config.merge({
  //     optimization: {
  //       splitChunks: {
  //         chunks: 'all',
  //         minSize: 30000,
  //         minChunks: 3,
  //         automaticNameDelimiter: '.', //默认情况下，webpack 将使用 chunk 的来源和名称生成名称（例如 vendors~main.js），定用于生成名称的分隔符
  //         cacheGroups: {
  //           vendor: {
  //             name: 'vendors',
  //             test({ resource }) {
  //               return /[\\/]node_modules[\\/]/.test(resource);
  //             },
  //             priority: 10,
  //           },
  //         },
  //       },
  //     },
  //   });
  // },  // 分包，太多文件了 不影响性能
};
