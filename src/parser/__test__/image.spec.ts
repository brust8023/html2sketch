import parserToImage from '../image';
import { JSDOM } from 'jsdom';

describe('image', () => {
  const dom = new JSDOM(
    `    <div id="div"></div><img id='img' alt="Ant Design" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />`,
  );

  const document = dom.window.document;

  it('传入空值 则返回未定义对象', function () {
    const img = document.getElementById('im') as HTMLImageElement;
    const imageLayer = parserToImage(img);
    expect(imageLayer).toBeUndefined();
  });
  it('传入不正确的节点 则返回未定义对象', function () {
    const img = document.getElementById('div') as HTMLImageElement;
    const imageLayer = parserToImage(img);
    expect(imageLayer).toBeUndefined();
  });

  it('可正常解析', function () {
    const img = document.getElementById('img') as HTMLImageElement;
    const imageLayer = parserToImage(img);
    expect(imageLayer?.url).toBe(
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    );
  });
});