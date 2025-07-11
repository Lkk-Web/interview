// import { Image } from 'antd';
import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import './index.less';

interface ImageView {
  /**
   * 图片标题
   */
  title?: string;
  /**
   * 图片描述
   */
  description?: string;
  /**
   * 图片路径
   */
  path: string;
}

const SERVER_URL = REACT_APP_SERVER_SOURCE_URL;

export default ({ title, description, path }: ImageView) => {
  path = path.startsWith('http') ? path : `${SERVER_URL}${path}.png`;
  return (
    <PhotoProvider>
      <div className="imageMarkdownTitle">{title}</div>
      <PhotoView src={path}>
        <img src={path} alt="#资源未加载" className="imageSize" />
      </PhotoView>
      <div className="imageMarkdownDes">{description}</div>
    </PhotoProvider>
  );
};
