const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 配置
const REGION = 'auto';
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const BUCKET = process.env.R2_BUCKET;
const ACCESS_KEY = process.env.R2_ACCESS_KEY;
const SECRET_KEY = process.env.R2_SECRET_KEY;
const LOCAL_DIR = path.resolve(__dirname, 'dist');
const R2_PREFIX = 'blog/';

const s3 = new S3Client({
  region: REGION,
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// 删除远程 R2 上指定目录下的所有文件
async function clearRemotePrefix(prefix) {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    });

    const listedObjects = await s3.send(listCommand);
    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log(`ℹ️ 无需删除，R2 中未找到路径: ${prefix}`);
      return;
    }

    const deleteParams = {
      Bucket: BUCKET,
      Delete: {
        Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
        Quiet: false,
      },
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3.send(deleteCommand);
    console.log(`🗑️ 已清空远程目录: ${prefix}`);
  } catch (err) {
    console.error('❌ 删除远程目录失败:', err);
  }
}

// 遍历本地 dist/
function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.ico': 'image/x-icon',
  };
  return types[ext] || 'application/octet-stream';
}

async function uploadFiles() {
  const files = walkDir(LOCAL_DIR);

  for (const file of files) {
    const relativePath = path.relative(LOCAL_DIR, file).replace(/\\/g, '/');
    const r2Key = R2_PREFIX + relativePath;
    const fileContent = fs.readFileSync(file);

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: r2Key,
      Body: fileContent,
      ContentType: getContentType(file),
      ACL: 'private',
    });

    try {
      await s3.send(command);
      console.log(`✅ 上传成功: ${r2Key}`);
      // console.log(`🌐 访问链接: https://stb.kying.org/${r2Key}`);
    } catch (err) {
      console.error(`❌ 上传失败: ${r2Key}`);
      console.error(err);
    }
  }
}

// 执行主逻辑
(async () => {
  await clearRemotePrefix(R2_PREFIX);
  await uploadFiles();
  console.log('🚀 所有文件上传完成！');
  console.log(`🌐 访问链接: https://stb.kying.org/blog/index.html`);
})();
