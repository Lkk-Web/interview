// import { Image } from 'antd';
import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import './index.less'


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

export default ({ title, description, path }: ImageView) => {
  return (
    <PhotoProvider>
      <PhotoView src={path}>
        <img src={path} alt="#资源未加载" className='imageSize' />
      </PhotoView>
      <div className='imageMarkdownTitle'>{title}</div>
      <div className='imageMarkdownDes'>{description}</div>
    </PhotoProvider>
  );
};
