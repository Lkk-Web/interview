// 本地开发：在根目录 .env 设置 REACT_APP_API_BASE=http://localhost:8888/api
// 生产部署：设置 REACT_APP_API_BASE=https://interview.kying.org/api
export const API_BASE: string =
  typeof REACT_APP_API_BASE !== 'undefined' && REACT_APP_API_BASE
    ? REACT_APP_API_BASE
    : 'http://localhost:8888/api';

// 开发模式下与后端 .env ADMIN_TOKEN 保持一致
export const ADMIN_TOKEN = 'local-dev-token';
