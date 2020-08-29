import React, { useRef } from 'react';
import { useElements, TestLayout } from '@e2e-utils';
import copy from 'copy-to-clipboard';
import { message } from 'antd';

/**
 *
 */
export default () => {
  const { elements, ref } = useElements();
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <TestLayout
      elements={elements}
      buttons={[
        {
          name: '复制为 Base64',
          onClick: () => {
            const img = imageRef.current;
            if (!img) {
              return;
            }
            // 1. 创建canvas DOM元素，并设置其宽高和图片一样
            let canvas: HTMLCanvasElement | null = document.createElement(
              'canvas',
            );
            canvas.width = img.width;
            canvas.height = img.height;

            // 2. 使用画布画图
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, img.width, img.height);

            // 3. 返回的是一串Base64编码的URL并指定格式
            const dataURL = canvas.toDataURL(`image/png`);
            canvas = null; // 释放

            copy(dataURL);
            message.success('已复制到剪切板');
          },
        },
      ]}
    >
      <div ref={ref} id="inline-img">
        <img
          ref={imageRef}
          alt="ICON"
          src="data:image/png;base64,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"
        />
      </div>
    </TestLayout>
  );
};
